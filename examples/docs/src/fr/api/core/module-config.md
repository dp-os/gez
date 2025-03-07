---
titleSuffix: Référence de l'API de configuration des modules du framework Gez
description: Documentation détaillée de l'interface de configuration ModuleConfig du framework Gez, incluant les règles d'import/export de modules, la configuration des alias et la gestion des dépendances externes, pour aider les développeurs à comprendre en profondeur le système de modularité du framework.
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, configuration de modules, import/export de modules, dépendances externes, configuration d'alias, gestion des dépendances, framework d'application Web
---

# ModuleConfig

ModuleConfig fournit les fonctionnalités de configuration des modules du framework Gez, permettant de définir les règles d'import/export de modules, la configuration des alias et les dépendances externes.

## Définitions de types

### PathType

- **Définition de type**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

Énumération des types de chemins de modules :
- `npm`: représente les dépendances dans node_modules
- `root`: représente les fichiers dans le répertoire racine du projet

### ModuleConfig

- **Définition de type**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

Interface de configuration des modules, utilisée pour définir les configurations d'export, d'import et de dépendances externes d'un service.

#### exports

Liste de configuration des exports, exposant des unités de code spécifiques (composants, fonctions utilitaires, etc.) du service au format ESM.

Supporte deux types :
- `root:*`: exporte les fichiers sources, par exemple : 'root:src/components/button.vue'
- `npm:*`: exporte des dépendances tierces, par exemple : 'npm:vue'

#### imports

Mappage de configuration des imports, configurant les modules distants à importer et leurs chemins locaux.

La configuration varie selon le mode d'installation :
- Installation depuis les sources (Workspace, Git) : doit pointer vers le répertoire dist
- Installation depuis un package (Link, serveur statique, miroir privé, File) : pointe directement vers le répertoire du package

#### externals

Mappage des dépendances externes, configurant les dépendances externes à utiliser, généralement des dépendances provenant de modules distants.

**Exemple** :
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Configuration des exports
    exports: [
      'root:src/components/button.vue',  // Exporte un fichier source
      'root:src/utils/format.ts',
      'npm:vue',  // Exporte une dépendance tierce
      'npm:vue-router'
    ],

    // Configuration des imports
    imports: {
      // Installation depuis les sources : doit pointer vers le répertoire dist
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // Installation depuis un package : pointe directement vers le répertoire du package
      'other-remote': 'root:./node_modules/other-remote'
    },

    // Configuration des dépendances externes
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **Définition de type**:
```ts
interface ParsedModuleConfig {
  name: string
  root: string
  exports: {
    name: string
    type: PathType
    importName: string
    exportName: string
    exportPath: string
    externalName: string
  }[]
  imports: {
    name: string
    localPath: string
  }[]
  externals: Record<string, { match: RegExp; import?: string }>
}
```

Configuration des modules après analyse, convertissant la configuration originale des modules en un format interne standardisé :

#### name
Nom du service actuel
- Utilisé pour identifier le module et générer les chemins d'import

#### root
Chemin du répertoire racine du service actuel
- Utilisé pour résoudre les chemins relatifs et stocker les artefacts de construction

#### exports
Liste de configuration des exports
- `name`: chemin d'export original, par exemple : 'npm:vue' ou 'root:src/components'
- `type`: type de chemin (npm ou root)
- `importName`: nom d'import, format : '${serviceName}/${type}/${path}'
- `exportName`: chemin d'export, relatif au répertoire racine du service
- `exportPath`: chemin réel du fichier
- `externalName`: nom de la dépendance externe, utilisé comme identifiant lors de l'import de ce module par d'autres services

#### imports
Liste de configuration des imports
- `name`: nom du service externe
- `localPath`: chemin de stockage local, utilisé pour stocker les artefacts de construction des modules externes

#### externals
Mappage des dépendances externes
- Mappe les chemins d'import des modules vers leurs emplacements réels
- `match`: expression régulière utilisée pour correspondre aux instructions d'import
- `import`: chemin réel du module
```