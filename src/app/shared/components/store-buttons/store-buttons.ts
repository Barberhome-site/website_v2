import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { AppKind, SITE } from '../../../core/config/site.config';
import { I18n } from '../../../core/i18n/i18n.service';
import { Icon } from '../icon/icon';

/**
 * Liens vers l'App Store et Google Play (événement store_click).
 * `app` : application clients (par défaut) ou application professionnels.
 * TODO : remplacer par les badges officiels Apple/Google quand les fichiers seront fournis.
 */
@Component({
  selector: 'app-store-buttons',
  imports: [Icon],
  template: `
    <a class="btn btn--outline" [class.btn--sm]="size() === 'small'" [href]="links().appStoreUrl" rel="noopener" target="_blank"
       (click)="track('app_store')">
      <app-icon name="phone" /> {{ i18n.d().common.appStore }}<span class="visually-hidden"> {{ i18n.d().common.newTab }}</span>
    </a>
    <a class="btn btn--outline" [class.btn--sm]="size() === 'small'" [href]="links().playStoreUrl" rel="noopener" target="_blank"
       (click)="track('google_play')">
      <app-icon name="phone" /> {{ i18n.d().common.googlePlay }}<span class="visually-hidden"> {{ i18n.d().common.newTab }}</span>
    </a>
  `,
  styles: `:host { display: flex; flex-wrap: wrap; gap: .75rem; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreButtons {
  readonly app = input<AppKind>('client');
  readonly size = input<'default' | 'small'>('default');
  /** Emplacement du clic, transmis à l'analytics. */
  readonly placement = input('generic');

  protected readonly i18n = inject(I18n);
  private readonly analytics = inject(AnalyticsService);
  protected readonly links = computed(() => SITE.apps[this.app()]);

  protected track(store: string): void {
    this.analytics.track('store_click', { store, app: this.app(), placement: this.placement() });
  }
}
