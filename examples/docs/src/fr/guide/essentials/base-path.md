---
titleSuffix: Guide de configuration des chemins des ressources statiques dans le framework Gez
description: Détaille la configuration des chemins de base dans le framework Gez, y compris le déploiement multi-environnements, la distribution CDN et la configuration des chemins d'accès aux ressources, aidant les développeurs à gérer de manière flexible les ressources statiques.
head:
  - - meta
    - property: keywords
      content: Gez, chemin de base, Base Path, CDN, ressources statiques, déploiement multi-environnements, gestion des ressources
---

# Chemin de base

Le chemin de base (Base Path) est le préfixe du chemin d'accès aux ressources statiques (comme JavaScript, CSS, images, etc.) dans une application. Dans Gez, une configuration appropriée du chemin de base est cruciale pour les scénarios suivants :

- **Déploiement multi-environnements** : Prend en charge l'accès aux ressources dans différents environnements tels que le développement, les tests et la production.
- **Déploiement multi-régions** : Adapte les besoins de déploiement en grappe pour différentes régions ou pays.
- **Distribution CDN** : Permet la distribution mondiale et l'accélération des ressources statiques.

## Mécanisme de chemin par défaut

Gez utilise un mécanisme de génération automatique de chemin basé sur le nom du service. Par défaut, le framework lit le champ `name` dans le fichier `package.json` du projet pour générer le chemin de base des ressources statiques : `/your-app-name/`.

```json title="package.json"
{
    "name": "your-app-name"
}
```

Cette conception basée sur des conventions plutôt que sur la configuration présente les avantages suivants :

- **Cohérence** : Assure que toutes les ressources statiques utilisent un chemin d'accès uniforme.
- **Prévisibilité** : Le chemin d'accès aux ressources peut être déduit à partir du champ `name` du fichier `package.json`.
- **Maintenabilité** : Aucune configuration supplémentaire n'est nécessaire, réduisant les coûts de maintenance.

## Configuration dynamique des chemins

Dans les projets réels, nous devons souvent déployer le même code dans différents environnements ou régions. Gez prend en charge les chemins de base dynamiques, permettant à l'application de s'adapter à différents scénarios de déploiement.

### Cas d'utilisation

#### Déploiement dans un répertoire secondaire
```
- example.com      -> Site principal par défaut
- example.com/cn/  -> Site en chinois
- example.com/en/  -> Site en anglais
```

#### Déploiement sur des domaines indépendants
```
- example.com    -> Site principal par défaut
- cn.example.com -> Site en chinois
- en.example.com -> Site en anglais
```

### Méthode de configuration

Grâce au paramètre `base` de la méthode `gez.render()`, vous pouvez définir dynamiquement le chemin de base en fonction du contexte de la requête :

```ts
const render = await gez.render({
    base: '/cn',  // Définir le chemin de base
    params: {
        url: req.url
    }
});
```