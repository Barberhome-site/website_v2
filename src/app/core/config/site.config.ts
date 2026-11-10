/**
 * Réglages globaux du site (hors textes : les textes sont dans src/app/i18n/*.ts).
 * Les valeurs entre crochets [ ... ] sont à compléter avant la mise en ligne.
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

  company: {
    legalName: '[Ragione sociale]',
    vatNumber: '[Partita IVA]',
    address: '[Sede legale]',
    rea: '[REA]',
  },

  contact: {
    /** TODO : vérifier les adresses réelles. */
    supportEmail: 'assistenza@glamro.it',
    privacyEmail: 'privacy@glamro.it',
  },

  /** TODO : URL des profils officiels. */
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/glamro' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@glamro' },
    { label: 'Facebook', url: 'https://www.facebook.com/glamro' },
    { label: 'YouTube', url: 'https://www.youtube.com/@glamro' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/glamro' },
  ],

  /**
   * Apps mobiles : une app pour les clients, une app pour les professionnels.
   * TODO : remplacer par les URL réelles des fiches App Store / Google Play.
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

  /** Images du site (voir public/images/LEGGIMI.md). `null` = emplacement neutre. */
  images: {
    hero: null as string | null,
    storytelling: [null, null, null, null] as (string | null)[],
    proEntry: null as string | null,
    about: null as string | null,
  },

  logo: {
    src: '/brand/glamro-logo.png',
    width: 553,
    height: 120,
  },
  defaultOgImage: '/brand/og-default.jpg',
} as const;

export type NavKey = (typeof SITE.nav)[number]['key'];

export type AppKind = keyof typeof SITE.apps;
