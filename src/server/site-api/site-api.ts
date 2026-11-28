/**
 * site-api : la couche serveur entre le site et l'API GLAMRO.
 *
 * Le site n'appelle jamais l'API depuis le navigateur. Il appelle /site-api (même domaine),
 * et ce module :
 *  - interroge les endpoints publics EXISTANTS du backend (aucune modification du backend) ;
 *  - assemble les données au format du site (core/models/glamro.models.ts) ;
 *  - ne renvoie que ce que le site affiche : nom public « Prénom N. », jamais le nom de famille
 *    complet, ni coordonnées, ni données internes (commission, rayon, etc.) ;
 *  - garde les réponses en cache quelques minutes (moins d'appels, pages plus rapides).
 *
 * Endpoints du backend utilisés :
 *  - GET /services                         catalogue → filtres de catégorie
 *  - GET /services?lat&lng&radiusKm        catégories réservables autour d'une ville
 *  - GET /discovery/nearby-professionals   professionnels qui couvrent le centre d'une ville
 *  - GET /professionals/:id/profile        profil (déjà filtré par le backend pour les anonymes)
 *
 * Les villes suivies et les textes des pages viennent du site (core/content/site-content.ts).
 */
import {
  AvailabilityQuery,
  AvailabilityResult,
  City,
  CityCluster,
  ProfessionalFilter,
  ProfessionalProfile,
  ProfessionalReview,
  ProfessionalServiceOffer,
  ProfessionalSummary,
  ServiceCategory,
} from '../../app/core/models/glamro.models';
import { DEFAULT_LANG, Lang, isLang } from '../../app/core/i18n/i18n.config';
import {
  CITIES,
  CityBase,
  PROFESSIONAL_TYPE_LABELS,
  PROFILE_CONDITIONS,
  cityName,
  cityTexts,
  citiesContent,
  servicesContent,
} from '../../app/core/content/site-content';
import { TtlCache } from './cache';
import { ApiCatalog, SITE_SERVICE_SLUGS, ServiceFilter, buildFilters, coveredSlugs, siteSlugFor } from './catalog';
import { QueryValue, UpstreamError, UpstreamGet } from './upstream';

/* ------------------------------------------------------------------ */
/* Formats de l'API (seulement les champs utilisés)                    */
/* ------------------------------------------------------------------ */

interface NearbyItem {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  distanceKm?: number | null;
  nextAvailableAt?: string | null;
  serviceTags?: string[] | null;
  badges?: string[] | null;
}

interface NearbyPage {
  items: NearbyItem[];
  total: number;
  totalPages: number;
}

interface ApiProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  badges?: string[] | null;
  specializations?: string[] | null;
  professionalTypes?: string[] | null;
  rating?: { average: number | null; count: number } | null;
  services?: {
    serviceId: string;
    name: string;
    category?: string | null;
    subcategory?: string | null;
    durationMin?: number | null;
    clientPriceCents?: number | null;
    currency?: string | null;
  }[];
  recentReviews?: {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    author?: { firstName?: string | null; lastName?: string | null } | null;
  }[];
}

/* ------------------------------------------------------------------ */
/* Réglages                                                            */
/* ------------------------------------------------------------------ */

/** Rayon de recherche autour du centre d'une ville (l'API le limite aussi au rayon de chaque pro). */
const CITY_RADIUS_KM = 20;
/** Taille de page maximale acceptée par l'API. */
const PAGE_SIZE = 50;
/** Garde-fou : au-delà, les professionnels d'une ville ne sont pas tous indexés. */
const MAX_PAGES_PER_CITY = 10;

const MINUTE = 60_000;
const TTL = {
  catalog: 30 * MINUTE,
  city: 5 * MINUTE,
  list: 2 * MINUTE,
  profile: 2 * MINUTE,
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

/** Nom public : « Giulia M. ». Le nom de famille complet ne quitte jamais le serveur. */
export function publicName(firstName?: string | null, lastName?: string | null): string {
  const first = (firstName ?? '').trim();
  const initial = (lastName ?? '').trim().charAt(0).toUpperCase();
  const name = [first, initial ? `${initial}.` : ''].filter(Boolean).join(' ');
  return name || 'GLAMRO';
}

const romeDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' });

/** Date du jour (AAAA-MM-JJ) à Rome d'un instant ISO. */
export function romeDate(iso: string | null | undefined): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : romeDay.format(date);
}

