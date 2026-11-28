/**
 * ⚠️ DONNÉES D'EXEMPLE — NE PAS PUBLIER TELLES QUELLES.
 *
 * Ces données servent uniquement à développer l'interface tant que l'API n'est pas disponible.
 * Noms, zones, prix et disponibilités sont fictifs. Le brief interdit de publier des
 * disponibilités, notes ou avis inventés : en production, tout doit venir de l'API.
 *
 * Aucun avis ni note n'est inventé ici (listes `reviews` vides).
 */
import { City, Faq, ProfessionalProfile, ProfessionalSummary, ServiceCategory } from '../../models/glamro.models';
import { addDaysIso, todayIso } from '../../utils/dates';
import { Lang } from '../../i18n/i18n.config';
import { CONTENT_TEXTS } from '../../content/content-texts';
import { SERVICES_IT } from '../../content/site-content';

const UPDATED = '2026-11-02';
const RAW_SERVICES = SERVICES_IT;

/* ------------------------------------------------------------------ */
/* Città                                                               */
/* ------------------------------------------------------------------ */

type RawCity = Omit<City, 'activeServiceSlugs' | 'availableCount'>;

const cityFaqs = (name: string): Faq[] => [
  {
    question: `In quali zone di ${name} è disponibile GLAMRO?`,
    answer: `Le zone coperte sono elencate in questa pagina e aggiornate in base ai professionisti attivi. Per un indirizzo preciso, inserisci il CAP nella verifica disponibilità.`,
  },
  {
    question: `Ci sono costi di trasferta a ${name}?`,
    answer: 'No. Il prezzo che vedi nel profilo del professionista è quello che paghi.',
  },
];

const RAW_CITIES: RawCity[] = [
  {
    slug: 'milano',
    name: 'Milano',
    region: 'Lombardia',
    status: 'active',
    indexable: true,
    intro:
      'A Milano GLAMRO è attivo con professionisti beauty verificati che raggiungono casa, ufficio o hotel nelle zone coperte.',
    areasServed: ['Centro storico', 'Porta Romana', 'Isola', 'Città Studi', 'Navigli'],
    postalCodePrefixes: ['201'],
    latitudeApprox: 45.4642,
    longitudeApprox: 9.19,
    faqs: cityFaqs('Milano'),
    updatedAt: UPDATED,
  },
  {
    slug: 'roma',
    name: 'Roma',
    region: 'Lazio',
    status: 'active',
    indexable: true,
    intro: 'A Roma GLAMRO è attivo con professionisti beauty verificati nelle zone centrali e semicentrali indicate qui sotto.',
    areasServed: ['Centro storico', 'Prati', 'Parioli', 'San Giovanni', 'Trastevere'],
    postalCodePrefixes: ['001'],
    latitudeApprox: 41.9028,
    longitudeApprox: 12.4964,
    faqs: cityFaqs('Roma'),
    updatedAt: UPDATED,
  },
  {
    slug: 'torino',
    name: 'Torino',
    region: 'Piemonte',
    status: 'active',
    indexable: true,
    intro: 'A Torino GLAMRO è attivo con professionisti verificati per capelli e barba nelle zone indicate.',
    areasServed: ['Centro', 'Crocetta', 'San Salvario', 'Vanchiglia'],
    postalCodePrefixes: ['101'],
    latitudeApprox: 45.0703,
    longitudeApprox: 7.6869,
    faqs: cityFaqs('Torino'),
    updatedAt: UPDATED,
  },
  {
    slug: 'bologna',
    name: 'Bologna',
    region: 'Emilia-Romagna',
    status: 'active',
    indexable: true,
    intro: 'A Bologna GLAMRO è attivo con make-up artist ed estetiste verificati nelle zone indicate.',
    areasServed: ['Centro storico', 'Santo Stefano', 'Saragozza'],
    postalCodePrefixes: ['401'],
    latitudeApprox: 44.4949,
    longitudeApprox: 11.3426,
    faqs: cityFaqs('Bologna'),
    updatedAt: UPDATED,
  },
  {
    slug: 'firenze',
    name: 'Firenze',
    region: 'Toscana',
    status: 'active',
    indexable: true,
    intro: 'A Firenze GLAMRO è attivo con professionisti verificati per make-up e massaggi nelle zone indicate.',
    areasServed: ['Centro storico', 'Campo di Marte', 'Oltrarno'],
    postalCodePrefixes: ['501'],
    latitudeApprox: 43.7696,
    longitudeApprox: 11.2558,
    faqs: cityFaqs('Firenze'),
    updatedAt: UPDATED,
  },
  {
    slug: 'napoli',
    name: 'Napoli',
    region: 'Campania',
    status: 'active',
    indexable: true,
    intro: 'A Napoli GLAMRO è attivo con parrucchieri e barbieri verificati nelle zone indicate.',
    areasServed: ['Chiaia', 'Vomero', 'Centro storico', 'Posillipo'],
    postalCodePrefixes: ['801'],
    latitudeApprox: 40.8518,
    longitudeApprox: 14.2681,
    faqs: cityFaqs('Napoli'),
    updatedAt: UPDATED,
  },
  {
    slug: 'bari',
    name: 'Bari',
    region: 'Puglia',
    status: 'waitlist',
    indexable: false,
    intro: 'GLAMRO non è ancora prenotabile a Bari.',
    areasServed: [],
    postalCodePrefixes: ['701'],
    latitudeApprox: 41.1171,
    longitudeApprox: 16.8719,
    faqs: [],
    updatedAt: UPDATED,
  },
];

