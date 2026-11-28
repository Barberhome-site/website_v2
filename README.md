# GLAMRO — site web (Angular 22, SSR)

Site vitrine et de réservation de GLAMRO, construit à partir du *Master Brief Sito Web GLAMRO 2026* (v. 2 octobre 2026).
Interface en italien et en anglais (fr, es, de supprimés le 28/11/2026, redirigés en 301), code commenté en français.

## Démarrer

Prérequis : Node.js 22.12+ (ou version supportée par Angular 22) et npm 11.

```bash
npm install          # génère package-lock.json (à committer)
npm start            # http://localhost:4200 (SSR actif aussi en dev)
npm test             # tests unitaires (Vitest)
npm run build        # build de production (SSR + pages pré-rendues)
npm run serve:ssr    # lance le serveur Node de production sur :4000
```

npm 11 signale les scripts d'installation de `esbuild`, `lmdb`, `msgpackr-extract` et `@parcel/watcher` :
ce sont des outils du build Angular. Les approuver avec `npm approve-scripts` (indispensable avant npm 12).

### Mise en production

- **Domaines autorisés pour le SSR** : `angular.json` → `build.options.security.allowedHosts`
  (actuellement `glamro.it`, `www.glamro.it`). Sans le bon domaine, Angular refuse le rendu serveur et
  repasse en rendu client : le SEO serait perdu. Ajouter ici tout domaine de préproduction.
- **URL publique** : `siteUrl` dans `src/environments/environment.ts` (canonical, sitemap, Open Graph).

## Architecture

```
src/
├── server.ts                    Serveur Express SSR + en-têtes de sécurité (CSP) + /sitemap.xml
├── server/sitemap.ts            Sitemap : uniquement URL canoniques publiées, lastmod réel
├── server/site-api/             /site-api : appels à l'API GLAMRO, cache, données minimales (voir plus bas)
├── environments/                siteUrl, useMockData, apiBaseUrl, balise Google (GTM-…)
├── styles/                      Système visuel du brief (couleurs, typo, boutons pilule 48 px, focus, formulaires)
└── app/
    ├── app.routes.ts            Arborescence (slugs italiens), une branche par langue
    ├── i18n/                    Dictionnaires : it.ts (référence), en.ts
    ├── app.routes.server.ts     Rendu par route : Prerender (pages stables) / Server (données live)
    ├── core/
    │   ├── models/              Modèles du domaine (contrat que l'API devra remplir)
    │   ├── data/                ★ Source des données : exemple (mock) ou réelles (/site-api)
    │   ├── content/             Contenu éditorial : catégories, villes suivies, traductions
    │   ├── seo/                 title, description, canonical, robots, Open Graph, JSON-LD
    │   ├── i18n/                Langue courante, pipes `lp` (liens) et `fmt` (paramètres), résolveur
    │   ├── booking/             Ouverture de la popup « Prenota »
    │   ├── consent/             CMP : bandeau, préférences, preuve et révocation du consentement
    │   ├── analytics/           GA4 chargé seulement après consentement, 8 événements du brief
    │   ├── config/site.config   Textes approuvés, navigation, réseaux, stores, images, données société
    │   └── routing/             Résolveurs (données avant affichage) + statut HTTP 404 en SSR
    ├── layout/                  Header, footer, sélecteur de langue, popup de réservation,
    │                            bandeau cookies, panneau « Gestisci cookie »
    ├── shared/components/       Recherche de disponibilité, carrousel, carte, cartes…
    └── features/                Pages : home, servizi, dove-siamo, disponibilita, professionisti,
                                 come-funziona, fiducia, assistenza, per-professionisti, chi-siamo, legal
```

### Pages

| URL | Contenu | Rendu |
|---|---|---|
| `/` | Homepage en 10 sections (brief §5) | SSR |
| `/servizi`, `/servizi/:slug` | Index et pages service | SSR |
| `/dove-siamo`, `/dove-siamo/:citta` | Index des villes, pages ville (noindex si non couverte) | SSR |
| `/disponibilita` | Résultats de « Verifica la disponibilità » (noindex) | SSR |
| `/professionisti/:id` | Profil professionnel | SSR |
| `/come-funziona`, `/fiducia`, `/per-professionisti`, `/chi-siamo` | Pages éditoriales | Pré-rendu |
| `/assistenza` | FAQ, annulations/remboursements, formulaire de contact | SSR |
| `/per-professionisti/candidatura` | Formulaire de candidature (noindex) | SSR |
| `/termini`, `/termini-professionisti`, `/privacy`, `/cookie`, `/cancellazioni-rimborsi` | Documents légaux v3 (texte en italien, aussi sous `/en/…`) | Pré-rendu |
| `/legale/…`, `/en/legal/…`, `/terms`, `/termini-clienti`, `/cookie-policy`, `/index`, `/documents/*.pdf`, `/fr/…`, `/es/…`, `/de/…` | Anciennes adresses | Redirection 301 (`src/server/legacy-redirects.ts`) |

