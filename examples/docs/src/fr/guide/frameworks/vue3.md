---
titleSuffix: Exemple d'application Vue3 SSR avec le framework Gez
description: Créez une application Vue3 SSR basée sur Gez à partir de zéro. Ce guide pratique montre les concepts de base du framework, y compris l'initialisation du projet, la configuration de Vue3 et la configuration des fichiers d'entrée.
head:
  - - meta
    - property: keywords
      content: Gez, Vue3, Application SSR, Configuration TypeScript, Initialisation de projet, Rendu côté serveur, Interaction côté client, API de composition
---

# Vue3

Ce tutoriel vous guidera dans la création d'une application Vue3 SSR basée sur Gez à partir de zéro. Nous allons explorer un exemple complet pour montrer comment utiliser le framework Gez pour créer une application avec rendu côté serveur (SSR).

## Structure du projet

Commençons par comprendre la structure de base du projet :

```bash
.
├── package.json         # Fichier de configuration du projet, définissant les dépendances et les scripts
├── tsconfig.json        # Fichier de configuration TypeScript, définissant les options de compilation
└── src                  # Répertoire du code source
    ├── app.vue          # Composant principal de l'application, définissant la structure et la logique d'interaction
    ├── create-app.ts    # Factory de création d'instance Vue, responsable de l'initialisation de l'application
    ├── entry.client.ts  # Fichier d'entrée côté client, gérant le rendu côté navigateur
    ├── entry.node.ts    # Fichier d'entrée Node.js, configurant l'environnement de développement et le démarrage du serveur
    └── entry.server.ts  # Fichier d'entrée côté serveur, gérant la logique de rendu SSR
```

## Configuration du projet

### package.json

Créez le fichier `package.json` pour configurer les dépendances et les scripts du projet :

```json title="package.json"
{
  "name": "ssr-demo-vue3",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "gez dev",
    "build": "npm run build:dts && npm run build:ssr",
    "build:ssr": "gez build",
    "preview": "gez preview",
    "start": "NODE_ENV=production node dist/index.js",
    "build:dts": "vue-tsc --declaration --emitDeclarationOnly --outDir dist/src"
  },
  "dependencies": {
    "@gez/core": "*"
  },
  "devDependencies": {
    "@gez/rspack-vue": "*",
    "@types/node": "22.8.6",
    "@vue/server-renderer": "^3.5.13",
    "typescript": "^5.7.3",
    "vue": "^3.5.13",
    "vue-tsc": "^2.1.6"
  }
}
```

Après avoir créé le fichier `package.json`, installez les dépendances du projet. Vous pouvez utiliser l'une des commandes suivantes :

```bash
pnpm install
# ou
yarn install
# ou
npm install
```

Cela installera tous les packages nécessaires, y compris Vue3, TypeScript et les dépendances liées au SSR.

### tsconfig.json

Créez le fichier `tsconfig.json` pour configurer les options de compilation TypeScript :

```json title="tsconfig.json"
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "node",
        "isolatedModules": true,
        "resolveJsonModule": true,
        
        "target": "ESNext",
        "lib": ["ESNext", "DOM"],
        
        "strict": true,
        "skipLibCheck": true,
        "types": ["@types/node"],
        
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        
        "baseUrl": ".",
        "paths": {
            "ssr-demo-vue3/src/*": ["./src/*"],
            "ssr-demo-vue3/*": ["./*"]
        }
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules"]
}
```

## Structure du code source

### app.vue

Créez le composant principal `src/app.vue` en utilisant l'API de composition de Vue3 :

```html title="src/app.vue"
<template>
    <div>
        <h1><a href="https://www.jsesm.com/guide/frameworks/vue3.html" target="_blank">Démarrage rapide avec Gez</a></h1>
        <time :datetime="time">{{ time }}</time>
    </div>
</template>

<script setup lang="ts">
/**
 * @file Composant d'exemple
 * @description Affiche un titre de page avec une horloge mise à jour automatiquement, démontrant les fonctionnalités de base de Gez
 */

import { onMounted, onUnmounted, ref } from 'vue';

// Heure actuelle, mise à jour toutes les secondes
const time = ref(new Date().toISOString());
let timer: NodeJS.Timeout;

onMounted(() => {
    timer = setInterval(() => {
        time.value = new Date().toISOString();
    }, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});
</script>
```

