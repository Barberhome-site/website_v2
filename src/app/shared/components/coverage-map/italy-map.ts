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
import type * as MapLibre from 'maplibre-gl';
import { environment } from '../../../../environments/environment';
import { ConsentService } from '../../../core/consent/consent.service';
import { I18n } from '../../../core/i18n/i18n.service';
import { CityCluster } from '../../../core/models/glamro.models';
import { escapeHtml } from '../../../core/utils/text';
import { loadStylesheet } from '../../../core/utils/script-loader';
import { Icon } from '../icon/icon';

type MapLibreNs = typeof MapLibre;

/** Fichiers MapLibre copiés tels quels par angular.json (assets → /vendor/maplibre). */
const VENDOR = '/vendor/maplibre';

/**
 * Carte interactive de l'Italie (MapLibre GL, chargé à la demande).
 *  - Clusters par ville au centre approximatif : jamais de position de professionnel.
 *  - Fond de carte : style vectoriel « Dark » d'OpenFreeMap (déjà sombre, aucun filtre CSS).
 *  - Service tiers : chargé seulement avec le consentement « contenuti di terze parti » ou après un clic.
 *  - Ce composant n'est rendu que dans le navigateur (@defer dans CoverageMap).
 *  - Niveaux de zoom MapLibre (tuiles 512 px) = anciens niveaux Leaflet − 1.
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

  private ml: MapLibreNs | null = null;
  private map: MapLibre.Map | null = null;
  private markers: MapLibre.Marker[] = [];
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
      loadStylesheet(this.doc, `${VENDOR}/maplibre-gl.css`);
      const ml = await import('maplibre-gl');
      // Worker auto-hébergé (pas de blob:) ; ?v= évite un worker en cache d'une version précédente.
      ml.setWorkerUrl(`${VENDOR}/maplibre-gl-worker.mjs?v=${ml.getVersion()}`);
      this.ml = ml;

      const map = new ml.Map({
        container: this.canvas().nativeElement,
        style: environment.mapStyleUrl,
        center: [12.6, 42.2],
        zoom: 5,
        minZoom: 4,
        maxZoom: 10, // données agrégées : pas de zoom au niveau de la rue
        maxBounds: [
          [5, 34.5],
          [20, 48.5],
        ],
        scrollZoom: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        renderWorldCopies: false,
        // Attribution OpenFreeMap / OpenMapTiles / OpenStreetMap fournie par le style (obligatoire).
        attributionControl: { compact: true },
      });
      map.touchZoomRotate.disableRotation();
      map.keyboard.disableRotation();
      map.addControl(new ml.NavigationControl({ showCompass: false }), 'top-left');

      this.map = map;
      this.status.set('ready');
    } catch {
      // WebGL indisponible, chunk introuvable… : la liste des villes reste utilisable.
      this.status.set('error');
    }
  }

  private renderMarkers(clusters: CityCluster[], selected: string | null): void {
    const ml = this.ml;
    const map = this.map;
    if (!ml || !map) {
      return;
    }
    for (const m of this.markers) {
      m.remove();
    }
    this.markers = [];

    for (const c of clusters) {
      const label = this.i18n.format(this.i18n.d().map.markerLabel, { city: c.cityName, count: c.availableCount });
      const el = this.doc.createElement('button');
      el.type = 'button';
      el.className = `glamro-cluster${c.citySlug === selected ? ' is-selected' : ''}`;
      el.innerHTML = `<span class="glamro-cluster__count" aria-hidden="true">${c.availableCount}</span><span class="glamro-cluster__label" aria-hidden="true">${escapeHtml(c.cityName)}</span>`;
      el.title = label;
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.citySelected.emit(c.citySlug);
      });

      const marker = new ml.Marker({ element: el, anchor: 'center' }).setLngLat([c.longitudeApprox, c.latitudeApprox]).addTo(map);
      // MapLibre pose un aria-label générique (« Map marker ») : on le remplace après coup.
      marker.getElement().setAttribute('aria-label', label);
      this.markers.push(marker);
    }

    const target = clusters.find((c) => c.citySlug === selected);
    if (target) {
      map.easeTo({
        center: [target.longitudeApprox, target.latitudeApprox],
        zoom: Math.max(map.getZoom(), 7),
        duration: this.reduceMotion ? 0 : 600,
      });
    } else if (!this.fitted && clusters.length) {
      const bounds = new ml.LngLatBounds();
      for (const c of clusters) {
        bounds.extend([c.longitudeApprox, c.latitudeApprox]);
      }
      map.fitBounds(bounds, { padding: 48, maxZoom: 6, animate: false });
      this.fitted = true;
    }
  }
}
