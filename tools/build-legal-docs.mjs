/**
 * Génère src/app/features/legal/legal-docs.ts à partir des textes officiels content/legal/*.md.
 *
 *   node tools/build-legal-docs.mjs
 *
 * Les textes ne se modifient JAMAIS dans le fichier généré : on remplace le .md fourni par GLAMRO et on
 * relance le script. Le script ne réécrit rien, il découpe seulement le Markdown en blocs :
 *   front matter (title, subtitle, draft, footer) · « ## » section · « ### » sous-titre ·
 *   paragraphe · liste « - » · liste numérotée « 1. » · tableau « | … | ».
 * Le gras (**texte**) reste dans le texte : la page le rend avec le pipe `rich`.
 * Toute autre syntaxe (titre « # », ligne indentée, tableau irrégulier…) arrête le script avec une erreur.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Clé = adresse italienne de la page. La description sert au SEO (155 caractères max). */
const DOCS = [
  {
    key: 'termini',
    file: 'termini-clienti.md',
    description: 'Termini e Condizioni per i clienti GLAMRO: prenotazione, prezzi, pagamenti, cancellazioni, rimborsi e reclami.',
  },
  {
    key: 'termini-professionisti',
    file: 'termini-professionisti.md',
    description: 'Termini e Condizioni per i professionisti GLAMRO: requisiti, prenotazioni, pagamenti, cancellazioni e penali.',
  },
  {
    key: 'privacy',
    file: 'privacy.md',
    description: 'Come GLAMRO S.R.L. tratta i dati personali di clienti e professionisti: finalità, basi giuridiche, conservazione e diritti.',
  },
  {
    key: 'cookie',
    file: 'cookie.md',
    description: 'Quali cookie e strumenti simili usa GLAMRO, a cosa servono e come gestire il consenso.',
  },
  {
    key: 'cancellazioni-rimborsi',
    file: 'cancellazioni-rimborsi-reclami.md',
    description: 'Cancellazioni, rimborsi e reclami su GLAMRO in breve, per clienti e professionisti.',
  },
];

const MONTHS = {
  gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6,
  luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12,
};

function fail(file, message) {
  throw new Error(`${file} : ${message}`);
}

/** Identifiant d'ancre ASCII à partir d'un titre (« 3. Ruolo di GLAMRO » → « ruolo-di-glamro »). */
function slugify(text) {
  return text
    .replace(/^\d+(\.\d+)*\.?\s*/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function parse(file, md) {
  const fm = md.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) fail(file, 'front matter manquant');
  const meta = {};
  for (const line of fm[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const k of ['title', 'subtitle', 'draft', 'footer']) {
    if (!meta[k]) fail(file, `champ « ${k} » manquant dans le front matter`);
  }

  const lines = md.replace(/\r\n/g, '\n').slice(fm[0].length).split('\n');
  const preamble = [];
  const sections = [];
  const ids = new Set();
  let blocks = preamble;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (!line.trim()) continue;
    if (/^\s/.test(line)) fail(file, `ligne indentée non prévue : « ${line.trim()} »`);

    if (line.startsWith('## ')) {
      const title = line.slice(3).trim();
      let id = slugify(title) || `sezione-${sections.length + 1}`;
      while (ids.has(id)) id += '-2';
      ids.add(id);
      blocks = [];
      sections.push({ id, title, blocks });
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() });
    } else if (line.startsWith('#')) {
      fail(file, `titre non prévu : « ${line} »`);
    } else if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim());
      i--;
      const cells = (row) => row.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      if (!/^\|[\s:|-]+\|$/.test(rows[1] ?? '')) fail(file, `tableau sans ligne de séparation : « ${rows[0]} »`);
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      for (const r of body) if (r.length !== head.length) fail(file, `ligne de tableau irrégulière : « ${r.join(' | ')} »`);
      blocks.push({ type: 'table', head, rows: body });
    } else if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].startsWith('- ')) items.push(lines[i++].slice(2).trim());
      i--;
      blocks.push({ type: 'list', items });
    } else if (/^\d+\. /.test(line)) {
      const start = Number(line.match(/^(\d+)\. /)[1]);
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, '').trim());
      i--;
      blocks.push({ type: 'olist', start, items });
    } else {
      blocks.push({ type: 'p', text: line.trim() });
    }
  }

  const v = meta.subtitle.match(/Versione (\d+(?:\.\d+)?) · (\d{1,2}) (\p{L}+) (\d{4})/u);
  if (!v) fail(file, `version et date introuvables dans le sous-titre : « ${meta.subtitle} »`);
  const month = MONTHS[v[3].toLowerCase()];
  if (!month) fail(file, `mois inconnu : « ${v[3]} »`);
  const date = `${v[4]}-${String(month).padStart(2, '0')}-${v[2].padStart(2, '0')}`;
  return { meta, version: v[1], date, preamble, sections };
}

const docs = DOCS.map(({ key, file, description }) => {
  if (description.length > 155) fail(file, 'description SEO de plus de 155 caractères');
  const { meta, version, date, preamble, sections } = parse(file, readFileSync(join(root, 'content/legal', file), 'utf8'));
  if (key === 'cookie') {
    // Élément d'interface, pas du texte légal : bouton qui ouvre le panneau « Gestisci cookie ».
    const manage = sections.find((s) => s.id.startsWith('come-gestire'));
    if (!manage) fail(file, 'section « Come gestire il consenso » introuvable (bouton Gestisci cookie)');
    manage.blocks.push({ type: 'manage-cookies' });
  }
  return {
    key,
    title: meta.title,
    footerLabel: meta.footer,
    description,
    version,
    effectiveDate: date,
    subtitle: meta.subtitle,
    draftNotice: meta.draft,
    preamble,
    sections,
  };
});

const out = `/**
 * Documents légaux de GLAMRO S.R.L. — FICHIER GÉNÉRÉ, NE PAS MODIFIER À LA MAIN.
 *
 * Source : content/legal/*.md (textes officiels fournis par GLAMRO, repris sans réécriture).
 * Régénérer avec : node tools/build-legal-docs.mjs
 */
import type { LegalDocument } from './legal-types';

export const LEGAL_DOCS: Record<string, LegalDocument> = ${JSON.stringify(Object.fromEntries(docs.map((d) => [d.key, d])), null, 2)};
`;

writeFileSync(join(root, 'src/app/features/legal/legal-docs.ts'), out);
console.log(docs.map((d) => `${d.key} : v${d.version} du ${d.effectiveDate}, ${d.sections.length} sections`).join('\n'));
