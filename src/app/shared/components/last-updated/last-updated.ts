import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18n } from '../../../core/i18n/i18n.service';

/** « Ultimo aggiornamento : … » — pages villes, FAQ, documents légaux (brief §11). */
@Component({
  selector: 'app-last-updated',
  template: `{{ i18n.d().common.updated }}: <time [attr.datetime]="date()">{{ formatted() }}</time>`,
  styles: `:host { display: block; font-size: var(--fs-small); color: var(--c-muted); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastUpdated {
  readonly date = input.required<string>();
  protected readonly i18n = inject(I18n);
  protected readonly formatted = computed(() => this.i18n.formatDate(this.date()));
}
