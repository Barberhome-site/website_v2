import { LANGS, langOfUrl, localizePath, stripLang } from './i18n.config';
import { ROUTE_SLUGS, canonicalSlug, routePath } from './route-slugs';

/** Percorsi canonici (italiani) rappresentativi del sito. */
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
  '/chi-siamo',
  '/termini',
  '/termini-professionisti',
  '/privacy',
  '/cookie',
  '/cancellazioni-rimborsi',
];

describe('route-slugs', () => {
  it('ha solo italiano e inglese', () => {
    expect([...LANGS]).toEqual(['it', 'en']);
  });

  it('traduce i percorsi in inglese', () => {
    expect(localizePath('/servizi/capelli', 'it')).toBe('/servizi/capelli');
    expect(localizePath('/servizi/capelli', 'en')).toBe('/en/services/hair');
    expect(localizePath('/termini', 'en')).toBe('/en/terms');
    expect(localizePath('/cancellazioni-rimborsi', 'en')).toBe('/en/cancellations-refunds');
    expect(localizePath('/', 'en')).toBe('/en');
  });

  it('non traduce città e identificativi dei professionisti', () => {
    expect(localizePath('/dove-siamo/milano', 'en')).toBe('/en/where-we-are/milano');
    expect(localizePath('/professionisti/giulia-m', 'en')).toBe('/en/professionals/giulia-m');
  });

  it('fa andata e ritorno italiano → lingua → italiano senza perdite', () => {
    for (const lang of LANGS) {
      for (const path of PATHS) {
        const localized = localizePath(path, lang);
        expect(stripLang(localized)).toBe(path);
        expect(langOfUrl(localized)).toBe(lang);
      }
    }
  });

  it('non ha mai due traduzioni uguali nello stesso gruppo', () => {
    for (const table of Object.values(ROUTE_SLUGS)) {
      for (const group of Object.values(table)) {
        const values = Object.values(group);
        expect(new Set(values).size).toBe(values.length);
        values.forEach((v) => expect(v).toMatch(/^[a-z0-9-]+$/));
      }
    }
  });

  it('ritrova lo slug canonico e costruisce i percorsi delle rotte', () => {
    expect(canonicalSlug('services', 'hair', 'en')).toBe('capelli');
    expect(canonicalSlug('services', 'sconosciuto', 'en')).toBe('sconosciuto');
    expect(routePath('servizi/:slug', 'en')).toBe('services/:slug');
    expect(routePath('privacy', 'en')).toBe('privacy');
  });
});
