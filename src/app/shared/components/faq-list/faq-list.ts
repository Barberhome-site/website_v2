import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Faq } from '../../../core/models/glamro.models';

/**
 * FAQ visibles : réponse courte immédiatement lisible (brief §11).
 * <details>/<summary> natifs : accessibles au clavier et lisibles sans JavaScript.
 */
@Component({
  selector: 'app-faq-list',
  template: `
    @for (faq of faqs(); track faq.question) {
      <details [open]="openFirst() && $first">
        <summary><span>{{ faq.question }}</span></summary>
        <p>{{ faq.answer }}</p>
      </details>
    }
  `,
  styles: `
    :host { display: block; border-top: 1px solid var(--c-border); }
    details { border-bottom: 1px solid var(--c-border); }
    summary {
      display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      min-height: 56px; padding: .9rem 0; cursor: pointer; font-weight: 600; list-style: none;
    }
    summary::-webkit-details-marker { display: none; }
    summary::after {
      content: ''; flex-shrink: 0; width: .6rem; height: .6rem; margin-right: .3rem;
      border-right: 2px solid var(--c-accent); border-bottom: 2px solid var(--c-accent);
      transform: rotate(45deg); transition: transform var(--dur) var(--ease);
    }
    details[open] summary::after { transform: rotate(-135deg); }
    summary:hover span { color: var(--c-accent); }
    p { margin: 0 0 1.1rem; color: var(--c-muted); max-width: 70ch; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqList {
  readonly faqs = input.required<Faq[]>();
  readonly openFirst = input(false);
}
