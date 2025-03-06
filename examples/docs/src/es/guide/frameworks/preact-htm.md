---
titleSuffix: Ejemplo de aplicación Preact+HTM SSR con el framework Gez
description: Aprende a crear una aplicación Preact+HTM SSR desde cero utilizando el framework Gez. Este tutorial muestra el uso básico del framework, incluyendo la inicialización del proyecto, configuración de Preact y configuración de archivos de entrada.
head:
  - - meta
    - property: keywords
      content: Gez, Preact, HTM, Aplicación SSR, Configuración TypeScript, Inicialización de proyecto, Renderizado en el servidor, Interacción en el cliente
---

# Preact+HTM

Este tutorial te guiará en la creación de una aplicación Preact+HTM SSR desde cero utilizando el framework Gez. A través de un ejemplo completo, mostraremos cómo usar el framework Gez para crear una aplicación con renderizado en el servidor (SSR).

## Estructura del proyecto

Primero, veamos la estructura básica del proyecto:

```bash
.
├── package.json         # Archivo de configuración del proyecto, define dependencias y comandos de script
├── tsconfig.json        # Archivo de configuración de TypeScript, establece opciones de compilación
└── src                  # Directorio de código fuente
    ├── app.ts           # Componente principal de la aplicación, define la estructura de la página y la lógica de interacción
    ├── create-app.ts    # Fábrica de creación de instancias de la aplicación, responsable de inicializar la aplicación
    ├── entry.client.ts  # Archivo de entrada del cliente, maneja el renderizado en el navegador
    ├── entry.node.ts    # Archivo de entrada del servidor Node.js, responsable de la configuración del entorno de desarrollo y el inicio del servidor
    └── entry.server.ts  # Archivo de entrada del servidor, maneja la lógica de renderizado SSR
```

## Configuración del proyecto

### package.json

Crea el archivo `package.json` para configurar las dependencias y scripts del proyecto:

```json title="package.json"
{
  "name": "ssr-demo-preact-htm",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "gez dev",
    "build": "npm run build:dts && npm run build:ssr",
    "build:ssr": "gez build",
    "preview": "gez preview",
    "start": "NODE_ENV=production node dist/index.js",
    "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src"
  },
  "dependencies": {
    "@gez/core": "*"
  },
  "devDependencies": {
    "@gez/rspack": "*",
    "@types/node": "22.8.6",
    "htm": "^3.1.1",
    "preact": "^10.26.2",
    "preact-render-to-string": "^6.5.13",
    "typescript": "^5.2.2"
  }
}
```

Después de crear el archivo `package.json`, necesitas instalar las dependencias del proyecto. Puedes usar cualquiera de los siguientes comandos para instalarlas:
```bash
pnpm install
# o
yarn install
# o
npm install
```

Esto instalará todos los paquetes necesarios, incluyendo Preact, HTM, TypeScript y las dependencias relacionadas con SSR.

### tsconfig.json

Crea el archivo `tsconfig.json` para configurar las opciones de compilación de TypeScript:

```json title="tsconfig.json"
{
    "compilerOptions": {
        "isolatedModules": true,
        "experimentalDecorators": true,
        "resolveJsonModule": true,
        "types": [
            "@types/node"
        ],
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "node",
        "strict": true,
        "skipLibCheck": true,
        "allowSyntheticDefaultImports": true,
        "paths": {
            "ssr-demo-preact-htm/src/*": [
                "./src/*"
            ],
            "ssr-demo-preact-htm/*": [
                "./*"
            ]
        }
    },
    "include": [
        "src"
    ],
    "exclude": [
        "dist"
    ]
}
```

## Estructura del código fuente

### app.ts

Crea el componente principal de la aplicación en `src/app.ts`, utilizando componentes de clase de Preact y HTM:

```ts title="src/app.ts"
/**
 * @file Componente de ejemplo
 * @description Muestra un título de página con la hora actualizada automáticamente, para demostrar las funcionalidades básicas del framework Gez
 */

import { Component } from 'preact';
import { html } from 'htm/preact';

export default class App extends Component {
    state = {
        time: new Date().toISOString()
    };

    timer: NodeJS.Timeout | null = null;

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                time: new Date().toISOString()
            });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    render() {
        const { time } = this.state;
        return html`
            <div>
                <h1><a href="https://www.jsesm.com/guide/frameworks/preact-htm.html" target="_blank">Inicio rápido con Gez</a></h1>
                <time datetime=${time}>${time}</time>
            </div>
        `;
    }
}
```

