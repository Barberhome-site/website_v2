import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizePathPipe } from '../../../core/i18n/i18n.pipes';
import { I18n } from '../../../core/i18n/i18n.service';
import { ServiceCategory } from '../../../core/models/glamro.models';
import { Media } from '../media/media';

/** Carte catégorie de service, liée à sa page /servizi/:slug. */
@Component({
  selector: 'app-service-card',
  imports: [RouterLink, Media, LocalizePathPipe],
  template: `
    @let s = service();
    <app-media ratio="4 / 3" [src]="s.image?.src" [alt]="s.image?.alt ?? ''" icon="scissors"
               sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 90vw" />
    <div class="sc__body">
      <h3 class="sc__title">
        <a [routerLink]="['/servizi', s.slug] | lp: i18n.lang()">{{ s.professionalLabel }}</a>
      </h3>
      <p class="sc__desc">{{ s.shortDescription }}</p>
    </div>
  `,
  styles: `
    :host {
      position: relative; display: flex; flex-direction: column; border-radius: var(--radius-m); overflow: hidden;
      background: var(--c-card); border: 1px solid var(--c-border);
      transition: border-color var(--dur) var(--ease);
    }
    :host(:hover), :host(:focus-within) { border-color: var(--c-border-strong); }
    .sc__body { padding: 1rem 1.15rem 1.25rem; }
    .sc__title { margin: 0 0 .25rem; font-size: 1.15rem; font-weight: 700; }
    .sc__title a { text-decoration: none; }
    .sc__title a::after { content: ''; position: absolute; inset: 0; }
    .sc__desc { margin: 0; color: var(--c-muted); font-size: .9375rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCard {
  readonly service = input.required<ServiceCategory>();
  protected readonly i18n = inject(I18n);
}
