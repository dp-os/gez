"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["5981"],{2446:function(e,n,r){r.r(n),r.d(n,{default:()=>s});var a=r(1549),o=r(6603);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code",h3:"h3",ol:"ol",li:"li"},(0,o.ah)(),e.components);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(n.h1,{id:"vue3",children:["Vue3",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#vue3",children:"#"})]}),"\n",(0,a.jsx)(n.p,{children:"Este tutorial ir\xe1 gui\xe1-lo na cria\xe7\xe3o de uma aplica\xe7\xe3o Vue3 SSR (Server-Side Rendering) com o framework Gez, come\xe7ando do zero. Atrav\xe9s de um exemplo completo, demonstraremos como utilizar o Gez para criar uma aplica\xe7\xe3o com renderiza\xe7\xe3o no servidor."}),"\n",(0,a.jsxs)(n.h2,{id:"estrutura-do-projeto",children:["Estrutura do Projeto",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#estrutura-do-projeto",children:"#"})]}),"\n",(0,a.jsx)(n.p,{children:"Primeiro, vamos entender a estrutura b\xe1sica do projeto:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:".\n├── package.json         # Arquivo de configura\xe7\xe3o do projeto, define depend\xeancias e scripts\n├── tsconfig.json        # Arquivo de configura\xe7\xe3o do TypeScript, define op\xe7\xf5es de compila\xe7\xe3o\n└── src                  # Diret\xf3rio de c\xf3digo-fonte\n    ├── app.vue          # Componente principal da aplica\xe7\xe3o, define estrutura e l\xf3gica da p\xe1gina\n    ├── create-app.ts    # F\xe1brica de inst\xe2ncia Vue, respons\xe1vel pela inicializa\xe7\xe3o da aplica\xe7\xe3o\n    ├── entry.client.ts  # Arquivo de entrada do cliente, lida com a renderiza\xe7\xe3o no navegador\n    ├── entry.node.ts    # Arquivo de entrada do Node.js, configura ambiente de desenvolvimento e inicia o servidor\n    └── entry.server.ts  # Arquivo de entrada do servidor, lida com a l\xf3gica de renderiza\xe7\xe3o SSR\n"})}),"\n",(0,a.jsxs)(n.h2,{id:"configura\\xe7\\xe3o-do-projeto",children:["Configura\xe7\xe3o do Projeto",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#configura\\xe7\\xe3o-do-projeto",children:"#"})]}),"\n",(0,a.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crie o arquivo ",(0,a.jsx)(n.code,{children:"package.json"})," para configurar as depend\xeancias e scripts do projeto:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n  "name": "ssr-demo-vue3",\n  "version": "1.0.0",\n  "type": "module",\n  "private": true,\n  "scripts": {\n    "dev": "gez dev",\n    "build": "npm run build:dts && npm run build:ssr",\n    "build:ssr": "gez build",\n    "preview": "gez preview",\n    "start": "NODE_ENV=production node dist/index.js",\n    "build:dts": "vue-tsc --declaration --emitDeclarationOnly --outDir dist/src"\n  },\n  "dependencies": {\n    "@gez/core": "*"\n  },\n  "devDependencies": {\n    "@gez/rspack-vue": "*",\n    "@types/node": "22.8.6",\n    "@vue/server-renderer": "^3.5.13",\n    "typescript": "^5.7.3",\n    "vue": "^3.5.13",\n    "vue-tsc": "^2.1.6"\n  }\n}\n'})}),"\n",(0,a.jsxs)(n.p,{children:["Ap\xf3s criar o arquivo ",(0,a.jsx)(n.code,{children:"package.json"}),", instale as depend\xeancias do projeto. Voc\xea pode usar um dos seguintes comandos:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pnpm install\n# ou\nyarn install\n# ou\nnpm install\n"})}),"\n",(0,a.jsx)(n.p,{children:"Isso instalar\xe1 todos os pacotes necess\xe1rios, incluindo Vue3, TypeScript e depend\xeancias relacionadas ao SSR."}),"\n",(0,a.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crie o arquivo ",(0,a.jsx)(n.code,{children:"tsconfig.json"})," para configurar as op\xe7\xf5es de compila\xe7\xe3o do TypeScript:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "module": "ESNext",\n        "moduleResolution": "node",\n        "isolatedModules": true,\n        "resolveJsonModule": true,\n        \n        "target": "ESNext",\n        "lib": ["ESNext", "DOM"],\n        \n        "strict": true,\n        "skipLibCheck": true,\n        "types": ["@types/node"],\n        \n        "experimentalDecorators": true,\n        "allowSyntheticDefaultImports": true,\n        \n        "baseUrl": ".",\n        "paths": {\n            "ssr-demo-vue3/src/*": ["./src/*"],\n            "ssr-demo-vue3/*": ["./*"]\n        }\n    },\n    "include": ["src"],\n    "exclude": ["dist", "node_modules"]\n}\n'})}),"\n",(0,a.jsxs)(n.h2,{id:"estrutura-do-c\\xf3digo-fonte",children:["Estrutura do C\xf3digo-Fonte",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#estrutura-do-c\\xf3digo-fonte",children:"#"})]}),"\n",(0,a.jsxs)(n.h3,{id:"appvue",children:["app.vue",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#appvue",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crie o componente principal da aplica\xe7\xe3o ",(0,a.jsx)(n.code,{children:"src/app.vue"}),", utilizando a API de Composi\xe7\xe3o do Vue3:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-html",meta:'title="src/app.vue"',children:'<template>\n    <div>\n        <h1><a href="https://www.jsesm.com/guide/frameworks/vue3.html" target="_blank">In\xedcio R\xe1pido com Gez</a></h1>\n        <time :datetime="time">{{ time }}</time>\n    </div>\n</template>\n\n<script setup lang="ts">\n/**\n * @file Componente de Exemplo\n * @description Exibe um t\xedtulo de p\xe1gina com tempo atualizado automaticamente, demonstrando funcionalidades b\xe1sicas do Gez\n */\n\nimport { onMounted, onUnmounted, ref } from \'vue\';\n\n// Tempo atual, atualizado a cada segundo\nconst time = ref(new Date().toISOString());\nlet timer: NodeJS.Timeout;\n\nonMounted(() => {\n    timer = setInterval(() => {\n        time.value = new Date().toISOString();\n    }, 1000);\n});\n\nonUnmounted(() => {\n    clearInterval(timer);\n});\n<\/script>\n'})}),"\n",(0,a.jsxs)(n.h3,{id:"create-appts",children:["create-app.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#create-appts",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crie o arquivo ",(0,a.jsx)(n.code,{children:"src/create-app.ts"}),", respons\xe1vel por criar a inst\xe2ncia da aplica\xe7\xe3o Vue:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/create-app.ts"',children:"/**\n * @file Cria\xe7\xe3o de Inst\xe2ncia Vue\n * @description Respons\xe1vel por criar e configurar a inst\xe2ncia da aplica\xe7\xe3o Vue\n */\n\nimport { createSSRApp } from 'vue';\nimport App from './app.vue';\n\nexport function createApp() {\n    const app = createSSRApp(App);\n    return {\n        app\n    };\n}\n"})}),"\n",(0,a.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crie o arquivo de entrada do cliente ",(0,a.jsx)(n.code,{children:"src/entry.client.ts"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.client.ts"',children:"/**\n * @file Arquivo de Entrada do Cliente\n * @description Respons\xe1vel pela l\xf3gica de intera\xe7\xe3o do cliente e atualiza\xe7\xf5es din\xe2micas\n */\n\nimport { createApp } from './create-app';\n\n// Cria a inst\xe2ncia Vue\nconst { app } = createApp();\n\n// Monta a inst\xe2ncia Vue\napp.mount('#app');\n"})}),"\n",(0,a.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crie o arquivo ",(0,a.jsx)(n.code,{children:"entry.node.ts"})," para configurar o ambiente de desenvolvimento e iniciar o servidor:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"/**\n * @file Arquivo de Entrada do Node.js\n * @description Respons\xe1vel pela configura\xe7\xe3o do ambiente de desenvolvimento e inicializa\xe7\xe3o do servidor, fornecendo ambiente de execu\xe7\xe3o SSR\n */\n\nimport http from 'node:http';\nimport type { GezOptions } from '@gez/core';\n\nexport default {\n    /**\n     * Configura o criador de aplica\xe7\xe3o para o ambiente de desenvolvimento\n     * @description Cria e configura a inst\xe2ncia da aplica\xe7\xe3o Rspack, usada para constru\xe7\xe3o e atualiza\xe7\xe3o em tempo real no ambiente de desenvolvimento\n     * @param gez Inst\xe2ncia do framework Gez, fornece funcionalidades principais e interfaces de configura\xe7\xe3o\n     * @returns Retorna a inst\xe2ncia da aplica\xe7\xe3o Rspack configurada, com suporte a HMR e visualiza\xe7\xe3o em tempo real\n     */\n    async devApp(gez) {\n        return import('@gez/rspack-vue').then((m) =>\n            m.createRspackVue3App(gez, {\n                config(context) {\n                    // Personalize a configura\xe7\xe3o de compila\xe7\xe3o do Rspack aqui\n                }\n            })\n        );\n    },\n\n    /**\n     * Configura e inicia o servidor HTTP\n     * @description Cria a inst\xe2ncia do servidor HTTP, integra middleware do Gez e processa requisi\xe7\xf5es SSR\n     * @param gez Inst\xe2ncia do framework Gez, fornece middleware e funcionalidades de renderiza\xe7\xe3o\n     */\n    async server(gez) {\n        const server = http.createServer((req, res) => {\n            // Usa middleware do Gez para processar a requisi\xe7\xe3o\n            gez.middleware(req, res, async () => {\n                // Executa a renderiza\xe7\xe3o no servidor\n                const rc = await gez.render({\n                    params: { url: req.url }\n                });\n                res.end(rc.html);\n            });\n        });\n\n        server.listen(3000, () => {\n            console.log('Servidor iniciado: http://localhost:3000');\n        });\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,a.jsx)(n.p,{children:"Este arquivo \xe9 o ponto de entrada para a configura\xe7\xe3o do ambiente de desenvolvimento e inicializa\xe7\xe3o do servidor, contendo duas funcionalidades principais:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["Fun\xe7\xe3o ",(0,a.jsx)(n.code,{children:"devApp"}),": Respons\xe1vel por criar e configurar a inst\xe2ncia da aplica\xe7\xe3o Rspack para o ambiente de desenvolvimento, com suporte a atualiza\xe7\xe3o em tempo real e visualiza\xe7\xe3o instant\xe2nea. Aqui, ",(0,a.jsx)(n.code,{children:"createRspackVue3App"})," \xe9 usado para criar uma inst\xe2ncia Rspack espec\xedfica para Vue3."]}),"\n",(0,a.jsxs)(n.li,{children:["Fun\xe7\xe3o ",(0,a.jsx)(n.code,{children:"server"}),": Respons\xe1vel por criar e configurar o servidor HTTP, integrando middleware do Gez para processar requisi\xe7\xf5es SSR."]}),"\n"]}),"\n",(0,a.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,a.jsxs)(n.p,{children:["Crie o arquivo de entrada para renderiza\xe7\xe3o no servidor ",(0,a.jsx)(n.code,{children:"src/entry.server.ts"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"/**\n * @file Arquivo de Entrada do Servidor\n * @description Respons\xe1vel pelo fluxo de renderiza\xe7\xe3o no servidor, gera\xe7\xe3o de HTML e inje\xe7\xe3o de recursos\n */\n\nimport type { RenderContext } from '@gez/core';\nimport { renderToString } from '@vue/server-renderer';\nimport { createApp } from './create-app';\n\nexport default async (rc: RenderContext) => {\n    // Cria a inst\xe2ncia da aplica\xe7\xe3o Vue\n    const { app } = createApp();\n\n    // Usa renderToString do Vue para gerar o conte\xfado da p\xe1gina\n    const html = await renderToString(app, {\n        importMetaSet: rc.importMetaSet\n    });\n\n    // Submete a coleta de depend\xeancias, garantindo que todos os recursos necess\xe1rios sejam carregados\n    await rc.commit();\n\n    // Gera a estrutura HTML completa\n    rc.html = `<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n    ${rc.preload()}\n    <title>In\xedcio R\xe1pido com Gez</title>\n    ${rc.css()}\n</head>\n<body>\n    <div id=\"app\">${html}</div>\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n</body>\n</html>\n`;\n};\n"})}),"\n",(0,a.jsxs)(n.h2,{id:"executando-o-projeto",children:["Executando o Projeto",(0,a.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#executando-o-projeto",children:"#"})]}),"\n",(0,a.jsx)(n.p,{children:"Ap\xf3s configurar os arquivos acima, voc\xea pode usar os seguintes comandos para executar o projeto:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"Modo de desenvolvimento:"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run dev\n"})}),"\n",(0,a.jsxs)(n.ol,{start:"2",children:["\n",(0,a.jsx)(n.li,{children:"Construir o projeto:"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,a.jsxs)(n.ol,{start:"3",children:["\n",(0,a.jsx)(n.li,{children:"Executar em produ\xe7\xe3o:"}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,a.jsxs)(n.p,{children:["Agora, voc\xea criou com sucesso uma aplica\xe7\xe3o Vue3 SSR com Gez! Acesse ",(0,a.jsx)(n.a,{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer",children:"http://localhost:3000"})," para ver o resultado."]})]})}function t(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,o.ah)(),e.components);return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(i,{...e})}):i(e)}let s=t;t.__RSPRESS_PAGE_META={},t.__RSPRESS_PAGE_META["pt%2Fguide%2Fframeworks%2Fvue3.md"]={toc:[{text:"Estrutura do Projeto",id:"estrutura-do-projeto",depth:2},{text:"Configura\xe7\xe3o do Projeto",id:"configura\xe7\xe3o-do-projeto",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3},{text:"Estrutura do C\xf3digo-Fonte",id:"estrutura-do-c\xf3digo-fonte",depth:2},{text:"app.vue",id:"appvue",depth:3},{text:"create-app.ts",id:"create-appts",depth:3},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"Executando o Projeto",id:"executando-o-projeto",depth:2}],title:"Vue3",headingTitle:"Vue3",frontmatter:{titleSuffix:"Exemplo de Aplica\xe7\xe3o Vue3 SSR com Framework Gez",description:"Aprenda a criar uma aplica\xe7\xe3o Vue3 SSR com Gez do zero. Este tutorial mostra o uso b\xe1sico do framework, incluindo inicializa\xe7\xe3o do projeto, configura\xe7\xe3o do Vue3 e defini\xe7\xe3o de arquivos de entrada.",head:[["meta",{property:"keywords",content:"Gez, Vue3, Aplica\xe7\xe3o SSR, Configura\xe7\xe3o TypeScript, Inicializa\xe7\xe3o de Projeto, Renderiza\xe7\xe3o no Servidor, Intera\xe7\xe3o no Cliente, API de Composi\xe7\xe3o"}]]}}}}]);