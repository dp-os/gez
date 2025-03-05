---
titleSuffix: Gez Framework Pack Configuration API Reference
description: Detailed documentation on the PackConfig configuration interface of the Gez framework, including package bundling rules, output configuration, and lifecycle hooks, helping developers implement standardized build processes.
head:
  - - meta
    - property: keywords
      content: Gez, PackConfig, Package Bundling, Build Configuration, Lifecycle Hooks, Bundling Configuration, Web Application Framework
---

# PackConfig

`PackConfig` is the package bundling configuration interface used to bundle the build artifacts of a service into a standard npm .tgz format package.

- **Standardization**: Uses the npm standard .tgz bundling format
- **Completeness**: Includes all necessary files such as module source code, type declarations, and configuration files
- **Compatibility**: Fully compatible with the npm ecosystem, supporting standard package management workflows

## Type Definition

```ts
interface PackConfig {
    enable?: boolean;
    outputs?: string | string[] | boolean;
    packageJson?: (gez: Gez, pkg: Record<string, any>) => Promise<Record<string, any>>;
    onBefore?: (gez: Gez, pkg: Record<string, any>) => Promise<void>;
    onAfter?: (gez: Gez, pkg: Record<string, any>, file: Buffer) => Promise<void>;
}
```

### PackConfig

#### enable

Whether to enable the bundling feature. When enabled, the build artifacts will be bundled into a standard npm .tgz format package.

- Type: `boolean`
- Default: `false`

#### outputs

Specifies the output package file path. Supports the following configuration methods:
- `string`: A single output path, e.g., 'dist/versions/my-app.tgz'
- `string[]`: Multiple output paths for generating multiple versions simultaneously
- `boolean`: When true, uses the default path 'dist/client/versions/latest.tgz'

#### packageJson

A callback function to customize the package.json content. Called before bundling to customize the package.json content.

- Parameters:
  - `gez: Gez` - Gez instance
  - `pkg: any` - Original package.json content
- Return: `Promise<any>` - Modified package.json content

Common Use Cases:
- Modify package name and version
- Add or update dependencies
- Add custom fields
- Configure publishing information

Example:
```ts
packageJson: async (gez, pkg) => {
  // Set package information
  pkg.name = 'my-app';
  pkg.version = '1.0.0';
  pkg.description = 'My Application';

  // Add dependencies
  pkg.dependencies = {
    'vue': '^3.0.0',
    'express': '^4.17.1'
  };

  // Add publish configuration
  pkg.publishConfig = {
    registry: 'https://registry.example.com'
  };

  return pkg;
}
```

#### onBefore

A callback function for pre-bundling preparations.

- Parameters:
  - `gez: Gez` - Gez instance
  - `pkg: Record<string, any>` - package.json content
- Return: `Promise<void>`

Common Use Cases:
- Add additional files (README, LICENSE, etc.)
- Execute tests or build validation
- Generate documentation or metadata
- Clean up temporary files

Example:
```ts
onBefore: async (gez, pkg) => {
  // Add documentation
  await fs.writeFile('dist/README.md', '# My App');
  await fs.writeFile('dist/LICENSE', 'MIT License');

  // Execute tests
  await runTests();

  // Generate documentation
  await generateDocs();

  // Clean up temporary files
  await cleanupTempFiles();
}
```

#### onAfter

A callback function for post-bundling processing. Called after the .tgz file is generated to handle the bundled artifacts.

- Parameters:
  - `gez: Gez` - Gez instance
  - `pkg: Record<string, any>` - package.json content
  - `file: Buffer` - Bundled file content
- Return: `Promise<void>`

Common Use Cases:
- Publish to npm registry (public or private)
- Upload to static asset server
- Perform version management
- Trigger CI/CD pipeline

Example:
```ts
onAfter: async (gez, pkg, file) => {
  // Publish to private npm registry
  await publishToRegistry(file, {
    registry: 'https://registry.example.com'
  });

  // Upload to static asset server
  await uploadToServer(file, 'https://assets.example.com/packages');

  // Create version tag
  await createGitTag(pkg.version);

  // Trigger deployment process
  await triggerDeploy(pkg.version);
}
```

## Usage Example

```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Configure modules to export
    exports: [
      'root:src/components/button.vue',
      'root:src/utils/format.ts',
      'npm:vue',
      'npm:vue-router'
    ]
  },
  // Bundling configuration
  pack: {
    // Enable bundling
    enable: true,

    // Output multiple versions simultaneously
    outputs: [
      'dist/versions/latest.tgz',
      'dist/versions/1.0.0.tgz'
    ],

    // Customize package.json
    packageJson: async (gez, pkg) => {
      pkg.version = '1.0.0';
      return pkg;
    },

    // Pre-bundling preparations
    onBefore: async (gez, pkg) => {
      // Add necessary files
      await fs.writeFile('dist/README.md', '# Your App\n\nModule export instructions...');
      // Execute type checking
      await runTypeCheck();
    },

    // Post-bundling processing
    onAfter: async (gez, pkg, file) => {
      // Publish to private npm registry
      await publishToRegistry(file, {
        registry: 'https://npm.your-registry.com/'
      });
      // Or deploy to static server
      await uploadToServer(file, 'https://static.example.com/packages');
    }
  }
} satisfies GezOptions;
```