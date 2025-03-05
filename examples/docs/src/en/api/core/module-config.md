---
titleSuffix: Gez Framework Module Configuration API Reference
description: Detailed documentation on the ModuleConfig configuration interface of the Gez framework, including module import/export rules, alias configuration, and external dependency management, helping developers gain an in-depth understanding of the framework's modular system.
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, Module Configuration, Module Import/Export, External Dependencies, Alias Configuration, Dependency Management, Web Application Framework
---

# ModuleConfig

ModuleConfig provides module configuration functionality for the Gez framework, used to define module import/export rules, alias configuration, and external dependencies.

## Type Definitions

### PathType

- **Type Definition**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

Module path type enumeration:
- `npm`: Represents dependencies in node_modules
- `root`: Represents files under the project root directory

### ModuleConfig

- **Type Definition**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

Module configuration interface, used to define service exports, imports, and external dependency configurations.

#### exports

Export configuration list, exposing specific code units (such as components, utility functions, etc.) from the service in ESM format.

Supports two types:
- `root:*`: Exports source code files, e.g., 'root:src/components/button.vue'
- `npm:*`: Exports third-party dependencies, e.g., 'npm:vue'

#### imports

Import configuration mapping, configuring remote modules to be imported and their local paths.

Configuration varies depending on the installation method:
- Source installation (Workspace, Git): Needs to point to the dist directory
- Package installation (Link, static server, private mirror, File): Directly points to the package directory

#### externals

External dependency mapping, configuring external dependencies to be used, typically dependencies from remote modules.

**Example**:
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Export configuration
    exports: [
      'root:src/components/button.vue',  // Exports source code file
      'root:src/utils/format.ts',
      'npm:vue',  // Exports third-party dependency
      'npm:vue-router'
    ],

    // Import configuration
    imports: {
      // Source installation: Needs to point to the dist directory
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // Package installation: Directly points to the package directory
      'other-remote': 'root:./node_modules/other-remote'
    },

    // External dependency configuration
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **Type Definition**:
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

Parsed module configuration, converting the original module configuration into a standardized internal format:

#### name
Current service name
- Used to identify the module and generate import paths

#### root
Current service root directory path
- Used to resolve relative paths and store build artifacts

#### exports
Export configuration list
- `name`: Original export path, e.g., 'npm:vue' or 'root:src/components'
- `type`: Path type (npm or root)
- `importName`: Import name, format: '${serviceName}/${type}/${path}'
- `exportName`: Export path, relative to the service root directory
- `exportPath`: Actual file path
- `externalName`: External dependency name, used as an identifier when other services import this module

#### imports
Import configuration list
- `name`: External service name
- `localPath`: Local storage path, used to store build artifacts of external modules

#### externals
External dependency mapping
- Maps module import paths to actual module locations
- `match`: Regular expression used to match import statements
- `import`: Actual module path