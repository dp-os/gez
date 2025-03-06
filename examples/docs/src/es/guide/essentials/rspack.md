---
titleSuffix: Motor de construcción de alto rendimiento del framework Gez
description: Análisis en profundidad del sistema de construcción Rspack del framework Gez, incluyendo compilación de alto rendimiento, construcción para múltiples entornos, optimización de recursos y otras características clave, para ayudar a los desarrolladores a construir aplicaciones web modernas eficientes y confiables.
head:
  - - meta
    - property: keywords
      content: Gez, Rspack, sistema de construcción, compilación de alto rendimiento, actualización en caliente, construcción para múltiples entornos, Tree Shaking, división de código, SSR, optimización de recursos, eficiencia de desarrollo, herramientas de construcción
---

# Rspack

Gez se basa en el sistema de construcción [Rspack](https://rspack.dev/), aprovechando al máximo su capacidad de construcción de alto rendimiento. Este documento presentará el posicionamiento y las funciones principales de Rspack en el framework Gez.

## Características

Rspack es el sistema de construcción central del framework Gez y ofrece las siguientes características clave:

- **Construcción de alto rendimiento**: Motor de construcción implementado en Rust que proporciona una velocidad de compilación extremadamente rápida, mejorando significativamente la velocidad de construcción de proyectos grandes.
- **Optimización de la experiencia de desarrollo**: Soporta características modernas de desarrollo como actualización en caliente (HMR) y compilación incremental, ofreciendo una experiencia de desarrollo fluida.
- **Construcción para múltiples entornos**: Configuración de construcción unificada que soporta entornos de cliente (client), servidor (server) y Node.js (node), simplificando el flujo de desarrollo multiplataforma.
- **Optimización de recursos**: Capacidades integradas de procesamiento y optimización de recursos, soportando características como división de código, Tree Shaking y compresión de recursos.

## Construcción de aplicaciones

El sistema de construcción Rspack de Gez está diseñado de manera modular e incluye los siguientes módulos principales:

### @gez/rspack

Módulo de construcción básico que ofrece las siguientes capacidades centrales:

- **Configuración de construcción unificada**: Proporciona gestión estandarizada de la configuración de construcción, soportando configuraciones para múltiples entornos.
- **Procesamiento de recursos**: Capacidades integradas para procesar recursos como TypeScript, CSS, imágenes, etc.
- **Optimización de construcción**: Ofrece características de optimización de rendimiento como división de código y Tree Shaking.
- **Servidor de desarrollo**: Integra un servidor de desarrollo de alto rendimiento con soporte para HMR.

### @gez/rspack-vue

Módulo de construcción específico para el framework Vue, que ofrece:

- **Compilación de componentes Vue**: Soporta la compilación eficiente de componentes Vue 2/3.
- **Optimización SSR**: Optimizaciones específicas para escenarios de renderizado del lado del servidor.
- **Mejoras para desarrollo**: Funcionalidades específicas mejoradas para el entorno de desarrollo de Vue.

## Flujo de construcción

El flujo de construcción de Gez se divide principalmente en las siguientes etapas:

1. **Inicialización de la configuración**
   - Carga de la configuración del proyecto
   - Fusión de la configuración predeterminada y la configuración del usuario
   - Ajuste de la configuración según las variables de entorno

2. **Compilación de recursos**
   - Resolución de dependencias del código fuente
   - Transformación de varios tipos de recursos (TypeScript, CSS, etc.)
   - Procesamiento de importaciones y exportaciones de módulos

3. **Procesamiento de optimización**
   - Ejecución de la división de código
   - Aplicación de Tree Shaking
   - Compresión de código y recursos

4. **Generación de salida**
   - Generación de archivos de destino
   - Generación de mapas de recursos
   - Generación de informes de construcción

## Mejores prácticas

### Optimización del entorno de desarrollo

- **Configuración de compilación incremental**: Configurar adecuadamente la opción `cache` para acelerar la velocidad de construcción utilizando la caché.
- **Optimización HMR**: Configurar el alcance de la actualización en caliente de manera específica para evitar actualizaciones innecesarias de módulos.
- **Optimización del procesamiento de recursos**: Utilizar configuraciones adecuadas de loader para evitar el procesamiento repetido.

### Optimización del entorno de producción

- **Estrategia de división de código**: Configurar adecuadamente `splitChunks` para optimizar la carga de recursos.
- **Compresión de recursos**: Habilitar configuraciones de compresión adecuadas para equilibrar el tiempo de construcción y el tamaño de los artefactos.
- **Optimización de la caché**: Utilizar estrategias de hash de contenido y caché a largo plazo para mejorar el rendimiento de carga.

## Ejemplo de configuración

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                // Configuración personalizada de construcción
                config({ config }) {
                    // Agregar configuraciones personalizadas de Rspack aquí
                }
            })
        );
    },
} satisfies GezOptions;
```

::: tip
Para obtener más detalles sobre las API y opciones de configuración, consulte la [documentación de la API de Rspack](/api/app/rspack.html).
:::