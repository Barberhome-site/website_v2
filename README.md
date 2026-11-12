# GLAMRO — site web (Angular 22, SSR)

Site vitrine et de réservation de GLAMRO, construit à partir du *Master Brief Sito Web GLAMRO 2026* (v. 2 octobre 2026).
Interface en 5 langues (it, en, fr, es, de), code commenté en français.

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
├── environments/                siteUrl, useMockData, apiBaseUrl, ID Google Analytics, Trustpilot
├── styles/                      Système visuel du brief (couleurs, typo, boutons 48 px, focus, formulaires)
└── app/
    ├── app.routes.ts            Arborescence (slugs italiens), une branche par langue
    ├── i18n/                    Dictionnaires : it.ts (référence), en.ts, fr.ts, es.ts, de.ts
    ├── app.routes.server.ts     Rendu par route : Prerender (pages stables) / Server (données live)
    ├── core/
    │   ├── models/              Modèles du domaine (contrat que l'API devra remplir)
    │   ├── data/                ★ Point de branchement de l'API (voir plus bas)
    │   ├── seo/                 title, description, canonical, robots, Open Graph, JSON-LD
    │   ├── i18n/                Langue courante, pipes `lp` (liens) et `fmt` (paramètres), résolveur
    │   ├── booking/             Ouverture de la popup « Prenota »
    │   ├── consent/             CMP : bandeau, préférences, preuve et révocation du consentement
    │   ├── analytics/           GA4 chargé seulement après consentement, 8 événements du brief
    │   ├── config/site.config   Textes approuvés, navigation, réseaux, stores, images, données société
    │   └── routing/             Résolveurs (données avant affichage) + statut HTTP 404 en SSR
    ├── layout/                  Header, footer, sélecteur de langue, popup de réservation,
    │                            bandeau cookies, panneau « Gestisci cookie »
    ├── shared/components/       Recherche de disponibilité, carrousel, carte, Trustpilot, cartes…
    └── features/                Pages : home, servizi, dove-siamo, disponibilita, professionisti,
                                 come-funziona, fiducia, assistenza, per-professionisti, chi-siamo, legale
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
| `/legale/privacy`, `/cookie-policy`, `/condizioni-clienti`, `/condizioni-professionisti` | Documents légaux versionnés | Pré-rendu |

## Langues (it, en, fr, es, de)

- **URL traduites** : l'italien reste à la racine (`/servizi/capelli`), les autres langues ont un préfixe et des
  segments traduits : `/en/services/hair`, `/fr/services/coiffure`, `/es/servicios/peluqueria`, `/de/leistungen/haare`.
  Sont traduits : les pages, les catégories de service, les documents légaux et `candidatura`. Ne sont pas traduits :
  les villes (noms propres) et les identifiants des professionnels.
- **Une seule table** : `core/i18n/route-slugs.ts`. Dans le code, les chemins s'écrivent toujours en italien
  (`'/servizi' | lp: i18n.lang()`) ; le pipe `lp`, les routes, le sélecteur de langue, le SEO, le rendu serveur et la
  sitemap traduisent à partir de cette table. Une nouvelle catégorie de service absente de la table garde son slug
  italien. Si un chemin change, mettre à jour `public/robots.txt`.
- Chaque langue est rendue côté serveur avec son propre `<html lang>`, ses balises `hreflang`, son canonical et son
  entrée dans la sitemap.
- **Textes** : `src/app/i18n/it.ts` est la référence. Son type est imposé aux autres fichiers : une clé oubliée ou
  en trop dans `en.ts`, `fr.ts`, `es.ts` ou `de.ts` **ne compile pas**. Seul le dictionnaire de la langue affichée
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
- **Données** : l'API recevra la langue via l'en-tête `Accept-Language` (`core/data/http/lang.interceptor.ts`) ;
  les données d'exemple sont déjà traduites (`core/data/mock/mock-i18n.ts`).
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

Pas de *universal links* pour l'instant : la popup envoie vers la fiche du store. Plus tard, pour ouvrir
directement l'app sur le bon écran (ex. le profil d'un professionnel) quand elle est installée, il faudra :
- publier `/.well-known/apple-app-site-association` (iOS) et `/.well-known/assetlinks.json` (Android)
  sur le domaine (ex. `glamro.it`), dans `public/.well-known/` ;
- déclarer ce domaine dans chaque app (Associated Domains côté iOS, intent filters côté Android) ;
- dans la popup, ajouter un bouton « Ouvrir dans l'app » vers ce lien, avec repli sur le store.

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

## Brancher l'API (plus tard)

Tout le site lit les données via **une seule classe abstraite** : `core/data/glamro-data-source.ts`.
Aujourd'hui elle est fournie par `MockGlamroDataSource` (données d'exemple). Pour passer à l'API :

1. **`environments/environment.ts`** : `useMockData: false` et `apiBaseUrl` réelle.
2. **`core/data/http/http-glamro-data-source.ts`** : ajuster les chemins des endpoints (hypothèses actuelles :
   `/services`, `/cities`, `/map/clusters`, `/professionals`, `/availability`, `/consents`…).
