/**
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
 * I testi v3 sono ancora in verifica legale. Mettere `false` quando l'avvocato li approva:
 * sparisce l'avviso in cima alle pagine.
 */
export const LEGAL_DRAFT = true;

export const LEGAL_DOCS: Record<string, LegalDocument> = {
  "termini": {
    "key": "termini",
    "title": "Termini e Condizioni Clienti",
    "description": "Termini e Condizioni per i clienti GLAMRO: prenotazione, prezzi e supplemento, pagamenti, cancellazioni, rimborsi e reclami.",
    "version": "3.0",
    "effectiveDate": "2026-11-24",
    "updatedAt": "2026-11-24",
    "draft": LEGAL_DRAFT,
    "intro": "Versione 3.0 · 24 novembre 2026 · sostituisce la versione 2.0 del 2 novembre 2026",
    "preamble": [],
    "sections": [
      {
        "id": "chi-siamo",
        "title": "1. Chi siamo",
        "blocks": [
          {
            "type": "p",
            "text": "La piattaforma GLAMRO (sito web www.glamro.it e app mobile GLAMRO, la \"Piattaforma\") è gestita da GLAMRO S.R.L., Via Giacomo Matteotti 54, 60121 Ancona (AN), Italia. Codice fiscale e Partita IVA 03036060428, REA AN-312608, capitale sociale 7.000,00 € interamente versato. PEC: glamrosrl@ionospec.it. Email: contact@glamro.it. Telefono e WhatsApp: +39 392 366 1225."
          },
          {
            "type": "p",
            "text": "I presenti Termini e Condizioni (i \"Termini\") regolano l'uso della Piattaforma e le prenotazioni effettuate tramite essa. Prima di confermare una prenotazione l'Utente deve leggerli e accettarli. I Termini sono sempre consultabili e scaricabili su www.glamro.it/termini."
          }
        ]
      },
      {
        "id": "definizioni",
        "title": "2. Definizioni",
        "blocks": [
          {
            "type": "list",
            "items": [
              "**Utente o Cliente**: la persona che usa la Piattaforma per cercare, prenotare e pagare Servizi.",
              "**Consumatore**: l'Utente persona fisica che agisce per scopi estranei alla propria attività professionale.",
              "**Professionista**: il professionista o l'impresa, titolare di partita IVA e dei requisiti richiesti per la propria categoria, che offre i propri Servizi tramite la Piattaforma. I Servizi di parrucchiere ed estetica sono offerti solo da saloni e centri abilitati, in regola con la segnalazione di inizio attività (SCIA) e con polizza di responsabilità civile, direttamente o tramite i professionisti che operano per loro conto. Make-up e massaggi di benessere sono offerti da professionisti con partita IVA.",
              "**Servizi**: le prestazioni di bellezza e benessere eseguite dal Professionista presso il Cliente o nel luogo indicato in prenotazione, scelte dal catalogo della Piattaforma nelle categorie capelli, estetica, massaggi e make-up.",
              "**Prezzo del Servizio**: l'importo stabilito dal Professionista per il Servizio.",
              "**Supplemento di servizio**: l'importo dovuto a GLAMRO per l'uso della Piattaforma (art. 6).",
              "**Prezzo Totale**: la somma di Prezzo del Servizio e Supplemento di servizio, mostrata prima della conferma.",
              "**Prenotazione**: la richiesta di un Servizio per una data, un orario e un luogo, accettata dal Professionista."
            ]
          }
        ]
      },
      {
        "id": "ruolo-di-glamro",
        "title": "3. Ruolo di GLAMRO",
        "blocks": [
          {
            "type": "p",
            "text": "GLAMRO fornisce ai Professionisti uno strumento digitale per offrire e gestire i propri Servizi e ai Clienti uno strumento per trovarli, prenotarli e pagarli. GLAMRO non esegue, non organizza e non dirige i Servizi: il Professionista è l'unico responsabile del Servizio che offre ed esegue."
          },
          {
            "type": "list",
            "items": [
              "Il contratto per il Servizio si conclude tra il Cliente e il Professionista. Il Professionista lo esegue in autonomia, con la propria organizzazione e i propri strumenti.",
              "Il contratto per l'uso della Piattaforma, a cui si riferisce il Supplemento di servizio, si conclude tra il Cliente e GLAMRO.",
              "Il Professionista decide in autonomia prezzi, disponibilità, zona in cui lavora e se accettare le richieste. È responsabile della corretta esecuzione del Servizio e del rispetto degli obblighi professionali, fiscali, igienico-sanitari e assicurativi.",
              "Prima di attivare un profilo GLAMRO verifica, con il controllo di una persona del proprio team, l'identità, la partita IVA e i documenti richiesti per la categoria. GLAMRO resta responsabile degli obblighi propri della Piattaforma: correttezza delle informazioni mostrate, gestione dei pagamenti, assistenza e trattamento dei reclami."
            ]
          },
          {
            "type": "p",
            "text": "**Identità del Professionista.** Nella scheda pubblica il Professionista compare con un nome profilo (nickname), le categorie, i Servizi, le zone servite e lo stato di verifica. Prima del pagamento il riepilogo della Prenotazione riporta il nome o la denominazione del Professionista, la partita IVA e l'indirizzo della sede o del domicilio fiscale. Il Professionista è contattabile tramite la chat dell'app (art. 49 Codice del Consumo)."
          },
          {
            "type": "p",
            "text": "**Informazioni per il Consumatore (art. 49-bis Codice del Consumo).** Tutti i Professionisti presenti sulla Piattaforma operano come professionisti titolari di partita IVA. Al contratto per il Servizio si applicano quindi le tutele del Codice del Consumo. Il Professionista è responsabile dell'esecuzione del Servizio e della sua conformità. GLAMRO, per conto del Professionista, fornisce le informazioni precontrattuali, gestisce pagamenti, cancellazioni e rimborsi e riceve i reclami."
          },
          {
            "type": "p",
            "text": "**Come ordiniamo i risultati.** I Professionisti sono mostrati in base a: vicinanza al luogo del Servizio e disponibilità nella fascia richiesta; corrispondenza con il Servizio cercato; valutazione media e numero di recensioni verificate; completezza del profilo; affidabilità (assenza di cancellazioni tardive). L'ordine non dipende da pagamenti: alla data di questi Termini non esistono posizioni a pagamento. Se verranno introdotte, saranno indicate con l'etichetta «Sponsorizzato». Il Cliente può modificare l'ordine con i filtri disponibili."
          }
        ]
      },
      {
        "id": "account-ed-eta-minima",
        "title": "4. Account ed età minima",
        "blocks": [
          {
            "type": "p",
            "text": "Per prenotare serve un account. Lo può aprire solo chi ha compiuto 18 anni."
          },
          {
            "type": "p",
            "text": "L'Utente si impegna a fornire dati veri e aggiornati e a custodire le proprie credenziali. Risponde delle prenotazioni effettuate dal proprio account, salvo il caso di uso non autorizzato segnalato senza ritardo a GLAMRO."
          },
          {
            "type": "p",
            "text": "Un Servizio può essere prenotato per un minore solo da un genitore o da chi ne ha la responsabilità. Quella persona deve essere presente per tutta la durata del Servizio. In sua assenza il Professionista non esegue il Servizio e si applicano le regole sull'assenza del Cliente (art. 8)."
          }
        ]
      },
      {
        "id": "prenotazione",
        "title": "5. Prenotazione",
        "blocks": [
          {
            "type": "olist",
            "start": 1,
            "items": [
              "Il Cliente sceglie Servizio, Professionista, data, orario e indirizzo. Prima di confermare vede la descrizione del Servizio, la durata indicativa, il Prezzo del Servizio, il Supplemento, il Prezzo Totale, le regole di cancellazione e l'informazione che il diritto di recesso non si applica (art. 9).",
              "Con il pulsante «Prenota con obbligo di pagamento» il Cliente invia una richiesta, registra il proprio metodo di pagamento e lo autentica. **In questa fase non viene addebitato nulla.**",
              "La Prenotazione si conclude quando il Professionista la accetta. Il Cliente riceve una conferma in app e via email con il riepilogo.",
              "Se il Professionista non accetta entro 24 ore dalla richiesta, o entro il termine più breve indicato in app per le Prenotazioni ravvicinate, la richiesta decade senza alcun addebito."
            ]
          },
          {
            "type": "p",
            "text": "Il contratto è concluso in lingua italiana. Prima della conferma il Cliente può verificare e correggere i dati inseriti. Dopo la conferma riceve via email il riepilogo della Prenotazione e il link a questi Termini nella versione accettata, che GLAMRO archivia insieme ai dati della Prenotazione (art. 12 D.Lgs. 70/2003)."
          },
          {
            "type": "p",
            "text": "L'ordine minimo è di 20 € di Prezzo del Servizio."
          },
          {
            "type": "p",
            "text": "Il Cliente deve indicare un indirizzo corretto e garantire un ambiente adatto al Servizio: spazio sufficiente, luce, presa elettrica e accesso all'acqua quando necessari. Se mancano le condizioni minime e il Servizio non può essere eseguito, si applicano le regole sull'assenza del Cliente (art. 8)."
          }
        ]
      },
      {
        "id": "prezzi-e-supplemento-di-servizio",
        "title": "6. Prezzi e supplemento di servizio",
        "blocks": [
          {
            "type": "p",
            "text": "Il Prezzo del Servizio è stabilito liberamente dal Professionista, che lo incassa per intero. GLAMRO non trattiene commissioni sul Prezzo del Servizio."
          },
          {
            "type": "p",
            "text": "Per l'uso della Piattaforma il Cliente paga a GLAMRO un Supplemento di servizio pari al 20% del Prezzo del Servizio, IVA inclusa, con un minimo di 6 €. Il Supplemento è arrotondato all'euro superiore; il Prezzo del Servizio non viene mai arrotondato. Il Supplemento copre gestione della prenotazione, pagamento sicuro, assistenza e costi delle transazioni."
          },
          {
            "type": "p",
            "text": "Esempio: Servizio a 50 € → Supplemento 10 € → Prezzo Totale 60 €. Servizio a 20 € → Supplemento 6 € (minimo) → Prezzo Totale 26 €."
          },
          {
            "type": "p",
            "text": "Prima della conferma il Cliente vede sempre, separati: Prezzo del Servizio, Supplemento di servizio e Prezzo Totale. Tutti gli importi sono comprensivi di imposte. Non ci sono altri costi oltre al Prezzo Totale, salvo i Servizi aggiunti dal Cliente durante l'appuntamento (art. 7) e gli importi previsti dall'art. 8 in caso di cancellazione tardiva o assenza. Non sono previsti costi di trasferta a parte."
          },
          {
            "type": "p",
            "text": "GLAMRO può offrire codici sconto o promozioni. Le relative condizioni sono indicate di volta in volta e non riducono il compenso del Professionista."
          }
        ]
      },
      {
        "id": "pagamenti-e-documenti-fiscali",
        "title": "7. Pagamenti e documenti fiscali",
        "blocks": [
          {
            "type": "p",
            "text": "I pagamenti sono elaborati da Stripe, fornitore di pagamento autorizzato. GLAMRO non conserva i dati completi delle carte di pagamento. I metodi accettati sono indicati in app; al lancio della versione 3.0 dei Termini è accettata la carta di credito o di debito."
          },
          {
            "type": "p",
            "text": "**Come funziona l'addebito**"
          },
          {
            "type": "olist",
            "start": 1,
            "items": [
              "**Alla prenotazione** il metodo di pagamento viene registrato e autenticato. Nessun addebito.",
              "**24 ore prima del Servizio** l'importo del Prezzo Totale viene bloccato sul metodo di pagamento (autorizzazione). Per le Prenotazioni fatte meno di 24 ore prima, il blocco avviene all'accettazione. Un blocco non è un addebito: se viene annullato, il Cliente non paga nulla.",
              "**A Servizio eseguito** il Professionista lo segna come completato in app; in mancanza, il completamento è confermato in automatico 6 ore dopo l'orario di fine previsto, salvo segnalazione del Cliente. Solo in quel momento il Prezzo Totale viene addebitato.",
              "In caso di cancellazione tardiva o assenza del Cliente (art. 8) l'importo dovuto viene addebitato al momento della cancellazione o dell'assenza."
            ]
          },
          {
            "type": "p",
            "text": "Il Cliente autorizza GLAMRO a bloccare e addebitare il metodo di pagamento registrato nei tempi indicati in questo articolo, senza una nuova conferma. Se il blocco non va a buon fine, il Cliente riceve un avviso e può aggiornare il metodo di pagamento in app. Se entro 12 ore dall'orario del Servizio non c'è un blocco valido, la Prenotazione è annullata senza costi e il Professionista viene avvisato."
          },
          {
            "type": "p",
            "text": "**Servizi aggiunti durante l'appuntamento.** Se il Professionista è disponibile, il Cliente può aggiungere un Servizio durante l'appuntamento. Il prezzo viene mostrato in app e il Cliente lo conferma prima dell'esecuzione, chiedendo che il Servizio sia eseguito subito; con questa richiesta prende atto che, una volta eseguito il Servizio aggiunto, non può esercitare il diritto di recesso (art. 59, lett. a, Codice del Consumo). Senza conferma in app non è dovuto alcun importo aggiuntivo."
          },
          {
            "type": "p",
            "text": "**Mance.** Sono facoltative e spettano per intero al Professionista."
          },
          {
            "type": "p",
            "text": "**Incasso e documenti fiscali.** GLAMRO incassa il Prezzo del Servizio in nome e per conto del Professionista, tramite il fornitore di pagamento, che lo accredita direttamente sul conto di pagamento del Professionista. Il Prezzo del Servizio non è un ricavo di GLAMRO. Al momento dell'addebito il Cliente riceve in app:"
          },
          {
            "type": "list",
            "items": [
              "per il Prezzo del Servizio, il documento commerciale emesso da GLAMRO in nome e per conto del Professionista, secondo il regime fiscale del Professionista;",
              "per il Supplemento di servizio, il documento commerciale di GLAMRO."
            ]
          },
          {
            "type": "p",
            "text": "Il Cliente che vuole la fattura, come privato o come impresa, la chiede in app prima del pagamento indicando i propri dati fiscali (codice fiscale o partita IVA). In caso di rimborso vengono emessi i relativi documenti di reso o le note di variazione. Il codice fiscale non è chiesto a chi non richiede la fattura."
          },
          {
            "type": "p",
            "text": "I Servizi prenotati tramite la Piattaforma si pagano solo tramite la Piattaforma. Il Cliente non deve versare somme al Professionista fuori dall'app, salvo le mance."
          }
        ]
      },
      {
        "id": "cancellazioni-ritardi-e-assenze",
        "title": "8. Cancellazioni, ritardi e assenze",
        "blocks": [
          {
            "type": "p",
            "text": "Le regole che seguono valgono per tutti i Servizi. Il Cliente cancella o sposta un appuntamento direttamente dall'app; l'orario registrato dall'app costituisce prova della cancellazione, salvo prova contraria."
          },
          {
            "type": "p",
            "text": "**Cancellazione e assenza del Cliente**"
          },
          {
            "type": "table",
            "caption": "Quando, Cosa paga il Cliente, Importo riconosciuto al Professionista",
            "head": [
              "Quando",
              "Cosa paga il Cliente",
              "Importo riconosciuto al Professionista"
            ],
            "rows": [
              [
                "Prima che il Professionista accetti",
                "Nulla",
                "Nessuno"
              ],
              [
                "Fino a 1 ora prima dell'orario fissato",
                "Nulla: il blocco sul metodo di pagamento è annullato",
                "Nessuno"
              ],
              [
                "Nell'ultima ora prima dell'orario fissato, o assenza del Cliente senza cancellazione",
                "Il Prezzo Totale",
                "Il 100% del Prezzo del Servizio"
              ]
            ]
          },
          {
            "type": "p",
            "text": "Esempio: Servizio a 50 € più 10 € di Supplemento. Se il Cliente cancella 3 ore prima, non paga nulla. Se cancella 30 minuti prima o non si fa trovare, paga 60 €: 50 € al Professionista e 10 € di Supplemento a GLAMRO."
          },
          {
            "type": "list",
            "items": [
              "Il Cliente può spostare l'appuntamento senza costi fino a 1 ora prima, se il Professionista è disponibile.",
              "Gli importi riconosciuti al Professionista per cancellazione nell'ultima ora o assenza compensano il tempo riservato al Cliente, che non può più essere offerto ad altri, e lo spostamento già organizzato verso l'indirizzo indicato."
            ]
          },
          {
            "type": "p",
            "text": "**Stati del Servizio.** Il Professionista segnala in app «In viaggio», «Arrivato», «Iniziato» e «Completato». Il Cliente vede lo stato in tempo reale e ogni cambio di stato è registrato con data e ora. Gli stati servono a provare la partenza, l'arrivo e l'eventuale assenza del Cliente, salvo prova contraria."
          },
          {
            "type": "p",
            "text": "**Quando il Cliente è considerato assente.** Il Professionista attende almeno 15 minuti dall'orario fissato e prova a contattare il Cliente tramite l'app. Il Cliente è considerato assente se non si presenta entro quel tempo, non è raggiungibile all'indirizzo indicato o non garantisce le condizioni minime per il Servizio (art. 5). In caso di ritardo del Cliente il Servizio può essere ridotto per rispettare gli appuntamenti successivi, senza riduzione del prezzo."
          },
          {
            "type": "p",
            "text": "**Servizio non reso per causa del Professionista.** Se il Professionista cancella una Prenotazione accettata, in qualsiasi momento, non si presenta, arriva con più di 30 minuti di ritardo senza che il Cliente abbia accettato in app un nuovo orario, oppure si presenta ma non esegue il Servizio per un motivo che dipende da lui, il Cliente riceve **il rimborso di tutto quanto pagato**, Prezzo del Servizio e Supplemento, senza alcuna trattenuta e senza alcun costo. Se l'importo non era ancora stato addebitato, il blocco è annullato e il Cliente non paga nulla. Il rimborso non dipende da eventuali contestazioni tra GLAMRO e il Professionista. GLAMRO può proporre al Cliente un altro Professionista disponibile o una nuova data; il Cliente è libero di rifiutare."
          },
          {
            "type": "p",
            "text": "Resta salvo il diritto del Cliente di chiedere al Professionista il risarcimento del maggior danno effettivamente subito, secondo la legge."
          },
          {
            "type": "p",
            "text": "**Cause non imputabili.** In caso di malattia o forza maggiore documentate (per esempio eventi meteo eccezionali o provvedimenti delle autorità), la Prenotazione può essere annullata da entrambe le parti senza penali. GLAMRO propone prima un cambio di data senza costi; se non è possibile, il Cliente riceve il rimborso di tutto quanto pagato."
          }
        ]
      },
      {
        "id": "diritto-di-recesso",
        "title": "9. Diritto di recesso",
        "blocks": [
          {
            "type": "p",
            "text": "Il Servizio è una prestazione di bellezza e benessere da eseguire nella data e all'ora scelte dal Cliente: rientra tra i servizi relativi ad attività del tempo libero per cui il contratto prevede una data di esecuzione specifica. Per questo il diritto di recesso di 14 giorni previsto per i contratti a distanza non si applica (art. 59, lett. n, Codice del Consumo, D.Lgs. 206/2005), per nessun Servizio prenotato sulla Piattaforma. Prima della conferma il Cliente dichiara di averlo letto con una casella separata e non preselezionata."
          },
          {
            "type": "p",
            "text": "Il Cliente può comunque cancellare gratuitamente la Prenotazione fino a 1 ora prima del Servizio, come previsto dall'art. 8."
          }
        ]
      },
      {
        "id": "rimborsi",
        "title": "10. Rimborsi",
        "blocks": [
          {
            "type": "p",
            "text": "I rimborsi dovuti in base a questi Termini sono disposti da GLAMRO entro 5 giorni lavorativi da quando il caso risulta in app o dalla decisione sul reclamo, sullo stesso metodo di pagamento usato per la Prenotazione. I tempi di accredito dipendono poi dalla banca o dal circuito di pagamento del Cliente, di solito 5–10 giorni lavorativi. I rimborsi non sono convertiti in credito in app."
          },
          {
            "type": "p",
            "text": "Se un Servizio è stato eseguito in modo non conforme a quanto prenotato, per esempio un Servizio diverso o incompleto, il Cliente può presentare reclamo (art. 12). In base all'esito, GLAMRO e il Professionista possono offrire un nuovo intervento senza costi, un rimborso parziale o un rimborso totale. L'insoddisfazione per un risultato estetico conforme a quanto richiesto non dà diritto, da sola, al rimborso."
          }
        ]
      },
      {
        "id": "salute-allergie-e-sicurezza",
        "title": "11. Salute, allergie e sicurezza",
        "blocks": [
          {
            "type": "p",
            "text": "Prima del Servizio il Cliente informa il Professionista di allergie, sensibilità cutanee, gravidanza, terapie in corso o altre condizioni che possano rendere un trattamento inadatto. Se il Cliente sceglie di indicarle in app, queste informazioni sono comunicate solo al Professionista che esegue il Servizio e trattate come indicato nella Privacy Policy, con il consenso esplicito del Cliente."
          },
          {
            "type": "p",
            "text": "Il Professionista può rifiutare o sospendere un trattamento se, a suo giudizio professionale, rischia di danneggiare la salute del Cliente. In questo caso non sono dovute penali e il Cliente paga solo la parte di Servizio eventualmente eseguita."
          },
          {
            "type": "p",
            "text": "Il Professionista usa prodotti conformi alla normativa sui cosmetici e strumenti puliti e sanificati, monouso dove previsto."
          },
          {
            "type": "p",
            "text": "Il Cliente e il Professionista si impegnano a un comportamento rispettoso. Il Professionista può interrompere il Servizio in presenza di molestie o situazioni che mettano a rischio la sua sicurezza; in quel caso si applicano le regole sull'assenza del Cliente (art. 8)."
          }
        ]
      },
      {
        "id": "reclami-e-assistenza",
        "title": "12. Reclami e assistenza",
        "blocks": [
          {
            "type": "p",
            "text": "L'assistenza è disponibile in app, via email a contact@glamro.it, al telefono e su WhatsApp al numero +39 392 366 1225. Sul sito e in app è disponibile anche un assistente virtuale basato su intelligenza artificiale, che risponde alle domande frequenti e passa la conversazione a una persona del team per i casi specifici. L'assistente virtuale non decide su rimborsi o reclami."
          },
          {
            "type": "p",
            "text": "**Servizio non reso.** Se il Professionista non arriva, cancella o non esegue il Servizio, il Cliente lo segnala il prima possibile dall'app, su WhatsApp o via email, indicando il codice della Prenotazione. Se la cancellazione o l'assenza del Professionista risultano già dall'app, il rimborso parte in automatico. Una segnalazione tardiva non fa perdere il diritto al rimborso, purché il caso sia verificabile."
          },
          {
            "type": "p",
            "text": "**Altri reclami.** Per permettere una verifica rapida dei fatti, il Cliente presenta reclamo preferibilmente entro 7 giorni dal Servizio, o dal fatto contestato, dall'app o via email, descrivendo il problema e, quando utile, allegando fotografie. Un reclamo presentato oltre questo termine viene comunque esaminato. Il termine è indicativo e non comporta la perdita di alcun diritto del Consumatore."
          },
          {
            "type": "p",
            "text": "GLAMRO conferma la ricezione entro 2 giorni lavorativi, verifica il caso usando gli stati registrati in app, le comunicazioni in chat e quanto indicato dal Cliente e dal Professionista, e comunica per iscritto l'esito motivato entro 15 giorni lavorativi. Il Cliente che non è d'accordo può chiedere una nuova valutazione rispondendo alla comunicazione di esito. Il reclamo non pregiudica i diritti del Consumatore previsti dalla legge."
          },
          {
            "type": "p",
            "text": "In caso di danni a persone o cose durante il Servizio, il Cliente deve segnalarli il prima possibile, in modo che il Professionista possa attivare la propria assicurazione per la responsabilità civile. Nella scheda di ciascun Professionista è indicato se dispone di una copertura assicurativa (badge «Assicurato»)."
          }
        ]
      },
      {
        "id": "recensioni",
        "title": "13. Recensioni",
        "blocks": [
          {
            "type": "p",
            "text": "Può lasciare una recensione solo il Cliente che ha prenotato e ricevuto il Servizio tramite la Piattaforma, entro 30 giorni dal Servizio. GLAMRO lo verifica collegando ogni recensione a una Prenotazione completata."
          },
          {
            "type": "p",
            "text": "Le recensioni sono pubblicate senza filtri basati sul voto. GLAMRO rimuove solo quelle offensive, false, non pertinenti o contenenti dati personali di terzi. Le recensioni sono mostrate in ordine cronologico, salvo diversa scelta dell'Utente tra i filtri disponibili. È vietato offrire o ricevere compensi, sconti o altri vantaggi in cambio di recensioni."
          },
          {
            "type": "p",
            "text": "**Segnalazione di contenuti illeciti (Reg. UE 2022/2065).** Chiunque può segnalare un profilo, una recensione o un contenuto che ritiene illecito dall'app o scrivendo a contact@glamro.it, indicando il contenuto e i motivi. GLAMRO esamina la segnalazione senza ritardo e comunica la decisione e i motivi a chi ha segnalato e all'autore del contenuto, che può contestarla. Il punto di contatto di GLAMRO per le autorità e per gli utenti è contact@glamro.it, in lingua italiana o inglese."
          }
        ]
      },
      {
        "id": "responsabilita",
        "title": "14. Responsabilità",
        "blocks": [
          {
            "type": "p",
            "text": "Il Professionista risponde verso il Cliente dell'esecuzione del Servizio, compresi i danni a persone o cose causati durante il Servizio."
          },
          {
            "type": "p",
            "text": "GLAMRO risponde degli obblighi propri della Piattaforma: correttezza delle informazioni che pubblica, gestione della prenotazione, del pagamento e dei rimborsi, assistenza e trattamento dei reclami."
          },
          {
            "type": "p",
            "text": "GLAMRO non risponde:"
          },
          {
            "type": "list",
            "items": [
              "dell'esecuzione del Servizio, di cui risponde solo il Professionista, salvo che il danno dipenda da un inadempimento di GLAMRO;",
              "di interruzioni temporanee della Piattaforma dovute a manutenzione, aggiornamenti o cause tecniche fuori dal proprio controllo, comunicate quando possibile in anticipo;",
              "di eventi di forza maggiore."
            ]
          },
          {
            "type": "p",
            "text": "Nessuna clausola di questi Termini esclude o limita la responsabilità di GLAMRO per dolo o colpa grave, per danni alla persona derivanti da un fatto o un'omissione di GLAMRO, né i diritti che il Codice del Consumo riconosce al Consumatore."
          }
        ]
      },
      {
        "id": "obblighi-dell-utente-e-sospensione",
        "title": "15. Obblighi dell'Utente e sospensione",
        "blocks": [
          {
            "type": "p",
            "text": "L'Utente si impegna a usare la Piattaforma in modo lecito e corretto. In particolare non deve:"
          },
          {
            "type": "list",
            "items": [
              "fornire dati falsi o usare l'account di altri;",
              "accordarsi con il Professionista per pagare fuori dalla Piattaforma un Servizio la cui Prenotazione è stata avviata nell'app;",
              "pubblicare contenuti offensivi, falsi o illeciti;",
              "tenere comportamenti molesti o discriminatori verso i Professionisti;",
              "tentare frodi, contestazioni di pagamento infondate o accessi non autorizzati ai sistemi."
            ]
          },
          {
            "type": "p",
            "text": "In caso di violazione GLAMRO può sospendere l'account, comunicandone il motivo. In caso di violazioni gravi o ripetute può chiuderlo. Le Prenotazioni già concluse vengono gestite secondo questi Termini. Il Cliente può contestare la decisione scrivendo a contact@glamro.it. Il Cliente può chiudere il proprio account in qualsiasi momento dalle impostazioni dell'app."
          }
        ]
      },
      {
        "id": "servizi-futuri",
        "title": "16. Servizi futuri",
        "blocks": [
          {
            "type": "p",
            "text": "GLAMRO prevede di introdurre in futuro la prenotazione presso saloni e centri, pacchetti, abbonamenti, gift card, credito in app, programmi fedeltà e di invito, e la vendita di prodotti. Questi servizi non sono attivi alla data di questi Termini. Quando verranno attivati avranno condizioni specifiche (prezzo, durata, rinnovo, disdetta, diritto di recesso, spedizioni e garanzie), che il Cliente dovrà accettare prima dell'acquisto."
          }
        ]
      },
      {
        "id": "proprieta-intellettuale-e-privacy",
        "title": "17. Proprietà intellettuale e privacy",
        "blocks": [
          {
            "type": "p",
            "text": "Il marchio GLAMRO, il logo, il software, i testi, il design e gli altri contenuti della Piattaforma appartengono a GLAMRO S.R.L. o ai suoi licenzianti e non possono essere usati senza autorizzazione scritta."
          },
          {
            "type": "p",
            "text": "Pubblicando recensioni o fotografie, l'Utente concede a GLAMRO una licenza gratuita e non esclusiva per mostrarle sulla Piattaforma. La licenza cessa quando il contenuto viene rimosso."
          },
          {
            "type": "p",
            "text": "Il trattamento dei dati personali è descritto nella Privacy Policy su www.glamro.it/privacy, ai sensi del Regolamento UE 2016/679 (GDPR)."
          }
        ]
      },
      {
        "id": "modifiche",
        "title": "18. Modifiche",
        "blocks": [
          {
            "type": "p",
            "text": "GLAMRO può modificare questi Termini per giustificati motivi: cambi di legge, nuove funzioni della Piattaforma, esigenze di sicurezza o variazioni del modello di servizio. Le modifiche sono comunicate via email e in app almeno 15 giorni prima dell'entrata in vigore. Se il Cliente non le accetta, può chiudere l'account senza costi prima di quella data. Le modifiche non si applicano alle Prenotazioni già concluse, che restano regolate dai Termini in vigore al momento della conferma."
          }
        ]
      },
      {
        "id": "legge-applicabile-e-foro",
        "title": "19. Legge applicabile e foro",
        "blocks": [
          {
            "type": "p",
            "text": "Questi Termini sono regolati dalla legge italiana. Al Consumatore restano comunque garantite le tutele inderogabili della legge del Paese in cui risiede."
          },
          {
            "type": "p",
            "text": "Per le controversie con un Consumatore è competente il foro del luogo di residenza o di domicilio del Consumatore. Per le controversie con Utenti che non sono Consumatori è competente il foro di Ancona."
          },
          {
            "type": "p",
            "text": "Prima di agire in giudizio il Cliente può rivolgersi a GLAMRO tramite la procedura di reclamo (art. 12) o a un organismo di risoluzione alternativa delle controversie (ADR), ai sensi degli artt. 141 e seguenti del Codice del Consumo."
          }
        ]
      }
    ],
    "previousVersions": []
  },
  "termini-professionisti": {
    "key": "termini-professionisti",
    "title": "Termini e Condizioni Professionisti",
    "description": "Termini e Condizioni per i professionisti partner GLAMRO: requisiti, gratuità, prenotazioni, pagamenti e penali.",
    "version": "3.0",
    "effectiveDate": "2026-11-24",
    "updatedAt": "2026-11-24",
    "draft": LEGAL_DRAFT,
    "intro": "Versione 3.0 · 24 novembre 2026 · sostituisce la versione 2.0 del 2 novembre 2026 e ogni precedente \"Contratto partner\"",
    "preamble": [],
    "sections": [
      {
        "id": "parti-e-premesse",
        "title": "1. Parti e premesse",
        "blocks": [
          {
            "type": "p",
            "text": "Tra GLAMRO S.R.L., Via Giacomo Matteotti 54, 60121 Ancona (AN), C.F. e P.IVA 03036060428, REA AN-312608, PEC glamrosrl@ionospec.it, in persona dell'amministratrice unica e legale rappresentante Teresa Siponta Miucci (\"GLAMRO\"), e il Professionista identificato dai dati inseriti in fase di registrazione e riportati nel suo profilo: nome e cognome o denominazione, codice fiscale, partita IVA, sede o domicilio fiscale, PEC o codice destinatario (il \"Professionista\")."
          },
          {
            "type": "p",
            "text": "**Premesse**"
          },
          {
            "type": "olist",
            "start": 1,
            "items": [
              "GLAMRO gestisce una piattaforma digitale (sito www.glamro.it, app GLAMRO per i Clienti e app GLAMRO Pro per i Professionisti, la \"Piattaforma\") che fornisce ai professionisti indipendenti della bellezza e del benessere una soluzione digitale gratuita per offrire, prenotare, incassare e gestire i propri Servizi, e ai Clienti uno strumento per trovarli, prenotarli e pagarli.",
              "Il Professionista esercita in autonomia un'attività professionale o d'impresa nel settore e intende ricevere prenotazioni tramite la Piattaforma.",
              "GLAMRO non esegue, non organizza e non dirige i Servizi, come previsto dal proprio oggetto sociale. Il Professionista è l'unico responsabile dei Servizi che offre ed esegue. GLAMRO non intende instaurare alcun rapporto di lavoro con il Professionista."
            ]
          },
          {
            "type": "p",
            "text": "Le premesse fanno parte del contratto. I termini con l'iniziale maiuscola hanno il significato indicato nei Termini e Condizioni Clienti di GLAMRO, che il Professionista dichiara di conoscere."
          }
        ]
      },
      {
        "id": "oggetto-gratuita-e-natura-del-rapporto",
        "title": "2. Oggetto, gratuità e natura del rapporto",
        "blocks": [
          {
            "type": "p",
            "text": "**2.1 Oggetto.** GLAMRO concede al Professionista l'uso non esclusivo della Piattaforma per pubblicare il proprio profilo e i propri Servizi, ricevere e gestire prenotazioni, incassare tramite il fornitore di pagamento, ricevere i documenti fiscali generati per suo conto e usare il gestionale gratuito (agenda, clienti, storico servizi)."
          },
          {
            "type": "p",
            "text": "**2.2 Gratuità.** Per il Professionista non ci sono costi di iscrizione, abbonamenti o commissioni. Il Professionista **incassa il 100% del Prezzo del Servizio da lui fissato, salvo le penali previste da questo contratto per assenze o cancellazioni a lui imputabili** (art. 4.5). GLAMRO si remunera esclusivamente con il Supplemento di servizio pagato dal Cliente, che non riduce il compenso del Professionista, e sostiene i costi di elaborazione dei pagamenti. Gli unici importi che possono essere a carico del Professionista dipendono da fatti a lui imputabili e sono elencati in modo completo: la penale per assenza o cancellazione tardiva e le commissioni di pagamento non restituite sui rimborsi dovuti a sua causa (art. 4.5), e le commissioni di contestazione perse per sua causa (art. 5.4). Eventuali servizi a pagamento per il Professionista potranno essere introdotti solo con un accordo separato, che il Professionista è libero di non sottoscrivere."
          },
          {
            "type": "p",
            "text": "GLAMRO non garantisce un numero minimo di prenotazioni né alcun livello di guadagno."
          },
          {
            "type": "p",
            "text": "**2.3 Natura autonoma.** Il Professionista agisce in piena autonomia, senza vincolo di subordinazione e senza che GLAMRO organizzi tempi, luoghi o modalità della sua prestazione. In particolare il Professionista:"
          },
          {
            "type": "list",
            "items": [
              "decide se, quando e dove essere disponibile, e può rifiutare qualsiasi richiesta senza conseguenze;",
              "fissa liberamente i propri prezzi e i Servizi offerti, scegliendoli dal catalogo della Piattaforma;",
              "usa strumenti, prodotti e mezzi propri, a proprie spese;",
              "può lavorare con altri canali, piattaforme o clienti propri, senza esclusiva verso GLAMRO;",
              "non è tenuto a indossare divise o segni distintivi di GLAMRO, né a garantire un numero minimo di ore o di Servizi."
            ]
          },
          {
            "type": "p",
            "text": "Nulla in questo contratto costituisce un rapporto di lavoro subordinato, di collaborazione organizzata dal committente (art. 2 D.Lgs. 81/2015), di agenzia, di società o di associazione tra le parti."
          }
        ]
      },
      {
        "id": "requisiti-del-professionista-e-assicurazione",
        "title": "3. Requisiti del Professionista e assicurazione",
        "blocks": [
          {
            "type": "p",
            "text": "**3.1 Requisiti.** Per essere attivato sulla Piattaforma il Professionista dichiara, sotto la propria responsabilità, e documenta:"
          },
          {
            "type": "olist",
            "start": 1,
            "items": [
              "di essere maggiorenne e titolare di partita IVA attiva;",
              "di possedere i requisiti della propria categoria indicati all'art. 3.2, e di caricarne la documentazione in app o sul sito;",
              "di essere in regola con la normativa nazionale, regionale e comunale applicabile allo svolgimento dei Servizi presso il domicilio del Cliente o nel luogo indicato;",
              "di non essere destinatario di provvedimenti che gli impediscano l'esercizio dell'attività."
            ]
          },
          {
            "type": "p",
            "text": "**3.2 Tipi di professionista e documenti.** All'iscrizione il Professionista sceglie se registrarsi come professionista singolo o come salone o centro, e uno o più tipi. Ogni tipo vede solo i Servizi del catalogo consentiti per quel tipo. L'elenco aggiornato dei documenti richiesti per tipo è indicato in app."
          },
          {
            "type": "table",
            "caption": "Tipo, Servizi, Documenti richiesti",
            "head": [
              "Tipo",
              "Servizi",
              "Documenti richiesti"
            ],
            "rows": [
              [
                "Parrucchiere (anche barbiere)",
                "Capelli e barba: taglio, colore, piega, trattamenti, acconciature per cerimonie ed eventi",
                "Partita IVA, sede abilitata con SCIA e responsabile tecnico (L. 174/2005) propria o del salone per cui opera, polizza RC obbligatoria"
              ],
              [
                "Estetista",
                "Estetica: trattamenti viso e corpo, massaggi estetici, depilazione, mani e piedi, ciglia e sopracciglia",
                "Partita IVA, sede abilitata con SCIA e responsabile tecnico (L. 1/1990) propria o del centro per cui opera, polizza RC obbligatoria"
              ],
              [
                "Make-up artist",
                "Make-up: trucco per sposa, cerimonie, eventi e servizi fotografici, lezioni di trucco",
                "Partita IVA; polizza facoltativa"
              ],
              [
                "Massaggiatore",
                "Massaggi benessere: rilassanti e di benessere della persona",
                "Partita IVA; polizza facoltativa"
              ]
            ]
          },
          {
            "type": "p",
            "text": "Il Make-up artist non esegue trattamenti estetici (per esempio pulizia del viso o trattamenti su ciglia e sopracciglia), riservati alla categoria Estetica. Il Massaggiatore non esegue massaggi estetici, riservati alla categoria Estetica, né massaggi terapeutici o sanitari, che non sono ammessi sulla Piattaforma. **Parrucchieri ed estetiste: sede obbligatoria.** I Servizi di parrucchiere ed estetica possono essere offerti solo in uno di questi modi:"
          },
          {
            "type": "olist",
            "start": 1,
            "items": [
              "**Salone o centro proprio**: il Professionista è titolare di un'impresa abilitata, con sede, SCIA e responsabile tecnico.",
              "**Appoggio a un salone o centro abilitato**: il professionista opera per conto di un salone o centro che ha sede, SCIA e responsabile tecnico. In questo caso sulla Piattaforma il Professionista è il salone o centro: il professionista che esegue il Servizio è collegato al suo profilo, mentre conto di pagamento, documenti fiscali e contratto sono intestati al salone o centro, che risponde dell'operato dei professionisti collegati.",
              "**Affitto di poltrona o cabina in un salone o centro partner**: quando la funzione sarà disponibile sulla Piattaforma, il professionista potrà operare con una propria SCIA presso il salone o centro partner, nei limiti previsti dalla normativa e con un contratto di affitto regolare. Fino ad allora questa modalità non è attiva."
            ]
          },
          {
            "type": "p",
            "text": "Il professionista di questi tipi che non ha un salone o centro proprio o di appoggio non può essere attivato per quei Servizi, ma può essere attivato per gli altri tipi per cui ha i requisiti."
          },
          {
            "type": "p",
            "text": "Il Professionista carica un documento d'identità valido e completa la verifica dell'identità richiesta dal fornitore di pagamento. Comunica a GLAMRO entro 15 giorni ogni variazione dei requisiti."
          },
          {
            "type": "p",
            "text": "**3.3 Assicurazione.** Per i tipi Parrucchiere ed Estetista la polizza di responsabilità civile professionale in corso di validità è obbligatoria e va caricata in app con data di scadenza. Per gli altri tipi è facoltativa: chi la carica ottiene nel profilo il badge «Assicurato», visibile ai Clienti, che si disattiva alla scadenza della polizza se non viene aggiornata. In assenza di polizza il Professionista risponde con il proprio patrimonio dei danni causati durante i Servizi. GLAMRO può segnalare soluzioni assicurative di partner, senza alcun obbligo di adesione. GLAMRO si riserva di rendere obbligatoria la polizza anche per altri tipi, con il preavviso previsto dall'art. 9.5."
          },
          {
            "type": "p",
            "text": "**3.4 Verifica.** Ogni profilo viene controllato da una persona del team GLAMRO prima dell'attivazione; l'attivazione non avviene mai in modo automatico. GLAMRO può chiedere integrazioni. Se i requisiti non sono dimostrati, il profilo non viene attivato, con il motivo comunicato per iscritto, o viene sospeso fino alla regolarizzazione (art. 9.4)."
          },
          {
            "type": "p",
            "text": "**3.5 Servizi non ammessi.** Il Professionista può offrire solo i Servizi presenti nel catalogo della Piattaforma per il proprio tipo. Non possono essere offerti né prenotati tramite GLAMRO:"
          },
          {
            "type": "list",
            "items": [
              "trattamenti medici o medico-estetici e ogni atto riservato a medici o professioni sanitarie: iniezioni, filler, tossina botulinica, biorivitalizzazione, mesoterapia, fili, peeling chimici o medicali, laser e luce pulsata, carbossiterapia;",
              "tatuaggi, trucco permanente o semipermanente, microblading, piercing e ogni altra pratica che perfora o incide la pelle;",
              "massaggi con finalità terapeutiche, riabilitative o sanitarie (per esempio fisioterapia, osteopatia, chiropratica, linfodrenaggio a scopo medico);",
              "qualsiasi servizio a contenuto sessuale, erotico o di accompagnamento, anche se presentato come massaggio o benessere;",
              "diagnosi, prescrizioni e consulenze su patologie, diete o integratori con finalità terapeutiche;",
              "vendita di prodotti, farmaci, cosmetici o dispositivi separata dal Servizio;",
              "Servizi eseguiti da persone diverse dal Professionista verificato o dal personale abilitato della sua impresa;",
              "ricariche, servizi finanziari, scommesse e ogni pagamento non legato a un Servizio realmente eseguito;",
              "qualsiasi Servizio vietato dalla legge o che richieda abilitazioni che il Professionista non possiede."
            ]
          },
          {
            "type": "p",
            "text": "Le lezioni individuali offerte tramite la Piattaforma non rilasciano titoli o qualifiche. GLAMRO controlla i Servizi pubblicati e rimuove quelli non conformi. La pubblicazione di un Servizio non ammesso comporta la sospensione del profilo (art. 9.4)."
          }
        ]
      },
      {
        "id": "prezzi-prenotazioni-e-cancellazioni",
        "title": "4. Prezzi, prenotazioni e cancellazioni",
        "blocks": [
          {
            "type": "p",
            "text": "**4.1 Prezzi.** Il Professionista fissa liberamente il Prezzo di ciascun Servizio, comprensivo di eventuale IVA, prodotti e spese di trasferta. Il Prezzo minimo di un Servizio è di 20 €. GLAMRO consiglia prezzi arrotondati all'euro. Il Professionista può modificare i prezzi in qualsiasi momento; la modifica non vale per le prenotazioni già accettate."
          },
          {
            "type": "p",
            "text": "**4.2 Profilo e Servizi.** Il Professionista sceglie un nome profilo (nickname), che è il nome mostrato pubblicamente ai Clienti. Nome legale, partita IVA e sede sono mostrati al Cliente nel riepilogo prima del pagamento, come richiesto dal Codice del Consumo. Il Professionista descrive i Servizi in modo veritiero: durata indicativa, prodotti usati, zona servita. Non pubblica foto di lavori non propri."
          },
          {
            "type": "p",
            "text": "**4.3 Richieste di prenotazione.** Il Professionista accetta o rifiuta ogni richiesta entro 24 ore, o entro il termine più breve indicato in app per le prenotazioni ravvicinate. Il rifiuto o la mancata risposta non comportano alcuna conseguenza. L'importo del Cliente viene bloccato 24 ore prima del Servizio (all'accettazione per le prenotazioni ravvicinate) e addebitato solo a Servizio eseguito. Una volta accettata, la prenotazione impegna il Professionista a eseguire il Servizio alla data, all'ora e nel luogo concordati."
          },
          {
            "type": "p",
            "text": "**4.4 Cancellazioni e assenze del Cliente.** Si applicano le regole dei Termini e Condizioni Clienti, che il Professionista accetta:"
          },
          {
            "type": "table",
            "caption": "Caso, Importo riconosciuto al Professionista",
            "head": [
              "Caso",
              "Importo riconosciuto al Professionista"
            ],
            "rows": [
              [
                "Cancellazione del Cliente prima dell'accettazione o fino a 1 ora prima del Servizio",
                "Nessuno"
              ],
              [
                "Cancellazione del Cliente nell'ultima ora prima del Servizio",
                "100% del Prezzo del Servizio"
              ],
              [
                "Assenza del Cliente senza cancellazione (no-show)",
                "100% del Prezzo del Servizio"
              ]
            ]
          },
          {
            "type": "p",
            "text": "In caso di assenza il Professionista attende almeno 15 minuti dall'orario fissato, prova a contattare il Cliente tramite l'app e segnala l'assenza in app entro 2 ore dall'orario fissato. Gli importi sono dovuti nei limiti in cui la legge li consente nei confronti del Consumatore."
          },
          {
            "type": "p",
            "text": "**4.5 Cancellazioni e assenze del Professionista; penale.**"
          },
          {
            "type": "p",
            "text": "a) Il Professionista che non può eseguire una prenotazione accettata la cancella il prima possibile, tramite l'app. In ogni caso il Cliente riceve il rimborso di tutto quanto pagato e al Professionista non spetta alcun importo."
          },
          {
            "type": "p",
            "text": "b) Si considerano imputabili al Professionista: l'**assenza** (non si presenta, o arriva con più di 30 minuti di ritardo senza che il Cliente abbia accettato in app un nuovo orario) e la **cancellazione tardiva** (cancella una prenotazione accettata con meno di 24 ore di preavviso)."
          },
          {
            "type": "p",
            "text": "c) Per ogni assenza o cancellazione tardiva imputabile, il Professionista deve a GLAMRO una **penale di 5 €**. La penale è il risarcimento forfettario del danno contrattuale che GLAMRO subisce, concordato in anticipo ai sensi dell'art. 1382 c.c.: costi di gestione della prenotazione annullata, assistenza al Cliente e ricerca di un'alternativa, danno alla fiducia dei Clienti nella Piattaforma. Non è una sanzione e non valuta il lavoro del Professionista. È fissa e non dipende dal Prezzo del Servizio. Oltre alla penale, se l'importo del Cliente era già stato addebitato e deve essere rimborsato per un'assenza, una cancellazione o una mancata esecuzione imputabile al Professionista, il Professionista rimborsa a GLAMRO le commissioni del fornitore di pagamento che non vengono restituite sul rimborso, nell'importo indicato nel riepilogo in app. Se l'importo era solo bloccato e il blocco viene annullato, non ci sono commissioni. Non è dovuto il risarcimento di danni ulteriori."
          },
          {
            "type": "p",
            "text": "d) La penale **non è dovuta** se la cancellazione avviene con almeno 24 ore di preavviso; se il Cliente accetta in app un nuovo orario o un'altra data; se il Servizio non si può svolgere per causa del Cliente (assenza, comportamento inappropriato, condizioni minime di sicurezza e igiene non garantite); in caso di **forza maggiore documentata**: malattia o infortunio del Professionista o di un familiare convivente, emergenze familiari, incidente o guasto improvviso del mezzo, eventi meteo eccezionali, provvedimenti delle autorità. La documentazione si invia dall'app o a contact@glamro.it entro 7 giorni dall'episodio; per motivi di salute basta un certificato che attesti l'impedimento, senza indicazione della diagnosi."
          },
          {
            "type": "p",
            "text": "e) **Comunicazione e contestazione.** GLAMRO comunica per iscritto, in app e via email, ogni penale con la prenotazione interessata, il motivo e l'importo. Il Professionista può contestarla entro 7 giorni, anche inviando prove. La contestazione è esaminata da una persona del team GLAMRO, che comunica l'esito motivato entro 7 giorni. Finché la contestazione è aperta la penale non viene compensata."
          },
          {
            "type": "p",
            "text": "f) **Compensazione.** Il Professionista accetta che la penale dovuta e non contestata, o confermata dopo la contestazione, sia compensata (artt. 1241 e seguenti c.c.) con il primo importo successivo che gli spetta tramite il fornitore di pagamento. Le stesse regole valgono per le commissioni di pagamento non restituite. Nel riepilogo dei pagamenti in app il Professionista vede l'importo del Servizio, la penale e le commissioni compensate e il motivo. Se entro 60 giorni non ci sono importi da compensare, GLAMRO chiede il pagamento della penale, che il Professionista versa entro 30 giorni dalla richiesta."
          },
          {
            "type": "p",
            "text": "g) **Modifica dell'importo.** GLAMRO può aggiornare l'importo della penale con un preavviso scritto di almeno 30 giorni, inviato in app e via email. Il nuovo importo vale solo per gli episodi successivi alla data di efficacia. Il Professionista che non è d'accordo può recedere senza costi prima di quella data."
          },
          {
            "type": "p",
            "text": "h) Gli episodi ripetuti possono comportare la pausa della visibilità del profilo prevista dall'art. 9.4."
          },
          {
            "type": "p",
            "text": "**4.6 Completamento e stati.** Il Professionista segnala in app, in modo veritiero, gli stati «In viaggio», «Arrivato», «Iniziato» e «Completato». Segna il Servizio come completato solo dopo averlo eseguito; in mancanza, il completamento è confermato in automatico 6 ore dopo l'orario di fine previsto, salvo segnalazione del Cliente. I Servizi aggiunti durante l'appuntamento vanno inseriti in app e confermati dal Cliente prima dell'esecuzione. Segnare come completato un Servizio non eseguito, o segnalare uno stato non corrispondente al vero, è una violazione grave, perché altera la prova della partenza, dell'arrivo e dell'eventuale assenza del Cliente."
          },
          {
            "type": "p",
            "text": "**4.7 Obblighi verso il Consumatore.** Nei confronti del Cliente consumatore il Professionista è il professionista ai sensi del Codice del Consumo. Il Professionista incarica GLAMRO di fornire per suo conto le informazioni precontrattuali, di raccogliere le cancellazioni e di disporre i rimborsi dovuti secondo i Termini e Condizioni Clienti. Il Professionista accetta queste regole e non può applicare ai Clienti della Piattaforma condizioni diverse o peggiorative."
          }
        ]
      },
      {
        "id": "pagamenti-mandato-all-incasso-e-obblighi-fiscali",
        "title": "5. Pagamenti, mandato all'incasso e obblighi fiscali",
        "blocks": [
          {
            "type": "p",
            "text": "**5.1 Mandato all'incasso.** Il Professionista conferisce a GLAMRO mandato con rappresentanza, per conto del solo Professionista, a promuovere e negoziare con i Clienti la vendita dei suoi Servizi alle condizioni da lui fissate (prezzi, disponibilità, zona), fermo restando che ogni Prenotazione si conclude solo con l'accettazione del Professionista, e a incassare dal Cliente, in nome e per conto del Professionista, il Prezzo del Servizio e gli importi dovuti per cancellazione nell'ultima ora o assenza del Cliente. L'incasso avviene tramite fornitori di pagamento autorizzati (Stripe Connect). I pagamenti sono configurati in modo che il Professionista risulti l'esercente del Prezzo del Servizio presso il fornitore di pagamento e GLAMRO l'esercente del solo Supplemento di servizio. Le somme del Professionista non sono ricavi di GLAMRO e non transitano sul saldo di GLAMRO."
          },
          {
            "type": "p",
            "text": "**5.2 Conto di pagamento.** Per ricevere i pagamenti il Professionista apre un conto collegato presso il fornitore di pagamento, accettandone i termini e completandone la verifica dell'identità. Le coordinate bancarie sono gestite dal fornitore. Il Professionista riceve prenotazioni solo finché il conto è attivo e verificato: se il fornitore lo sospende o chiede documenti, il profilo non è visibile ai Clienti fino alla regolarizzazione."
          },
          {
            "type": "p",
            "text": "**5.3 Accredito.** Al momento dell'addebito al Cliente il Prezzo del Servizio viene accreditato sul saldo del conto di pagamento del Professionista; il Supplemento resta a GLAMRO. Il fornitore di pagamento trasferisce il saldo sul conto bancario del Professionista dopo 7 giorni dall'addebito, periodo che serve a coprire eventuali contestazioni del Cliente. Le commissioni del fornitore di pagamento sono a carico di GLAMRO. Il riepilogo di ogni movimento è disponibile in app."
          },
          {
            "type": "p",
            "text": "**5.4 Rimborsi e contestazioni.** Se un Cliente ha diritto a un rimborso in base ai Termini e Condizioni Clienti, oppure ottiene lo storno di un pagamento perché il Servizio non è stato eseguito o è difforme, l'importo corrispondente è stornato dal conto di pagamento del Professionista. Il Professionista collabora fornendo entro 5 giorni le informazioni utili a difendere la contestazione. Le commissioni di contestazione addebitate dal fornitore di pagamento sono a carico del Professionista solo quando la contestazione è persa per causa a lui imputabile. Prima di ogni storno o recupero GLAMRO informa il Professionista e ne valuta le osservazioni."
          },
          {
            "type": "p",
            "text": "**5.5 Divieto di pagamenti esterni.** Per i Servizi prenotati tramite la Piattaforma il Professionista non chiede né accetta pagamenti fuori dalla Piattaforma, salvo le mance."
          },
          {
            "type": "p",
            "text": "**5.6 Documenti fiscali e incarico all'emissione.** Il Professionista incarica GLAMRO di generare e trasmettere, in suo nome e per suo conto, i documenti fiscali per i Servizi prenotati tramite la Piattaforma: il documento commerciale al Cliente al momento dell'addebito e, se il Cliente la richiede, la fattura elettronica tramite il Sistema di Interscambio, oltre ai documenti di reso e alle note di variazione per i rimborsi. Il Professionista indica in app il proprio regime fiscale e lo mantiene aggiornato, accetta questo incarico con una spunta separata all'attivazione del profilo, riceve copia di ogni documento e può scaricare in app il riepilogo dei documenti di ogni mese. Non emette altri documenti per gli stessi Servizi e resta responsabile del contenuto dei documenti e dei propri adempimenti: liquidazione e versamento delle imposte, imposta di bollo, dichiarazioni e contributi. L'imposta di bollo, quando dovuta, è a carico del Professionista. GLAMRO non è sostituto d'imposta e non applica ritenute. Il Supplemento di servizio è un ricavo di GLAMRO, che emette al Cliente il relativo documento fiscale."
          },
          {
            "type": "p",
            "text": "**5.7 Comunicazioni DAC7.** In qualità di gestore di piattaforma, GLAMRO è tenuta a raccogliere e comunicare all'Agenzia delle Entrate i dati dei Professionisti e i corrispettivi da loro percepiti tramite la Piattaforma (D.Lgs. 32/2023, attuazione della Direttiva UE 2021/514). Il corrispettivo comunicato è il Prezzo del Servizio; il Supplemento pagato dal Cliente a GLAMRO non è un corrispettivo del Professionista. Il Professionista fornisce dati completi e veritieri: nome o denominazione, indirizzo, codice fiscale, partita IVA, data di nascita, coordinate del conto di accredito nella misura in cui sono disponibili a GLAMRO o al fornitore di pagamento. Se non li fornisce dopo due solleciti e decorsi 60 giorni dalla prima richiesta, GLAMRO trattiene i trasferimenti o chiude il profilo, come previsto dal D.Lgs. 32/2023."
          }
        ]
      },
      {
        "id": "qualita-sicurezza-e-condotta",
        "title": "6. Qualità, sicurezza e condotta",
        "blocks": [
          {
            "type": "p",
            "text": "Il Professionista esegue i Servizi secondo la diligenza e le regole della propria professione. In particolare:"
          },
          {
            "type": "list",
            "items": [
              "usa prodotti cosmetici conformi al Regolamento CE 1223/2009 e strumenti puliti e sanificati, monouso dove previsto;",
              "prima del trattamento chiede al Cliente eventuali allergie o controindicazioni e può rifiutare o sospendere un trattamento rischioso per la salute, senza penali per nessuna delle parti;",
              "tratta come riservate le informazioni ricevute dal Cliente, in particolare quelle sanitarie;",
              "tiene un comportamento rispettoso e può interrompere il Servizio in caso di molestie o rischi per la propria sicurezza, segnalandolo subito in app;",
              "non esegue Servizi per minori se non è presente il genitore o chi ne ha la responsabilità."
            ]
          },
          {
            "type": "p",
            "text": "GLAMRO può pubblicare linee guida di buona pratica su igiene e sicurezza. Sono raccomandazioni: non regolano tempi e modalità di lavoro del Professionista e non comportano controlli sull'esecuzione."
          }
        ]
      },
      {
        "id": "profilo-posizionamento-e-recensioni",
        "title": "7. Profilo, posizionamento e recensioni",
        "blocks": [
          {
            "type": "p",
            "text": "**7.1 Posizionamento.** Ai sensi del Regolamento UE 2019/1150, GLAMRO indica i parametri principali che determinano l'ordine dei Professionisti nei risultati di ricerca:"
          },
          {
            "type": "table",
            "caption": "Parametro, Peso",
            "head": [
              "Parametro",
              "Peso"
            ],
            "rows": [
              [
                "Vicinanza al luogo del Servizio e disponibilità nella fascia richiesta",
                "Principale"
              ],
              [
                "Corrispondenza tra Servizio cercato e Servizi offerti",
                "Principale"
              ],
              [
                "Valutazione media e numero di recensioni verificate",
                "Rilevante"
              ],
              [
                "Completezza del profilo (foto, descrizioni, documenti)",
                "Rilevante"
              ],
              [
                "Affidabilità: assenza di cancellazioni tardive e di assenze su prenotazioni già accettate",
                "Rilevante"
              ]
            ]
          },
          {
            "type": "p",
            "text": "Il rifiuto di una richiesta o la mancata risposta non incidono sul posizionamento. Il posizionamento non dipende da pagamenti. Alla data di questo contratto non è attivo alcun sistema di livelli o punteggio con effetti economici. Se in futuro sarà introdotta una forma di visibilità a pagamento o un sistema di livelli, GLAMRO ne descriverà criteri ed effetti con almeno 15 giorni di preavviso."
          },
          {
            "type": "p",
            "text": "**7.2 Recensioni.** Solo i Clienti con un Servizio completato possono recensire il Professionista. GLAMRO non modifica il contenuto delle recensioni e rimuove solo quelle offensive, false o contenenti dati personali di terzi. Il Professionista può rispondere pubblicamente e segnalare recensioni che ritiene illecite."
          },
          {
            "type": "p",
            "text": "**7.3 Dati generati.** Il Professionista può consultare in app i dati relativi alle proprie prenotazioni, ai propri Clienti e alle recensioni ricevute. GLAMRO usa i dati aggregati della Piattaforma per migliorarne il servizio."
          }
        ]
      },
      {
        "id": "marchio-dati-personali-e-responsabilita",
        "title": "8. Marchio, dati personali e responsabilità",
        "blocks": [
          {
            "type": "p",
            "text": "**8.1 Marchio GLAMRO.** Il Professionista può indicare di essere presente su GLAMRO usando nome e logo GLAMRO Pro nelle forme fornite da GLAMRO, solo finché il contratto è in vigore. Eventuale materiale con il marchio è facoltativo e non è condizione per ricevere prenotazioni."
          },
          {
            "type": "p",
            "text": "**8.2 Contenuti del Professionista.** Il Professionista concede a GLAMRO una licenza gratuita e non esclusiva per mostrare sulla Piattaforma, e per promuoverla sui canali di GLAMRO, nome profilo, foto e immagini dei lavori caricati. Garantisce di averne i diritti e il consenso delle persone ritratte. Può revocare in ogni momento l'uso promozionale."
          },
          {
            "type": "p",
            "text": "**8.3 Dati personali.** Per i dati trattati nella gestione della Piattaforma GLAMRO è titolare del trattamento, come descritto nella Privacy Policy. Per i dati dei Clienti ricevuti per eseguire il Servizio (nome, indirizzo, recapito, informazioni sanitarie comunicate) il Professionista è titolare autonomo: li usa solo per eseguire il Servizio e adempiere agli obblighi di legge, non li usa per proprie comunicazioni commerciali senza un consenso autonomo del Cliente e li protegge con misure adeguate. Comunica a GLAMRO senza ritardo ogni violazione di dati di cui venga a conoscenza."
          },
          {
            "type": "p",
            "text": "**8.4 Nomina a responsabile del trattamento (art. 28 GDPR).** Per generare, trasmettere e conservare i documenti fiscali per conto del Professionista (art. 5.6) GLAMRO tratta i dati dei Clienti come responsabile del trattamento del Professionista. GLAMRO: tratta i dati solo per questa finalità e secondo le istruzioni di questo contratto; impone la riservatezza alle persone autorizzate; adotta misure di sicurezza adeguate (art. 32 GDPR); si avvale dei sub-responsabili indicati nella Privacy Policy (fornitore del servizio di documenti fiscali elettronici, fornitore di pagamento, hosting), che il Professionista autorizza in via generale con diritto di opporsi alle sostituzioni comunicate; assiste il Professionista nella risposta alle richieste degli interessati e in caso di violazione dei dati, che gli comunica senza ingiustificato ritardo; alla cessazione del contratto restituisce o cancella i dati, salvo gli obblighi di conservazione previsti dalla legge; mette a disposizione le informazioni necessarie a dimostrare il rispetto di questi obblighi."
          },
          {
            "type": "p",
            "text": "**8.5 Rapporto con i Clienti.** Il Professionista non invita i Clienti conosciuti tramite GLAMRO a prenotare e pagare fuori dalla Piattaforma i Servizi che vi sono offerti. Resta libero di servire i propri clienti acquisiti in altro modo. Il divieto è giustificato dal fatto che GLAMRO, gratuita per il Professionista, si remunera solo con il Supplemento sui Servizi prenotati tramite la Piattaforma (art. 10 Reg. UE 2019/1150)."
          },
          {
            "type": "p",
            "text": "**8.6 Responsabilità.** Il Professionista risponde dell'esecuzione dei Servizi e dei danni causati a Clienti o terzi. Tiene indenne GLAMRO dalle richieste di terzi che derivino da un proprio inadempimento o fatto illecito, incluse le spese legali ragionevoli. GLAMRO risponde verso il Professionista del corretto funzionamento della Piattaforma e della corretta gestione dei pagamenti. Non risponde di interruzioni temporanee per manutenzione o cause fuori dal proprio controllo, né di mancati guadagni per periodi di scarsa domanda. Le limitazioni di questo articolo non valgono in caso di dolo o colpa grave (art. 1229 c.c.)."
          }
        ]
      },
      {
        "id": "durata-sospensione-recesso-e-disposizioni-finali",
        "title": "9. Durata, sospensione, recesso e disposizioni finali",
        "blocks": [
          {
            "type": "p",
            "text": "**9.1 Durata.** Questi Termini costituiscono il contratto tra GLAMRO e il Professionista. Il contratto si conclude con l'accettazione in app o sul sito ed è a tempo indeterminato. GLAMRO conserva data, ora e versione dei Termini accettati."
          },
          {
            "type": "p",
            "text": "**9.2 Recesso del Professionista.** Il Professionista può recedere in qualsiasi momento disattivando il profilo, senza costi. Le prenotazioni già accettate vanno eseguite o cancellate secondo l'art. 4.5."
          },
          {
            "type": "p",
            "text": "**9.3 Recesso di GLAMRO.** GLAMRO può recedere con un preavviso di almeno 30 giorni, comunicato via email con i motivi, salvo i casi dell'art. 9.4."
          },
          {
            "type": "p",
            "text": "**9.4 Sospensione e cessazione.** GLAMRO può sospendere il profilo, o cessare il contratto nei casi più gravi, quando:"
          },
          {
            "type": "list",
            "items": [
              "i requisiti dell'art. 3 mancano, i documenti caricati sono falsi o sono offerti Servizi non ammessi (art. 3.5);",
              "un Servizio non eseguito viene segnato come completato, o sono chiesti pagamenti fuori dalla Piattaforma;",
              "ci sono molestie, discriminazioni o comportamenti pericolosi verso Clienti;",
              "sono stati tentati frodi o abusi della Piattaforma;",
              "mancano i dati richiesti dalla normativa DAC7 (art. 5.7)."
            ]
          },
          {
            "type": "p",
            "text": "Inoltre, se in 90 giorni consecutivi si verificano 3 assenze o cancellazioni tardive imputabili al Professionista e non contestate, o confermate dopo la contestazione, GLAMRO può mettere in pausa la visibilità del profilo per un massimo di 30 giorni. È una misura contrattuale a tutela dell'affidabilità del servizio verso i Clienti, non una sanzione disciplinare. Le prenotazioni già accettate restano valide, salvo diversa comunicazione motivata."
          },
          {
            "type": "p",
            "text": "Prima di ogni sospensione o pausa GLAMRO comunica per iscritto, su supporto durevole, i fatti considerati e i motivi; il Professionista può rispondere entro 7 giorni, salvo i casi di rischio per la sicurezza dei Clienti, in cui la sospensione è immediata e la risposta è esaminata dopo. Ogni decisione è presa da una persona del team GLAMRO, mai da un sistema automatico, ed è motivata. Il Professionista può contestarla entro 15 giorni; GLAMRO risponde entro 15 giorni e riattiva il profilo se la contestazione è fondata. Durante la sospensione il Professionista può recedere senza costi."
          },
          {
            "type": "p",
            "text": "**9.5 Modifiche.** GLAMRO comunica le modifiche al contratto con almeno 15 giorni di preavviso (30 giorni per la modifica dell'importo della penale, art. 4.5 g), via email e in app. Il Professionista che non le accetta può recedere prima della loro entrata in vigore senza costi."
          },
          {
            "type": "p",
            "text": "**9.6 Reclami.** Il Professionista può presentare reclami su qualsiasi aspetto della Piattaforma scrivendo a contact@glamro.it o su WhatsApp al +39 392 366 1225. GLAMRO risponde entro 15 giorni lavorativi. Le parti possono ricorrere alla mediazione prima di agire in giudizio."
          },
          {
            "type": "p",
            "text": "**9.7 Comunicazioni.** Le comunicazioni avvengono via app, email o PEC agli indirizzi indicati nel profilo e in questo contratto."
          },
          {
            "type": "p",
            "text": "**9.8 Legge e foro.** Il contratto è regolato dalla legge italiana. Per le controversie è competente in via esclusiva il foro di Ancona."
          },
          {
            "type": "p",
            "text": "**Approvazione specifica.** Ai sensi degli artt. 1341 e 1342 c.c. il Professionista approva specificamente: 2.2 (importi a carico del Professionista), 3.3 (assicurazione), 3.5 (servizi non ammessi), 4.4 e 4.7 (cancellazioni del Cliente e obblighi verso il Consumatore), 4.5 (penale per assenza o cancellazione tardiva, commissioni di pagamento non restituite, compensazione e modifica dell'importo), 5.1 (mandato), 5.4 (storni e contestazioni), 5.7 (sospensione per dati DAC7), 8.5 (rapporto con i Clienti), 8.6 (limitazioni di responsabilità e manleva), 9.3 e 9.4 (recesso, sospensione, pausa della visibilità e cessazione), 9.5 (modifiche), 9.8 (foro esclusivo)."
          },
          {
            "type": "p",
            "text": "**Accettazione.** Il Professionista accetta questi Termini con una spunta, approva le clausole sopra elencate con una seconda spunta separata e accetta l'incarico di emissione dei documenti fiscali (art. 5.6) con una terza spunta separata. Nessuna spunta è preselezionata. GLAMRO conserva data, ora, identità del Professionista e versione accettata, e chiede una nuova accettazione quando i Termini cambiano."
          }
        ]
      }
    ],
    "previousVersions": []
  },
  "privacy": {
    "key": "privacy",
    "title": "Privacy Policy",
    "description": "Come GLAMRO S.R.L. tratta i dati personali di clienti e professionisti: finalità, basi giuridiche, conservazione, fornitori e diritti.",
    "version": "3.0",
    "effectiveDate": "2026-11-24",
    "updatedAt": "2026-11-24",
    "draft": LEGAL_DRAFT,
    "intro": "Informativa ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR) · Versione 3.0 · 24 novembre 2026 · sostituisce la versione 2.0 del 2 novembre 2026",
    "preamble": [],
    "sections": [
      {
        "id": "titolare-e-dati-trattati",
        "title": "1. Titolare e dati trattati",
        "blocks": [
          {
            "type": "p",
            "text": "Titolare del trattamento: GLAMRO S.R.L., Via Giacomo Matteotti 54, 60121 Ancona (AN), P.IVA 03036060428. Contatti per la privacy: contact@glamro.it, PEC glamrosrl@ionospec.it, telefono e WhatsApp +39 392 366 1225. GLAMRO non ha nominato un responsabile della protezione dei dati (DPO), perché non è obbligatorio per la sua attività."
          },
          {
            "type": "p",
            "text": "Questa informativa si applica al sito www.glamro.it, all'app GLAMRO per i Clienti, all'app GLAMRO Pro per i Professionisti e all'assistente virtuale presente sul sito e nelle app."
          },
          {
            "type": "table",
            "caption": "Interessati, Dati trattati",
            "head": [
              "Interessati",
              "Dati trattati"
            ],
            "rows": [
              [
                "Clienti",
                "Nome, cognome, email, telefono, indirizzi del Servizio, storico prenotazioni, recensioni, messaggi in chat con Professionisti e assistenza, dati di pagamento parziali (per esempio ultime 4 cifre della carta). Codice fiscale, indirizzo o partita IVA solo se il Cliente chiede la fattura"
              ],
              [
                "Professionisti (app GLAMRO Pro e sito)",
                "Dati anagrafici e fiscali, nome profilo pubblico (nickname), documento d'identità, abilitazioni professionali, per parrucchieri ed estetiste sede, estremi della SCIA e responsabile tecnico propri o del salone o centro di appoggio, estremi e scadenza della polizza assicurativa, foto e contenuti del profilo, Servizi, prezzi, zone e disponibilità, recensioni ricevute, messaggi in chat, dati richiesti dalla normativa DAC7, regime fiscale, dati di accredito gestiti dal fornitore di pagamento, documentazione di malattia o forza maggiore se chiede l'esclusione della penale"
              ],
              [
                "Utenti che attivano la geolocalizzazione",
                "Posizione del dispositivo, precisa o approssimativa secondo l'autorizzazione concessa, rilevata solo mentre l'app o la pagina è in uso"
              ],
              [
                "Professionisti che collegano Google Calendar",
                "Data, ora e stato di occupazione degli eventi del calendario necessari a sincronizzare l'agenda"
              ],
              [
                "Utenti che attivano le notifiche",
                "Identificativo del dispositivo per l'invio di notifiche push"
              ],
              [
                "Utenti dell'assistente virtuale",
                "Testo delle domande e delle risposte, tipo di utente indicato (Cliente o Professionista), lingua, data e ora; eventuale riepilogo inviato al team quando la conversazione passa a una persona"
              ],
              [
                "Visitatori del sito e dell'app",
                "Dati di navigazione, dispositivo, indirizzo IP, città o CAP cercati, cookie e strumenti simili (vedi Cookie Policy)"
              ],
              [
                "Iscritti alla newsletter, alla lista d'attesa o all'avviso «Avvisami quando arrivate»",
                "Email, CAP o città, telefono e nome se indicati, preferenze e consensi espressi con data e ora"
              ],
              [
                "Professionisti contattati da GLAMRO",
                "Nome, attività, recapiti professionali pubblicati (sito, social, elenchi pubblici)"
              ]
            ]
          },
          {
            "type": "p",
            "text": "I dati completi delle carte di pagamento sono trattati direttamente da Stripe, non da GLAMRO."
          }
        ]
      },
      {
        "id": "finalita-basi-giuridiche-e-conservazione",
        "title": "2. Finalità, basi giuridiche e conservazione",
        "blocks": [
          {
            "type": "table",
            "caption": "Finalità, Base giuridica (GDPR), Conservazione",
            "head": [
              "Finalità",
              "Base giuridica (GDPR)",
              "Conservazione"
            ],
            "rows": [
              [
                "Creare e gestire l'account, le prenotazioni, i pagamenti e i rimborsi",
                "Esecuzione del contratto (art. 6.1.b)",
                "Per la durata dell'account; i dati delle prenotazioni con rilevanza contabile per 10 anni"
              ],
              [
                "Mostrare i Professionisti disponibili vicino all'utente tramite geolocalizzazione",
                "Consenso (art. 6.1.a), concesso e revocabile dalle impostazioni del dispositivo o del browser",
                "Solo per la sessione in corso; non viene creato uno storico delle posizioni"
              ],
              [
                "Sincronizzare l'agenda del Professionista con Google Calendar, se lo richiede",
                "Esecuzione del contratto (art. 6.1.b)",
                "Finché il collegamento è attivo; dati rimossi entro 30 giorni dallo scollegamento"
              ],
              [
                "Verificare identità, partita IVA, abilitazioni, SCIA e polizza dei Professionisti",
                "Esecuzione del contratto e obbligo di legge (art. 6.1.b e c)",
                "Per la durata del rapporto e 12 mesi dopo la sua fine"
              ],
              [
                "Generare e trasmettere i documenti fiscali (documenti commerciali e fatture) di GLAMRO e quelli emessi per conto dei Professionisti, e adempiere agli obblighi contabili",
                "Obbligo di legge (art. 6.1.c)",
                "10 anni"
              ],
              [
                "Comunicazione DAC7 dei dati dei Professionisti all'Agenzia delle Entrate",
                "Obbligo di legge (art. 6.1.c; D.Lgs. 32/2023)",
                "Fino al 31 dicembre del quinto anno successivo a quello della comunicazione"
              ],
              [
                "Valutare la richiesta di esclusione della penale per malattia o forza maggiore del Professionista",
                "Accertamento e difesa di un diritto (art. 6.1.f e art. 9.2.f)",
                "12 mesi dalla decisione. Basta un certificato senza diagnosi: GLAMRO non chiede né conserva la diagnosi"
              ],
              [
                "Calcolare, comunicare e compensare le penali del Professionista e gestire le contestazioni",
                "Esecuzione del contratto (art. 6.1.b)",
                "Per la durata del rapporto e 24 mesi dopo"
              ],
              [
                "Notifiche di servizio (conferme, promemoria, cambi di prenotazione, avvisi di pagamento) via app, email o SMS",
                "Esecuzione del contratto (art. 6.1.b)",
                "Per la durata dell'account"
              ],
              [
                "Assistenza, reclami e gestione delle contestazioni, anche tramite WhatsApp e telefono",
                "Esecuzione del contratto e legittimo interesse (art. 6.1.b e f)",
                "24 mesi dalla chiusura della pratica"
              ],
              [
                "Rispondere alle domande tramite l'assistente virtuale e passare la conversazione al team quando serve",
                "Esecuzione di misure precontrattuali o del contratto e legittimo interesse a fornire assistenza rapida (art. 6.1.b e f)",
                "12 mesi dalla conversazione, poi cancellata o resa anonima"
              ],
              [
                "Migliorare le risposte dell'assistente virtuale e la base di conoscenza",
                "Legittimo interesse (art. 6.1.f), su conversazioni prive di dati identificativi",
                "12 mesi"
              ],
              [
                "Chat tra Cliente, Professionista e assistenza",
                "Esecuzione del contratto e legittimo interesse a gestire contestazioni e sicurezza (art. 6.1.b e f)",
                "24 mesi dal Servizio"
              ],
              [
                "Pubblicare e moderare le recensioni",
                "Esecuzione del contratto e legittimo interesse (art. 6.1.b e f)",
                "Finché la recensione è pubblicata"
              ],
              [
                "Prevenire frodi e abusi e proteggere la Piattaforma",
                "Legittimo interesse (art. 6.1.f)",
                "24 mesi"
              ],
              [
                "Avvisare quando GLAMRO arriva nella zona indicata («Avvisami quando arrivate») o al lancio, per chi si è iscritto alla lista d'attesa",
                "Richiesta dell'interessato (art. 6.1.b)",
                "Fino all'invio dell'avviso e comunque non oltre 12 mesi"
              ],
              [
                "Email su servizi GLAMRO analoghi a quelli già acquistati",
                "Legittimo interesse, art. 130, comma 4, D.Lgs. 196/2003; opposizione possibile in ogni email",
                "Fino all'opposizione"
              ],
              [
                "Comunicazioni promozionali via email, SMS, WhatsApp e notifiche push",
                "Consenso specifico, separato e non preselezionato (art. 6.1.a), revocabile in ogni momento",
                "Fino alla revoca, e comunque non oltre 24 mesi senza interazioni"
              ],
              [
                "Pubblicità personalizzata e misurazione delle campagne (Meta, Google)",
                "Consenso tramite banner cookie o richiesta nell'app (art. 6.1.a e art. 122 D.Lgs. 196/2003)",
                "Vedi Cookie Policy"
              ],
              [
                "Contattare professionisti del settore per proporre l'iscrizione",
                "Legittimo interesse (art. 6.1.f), solo per un primo contatto individuale e non automatizzato su canali professionali (per esempio telefonata al numero dell'attività, nel rispetto del Registro pubblico delle opposizioni, o messaggio su un social professionale); email, SMS e WhatsApp solo con consenso preventivo (art. 130 D.Lgs. 196/2003); informativa al primo contatto (art. 14)",
                "12 mesi senza adesione"
              ],
              [
                "Statistiche sull'uso della Piattaforma",
                "Legittimo interesse su dati aggregati o anonimizzati; consenso per gli strumenti che lo richiedono (vedi Cookie Policy)",
                "Dati personali per 24 mesi, poi anonimizzati"
              ],
              [
                "Difesa di un diritto in giudizio",
                "Legittimo interesse (art. 6.1.f)",
                "Per la durata del contenzioso"
              ]
            ]
          },
          {
            "type": "p",
            "text": "**Profilo pubblico del Professionista.** Sono pubblici sulla Piattaforma il nome profilo (nickname), le foto, i Servizi e i prezzi, le zone servite, lo stato di verifica, le recensioni e l'indicazione della copertura assicurativa. Nome legale, partita IVA e indirizzo della sede o del domicilio fiscale sono mostrati solo al Cliente che prenota, nel riepilogo prima del pagamento, come richiesto dagli artt. 49 e 49-bis del Codice del Consumo. Indirizzo di casa e recapiti personali del Professionista non sono mai pubblicati e il sito non mostra mai la posizione precisa dei Professionisti."
          },
          {
            "type": "p",
            "text": "Alla scadenza i dati vengono cancellati o resi anonimi. Il conferimento dei dati necessari a prenotare o a operare come Professionista è obbligatorio: senza questi dati il servizio non può essere fornito. Gli altri dati sono facoltativi."
          },
          {
            "type": "p",
            "text": "**Decisioni automatizzate.** GLAMRO non prende decisioni basate unicamente su trattamenti automatizzati che producano effetti giuridici o effetti analoghi sugli interessati. L'attivazione, la sospensione e la pausa dei profili dei Professionisti e le decisioni su penali, rimborsi e reclami sono sempre prese da una persona del team. L'ordine dei Professionisti nei risultati segue i parametri pubblicati nei Termini e Condizioni Clienti e Professionisti."
          },
          {
            "type": "p",
            "text": "**Assistente virtuale.** L'assistente virtuale è un sistema di intelligenza artificiale e lo dichiara all'inizio di ogni conversazione. Risponde sulla base di contenuti approvati da GLAMRO e non decide su rimborsi, penali o reclami. Non va usato per comunicare dati di pagamento, documenti, password o informazioni sulla salute: se l'utente li scrive, l'assistente lo avvisa e GLAMRO li cancella."
          }
        ]
      },
      {
        "id": "dati-sanitari",
        "title": "3. Dati sanitari",
        "blocks": [
          {
            "type": "p",
            "text": "Per svolgere il Servizio in sicurezza il Cliente può indicare allergie, sensibilità cutanee, gravidanza o altre condizioni rilevanti. Sono dati relativi alla salute (art. 9 GDPR)."
          },
          {
            "type": "list",
            "items": [
              "Sono trattati solo con il consenso esplicito del Cliente, raccolto con una casella separata e non preselezionata (art. 9.2.a). Senza consenso il Cliente può comunicarle a voce al Professionista.",
              "Sono visibili solo al Professionista che esegue il Servizio prenotato e, se necessario per un reclamo, al personale di assistenza autorizzato.",
              "Non sono usati per marketing, profilazione, statistiche o per l'assistente virtuale.",
              "Sono cancellati 12 mesi dopo l'ultimo Servizio, o prima se il Cliente revoca il consenso o li elimina dal profilo."
            ]
          }
        ]
      },
      {
        "id": "destinatari-fornitori-e-trasferimenti-fuori-dall-ue",
        "title": "4. Destinatari, fornitori e trasferimenti fuori dall'UE",
        "blocks": [
          {
            "type": "p",
            "text": "I dati sono accessibili al personale autorizzato di GLAMRO e comunicati solo a:"
          },
          {
            "type": "list",
            "items": [
              "**Professionisti**: i dati del Cliente necessari a eseguire il Servizio prenotato (nome, indirizzo, recapito, note e informazioni sanitarie se autorizzate). Per questi dati il Professionista è titolare autonomo del trattamento.",
              "**Fornitore di pagamento (Stripe)**, titolare autonomo per i dati di pagamento e per le verifiche antiriciclaggio e di identità dei Professionisti.",
              "**Fornitori tecnici** che operano come responsabili del trattamento (art. 28 GDPR): hosting e database, sviluppo e manutenzione di sito e app, invio di email e notifiche, assistenza clienti, fornitore del modello di intelligenza artificiale dell'assistente virtuale, servizio di mappe, analisi d'uso. L'elenco aggiornato è disponibile su richiesta a contact@glamro.it.",
              "**Fornitore dei documenti fiscali elettronici e Agenzia delle Entrate** (Sistema di Interscambio e trasmissione dei corrispettivi), per i documenti di GLAMRO e quelli che GLAMRO genera per conto dei Professionisti. Per questi ultimi GLAMRO tratta i dati del Cliente come responsabile del trattamento del Professionista (art. 28 GDPR).",
              "**Consulenti** (commercialista, legali) e **autorità** quando richiesto dalla legge, inclusa l'Agenzia delle Entrate per la comunicazione DAC7."
            ]
          },
          {
            "type": "p",
            "text": "Alcuni fornitori hanno sede o server fuori dall'Unione europea, per esempio negli Stati Uniti o in India. In questi casi il trasferimento avviene sulla base di una decisione di adeguatezza della Commissione europea (per esempio l'EU-US Data Privacy Framework) o delle clausole contrattuali standard approvate dalla Commissione (art. 46 GDPR). L'interessato può chiederne copia a contact@glamro.it."
          },
          {
            "type": "p",
            "text": "GLAMRO non vende i dati personali. I contenuti pubblici del sito (testi informativi, pagine dei servizi e delle città) possono essere letti da motori di ricerca e da sistemi di intelligenza artificiale; non contengono dati personali di Clienti e i profili dei Professionisti mostrano solo il nome profilo e le informazioni professionali indicate sopra."
          },
          {
            "type": "p",
            "text": "**Integrazione con Google Calendar.** Il Professionista può collegare il proprio Google Calendar all'app GLAMRO Pro per evitare sovrapposizioni tra appuntamenti. GLAMRO legge e scrive solo gli eventi necessari alla gestione dell'agenda, non usa questi dati per pubblicità né li cede a terzi, e il Professionista può revocare l'accesso in ogni momento dalle impostazioni dell'app o del proprio account Google. L'uso e il trasferimento a qualsiasi altra app delle informazioni ricevute dalle API di Google rispettano le Google API Services User Data Policy, inclusi i requisiti di Limited Use."
          }
        ]
      },
      {
        "id": "diritti-minori-sicurezza-e-modifiche",
        "title": "5. Diritti, minori, sicurezza e modifiche",
        "blocks": [
          {
            "type": "p",
            "text": "**Diritti.** L'interessato può chiedere in ogni momento accesso, rettifica, cancellazione, limitazione e portabilità dei propri dati, opporsi ai trattamenti basati sul legittimo interesse e revocare i consensi dati, senza effetti sui trattamenti già svolti (artt. 15–22 GDPR). L'account si può eliminare direttamente dall'app; le altre richieste si inviano a contact@glamro.it; GLAMRO risponde entro 30 giorni. L'interessato può anche presentare reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it)."
          },
          {
            "type": "p",
            "text": "**Minori.** L'account è riservato ai maggiorenni. I dati di un minore che riceve un Servizio sono forniti dal genitore che prenota e trattati solo per eseguire il Servizio."
          },
          {
            "type": "p",
            "text": "**Sicurezza.** GLAMRO adotta misure tecniche e organizzative adeguate: connessioni cifrate, accesso ai dati limitato al personale autorizzato, credenziali individuali, copie di backup. In caso di violazione dei dati che comporti rischi per gli interessati, GLAMRO informa il Garante entro 72 ore e, se necessario, gli interessati."
          },
          {
            "type": "p",
            "text": "**Modifiche.** GLAMRO può aggiornare questa informativa. Le modifiche rilevanti sono comunicate via email o in app prima dell'entrata in vigore."
          },
          {
            "type": "p",
            "text": "Ultimo aggiornamento: 24 novembre 2026."
          }
        ]
      }
    ],
    "previousVersions": []
  },
  "cookie": {
    "key": "cookie",
    "title": "Cookie Policy",
    "description": "Quali cookie e strumenti simili usa GLAMRO, a cosa servono e come gestire il consenso.",
    "version": "3.0",
    "effectiveDate": "2026-11-24",
    "updatedAt": "2026-11-24",
    "draft": LEGAL_DRAFT,
    "intro": "Ai sensi dell'art. 122 del D.Lgs. 196/2003 e delle Linee guida del Garante del 10 giugno 2021 · Versione 3.0 · 24 novembre 2026 · sostituisce la versione 2.0 del 2 novembre 2026",
    "preamble": [
      {
        "type": "p",
        "text": "Titolare: GLAMRO S.R.L., Via Giacomo Matteotti 54, 60121 Ancona (AN), P.IVA 03036060428, contact@glamro.it."
      },
      {
        "type": "p",
        "text": "**Cosa sono.** I cookie sono piccoli file che il sito salva sul dispositivo dell'utente. Strumenti simili (archiviazione locale del browser, pixel, SDK, identificatori del dispositivo) sono usati anche nel sito e nell'app. Questa informativa li tratta allo stesso modo."
      }
    ],
    "sections": [
      {
        "id": "quali-usiamo",
        "title": "Quali usiamo",
        "blocks": [
          {
            "type": "table",
            "caption": "Categoria, Strumento e fornitore, A cosa serve, Consenso, Durata indicativa",
            "head": [
              "Categoria",
              "Strumento e fornitore",
              "A cosa serve",
              "Consenso",
              "Durata indicativa"
            ],
            "rows": [
              [
                "Tecnici necessari",
                "Cookie di sessione e di accesso di GLAMRO",
                "Funzionamento del sito, login, sicurezza",
                "Non richiesto",
                "Sessione"
              ],
              [
                "Tecnici necessari",
                "glamro_consent (archiviazione locale, GLAMRO)",
                "Memorizzare le scelte sui cookie, la versione e la data del consenso",
                "Non richiesto",
                "6 mesi"
              ],
              [
                "Tecnici necessari",
                "glamro_lang (GLAMRO)",
                "Ricordare la lingua scelta (italiano o inglese)",
                "Non richiesto",
                "12 mesi"
              ],
              [
                "Tecnici necessari",
                "Stripe",
                "Pagamento sicuro e prevenzione delle frodi",
                "Non richiesto",
                "Secondo il fornitore"
              ],
              [
                "Tecnici necessari",
                "Assistente virtuale GLAMRO",
                "Mantenere aperta la conversazione durante la navigazione",
                "Non richiesto",
                "Sessione"
              ],
              [
                "Contenuti di terze parti",
                "Mappa (OpenFreeMap)",
                "Mostrare lo sfondo della mappa delle zone coperte. Non imposta cookie; il fornitore riceve l'indirizzo IP",
                "Non richiesto",
                "Nessun cookie"
              ],
              [
                "Statistica",
                "Google Analytics 4 (Google Ireland Ltd)",
                "Statistiche sull'uso di sito e app",
                "Richiesto",
                "Fino a 2 anni"
              ],
              [
                "Marketing",
                "Meta Pixel e SDK (Meta Platforms Ireland Ltd)",
                "Misurazione delle conversioni e annunci su Facebook e Instagram",
                "Richiesto",
                "Fino a 3 mesi"
              ],
              [
                "Marketing",
                "Google Ads e Remarketing (Google Ireland Ltd)",
                "Annunci a chi ha già visitato il sito e misurazione delle campagne",
                "Richiesto",
                "Da 3 a 13 mesi, secondo il cookie"
              ]
            ]
          },
          {
            "type": "p",
            "text": "Gli strumenti di statistica e marketing si attivano solo dopo il consenso. I cookie di terze parti sono gestiti dai rispettivi fornitori, secondo le loro informative."
          }
        ]
      },
      {
        "id": "come-gestire-il-consenso",
        "title": "Come gestire il consenso",
        "blocks": [
          {
            "type": "p",
            "text": "Alla prima visita un banner permette di accettare tutti i cookie, rifiutarli o scegliere per categoria, con la stessa facilità. Chiudendo il banner con la \"X\" si rifiutano i cookie non necessari. Le scelte si possono modificare in ogni momento dal link \"Gestisci cookie\" in fondo a ogni pagina. I cookie si possono anche cancellare o bloccare dalle impostazioni del browser; bloccare quelli tecnici può impedire il funzionamento del sito."
          },
          {
            "type": "p",
            "text": "Nell'app le stesse scelte si gestiscono da Impostazioni > Privacy; su iOS il tracciamento pubblicitario richiede anche il permesso di App Tracking Transparency. Le istruzioni dei principali browser sono disponibili sui siti di Chrome, Firefox, Safari e Edge. Per gestire la pubblicità comportamentale di più operatori è possibile usare anche Your Online Choices."
          },
          {
            "type": "p",
            "text": "**Diritti.** Per i diritti sui dati personali e per il reclamo al Garante vedi la Privacy Policy su www.glamro.it/privacy."
          },
          {
            "type": "p",
            "text": "Ultimo aggiornamento: 24 novembre 2026."
          },
          {
            "type": "manage-cookies"
          }
        ]
      }
    ],
    "previousVersions": []
  },
  "cancellazioni-rimborsi": {
    "key": "cancellazioni-rimborsi",
    "title": "Cancellazioni, rimborsi e reclami",
    "description": "Cancellazioni, rimborsi e reclami su GLAMRO in breve, per clienti e professionisti.",
    "version": "1.0",
    "effectiveDate": "2026-11-24",
    "updatedAt": "2026-11-24",
    "draft": LEGAL_DRAFT,
    "intro": "Policy in breve per Clienti e Professionisti · Versione 1.0 · 24 novembre 2026 · riassume i Termini e Condizioni v3.0, che prevalgono in caso di differenze",
    "preamble": [],
    "sections": [
      {
        "id": "per-i-clienti",
        "title": "Per i Clienti",
        "blocks": [
          {
            "type": "h3",
            "text": "Quando paghi"
          },
          {
            "type": "list",
            "items": [
              "Quando prenoti registri la carta, ma **non paghi nulla**.",
              "24 ore prima del servizio l'importo viene solo bloccato sulla carta.",
              "Paghi davvero solo **a servizio eseguito**.",
              "Vedi sempre prima il prezzo del professionista, il supplemento GLAMRO del 20% (minimo 6 €) e il totale. Non ci sono costi di trasferta o costi nascosti. Ordine minimo 20 €."
            ]
          },
          {
            "type": "h3",
            "text": "Se cancelli tu"
          },
          {
            "type": "table",
            "caption": "Quando cancelli, Quanto paghi",
            "head": [
              "Quando cancelli",
              "Quanto paghi"
            ],
            "rows": [
              [
                "Fino a 1 ora prima del servizio",
                "Niente"
              ],
              [
                "Nell'ultima ora, o se non ti fai trovare",
                "Il totale prenotato"
              ]
            ]
          },
          {
            "type": "p",
            "text": "Puoi anche spostare l'appuntamento gratis fino a 1 ora prima, se il professionista è disponibile. Il professionista ti aspetta almeno 15 minuti."
          },
          {
            "type": "h3",
            "text": "Se il professionista non arriva o cancella"
          },
          {
            "type": "p",
            "text": "Se il professionista cancella, non si presenta, arriva con più di 30 minuti di ritardo o non esegue il servizio per un motivo suo, **ti rimborsiamo tutto**: prezzo del servizio e supplemento, senza trattenute. Se non avevi ancora pagato, il blocco sulla carta si annulla e non paghi nulla. Possiamo proporti un altro professionista o una nuova data, ma puoi sempre scegliere il rimborso."
          },
          {
            "type": "h3",
            "text": "Come e quando arriva il rimborso"
          },
          {
            "type": "list",
            "items": [
              "Disponiamo il rimborso entro 5 giorni lavorativi, sulla stessa carta usata per prenotare.",
              "La banca di solito lo accredita in 5–10 giorni lavorativi.",
              "I rimborsi non vengono trasformati in credito in app."
            ]
          },
          {
            "type": "h3",
            "text": "Se il servizio non va come previsto"
          },
          {
            "type": "p",
            "text": "Se il servizio è diverso o incompleto rispetto a quanto prenotato, scrivici. Valutiamo il caso con te e con il professionista e possiamo proporre un nuovo intervento gratuito, un rimborso parziale o totale. Un risultato conforme a quanto richiesto, che però non ti piace, da solo non dà diritto al rimborso."
          },
          {
            "type": "h3",
            "text": "Come fare un reclamo"
          },
          {
            "type": "olist",
            "start": 1,
            "items": [
              "Scrivici il prima possibile dall'app (Assistenza Ordine), su WhatsApp al +39 392 366 1225 o a contact@glamro.it, con il codice della prenotazione e, se utile, qualche foto.",
              "Ti confermiamo la ricezione entro 2 giorni lavorativi.",
              "Verifichiamo con gli stati registrati in app («In viaggio», «Arrivato», «Iniziato», «Completato»), la chat e quanto ci dite tu e il professionista.",
              "Ti diamo l'esito per iscritto, con il motivo, entro 15 giorni lavorativi. Se non sei d'accordo puoi chiedere una nuova valutazione."
            ]
          },
          {
            "type": "p",
            "text": "Ti chiediamo di scriverci preferibilmente entro 7 giorni dal servizio, perché così è più facile verificare. Se scrivi dopo, valutiamo comunque il tuo caso: non perdi nessun diritto. Restano sempre salvi i tuoi diritti di consumatore, compresa la possibilità di rivolgerti a un organismo di risoluzione alternativa delle controversie (ADR) o al giudice."
          },
          {
            "type": "h3",
            "text": "Diritto di recesso"
          },
          {
            "type": "p",
            "text": "Il recesso di 14 giorni non si applica ai servizi prenotati su GLAMRO, perché sono servizi per il tempo libero con una data fissa (art. 59, lett. n, Codice del Consumo). Al suo posto c'è la cancellazione gratuita fino a 1 ora prima."
          }
        ]
      },
      {
        "id": "per-i-professionisti",
        "title": "Per i Professionisti",
        "blocks": [
          {
            "type": "h3",
            "text": "Se cancella o non si presenta il cliente"
          },
          {
            "type": "table",
            "caption": "Caso, Quanto ricevi",
            "head": [
              "Caso",
              "Quanto ricevi"
            ],
            "rows": [
              [
                "Il cliente cancella fino a 1 ora prima",
                "Niente: il cliente non ha pagato nulla"
              ],
              [
                "Il cliente cancella nell'ultima ora",
                "Il 100% del tuo prezzo"
              ],
              [
                "Il cliente non si fa trovare dopo 15 minuti di attesa",
                "Il 100% del tuo prezzo, se segnali l'assenza in app entro 2 ore"
              ]
            ]
          },
          {
            "type": "h3",
            "text": "Se cancelli tu o non ti presenti"
          },
          {
            "type": "list",
            "items": [
              "Puoi rifiutare qualsiasi richiesta, o non rispondere, senza conseguenze.",
              "Puoi cancellare gratis una prenotazione accettata fino a 24 ore prima.",
              "Se non ti presenti, arrivi con più di 30 minuti di ritardo o cancelli con meno di 24 ore di preavviso, il cliente viene rimborsato per intero e a te si applica una **penale fissa di 5 €**, che copre i costi di GLAMRO per la prenotazione annullata e l'assistenza al cliente. Se il cliente aveva già pagato, ti vengono addebitate anche **le commissioni di pagamento di Stripe** che non vengono restituite sul rimborso. Se l'importo era solo bloccato sulla carta, queste commissioni non ci sono.",
              "**Niente penale** se il cliente accetta un nuovo orario o se c'è una causa di forza maggiore documentata (malattia o infortunio tuo o di un familiare convivente, emergenza, guasto improvviso del mezzo, maltempo eccezionale, provvedimenti delle autorità). Manda la documentazione entro 7 giorni; per la salute basta un certificato senza diagnosi.",
              "Ricevi la comunicazione della penale con il motivo e hai 7 giorni per contestarla. Una persona del team valuta la contestazione.",
              "Penale e commissioni confermate vengono scalate dal tuo primo pagamento successivo, e le vedi nel riepilogo in app.",
              "Con 3 episodi in 90 giorni il profilo può essere messo in pausa fino a 30 giorni, dopo una comunicazione scritta e la possibilità di rispondere."
            ]
          },
          {
            "type": "p",
            "text": "GLAMRO resta gratuita: nessun costo di iscrizione, nessun abbonamento, nessuna commissione. Incassi il 100% del tuo prezzo, salvo queste penali."
          },
          {
            "type": "h3",
            "text": "Rimborsi ai clienti e contestazioni"
          },
          {
            "type": "p",
            "text": "Se un cliente ha diritto al rimborso perché il servizio non è stato eseguito o non è conforme per un motivo che dipende da te, l'importo viene stornato dal tuo conto di pagamento. Ti informiamo prima e ascoltiamo la tua versione. I tuoi pagamenti arrivano in banca 7 giorni dopo l'addebito al cliente, proprio per gestire questi casi."
          }
        ]
      }
    ],
    "previousVersions": []
  }
};


