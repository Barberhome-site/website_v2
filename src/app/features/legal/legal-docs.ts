/**
 * Documents légaux (brief §14, §15, §16).
 *
 * ⚠️ STRUCTURE UNIQUEMENT. Le brief impose qu'un consulente legale approuve le texte final
 * (GDPR, Codice del consumo, DSA, Regolamento P2B). Les blocs `placeholder` indiquent ce qui
 * doit être rédigé. Chaque document a une version et une date d'efficacité ; les versions
 * précédentes doivent être archivées (liste `previousVersions`).
 *
 * Le lien vers la plateforme européenne ODR a été volontairement supprimé
 * (plateforme fermée depuis le 20 juillet 2025, Règlement UE 2024/3228).
 */

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'placeholder'; text: string }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] }
  | { type: 'cookie-table' }
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
  /** Date ISO d'entrée en vigueur ; null tant que le texte n'est pas approuvé. */
  effectiveDate: string | null;
  updatedAt: string;
  /** Brouillon non encore validé juridiquement. */
  draft: boolean;
  intro: string;
  sections: LegalSection[];
  previousVersions: { version: string; date: string; url: string }[];
}

const UPDATED = '2026-11-09';
const TBD = 'Da definire';

const privacy: LegalDocument = {
  key: 'privacy',
  title: 'Informativa privacy (sito e app)',
  description: 'Come GLAMRO tratta i dati personali di chi usa il sito e l\'app: finalità, basi giuridiche, conservazione e diritti.',
  version: '0.1',
  effectiveDate: null,
  updatedAt: UPDATED,
  draft: true,
  intro:
    'Questa informativa descrive i trattamenti di dati personali effettuati tramite il sito www.glamro.it e l\'app GLAMRO, separati per attività.',
  sections: [
    {
      id: 'titolare',
      title: 'Titolare del trattamento e contatti',
      blocks: [
        { type: 'placeholder', text: '[Ragione sociale, sede legale, P.IVA, email privacy, eventuale DPO e relativi contatti.]' },
      ],
    },
    {
      id: 'trattamenti',
      title: 'Trattamenti, finalità, basi giuridiche e conservazione',
      blocks: [
        { type: 'p', text: 'Per ogni attività indichiamo quali dati trattiamo, perché, su quale base giuridica e per quanto tempo.' },
        {
          type: 'table',
          caption: 'Trattamenti di dati personali',
          head: ['Attività', 'Dati', 'Finalità', 'Base giuridica', 'Conservazione'],
          rows: [
            ['Navigazione del sito', 'Dati tecnici, log, preferenze cookie', 'Funzionamento e sicurezza del sito', TBD, TBD],
            ['Statistiche (solo con consenso)', 'Identificativi pseudonimi, eventi di navigazione', 'Misurare l\'uso del sito', 'Consenso', TBD],
            ['Richieste di supporto', 'Nome, email, messaggio, codice prenotazione', 'Rispondere alle richieste', TBD, TBD],
            ['Account cliente', 'Dati di registrazione e profilo', 'Gestione dell\'account', TBD, TBD],
            ['Account professionista', 'Dati anagrafici, fiscali, profilo pubblico', 'Gestione dell\'account e del profilo', TBD, TBD],
            ['Prenotazione', 'Servizio, data, indirizzo del servizio, comunicazioni', 'Esecuzione della prenotazione', TBD, TBD],
            ['Pagamento', 'Dati di transazione (non i dati completi della carta)', 'Pagamenti, rimborsi, obblighi fiscali', TBD, TBD],
            ['Verifica dei professionisti', 'Documenti di identità e requisiti', 'Verifica prima della pubblicazione', TBD, TBD],
            ['Candidature professionisti', 'Dati di contatto, città, servizi, esperienza', 'Valutare la candidatura', TBD, TBD],
          ],
        },
        { type: 'placeholder', text: '[Sostituire «Da definire» con criteri concreti: evitare formule come «per il tempo necessario».]' },
      ],
    },
    {
      id: 'destinatari',
      title: 'Ruoli e destinatari',
      blocks: [
        {
          type: 'list',
          items: [
            'Professionisti: ricevono i dati necessari a eseguire la prenotazione accettata.',
            'Fornitore dei pagamenti.',
            'Fornitori di hosting e infrastruttura.',
            'Fornitori di analisi statistiche (solo con consenso).',
            'Strumenti di assistenza clienti.',
          ],
        },
        { type: 'placeholder', text: '[Indicare per ciascuno nome, ruolo (titolare autonomo / responsabile) e finalità.]' },
      ],
    },
    {
      id: 'trasferimenti',
      title: 'Trasferimenti fuori dallo Spazio economico europeo',
      blocks: [{ type: 'placeholder', text: '[Elencare i trasferimenti effettivi e le garanzie (decisione di adeguatezza, clausole contrattuali standard).]' }],
    },
    {
      id: 'app',
      title: 'Funzioni dell\'app',
      blocks: [
        { type: 'p', text: 'Questa sezione riguarda l\'app e non i cookie del sito.' },
        { type: 'placeholder', text: '[Documentare solo se effettivamente usati: geolocalizzazione, notifiche, fotocamera, libreria immagini, identificatori del dispositivo, SDK.]' },
      ],
    },
    {
      id: 'diritti',
      title: 'Diritti e come esercitarli',
      blocks: [
        {
          type: 'p',
          text: 'Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opporti al trattamento; puoi revocare il consenso in ogni momento e presentare reclamo al Garante per la protezione dei dati personali.',
        },
        { type: 'placeholder', text: '[Indicare canale e tempi di risposta.]' },
      ],
    },
  ],
  previousVersions: [],
};