3. **`core/data/http/api-mappers.ts`** : convertir le JSON reçu vers les modèles internes. Le mapper des profils
   accepte déjà camelCase **et** snake_case (`professional_id`, `display_name`…, champs proposés par le brief).
4. **`server/sitemap.ts`** : remplacer `loadDataset()` par des appels à l'API.
5. **`server.ts`** : ajouter le domaine de l'API dans `connect-src` de la CSP.

Les composants n'ont pas à changer. Le bandeau jaune « dati di esempio » disparaît dès que `useMockData` est à `false`.

En SSR, Angular attend les réponses `HttpClient` avant d'envoyer la page, et les transfère au navigateur
(pas de double appel). Les listes peu volatiles (services, villes) sont mises en cache.

## Ce que couvre le code (rapport au brief)

- **Messages et CTA** : promesse, positionnement et CTA approuvés ; une CTA primaire « Verifica la disponibilità »,
  entrée séparée « Sei un professionista? » ; aucune roadmap ni promesse future.
- **SSR/SSG** : contenu, title, description, canonical, robots, Open Graph et JSON-LD dans le HTML initial ;
  404 réelles (statut HTTP) ; sitemap dynamique ; `robots.txt` avec OAI-SearchBot autorisé ; `llms.txt` valide.
- **JSON-LD** : Organization + WebSite (home), Service + BreadcrumbList, CollectionPage + ItemList (villes),
  Person (profils) ; `aggregateRating` seulement si des avis réels existent.
- **Carrousel** : défilement lent, pause visible, flèches, clavier, swipe, `prefers-reduced-motion`, positions
  sponsorisées signalées, aucune note inventée.
- **Langues** : italien, anglais, français, espagnol, allemand ; sélecteur dans le header ; hreflang et sitemap multilingue.
- **Réservation** : bouton « Prenota » → popup vers l'App Store / Google Play selon l'appareil ; icône profil sur chaque carte.
- **Carte** : clusters par ville (jamais de position précise), liste accessible équivalente toujours présente,
  bottom sheet sur mobile, états chargement / aucun résultat / erreur / zone non couverte / géolocalisation refusée.
  MapLibre est chargé à la demande, et le fond de carte (service tiers) seulement avec consentement ou clic.
- **Trustpilot** : TrustBox officiel chargé après consentement ; sinon lien neutre vers le profil ;
  distinction avis GLAMRO / avis des professionnels.
- **Cookies (P0)** : rien d'autre que le nécessaire avant le choix ; Accetta / Rifiuta / Personalizza au même
  niveau ; X = refus ; preuve (version, date, choix) stockée et envoyée à l'API ; « Gestisci cookie » dans le footer ;
  GA4 (Consent Mode v2) chargé seulement après consentement, sans données personnelles ni query string.
- **Accessibilité** : skip link, focus visible, boutons ≥ 48 px, cibles ≥ 44 px, un H1 par page, labels persistants,
  erreurs textuelles, `autocomplete`, messages de succès, `<dialog>` natif pour les préférences.
- **Performance** : pages chargées à la demande, carte en `@defer`, polices auto-hébergées (pas de Google Fonts),
  `NgOptimizedImage` (lazy loading, preload de la hero), dimensions fixes contre le CLS.
- **Légal** : structure des 4 documents avec version, date d'efficacité, date de mise à jour, sommaire, archive des
  versions ; tableau des cookies généré depuis l'inventaire ; lien ODR supprimé.

## À compléter avant la mise en ligne

Les valeurs à fournir sont marquées `TODO` dans le code ou entre `[crochets]` dans l'interface.

- [ ] **Photos** (hero rider, storytelling ×4, bloc pro, chi siamo) → `site.config.ts`, voir `public/images/LEGGIMI.md`
- [ ] **Données société** (raison sociale, P.IVA, siège, REA) et e-mails support/privacy → `site.config.ts`
- [ ] **URL des stores** des deux apps (clients et professionnels) et **réseaux sociaux officiels** → `site.config.ts` (`apps.client`, `apps.pro`)
- [ ] **Trustpilot** : `businessUnitId` et `templateId` → `environment.ts`
- [ ] **Textes légaux** définitifs validés par le conseil juridique → `features/legal/legal-docs.ts`
- [ ] **Règles métier** (fenêtres d'annulation, commissions, paiements, vérification) → pages Come funziona,
      Fiducia, Assistenza, Per professionisti (blocs `placeholder`)
- [ ] **Preuves datées** de la revendication « Il primo beauty delivery in Italia » (brief §2)
- [ ] **Scan cookies** réel du site en production pour valider `cookie-inventory.ts`
- [ ] Choix final de la **CMP** : la CMP interne suffit, ou remplacer `ConsentService` par une CMP commerciale
- [ ] **Mentions de marques** (Apple, App Store, Google Play) dans les mentions légales
- [ ] **Carte** : vérifier dans les DevTools (onglet Réseau) les domaines appelés par le style OpenFreeMap et ajuster la CSP si besoin
- [ ] **Relecture des traductions** EN / FR / ES / DE par des natifs (ton, termes métier)
- [ ] Tests : WCAG 2.2 AA, Core Web Vitals, responsive 320 → 1440 px, deep links
