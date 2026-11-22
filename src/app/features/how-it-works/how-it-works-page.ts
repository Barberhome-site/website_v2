import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { Icon, IconName } from '../../shared/components/icon/icon';
import { StoreButtons } from '../../shared/components/store-buttons/store-buttons';

/** Ancres et icônes (identiques dans toutes les langues), textes dans le dictionnaire `how.stages`. */
const STAGE_IDS = ['ricerca', 'scelta', 'prenotazione', 'arrivo', 'pagamento', 'cancellazione', 'assistenza'];
const STAGE_ICONS: IconName[] = ['search', 'user', 'calendar', 'bike', 'card', 'clock', 'headset'];

@Component({
  selector: 'app-how-it-works-page',
  imports: [RouterLink, LocalizePathPipe, Breadcrumbs, FaqList, Icon, StoreButtons],
  template: `
    @let t = i18n.d().how;
    <div class="page-head">
      <div class="container">
        <app-breadcrumbs [items]="crumbs" />
        <h1>{{ t.title }}</h1>
        <p class="lead">{{ t.lead }}</p>
        <nav [attr.aria-label]="t.toc" class="toc">
          <ul role="list">
            @for (s of t.stages; track $index) {
              <li><a routerLink="." [fragment]="ids[$index]">{{ s.title }}</a></li>
            }
          </ul>
        </nav>
      </div>
    </div>

    <div class="container section">
      <ol role="list" class="stages">
        @for (s of t.stages; track $index; let i = $index) {
          <li [id]="ids[i]" class="stage">
            <div class="stage__icon"><app-icon [name]="icons[i]" [strokeWidth]="1.4" /></div>
            <div class="prose">
              <h2><span class="stage__num">{{ i + 1 }}.</span> {{ s.title }}</h2>
              <p><strong>{{ s.answer }}</strong></p>
              <p>{{ s.detail }}</p>
              @if (s.placeholder) {
                <p [class.placeholder]="s.placeholder.startsWith('[')">{{ s.placeholder }}</p>
              }
            </div>
          </li>
        }
      </ol>

      <div class="cta-row">
        <a class="btn btn--primary" [routerLink]="'/disponibilita' | lp: i18n.lang()">{{ i18n.d().cta.primary }}</a>
        <app-store-buttons placement="how_it_works" />
      </div>
    </div>

    <section class="container section section--tight" aria-labelledby="faq-title">
      <h2 id="faq-title">{{ i18n.d().common.faq }}</h2>
      <app-faq-list [faqs]="t.faqs" />
    </section>
  `,
  styles: `
    .toc ul { display: flex; flex-wrap: wrap; gap: .25rem 1.25rem; margin-top: 1.5rem; }
    .toc a { display: inline-flex; min-height: 44px; align-items: center; font-size: .9375rem; color: var(--c-muted); }
    .stages { display: grid; gap: 2.5rem; margin-bottom: 2.5rem; }
    .stage { display: grid; grid-template-columns: auto 1fr; gap: 1.25rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--c-border); }
    .stage__icon { display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--c-card); border: 1px solid var(--c-border); }
    .stage__icon app-icon { width: 1.75rem; height: 1.75rem; color: var(--c-accent); }
    .stage h2 { margin-top: .5rem; }
    .stage__num { color: var(--c-accent); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksPage {
  protected readonly i18n = inject(I18n);
  protected readonly ids = STAGE_IDS;
  protected readonly icons = STAGE_ICONS;
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().nav.how, path: '/come-funziona' },
  ];

  constructor() {
    const t = this.i18n.d();
    inject(SeoService).set({
      title: t.nav.how,
      description: t.how.seoDescription,
      path: '/come-funziona',
      breadcrumbs: this.crumbs,
    });
  }
}
