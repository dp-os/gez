---
titleSuffix: Gez Framework - Code-Sharing-Mechanismus zwischen Diensten
description: Detaillierte Erläuterung des Modulverknüpfungsmechanismus des Gez Frameworks, einschließlich Code-Sharing zwischen Diensten, Abhängigkeitsverwaltung und Implementierung der ESM-Spezifikation, um Entwicklern beim Aufbau effizienter Micro-Frontend-Anwendungen zu helfen.
head:
  - - meta
    - property: keywords
      content: Gez, Modulverknüpfung, Module Link, ESM, Code-Sharing, Abhängigkeitsverwaltung, Micro-Frontend
---

# Modulverknüpfung

Das Gez Framework bietet einen umfassenden Modulverknüpfungsmechanismus zur Verwaltung des Code-Sharings und der Abhängigkeiten zwischen Diensten. Dieser Mechanismus basiert auf der ESM-Spezifikation (ECMAScript Module) und unterstützt das Exportieren und Importieren von Modulen auf Quellcodeebene sowie eine vollständige Abhängigkeitsverwaltung.

### Kernkonzepte

#### Modulexport
Der Modulexport ist der Prozess, bei dem spezifische Codeeinheiten (wie Komponenten, Utility-Funktionen usw.) eines Dienstes im ESM-Format nach außen verfügbar gemacht werden. Es werden zwei Exporttypen unterstützt:
- **Quellcodeexport**: Direktes Exportieren von Quellcodedateien aus dem Projekt
- **Abhängigkeitsexport**: Exportieren von verwendeten Drittanbieter-Abhängigkeiten

#### Modulimport
Der Modulimport ist der Prozess, bei dem Codeeinheiten, die von anderen Diensten exportiert wurden, in einem Dienst referenziert werden. Es werden mehrere Installationsmethoden unterstützt:
- **Quellcodeinstallation**: Geeignet für Entwicklungsumgebungen, unterstützt Echtzeitänderungen und Hot-Reloading
- **Paketinstallation**: Geeignet für Produktionsumgebungen, verwendet direkt die Build-Artefakte

### Vorlademechanismus

Um die Dienstleistung zu optimieren, implementiert Gez einen intelligenten Modulvorlademechanismus:

1. **Abhängigkeitsanalyse**
   - Analyse der Abhängigkeiten zwischen Komponenten während des Builds
   - Identifizierung der Kernmodule auf dem kritischen Pfad
   - Bestimmung der Ladepriorität der Module

2. **Ladestrategie**
   - **Sofortiges Laden**: Kernmodule auf dem kritischen Pfad
   - **Verzögertes Laden**: Module für nicht kritische Funktionen
   - **Nachfragebasiertes Laden**: Bedingt gerenderte Module

3. **Ressourcenoptimierung**
   - Intelligente Code-Splitting-Strategie
   - Cache-Verwaltung auf Modulebene
   - Nachfragebasierte Kompilierung und Bundling

## Modulexport

### Konfigurationsbeschreibung

Konfigurieren Sie die zu exportierenden Module in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // Exportieren von Quellcodedateien
            'root:src/components/button.vue',  // Vue-Komponente
            'root:src/utils/format.ts',        // Utility-Funktion
            // Exportieren von Drittanbieter-Abhängigkeiten
            'npm:vue',                         // Vue-Framework
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

Die Exportkonfiguration unterstützt zwei Typen:
- `root:*`: Exportiert Quellcodedateien, der Pfad ist relativ zum Projektstammverzeichnis
- `npm:*`: Exportiert Drittanbieter-Abhängigkeiten, direkt durch Angabe des Paketnamens

## Modulimport

### Konfigurationsbeschreibung

