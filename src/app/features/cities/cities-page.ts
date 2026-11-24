import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { FormatPipe, LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { City, CityCluster, ServiceCategory } from '../../core/models/glamro.models';
import { SeoService } from '../../core/seo/seo.service';
import { asyncState } from '../../core/utils/async-state';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { CoverageMap } from '../../shared/components/coverage-map/coverage-map';
import { Icon } from '../../shared/components/icon/icon';

/** Index des villes : seules les villes actives ont une page liée (brief §4 et §9). */
@Component({
  selector: 'app-cities-page',
  imports: [RouterLink, LocalizePathPipe, FormatPipe, Breadcrumbs, CoverageMap, Icon],
  template: `
    @let t = i18n.d().cities;
    <div class="page-head">
      <div class="container">
        <app-breadcrumbs [items]="crumbs" />
        <h1>{{ t.title }}</h1>
        <p class="lead">{{ t.lead }}</p>
      </div>
    </div>

    <section class="container section" aria-labelledby="cities-title">
      <h2 id="cities-title">{{ t.activeTitle }}</h2>
      @if (cities().status === 'error') {
        <p class="alert alert--error" role="alert"><app-icon name="alert" />{{ t.error }}</p>
      } @else {
        <ul role="list" class="grid" style="--grid-min: 260px">
          @for (city of activeCities(); track city.slug) {
            <li class="card city">
              <h3><a [routerLink]="['/dove-siamo', city.slug] | lp: i18n.lang()">{{ city.name }}</a></h3>
              <p class="muted small">{{ t.cityMeta | fmt: { region: city.region } }}</p>
              <p class="small">{{ serviceNames(city) }}</p>
            </li>
          }
        </ul>
      }
      <p class="muted" style="margin-top: 1.5rem">
        {{ t.notListed }} <a [routerLink]="'/disponibilita' | lp: i18n.lang()">{{ t.checkCap }}</a>{{ t.notListedAfter }}
      </p>
    </section>

    <section class="container section section--tight" aria-labelledby="map-title">
      <h2 id="map-title">{{ t.mapTitle }}</h2>
      <app-coverage-map [initialClusters]="clusters().value" [initialStatus]="clusters().status" [services]="services().value" />
    </section>
  `,
  styles: `
    .city { position: relative; }
    .city h3 { margin-bottom: .25rem; font-family: var(--font-display); text-transform: uppercase; font-weight: 400; font-size: 1.4rem; }
    .city h3 a { text-decoration: none; }
    .city h3 a::after { content: ''; position: absolute; inset: 0; }
    .city:hover { border-color: var(--c-border-strong); }
    .city p { margin: 0 0 .25rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitiesPage {
  private readonly data = inject(GlamroDataSource);
  protected readonly i18n = inject(I18n);
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().nav.where, path: '/dove-siamo' },
  ];
  protected readonly cities = asyncState<City[]>(this.data.getCities(), []);
  protected readonly services = asyncState<ServiceCategory[]>(this.data.getServices(), []);
  protected readonly clusters = asyncState<CityCluster[]>(this.data.getCityClusters(), []);
  protected readonly activeCities = computed(() => this.cities().value.filter((c) => c.status === 'active'));

  constructor() {
    const t = this.i18n.d().cities;
    inject(SeoService).set({ title: t.seoTitle, description: t.seoDescription, path: '/dove-siamo', breadcrumbs: this.crumbs });
  }

  protected serviceNames(city: City): string {
    return this.services()
      .value.filter((s) => city.activeServiceSlugs.includes(s.slug))
      .map((s) => s.name)
      .join(' · ');
  }
}
