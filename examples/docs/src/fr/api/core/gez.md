---
titleSuffix: Référence de l'API des classes principales du framework
description: Documentation détaillée de l'API des classes principales du framework Gez, incluant la gestion du cycle de vie des applications, le traitement des ressources statiques et les capacités de rendu côté serveur, pour aider les développeurs à comprendre en profondeur les fonctionnalités clés du framework.
head:
  - - meta
    - property: keywords
      content: Gez, API, Gestion du cycle de vie, Ressources statiques, Rendu côté serveur, Rspack, Framework d'application Web
---

# Gez

## Introduction

Gez est un framework d'application Web haute performance basé sur Rspack, offrant une gestion complète du cycle de vie des applications, le traitement des ressources statiques et des capacités de rendu côté serveur.

## Définitions de types

### RuntimeTarget

- **Définition de type**:
```ts
type RuntimeTarget = 'client' | 'server'
```

Types d'environnements d'exécution des applications :
- `client` : Fonctionne dans l'environnement du navigateur, supporte les opérations DOM et les API du navigateur
- `server` : Fonctionne dans l'environnement Node.js, supporte le système de fichiers et les fonctionnalités côté serveur

### ImportMap

- **Définition de type**:
```ts
type ImportMap = {
  imports?: SpecifierMap
  scopes?: ScopesMap
}
```

Type de mappage d'importation des modules ES.

#### SpecifierMap

- **Définition de type**:
```ts
type SpecifierMap = Record<string, string>
```

Type de mappage des identifiants de modules, utilisé pour définir les relations de mappage des chemins d'importation des modules.

#### ScopesMap

- **Définition de type**:
```ts
type ScopesMap = Record<string, SpecifierMap>
```

Type de mappage des portées, utilisé pour définir les relations de mappage des importations de modules dans des portées spécifiques.

### COMMAND

- **Définition de type**:
```ts
enum COMMAND {
    dev = 'dev',
    build = 'build',
    preview = 'preview',
    start = 'start'
}
```

Enumération des types de commandes :
- `dev` : Commande pour l'environnement de développement, démarre le serveur de développement avec support du rechargement à chaud
- `build` : Commande de construction, génère les artefacts de construction pour l'environnement de production
- `preview` : Commande de prévisualisation, démarre un serveur de prévisualisation local
- `start` : Commande de démarrage, exécute le serveur de production

## Options d'instance

Définit les options de configuration principales du framework Gez.

```ts
interface GezOptions {
  root?: string
  isProd?: boolean
  basePathPlaceholder?: string | false
  modules?: ModuleConfig
  packs?: PackConfig
  devApp?: (gez: Gez) => Promise<App>
  server?: (gez: Gez) => Promise<void>
  postBuild?: (gez: Gez) => Promise<void>
}
```

#### root

- **Type**: `string`
- **Valeur par défaut**: `process.cwd()`

Chemin du répertoire racine du projet. Peut être un chemin absolu ou relatif, les chemins relatifs sont résolus par rapport au répertoire de travail actuel.

#### isProd

- **Type**: `boolean`
- **Valeur par défaut**: `process.env.NODE_ENV === 'production'`

Identifiant d'environnement.
- `true` : Environnement de production
- `false` : Environnement de développement

#### basePathPlaceholder

- **Type**: `string | false`
- **Valeur par défaut**: `'[[[___GEZ_DYNAMIC_BASE___]]]'`

Configuration de l'espace réservé pour le chemin de base. Utilisé pour remplacer dynamiquement le chemin de base des ressources au moment de l'exécution. Définir à `false` désactive cette fonctionnalité.

#### modules

- **Type**: `ModuleConfig`

Options de configuration des modules. Utilisé pour configurer les règles de résolution des modules du projet, incluant les alias de modules, les dépendances externes, etc.

#### packs

- **Type**: `PackConfig`

Options de configuration de l'empaquetage. Utilisé pour empaqueter les artefacts de construction en format standard npm .tgz.

#### devApp

- **Type**: `(gez: Gez) => Promise<App>`

Fonction de création d'application pour l'environnement de développement. Utilisé uniquement dans l'environnement de développement pour créer une instance d'application pour le serveur de développement.

```ts title="entry.node.ts"
export default {
  async devApp(gez) {
    return import('@gez/rspack').then((m) =>
      m.createRspackHtmlApp(gez, {
        config(context) {
          // Configuration personnalisée de Rspack
        }
      })
    )
  }
}
```

#### server

- **Type**: `(gez: Gez) => Promise<void>`

Fonction de configuration du démarrage du serveur. Utilisé pour configurer et démarrer le serveur HTTP, utilisable à la fois dans les environnements de développement et de production.

```ts title="entry.node.ts"
export default {
  async server(gez) {
    const server = http.createServer((req, res) => {
      gez.middleware(req, res, async () => {
        const render = await gez.render({
          params: { url: req.url }
        });
        res.end(render.html);
      });
    });

    server.listen(3000);
  }
}
```

#### postBuild

- **Type**: `(gez: Gez) => Promise<void>`

