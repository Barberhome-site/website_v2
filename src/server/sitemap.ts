/**
 * Génération de sitemap.xml (brief §9) :
 *  - uniquement les URL canoniques publiées et indexables, dans chaque langue ;
 *  - liens hreflang entre les versions linguistiques (xhtml:link) ;
 *  - `lastmod` réel (date de mise à jour du contenu).
 *
 * TODO API : quand l'API sera disponible, remplacer `loadDataset()` par des appels à l'API.
 */
import { environment } from '../environments/environment';
import { buildMockDataset } from '../app/core/data/mock/mock-data';
import { DEFAULT_LANG, LANGS, localizePath } from '../app/core/i18n/i18n.config';
import { LEGAL_DOCS } from '../app/features/legal/legal-docs';

interface SitemapEntry {
  path: string;
  lastmod?: string;
  /** Contenu disponible dans une seule langue (documents légaux). */
  italianOnly?: boolean;
}

const STATIC_PAGES: SitemapEntry[] = [
  { path: '/', lastmod: '2026-11-09' },
  { path: '/servizi', lastmod: '2026-11-09' },
  { path: '/dove-siamo', lastmod: '2026-11-09' },
  { path: '/come-funziona', lastmod: '2026-11-09' },
  { path: '/fiducia', lastmod: '2026-11-02' },
  { path: '/assistenza', lastmod: '2026-11-02' },
  { path: '/per-professionisti', lastmod: '2026-11-09' },
  { path: '/chi-siamo', lastmod: '2026-11-09' },
];

async function loadDataset() {
  return buildMockDataset();
}

export async function buildSitemapXml(): Promise<string> {
  const { services, cities, professionals } = await loadDataset();
  const base = environment.siteUrl.replace(/\/$/, '');
  const abs = (path: string) => escapeXml(path === '/' ? `${base}/` : `${base}${path}`);

  const entries: SitemapEntry[] = [
    ...STATIC_PAGES,
    ...services.filter((s) => s.activeCitySlugs.length > 0).map((s) => ({ path: `/servizi/${s.slug}`, lastmod: s.updatedAt })),
    ...cities
      .filter((c) => c.status === 'active' && c.indexable)
      .map((c) => ({ path: `/dove-siamo/${c.slug}`, lastmod: c.updatedAt })),
    ...professionals.filter((p) => p.verified).map((p) => ({ path: p.profileUrl })),
    ...Object.values(LEGAL_DOCS).map((d) => ({ path: `/legale/${d.key}`, lastmod: d.updatedAt, italianOnly: true })),
  ];

  const urls: string[] = [];
  for (const entry of entries) {
    const langs = entry.italianOnly ? [DEFAULT_LANG] : LANGS;
    const alternates = entry.italianOnly
      ? ''
      : [
          ...LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(localizePath(entry.path, l))}"/>`),
          `<xhtml:link rel="alternate" hreflang="x-default" href="${abs(entry.path)}"/>`,
        ].join('');
    for (const lang of langs) {
      urls.push(
        `  <url><loc>${abs(localizePath(entry.path, lang))}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}${alternates}</url>`,
      );
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);
}
