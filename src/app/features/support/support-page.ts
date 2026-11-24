import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { SITE } from '../../core/config/site.config';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { faqLd } from '../../core/seo/json-ld';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { Icon } from '../../shared/components/icon/icon';
import { LastUpdated } from '../../shared/components/last-updated/last-updated';

@Component({
  selector: 'app-support-page',
  imports: [ReactiveFormsModule, RouterLink, LocalizePathPipe, Breadcrumbs, FaqList, Icon, LastUpdated],
  templateUrl: './support-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly data = inject(GlamroDataSource);
  private readonly analytics = inject(AnalyticsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly i18n = inject(I18n);
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().support.title, path: '/assistenza' },
  ];
  protected readonly site = SITE;
  protected readonly submitted = signal(false);
  protected readonly sending = signal(false);
  protected readonly result = signal<'idle' | 'success' | 'error'>('idle');
  private started = false;

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    topic: ['', [Validators.required]],
    bookingReference: [''],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
  });

  constructor() {
    const t = this.i18n.d().support;
    inject(SeoService).set({
      title: t.seoTitle,
      description: t.seoDescription,
      path: '/assistenza',
      breadcrumbs: this.crumbs,
      jsonLd: [faqLd([...t.clientFaqs, ...t.proFaqs])],
    });
  }

  protected showError(name: 'name' | 'email' | 'topic' | 'bookingReference' | 'message'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (this.submitted() || control.touched);
  }

  protected onFirstInput(): void {
    if (!this.started) {
      this.started = true;
      this.analytics.track('support_click', { channel: 'contact_form', placement: 'support_page' });
    }
  }

  protected trackEmail(): void {
    this.analytics.track('support_click', { channel: 'email', placement: 'support_page' });
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('#contatti [aria-invalid="true"]')?.focus();
      return;
    }
    this.sending.set(true);
    this.result.set('idle');
    this.data.submitSupportRequest(this.form.getRawValue()).subscribe({
      next: () => {
        this.sending.set(false);
        this.result.set('success');
        this.form.reset();
        this.submitted.set(false);
      },
      error: () => {
        this.sending.set(false);
        this.result.set('error');
      },
    });
  }
}