Fonction de post-traitement après la construction. Exécutée après la construction du projet, peut être utilisée pour :
- Exécuter un traitement supplémentaire des ressources
- Effectuer des opérations de déploiement
- Générer des fichiers statiques
- Envoyer des notifications de construction

## Propriétés d'instance

### name

- **Type**: `string`
- **Lecture seule**: `true`

Nom du module actuel, dérivé de la configuration du module.

### varName

- **Type**: `string`
- **Lecture seule**: `true`

Nom de variable JavaScript valide généré à partir du nom du module.

### root

- **Type**: `string`
- **Lecture seule**: `true`

Chemin absolu du répertoire racine du projet. Si le `root` configuré est un chemin relatif, il est résolu par rapport au répertoire de travail actuel.

### isProd

- **Type**: `boolean`
- **Lecture seule**: `true`

Détermine si l'environnement actuel est de production. Priorise l'option de configuration `isProd`, sinon détermine en fonction de `process.env.NODE_ENV`.

### basePath

- **Type**: `string`
- **Lecture seule**: `true`
- **Lève**: `NotReadyError` - Si le framework n'est pas initialisé

Obtient le chemin de base du module commençant et se terminant par une barre oblique. Le format de retour est `/${name}/`, où name provient de la configuration du module.

### basePathPlaceholder

- **Type**: `string`
- **Lecture seule**: `true`

Obtient l'espace réservé pour le remplacement dynamique du chemin de base au moment de l'exécution. Peut être désactivé via la configuration.

### middleware

- **Type**: `Middleware`
- **Lecture seule**: `true`

Obtient le middleware de traitement des ressources statiques. Fournit des implémentations différentes selon l'environnement :
- Environnement de développement : Supporte la compilation en temps réel du code source et le rechargement à chaud
- Environnement de production : Supporte la mise en cache à long terme des ressources statiques

```ts
const server = http.createServer((req, res) => {
  gez.middleware(req, res, async () => {
    const rc = await gez.render({ url: req.url });
    res.end(rc.html);
  });
});
```

### render

- **Type**: `(options?: RenderContextOptions) => Promise<RenderContext>`
- **Lecture seule**: `true`

Obtient la fonction de rendu côté serveur. Fournit des implémentations différentes selon l'environnement :
- Environnement de développement : Supporte le rechargement à chaud et la prévisualisation en temps réel
- Environnement de production : Fournit des performances de rendu optimisées

```ts
// Utilisation de base
const rc = await gez.render({
  params: { url: req.url }
});

// Configuration avancée
const rc = await gez.render({
  base: '',                    // Chemin de base
  importmapMode: 'inline',     // Mode de mappage d'importation
  entryName: 'default',        // Point d'entrée de rendu
  params: {
    url: req.url,
    state: { user: 'admin' }   // Données d'état
  }
});
```

### COMMAND

- **Type**: `typeof COMMAND`
- **Lecture seule**: `true`

Obtient la définition du type d'énumération des commandes.

### moduleConfig

- **Type**: `ParsedModuleConfig`
- **Lecture seule**: `true`
- **Lève**: `NotReadyError` - Si le framework n'est pas initialisé

Obtient les informations de configuration complètes du module actuel, incluant les règles de résolution des modules, la configuration des alias, etc.

### packConfig

- **Type**: `ParsedPackConfig`
- **Lecture seule**: `true`
- **Lève**: `NotReadyError` - Si le framework n'est pas initialisé

Obtient la configuration relative à l'empaquetage du module actuel, incluant le chemin de sortie, le traitement de package.json, etc.

## Méthodes d'instance

### constructor()

- **Paramètres**: 
  - `options?: GezOptions` - Options de configuration du framework
- **Retourne**: `Gez`

Crée une instance du framework Gez.

```ts
const gez = new Gez({
  root: './src',
  isProd: process.env.NODE_ENV === 'production'
});
```

### init()

- **Paramètres**: `command: COMMAND`
- **Retourne**: `Promise<boolean>`
- **Lève**:
  - `Error`: En cas de réinitialisation
  - `NotReadyError`: Lors de l'accès à une instance non initialisée

Initialise l'instance du framework Gez. Exécute les processus d'initialisation principaux suivants :

