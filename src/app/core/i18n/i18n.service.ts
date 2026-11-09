import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, UrlTree } from '@angular/router';
import { filter } from 'rxjs';
import { Dict, IT } from '../../i18n/it';
import { addDaysIso, diffDaysIso, todayIso } from '../utils/dates';
import { DEFAULT_LANG, LANGS, LANG_INFO, Lang, localizePath, stripLang } from './i18n.config';

/** Chargement à la demande : seul le dictionnaire de la langue affichée est téléchargé. */
const LOADERS: Record<Exclude<Lang, 'it'>, () => Promise<Dict>> = {
  en: () => import('../../i18n/en').then((m) => m.EN),
  fr: () => import('../../i18n/fr').then((m) => m.FR),
  es: () => import('../../i18n/es').then((m) => m.ES),
  de: () => import('../../i18n/de').then((m) => m.DE),
};

export type FormatParams = Record<string, string | number | null | undefined>;

/** Remplace {nom} par les valeurs fournies. */
export function format(template: string, params: FormatParams = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === null || value === undefined ? '' : String(value);
  });
}

/**
 * Langue courante et textes de l'interface.
 *
 * Dans les composants :
 *   protected readonly i18n = inject(I18n);
 *   template : {{ i18n.d().home.title }}       → texte typé (erreur de compilation si la clé manque)
 *              {{ i18n.d().x | fmt: { name } }} → texte avec paramètres
 *              [routerLink]="'/servizi' | lp: i18n.lang()" → lien dans la langue courante
 *
 * La langue est fixée par la route (voir app.routes.ts) avant l'affichage de la page.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly cache = new Map<Lang, Dict>([['it', IT]]);

  readonly lang = signal<Lang>(DEFAULT_LANG);
  /** Dictionnaire de la langue courante (raccourci : i18n.d()). */
  readonly d = signal<Dict>(IT);
  readonly info = computed(() => LANG_INFO[this.lang()]);
  readonly locale = computed(() => this.info().locale);

  /** URL courante (mise à jour à chaque navigation) — pour le sélecteur de langue. */
  private readonly currentUrl = signal('/');
  /** Même page dans chaque langue (query string et fragment conservés). */
  private readonly alternates = computed(() => {
    const base = stripLang(this.currentUrl());
    return Object.fromEntries(LANGS.map((l) => [l, this.router.parseUrl(localizePath(base, l))])) as Record<Lang, UrlTree>;
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
  }

  /** Active une langue (appelé par le résolveur de route). */
  async use(lang: Lang): Promise<void> {
    let dict = this.cache.get(lang);
    if (!dict) {
      dict = await LOADERS[lang as Exclude<Lang, 'it'>]();
      this.cache.set(lang, dict);
    }
    this.d.set(dict);
    this.lang.set(lang);
    this.doc.documentElement?.setAttribute('lang', lang);
  }

  /** Chemin interne dans la langue courante. */
  path(path: string, lang: Lang = this.lang()): string {
    return localizePath(path, lang);
  }

  /** La page courante dans une autre langue (sélecteur de langue). */
  urlFor(lang: Lang): UrlTree {
    return this.alternates()[lang];
  }

  format(template: string, params: FormatParams = {}): string {
    return format(template, params);
  }

  /** « 2 novembre 2026 » dans la langue courante. */
  formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
    const options: Intl.DateTimeFormatOptions =
      style === 'long'
        ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
        : { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' };
    return new Intl.DateTimeFormat(this.locale(), options).format(new Date(Date.UTC(y, m - 1, d)));
  }

  formatPrice(value: number | null | undefined, currency = 'EUR'): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return new Intl.NumberFormat(this.locale(), { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  }

  /** « Disponibile da oggi / domani / dal lun 10 nov » dans la langue courante. */
  availability(iso: string | null | undefined, today: string = todayIso()): string | null {
    if (!iso) {
      return null;
    }
    const labels = this.d().card;
    const delta = diffDaysIso(today, iso);
    if (delta <= 0) {
      return labels.availableToday;
    }
    if (iso === addDaysIso(today, 1)) {
      return labels.availableTomorrow;
    }
    return format(labels.availableFrom, { date: this.formatDate(iso, 'short') });
  }
}
