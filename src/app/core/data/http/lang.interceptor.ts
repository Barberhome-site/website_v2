import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { I18n } from '../../i18n/i18n.service';

/**
 * Ajoute la langue courante aux appels vers l'API GLAMRO (en-tête Accept-Language),
 * pour que services, villes, FAQ et profils reviennent traduits.
 * TODO API : si l'API préfère un paramètre (?lang=fr), l'ajouter ici.
 */
export const langInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }
  const i18n = inject(I18n);
  return next(req.clone({ setHeaders: { 'Accept-Language': i18n.locale() } }));
};
