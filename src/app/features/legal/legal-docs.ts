/**
 * Documents légaux de GLAMRO S.R.L.
 *
 * Textes repris à l'identique des documents en vigueur (PDF fournis le 22/11/2026), sauf :
 *  - Cookie policy, § 3 : remplacé par la liste réelle des technologies du site (cookie-inventory.ts),
 *    car le nouveau site n'utilise ni Meta Ads ni Google Ads ;
 *  - signatures et « dichiarazione di presa visione » (sans objet sur une page web) retirées.
 * Les documents seront remplacés par la version validée par le conseil juridique.
 *
 * ⚠️ Les Termini e Condizioni et la Policy reclami citent la plateforme européenne ODR, fermée
 * depuis le 20 juillet 2025 (Règlement UE 2024/3228) : à corriger dans la prochaine version.
 * Chaque document a une version et une date d'entrée en vigueur ; les versions précédentes
 * doivent être archivées (liste `previousVersions`).
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

const UPDATED = '2026-11-22';
const COMPANY = 'GLAMRO S.R.L., con sede legale in Via Matteotti n. 54, 60121 – Ancona (AN), P. IVA/C.F. 03036060428, iscrizione REA AN-267591, capitale sociale € 7.000,00 i.v. – Email: contact@glamro.it – PEC: glamrosrl@ionospec.it – Tel. +39 392 366 1225.';

const privacy: LegalDocument = {
  key: 'privacy',
  title: 'Informativa sul trattamento dei dati personali',
  description: 'Come GLAMRO S.R.L. tratta i dati personali degli utenti: dati trattati, finalità, basi giuridiche, conservazione, destinatari e diritti.',
  version: '1.0',
  effectiveDate: null,
  updatedAt: UPDATED,
  draft: false,
  intro: 'Informativa ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 («GDPR»). I dati personali degli utenti sono trattati con le modalità e per le finalità indicate di seguito.',
  sections: [
    { id: 'titolare', title: 'Titolare del trattamento', blocks: [{ type: 'p', text: COMPANY }] },
    {
      id: 'dati',
      title: 'Categorie di dati trattati',
      blocks: [
        {
          type: 'list',
          items: [
            'Dati anagrafici e di contatto (nome, cognome, email, telefono);',
            'Dati di pagamento e fatturazione;',
            'Cronologia di prenotazioni e servizi fruiti;',
            'Dati di geolocalizzazione (per i servizi on-demand);',
            'Dati di navigazione tramite cookie (v. Cookie Policy);',
            'Eventuali ulteriori dati forniti volontariamente dall’utente.',
          ],
        },
      ],
    },
    {
      id: 'finalita',
      title: 'Finalità del trattamento e basi giuridiche',
      blocks: [
        {
          type: 'table',
          caption: 'Finalità e basi giuridiche',
          head: ['Finalità', 'Descrizione', 'Base giuridica'],
          rows: [
            ['A. Finalità contrattuali e precontrattuali', 'Registrazione, prenotazioni, gestione account, fatturazione.', 'Art. 6.1.b GDPR.'],
            ['B. Geolocalizzazione (servizi on-demand)', 'Identificare la posizione dell’utente per individuare i professionisti disponibili.', 'Art. 6.1.a GDPR – consenso esplicito dell’interessato.'],
            ['C. Marketing diretto', 'Invio di comunicazioni promozionali (email, SMS, notifiche push). Revocabile in qualsiasi momento.', 'Art. 6.1.a GDPR – consenso esplicito.'],
            ['D. Adempimento obblighi di legge', 'Obblighi fiscali, contabili, richieste delle autorità.', 'Art. 6.1.c GDPR.'],
            ['E. Tutela giudiziaria', 'Difesa di diritti in sede giudiziaria.', 'Art. 6.1.f GDPR – legittimo interesse del Titolare.'],
          ],
        },
      ],
    },
    {
      id: 'modalita',
      title: 'Modalità di trattamento',
      blocks: [{ type: 'p', text: 'Il trattamento avviene in modalità elettronica e cartacea, con misure tecniche e organizzative idonee alla protezione dei dati, nel rispetto dei principi di liceità, correttezza, trasparenza, minimizzazione e integrità.' }],
    },
    {
      id: 'conservazione',
      title: 'Conservazione dei dati',
      blocks: [
        {
          type: 'list',
          items: [
            'Finalità contrattuali: durata del contratto + 10 anni;',
            'Marketing: fino a revoca del consenso, massimo 24 mesi;',
            'Obblighi di legge: secondo termini normativi.',
          ],
        },
      ],
    },
    {
      id: 'destinatari',
      title: 'Destinatari dei dati',
      blocks: [
        { type: 'p', text: 'I dati potranno essere comunicati a:' },
        {
          type: 'list',
          items: [
            'Personale autorizzato del Titolare;',
            'Professionisti partner (autonomi titolari);',
            'Fornitori di servizi IT, hosting, pagamenti;',
            'Consulenti fiscali e legali;',
            'Altri Responsabili esterni del trattamento, formalmente nominati ai sensi dell’art. 28 GDPR.',
          ],
        },
        { type: 'p', text: 'I dati non saranno diffusi. In caso di trasferimento verso Paesi extra-UE, saranno adottate le garanzie previste dagli artt. 44 ss. GDPR (es. Clausole Contrattuali Standard).' },
      ],
    },
    {
      id: 'google-calendar',
      title: 'Google Calendar (Google API Services)',
      blocks: [
        { type: 'p', text: 'L’App può integrarsi con Google Calendar per la gestione degli appuntamenti. Il trattamento dei dati attraverso le API Google avviene nel rispetto delle Google API Services User Data Policy, incluse le norme di Limited Use.' },
      ],
    },
    {
      id: 'diritti',
      title: 'Diritti dell’interessato (artt. 15–22 GDPR)',
      blocks: [
        { type: 'p', text: 'L’interessato ha diritto di:' },
        {
          type: 'list',
          items: [
            'Accesso, rettifica, cancellazione;',
            'Limitazione e opposizione al trattamento;',
            'Portabilità dei dati;',
            'Revoca del consenso (senza pregiudicare la liceità del trattamento effettuato prima della revoca);',
            'Proporre reclamo al Garante Privacy: www.garanteprivacy.it',
          ],
        },
      ],
    },
    {
      id: 'conferimento',
      title: 'Natura del conferimento',
      blocks: [
        { type: 'p', text: 'Il conferimento dei dati è:' },
        { type: 'list', items: ['Obbligatorio per finalità contrattuali e di legge;', 'Facoltativo per marketing e geolocalizzazione.'] },
      ],
    },
    {
      id: 'dpo',
      title: 'Responsabile della protezione dei dati (DPO)',
      blocks: [{ type: 'p', text: 'GLAMRO non ha nominato un DPO, non ricorrendo ai casi previsti dall’art. 37 GDPR.' }],
    },
    {
      id: 'cookie',
      title: 'Cookie policy',
      blocks: [{ type: 'p', text: 'Per maggiori dettagli sui cookie, consultare l’informativa aggiornata nella pagina Cookie policy.' }],
    },
    {
      id: 'modifiche',
      title: 'Modifiche all’informativa',
      blocks: [{ type: 'p', text: 'Eventuali modifiche saranno pubblicate su www.glamro.it e/o notificate via App.' }],
    },
  ],
  previousVersions: [],
};

const cookie: LegalDocument = {
  key: 'cookie-policy',
  title: 'Informativa estesa sull’uso dei Cookie (Cookie Policy)',
  description: 'Quali cookie e tecnologie usa il sito GLAMRO, per quali finalità e come gestire o revocare il consenso.',
  version: '1.0',
  effectiveDate: '2026-03-01',
  updatedAt: UPDATED,
  draft: false,
  intro: 'Riferimento: Provvedimento Garante Privacy 8 maggio 2014 e GDPR UE 2016/679. Titolare: GLAMRO S.R.L., Via Matteotti n. 54, 60121 Ancona (AN), contact@glamro.it.',
  sections: [
    {
      id: 'cosa-sono',
      title: 'Cosa sono i cookie',
      blocks: [
        { type: 'p', text: 'I cookie sono piccoli file di testo che i siti visitati inviano al terminale dell’Utente, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie consentono al sito di riconoscere l’Utente e memorizzarne preferenze o credenziali di accesso.' },
        { type: 'p', text: 'Esistono anche cookie di terze parti, installati da siti differenti tramite elementi incorporati (es. banner, video, mappe, social plugin).' },
      ],
    },
    {
      id: 'tipologie',
      title: 'Tipologie di cookie',
      blocks: [
        { type: 'p', text: 'In base alla durata:' },
        { type: 'list', items: ['Cookie di sessione: cancellati alla chiusura del browser;', 'Cookie persistenti: restano memorizzati fino alla scadenza preimpostata o cancellazione manuale.'] },
        { type: 'p', text: 'In base alla funzione:' },
        {
          type: 'list',
          items: [
            'Cookie tecnici e funzionali: permettono il corretto utilizzo del sito e delle sue funzionalità (es. carrello, login). Non richiedono consenso.',
            'Cookie di profilazione: monitorano la navigazione per offrire pubblicità personalizzate (es. annunci mirati). Richiedono consenso esplicito tramite banner.',
            'Cookie di terze parti: possono essere installati da soggetti terzi per finalità tecniche, statistiche o di profilazione. L’utilizzo e la gestione sono soggetti alle rispettive privacy policy.',
          ],
        },
      ],
    },
    {
      id: 'tecnologie',
      title: 'Cookie e tecnologie usati da questo sito',
      blocks: [
        { type: 'p', text: 'Il sito usa solo le tecnologie necessarie finché non esprimi una scelta. Statistiche (Google Analytics) e contenuti di terze parti si attivano solo con il tuo consenso. Elenco completo, con fornitore, dominio, finalità, categoria, durata e trasferimenti:' },
        { type: 'cookie-table' },
      ],
    },
    {
      id: 'gestione',
      title: 'Gestione dei cookie',
      blocks: [
        { type: 'p', text: 'Puoi modificare le tue scelte o revocare il consenso in qualsiasi momento dal link «Gestisci cookie» presente nel footer di ogni pagina. Rifiutare non limita l’uso del sito.' },
        { type: 'manage-cookies' },
        { type: 'p', text: 'L’Utente può gestire i cookie anche tramite le impostazioni del browser:' },
        {
          type: 'list',
          items: [
            'Google Chrome: https://support.google.com/chrome/answer/95647',
            'Mozilla Firefox: https://support.mozilla.org/it/kb/Gestione%20dei%20cookie',
            'Apple Safari: https://support.apple.com/it-it/HT201265',
            'Microsoft Edge: https://support.microsoft.com/it-it/help/4027947/microsoft-edge-delete-cookies',
          ],
        },
        { type: 'p', text: 'Per disattivare singolarmente i cookie di profilazione, visitare: www.youronlinechoices.com/it/' },
      ],
    },
  ],
  previousVersions: [],
};

const customers: LegalDocument = {
  key: 'condizioni-clienti',
  title: 'Condizioni Generali di Servizio, Vendita e Utilizzo della Piattaforma (T&C)',
  description: 'Condizioni generali GLAMRO: prenotazione dei servizi, cancellazioni, ritardi, e-commerce, pagamenti, responsabilità e foro competente.',
  version: '1.0',
  effectiveDate: '2026-03-15',
  updatedAt: UPDATED,
  draft: false,
  intro: 'Le presenti condizioni generali di servizio e vendita («Condizioni Generali») disciplinano: (i) la prenotazione e l’acquisto – tramite la piattaforma web www.glamro.it e l’applicazione mobile GLAMRO (congiuntamente, la «Piattaforma») di cui è titolare la società GLAMRO S.R.L. (la «Società») – dei servizi beauty offerti da professionisti terzi («Servizi»); (ii) la vendita diretta di prodotti, cosmetici, gift card e beni offerti dalla Società nella sezione E-commerce («Prodotti»); (iii) l’utilizzo della Piattaforma stessa.',
  sections: [
    { id: 'societa', title: 'Società', blocks: [{ type: 'p', text: COMPANY }] },
    {
      id: 'accettazione',
      title: 'Accettazione delle condizioni',
      blocks: [
        {
          type: 'list',
          items: [
            '1.1. L’utilizzo della Piattaforma implica l’accettazione integrale delle presenti Condizioni. L’accettazione avviene tramite procedura «point and click» al momento della registrazione o dell’acquisto.',
            '1.2. Il contratto è archiviato digitalmente sui server della Società ed è accessibile, previa richiesta, da parte dell’Utente.',
            '1.3. Le fasi tecniche per la conclusione del contratto prevedono: selezione del Servizio o Prodotto, accesso/registrazione, inserimento dati richiesti, accettazione T&C e conferma dell’ordine.',
            '1.4. L’Utente ha la possibilità di correggere eventuali errori prima dell’invio dell’ordine.',
            '1.5. La lingua disponibile per la conclusione del contratto è l’italiano.',
          ],
        },
      ],
    },
    {
      id: 'servizio',
      title: 'Descrizione del servizio (modello marketplace)',
      blocks: [
        {
          type: 'list',
          items: [
            '2.1. GLAMRO agisce come intermediario tecnologico (tramite piattaforma tecnologica) mettendo in contatto la domanda degli Utenti con l’offerta dei Professionisti.',
            '2.2. Il contratto di prestazione del Servizio di bellezza intercorre esclusivamente tra il Cliente e il Professionista. GLAMRO non è responsabile dell’esecuzione materiale del trattamento (es. qualità del taglio), ma solo del funzionamento dell’App e della gestione dei pagamenti.',
          ],
        },
      ],
    },
    {
      id: 'definizioni',
      title: 'Definizioni',
      blocks: [
        {
          type: 'list',
          items: [
            '«Cliente/Utente»: qualsiasi persona fisica o giuridica che si registra sulla Piattaforma per acquistare Servizi o Prodotti.',
            '«Professionista/Partner»: barbieri, parrucchieri, estetiste e operatori del benessere che, registrati sulla Piattaforma, forniscono i Servizi ai Clienti in autonomia operativa.',
            '«Servizio»: i servizi di beauty on-demand (es. taglio, barba, piega, trattamenti) offerti dai Professionisti.',
            '«Prodotti»: i beni fisici (shampoo, creme, accessori) venduti direttamente da GLAMRO tramite lo shop in-App.',
          ],
        },
      ],
    },
    {
      id: 'registrazione',
      title: 'Registrazione e sicurezza',
      blocks: [
        {
          type: 'list',
          items: [
            '3.1. Per utilizzare l’App è necessaria la registrazione. L’Utente è responsabile della custodia delle credenziali.',
            '3.2. La Società si riserva il diritto di sospendere l’account in caso di violazioni, uso improprio, o comportamenti scorretti verso i Professionisti.',
          ],
        },
      ],
    },
    {
      id: 'cancellazioni',
      title: 'Prenotazione servizi e politiche di cancellazione',
      blocks: [
        { type: 'p', text: '4.1. Cancellazione:' },
        {
          type: 'list',
          items: [
            'Entro 24 ore: cancellazione gratuita. L’importo viene rimborsato o riaccreditato come credito in App.',
            'Meno di 24 ore (Late Cancel): nessun rimborso. Viene addebitata una penale pari al 100% del valore del servizio per compensare il mancato guadagno del Professionista.',
            'Forza Maggiore: solo in caso di comprovata forza maggiore (documentabile), la Società potrà, a sua discrezione, emettere un voucher pari al 50% dell’importo.',
          ],
        },
        { type: 'p', text: '4.2. Ritardi e No-Show (Reciprocità):' },
        {
          type: 'list',
          items: [
            'Ritardo del Professionista: il Cliente attende 20 minuti. Oltre tale termine, può riprogrammare o ottenere il rimborso integrale.',
            'Ritardo del Cliente: il Professionista attende 20 minuti. Oltre tale termine, l’appuntamento salta e viene addebitato il 100% del costo (No-Show).',
          ],
        },
      ],
    },
    {
      id: 'e-commerce',
      title: 'E-commerce: vendita di prodotti',
      blocks: [
        {
          type: 'list',
          items: [
            '5.1. Gli acquisti di Prodotti fisici (es. creme, lozioni) sono venduti direttamente da GLAMRO S.R.L.',
            '5.2. Spedizioni: i prodotti vengono spediti all’indirizzo indicato. I tempi di consegna sono stime indicative.',
            '5.3. Diritto di Recesso (Prodotti): il Cliente ha 14 giorni dalla ricezione per rendere i prodotti, scrivendo a contact@glamro.it.',
            '5.4. Esclusione Recesso (Igiene): ai sensi dell’art. 59 del Codice del Consumo, non si accettano resi di cosmetici o prodotti sigillati che siano stati aperti, per motivi igienici e di tutela della salute.',
          ],
        },
      ],
    },
    {
      id: 'pagamenti',
      title: 'Pagamenti',
      blocks: [
        {
          type: 'list',
          items: [
            '6.1. I pagamenti avvengono tramite App (Carta di Credito, Apple Pay, Google Pay).',
            '6.2. No Contanti: non sono accettati pagamenti in contanti diretti al Professionista per i servizi prenotati, salvo mance facoltative. GLAMRO incassa in nome e per conto del Professionista.',
          ],
        },
      ],
    },
    {
      id: 'responsabilita',
      title: 'Limitazioni di responsabilità',
      blocks: [
        { type: 'p', text: '7.1. La Società non è responsabile per:' },
        {
          type: 'list',
          items: [
            'Danni fisici, reazioni allergiche o insoddisfazione estetica derivanti dal Servizio del Professionista.',
            'Malfunzionamenti dell’App dovuti a cause di forza maggiore o bug.',
            'Ritardi dei Professionisti dovuti al traffico o imprevisti.',
          ],
        },
        { type: 'p', text: '7.2. L’Utente manleva GLAMRO da qualsiasi pretesa risarcitoria connessa all’operato del Professionista.' },
      ],
    },
    {
      id: 'eta',
      title: 'Requisiti di età',
      blocks: [{ type: 'p', text: '8.1. I servizi sono riservati ai maggiorenni. I minori possono usufruirne solo sotto supervisione di un genitore o tutore.' }],
    },
    {
      id: 'modifiche',
      title: 'Modifiche e cessione',
      blocks: [
        {
          type: 'list',
          items: [
            '9.1. La Società può modificare queste Condizioni in ogni momento, notificandolo via App.',
            '9.2. GLAMRO può cedere il presente contratto a terzi (es. in caso di exit o acquisizione della Società) senza pregiudizio per i diritti dell’Utente.',
          ],
        },
      ],
    },
    {
      id: 'legge',
      title: 'Legge applicabile e foro competente',
      blocks: [
        {
          type: 'list',
          items: [
            '10.1. Legge Italiana.',
            '10.2. Foro Competente: per i Consumatori, foro di residenza del Consumatore; per Clienti Business/Professionisti (B2B), foro esclusivo di Ancona.',
            '10.3. Ai sensi del Regolamento UE 524/2013, si informa che la Commissione Europea mette a disposizione una piattaforma per la risoluzione online delle controversie (ODR), disponibile al seguente link: https://ec.europa.eu/consumers/odr.',
          ],
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy',
      blocks: [{ type: 'p', text: '11.1. Il trattamento dei dati personali avviene nel rispetto del Regolamento UE 2016/679 (GDPR) e del D. Lgs. 196/2003 come novellato. L’Utente è invitato a consultare l’Informativa Privacy completa disponibile sul sito www.glamro.it/privacy.' }],
    },
    {
      id: 'approvazione',
      title: 'Approvazione specifica (artt. 1341 e 1342 c.c.)',
      blocks: [
        { type: 'p', text: 'Ai sensi degli artt. 1341 e 1342 del Codice Civile, l’Utente dichiara di approvare specificamente le seguenti clausole: Premesse (Limitazione responsabilità); Art. 2.2 (GLAMRO come mero intermediario, esclusione responsabilità sui servizi); Art. 3.2 (Sospensione account senza preavviso); Art. 4 (Penali del 100% per cancellazione tardiva e No-Show); Art. 7 (Limitazioni generali di responsabilità e manleva); Art. 10.2 (Deroga al foro competente per utenti Business).' },
      ],
    },
  ],
  previousVersions: [],
};

const rules: LegalDocument = {
  key: 'regolamento-piattaforma',
  title: 'Regolamento della piattaforma e codice di condotta',
  description: 'Regole di comportamento, qualità e utilizzo della piattaforma GLAMRO per professionisti e clienti.',
  version: '1.0',
  effectiveDate: '2026-03-01',
  updatedAt: UPDATED,
  draft: false,
  intro: 'Regolamento adottato ai sensi del rapporto contrattuale tra GLAMRO S.R.L. e gli utenti della piattaforma.',
  sections: [
    { id: 'ambito', title: 'Ambito di applicazione', blocks: [{ type: 'p', text: 'Il presente Regolamento disciplina le regole di comportamento, qualità e utilizzo corretto della Piattaforma GLAMRO, da parte sia dei Professionisti che dei Clienti registrati.' }] },
    {
      id: 'professionisti',
      title: 'Professionisti: standard di qualità e comportamento',
      blocks: [
        {
          type: 'list',
          items: [
            '2.1 Comportamento professionale. Il Professionista si impegna ad eseguire il servizio prenotato con puntualità, cortesia, attenzione alla pulizia e cura del cliente, nel pieno rispetto della normativa igienico-sanitaria vigente.',
            '2.2 Divisa e attrezzatura. È obbligatorio presentarsi con abbigliamento professionale decoroso e in ordine. L’uso di indumenti inadeguati (es. indumenti sportivi, canottiere, calzature aperte) o privi del logo identificativo, ove fornito, può comportare sanzioni. Gli strumenti di lavoro devono essere perfettamente igienizzati.',
            '2.3 Igiene personale. Il Professionista è tenuto a rispettare i protocolli igienico-sanitari, avere mani e unghie curate e utilizzare dispositivi monouso ove previsto.',
            '2.4 Comportamento verso il Cliente. Sono vietati atteggiamenti confidenziali, linguaggio volgare, riferimenti sessuali o richieste inopportune. È ammesso solo un tono professionale e cordiale.',
          ],
        },
      ],
    },
    { id: 'glamscore', title: 'Sistema di valutazione (GlamScore)', blocks: [{ type: 'p', text: 'GLAMRO utilizza un sistema di punteggio interno che premia la qualità e la professionalità dei Partner (GlamScore). Le recensioni, puntualità, correttezza e richiami disciplinari influenzano il mantenimento o la sospensione dell’account.' }] },
    {
      id: 'puntualita',
      title: 'Puntualità, ritardi e cancellazioni',
      blocks: [
        {
          type: 'list',
          items: [
            '4.1 Prenotazioni. Il Professionista deve confermare ogni prenotazione ricevuta. In caso di impossibilità a svolgere il servizio, deve comunicarlo tramite piattaforma almeno 24h prima.',
            '4.2 Ritardi. Il Professionista è tenuto a presentarsi puntualmente. Il Cliente attende massimo 20 minuti. Analogamente, se il Cliente ritarda oltre 20 minuti, il Professionista può considerare l’appuntamento come «no-show» e addebitare l’importo previsto.',
            '4.3 Disdette. Disdetta entro 24 ore: nessuna penale; disdetta sotto le 24 ore: penale 100%; ritardi superiori a 20 minuti: equiparati a mancata presentazione.',
          ],
        },
      ],
    },
    {
      id: 'sanzioni',
      title: 'Sanzioni disciplinari (Partner)',
      blocks: [
        { type: 'p', text: 'Violazioni reiterate del presente Regolamento comportano:' },
        { type: 'list', items: ['Avviso scritto;', 'Sospensione temporanea dell’account;', 'Cancellazione definitiva.'] },
        { type: 'p', text: 'GLAMRO si riserva di valutare caso per caso, anche in base al GlamScore, alla gravità della violazione e al numero di episodi segnalati.' },
      ],
    },
    {
      id: 'clienti',
      title: 'Clienti: comportamento e regole di utilizzo',
      blocks: [
        {
          type: 'list',
          items: [
            '6.1 Puntualità e rispetto reciproco. Il Cliente è tenuto a rispettare gli orari stabiliti e a comportarsi con educazione e rispetto verso i Professionisti. Ritardi superiori a 20 minuti comportano la perdita del servizio prenotato e l’addebito dell’importo.',
            '6.2 Comportamenti scorretti. Sono vietati linguaggi offensivi, gesti o allusioni sessuali, molestie o richieste inappropriate. Il Professionista ha diritto di interrompere il servizio immediatamente in caso di comportamento minaccioso o lesivo della propria dignità o sicurezza, senza obbligo di rimborso.',
            '6.3 Recensioni. Le recensioni devono essere veritiere, formulate in buona fede e coerenti con la prestazione ricevuta. GLAMRO si riserva di rimuovere recensioni ingiuriose, offensive o false.',
          ],
        },
      ],
    },
    { id: 'scavalcamento', title: 'Divieto di scavalcamento', blocks: [{ type: 'p', text: 'È fatto assoluto divieto di concordare prestazioni al di fuori della Piattaforma GLAMRO tra Clienti e Professionisti. Tali comportamenti costituiscono causa di risoluzione immediata del contratto ex art. 1456 c.c., oltre a eventuali sanzioni economiche.' }] },
    { id: 'chat', title: 'Chat interna', blocks: [{ type: 'p', text: 'Le comunicazioni tra Professionista e Cliente devono avvenire esclusivamente tramite la chat interna all’App. Tutte le conversazioni sono registrate e archiviate per garantire la sicurezza degli utenti e tutelare GLAMRO in caso di contestazioni o abusi.' }] },
    { id: 'modifiche', title: 'Modifiche al Regolamento', blocks: [{ type: 'p', text: 'Il presente Regolamento può essere aggiornato da GLAMRO con preavviso mediante notifica in App o pubblicazione sul sito. Gli Utenti sono tenuti a prenderne visione regolarmente.' }] },
  ],
  previousVersions: [],
};

const complaints: LegalDocument = {
  key: 'policy-reclami',
  title: 'Policy di gestione reclami e risoluzione controversie',
  description: 'Come presentare un reclamo a GLAMRO: canali, termini, elementi richiesti, criteri di valutazione e modalità di rimborso.',
  version: '1.0',
  effectiveDate: '2026-03-01',
  updatedAt: UPDATED,
  draft: false,
  intro: 'Allegato A ai Termini e Condizioni Generali.',
  sections: [
    { id: 'principi', title: 'Principi generali', blocks: [{ type: 'p', text: 'GLAMRO S.R.L., in qualità di gestore della piattaforma tecnologica, si impegna a garantire la corretta intermediazione tra Clienti e Professionisti. In considerazione della natura personale e soggettiva dei servizi di bellezza, la presente Policy definisce limiti, modalità e tempistiche per la presentazione dei reclami, nel rispetto delle regole di buona fede contrattuale.' }] },
    {
      id: 'canali',
      title: 'Canali ufficiali di reclamo',
      blocks: [
        { type: 'p', text: 'I reclami sono accettati esclusivamente tramite canali ufficiali:' },
        { type: 'list', items: ['Ticket in-App (sezione «Assistenza Ordine»);', 'Email all’indirizzo: support@glamro.it'] },
        { type: 'p', text: 'Le segnalazioni via social, contatti privati o canali non tracciabili non sono prese in considerazione.' },
      ],
    },
    {
      id: 'tempistiche',
      title: 'Tempistiche per la presentazione',
      blocks: [
        {
          type: 'table',
          caption: 'Termini per i reclami',
          head: ['Tipo di reclamo', 'Termine massimo'],
          rows: [
            ['Servizi (trattamenti beauty)', 'Entro 24h dal termine dell’appuntamento'],
            ['Danni da trasporto (prodotti)', 'Entro 24h dalla consegna (con riserva)'],
            ['Difetti di conformità / guasti', 'Entro 2 mesi dalla scoperta del difetto'],
            ['Prodotti mancanti', 'Entro 3 giorni dalla ricezione'],
          ],
        },
        { type: 'p', text: 'Reclami tardivi non possono essere presi in carico.' },
      ],
    },
    {
      id: 'elementi',
      title: 'Elementi obbligatori del reclamo',
      blocks: [
        { type: 'p', text: 'Ogni reclamo deve contenere:' },
        {
          type: 'list',
          items: [
            'Numero identificativo dell’ordine o prenotazione;',
            'Descrizione dettagliata del problema riscontrato;',
            'Eventuale documentazione fotografica – Servizi: foto del risultato, eventuali anomalie visibili; Prodotti: pacco danneggiato, articolo errato o mancante.',
          ],
        },
        { type: 'p', text: 'In mancanza di elementi oggettivi, GLAMRO si riserva di archiviare il reclamo senza ulteriori riscontri.' },
      ],
    },
    {
      id: 'tipologie',
      title: 'Tipologie di reclamo e criteri di valutazione',
      blocks: [
        {
          type: 'list',
          items: [
            'A) Servizi non conformi o dannosi. In caso di prestazioni evidentemente difformi da quanto prenotato (es. errore tecnico grave, danno documentato, mancato rispetto delle norme igieniche), GLAMRO avvia una verifica interna. Se accertata la responsabilità del Professionista, l’importo potrà essere rimborsato totalmente o parzialmente sotto forma di credito Wallet.',
            'B) Mancata esecuzione per assenza del Professionista (no-show). Il Cliente ha diritto a rimborso integrale automatico e, a discrezione della Società, a un credito compensativo.',
            'C) Prodotto danneggiato o non consegnato. È previsto rimborso o sostituzione, secondo disponibilità.',
            'D) Insoddisfazione soggettiva. GLAMRO opera esclusivamente come piattaforma intermediaria e non può garantire il gradimento estetico del servizio ricevuto. Nei casi in cui il servizio sia stato eseguito in modo tecnicamente corretto e senza violazioni evidenti, non è previsto alcun rimborso per motivazioni di gusto personale o preferenze soggettive. Eventuali gesti commerciali (es. coupon, sconto) potranno essere concessi solo su base discrezionale e senza riconoscimento di responsabilità.',
          ],
        },
      ],
    },
    {
      id: 'rimborso',
      title: 'Modalità di rimborso',
      blocks: [
        {
          type: 'list',
          items: [
            'Credito Glamro (Wallet) – accredito rapido e riutilizzabile per nuovi servizi/prodotti.',
            'Riaccredito monetario – su metodo di pagamento originario (entro 5–10 giorni lavorativi).',
          ],
        },
      ],
    },
    { id: 'odr', title: 'Risoluzione stragiudiziale (ODR)', blocks: [{ type: 'p', text: 'Per i Clienti consumatori residenti in UE è attivo il servizio ODR della Commissione Europea: https://ec.europa.eu/consumers/odr/' }] },
    { id: 'abuso', title: 'Abuso del diritto di reclamo', blocks: [{ type: 'p', text: 'GLAMRO si riserva di sospendere o disattivare l’account degli Utenti che presentano reclami infondati, seriali o con intento fraudolento (refund scamming). In tali casi potranno essere attivate azioni legali per recupero delle somme indebitamente percepite.' }] },
  ],
  previousVersions: [],
};

const hygiene: LegalDocument = {
  key: 'disclaimer-igienico-sanitario',
  title: 'Disclaimer igienico-sanitario e di sicurezza',
  description: 'Obblighi informativi, responsabilità e condizioni di sicurezza igienico-sanitaria dei servizi resi tramite GLAMRO.',
  version: '1.0',
  effectiveDate: '2026-03-01',
  updatedAt: UPDATED,
  draft: false,
  intro: 'Il presente documento regola gli obblighi informativi, le responsabilità e le condizioni relative alla sicurezza igienico-sanitaria dei servizi resi tramite la piattaforma GLAMRO.',
  sections: [
    { id: 'natura', title: 'Natura del servizio', blocks: [{ type: 'p', text: 'GLAMRO opera come piattaforma digitale che mette in contatto Clienti e Professionisti nel settore dei servizi estetici, barberia, acconciatura e benessere. GLAMRO non effettua direttamente trattamenti, ma si limita a facilitare la prenotazione e il pagamento degli stessi, agendo come intermediario tecnico.' }] },
    {
      id: 'idoneita',
      title: 'Idoneità fisica e salute del cliente',
      blocks: [
        { type: 'p', text: '2.1 Il Cliente dichiara sotto la propria responsabilità di essere in condizioni fisiche e igienico-sanitarie compatibili con il trattamento richiesto.' },
        { type: 'p', text: '2.2 GLAMRO e il Professionista non possono essere ritenuti responsabili per esiti dannosi derivanti da:' },
        { type: 'list', items: ['allergie, patologie cutanee o condizioni mediche pregresse non dichiarate;', 'uso recente di farmaci o trattamenti estetici incompatibili;', 'stato di gravidanza, se non comunicato anticipatamente.'] },
        { type: 'p', text: '2.3 Il Cliente ha l’obbligo di aggiornare tempestivamente, anche a ogni prenotazione, le informazioni rilevanti per la sicurezza del trattamento.' },
      ],
    },
    {
      id: 'ambiente',
      title: 'Ambiente di erogazione (on-demand)',
      blocks: [
        {
          type: 'list',
          items: [
            '3.1 Nei servizi a domicilio, il Cliente garantisce che l’ambiente messo a disposizione sia pulito, sicuro e igienicamente idoneo.',
            '3.2 In caso di condizioni ambientali inadeguate (es. animali liberi, mancanza di luce/spazio/igiene), il Professionista può rifiutare la prestazione senza diritto a rimborso da parte del Cliente.',
          ],
        },
      ],
    },
    {
      id: 'strumenti',
      title: 'Dotazioni e strumenti',
      blocks: [
        {
          type: 'list',
          items: [
            '4.1 I Professionisti sono responsabili dell’uso di strumenti igienizzati, monouso dove previsto, e del rispetto delle normative sanitarie vigenti.',
            '4.2 Il Cliente si impegna a non richiedere strumenti propri né modifiche non conformi alla prassi professionale.',
          ],
        },
      ],
    },
    {
      id: 'responsabilita',
      title: 'Limitazione di responsabilità',
      blocks: [
        { type: 'p', text: '5.1 GLAMRO non è responsabile per:' },
        {
          type: 'list',
          items: [
            'Reazioni allergiche o irritazioni cutanee;',
            'Contagio da patogeni o infezioni, se non riconducibili a violazioni documentate da parte del Professionista;',
            'Eventuali danni estetici o risultati insoddisfacenti, in quanto legati a preferenze soggettive.',
          ],
        },
        { type: 'p', text: '5.2 GLAMRO non è responsabile in caso di dichiarazioni false o omissive del Cliente relative al proprio stato di salute, allergie o condizioni ambientali.' },
        { type: 'p', text: '5.3 Il Cliente manleva integralmente GLAMRO da ogni responsabilità civile, penale o amministrativa derivante da danni riconducibili a comportamenti del Professionista o a omissioni del Cliente.' },
      ],
    },
    {
      id: 'professionista',
      title: 'Comportamento del professionista',
      blocks: [
        { type: 'p', text: '6.1 Il Professionista si impegna a rispettare rigorosamente le normative igienico-sanitarie e ad astenersi dall’esecuzione di trattamenti in caso di:' },
        { type: 'list', items: ['Condizioni del Cliente potenzialmente a rischio;', 'Ambiente non idoneo alla prestazione;', 'Evidenza di controindicazioni o richieste contrarie alla deontologia professionale.'] },
        { type: 'p', text: '6.2 Il Professionista ha facoltà di interrompere il trattamento per motivi di sicurezza sanitaria, senza obbligo di rimborso.' },
      ],
    },
    {
      id: 'foro',
      title: 'Giurisdizione e foro competente',
      blocks: [
        { type: 'list', items: ['7.1 Ogni controversia sarà regolata dalla legge italiana.', '7.2 Per i Clienti consumatori: foro del luogo di residenza.', '7.3 Per Clienti professionali (B2B): foro esclusivo di Ancona.'] },
      ],
    },
    {
      id: 'pretese',
      title: 'Clausola di rinuncia a pretese infondate',
      blocks: [
        { type: 'p', text: '8.1 Il Cliente dichiara di essere consapevole che, in considerazione della natura del servizio, eventuali pretese risarcitorie non supportate da evidenza oggettiva, documentazione fotografica e/o certificazione medica, potranno essere considerate manifestamente infondate e temerarie.' },
        { type: 'p', text: '8.2 In tal caso, GLAMRO si riserva di agire per il risarcimento dei danni da lite temeraria ex art. 96 c.p.c.' },
      ],
    },
    {
      id: 'approvazione',
      title: 'Approvazione specifica ex artt. 1341 e 1342 c.c.',
      blocks: [
        { type: 'p', text: 'Ai sensi degli artt. 1341 e 1342 c.c., il Cliente dichiara di approvare espressamente le seguenti clausole: Art. 2.2 (esclusione responsabilità per patologie non dichiarate); Art. 3.2 (rifiuto del servizio per ambiente inadeguato); Art. 5.1, 5.2, 5.3 (limitazioni di responsabilità e manleva); Art. 6.2 (interruzione trattamento senza rimborso); Art. 7.3 (foro esclusivo di Ancona per Clienti business); Art. 8.1, 8.2 (rinuncia a pretese infondate e risarcimento per lite temeraria).' },
      ],
    },
  ],
  previousVersions: [],
};

const professionals: LegalDocument = {
  key: 'condizioni-professionisti',
  title: 'Condizioni Professionisti',
  description: 'Condizioni per i professionisti GLAMRO: verifica, profilo, disponibilità, compensi, commissioni, standard e sospensione.',
  version: '0.1',
  effectiveDate: null,
  updatedAt: '2026-11-09',
  draft: true,
  intro: 'Queste condizioni regolano il rapporto tra GLAMRO e i professionisti che offrono servizi sulla piattaforma.',
  sections: [
    { id: 'onboarding', title: 'Onboarding e verifica', blocks: [{ type: 'placeholder', text: '[Documenti richiesti, requisiti per categoria, tempi di verifica.]' }] },
    { id: 'profilo', title: 'Profilo e disponibilità', blocks: [{ type: 'placeholder', text: '[Contenuti del profilo, aggiornamento della disponibilità, zone servite.]' }] },
    { id: 'prestazione', title: 'Prestazione e standard', blocks: [{ type: 'p', text: 'Standard di servizio, igiene, puntualità e comportamento sono definiti nel Regolamento della piattaforma e nel Disclaimer igienico-sanitario.' }] },
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
  'regolamento-piattaforma': rules,
  'policy-reclami': complaints,
  'disclaimer-igienico-sanitario': hygiene,
};

export const LEGAL_DOC_KEYS = Object.keys(LEGAL_DOCS);
