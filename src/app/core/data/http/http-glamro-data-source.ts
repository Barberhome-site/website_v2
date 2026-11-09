import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
import { I18n } from '../../i18n/i18n.service';
import { Lang } from '../../i18n/i18n.config';
import {
  mapAvailabilityResult,
  mapCity,
  mapCityCluster,
  mapProfessionalProfile,
  mapProfessionalSummary,
  mapService,
} from './api-mappers';

/**
 * Implémentation de `GlamroDataSource` sur l'API GLAMRO.
 *
 * TODO API : les chemins ci-dessous sont des hypothèses. Les ajuster quand la
 * documentation de l'API sera disponible, puis passer `useMockData` à false.
 *
 * - En SSR, Angular attend la fin des requêtes HttpClient avant d'envoyer la page,
 *   et `provideClientHydration()` transfère les réponses GET au navigateur
 *   (pas de double appel).
 * - La langue est envoyée par langInterceptor (Accept-Language).
 * - Les listes peu volatiles (services, villes) sont mises en cache en mémoire, par langue.
 */
@Injectable()
export class HttpGlamroDataSource extends GlamroDataSource {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  private readonly i18n = inject(I18n);
  private readonly services$ = new Map<Lang, Observable<ServiceCategory[]>>();
  private readonly cities$ = new Map<Lang, Observable<City[]>>();

  getServices(): Observable<ServiceCategory[]> {
    const lang = this.i18n.lang();
    let cached = this.services$.get(lang);
    if (!cached) {
      cached = this.http
        .get<unknown[]>(`${this.base}/services`)
        .pipe(map((list) => list.map(mapService)), shareReplay({ bufferSize: 1, refCount: false }));
      this.services$.set(lang, cached);
    }
    return cached;
  }

  getService(slug: string): Observable<ServiceCategory | null> {
    return this.http.get<unknown>(`${this.base}/services/${encodeURIComponent(slug)}`).pipe(map(mapService), nullOn404());
  }

  getCities(): Observable<City[]> {
    const lang = this.i18n.lang();
    let cached = this.cities$.get(lang);
    if (!cached) {
      cached = this.http
        .get<unknown[]>(`${this.base}/cities`)
        .pipe(map((list) => list.map(mapCity)), shareReplay({ bufferSize: 1, refCount: false }));
      this.cities$.set(lang, cached);
    }
    return cached;
  }

  getCity(slug: string): Observable<City | null> {
    return this.http.get<unknown>(`${this.base}/cities/${encodeURIComponent(slug)}`).pipe(map(mapCity), nullOn404());
  }

  getCityClusters(filter?: { serviceSlug?: string | null }): Observable<CityCluster[]> {
    const params = toParams({ service: filter?.serviceSlug });
    return this.http.get<unknown[]>(`${this.base}/map/clusters`, { params }).pipe(map((list) => list.map(mapCityCluster)));
  }

  getProfessionals(filter: ProfessionalFilter = {}): Observable<ProfessionalSummary[]> {
    const params = toParams({ city: filter.citySlug, service: filter.serviceSlug, date: filter.date, limit: filter.limit });
    return this.http
      .get<unknown[]>(`${this.base}/professionals`, { params })
      .pipe(map((list) => list.map(mapProfessionalSummary)));
  }

  getProfessional(id: string): Observable<ProfessionalProfile | null> {
    return this.http
      .get<unknown>(`${this.base}/professionals/${encodeURIComponent(id)}`)
      .pipe(map(mapProfessionalProfile), nullOn404());
  }

  searchAvailability(query: AvailabilityQuery): Observable<AvailabilityResult> {
    const params = toParams({ city: query.citySlug, cap: query.postalCode, service: query.serviceSlug, date: query.date });
    return this.http.get<unknown>(`${this.base}/availability`, { params }).pipe(map(mapAvailabilityResult));
  }

  submitProfessionalApplication(application: ProfessionalApplication): Observable<SubmitResult> {
    return this.http.post<SubmitResult>(`${this.base}/professional-applications`, application);
  }

  submitSupportRequest(request: SupportRequest): Observable<SubmitResult> {
    return this.http.post<SubmitResult>(`${this.base}/support-requests`, request);
  }

  recordConsent(record: ConsentRecord): Observable<void> {
    return this.http.post<void>(`${this.base}/consents`, record);
  }
}

function toParams(values: Record<string, string | number | null | undefined>): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== null && value !== undefined && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}

/** Transforme une 404 en `null` ; les autres erreurs remontent. */
function nullOn404<T>() {
  return (source: Observable<T>): Observable<T | null> =>
    source.pipe(
      catchError((err: unknown) =>
        err instanceof HttpErrorResponse && err.status === 404 ? of(null) : throwError(() => err),
      ),
    );
}
