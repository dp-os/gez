---
titleSuffix: Présentation du framework Gez et innovations technologiques
description: Découvrez en profondeur le contexte du projet, l'évolution technologique et les avantages clés du framework de micro-frontend Gez, explorant une solution moderne de rendu côté serveur basée sur ESM.
head:
  - - meta
    - property: keywords
      content: Gez, micro-frontend, ESM, rendu côté serveur, SSR, innovation technologique, module federation
---

# Introduction

## Contexte du projet
Gez est un framework moderne de micro-frontend basé sur les modules ECMAScript (ESM), se concentrant sur la construction d'applications de rendu côté serveur (SSR) hautes performances et extensibles. En tant que troisième génération du projet Genesis, Gez a continuellement innové au cours de son évolution technologique :

- **v1.0** : Chargement à la demande des composants distants basé sur les requêtes HTTP
- **v2.0** : Intégration d'applications basée sur Webpack Module Federation
- **v3.0** : Redesign du système de [liaison de modules](/guide/essentials/module-link) basé sur ESM natif du navigateur

## Contexte technologique
Dans le développement de l'architecture de micro-frontend, les solutions traditionnelles présentent principalement les limites suivantes :

### Défis des solutions existantes
- **Goulot d'étranglement de performance** : L'injection de dépendances à l'exécution et le proxy de sandbox JavaScript entraînent des surcoûts de performance significatifs
- **Mécanisme d'isolation** : Les environnements de sandbox maison ont du mal à atteindre les capacités d'isolation de modules natifs du navigateur
- **Complexité de construction** : Les modifications des outils de construction pour partager les dépendances augmentent les coûts de maintenance du projet
- **Déviation des standards** : Les stratégies de déploiement spéciales et les mécanismes de traitement à l'exécution s'écartent des standards modernes de développement Web
- **Limites de l'écosystème** : Le couplage des frameworks et les API personnalisées limitent le choix de la pile technologique

### Innovations technologiques
Gez, basé sur les standards Web modernes, propose une nouvelle solution :

- **Système de modules natif** : Utilise ESM natif du navigateur et Import Maps pour la gestion des dépendances, offrant une vitesse d'analyse et d'exécution plus rapide
- **Mécanisme d'isolation standard** : Isolation fiable des applications basée sur la portée des modules ECMAScript
- **Pile technologique ouverte** : Supporte l'intégration transparente de n'importe quel framework frontend moderne
- **Expérience de développement optimisée** : Fournit un mode de développement intuitif et des capacités de débogage complètes
- **Optimisation de performance extrême** : Réalise zéro surcoût à l'exécution grâce aux capacités natives, avec une stratégie de cache intelligente

:::tip
Gez se concentre sur la création d'une infrastructure de micro-frontend haute performance et facilement extensible, particulièrement adaptée aux scénarios d'applications de rendu côté serveur à grande échelle.
:::

## Spécifications techniques

### Dépendances environnementales
Veuillez consulter le document [Exigences environnementales](/guide/start/environment) pour connaître les exigences détaillées du navigateur et de l'environnement Node.js.

### Pile technologique principale
- **Gestion des dépendances** : Utilise [Import Maps](https://caniuse.com/?search=import%20map) pour le mappage des modules, avec [es-module-shims](https://github.com/guybedford/es-module-shims) pour la compatibilité
- **Système de construction** : Basé sur [module-import](https://rspack.dev/config/externals#externalstypemodule-import) de Rspack pour le traitement des dépendances externes
- **Chaîne d'outils de développement** : Supporte la mise à jour à chaud ESM et l'exécution native de TypeScript

## Positionnement du framework
Gez diffère de [Next.js](https://nextjs.org) ou [Nuxt.js](https://nuxt.com/), se concentrant sur la fourniture d'une infrastructure de micro-frontend :

- **Système de liaison de modules** : Réalise une importation/exportation de modules efficace et fiable
- **Rendu côté serveur** : Fournit un mécanisme de mise en œuvre SSR flexible
- **Support du système de types** : Intègre des définitions de types TypeScript complètes
- **Neutralité du framework** : Supporte l'intégration des principaux frameworks frontend

## Conception de l'architecture

### Gestion centralisée des dépendances
- **Source de dépendances unifiée** : Gestion centralisée des dépendances tierces
- **Distribution automatique** : Synchronisation globale automatique des mises à jour des dépendances
- **Cohérence des versions** : Contrôle précis des versions des dépendances

### Conception modulaire
- **Séparation des responsabilités** : Découplage de la logique métier et de l'infrastructure
- **Mécanisme de plugins** : Supporte la combinaison et le remplacement flexibles des modules
- **Interface standard** : Protocole de communication normalisé entre les modules

### Optimisation des performances
- **Principe de zéro surcoût** : Maximise l'utilisation des capacités natives du navigateur
- **Cache intelligent** : Stratégie de cache précise basée sur le hachage du contenu
- **Chargement à la demande** : Gestion fine du fractionnement du code et des dépendances

## Maturité du projet
Gez, à travers près de 5 ans d'itérations et d'évolutions (de v1.0 à v3.0), a été entièrement validé dans des environnements d'entreprise. Il supporte actuellement des dizaines de projets métier en fonctionnement stable et continue de promouvoir la modernisation de la pile technologique. La stabilité, la fiabilité et les avantages de performance du framework ont été pleinement testés dans la pratique, fournissant une base technologique fiable pour le développement d'applications à grande échelle.
---