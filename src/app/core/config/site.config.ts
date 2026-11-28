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

  /**
   * Données société (brief du 28/11/2026). Identiques partout : on ne les change qu'ici.
   * Le capital social n'est volontairement pas affiché (ni footer ni « Chi siamo ») :
   * il figure seulement dans le texte des Termini Clienti (art. 1).
   */
  company: {
    legalName: 'GLAMRO S.R.L.',
    vatNumber: '03036060428',
    address: 'Via Giacomo Matteotti 54, 60121 Ancona (AN)',
    streetAddress: 'Via Giacomo Matteotti 54',
    postalCode: '60121',
    locality: 'Ancona',
    region: 'AN',
    rea: 'REA AN-312608',
    pec: 'glamrosrl@ionospec.it',
  },

  /** Seuls canaux de contact : une adresse email, un numéro (téléphone et WhatsApp). */
  contact: {
    email: 'contact@glamro.it',
    phone: '+39 392 366 1225',
    phoneHref: 'tel:+393923661225',
    whatsappUrl: 'https://wa.me/393923661225',
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
