---
titleSuffix: Gez Framework Server-Side Rendering Core Mechanism
description: Detailed introduction to the RenderContext mechanism in the Gez framework, including resource management, HTML generation, and ESM module system, helping developers understand and utilize server-side rendering capabilities.
head:
  - - meta
    - property: keywords
      content: Gez, Render Context, RenderContext, SSR, Server-Side Rendering, ESM, Resource Management
---

# Render Context

RenderContext is a core class in the Gez framework, primarily responsible for resource management and HTML generation during server-side rendering (SSR). It features the following core characteristics:

1. **ESM-Based Module System**
   - Adopts modern ECMAScript Modules standards
   - Supports native module import/export
   - Enables better code splitting and on-demand loading

2. **Intelligent Dependency Collection**
   - Dynamically collects dependencies based on actual rendering paths
   - Avoids unnecessary resource loading
   - Supports asynchronous components and dynamic imports

3. **Precise Resource Injection**
   - Strictly controls resource loading order
   - Optimizes first-screen loading performance
   - Ensures reliability of client-side hydration

4. **Flexible Configuration Mechanism**
   - Supports dynamic base path configuration
   - Provides multiple import mapping modes
   - Adapts to different deployment scenarios

## Usage

In the Gez framework, developers typically do not need to create RenderContext instances directly. Instead, they obtain instances through the `gez.render()` method:

```ts title="src/entry.node.ts"
async server(gez) {
    const server = http.createServer((req, res) => {
        // Static file handling
        gez.middleware(req, res, async () => {
            // Obtain RenderContext instance via gez.render()
            const rc = await gez.render({
                params: {
                    url: req.url
                }
            });
            // Respond with HTML content
            res.end(rc.html);
        });
    });
}
```

## Main Features

### Dependency Collection

RenderContext implements an intelligent dependency collection mechanism that dynamically collects dependencies based on the actual rendering of components, rather than preloading all potentially used resources:

#### On-Demand Collection
- Automatically tracks and records module dependencies during component rendering
- Collects only the CSS, JavaScript, and other resources actually used during the current page rendering
- Precisely records each component's module dependencies through `importMetaSet`
- Supports dependency collection for asynchronous components and dynamic imports

#### Automated Handling
- Developers do not need to manually manage the dependency collection process
- The framework automatically collects dependency information during component rendering
- Processes all collected resources uniformly through the `commit()` method
- Automatically handles circular and duplicate dependencies

#### Performance Optimization
- Avoids loading unused modules, significantly reducing first-screen load time
- Precisely controls resource loading order, optimizing page rendering performance
- Automatically generates optimal import maps
- Supports resource preloading and on-demand loading strategies

### Resource Injection

RenderContext provides multiple methods to inject different types of resources, each designed to optimize resource loading performance:

- `preload()`: Preloads CSS and JS resources, supports priority configuration
- `css()`: Injects first-screen stylesheets, supports critical CSS extraction
- `importmap()`: Injects module import maps, supports dynamic path resolution
- `moduleEntry()`: Injects client-side entry modules, supports multi-entry configuration
- `modulePreload()`: Preloads module dependencies, supports on-demand loading strategies

### Resource Injection Order

RenderContext strictly controls the resource injection order, designed based on browser mechanics and performance optimization considerations:

1. Head Section:
   - `preload()`: Preloads CSS and JS resources, allowing the browser to discover and start loading these resources early
   - `css()`: Injects first-screen stylesheets, ensuring page styles are in place when content renders

2. Body Section:
   - `importmap()`: Injects module import maps, defining ESM module path resolution rules
   - `moduleEntry()`: Injects client-side entry modules, must execute after importmap
   - `modulePreload()`: Preloads module dependencies, must execute after importmap

## Complete Rendering Process

A typical RenderContext usage process is as follows:

```ts title="src/entry.server.ts"
export default async (rc: RenderContext) => {
    // 1. Render page content and collect dependencies
    const app = createApp();
    const html = await renderToString(app, {
       importMetaSet: rc.importMetaSet
    });

    // 2. Commit dependency collection
    await rc.commit();
    
    // 3. Generate complete HTML
    rc.html = `
        <!DOCTYPE html>
        <html>
        <head>
            ${rc.preload()}
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

## Advanced Features

### Base Path Configuration

RenderContext provides a flexible dynamic base path configuration mechanism, supporting runtime dynamic setting of static resource base paths:

```ts title="src/entry.node.ts"
const rc = await gez.render({
    base: '/gez',  // Set base path
    params: {
        url: req.url
    }
});
```

This mechanism is particularly suitable for the following scenarios:

1. **Multi-Language Site Deployment**
   ```
   main-domain.com      → Default language
   main-domain.com/cn/  → Chinese site
   main-domain.com/en/  → English site
   ```

2. **Micro-Frontend Applications**
   - Supports flexible deployment of sub-applications under different paths
   - Facilitates integration into different main applications

### Import Map Modes

RenderContext provides two import map modes:

1. **Inline Mode** (Default)
   - Inlines import maps directly into HTML
   - Suitable for small applications, reduces additional network requests
   - Immediately available upon page load

2. **JS Mode**
   - Loads import maps via external JavaScript files
   - Suitable for large applications, leverages browser caching mechanisms
   - Supports dynamic updates to map content

You can choose the appropriate mode via configuration:

```ts title="src/entry.node.ts"
const rc = await gez.render({
    importmapMode: 'js',  // 'inline' | 'js'
    params: {
        url: req.url
    }
});
```

### Entry Function Configuration

RenderContext supports specifying the server-side rendering entry function via the `entryName` configuration:

```ts title="src/entry.node.ts"
const rc = await gez.render({
    entryName: 'mobile',  // Specify mobile entry function
    params: {
        url: req.url
    }
});
```

This mechanism is particularly suitable for the following scenarios:

1. **Multi-Template Rendering**
   ```ts title="src/entry.server.ts"
   // Mobile entry function
   export const mobile = async (rc: RenderContext) => {
       // Mobile-specific rendering logic
   };

   // Desktop entry function
   export const desktop = async (rc: RenderContext) => {
       // Desktop-specific rendering logic
   };
   ```

2. **A/B Testing**
   - Supports different rendering logic for the same page
   - Facilitates user experience experiments
   - Flexible switching between different rendering strategies

3. **Special Rendering Requirements**
   - Supports custom rendering flows for certain pages
   - Adapts to performance optimization needs in different scenarios
   - Enables finer-grained rendering control

## Best Practices

1. **Obtaining RenderContext Instances**
   - Always obtain instances via the `gez.render()` method
   - Pass appropriate parameters as needed
   - Avoid manually creating instances

2. **Dependency Collection**
   - Ensure all modules correctly call `importMetaSet.add(import.meta)`
   - Immediately call the `commit()` method after rendering completes
   - Reasonably use asynchronous components and dynamic imports to optimize first-screen loading

3. **Resource Injection**
   - Strictly follow resource injection order
   - Do not inject CSS in the body
   - Ensure importmap precedes moduleEntry

4. **Performance Optimization**
   - Use preload to preload critical resources
   - Reasonably use modulePreload to optimize module loading
   - Avoid unnecessary resource loading
   - Leverage browser caching mechanisms to optimize loading performance