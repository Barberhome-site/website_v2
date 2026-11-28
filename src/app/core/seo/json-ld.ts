/**
 * Générateurs de données structurées schema.org (brief §10).
 * Règle : ne décrire que des données réelles et visibles sur la page.
 * Jamais d'AggregateRating ni de Review tant qu'il n'y a pas d'avis réels (brief du 28/11/2026).
 * Les URL sont produites dans la langue de la page.
 */
import { SITE } from '../config/site.config';
import { LANGS, LANG_INFO, Lang, localizePath } from '../i18n/i18n.config';
import { City, Faq, ProfessionalProfile, ProfessionalSummary, ServiceCategory } from '../models/glamro.models';
import { absoluteUrl } from './url';

export interface Crumb {
  label: string;
  /** Chemin sans préfixe de langue. */
  path: string;
}

const CONTEXT = 'https://schema.org';

const url = (path: string, lang: Lang) => absoluteUrl(localizePath(path, lang));

/** Organization complète : identité légale, adresse, contacts, réseaux sociaux et fiches des apps. */
export function organizationLd(slogan: string): object {
  const { company, contact, apps } = SITE;
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: SITE.name,
    legalName: company.legalName,
    url: absoluteUrl('/'),
    logo: absoluteUrl(SITE.logo.src),
    slogan,
    vatID: `IT${company.vatNumber}`,
    email: contact.email,
    telephone: contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.streetAddress,
      postalCode: company.postalCode,
      addressLocality: company.locality,
      addressRegion: company.region,
      addressCountry: 'IT',
    },
    sameAs: [
      ...SITE.social.map((s) => s.url),
      apps.client.appStoreUrl,
      apps.client.playStoreUrl,
      apps.pro.appStoreUrl,
      apps.pro.playStoreUrl,
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: contact.email,
        telephone: contact.phone,
        availableLanguage: [...LANGS],
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
    // Recherche par ville sur la page « Verifica la disponibilità » (?citta=milano).
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${url('/disponibilita', lang)}?citta={city}` },
      'query-input': 'required name=city',
    },
  };
}

/** FAQPage : uniquement les questions affichées sur la page. */
export function faqLd(faqs: readonly Faq[]): object {
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

/** Profil : ProfessionalService avec le nom public (pseudo ou « Prénom I. »), sans avis ni note. */
export function professionalLd(pro: ProfessionalProfile, lang: Lang): object {
  return {
    '@context': CONTEXT,
    '@type': 'ProfessionalService',
    name: pro.displayName,
    description: pro.specialtyLabel,
    url: url(pro.profileUrl, lang),
    ...(pro.profileImage?.src ? { image: pro.profileImage.src } : {}),
    areaServed: { '@type': 'City', name: pro.cityName },
    // Pas d'adresse : le professionnel se déplace chez le client (jamais de position précise).
    provider: { '@id': absoluteUrl('/#organization') },
    makesOffer: pro.services
      .filter((s) => s.priceFrom != null)
      .map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name },
        // Prix « da … » affiché sur la page : prix minimum, total payé par le client.
        priceSpecification: { '@type': 'PriceSpecification', minPrice: s.priceFrom, priceCurrency: s.currency ?? 'EUR' },
      })),
  };
}
