import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizePathPipe } from '../../../core/i18n/i18n.pipes';
import { I18n } from '../../../core/i18n/i18n.service';
import { Icon, IconName } from '../icon/icon';

/** Le tre garanzie verificabili di GLAMRO. Textes : dictionnaire `pillars`. */
@Component({
  selector: 'app-trust-pillars',
  imports: [RouterLink, Icon, LocalizePathPipe],
  template: `
    <ul role="list" class="pillars">
      @for (p of i18n.d().pillars; track $index) {
        <li>
          <app-icon [name]="icons[$index]" [strokeWidth]="1.5" />
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
          <a [routerLink]="'/fiducia' | lp: i18n.lang()" [fragment]="fragments[$index]" class="small">
            {{ i18n.d().common.learnMore }}<span class="visually-hidden">: {{ p.title }}</span>
          </a>
        </li>
      }
    </ul>
  `,
  styles: `
    .pillars { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); }
    li { padding: 1.25rem; border: 1px solid var(--c-border); border-radius: var(--radius-m); background: var(--c-bg); text-align: center; }
    app-icon { width: 2.25rem; height: 2.25rem; margin: 0 auto .75rem; color: var(--c-text); }
    h3 { font-size: 1rem; font-weight: 700; margin-bottom: .35rem; }
    p { color: var(--c-muted); font-size: .9375rem; margin-bottom: .5rem; }
    a { display: inline-flex; min-height: 44px; align-items: center; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustPillars {
  protected readonly i18n = inject(I18n);
  protected readonly icons: IconName[] = ['shield', 'card', 'headset'];
  protected readonly fragments = ['verifica', 'pagamenti', 'assistenza'];
}
