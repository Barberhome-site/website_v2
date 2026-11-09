import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { ServiceCategory } from '../../core/models/glamro.models';
import { SeoService } from '../../core/seo/seo.service';
import { asyncState } from '../../core/utils/async-state';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { Icon } from '../../shared/components/icon/icon';
import { ServiceCard } from '../../shared/components/service-card/service-card';

@Component({
  selector: 'app-services-page',
  imports: [RouterLink, LocalizePathPipe, Breadcrumbs, Icon, ServiceCard],
  template: `
    @let t = i18n.d().services;
    <div class="page-head">
      <div class="container">
        <app-breadcrumbs [items]="crumbs" />
        <h1>{{ t.title }}</h1>
        <p class="lead">{{ t.lead }}</p>
      </div>
    </div>

    <section class="section" aria-labelledby="list-title">
      <div class="container">
        <h2 id="list-title" class="visually-hidden">{{ t.listTitle }}</h2>
        @switch (services().status) {
          @case ('error') {
            <p class="alert alert--error" role="alert"><app-icon name="alert" />{{ t.error }}</p>
          }
          @default {
            <ul role="list" class="grid" style="--grid-min: 260px">
              @for (service of services().value; track service.slug) {
                <li><app-service-card [service]="service" /></li>
              }
            </ul>
          }
        }

        <div class="cta-row">
          <a class="btn btn--primary" [routerLink]="'/disponibilita' | lp: i18n.lang()">{{ t.findCta }}</a>
          <a class="btn btn--outline" [routerLink]="'/come-funziona' | lp: i18n.lang()">{{ t.howCta }}</a>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPage {
  protected readonly i18n = inject(I18n);
  protected readonly services = asyncState<ServiceCategory[]>(inject(GlamroDataSource).getServices(), []);
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().nav.services, path: '/servizi' },
  ];

  constructor() {
    const t = this.i18n.d().services;
    inject(SeoService).set({ title: t.title, description: t.seoDescription, path: '/servizi', breadcrumbs: this.crumbs });
  }
}