## Pages légales

- **Textes** : `content/legal/*.md`, fournis par GLAMRO, **jamais modifiés à la main**. Pour une nouvelle version, on
  remplace le `.md` et on lance `node tools/build-legal-docs.mjs`, qui régénère `src/app/features/legal/legal-docs.ts`
  (le script s'arrête sur toute syntaxe qu'il ne connaît pas, pour ne rien perdre en silence).
- **Brouillon** : tant que l'avocat n'a pas approuvé les textes v3, `LEGAL_DRAFT = true` (`legal-types.ts`) affiche
  l'avertissement du document en haut de la page. Passer à `false` après l'approbation.
- **Anglais** : les pages `/en/terms`, `/en/privacy`… affichent le texte italien avec un avertissement ; canonical vers
  l'italien, en attendant la traduction de courtoisie.

### Adresses garanties (à ne jamais casser)

Utilisées par les apps, le backend (`GET /api/legal/documents`) et des supports imprimés. Chacune doit toujours afficher
une page ou y rediriger ; le test `src/server/legacy-redirects.spec.ts` le vérifie.

| Adresse | Mène à |
|---|---|
| `/terms`, `/termini`, `/termini-clienti` | Termini e Condizioni Clienti |
| `/termini-professionisti` | Termini e Condizioni Professionisti |
| `/privacy` | Privacy Policy |
| `/cookie`, `/cookie-policy` | Cookie Policy |
| `/cancellazioni-rimborsi` | Cancellazioni, rimborsi e reclami |

Pour en ajouter une : l'ajouter à ce tableau et à `GUARANTEED_LEGAL_LINKS` dans le test.

## Langues (it, en)

- **URL traduites** : l'italien reste à la racine (`/servizi/capelli`), l'anglais a un préfixe et des segments
  traduits : `/en/services/hair`. Les anciennes adresses en français, espagnol et allemand redirigent en 301 vers la
  page italienne (`src/server/legacy-redirects.ts`, qui garde leurs tables de traduction).
  Sont traduits : les pages, les catégories de service, les documents légaux et `candidatura`. Ne sont pas traduits :
  les villes (noms propres) et les identifiants des professionnels.
- **Une seule table** : `core/i18n/route-slugs.ts`. Dans le code, les chemins s'écrivent toujours en italien
  (`'/servizi' | lp: i18n.lang()`) ; le pipe `lp`, les routes, le sélecteur de langue, le SEO, le rendu serveur et la
  sitemap traduisent à partir de cette table. Une nouvelle catégorie de service absente de la table garde son slug
  italien. Si un chemin change, mettre à jour `public/robots.txt`.
- Chaque langue est rendue côté serveur avec son propre `<html lang>`, ses balises `hreflang`, son canonical et son
  entrée dans la sitemap.
- **Textes** : `src/app/i18n/it.ts` est la référence. Son type est imposé aux autres fichiers : une clé oubliée ou
  en trop dans `en.ts` **ne compile pas**. Seul le dictionnaire de la langue affichée
  est téléchargé.
- **Dans un composant** :
  ```ts
  protected readonly i18n = inject(I18n);
  ```
  ```html
  {{ i18n.d().home.title }}                                <!-- texte typé -->
  {{ i18n.d().card.bookWith | fmt: { name: pro.displayName } }}  <!-- texte avec paramètre -->
  <a [routerLink]="'/servizi' | lp: i18n.lang()">…</a>     <!-- lien dans la langue courante -->
  ```
- **Ajouter une langue** : l'ajouter dans `core/i18n/i18n.config.ts` (`LANGS`, `LANG_INFO`), créer `i18n/xx.ts`
  typé `Dict`, l'ajouter aux `LOADERS` de `i18n.service.ts`.
- **Données** : `HttpGlamroDataSource` envoie `?lang=` à `/site-api` ; les textes des services et des villes
  sont traduits dans `core/content/` (les contenus venant de l'API restent en italien).
- **Documents légaux** : l'interface est traduite, mais le corps reste en italien (texte de référence soumis au
  conseil juridique) avec un avertissement ; le canonical de ces pages pointe vers la version italienne.

