/**
 * Configuration de production.
 * En développement (`ng serve`), ce fichier est remplacé par environment.development.ts.
 */
export const environment = {
  production: true,

  /** URL publique du site, utilisée pour canonical, Open Graph, JSON-LD et sitemap. */
  siteUrl: 'https://www.glamro.it',

  /**
   * Source des données.
   * TODO API : passer `useMockData` à false et renseigner `apiBaseUrl` quand l'API sera disponible.
   */
  useMockData: true,
  apiBaseUrl: 'https://api.glamro.it/v1',

  /** Google Analytics 4 — chargé UNIQUEMENT après consentement « analytics » (brief §13). */
  gaMeasurementId: 'G-FK165T4KP6',

  /**
   * Trustpilot TrustBox officiel (brief §7).
   * Tant que businessUnitId/templateId sont vides, le site affiche un lien neutre vers le profil.
   */
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
