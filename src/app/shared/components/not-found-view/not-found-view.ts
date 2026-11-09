import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizePathPipe } from '../../../core/i18n/i18n.pipes';
import { I18n } from '../../../core/i18n/i18n.service';
import { setResponseStatus } from '../../../core/routing/http-status';
import { SeoService } from '../../../core/seo/seo.service';

/**
 * Contenu 404 réutilisable : renvoie le statut HTTP 404 en SSR et `noindex`.
 * Utilisé par la route « ** » et par les pages détail quand l'élément n'existe pas.
 */
@Component({
  selector: 'app-not-found-view',
  imports: [RouterLink, LocalizePathPipe],
  template: `
    @let t = i18n.d().notFound;
    <div class="container section">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h1>{{ t.title }}</h1>
      <p class="lead">{{ t.lead }}</p>
      <div class="cta-row">
        <a class="btn btn--primary" [routerLink]="'/disponibilita' | lp: i18n.lang()">{{ i18n.d().cta.primary }}</a>
        <a class="btn btn--outline" [routerLink]="'/' | lp: i18n.lang()">{{ t.home }}</a>
      </div>
      <nav [attr.aria-label]="t.useful" class="links">
        <ul role="list">
          <li><a [routerLink]="'/servizi' | lp: i18n.lang()">{{ i18n.d().nav.services }}</a></li>
          <li><a [routerLink]="'/dove-siamo' | lp: i18n.lang()">{{ i18n.d().nav.where }}</a></li>
          <li><a [routerLink]="'/assistenza' | lp: i18n.lang()">{{ t.support }}</a></li>
        </ul>
      </nav>
    </div>
  `,
  styles: `
    .links ul { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 2rem; }
    .links a { min-height: 44px; display: inline-flex; align-items: center; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundView {
  protected readonly i18n = inject(I18n);

  constructor() {
    setResponseStatus(404);
    const t = this.i18n.d().notFound;
    inject(SeoService).set({ title: t.title, description: t.seoDescription, path: '/404', noindex: true });
  }
}