## Réservation (temporaire)

Le bouton « Prenota » des cartes et du profil ouvre `layout/booking/booking-dialog` :
sur iPhone/iPad ou Android, le bon store est détecté et ouvert automatiquement après 3 secondes (annulable) ;
sur ordinateur, les deux stores sont proposés. Quand l'authentification existera, il suffira de remplacer le
contenu de cette popup : les composants appellent toujours `BookingService.open(pro)`.

### Apps et liens profonds

Deux applications : `apps.client` (réservation) et `apps.pro` (professionnels) dans `site.config.ts`.
Le composant `<app-store-buttons app="client|pro">` affiche les liens de l'une ou l'autre.

Les boutons « Scarica l'app » (header, menu mobile) passent par `core/app-download/AppDownload` :
sur iPhone/iPad ou Android, ils mènent directement au store de l'application clients ; sur ordinateur, ils font
défiler jusqu'au premier élément `[data-app-download]` de la page (une section de la page si elle en a une, sinon
les badges du footer) et lui donnent le focus. La détection d'appareil (`device-platform.ts`) est commune avec la
popup de réservation.

Pas de *universal links* pour l'instant : la popup envoie vers la fiche du store. Plus tard, pour ouvrir
directement l'app sur le bon écran (ex. le profil d'un professionnel) quand elle est installée, il faudra :
- publier `/.well-known/apple-app-site-association` (iOS) et `/.well-known/assetlinks.json` (Android)
  sur le domaine (ex. `glamro.it`), dans `public/.well-known/` ;
- déclarer ce domaine dans chaque app (Associated Domains côté iOS, intent filters côté Android) ;
- dans la popup, ajouter un bouton « Ouvrir dans l'app » vers ce lien, avec repli sur le store.

## Langue du visiteur

- La langue vient de l'URL (`/` italien, `/en`, `/fr`, `/es`, `/de`).
- Le choix fait dans le menu des langues est enregistré dans le cookie **`glamro_lang`** (1 an, technique,
  sans consentement, listé dans l'inventaire des cookies).
- Retour sur `/` avec une autre langue enregistrée → page d'accueil de cette langue (302 dans `server.ts`,
  et côté navigateur en secours quand `/` est servie en statique). Les autres URL ne sont jamais redirigées.
- Sans choix enregistré, si la langue du navigateur est disponible et différente de celle de la page :
  bandeau « This site is available in English — Switch to English / Stay in Italian » (`layout/lang-suggest`).
  Pas de redirection automatique (déconseillé par Google).

## Aperçu sur Vercel

