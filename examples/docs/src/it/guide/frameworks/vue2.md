---
titleSuffix: Esempio di applicazione Vue2 SSR con il framework Gez
description: Impara a creare un'applicazione Vue2 SSR basata su Gez da zero, con un esempio pratico che mostra l'uso di base del framework, inclusa l'inizializzazione del progetto, la configurazione di Vue2 e l'impostazione dei file di ingresso.
head:
  - - meta
    - property: keywords
      content: Gez, Vue2, Applicazione SSR, Configurazione TypeScript, Inizializzazione progetto, Rendering lato server, Interazione lato client
---

# Vue2

Questo tutorial ti guiderà nella creazione di un'applicazione Vue2 SSR basata su Gez da zero. Attraverso un esempio completo, mostreremo come utilizzare il framework Gez per creare un'applicazione con rendering lato server.

## Struttura del progetto

Iniziamo con la struttura di base del progetto:

```bash
.
├── package.json         # File di configurazione del progetto, definisce le dipendenze e gli script
├── tsconfig.json        # File di configurazione TypeScript, imposta le opzioni di compilazione
└── src                  # Directory del codice sorgente
    ├── app.vue          # Componente principale dell'applicazione, definisce la struttura della pagina e la logica di interazione
    ├── create-app.ts    # Fabbrica di creazione dell'istanza Vue, responsabile dell'inizializzazione dell'applicazione
    ├── entry.client.ts  # File di ingresso lato client, gestisce il rendering nel browser
    ├── entry.node.ts    # File di ingresso del server Node.js, responsabile della configurazione dell'ambiente di sviluppo e dell'avvio del server
    └── entry.server.ts  # File di ingresso lato server, gestisce la logica di rendering SSR
```

## Configurazione del progetto

### package.json

Crea il file `package.json` per configurare le dipendenze e gli script del progetto:

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

Dopo aver creato il file `package.json`, è necessario installare le dipendenze del progetto. Puoi utilizzare uno dei seguenti comandi per l'installazione:
```bash
pnpm install
# oppure
yarn install
# oppure
npm install
```

Questo installerà tutti i pacchetti necessari, inclusi Vue2, TypeScript e le dipendenze relative a SSR.

### tsconfig.json

Crea il file `tsconfig.json` per configurare le opzioni di compilazione di TypeScript:

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

## Struttura del codice sorgente

### app.vue

Crea il componente principale dell'applicazione `src/app.vue`, utilizzando la sintassi `<script setup>`:

```html title="src/app.vue"
<template>
    <div id="app">
        <h1><a href="https://www.jsesm.com/guide/frameworks/vue2.html" target="_blank">Guida rapida a Gez</a></h1>
        <time :datetime="time">{{ time }}</time>
    </div>
</template>

<script setup lang="ts">
/**
 * @file Componente di esempio
 * @description Mostra un titolo di pagina con un orario aggiornato automaticamente, per dimostrare le funzionalità di base del framework Gez
 */

import { onMounted, onUnmounted, ref } from 'vue';

// Orario corrente, aggiornato ogni secondo
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

Crea il file `src/create-app.ts`, responsabile della creazione dell'istanza Vue:

```ts title="src/create-app.ts"
/**
 * @file Creazione dell'istanza Vue
 * @description Responsabile della creazione e configurazione dell'istanza Vue
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

Crea il file di ingresso lato client `src/entry.client.ts`:

```ts title="src/entry.client.ts"
/**
 * @file File di ingresso lato client
 * @description Responsabile della logica di interazione lato client e dell'aggiornamento dinamico
 */

import { createApp } from './create-app';

// Crea l'istanza Vue
const { app } = createApp();

// Monta l'istanza Vue
app.$mount('#app');
```

### entry.node.ts

Crea il file `entry.node.ts`, responsabile della configurazione dell'ambiente di sviluppo e dell'avvio del server:

```ts title="src/entry.node.ts"
/**
 * @file File di ingresso del server Node.js
 * @description Responsabile della configurazione dell'ambiente di sviluppo e dell'avvio del server, fornendo l'ambiente di runtime per SSR
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * Configura il creatore dell'applicazione per l'ambiente di sviluppo
     * @description Crea e configura l'istanza dell'applicazione Rspack, utilizzata per la costruzione e l'aggiornamento in tempo reale nell'ambiente di sviluppo
     * @param gez Istanza del framework Gez, fornisce funzionalità core e interfacce di configurazione
     * @returns Restituisce l'istanza configurata dell'applicazione Rspack, supporta HMR e anteprima in tempo reale
     */
    async devApp(gez) {
        return import('@gez/rspack-vue').then((m) =>
            m.createRspackVue2App(gez, {
                config(context) {
                    // Personalizza qui la configurazione di compilazione Rspack
                }
            })
        );
    },

    /**
     * Configura e avvia il server HTTP
     * @description Crea un'istanza del server HTTP, integra il middleware Gez e gestisce le richieste SSR
     * @param gez Istanza del framework Gez, fornisce middleware e funzionalità di rendering
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // Utilizza il middleware Gez per gestire le richieste
            gez.middleware(req, res, async () => {
                // Esegue il rendering lato server
                const rc = await gez.render({
                    params: { url: req.url }
                });
                res.end(rc.html);
            });
        });

        server.listen(3000, () => {
            console.log('Server avviato: http://localhost:3000');
        });
    }
} satisfies GezOptions;
```

Questo file è il punto di ingresso per la configurazione dell'ambiente di sviluppo e l'avvio del server, e include due funzionalità principali:

1. Funzione `devApp`: Responsabile della creazione e configurazione dell'istanza dell'applicazione Rspack per l'ambiente di sviluppo, supportando l'aggiornamento in tempo reale e l'anteprima. Qui viene utilizzato `createRspackVue2App` per creare un'istanza Rspack specifica per Vue2.
2. Funzione `server`: Responsabile della creazione e configurazione del server HTTP, integrando il middleware Gez per gestire le richieste SSR.

### entry.server.ts

Crea il file di ingresso per il rendering lato server `src/entry.server.ts`:

```ts title="src/entry.server.ts"
/**
 * @file File di ingresso per il rendering lato server
 * @description Responsabile del processo di rendering lato server, della generazione HTML e dell'iniezione delle risorse
 */

import type { RenderContext } from '@gez/core';
import { createRenderer } from 'vue-server-renderer';
import { createApp } from './create-app';

// Crea il renderer
const renderer = createRenderer();

export default async (rc: RenderContext) => {
    // Crea l'istanza Vue
    const { app } = createApp();

    // Utilizza renderToString di Vue per generare il contenuto della pagina
    const html = await renderer.renderToString(app, {
        importMetaSet: rc.importMetaSet
    });

    // Conferma la raccolta delle dipendenze, assicurandosi che tutte le risorse necessarie vengano caricate
    await rc.commit();

    // Genera la struttura HTML completa
    rc.html = `<!DOCTYPE html>
<html lang="it">
<head>
    ${rc.preload()}
    <title>Guida rapida a Gez</title>
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

## Esecuzione del progetto

Dopo aver completato la configurazione dei file, puoi eseguire il progetto utilizzando i seguenti comandi:

1. Modalità di sviluppo:
```bash
npm run dev
```

2. Costruzione del progetto:
```bash
npm run build
```

3. Esecuzione in produzione:
```bash
npm run start
```

Ora hai creato con successo un'applicazione Vue2 SSR basata su Gez! Visita http://localhost:3000 per vedere il risultato.