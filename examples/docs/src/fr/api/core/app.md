---
titleSuffix: Interface d'application abstraite du framework Gez
description: Détaille l'interface App du framework Gez, y compris la gestion du cycle de vie des applications, le traitement des ressources statiques et le rendu côté serveur, aidant les développeurs à comprendre et utiliser les fonctionnalités clés de l'application.
head:
  - - meta
    - property: keywords
      content: Gez, App, abstraction d'application, cycle de vie, ressources statiques, rendu côté serveur, API
---

# App

`App` est l'abstraction d'application du framework Gez, fournissant une interface unifiée pour gérer le cycle de vie de l'application, les ressources statiques et le rendu côté serveur.

```ts title="entry.node.ts"
export default {
  // Configuration de l'environnement de développement
  async devApp(gez) {
    return import('@gez/rspack').then((m) =>
      m.createRspackHtmlApp(gez, {
        config(rc) {
          // Personnalisation de la configuration Rspack
        }
      })
    );
  }
}
```

## Définitions de types
### App

```ts
interface App {
  middleware: Middleware;
  render: (options?: RenderContextOptions) => Promise<RenderContext>;
  build?: () => Promise<boolean>;
  destroy?: () => Promise<boolean>;
}
```

#### middleware

- **Type**: `Middleware`

Middleware de traitement des ressources statiques.

Environnement de développement :
- Traite les requêtes de ressources statiques du code source
- Supporte la compilation en temps réel et le rechargement à chaud
- Utilise une stratégie de cache no-cache

Environnement de production :
- Traite les ressources statiques construites
- Supporte le cache à long terme pour les fichiers immuables (.final.xxx)
- Stratégie optimisée de chargement des ressources

```ts
server.use(gez.middleware);
```

#### render

- **Type**: `(options?: RenderContextOptions) => Promise<RenderContext>`

Fonction de rendu côté serveur. Fournit différentes implémentations selon l'environnement d'exécution :
- Environnement de production (start) : charge le fichier d'entrée côté serveur construit (entry.server) pour exécuter le rendu
- Environnement de développement (dev) : charge le fichier d'entrée côté serveur du code source pour exécuter le rendu

```ts
const rc = await gez.render({
  params: { url: '/page' }
});
res.end(rc.html);
```

#### build

- **Type**: `() => Promise<boolean>`

Fonction de construction pour l'environnement de production. Utilisée pour l'empaquetage et l'optimisation des ressources. Retourne true en cas de succès, false en cas d'échec.

#### destroy

- **Type**: `() => Promise<boolean>`

Fonction de nettoyage des ressources. Utilisée pour fermer le serveur, déconnecter les connexions, etc. Retourne true en cas de succès, false en cas d'échec.