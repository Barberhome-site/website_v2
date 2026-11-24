import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { SITE } from '../../core/config/site.config';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { faqLd } from '../../core/seo/json-ld';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { Icon, IconName } from '../../shared/components/icon/icon';
import { Media } from '../../shared/components/media/media';
import { StoreButtons } from '../../shared/components/store-buttons/store-buttons';

/**
 * Sezione professionisti (GLAMRO Pro): requisiti, funzionamento, costi, pagamenti, puntualità,
 * assistenza e ingresso in piattaforma.
 */
@Component({
  selector: 'app-for-professionals-page',
  imports: [RouterLink, LocalizePathPipe, Breadcrumbs, FaqList, Icon, Media, StoreButtons],
  templateUrl: './for-professionals-page.html',
  styles: `
    .hero-pro { display: grid; gap: 2rem; align-items: center; }
    @media (min-width: 960px) { .hero-pro { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); } }
    .hero-pro app-media { border-radius: var(--radius-l); }
    .pro-logo { display: block; width: 72px; height: 72px; border-radius: 16px; margin-bottom: 1rem; }
    .pro-app { scroll-margin-top: calc(var(--header-h) + 1rem); }
    .pro-app .cta-row { margin-top: 1rem; }
    .apply-steps { counter-reset: step; display: grid; gap: 1rem; }
    .apply-steps li { counter-increment: step; display: flex; gap: 1rem; align-items: flex-start; }
    .apply-steps li::before {
      content: counter(step); flex-shrink: 0; display: grid; place-items: center; width: 2.25rem; height: 2.25rem;
      border-radius: 50%; background: var(--c-accent); color: var(--c-on-accent); font-weight: 800;
    }
    .info-card h3 { display: flex; align-items: center; gap: .6rem; margin-bottom: .5rem; }
    .info-card app-icon { color: var(--c-accent); width: 1.5rem; height: 1.5rem; }
    .info-card p { margin: 0; color: var(--c-muted); }
    .pro-app { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--c-border); }
    .pro-app h3 { margin-bottom: .35rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForProfessionalsPage {
  private readonly analytics = inject(AnalyticsService);
  protected readonly i18n = inject(I18n);
  protected readonly crumbs = [
    { label: this.i18n.d().common.home, path: '/' },
    { label: this.i18n.d().nav.pros, path: '/per-professionisti' },
  ];
  protected readonly site = SITE;

  /** Ancres et icônes (identiques dans toutes les langues), textes dans `pro.topics`. */
  protected readonly topicIds = ['requisiti', 'funzionamento', 'costi', 'pagamenti', 'puntualita', 'assistenza'];
  protected readonly topicIcons: IconName[] = ['shield', 'calendar', 'card', 'growth', 'calendar', 'headset'];

  constructor() {
    const t = this.i18n.d().pro;
    inject(SeoService).set({
      title: t.title,
      description: t.seoDescription,
      path: '/per-professionisti',
      breadcrumbs: this.crumbs,
      jsonLd: [faqLd(t.faqs)],
    });
  }

  /** WhatsApp con il messaggio precompilato per i professionisti. */
  protected readonly whatsappHref = computed(
    () => `${SITE.contact.whatsappUrl}?text=${encodeURIComponent(this.i18n.d().pro.join.whatsappMessage)}`,
  );

  /** Inizio dell'ingresso professionisti (evento analytics). */
  protected trackJoin(placement: string): void {
    this.analytics.track('start_application', { placement });
  }

  protected trackWhatsapp(): void {
    this.analytics.track('whatsapp_click', { placement: 'pro_page' });
  }
}
