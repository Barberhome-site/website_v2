/**
 * Correspondance entre les catégories du site et le catalogue de l'API.
 *
 * API (GET /api/services) : CAPELLI, ESTETICA, MASSAGGI, MAKEUP, PACCHETTI, avec des sous-catégories.
 * Sito: capelli (anche barba), make-up, estetica, massaggi.
 *  - una categoria intera → filtro `categoryId` della ricerca ;
 *  - una parte di categoria (regola con `subcategories`) → filtro `serviceIds` (oggi nessuna).
 * PACCHETTI n'a pas de page sur le site.
 */

export interface ApiCatalog {
  categories: {
    id: string;
    name: string;
    subcategories: { name: string; services: { id: string; name?: string }[] }[];
  }[];
}

interface Rule {
  category: string;
  subcategories?: string[];
}

const RULES: Record<string, Rule> = {
  capelli: { category: 'CAPELLI' },
  'make-up': { category: 'MAKEUP' },
  estetica: { category: 'ESTETICA' },
  massaggi: { category: 'MASSAGGI' },
};

export const SITE_SERVICE_SLUGS = Object.keys(RULES);

/** Paramètres de filtre de GET /api/discovery/nearby-professionals. */
export type ServiceFilter = { categoryId: string } | { serviceIds: string };

/** Filtre de recherche pour chaque catégorie du site présente dans le catalogue. */
export function buildFilters(catalog: ApiCatalog): Map<string, ServiceFilter> {
  const filters = new Map<string, ServiceFilter>();
  for (const [slug, rule] of Object.entries(RULES)) {
    const category = catalog.categories.find((c) => c.name === rule.category);
    if (!category) {
      continue;
    }
    if (!rule.subcategories) {
      filters.set(slug, { categoryId: category.id });
      continue;
    }
    const ids = category.subcategories
      .filter((s) => rule.subcategories!.includes(s.name))
      .flatMap((s) => s.services.map((svc) => svc.id));
    if (ids.length) {
      filters.set(slug, { serviceIds: ids.join(',') });
    }
  }
  return filters;
}

/** Catégorie du site d'un service de l'API (la plus précise), ou null (ex. PACCHETTI). */
export function siteSlugFor(category: string | null | undefined, subcategory: string | null | undefined): string | null {
  const entries = Object.entries(RULES);
  const specific = entries.find(
    ([, r]) => r.subcategories && r.category === category && !!subcategory && r.subcategories.includes(subcategory),
  );
  if (specific) {
    return specific[0];
  }
  return entries.find(([, r]) => !r.subcategories && r.category === category)?.[0] ?? null;
}

/**
 * Catégories du site réservables à un endroit, d'après GET /api/services?lat&lng
 * (l'API ne renvoie alors que les services d'au moins un professionnel publié qui couvre ce point).
 */
export function coveredSlugs(catalog: ApiCatalog): Set<string> {
  const slugs = new Set<string>();
  for (const category of catalog.categories) {
    for (const sub of category.subcategories) {
      if (!sub.services.length) {
        continue;
      }
      const specific = siteSlugFor(category.name, sub.name);
      const general = siteSlugFor(category.name, null);
      for (const slug of [specific, general]) {
        if (slug) {
          slugs.add(slug);
        }
      }
    }
  }
  return slugs;
}
