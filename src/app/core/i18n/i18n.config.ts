import { translateSegments } from './route-slugs';

/**
 * Langues du site.
 * L'italien est la langue par défaut, servie à la racine (/servizi) ;
 * les autres langues ont un préfixe ET des segments traduits (/en/services, /fr/services…).
 * Table des traductions de segments : route-slugs.ts.
 */
export const LANGS = ['it', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'it';

/** Langues servies avec un préfixe d'URL. */
export const PREFIXED_LANGS = LANGS.filter((l) => l !== DEFAULT_LANG) as Exclude<Lang, 'it'>[];

export interface LangInfo {
  /** Nom de la langue dans sa propre langue (menu). */
  label: string;
  short: string;
  /** Locale BCP-47 pour Intl (dates, prix). */
  locale: string;
  /** Locale Open Graph. */
  ogLocale: string;
}

export const LANG_INFO: Record<Lang, LangInfo> = {
  it: { label: 'Italiano', short: 'IT', locale: 'it-IT', ogLocale: 'it_IT' },
  en: { label: 'English', short: 'EN', locale: 'en-GB', ogLocale: 'en_GB' },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/** Sépare « /a/b?x=1#y » en chemin et suffixe (query + fragment). */
function splitUrl(url: string): { pathname: string; suffix: string } {
  const i = url.search(/[?#]/);
  return i < 0 ? { pathname: url, suffix: '' } : { pathname: url.slice(0, i), suffix: url.slice(i) };
}

/**
 * Chemin canonique italien → chemin dans la langue demandée (préfixe + segments traduits) :
 *   localizePath('/servizi/capelli?x=1', 'fr') → '/fr/services/coiffure?x=1'
 * Inchangé pour l'italien ou un chemin relatif.
 */
export function localizePath(path: string, lang: Lang): string {
  if (!path.startsWith('/') || lang === DEFAULT_LANG) {
    return path;
  }
  const { pathname, suffix } = splitUrl(path);
  const segments = translateSegments(pathname.split('/').filter(Boolean), lang, 'out');
  return `/${lang}${segments.length ? `/${segments.join('/')}` : ''}${suffix}`;
}

/**
 * URL dans n'importe quelle langue → chemin canonique italien :
 *   stripLang('/fr/services/coiffure?x=1') → '/servizi/capelli?x=1'
 */
export function stripLang(url: string): string {
  const match = url.match(/^\/([a-z]{2})(?=[/?#]|$)/);
  if (!match || !isLang(match[1]) || match[1] === DEFAULT_LANG) {
    return url || '/';
  }
  const lang = match[1];
  const { pathname, suffix } = splitUrl(url.slice(match[0].length));
  const segments = translateSegments(pathname.split('/').filter(Boolean), lang, 'in');
  return `/${segments.join('/')}${suffix}`;
}

/** Langue d'une URL (préfixe), italien par défaut. */
export function langOfUrl(url: string): Lang {
  const match = url.match(/^\/([a-z]{2})(?=[/?#]|$)/);
  return match && isLang(match[1]) ? match[1] : DEFAULT_LANG;
}
