/**
 * Redirections permanentes (301) des anciennes adresses vers les pages actuelles.
 * Module sans dépendance Angular : utilisé uniquement par server.ts.
 *
 * Adresses fixes : site précédent (midnight-welcome) et liens de l'app mobile.
 *
 * Langues supprimées le 28/11/2026 (brief : le site n'existe plus qu'en italien et en anglais) :
 * /fr/…, /es/…, /de/… redirigent vers la page italienne correspondante. Les tables ci-dessous sont
 * les anciennes traductions des segments d'URL (copie de route-slugs.ts avant suppression).
 */

interface OldSlugTable {
  pages: Record<string, string>;
  services: Record<string, string>;
  legal: Record<string, string>;
  pro: Record<string, string>;
}

const REMOVED_LANG_SLUGS: Record<'fr' | 'es' | 'de', OldSlugTable> = {
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

/** Groupe du 2e segment selon la page italienne (1er segment). */
const SECOND_SEGMENT_GROUP: Record<string, keyof OldSlugTable> = {
  servizi: 'services',
  legale: 'legal',
  'per-professionisti': 'pro',
};

/** Inverse une table « italien → traduction » en « traduction → italien ». */
function invert(table: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(table).map(([it, local]) => [local, it]));
}

/** Chemin d'une langue supprimée → chemin italien équivalent (segments inconnus gardés tels quels). */
function removedLangToItalian(lang: keyof typeof REMOVED_LANG_SLUGS, segments: string[]): string {
  const table = REMOVED_LANG_SLUGS[lang];
  const result = [...segments];
  if (result.length > 0) {
    result[0] = invert(table.pages)[segments[0]] ?? segments[0];
    const group = SECOND_SEGMENT_GROUP[result[0]];
    if (group && result.length > 1) {
      result[1] = invert(table[group])[segments[1]] ?? segments[1];
    }
  }
  return '/' + result.join('/');
}

/** Adresses fixes du site précédent (dépôt midnight-welcome : routes et PDF de public/documents) et de l'app. */
const FIXED: Record<string, string> = {
  '/index': '/',
  '/privacy': '/legale/privacy',
  '/cookie': '/legale/cookie-policy',
  '/cookie-policy': '/legale/cookie-policy',
  '/terms': '/legale/condizioni-clienti',
  '/termini': '/legale/condizioni-clienti',
  '/termini-professionisti': '/legale/condizioni-professionisti',
  '/documents/Informativa_trattamento_dati.pdf': '/legale/privacy',
  '/documents/Informativa_Cookie.pdf': '/legale/cookie-policy',
  '/documents/Termini_Condizioni.pdf': '/legale/condizioni-clienti',
  '/documents/Regolamento_piattaforma.pdf': '/legale/regolamento-piattaforma',
  '/documents/Policy_Reclami.pdf': '/legale/policy-reclami',
  '/documents/Disclaimer_igienico_sanitario.pdf': '/legale/disclaimer-igienico-sanitario',
};

/**
 * Nouvelle adresse pour une ancienne, ou `null` si l'adresse est toujours valide.
 * `pathname` sans query string.
 */
export function legacyRedirect(pathname: string): string | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (Object.hasOwn(FIXED, clean)) {
    return FIXED[clean];
  }
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first === 'fr' || first === 'es' || first === 'de') {
    return removedLangToItalian(first, segments.slice(1));
  }
  return null;
}
