---
titleSuffix: Descripción general y innovación tecnológica del marco Gez
description: Profundiza en el contexto del proyecto, la evolución tecnológica y las ventajas clave del marco de microfrontends Gez, y explora soluciones modernas de renderizado en el servidor basadas en ESM.
head:
  - - meta
    - property: keywords
      content: Gez, microfrontends, ESM, renderizado en el servidor, SSR, innovación tecnológica, federación de módulos
---

# Introducción

## Contexto del proyecto
Gez es un marco moderno de microfrontends basado en ECMAScript Modules (ESM), enfocado en construir aplicaciones de renderizado en el servidor (SSR) de alto rendimiento y escalables. Como la tercera generación del proyecto Genesis, Gez ha innovado continuamente en su evolución tecnológica:

- **v1.0**: Implementación de carga bajo demanda de componentes remotos basada en solicitudes HTTP
- **v2.0**: Integración de aplicaciones basada en Webpack Module Federation
- **v3.0**: Rediseño del sistema de [enlace de módulos](/guide/essentials/module-link) basado en ESM nativo del navegador

## Contexto tecnológico
En el desarrollo de la arquitectura de microfrontends, las soluciones tradicionales presentan principalmente las siguientes limitaciones:

### Desafíos de las soluciones existentes
- **Cuellos de botella de rendimiento**: La inyección de dependencias en tiempo de ejecución y los proxies de sandbox de JavaScript generan un sobrecosto significativo en el rendimiento
- **Mecanismos de aislamiento**: Los entornos de sandbox desarrollados internamente no pueden igualar la capacidad de aislamiento de módulos nativos del navegador
- **Complejidad de construcción**: Las modificaciones en las herramientas de construcción para lograr el uso compartido de dependencias aumentan los costos de mantenimiento del proyecto
- **Desviación de estándares**: Las estrategias de implementación especiales y los mecanismos de procesamiento en tiempo de ejecución se desvían de los estándares modernos de desarrollo web
- **Limitaciones del ecosistema**: El acoplamiento del marco y las API personalizadas restringen la elección de la pila tecnológica

### Innovación tecnológica
Gez, basado en estándares web modernos, ofrece una nueva solución:

- **Sistema de módulos nativo**: Utiliza ESM nativo del navegador e Import Maps para la gestión de dependencias, logrando una velocidad de análisis y ejecución más rápida
- **Mecanismo de aislamiento estándar**: Implementa un aislamiento confiable de aplicaciones basado en el ámbito de módulos de ECMAScript
- **Pila tecnológica abierta**: Admite la integración perfecta de cualquier marco frontend moderno
- **Optimización de la experiencia de desarrollo**: Proporciona un modo de desarrollo intuitivo y capacidades completas de depuración
- **Optimización extrema del rendimiento**: Logra un costo de tiempo de ejecución cero mediante capacidades nativas, junto con una estrategia de caché inteligente

:::tip
Gez se enfoca en construir una infraestructura de microfrontends de alto rendimiento y fácilmente extensible, especialmente adecuada para escenarios de aplicaciones de renderizado en el servidor a gran escala.
:::

## Especificaciones técnicas

### Dependencias del entorno
Consulte el documento [Requisitos del entorno](/guide/start/environment) para conocer los requisitos detallados del navegador y del entorno Node.js.

### Pila tecnológica principal
- **Gestión de dependencias**: Utiliza [Import Maps](https://caniuse.com/?search=import%20map) para el mapeo de módulos y [es-module-shims](https://github.com/guybedford/es-module-shims) para proporcionar soporte de compatibilidad
- **Sistema de construcción**: Basado en [module-import](https://rspack.dev/config/externals#externalstypemodule-import) de Rspack para manejar dependencias externas
- **Cadena de herramientas de desarrollo**: Admite actualización en caliente de ESM y ejecución nativa de TypeScript

## Posicionamiento del marco
Gez es diferente de [Next.js](https://nextjs.org) o [Nuxt.js](https://nuxt.com/), ya que se enfoca en proporcionar infraestructura de microfrontends:

- **Sistema de enlace de módulos**: Implementa importación y exportación de módulos eficiente y confiable
- **Renderizado en el servidor**: Proporciona un mecanismo flexible de implementación de SSR
- **Soporte del sistema de tipos**: Integra definiciones de tipos completas de TypeScript
- **Neutralidad del marco**: Admite la integración con marcos frontend principales

## Diseño de arquitectura

### Gestión centralizada de dependencias
- **Fuente de dependencias unificada**: Gestión centralizada de dependencias de terceros
- **Distribución automatizada**: Sincronización global automática de actualizaciones de dependencias
- **Consistencia de versiones**: Control preciso de versiones de dependencias

### Diseño modular
- **Separación de responsabilidades**: Desacoplamiento de la lógica de negocio y la infraestructura
- **Mecanismo de plugins**: Admite combinación y reemplazo flexible de módulos
- **Interfaz estándar**: Protocolo de comunicación entre módulos estandarizado

### Optimización del rendimiento
- **Principio de costo cero**: Maximiza el uso de capacidades nativas del navegador
- **Caché inteligente**: Estrategia de caché precisa basada en hash de contenido
- **Carga bajo demanda**: Gestión de dependencias y división de código refinada

## Madurez del proyecto
Gez, a través de casi 5 años de evolución iterativa (de v1.0 a v3.0), ha sido completamente validado en entornos empresariales. Actualmente soporta docenas de proyectos comerciales en funcionamiento estable y continúa impulsando la modernización de la pila tecnológica. La estabilidad, confiabilidad y ventajas de rendimiento del marco han sido ampliamente probadas en la práctica, proporcionando una base técnica confiable para el desarrollo de aplicaciones a gran escala.