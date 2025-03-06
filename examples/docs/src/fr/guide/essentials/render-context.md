---
titleSuffix: Mécanisme de rendu côté serveur du framework Gez
description: Détails sur le mécanisme de contexte de rendu (RenderContext) du framework Gez, incluant la gestion des ressources, la génération de HTML et le système de modules ESM, pour aider les développeurs à comprendre et utiliser la fonctionnalité de rendu côté serveur.
head:
  - - meta
    - property: keywords
      content: Gez, contexte de rendu, RenderContext, SSR, rendu côté serveur, ESM, gestion des ressources
---

# Contexte de rendu

RenderContext est une classe centrale du framework Gez, principalement responsable de la gestion des ressources et de la génération de HTML pendant le processus de rendu côté serveur (SSR). Il possède les caractéristiques principales suivantes :

1. **Système de modules basé sur ESM**
   - Utilise le standard moderne ECMAScript Modules
   - Supporte l'importation et l'exportation natives de modules
   - Permet une meilleure division du code et un chargement à la demande

2. **Collecte intelligente des dépendances**
   - Collecte dynamiquement les dépendances en fonction du chemin de rendu réel
   - Évite le chargement inutile de ressources
   - Supporte les composants asynchrones et l'importation dynamique

3. **Injection précise des ressources**
   - Contrôle strict de l'ordre de chargement des ressources
   - Optimise les performances de chargement de la première page
   - Assure la fiabilité de l'activation côté client (Hydration)

4. **Mécanisme de configuration flexible**
   - Supporte la configuration dynamique du chemin de base
   - Fournit plusieurs modes de mappage d'importation
   - S'adapte à différents scénarios de déploiement

## Mode d'utilisation

Dans le framework Gez, les développeurs n'ont généralement pas besoin de créer directement une instance de RenderContext, mais peuvent obtenir une instance via la méthode `gez.render()` :

```ts title="src/entry.node.ts"
async server(gez) {
    const server = http.createServer((req, res) => {
        // Traitement des fichiers statiques
        gez.middleware(req, res, async () => {
            // Obtention d'une instance de RenderContext via gez.render()
            const rc = await gez.render({
                params: {
                    url: req.url
                }
            });
            // Réponse avec le contenu HTML
            res.end(rc.html);
        });
    });
}
```

## Fonctionnalités principales

### Collecte des dépendances

RenderContext implémente un mécanisme intelligent de collecte des dépendances, basé sur les composants réellement rendus pour collecter dynamiquement les dépendances, plutôt que de précharger simplement toutes les ressources potentielles :

#### Collecte à la demande
- Suit et enregistre automatiquement les dépendances des modules pendant le rendu des composants
- Collecte uniquement les ressources CSS, JavaScript, etc., réellement utilisées lors du rendu de la page actuelle
- Enregistre précisément les relations de dépendance des modules de chaque composant via `importMetaSet`
- Supporte la collecte des dépendances pour les composants asynchrones et l'importation dynamique

#### Traitement automatisé
- Les développeurs n'ont pas besoin de gérer manuellement le processus de collecte des dépendances
- Le framework collecte automatiquement les informations de dépendance lors du rendu des composants
- Traite toutes les ressources collectées via la méthode `commit()`
- Gère automatiquement les problèmes de dépendances circulaires et répétées

#### Optimisation des performances
- Évite le chargement de modules inutilisés, réduisant significativement le temps de chargement de la première page
- Contrôle précisément l'ordre de chargement des ressources, optimisant les performances de rendu de la page
- Génère automatiquement un mappage d'importation (Import Map) optimal
- Supporte les stratégies de préchargement et de chargement à la demande des ressources

### Injection des ressources

RenderContext fournit plusieurs méthodes pour injecter différents types de ressources, chaque méthode étant conçue pour optimiser les performances de chargement des ressources :

- `preload()` : Préchage les ressources CSS et JS, supporte la configuration des priorités
- `css()` : Injecte les feuilles de style pour la première page, supporte l'extraction des CSS critiques
- `importmap()` : Injecte le mappage d'importation des modules, supporte la résolution dynamique des chemins
- `moduleEntry()` : Injecte le module d'entrée côté client, supporte la configuration multi-entrées
- `modulePreload()` : Préchage les dépendances des modules, supporte la stratégie de chargement à la demande

### Ordre d'injection des ressources

RenderContext contrôle strictement l'ordre d'injection des ressources, cet ordre est conçu en fonction du fonctionnement du navigateur et des considérations d'optimisation des performances :

1. Partie head :
   - `preload()` : Préchage les ressources CSS et JS, permettant au navigateur de les découvrir et de commencer à les charger dès que possible
   - `css()` : Injecte les feuilles de style pour la première page, assurant que les styles de la page sont en place lors du rendu du contenu

