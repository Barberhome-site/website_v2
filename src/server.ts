import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { buildSitemapXml } from './server/sitemap';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * En-têtes de sécurité de base (brief §17 : CSP et gestion sûre des scripts tiers).
 * La CSP liste uniquement les domaines réellement utilisés :
 *  - Google Analytics (chargé seulement après consentement)
 *  - Trustpilot (widget, chargé seulement après consentement)
 *  - LFMaps / OpenFreeMap (style, tuiles vectorielles, polices et sprites de la carte)
 *  - MapLibre : worker auto-hébergé (worker-src 'self'), images des sprites décodées en blob:
 * À compléter quand l'URL de l'API sera connue (connect-src).
 */
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://widget.trustpilot.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.google-analytics.com https://*.trustpilot.com https://*.trustpilot.net",
      "font-src 'self'",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.trustpilot.com https://data.lfmaps.fr https://tiles.openfreemap.org",
      "worker-src 'self'",
      "frame-src https://widget.trustpilot.com",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );
  next();
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
