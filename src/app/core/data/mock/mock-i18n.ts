/**
 * ⚠️ DONNÉES D'EXEMPLE — traductions du contenu mock (services, villes, profils).
 * En production, ces contenus viendront de l'API/CMS dans la langue demandée
 * (en-tête Accept-Language envoyé par HttpGlamroDataSource).
 */
import { Faq } from '../../models/glamro.models';
import { Lang } from '../../i18n/i18n.config';

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

export interface MockTexts {
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
  fr: [
    'Le prix, la durée et les conditions d\'annulation sont indiqués sur le profil avant la confirmation.',
    'Le professionnel apporte les produits et le matériel nécessaires.',
    'Le paiement s\'effectue dans l\'app GLAMRO avec des moyens de paiement sécurisés.',
  ],
  es: [
    'El precio, la duración y las condiciones de cancelación se indican en el perfil antes de confirmar.',
    'El profesional lleva los productos y las herramientas necesarias.',
    'El pago se realiza en la app GLAMRO con métodos de pago seguros.',
  ],
  de: [
    'Preis, Dauer und Stornobedingungen stehen im Profil, bevor du bestätigst.',
    'Die Fachkraft bringt alle nötigen Produkte und Werkzeuge mit.',
    'Bezahlt wird in der GLAMRO-App mit sicheren Zahlungsmethoden.',
  ],
};

