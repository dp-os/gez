---
titleSuffix: Exemple d'application Vue2 SSR avec le framework Gez
description: Créez une application Vue2 SSR basée sur Gez à partir de zéro. Ce guide vous montre les bases du framework à travers un exemple complet, incluant l'initialisation du projet, la configuration de Vue2 et la mise en place des fichiers d'entrée.
head:
  - - meta
    - property: keywords
      content: Gez, Vue2, application SSR, configuration TypeScript, initialisation de projet, rendu côté serveur, interaction côté client
---

# Vue2

Ce tutoriel vous guidera dans la création d'une application Vue2 SSR basée sur Gez à partir de zéro. Nous allons explorer un exemple complet pour illustrer comment utiliser le framework Gez pour créer une application avec rendu côté serveur (SSR).

## Structure du projet

Commençons par comprendre la structure de base du projet :

```bash
.
├── package.json         # Fichier de configuration du projet, définissant les dépendances et les scripts
├── tsconfig.json        # Fichier de configuration TypeScript, définissant les options de compilation
└── src                  # Répertoire du code source
    ├── app.vue          # Composant principal de l'application, définissant la structure et la logique de la page
    ├── create-app.ts    # Factory de création d'instance Vue, responsable de l'initialisation de l'application
    ├── entry.client.ts  # Fichier d'entrée côté client, gérant le rendu côté navigateur
    ├── entry.node.ts    # Fichier d'entrée Node.js, responsable de la configuration de l'environnement de développement et du démarrage du serveur
    └── entry.server.ts  # Fichier d'entrée côté serveur, gérant la logique de rendu SSR
```

## Configuration du projet

### package.json

Créez le fichier `package.json` pour configurer les dépendances et les scripts du projet :

```json title="package.json"
{
  "name": "ssr-demo-vue2",
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
    "typescript": "^5.7.3",
    "vue": "^2.7.16",
    "vue-server-renderer": "^2.7.16",
    "vue-tsc": "^2.1.6"
  }
}
```

Après avoir créé le fichier `package.json`, installez les dépendances du projet. Vous pouvez utiliser l'une des commandes suivantes pour l'installation :
```bash
pnpm install
# ou
yarn install
# ou
npm install
```

Cela installera tous les packages nécessaires, y compris Vue2, TypeScript et les dépendances liées au SSR.

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
            "ssr-demo-vue2/src/*": ["./src/*"],
            "ssr-demo-vue2/*": ["./*"]
        }
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules"]
}
```

## Structure du code source

### app.vue

Créez le composant principal `src/app.vue`, en utilisant la syntaxe `<script setup>` :

```html title="src/app.vue"
<template>
    <div id="app">
        <h1><a href="https://www.jsesm.com/guide/frameworks/vue2.html" target="_blank">Démarrage rapide avec Gez</a></h1>
        <time :datetime="time">{{ time }}</time>
    </div>
</template>

<script setup lang="ts">
/**
 * @file Composant d'exemple
 * @description Affiche un titre de page avec une horloge mise à jour automatiquement, démontrant les fonctionnalités de base de Gez
 */

import { onMounted, onUnmounted, ref } from 'vue';

// Heure actuelle, mise à jour chaque seconde
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

Créez le fichier `src/create-app.ts`, responsable de la création de l'instance Vue :

```ts title="src/create-app.ts"
/**
 * @file Création d'instance Vue
 * @description Responsable de la création et de la configuration de l'instance Vue
 */

import Vue from 'vue';
import App from './app.vue';

export function createApp() {
    const app = new Vue({
        render: (h) => h(App)
    });
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
 * @description Responsable de la logique d'interaction côté client et des mises à jour dynamiques
 */

import { createApp } from './create-app';

// Créez l'instance Vue
const { app } = createApp();

// Montez l'instance Vue
app.$mount('#app');
```

### entry.node.ts

Créez le fichier `entry.node.ts`, responsable de la configuration de l'environnement de développement et du démarrage du serveur :

```ts title="src/entry.node.ts"
/**
 * @file Fichier d'entrée Node.js
 * @description Responsable de la configuration de l'environnement de développement et du démarrage du serveur, fournissant l'environnement d'exécution SSR
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * Configure l'application de développement
     * @description Crée et configure l'instance Rspack pour l'environnement de développement, prenant en charge la construction et la mise à jour en temps réel
     * @param gez Instance Gez, fournissant les fonctionnalités principales et les interfaces de configuration
     * @returns Retourne l'instance Rspack configurée, prenant en charge HMR et la prévisualisation en temps réel
     */
    async devApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez, {
                config(context) {
                    // Personnalisez ici la configuration de compilation Rspack
                }
            })
        );
    },

    /**
     * Configure et démarre le serveur HTTP
     * @description Crée une instance de serveur HTTP, intègre les middlewares Gez et gère les requêtes SSR
     * @param gez Instance Gez, fournissant les middlewares et les fonctionnalités de rendu
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // Utilisez les middlewares Gez pour traiter les requêtes
            gez.middleware(req, res, async () => {
                // Exécutez le rendu côté serveur
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

Ce fichier est le point d'entrée pour la configuration de l'environnement de développement et le démarrage du serveur. Il contient deux fonctionnalités principales :

1. `devApp` : Responsable de la création et de la configuration de l'instance Rspack pour l'environnement de développement, prenant en charge la mise à jour en temps réel et la prévisualisation. Ici, `createRspackVue2App` est utilisé pour créer une instance Rspack spécifique à Vue2.
2. `server` : Responsable de la création et de la configuration du serveur HTTP, intégrant les middlewares Gez pour traiter les requêtes SSR.

### entry.server.ts

Créez le fichier d'entrée côté serveur `src/entry.server.ts` :

```ts title="src/entry.server.ts"
/**
 * @file Fichier d'entrée côté serveur
 * @description Responsable du processus de rendu côté serveur, de la génération du HTML et de l'injection des ressources
 */

import type { RenderContext } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

// Créez le renderer
const renderer = createRenderer();

export default async (rc: RenderContext) => {
    // Créez l'instance Vue
    const { app } = createApp();

    // Utilisez renderToString de Vue pour générer le contenu de la page
    const html = await renderer.renderToString(app, {
        importMetaSet: rc.importMetaSet
    });

    // Validez la collecte des dépendances pour s'assurer que toutes les ressources nécessaires sont chargées
    await rc.commit();

    // Générez la structure HTML complète
    rc.html = `<!DOCTYPE html>
<html lang="fr">
<head>
    ${rc.preload()}
    <title>Démarrage rapide avec Gez</title>
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

Félicitations ! Vous avez créé avec succès une application Vue2 SSR basée sur Gez. Visitez http://localhost:3000 pour voir le résultat.