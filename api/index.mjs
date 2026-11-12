// Fonction Vercel : toutes les requêtes non statiques passent par le serveur Express d'Angular (SSR).
// Le bundle est produit par `npm run build` (voir vercel.json).
export { default } from '../dist/website_v2/server/server.mjs';
