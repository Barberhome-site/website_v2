import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { City, ServiceCategory } from '../../core/models/glamro.models';
import { SeoService } from '../../core/seo/seo.service';
import { asyncState } from '../../core/utils/async-state';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { Icon } from '../../shared/components/icon/icon';

type Field = 'firstName' | 'lastName' | 'email' | 'phone' | 'citySlug' | 'otherCity' | 'specialties' | 'experience' | 'hasVatNumber' | 'privacyAck';

function atLeastOne(control: AbstractControl<string[]>): ValidationErrors | null {
  return control.value?.length ? null : { required: true };
}

/** Formulaire de candidature : labels persistants, erreurs textuelles, autocomplete, message de succès. */
@Component({
  selector: 'app-application-page',
  imports: [ReactiveFormsModule, RouterLink, LocalizePathPipe, Breadcrumbs, Icon],
  templateUrl: './application-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly data = inject(GlamroDataSource);
  private readonly analytics = inject(AnalyticsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly i18n = inject(I18n);
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().nav.pros, path: '/per-professionisti' },
    { label: this.i18n.d().apply.crumb, path: '/per-professionisti/candidatura' },
  ];
  protected readonly services = asyncState<ServiceCategory[]>(this.data.getServices(), []);
  private readonly cities = asyncState<City[]>(this.data.getCities(), []);
  protected readonly activeCities = computed(() => this.cities().value.filter((c) => c.status === 'active'));

  protected readonly submitted = signal(false);
  protected readonly sending = signal(false);
  protected readonly result = signal<'idle' | 'success' | 'error'>('idle');
  private started = false;

  protected readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s]{7,16}$/)]],
    citySlug: ['', [Validators.required]],
    otherCity: [''],
    specialties: this.fb.control<string[]>([], [atLeastOne]),
    experience: ['', [Validators.required]],
    hasVatNumber: this.fb.control<boolean | null>(null, [Validators.required]),
    message: ['', [Validators.maxLength(2000)]],
    privacyAck: [false, [Validators.requiredTrue]],
  });

  constructor() {
    const t = this.i18n.d().apply;
    inject(SeoService).set({
      title: t.seoTitle,
      description: t.seoDescription,
      path: '/per-professionisti/candidatura',
      noindex: true,
      breadcrumbs: this.crumbs,
    });
  }

  protected showError(name: Field): boolean {
    const control = this.form.controls[name];
    return control.invalid && (this.submitted() || control.touched);
  }

  protected isSpecialtyChecked(slug: string): boolean {
    return this.form.controls.specialties.value.includes(slug);
  }

  protected toggleSpecialty(slug: string, checked: boolean): void {
    const control = this.form.controls.specialties;
    const current = control.value;
    control.setValue(checked ? [...current, slug] : current.filter((s) => s !== slug));
    control.markAsTouched();
  }

  protected onFirstInput(): void {
    if (!this.started) {
      this.started = true;
      this.analytics.track('start_application', { placement: 'application_form' });
    }
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const { privacyAck: _ack, ...application } = this.form.getRawValue();
    this.sending.set(true);
    this.result.set('idle');
    this.data.submitProfessionalApplication(application).subscribe({
      next: () => {
        this.sending.set(false);
        this.result.set('success');
        afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>('#app-result')?.focus(), {
          injector: this.injector,
        });
      },
      error: () => {
        this.sending.set(false);
        this.result.set('error');
      },
    });
  }
}