1. Analyse la configuration du projet (package.json, configuration des modules, configuration de l'empaquetage, etc.)
2. Crée une instance d'application (environnement de développement ou de production)
3. Exécute les méthodes du cycle de vie correspondantes en fonction de la commande

::: warning Attention
- Une réinitialisation lève une erreur
- L'accès à une instance non initialisée lève `NotReadyError`

:::

```ts
const gez = new Gez({
  root: './src',
  isProd: process.env.NODE_ENV === 'production'
});

await gez.init(COMMAND.dev);
```

### destroy()

- **Retourne**: `Promise<boolean>`

Détruit l'instance du framework Gez, exécute le nettoyage des ressources et la fermeture des connexions. Principalement utilisé pour :
- Fermer le serveur de développement
- Nettoyer les fichiers temporaires et le cache
- Libérer les ressources système

```ts
process.once('SIGTERM', async () => {
  await gez.destroy();
  process.exit(0);
});
```

### build()

- **Retourne**: `Promise<boolean>`

Exécute le processus de construction de l'application, incluant :
- Compilation du code source
- Génération des artefacts de construction pour l'environnement de production
- Optimisation et compression du code
- Génération du manifeste des ressources

::: warning Attention
L'appel avant l'initialisation du framework lève `NotReadyError`
:::

```ts title="entry.node.ts"
export default {
  async postBuild(gez) {
    await gez.build();
    // Génère le HTML statique après la construction
    const render = await gez.render({
      params: { url: '/' }
    });
    gez.writeSync(
      gez.resolvePath('dist/client', 'index.html'),
      render.html
    );
  }
}
```

### server()

- **Retourne**: `Promise<void>`
- **Lève**: `NotReadyError` - Si le framework n'est pas initialisé

Démarre le serveur HTTP et configure l'instance du serveur. Appelé dans les cycles de vie suivants :
- Environnement de développement (dev) : Démarre le serveur de développement avec support du rechargement à chaud
- Environnement de production (start) : Démarre le serveur de production avec des performances de niveau production

```ts title="entry.node.ts"
export default {
  async server(gez) {
    const server = http.createServer((req, res) => {
      // Traite les ressources statiques
      gez.middleware(req, res, async () => {
        // Rendu côté serveur
        const render = await gez.render({
          params: { url: req.url }
        });
        res.end(render.html);
      });
    });

    server.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
  }
}
```

### postBuild()

- **Retourne**: `Promise<boolean>`

Exécute la logique de post-traitement après la construction, utilisée pour :
- Générer des fichiers HTML statiques
- Traiter les artefacts de construction
- Exécuter des tâches de déploiement
- Envoyer des notifications de construction

```ts title="entry.node.ts"
export default {
  async postBuild(gez) {
    // Génère plusieurs pages HTML statiques
    const pages = ['/', '/about', '/404'];

    for (const url of pages) {
      const render = await gez.render({
        params: { url }
      });

      await gez.write(
        gez.resolvePath('dist/client', url.substring(1), 'index.html'),
        render.html
      );
    }
  }
}
```

### resolvePath

Résout le chemin du projet, convertit un chemin relatif en chemin absolu.

- **Paramètres**:
  - `projectPath: ProjectPath` - Type de chemin du projet
  - `...args: string[]` - Segments de chemin
- **Retourne**: `string` - Chemin absolu résolu

- **Exemple**:
```ts
// Résout le chemin des ressources statiques
const htmlPath = gez.resolvePath('dist/client', 'index.html');
```

### writeSync()

Écrit de manière synchrone le contenu d'un fichier.

- **Paramètres**:
  - `filepath`: `string` - Chemin absolu du fichier
  - `data`: `any` - Données à écrire, peuvent être une chaîne, un Buffer ou un objet
- **Retourne**: `boolean` - Indique si l'écriture a réussi

- **Exemple**:
```ts title="src/entry.node.ts"

async postBuild(gez) {
  const htmlPath = gez.resolvePath('dist/client', 'index.html');
  const success = await gez.write(htmlPath, '<html>...</html>');
}
```

### readJsonSync()

Lit et analyse de manière synchrone un fichier JSON.

- **Paramètres**:
  - `filename`: `string` - Chemin absolu du fichier JSON

- **Retourne**: `any` - Objet JSON analysé
- **Lève**: Une exception si le fichier n'existe pas ou si le format JSON est incorrect

- **Exemple**:
```ts title="src/entry.node.ts"
async server(gez) {
  const manifest = gez.readJsonSync(gez.resolvePath('dist/client', 'manifest.json'));
  // Utilise l'objet manifest
}
```

### readJson()

Lit et analyse de manière asynchrone un fichier JSON.

- **Paramètres**:
  - `filename`: `string` - Chemin absolu du fichier JSON

- **Retourne**: `Promise<any>` - Objet JSON analysé
- **Lève**: Une exception si le fichier n'existe pas ou si le format JSON est incorrect

- **Exemple**:
```ts title="src/entry.node.ts"
async server(gez) {
  const manifest = await gez.readJson(gez.resolvePath('dist/client', 'manifest.json'));
  // Utilise l'objet manifest
}
```

### getManifestList()

Obtient la liste des manifestes de construction.

- **Paramètres**:
  - `target`: `RuntimeTarget` - Type d'environnement cible
    - `'client'`: Environnement client
    - `'server'`: Environnement serveur

- **Retourne**: `Promise<readonly ManifestJson[]>` - Liste en lecture seule des manifestes de construction
- **Lève**: `NotReadyError` si l'instance du framework n'est pas initialisée

Cette méthode est utilisée pour obtenir la liste des manifestes de construction pour l'environnement cible spécifié, incluant les fonctionnalités suivantes :
1. **Gestion du cache**
   - Utilise un mécanisme de cache interne pour éviter les chargements répétés
   - Retourne une liste de manifestes immuable

2. **Adaptation à l'environnement**
   - Supporte les environnements client et serveur
   - Retourne les informations de manifeste correspondantes en fonction de l'environnement cible

3. **Mappage des modules**
   - Inclut les informations d'exportation des modules
   - Enregistre les relations de dépendance des ressources

