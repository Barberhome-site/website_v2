import { Observable } from 'rxjs';
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
} from '../models/glamro.models';
import { ConsentRecord } from '../consent/consent.model';

/**
 * Point d'entrée UNIQUE de l'application vers les données.
 *
 * Les composants injectent `GlamroDataSource` et ne savent pas d'où viennent les données.
 * Deux implémentations :
 *  - `MockGlamroDataSource`  → données d'exemple locales
 *  - `HttpGlamroDataSource`  → données réelles de l'API GLAMRO, via /site-api (src/server/site-api)
 *
 * Le choix se fait dans `provideGlamroData()` selon `environment.useMockData`.
 *
 * Règles du brief à respecter par toute implémentation :
 *  - ne renvoyer que des profils publiés, vérifiés et réservables ;
 *  - ne jamais renvoyer d'adresse ou de coordonnées précises d'un professionnel ;
 *  - `getService`, `getCity`, `getProfessional` renvoient `null` si l'élément n'existe pas
 *    ou n'est pas publié (la page affiche alors une 404).
 */
export abstract class GlamroDataSource {
  /** Catégories de service réellement actives. */
  abstract getServices(): Observable<ServiceCategory[]>;
  abstract getService(slug: string): Observable<ServiceCategory | null>;

  /** Toutes les villes connues (actives et en liste d'attente). */
  abstract getCities(): Observable<City[]>;
  abstract getCity(slug: string): Observable<City | null>;

  /** Points agrégés de la carte, filtrables par service. */
  abstract getCityClusters(filter?: { serviceSlug?: string | null }): Observable<CityCluster[]>;

  /** Profils publiés, triés par pertinence (zone, service, disponibilité). */
  abstract getProfessionals(filter?: ProfessionalFilter): Observable<ProfessionalSummary[]>;
  abstract getProfessional(id: string): Observable<ProfessionalProfile | null>;

  /** Recherche de disponibilité : ville ou CAP + service + date. */
  abstract searchAvailability(query: AvailabilityQuery): Observable<AvailabilityResult>;

  abstract submitProfessionalApplication(application: ProfessionalApplication): Observable<SubmitResult>;
  abstract submitSupportRequest(request: SupportRequest): Observable<SubmitResult>;

  /** Enregistre la preuve du consentement côté serveur (brief §13, P0). */
  abstract recordConsent(record: ConsentRecord): Observable<void>;
}
