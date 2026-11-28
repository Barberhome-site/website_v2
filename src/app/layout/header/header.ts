import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { AppDownload } from '../../core/app-download/app-download.service';
import { SITE } from '../../core/config/site.config';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { Icon } from '../../shared/components/icon/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/** Largeur à partir de laquelle la navigation complète s'affiche (pas de burger). */
const DESKTOP_QUERY = '(min-width: 1120px)';

/**
 * Header noir du mockup : logo, 5 entrées (Servizi, Come funziona, Sicurezza, Assistenza, Chi siamo),
 * puis langue, « Per professionisti » et le bouton jaune « Scarica l'app ».
 *
 * « Scarica l'app » : store de l'application clients sur téléphone, défilement jusqu'aux badges sur
 * ordinateur (voir AppDownload). Sans JavaScript, le lien mène aux badges du footer de la page.
 *
 * Sur mobile, le menu est un <dialog> natif plein écran :
 *  - il couvre toute la page (top layer, indépendant du header) ;
 *  - le focus reste dans le menu, Échap le ferme, le focus revient sur le bouton burger ;
 *  - la page derrière ne défile pas tant qu'il est ouvert.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, LanguageSwitcher, LocalizePathPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly site = SITE;
  protected readonly i18n = inject(I18n);
  protected readonly download = inject(AppDownload);
  protected readonly menuOpen = signal(false);
  private readonly analytics = inject(AnalyticsService);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);

  /** Adresse de la page courante, sans fragment. */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Store sur téléphone ; sinon ancre vers les badges de la page courante (`<base href="/">` oblige à garder le chemin). */
  protected readonly downloadHref = computed(
    () => this.download.storeUrl() ?? `${this.currentUrl().split('#')[0]}#scarica-app`,
  );
  private readonly menu = viewChild<ElementRef<HTMLDialogElement>>('menu');

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeMenu());

    // Si l'écran passe en largeur bureau pendant que le menu est ouvert, on le ferme.
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const mq = this.doc.defaultView?.matchMedia(DESKTOP_QUERY);
      const onChange = (e: MediaQueryListEvent) => e.matches && this.closeMenu();
      mq?.addEventListener('change', onChange);
      destroyRef.onDestroy(() => mq?.removeEventListener('change', onChange));
    });
  }

  protected openMenu(): void {
    const dialog = this.menu()?.nativeElement;
    if (!dialog || dialog.open || typeof dialog.showModal !== 'function') {
      return;
    }
    dialog.showModal();
    this.menuOpen.set(true);
    this.doc.documentElement.classList.add('is-scroll-locked');
  }

  protected closeMenu(): void {
    const dialog = this.menu()?.nativeElement;
    if (dialog?.open) {
      dialog.close(); // déclenche (close) → onMenuClosed()
    }
  }

  protected trackPro(placement: string): void {
    this.analytics.track('pro_cta_click', { placement });
  }

  /** Depuis le menu mobile : on ferme d'abord le menu, puis on suit le lien ou on fait défiler. */
  protected onMenuDownload(event: MouseEvent): void {
    this.closeMenu();
    this.onMenuClosed(); // l'événement (close) arrive après : on libère le défilement tout de suite
    this.download.handleClick(event, 'mobile_menu');
  }

  /** Appelé pour toute fermeture : bouton, Échap, navigation. */
  protected onMenuClosed(): void {
    this.menuOpen.set(false);
    this.doc.documentElement.classList.remove('is-scroll-locked');
  }
}
