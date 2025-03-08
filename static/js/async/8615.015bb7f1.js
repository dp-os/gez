"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["8615"],{7606:function(e,n,r){r.r(n),r.d(n,{default:()=>a});var t=r(1549),i=r(6603);function s(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code",h3:"h3",ol:"ol",li:"li"},(0,i.ah)(),e.components);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h1,{id:"vue2",children:["Vue2",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#vue2",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"Dieses Tutorial hilft Ihnen dabei, eine Vue2 SSR-Anwendung mit Gez von Grund auf zu erstellen. Wir werden anhand eines vollst\xe4ndigen Beispiels zeigen, wie Sie mit dem Gez-Framework eine serverseitig gerenderte Anwendung erstellen k\xf6nnen."}),"\n",(0,t.jsxs)(n.h2,{id:"projektstruktur",children:["Projektstruktur",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#projektstruktur",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"Zun\xe4chst werfen wir einen Blick auf die grundlegende Projektstruktur:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:".\n├── package.json         # Projektkonfigurationsdatei, definiert Abh\xe4ngigkeiten und Skriptbefehle\n├── tsconfig.json        # TypeScript-Konfigurationsdatei, legt Compiler-Optionen fest\n└── src                  # Quellcode-Verzeichnis\n    ├── app.vue          # Hauptanwendungskomponente, definiert Seitenstruktur und Interaktionslogik\n    ├── create-app.ts    # Vue-Instanz-Erstellungsfabrik, verantwortlich f\xfcr die Initialisierung der Anwendung\n    ├── entry.client.ts  # Client-Einstiegspunktdatei, verarbeitet das Rendering im Browser\n    ├── entry.node.ts    # Node.js-Server-Einstiegspunktdatei, verantwortlich f\xfcr die Entwicklungsumgebungskonfiguration und Serverstart\n    └── entry.server.ts  # Server-Einstiegspunktdatei, verarbeitet das SSR-Rendering\n"})}),"\n",(0,t.jsxs)(n.h2,{id:"projektkonfiguration",children:["Projektkonfiguration",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#projektkonfiguration",children:"#"})]}),"\n",(0,t.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["Erstellen Sie die ",(0,t.jsx)(n.code,{children:"package.json"}),"-Datei und konfigurieren Sie die Projektabh\xe4ngigkeiten und Skripte:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n  "name": "ssr-demo-vue2",\n  "version": "1.0.0",\n  "type": "module",\n  "private": true,\n  "scripts": {\n    "dev": "gez dev",\n    "build": "npm run build:dts && npm run build:ssr",\n    "build:ssr": "gez build",\n    "preview": "gez preview",\n    "start": "NODE_ENV=production node dist/index.js",\n    "build:dts": "vue-tsc --declaration --emitDeclarationOnly --outDir dist/src"\n  },\n  "dependencies": {\n    "@gez/core": "*"\n  },\n  "devDependencies": {\n    "@gez/rspack-vue": "*",\n    "@types/node": "22.8.6",\n    "typescript": "^5.7.3",\n    "vue": "^2.7.16",\n    "vue-server-renderer": "^2.7.16",\n    "vue-tsc": "^2.1.6"\n  }\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Nachdem Sie die ",(0,t.jsx)(n.code,{children:"package.json"}),"-Datei erstellt haben, m\xfcssen Sie die Projektabh\xe4ngigkeiten installieren. Sie k\xf6nnen einen der folgenden Befehle verwenden:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"pnpm install\n# oder\nyarn install\n# oder\nnpm install\n"})}),"\n",(0,t.jsx)(n.p,{children:"Dadurch werden alle erforderlichen Pakete installiert, einschlie\xdflich Vue2, TypeScript und SSR-bezogene Abh\xe4ngigkeiten."}),"\n",(0,t.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["Erstellen Sie die ",(0,t.jsx)(n.code,{children:"tsconfig.json"}),"-Datei und konfigurieren Sie die TypeScript-Compiler-Optionen:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "module": "ESNext",\n        "moduleResolution": "node",\n        "isolatedModules": true,\n        "resolveJsonModule": true,\n        \n        "target": "ESNext",\n        "lib": ["ESNext", "DOM"],\n        \n        "strict": true,\n        "skipLibCheck": true,\n        "types": ["@types/node"],\n        \n        "experimentalDecorators": true,\n        "allowSyntheticDefaultImports": true,\n        \n        "baseUrl": ".",\n        "paths": {\n            "ssr-demo-vue2/src/*": ["./src/*"],\n            "ssr-demo-vue2/*": ["./*"]\n        }\n    },\n    "include": ["src"],\n    "exclude": ["dist", "node_modules"]\n}\n'})}),"\n",(0,t.jsxs)(n.h2,{id:"quellcodestruktur",children:["Quellcodestruktur",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#quellcodestruktur",children:"#"})]}),"\n",(0,t.jsxs)(n.h3,{id:"appvue",children:["app.vue",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#appvue",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["Erstellen Sie die Hauptanwendungskomponente ",(0,t.jsx)(n.code,{children:"src/app.vue"})," mit der ",(0,t.jsx)(n.code,{children:"<script setup>"}),"-Syntax:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-html",meta:'title="src/app.vue"',children:'<template>\n    <div id="app">\n        <h1><a href="https://www.jsesm.com/guide/frameworks/vue2.html" target="_blank">Gez Schnellstart</a></h1>\n        <time :datetime="time">{{ time }}</time>\n    </div>\n</template>\n\n<script setup lang="ts">\n/**\n * @file Beispielkomponente\n * @description Zeigt eine Seiten\xfcberschrift mit automatisch aktualisierter Uhrzeit, um die grundlegenden Funktionen des Gez-Frameworks zu demonstrieren\n */\n\nimport { onMounted, onUnmounted, ref } from \'vue\';\n\n// Aktuelle Zeit, wird jede Sekunde aktualisiert\nconst time = ref(new Date().toISOString());\nlet timer: NodeJS.Timeout;\n\nonMounted(() => {\n    timer = setInterval(() => {\n        time.value = new Date().toISOString();\n    }, 1000);\n});\n\nonUnmounted(() => {\n    clearInterval(timer);\n});\n<\/script>\n'})}),"\n",(0,t.jsxs)(n.h3,{id:"create-appts",children:["create-app.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#create-appts",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["Erstellen Sie die Datei ",(0,t.jsx)(n.code,{children:"src/create-app.ts"}),", die f\xfcr die Erstellung der Vue-Anwendungsinstanz verantwortlich ist:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/create-app.ts"',children:"/**\n * @file Vue-Instanz-Erstellung\n * @description Verantwortlich f\xfcr die Erstellung und Konfiguration der Vue-Anwendungsinstanz\n */\n\nimport Vue from 'vue';\nimport App from './app.vue';\n\nexport function createApp() {\n    const app = new Vue({\n        render: (h) => h(App)\n    });\n    return {\n        app\n    };\n}\n"})}),"\n",(0,t.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["Erstellen Sie die Client-Einstiegspunktdatei ",(0,t.jsx)(n.code,{children:"src/entry.client.ts"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.client.ts"',children:"/**\n * @file Client-Einstiegspunktdatei\n * @description Verantwortlich f\xfcr die Client-Interaktionslogik und dynamische Aktualisierung\n */\n\nimport { createApp } from './create-app';\n\n// Vue-Instanz erstellen\nconst { app } = createApp();\n\n// Vue-Instanz mounten\napp.$mount('#app');\n"})}),"\n",(0,t.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["Erstellen Sie die Datei ",(0,t.jsx)(n.code,{children:"entry.node.ts"}),", die die Entwicklungsumgebung und den Serverstart konfiguriert:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"/**\n * @file Node.js-Server-Einstiegspunktdatei\n * @description Verantwortlich f\xfcr die Entwicklungsumgebungskonfiguration und den Serverstart, bietet die SSR-Laufzeitumgebung\n */\n\nimport http from 'node:http';\nimport type { GezOptions } from '@gez/core';\n\nexport default {\n    /**\n     * Konfiguriert den Anwendungsersteller f\xfcr die Entwicklungsumgebung\n     * @description Erstellt und konfiguriert die Rspack-Anwendungsinstanz f\xfcr die Entwicklungsumgebung, unterst\xfctzt HMR und Live-Vorschau\n     * @param gez Gez-Framework-Instanz, bietet Kernfunktionen und Konfigurationsschnittstellen\n     * @returns Gibt die konfigurierte Rspack-Anwendungsinstanz zur\xfcck, unterst\xfctzt HMR und Live-Vorschau\n     */\n    async devApp(gez) {\n        return import('@gez/rspack-vue').then((m) =>\n            m.createRspackVue2App(gez, {\n                config(context) {\n                    // Hier k\xf6nnen Sie die Rspack-Kompilierungskonfiguration anpassen\n                }\n            })\n        );\n    },\n\n    /**\n     * Konfiguriert und startet den HTTP-Server\n     * @description Erstellt die HTTP-Serverinstanz, integriert Gez-Middleware, verarbeitet SSR-Anfragen\n     * @param gez Gez-Framework-Instanz, bietet Middleware und Rendering-Funktionen\n     */\n    async server(gez) {\n        const server = http.createServer((req, res) => {\n            // Verwendet Gez-Middleware zur Anfrageverarbeitung\n            gez.middleware(req, res, async () => {\n                // F\xfchrt das serverseitige Rendering aus\n                const rc = await gez.render({\n                    params: { url: req.url }\n                });\n                res.end(rc.html);\n            });\n        });\n\n        server.listen(3000, () => {\n            console.log('Server gestartet: http://localhost:3000');\n        });\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,t.jsx)(n.p,{children:"Diese Datei ist der Einstiegspunkt f\xfcr die Entwicklungsumgebungskonfiguration und den Serverstart und enth\xe4lt zwei Kernfunktionen:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"devApp"}),"-Funktion: Verantwortlich f\xfcr die Erstellung und Konfiguration der Rspack-Anwendungsinstanz f\xfcr die Entwicklungsumgebung, unterst\xfctzt Hot Module Replacement (HMR) und Live-Vorschau. Hier wird ",(0,t.jsx)(n.code,{children:"createRspackVue2App"})," verwendet, um eine speziell f\xfcr Vue2 entwickelte Rspack-Anwendungsinstanz zu erstellen."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"server"}),"-Funktion: Verantwortlich f\xfcr die Erstellung und Konfiguration des HTTP-Servers, integriert Gez-Middleware zur Verarbeitung von SSR-Anfragen."]}),"\n"]}),"\n",(0,t.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["Erstellen Sie die Server-Rendering-Einstiegspunktdatei ",(0,t.jsx)(n.code,{children:"src/entry.server.ts"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"/**\n * @file Server-Rendering-Einstiegspunktdatei\n * @description Verantwortlich f\xfcr den Server-Rendering-Prozess, HTML-Generierung und Ressourceneinbindung\n */\n\nimport type { RenderContext } from '@gez/core';\nimport { createRenderer } from 'vue-server-renderer';\nimport { createApp } from './create-app';\n\n// Renderer erstellen\nconst renderer = createRenderer();\n\nexport default async (rc: RenderContext) => {\n    // Vue-Anwendungsinstanz erstellen\n    const { app } = createApp();\n\n    // Verwenden Sie Vue's renderToString, um den Seiteninhalt zu generieren\n    const html = await renderer.renderToString(app, {\n        importMetaSet: rc.importMetaSet\n    });\n\n    // Abh\xe4ngigkeitssammlung abschlie\xdfen, um sicherzustellen, dass alle notwendigen Ressourcen geladen werden\n    await rc.commit();\n\n    // Vollst\xe4ndige HTML-Struktur generieren\n    rc.html = `<!DOCTYPE html>\n<html lang=\"de-DE\">\n<head>\n    ${rc.preload()}\n    <title>Gez Schnellstart</title>\n    ${rc.css()}\n</head>\n<body>\n    ${html}\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n</body>\n</html>\n`;\n};\n"})}),"\n",(0,t.jsxs)(n.h2,{id:"projekt-ausf\\xfchren",children:["Projekt ausf\xfchren",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#projekt-ausf\\xfchren",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"Nachdem Sie die oben genannten Dateien konfiguriert haben, k\xf6nnen Sie das Projekt mit den folgenden Befehlen ausf\xfchren:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Entwicklungsmodus:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm run dev\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"Projekt erstellen:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"Produktionsumgebung ausf\xfchren:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Jetzt haben Sie erfolgreich eine Vue2 SSR-Anwendung mit Gez erstellt! Besuchen Sie ",(0,t.jsx)(n.a,{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer",children:"http://localhost:3000"}),", um das Ergebnis zu sehen."]})]})}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,i.ah)(),e.components);return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(s,{...e})}):s(e)}let a=d;d.__RSPRESS_PAGE_META={},d.__RSPRESS_PAGE_META["de%2Fguide%2Fframeworks%2Fvue2.md"]={toc:[{text:"Projektstruktur",id:"projektstruktur",depth:2},{text:"Projektkonfiguration",id:"projektkonfiguration",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3},{text:"Quellcodestruktur",id:"quellcodestruktur",depth:2},{text:"app.vue",id:"appvue",depth:3},{text:"create-app.ts",id:"create-appts",depth:3},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"Projekt ausf\xfchren",id:"projekt-ausf\xfchren",depth:2}],title:"Vue2",headingTitle:"Vue2",frontmatter:{titleSuffix:"Gez Framework Vue2 SSR Anwendungsbeispiel",description:"Erstellen Sie eine Vue2 SSR-Anwendung mit Gez von Grund auf. Dieses Beispiel zeigt die grundlegende Verwendung des Frameworks, einschlie\xdflich Projektinitialisierung, Vue2-Konfiguration und Einstiegspunktdateien.",head:[["meta",{property:"keywords",content:"Gez, Vue2, SSR-Anwendung, TypeScript-Konfiguration, Projektinitialisierung, Serverseitiges Rendering, Client-Interaktion"}]]}}}}]);