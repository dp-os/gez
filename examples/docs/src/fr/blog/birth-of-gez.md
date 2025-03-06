---
titleSuffix: "Des défis du micro-frontend à l'innovation ESM : L'évolution du framework Gez"
description: Explorez en profondeur l'évolution du framework Gez, des défis de l'architecture micro-frontend traditionnelle aux innovations basées sur ESM, en partageant des expériences pratiques sur l'optimisation des performances, la gestion des dépendances et le choix des outils de build.
head:
  - - meta
    - property: keywords
      content: Gez, framework micro-frontend, ESM, Import Maps, Rspack, Module Federation, gestion des dépendances, optimisation des performances, évolution technique, rendu côté serveur
sidebar: false
---

# Du partage de composants à la modularité native : L'évolution du framework micro-frontend Gez

## Contexte du projet

Au cours des dernières années, l'architecture micro-frontend a cherché à trouver la bonne voie. Cependant, nous avons été témoins de diverses solutions techniques complexes qui, à travers des couches d'emballage et d'isolation artificielle, tentent de simuler un monde idéal de micro-frontend. Ces solutions ont entraîné des coûts de performance élevés, rendant le développement simple complexe et les processus standards obscurs.

### Limites des solutions traditionnelles

Dans la pratique de l'architecture micro-frontend, nous avons constaté de nombreuses limitations des solutions traditionnelles :

- **Perte de performance** : L'injection de dépendances au runtime, le proxy du sandbox JS, chaque opération consomme des performances précieuses.
- **Isolation fragile** : Les environnements de sandbox artificiels ne peuvent jamais atteindre les capacités d'isolation natives du navigateur.
- **Complexité de construction** : Pour gérer les dépendances, il est nécessaire de modifier les outils de build, rendant les projets simples difficiles à maintenir.
- **Règles personnalisées** : Les stratégies de déploiement spéciales et le traitement au runtime éloignent chaque étape des processus de développement modernes standards.
- **Limites de l'écosystème** : Le couplage des frameworks et les API personnalisées contraignent les choix techniques à un écosystème spécifique.

Ces problèmes ont été particulièrement évidents dans un projet d'entreprise en 2019. À l'époque, un grand produit a été divisé en une dizaine de sous-systèmes métiers indépendants, qui devaient partager un ensemble de composants de base et de composants métiers. La solution initiale de partage de composants basée sur des packages npm a révélé de graves problèmes d'efficacité de maintenance : lorsque les composants partagés étaient mis à jour, tous les sous-systèmes dépendant de ces composants devaient subir un processus complet de build et de déploiement.

## Évolution technique

### v1.0 : Exploration des composants distants

Pour résoudre les problèmes d'efficacité du partage de composants, Gez v1.0 a introduit un mécanisme de composant RemoteView basé sur le protocole HTTP. Cette solution a permis l'assemblage dynamique de code entre services au runtime, résolvant ainsi les problèmes de chaînes de dépendances de build trop longues. Cependant, en raison de l'absence de mécanisme de communication standardisé au runtime, la synchronisation des états et la transmission d'événements entre services restaient inefficaces.

### v2.0 : Tentative de Module Federation

