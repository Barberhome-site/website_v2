import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SITE } from '../../core/config/site.config';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { Icon } from '../../shared/components/icon/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/** Header compact : logo officiel, 5 entrées de navigation max, CTA principale (brief §4-5). */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, LanguageSwitcher, LocalizePathPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(document:keydown.escape)': 'closeMenu()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly site = SITE;
  protected readonly i18n = inject(I18n);
  protected readonly menuOpen = signal(false);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeMenu());
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.doc.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  protected closeMenu(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.doc.body.style.overflow = '';
    }
  }
}
