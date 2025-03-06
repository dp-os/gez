---
titleSuffix: Exemplo de Aplicação HTML SSR com Gez
description: Aprenda a criar uma aplicação HTML SSR com Gez do zero. Este tutorial cobre a inicialização do projeto, configuração de HTML e definição de arquivos de entrada.
head:
  - - meta
    - property: keywords
      content: Gez, HTML, Aplicação SSR, Configuração TypeScript, Inicialização de Projeto, Renderização no Servidor, Interação no Cliente
---

# HTML

Este tutorial irá guiá-lo na criação de uma aplicação HTML SSR (Server-Side Rendering) com Gez do zero. Vamos demonstrar como usar o framework Gez para criar uma aplicação com renderização no servidor.

## Estrutura do Projeto

Primeiro, vamos entender a estrutura básica do projeto:

```bash
.
├── package.json         # Arquivo de configuração do projeto, define dependências e scripts
├── tsconfig.json        # Arquivo de configuração do TypeScript, define opções de compilação
└── src                  # Diretório de código-fonte
    ├── app.ts           # Componente principal da aplicação, define a estrutura da página e lógica de interação
    ├── create-app.ts    # Fábrica de criação de instância da aplicação, responsável pela inicialização
    ├── entry.client.ts  # Arquivo de entrada do cliente, lida com a renderização no navegador
    ├── entry.node.ts    # Arquivo de entrada do servidor Node.js, configura o ambiente de desenvolvimento e inicia o servidor
    └── entry.server.ts  # Arquivo de entrada do servidor, lida com a lógica de renderização SSR
```

## Configuração do Projeto

### package.json

Crie o arquivo `package.json` para configurar as dependências e scripts do projeto:

```json title="package.json"
{
  "name": "ssr-demo-html",
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
    "typescript": "^5.7.3"
  }
}
```

Após criar o arquivo `package.json`, instale as dependências do projeto. Você pode usar um dos seguintes comandos:

```bash
pnpm install
# ou
yarn install
# ou
npm install
```

Isso instalará todos os pacotes necessários, incluindo TypeScript e dependências relacionadas ao SSR.

### tsconfig.json

Crie o arquivo `tsconfig.json` para configurar as opções de compilação do TypeScript:

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
            "ssr-demo-html/src/*": ["./src/*"],
            "ssr-demo-html/*": ["./*"]
        }
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules"]
}
```

## Estrutura do Código-Fonte

### app.ts

Crie o componente principal da aplicação `src/app.ts`, que implementa a estrutura da página e a lógica de interação:

```ts title="src/app.ts"
/**
 * @file Componente de Exemplo
 * @description Exibe um título de página com atualização automática de tempo, demonstrando as funcionalidades básicas do Gez
 */

export default class App {
    /**
     * Tempo atual, no formato ISO
     * @type {string}
     */
    public time = '';

    /**
     * Cria uma instância da aplicação
     * @param {SsrContext} [ssrContext] - Contexto do servidor, contendo metadados de importação
     */
    public constructor(public ssrContext?: SsrContext) {
        // Nenhuma inicialização adicional necessária no construtor
    }

    /**
     * Renderiza o conteúdo da página
     * @returns {string} Retorna a estrutura HTML da página
     */
    public render(): string {
        // Garante que os metadados de importação sejam coletados corretamente no servidor
        if (this.ssrContext) {
            this.ssrContext.importMetaSet.add(import.meta);
        }

        return `
        <div id="app">
            <h1><a href="https://www.jsesm.com/guide/frameworks/html.html" target="_blank">Início Rápido com Gez</a></h1>
            <time datetime="${this.time}">${this.time}</time>
        </div>
        `;
    }

    /**
     * Inicialização no cliente
     * @throws {Error} Lança um erro se o elemento de exibição de tempo não for encontrado
     */
    public onClient(): void {
        // Obtém o elemento de exibição de tempo
        const time = document.querySelector('#app time');
        if (!time) {
            throw new Error('Elemento de exibição de tempo não encontrado');
        }

        // Configura um temporizador para atualizar o tempo a cada segundo
        setInterval(() => {
            this.time = new Date().toISOString();
            time.setAttribute('datetime', this.time);
            time.textContent = this.time;
        }, 1000);
    }

    /**
     * Inicialização no servidor
     */
    public onServer(): void {
        this.time = new Date().toISOString();
    }
}

/**
 * Interface de contexto do servidor
 * @interface
 */
