import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, PLATFORM_ID, effect, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConsentService } from '../consent/consent.service';
import { loadScript } from '../utils/script-loader';

/** Événements définis par le brief (§12). */
export type AnalyticsEventName =
  | 'check_availability'
  | 'view_service'
  | 'view_professional'
  | 'store_click'
  | 'pro_cta_click'
  | 'start_application'
  | 'support_click';

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

type Gtag = (...args: unknown[]) => void;
interface GtagWindow extends Window {
  dataLayer?: unknown[];
  gtag?: Gtag;
}

/** Clés interdites dans les paramètres : aucune donnée personnelle (brief §12-13). */
const FORBIDDEN_KEYS = /(e-?mail|phone|telefono|name|nome|cognome|address|indirizzo|cap|postal|message|messaggio)/i;

/**
 * Google Analytics 4, chargé UNIQUEMENT après consentement « analytics ».
 * - Aucun script Google n'est chargé avant le choix de l'utilisateur.
 * - La révocation coupe immédiatement l'envoi et supprime les cookies _ga.
 *
 * Deux façons de charger la balise, selon l'ID configuré :
 * - `GTM-…` (snippet actuel de Google Analytics) : conteneur Tag Manager `gtm.js`. Le conteneur envoie
 *   lui-même les pages vues (au chargement, puis à chaque navigation grâce à la « mesure améliorée »).
 *   À la révocation, la page est rechargée pour retirer le conteneur, qui n'a pas d'interrupteur global.
 * - `G-…` : `gtag.js`, avec des pages vues envoyées par le site, sans la query string.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly consent = inject(ConsentService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly tagId = environment.googleTagId;
  private readonly isContainer = this.tagId.startsWith('GTM-');
  private enabled = false;
  private loaded = false;

  constructor() {
    // Uniquement sur le vrai domaine : les aperçus (Vercel, localhost…) ne polluent pas les statistiques.
    if (!this.isBrowser || !this.tagId || !/(^|\.)glamro\.it$/.test(this.win.location.hostname)) {
      return;
    }
    effect(() => {
      const granted = this.consent.ready() && this.consent.isGranted('analytics');
      if (granted) {
        this.enable();
      } else {
        this.disable();
      }
    });
  }

  track(event: AnalyticsEventName, params: AnalyticsParams = {}): void {
    if (!this.enabled) {
      return;
    }
    this.gtag()?.('event', event, sanitize(params));
  }

  pageView(path: string, title: string): void {
    if (!this.enabled || this.isContainer) {
      return;
    }
    const cleanPath = path.split(/[?#]/)[0];
    this.gtag()?.('event', 'page_view', {
      page_location: `${this.win.location.origin}${cleanPath}`,
      page_path: cleanPath,
      page_title: title,
    });
  }

  /* ---------------------------------------------------------------- */

  private get win(): GtagWindow {
    return this.doc.defaultView as unknown as GtagWindow;
  }

  /** Drapeau officiel de Google pour couper la collecte : window['ga-disable-<ID de mesure>']. */
  private setGaDisabled(disabled: boolean): void {
    if (!this.isContainer) {
      (this.win as unknown as Record<string, unknown>)[`ga-disable-${this.tagId}`] = disabled;
    }
  }

  private gtag(): Gtag | undefined {
    return this.win.gtag;
  }

  private enable(): void {
    if (this.enabled) {
      return;
    }
    const w = this.win;
    this.setGaDisabled(false);

    if (!this.loaded) {
      w.dataLayer = w.dataLayer || [];
      // gtag doit pousser l'objet `arguments` (comportement attendu par Google).
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      } as Gtag;
      // Consent Mode v2 : tout refusé par défaut, seul analytics est accordé ici.
      w.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
      w.gtag('consent', 'update', { analytics_storage: 'granted' });
      w.gtag('js', new Date());
      if (this.isContainer) {
        loadScript(this.doc, `https://www.googletagmanager.com/gtm.js?id=${this.tagId}`).catch(() => undefined);
      } else {
        w.gtag('config', this.tagId, { send_page_view: false });
        loadScript(this.doc, `https://www.googletagmanager.com/gtag/js?id=${this.tagId}`).catch(() => undefined);
      }
      this.loaded = true;
    } else {
      w.gtag!('consent', 'update', { analytics_storage: 'granted' });
    }
    this.enabled = true;

    // Le conteneur envoie lui-même la première page vue à son chargement.
    this.pageView(w.location.pathname, this.doc.title);
  }

  private disable(): void {
    if (!this.enabled && !this.loaded) {
      return;
    }
    const w = this.win;
    w.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    this.setGaDisabled(true);
    this.enabled = false;
    this.deleteGaCookies();
    if (this.isContainer && this.loaded) {
      // Le choix est déjà enregistré : au rechargement, le conteneur n'est plus chargé.
      w.location.reload();
    }
  }

  private deleteGaCookies(): void {
    const host = this.win.location.hostname;
    const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
    const names = this.doc.cookie
      .split(';')
      .map((c) => c.split('=')[0].trim())
      .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid');
    for (const name of names) {
      for (const domain of domains) {
        this.doc.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`;
      }
    }
  }
}

function sanitize(params: AnalyticsParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || FORBIDDEN_KEYS.test(key)) {
      continue;
    }
    if (typeof value === 'string' && (value.includes('@') || /\d{5,}/.test(value))) {
      continue;
    }
    out[key] = value;
  }
  return out;
}
