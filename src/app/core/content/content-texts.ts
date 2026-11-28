/**
 * Traduction anglaise du contenu éditorial du site (l'italien est dans site-content.ts).
 *  - `services`, `cityNames`, `regions` : contenu réel, utilisé avec l'API (site-content.ts).
 *  - `areas`, `cityIntro`, `cityFaqs`, `specialties`, `bio`, `languages` : servent seulement
 *    aux données d'exemple (core/data/mock), qui citent des quartiers fictifs.
 */
import { Faq } from '../models/glamro.models';
import { Lang } from '../i18n/i18n.config';

export interface ServiceText {
  name: string;
  professionalLabel: string;
  shortDescription: string;
  intro: string;
  audience: string;
  includes: string[];
  conditions: string[];
  faqs: Faq[];
}

export interface ContentTexts {
  services: Record<string, ServiceText>;
  cityNames: Record<string, string>;
  regions: Record<string, string>;
  areas: Record<string, string>;
  /** Paramètres : {city}. */
  cityIntro: string;
  cityInactiveIntro: string;
  cityFaqs: Faq[];
  /** Libellé italien → traduction. */
  specialties: Record<string, string>;
  /** Paramètres : {name}, {label}. */
  bio: string;
  proConditions: string[];
  languages: string[];
}

type Translated = Exclude<Lang, 'it'>;

const common = {
  en: [
    'Price, duration and cancellation terms are shown on the profile before you confirm.',
    'The professional brings the products and tools needed for the service.',
    'Payment is made in the GLAMRO app with secure payment methods.',
  ],
};

export const CONTENT_TEXTS: Record<Translated, ContentTexts> = {
  /* ================================================================ EN */
  en: {
    services: {
      capelli: {
        name: 'Hair',
        professionalLabel: 'Hairdressers and barbers',
        shortDescription: 'Cuts, blow-dries, colour and beard',
        intro: 'With GLAMRO you book a verified hairdresser or barber who comes to your home, office or hotel, in the cities where the service is active. Choose the service, date and professional based on real availability.',
        audience: 'For anyone who wants a cut, blow-dry, colour or beard care without travelling, including before an event or on busy days.',
        includes: ['Women\'s and men\'s cuts', 'Blow-dry and styling', 'Colour and root touch-ups', 'Beard and finishing'],
        conditions: ['You need a space with a chair and a power socket nearby.', ...common.en],
        faqs: [
          { question: 'Do I need products or tools at home?', answer: 'No. The professional brings products and tools. You only need a space with a chair and a power socket.' },
          { question: 'Can I book a colour at home?', answer: 'Yes, if the professional offers it on their profile. Duration and price are shown before you confirm.' },
        ],
      },
      'make-up': {
        name: 'Make-up',
        professionalLabel: 'Make-up artists',
        shortDescription: 'Make-up for events, ceremonies and photos',
        intro: 'With GLAMRO you book a verified make-up artist who comes to where you get ready: home, hotel or event venue, in the cities where the service is active.',
        audience: 'For events, ceremonies, photo shoots or simply a polished look before going out.',
        includes: ['Day and evening make-up', 'Ceremony make-up', 'Make-up for photo and video', 'Make-up trial'],
        conditions: common.en,
        faqs: [{ question: 'Can I book for several people?', answer: 'It depends on the professional\'s availability. Enter the number of people when booking in the app.' }],
      },
      estetica: {
        name: 'Beauty treatments',
        professionalLabel: 'Beauticians',
        shortDescription: 'Face, body and hair removal treatments',
        intro: 'With GLAMRO you book a verified beautician for face, body and hair removal treatments right at home, in the cities where the service is active.',
        audience: 'For anyone who wants beauty treatments without travelling, with products and table brought by the professional when needed.',
        includes: ['Facial cleansing', 'Body treatments', 'Lymphatic drainage', 'Hair removal', 'Lash and brow lamination'],
        conditions: common.en,
        faqs: [{ question: 'Does the professional bring a treatment table?', answer: 'If the treatment requires it, this is stated in the service details on the profile.' }],
      },
      massaggi: {
        name: 'Massages',
        professionalLabel: 'Massage therapists',
        shortDescription: 'Relaxing and deep-tissue massages',
        intro: 'GLAMRO connects you with verified massage therapists for wellness massages at home, in the active cities. These are not medical treatments.',
        audience: 'For anyone who wants a wellness massage at home or in a hotel, whenever suits them.',
        includes: ['Relaxing massage', 'Deep-tissue massage'],
        conditions: ['The massages offered are wellness treatments, not medical services.', ...common.en],
        faqs: [{ question: 'Do I need a massage table at home?', answer: 'No, if the professional states on their profile that they bring one. You only need a free space of about 2 × 3 metres.' }],
      },
    },
    cityNames: { milano: 'Milan', roma: 'Rome', torino: 'Turin', bologna: 'Bologna', firenze: 'Florence', napoli: 'Naples', bari: 'Bari', genova: 'Genoa', venezia: 'Venice', verona: 'Verona', padova: 'Padua', brescia: 'Brescia', bergamo: 'Bergamo', palermo: 'Palermo', catania: 'Catania' },
    regions: { Lombardia: 'Lombardy', Lazio: 'Lazio', Piemonte: 'Piedmont', 'Emilia-Romagna': 'Emilia-Romagna', Toscana: 'Tuscany', Campania: 'Campania', Puglia: 'Apulia', Liguria: 'Liguria', Veneto: 'Veneto', Sicilia: 'Sicily' },
    areas: { 'Centro storico': 'Historic centre', Centro: 'City centre' },
    cityIntro: 'In {city}, GLAMRO is active with verified beauty professionals who come to your home, office or hotel in the areas listed.',
    cityInactiveIntro: 'GLAMRO cannot yet be booked in {city}.',
    cityFaqs: [
      { question: 'Which areas of {city} does GLAMRO cover?', answer: 'The covered areas are listed on this page and updated based on active professionals. For a specific address, enter your postcode in the availability check.' },
      { question: 'Are there travel costs in {city}?', answer: 'Any costs are shown on the professional\'s profile and in the summary before you confirm.' },
    ],
    specialties: {
      Parrucchiera: 'Hairdresser',
      Barbiere: 'Barber',
      Estetista: 'Beautician',
      'Make-up artist': 'Make-up artist',
      Massaggiatore: 'Massage therapist',
    },
    bio: '{name} works as a {label} and travels to the listed areas with their own work kit. (Sample text.)',
    proConditions: [
      'Cancellations and changes follow the Customer Terms and the rules shown when booking.',
      'Any travel costs are shown before you confirm.',
    ],
    languages: ['Italian'],
  },

  /* ================================================================ FR */

  /* ================================================================ ES */

  /* ================================================================ DE */
};
