import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type * as Leaflet from 'leaflet';
import { environment } from '../../../../environments/environment';
import { ConsentService } from '../../../core/consent/consent.service';
import { I18n } from '../../../core/i18n/i18n.service';
import { CityCluster } from '../../../core/models/glamro.models';
import { escapeHtml } from '../../../core/utils/text';
import { loadStylesheet } from '../../../core/utils/script-loader';
import { Icon } from '../icon/icon';

type LeafletNs = typeof Leaflet;

/**
 * Carte interactive de l'Italie (Leaflet, chargé à la demande).
 *  - Clusters par ville au centre approximatif : jamais de position de professionnel.
 *  - Le fond de carte (Stadia Maps « Alidade Smooth Dark ») est un service tiers : chargé seulement avec le
 *    consentement « contenuti di terze parti » ou après un clic explicite.
 *  - Ce composant n'est rendu que dans le navigateur (@defer dans CoverageMap).
 */
@Component({
  selector: 'app-italy-map',
  imports: [Icon],
  template: `
    @let t = i18n.d().map;
    <div #canvas class="im__canvas" [attr.aria-label]="t.mapLabel"></div>

    @if (!canShow()) {
      <div class="im__overlay">
        <p>{{ t.consentText }}</p>
        <button type="button" class="btn btn--primary" (click)="activate()">{{ t.show }}</button>
        <button type="button" class="btn btn--outline" (click)="consent.openPreferences()">{{ t.manage }}</button>
        <p class="small muted">{{ t.listHint }}</p>
      </div>
    } @else if (status() === 'loading') {
      <div class="im__overlay" role="status"><span class="spinner"></span><span class="visually-hidden">{{ t.loadingMap }}</span></div>
    } @else if (status() === 'error') {
      <div class="im__overlay" role="alert">
        <app-icon name="alert" />
        <p>{{ t.mapError }}</p>
      </div>
    }
  `,
  styles: `
    :host { position: relative; display: block; height: 100%; min-height: 360px; border-radius: var(--radius-m); overflow: hidden; background: #121212; }
    .im__canvas { position: absolute; inset: 0; }
    .im__overlay {
      position: absolute; inset: 0; z-index: 500; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: .75rem; padding: 1.5rem; text-align: center; background: rgba(18,18,18,.92);
    }
    .im__overlay p { margin: 0; max-width: 36ch; }
    .im__overlay app-icon { width: 2rem; height: 2rem; color: var(--c-accent); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItalyMap {
  readonly clusters = input.required<CityCluster[]>();
  readonly selected = input<string | null>(null);
  readonly citySelected = output<string>();

  protected readonly consent = inject(ConsentService);
  protected readonly i18n = inject(I18n);
  private readonly doc = inject(DOCUMENT);
  private readonly canvas = viewChild.required<ElementRef<HTMLDivElement>>('canvas');

  private readonly activated = signal(false);
  private readonly browserReady = signal(false);
  protected readonly canShow = computed(() => this.activated() || this.consent.isGranted('functional'));
  protected readonly status = signal<'idle' | 'loading' | 'ready' | 'error'>('idle');

  private L: LeafletNs | null = null;
  private map: Leaflet.Map | null = null;
  private layer: Leaflet.LayerGroup | null = null;
  private fitted = false;
  private reduceMotion = false;

  constructor() {
    afterNextRender(() => {
      this.reduceMotion = this.doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
      this.browserReady.set(true);
    });

    effect(() => {
      if (this.browserReady() && this.canShow() && this.status() === 'idle') {
        void this.init();
      }
    });

    effect(() => {
      const clusters = this.clusters();
      const selected = this.selected();
      if (this.status() === 'ready') {
        this.renderMarkers(clusters, selected);
      }
    });

    inject(DestroyRef).onDestroy(() => this.map?.remove());
  }

  /** Affichage pour cette visite uniquement, sans modifier les préférences. */
  protected activate(): void {
    this.activated.set(true);
  }

  private async init(): Promise<void> {
    this.status.set('loading');
    try {
      loadStylesheet(this.doc, '/vendor/leaflet/leaflet.css');
      const mod = await import('leaflet');
      const L = ((mod as unknown as { default?: LeafletNs }).default ?? mod) as LeafletNs;
      this.L = L;

      const map = L.map(this.canvas().nativeElement, {
        center: [42.2, 12.6],
        zoom: 6,
        minZoom: 5,
        maxZoom: 11, // données agrégées : pas de zoom au niveau de la rue
        zoomSnap: 0.5,
        scrollWheelZoom: false,
        maxBounds: L.latLngBounds([34.5, 5], [48.5, 20]),
      });
      // Stadia Maps — Alidade Smooth Dark. Sans clé : authentification par domaine (à déclarer
      // dans le tableau de bord Stadia) ; localhost fonctionne sans configuration.
      const key = environment.stadiaMaps.apiKey;
      L.tileLayer(
        `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png${key ? `?api_key=${encodeURIComponent(key)}` : ''}`,
        {
          minZoom: 0,
          maxZoom: 20,
          attribution:
            '&copy; <a href="https://www.stadiamaps.com/" target="_blank" rel="noopener">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        },
      ).addTo(map);

      this.layer = L.layerGroup().addTo(map);
      this.map = map;
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  private renderMarkers(clusters: CityCluster[], selected: string | null): void {
    const L = this.L;
    const map = this.map;
    const layer = this.layer;
    if (!L || !map || !layer) {
      return;
    }
    layer.clearLayers();

    for (const c of clusters) {
      const label = this.i18n.format(this.i18n.d().map.markerLabel, { city: c.cityName, count: c.availableCount });
      const marker = L.marker([c.latitudeApprox, c.longitudeApprox], {
        icon: L.divIcon({
          className: `glamro-cluster${c.citySlug === selected ? ' is-selected' : ''}`,
          html: `<span class="glamro-cluster__count">${c.availableCount}</span><span class="glamro-cluster__label">${escapeHtml(c.cityName)}</span>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        }),
        keyboard: true,
        title: label,
        alt: label,
        riseOnHover: true,
      });
      marker.on('click', () => this.citySelected.emit(c.citySlug));
      marker.addTo(layer);
    }

    const target = clusters.find((c) => c.citySlug === selected);
    if (target) {
      map.setView([target.latitudeApprox, target.longitudeApprox], Math.max(map.getZoom(), 8), {
        animate: !this.reduceMotion,
      });
    } else if (!this.fitted && clusters.length) {
      const points = clusters.map((c) => [c.latitudeApprox, c.longitudeApprox] as [number, number]);
      map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 7 });
      this.fitted = true;
    }
  }
}
