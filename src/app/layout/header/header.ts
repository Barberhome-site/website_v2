import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SITE } from '../../core/config/site.config';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { Icon } from '../../shared/components/icon/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/** Largeur à partir de laquelle la navigation complète s'affiche (pas de burger). */
const DESKTOP_QUERY = '(min-width: 1200px)';

/**
 * Header compact : logo officiel, 5 entrées de navigation max, langue, CTA principale (brief §4-5).
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
  protected readonly menuOpen = signal(false);
  private readonly doc = inject(DOCUMENT);
  private readonly menu = viewChild<ElementRef<HTMLDialogElement>>('menu');

  constructor() {
    inject(Router)
      .events.pipe(
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

  /** Appelé pour toute fermeture : bouton, Échap, navigation. */
  protected onMenuClosed(): void {
    this.menuOpen.set(false);
    this.doc.documentElement.classList.remove('is-scroll-locked');
  }
}
