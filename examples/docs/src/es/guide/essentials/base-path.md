---
titleSuffix: Guía de configuración de rutas de recursos estáticos en el marco Gez
description: Detalles sobre la configuración de rutas base en el marco Gez, incluyendo despliegue en múltiples entornos, distribución CDN y configuración de rutas de acceso a recursos, para ayudar a los desarrolladores a gestionar recursos estáticos de manera flexible.
head:
  - - meta
    - property: keywords
      content: Gez, Ruta base, Base Path, CDN, Recursos estáticos, Despliegue en múltiples entornos, Gestión de recursos
---

# Ruta base

La ruta base (Base Path) es el prefijo de la ruta de acceso a los recursos estáticos (como JavaScript, CSS, imágenes, etc.) en una aplicación. En Gez, una configuración adecuada de la ruta base es crucial para los siguientes escenarios:

- **Despliegue en múltiples entornos**: Soporte para diferentes entornos como desarrollo, pruebas y producción.
- **Despliegue en múltiples regiones**: Adaptación a las necesidades de despliegue en clústeres de diferentes regiones o países.
- **Distribución CDN**: Implementación de distribución global y aceleración de recursos estáticos.

## Mecanismo de ruta predeterminada

Gez utiliza un mecanismo automático de generación de rutas basado en el nombre del servicio. Por defecto, el marco lee el campo `name` del archivo `package.json` del proyecto para generar la ruta base de los recursos estáticos: `/your-app-name/`.

```json title="package.json"
{
    "name": "your-app-name"
}
```

Este diseño de convención sobre configuración tiene las siguientes ventajas:

- **Consistencia**: Asegura que todos los recursos estáticos utilicen una ruta de acceso uniforme.
- **Previsibilidad**: La ruta de acceso a los recursos se puede inferir directamente desde el campo `name` del `package.json`.
- **Mantenibilidad**: No requiere configuración adicional, reduciendo los costos de mantenimiento.

## Configuración dinámica de rutas

En proyectos reales, a menudo necesitamos desplegar el mismo código en diferentes entornos o regiones. Gez ofrece soporte para rutas base dinámicas, permitiendo que la aplicación se adapte a diferentes escenarios de despliegue.

### Casos de uso

#### Despliegue en subdirectorios
```
- example.com      -> Sitio principal por defecto
- example.com/cn/  -> Sitio en chino
- example.com/en/  -> Sitio en inglés
```

#### Despliegue en dominios independientes
```
- example.com    -> Sitio principal por defecto
- cn.example.com -> Sitio en chino
- en.example.com -> Sitio en inglés
```

### Método de configuración

A través del parámetro `base` del método `gez.render()`, puedes configurar dinámicamente la ruta base según el contexto de la solicitud:

```ts
const render = await gez.render({
    base: '/cn',  // Configurar la ruta base
    params: {
        url: req.url
    }
});
```