const cookie: LegalDocument = {
  key: 'cookie-policy',
  title: 'Cookie policy',
  description: 'Quali cookie e tecnologie usa il sito GLAMRO, per quali finalità e come gestire o revocare il consenso.',
  version: '0.1',
  effectiveDate: null,
  updatedAt: UPDATED,
  draft: true,
  intro:
    'Il sito usa solo cookie tecnici necessari finché non esprimi una scelta. Statistiche e contenuti di terze parti si attivano solo con il tuo consenso.',
  sections: [
    {
      id: 'tecnologie',
      title: 'Tecnologie usate dal sito',
      blocks: [
        { type: 'p', text: 'Elenco delle tecnologie rilevate, con fornitore, dominio, finalità, categoria, durata e trasferimenti.' },
        { type: 'cookie-table' },
        { type: 'placeholder', text: '[Tabella da confermare con una scansione effettiva di tutte le pagine e integrazioni.]' },
      ],
    },
    {
      id: 'gestione',
      title: 'Come gestire o revocare il consenso',
      blocks: [
        {
          type: 'p',
          text: 'Puoi modificare le tue scelte o revocare il consenso in qualsiasi momento dal link «Gestisci cookie» presente nel footer di ogni pagina. Rifiutare non limita l\'uso del sito.',
        },
        { type: 'manage-cookies' },
        { type: 'p', text: 'Il consenso viene richiesto di nuovo dopo 6 mesi o quando l\'elenco delle tecnologie cambia.' },
      ],
    },
  ],
  previousVersions: [],
};

const customers: LegalDocument = {
  key: 'condizioni-clienti',
  title: 'Condizioni Clienti',
  description: 'Condizioni per i clienti GLAMRO: account, prenotazione, prezzo, pagamento, cancellazioni, rimborsi e reclami.',
  version: '0.1',
  effectiveDate: null,
  updatedAt: UPDATED,
  draft: true,
  intro: 'Queste condizioni regolano l\'uso di GLAMRO da parte dei clienti e la prenotazione dei servizi offerti dai professionisti.',
  sections: [
    { id: 'ruolo', title: 'Ruolo di GLAMRO', blocks: [{ type: 'placeholder', text: '[Chi conclude il contratto del servizio e quali obblighi assume GLAMRO come marketplace.]' }] },
    { id: 'account', title: 'Account', blocks: [{ type: 'placeholder', text: '[Requisiti, sicurezza delle credenziali, chiusura dell\'account.]' }] },
    {
      id: 'prenotazione',
      title: 'Prenotazione e informazioni precontrattuali',
      blocks: [
        { type: 'p', text: 'Prima della conferma vengono mostrati servizio, professionista, data, luogo, prezzo totale e condizioni di cancellazione.' },
        { type: 'placeholder', text: '[Accettazione tramite clickwrap con registrazione di versione, data, utente e timestamp.]' },
      ],
    },
    { id: 'prezzo', title: 'Prezzo e pagamento', blocks: [{ type: 'placeholder', text: '[Composizione del prezzo, imposte, eventuali costi aggiuntivi, tempi e modalità di pagamento.]' }] },
    { id: 'cancellazioni', title: 'Cancellazioni', blocks: [{ type: 'placeholder', text: '[Finestre, costi, ritardi, assenza del cliente, cancellazione o assenza del professionista.]' }] },
    { id: 'rimborsi', title: 'Rimborsi', blocks: [{ type: 'placeholder', text: '[Casi, tempi e modalità di rimborso.]' }] },
    { id: 'reclami', title: 'Qualità e reclami', blocks: [{ type: 'placeholder', text: '[Standard, prove richieste, escalation, tempi di risposta e rimedi.]' }] },
    { id: 'recesso', title: 'Diritto di recesso', blocks: [{ type: 'placeholder', text: '[Verificare l\'applicazione ai servizi prenotati e i consensi necessari.]' }] },
    { id: 'ordinamento', title: 'Ordinamento dei risultati', blocks: [{ type: 'placeholder', text: '[Parametri principali di ordinamento ed eventuali posizioni a pagamento.]' }] },
    { id: 'responsabilita', title: 'Responsabilità', blocks: [{ type: 'placeholder', text: '[Limitazioni applicabili nel rispetto del Codice del consumo.]' }] },
    {
      id: 'controversie',
      title: 'Risoluzione delle controversie',
      blocks: [{ type: 'placeholder', text: '[Procedura aggiornata: reclamo interno, eventuali organismi ADR, foro del consumatore. Nessun link alla piattaforma ODR, dismessa dal 20 luglio 2025.]' }],
    },
    { id: 'modifiche', title: 'Modifiche e versioni', blocks: [{ type: 'p', text: 'Le versioni precedenti sono archiviate e le modifiche rilevanti vengono comunicate prima dell\'entrata in vigore.' }] },
    { id: 'legge', title: 'Legge applicabile', blocks: [{ type: 'placeholder', text: '[Legge applicabile e foro competente.]' }] },
  ],
  previousVersions: [],
};

