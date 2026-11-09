import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { SITE } from '../../core/config/site.config';
import { LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { Icon, IconName } from '../../shared/components/icon/icon';
import { Media } from '../../shared/components/media/media';

/**
 * Parcours professionnel autonome (brief §3) : exigences, fonctionnement, coûts, paiements,
 * responsabilités, assistance et candidature. « Lavora con noi » reste réservé aux postes internes.
 */
@Component({
  selector: 'app-for-professionals-page',
  imports: [RouterLink, LocalizePathPipe, Breadcrumbs, FaqList, Icon, Media],
  templateUrl: './for-professionals-page.html',
  styles: `
    .hero-pro { display: grid; gap: 2rem; align-items: center; }
    @media (min-width: 960px) { .hero-pro { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); } }
    .hero-pro app-media { border-radius: var(--radius-l); }
    .apply-steps { counter-reset: step; display: grid; gap: 1rem; }
    .apply-steps li { counter-increment: step; display: flex; gap: 1rem; align-items: flex-start; }
    .apply-steps li::before {
      content: counter(step); flex-shrink: 0; display: grid; place-items: center; width: 2.25rem; height: 2.25rem;
      border-radius: 50%; background: var(--c-accent); color: var(--c-on-accent); font-weight: 800;
    }
    .info-card h3 { display: flex; align-items: center; gap: .6rem; margin-bottom: .5rem; }
    .info-card app-icon { color: var(--c-accent); width: 1.5rem; height: 1.5rem; }
    .info-card p { margin: 0; color: var(--c-muted); }
    .info-card .placeholder { margin-top: .5rem; font-size: var(--fs-small); font-style: italic; color: #8d8d88; }
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
  protected readonly topicIds = ['requisiti', 'funzionamento', 'costi', 'pagamenti', 'responsabilita', 'assistenza'];
  protected readonly topicIcons: IconName[] = ['shield', 'calendar', 'card', 'growth', 'user', 'headset'];

  constructor() {
    const t = this.i18n.d().pro;
    inject(SeoService).set({ title: t.title, description: t.seoDescription, path: '/per-professionisti', breadcrumbs: this.crumbs });
  }

  protected trackApply(placement: string): void {
    this.analytics.track('start_application', { placement });
  }
}
