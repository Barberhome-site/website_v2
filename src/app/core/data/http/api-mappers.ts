/**
 * Conversion JSON de l'API → modèles internes.
 *
 * TODO API : le format du JSON n'est pas encore connu. Quand il le sera, il suffira
 * d'adapter les fonctions ci-dessous (noms de champs, snake_case → camelCase, etc.).
 * Les composants n'ont pas à changer.
 *
 * Exemple attendu si l'API suit les champs du brief (snake_case) :
 *   { professional_id, display_name, profile_image, specialties, verified,
 *     service_area, city_slug, next_availability, profile_url }
 * → voir `mapProfessionalSummary` (implémenté de façon tolérante aux deux formats).
 */
import {
  AvailabilityResult,
  City,
  CityCluster,
  ImageRef,
  ProfessionalProfile,
  ProfessionalSummary,
  ServiceCategory,
} from '../../models/glamro.models';

type Json = Record<string, unknown>;

/** Lit un champ en acceptant camelCase ou snake_case. */
function pick<T>(dto: Json, camel: string, snake?: string): T | undefined {
  return (dto[camel] ?? (snake ? dto[snake] : undefined)) as T | undefined;
}

function str(dto: Json, camel: string, snake?: string, fallback = ''): string {
  const v = pick<unknown>(dto, camel, snake);
  return typeof v === 'string' ? v : v == null ? fallback : String(v);
}

function arr<T = string>(dto: Json, camel: string, snake?: string): T[] {
  const v = pick<unknown>(dto, camel, snake);
  return Array.isArray(v) ? (v as T[]) : [];
}

function image(value: unknown, alt: string): ImageRef | null {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return { src: value, alt };
  }
  const v = value as Json;
  return { src: str(v, 'src', 'url'), alt: str(v, 'alt', undefined, alt), width: v['width'] as number, height: v['height'] as number };
}

export function mapProfessionalSummary(raw: unknown): ProfessionalSummary {
  const dto = raw as Json;
  const id = str(dto, 'professionalId', 'professional_id');
  const name = str(dto, 'displayName', 'display_name');
  return {
    professionalId: id,
    displayName: name,
    profileImage: image(pick(dto, 'profileImage', 'profile_image'), `Foto di ${name}`),
    specialties: arr(dto, 'specialties'),
    specialtyLabel: str(dto, 'specialtyLabel', 'specialty_label'),
    verified: Boolean(pick(dto, 'verified')),
    serviceArea: str(dto, 'serviceArea', 'service_area'),
    citySlug: str(dto, 'citySlug', 'city_slug'),
    cityName: str(dto, 'cityName', 'city_name'),
    nextAvailability: pick<string>(dto, 'nextAvailability', 'next_availability') ?? null,
    // Le front construit toujours ses propres URL internes.
    profileUrl: `/professionisti/${encodeURIComponent(id)}`,
    sponsored: Boolean(pick(dto, 'sponsored')),
  };
}

export function mapProfessionalProfile(raw: unknown): ProfessionalProfile {
  const dto = raw as Json;
  // TODO API : compléter quand le format du profil détaillé sera connu.
  return {
    ...mapProfessionalSummary(raw),
    bio: str(dto, 'bio'),
    skills: arr(dto, 'skills'),
    services: arr(dto, 'services'),
    areasServed: arr(dto, 'areasServed', 'areas_served'),
    verification: (pick(dto, 'verification') as ProfessionalProfile['verification']) ?? { identity: false, qualifications: false },
    conditions: arr(dto, 'conditions'),
    languages: arr(dto, 'languages'),
    reviewSummary: (pick(dto, 'reviewSummary', 'review_summary') as ProfessionalProfile['reviewSummary']) ?? null,
    reviews: arr(dto, 'reviews'),
    bookingUrl: pick<string>(dto, 'bookingUrl', 'booking_url') ?? null,
  };
}

export function mapCityCluster(raw: unknown): CityCluster {
  const dto = raw as Json;
  return {
    citySlug: str(dto, 'citySlug', 'city_slug'),
    cityName: str(dto, 'cityName', 'city_name'),
    latitudeApprox: Number(pick(dto, 'latitudeApprox', 'latitude_approx')),
    longitudeApprox: Number(pick(dto, 'longitudeApprox', 'longitude_approx')),
    availableCount: Number(pick(dto, 'availableCount', 'available_count') ?? 0),
  };
}

export function mapService(raw: unknown): ServiceCategory {
  // TODO API/CMS : adapter au format réel.
  return raw as ServiceCategory;
}

export function mapCity(raw: unknown): City {
  // TODO API/CMS : adapter au format réel.
  return raw as City;
}

export function mapAvailabilityResult(raw: unknown): AvailabilityResult {
  // TODO API : adapter au format réel.
  const dto = raw as Json;
  if (dto['status'] === 'not_covered') {
    return { status: 'not_covered', nearestCities: arr(dto, 'nearestCities', 'nearest_cities').map(mapCity) };
  }
  return {
    status: 'ok',
    city: mapCity(dto['city']),
    professionals: arr(dto, 'professionals').map(mapProfessionalSummary),
  };
}