2. Partie body :
   - `importmap()` : Injecte le mappage d'importation des modules, définissant les règles de résolution des chemins pour les modules ESM
   - `moduleEntry()` : Injecte le module d'entrée côté client, doit être exécuté après importmap
   - `modulePreload()` : Préchage les dépendances des modules, doit être exécuté après importmap

## Processus de rendu complet

Un processus typique d'utilisation de RenderContext est le suivant :

```ts title="src/entry.server.ts"
export default async (rc: RenderContext) => {
    // 1. Rend le contenu de la page et collecte les dépendances
    const app = createApp();
    const html = await renderToString(app, {
       importMetaSet: rc.importMetaSet
    });

    // 2. Soumet la collecte des dépendances
    await rc.commit();
    
    // 3. Génère le HTML complet
    rc.html = `
        <!DOCTYPE html>
        <html>
        <head>
            ${rc.preload()}
            ${rc.css()}
        </head>
        <body>
            ${html}
            ${rc.importmap()}
            ${rc.moduleEntry()}
            ${rc.modulePreload()}
        </body>
        </html>
    `;
};
```

## Fonctionnalités avancées

### Configuration du chemin de base

RenderContext fournit un mécanisme flexible de configuration dynamique du chemin de base, permettant de définir dynamiquement le chemin de base des ressources statiques lors de l'exécution :

```ts title="src/entry.node.ts"
const rc = await gez.render({
    base: '/gez',  // Définit le chemin de base
    params: {
        url: req.url
    }
});
```

Ce mécanisme est particulièrement utile dans les scénarios suivants :

1. **Déploiement de sites multilingues**
   ```
   domaine.com      → Langue par défaut
   domaine.com/cn/  → Site en chinois
   domaine.com/en/  → Site en anglais
   ```

2. **Applications micro-frontend**
   - Supporte le déploiement flexible des sous-applications sous différents chemins
   - Facilite l'intégration dans différentes applications principales

### Modes de mappage d'importation

RenderContext propose deux modes de mappage d'importation (Import Map) :

1. **Mode Inline** (par défaut)
   - Intègre directement le mappage d'importation dans le HTML
   - Convient aux petites applications, réduisant les requêtes réseau supplémentaires
   - Disponible immédiatement lors du chargement de la page

2. **Mode JS**
   - Charge le mappage d'importation via un fichier JavaScript externe
   - Convient aux grandes applications, permettant d'utiliser le mécanisme de cache du navigateur
   - Supporte la mise à jour dynamique du contenu du mappage

Il est possible de choisir le mode approprié via la configuration :

```ts title="src/entry.node.ts"
const rc = await gez.render({
    importmapMode: 'js',  // 'inline' | 'js'
    params: {
        url: req.url
    }
});
```

### Configuration de la fonction d'entrée

RenderContext supporte la configuration via `entryName` pour spécifier la fonction d'entrée pour le rendu côté serveur :

```ts title="src/entry.node.ts"
const rc = await gez.render({
    entryName: 'mobile',  // Spécifie l'utilisation de la fonction d'entrée mobile
    params: {
        url: req.url
    }
});
```

Ce mécanisme est particulièrement utile dans les scénarios suivants :

1. **Rendu multi-modèles**
   ```ts title="src/entry.server.ts"
   // Fonction d'entrée mobile
   export const mobile = async (rc: RenderContext) => {
       // Logique de rendu spécifique au mobile
   };

   // Fonction d'entrée desktop
   export const desktop = async (rc: RenderContext) => {
       // Logique de rendu spécifique au desktop
   };
   ```

2. **Tests A/B**
   - Supporte l'utilisation de différentes logiques de rendu pour la même page
   - Facilite les expériences utilisateur
   - Permet de basculer facilement entre différentes stratégies de rendu

3. **Besoins de rendu spéciaux**
   - Supporte l'utilisation de flux de rendu personnalisés pour certaines pages
   - S'adapte aux besoins d'optimisation des performances pour différents scénarios
   - Permet un contrôle plus fin du rendu

## Bonnes pratiques

1. **Obtention d'une instance de RenderContext**
   - Toujours obtenir une instance via la méthode `gez.render()`
   - Passer les paramètres appropriés selon les besoins
   - Éviter de créer manuellement des instances

2. **Collecte des dépendances**
   - S'assurer que tous les modules appellent correctement `importMetaSet.add(import.meta)`
   - Appeler immédiatement la méthode `commit()` après le rendu
   - Utiliser judicieusement les composants asynchrones et l'importation dynamique pour optimiser le chargement de la première page

3. **Injection des ressources**
   - Suivre strictement l'ordre d'injection des ressources
   - Ne pas injecter de CSS dans le body
   - S'assurer que importmap est exécuté avant moduleEntry

4. **Optimisation des performances**
   - Utiliser preload pour précharger les ressources critiques
   - Utiliser judicieusement modulePreload pour optimiser le chargement des modules
   - Éviter le chargement inutile de ressources
   - Exploiter le mécanisme de cache du navigateur pour optimiser les performances de chargement
```