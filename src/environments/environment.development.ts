/** Configuration de développement (ng serve). Mêmes clés que environment.ts. */
export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  useMockData: true,
  apiBaseUrl: 'http://localhost:8080/v1',
  /** Vide en dev : aucun appel Google Analytics depuis la machine locale. */
  gaMeasurementId: '',
  /**
   * Fond de carte : style vectoriel LFMaps (gratuit, sans clé, usage commercial autorisé).
   * Les couleurs claires de Positron sont inversées en CSS (voir styles/_map.scss).
   */
  mapStyleUrl: 'https://data.lfmaps.fr/styles/positron',
  trustpilot: {
    businessUnitId: '',
    templateId: '',
    profileUrl: 'https://it.trustpilot.com/review/glamro.it',
  },
};
