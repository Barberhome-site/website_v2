import { legacyRedirect } from './legacy-redirects';

describe('legacyRedirect', () => {
  it('envoie les langues supprimées vers la page italienne équivalente', () => {
    expect(legacyRedirect('/fr')).toBe('/');
    expect(legacyRedirect('/de/')).toBe('/');
    expect(legacyRedirect('/fr/services/coiffure')).toBe('/servizi/capelli');
    expect(legacyRedirect('/es/servicios/masajes')).toBe('/servizi/massaggi');
    expect(legacyRedirect('/de/standorte/milano')).toBe('/dove-siamo/milano');
    expect(legacyRedirect('/fr/ou-sommes-nous/milano')).toBe('/dove-siamo/milano');
    expect(legacyRedirect('/fr/mentions-legales/confidentialite')).toBe('/legale/privacy');
    expect(legacyRedirect('/es/para-profesionales')).toBe('/per-professionisti');
  });

  it('redirige les adresses fixes du site précédent', () => {
    expect(legacyRedirect('/terms')).toBe('/legale/condizioni-clienti');
    expect(legacyRedirect('/index/')).toBe('/');
  });

  it('laisse passer les adresses actuelles', () => {
    expect(legacyRedirect('/')).toBeNull();
    expect(legacyRedirect('/servizi/capelli')).toBeNull();
    expect(legacyRedirect('/en/services/hair')).toBeNull();
    expect(legacyRedirect('/fresco')).toBeNull();
  });
});
