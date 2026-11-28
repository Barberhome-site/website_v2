/**
 * Correspondance entre les catégories du site et le catalogue de l'API.
 *
 * API (GET /api/services) : CAPELLI, ESTETICA, MASSAGGI, MAKEUP, PACCHETTI, avec des sous-catégories.
 * Site (brief du 28/11/2026) : capelli (barbe comprise), make-up, estetica, massaggi.
 *  - une catégorie entière → filtre `categoryId` de la recherche (capelli, make-up, massaggi) ;
 *  - une catégorie moins certaines sous-catégories → filtre `serviceIds` : « estetica » sans les ongles
 *    (MANI, PIEDI), que GLAMRO ne propose pas.
 * La correspondance se fait sur les catégories : de nouvelles sous-catégories (catalogue v2) arrivent
 * automatiquement dans la bonne page, sauf si elles sont exclues ici. PACCHETTI n'a pas de page.
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
  /** Sous-catégories de l'API à ne pas montrer sur le site. */
  exclude?: string[];
}

const RULES: Record<string, Rule> = {
  capelli: { category: 'CAPELLI' },
  'make-up': { category: 'MAKEUP' },
  estetica: { category: 'ESTETICA', exclude: ['MANI', 'PIEDI'] },
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
    if (!rule.exclude) {
      filters.set(slug, { categoryId: category.id });
      continue;
    }
    const ids = category.subcategories
      .filter((s) => !rule.exclude!.includes(s.name))
      .flatMap((s) => s.services.map((svc) => svc.id));
    if (ids.length) {
      filters.set(slug, { serviceIds: ids.join(',') });
    }
  }
  return filters;
}

/** Catégorie du site d'un service de l'API, ou null (PACCHETTI, ongles…). */
export function siteSlugFor(category: string | null | undefined, subcategory: string | null | undefined): string | null {
  const match = Object.entries(RULES).find(
    ([, r]) => r.category === category && !(subcategory && r.exclude?.includes(subcategory)),
  );
  return match?.[0] ?? null;
}

/**
 * Catégories du site réservables à un endroit, d'après GET /api/services?lat&lng
 * (l'API ne renvoie alors que les services d'au moins un professionnel publié qui couvre ce point).
 */
export function coveredSlugs(catalog: ApiCatalog): Set<string> {
  const slugs = new Set<string>();
  for (const category of catalog.categories) {
    for (const sub of category.subcategories) {
      const slug = sub.services.length ? siteSlugFor(category.name, sub.name) : null;
      if (slug) {
        slugs.add(slug);
      }
    }
  }
  return slugs;
}