export const MOCK_TEXTS: Record<Translated, MockTexts> = {
  /* ================================================================ EN */
  en: {
    services: {
      capelli: {
        name: 'Hair',
        professionalLabel: 'Hairdressers',
        shortDescription: 'Cuts, blow-dries, colour and treatments',
        intro: 'With GLAMRO you book a verified hairdresser who comes to your home, office or hotel, in the cities where the service is active. Choose the service, date and professional based on real availability.',
        audience: 'For anyone who wants a cut, blow-dry or colour without travelling, including before an event or on busy days.',
        includes: ['Women\'s and men\'s cuts', 'Blow-dry and styling', 'Colour and root touch-ups', 'Repair treatments'],
        conditions: ['You need a space with a chair and a power socket nearby.', ...common.en],
        faqs: [
          { question: 'Do I need products or tools at home?', answer: 'No. The professional brings products and tools. You only need a space with a chair and a power socket.' },
          { question: 'Can I book a colour at home?', answer: 'Yes, if the professional offers it on their profile. Duration and price are shown before you confirm.' },
        ],
      },
      barber: {
        name: 'Barber',
        professionalLabel: 'Barbers',
        shortDescription: 'Men\'s cuts, beard and finishing',
        intro: 'GLAMRO connects you with verified barbers who come to the address you choose for cuts, beard care and finishing, in the active cities.',
        audience: 'For anyone who wants a haircut or beard care at home or at the office, without waiting.',
        includes: ['Men\'s haircut', 'Beard trim and shaping', 'Shave', 'Neckline and edge finishing'],
        conditions: common.en,
        faqs: [{ question: 'How long does an appointment take?', answer: 'It depends on the service and is shown on the professional\'s profile before you book.' }],
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
      nails: {
        name: 'Nails',
        professionalLabel: 'Nail artists',
        shortDescription: 'Manicure, pedicure and gel polish',
        intro: 'GLAMRO lets you book manicures, pedicures and gel polish with verified professionals who come to you, in the active cities.',
        audience: 'For anyone who wants well-groomed hands and feet at home, with sterilised tools brought by the professional.',
        includes: ['Manicure', 'Pedicure', 'Gel polish', 'Removal and reconstruction'],
        conditions: ['You need a table and good lighting.', ...common.en],
        faqs: [{ question: 'Are the tools sterilised?', answer: 'The hygiene standards required of professionals are described on the Trust & safety page.' }],
      },
      estetica: {
        name: 'Beauty treatments',
        professionalLabel: 'Beauticians',
        shortDescription: 'Face, body and hair removal treatments',
        intro: 'With GLAMRO you book a verified beautician for face, body and hair removal treatments right at home, in the cities where the service is active.',
        audience: 'For anyone who wants beauty treatments without travelling, with products and table brought by the professional when needed.',
        includes: ['Facial cleansing', 'Body treatments', 'Hair removal', 'Lash and brow lamination'],
        conditions: common.en,
        faqs: [{ question: 'Does the professional bring a treatment table?', answer: 'If the treatment requires it, this is stated in the service details on the profile.' }],
      },
      massaggi: {
        name: 'Massages',
        professionalLabel: 'Massage therapists',
        shortDescription: 'Relaxing and deep-tissue massages',
        intro: 'GLAMRO connects you with verified massage therapists for wellness massages at home, in the active cities. These are not medical treatments.',
        audience: 'For anyone who wants a wellness massage at home or in a hotel, whenever suits them.',
        includes: ['Relaxing massage', 'Deep-tissue massage', 'Lymphatic drainage', 'Couples massage, if available'],
        conditions: ['The massages offered are wellness treatments, not medical services.', ...common.en],
        faqs: [{ question: 'Do I need a massage table at home?', answer: 'No, if the professional states on their profile that they bring one. You only need a free space of about 2 × 3 metres.' }],
      },
    },
    cityNames: { milano: 'Milan', roma: 'Rome', torino: 'Turin', bologna: 'Bologna', firenze: 'Florence', napoli: 'Naples', bari: 'Bari' },
    regions: { Lombardia: 'Lombardy', Lazio: 'Lazio', Piemonte: 'Piedmont', 'Emilia-Romagna': 'Emilia-Romagna', Toscana: 'Tuscany', Campania: 'Campania', Puglia: 'Apulia' },
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
      'Nail artist': 'Nail artist',
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
  fr: {
    services: {
      capelli: {
        name: 'Coiffure',
        professionalLabel: 'Coiffeurs',
        shortDescription: 'Coupe, brushing, couleur et soins',
        intro: 'Avec GLAMRO, vous réservez un coiffeur vérifié qui vient chez vous, au bureau ou à l\'hôtel, dans les villes où le service est actif. Choisissez le service, la date et le professionnel selon les disponibilités réelles.',
        audience: 'Pour celles et ceux qui veulent une coupe, un brushing ou une couleur sans se déplacer, y compris avant un événement ou lors de journées chargées.',
        includes: ['Coupe femme et homme', 'Brushing et coiffage', 'Couleur et retouche racines', 'Soins réparateurs'],
        conditions: ['Prévoyez un espace avec une chaise et une prise électrique à proximité.', ...common.fr],
        faqs: [
          { question: 'Dois-je avoir des produits ou du matériel chez moi ?', answer: 'Non. Le professionnel apporte produits et matériel. Il vous faut seulement un espace avec une chaise et une prise électrique.' },
          { question: 'Puis-je réserver une couleur à domicile ?', answer: 'Oui, si le professionnel la propose sur son profil. La durée et le prix sont indiqués avant la confirmation.' },
        ],
      },
      barber: {
        name: 'Barbier',
        professionalLabel: 'Barbiers',
        shortDescription: 'Coupe homme, barbe et finitions',
        intro: 'GLAMRO vous met en relation avec des barbiers vérifiés qui se rendent à l\'adresse de votre choix pour la coupe, la barbe et les finitions, dans les villes actives.',
        audience: 'Pour une coupe ou l\'entretien de la barbe à la maison ou au bureau, sans attente.',
        includes: ['Coupe homme', 'Taille et modelage de la barbe', 'Rasage', 'Finitions nuque et contours'],
        conditions: common.fr,
        faqs: [{ question: 'Combien de temps dure un rendez-vous ?', answer: 'Cela dépend du service choisi ; la durée est indiquée sur le profil du professionnel avant la réservation.' }],
      },
      'make-up': {
        name: 'Maquillage',
        professionalLabel: 'Maquilleurs',
        shortDescription: 'Maquillage pour événements, cérémonies et photos',
        intro: 'Avec GLAMRO, vous réservez un maquilleur vérifié qui vient là où vous vous préparez : domicile, hôtel ou lieu de l\'événement, dans les villes où le service est actif.',
        audience: 'Pour un événement, une cérémonie, un shooting photo ou simplement un maquillage soigné avant de sortir.',
        includes: ['Maquillage jour et soir', 'Maquillage de cérémonie', 'Maquillage photo et vidéo', 'Essai maquillage'],
        conditions: common.fr,
        faqs: [{ question: 'Peut-on réserver pour plusieurs personnes ?', answer: 'Cela dépend des disponibilités du professionnel. Indiquez le nombre de personnes lors de la réservation dans l\'app.' }],
      },
      nails: {
        name: 'Ongles',
        professionalLabel: 'Prothésistes ongulaires',
        shortDescription: 'Manucure, pédicure et vernis semi-permanent',
        intro: 'GLAMRO vous permet de réserver manucure, pédicure et vernis semi-permanent avec des professionnels vérifiés qui viennent chez vous, dans les villes actives.',
        audience: 'Pour des mains et des pieds soignés à domicile, avec du matériel stérilisé apporté par le professionnel.',
        includes: ['Manucure', 'Pédicure', 'Vernis semi-permanent', 'Dépose et reconstruction'],
        conditions: ['Prévoyez une table et un bon éclairage.', ...common.fr],
        faqs: [{ question: 'Le matériel est-il stérilisé ?', answer: 'Les normes d\'hygiène exigées des professionnels sont décrites sur la page Confiance et sécurité.' }],
      },
      estetica: {
        name: 'Soins esthétiques',
        professionalLabel: 'Esthéticiennes',
        shortDescription: 'Soins du visage, du corps et épilation',
        intro: 'Avec GLAMRO, vous réservez une esthéticienne vérifiée pour des soins du visage, du corps et l\'épilation directement chez vous, dans les villes où le service est actif.',
        audience: 'Pour des soins esthétiques sans vous déplacer, avec produits et table de soin apportés par le professionnel si nécessaire.',
        includes: ['Nettoyage de peau', 'Soins du corps', 'Épilation', 'Rehaussement de cils et sourcils'],
        conditions: common.fr,
        faqs: [{ question: 'Le professionnel apporte-t-il une table de soin ?', answer: 'Si le soin l\'exige, c\'est indiqué dans la fiche du service sur le profil.' }],
      },
      massaggi: {
        name: 'Massages',
        professionalLabel: 'Masseurs',
        shortDescription: 'Massages relaxants et décontractants',
        intro: 'GLAMRO vous met en relation avec des masseurs vérifiés pour des massages bien-être à domicile, dans les villes actives. Il ne s\'agit pas de soins médicaux.',
        audience: 'Pour un massage bien-être à domicile ou à l\'hôtel, au moment qui vous convient.',
        includes: ['Massage relaxant', 'Massage décontractant', 'Drainage lymphatique', 'Massage en duo, si disponible'],
        conditions: ['Les massages proposés sont des soins de bien-être, pas des actes médicaux.', ...common.fr],
        faqs: [{ question: 'Faut-il une table de massage à la maison ?', answer: 'Non, si le professionnel indique sur son profil qu\'il en apporte une. Il vous faut seulement un espace libre d\'environ 2 × 3 mètres.' }],
      },
    },
    cityNames: { milano: 'Milan', roma: 'Rome', torino: 'Turin', bologna: 'Bologne', firenze: 'Florence', napoli: 'Naples', bari: 'Bari' },
    regions: { Lombardia: 'Lombardie', Lazio: 'Latium', Piemonte: 'Piémont', 'Emilia-Romagna': 'Émilie-Romagne', Toscana: 'Toscane', Campania: 'Campanie', Puglia: 'Pouilles' },
    areas: { 'Centro storico': 'Centre historique', Centro: 'Centre-ville' },
    cityIntro: 'À {city}, GLAMRO est actif avec des professionnels de la beauté vérifiés qui se déplacent à domicile, au bureau ou à l\'hôtel dans les zones indiquées.',
    cityInactiveIntro: 'GLAMRO n\'est pas encore réservable à {city}.',
    cityFaqs: [
      { question: 'Quelles zones de {city} GLAMRO couvre-t-il ?', answer: 'Les zones couvertes sont listées sur cette page et mises à jour selon les professionnels actifs. Pour une adresse précise, saisissez votre code postal dans la vérification des disponibilités.' },
      { question: 'Y a-t-il des frais de déplacement à {city} ?', answer: 'Les éventuels frais sont indiqués sur le profil du professionnel et dans le récapitulatif avant la confirmation.' },
    ],
    specialties: {
      Parrucchiera: 'Coiffeuse',
      Barbiere: 'Barbier',
      Estetista: 'Esthéticienne',
      'Nail artist': 'Prothésiste ongulaire',
      'Make-up artist': 'Maquilleur',
      Massaggiatore: 'Masseur',
    },
    bio: '{name} exerce comme {label} et se déplace dans les zones indiquées avec son propre matériel. (Texte d\'exemple.)',
    proConditions: [
      'Annulations et modifications selon les Conditions Clients et les règles indiquées lors de la réservation.',
      'Les éventuels frais de déplacement sont affichés avant la confirmation.',
    ],
    languages: ['Italien'],
  },

  /* ================================================================ ES */
  es: {
    services: {
      capelli: {
        name: 'Peluquería',
        professionalLabel: 'Peluqueros',
        shortDescription: 'Corte, peinado, color y tratamientos',
        intro: 'Con GLAMRO reservas un peluquero verificado que va a tu casa, a la oficina o al hotel, en las ciudades donde el servicio está activo. Elige servicio, fecha y profesional según la disponibilidad real.',
        audience: 'Para quien quiere corte, peinado o color sin desplazarse, también antes de un evento o en días ajetreados.',
        includes: ['Corte de mujer y de hombre', 'Peinado y styling', 'Color y retoque de raíces', 'Tratamientos reparadores'],
        conditions: ['Necesitas un espacio con una silla y un enchufe cerca.', ...common.es],
        faqs: [
          { question: '¿Necesito productos o herramientas en casa?', answer: 'No. El profesional lleva productos y herramientas. Solo necesitas un espacio con una silla y un enchufe.' },
          { question: '¿Puedo reservar un color a domicilio?', answer: 'Sí, si el profesional lo ofrece en su perfil. La duración y el precio se indican antes de confirmar.' },
        ],
      },
      barber: {
        name: 'Barbería',
        professionalLabel: 'Barberos',
        shortDescription: 'Corte de hombre, barba y acabados',
        intro: 'GLAMRO te conecta con barberos verificados que van a la dirección que elijas para corte, barba y acabados, en las ciudades activas.',
        audience: 'Para quien quiere un corte o el cuidado de la barba en casa o en la oficina, sin esperas.',
        includes: ['Corte de hombre', 'Arreglo y perfilado de barba', 'Afeitado', 'Acabado de nuca y contornos'],
        conditions: common.es,
        faqs: [{ question: '¿Cuánto dura una cita?', answer: 'Depende del servicio elegido y se indica en el perfil del profesional antes de reservar.' }],
      },
      'make-up': {
        name: 'Maquillaje',
        professionalLabel: 'Maquilladores',
        shortDescription: 'Maquillaje para eventos, ceremonias y fotos',
        intro: 'Con GLAMRO reservas un maquillador verificado que va donde te preparas: casa, hotel o lugar del evento, en las ciudades donde el servicio está activo.',
        audience: 'Para eventos, ceremonias, sesiones de fotos o simplemente un maquillaje cuidado antes de salir.',
        includes: ['Maquillaje de día y de noche', 'Maquillaje para ceremonias', 'Maquillaje para foto y vídeo', 'Prueba de maquillaje'],
        conditions: common.es,
        faqs: [{ question: '¿Se puede reservar para varias personas?', answer: 'Depende de la disponibilidad del profesional. Indica el número de personas al reservar en la app.' }],
      },
      nails: {
        name: 'Uñas',
        professionalLabel: 'Manicuristas',
        shortDescription: 'Manicura, pedicura y esmaltado semipermanente',
        intro: 'GLAMRO te permite reservar manicura, pedicura y esmaltado semipermanente con profesionales verificados que van a tu casa, en las ciudades activas.',
        audience: 'Para quien quiere manos y pies cuidados en casa, con herramientas esterilizadas que lleva el profesional.',
        includes: ['Manicura', 'Pedicura', 'Esmaltado semipermanente', 'Retirada y reconstrucción'],
        conditions: ['Necesitas una mesa y buena iluminación.', ...common.es],
        faqs: [{ question: '¿Las herramientas están esterilizadas?', answer: 'Los estándares de higiene exigidos a los profesionales se describen en la página Confianza y seguridad.' }],
      },
      estetica: {
        name: 'Estética',
        professionalLabel: 'Esteticistas',
        shortDescription: 'Tratamientos faciales, corporales y depilación',
        intro: 'Con GLAMRO reservas una esteticista verificada para tratamientos faciales, corporales y depilación directamente en tu casa, en las ciudades donde el servicio está activo.',
        audience: 'Para quien quiere tratamientos estéticos sin desplazarse, con productos y camilla que lleva el profesional cuando hace falta.',
        includes: ['Limpieza facial', 'Tratamientos corporales', 'Depilación', 'Laminado de pestañas y cejas'],
        conditions: common.es,
        faqs: [{ question: '¿El profesional lleva la camilla?', answer: 'Si el tratamiento la requiere, se indica en la ficha del servicio dentro del perfil.' }],
      },
      massaggi: {
        name: 'Masajes',
        professionalLabel: 'Masajistas',
        shortDescription: 'Masajes relajantes y descontracturantes',
        intro: 'GLAMRO te conecta con masajistas verificados para masajes de bienestar a domicilio, en las ciudades activas. No se trata de prestaciones sanitarias.',
        audience: 'Para quien quiere un masaje de bienestar en casa o en el hotel, cuando prefiera.',
        includes: ['Masaje relajante', 'Masaje descontracturante', 'Drenaje linfático', 'Masaje en pareja, si está disponible'],
        conditions: ['Los masajes ofrecidos son tratamientos de bienestar, no prestaciones sanitarias.', ...common.es],
        faqs: [{ question: '¿Necesito una camilla en casa?', answer: 'No, si el profesional indica en su perfil que la lleva. Solo necesitas un espacio libre de unos 2 × 3 metros.' }],
      },
    },
    cityNames: { milano: 'Milán', roma: 'Roma', torino: 'Turín', bologna: 'Bolonia', firenze: 'Florencia', napoli: 'Nápoles', bari: 'Bari' },
    regions: { Lombardia: 'Lombardía', Lazio: 'Lacio', Piemonte: 'Piamonte', 'Emilia-Romagna': 'Emilia-Romaña', Toscana: 'Toscana', Campania: 'Campania', Puglia: 'Apulia' },
    areas: { 'Centro storico': 'Centro histórico', Centro: 'Centro' },
    cityIntro: 'En {city}, GLAMRO está activo con profesionales de belleza verificados que van a casa, a la oficina o al hotel en las zonas indicadas.',
    cityInactiveIntro: 'GLAMRO todavía no se puede reservar en {city}.',
    cityFaqs: [
      { question: '¿Qué zonas de {city} cubre GLAMRO?', answer: 'Las zonas cubiertas se indican en esta página y se actualizan según los profesionales activos. Para una dirección concreta, introduce tu código postal en la comprobación de disponibilidad.' },
      { question: '¿Hay gastos de desplazamiento en {city}?', answer: 'Los posibles gastos se indican en el perfil del profesional y en el resumen antes de confirmar.' },
    ],
    specialties: {
      Parrucchiera: 'Peluquera',
      Barbiere: 'Barbero',
      Estetista: 'Esteticista',
      'Nail artist': 'Manicurista',
      'Make-up artist': 'Maquillador',
      Massaggiatore: 'Masajista',
    },
    bio: '{name} trabaja como {label} y se desplaza a las zonas indicadas con su propio kit de trabajo. (Texto de ejemplo.)',
    proConditions: [
      'Cancelaciones y cambios según las Condiciones para clientes y las reglas indicadas al reservar.',
      'Los posibles gastos de desplazamiento se muestran antes de confirmar.',
    ],
    languages: ['Italiano'],
  },

  /* ================================================================ DE */
  de: {
    services: {
      capelli: {
        name: 'Haare',
        professionalLabel: 'Friseure',
        shortDescription: 'Schnitt, Föhnen, Farbe und Pflege',
        intro: 'Mit GLAMRO buchst du einen geprüften Friseur, der zu dir nach Hause, ins Büro oder ins Hotel kommt – in den Städten, in denen der Service aktiv ist. Wähle Service, Datum und Fachkraft nach tatsächlicher Verfügbarkeit.',
        audience: 'Für alle, die Schnitt, Föhnen oder Farbe ohne Anfahrt möchten – auch vor einem Event oder an vollen Tagen.',
        includes: ['Damen- und Herrenschnitt', 'Föhnen und Styling', 'Farbe und Ansatz', 'Pflegebehandlungen'],
        conditions: ['Du brauchst einen Platz mit Stuhl und einer Steckdose in der Nähe.', ...common.de],
        faqs: [
          { question: 'Brauche ich Produkte oder Werkzeuge zu Hause?', answer: 'Nein. Die Fachkraft bringt Produkte und Werkzeuge mit. Du brauchst nur einen Platz mit Stuhl und Steckdose.' },
          { question: 'Kann ich eine Färbung zu Hause buchen?', answer: 'Ja, wenn die Fachkraft sie im Profil anbietet. Dauer und Preis stehen vor der Bestätigung fest.' },
        ],
      },
      barber: {
        name: 'Barber',
        professionalLabel: 'Barbiere',
        shortDescription: 'Herrenschnitt, Bart und Konturen',
        intro: 'GLAMRO verbindet dich mit geprüften Barbieren, die für Haarschnitt, Bart und Konturen an die Adresse deiner Wahl kommen – in den aktiven Städten.',
        audience: 'Für alle, die einen Haarschnitt oder Bartpflege zu Hause oder im Büro möchten, ohne Wartezeit.',
        includes: ['Herrenhaarschnitt', 'Bart trimmen und formen', 'Rasur', 'Nacken- und Konturenschnitt'],
        conditions: common.de,
        faqs: [{ question: 'Wie lange dauert ein Termin?', answer: 'Das hängt vom gewählten Service ab und steht vor der Buchung im Profil der Fachkraft.' }],
      },
      'make-up': {
        name: 'Make-up',
        professionalLabel: 'Make-up Artists',
        shortDescription: 'Make-up für Events, Feiern und Fotos',
        intro: 'Mit GLAMRO buchst du eine geprüfte Make-up Artist, die dorthin kommt, wo du dich fertig machst: nach Hause, ins Hotel oder zur Location – in den Städten, in denen der Service aktiv ist.',
        audience: 'Für Events, Feiern, Fotoshootings oder einfach ein gepflegtes Make-up vor dem Ausgehen.',
        includes: ['Tages- und Abend-Make-up', 'Make-up für Feiern', 'Make-up für Foto und Video', 'Probe-Make-up'],
        conditions: common.de,
        faqs: [{ question: 'Kann ich für mehrere Personen buchen?', answer: 'Das hängt von der Verfügbarkeit der Fachkraft ab. Gib die Personenzahl bei der Buchung in der App an.' }],
      },
      nails: {
        name: 'Nägel',
        professionalLabel: 'Nageldesigner',
        shortDescription: 'Maniküre, Pediküre und Shellac',
        intro: 'Mit GLAMRO buchst du Maniküre, Pediküre und Shellac bei geprüften Fachkräften, die zu dir kommen – in den aktiven Städten.',
        audience: 'Für gepflegte Hände und Füße zu Hause, mit sterilisierten Werkzeugen, die die Fachkraft mitbringt.',
        includes: ['Maniküre', 'Pediküre', 'Shellac', 'Entfernen und Modellage'],
        conditions: ['Du brauchst einen Tisch und gutes Licht.', ...common.de],
        faqs: [{ question: 'Sind die Werkzeuge sterilisiert?', answer: 'Die Hygienestandards für Fachkräfte sind auf der Seite Vertrauen & Sicherheit beschrieben.' }],
      },
      estetica: {
        name: 'Kosmetik',
        professionalLabel: 'Kosmetikerinnen',
        shortDescription: 'Gesichts-, Körperbehandlungen und Haarentfernung',
        intro: 'Mit GLAMRO buchst du eine geprüfte Kosmetikerin für Gesichts- und Körperbehandlungen und Haarentfernung direkt bei dir zu Hause – in den Städten, in denen der Service aktiv ist.',
        audience: 'Für Kosmetikbehandlungen ohne Anfahrt, mit Produkten und Liege, die die Fachkraft bei Bedarf mitbringt.',
        includes: ['Gesichtsreinigung', 'Körperbehandlungen', 'Haarentfernung', 'Wimpern- und Brauenlifting'],
        conditions: common.de,
        faqs: [{ question: 'Bringt die Fachkraft eine Liege mit?', answer: 'Wenn die Behandlung eine erfordert, steht das in der Servicebeschreibung im Profil.' }],
      },
      massaggi: {
        name: 'Massagen',
        professionalLabel: 'Masseure',
        shortDescription: 'Entspannende und lockernde Massagen',
        intro: 'GLAMRO verbindet dich mit geprüften Masseuren für Wellness-Massagen zu Hause – in den aktiven Städten. Es handelt sich nicht um medizinische Leistungen.',
        audience: 'Für alle, die eine Wellness-Massage zu Hause oder im Hotel möchten, wann es passt.',
        includes: ['Entspannungsmassage', 'Lockernde Massage', 'Lymphdrainage', 'Paarmassage, falls verfügbar'],
        conditions: ['Die angebotenen Massagen sind Wellness-Behandlungen, keine medizinischen Leistungen.', ...common.de],
        faqs: [{ question: 'Brauche ich eine Massageliege zu Hause?', answer: 'Nein, wenn die Fachkraft im Profil angibt, dass sie eine mitbringt. Du brauchst nur etwa 2 × 3 Meter freien Platz.' }],
      },
    },
    cityNames: { milano: 'Mailand', roma: 'Rom', torino: 'Turin', bologna: 'Bologna', firenze: 'Florenz', napoli: 'Neapel', bari: 'Bari' },
    regions: { Lombardia: 'Lombardei', Lazio: 'Latium', Piemonte: 'Piemont', 'Emilia-Romagna': 'Emilia-Romagna', Toscana: 'Toskana', Campania: 'Kampanien', Puglia: 'Apulien' },
    areas: { 'Centro storico': 'Altstadt', Centro: 'Zentrum' },
    cityIntro: 'In {city} ist GLAMRO mit geprüften Beauty-Fachkräften aktiv, die in den angegebenen Gebieten nach Hause, ins Büro oder ins Hotel kommen.',
    cityInactiveIntro: 'GLAMRO ist in {city} noch nicht buchbar.',
    cityFaqs: [
      { question: 'Welche Gebiete in {city} deckt GLAMRO ab?', answer: 'Die abgedeckten Gebiete stehen auf dieser Seite und werden je nach aktiven Fachkräften aktualisiert. Für eine genaue Adresse gib deine Postleitzahl in der Verfügbarkeitsprüfung ein.' },
      { question: 'Gibt es Anfahrtskosten in {city}?', answer: 'Eventuelle Kosten stehen im Profil der Fachkraft und in der Übersicht vor der Bestätigung.' },
    ],
    specialties: {
      Parrucchiera: 'Friseurin',
      Barbiere: 'Barbier',
      Estetista: 'Kosmetikerin',
      'Nail artist': 'Nageldesignerin',
      'Make-up artist': 'Make-up Artist',
      Massaggiatore: 'Masseur',
    },
    bio: '{name} arbeitet als {label} und kommt mit eigener Ausrüstung in die angegebenen Gebiete. (Beispieltext.)',
    proConditions: [
      'Stornierungen und Änderungen gemäß den Kundenbedingungen und den bei der Buchung angezeigten Regeln.',
      'Eventuelle Anfahrtskosten werden vor der Bestätigung angezeigt.',
    ],
    languages: ['Italienisch'],
  },
};
