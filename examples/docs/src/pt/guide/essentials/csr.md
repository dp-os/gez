---
titleSuffix: Guia de Implementação de Renderização do Lado do Cliente no Framework Gez
description: Detalha o mecanismo de renderização do lado do cliente no framework Gez, incluindo construção estática, estratégias de implantação e melhores práticas, ajudando desenvolvedores a alcançar renderização front-end eficiente em ambientes sem servidor.
head:
  - - meta
    - property: keywords
      content: Gez, Renderização do Lado do Cliente, CSR, Construção Estática, Renderização Front-end, Implantação Sem Servidor, Otimização de Desempenho
---

# Renderização do Lado do Cliente

A Renderização do Lado do Cliente (Client-Side Rendering, CSR) é uma técnica de renderização de páginas executada no navegador. No Gez, quando sua aplicação não pode ser implantada em uma instância de servidor Node.js, você pode optar por gerar um arquivo `index.html` estático durante a fase de construção, implementando assim a renderização puramente do lado do cliente.

## Cenários de Uso

Os seguintes cenários recomendam o uso da renderização do lado do cliente:

- **Ambientes de Hospedagem Estática**: como GitHub Pages, CDN e outros serviços de hospedagem que não suportam renderização do lado do servidor
- **Aplicações Simples**: pequenas aplicações onde a velocidade de carregamento da primeira tela e SEO não são críticos
- **Ambiente de Desenvolvimento**: para visualização e depuração rápida da aplicação durante o desenvolvimento

## Configuração

### Configuração do Modelo HTML

No modo de renderização do lado do cliente, você precisa configurar um modelo HTML genérico. Este modelo servirá como contêiner para a aplicação, incluindo referências de recursos necessários e pontos de montagem.

```ts title="src/entry.server.ts"
import type { RenderContext } from '@gez/core';

export default async (rc: RenderContext) => {
    // Submeter coleta de dependências
    await rc.commit();
    
    // Configurar modelo HTML
    rc.html = `
<!DOCTYPE html>
<html>
<head>
    ${rc.preload()}           // Pré-carregar recursos
    <title>Gez</title>
    ${rc.css()}               // Injetar estilos
</head>
<body>
    <div id="app"></div>
    ${rc.importmap()}         // Mapeamento de importação
    ${rc.moduleEntry()}       // Módulo de entrada
    ${rc.modulePreload()}     // Pré-carregamento de módulos
</body>
</html>
`;
};
```

### Geração de HTML Estático

Para usar a renderização do lado do cliente em um ambiente de produção, é necessário gerar um arquivo HTML estático durante a fase de construção. O Gez fornece uma função de gancho `postBuild` para implementar essa funcionalidade:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    async postBuild(gez) {
        // Gerar arquivo HTML estático
        const rc = await gez.render();
        // Escrever arquivo HTML
        gez.writeSync(
            gez.resolvePath('dist/client', 'index.html'),
            rc.html
        );
    }
} satisfies GezOptions;
```