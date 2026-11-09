# Images à fournir

Tant qu'une image n'est pas renseignée dans `src/app/core/config/site.config.ts` (bloc `images`)
ou renvoyée par l'API, le site affiche un emplacement neutre avec une légende.

Format conseillé : **WebP ou AVIF**, dimensions indiquées ci-dessous, poids < 200 Ko.
Brief §8 : photos réelles et autorisées pour professionnels, clients et résultats.

| Clé (`site.config.ts`)       | Contenu                                              | Taille conseillée |
|------------------------------|------------------------------------------------------|-------------------|
| `images.hero`                | Rider GLAMRO à vélo avec le sac à dos (campagne)     | 1920 × 1080       |
| `images.storytelling[0]`     | Le professionnel prépare le kit                      | 800 × 1000        |
| `images.storytelling[1]`     | Trajet en ville                                      | 800 × 1000        |
| `images.storytelling[2]`     | Arrivée chez le client                               | 800 × 1000        |
| `images.storytelling[3]`     | Le service                                           | 800 × 1000        |
| `images.proEntry`            | Portrait professionnel (bloc « Per professionisti ») | 900 × 1000        |
| `images.about`               | Image page « Chi siamo »                             | 1600 × 900        |

Les images des catégories de service et les photos de profil arrivent de l'API (champ `image` / `profileImage`).
