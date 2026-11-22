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

  /** Google Analytics 4 — chargé UNIQUEMENT après consentement « analytics » (brief §13). */
  gaMeasurementId: 'G-FK165T4KP6',

  /**
   * Trustpilot TrustBox officiel (brief §7).
   * Tant que businessUnitId/templateId sont vides, le site affiche un lien neutre vers le profil.
   */
  /**
   * Fond de carte : style vectoriel « Dark » d'OpenFreeMap (gratuit, sans clé ni quota, usage commercial autorisé).
   */
  mapStyleUrl: 'https://tiles.openfreemap.org/styles/dark',

  trustpilot: {
    businessUnitId: '',
    templateId: '',
    profileUrl: 'https://it.trustpilot.com/review/glamro.it',
  },
};
