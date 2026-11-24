import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { SITE } from '../../core/config/site.config';
import { I18n } from '../../core/i18n/i18n.service';

/**
 * Pulsante WhatsApp fisso, solo su mobile (prompt di correzione, punto 7).
 * Apre la chat con il numero GLAMRO e un messaggio precompilato. Evento analytics: whatsapp_click.
 * L'icona è un fumetto generico: il logo WhatsApp non viene ridisegnato.
 */
@Component({
  selector: 'app-whatsapp-fab',
  template: `
    <a class="fab" [href]="href()" target="_blank" rel="noopener" [attr.aria-label]="i18n.d().common.whatsappCta" (click)="track()">
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
        <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
              d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.1A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    </a>
  `,
  styles: `
    .fab {
      position: fixed;
      right: 1rem;
      bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
      z-index: 40;
      display: grid;
      place-items: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--c-accent);
      color: var(--c-on-accent);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
    }
    .fab:focus-visible { outline: none; box-shadow: var(--focus-ring); }
    @media (min-width: 768px) { .fab { display: none; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappFab {
  protected readonly i18n = inject(I18n);
  private readonly analytics = inject(AnalyticsService);

  protected readonly href = computed(
    () => `${SITE.contact.whatsappUrl}?text=${encodeURIComponent(this.i18n.d().common.whatsappMessage)}`,
  );

  protected track(): void {
    this.analytics.track('whatsapp_click', { placement: 'fab' });
  }
}
