import { Pipe, PipeTransform } from '@angular/core';
import { FormatParams, format } from './i18n.service';
import { Lang, localizePath } from './i18n.config';

/**
 * Lien localisé (préfixe de langue + segments traduits) :
 *   [routerLink]="'/servizi' | lp: i18n.lang()"            → '/fr/services'
 *   [routerLink]="['/servizi', slug] | lp: i18n.lang()"     → '/fr/services/coiffure'
 * Les tableaux sont assemblés en un seul chemin avant traduction.
 * La langue est passée en argument : le pipe reste pur et se met à jour au changement de langue.
 */
@Pipe({ name: 'lp' })
export class LocalizePathPipe implements PipeTransform {
  transform(path: string | readonly (string | number)[], lang: Lang): string {
    const canonical = typeof path === 'string' ? path : path.map(String).join('/').replace(/\/{2,}/g, '/');
    return localizePath(canonical, lang);
  }
}

/** Texte avec paramètres :  {{ i18n.d().card.bookWith | fmt: { name: pro.displayName } }} */
@Pipe({ name: 'fmt' })
export class FormatPipe implements PipeTransform {
  transform(template: string, params: FormatParams): string {
    return format(template, params);
  }
}

export const I18N_PIPES = [LocalizePathPipe, FormatPipe] as const;
