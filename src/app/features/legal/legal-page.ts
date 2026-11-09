import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../../core/consent/consent.service';
import { COOKIE_INVENTORY } from '../../core/consent/cookie-inventory';
import { FormatPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { canonicalSlug } from '../../core/i18n/route-slugs';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { LastUpdated } from '../../shared/components/last-updated/last-updated';
import { NotFoundView } from '../../shared/components/not-found-view/not-found-view';
import { LEGAL_DOCS } from './legal-docs';

/**
 * Page légale générique : version, date d'efficacité, sommaire, sections, versions archivées.
 * Le CORPS des documents est en italien (texte de référence soumis au conseil juridique) ;
 * l'interface autour est traduite. Hors italien, le canonical pointe vers la version italienne.
 */
@Component({
  selector: 'app-legal-page',
  imports: [RouterLink, FormatPipe, Breadcrumbs, LastUpdated, NotFoundView],
  templateUrl: './legal-page.html',
  styles: `
    .meta { display: flex; flex-wrap: wrap; gap: .25rem 1.5rem; font-size: var(--fs-small); color: var(--c-muted); }
    .notice { margin-top: 1.25rem; }
    .layout { display: grid; gap: 2.5rem; }
    @media (min-width: 1024px) { .layout { grid-template-columns: 240px minmax(0, 1fr); } .toc { position: sticky; top: calc(var(--header-h) + 1.5rem); align-self: start; } }
    .toc ol { padding-left: 1.2rem; margin: 0; font-size: .9375rem; }
    .toc a { display: inline-block; padding: .3rem 0; color: var(--c-muted); }
    .toc a:hover { color: var(--c-accent); }
    section { scroll-margin-top: calc(var(--header-h) + 1rem); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPage {
  /** Paramètre de route :doc, dans la langue de l'URL (« confidentialite » en français). */
  readonly doc = input<string>('');

  protected readonly consent = inject(ConsentService);
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(SeoService);

  protected readonly document = computed(() => {
    const key = canonicalSlug('legal', this.doc(), this.i18n.lang());
    return Object.hasOwn(LEGAL_DOCS, key) ? LEGAL_DOCS[key] : null;
  });
  protected readonly inventory = COOKIE_INVENTORY;
  protected readonly isItalian = computed(() => this.i18n.lang() === 'it');

  protected readonly crumbs = computed(() => {
    const d = this.document();
    return [{ label: this.i18n.d().common.home, path: '/' }, ...(d ? [{ label: d.title, path: `/legale/${d.key}` }] : [])];
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
        path: `/legale/${d.key}`,
        breadcrumbs: this.crumbs(),
        // Le texte n'existe qu'en italien : canonical vers la version italienne.
        canonicalLang: 'it',
      });
    });
  }
}
