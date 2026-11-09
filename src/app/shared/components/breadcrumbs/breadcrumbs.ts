import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizePathPipe } from '../../../core/i18n/i18n.pipes';
import { I18n } from '../../../core/i18n/i18n.service';
import { Crumb } from '../../../core/seo/json-ld';

/** Fil d'Ariane visible (le JSON-LD BreadcrumbList est ajouté par SeoService). */
@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, LocalizePathPipe],
  template: `
    <nav [attr.aria-label]="i18n.d().common.breadcrumb">
      <ol role="list">
        @for (item of items(); track item.path; let last = $last) {
          <li>
            @if (last) {
              <span aria-current="page">{{ item.label }}</span>
            } @else {
              <a [routerLink]="item.path | lp: i18n.lang()">{{ item.label }}</a>
              <span class="sep" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    ol { display: flex; flex-wrap: wrap; gap: .25rem .5rem; font-size: var(--fs-small); color: var(--c-muted); margin-bottom: 1.25rem; }
    li { display: inline-flex; gap: .5rem; align-items: center; }
    a { color: var(--c-muted); min-height: 24px; display: inline-flex; align-items: center; }
    a:hover { color: var(--c-accent); }
    [aria-current] { color: var(--c-text); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  readonly items = input.required<Crumb[]>();
  protected readonly i18n = inject(I18n);
}
