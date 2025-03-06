---
titleSuffix: Interfaz de abstracción de aplicación del framework Gez
description: Detalles sobre la interfaz App del framework Gez, incluyendo gestión del ciclo de vida de la aplicación, manejo de recursos estáticos y renderizado del lado del servidor, para ayudar a los desarrolladores a comprender y utilizar las funcionalidades principales de la aplicación.
head:
  - - meta
    - property: keywords
      content: Gez, App, abstracción de aplicación, ciclo de vida, recursos estáticos, renderizado del lado del servidor, API
---

# App

`App` es la abstracción de la aplicación en el framework Gez, que proporciona una interfaz unificada para gestionar el ciclo de vida de la aplicación, los recursos estáticos y el renderizado del lado del servidor.

```ts title="entry.node.ts"
export default {
  // Configuración del entorno de desarrollo
  async devApp(gez) {
    return import('@gez/rspack').then((m) =>
      m.createRspackHtmlApp(gez, {
        config(rc) {
          // Configuración personalizada de Rspack
        }
      })
    );
  }
}
```

## Definición de tipos
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

Middleware para el manejo de recursos estáticos.

Entorno de desarrollo:
- Maneja las solicitudes de recursos estáticos del código fuente
- Soporta compilación en tiempo real y actualización en caliente
- Utiliza una estrategia de caché no-cache

Entorno de producción:
- Maneja los recursos estáticos después de la construcción
- Soporta caché a largo plazo para archivos inmutables (.final.xxx)
- Estrategia optimizada para la carga de recursos

```ts
server.use(gez.middleware);
```

#### render

- **Tipo**: `(options?: RenderContextOptions) => Promise<RenderContext>`

Función de renderizado del lado del servidor. Proporciona diferentes implementaciones según el entorno de ejecución:
- Entorno de producción (start): Carga el archivo de entrada del servidor construido (entry.server) para ejecutar el renderizado
- Entorno de desarrollo (dev): Carga el archivo de entrada del servidor desde el código fuente para ejecutar el renderizado

```ts
const rc = await gez.render({
  params: { url: '/page' }
});
res.end(rc.html);
```

#### build

- **Tipo**: `() => Promise<boolean>`

Función de construcción para el entorno de producción. Se utiliza para la compilación y optimización de recursos. Devuelve true si la construcción es exitosa, de lo contrario devuelve false.

#### destroy

- **Tipo**: `() => Promise<boolean>`

Función de limpieza de recursos. Se utiliza para cerrar servidores, desconectar conexiones, etc. Devuelve true si la limpieza es exitosa, de lo contrario devuelve false.