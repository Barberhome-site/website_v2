import { Routes } from '@angular/router';
import { i18nResolver } from './core/i18n/i18n.resolver';
import { Lang, PREFIXED_LANGS } from './core/i18n/i18n.config';
import { routePath } from './core/i18n/route-slugs';
import { cityResolver, professionalResolver, serviceResolver } from './core/routing/resolvers';
import { LEGAL_DOC_KEYS } from './features/legal/legal-types';

/**
 * Pages du site (brief §4). Chargées à la demande.
 * Les chemins sont écrits en italien et traduits par langue (core/i18n/route-slugs.ts) :
 * 'servizi/:slug' devient 'services/:slug' en anglais, 'leistungen/:slug' en allemand…
 * Chaque langue a sa propre configuration : changer de langue recrée la page
 * (titre, SEO et données rechargés dans la nouvelle langue).
 */
function pageRoutes(lang: Lang): Routes {
  const p = (canonical: string) => routePath(canonical, lang);
  return [
    {
      path: '',
      pathMatch: 'full',
      loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
    },
    {
      path: p('servizi'),
      loadComponent: () => import('./features/services/services-page').then((m) => m.ServicesPage),
    },
    {
      path: p('servizi/:slug'),
      resolve: { service: serviceResolver },
      loadComponent: () => import('./features/services/service-detail-page').then((m) => m.ServiceDetailPage),
    },
    {
      path: p('dove-siamo'),
      loadComponent: () => import('./features/cities/cities-page').then((m) => m.CitiesPage),
    },
    {
      path: p('dove-siamo/:citySlug'),
      resolve: { city: cityResolver },
      loadComponent: () => import('./features/cities/city-detail-page').then((m) => m.CityDetailPage),
    },
    {
      path: p('disponibilita'),
      loadComponent: () => import('./features/availability/availability-page').then((m) => m.AvailabilityPage),
    },
    {
      path: p('professionisti/:id'),
      resolve: { professional: professionalResolver },
      loadComponent: () => import('./features/professional/professional-page').then((m) => m.ProfessionalPage),
    },
    {
      path: p('come-funziona'),
      loadComponent: () => import('./features/how-it-works/how-it-works-page').then((m) => m.HowItWorksPage),
    },
    {
      path: p('fiducia'),
      loadComponent: () => import('./features/trust/trust-page').then((m) => m.TrustPage),
    },
    {
      path: p('assistenza'),
      loadComponent: () => import('./features/support/support-page').then((m) => m.SupportPage),
    },
    {
      path: p('per-professionisti'),
      loadComponent: () =>
        import('./features/for-professionals/for-professionals-page').then((m) => m.ForProfessionalsPage),
    },
    {
      path: p('per-professionisti/candidatura'),
      loadComponent: () => import('./features/for-professionals/application-page').then((m) => m.ApplicationPage),
    },
    {
      path: p('chi-siamo'),
      loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
    },
    // Pages légales (textes v3) : la clé du document arrive au composant par `data` (input `doc`).
    ...LEGAL_DOC_KEYS.map((doc) => ({
      path: p(doc),
      data: { doc },
      loadComponent: () => import('./features/legal/legal-page').then((m) => m.LegalPage),
    })),
    {
      path: '**',
      loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
    },
  ];
}

export const routes: Routes = [
  // /en/…, /fr/…, /es/…, /de/…
  ...PREFIXED_LANGS.map((lang) => ({
    path: lang,
    data: { lang },
    resolve: { i18n: i18nResolver },
    children: pageRoutes(lang),
  })),
  // Italien (langue par défaut) à la racine
  {
    path: '',
    data: { lang: 'it' },
    resolve: { i18n: i18nResolver },
    children: pageRoutes('it'),
  },
];
