import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site.config';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { organizationLd } from '../../core/seo/json-ld';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink, LocalizePathPipe, Breadcrumbs],
  template: `
    @let t = i18n.d().about;
    <div class="page-head">
      <div class="container">
        <app-breadcrumbs [items]="crumbs" />
        <h1>{{ t.title }}</h1>
        <p class="lead">{{ t.lead }}</p>
      </div>
    </div>


    <div class="container section section--tight prose">
      <h2>{{ t.whatTitle }}</h2>
      <p>{{ t.whatText }}</p>

      <h2>{{ t.roleTitle }}</h2>
      <p>{{ t.roleText }}</p>
      <p>{{ t.rolePlaceholder }}</p>

      <h2>{{ t.glossaryTitle }}</h2>
      <dl>
        @for (item of t.glossary; track $index) {
          <dt><strong>{{ item.term }}</strong></dt>
          <dd>{{ item.definition }}</dd>
        }
      </dl>

      <h2>{{ t.companyTitle }}</h2>
      <p>
        {{ site.company.legalName }}<br />
        {{ t.address }}: {{ site.company.address }}<br />
        {{ i18n.d().footer.vat }} {{ site.company.vatNumber }} · {{ site.company.rea }} · {{ site.company.shareCapital }}<br />
        PEC: {{ site.company.pec }}
      </p>
      <p>
        {{ t.contacts }}: <a [href]="'mailto:' + site.contact.email">{{ site.contact.email }}</a> ·
        <a [href]="site.contact.phoneHref">{{ site.contact.phone }}</a> ·
        <a [href]="site.contact.whatsappUrl" target="_blank" rel="noopener">WhatsApp</a> ·
        <a [routerLink]="'/assistenza' | lp: i18n.lang()">{{ i18n.d().support.title }}</a>
      </p>
    </div>
  `,
  styles: `
    dd { margin: 0 0 1rem; color: var(--c-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().about.title, path: '/chi-siamo' },
  ];

  constructor() {
    const t = this.i18n.d();
    inject(SeoService).set({
      title: t.about.title,
      description: t.about.seoDescription,
      path: '/chi-siamo',
      breadcrumbs: this.crumbs,
      jsonLd: [organizationLd(t.brand.promise)],
    });
  }
}
