/**
 * Redirect 301 dai vecchi indirizzi (prompt di correzione del 24/11/2026, punti 8, 9 e 10.9).
 *
 *  - /fr, /es, /de (lingue rimosse) → pagina italiana corrispondente;
 *  - /legale/… e /en/legal/… → nuovi indirizzi delle pagine legali;
 *  - Regolamento, Policy reclami, Igiene e sicurezza (documenti eliminati) → Termini o Cancellazioni;
 *  - /per-professionisti/candidatura, /clients, /professionals, /contact, vecchi PDF;
 *  - categorie eliminate: /servizi/barber → capelli, /servizi/nails → estetica.
 *
 * Modulo senza dipendenze Angular: usato solo da server.ts.
 */

interface LegacyTable {
  pages: Record<string, string>;
  services: Record<string, string>;
  legal: Record<string, string>;
  pro: Record<string, string>;
}

/** Tabelle degli slug com'erano prima della correzione (traduzione → si legge al contrario). */
const LEGACY_SLUGS: Record<string, LegacyTable> = {
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
      legale: 'legal',
    },
    services: {
      capelli: 'hair',
      barber: 'barber',
      'make-up': 'make-up',
      nails: 'nails',
      estetica: 'beauty-treatments',
      massaggi: 'massages',
    },
    legal: {
      privacy: 'privacy',
      'cookie-policy': 'cookie-policy',
      'condizioni-clienti': 'customer-terms',
      'condizioni-professionisti': 'professional-terms',
      'regolamento-piattaforma': 'platform-rules',
      'policy-reclami': 'complaints-policy',
      'disclaimer-igienico-sanitario': 'hygiene-and-safety',
    },
    pro: { candidatura: 'apply' },
  },

  fr: {
    pages: {
      servizi: 'services',
      'dove-siamo': 'ou-sommes-nous',
      disponibilita: 'disponibilite',
      professionisti: 'professionnels',
      'come-funziona': 'comment-ca-marche',
      fiducia: 'confiance-et-securite',
      assistenza: 'aide',
      'per-professionisti': 'pour-les-professionnels',
      'chi-siamo': 'qui-sommes-nous',
      legale: 'mentions-legales',
    },
    services: {
      capelli: 'coiffure',
      barber: 'barbier',
      'make-up': 'maquillage',
      nails: 'ongles',
      estetica: 'soins-esthetiques',
      massaggi: 'massages',
    },
    legal: {
      privacy: 'confidentialite',
      'cookie-policy': 'politique-cookies',
      'condizioni-clienti': 'conditions-clients',
      'condizioni-professionisti': 'conditions-professionnels',
      'regolamento-piattaforma': 'reglement-plateforme',
      'policy-reclami': 'politique-reclamations',
      'disclaimer-igienico-sanitario': 'hygiene-et-securite',
    },
    pro: { candidatura: 'candidature' },
  },

  es: {
    pages: {
      servizi: 'servicios',
      'dove-siamo': 'donde-estamos',
      disponibilita: 'disponibilidad',
      professionisti: 'profesionales',
      'come-funziona': 'como-funciona',
      fiducia: 'confianza-y-seguridad',
      assistenza: 'ayuda',
      'per-professionisti': 'para-profesionales',
      'chi-siamo': 'quienes-somos',
      legale: 'legal',
    },
    services: {
      capelli: 'peluqueria',
      barber: 'barberia',
      'make-up': 'maquillaje',
      nails: 'unas',
      estetica: 'estetica',
      massaggi: 'masajes',
    },
    legal: {
      privacy: 'privacidad',
      'cookie-policy': 'politica-de-cookies',
      'condizioni-clienti': 'condiciones-clientes',
      'condizioni-professionisti': 'condiciones-profesionales',
      'regolamento-piattaforma': 'reglamento-plataforma',
      'policy-reclami': 'politica-reclamaciones',
      'disclaimer-igienico-sanitario': 'higiene-y-seguridad',
    },
    pro: { candidatura: 'solicitud' },
  },

  de: {
    pages: {
      servizi: 'leistungen',
      'dove-siamo': 'standorte',
      disponibilita: 'verfuegbarkeit',
      professionisti: 'profis',
      'come-funziona': 'so-funktionierts',
      fiducia: 'vertrauen-und-sicherheit',
      assistenza: 'hilfe',
      'per-professionisti': 'fuer-profis',
      'chi-siamo': 'ueber-uns',
      legale: 'rechtliches',
    },
    services: {
      capelli: 'haare',
      barber: 'barbier',
      'make-up': 'make-up',
      nails: 'naegel',
      estetica: 'kosmetik',
      massaggi: 'massagen',
    },
    legal: {
      privacy: 'datenschutz',
      'cookie-policy': 'cookie-richtlinie',
      'condizioni-clienti': 'kundenbedingungen',
      'condizioni-professionisti': 'bedingungen-fuer-profis',
      'regolamento-piattaforma': 'plattformregeln',
      'policy-reclami': 'beschwerderichtlinie',
      'disclaimer-igienico-sanitario': 'hygiene-und-sicherheit',
    },
    pro: { candidatura: 'bewerbung' },
  },
};

