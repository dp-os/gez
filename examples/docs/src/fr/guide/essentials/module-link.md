---
titleSuffix: Mécanisme de partage de code entre services dans le framework Gez
description: Détails sur le mécanisme de liaison de modules dans le framework Gez, y compris le partage de code entre services, la gestion des dépendances et l'implémentation de la spécification ESM, pour aider les développeurs à construire des applications micro-frontend efficaces.
head:
  - - meta
    - property: keywords
      content: Gez, Liaison de modules, Module Link, ESM, Partage de code, Gestion des dépendances, Micro-frontend
---

# Liaison de modules

Le framework Gez fournit un mécanisme complet de liaison de modules pour gérer le partage de code et les dépendances entre services. Ce mécanisme est basé sur la spécification ESM (ECMAScript Module) et prend en charge l'exportation et l'importation de modules au niveau du code source, ainsi qu'une gestion complète des dépendances.

### Concepts clés

#### Exportation de modules
L'exportation de modules est le processus d'exposition d'unités de code spécifiques (comme des composants, des fonctions utilitaires, etc.) d'un service au format ESM. Deux types d'exportation sont pris en charge :
- **Exportation de code source** : Exportation directe des fichiers de code source du projet
- **Exportation de dépendances** : Exportation des packages de dépendances tierces utilisés par le projet

#### Importation de modules
L'importation de modules est le processus de référencement d'unités de code exportées par d'autres services dans un service. Plusieurs méthodes d'installation sont prises en charge :
- **Installation de code source** : Adaptée à l'environnement de développement, prend en charge les modifications en temps réel et la mise à jour à chaud
- **Installation de package** : Adaptée à l'environnement de production, utilise directement les artefacts de construction

### Mécanisme de préchargement

Pour optimiser les performances des services, Gez implémente un mécanisme intelligent de préchargement de modules :

1. **Analyse des dépendances**
   - Analyse des dépendances entre les composants lors de la construction
   - Identification des modules critiques sur le chemin critique
   - Détermination de la priorité de chargement des modules

2. **Stratégie de chargement**
   - **Chargement immédiat** : Modules critiques sur le chemin critique
   - **Chargement différé** : Modules de fonctionnalités non critiques
   - **Chargement à la demande** : Modules rendus conditionnellement

3. **Optimisation des ressources**
   - Stratégie intelligente de découpage de code
   - Gestion du cache au niveau des modules
   - Compilation et construction à la demande

## Exportation de modules

### Configuration

Configurez les modules à exporter dans `entry.node.ts` :

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // Exporter des fichiers de code source
            'root:src/components/button.vue',  // Composant Vue
            'root:src/utils/format.ts',        // Fonction utilitaire
            // Exporter des dépendances tierces
            'npm:vue',                         // Framework Vue
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

La configuration d'exportation prend en charge deux types :
- `root:*` : Exporter des fichiers de code source, chemin relatif à la racine du projet
- `npm:*` : Exporter des dépendances tierces, nom du package directement spécifié

## Importation de modules

### Configuration

Configurez les modules à importer dans `entry.node.ts` :

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // Configuration des importations
        imports: {
            // Installation de code source : pointer vers le répertoire des artefacts de construction
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // Installation de package : pointer vers le répertoire du package
            'other-remote': 'root:./node_modules/other-remote'
        },
        // Configuration des dépendances externes
        externals: {
            // Utiliser les dépendances des modules distants
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

Explication des options de configuration :
1. **imports** : Configurer le chemin local des modules distants
   - Installation de code source : pointer vers le répertoire des artefacts de construction (dist)
   - Installation de package : pointer directement vers le répertoire du package

2. **externals** : Configurer les dépendances externes
   - Utilisé pour partager les dépendances des modules distants
   - Éviter de construire plusieurs fois les mêmes dépendances
   - Prend en charge le partage de dépendances entre plusieurs modules

### Méthodes d'installation

#### Installation de code source
Adaptée à l'environnement de développement, prend en charge les modifications en temps réel et la mise à jour à chaud.

1. **Méthode Workspace**
Recommandé pour les projets Monorepo :
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Méthode Link**
Utilisée pour le débogage local :
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### Installation de package
Adaptée à l'environnement de production, utilise directement les artefacts de construction.

1. **NPM Registry**
Installation via npm registry :
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **Serveur statique**
Installation via le protocole HTTP/HTTPS :
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## Construction de packages

### Configuration

Configurez les options de construction dans `entry.node.ts` :

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // Configuration de l'exportation de modules
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // Configuration de la construction
    pack: {
        // Activer la construction
        enable: true,

        // Configuration des sorties
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // Personnalisation de package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // Traitement avant la construction
        onBefore: async (gez, pkg) => {
            // Générer des déclarations de type
            // Exécuter des tests
            // Mettre à jour la documentation, etc.
        },

        // Traitement après la construction
        onAfter: async (gez, pkg, file) => {
            // Téléverser sur CDN
            // Publier sur le dépôt npm
            // Déployer sur l'environnement de test, etc.
        }
    }
} satisfies GezOptions;
```

### Artefacts de construction

```
your-app-name.tgz
├── package.json        # Informations du package
├── index.js            # Point d'entrée pour l'environnement de production
├── server/             # Ressources côté serveur
│   └── manifest.json   # Mappage des ressources côté serveur
├── node/               # Runtime Node.js
└── client/             # Ressources côté client
    └── manifest.json   # Mappage des ressources côté client
```

### Processus de publication

```bash
# 1. Construire la version de production
gez build

# 2. Publier sur npm
npm publish dist/versions/your-app-name.tgz
```

## Bonnes pratiques

### Configuration de l'environnement de développement
- **Gestion des dépendances**
  - Utiliser la méthode Workspace ou Link pour installer les dépendances
  - Gérer uniformément les versions des dépendances
  - Éviter d'installer plusieurs fois les mêmes dépendances

- **Expérience de développement**
  - Activer la fonctionnalité de mise à jour à chaud
  - Configurer une stratégie de préchargement appropriée
  - Optimiser la vitesse de construction

### Configuration de l'environnement de production
- **Stratégie de déploiement**
  - Utiliser NPM Registry ou un serveur statique
  - Assurer l'intégrité des artefacts de construction
  - Mettre en place un mécanisme de déploiement progressif

- **Optimisation des performances**
  - Configurer correctement le préchargement des ressources
  - Optimiser l'ordre de chargement des modules
  - Mettre en place une stratégie de cache efficace

### Gestion des versions
- **Conventions de version**
  - Suivre la convention de version sémantique
  - Maintenir un journal de modifications détaillé
  - Effectuer des tests de compatibilité des versions

- **Mise à jour des dépendances**
  - Mettre à jour régulièrement les packages de dépendances
  - Effectuer des audits de sécurité réguliers
  - Maintenir la cohérence des versions des dépendances
```