### create-app.ts

Créez le fichier `src/create-app.ts` pour créer l'instance Vue :

```ts title="src/create-app.ts"
/**
 * @file Création d'instance Vue
 * @description Responsable de la création et de la configuration de l'instance Vue
 */

import { createSSRApp } from 'vue';
import App from './app.vue';

export function createApp() {
    const app = createSSRApp(App);
    return {
        app
    };
}
```

### entry.client.ts

Créez le fichier d'entrée côté client `src/entry.client.ts` :

```ts title="src/entry.client.ts"
/**
 * @file Fichier d'entrée côté client
 * @description Gère la logique d'interaction côté client et les mises à jour dynamiques
 */

import { createApp } from './create-app';

// Crée l'instance Vue
const { app } = createApp();

// Monte l'instance Vue
app.mount('#app');
```

### entry.node.ts

Créez le fichier `entry.node.ts` pour configurer l'environnement de développement et démarrer le serveur :

```ts title="src/entry.node.ts"
/**
 * @file Fichier d'entrée Node.js
 * @description Configure l'environnement de développement et démarre le serveur, fournissant un environnement d'exécution SSR
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * Configure le créateur d'application pour l'environnement de développement
     * @description Crée et configure une instance Rspack pour la construction et la mise à jour en temps réel
     * @param gez Instance du framework Gez, fournissant des fonctionnalités et des interfaces de configuration
     * @returns Retourne une instance Rspack configurée, prenant en charge HMR et la prévisualisation en temps réel
     */
    async devApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue3App(gez, {
                config(context) {
                    // Personnalisez la configuration de compilation Rspack ici
                }
            })
        );
    },

    /**
     * Configure et démarre le serveur HTTP
     * @description Crée une instance de serveur HTTP, intègre les middlewares Gez et gère les requêtes SSR
     * @param gez Instance du framework Gez, fournissant des middlewares et des fonctionnalités de rendu
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // Utilise les middlewares Gez pour traiter les requêtes
            gez.middleware(req, res, async () => {
                // Exécute le rendu côté serveur
                const rc = await gez.render({
                    params: { url: req.url }
                });
                res.end(rc.html);
            });
        });

        server.listen(3000, () => {
            console.log('Serveur démarré : http://localhost:3000');
        });
    }
} satisfies GezOptions;
```

Ce fichier est le point d'entrée pour la configuration de l'environnement de développement et le démarrage du serveur. Il comprend deux fonctionnalités principales :

1. `devApp` : Crée et configure une instance Rspack pour l'environnement de développement, prenant en charge la mise à jour en temps réel et la prévisualisation.
2. `server` : Crée et configure un serveur HTTP, intégrant les middlewares Gez pour gérer les requêtes SSR.

### entry.server.ts

Créez le fichier d'entrée pour le rendu côté serveur `src/entry.server.ts` :

```ts title="src/entry.server.ts"
/**
 * @file Fichier d'entrée pour le rendu côté serveur
 * @description Gère le processus de rendu SSR, la génération de HTML et l'injection de ressources
 */

import type { RenderContext } from '@gez/core';
import { renderToString } from '@vue/server-renderer';
import { createApp } from './create-app';

export default async (rc: RenderContext) => {
    // Crée l'instance Vue
    const { app } = createApp();

    // Utilise renderToString pour générer le contenu de la page
    const html = await renderToString(app, {
        importMetaSet: rc.importMetaSet
    });

    // Valide la collecte des dépendances pour s'assurer que toutes les ressources nécessaires sont chargées
    await rc.commit();

    // Génère la structure HTML complète
    rc.html = `<!DOCTYPE html>
<html lang="fr">
<head>
    ${rc.preload()}
    <title>Démarrage rapide avec Gez</title>
    ${rc.css()}
</head>
<body>
    <div id="app">${html}</div>
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>
`;
};
```

## Exécution du projet

Après avoir configuré les fichiers ci-dessus, vous pouvez exécuter le projet avec les commandes suivantes :

1. Mode développement :
```bash
npm run dev
```

2. Construction du projet :
```bash
npm run build
```

3. Exécution en production :
```bash
npm run start
```

Félicitations ! Vous avez créé avec succès une application Vue3 SSR basée sur Gez. Visitez http://localhost:3000 pour voir le résultat.