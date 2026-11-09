import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlamroDataSource } from '../../../core/data/glamro-data-source';
import { FormatPipe, LocalizePathPipe } from '../../../core/i18n/i18n.pipes';
import { I18n } from '../../../core/i18n/i18n.service';
import { CityCluster, ProfessionalSummary, ServiceCategory } from '../../../core/models/glamro.models';
import { nearest } from '../../../core/utils/geo';
import { Icon } from '../icon/icon';
import { ProfessionalCard } from '../professional-card/professional-card';
import { ItalyMap } from './italy-map';

interface PanelState {
  status: 'idle' | 'loading' | 'ok' | 'empty' | 'error';
  pros: ProfessionalSummary[];
}

/** Distance au-delà de laquelle la position est considérée hors zone couverte. */
const COVERED_RADIUS_KM = 40;

/**
 * Bloc « Dove siamo » : carte + liste accessible équivalente + panneau des résultats.
 * Gère : chargement, aucun résultat, erreur, zone non couverte, géolocalisation refusée.
 * Sur mobile, le panneau s'ouvre depuis le bas (bottom sheet).
 */
@Component({
  selector: 'app-coverage-map',
  imports: [RouterLink, Icon, ProfessionalCard, ItalyMap, LocalizePathPipe, FormatPipe],
  templateUrl: './coverage-map.html',
  styleUrl: './coverage-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverageMap {
  /** Clusters initiaux (rendus côté serveur dans la liste). */
  readonly initialClusters = input.required<CityCluster[]>();
  readonly services = input<ServiceCategory[]>([]);
  /** État du chargement initial fait par la page parente. */
  readonly initialStatus = input<'ok' | 'loading' | 'error'>('ok');

  private readonly data = inject(GlamroDataSource);
  protected readonly i18n = inject(I18n);
  private readonly injector = inject(Injector);
  private readonly panelHeading = viewChild<ElementRef<HTMLElement>>('panelHeading');

  protected readonly serviceSlug = signal('');
  private readonly clustersOverride = signal<CityCluster[] | null>(null);
  protected readonly clusters = computed(() => this.clustersOverride() ?? this.initialClusters());
  private readonly statusOverride = signal<'ok' | 'loading' | 'error' | null>(null);
  protected readonly clustersStatus = computed(() => this.statusOverride() ?? this.initialStatus());

  protected readonly selectedSlug = signal<string | null>(null);
  protected readonly selectedCluster = computed(
    () => this.clusters().find((c) => c.citySlug === this.selectedSlug()) ?? null,
  );
  protected readonly panel = signal<PanelState>({ status: 'idle', pros: [] });

  protected readonly geoBusy = signal(false);
  protected readonly geoMessage = signal<string | null>(null);

  protected readonly serviceName = computed(
    () => this.services().find((s) => s.slug === this.serviceSlug())?.name ?? null,
  );

  private clustersSub?: Subscription;
  private panelSub?: Subscription;

  protected onServiceChange(slug: string): void {
    this.serviceSlug.set(slug);
    this.statusOverride.set('loading');
    this.clustersSub?.unsubscribe();
    this.clustersSub = this.data.getCityClusters({ serviceSlug: slug || null }).subscribe({
      next: (clusters) => {
        this.clustersOverride.set(clusters);
        this.statusOverride.set('ok');
        if (this.selectedSlug()) {
          this.loadPanel();
        }
      },
      error: () => this.statusOverride.set('error'),
    });
  }

  protected retryClusters(): void {
    this.onServiceChange(this.serviceSlug());
  }

  protected selectCity(slug: string): void {
    this.selectedSlug.set(slug);
    this.loadPanel();
    afterNextRender(() => this.panelHeading()?.nativeElement.focus(), { injector: this.injector });
  }

  protected closePanel(): void {
    this.selectedSlug.set(null);
    this.panelSub?.unsubscribe();
    this.panel.set({ status: 'idle', pros: [] });
  }

  protected loadPanel(): void {
    const city = this.selectedSlug();
    if (!city) {
      return;
    }
    this.panel.set({ status: 'loading', pros: [] });
    this.panelSub?.unsubscribe();
    this.panelSub = this.data
      .getProfessionals({ citySlug: city, serviceSlug: this.serviceSlug() || null, limit: 4 })
      .subscribe({
        next: (pros) => this.panel.set({ status: pros.length ? 'ok' : 'empty', pros }),
        error: () => this.panel.set({ status: 'error', pros: [] }),
      });
  }

  /** La position reste dans le navigateur : elle n'est ni envoyée ni enregistrée. */
  protected useMyLocation(): void {
    const geo = typeof navigator !== 'undefined' ? navigator.geolocation : undefined;
    if (!geo) {
      this.geoMessage.set(this.i18n.d().map.geoUnsupported);
      return;
    }
    this.geoBusy.set(true);
    this.geoMessage.set(null);
    geo.getCurrentPosition(
      (pos) => {
        this.geoBusy.set(false);
        const found = nearest(this.clusters(), pos.coords.latitude, pos.coords.longitude);
        if (!found) {
          this.geoMessage.set(this.i18n.d().map.geoNoCity);
          return;
        }
        if (found.km <= COVERED_RADIUS_KM) {
          this.geoMessage.set(this.i18n.format(this.i18n.d().map.geoHere, { city: found.item.cityName }));
        } else {
          this.geoMessage.set(
            this.i18n.format(this.i18n.d().map.geoFar, { city: found.item.cityName, km: Math.round(found.km) }),
          );
        }
        this.selectCity(found.item.citySlug);
      },
      (err) => {
        this.geoBusy.set(false);
        this.geoMessage.set(
          err.code === err.PERMISSION_DENIED ? this.i18n.d().map.geoDenied : this.i18n.d().map.geoFailed,
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }
}