export interface SsrContext {
    /**
     * Conjunto de metadados de importação
     * @type {Set<ImportMeta>}
     */
    importMetaSet: Set<ImportMeta>;
}
```

### create-app.ts

Crie o arquivo `src/create-app.ts`, responsável por criar a instância da aplicação:

```ts title="src/create-app.ts"
/**
 * @file Criação de Instância da Aplicação
 * @description Responsável por criar e configurar a instância da aplicação
 */

import App from './app';

export function createApp() {
    const app = new App();
    return {
        app
    };
}
```

### entry.client.ts

Crie o arquivo de entrada do cliente `src/entry.client.ts`:

```ts title="src/entry.client.ts"
/**
 * @file Arquivo de Entrada do Cliente
 * @description Responsável pela lógica de interação e atualização dinâmica no cliente
 */

import { createApp } from './create-app';

// Cria a instância da aplicação e inicializa
const { app } = createApp();
app.onClient();
```

### entry.node.ts

Crie o arquivo `entry.node.ts` para configurar o ambiente de desenvolvimento e iniciar o servidor:

```ts title="src/entry.node.ts"
/**
 * @file Arquivo de Entrada do Servidor Node.js
 * @description Responsável pela configuração do ambiente de desenvolvimento e inicialização do servidor, fornecendo o ambiente de execução SSR
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * Configura o criador de aplicação para o ambiente de desenvolvimento
     * @description Cria e configura a instância da aplicação Rspack para construção e atualização em tempo real no ambiente de desenvolvimento
     * @param gez Instância do Gez, fornecendo funcionalidades principais e interfaces de configuração
     * @returns Retorna a instância configurada da aplicação Rspack, suportando HMR e visualização em tempo real
     */
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                config(context) {
                    // Personalize a configuração de compilação do Rspack aqui
                }
            })
        );
    },

    /**
     * Configura e inicia o servidor HTTP
     * @description Cria uma instância do servidor HTTP, integra middleware do Gez e processa requisições SSR
     * @param gez Instância do Gez, fornecendo middleware e funcionalidades de renderização
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // Usa o middleware do Gez para processar a requisição
            gez.middleware(req, res, async () => {
                // Executa a renderização no servidor
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

Este arquivo é o ponto de entrada para a configuração do ambiente de desenvolvimento e inicialização do servidor, contendo duas funcionalidades principais:

1. Função `devApp`: Responsável por criar e configurar a instância da aplicação Rspack para o ambiente de desenvolvimento, suportando atualização em tempo real e visualização.
2. Função `server`: Responsável por criar e configurar o servidor HTTP, integrando middleware do Gez para processar requisições SSR.

### entry.server.ts

Crie o arquivo de entrada para renderização no servidor `src/entry.server.ts`:

```ts title="src/entry.server.ts"
/**
 * @file Arquivo de Entrada para Renderização no Servidor
 * @description Responsável pelo fluxo de renderização no servidor, geração de HTML e injeção de recursos
 */

import type { RenderContext } from '@gez/core';
import type App from './app';
import type { SsrContext } from './app';
import { createApp } from './create-app';

// Encapsula a lógica de geração de conteúdo da página
const renderToString = (app: App, ssrContext: SsrContext): string => {
    // Injeta o contexto de renderização no servidor na instância da aplicação
    app.ssrContext = ssrContext;
    // Inicializa o servidor
    app.onServer();

    // Gera o conteúdo da página
    return app.render();
};

export default async (rc: RenderContext) => {
    // Cria a instância da aplicação, retornando um objeto contendo a instância app
    const { app } = createApp();
    // Usa renderToString para gerar o conteúdo da página
    const html = renderToString(app, {
        importMetaSet: rc.importMetaSet
    });

    // Submete a coleta de dependências, garantindo que todos os recursos necessários sejam carregados
    await rc.commit();

    // Gera a estrutura HTML completa
    rc.html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    ${rc.preload()}
    <title>Início Rápido com Gez</title>
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

## Executando o Projeto

Após configurar os arquivos acima, você pode usar os seguintes comandos para executar o projeto:

1. Modo de desenvolvimento:
```bash
npm run dev
```

2. Construir o projeto:
```bash
npm run build
```

3. Executar em produção:
```bash
npm run start
```

Agora, você criou com sucesso uma aplicação HTML SSR com Gez! Acesse http://localhost:3000 para ver o resultado.