import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { defer, map } from 'rxjs';

/** Traitement d'une requête /site-api, fourni uniquement côté serveur (app.config.server.ts). */
export type SiteApiServerHandler = (
  pathname: string,
  params: URLSearchParams,
) => Promise<{ status: number; body: unknown }>;

export const SITE_API_SERVER_HANDLER = new InjectionToken<SiteApiServerHandler>('SITE_API_SERVER_HANDLER');

/**
 * Pendant le rendu serveur, les requêtes GET /site-api/… sont traitées en mémoire, sans
 * appel HTTP du serveur vers lui-même. Les réponses passent quand même par HttpClient :
 * le cache de transfert d'Angular les envoie au navigateur, qui ne refait pas l'appel.
 * Dans le navigateur, le jeton n'est pas fourni : la requête part normalement vers /site-api.
 */
export const siteApiInterceptor: HttpInterceptorFn = (req, next) => {
  const handler = inject(SITE_API_SERVER_HANDLER, { optional: true });
  if (!handler || req.method !== 'GET' || !req.url.startsWith('/site-api/')) {
    return next(req);
  }
  const url = new URL(req.urlWithParams, 'http://site.local');
  return defer(() => handler(url.pathname, url.searchParams)).pipe(
    map((res) => {
      if (res.status >= 400) {
        throw new HttpErrorResponse({ status: res.status, error: res.body, url: req.urlWithParams });
      }
      return new HttpResponse({ status: res.status, body: res.body, url: req.urlWithParams });
    }),
  );
};
