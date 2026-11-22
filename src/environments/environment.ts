/**
 * Configuration de production.
 * En développement (`ng serve`), ce fichier est remplacé par environment.development.ts.
 */
export const environment = {
  production: true,

  /** URL publique du site, utilisée pour canonical, Open Graph, JSON-LD et sitemap. */
  siteUrl: 'https://www.glamro.it',

  /**
   * Source des données : `true` = données d'exemple, `false` = API GLAMRO via /site-api.
   * TODO : passer à false quand les données réelles auront été validées sur l'environnement de dev.
   */
  useMockData: true,
  /** API GLAMRO (routes /api), appelée uniquement par le serveur. Remplaçable par GLAMRO_API_URL. */
  apiBaseUrl: 'https://api.glamro.it/api',

  /**
   * Balise Google (Analytics 4) — chargée UNIQUEMENT après consentement « analytics » (brief §13).
   * Conteneur Tag Manager `GTM-…` (snippet actuel fourni par Google Analytics) ou ID de mesure `G-…`.
   */
  googleTagId: 'GTM-M625CVRL',

  /**
   * Fond de carte : style vectoriel « Dark » d'OpenFreeMap (gratuit, sans clé ni quota, usage commercial autorisé).
   */
  mapStyleUrl: 'https://tiles.openfreemap.org/styles/dark',

  /**
   * Trustpilot TrustBox officiel (brief §7). Widget « Review Collector » (plan gratuit) : un bouton
   * « Recensiscici su Trustpilot ». Si businessUnitId/templateId sont vides, le site affiche un lien
   * neutre vers le profil. Pour passer plus tard à un widget de note (Mini, Micro…), changer templateId et height.
   */
  trustpilot: {
    businessUnitId: '6af514939898c9d06ed3ca8f',
    templateId: '56278e9abfbbba0bdcd568bc',
    height: '52px',
    profileUrl: 'https://it.trustpilot.com/review/glamro.it',
  },
};
