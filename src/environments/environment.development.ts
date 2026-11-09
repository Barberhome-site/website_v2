/** Configuration de développement (ng serve). Mêmes clés que environment.ts. */
export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  useMockData: true,
  apiBaseUrl: 'http://localhost:8080/v1',
  /** Vide en dev : aucun appel Google Analytics depuis la machine locale. */
  gaMeasurementId: '',
  /**
   * Stadia Maps (fond de carte). En production : déclarer le domaine dans le tableau de bord Stadia
   * (recommandé, aucune clé exposée) ou renseigner une clé API. ATTENTION : le plan gratuit
   * n'autorise pas l'usage commercial — plan Starter requis pour glamro.it.
   */
  stadiaMaps: {
    apiKey: '',
  },
  trustpilot: {
    businessUnitId: '',
    templateId: '',
    profileUrl: 'https://it.trustpilot.com/review/glamro.it',
  },
};
