import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_LANG, LANGS, Lang, localizePath } from './i18n.config';
import { I18n } from './i18n.service';
import { readLangCookie, serializeLangCookie } from './lang-cookie';

/**
 * Préférence de langue du visiteur.
 *  - Le choix fait dans le menu des langues est enregistré dans le cookie `glamro_lang` (1 an).
 *  - Retour sur la page d'accueil italienne (`/`) avec une autre langue enregistrée → page d'accueil
 *    de cette langue (redirection côté serveur dans server.ts, et ici en secours si `/` est servie
 *    en statique, par ex. sur Vercel). Les autres URL ne sont jamais redirigées : un lien partagé
 *    garde sa langue.
 *  - Aucune préférence et navigateur dans une autre langue disponible → `suggestion` (bandeau
 *    LangSuggest). Pas de redirection automatique : déconseillé par Google (indexation).
 */
@Injectable({ providedIn: 'root' })
export class LangPreference {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18n);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Langue enregistrée (null tant que le visiteur n'a rien choisi, et toujours null côté serveur). */
  readonly stored = signal<Lang | null>(null);
  /** Langue du navigateur, si elle fait partie des langues du site. */
  private readonly browserLang = signal<Lang | null>(null);

  /** Langue à proposer dans le bandeau, ou null. */
  readonly suggestion = computed(() => {
    const browser = this.browserLang();
    return !this.stored() && browser && browser !== this.i18n.lang() ? browser : null;
  });

  /** À appeler une fois, après l'hydratation (le HTML serveur et client restent identiques). */
  init(): void {
    if (!this.isBrowser) {
      return;
    }
    const stored = readLangCookie(this.doc.cookie);
    this.stored.set(stored);

    const path = this.router.url.split(/[?#]/)[0];
    if (stored && stored !== DEFAULT_LANG && path === '/') {
      void this.router.navigateByUrl(localizePath('/', stored), { replaceUrl: true });
      return;
    }
    this.browserLang.set(this.detectBrowserLang());
  }

  /** Enregistre le choix du visiteur (menu des langues ou bandeau). */
  save(lang: Lang): void {
    if (!this.isBrowser) {
      return;
    }
    this.doc.cookie = serializeLangCookie(lang, this.doc.location.protocol === 'https:');
    this.stored.set(lang);
  }

  private detectBrowserLang(): Lang | null {
    const nav = this.doc.defaultView?.navigator;
    const prefs = nav?.languages?.length ? nav.languages : [nav?.language ?? ''];
    for (const tag of prefs) {
      const base = tag.toLowerCase().split('-')[0];
      const match = LANGS.find((l) => l === base);
      if (match) {
        return match;
      }
    }
    return null;
  }
}
