/**
 * Types des documents légaux (le contenu est généré dans legal-docs.ts par tools/build-legal-docs.mjs)
 * et liste des pages, séparée des textes (~100 kB) pour ne pas les charger avec les routes.
 */

/** Clés = adresses italiennes des pages légales (/termini, /privacy…). */
export const LEGAL_DOC_KEYS = ['termini', 'termini-professionisti', 'privacy', 'cookie', 'cancellazioni-rimborsi'] as const;
export type LegalDocKey = (typeof LEGAL_DOC_KEYS)[number];

/**
 * Les textes v3 sont en vérification chez l'avocat. Passer à `false` quand il les approuve :
 * l'avertissement en haut des pages disparaît.
 */
export const LEGAL_DRAFT = true;

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'olist'; start: number; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'manage-cookies' };

export interface LegalSection {
  id: string;
  /** Titre tel qu'il est écrit dans le texte (numéro compris : « 3. Ruolo di GLAMRO »). */
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  key: LegalDocKey;
  title: string;
  /** Libellé du lien dans le footer, en italien (champ `footer` du .md). */
  footerLabel: string;
  description: string;
  version: string;
  /** Date ISO de la version (tirée du sous-titre du .md). */
  effectiveDate: string;
  /** Sous-titre officiel : références légales, version, date. */
  subtitle: string;
  /** Avertissement « bozza » propre au document, affiché tant que LEGAL_DRAFT vaut true. */
  draftNotice: string;
  /** Blocs placés avant la première section. */
  preamble: LegalBlock[];
  sections: LegalSection[];
}