const professionals: LegalDocument = {
  key: 'condizioni-professionisti',
  title: 'Condizioni Professionisti',
  description: 'Condizioni per i professionisti GLAMRO: verifica, profilo, disponibilità, compensi, commissioni, standard e sospensione.',
  version: '0.1',
  effectiveDate: null,
  updatedAt: UPDATED,
  draft: true,
  intro: 'Queste condizioni regolano il rapporto tra GLAMRO e i professionisti che offrono servizi sulla piattaforma.',
  sections: [
    { id: 'onboarding', title: 'Onboarding e verifica', blocks: [{ type: 'placeholder', text: '[Documenti richiesti, requisiti per categoria, tempi di verifica.]' }] },
    { id: 'profilo', title: 'Profilo e disponibilità', blocks: [{ type: 'placeholder', text: '[Contenuti del profilo, aggiornamento della disponibilità, zone servite.]' }] },
    { id: 'prestazione', title: 'Prestazione e standard', blocks: [{ type: 'placeholder', text: '[Standard di servizio, igiene, puntualità, comportamento.]' }] },
    { id: 'compensi', title: 'Compensi e commissioni', blocks: [{ type: 'placeholder', text: '[Commissioni, eventuali costi, tempi e modalità di pagamento.]' }] },
    { id: 'cancellazioni', title: 'Cancellazioni', blocks: [{ type: 'placeholder', text: '[Regole per cancellazioni del professionista e del cliente.]' }] },
    { id: 'assicurazione', title: 'Assicurazione', blocks: [{ type: 'placeholder', text: '[Copertura assicurativa richiesta.]' }] },
    { id: 'ordinamento', title: 'Ordinamento e vantaggi a pagamento', blocks: [{ type: 'placeholder', text: '[Parametri principali di ordinamento e posizioni sponsorizzate (Regolamento P2B).]' }] },
    { id: 'reclami', title: 'Reclami e mediazione', blocks: [{ type: 'placeholder', text: '[Sistema interno di gestione dei reclami e mediatori (Regolamento P2B).]' }] },
    { id: 'sospensione', title: 'Sospensione e cessazione', blocks: [{ type: 'placeholder', text: '[Motivi, preavviso e motivazione (Regolamento P2B).]' }] },
    { id: 'modifiche', title: 'Modifiche e versioni', blocks: [{ type: 'p', text: 'Le modifiche vengono comunicate con il preavviso previsto e le versioni precedenti sono archiviate.' }] },
    { id: 'legge', title: 'Legge applicabile', blocks: [{ type: 'placeholder', text: '[Legge applicabile e foro competente.]' }] },
  ],
  previousVersions: [],
};

export const LEGAL_DOCS: Record<string, LegalDocument> = {
  privacy,
  'cookie-policy': cookie,
  'condizioni-clienti': customers,
  'condizioni-professionisti': professionals,
};

export const LEGAL_DOC_KEYS = Object.keys(LEGAL_DOCS);
