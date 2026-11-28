import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { BookingService } from '../../core/booking/booking.service';
import { FormatPipe, LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { ProfessionalProfile } from '../../core/models/glamro.models';
import { professionalLd } from '../../core/seo/json-ld';
import { SeoService } from '../../core/seo/seo.service';
import { Avatar } from '../../shared/components/avatar/avatar';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { Icon } from '../../shared/components/icon/icon';
import { NotFoundView } from '../../shared/components/not-found-view/not-found-view';
import { StoreButtons } from '../../shared/components/store-buttons/store-buttons';

/**
 * Profil professionnel : compétences, services, zones, vérification, disponibilité,
 * conditions et avis authentiques recueillis par la plateforme (distincts de Trustpilot).
 */
@Component({
  selector: 'app-professional-page',
  imports: [RouterLink, LocalizePathPipe, FormatPipe, Avatar, Breadcrumbs, Icon, NotFoundView, StoreButtons],
  templateUrl: './professional-page.html',
  styleUrl: './professional-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalPage {
  /** Fourni par professionalResolver. */
  readonly professional = input<ProfessionalProfile | null>(null);

  protected readonly i18n = inject(I18n);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(AnalyticsService);
  private readonly booking = inject(BookingService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly availability = computed(() => this.i18n.availability(this.professional()?.nextAvailability));
  protected readonly verifiedSince = computed(() => {
    const since = this.professional()?.verification.verifiedSince;
    return since ? this.i18n.formatDate(since) : null;
  });

  protected readonly crumbs = computed(() => {
    const p = this.professional();
    return [
      { label: this.i18n.d().common.home, path: '/' },
      ...(p
        ? [
            { label: p.cityName, path: `/dove-siamo/${p.citySlug}` },
            { label: p.displayName, path: p.profileUrl },
          ]
        : []),
    ];
  });

  constructor() {
    effect(() => {
      const p = this.professional();
      if (!p) {
        return;
      }
      const t = this.i18n.d().profile;
      // En allemand, les noms gardent leur majuscule.
      const label = p.specialtyLabel.toLowerCase();
      this.seo.set({
        title: this.i18n.format(t.seoTitle, { name: p.displayName, label, city: p.cityName }),
        description: this.i18n.format(t.seoDescription, { name: p.displayName, label, city: p.cityName, area: p.serviceArea }),
        path: p.profileUrl,
        type: 'profile',
        image: p.profileImage?.src,
        breadcrumbs: this.crumbs(),
        jsonLd: [professionalLd(p, this.i18n.lang())],
      });
    });

    effect(() => {
      const id = this.professional()?.professionalId;
      if (id && this.isBrowser) {
        this.analytics.track('view_professional', { professional_id: id });
      }
    });
  }

  protected book(): void {
    const p = this.professional();
    if (p) {
      this.booking.open(p);
    }
  }

  protected price(value: number | null | undefined, currency = 'EUR'): string | null {
    const formatted = this.i18n.formatPrice(value, currency);
    return formatted ? this.i18n.format(this.i18n.d().profile.priceFrom, { price: formatted }) : null;
  }
}
