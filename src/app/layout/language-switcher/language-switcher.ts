import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { LANGS, LANG_INFO, Lang } from '../../core/i18n/i18n.config';
import { FormatPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { LangPreference } from '../../core/i18n/lang-preference.service';
import { Icon } from '../../shared/components/icon/icon';

let nextId = 0;

/**
 * Menu déroulant de langue (header sur bureau, menu plein écran sur mobile).
 * Chaque langue est un vrai lien (<a hreflang>) vers la même page dans l'autre langue,
 * utilisable au clavier ; Échap ou la perte du focus ferme la liste.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [RouterLink, Icon, FormatPipe],
  template: `
      <div class="ls" (focusout)="onFocusOut($event)">
        <button
          type="button"
          class="ls__toggle"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="listId"
          [attr.aria-label]="i18n.d().lang.change | fmt: { lang: i18n.info().label }"
          (click)="open.set(!open())"
        >
          {{ i18n.info().short }}
          <app-icon name="chevron-down" />
        </button>
        @if (open()) {
          <ul [id]="listId" class="ls__list" role="list">
            @for (l of langs; track l) {
              <li>
                <a [routerLink]="i18n.urlFor(l)" [attr.hreflang]="l" [attr.lang]="l"
                   [attr.aria-current]="l === i18n.lang() ? 'true' : null" (click)="choose(l)">
                  <span class="ls__short" aria-hidden="true">{{ info[l].short }}</span> {{ info[l].label }}
                </a>
              </li>
            }
          </ul>
        }
      </div>
  `,
  styleUrl: './language-switcher.scss',
  host: { '(document:keydown.escape)': 'open.set(false)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  protected readonly i18n = inject(I18n);
  protected readonly langs = LANGS;
  protected readonly info = LANG_INFO;
  protected readonly open = signal(false);
  private readonly pref = inject(LangPreference);
  /** Identifiant unique : le composant est présent deux fois (header et menu mobile). */
  protected readonly listId = `ls-list-${nextId++}`;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));
  }

  /** Le choix est enregistré (cookie glamro_lang) pour les prochaines visites. */
  protected choose(lang: Lang): void {
    this.pref.save(lang);
    this.open.set(false);
  }

  /** Ferme le menu quand le focus quitte le composant. */
  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.open.set(false);
    }
  }
}
