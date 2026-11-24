/**
 * Genera src/app/features/legal/legal-docs.ts dai testi ufficiali in content/legal/*.md.
 *
 *   node tools/build-legal-docs.mjs
 *
 * I testi NON vanno modificati a mano nel file generato: si sostituisce il .md e si rilancia lo script.
 * Lo script non riscrive nulla: converte solo titoli, paragrafi, elenchi e tabelle in blocchi.
 * Il grassetto (**testo**) resta nel testo ed è reso dalla pagina (pipe `rich`).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** chiave (= indirizzo italiano) → file e descrizione SEO. */
const DOCS = [
  { key: 'termini', file: 'termini-clienti.md', description: 'Termini e Condizioni per i clienti GLAMRO: prenotazione, prezzi e supplemento, pagamenti, cancellazioni, rimborsi e reclami.' },
  { key: 'termini-professionisti', file: 'termini-professionisti.md', description: 'Termini e Condizioni per i professionisti partner GLAMRO: requisiti, gratuità, prenotazioni, pagamenti e penali.' },
  { key: 'privacy', file: 'privacy.md', description: 'Come GLAMRO S.R.L. tratta i dati personali di clienti e professionisti: finalità, basi giuridiche, conservazione, fornitori e diritti.' },
  { key: 'cookie', file: 'cookie.md', description: 'Quali cookie e strumenti simili usa GLAMRO, a cosa servono e come gestire il consenso.' },
  { key: 'cancellazioni-rimborsi', file: 'cancellazioni-rimborsi-reclami.md', description: 'Cancellazioni, rimborsi e reclami su GLAMRO in breve, per clienti e professionisti.' },
];

const MONTHS = { gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6, luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12 };

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function parse(md) {
  const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) throw new Error('front matter mancante');
  const meta = Object.fromEntries(
    fm[1].split('\n').map((line) => {
      const i = line.indexOf(':');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  const lines = md.slice(fm[0].length).split('\n');
  const preamble = [];
  const sections = [];
  let blocks = preamble;
  const ids = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (!line.trim()) continue;

    if (line.startsWith('## ')) {
      const title = line.slice(3).trim();
      let id = slugify(title.replace(/^\d+\.\s*/, '')) || `sezione-${sections.length + 1}`;
      while (ids.has(id)) id += '-2';
      ids.add(id);
      blocks = [];
      sections.push({ id, title, blocks });
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith('#')) throw new Error(`titolo non previsto: ${line}`);

    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].trim());
        i++;
      }
      i--;
      const cells = (row) => row.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      if (!/^\|[\s:|-]+\|$/.test(rows[1] ?? '')) throw new Error(`tabella senza riga di separazione: ${rows[0]}`);
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      for (const r of body) if (r.length !== head.length) throw new Error(`tabella irregolare: ${r.join(' | ')}`);
      blocks.push({ type: 'table', caption: head.join(', '), head, rows: body });
      continue;
    }
    if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      i--;
      blocks.push({ type: 'list', items });
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      const start = Number(line.match(/^(\d+)\. /)[1]);
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, '').trim());
        i++;
      }
      i--;
      blocks.push({ type: 'olist', start, items });
      continue;
    }
    if (/^\s/.test(lines[i])) throw new Error(`riga indentata non prevista: ${line}`);
    blocks.push({ type: 'p', text: line.trim() });
  }

  const v = meta.subtitle.match(/Versione (\d+(?:\.\d+)?) · (\d{1,2}) (\p{L}+) (\d{4})/u);
  if (!v) throw new Error(`versione/data non trovate nel sottotitolo: ${meta.subtitle}`);
  const month = MONTHS[v[3].toLowerCase()];
  if (!month) throw new Error(`mese non riconosciuto: ${v[3]}`);
  const date = `${v[4]}-${String(month).padStart(2, '0')}-${v[2].padStart(2, '0')}`;
  return { meta, version: v[1], date, preamble, sections };
}

const docs = DOCS.map(({ key, file, description }) => {
  const { meta, version, date, preamble, sections } = parse(readFileSync(join(root, 'content/legal', file), 'utf8'));
  if (key === 'cookie') {
    // Pulsante dell'interfaccia (non è testo legale): apre il pannello «Gestisci cookie».
    const s = sections.find((x) => x.id.startsWith('come-gestire'));
    if (s) s.blocks.push({ type: 'manage-cookies' });
  }
  return {
    key,
    title: meta.title,
    description,
    version,
    effectiveDate: date,
    updatedAt: date,
    draft: 'LEGAL_DRAFT',
    intro: meta.subtitle,
    preamble,
    sections,
    previousVersions: [],
  };
});

const body = JSON.stringify(Object.fromEntries(docs.map((d) => [d.key, d])), null, 2).replace(/"draft": "LEGAL_DRAFT"/g, '"draft": LEGAL_DRAFT');

const out = `/**
 * Documenti legali di GLAMRO S.R.L. — FILE GENERATO, NON MODIFICARE A MANO.
 *
 * Sorgente: content/legal/*.md (testi ufficiali forniti da GLAMRO, riportati senza riscritture).
 * Rigenerare con: node tools/build-legal-docs.mjs
 *
 * Indirizzi: /termini, /termini-professionisti, /privacy, /cookie, /cancellazioni-rimborsi.
 */

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'olist'; start: number; items: string[] }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] }
  | { type: 'manage-cookies' };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  key: string;
  title: string;
  description: string;
  version: string;
  /** Data ISO di efficacia del testo. */
  effectiveDate: string | null;
  updatedAt: string;
  /** Testo non ancora approvato dal legale: la pagina mostra un avviso. */
  draft: boolean;
  /** Sottotitolo del documento (riferimenti normativi, versione, data). */
  intro: string;
  /** Blocchi prima della prima sezione. */
  preamble: LegalBlock[];
  sections: LegalSection[];
  previousVersions: { version: string; date: string; url: string }[];
}

/**
 * I testi v3 sono ancora in verifica legale. Mettere \`false\` quando l'avvocato li approva:
 * sparisce l'avviso in cima alle pagine.
 */
export const LEGAL_DRAFT = true;

export const LEGAL_DOCS: Record<string, LegalDocument> = ${body};


`;

writeFileSync(join(root, 'src/app/features/legal/legal-docs.ts'), out);
console.log(docs.map((d) => `${d.key}: v${d.version} ${d.effectiveDate}, ${d.sections.length} sezioni`).join('\n'));
