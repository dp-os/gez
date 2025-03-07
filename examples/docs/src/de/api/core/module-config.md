---
titleSuffix: Gez Framework Modulkonfiguration API-Referenz
description: Detaillierte Beschreibung der ModuleConfig-Konfigurationsschnittstelle des Gez-Frameworks, einschließlich Modulimport- und Exportregeln, Alias-Konfiguration und externer Abhängigkeitsverwaltung, um Entwicklern ein tieferes Verständnis des modularen Systems des Frameworks zu vermitteln.
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, Modulkonfiguration, Modulimport und -export, Externe Abhängigkeiten, Alias-Konfiguration, Abhängigkeitsverwaltung, Webanwendungsframework
---

# ModuleConfig

ModuleConfig bietet die Modulkonfigurationsfunktionalität des Gez-Frameworks, um Import- und Exportregeln für Module, Alias-Konfigurationen und externe Abhängigkeiten zu definieren.

## Typdefinitionen

### PathType

- **Typdefinition**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

Enumeration der Modulpfadtypen:
- `npm`: Steht für Abhängigkeiten in node_modules
- `root`: Steht für Dateien im Projektstammverzeichnis

### ModuleConfig

- **Typdefinition**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

Schnittstelle für die Modulkonfiguration, verwendet zur Definition von Export-, Import- und externen Abhängigkeitskonfigurationen für Dienste.

#### exports

Liste der Exportkonfigurationen, die spezifische Codeeinheiten (wie Komponenten, Utility-Funktionen usw.) im ESM-Format nach außen verfügbar machen.

Unterstützt zwei Typen:
- `root:*`: Exportiert Quellcodedateien, z.B.: 'root:src/components/button.vue'
- `npm:*`: Exportiert Drittanbieterabhängigkeiten, z.B.: 'npm:vue'

#### imports

Importkonfigurationszuordnung, konfiguriert die zu importierenden Remote-Module und ihre lokalen Pfade.

Die Konfiguration variiert je nach Installationsmethode:
- Quellcodeinstallation (Workspace, Git): Muss auf das dist-Verzeichnis verweisen
- Paketinstallation (Link, statischer Server, privater Mirror, File): Verweist direkt auf das Paketverzeichnis

#### externals

Zuordnung externer Abhängigkeiten, konfiguriert die zu verwendenden externen Abhängigkeiten, typischerweise Abhängigkeiten aus Remote-Modulen.

**Beispiel**:
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Exportkonfiguration
    exports: [
      'root:src/components/button.vue',  // Exportiert Quellcodedatei
      'root:src/utils/format.ts',
      'npm:vue',  // Exportiert Drittanbieterabhängigkeit
      'npm:vue-router'
    ],

    // Importkonfiguration
    imports: {
      // Quellcodeinstallation: Muss auf dist-Verzeichnis verweisen
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // Paketinstallation: Verweist direkt auf Paketverzeichnis
      'other-remote': 'root:./node_modules/other-remote'
    },

    // Externe Abhängigkeitskonfiguration
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **Typdefinition**:
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

Parsed Module Configuration, die die ursprüngliche Modulkonfiguration in ein standardisiertes internes Format umwandelt:

#### name
Name des aktuellen Dienstes
- Wird zur Identifizierung des Moduls und zur Generierung von Importpfaden verwendet

#### root
Stammverzeichnis des aktuellen Dienstes
- Wird zur Auflösung relativer Pfade und zur Speicherung von Build-Artefakten verwendet

#### exports
Liste der Exportkonfigurationen
- `name`: Ursprünglicher Exportpfad, z.B.: 'npm:vue' oder 'root:src/components'
- `type`: Pfadtyp (npm oder root)
- `importName`: Importname, Format: '${serviceName}/${type}/${path}'
- `exportName`: Exportpfad, relativ zum Dienststammverzeichnis
- `exportPath`: Tatsächlicher Dateipfad
- `externalName`: Name der externen Abhängigkeit, wird als Kennung für den Import dieses Moduls durch andere Dienste verwendet

#### imports
Liste der Importkonfigurationen
- `name`: Name des externen Dienstes
- `localPath`: Lokaler Speicherpfad, wird zur Speicherung der Build-Artefakte des externen Moduls verwendet

#### externals
Zuordnung externer Abhängigkeiten
- Ordnet den Importpfad des Moduls dem tatsächlichen Modulpfad zu
- `match`: Regulärer Ausdruck zum Abgleichen von Importanweisungen
- `import`: Tatsächlicher Modulpfad
```