/* ------------------------------------------------------------------ */
/* Professionisti                                                      */
/* ------------------------------------------------------------------ */

type RawPro = Omit<ProfessionalSummary, 'profileUrl' | 'cityName' | 'nextAvailability'> & { availableInDays: number };

const RAW_PROS: RawPro[] = [
  { professionalId: 'giulia-m', displayName: 'Giulia M.', specialties: ['capelli'], specialtyLabel: 'Parrucchiera', verified: true, serviceArea: 'Centro storico, Porta Romana', citySlug: 'milano', availableInDays: 1 },
  { professionalId: 'luca-r', displayName: 'Luca R.', specialties: ['capelli'], specialtyLabel: 'Barbiere', verified: true, serviceArea: 'Isola, Porta Nuova', citySlug: 'milano', availableInDays: 0 },
  { professionalId: 'sara-p', displayName: 'Sara P.', specialties: ['estetica'], specialtyLabel: 'Estetista', verified: true, serviceArea: 'Città Studi', citySlug: 'milano', availableInDays: 2 },
  { professionalId: 'chiara-s', displayName: 'Chiara S.', specialties: ['estetica'], specialtyLabel: 'Estetista', verified: true, serviceArea: 'Navigli', citySlug: 'milano', availableInDays: 1 },
  { professionalId: 'alessia-t', displayName: 'Alessia T.', specialties: ['capelli'], specialtyLabel: 'Parrucchiera', verified: true, serviceArea: 'Prati, Centro storico', citySlug: 'roma', availableInDays: 0 },
  { professionalId: 'lorenzo-b', displayName: 'Lorenzo B.', specialties: ['make-up'], specialtyLabel: 'Make-up artist', verified: true, serviceArea: 'Parioli', citySlug: 'roma', availableInDays: 3 },
  { professionalId: 'martina-c', displayName: 'Martina C.', specialties: ['estetica'], specialtyLabel: 'Estetista', verified: true, serviceArea: 'San Giovanni', citySlug: 'roma', availableInDays: 1 },
  { professionalId: 'andrea-f', displayName: 'Andrea F.', specialties: ['massaggi'], specialtyLabel: 'Massaggiatore', verified: true, serviceArea: 'Trastevere', citySlug: 'roma', availableInDays: 2 },
  { professionalId: 'elena-b', displayName: 'Elena B.', specialties: ['capelli'], specialtyLabel: 'Parrucchiera', verified: true, serviceArea: 'Crocetta, Centro', citySlug: 'torino', availableInDays: 1 },
  { professionalId: 'davide-g', displayName: 'Davide G.', specialties: ['capelli'], specialtyLabel: 'Barbiere', verified: true, serviceArea: 'San Salvario', citySlug: 'torino', availableInDays: 4 },
  { professionalId: 'marco-d', displayName: 'Marco D.', specialties: ['make-up'], specialtyLabel: 'Make-up artist', verified: true, serviceArea: 'Centro storico', citySlug: 'bologna', availableInDays: 2 },
  { professionalId: 'francesca-l', displayName: 'Francesca L.', specialties: ['estetica'], specialtyLabel: 'Estetista', verified: true, serviceArea: 'Saragozza', citySlug: 'bologna', availableInDays: 0 },
  { professionalId: 'matteo-v', displayName: 'Matteo V.', specialties: ['massaggi'], specialtyLabel: 'Massaggiatore', verified: true, serviceArea: 'Campo di Marte', citySlug: 'firenze', availableInDays: 1 },
  { professionalId: 'sofia-n', displayName: 'Sofia N.', specialties: ['make-up'], specialtyLabel: 'Make-up artist', verified: true, serviceArea: 'Oltrarno', citySlug: 'firenze', availableInDays: 5 },
  { professionalId: 'federica-a', displayName: 'Federica A.', specialties: ['capelli'], specialtyLabel: 'Parrucchiera', verified: true, serviceArea: 'Chiaia, Posillipo', citySlug: 'napoli', availableInDays: 1 },
  { professionalId: 'simone-e', displayName: 'Simone E.', specialties: ['capelli'], specialtyLabel: 'Barbiere', verified: true, serviceArea: 'Vomero', citySlug: 'napoli', availableInDays: 0 },
];

