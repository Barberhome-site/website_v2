import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../../core/consent/consent.service';
import { I18n } from '../../core/i18n/i18n.service';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { NotFoundView } from '../../shared/components/not-found-view/not-found-view';
import { RichTextPipe } from '../../shared/pipes/rich-text.pipe';
import { LEGAL_DOCS } from './legal-docs';
import { LEGAL_DRAFT } from './legal-types';

/**
 * Page légale générique (textes v3 générés depuis content/legal/*.md).
 * Le texte est en italien ; l'interface autour est traduite. En anglais, un avertissement l'indique
 * et le canonical pointe vers la page italienne, en attendant la traduction de courtoisie.
 */
@Component({
  selector: 'app-legal-page',
  imports: [RouterLink, NgTemplateOutlet, RichTextPipe, Breadcrumbs, NotFoundView],
  templateUrl: './legal-page.html',
  styles: `
    .notice { margin-top: 1.25rem; }
    .layout { display: grid; gap: 2.5rem; }
    @media (min-width: 1024px) {
      .layout { grid-template-columns: 240px minmax(0, 1fr); }
      .toc { position: sticky; top: calc(var(--header-h) + 1.5rem); align-self: start; }
    }
    .toc ul { list-style: none; padding-left: 0; margin: 0; font-size: .9375rem; }
    .toc a { display: inline-block; padding: .3rem 0; color: var(--c-muted); }
    .toc a:hover { color: var(--c-accent); }
    section { scroll-margin-top: calc(var(--header-h) + 1rem); }
    h3 { margin-top: 1.75rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPage {
  /** Clé du document, transmise par les données de la route (app.routes.ts) : 'termini', 'privacy'… */
  readonly doc = input<string>('');

  protected readonly consent = inject(ConsentService);
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(SeoService);

  protected readonly draft = LEGAL_DRAFT;
  protected readonly document = computed(() => (Object.hasOwn(LEGAL_DOCS, this.doc()) ? LEGAL_DOCS[this.doc()] : null));
  protected readonly isItalian = computed(() => this.i18n.lang() === 'it');

  protected readonly crumbs = computed(() => {
    const d = this.document();
    return [{ label: this.i18n.d().common.home, path: '/' }, ...(d ? [{ label: d.title, path: `/${d.key}` }] : [])];
  });

  constructor() {
    effect(() => {
      const d = this.document();
      if (!d) {
        return;
      }
      this.seo.set({
        title: d.title,
        description: d.description,
        path: `/${d.key}`,
        breadcrumbs: this.crumbs(),
        // Le texte n'existe qu'en italien : canonical vers la version italienne.
        canonicalLang: 'it',
      });
    });
  }
}
