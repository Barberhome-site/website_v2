import { LEGAL_DOC_KEYS } from '../app/features/legal/legal-types';
import { legacyRedirect } from './legacy-redirects';

/**
 * Adresses GARANTIES : utilisées par les apps, le backend et les supports imprimés (liste dans le README).
 * Elles ne doivent jamais renvoyer une 404 : chacune est une page légale ou y redirige.
 */
const GUARANTEED_LEGAL_LINKS = [
  '/terms',
  '/termini',
  '/termini-clienti',
  '/termini-professionisti',
  '/privacy',
  '/cookie',
  '/cookie-policy',
  '/cancellazioni-rimborsi',
];

describe('legacyRedirect', () => {
  it('envoie les langues supprimées vers la page italienne équivalente', () => {
    expect(legacyRedirect('/fr')).toBe('/');
    expect(legacyRedirect('/de/')).toBe('/');
    expect(legacyRedirect('/fr/services/coiffure')).toBe('/servizi/capelli');
    expect(legacyRedirect('/es/servicios/masajes')).toBe('/servizi/massaggi');
    expect(legacyRedirect('/de/standorte/milano')).toBe('/dove-siamo/milano');
    expect(legacyRedirect('/es/para-profesionales')).toBe('/per-professionisti');
  });

  it('envoie les anciennes pages légales vers les pages v3, sans chaîne de redirections', () => {
    expect(legacyRedirect('/legale/privacy')).toBe('/privacy');
    expect(legacyRedirect('/legale/cookie-policy')).toBe('/cookie');
    expect(legacyRedirect('/legale/condizioni-clienti')).toBe('/termini');
    expect(legacyRedirect('/legale/condizioni-professionisti')).toBe('/termini-professionisti');
    expect(legacyRedirect('/legale/policy-reclami')).toBe('/cancellazioni-rimborsi');
    expect(legacyRedirect('/legale/regolamento-piattaforma')).toBe('/termini');
    expect(legacyRedirect('/legale')).toBe('/termini');
    expect(legacyRedirect('/en/legal/customer-terms')).toBe('/en/terms');
    expect(legacyRedirect('/en/legal/cookie-policy')).toBe('/en/cookies');
    expect(legacyRedirect('/en/legal/complaints-policy')).toBe('/en/cancellations-refunds');
    expect(legacyRedirect('/fr/mentions-legales/confidentialite')).toBe('/privacy');
    expect(legacyRedirect('/de/rechtliches/beschwerderichtlinie')).toBe('/cancellazioni-rimborsi');
  });

  it('redirige les adresses fixes du site précédent, de l\'app et du backend', () => {
    expect(legacyRedirect('/terms')).toBe('/termini');
    expect(legacyRedirect('/termini-clienti')).toBe('/termini');
    expect(legacyRedirect('/cookie-policy')).toBe('/cookie');
    expect(legacyRedirect('/index/')).toBe('/');
    expect(legacyRedirect('/documents/Policy_Reclami.pdf')).toBe('/cancellazioni-rimborsi');
  });

  it('laisse passer les adresses actuelles', () => {
    for (const path of ['/', '/servizi/capelli', '/en/services/hair', '/termini', '/privacy', '/cookie', '/en/terms', '/fresco']) {
      expect(legacyRedirect(path)).toBeNull();
    }
  });

  it('garde en vie les adresses utilisées par les apps et le backend', () => {
    const pages = LEGAL_DOC_KEYS.map((key) => `/${key}`);
    for (const link of GUARANTEED_LEGAL_LINKS) {
      expect(pages).toContain(legacyRedirect(link) ?? link);
    }
  });
});
