import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

/**
 * Image responsive (NgOptimizedImage : lazy loading, srcset, preload si `priority`).
 * Sans `src`, affiche un emplacement neutre avec une légende (photo à fournir).
 * Le conteneur fixe le ratio : aucune variation de mise en page (CLS).
 */
@Component({
  selector: 'app-media',
  imports: [NgOptimizedImage, Icon],
  template: `
    @if (src(); as source) {
      <img [ngSrc]="source" [alt]="alt()" fill [priority]="priority()" [sizes]="sizes()" [style.object-position]="position()" />
    } @else {
      <div class="ph" [class.ph--corner]="placeholderAlign() === 'corner'" [attr.role]="alt() ? 'img' : null" [attr.aria-label]="alt() || null"
           [attr.aria-hidden]="alt() ? null : 'true'">
        <app-icon [name]="icon()" [strokeWidth]="1.2" />
        @if (placeholderLabel()) {
          <span class="ph__label">{{ placeholderLabel() }}</span>
        }
      </div>
    }
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; background: var(--c-card); }
    img { object-fit: cover; }
    .ph {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 0.75rem; padding: 1rem; text-align: center; color: rgba(255,255,255,.28);
      background:
        radial-gradient(120% 80% at 70% 20%, rgba(239,210,75,.10), transparent 60%),
        linear-gradient(160deg, #1f1f1f 0%, #121212 100%);
    }
    .ph app-icon { width: clamp(2.5rem, 18%, 4.5rem); height: clamp(2.5rem, 18%, 4.5rem); }
    .ph__label { font-size: .8125rem; color: #8d8d88; max-width: 28ch; }
    .ph--corner { flex-direction: row; align-items: flex-start; justify-content: flex-end; padding: 1.5rem; text-align: right; }
    .ph--corner app-icon { width: 2rem; height: 2rem; }
  `,
  host: { '[style.aspect-ratio]': 'ratio()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Media {
  readonly src = input<string | null | undefined>(null);
  readonly alt = input('');
  readonly priority = input(false);
  /** Point de cadrage de la photo (object-position) : le sujet reste dans le recadrage. */
  readonly position = input<string | null | undefined>(null);
  /**
   * Largeur affichée, pour le srcset automatique de NgOptimizedImage : unités responsives uniquement
   * (« 50vw », « (min-width: 960px) 40vw, 100vw »). Une valeur en px lève l'erreur NG02952.
   */
  readonly sizes = input('100vw');
  /** Ex. « 4 / 5 ». Laisser vide si le parent fixe la hauteur. */
  readonly ratio = input<string | null>(null);
  readonly icon = input<IconName>('sparkle');
  readonly placeholderLabel = input('');
  /** `corner` : emplacement discret en haut à droite (derrière un texte, ex. la hero). */
  readonly placeholderAlign = input<'center' | 'corner'>('center');
}
