import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { SITE } from '../../core/config/site.config';
import { ConsentService } from '../../core/consent/consent.service';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { StoreButtons } from '../../shared/components/store-buttons/store-buttons';

/** Footer : supporto, legali, « Gestisci cookie » toujours présent, dati societari, social ufficiali. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, StoreButtons, LocalizePathPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();
  protected readonly consent = inject(ConsentService);
  protected readonly i18n = inject(I18n);
  private readonly analytics = inject(AnalyticsService);

  protected trackSupport(channel: string): void {
    this.analytics.track('support_click', { channel, placement: 'footer' });
  }
}