Dans la version v2.0, nous avons adopté la technologie [Module Federation](https://webpack.js.org/concepts/module-federation/) de [Webpack 5.0](https://webpack.js.org/). Cette technologie a significativement amélioré l'efficacité de la collaboration entre services grâce à un mécanisme unifié de chargement de modules et des conteneurs au runtime. Cependant, dans des pratiques à grande échelle, le mécanisme fermé de Module Federation a posé de nouveaux défis : il était difficile de gérer précisément les versions des dépendances, en particulier lors de l'unification des dépendances partagées entre plusieurs services, où des conflits de versions et des exceptions au runtime étaient fréquents.

## Embrasser l'ère nouvelle de l'ESM

Lors de la planification de la version v3.0, nous avons observé en profondeur les tendances de l'écosystème frontend et constaté que les progrès des capacités natives des navigateurs offraient de nouvelles possibilités pour l'architecture micro-frontend :

### Système de modules standardisé

Avec le support complet des [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) par les principaux navigateurs et la maturité de la spécification [Import Maps](https://github.com/WICG/import-maps), le développement frontend est entré dans une véritable ère de modularité. Selon les statistiques de [Can I Use](https://caniuse.com/?search=importmap), le taux de support natif de l'ESM par les principaux navigateurs (Chrome >= 89, Edge >= 89, Firefox >= 108, Safari >= 16.4) a atteint 93,5%, ce qui nous offre les avantages suivants :

- **Gestion standardisée des dépendances** : Import Maps permet de résoudre les dépendances de modules au niveau du navigateur, sans injection complexe au runtime.
- **Optimisation du chargement des ressources** : Le mécanisme de cache natif des modules du navigateur améliore significativement l'efficacité du chargement des ressources.
- **Simplification du processus de build** : Le mode de développement basé sur ESM rend les processus de build des environnements de développement et de production plus cohérents.

En outre, grâce au support du mode de compatibilité (Chrome >= 87, Edge >= 88, Firefox >= 78, Safari >= 14), nous pouvons augmenter la couverture des navigateurs à 96,81%, ce qui nous permet de maintenir des performances élevées tout en supportant les anciennes versions de navigateurs.

### Percées en performance et isolation

Le système de modules natif apporte non seulement une standardisation, mais aussi une amélioration qualitative des performances et de l'isolation :

- **Aucun coût au runtime** : Finis les proxys de sandbox JavaScript et les injections au runtime des solutions micro-frontend traditionnelles.
- **Mécanisme d'isolation fiable** : La portée stricte des modules ESM fournit naturellement la meilleure isolation possible.
- **Gestion précise des dépendances** : L'analyse statique des imports rend les relations de dépendances plus claires et le contrôle des versions plus précis.

### Choix des outils de build

Dans la mise en œuvre de la solution technique, le choix des outils de build a été un point de décision clé. Après près d'un an de recherche et de pratique, notre choix a évolué comme suit :

1. **Exploration de Vite**
   - Avantages : Serveur de développement basé sur ESM, offrant une expérience de développement ultime.
   - Défis : Les différences de build entre les environnements de développement et de production introduisent une certaine incertitude.

2. **Établissement de [Rspack](https://www.rspack.dev/)**
   - Avantages de performance : Compilation haute performance basée sur [Rust](https://www.rust-lang.org/), améliorant significativement la vitesse de build.
   - Support de l'écosystème : Haute compatibilité avec l'écosystème Webpack, réduisant les coûts de migration.
   - Support ESM : La pratique du projet Rslib a validé la fiabilité de Rspack pour les builds ESM.

Cette décision nous a permis de maintenir une expérience de développement tout en obtenant un support plus stable pour l'environnement de production. En combinant ESM et Rspack, nous avons finalement construit une solution micro-frontend haute performance et peu intrusive.

## Perspectives futures

Dans les plans de développement futurs, le framework Gez se concentrera sur les trois directions suivantes :

### Optimisation approfondie des Import Maps

- **Gestion dynamique des dépendances** : Mise en œuvre d'une planification intelligente des versions des dépendances au runtime, résolvant les conflits de dépendances entre plusieurs applications.
- **Stratégie de préchargement** : Préchargement intelligent basé sur l'analyse des routes, améliorant l'efficacité du chargement des ressources.
- **Optimisation du build** : Génération automatique de configurations optimales d'Import Maps, réduisant les coûts de configuration manuelle pour les développeurs.

### Solution de routage indépendante du framework

- **Abstraction unifiée du routage** : Conception d'une interface de routage indépendante du framework, supportant Vue, React et d'autres frameworks populaires.
- **Routage des micro-applications** : Mise en œuvre de la coordination des routes entre applications, maintenant la cohérence entre l'URL et l'état de l'application.
- **Middleware de routage** : Fourniture d'un mécanisme de middleware extensible, supportant le contrôle des permissions, les transitions de page, etc.

### Meilleures pratiques de communication inter-frameworks

- **Application exemple** : Fourniture d'un exemple complet de communication inter-frameworks, couvrant Vue, React, Preact et d'autres frameworks populaires.
- **Synchronisation des états** : Solution légère de partage d'état basée sur ESM.
- **Bus d'événements** : Mécanisme de communication d'événements standardisé, supportant la communication découplée entre applications.

Grâce à ces optimisations et extensions, nous espérons faire de Gez une solution micro-frontend plus complète et facile à utiliser, offrant aux développeurs une meilleure expérience de développement et une efficacité accrue.