import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { DEFAULT_LANG, localizePath } from './app/core/i18n/i18n.config';
import { readLangCookie } from './app/core/i18n/lang-cookie';
import { legacyRedirect } from './server/legacy-redirects';
import { buildSitemapXml } from './server/sitemap';
import { handleSiteApi, siteApi } from './server/site-api';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * En-têtes de sécurité de base (brief §17 : CSP et gestion sûre des scripts tiers).
 * La CSP liste uniquement les domaines réellement utilisés :
 *  - Google Analytics (chargé seulement après consentement)
 *  - OpenFreeMap (style, tuiles vectorielles, polices et sprites de la carte)
 *  - MapLibre : worker auto-hébergé (worker-src 'self'), images des sprites décodées en blob:
 * À compléter quand l'URL de l'API sera connue (connect-src).
 */
/**
 * Origines des photos des professionnels (bucket S3 du backend). La variable SITE_MEDIA_ORIGINS
 * (domaines séparés par des espaces) permet d'en ajouter, par exemple un CDN plus tard.
 */
const MEDIA_ORIGINS = process.env['SITE_MEDIA_ORIGINS'] || 'https://glamro.s3.eu-south-1.amazonaws.com';

/**
 * Domaines de test : aucune indexation sur *.vercel.app, y compris pour les pages rendues par le serveur
 * et les redirections (vercel.json pose le même en-tête sur les fichiers statiques).
 */
app.use((req, res, next) => {
  if (/\.vercel\.app$/i.test(req.hostname)) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
});

/** Anciennes adresses (langues supprimées, site précédent, liens de l'app) : redirection 301. */
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next();
    return;
  }
  const target = legacyRedirect(req.path);
  if (target && target !== req.path) {
    const q = req.originalUrl.indexOf('?');
    res.redirect(301, target + (q >= 0 ? req.originalUrl.slice(q) : ''));
    return;
  }
  next();
});

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://www.google-analytics.com ${MEDIA_ORIGINS}`,
      "font-src 'self'",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://tiles.openfreemap.org",
      "worker-src 'self'",
      "frame-src",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );
  next();
});

/**
 * Données réelles pour le site (src/server/site-api) : le navigateur appelle /site-api,
 * le serveur interroge l'API GLAMRO, met en cache et renvoie seulement les champs affichés.
 */
app.get('/site-api/*path', async (req, res) => {
  const url = new URL(req.originalUrl, 'http://site.local');
  const result = await handleSiteApi(siteApi, url.pathname, url.searchParams);
  res
    .status(result.status)
    .set('Cache-Control', result.maxAge ? `public, max-age=${result.maxAge}, s-maxage=${result.maxAge}` : 'no-store')
    .json(result.body);
});

/** Sitemap générée côté serveur : seulement les URL canoniques publiées, avec lastmod réel. */
app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const xml = await buildSitemapXml();
    res.type('application/xml').set('Cache-Control', 'public, max-age=3600').send(xml);
  } catch (err) {
    next(err);
  }
});

/**
 * Page d'accueil italienne (`/`) : si le visiteur a choisi une autre langue (cookie glamro_lang),
 * on l'envoie vers la page d'accueil de cette langue. Seule `/` est concernée : un lien partagé
 * vers une autre page garde toujours sa langue. Les robots n'ont pas de cookie : rien ne change pour eux.
 */
app.get('/', (req, res, next) => {
  res.vary('Cookie');
  const lang = readLangCookie(req.headers.cookie);
  if (lang && lang !== DEFAULT_LANG) {
    res.set('Cache-Control', 'private, no-store');
    res.redirect(302, localizePath('/', lang));
    return;
  }
  next();
});

/** Fichiers statiques du dossier /browser. */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/** Toutes les autres requêtes sont rendues par Angular (SSR). */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

// Démarre si ce module est le point d'entrée, ou s'il est lancé par PM2.
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`GLAMRO SSR in ascolto su http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

/** Point d'entrée des plateformes serverless (Vercel : api/index.mjs). */
export default reqHandler;
