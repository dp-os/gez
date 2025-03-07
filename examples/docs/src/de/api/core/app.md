---
titleSuffix: Gez Framework Anwendungsabstraktionsschnittstelle
description: Detaillierte Beschreibung der App-Schnittstelle des Gez-Frameworks, einschließlich Anwendungslebenszyklusverwaltung, statischer Ressourcenverarbeitung und serverseitigem Rendering, um Entwicklern zu helfen, die Kernfunktionen der Anwendung zu verstehen und zu nutzen.
head:
  - - meta
    - property: keywords
      content: Gez, App, Anwendungsabstraktion, Lebenszyklus, statische Ressourcen, serverseitiges Rendering, API
---

# App

`App` ist die Anwendungsabstraktion des Gez-Frameworks und bietet eine einheitliche Schnittstelle zur Verwaltung des Anwendungslebenszyklus, statischer Ressourcen und des serverseitigen Renderings.

```ts title="entry.node.ts"
export default {
  // Entwicklungsumgebungskonfiguration
  async devApp(gez) {
    return import('@gez/rspack').then((m) =>
      m.createRspackHtmlApp(gez, {
        config(rc) {
          // Benutzerdefinierte Rspack-Konfiguration
        }
      })
    );
  }
}
```

## Typdefinitionen
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

- **Typ**: `Middleware`

Middleware zur Verarbeitung statischer Ressourcen.

Entwicklungsumgebung:
- Verarbeitet Anfragen für statische Ressourcen des Quellcodes
- Unterstützt Echtzeit-Kompilierung und Hot Reload
- Verwendet No-Cache-Caching-Strategie

Produktionsumgebung:
- Verarbeitet gebaute statische Ressourcen
- Unterstützt langfristiges Caching unveränderlicher Dateien (.final.xxx)
- Optimierte Ressourcenlade-Strategie

```ts
server.use(gez.middleware);
```

#### render

- **Typ**: `(options?: RenderContextOptions) => Promise<RenderContext>`

Serverseitige Rendering-Funktion. Bietet unterschiedliche Implementierungen basierend auf der Laufzeitumgebung:
- Produktionsumgebung (start): Lädt die gebaute serverseitige Einstiegsdatei (entry.server) und führt das Rendering aus
- Entwicklungsumgebung (dev): Lädt die serverseitige Einstiegsdatei aus dem Quellcode und führt das Rendering aus

```ts
const rc = await gez.render({
  params: { url: '/page' }
});
res.end(rc.html);
```

#### build

- **Typ**: `() => Promise<boolean>`

Produktions-Build-Funktion. Wird für das Packen und Optimieren von Ressourcen verwendet. Gibt bei erfolgreichem Build true zurück, bei Fehlschlag false.

#### destroy

- **Typ**: `() => Promise<boolean>`

Ressourcenbereinigungsfunktion. Wird zum Herunterfahren des Servers, Trennen von Verbindungen usw. verwendet. Gibt bei erfolgreicher Bereinigung true zurück, bei Fehlschlag false.