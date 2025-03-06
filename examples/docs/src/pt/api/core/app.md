---
titleSuffix: Interface de Abstração de Aplicação do Framework Gez
description: Detalha a interface `App` do framework Gez, incluindo gerenciamento do ciclo de vida do aplicativo, manipulação de recursos estáticos e funcionalidades de renderização no lado do servidor, ajudando os desenvolvedores a entender e utilizar as funcionalidades principais do aplicativo.
head:
  - - meta
    - property: keywords
      content: Gez, App, abstração de aplicação, ciclo de vida, recursos estáticos, renderização no servidor, API
---

# App

`App` é a abstração de aplicação do framework Gez, fornecendo uma interface unificada para gerenciar o ciclo de vida do aplicativo, recursos estáticos e renderização no lado do servidor.

```ts title="entry.node.ts"
export default {
  // Configuração do ambiente de desenvolvimento
  async devApp(gez) {
    return import('@gez/rspack').then((m) =>
      m.createRspackHtmlApp(gez, {
        config(rc) {
          // Personalização da configuração do Rspack
        }
      })
    );
  }
}
```

## Definição de Tipos
### App

```ts
interface App {
  middleware: Middleware;
  render: (options?: RenderContextOptions) => Promise<RenderContext>;
  build?: () => Promise<boolean>;
  destroy?: () => Promise<boolean>;
}
```

#### middleware

- **Tipo**: `Middleware`

Middleware de manipulação de recursos estáticos.

Ambiente de desenvolvimento:
- Processa solicitações de recursos estáticos do código-fonte
- Suporta compilação em tempo real e atualização a quente (hot reload)
- Utiliza política de cache no-cache

Ambiente de produção:
- Processa recursos estáticos após a construção
- Suporta cache de longo prazo para arquivos imutáveis (.final.xxx)
- Estratégia de carregamento de recursos otimizada

```ts
server.use(gez.middleware);
```

#### render

- **Tipo**: `(options?: RenderContextOptions) => Promise<RenderContext>`

Função de renderização no lado do servidor. Fornece implementações diferentes dependendo do ambiente de execução:
- Ambiente de produção (start): Carrega o arquivo de entrada do servidor após a construção (entry.server) e executa a renderização
- Ambiente de desenvolvimento (dev): Carrega o arquivo de entrada do servidor do código-fonte e executa a renderização

```ts
const rc = await gez.render({
  params: { url: '/page' }
});
res.end(rc.html);
```

#### build

- **Tipo**: `() => Promise<boolean>`

Função de construção para o ambiente de produção. Usada para empacotamento e otimização de recursos. Retorna `true` em caso de sucesso na construção e `false` em caso de falha.

#### destroy

- **Tipo**: `() => Promise<boolean>`

Função de limpeza de recursos. Usada para fechar servidores, desconectar conexões, etc. Retorna `true` em caso de sucesso na limpeza e `false` em caso de falha.