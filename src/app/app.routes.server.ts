import { RenderMode, ServerRoute } from '@angular/ssr';
import { LANGS, Lang } from './core/i18n/i18n.config';
import { routePath } from './core/i18n/route-slugs';
import { LEGAL_DOC_KEYS } from './features/legal/legal-keys';

/**
 * Mode de rendu par route (brief §9 et §17 : SSR ou SSG), pour chaque langue
 * et avec les chemins traduits (core/i18n/route-slugs.ts).
 *  - Prerender (SSG) : pages éditoriales stables, générées au build.
 *  - Server (SSR)    : pages qui dépendent des données live de l'API.
 */
const STATIC_PAGES = ['come-funziona', 'chi-siamo', 'fiducia', 'per-professionisti', ...LEGAL_DOC_KEYS];

/** Chemin de route complet avec préfixe de langue : 'fr/comment-ca-marche'. */
const full = (canonical: string, lang: Lang) => `${lang === 'it' ? '' : `${lang}/`}${routePath(canonical, lang)}`;

export const serverRoutes: ServerRoute[] = [
  ...LANGS.flatMap((lang): ServerRoute[] => [
    ...STATIC_PAGES.map((page): ServerRoute => ({ path: full(page, lang), renderMode: RenderMode.Prerender })),
  ]),
  { path: '**', renderMode: RenderMode.Server },
];