Fichiers fournis : `vercel.json` et `api/index.mjs` (fonction qui exécute le serveur SSR d'Angular).
- **Import du projet** : importer le dépôt GitHub, sans changer les réglages de build (ils sont dans `vercel.json`).
- **Variables d'environnement** (Settings → Environment Variables), sinon le rendu serveur retombe en rendu client
  sur les domaines `*.vercel.app` (protection SSRF d'Angular, voir `security.allowedHosts`) :
  - `NG_ALLOWED_HOSTS` = `*.vercel.app`
  - `NG_TRUST_PROXY_HEADERS` = `X-FORWARDED-PORT,X-FORWARDED-PATH,X-FORWARDED-FOR,X-FORWARDED-HOST,X-FORWARDED-PROTO`
- Les pages prérendues sont servies en statique par Vercel ; les autres passent par la fonction.
- Sur `*.vercel.app` : en-tête `X-Robots-Tag: noindex` (fichiers statiques via `vercel.json`, pages SSR et
  redirections via `server.ts`) et Google Analytics
  désactivé (GA ne se charge que sur `glamro.it`).
- Limite de l'aperçu : les en-têtes de sécurité (CSP…) de `server.ts` ne s'appliquent pas aux pages statiques.
  Pour une mise en production sur Vercel, il faudra les déclarer aussi dans `vercel.json`.

## Badges App Store / Google Play

Badges officiels localisés (it, en, fr, es, de) dans `public/badges/`, affichés par `app-store-buttons`.
- **App Store** : artwork Apple (« Download on the App Store » localisé).
- **Google Play** : artwork Google converti en SVG ([pioug/google-play-badges](https://github.com/pioug/google-play-badges)),
  avec la bordure grise d'origine remise.
- Règles des marques : ne jamais modifier, recolorer, animer ni recréer un badge ; App Store en premier ;
  Google Play de taille égale ou supérieure. Pour une version plus récente, retélécharger depuis
  [App Store Marketing Tools](https://toolbox.marketingtools.apple.com/) et la
  [page des badges Google Play](https://play.google.com/intl/en_us/badges/), en gardant les mêmes noms de fichiers.

## Carte (OpenFreeMap + MapLibre)

Fond vectoriel « Dark » d'[OpenFreeMap](https://openfreemap.org/) : gratuit, sans clé, sans inscription ni quota,
usage commercial autorisé. L'attribution (OpenFreeMap © OpenMapTiles, données OpenStreetMap) est obligatoire :
MapLibre l'affiche automatiquement à partir du style.
- Rendu par **MapLibre GL** (`maplibre-gl`), chargé à la demande, seulement avec le consentement
  « contenuti di terze parti » ou après un clic sur « Mostra la mappa ».
- Le worker MapLibre et sa CSS sont copiés dans `/vendor/maplibre` par `angular.json` (pas de `blob:` dans la CSP).
- URL du style : `mapStyleUrl` dans `environment.ts`.

## Données réelles (API GLAMRO)

Tout le site lit les données via **une seule classe abstraite** : `core/data/glamro-data-source.ts`.
- `useMockData: true` → `MockGlamroDataSource` (données d'exemple, bandeau jaune « dati di esempio »).
- `useMockData: false` → `HttpGlamroDataSource`, qui appelle **`/site-api`** sur le serveur du site.
  Par défaut : `false` partout ; API de dev en développement, API de production en production.

**`/site-api`** (`src/server/site-api/`) est la seule couche qui parle à l'API GLAMRO (`barberhome-backend`).
Le navigateur ne l'appelle jamais directement.
- Endpoints du backend utilisés, **sans aucune modification du backend** : `GET /services` (catalogue et
  couverture autour d'un point), `GET /discovery/nearby-professionals`, `GET /professionals/:id/profile`.
- Données minimales : le serveur renvoie seulement ce que le site affiche. Nom public « Prénom N. »
  (le nom de famille complet ne quitte jamais le serveur), aucune coordonnée, aucune donnée interne.
- Cache mémoire de 2 à 30 minutes selon les données, et `Cache-Control` sur les réponses.
- Pendant le rendu serveur, les requêtes `/site-api` sont traitées en mémoire (`site-api.interceptor.ts`) ;
  le cache de transfert d'Angular évite un second appel dans le navigateur.

**Villes** : liste suivie par le site dans `core/content/site-content.ts` (nom, région, centre, préfixes de CAP).
Une ville est active dès qu'au moins un professionnel publié couvre son centre (rayon 20 km) ; sinon elle passe en
liste d'attente (page non indexée). Ajouter une ville = une ligne dans `CITIES` + son nom et sa région dans
`core/content/content-texts.ts`.

**Catégories** : correspondance avec le catalogue de l'API dans `src/server/site-api/catalog.ts`
(quatre catégories : capelli avec la barbe, make-up, estetica sans les ongles MANI et PIEDI, massaggi ; PACCHETTI n'a
pas de page). `/servizi/barber` et `/servizi/nails` redirigent en 301. Les textes des pages de services et de villes
restent ceux du site (`core/content`), en italien et en anglais ; les noms des services et les
bios viennent de l'API, en italien.

**Variables d'environnement (serveur)** :
- `GLAMRO_API_URL` : base des routes de l'API (défaut : `apiBaseUrl` de l'environnement, ex. `https://api.glamro.it/api`).
- `SITE_MEDIA_ORIGINS` : domaines des photos des professionnels pour la CSP (défaut : `https://glamro.s3.eu-south-1.amazonaws.com`).
  À remplacer par le domaine exact de `S3_PUBLIC_BASE_URL` du backend.

**Pas encore branché** (pas d'endpoint public dans le backend) : candidatures pro, demandes d'assistance
(le formulaire affiche une erreur qui invite à écrire par email) et preuve de consentement côté serveur.

## Ce que couvre le code (rapport au brief)

- **Messages et CTA** : promesse, positionnement et CTA approuvés ; une CTA primaire « Verifica la disponibilità »,
  entrée séparée « Sei un professionista? » ; aucune roadmap ni promesse future.
- **SSR/SSG** : contenu, title, description, canonical, robots, Open Graph et JSON-LD dans le HTML initial ;
  404 réelles (statut HTTP) ; sitemap dynamique (it et en) ; `robots.txt` ouvert à tous les crawlers, y compris ceux
  de recherche et d'entraînement AI (seule la recherche interne est exclue) ; `llms.txt` avec les faits du brief.
- **Titles** : moins de 65 caractères et différents pour chaque page (dictionnaire `seo`) ; descriptions < 155.
- **JSON-LD** : Organization complète (adresse, P.IVA, contacts, réseaux sociaux, fiches des apps) et WebSite avec
  SearchAction (home), FAQPage partout où il y a des questions, Service, CollectionPage (villes), ProfessionalService
  (profils, nom public, offres « da … »), BreadcrumbList. Jamais d'AggregateRating ni de Review sans avis réels.
- **Carrousel** : défilement lent, pause visible, flèches, clavier, swipe, `prefers-reduced-motion`, positions
  sponsorisées signalées, aucune note inventée.
- **Langues** : italien et anglais ; sélecteur dans le header ; hreflang et sitemap bilingues. Les anciennes adresses
  `/fr/…`, `/es/…`, `/de/…` redirigent en 301 vers la page italienne (`src/server/legacy-redirects.ts`).
- **Header** : noir, menu Servizi · Come funziona · Sicurezza · Assistenza · Chi siamo (navigation dans
  `site.config.ts`, colonne du footer dans `footerNav`), puis « Per professionisti » et « Scarica l'app ». « Dove siamo »
  reste accessible par les boutons « Verifica la disponibilità » et le footer. Menu plein écran sous 1120 px.
- **Réservation** : bouton « Prenota » → popup vers l'App Store / Google Play selon l'appareil ; icône profil sur chaque carte.
- **Carte** : clusters par ville (jamais de position précise), liste accessible équivalente toujours présente,
  bottom sheet sur mobile, états chargement / aucun résultat / erreur / zone non couverte / géolocalisation refusée.
  MapLibre est chargé à la demande, et le fond de carte (service tiers) seulement avec consentement ou clic.
- **Cookies (P0)** : rien d'autre que le nécessaire avant le choix ; Accetta / Rifiuta / Personalizza au même
  niveau ; X = refus ; preuve (version, date, choix) stockée et envoyée à l'API ; « Gestisci cookie » dans le footer ;
  GA4 (Consent Mode v2, conteneur `GTM-M625CVRL`) chargé seulement après consentement, sans données personnelles ;
  dans GA, masquer le paramètre d'URL `cap` (Flux de données → Masquer les données → Paramètres de requête d'URL).
- **Accessibilité** : skip link, focus visible, boutons ≥ 48 px, cibles ≥ 44 px, un H1 par page, labels persistants,
  erreurs textuelles, `autocomplete`, messages de succès, `<dialog>` natif pour les préférences.
- **Performance** : pages chargées à la demande, carte en `@defer`, polices auto-hébergées (pas de Google Fonts),
  `NgOptimizedImage` (lazy loading, preload de la hero), dimensions fixes contre le CLS.
- **Légal** : 5 documents v3 (voir « Pages légales »), avec version et date, sommaire et gras du texte d'origine.

## À compléter avant la mise en ligne

Les valeurs à fournir sont marquées `TODO` dans le code ou entre `[crochets]` dans l'interface.

- [ ] **Photos** : les 12 photos sont en place (`public/images/LEGGIMI.md`) ; remplacer 02, 03, 04, 07 et 12 par des
      versions sans marques d'autres sociétés
- [x] **Données société**, e-mails, URL des stores et réseaux sociaux → `site.config.ts`
- [ ] **Textes légaux v3** : approbation de l'avocat (puis `LEGAL_DRAFT = false`) ; la Cookie Policy v3 cite Meta Pixel
      et Google Ads, que le site n'utilise pas : à aligner après une vraie analyse des cookies
- [ ] **Règles métier** restantes (documents de vérification, prestataire de paiement, critères de classement P2B,
      horaires du support, commissions, versements, assurance) → textes entre `[crochets]` dans les i18n
- [ ] **Preuves datées** de la revendication « Il primo beauty delivery in Italia » (brief §2)
- [ ] **Scan cookies** réel du site en production pour valider `cookie-inventory.ts`
- [ ] Choix final de la **CMP** : la CMP interne suffit, ou remplacer `ConsentService` par une CMP commerciale
- [ ] **Mentions de marques** (Apple, App Store, Google Play) dans les mentions légales
- [ ] **Carte** : vérifier dans les DevTools (onglet Réseau) les domaines appelés par le style OpenFreeMap et ajuster la CSP si besoin
- [ ] **Relecture des traductions** EN / FR / ES / DE par des natifs (ton, termes métier)
- [ ] Tests : WCAG 2.2 AA, Core Web Vitals, responsive 320 → 1440 px, deep links
