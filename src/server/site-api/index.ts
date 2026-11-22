import { environment } from '../../environments/environment';
import { createSiteApi } from './site-api';
import { createUpstream } from './upstream';

/**
 * Instance unique de site-api pour le processus serveur (cache partagé entre les requêtes).
 * URL de l'API : variable d'environnement GLAMRO_API_URL, sinon `environment.apiBaseUrl`.
 */
export const siteApi = createSiteApi(
  createUpstream({ baseUrl: process.env['GLAMRO_API_URL'] || environment.apiBaseUrl }),
);

export { handleSiteApi } from './site-api';
