import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { I18n } from '../../../core/i18n/i18n.service';
import { City, ServiceCategory } from '../../../core/models/glamro.models';
import { todayIso } from '../../../core/utils/dates';
import { isPostalCode, normalizeText } from '../../../core/utils/text';
import { Icon } from '../icon/icon';

export interface AvailabilitySearchInitial {
  location?: string | null;
  serviceSlug?: string | null;
  date?: string | null;
}

let nextId = 0;

function notInPast(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value < todayIso() ? { past: true } : null;
}

/**
 * Formulaire « Verifica la disponibilità » : ville ou CAP → service → date.
 * Redirige vers /disponibilita avec des paramètres lisibles. Événement : check_availability.
 */
@Component({
  selector: 'app-availability-search',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './availability-search.html',
  styleUrl: './availability-search.scss',
  host: { '[class.as--hero]': 'variant() === "hero"' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilitySearch {
  readonly cities = input<City[]>([]);
  readonly services = input<ServiceCategory[]>([]);
  readonly initial = input<AvailabilitySearchInitial | null>(null);
  readonly variant = input<'hero' | 'page'>('page');

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly id = `as-${nextId++}`;
  protected readonly i18n = inject(I18n);
  protected readonly minDate = todayIso();
  protected readonly submitted = signal(false);
  protected readonly activeCities = computed(() => this.cities().filter((c) => c.status === 'active'));

  protected readonly form = this.fb.group({
    location: ['', [Validators.required, Validators.minLength(2)]],
    service: [''],
    date: ['', [notInPast]],
  });

  constructor() {
    effect(() => {
      const init = this.initial();
      if (init) {
        this.form.patchValue(
          { location: init.location ?? '', service: init.serviceSlug ?? '', date: init.date ?? '' },
          { emitEvent: false },
        );
      }
    });
  }

  protected showError(name: 'location' | 'date'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (this.submitted() || control.touched);
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const { location, service, date } = this.form.getRawValue();
    const raw = location.trim();
    const queryParams: Record<string, string> = {};
    let locationType: 'cap' | 'city';
    let citySlug: string;

    if (isPostalCode(raw)) {
      locationType = 'cap';
      queryParams['cap'] = raw;
      citySlug = this.cities().find((c) => c.postalCodePrefixes.some((p) => raw.startsWith(p)))?.slug ?? 'unknown';
    } else {
      locationType = 'city';
      const needle = normalizeText(raw);
      const match = this.cities().find((c) => normalizeText(c.name) === needle || c.slug === needle);
      citySlug = match?.slug ?? needle.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      queryParams['citta'] = citySlug;
    }
    if (service) {
      queryParams['servizio'] = service;
    }
    if (date) {
      queryParams['data'] = date;
    }

    // Aucun CAP ni texte libre dans l'analytics : seulement le type et le slug reconnu.
    this.analytics.track('check_availability', {
      location_type: locationType,
      city_slug: this.cities().some((c) => c.slug === citySlug) ? citySlug : 'not_listed',
      service_slug: service || 'all',
      has_date: Boolean(date),
    });

    this.router.navigate([this.i18n.path('/disponibilita')], { queryParams });
  }
}
