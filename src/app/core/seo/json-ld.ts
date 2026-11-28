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

export function organizationLd(slogan: string): object {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: SITE.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl(SITE.logo.src),
    slogan,
    sameAs: SITE.social.map((s) => s.url),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE.contact.email,
        telephone: SITE.contact.phone,
        availableLanguage: ['it', 'en', 'fr', 'es', 'de'],
      },
    ],
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

/** Person + aggregateRating seulement si les avis sont réels, visibles et présents. */
export function professionalLd(pro: ProfessionalProfile, lang: Lang): object {
  const ld: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'Person',
    name: pro.displayName,
    jobTitle: pro.specialtyLabel,
    url: url(pro.profileUrl, lang),
    areaServed: { '@type': 'City', name: pro.cityName },
    knowsAbout: pro.skills,
  };
  if (pro.reviewSummary && pro.reviewSummary.count > 0 && pro.reviews.length > 0) {
    ld['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: pro.reviewSummary.average,
      reviewCount: pro.reviewSummary.count,
      bestRating: 5,
    };
  }
  return ld;
}
