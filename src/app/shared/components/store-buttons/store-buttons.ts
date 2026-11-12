import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { AppKind, SITE } from '../../../core/config/site.config';
import { I18n } from '../../../core/i18n/i18n.service';

/**
 * Badges officiels App Store / Google Play (localisés), liens vers les stores (événement store_click).
 * `app` : application clients (par défaut) ou application professionnels.
 *
 * Règles des marques (à respecter si on retouche ce composant) :
 *  - badges fournis par Apple / Google, jamais modifiés, recolorés, animés ni recréés (fichiers dans public/badges) ;
 *  - badge App Store en premier ; badge Google Play de taille égale ou supérieure ;
 *  - fond uni, espace libre autour (le `gap`).
 */
@Component({
  selector: 'app-store-buttons',
  template: `
    <a class="store" [href]="links().appStoreUrl" rel="noopener" target="_blank" (click)="track('app_store')">
      <img [src]="'/badges/app-store-' + i18n.lang() + '.svg'" [alt]="d().appStoreBadge + ' ' + d().newTab"
           width="135" height="40" loading="lazy" decoding="async" />
    </a>
    <a class="store" [href]="links().playStoreUrl" rel="noopener" target="_blank" (click)="track('google_play')">
      <img [src]="'/badges/google-play-' + i18n.lang() + '.svg'" [alt]="d().googlePlayBadge + ' ' + d().newTab"
           width="135" height="40" loading="lazy" decoding="async" />
    </a>
  `,
  styles: `
    :host {
      --badge-h: 48px;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    :host(.is-small) {
      --badge-h: 40px;
    }
    .store {
      display: block;
      border-radius: 7px;
      line-height: 0;
    }
    .store:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    img {
      display: block;
      height: var(--badge-h);
      width: auto;
    }
  `,
  host: {
    '[class.is-small]': 'size() === "small"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreButtons {
  readonly app = input<AppKind>('client');
  readonly size = input<'default' | 'small'>('default');
  /** Emplacement du clic, transmis à l'analytics. */
  readonly placement = input('generic');

  protected readonly i18n = inject(I18n);
  private readonly analytics = inject(AnalyticsService);
  protected readonly d = computed(() => this.i18n.d().common);
  protected readonly links = computed(() => SITE.apps[this.app()]);

  protected track(store: string): void {
    this.analytics.track('store_click', { store, app: this.app(), placement: this.placement() });
  }
}
