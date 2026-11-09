import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { GlamroDataSource } from '../data/glamro-data-source';
import { DEFAULT_LANG, Lang, isLang } from '../i18n/i18n.config';
import { canonicalSlug } from '../i18n/route-slugs';
import { City, ProfessionalProfile, ServiceCategory } from '../models/glamro.models';

/** Langue de la route (data.lang héritée de la route parente). */
function routeLang(route: ActivatedRouteSnapshot): Lang {
  const lang = route.data['lang'];
  return isLang(lang) ? lang : DEFAULT_LANG;
}

/**
 * Les résolveurs chargent les données AVANT l'affichage de la page :
 * en SSR, le contenu et les métadonnées sont donc présents dans le HTML initial.
 * Ils renvoient `null` si l'élément n'existe pas → la page affiche une 404.
 */
export const serviceResolver: ResolveFn<ServiceCategory | null> = (route) =>
  inject(GlamroDataSource)
    // « coiffure » (fr) → « capelli » : l'API travaille avec le slug canonique.
    .getService(canonicalSlug('services', route.paramMap.get('slug') ?? '', routeLang(route)))
    .pipe(catchError(() => of(null)));

export const cityResolver: ResolveFn<City | null> = (route) =>
  inject(GlamroDataSource)
    .getCity(route.paramMap.get('citySlug') ?? '')
    .pipe(catchError(() => of(null)));

export const professionalResolver: ResolveFn<ProfessionalProfile | null> = (route) =>
  inject(GlamroDataSource)
    .getProfessional(route.paramMap.get('id') ?? '')
    .pipe(catchError(() => of(null)));
