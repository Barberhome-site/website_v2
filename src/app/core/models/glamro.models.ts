/**
 * Modèles du domaine GLAMRO, utilisés par toute l'application.
 *
 * Ce sont les formes INTERNES du front. Le JSON de l'API GLAMRO est converti vers ces
 * modèles côté serveur, dans `src/server/site-api` : les composants ne dépendent pas
 * du format de l'API.
 *
 * Les champs « minimaux » proposés par le brief (§7) sont tous présents :
 *  - profils : professional_id, display_name, profile_image, specialties, verified,
 *    service_area, city_slug, next_availability, profile_url
 *  - clusters : city_slug, city_name, latitude_approx, longitude_approx, available_count
 */

export interface ImageRef {
  src: string;
  alt: string;
  /** Point de cadrage (object-position), pour garder le sujet dans le recadrage : '66% 40%'. */
  position?: string;
  width?: number;
  height?: number;
}

export interface Faq {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ */
/* Servizi                                                             */
/* ------------------------------------------------------------------ */

export interface ServiceCategory {
  slug: string;
  /** Nom de la catégorie : « Capelli ». */
  name: string;
  /** Métier affiché sur les cartes : « Parrucchieri ». */
  professionalLabel: string;
  shortDescription: string;
  /** Réponse directe en ouverture de page (GEO, brief §11). */
  intro: string;
  /** À qui s'adresse le service. */
  audience: string;
  includes: string[];
  conditions: string[];
  image?: ImageRef | null;
  faqs: Faq[];
  /** Seulement les villes où le service est réellement réservable. */
  activeCitySlugs: string[];
  /** Date ISO (AAAA-MM-JJ) de dernière mise à jour du contenu. */
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Città                                                               */
/* ------------------------------------------------------------------ */

/** `active` = offre vérifiée et réservable ; `waitlist` = zone non couverte (noindex). */
export type CityStatus = 'active' | 'waitlist';

export interface City {
  slug: string;
  name: string;
  region: string;
  status: CityStatus;
  /** La page ville n'est indexée que si l'offre est vérifiée (brief §9). */
  indexable: boolean;
  intro: string;
  areasServed: string[];
  /** Préfixes de CAP couverts, utilisés pour la recherche par code postal. */
  postalCodePrefixes: string[];
  activeServiceSlugs: string[];
  availableCount: number;
  /** Centre approximatif de la ville — jamais la position d'un professionnel. */
  latitudeApprox: number;
  longitudeApprox: number;
  faqs: Faq[];
  updatedAt: string;
}

/** Point agrégé de la carte (une ville ou une zone). */
export interface CityCluster {
  citySlug: string;
  cityName: string;
  latitudeApprox: number;
  longitudeApprox: number;
  availableCount: number;
}

/* ------------------------------------------------------------------ */
/* Professionisti                                                      */
/* ------------------------------------------------------------------ */

export interface ProfessionalSummary {
  professionalId: string;
  /** Nom public (ex. « Giulia M. »). */
  displayName: string;
  profileImage?: ImageRef | null;
  /** Slugs des services proposés. */
  specialties: string[];
  /** Libellé du métier : « Parrucchiera ». */
  specialtyLabel: string;
  verified: boolean;
  /** Zone desservie lisible (« Milano centro, Isola ») — jamais une adresse. */
  serviceArea: string;
  citySlug: string;
  cityName: string;
  /** Date ISO de la prochaine disponibilité, si connue. */
  nextAvailability?: string | null;
  /** Chemin interne du profil, ex. /professionisti/giulia-m. */
  profileUrl: string;
}

export interface ProfessionalServiceOffer {
  serviceSlug: string;
  name: string;
  durationMinutes?: number | null;
  priceFrom?: number | null;
  currency?: string;
}

/** Avis recueilli par la plateforme sur un professionnel, après un service payé. */
export interface ProfessionalReview {
  id: string;
  rating: number;
  text: string;
  authorDisplayName: string;
  date: string;
  serviceName?: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
}

export interface ProfessionalProfile extends ProfessionalSummary {
  bio: string;
  skills: string[];
  services: ProfessionalServiceOffer[];
  areasServed: string[];
  verification: {
    identity: boolean;
    qualifications: boolean;
    verifiedSince?: string | null;
  };
  conditions: string[];
  languages: string[];
  reviewSummary?: ReviewSummary | null;
  reviews: ProfessionalReview[];
  /** Lien de réservation (deep link / universal link vers l'app). */
  bookingUrl?: string | null;
}

export interface ProfessionalFilter {
  citySlug?: string | null;
  serviceSlug?: string | null;
  date?: string | null;
  limit?: number;
}

/* ------------------------------------------------------------------ */
/* Disponibilità                                                       */
/* ------------------------------------------------------------------ */

export interface AvailabilityQuery {
  citySlug?: string | null;
  postalCode?: string | null;
  serviceSlug?: string | null;
  /** Date ISO AAAA-MM-JJ. */
  date?: string | null;
}

export type AvailabilityResult =
  | { status: 'ok'; city: City; professionals: ProfessionalSummary[] }
  | { status: 'not_covered'; nearestCities: City[] };

/* ------------------------------------------------------------------ */
/* Formulari                                                           */
/* ------------------------------------------------------------------ */

export interface ProfessionalApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  citySlug: string;
  otherCity?: string;
  specialties: string[];
  experience: string;
  hasVatNumber: boolean | null;
  message?: string;
}

export interface SupportRequest {
  name: string;
  email: string;
  topic: string;
  bookingReference?: string;
  message: string;
}

export interface SubmitResult {
  ok: true;
  reference?: string;
}
