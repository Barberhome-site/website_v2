import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { LastUpdated } from '../../shared/components/last-updated/last-updated';
import { TrustpilotWidget } from '../../shared/components/trustpilot-widget/trustpilot-widget';

/**
 * Page « Fiducia » (brief §4 et §9) : critères de vérification, paiements, avis,
 * classement des résultats (P2B), assistance, sécurité et réclamations.
 * Les éléments [entre crochets] sont à valider par l'équipe et le conseil juridique.
 */
@Component({
  selector: 'app-trust-page',
  imports: [RouterLink, LocalizePathPipe, Breadcrumbs, LastUpdated, TrustpilotWidget],
  template: `
    @let t = i18n.d().trust;
    <div class="page-head">
      <div class="container">
        <app-breadcrumbs [items]="crumbs" />
        <h1>{{ t.title }}</h1>
        <p class="lead">{{ t.lead }}</p>
        <app-last-updated date="2026-11-02" />
      </div>
    </div>

    <div class="container section prose">
      <section id="verifica" aria-labelledby="t-verifica">
        <h2 id="t-verifica">{{ t.verification.title }}</h2>
        <p><strong>{{ t.verification.answer }}</strong></p>
        <ul>
          @for (item of t.verification.items; track $index) {
            <li>{{ item }}</li>
          }
        </ul>
        <p [class.placeholder]="t.verification.placeholder.startsWith('[')">{{ t.verification.placeholder }}</p>
      </section>

      <section id="pagamenti" aria-labelledby="t-pagamenti">
        <h2 id="t-pagamenti">{{ t.payments.title }}</h2>
        <p><strong>{{ t.payments.answer }}</strong></p>
        <p>{{ t.payments.text }}</p>
        <p [class.placeholder]="t.payments.placeholder.startsWith('[')">{{ t.payments.placeholder }}</p>
      </section>

      <section id="recensioni" aria-labelledby="t-recensioni">
        <h2 id="t-recensioni">{{ t.reviews.title }}</h2>
        <p><strong>{{ t.reviews.answer }}</strong></p>
        <ul>
          @for (item of t.reviews.items; track $index) {
            <li><strong>{{ item.label }}</strong>: {{ item.text }}</li>
          }
        </ul>
        <p>{{ t.reviews.noFake }}</p>
        <p [class.placeholder]="t.reviews.placeholder.startsWith('[')">{{ t.reviews.placeholder }}</p>
        <div class="card"><app-trustpilot-widget /></div>
      </section>

      <section id="ordinamento" aria-labelledby="t-ordinamento">
        <h2 id="t-ordinamento">{{ t.ranking.title }}</h2>
        <p><strong>{{ t.ranking.answer }}</strong></p>
        <p>{{ t.ranking.text }}</p>
        <p [class.placeholder]="t.ranking.placeholder.startsWith('[')">{{ t.ranking.placeholder }}</p>
      </section>

      <section id="assistenza" aria-labelledby="t-assistenza">
        <h2 id="t-assistenza">{{ t.support.title }}</h2>
        <p><strong>{{ t.support.answer }}</strong></p>
        <p>{{ t.support.text }} <a [routerLink]="'/assistenza' | lp: i18n.lang()" fragment="contatti">{{ t.support.link }}</a>.</p>
        <p [class.placeholder]="t.support.placeholder.startsWith('[')">{{ t.support.placeholder }}</p>
      </section>

      <section id="sicurezza" aria-labelledby="t-sicurezza">
        <h2 id="t-sicurezza">{{ t.safety.title }}</h2>
        <p><strong>{{ t.safety.answer }}</strong></p>
        <ul>
          @for (item of t.safety.items; track $index) {
            <li>{{ item }}</li>
          }
        </ul>
      </section>

      <section id="reclami" aria-labelledby="t-reclami">
        <h2 id="t-reclami">{{ t.complaints.title }}</h2>
        <p><strong>{{ t.complaints.answer }}</strong></p>
        <p [class.placeholder]="t.complaints.placeholder.startsWith('[')">{{ t.complaints.placeholder }}</p>
      </section>
    </div>
  `,
  styles: `
    section { scroll-margin-top: calc(var(--header-h) + 1rem); }
    .card { margin-top: 1.5rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustPage {
  protected readonly i18n = inject(I18n);
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().nav.trust, path: '/fiducia' },
  ];

  constructor() {
    const t = this.i18n.d().trust;
    inject(SeoService).set({ title: t.title, description: t.seoDescription, path: '/fiducia', breadcrumbs: this.crumbs });
  }
}