/* ------------------------------------------------------------------ */
/* Construction des jeux de données                                    */
/* ------------------------------------------------------------------ */

export interface MockDataset {
  services: ServiceCategory[];
  cities: City[];
  professionals: ProfessionalProfile[];
}

const PRICE_FROM: Record<string, number> = { capelli: 45, 'make-up': 60, estetica: 50, massaggi: 65 };
const DURATION: Record<string, number> = { capelli: 60, 'make-up': 60, estetica: 60, massaggi: 60 };

/** Construit le jeu de données (disponibilités relatives à la date du jour) dans la langue demandée. */
export function buildMockDataset(today: string = todayIso(), lang: Lang = 'it'): MockDataset {
  const cityName = new Map(RAW_CITIES.map((c) => [c.slug, c.name]));
  const serviceName = new Map(RAW_SERVICES.map((s) => [s.slug, s.name]));

  const professionals: ProfessionalProfile[] = RAW_PROS.map(({ availableInDays, ...p }) => ({
    ...p,
    cityName: cityName.get(p.citySlug) ?? p.citySlug,
    nextAvailability: addDaysIso(today, availableInDays),
    profileUrl: `/professionisti/${p.professionalId}`,
    profileImage: null,
    bio: `${p.displayName} lavora come ${p.specialtyLabel.toLowerCase()} e si sposta nelle zone indicate con prodotti e strumenti. (Testo di esempio.)`,
    skills: p.specialties.map((s) => serviceName.get(s) ?? s),
    services: p.specialties.map((s) => ({
      serviceSlug: s,
      name: serviceName.get(s) ?? s,
      durationMinutes: DURATION[s] ?? 60,
      priceFrom: PRICE_FROM[s] ?? null,
      currency: 'EUR',
    })),
    areasServed: p.serviceArea.split(',').map((a) => a.trim()),
    verification: { identity: true, qualifications: true, verifiedSince: '2026-09-15' },
    conditions: ['Il prezzo che vedi è quello che paghi.', 'Prenoti e paghi nell\'app GLAMRO, solo a servizio svolto.'],
    languages: ['Italiano'],
    reviewSummary: null,
    reviews: [],
    bookingUrl: null,
  }));

  const cities: City[] = RAW_CITIES.map((c) => {
    const pros = professionals.filter((p) => p.citySlug === c.slug);
    return {
      ...c,
      availableCount: pros.length,
      activeServiceSlugs: [...new Set(pros.flatMap((p) => p.specialties))],
    };
  });

  const services: ServiceCategory[] = RAW_SERVICES.map((s) => ({
    ...s,
    activeCitySlugs: cities
      .filter((c) => c.status === 'active' && c.activeServiceSlugs.includes(s.slug))
      .map((c) => c.slug),
  }));

  return lang === 'it' ? { services, cities, professionals } : translateDataset({ services, cities, professionals }, lang);
}

/* ------------------------------------------------------------------ */
/* Traduction des données d'exemple                                   */
/* ------------------------------------------------------------------ */

const fill = (template: string, params: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => params[key] ?? '');

function translateDataset(data: MockDataset, lang: Exclude<Lang, 'it'>): MockDataset {
  const tx = CONTENT_TEXTS[lang];
  const area = (a: string) => tx.areas[a] ?? a;
  const cityName = (slug: string, fallback: string) => tx.cityNames[slug] ?? fallback;
  const serviceName = (slug: string) => tx.services[slug]?.name ?? slug;

  const services = data.services.map((s) => ({ ...s, ...tx.services[s.slug] }));

  const cities = data.cities.map((c) => {
    const name = cityName(c.slug, c.name);
    return {
      ...c,
      name,
      region: tx.regions[c.region] ?? c.region,
      areasServed: c.areasServed.map(area),
      intro: fill(c.status === 'active' ? tx.cityIntro : tx.cityInactiveIntro, { city: name }),
      faqs: c.faqs.length
        ? tx.cityFaqs.map((f) => ({ question: fill(f.question, { city: name }), answer: fill(f.answer, { city: name }) }))
        : [],
    };
  });

  const professionals = data.professionals.map((p) => {
    const specialtyLabel = tx.specialties[p.specialtyLabel] ?? p.specialtyLabel;
    return {
      ...p,
      specialtyLabel,
      cityName: cityName(p.citySlug, p.cityName),
      serviceArea: p.serviceArea
        .split(',')
        .map((a) => area(a.trim()))
        .join(', '),
      areasServed: p.areasServed.map(area),
      bio: fill(tx.bio, { name: p.displayName, label: specialtyLabel.toLowerCase() }),
      skills: p.specialties.map(serviceName),
      services: p.services.map((o) => ({ ...o, name: serviceName(o.serviceSlug) })),
      conditions: tx.proConditions,
      languages: tx.languages,
    };
  });

  return { services, cities, professionals };
}
