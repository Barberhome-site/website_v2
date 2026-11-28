import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CONSENT_REQUIRED,
  ConsentCategory,
  ConsentChoices,
  OptionalConsentCategory,
} from '../../core/consent/consent.model';
import { ConsentService } from '../../core/consent/consent.service';
import { COOKIE_INVENTORY } from '../../core/consent/cookie-inventory';
import { FormatPipe, LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { Icon } from '../../shared/components/icon/icon';

/**
 * Panneau « Gestisci cookie » : <dialog> natif (focus piégé, Échap pour fermer).
 * Ouvert depuis le bandeau ou le footer. Permet aussi la révocation.
 */
@Component({
  selector: 'app-consent-preferences',
  imports: [RouterLink, Icon, LocalizePathPipe, FormatPipe],
  templateUrl: './consent-preferences.html',
  styleUrl: './consent-preferences.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsentPreferences {
  protected readonly consent = inject(ConsentService);
  protected readonly i18n = inject(I18n);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  // « functional » n'a plus d'outil depuis le passage de la carte en « necessary » : catégorie non affichée.
  protected readonly categories: ConsentCategory[] = ['necessary', 'analytics', 'marketing'];
  protected readonly required = CONSENT_REQUIRED;
  protected readonly draft = signal<ConsentChoices>({ functional: false, analytics: false, marketing: false });

  constructor() {
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (!el || typeof el.showModal !== 'function') {
        return; // pas encore rendu, ou rendu serveur
      }
      if (this.consent.preferencesOpen()) {
        this.draft.set({ ...this.consent.choices() });
        if (!el.open) {
          el.showModal();
        }
      } else if (el.open) {
        el.close();
      }
    });
  }

  protected trackersFor(category: ConsentCategory) {
    return COOKIE_INVENTORY.filter((t) => t.category === category);
  }

  protected isChecked(category: ConsentCategory): boolean {
    return category === 'necessary' || this.draft()[category as OptionalConsentCategory];
  }

  protected toggle(category: ConsentCategory, checked: boolean): void {
    if (category === 'necessary') {
      return;
    }
    this.draft.update((d) => ({ ...d, [category]: checked }));
  }

  protected save(): void {
    this.consent.save(this.draft());
  }

  /** Fermeture via Échap ou bouton : aucune modification des choix existants. */
  protected onDialogClose(): void {
    if (this.consent.preferencesOpen()) {
      this.consent.closePreferences();
    }
  }
}
