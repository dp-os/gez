---
titleSuffix: Mecanismo de Compartilhamento de Código entre Serviços do Framework Gez
description: Detalha o mecanismo de vinculação de módulos do framework Gez, incluindo compartilhamento de código entre serviços, gerenciamento de dependências e implementação da especificação ESM, ajudando desenvolvedores a construir aplicações de micro front-end eficientes.
head:
  - - meta
    - property: keywords
      content: Gez, Vinculação de Módulos, Module Link, ESM, Compartilhamento de Código, Gerenciamento de Dependências, Micro Front-end
---

# Vinculação de Módulos

O framework Gez fornece um mecanismo completo de vinculação de módulos para gerenciar o compartilhamento de código e as dependências entre serviços. Este mecanismo é implementado com base na especificação ESM (ECMAScript Module), suportando a exportação e importação de módulos em nível de código-fonte, bem como funcionalidades completas de gerenciamento de dependências.

### Conceitos Principais

#### Exportação de Módulos
A exportação de módulos é o processo de expor unidades de código específicas (como componentes, funções utilitárias, etc.) de um serviço no formato ESM. São suportados dois tipos de exportação:
- **Exportação de Código-Fonte**: Exporta diretamente arquivos de código-fonte do projeto
- **Exportação de Dependências**: Exporta pacotes de dependências de terceiros usados pelo projeto

#### Importação de Módulos
A importação de módulos é o processo de referenciar unidades de código exportadas por outros serviços em um serviço. São suportados vários métodos de instalação:
- **Instalação de Código-Fonte**: Adequado para ambientes de desenvolvimento, suporta modificações em tempo real e atualização a quente (hot update)
- **Instalação de Pacotes**: Adequado para ambientes de produção, utiliza diretamente os artefatos de construção

### Mecanismo de Pré-carregamento

Para otimizar o desempenho dos serviços, o Gez implementa um mecanismo inteligente de pré-carregamento de módulos:

1. **Análise de Dependências**
   - Analisa as dependências entre componentes durante a construção
   - Identifica os módulos principais no caminho crítico
   - Determina a prioridade de carregamento dos módulos

2. **Estratégia de Carregamento**
   - **Carregamento Imediato**: Módulos principais no caminho crítico
   - **Carregamento Atrasado**: Módulos de funcionalidades não críticas
   - **Carregamento Sob Demanda**: Módulos renderizados condicionalmente

3. **Otimização de Recursos**
   - Estratégia inteligente de divisão de código (code splitting)
   - Gerenciamento de cache em nível de módulo
   - Compilação e empacotamento sob demanda

## Exportação de Módulos

### Configuração

Configure os módulos a serem exportados em `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // Exportar arquivos de código-fonte
            'root:src/components/button.vue',  // Componente Vue
            'root:src/utils/format.ts',        // Função utilitária
            // Exportar dependências de terceiros
            'npm:vue',                         // Framework Vue
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

A configuração de exportação suporta dois tipos:
- `root:*`: Exporta arquivos de código-fonte, com caminho relativo ao diretório raiz do projeto
- `npm:*`: Exporta dependências de terceiros, especificando diretamente o nome do pacote

## Importação de Módulos

### Configuração

Configure os módulos a serem importados em `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // Configuração de importação
        imports: {
            // Instalação de código-fonte: aponta para o diretório de artefatos de construção
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // Instalação de pacotes: aponta para o diretório do pacote
            'other-remote': 'root:./node_modules/other-remote'
        },
        // Configuração de dependências externas
        externals: {
            // Usar dependências de módulos remotos
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

Explicação dos itens de configuração:
1. **imports**: Configura o caminho local dos módulos remotos
   - Instalação de código-fonte: aponta para o diretório de artefatos de construção (dist)
   - Instalação de pacotes: aponta diretamente para o diretório do pacote

2. **externals**: Configura dependências externas
   - Usado para compartilhar dependências de módulos remotos
   - Evita empacotamento repetido das mesmas dependências
   - Suporta compartilhamento de dependências entre vários módulos

### Métodos de Instalação

#### Instalação de Código-Fonte
Adequado para ambientes de desenvolvimento, suporta modificações em tempo real e atualização a quente.

1. **Modo Workspace**
Recomendado para uso em projetos Monorepo:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Modo Link**
Usado para depuração local:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### Instalação de Pacotes
Adequado para ambientes de produção, utiliza diretamente os artefatos de construção.

1. **Registro NPM**
Instalação via registro npm:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **Servidor Estático**
Instalação via protocolo HTTP/HTTPS:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## Construção de Pacotes

### Configuração

Configure as opções de construção em `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // Configuração de exportação de módulos
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // Configuração de construção
    pack: {
        // Habilitar construção
        enable: true,

        // Configuração de saída
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // Personalizar package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // Processamento pré-construção
        onBefore: async (gez, pkg) => {
            // Gerar declarações de tipo
            // Executar casos de teste
            // Atualizar documentação, etc.
        },

        // Processamento pós-construção
        onAfter: async (gez, pkg, file) => {
            // Fazer upload para CDN
            // Publicar no repositório npm
            // Implantar em ambiente de teste, etc.
        }
    }
} satisfies GezOptions;
```

### Artefatos de Construção

```
your-app-name.tgz
├── package.json        # Informações do pacote
├── index.js            # Entrada para ambiente de produção
├── server/             # Recursos do servidor
│   └── manifest.json   # Mapeamento de recursos do servidor
├── node/               # Tempo de execução Node.js
└── client/             # Recursos do cliente
    └── manifest.json   # Mapeamento de recursos do cliente
```

### Fluxo de Publicação

```bash
# 1. Construir versão de produção
gez build

# 2. Publicar no npm
npm publish dist/versions/your-app-name.tgz
```

## Melhores Práticas

### Configuração de Ambiente de Desenvolvimento
- **Gerenciamento de Dependências**
  - Usar modo Workspace ou Link para instalar dependências
  - Gerenciar versões de dependências de forma unificada
  - Evitar instalação repetida das mesmas dependências

- **Experiência de Desenvolvimento**
  - Habilitar funcionalidade de atualização a quente
  - Configurar estratégia de pré-carregamento adequada
  - Otimizar velocidade de construção

### Configuração de Ambiente de Produção
- **Estratégia de Implantação**
  - Usar registro npm ou servidor estático
  - Garantir integridade dos artefatos de construção
  - Implementar mecanismo de lançamento gradual (gray release)

- **Otimização de Desempenho**
  - Configurar pré-carregamento de recursos de forma adequada
  - Otimizar ordem de carregamento de módulos
  - Implementar estratégia de cache eficaz

### Gerenciamento de Versões
- **Padrão de Versões**
  - Seguir a especificação de versionamento semântico
  - Manter registro detalhado de alterações
  - Realizar testes de compatibilidade de versões

- **Atualização de Dependências**
  - Atualizar pacotes de dependências regularmente
  - Realizar auditorias de segurança periodicamente
  - Manter consistência de versões de dependências