import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, shareReplay, throwError } from 'rxjs';
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

/**
 * Données réelles, via /site-api (src/server/site-api).
 *
 * Le navigateur n'appelle jamais l'API GLAMRO directement : le serveur du site l'interroge,
 * met les réponses en cache et ne renvoie que les champs affichés, déjà au format du site.
 * Pendant le rendu serveur, ces requêtes sont traitées en mémoire (site-api.interceptor.ts).
 */
@Injectable()
export class HttpGlamroDataSource extends GlamroDataSource {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(I18n);
  private readonly base = '/site-api';

  private readonly services$ = new Map<Lang, Observable<ServiceCategory[]>>();
  private readonly cities$ = new Map<Lang, Observable<City[]>>();

  getServices(): Observable<ServiceCategory[]> {
    return this.cached(this.services$, () => this.get<ServiceCategory[]>('/services'));
  }

  getService(slug: string): Observable<ServiceCategory | null> {
    return this.get<ServiceCategory>(`/services/${encodeURIComponent(slug)}`).pipe(nullOn404());
  }

  getCities(): Observable<City[]> {
    return this.cached(this.cities$, () => this.get<City[]>('/cities'));
  }

  getCity(slug: string): Observable<City | null> {
    return this.get<City>(`/cities/${encodeURIComponent(slug)}`).pipe(nullOn404());
  }

  getCityClusters(filter?: { serviceSlug?: string | null }): Observable<CityCluster[]> {
    return this.get<CityCluster[]>('/clusters', { service: filter?.serviceSlug });
  }

  getProfessionals(filter: ProfessionalFilter = {}): Observable<ProfessionalSummary[]> {
    return this.get<ProfessionalSummary[]>('/professionals', {
      city: filter.citySlug,
      service: filter.serviceSlug,
      date: filter.date,
      limit: filter.limit,
    });
  }

  getProfessional(id: string): Observable<ProfessionalProfile | null> {
    return this.get<ProfessionalProfile>(`/professionals/${encodeURIComponent(id)}`).pipe(nullOn404());
  }

  searchAvailability(query: AvailabilityQuery): Observable<AvailabilityResult> {
    return this.get<AvailabilityResult>('/availability', {
      city: query.citySlug,
      cap: query.postalCode,
      service: query.serviceSlug,
      date: query.date,
    });
  }

  /**
   * TODO API (fase 2 du plan) : le backend n'a pas encore d'endpoint public pour les
   * candidatures et les demandes d'assistance. En attendant, l'envoi échoue et le formulaire
   * affiche son message d'erreur, qui invite à écrire par email.
   */
  submitProfessionalApplication(_application: ProfessionalApplication): Observable<SubmitResult> {
    return throwError(() => new Error('professional applications endpoint not available yet'));
  }

  submitSupportRequest(_request: SupportRequest): Observable<SubmitResult> {
    return throwError(() => new Error('support requests endpoint not available yet'));
  }

  /** TODO API : pas encore d'endpoint pour la preuve de consentement ; le choix reste enregistré dans le navigateur. */
  recordConsent(_record: ConsentRecord): Observable<void> {
    return of(undefined);
  }

  /* ---------------------------------------------------------------- */

  private get<T>(path: string, query: Record<string, string | number | null | undefined> = {}): Observable<T> {
    let params = new HttpParams().set('lang', this.i18n.lang());
    for (const [key, value] of Object.entries(query)) {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<T>(`${this.base}${path}`, { params });
  }

  /** Listes peu volatiles : une requête par langue et par session. */
  private cached<T>(store: Map<Lang, Observable<T>>, load: () => Observable<T>): Observable<T> {
    const lang = this.i18n.lang();
    let cached = store.get(lang);
    if (!cached) {
      cached = load().pipe(shareReplay({ bufferSize: 1, refCount: false }));
      store.set(lang, cached);
    }
    return cached;
  }
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
