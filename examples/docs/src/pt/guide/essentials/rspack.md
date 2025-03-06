---
titleSuffix: Gez Framework - Motor de Construção de Alto Desempenho
description: Uma análise aprofundada do sistema de construção Rspack do framework Gez, incluindo compilação de alto desempenho, construção para múltiplos ambientes, otimização de recursos e outras funcionalidades principais, ajudando desenvolvedores a construir aplicações web modernas eficientes e confiáveis.
head:
  - - meta
    - property: keywords
      content: Gez, Rspack, Sistema de Construção, Compilação de Alto Desempenho, Atualização a Quente (HMR), Construção para Múltiplos Ambientes, Tree Shaking, Divisão de Código, SSR, Otimização de Recursos, Eficiência de Desenvolvimento, Ferramenta de Construção
---

# Rspack

O Gez é baseado no sistema de construção [Rspack](https://rspack.dev/), aproveitando ao máximo a capacidade de construção de alto desempenho do Rspack. Este documento apresentará o posicionamento e as funcionalidades principais do Rspack no framework Gez.

## Funcionalidades

O Rspack é o sistema de construção central do framework Gez, oferecendo as seguintes funcionalidades-chave:

- **Construção de Alto Desempenho**: Motor de construção implementado em Rust, proporcionando velocidade de compilação extremamente rápida, melhorando significativamente a velocidade de construção de projetos grandes.
- **Otimização da Experiência de Desenvolvimento**: Suporte a atualização a quente (HMR), compilação incremental e outras funcionalidades modernas de desenvolvimento, proporcionando uma experiência de desenvolvimento fluida.
- **Construção para Múltiplos Ambientes**: Configuração de construção unificada que suporta ambientes de cliente (client), servidor (server) e Node.js (node), simplificando o fluxo de desenvolvimento multiplataforma.
- **Otimização de Recursos**: Capacidade integrada de processamento e otimização de recursos, suportando divisão de código, Tree Shaking, compressão de recursos e outras funcionalidades.

## Construção de Aplicações

O sistema de construção Rspack do Gez adota um design modular, consistindo principalmente dos seguintes módulos principais:

### @gez/rspack

Módulo de construção básico, oferecendo as seguintes capacidades principais:

- **Configuração de Construção Unificada**: Fornece gerenciamento padronizado de configurações de construção, suportando configurações para múltiplos ambientes.
- **Processamento de Recursos**: Capacidade integrada de processamento de recursos como TypeScript, CSS, imagens, etc.
- **Otimização de Construção**: Oferece funcionalidades de otimização de desempenho como divisão de código e Tree Shaking.
- **Servidor de Desenvolvimento**: Integra um servidor de desenvolvimento de alto desempenho, com suporte a HMR.

### @gez/rspack-vue

Módulo de construção específico para o framework Vue, oferecendo:

- **Compilação de Componentes Vue**: Suporte à compilação eficiente de componentes Vue 2/3.
- **Otimização para SSR**: Otimizações específicas para cenários de renderização no lado do servidor (SSR).
- **Aprimoramentos de Desenvolvimento**: Aprimoramentos específicos para o ambiente de desenvolvimento Vue.

## Fluxo de Construção

O fluxo de construção do Gez é dividido nas seguintes etapas principais:

1. **Inicialização da Configuração**
   - Carregamento da configuração do projeto
   - Fusão da configuração padrão com a configuração do usuário
   - Ajuste da configuração com base em variáveis de ambiente

2. **Compilação de Recursos**
   - Resolução de dependências do código-fonte
   - Transformação de diversos recursos (TypeScript, CSS, etc.)
   - Processamento de importações e exportações de módulos

3. **Processamento de Otimização**
   - Execução da divisão de código
   - Aplicação de Tree Shaking
   - Compressão de código e recursos

4. **Geração de Saída**
   - Geração de arquivos de destino
   - Saída de mapeamento de recursos
   - Geração de relatório de construção

## Melhores Práticas

### Otimização do Ambiente de Desenvolvimento

- **Configuração de Compilação Incremental**: Configuração adequada da opção `cache`, utilizando cache para acelerar a velocidade de construção.
- **Otimização de HMR**: Configuração direcionada do escopo de atualização a quente, evitando atualizações desnecessárias de módulos.
- **Otimização de Processamento de Recursos**: Uso de configurações adequadas de loader, evitando processamento repetitivo.

### Otimização do Ambiente de Produção

- **Estratégia de Divisão de Código**: Configuração adequada de `splitChunks`, otimizando o carregamento de recursos.
- **Compressão de Recursos**: Ativação de configurações de compressão adequadas, equilibrando tempo de construção e tamanho do produto.
- **Otimização de Cache**: Utilização de hash de conteúdo e estratégias de cache de longo prazo, melhorando o desempenho de carregamento.

## Exemplo de Configuração

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                // Configuração de construção personalizada
                config({ config }) {
                    // Adicione configurações personalizadas do Rspack aqui
                }
            })
        );
    },
} satisfies GezOptions;
```

::: tip
Para mais detalhes sobre a API e opções de configuração, consulte a [Documentação da API do Rspack](/api/app/rspack.html).
:::