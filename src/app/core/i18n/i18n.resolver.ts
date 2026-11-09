import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { I18n } from './i18n.service';
import { DEFAULT_LANG, isLang } from './i18n.config';

/**
 * Active la langue déclarée dans `data.lang` de la route parente, AVANT l'affichage de la page.
 * En SSR comme dans le navigateur, la page est donc rendue directement dans la bonne langue.
 */
export const i18nResolver: ResolveFn<boolean> = async (route) => {
  const lang = route.data['lang'];
  await inject(I18n).use(isLang(lang) ? lang : DEFAULT_LANG);
  return true;
};
