import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../../core/consent/consent.service';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { Icon } from '../../shared/components/icon/icon';

/**
 * Bandeau cookies (brief §13, P0) :
 *  - « Rifiuta », « Personalizza » et « Accetta » ont exactement le même style et le même poids ;
 *  - le X ferme sans consentement (seulement le nécessaire) ;
 *  - non bloquant, affiché uniquement côté navigateur après l'hydratation.
 */
@Component({
  selector: 'app-consent-banner',
  imports: [RouterLink, Icon, LocalizePathPipe],
  template: `
    @if (consent.bannerVisible()) {
      @let t = i18n.d().consent;
      <section class="cb" role="region" aria-labelledby="cb-title" aria-describedby="cb-text">
        <button type="button" class="cb__close" (click)="consent.close()" [attr.aria-label]="t.closeBanner">
          <app-icon name="close" />
        </button>
        <h2 id="cb-title" class="cb__title">{{ t.bannerTitle }}</h2>
        <p id="cb-text" class="cb__text">
          {{ t.bannerText }}
          <a [routerLink]="'/cookie' | lp: i18n.lang()">{{ t.policy }}</a>
        </p>
        <div class="cb__actions">
          <button type="button" class="btn btn--outline" (click)="consent.rejectAll()">{{ t.reject }}</button>
          <button type="button" class="btn btn--outline" (click)="consent.openPreferences()">{{ t.customize }}</button>
          <button type="button" class="btn btn--outline" (click)="consent.acceptAll()">{{ t.accept }}</button>
        </div>
      </section>
    }
  `,
  styles: `
    .cb {
      position: fixed; z-index: 950; left: 50%; bottom: 1rem; transform: translateX(-50%);
      width: min(760px, calc(100% - 2rem)); padding: 1.5rem 1.5rem 1.25rem;
      background: var(--c-card); border: 1px solid var(--c-border-strong); border-radius: var(--radius-l);
      box-shadow: 0 20px 60px rgba(0,0,0,.6);
    }
    .cb__title { font-family: var(--font-body); text-transform: none; font-size: 1.125rem; font-weight: 700; margin: 0 2.5rem .5rem 0; }
    .cb__text { font-size: .9375rem; color: var(--c-muted); margin-bottom: 1rem; }
    .cb__text a { color: var(--c-text); }
    .cb__actions { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .cb__close {
      position: absolute; top: .5rem; right: .5rem; width: 44px; height: 44px; display: grid; place-items: center;
      background: none; border: 0; border-radius: 50%; color: var(--c-muted);
    }
    .cb__close:hover { color: var(--c-text); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsentBanner {
  protected readonly consent = inject(ConsentService);
  protected readonly i18n = inject(I18n);
}
