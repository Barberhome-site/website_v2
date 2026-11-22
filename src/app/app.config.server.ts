import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SITE_API_SERVER_HANDLER } from './core/data/http/site-api.interceptor';
import { handleSiteApi, siteApi } from '../server/site-api';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Rendu serveur : les requêtes /site-api sont traitées en mémoire (voir site-api.interceptor.ts).
    { provide: SITE_API_SERVER_HANDLER, useValue: (path: string, params: URLSearchParams) => handleSiteApi(siteApi, path, params) },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