function distanceKm(a: CityBase, b: CityBase): number {
  const rad = Math.PI / 180;
  const dLat = (b.latitudeApprox - a.latitudeApprox) * rad;
  const dLng = (b.longitudeApprox - a.longitudeApprox) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitudeApprox * rad) * Math.cos(b.latitudeApprox * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** Fusionne plusieurs listes en alternant (une ville après l'autre), sans doublon. */
function interleave<T>(lists: T[][], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  const longest = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < longest; i++) {
    for (const list of lists) {
      const item = list.at(i);
      if (item !== undefined && !seen.has(key(item))) {
        seen.add(key(item));
        out.push(item);
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Service                                                             */
/* ------------------------------------------------------------------ */

interface LiveCity {
  base: CityBase;
  total: number;
  services: string[];
}

export interface SiteApi {
  getServices(lang: Lang): Promise<ServiceCategory[]>;
  getService(slug: string, lang: Lang): Promise<ServiceCategory | null>;
  getCities(lang: Lang): Promise<City[]>;
  getCity(slug: string, lang: Lang): Promise<City | null>;
  getCityClusters(serviceSlug: string | null, lang: Lang): Promise<CityCluster[]>;
  getProfessionals(filter: ProfessionalFilter, lang: Lang): Promise<ProfessionalSummary[]>;
  getProfessional(id: string, lang: Lang): Promise<ProfessionalProfile | null>;
  searchAvailability(query: AvailabilityQuery, lang: Lang): Promise<AvailabilityResult>;
}

export function createSiteApi(get: UpstreamGet, cache = new TtlCache()): SiteApi {
  /* ---------- appels à l'API, mis en cache ---------- */

  const filters = () => cache.get('catalog', TTL.catalog, async () => buildFilters(await get<ApiCatalog>('/services')));

  const nearby = (city: CityBase, params: Record<string, QueryValue>, page: number, limit = PAGE_SIZE) =>
    get<NearbyPage>('/discovery/nearby-professionals', {
      lat: city.latitudeApprox,
      lng: city.longitudeApprox,
      radiusKm: CITY_RADIUS_KM,
      limit,
      page,
      ...params,
    });

  /** Tous les professionnels publiés qui couvrent le centre de la ville (comptage, profils, accueil). */
  const cityIndex = (city: CityBase) =>
    cache.get(`index:${city.slug}`, TTL.city, async () => {
      const first = await nearby(city, {}, 1);
      const pages = Math.min(first.totalPages, MAX_PAGES_PER_CITY);
      const rest = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, i) => nearby(city, {}, i + 2)));
      return { total: first.total, items: [first, ...rest].flatMap((p) => p.items) };
    });

  /** Catégories du site réservables dans la ville. */
  const cityServices = (city: CityBase) =>
    cache.get(`coverage:${city.slug}`, TTL.city, async () => {
      const catalog = await get<ApiCatalog>('/services', {
        lat: city.latitudeApprox,
        lng: city.longitudeApprox,
        radiusKm: CITY_RADIUS_KM,
      });
      return [...coveredSlugs(catalog)].filter((s) => SITE_SERVICE_SLUGS.includes(s));
    });

  /** Professionnels d'une ville pour un service et/ou une date (première page, 50 max). */
  const filteredList = (city: CityBase, filter: ServiceFilter | null, date: string | null) =>
    cache.get(`list:${city.slug}:${JSON.stringify(filter)}:${date ?? ''}`, TTL.list, () =>
      nearby(city, { ...(filter ?? {}), date }, 1),
    );

  const liveCities = () =>
    cache.get('cities', TTL.city, async () => {
      const results = await Promise.allSettled(
        CITIES.map(async (base): Promise<LiveCity> => {
          const [index, services] = await Promise.all([cityIndex(base), cityServices(base)]);
          return { base, total: index.total, services };
        }),
      );
      const ok = results.filter((r): r is PromiseFulfilledResult<LiveCity> => r.status === 'fulfilled');
      if (!ok.length && results.length) {
        throw (results[0] as PromiseRejectedResult).reason;
      }
      // Une ville en erreur est simplement absente, plutôt que de faire échouer toute la page.
      return ok.map((r) => r.value);
    });

  const activeCities = async () => (await liveCities()).filter((c) => c.total > 0);

  /* ---------- assemblage ---------- */

  function toCity(live: LiveCity, lang: Lang): City {
    const content = citiesContent(lang).find((c) => c.slug === live.base.slug)!;
    const active = live.total > 0;
    return {
      ...content,
      ...cityTexts(content.name, active, lang),
      status: active ? 'active' : 'waitlist',
      indexable: active,
      activeServiceSlugs: live.services,
      availableCount: live.total,
    };
  }

  function toSummary(item: NearbyItem, city: CityBase, lang: Lang, serviceSlug: string | null): ProfessionalSummary {
    const displayName = publicName(item.firstName, item.lastName);
    return {
      professionalId: item.id,
      displayName,
      profileImage: item.avatarUrl ? { src: item.avatarUrl, alt: displayName } : null,
      specialties: serviceSlug ? [serviceSlug] : [],
      // Noms des services proposés (en italien, comme dans l'app).
      specialtyLabel: (item.serviceTags ?? []).filter(Boolean).slice(0, 2).join(' · '),
      // L'API ne publie que des professionnels dont l'identité est vérifiée (kycStatus = VERIFIED).
      verified: true,
      serviceArea: '',
      citySlug: city.slug,
      cityName: cityName(city.slug, lang),
      nextAvailability: romeDate(item.nextAvailableAt),
      profileUrl: `/professionisti/${encodeURIComponent(item.id)}`,
    };
  }

  async function serviceFilter(slug: string | null | undefined): Promise<ServiceFilter | null | 'unknown'> {
    if (!slug) {
      return null;
    }
    return (await filters()).get(slug) ?? 'unknown';
  }

  /* ---------- API du site ---------- */

  const api: SiteApi = {
    async getServices(lang) {
      const cities = await activeCities();
      return servicesContent(lang)
        .map((s) => ({ ...s, activeCitySlugs: cities.filter((c) => c.services.includes(s.slug)).map((c) => c.base.slug) }))
        .filter((s) => s.activeCitySlugs.length > 0);
    },

    async getService(slug, lang) {
      return (await api.getServices(lang)).find((s) => s.slug === slug) ?? null;
    },

    async getCities(lang) {
      return (await liveCities()).map((c) => toCity(c, lang));
    },

    async getCity(slug, lang) {
      const live = (await liveCities()).find((c) => c.base.slug === slug);
      return live ? toCity(live, lang) : null;
    },

    async getCityClusters(serviceSlug, lang) {
      const filter = await serviceFilter(serviceSlug);
      if (filter === 'unknown') {
        return [];
      }
      const cities = (await activeCities()).filter((c) => !serviceSlug || c.services.includes(serviceSlug));
      const counts = await Promise.all(
        cities.map(async (c) => (filter ? (await filteredList(c.base, filter, null)).total : c.total)),
      );
      return cities
        .map((c, i) => ({
          citySlug: c.base.slug,
          cityName: cityName(c.base.slug, lang),
          latitudeApprox: c.base.latitudeApprox,
          longitudeApprox: c.base.longitudeApprox,
          availableCount: counts[i],
        }))
        .filter((c) => c.availableCount > 0);
    },

    async getProfessionals({ citySlug, serviceSlug, date, limit }, lang) {
      const filter = await serviceFilter(serviceSlug);
      if (filter === 'unknown' || (date && !ISO_DATE.test(date))) {
        return [];
      }
      const day = date ?? null;
      const cities = citySlug
        ? (await liveCities()).filter((c) => c.base.slug === citySlug && c.total > 0)
        : (await activeCities()).filter((c) => !serviceSlug || c.services.includes(serviceSlug));

      const lists = await Promise.all(
        cities.map(async (c) => {
          const items = filter || day ? (await filteredList(c.base, filter, day)).items : (await cityIndex(c.base)).items;
          return items
            .map((item) => toSummary(item, c.base, lang, serviceSlug ?? null))
            // Avec une date : seulement les professionnels disponibles ce jour-là.
            .filter((p) => !day || p.nextAvailability === day);
        }),
      );
      const merged = interleave(lists, (p) => p.professionalId);
      return limit ? merged.slice(0, limit) : merged;
    },

    async getProfessional(id, lang) {
      if (!UUID.test(id)) {
        return null;
      }
      const profile = await cache.get(`profile:${id}`, TTL.profile, async () => {
        try {
          return await get<ApiProfile>(`/professionals/${id}/profile`);
        } catch (err) {
          if (err instanceof UpstreamError && (err.status === 404 || err.status === 400)) {
            return null;
          }
          throw err;
        }
      });
      if (!profile) {
        return null;
      }

      // Ville : celle dont le centre est le plus proche parmi celles que le professionnel couvre.
      // Un professionnel qui ne couvre aucune ville suivie par le site n'a pas de page.
      let best: { city: CityBase; item: NearbyItem } | null = null;
      for (const c of await activeCities()) {
        const item = (await cityIndex(c.base)).items.find((i) => i.id === id);
        if (item && (!best || (item.distanceKm ?? Infinity) < (best.item.distanceKm ?? Infinity))) {
          best = { city: c.base, item };
        }
      }
      if (!best) {
        return null;
      }

      const summary = toSummary(best.item, best.city, lang, null);
      const types = (profile.professionalTypes ?? [])
        .map((code) => PROFESSIONAL_TYPE_LABELS[lang][code])
        .filter((label): label is string => !!label);

      const services: ProfessionalServiceOffer[] = (profile.services ?? []).map((s) => ({
        serviceSlug: siteSlugFor(s.category, s.subcategory) ?? '',
        name: s.name,
        durationMinutes: s.durationMin ?? null,
        priceFrom: s.clientPriceCents != null ? s.clientPriceCents / 100 : null,
        currency: s.currency ?? 'EUR',
      }));

      const reviews: ProfessionalReview[] = (profile.recentReviews ?? []).map((r) => ({
        id: r.id,
        rating: r.rating,
        text: r.comment ?? '',
        authorDisplayName: publicName(r.author?.firstName, r.author?.lastName),
        date: romeDate(r.createdAt) ?? r.createdAt,
      }));

      const rating = profile.rating;
      return {
        ...summary,
        displayName: publicName(profile.firstName, profile.lastName),
        profileImage: profile.avatarUrl ? { src: profile.avatarUrl, alt: summary.displayName } : summary.profileImage,
        specialties: [...new Set(services.map((s) => s.serviceSlug).filter(Boolean))],
        specialtyLabel: types.join(', ') || summary.specialtyLabel,
        serviceArea: summary.cityName,
        bio: (profile.bio || profile.about || '').trim(),
        skills: (profile.specializations ?? []).filter(Boolean),
        services,
        areasServed: [summary.cityName],
        verification: { identity: true, qualifications: false, verifiedSince: null },
        conditions: PROFILE_CONDITIONS[lang],
        languages: [],
        reviewSummary:
          rating && rating.count > 0 && rating.average != null
            ? { average: Math.round(rating.average * 10) / 10, count: rating.count }
            : null,
        reviews,
        bookingUrl: null,
      };
    },

    async searchAvailability(query, lang) {
      const all = await liveCities();
      const base = query.citySlug
        ? CITIES.find((c) => c.slug === query.citySlug)
        : query.postalCode
          ? CITIES.find((c) => c.postalCodePrefixes.some((p) => query.postalCode!.startsWith(p)))
          : undefined;
      const live = base && all.find((c) => c.base.slug === base.slug);
      if (!base || !live || live.total === 0) {
        const nearest = all
          .filter((c) => c.total > 0)
          .sort((a, b) => (base ? distanceKm(base, a.base) - distanceKm(base, b.base) : 0))
          .slice(0, 4)
          .map((c) => toCity(c, lang));
        return { status: 'not_covered', nearestCities: nearest };
      }
      const professionals = await api.getProfessionals(
        { citySlug: base.slug, serviceSlug: query.serviceSlug, date: query.date },
        lang,
      );
      return { status: 'ok', city: toCity(live, lang), professionals };
    },
  };
  return api;
}

/* ------------------------------------------------------------------ */
/* Routage /site-api                                                   */
/* ------------------------------------------------------------------ */

export interface SiteApiResponse {
  status: number;
  body: unknown;
  /** Durée de cache côté navigateur / CDN, en secondes (0 = pas de cache). */
  maxAge: number;
}

const notFound: SiteApiResponse = { status: 404, body: { error: 'not_found' }, maxAge: 60 };

/**
 * Traite une requête GET /site-api/… (route Express dans server.ts, et intercepteur
 * en mémoire pendant le rendu serveur).
 */
export async function handleSiteApi(api: SiteApi, pathname: string, params: URLSearchParams): Promise<SiteApiResponse> {
  const langParam = params.get('lang') ?? DEFAULT_LANG;
  const lang: Lang = isLang(langParam) ? langParam : DEFAULT_LANG;
  const opt = (key: string) => params.get(key) || null;
  const [resource, id, ...extra] = pathname.replace(/^\/?site-api\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (extra.length) {
    return notFound;
  }
  const ok = (body: unknown, maxAge = 60): SiteApiResponse =>
    body === null ? notFound : { status: 200, body, maxAge };

  try {
    switch (resource) {
      case 'services':
        return ok(id ? await api.getService(id, lang) : await api.getServices(lang), 300);
      case 'cities':
        return ok(id ? await api.getCity(id, lang) : await api.getCities(lang), 300);
      case 'clusters':
        return id ? notFound : ok(await api.getCityClusters(opt('service'), lang), 120);
      case 'professionals': {
        if (id) {
          return ok(await api.getProfessional(id, lang), 120);
        }
        const limit = Number(params.get('limit'));
        return ok(
          await api.getProfessionals(
            {
              citySlug: opt('city'),
              serviceSlug: opt('service'),
              date: opt('date'),
              limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : undefined,
            },
            lang,
          ),
          120,
        );
      }
      case 'availability':
        return id
          ? notFound
          : ok(
              await api.searchAvailability(
                { citySlug: opt('city'), postalCode: opt('cap'), serviceSlug: opt('service'), date: opt('date') },
                lang,
              ),
              60,
            );
      default:
        return notFound;
    }
  } catch (err) {
    console.error('[site-api]', pathname, err instanceof Error ? err.message : err);
    return { status: 502, body: { error: 'upstream_unavailable' }, maxAge: 0 };
  }
}
