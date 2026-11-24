/**
 * Configuration de production.
 * En développement (`ng serve`), ce fichier est remplacé par environment.development.ts.
 */
export const environment = {
  production: true,

  /** URL publique du site, utilisée pour canonical, Open Graph, JSON-LD et sitemap. */
  siteUrl: 'https://www.glamro.it',

  /** Source des données : `true` = données d'exemple, `false` = API GLAMRO via /site-api. */
  useMockData: false,
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

};
