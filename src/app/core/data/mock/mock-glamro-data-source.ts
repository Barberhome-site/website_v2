import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { GlamroDataSource } from '../glamro-data-source';
import {
  AvailabilityQuery,
  AvailabilityResult,
  City,
  CityCluster,
  ProfessionalApplication,
  ProfessionalFilter,
  ProfessionalProfile,
  ProfessionalSummary,
  ServiceCategory,
  SubmitResult,
  SupportRequest,
} from '../../models/glamro.models';
import { ConsentRecord } from '../../consent/consent.model';
import { buildMockDataset, MockDataset } from './mock-data';
import { I18n } from '../../i18n/i18n.service';
import { Lang } from '../../i18n/i18n.config';
import { isPostalCode } from '../../utils/text';

/**
 * Implémentation locale de `GlamroDataSource` : renvoie les données d'exemple.
 * Réponses synchrones pour les lectures (le rendu SSR les inclut directement),
 * léger délai pour les envois de formulaire afin de voir les états « en cours ».
 */
@Injectable()
export class MockGlamroDataSource extends GlamroDataSource {
  private readonly i18n = inject(I18n);
  private readonly datasets = new Map<Lang, MockDataset>();

  /** Jeu de données dans la langue courante (comme le ferait l'API avec Accept-Language). */
  private get data(): MockDataset {
    const lang = this.i18n.lang();
    let dataset = this.datasets.get(lang);
    if (!dataset) {
      dataset = buildMockDataset(undefined, lang);
      this.datasets.set(lang, dataset);
    }
    return dataset;
  }

  getServices(): Observable<ServiceCategory[]> {
    return of(this.data.services.filter((s) => s.activeCitySlugs.length > 0));
  }

  getService(slug: string): Observable<ServiceCategory | null> {
    return of(this.data.services.find((s) => s.slug === slug && s.activeCitySlugs.length > 0) ?? null);
  }

  getCities(): Observable<City[]> {
    return of(this.data.cities);
  }

  getCity(slug: string): Observable<City | null> {
    return of(this.data.cities.find((c) => c.slug === slug) ?? null);
  }

  getCityClusters(filter?: { serviceSlug?: string | null }): Observable<CityCluster[]> {
    const clusters = this.data.cities
      .filter((c) => c.status === 'active')
      .map((c) => ({
        citySlug: c.slug,
        cityName: c.name,
        latitudeApprox: c.latitudeApprox,
        longitudeApprox: c.longitudeApprox,
        availableCount: this.filterPros({ citySlug: c.slug, serviceSlug: filter?.serviceSlug }).length,
      }))
      .filter((c) => c.availableCount > 0);
    return of(clusters);
  }

  getProfessionals(filter: ProfessionalFilter = {}): Observable<ProfessionalSummary[]> {
    const list = this.filterPros(filter).map(toSummary);
    return of(filter.limit ? list.slice(0, filter.limit) : list);
  }

  getProfessional(id: string): Observable<ProfessionalProfile | null> {
    return of(this.data.professionals.find((p) => p.professionalId === id && p.verified) ?? null);
  }

  searchAvailability(query: AvailabilityQuery): Observable<AvailabilityResult> {
    const city = this.resolveCity(query);
    if (!city || city.status !== 'active') {
      const nearestCities = this.data.cities.filter((c) => c.status === 'active').slice(0, 4);
      return of({ status: 'not_covered', nearestCities });
    }
    const professionals = this.filterPros({
      citySlug: city.slug,
      serviceSlug: query.serviceSlug,
      date: query.date,
    }).map(toSummary);
    return of({ status: 'ok', city, professionals });
  }

  submitProfessionalApplication(_application: ProfessionalApplication): Observable<SubmitResult> {
    return of<SubmitResult>({ ok: true, reference: 'DEMO-PRO' }).pipe(delay(600));
  }

  submitSupportRequest(_request: SupportRequest): Observable<SubmitResult> {
    return of<SubmitResult>({ ok: true, reference: 'DEMO-SUP' }).pipe(delay(600));
  }

  recordConsent(_record: ConsentRecord): Observable<void> {
    return of(undefined);
  }

  /* ---------------------------------------------------------------- */

  private resolveCity(query: AvailabilityQuery): City | undefined {
    if (query.citySlug) {
      return this.data.cities.find((c) => c.slug === query.citySlug);
    }
    if (query.postalCode && isPostalCode(query.postalCode)) {
      return this.data.cities.find((c) => c.postalCodePrefixes.some((p) => query.postalCode!.startsWith(p)));
    }
    return undefined;
  }

  /** Tri par disponibilité (pas de positions payantes). */
  private filterPros(filter: ProfessionalFilter): ProfessionalProfile[] {
    return this.data.professionals
      .filter((p) => p.verified)
      .filter((p) => !filter.citySlug || p.citySlug === filter.citySlug)
      .filter((p) => !filter.serviceSlug || p.specialties.includes(filter.serviceSlug))
      .filter((p) => !filter.date || !p.nextAvailability || p.nextAvailability <= filter.date)
      .sort((a, b) => (a.nextAvailability ?? '9999').localeCompare(b.nextAvailability ?? '9999'));
  }
}

function toSummary(p: ProfessionalProfile): ProfessionalSummary {
  return {
    professionalId: p.professionalId,
    displayName: p.displayName,
    profileImage: p.profileImage,
    specialties: p.specialties,
    specialtyLabel: p.specialtyLabel,
    verified: p.verified,
    serviceArea: p.serviceArea,
    citySlug: p.citySlug,
    cityName: p.cityName,
    nextAvailability: p.nextAvailability,
    profileUrl: p.profileUrl,
  };
}
