/** Configuration de développement (ng serve). Mêmes clés que environment.ts. */
export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  /** `false` : vraies données de l'API de dev (dev-api.glamro.it). `true` pour revenir aux données d'exemple. */
  useMockData: false,
  apiBaseUrl: 'https://dev-api.glamro.it/api',
  /** Vide en dev : aucun appel Google Analytics depuis la machine locale. */
  googleTagId: '',
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
