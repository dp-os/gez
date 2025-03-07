---
titleSuffix: Gez Framework Inter-Service Code Sharing Mechanism
description: Detailed introduction to Gez framework's module linking mechanism, including inter-service code sharing, dependency management, and ESM specification implementation, helping developers build efficient micro-frontend applications.
head:
  - - meta
    - property: keywords
      content: Gez, Module Linking, ESM, Code Sharing, Dependency Management, Micro-frontend
---

# Module Linking

The Gez framework provides a comprehensive module linking mechanism for managing code sharing and dependency relationships between services. This mechanism is implemented based on the ESM (ECMAScript Module) specification, supporting source-level module exports and imports, as well as complete dependency management functionality.

### Core Concepts

#### Module Export
Module export is the process of exposing specific code units (such as components, utility functions, etc.) from a service in ESM format. It supports two types of exports:
- **Source Code Export**: Directly exports source code files from the project
- **Dependency Export**: Exports third-party dependency packages used by the project

#### Module Import
Module import is the process of referencing code units exported by other services within a service. It supports multiple installation methods:
- **Source Code Installation**: Suitable for development environments, supports real-time modifications and hot updates
- **Package Installation**: Suitable for production environments, directly uses build artifacts

### Preloading Mechanism

To optimize service performance, Gez implements an intelligent module preloading mechanism:

1. **Dependency Analysis**
   - Analyze dependencies between components during build time
   - Identify core modules on critical paths
   - Determine module loading priorities

2. **Loading Strategy**
   - **Immediate Loading**: Core modules on critical paths
   - **Lazy Loading**: Non-critical functional modules
   - **On-demand Loading**: Conditionally rendered modules

3. **Resource Optimization**
   - Intelligent code splitting strategy
   - Module-level cache management
   - On-demand compilation and bundling

## Module Export

### Configuration Instructions

Configure the modules to be exported in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // Export source code files
            'root:src/components/button.vue',  // Vue component
            'root:src/utils/format.ts',        // Utility function
            // Export third-party dependencies
            'npm:vue',                         // Vue framework
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

Export configuration supports two types:
- `root:*`: Exports source code files, paths relative to the project root directory
- `npm:*`: Exports third-party dependencies, directly specifies package names

## Module Import

### Configuration Instructions

Configure the modules to be imported in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // Import configuration
        imports: {
            // Source code installation: points to build artifact directory
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // Package installation: points to package directory
            'other-remote': 'root:./node_modules/other-remote'
        },
        // External dependency configuration
        externals: {
            // Use dependencies from remote modules
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

Configuration item descriptions:
1. **imports**: Configures local paths for remote modules
   - Source code installation: Points to build artifact directory (dist)
   - Package installation: Directly points to package directory

2. **externals**: Configures external dependencies
   - Used for sharing dependencies from remote modules
   - Avoids duplicate bundling of the same dependencies
   - Supports multiple modules sharing dependencies

### Installation Methods

#### Source Code Installation
Suitable for development environments, supports real-time modifications and hot updates.

1. **Workspace Method**
Recommended for use in Monorepo projects:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Link Method**
Used for local development and debugging:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### Package Installation
Suitable for production environments, directly uses build artifacts.

1. **NPM Registry**
Install via npm registry:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **Static Server**
Install via HTTP/HTTPS protocol:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## Package Building

### Configuration Instructions

Configure build options in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // Module export configuration
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // Build configuration
    pack: {
        // Enable build
        enable: true,

        // Output configuration
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // Custom package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // Pre-build processing
        onBefore: async (gez, pkg) => {
            // Generate type declarations
            // Execute test cases
            // Update documentation, etc.
        },

        // Post-build processing
        onAfter: async (gez, pkg, file) => {
            // Upload to CDN
            // Publish to npm registry
            // Deploy to test environment, etc.
        }
    }
} satisfies GezOptions;
```

### Build Artifacts

```
your-app-name.tgz
├── package.json        # Package information
├── index.js            # Production environment entry
├── server/             # Server-side resources
│   └── manifest.json   # Server-side resource mapping
├── node/               # Node.js runtime
└── client/             # Client-side resources
    └── manifest.json   # Client-side resource mapping
```

### Publishing Process

```bash
# 1. Build production version
gez build

# 2. Publish to npm
npm publish dist/versions/your-app-name.tgz
```

## Best Practices

### Development Environment Configuration
- **Dependency Management**
  - Use Workspace or Link method for dependency installation
  - Unified management of dependency versions
  - Avoid duplicate installation of the same dependencies

- **Development Experience**
  - Enable hot update functionality
  - Configure appropriate preloading strategies
  - Optimize build speed

### Production Environment Configuration
- **Deployment Strategy**
  - Use NPM Registry or static server
  - Ensure build artifact integrity
  - Implement canary release mechanism

- **Performance Optimization**
  - Properly configure resource preloading
  - Optimize module loading order
  - Implement effective caching strategies

### Version Management
- **Version Specification**
  - Follow semantic versioning specification
  - Maintain detailed changelogs
  - Conduct version compatibility testing

- **Dependency Updates**
  - Update dependencies promptly
  - Conduct regular security audits
  - Maintain dependency version consistency
```