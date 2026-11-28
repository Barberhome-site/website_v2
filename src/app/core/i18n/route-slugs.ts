/**
 * Traduction des segments d'URL.
 *
 * Partout dans le code, les chemins sont écrits en italien (« chemin canonique ») :
 *   '/servizi/capelli', '/termini', '/per-professionisti/candidatura'…
 * Ils sont traduits au moment de produire un lien (pipe `lp`, SEO, sitemap) :
 *   en → /en/services/hair
 *
 * Règles :
 *  - 1er segment : page (groupe `pages`) ;
 *  - 2e segment  : catégorie de service après « servizi »,
 *                  sous-page après « per-professionisti » ; sinon inchangé
 *                  (villes et identifiants de professionnels ne sont pas traduits).
 *  - Slugs en minuscules ASCII avec tirets. Dans une même langue et un même groupe,
 *    deux entrées ne doivent jamais avoir la même traduction.
 *  - Une catégorie de service absente de la table garde son slug italien (repli).
 */
import type { Lang } from './i18n.config';

export interface RouteSlugTable {
  pages: Record<string, string>;
  services: Record<string, string>;
  /** Sous-pages de « per-professionisti ». */
  pro: Record<string, string>;
}

export type SlugGroup = keyof RouteSlugTable;

export const ROUTE_SLUGS: Record<Exclude<Lang, 'it'>, RouteSlugTable> = {
  en: {
    pages: {
      servizi: 'services',
      'dove-siamo': 'where-we-are',
      disponibilita: 'availability',
      professionisti: 'professionals',
      'come-funziona': 'how-it-works',
      fiducia: 'trust-and-safety',
      assistenza: 'help',
      'per-professionisti': 'for-professionals',
      'chi-siamo': 'about-us',
      // Pages légales : adresses de premier niveau (/termini → /en/terms).
      termini: 'terms',
      'termini-professionisti': 'professional-terms',
      privacy: 'privacy',
      cookie: 'cookies',
      'cancellazioni-rimborsi': 'cancellations-refunds',
    },
    services: {
      capelli: 'hair',
      barber: 'barber',
      'make-up': 'make-up',
      nails: 'nails',
      estetica: 'beauty-treatments',
      massaggi: 'massages',
    },
    pro: { candidatura: 'apply' },
  },
};

/** Groupe du 2e segment selon la page (1er segment canonique). */
const SECOND_SEGMENT_GROUP: Record<string, SlugGroup> = {
  servizi: 'services',
  'per-professionisti': 'pro',
};

/** Tables inverses (traduction → italien), calculées une fois. */
const REVERSE: Record<string, RouteSlugTable> = Object.fromEntries(
  Object.entries(ROUTE_SLUGS).map(([lang, table]) => [
    lang,
    Object.fromEntries(
      (Object.keys(table) as SlugGroup[]).map((group) => [
        group,
        Object.fromEntries(Object.entries(table[group]).map(([it, local]) => [local, it])),
      ]),
    ) as unknown as RouteSlugTable,
  ]),
);

/** Italien → langue cible (direction `out`) ou langue cible → italien (direction `in`). */
export function translateSegments(segments: string[], lang: Lang, direction: 'out' | 'in'): string[] {
  if (lang === 'it' || segments.length === 0) {
    return segments;
  }
  const table = direction === 'out' ? ROUTE_SLUGS[lang] : REVERSE[lang];
  const result = [...segments];
  result[0] = table.pages[segments[0]] ?? segments[0];
  const canonicalFirst = direction === 'out' ? segments[0] : result[0];
  const group = SECOND_SEGMENT_GROUP[canonicalFirst];
  if (group && result.length > 1) {
    result[1] = table[group][segments[1]] ?? segments[1];
  }
  return result;
}

/** Slug traduit → slug italien pour un groupe donné (ex. « coiffure » → « capelli »). */
export function canonicalSlug(group: SlugGroup, value: string, lang: Lang): string {
  return lang === 'it' ? value : (REVERSE[lang][group][value] ?? value);
}

/** Chemin de route Angular dans une langue, sans préfixe : 'servizi/:slug' → 'leistungen/:slug'. */
export function routePath(canonicalPath: string, lang: Lang): string {
  return translateSegments(canonicalPath.split('/').filter(Boolean), lang, 'out').join('/');
}
