"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["7758"],{820:function(e,n,r){r.r(n),r.d(n,{default:()=>l});var i=r(1549),t=r(6603);function a(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code",h3:"h3",ol:"ol",li:"li"},(0,t.ah)(),e.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.h1,{id:"preacthtm",children:["Preact+HTM",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#preacthtm",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Questo tutorial ti guider\xe0 nella creazione di un'applicazione Preact+HTM SSR basata su Gez da zero. Attraverso un esempio completo, mostreremo come utilizzare il framework Gez per creare un'applicazione con rendering lato server."}),"\n",(0,i.jsxs)(n.h2,{id:"struttura-del-progetto",children:["Struttura del progetto",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#struttura-del-progetto",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Iniziamo con la struttura di base del progetto:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:".\n├── package.json         # File di configurazione del progetto, definisce le dipendenze e gli script\n├── tsconfig.json        # File di configurazione TypeScript, imposta le opzioni di compilazione\n└── src                  # Directory del codice sorgente\n    ├── app.ts           # Componente principale dell'applicazione, definisce la struttura della pagina e la logica di interazione\n    ├── create-app.ts    # Factory per la creazione dell'istanza dell'applicazione, responsabile dell'inizializzazione\n    ├── entry.client.ts  # File di ingresso lato client, gestisce il rendering nel browser\n    ├── entry.node.ts    # File di ingresso per il server Node.js, configura l'ambiente di sviluppo e avvia il server\n    └── entry.server.ts  # File di ingresso lato server, gestisce la logica di rendering SSR\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"configurazione-del-progetto",children:["Configurazione del progetto",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#configurazione-del-progetto",children:"#"})]}),"\n",(0,i.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Crea il file ",(0,i.jsx)(n.code,{children:"package.json"})," per configurare le dipendenze e gli script del progetto:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n  "name": "ssr-demo-preact-htm",\n  "version": "1.0.0",\n  "type": "module",\n  "private": true,\n  "scripts": {\n    "dev": "gez dev",\n    "build": "npm run build:dts && npm run build:ssr",\n    "build:ssr": "gez build",\n    "preview": "gez preview",\n    "start": "NODE_ENV=production node dist/index.js",\n    "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src"\n  },\n  "dependencies": {\n    "@gez/core": "*"\n  },\n  "devDependencies": {\n    "@gez/rspack": "*",\n    "@types/node": "22.8.6",\n    "htm": "^3.1.1",\n    "preact": "^10.26.2",\n    "preact-render-to-string": "^6.5.13",\n    "typescript": "^5.2.2"\n  }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Dopo aver creato il file ",(0,i.jsx)(n.code,{children:"package.json"}),", installa le dipendenze del progetto. Puoi utilizzare uno dei seguenti comandi:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"pnpm install\n# oppure\nyarn install\n# oppure\nnpm install\n"})}),"\n",(0,i.jsx)(n.p,{children:"Questo installer\xe0 tutti i pacchetti necessari, inclusi Preact, HTM, TypeScript e le dipendenze relative al SSR."}),"\n",(0,i.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Crea il file ",(0,i.jsx)(n.code,{children:"tsconfig.json"})," per configurare le opzioni di compilazione TypeScript:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "isolatedModules": true,\n        "experimentalDecorators": true,\n        "resolveJsonModule": true,\n        "types": [\n            "@types/node"\n        ],\n        "target": "ESNext",\n        "module": "ESNext",\n        "moduleResolution": "node",\n        "strict": true,\n        "skipLibCheck": true,\n        "allowSyntheticDefaultImports": true,\n        "paths": {\n            "ssr-demo-preact-htm/src/*": [\n                "./src/*"\n            ],\n            "ssr-demo-preact-htm/*": [\n                "./*"\n            ]\n        }\n    },\n    "include": [\n        "src"\n    ],\n    "exclude": [\n        "dist"\n    ]\n}\n'})}),"\n",(0,i.jsxs)(n.h2,{id:"struttura-del-codice-sorgente",children:["Struttura del codice sorgente",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#struttura-del-codice-sorgente",children:"#"})]}),"\n",(0,i.jsxs)(n.h3,{id:"appts",children:["app.ts",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#appts",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Crea il componente principale dell'applicazione ",(0,i.jsx)(n.code,{children:"src/app.ts"}),", utilizzando i componenti di classe di Preact e HTM:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="src/app.ts"',children:"/**\n * @file Componente di esempio\n * @description Mostra un titolo di pagina con un orario aggiornato automaticamente, utilizzato per dimostrare le funzionalit\xe0 di base del framework Gez\n */\n\nimport { Component } from 'preact';\nimport { html } from 'htm/preact';\n\nexport default class App extends Component {\n    state = {\n        time: new Date().toISOString()\n    };\n\n    timer: NodeJS.Timeout | null = null;\n\n    componentDidMount() {\n        this.timer = setInterval(() => {\n            this.setState({\n                time: new Date().toISOString()\n            });\n        }, 1000);\n    }\n\n    componentWillUnmount() {\n        if (this.timer) {\n            clearInterval(this.timer);\n        }\n    }\n\n    render() {\n        const { time } = this.state;\n        return html`\n            <div>\n                <h1><a href=\"https://www.jsesm.com/guide/frameworks/preact-htm.html\" target=\"_blank\">Guida rapida a Gez</a></h1>\n                <time datetime=${time}>${time}</time>\n            </div>\n        `;\n    }\n}\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"create-appts",children:["create-app.ts",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#create-appts",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Crea il file ",(0,i.jsx)(n.code,{children:"src/create-app.ts"}),", responsabile della creazione dell'istanza dell'applicazione:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="src/create-app.ts"',children:"/**\n * @file Creazione dell'istanza dell'applicazione\n * @description Responsabile della creazione e configurazione dell'istanza dell'applicazione\n */\n\nimport type { VNode } from 'preact';\nimport { html } from 'htm/preact';\nimport App from './app';\n\nexport function createApp(): { app: VNode } {\n    const app = html`<${App} />`;\n    return {\n        app\n    };\n}\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Crea il file di ingresso lato client ",(0,i.jsx)(n.code,{children:"src/entry.client.ts"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.client.ts"',children:"/**\n * @file File di ingresso lato client\n * @description Gestisce la logica di interazione lato client e gli aggiornamenti dinamici\n */\n\nimport { render } from 'preact';\nimport { createApp } from './create-app';\n\n// Crea l'istanza dell'applicazione\nconst { app } = createApp();\n\n// Monta l'istanza dell'applicazione\nrender(app, document.getElementById('app')!);\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Crea il file ",(0,i.jsx)(n.code,{children:"entry.node.ts"})," per configurare l'ambiente di sviluppo e avviare il server:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"/**\n * @file File di ingresso per il server Node.js\n * @description Configura l'ambiente di sviluppo e avvia il server, fornendo un ambiente di runtime per il SSR\n */\n\nimport http from 'node:http';\nimport type { GezOptions } from '@gez/core';\n\nexport default {\n    /**\n     * Configura il creatore dell'applicazione per l'ambiente di sviluppo\n     * @description Crea e configura un'istanza dell'applicazione Rspack per la costruzione e l'aggiornamento in tempo reale nell'ambiente di sviluppo\n     * @param gez Istanza del framework Gez, fornisce funzionalit\xe0 di base e interfacce di configurazione\n     * @returns Restituisce un'istanza configurata dell'applicazione Rspack, supporta HMR e anteprima in tempo reale\n     */\n    async devApp(gez) {\n        return import('@gez/rspack').then((m) =>\n            m.createRspackHtmlApp(gez, {\n                config(context) {\n                    // Personalizza qui la configurazione di compilazione di Rspack\n                }\n            })\n        );\n    },\n\n    /**\n     * Configura e avvia il server HTTP\n     * @description Crea un'istanza del server HTTP, integra i middleware di Gez e gestisce le richieste SSR\n     * @param gez Istanza del framework Gez, fornisce middleware e funzionalit\xe0 di rendering\n     */\n    async server(gez) {\n        const server = http.createServer((req, res) => {\n            // Utilizza i middleware di Gez per gestire le richieste\n            gez.middleware(req, res, async () => {\n                // Esegue il rendering lato server\n                const rc = await gez.render({\n                    params: { url: req.url }\n                });\n                res.end(rc.html);\n            });\n        });\n\n        server.listen(3000, () => {\n            console.log('Server avviato: http://localhost:3000');\n        });\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,i.jsx)(n.p,{children:"Questo file \xe8 il punto di ingresso per la configurazione dell'ambiente di sviluppo e l'avvio del server, e include due funzionalit\xe0 principali:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Funzione ",(0,i.jsx)(n.code,{children:"devApp"}),": Responsabile della creazione e configurazione dell'istanza dell'applicazione Rspack per l'ambiente di sviluppo, supportando l'aggiornamento in tempo reale e l'anteprima. Qui viene utilizzato ",(0,i.jsx)(n.code,{children:"createRspackHtmlApp"})," per creare un'istanza dell'applicazione Rspack specifica per Preact+HTM."]}),"\n",(0,i.jsxs)(n.li,{children:["Funzione ",(0,i.jsx)(n.code,{children:"server"}),": Responsabile della creazione e configurazione del server HTTP, integrando i middleware di Gez per gestire le richieste SSR."]}),"\n"]}),"\n",(0,i.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Crea il file di ingresso per il rendering lato server ",(0,i.jsx)(n.code,{children:"src/entry.server.ts"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"/**\n * @file File di ingresso per il rendering lato server\n * @description Gestisce il processo di rendering lato server, la generazione dell'HTML e l'iniezione delle risorse\n */\n\nimport type { RenderContext } from '@gez/core';\nimport type { VNode } from 'preact';\nimport { render } from 'preact-render-to-string';\nimport { createApp } from './create-app';\n\nexport default async (rc: RenderContext) => {\n    // Crea l'istanza dell'applicazione\n    const { app } = createApp();\n\n    // Utilizza renderToString di Preact per generare il contenuto della pagina\n    const html = render(app);\n\n    // Conferma la raccolta delle dipendenze, assicurando che tutte le risorse necessarie vengano caricate\n    await rc.commit();\n\n    // Genera la struttura HTML completa\n    rc.html = `<!DOCTYPE html>\n<html lang=\"it\">\n<head>\n    ${rc.preload()}\n    <title>Guida rapida a Gez</title>\n    ${rc.css()}\n</head>\n<body>\n    <div id=\"app\">${html}</div>\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n</body>\n</html>\n`;\n};\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"esecuzione-del-progetto",children:["Esecuzione del progetto",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#esecuzione-del-progetto",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Dopo aver completato la configurazione dei file, puoi eseguire il progetto utilizzando i seguenti comandi:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"Modalit\xe0 di sviluppo:"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm run dev\n"})}),"\n",(0,i.jsxs)(n.ol,{start:"2",children:["\n",(0,i.jsx)(n.li,{children:"Costruzione del progetto:"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,i.jsxs)(n.ol,{start:"3",children:["\n",(0,i.jsx)(n.li,{children:"Esecuzione in ambiente di produzione:"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Ora hai creato con successo un'applicazione Preact+HTM SSR basata su Gez! Visita ",(0,i.jsx)(n.a,{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer",children:"http://localhost:3000"})," per vedere il risultato."]})]})}function s(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,t.ah)(),e.components);return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}let l=s;s.__RSPRESS_PAGE_META={},s.__RSPRESS_PAGE_META["it%2Fguide%2Fframeworks%2Fpreact-htm.md"]={toc:[{text:"Struttura del progetto",id:"struttura-del-progetto",depth:2},{text:"Configurazione del progetto",id:"configurazione-del-progetto",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3},{text:"Struttura del codice sorgente",id:"struttura-del-codice-sorgente",depth:2},{text:"app.ts",id:"appts",depth:3},{text:"create-app.ts",id:"create-appts",depth:3},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"Esecuzione del progetto",id:"esecuzione-del-progetto",depth:2}],title:"Preact+HTM",headingTitle:"Preact+HTM",frontmatter:{titleSuffix:"Esempio di applicazione Preact+HTM SSR con il framework Gez",description:"Impara a creare un'applicazione Preact+HTM SSR basata su Gez da zero. Questo tutorial mostra l'uso di base del framework, inclusa l'inizializzazione del progetto, la configurazione di Preact e l'impostazione dei file di ingresso.",head:[["meta",{property:"keywords",content:"Gez, Preact, HTM, Applicazione SSR, Configurazione TypeScript, Inizializzazione progetto, Rendering lato server, Interazione lato client"}]]}}}}]);