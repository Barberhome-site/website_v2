/**
 * Impostazioni globali del sito (i testi sono in src/app/i18n/*.ts).
 * Contatti e dati societari: identici ovunque, si cambiano solo qui.
 */
export const SITE = {
  name: 'GLAMRO',

  /** Navigation principale (5 entrées max, brief §4). Libellés : dictionnaire `nav`. */
  nav: [
    { key: 'services', path: '/servizi' },
    { key: 'how', path: '/come-funziona' },
    { key: 'where', path: '/dove-siamo' },
    { key: 'pros', path: '/per-professionisti' },
    { key: 'about', path: '/chi-siamo' },
  ],

  /** Données société (documents légaux GLAMRO S.R.L.). */
  company: {
    legalName: 'GLAMRO S.R.L.',
    vatNumber: '03036060428',
    address: 'Via Giacomo Matteotti 54, 60121 Ancona (AN)',
    streetAddress: 'Via Giacomo Matteotti 54',
    postalCode: '60121',
    locality: 'Ancona',
    region: 'AN',
    rea: 'REA AN-312608',
    shareCapital: 'Capitale sociale € 7.000,00 i.v.',
    pec: 'glamrosrl@ionospec.it',
    phone: '+39 392 366 1225',
  },

  contact: {
    /** Unica email di GLAMRO: assistenza, reclami, privacy. */
    email: 'contact@glamro.it',
    /** Telefono e WhatsApp (stesso numero). */
    phone: '+39 392 366 1225',
    phoneHref: 'tel:+393923661225',
    whatsappUrl: 'https://wa.me/393923661225',
  },

  /**
   * Link partner forniti da GLAMRO.
   * Fiscozen: pulsante «Non hai la partita IVA? Aprila con Fiscozen» nella sezione professionisti.
   */
  partners: {
    fiscozenUrl: 'https://www.fiscozen.it/promo/partner/',
  },

  /** Profils officiels. */
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/glamro.it' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@glamro.it' },
    { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61587333056576' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/glamro-srl/' },
  ],

  /**
   * Apps mobiles : une app pour les clients, une app pour les professionnels.
   */
  apps: {
    client: {
      appStoreUrl: 'https://apps.apple.com/it/app/glamro-clienti/id6756219312',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.glamro.clientapp',
    },
    pro: {
      appStoreUrl: 'https://apps.apple.com/it/app/glamro-pro/id6758321869',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.glamropro.app',
    },
  },

  logo: {
    src: '/brand/glamro-logo.png',
    width: 553,
    height: 120,
  },
  /**
   * Logo GLAMRO Pro con la valigetta (file ufficiale, copia ridotta a 256 px, non ridisegnato):
   * si usa nella sezione professionisti. Il resto del sito usa il logo clienti qui sopra.
   */
  proLogo: {
    src: '/brand/glamro-pro.jpg',
    width: 256,
    height: 256,
  },
  defaultOgImage: '/brand/og-default.jpg',
} as const;

export type NavKey = (typeof SITE.nav)[number]['key'];

export type AppKind = keyof typeof SITE.apps;
