/** Configuration de développement (ng serve). Mêmes clés que environment.ts. */
export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  useMockData: true,
  apiBaseUrl: 'http://localhost:8080/v1',
  /** Vide en dev : aucun appel Google Analytics depuis la machine locale. */
  gaMeasurementId: '',
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