const invert = (r: Record<string, string>) => Object.fromEntries(Object.entries(r).map(([it, local]) => [local, it]));
const REVERSE: Record<string, LegacyTable> = Object.fromEntries(
  Object.entries(LEGACY_SLUGS).map(([lang, t]) => [
    lang,
    { pages: invert(t.pages), services: invert(t.services), legal: invert(t.legal), pro: invert(t.pro) },
  ]),
);

/** Vecchio documento legale (chiave italiana) → nuovo indirizzo italiano. */
const LEGAL_TARGETS: Record<string, string> = {
  privacy: '/privacy',
  'cookie-policy': '/cookie',
  'condizioni-clienti': '/termini',
  'condizioni-professionisti': '/termini-professionisti',
  'policy-reclami': '/cancellazioni-rimborsi',
  'regolamento-piattaforma': '/termini',
  'disclaimer-igienico-sanitario': '/termini',
};

/** Nuovi indirizzi inglesi delle pagine che cambiano (allineati a core/i18n/route-slugs.ts). */
const EN_TARGETS: Record<string, string> = {
  '/privacy': '/en/privacy',
  '/cookie': '/en/cookies',
  '/termini': '/en/terms',
  '/termini-professionisti': '/en/professional-terms',
  '/cancellazioni-rimborsi': '/en/cancellations-refunds',
  '/per-professionisti': '/en/for-professionals',
  '/servizi/capelli': '/en/services/hair',
  '/servizi/estetica': '/en/services/beauty-treatments',
};

/** Indirizzi fissi del sito precedente e dell'app. */
const FIXED: Record<string, string> = {
  '/index': '/',
  '/clients': '/',
  '/professionals': '/per-professionisti',
  '/contact': '/assistenza',
  '/cookie-policy': '/cookie',
  '/terms': '/termini',
  '/documents/Informativa_trattamento_dati.pdf': '/privacy',
  '/documents/Informativa_Cookie.pdf': '/cookie',
  '/documents/Termini_Condizioni.pdf': '/termini',
  '/documents/Regolamento_piattaforma.pdf': '/termini',
  '/documents/Policy_Reclami.pdf': '/cancellazioni-rimborsi',
  '/documents/Disclaimer_igienico_sanitario.pdf': '/termini',
};

/** Regole sul percorso canonico italiano (dopo aver tolto lingua e traduzione). */
function modernize(segments: string[]): string | null {
  const [first, second] = segments;
  if (first === 'legale') {
    return LEGAL_TARGETS[second ?? ''] ?? '/termini';
  }
  if (first === 'per-professionisti' && second === 'candidatura') {
    return '/per-professionisti';
  }
  if (first === 'servizi' && second === 'barber') {
    return '/servizi/capelli';
  }
  if (first === 'servizi' && second === 'nails') {
    return '/servizi/estetica';
  }
  return null;
}

/**
 * Nuovo indirizzo per un vecchio percorso, oppure null se il percorso è ancora valido.
 * `pathname` senza query string.
 */
export function legacyRedirect(pathname: string): string | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (Object.hasOwn(FIXED, clean)) {
    return FIXED[clean];
  }
  const segments = clean.split('/').filter(Boolean);
  const lang = segments[0];

  // Lingue rimosse: sempre verso la pagina italiana corrispondente.
  if (lang === 'fr' || lang === 'es' || lang === 'de') {
    const italian = toItalian(segments.slice(1), lang);
    return modernize(italian) ?? `/${italian.join('/')}`;
  }

  // Inglese: solo gli indirizzi che cambiano.
  if (lang === 'en') {
    const target = modernize(toItalian(segments.slice(1), 'en'));
    return target ? (EN_TARGETS[target] ?? target) : null;
  }

  return modernize(segments);
}

function toItalian(segments: string[], lang: string): string[] {
  const table = REVERSE[lang];
  if (!segments.length) {
    return [];
  }
  const result = [...segments];
  result[0] = table.pages[segments[0]] ?? segments[0];
  if (result.length > 1) {
    const group = result[0] === 'servizi' ? table.services : result[0] === 'legale' ? table.legal : result[0] === 'per-professionisti' ? table.pro : null;
    if (group) {
      result[1] = group[segments[1]] ?? segments[1];
    }
  }
  return result;
}
