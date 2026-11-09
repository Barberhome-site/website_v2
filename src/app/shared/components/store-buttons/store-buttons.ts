import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { SITE } from '../../../core/config/site.config';
import { I18n } from '../../../core/i18n/i18n.service';
import { Icon } from '../icon/icon';

/**
 * Liens vers l'App Store et Google Play (événement store_click).
 * TODO : remplacer par les badges officiels Apple/Google quand les fichiers seront fournis.
 */
@Component({
  selector: 'app-store-buttons',
  imports: [Icon],
  template: `
    <a class="btn btn--outline" [href]="apps.appStoreUrl" rel="noopener" target="_blank" (click)="track('app_store')">
      <app-icon name="phone" /> {{ i18n.d().common.appStore }}<span class="visually-hidden"> {{ i18n.d().common.newTab }}</span>
    </a>
    <a class="btn btn--outline" [href]="apps.playStoreUrl" rel="noopener" target="_blank" (click)="track('google_play')">
      <app-icon name="phone" /> {{ i18n.d().common.googlePlay }}<span class="visually-hidden"> {{ i18n.d().common.newTab }}</span>
    </a>
  `,
  styles: `:host { display: flex; flex-wrap: wrap; gap: .75rem; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreButtons {
  /** Emplacement du clic, transmis à l'analytics. */
  readonly placement = input('generic');
  protected readonly apps = SITE.apps;
  protected readonly i18n = inject(I18n);
  private readonly analytics = inject(AnalyticsService);

  protected track(store: string): void {
    this.analytics.track('store_click', { store, placement: this.placement() });
  }
}
