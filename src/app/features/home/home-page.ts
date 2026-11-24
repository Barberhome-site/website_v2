import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { SITE } from '../../core/config/site.config';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { City, CityCluster, ProfessionalSummary, ServiceCategory } from '../../core/models/glamro.models';
import { organizationLd, websiteLd } from '../../core/seo/json-ld';
import { SeoService } from '../../core/seo/seo.service';
import { asyncState } from '../../core/utils/async-state';
import { AvailabilitySearch } from '../../shared/components/availability-search/availability-search';
import { CoverageMap } from '../../shared/components/coverage-map/coverage-map';
import { Icon, IconName } from '../../shared/components/icon/icon';
import { ProsCarousel } from '../../shared/components/pros-carousel/pros-carousel';
import { ServiceCard } from '../../shared/components/service-card/service-card';
import { TrustPillars } from '../../shared/components/trust-pillars/trust-pillars';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    LocalizePathPipe,
    AvailabilitySearch,
    CoverageMap,
    Icon,
    ProsCarousel,
    ServiceCard,
    TrustPillars,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly data = inject(GlamroDataSource);
  private readonly analytics = inject(AnalyticsService);
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;

  protected readonly services = asyncState<ServiceCategory[]>(this.data.getServices(), []);
  protected readonly cities = asyncState<City[]>(this.data.getCities(), []);
  protected readonly clusters = asyncState<CityCluster[]>(this.data.getCityClusters(), []);
  protected readonly pros = asyncState<ProfessionalSummary[]>(this.data.getProfessionals({ limit: 16 }), []);

  protected readonly activeCities = computed(() => this.cities().value.filter((c) => c.status === 'active'));

  /** Filtre « zone » du carrousel. */
  protected readonly carouselCity = signal('');
  protected readonly carouselPros = computed(() => {
    const city = this.carouselCity();
    const list = this.pros().value;
    return city ? list.filter((p) => p.citySlug === city) : list;
  });

  /** Icônes (non traduisibles) associées aux étapes et avantages du dictionnaire. */
  protected readonly stepIcons: IconName[] = ['search', 'calendar', 'home'];
  protected readonly benefitIcons: IconName[] = ['users', 'calendar', 'card', 'headset'];

  constructor() {
    const t = this.i18n.d();
    inject(SeoService).set({
      title: t.home.seoTitle,
      rawTitle: true,
      description: t.home.seoDescription,
      path: '/',
      jsonLd: [organizationLd(t.brand.positioning), websiteLd(this.i18n.lang())],
    });
  }

  protected trackPro(placement: string): void {
    this.analytics.track('pro_cta_click', { placement });
  }
}
