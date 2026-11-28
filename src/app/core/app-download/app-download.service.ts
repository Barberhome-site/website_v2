import { DOCUMENT, Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { AnalyticsService } from '../analytics/analytics.service';
import { SITE } from '../config/site.config';
import { DevicePlatform, detectPlatform } from './device-platform';

/** Élément de la page vers lequel « Scarica l'app » fait défiler sur ordinateur. */
export const APP_DOWNLOAD_SELECTOR = '[data-app-download]';

/**
 * Boutons « Scarica l'app » (header, menu mobile, barre du bas) :
 *  - sur iPhone/iPad ou Android, le lien mène directement au bon store de l'application clients ;
 *  - sur ordinateur, il fait défiler jusqu'aux badges des stores de la page
 *    (le premier élément `[data-app-download]` : la section de la page s'il y en a une, sinon le footer).
 *
 * La plateforme n'est connue qu'après l'hydratation : le rendu serveur et le premier rendu
 * sont identiques (« desktop »), puis le lien est mis à jour.
 */
@Injectable({ providedIn: 'root' })
export class AppDownload {
  private readonly doc = inject(DOCUMENT);
  private readonly analytics = inject(AnalyticsService);

  readonly platform = signal<DevicePlatform>('desktop');

  /** Lien direct vers le store de l'application clients, ou null sur ordinateur. */
  readonly storeUrl = computed(() => {
    switch (this.platform()) {
      case 'ios':
        return SITE.apps.client.appStoreUrl;
      case 'android':
        return SITE.apps.client.playStoreUrl;
      default:
        return null;
    }
  });

  constructor() {
    afterNextRender(() => this.platform.set(detectPlatform(this.doc.defaultView)));
  }

  /**
   * Clic sur un bouton « Scarica l'app ».
   * Sur téléphone, le lien suit son cours vers le store. Sur ordinateur, défilement doux
   * jusqu'aux badges, qui reçoivent le focus (clavier et lecteurs d'écran suivent).
   * Ctrl/Cmd/Maj + clic et clic du milieu gardent le comportement normal du navigateur.
   */
  handleClick(event: MouseEvent, placement: string): void {
    if (this.storeUrl()) {
      this.analytics.track('store_click', {
        store: this.platform() === 'android' ? 'google_play' : 'app_store',
        app: 'client',
        placement,
      });
      return;
    }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const target = this.doc.querySelector<HTMLElement>(APP_DOWNLOAD_SELECTOR);
    if (!target) {
      return;
    }
    event.preventDefault();
    const reduce = this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  }
}
