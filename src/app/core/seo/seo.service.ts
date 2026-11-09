import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../config/site.config';
import { DEFAULT_LANG, LANGS, LANG_INFO, Lang, localizePath } from '../i18n/i18n.config';
import { I18n } from '../i18n/i18n.service';
import { breadcrumbLd, Crumb } from './json-ld';
import { absoluteUrl } from './url';

export interface PageSeo {
  /** Titre de la page, sans le suffixe « | GLAMRO ». */
  title: string;
  description: string;
  /** Chemin canonique SANS préfixe de langue, ex. « /servizi/capelli ». */
  path: string;
  noindex?: boolean;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  /** Fil d'Ariane (chemins sans préfixe) : ajoute un BreadcrumbList JSON-LD. */
  breadcrumbs?: Crumb[];
  jsonLd?: object[];
  /** Titre complet sans suffixe (homepage). */
  rawTitle?: boolean;
  /** Langue du canonical si le contenu principal n'existe que dans une langue (documents légaux). */
  canonicalLang?: Lang;
}

/**
 * Met à jour title, description, robots, canonical, hreflang, Open Graph, Twitter et JSON-LD.
 * Appelé par chaque page : en SSR tout est présent dans le HTML initial (brief §9).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(I18n);

  set(page: PageSeo): void {
    const lang = this.i18n.lang();
    const url = absoluteUrl(localizePath(page.path, lang));
    const canonical = absoluteUrl(localizePath(page.path, page.canonicalLang ?? lang));
    const fullTitle = page.rawTitle ? page.title : `${page.title} | ${SITE.name}`;
    const image = absoluteUrl(page.image ?? SITE.defaultOgImage);

    this.title.setTitle(fullTitle);
    this.tag('name', 'description', page.description);
    this.tag('name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');

    this.tag('property', 'og:site_name', SITE.name);
    this.tag('property', 'og:locale', LANG_INFO[lang].ogLocale);
    this.tag('property', 'og:type', page.type ?? 'website');
    this.tag('property', 'og:title', fullTitle);
    this.tag('property', 'og:description', page.description);
    this.tag('property', 'og:url', url);
    this.tag('property', 'og:image', image);
    this.tag('name', 'twitter:card', 'summary_large_image');
    this.tag('name', 'twitter:title', fullTitle);
    this.tag('name', 'twitter:description', page.description);
    this.tag('name', 'twitter:image', image);

    this.setCanonical(canonical);
    this.setAlternates(page.noindex || page.canonicalLang ? null : page.path);

    const jsonLd = [...(page.jsonLd ?? [])];
    if (page.breadcrumbs?.length) {
      jsonLd.push(breadcrumbLd(page.breadcrumbs, lang));
    }
    this.setJsonLd(jsonLd);
  }

  private tag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /** <link rel="alternate" hreflang="…"> pour chaque langue + x-default (italien). */
  private setAlternates(path: string | null): void {
    this.doc.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    if (path === null) {
      return;
    }
    const entries: [string, string][] = [
      ...LANGS.map((l): [string, string] => [l, absoluteUrl(localizePath(path, l))]),
      ['x-default', absoluteUrl(localizePath(path, DEFAULT_LANG))],
    ];
    for (const [hreflang, href] of entries) {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.doc.head.appendChild(link);
    }
  }

  private setJsonLd(items: object[]): void {
    this.doc.head.querySelectorAll('script[data-seo="jsonld"]').forEach((el) => el.remove());
    if (!items.length) {
      return;
    }
    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo', 'jsonld');
    const payload = items.length === 1 ? items[0] : { '@context': 'https://schema.org', '@graph': items };
    // Échappe « < » pour qu'aucun contenu ne puisse fermer la balise script.
    script.textContent = JSON.stringify(payload).replace(/</g, '\\u003c');
    this.doc.head.appendChild(script);
  }
}
