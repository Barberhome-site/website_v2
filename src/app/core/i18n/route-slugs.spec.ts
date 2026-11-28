import { LANGS, langOfUrl, localizePath, stripLang } from './i18n.config';
import { ROUTE_SLUGS, canonicalSlug, routePath } from './route-slugs';

/** Chemins canoniques (italiens) représentatifs du site. */
const PATHS = [
  '/',
  '/servizi',
  '/servizi/capelli',
  '/servizi/massaggi',
  '/dove-siamo',
  '/dove-siamo/milano',
  '/disponibilita?citta=roma&servizio=capelli',
  '/professionisti/giulia-m',
  '/come-funziona#pagamento',
  '/fiducia',
  '/assistenza',
  '/per-professionisti',
  '/per-professionisti/candidatura',
  '/chi-siamo',
  '/legale/privacy',
  '/legale/condizioni-clienti',
];

describe('route-slugs', () => {
  it('traduit les chemins vers chaque langue', () => {
    expect(localizePath('/servizi/capelli', 'it')).toBe('/servizi/capelli');
    expect(localizePath('/servizi/capelli', 'en')).toBe('/en/services/hair');
    expect(localizePath('/', 'en')).toBe('/en');
  });

  it('ne traduit ni les villes ni les identifiants de professionnels', () => {
    expect(localizePath('/dove-siamo/milano', 'en')).toBe('/en/where-we-are/milano');
    expect(localizePath('/professionisti/giulia-m', 'en')).toBe('/en/professionals/giulia-m');
  });

  it('fait l’aller-retour italien → langue → italien sans perte', () => {
    for (const lang of LANGS) {
      for (const path of PATHS) {
        const localized = localizePath(path, lang);
        expect(stripLang(localized)).toBe(path);
        expect(langOfUrl(localized)).toBe(lang);
      }
    }
  });

  it('n’a jamais deux traductions identiques dans un même groupe', () => {
    for (const table of Object.values(ROUTE_SLUGS)) {
      for (const group of Object.values(table)) {
        const values = Object.values(group);
        expect(new Set(values).size).toBe(values.length);
        values.forEach((v) => expect(v).toMatch(/^[a-z0-9-]+$/));
      }
    }
  });

  it('retrouve le slug canonique et construit les chemins de routes', () => {
    expect(canonicalSlug('services', 'hair', 'en')).toBe('capelli');
    expect(canonicalSlug('legal', 'customer-terms', 'en')).toBe('condizioni-clienti');
    expect(canonicalSlug('services', 'inconnu', 'en')).toBe('inconnu');
    expect(routePath('servizi/:slug', 'en')).toBe('services/:slug');
    expect(routePath('per-professionisti/candidatura', 'en')).toBe('for-professionals/apply');
  });
});
