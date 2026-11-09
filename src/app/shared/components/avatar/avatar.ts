import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageRef } from '../../../core/models/glamro.models';
import { initials } from '../../../core/utils/text';

/** Photo de profil ronde ; initiales si aucune photo n'est disponible. */
@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  template: `
    @if (image(); as img) {
      <img [ngSrc]="img.src" [alt]="img.alt" [width]="size()" [height]="size()" />
    } @else {
      <span aria-hidden="true">{{ letters() }}</span>
    }
  `,
  styles: `
    :host {
      display: grid; place-items: center; flex-shrink: 0; overflow: hidden; border-radius: 50%;
      background: linear-gradient(145deg, #2c2c2c, #1a1a1a); border: 1px solid var(--c-border);
      color: var(--c-accent); font-family: var(--font-display);
    }
    img { width: 100%; height: 100%; object-fit: cover; }
  `,
  host: {
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-size.px]': 'size() * 0.34',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly image = input<ImageRef | null | undefined>(null);
  readonly size = input(96);
  protected readonly letters = computed(() => initials(this.name()));
}
