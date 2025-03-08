"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["7237"],{7179:function(e,n,r){r.r(n),r.d(n,{default:()=>s});var a=r(1549),i=r(6603);function c(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code",h3:"h3",ol:"ol",li:"li"},(0,i.ah)(),e.components);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(n.h1,{id:"vue3",children:["Vue3",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#vue3",children:"#"})]}),"\n",(0,a.jsx)(n.p,{children:"Este tutorial te guiar\xe1 en la creaci\xf3n de una aplicaci\xf3n Vue3 SSR (Server-Side Rendering) utilizando el framework Gez. A trav\xe9s de un ejemplo completo, mostraremos c\xf3mo usar Gez para crear una aplicaci\xf3n con renderizado en el servidor."}),"\n",(0,a.jsxs)(n.h2,{id:"estructura-del-proyecto",children:["Estructura del proyecto",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#estructura-del-proyecto",children:"#"})]}),"\n",(0,a.jsx)(n.p,{children:"Primero, veamos la estructura b\xe1sica del proyecto:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:".\n├── package.json         # Archivo de configuraci\xf3n del proyecto, define dependencias y comandos de scripts\n├── tsconfig.json        # Archivo de configuraci\xf3n de TypeScript, establece opciones de compilaci\xf3n\n└── src                  # Directorio de c\xf3digo fuente\n    ├── app.vue          # Componente principal de la aplicaci\xf3n, define la estructura y l\xf3gica de la p\xe1gina\n    ├── create-app.ts    # F\xe1brica de creaci\xf3n de instancias de Vue, responsable de inicializar la aplicaci\xf3n\n    ├── entry.client.ts  # Archivo de entrada del cliente, maneja el renderizado en el navegador\n    ├── entry.node.ts    # Archivo de entrada del servidor Node.js, responsable de la configuraci\xf3n del entorno de desarrollo y el inicio del servidor\n    └── entry.server.ts  # Archivo de entrada del servidor, maneja la l\xf3gica de renderizado SSR\n"})}),"\n",(0,a.jsxs)(n.h2,{id:"configuraci\\xf3n-del-proyecto",children:["Configuraci\xf3n del proyecto",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#configuraci\\xf3n-del-proyecto",children:"#"})]}),"\n",(0,a.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crea el archivo ",(0,a.jsx)(n.code,{children:"package.json"})," para configurar las dependencias y scripts del proyecto:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n  "name": "ssr-demo-vue3",\n  "version": "1.0.0",\n  "type": "module",\n  "private": true,\n  "scripts": {\n    "dev": "gez dev",\n    "build": "npm run build:dts && npm run build:ssr",\n    "build:ssr": "gez build",\n    "preview": "gez preview",\n    "start": "NODE_ENV=production node dist/index.js",\n    "build:dts": "vue-tsc --declaration --emitDeclarationOnly --outDir dist/src"\n  },\n  "dependencies": {\n    "@gez/core": "*"\n  },\n  "devDependencies": {\n    "@gez/rspack-vue": "*",\n    "@types/node": "22.8.6",\n    "@vue/server-renderer": "^3.5.13",\n    "typescript": "^5.7.3",\n    "vue": "^3.5.13",\n    "vue-tsc": "^2.1.6"\n  }\n}\n'})}),"\n",(0,a.jsxs)(n.p,{children:["Despu\xe9s de crear el archivo ",(0,a.jsx)(n.code,{children:"package.json"}),", instala las dependencias del proyecto. Puedes usar cualquiera de los siguientes comandos para instalarlas:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pnpm install\n# o\nyarn install\n# o\nnpm install\n"})}),"\n",(0,a.jsx)(n.p,{children:"Esto instalar\xe1 todos los paquetes necesarios, incluyendo Vue3, TypeScript y las dependencias relacionadas con SSR."}),"\n",(0,a.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crea el archivo ",(0,a.jsx)(n.code,{children:"tsconfig.json"})," para configurar las opciones de compilaci\xf3n de TypeScript:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "module": "ESNext",\n        "moduleResolution": "node",\n        "isolatedModules": true,\n        "resolveJsonModule": true,\n        \n        "target": "ESNext",\n        "lib": ["ESNext", "DOM"],\n        \n        "strict": true,\n        "skipLibCheck": true,\n        "types": ["@types/node"],\n        \n        "experimentalDecorators": true,\n        "allowSyntheticDefaultImports": true,\n        \n        "baseUrl": ".",\n        "paths": {\n            "ssr-demo-vue3/src/*": ["./src/*"],\n            "ssr-demo-vue3/*": ["./*"]\n        }\n    },\n    "include": ["src"],\n    "exclude": ["dist", "node_modules"]\n}\n'})}),"\n",(0,a.jsxs)(n.h2,{id:"estructura-del-c\\xf3digo-fuente",children:["Estructura del c\xf3digo fuente",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#estructura-del-c\\xf3digo-fuente",children:"#"})]}),"\n",(0,a.jsxs)(n.h3,{id:"appvue",children:["app.vue",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#appvue",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crea el componente principal de la aplicaci\xf3n ",(0,a.jsx)(n.code,{children:"src/app.vue"}),", utilizando la API de composici\xf3n de Vue3:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-html",meta:'title="src/app.vue"',children:'<template>\n    <div>\n        <h1><a href="https://www.jsesm.com/guide/frameworks/vue3.html" target="_blank">Inicio r\xe1pido con Gez</a></h1>\n        <time :datetime="time">{{ time }}</time>\n    </div>\n</template>\n\n<script setup lang="ts">\n/**\n * @file Componente de ejemplo\n * @description Muestra un t\xedtulo de p\xe1gina con la hora actualizada autom\xe1ticamente, para demostrar las funcionalidades b\xe1sicas de Gez\n */\n\nimport { onMounted, onUnmounted, ref } from \'vue\';\n\n// Hora actual, actualizada cada segundo\nconst time = ref(new Date().toISOString());\nlet timer: NodeJS.Timeout;\n\nonMounted(() => {\n    timer = setInterval(() => {\n        time.value = new Date().toISOString();\n    }, 1000);\n});\n\nonUnmounted(() => {\n    clearInterval(timer);\n});\n<\/script>\n'})}),"\n",(0,a.jsxs)(n.h3,{id:"create-appts",children:["create-app.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#create-appts",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crea el archivo ",(0,a.jsx)(n.code,{children:"src/create-app.ts"}),", responsable de crear la instancia de la aplicaci\xf3n Vue:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/create-app.ts"',children:"/**\n * @file Creaci\xf3n de instancia de Vue\n * @description Responsable de crear y configurar la instancia de la aplicaci\xf3n Vue\n */\n\nimport { createSSRApp } from 'vue';\nimport App from './app.vue';\n\nexport function createApp() {\n    const app = createSSRApp(App);\n    return {\n        app\n    };\n}\n"})}),"\n",(0,a.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crea el archivo de entrada del cliente ",(0,a.jsx)(n.code,{children:"src/entry.client.ts"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.client.ts"',children:"/**\n * @file Archivo de entrada del cliente\n * @description Responsable de la l\xf3gica de interacci\xf3n del cliente y actualizaciones din\xe1micas\n */\n\nimport { createApp } from './create-app';\n\n// Crear la instancia de Vue\nconst { app } = createApp();\n\n// Montar la instancia de Vue\napp.mount('#app');\n"})}),"\n",(0,a.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crea el archivo ",(0,a.jsx)(n.code,{children:"entry.node.ts"}),", responsable de la configuraci\xf3n del entorno de desarrollo y el inicio del servidor:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"/**\n * @file Archivo de entrada del servidor Node.js\n * @description Responsable de la configuraci\xf3n del entorno de desarrollo y el inicio del servidor, proporcionando el entorno de ejecuci\xf3n SSR\n */\n\nimport http from 'node:http';\nimport type { GezOptions } from '@gez/core';\n\nexport default {\n    /**\n     * Configura el creador de la aplicaci\xf3n para el entorno de desarrollo\n     * @description Crea y configura la instancia de la aplicaci\xf3n Rspack, utilizada para la construcci\xf3n y actualizaci\xf3n en caliente en el entorno de desarrollo\n     * @param gez Instancia del framework Gez, proporciona funciones principales e interfaces de configuraci\xf3n\n     * @returns Devuelve la instancia de la aplicaci\xf3n Rspack configurada, compatible con HMR y vista previa en tiempo real\n     */\n    async devApp(gez) {\n        return import('@gez/rspack-vue').then((m) =>\n            m.createRspackVue3App(gez, {\n                config(context) {\n                    // Personaliza la configuraci\xf3n de compilaci\xf3n de Rspack aqu\xed\n                }\n            })\n        );\n    },\n\n    /**\n     * Configura e inicia el servidor HTTP\n     * @description Crea una instancia del servidor HTTP, integra el middleware de Gez y maneja las solicitudes SSR\n     * @param gez Instancia del framework Gez, proporciona middleware y funciones de renderizado\n     */\n    async server(gez) {\n        const server = http.createServer((req, res) => {\n            // Usar el middleware de Gez para manejar la solicitud\n            gez.middleware(req, res, async () => {\n                // Ejecutar el renderizado en el servidor\n                const rc = await gez.render({\n                    params: { url: req.url }\n                });\n                res.end(rc.html);\n            });\n        });\n\n        server.listen(3000, () => {\n            console.log('Servidor iniciado: http://localhost:3000');\n        });\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,a.jsx)(n.p,{children:"Este archivo es el punto de entrada para la configuraci\xf3n del entorno de desarrollo y el inicio del servidor, y contiene dos funciones principales:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"devApp"}),": Responsable de crear y configurar la instancia de la aplicaci\xf3n Rspack para el entorno de desarrollo, compatible con actualizaci\xf3n en caliente y vista previa en tiempo real."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"server"}),": Responsable de crear y configurar el servidor HTTP, integrando el middleware de Gez para manejar solicitudes SSR."]}),"\n"]}),"\n",(0,a.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crea el archivo de entrada para el renderizado en el servidor ",(0,a.jsx)(n.code,{children:"src/entry.server.ts"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"/**\n * @file Archivo de entrada para el renderizado en el servidor\n * @description Responsable del flujo de renderizado SSR, generaci\xf3n de HTML e inyecci\xf3n de recursos\n */\n\nimport type { RenderContext } from '@gez/core';\nimport { renderToString } from '@vue/server-renderer';\nimport { createApp } from './create-app';\n\nexport default async (rc: RenderContext) => {\n    // Crear la instancia de la aplicaci\xf3n Vue\n    const { app } = createApp();\n\n    // Usar renderToString de Vue para generar el contenido de la p\xe1gina\n    const html = await renderToString(app, {\n        importMetaSet: rc.importMetaSet\n    });\n\n    // Confirmar la recolecci\xf3n de dependencias, asegurando que todos los recursos necesarios se carguen\n    await rc.commit();\n\n    // Generar la estructura HTML completa\n    rc.html = `<!DOCTYPE html>\n<html lang=\"es-ES\">\n<head>\n    ${rc.preload()}\n    <title>Inicio r\xe1pido con Gez</title>\n    ${rc.css()}\n</head>\n<body>\n    <div id=\"app\">${html}</div>\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n</body>\n</html>\n`;\n};\n"})}),"\n",(0,a.jsxs)(n.h2,{id:"ejecutar-el-proyecto",children:["Ejecutar el proyecto",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#ejecutar-el-proyecto",children:"#"})]}),"\n",(0,a.jsx)(n.p,{children:"Despu\xe9s de configurar los archivos anteriores, puedes usar los siguientes comandos para ejecutar el proyecto:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"Modo de desarrollo:"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run dev\n"})}),"\n",(0,a.jsxs)(n.ol,{start:"2",children:["\n",(0,a.jsx)(n.li,{children:"Construir el proyecto:"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,a.jsxs)(n.ol,{start:"3",children:["\n",(0,a.jsx)(n.li,{children:"Ejecutar en producci\xf3n:"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,a.jsxs)(n.p,{children:["\xa1Ahora has creado con \xe9xito una aplicaci\xf3n Vue3 SSR utilizando el framework Gez! Visita ",(0,a.jsx)(n.a,{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer",children:"http://localhost:3000"})," para ver el resultado."]})]})}function t(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,i.ah)(),e.components);return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}let s=t;t.__RSPRESS_PAGE_META={},t.__RSPRESS_PAGE_META["es%2Fguide%2Fframeworks%2Fvue3.md"]={toc:[{text:"Estructura del proyecto",id:"estructura-del-proyecto",depth:2},{text:"Configuraci\xf3n del proyecto",id:"configuraci\xf3n-del-proyecto",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3},{text:"Estructura del c\xf3digo fuente",id:"estructura-del-c\xf3digo-fuente",depth:2},{text:"app.vue",id:"appvue",depth:3},{text:"create-app.ts",id:"create-appts",depth:3},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"Ejecutar el proyecto",id:"ejecutar-el-proyecto",depth:2}],title:"Vue3",headingTitle:"Vue3",frontmatter:{titleSuffix:"Ejemplo de aplicaci\xf3n Vue3 SSR con el framework Gez",description:"Aprende a crear una aplicaci\xf3n Vue3 SSR desde cero utilizando el framework Gez. Este tutorial muestra el uso b\xe1sico del framework, incluyendo la inicializaci\xf3n del proyecto, configuraci\xf3n de Vue3 y configuraci\xf3n de archivos de entrada.",head:[["meta",{property:"keywords",content:"Gez, Vue3, Aplicaci\xf3n SSR, Configuraci\xf3n TypeScript, Inicializaci\xf3n de proyecto, Renderizado en el servidor, Interacci\xf3n en el cliente, API de composici\xf3n"}]]}}}}]);