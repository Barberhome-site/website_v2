/**
 * Contenu éditorial du site : catégories de services, villes, textes génériques.
 *
 * Ce contenu appartient au site (il n'existe pas dans l'API) et sert dans les deux modes :
 *  - données d'exemple (core/data/mock) ;
 *  - données réelles (src/server/site-api), où l'API fournit les professionnels, les comptages
 *    et la couverture, et ce fichier le texte des pages.
 *
 * Module sans dépendance Angular : il est aussi importé par le serveur Express.
 */
import { City, Faq, ServiceCategory } from '../models/glamro.models';
import { Lang } from '../i18n/i18n.config';
import { CONTENT_TEXTS } from './content-texts';

const UPDATED = '2026-11-02';

/* ------------------------------------------------------------------ */
/* Servizi                                                             */
/* ------------------------------------------------------------------ */

/** Contenu éditorial d'une catégorie (sans les villes actives, calculées à partir des données). */
export type ServiceContent = Omit<ServiceCategory, 'activeCitySlugs'>;

/** Catégories du site, en italien (traductions : content-texts.ts). Brief : pas d'ongles, la barbe est dans Capelli. */
export const SERVICES_IT: ServiceContent[] = [
  {
    slug: 'capelli',
    name: 'Capelli',
    professionalLabel: 'Parrucchieri e barbieri',
    shortDescription: 'Taglio, piega, colore e barba',
    intro:
      'Con GLAMRO prenoti un parrucchiere o un barbiere verificato che viene a casa tua, in ufficio o in hotel, nelle città in cui il servizio è attivo. Scegli servizio, data e professionista in base alla disponibilità reale.',
    audience: 'Per chi vuole taglio, piega, colore o la cura della barba senza spostarsi, anche prima di un evento o in giornate piene.',
    includes: ['Taglio donna e uomo', 'Piega e styling', 'Colore e ritocco radici', 'Barba e rifinitura'],
    conditions: ['Serve uno spazio con una sedia e una presa elettrica vicina.'],
    image: null,
    faqs: [
      {
        question: 'Devo avere prodotti o strumenti a casa?',
        answer: 'No. Il professionista porta prodotti e strumenti. Ti serve solo uno spazio con una sedia e una presa elettrica.',
      },
      {
        question: 'Posso prenotare un colore a domicilio?',
        answer: 'Sì, se il professionista lo offre nel suo profilo. Durata e prezzo sono indicati prima della conferma.',
      },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: 'make-up',
    name: 'Make-up',
    professionalLabel: 'Make-up artist',
    shortDescription: 'Trucco per eventi, cerimonie e foto',
    intro:
      'Con GLAMRO prenoti una make-up artist verificata che arriva dove ti prepari: casa, hotel o location dell\'evento, nelle città in cui il servizio è attivo.',
    audience: 'Per eventi, cerimonie, servizi fotografici o semplicemente per un trucco curato prima di uscire.',
    includes: ['Trucco giorno e sera', 'Trucco per cerimonie', 'Trucco per foto e video', 'Prova trucco'],
    conditions: [],
    image: null,
    faqs: [
      {
        question: 'Si può prenotare per più persone?',
        answer: 'Dipende dalla disponibilità del professionista. Indica il numero di persone al momento della prenotazione nell\'app.',
      },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: 'estetica',
    name: 'Estetica',
    professionalLabel: 'Estetiste',
    shortDescription: 'Trattamenti viso, corpo e depilazione',
    intro:
      'Con GLAMRO prenoti un\'estetista verificata per trattamenti viso, corpo e depilazione direttamente a casa tua, nelle città in cui il servizio è attivo.',
    audience: 'Per chi vuole trattamenti estetici senza spostarsi, con prodotti e lettino portati dal professionista quando previsto.',
    includes: ['Pulizia del viso', 'Trattamenti corpo', 'Linfodrenante', 'Depilazione', 'Laminazione ciglia e sopracciglia'],
    conditions: [],
    image: null,
    faqs: [
      {
        question: 'Il professionista porta il lettino?',
        answer: 'Se il trattamento lo richiede, è indicato nella scheda del servizio all\'interno del profilo.',
      },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: 'massaggi',
    name: 'Massaggi',
    professionalLabel: 'Massaggiatori',
    shortDescription: 'Massaggi rilassanti e decontratturanti',
    intro:
      'GLAMRO ti mette in contatto con massaggiatori verificati per massaggi benessere a domicilio, nelle città attive. Non si tratta di prestazioni sanitarie.',
    audience: 'Per chi vuole un massaggio benessere a casa o in hotel, nei tempi che preferisce.',
    includes: ['Massaggio rilassante', 'Massaggio decontratturante'],
    conditions: ['I massaggi offerti sono trattamenti di benessere, non prestazioni sanitarie.'],
    image: null,
    faqs: [
      {
        question: 'Serve avere un lettino a casa?',
        answer: 'No, se il professionista indica nel profilo che porta il lettino. Ti serve solo uno spazio libero di circa 2 × 3 metri.',
      },
    ],
    updatedAt: UPDATED,
  },
];

/* ------------------------------------------------------------------ */
/* Città                                                               */
/* ------------------------------------------------------------------ */

/** Données de base d'une ville : nom et région en italien, centre approximatif, préfixes de CAP. */
export interface CityBase {
  slug: string;
  name: string;
  region: string;
  latitudeApprox: number;
  longitudeApprox: number;
  postalCodePrefixes: string[];
}

/**
 * Villes suivies par le site. Avec l'API, une ville est « active » dès qu'au moins un
 * professionnel publié la couvre ; sinon elle est en liste d'attente (page non indexée).
 * Pour suivre une nouvelle ville : l'ajouter ici (+ son nom et sa région dans content-texts.ts).
 */
export const CITIES: CityBase[] = [
  { slug: 'milano', name: 'Milano', region: 'Lombardia', latitudeApprox: 45.4642, longitudeApprox: 9.19, postalCodePrefixes: ['201'] },
  { slug: 'roma', name: 'Roma', region: 'Lazio', latitudeApprox: 41.9028, longitudeApprox: 12.4964, postalCodePrefixes: ['001'] },
  { slug: 'torino', name: 'Torino', region: 'Piemonte', latitudeApprox: 45.0703, longitudeApprox: 7.6869, postalCodePrefixes: ['101'] },
  { slug: 'napoli', name: 'Napoli', region: 'Campania', latitudeApprox: 40.8518, longitudeApprox: 14.2681, postalCodePrefixes: ['801'] },
  { slug: 'bologna', name: 'Bologna', region: 'Emilia-Romagna', latitudeApprox: 44.4949, longitudeApprox: 11.3426, postalCodePrefixes: ['401'] },
  { slug: 'firenze', name: 'Firenze', region: 'Toscana', latitudeApprox: 43.7696, longitudeApprox: 11.2558, postalCodePrefixes: ['501'] },
  { slug: 'genova', name: 'Genova', region: 'Liguria', latitudeApprox: 44.4056, longitudeApprox: 8.9463, postalCodePrefixes: ['161'] },
  { slug: 'venezia', name: 'Venezia', region: 'Veneto', latitudeApprox: 45.4408, longitudeApprox: 12.3155, postalCodePrefixes: ['301'] },
  { slug: 'verona', name: 'Verona', region: 'Veneto', latitudeApprox: 45.4384, longitudeApprox: 10.9916, postalCodePrefixes: ['371'] },
  { slug: 'padova', name: 'Padova', region: 'Veneto', latitudeApprox: 45.4064, longitudeApprox: 11.8768, postalCodePrefixes: ['351'] },
  { slug: 'brescia', name: 'Brescia', region: 'Lombardia', latitudeApprox: 45.5416, longitudeApprox: 10.2118, postalCodePrefixes: ['251'] },
  { slug: 'bergamo', name: 'Bergamo', region: 'Lombardia', latitudeApprox: 45.6983, longitudeApprox: 9.6773, postalCodePrefixes: ['241'] },
  { slug: 'bari', name: 'Bari', region: 'Puglia', latitudeApprox: 41.1171, longitudeApprox: 16.8719, postalCodePrefixes: ['701'] },
  { slug: 'palermo', name: 'Palermo', region: 'Sicilia', latitudeApprox: 38.1157, longitudeApprox: 13.3615, postalCodePrefixes: ['901'] },
  { slug: 'catania', name: 'Catania', region: 'Sicilia', latitudeApprox: 37.5079, longitudeApprox: 15.083, postalCodePrefixes: ['951'] },
];

interface CityTexts {
  /** Paramètre : {city}. */
  intro: string;
  inactiveIntro: string;
  faqs: Faq[];
}

/** Textes génériques des pages ville (sans liste de quartiers : l'API n'en fournit pas). */
const CITY_TEXTS: Record<Lang, CityTexts> = {
  it: {
    intro: 'A {city} GLAMRO è attivo con professionisti beauty verificati che raggiungono casa, ufficio o hotel.',
    inactiveIntro: 'GLAMRO non è ancora prenotabile a {city}.',
    faqs: [
      { question: 'In quali zone di {city} è disponibile GLAMRO?', answer: 'Ogni professionista indica la zona che copre. Per un indirizzo preciso, inserisci il CAP nella verifica disponibilità.' },
      { question: 'Ci sono costi di trasferta a {city}?', answer: 'No. Il prezzo che vedi nel profilo del professionista è quello che paghi.' },
    ],
  },
  en: {
    intro: 'In {city}, GLAMRO is active with verified beauty professionals who come to your home, office or hotel.',
    inactiveIntro: 'GLAMRO cannot yet be booked in {city}.',
    faqs: [
      { question: 'Which areas of {city} does GLAMRO cover?', answer: 'Each professional sets the area they cover. For a specific address, enter your postcode in the availability check.' },
      { question: 'Are there travel costs in {city}?', answer: 'No. The price you see on the professional\'s profile is the price you pay.' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Profili                                                             */
/* ------------------------------------------------------------------ */

/** Conditions génériques affichées sur un profil. */
export const PROFILE_CONDITIONS: Record<Lang, string[]> = {
  it: ['Il prezzo che vedi è quello che paghi.', 'Prenoti e paghi nell\'app GLAMRO, solo a servizio svolto.'],
  en: CONTENT_TEXTS.en.proConditions,
};

/** Libellés des types de professionnel de l'API (`professionalTypes`, codes du backend). */
export const PROFESSIONAL_TYPE_LABELS: Record<Lang, Record<string, string>> = {
  it: { HAIR_BARBER: 'Parrucchiere / Barbiere', HAIRSTYLIST_EVENTS: 'Parrucchiere per eventi', BEAUTICIAN: 'Estetista', MAKEUP_ARTIST: 'Make-up artist', MASSAGE: 'Massaggiatore' },
  en: { HAIR_BARBER: 'Hairdresser / Barber', HAIRSTYLIST_EVENTS: 'Event hairdresser', BEAUTICIAN: 'Beautician', MAKEUP_ARTIST: 'Make-up artist', MASSAGE: 'Massage therapist' },
};

/* ------------------------------------------------------------------ */
/* Accesso tradotto                                                    */
/* ------------------------------------------------------------------ */

const fill = (template: string, params: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => params[key] ?? '');

/** Catégories traduites dans la langue demandée. */
export function servicesContent(lang: Lang): ServiceContent[] {
  return lang === 'it' ? SERVICES_IT : SERVICES_IT.map((s) => ({ ...s, ...CONTENT_TEXTS[lang].services[s.slug] }));
}

export function cityName(slug: string, lang: Lang): string {
  const base = CITIES.find((c) => c.slug === slug);
  return (lang === 'it' ? undefined : CONTENT_TEXTS[lang].cityNames[slug]) ?? base?.name ?? slug;
}

/** Contenu d'une page ville, sans les données vivantes (statut, comptage, services actifs). */
export type CityContent = Omit<City, 'status' | 'indexable' | 'activeServiceSlugs' | 'availableCount' | 'intro' | 'faqs'>;

export function citiesContent(lang: Lang): CityContent[] {
  return CITIES.map((c) => ({
    ...c,
    name: cityName(c.slug, lang),
    region: (lang === 'it' ? undefined : CONTENT_TEXTS[lang].regions[c.region]) ?? c.region,
    areasServed: [],
    updatedAt: UPDATED,
  }));
}

/** Introduction et FAQ d'une ville selon son statut. */
export function cityTexts(name: string, active: boolean, lang: Lang): Pick<City, 'intro' | 'faqs'> {
  const t = CITY_TEXTS[lang];
  return {
    intro: fill(active ? t.intro : t.inactiveIntro, { city: name }),
    faqs: active ? t.faqs.map((f) => ({ question: fill(f.question, { city: name }), answer: fill(f.answer, { city: name }) })) : [],
  };
}
