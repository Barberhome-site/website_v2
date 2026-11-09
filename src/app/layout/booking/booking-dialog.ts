import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { BookingService } from '../../core/booking/booking.service';
import { SITE } from '../../core/config/site.config';
import { FormatPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { Avatar } from '../../shared/components/avatar/avatar';
import { Icon } from '../../shared/components/icon/icon';

type Platform = 'ios' | 'android' | 'desktop';

const REDIRECT_SECONDS = 3;

/** Détection de la plateforme pour proposer le bon store. */
function detectPlatform(win: Window | null): Platform {
  if (!win) {
    return 'desktop';
  }
  const ua = win.navigator.userAgent || '';
  const iPadOs = /Macintosh/.test(ua) && win.navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(ua) || iPadOs) {
    return 'ios';
  }
  if (/Android/i.test(ua)) {
    return 'android';
  }
  return 'desktop';
}

/**
 * Popup « Prenota ».
 *  - Sur iPhone/iPad ou Android : le bon store est détecté et la redirection est automatique
 *    après un court compte à rebours, annulable (WCAG 2.2.1).
 *  - Sur ordinateur : les deux stores sont proposés.
 */
@Component({
  selector: 'app-booking-dialog',
  imports: [Avatar, Icon, FormatPipe],
  templateUrl: './booking-dialog.html',
  styleUrl: './booking-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingDialog {
  protected readonly booking = inject(BookingService);
  protected readonly i18n = inject(I18n);
  private readonly analytics = inject(AnalyticsService);
  private readonly doc = inject(DOCUMENT);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly platform = signal<Platform>('desktop');
  protected readonly countdown = signal<number | null>(null);
  private timer: ReturnType<typeof setInterval> | null = null;

  protected readonly stores = {
    ios: { name: 'App Store', url: SITE.apps.appStoreUrl, id: 'app_store' },
    android: { name: 'Google Play', url: SITE.apps.playStoreUrl, id: 'google_play' },
  } as const;

  /** Store principal (mobile) et store secondaire. */
  protected readonly primaryStore = computed(() => (this.platform() === 'android' ? this.stores.android : this.stores.ios));
  protected readonly secondaryStore = computed(() => (this.platform() === 'android' ? this.stores.ios : this.stores.android));

  constructor() {
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (!el || typeof el.showModal !== 'function') {
        return;
      }
      const pro = this.booking.professional();
      untracked(() => {
        if (pro) {
          this.platform.set(detectPlatform(this.doc.defaultView));
          if (!el.open) {
            el.showModal();
          }
          this.startCountdown();
        } else {
          this.stopCountdown();
          if (el.open) {
            el.close();
          }
        }
      });
    });
    inject(DestroyRef).onDestroy(() => this.stopCountdown());
  }

  protected close(): void {
    this.booking.close();
  }

  /** Fermeture par Échap ou par le navigateur. */
  protected onDialogClose(): void {
    if (this.booking.professional()) {
      this.booking.close();
    }
  }

  protected cancelRedirect(): void {
    this.stopCountdown();
  }

  protected trackStore(store: string): void {
    this.stopCountdown();
    this.analytics.track('store_click', {
      store,
      placement: 'booking_dialog',
      professional_id: this.booking.professional()?.professionalId,
    });
  }

  private startCountdown(): void {
    this.stopCountdown();
    if (this.platform() === 'desktop') {
      return;
    }
    this.countdown.set(REDIRECT_SECONDS);
    this.timer = setInterval(() => {
      const next = (this.countdown() ?? 0) - 1;
      if (next > 0) {
        this.countdown.set(next);
        return;
      }
      const store = this.primaryStore();
      this.trackStore(store.id);
      this.doc.defaultView?.location.assign(store.url);
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.countdown.set(null);
  }
}
