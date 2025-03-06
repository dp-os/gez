---
titleSuffix: Moteur de construction haute performance du framework Gez
description: Une analyse approfondie du système de construction Rspack du framework Gez, incluant des fonctionnalités clés telles que la compilation haute performance, la construction multi-environnements, l'optimisation des ressources, etc., pour aider les développeurs à construire des applications Web modernes efficaces et fiables.
head:
  - - meta
    - property: keywords
      content: Gez, Rspack, système de construction, compilation haute performance, mise à jour à chaud, construction multi-environnements, Tree Shaking, découpage de code, SSR, optimisation des ressources, efficacité de développement, outil de construction
---

# Rspack

Gez est basé sur le système de construction [Rspack](https://rspack.dev/), exploitant pleinement les capacités de construction haute performance de Rspack. Ce document présente le positionnement et les fonctionnalités principales de Rspack dans le framework Gez.

## Fonctionnalités

Rspack est le système de construction central du framework Gez, offrant les fonctionnalités clés suivantes :

- **Construction haute performance** : Moteur de construction implémenté en Rust, fournissant des performances de compilation extrêmement rapides, améliorant significativement la vitesse de construction des projets de grande envergure.
- **Optimisation de l'expérience de développement** : Supporte des fonctionnalités modernes de développement telles que la mise à jour à chaud (HMR), la compilation incrémentale, offrant une expérience de développement fluide.
- **Construction multi-environnements** : Configuration de construction unifiée supportant les environnements client (client), serveur (server) et Node.js (node), simplifiant le processus de développement multi-plateformes.
- **Optimisation des ressources** : Capacités intégrées de traitement et d'optimisation des ressources, supportant des fonctionnalités telles que le découpage de code, Tree Shaking, la compression des ressources, etc.

## Construction d'applications

Le système de construction Rspack de Gez est conçu de manière modulaire, comprenant principalement les modules suivants :

### @gez/rspack

Module de construction de base, fournissant les capacités principales suivantes :

- **Configuration de construction unifiée** : Fournit une gestion standardisée de la configuration de construction, supportant des configurations multi-environnements.
- **Traitement des ressources** : Capacités intégrées de traitement des ressources telles que TypeScript, CSS, images, etc.
- **Optimisation de la construction** : Fournit des fonctionnalités d'optimisation des performances telles que le découpage de code, Tree Shaking, etc.
- **Serveur de développement** : Intègre un serveur de développement haute performance, supportant HMR.

### @gez/rspack-vue

Module de construction dédié au framework Vue, fournissant :

- **Compilation des composants Vue** : Supporte la compilation efficace des composants Vue 2/3.
- **Optimisation SSR** : Optimisations spécifiques pour les scénarios de rendu côté serveur.
- **Améliorations de développement** : Fonctionnalités spécifiques pour l'amélioration de l'environnement de développement Vue.

## Processus de construction

Le processus de construction de Gez est principalement divisé en les étapes suivantes :

1. **Initialisation de la configuration**
   - Chargement de la configuration du projet
   - Fusion des configurations par défaut et des configurations utilisateur
   - Ajustement de la configuration en fonction des variables d'environnement

2. **Compilation des ressources**
   - Analyse des dépendances du code source
   - Transformation des différentes ressources (TypeScript, CSS, etc.)
   - Gestion des imports/exports de modules

3. **Traitement d'optimisation**
   - Exécution du découpage de code
   - Application de Tree Shaking
   - Compression du code et des ressources

4. **Génération de la sortie**
   - Génération des fichiers cibles
   - Sortie des mappings de ressources
   - Génération du rapport de construction

## Bonnes pratiques

### Optimisation de l'environnement de développement

- **Configuration de la compilation incrémentale** : Configurer correctement l'option `cache` pour accélérer la vitesse de construction en utilisant le cache.
- **Optimisation HMR** : Configurer de manière ciblée la portée de la mise à jour à chaud pour éviter les mises à jour inutiles de modules.
- **Optimisation du traitement des ressources** : Utiliser des configurations de loader appropriées pour éviter les traitements répétés.

### Optimisation de l'environnement de production

- **Stratégie de découpage de code** : Configurer correctement `splitChunks` pour optimiser le chargement des ressources.
- **Compression des ressources** : Activer des configurations de compression appropriées pour équilibrer le temps de construction et la taille des artefacts.
- **Optimisation du cache** : Utiliser des stratégies de hachage de contenu et de cache à long terme pour améliorer les performances de chargement.

## Exemple de configuration

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                // Configuration de construction personnalisée
                config({ config }) {
                    // Ajouter ici des configurations Rspack personnalisées
                }
            })
        );
    },
} satisfies GezOptions;
```

::: tip
Pour plus de détails sur les API et les options de configuration, veuillez consulter la [documentation API Rspack](/api/app/rspack.html).
:::