Konfigurieren Sie die zu importierenden Module in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // Importkonfiguration
        imports: {
            // Quellcodeinstallation: Verweis auf das Build-Artefaktverzeichnis
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // Paketinstallation: Verweis auf das Paketverzeichnis
            'other-remote': 'root:./node_modules/other-remote'
        },
        // Externe Abhängigkeitskonfiguration
        externals: {
            // Verwenden von Abhängigkeiten aus Remote-Modulen
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

Konfigurationsbeschreibung:
1. **imports**: Konfiguriert den lokalen Pfad für Remote-Module
   - Quellcodeinstallation: Verweis auf das Build-Artefaktverzeichnis (dist)
   - Paketinstallation: Direkter Verweis auf das Paketverzeichnis

2. **externals**: Konfiguriert externe Abhängigkeiten
   - Zum Teilen von Abhängigkeiten aus Remote-Modulen
   - Vermeidung von doppeltem Bundling gleicher Abhängigkeiten
   - Unterstützung des Teilens von Abhängigkeiten zwischen mehreren Modulen

### Installationsmethoden

#### Quellcodeinstallation
Geeignet für Entwicklungsumgebungen, unterstützt Echtzeitänderungen und Hot-Reloading.

1. **Workspace-Methode**
Empfohlen für die Verwendung in Monorepo-Projekten:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Link-Methode**
Für lokale Entwicklungs- und Debugging-Zwecke:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### Paketinstallation
Geeignet für Produktionsumgebungen, verwendet direkt die Build-Artefakte.

1. **NPM Registry**
Installation über die npm-Registry:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **Statischer Server**
Installation über das HTTP/HTTPS-Protokoll:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## Paketbuild

### Konfigurationsbeschreibung

Konfigurieren Sie die Build-Optionen in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // Modulexportkonfiguration
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // Build-Konfiguration
    pack: {
        // Build aktivieren
        enable: true,

        // Ausgabekonfiguration
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // Benutzerdefinierte package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // Vor-Build-Verarbeitung
        onBefore: async (gez, pkg) => {
            // Generierung von Typdeklarationen
            // Ausführung von Testfällen
            // Aktualisierung der Dokumentation usw.
        },

        // Nach-Build-Verarbeitung
        onAfter: async (gez, pkg, file) => {
            // Hochladen auf CDN
            // Veröffentlichung im npm-Repository
            // Bereitstellung in der Testumgebung usw.
        }
    }
} satisfies GezOptions;
```

### Build-Artefakte

```
your-app-name.tgz
├── package.json        # Paketinformationen
├── index.js            # Produktionsumgebungseinstiegspunkt
├── server/             # Serverressourcen
│   └── manifest.json   # Serverressourcen-Mapping
├── node/               # Node.js-Laufzeitumgebung
└── client/             # Clientressourcen
    └── manifest.json   # Clientressourcen-Mapping
```

### Veröffentlichungsprozess

```bash
# 1. Produktionsversion erstellen
gez build

# 2. Auf npm veröffentlichen
npm publish dist/versions/your-app-name.tgz
```

## Best Practices

### Entwicklungsumgebungskonfiguration
- **Abhängigkeitsverwaltung**
  - Verwenden Sie die Workspace- oder Link-Methode zur Installation von Abhängigkeiten
  - Verwalten Sie Abhängigkeitsversionen zentral
  - Vermeiden Sie die doppelte Installation gleicher Abhängigkeiten

- **Entwicklungserlebnis**
  - Aktivieren Sie die Hot-Reloading-Funktion
  - Konfigurieren Sie eine geeignete Vorladestrategie
  - Optimieren Sie die Build-Geschwindigkeit

### Produktionsumgebungskonfiguration
- **Bereitstellungsstrategie**
  - Verwenden Sie die NPM Registry oder einen statischen Server
  - Stellen Sie die Integrität der Build-Artefakte sicher
  - Implementieren Sie einen Graustufen-Veröffentlichungsmechanismus

- **Leistungsoptimierung**
  - Konfigurieren Sie die Ressourcenvorladung angemessen
  - Optimieren Sie die Modulladereihenfolge
  - Implementieren Sie eine effektive Cache-Strategie

### Versionsverwaltung
- **Versionsrichtlinien**
  - Befolgen Sie die semantische Versionsverwaltung
  - Pflegen Sie detaillierte Änderungsprotokolle
  - Führen Sie Kompatibilitätstests durch

- **Abhängigkeitsaktualisierung**
  - Aktualisieren Sie Abhängigkeiten zeitnah
  - Führen Sie regelmäßige Sicherheitsaudits durch
  - Halten Sie Abhängigkeitsversionen konsistent