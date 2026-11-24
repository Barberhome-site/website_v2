import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { AnalyticsService } from './core/analytics/analytics.service';
import { ConsentService } from './core/consent/consent.service';
import { I18n } from './core/i18n/i18n.service';
import { LangPreference } from './core/i18n/lang-preference.service';
import { BookingDialog } from './layout/booking/booking-dialog';
import { ConsentBanner } from './layout/consent/consent-banner';
import { ConsentPreferences } from './layout/consent/consent-preferences';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { LangSuggest } from './layout/lang-suggest/lang-suggest';
import { WhatsappFab } from './layout/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ConsentBanner, ConsentPreferences, BookingDialog, LangSuggest, WhatsappFab],
  template: `
    <a class="skip-link" href="#contenuto" (click)="skipToContent($event)">{{ i18n.d().nav.skip }}</a>
    <app-lang-suggest />

    @if (useMockData) {
      <p class="mock-bar" role="note">{{ i18n.d().common.mockBar }}</p>
    }

    <app-header />
    <main id="contenuto" #main tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />

    <app-consent-banner />
    <app-consent-preferences />
    <app-booking-dialog />
    <app-whatsapp-fab />
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
    .mock-bar {
      margin: 0; padding: .4rem 1rem; text-align: center; font-size: .8125rem; font-weight: 600;
      background: repeating-linear-gradient(-45deg, #2a2510, #2a2510 10px, #221e0c 10px, #221e0c 20px);
      color: var(--c-accent); border-bottom: 1px solid rgba(239,210,75,.35);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly useMockData = environment.useMockData;
  protected readonly i18n = inject(I18n);
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');
  private readonly doc = inject(DOCUMENT);
  private readonly analytics = inject(AnalyticsService);

  constructor() {
    const consent = inject(ConsentService);
    // Lecture du consentement APRÈS l'hydratation : le HTML serveur et client restent identiques.
    const langPref = inject(LangPreference);
    afterNextRender(() => {
      consent.init();
      langPref.init();
    });

    let firstNavigation = true;
    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        if (firstNavigation) {
          firstNavigation = false;
          return; // la première page vue est envoyée à l'activation de GA
        }
        // Accessibilité : le focus revient au contenu principal après une navigation.
        if (!e.urlAfterRedirects.includes('#')) {
          this.main().nativeElement.focus({ preventScroll: true });
        }
        // Le titre est mis à jour par la page : on attend le rendu.
        setTimeout(() => this.analytics.pageView(e.urlAfterRedirects, this.doc.title));
      });
  }

  /** Lien d'évitement : focus sur <main> sans recharger la page (base href). */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    const main = this.main().nativeElement;
    main.focus();
    main.scrollIntoView();
  }
}
