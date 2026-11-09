import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { FormatPipe, LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { City, ProfessionalSummary, ServiceCategory } from '../../core/models/glamro.models';
import { cityPageLd } from '../../core/seo/json-ld';
import { SeoService } from '../../core/seo/seo.service';
import { asyncState } from '../../core/utils/async-state';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { Icon } from '../../shared/components/icon/icon';
import { LastUpdated } from '../../shared/components/last-updated/last-updated';
import { NotFoundView } from '../../shared/components/not-found-view/not-found-view';
import { ProfessionalCard } from '../../shared/components/professional-card/professional-card';

/**
 * Page ville : zones couvertes, services actifs, professionnels, mise à jour, conditions, FAQ.
 * Ville non couverte → message transparent + noindex (brief §9).
 */
@Component({
  selector: 'app-city-detail-page',
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
  templateUrl: './city-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityDetailPage {
  /** Fourni par cityResolver. */
  readonly city = input<City | null>(null);

  protected readonly i18n = inject(I18n);
  private readonly data = inject(GlamroDataSource);
  private readonly seo = inject(SeoService);

  protected readonly isActive = computed(() => this.city()?.status === 'active');

  private readonly services = asyncState<ServiceCategory[]>(this.data.getServices(), []);
  /** Les pages ville ne lient que les catégories disponibles dans la ville. */
  protected readonly cityServices = computed(() => {
    const c = this.city();
    return c ? this.services().value.filter((s) => c.activeServiceSlugs.includes(s.slug)) : [];
  });

  protected readonly pros = asyncState<ProfessionalSummary[]>(
    toObservable(this.city).pipe(
      switchMap((c) => (c && c.status === 'active' ? this.data.getProfessionals({ citySlug: c.slug, limit: 8 }) : of([]))),
    ),
    [],
  );

  protected readonly crumbs = computed(() => {
    const c = this.city();
    const t = this.i18n.d();
    return [
      { label: t.common.home, path: '/' },
      { label: t.nav.where, path: '/dove-siamo' },
      ...(c ? [{ label: c.name, path: `/dove-siamo/${c.slug}` }] : []),
    ];
  });

  constructor() {
    effect(() => {
      const c = this.city();
      if (!c) {
        return;
      }
      const t = this.i18n.d().city;
      const active = c.status === 'active';
      const title = this.i18n.format(active ? t.titleActive : t.titleInactive, { city: c.name });
      this.seo.set({
        title,
        description: active
          ? this.i18n.format(t.seoDescriptionActive, {
              city: c.name,
              services: this.cityServices()
                .map((s) => (this.i18n.lang() === 'de' ? s.name : s.name.toLowerCase()))
                .join(', '),
              areas: c.areasServed.join(', '),
            })
          : this.i18n.format(t.seoDescriptionInactive, { city: c.name }),
        path: `/dove-siamo/${c.slug}`,
        noindex: !active || !c.indexable,
        breadcrumbs: this.crumbs(),
        jsonLd: active ? [cityPageLd(c, this.cityServices(), this.pros().value, title, this.i18n.lang())] : [],
      });
    });
  }
}
