import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, effect, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { FormatPipe, LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { City, ProfessionalSummary, ServiceCategory } from '../../core/models/glamro.models';
import { serviceLd } from '../../core/seo/json-ld';
import { SeoService } from '../../core/seo/seo.service';
import { asyncState } from '../../core/utils/async-state';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { Icon } from '../../shared/components/icon/icon';
import { LastUpdated } from '../../shared/components/last-updated/last-updated';
import { NotFoundView } from '../../shared/components/not-found-view/not-found-view';
import { ProfessionalCard } from '../../shared/components/professional-card/professional-card';

/** Page service : description concrète, destinataires, contenu, conditions, villes actives, FAQ, CTA. */
@Component({
  selector: 'app-service-detail-page',
  imports: [
    RouterLink,
    LocalizePathPipe,
    FormatPipe,
    Breadcrumbs,
    FaqList,
    Icon,
    LastUpdated,
    NotFoundView,
    ProfessionalCard,
  ],
  templateUrl: './service-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailPage {
  /** Fourni par serviceResolver (withComponentInputBinding). */
  readonly service = input<ServiceCategory | null>(null);

  protected readonly i18n = inject(I18n);
  private readonly data = inject(GlamroDataSource);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(AnalyticsService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly cities = asyncState<City[]>(this.data.getCities(), []);
  protected readonly activeCities = computed(() => {
    const s = this.service();
    return s ? this.cities().value.filter((c) => c.status === 'active' && s.activeCitySlugs.includes(c.slug)) : [];
  });

  protected readonly pros = asyncState<ProfessionalSummary[]>(
    toObservable(this.service).pipe(
      switchMap((s) => (s ? this.data.getProfessionals({ serviceSlug: s.slug, limit: 6 }) : of([]))),
    ),
    [],
  );

  protected readonly crumbs = computed(() => {
    const s = this.service();
    const t = this.i18n.d();
    return [
      { label: t.common.home, path: '/' },
      { label: t.nav.services, path: '/servizi' },
      ...(s ? [{ label: s.professionalLabel, path: `/servizi/${s.slug}` }] : []),
    ];
  });

  constructor() {
    effect(() => {
      const s = this.service();
      if (!s) {
        return; // NotFoundView gère titre, noindex et statut 404
      }
      const t = this.i18n.d().serviceDetail;
      const cities = this.activeCities();
      const description = [
        this.i18n.format(t.seoDescription, { description: s.shortDescription }),
        cities.length ? this.i18n.format(t.seoAvailable, { cities: cities.map((c) => c.name).join(', ') }) : '',
      ]
        .join(' ')
        .trim();
      this.seo.set({
        title: this.i18n.format(t.seoTitle, { label: s.professionalLabel, name: s.name }),
        description,
        path: `/servizi/${s.slug}`,
        breadcrumbs: this.crumbs(),
        jsonLd: [serviceLd(s, cities, this.i18n.format(t.title, { label: s.professionalLabel }), this.i18n.lang())],
      });
    });

    // Événement séparé : une seule fois par service affiché.
    effect(() => {
      const slug = this.service()?.slug;
      if (slug && this.isBrowser) {
        this.analytics.track('view_service', { service_slug: slug });
      }
    });
  }
}
