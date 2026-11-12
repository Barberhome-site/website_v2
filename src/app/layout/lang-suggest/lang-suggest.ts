import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Lang } from '../../core/i18n/i18n.config';
import { I18n } from '../../core/i18n/i18n.service';
import { LangPreference } from '../../core/i18n/lang-preference.service';

/** Textes du bandeau, écrits dans la langue PROPOSÉE (celle que le visiteur comprend). */
const TEXT: Record<Lang, { available: string; switchTo: string; stay: string; names: Record<Lang, string> }> = {
  it: {
    available: 'Questo sito è disponibile in italiano.',
    switchTo: 'Passa all’italiano',
    stay: 'Resta in {lang}',
    names: { it: 'italiano', en: 'inglese', fr: 'francese', es: 'spagnolo', de: 'tedesco' },
  },
  en: {
    available: 'This site is available in English.',
    switchTo: 'Switch to English',
    stay: 'Stay in {lang}',
    names: { it: 'Italian', en: 'English', fr: 'French', es: 'Spanish', de: 'German' },
  },
  fr: {
    available: 'Ce site est disponible en français.',
    switchTo: 'Passer en français',
    stay: 'Rester en {lang}',
    names: { it: 'italien', en: 'anglais', fr: 'français', es: 'espagnol', de: 'allemand' },
  },
  es: {
    available: 'Este sitio está disponible en español.',
    switchTo: 'Cambiar a español',
    stay: 'Seguir en {lang}',
    names: { it: 'italiano', en: 'inglés', fr: 'francés', es: 'español', de: 'alemán' },
  },
  de: {
    available: 'Diese Website ist auf Deutsch verfügbar.',
    switchTo: 'Auf Deutsch wechseln',
    stay: 'Auf {lang} bleiben',
    names: { it: 'Italienisch', en: 'Englisch', fr: 'Französisch', es: 'Spanisch', de: 'Deutsch' },
  },
};

/**
 * Bandeau discret en haut de page : « Ce site est disponible en français — Passer en français / Rester en italien ».
 * Affiché seulement dans le navigateur, sans préférence enregistrée, si la langue du navigateur
 * est disponible et différente de celle de la page. Les deux boutons enregistrent le choix.
 */
@Component({
  selector: 'app-lang-suggest',
  template: `
    @if (pref.suggestion(); as target) {
      <div class="lsg" role="region" [attr.lang]="target" [attr.aria-label]="text().available">
        <p class="lsg__text">{{ text().available }}</p>
        <div class="lsg__actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="switchTo(target)">{{ text().switchTo }}</button>
          <button type="button" class="btn btn--outline btn--sm" (click)="stay()">{{ stayLabel() }}</button>
        </div>
      </div>
    }
  `,
  styles: `
    .lsg {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem 1rem;
      padding: 0.6rem 1rem;
      background: var(--c-card);
      border-bottom: 1px solid var(--c-border);
      animation: lsg-in var(--dur) var(--ease);
    }
    .lsg__text {
      margin: 0;
      font-size: var(--fs-small);
      font-weight: 600;
    }
    .lsg__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    @keyframes lsg-in {
      from { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .lsg { animation: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSuggest {
  protected readonly pref = inject(LangPreference);
  private readonly i18n = inject(I18n);
  private readonly router = inject(Router);

  protected readonly text = computed(() => TEXT[this.pref.suggestion() ?? this.i18n.lang()]);
  protected readonly stayLabel = computed(() =>
    this.text().stay.replace('{lang}', this.text().names[this.i18n.lang()]),
  );

  protected switchTo(lang: Lang): void {
    this.pref.save(lang);
    void this.router.navigateByUrl(this.i18n.urlFor(lang));
  }

  protected stay(): void {
    this.pref.save(this.i18n.lang());
  }
}