### create-app.ts

Crea el archivo `src/create-app.ts`, responsable de crear la instancia de la aplicación:

```ts title="src/create-app.ts"
/**
 * @file Creación de instancia de la aplicación
 * @description Responsable de crear y configurar la instancia de la aplicación
 */

import type { VNode } from 'preact';
import { html } from 'htm/preact';
import App from './app';

export function createApp(): { app: VNode } {
    const app = html`<${App} />`;
    return {
        app
    };
}
```

### entry.client.ts

Crea el archivo de entrada del cliente `src/entry.client.ts`:

```ts title="src/entry.client.ts"
/**
 * @file Archivo de entrada del cliente
 * @description Responsable de la lógica de interacción del cliente y actualización dinámica
 */

import { render } from 'preact';
import { createApp } from './create-app';

// Crear instancia de la aplicación
const { app } = createApp();

// Montar la instancia de la aplicación
render(app, document.getElementById('app')!);
```

### entry.node.ts

Crea el archivo `entry.node.ts`, responsable de la configuración del entorno de desarrollo y el inicio del servidor:

```ts title="src/entry.node.ts"
/**
 * @file Archivo de entrada del servidor Node.js
 * @description Responsable de la configuración del entorno de desarrollo y el inicio del servidor, proporcionando el entorno de ejecución SSR
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * Configura el creador de la aplicación para el entorno de desarrollo
     * @description Crea y configura la instancia de la aplicación Rspack, utilizada para la construcción y actualización en caliente en el entorno de desarrollo
     * @param gez Instancia del framework Gez, proporciona funciones principales e interfaces de configuración
     * @returns Devuelve la instancia de la aplicación Rspack configurada, compatible con HMR y vista previa en tiempo real
     */
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                config(context) {
                    // Personaliza la configuración de compilación de Rspack aquí
                }
            })
        );
    },

    /**
     * Configura e inicia el servidor HTTP
     * @description Crea una instancia del servidor HTTP, integra middleware de Gez y maneja solicitudes SSR
     * @param gez Instancia del framework Gez, proporciona middleware y funciones de renderizado
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // Usar middleware de Gez para manejar la solicitud
            gez.middleware(req, res, async () => {
                // Ejecutar el renderizado en el servidor
                const rc = await gez.render({
                    params: { url: req.url }
                });
                res.end(rc.html);
            });
        });

        server.listen(3000, () => {
            console.log('Servidor iniciado: http://localhost:3000');
        });
    }
} satisfies GezOptions;
```

Este archivo es el punto de entrada para la configuración del entorno de desarrollo y el inicio del servidor, y contiene dos funciones principales:

1. `devApp`: Responsable de crear y configurar la instancia de la aplicación Rspack para el entorno de desarrollo, compatible con actualización en caliente y vista previa en tiempo real. Aquí se utiliza `createRspackHtmlApp` para crear una instancia de la aplicación Rspack específica para Preact+HTM.
2. `server`: Responsable de crear y configurar el servidor HTTP, integrando middleware de Gez para manejar solicitudes SSR.

### entry.server.ts

Crea el archivo de entrada para el renderizado en el servidor `src/entry.server.ts`:

```ts title="src/entry.server.ts"
/**
 * @file Archivo de entrada para el renderizado en el servidor
 * @description Responsable del flujo de renderizado en el servidor, generación de HTML e inyección de recursos
 */

import type { RenderContext } from '@gez/core';
import type { VNode } from 'preact';
import { render } from 'preact-render-to-string';
import { createApp } from './create-app';

export default async (rc: RenderContext) => {
    // Crear instancia de la aplicación
    const { app } = createApp();

    // Usar renderToString de Preact para generar el contenido de la página
    const html = render(app);

    // Confirmar la recolección de dependencias, asegurando que todos los recursos necesarios se carguen
    await rc.commit();

    // Generar la estructura HTML completa
    rc.html = `<!DOCTYPE html>
<html lang="es">
<head>
    ${rc.preload()}
    <title>Inicio rápido con Gez</title>
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

## Ejecución del proyecto

Después de configurar los archivos anteriores, puedes usar los siguientes comandos para ejecutar el proyecto:

1. Modo de desarrollo:
```bash
npm run dev
```

2. Construir el proyecto:
```bash
npm run build
```

3. Ejecutar en producción:
```bash
npm run start
```

¡Ahora has creado con éxito una aplicación Preact+HTM SSR basada en Gez! Visita http://localhost:3000 para ver el resultado.