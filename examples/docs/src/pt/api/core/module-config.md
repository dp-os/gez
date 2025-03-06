---
titleSuffix: Referência da API de Configuração de Módulos do Framework Gez
description: Detalha a interface de configuração ModuleConfig do framework Gez, incluindo regras de importação e exportação de módulos, configuração de alias e gerenciamento de dependências externas, ajudando os desenvolvedores a entenderem profundamente o sistema modular do framework.
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, configuração de módulos, importação e exportação de módulos, dependências externas, configuração de alias, gerenciamento de dependências, framework de aplicação web
---

# ModuleConfig

O ModuleConfig fornece a funcionalidade de configuração de módulos do framework Gez, usada para definir regras de importação e exportação de módulos, configuração de alias e dependências externas.

## Definição de Tipos

### PathType

- **Definição de Tipo**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

Enumeração de tipos de caminho de módulo:
- `npm`: Representa dependências no node_modules
- `root`: Representa arquivos no diretório raiz do projeto

### ModuleConfig

- **Definição de Tipo**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

Interface de configuração de módulo, usada para definir a exportação, importação e configuração de dependências externas do serviço.

#### exports

Lista de configuração de exportação, expondo unidades de código específicas (como componentes, funções utilitárias, etc.) no serviço no formato ESM.

Suporta dois tipos:
- `root:*`: Exporta arquivos de código-fonte, por exemplo: 'root:src/components/button.vue'
- `npm:*`: Exporta dependências de terceiros, por exemplo: 'npm:vue'

#### imports

Mapeamento de configuração de importação, configurando módulos remotos a serem importados e seus caminhos locais.

A configuração varia dependendo do método de instalação:
- Instalação de código-fonte (Workspace, Git): Precisa apontar para o diretório dist
- Instalação de pacote (Link, servidor estático, repositório privado, File): Aponta diretamente para o diretório do pacote

#### externals

Mapeamento de dependências externas, configurando dependências externas a serem usadas, geralmente dependências de módulos remotos.

**Exemplo**:
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Configuração de exportação
    exports: [
      'root:src/components/button.vue',  // Exporta arquivo de código-fonte
      'root:src/utils/format.ts',
      'npm:vue',  // Exporta dependência de terceiros
      'npm:vue-router'
    ],

    // Configuração de importação
    imports: {
      // Método de instalação de código-fonte: Precisa apontar para o diretório dist
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // Método de instalação de pacote: Aponta diretamente para o diretório do pacote
      'other-remote': 'root:./node_modules/other-remote'
    },

    // Configuração de dependências externas
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **Definição de Tipo**:
```ts
interface ParsedModuleConfig {
  name: string
  root: string
  exports: {
    name: string
    type: PathType
    importName: string
    exportName: string
    exportPath: string
    externalName: string
  }[]
  imports: {
    name: string
    localPath: string
  }[]
  externals: Record<string, { match: RegExp; import?: string }>
}
```

Configuração de módulo analisada, convertendo a configuração de módulo original em um formato interno padronizado:

#### name
Nome do serviço atual
- Usado para identificar o módulo e gerar caminhos de importação

#### root
Caminho do diretório raiz do serviço atual
- Usado para resolver caminhos relativos e armazenar artefatos de construção

#### exports
Lista de configuração de exportação
- `name`: Caminho de exportação original, por exemplo: 'npm:vue' ou 'root:src/components'
- `type`: Tipo de caminho (npm ou root)
- `importName`: Nome de importação, formato: '${serviceName}/${type}/${path}'
- `exportName`: Caminho de exportação, relativo ao diretório raiz do serviço
- `exportPath`: Caminho real do arquivo
- `externalName`: Nome da dependência externa, usado como identificador quando outros serviços importam este módulo

#### imports
Lista de configuração de importação
- `name`: Nome do serviço externo
- `localPath`: Caminho de armazenamento local, usado para armazenar artefatos de construção de módulos externos

#### externals
Mapeamento de dependências externas
- Mapeia caminhos de importação de módulos para a localização real do módulo
- `match`: Expressão regular usada para corresponder a instruções de importação
- `import`: Caminho real do módulo