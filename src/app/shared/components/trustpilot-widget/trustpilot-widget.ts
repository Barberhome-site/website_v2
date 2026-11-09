import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { ConsentService } from '../../../core/consent/consent.service';
import { I18n } from '../../../core/i18n/i18n.service';
import { loadScript } from '../../../core/utils/script-loader';
import { Icon } from '../icon/icon';

interface TrustpilotGlobal {
  loadFromElement(el: HTMLElement, forceReload?: boolean): void;
}

/**
 * TrustBox officiel Trustpilot (brief §7) :
 *  - note, nombre et avis viennent du service Trustpilot, jamais du site ;
 *  - le script n'est chargé qu'avec le consentement « contenuti di terze parti » ;
 *  - sinon (ou si le widget n'est pas configuré) : lien neutre vers le profil officiel.
 */
@Component({
  selector: 'app-trustpilot-widget',
  imports: [Icon],
  template: `
    @if (canLoad()) {
      <div
        #widget
        class="trustpilot-widget"
        [attr.data-locale]="i18n.locale()"
        [attr.data-template-id]="config.templateId"
        [attr.data-businessunit-id]="config.businessUnitId"
        data-style-height="240px"
        data-style-width="100%"
        data-theme="dark"
      >
        <a [href]="config.profileUrl" target="_blank" rel="noopener" (click)="trackClick()">Trustpilot</a>
      </div>
    } @else {
      <div class="tp-fallback">
        <p class="tp-fallback__title">{{ i18n.d().trustpilot.title }}</p>
        <p class="muted">{{ i18n.d().trustpilot.text }}</p>
        <a class="link-arrow" [href]="config.profileUrl" target="_blank" rel="noopener" (click)="trackClick()">
          {{ i18n.d().trustpilot.link }} <app-icon name="external" />
          <span class="visually-hidden">{{ i18n.d().common.newTab }}</span>
        </a>
        @if (configured && !consentGiven()) {
          <p class="small muted tp-fallback__consent">
            {{ i18n.d().trustpilot.consent }}
            <button type="button" class="tp-fallback__btn" (click)="consent.openPreferences()">{{ i18n.d().trustpilot.manage }}</button>
          </p>
        }
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .tp-fallback { display: flex; flex-direction: column; gap: .25rem; }
    .tp-fallback p { margin: 0; }
    .tp-fallback__title { font-weight: 700; font-size: 1.15rem; }
    .tp-fallback__consent { margin-top: .5rem !important; }
    .tp-fallback__btn {
      background: none; border: 0; padding: 0; min-height: 44px; color: var(--c-text);
      text-decoration: underline; text-underline-offset: .2em; font-size: inherit;
    }
    .tp-fallback__btn:hover { color: var(--c-accent); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustpilotWidget {
  protected readonly config = environment.trustpilot;
  protected readonly configured = Boolean(this.config.businessUnitId && this.config.templateId);
  protected readonly consent = inject(ConsentService);
  protected readonly i18n = inject(I18n);
  private readonly analytics = inject(AnalyticsService);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly widget = viewChild<ElementRef<HTMLElement>>('widget');

  protected readonly consentGiven = computed(() => this.consent.isGranted('functional'));
  protected readonly canLoad = computed(
    () => this.isBrowser && this.configured && this.consent.ready() && this.consentGiven(),
  );

  constructor() {
    effect(() => {
      const el = this.widget()?.nativeElement;
      if (!el) {
        return;
      }
      loadScript(this.doc, 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js')
        .then(() => {
          const tp = (this.doc.defaultView as (Window & { Trustpilot?: TrustpilotGlobal }) | null)?.Trustpilot;
          tp?.loadFromElement(el, true);
        })
        .catch(() => undefined);
    });
  }

  protected trackClick(): void {
    this.analytics.track('trustpilot_click');
  }
}
