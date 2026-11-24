/**
 * Générateurs de données structurées schema.org (brief §10).
 * Règle : ne décrire que des données réelles et visibles sur la page.
 * Les URL sont produites dans la langue de la page.
 */
import { SITE } from '../config/site.config';
import { LANG_INFO, Lang, localizePath } from '../i18n/i18n.config';
import { City, ProfessionalProfile, ProfessionalSummary, ServiceCategory } from '../models/glamro.models';
import { absoluteUrl } from './url';

export interface Crumb {
  label: string;
  /** Chemin sans préfixe de langue. */
  path: string;
}

const CONTEXT = 'https://schema.org';

const url = (path: string, lang: Lang) => absoluteUrl(localizePath(path, lang));

/** Organization completa: indirizzo, telefono, email, P.IVA, social e store. */
export function organizationLd(slogan: string): object {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: SITE.name,
    legalName: SITE.company.legalName,
    url: absoluteUrl('/'),
    logo: absoluteUrl(SITE.logo.src),
    slogan,
    email: SITE.contact.email,
    telephone: SITE.contact.phone,
    vatID: `IT${SITE.company.vatNumber}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.company.streetAddress,
      postalCode: SITE.company.postalCode,
      addressLocality: SITE.company.locality,
      addressRegion: SITE.company.region,
      addressCountry: 'IT',
    },
    sameAs: [
      ...SITE.social.map((s) => s.url),
      SITE.apps.client.appStoreUrl,
      SITE.apps.client.playStoreUrl,
      SITE.apps.pro.appStoreUrl,
      SITE.apps.pro.playStoreUrl,
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE.contact.email,
        telephone: SITE.contact.phone,
        availableLanguage: ['it', 'en'],
      },
    ],
  };
}

/** FAQPage: solo domande e risposte realmente visibili nella pagina. */
export function faqLd(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function websiteLd(lang: Lang): object {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: SITE.name,
    url: url('/', lang),
    inLanguage: LANG_INFO[lang].locale,
    publisher: { '@id': absoluteUrl('/#organization') },
  };
}

export function breadcrumbLd(items: Crumb[], lang: Lang): object {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: url(item.path, lang),
    })),
  };
}

/** Service : areaServed uniquement pour les villes réellement couvertes. */
export function serviceLd(service: ServiceCategory, activeCities: City[], name: string, lang: Lang): object {
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    name,
    serviceType: service.name,
    description: service.intro,
    url: url(`/servizi/${service.slug}`, lang),
    inLanguage: LANG_INFO[lang].locale,
    provider: { '@id': absoluteUrl('/#organization') },
    areaServed: activeCities.map((c) => ({ '@type': 'City', name: c.name })),
  };
}

export function cityPageLd(
  city: City,
  services: ServiceCategory[],
  pros: ProfessionalSummary[],
  name: string,
  lang: Lang,
): object {
  return {
    '@context': CONTEXT,
    '@type': 'CollectionPage',
    name,
    url: url(`/dove-siamo/${city.slug}`, lang),
    inLanguage: LANG_INFO[lang].locale,
    dateModified: city.updatedAt,
    about: { '@type': 'City', name: city.name },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        ...services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.name,
          url: url(`/servizi/${s.slug}`, lang),
        })),
        ...pros.map((p, i) => ({
          '@type': 'ListItem',
          position: services.length + i + 1,
          name: p.displayName,
          url: url(p.profileUrl, lang),
        })),
      ],
    },
  };
}

/**
 * Profilo come ProfessionalService, con il nome pubblico del profilo.
 * Mai AggregateRating o Review finché non ci sono recensioni vere (prompt di correzione, punto 10.5).
 */
export function professionalLd(pro: ProfessionalProfile, lang: Lang): object {
  return {
    '@context': CONTEXT,
    '@type': 'ProfessionalService',
    name: pro.displayName,
    description: pro.specialtyLabel,
    url: url(pro.profileUrl, lang),
    areaServed: { '@type': 'City', name: pro.cityName },
    knowsAbout: pro.skills,
  };
}
