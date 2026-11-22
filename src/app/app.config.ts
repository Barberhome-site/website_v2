import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';
import { siteApiInterceptor } from './core/data/http/site-api.interceptor';
import { provideGlamroData } from './core/data/provide-glamro-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Zoneless : comportement par défaut depuis Angular 21, aucun provider nécessaire.
    provideRouter(
      routes,
      // Les données des résolveurs et les paramètres arrivent dans les input() des pages.
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([siteApiInterceptor])),
    // Hydratation + cache de transfert des requêtes GET (pas de double appel API).
    provideClientHydration(withEventReplay()),
    provideGlamroData(),
  ],
};
