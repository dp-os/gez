---
titleSuffix: Gez Framework Hochleistungs-Build-Engine
description: Eine detaillierte Analyse des Rspack-Build-Systems im Gez-Framework, einschließlich Hochleistungs-Kompilierung, Multi-Umgebungs-Builds, Ressourcenoptimierung und anderen Kernfunktionen, die Entwicklern helfen, effiziente und zuverlässige moderne Webanwendungen zu erstellen.
head:
  - - meta
    - property: keywords
      content: Gez, Rspack, Build-System, Hochleistungs-Kompilierung, Hot Module Replacement, Multi-Umgebungs-Build, Tree Shaking, Code-Splitting, SSR, Ressourcenoptimierung, Entwicklungseffizienz, Build-Tool
---

# Rspack

Gez basiert auf dem [Rspack](https://rspack.dev/)-Build-System und nutzt dessen Hochleistungs-Build-Fähigkeiten voll aus. Dieses Dokument beschreibt die Rolle und die Kernfunktionen von Rspack im Gez-Framework.

## Funktionen

Rspack ist das zentrale Build-System des Gez-Frameworks und bietet die folgenden Schlüsselfunktionen:

- **Hochleistungs-Build**: Eine in Rust implementierte Build-Engine, die eine extrem schnelle Kompilierungsleistung bietet und die Build-Geschwindigkeit großer Projekte erheblich verbessert.
- **Optimierte Entwicklungserfahrung**: Unterstützung für moderne Entwicklungsfunktionen wie Hot Module Replacement (HMR) und inkrementelle Kompilierung, die eine flüssige Entwicklungserfahrung bieten.
- **Multi-Umgebungs-Build**: Einheitliche Build-Konfigurationen für Client-, Server- und Node.js-Umgebungen, die den Entwicklungsprozess für mehrere Plattformen vereinfachen.
- **Ressourcenoptimierung**: Integrierte Fähigkeiten zur Ressourcenverarbeitung und -optimierung, einschließlich Code-Splitting, Tree Shaking und Ressourcenkompression.

## Anwendungs-Build

Das Rspack-Build-System von Gez ist modular aufgebaut und umfasst die folgenden Kernmodule:

### @gez/rspack

Das grundlegende Build-Modul, das die folgenden Kernfähigkeiten bietet:

- **Einheitliche Build-Konfiguration**: Standardisierte Verwaltung von Build-Konfigurationen mit Unterstützung für Multi-Umgebungs-Konfigurationen.
- **Ressourcenverarbeitung**: Integrierte Fähigkeiten zur Verarbeitung von TypeScript, CSS, Bildern und anderen Ressourcen.
- **Build-Optimierung**: Funktionen wie Code-Splitting und Tree Shaking zur Leistungsoptimierung.
- **Entwicklungsserver**: Integration eines Hochleistungs-Entwicklungsservers mit HMR-Unterstützung.

### @gez/rspack-vue

Das spezialisierte Build-Modul für das Vue-Framework, das Folgendes bietet:

- **Vue-Komponenten-Kompilierung**: Effiziente Kompilierung von Vue 2/3-Komponenten.
- **SSR-Optimierung**: Spezifische Optimierungen für Server-Side-Rendering-Szenarien.
- **Entwicklungsverbesserungen**: Spezielle Funktionserweiterungen für die Vue-Entwicklungsumgebung.

## Build-Prozess

Der Build-Prozess von Gez gliedert sich in die folgenden Phasen:

1. **Konfigurationsinitialisierung**
   - Laden der Projektkonfiguration
   - Zusammenführen von Standard- und Benutzerkonfigurationen
   - Anpassung der Konfiguration basierend auf Umgebungsvariablen

2. **Ressourcenkompilierung**
   - Analyse der Quellcode-Abhängigkeiten
   - Transformation verschiedener Ressourcen (TypeScript, CSS usw.)
   - Verarbeitung von Modulimporten und -exporten

3. **Optimierungsverarbeitung**
   - Durchführung von Code-Splitting
   - Anwendung von Tree Shaking
   - Kompression von Code und Ressourcen

4. **Ausgabegenerierung**
   - Erzeugung der Zieldateien
   - Ausgabe von Ressourcen-Mappings
   - Generierung von Build-Berichten

## Best Practices

### Optimierung der Entwicklungsumgebung

- **Inkrementelle Kompilierungskonfiguration**: Angemessene Konfiguration der `cache`-Option, um die Build-Geschwindigkeit durch Caching zu erhöhen.
- **HMR-Optimierung**: Gezielte Konfiguration des HMR-Bereichs, um unnötige Modulaktualisierungen zu vermeiden.
- **Ressourcenverarbeitungsoptimierung**: Verwendung geeigneter Loader-Konfigurationen, um wiederholte Verarbeitung zu vermeiden.

### Optimierung der Produktionsumgebung

- **Code-Splitting-Strategie**: Angemessene Konfiguration von `splitChunks`, um das Laden von Ressourcen zu optimieren.
- **Ressourcenkompression**: Aktivierung geeigneter Kompressionskonfigurationen, um ein Gleichgewicht zwischen Build-Zeit und Artefaktgröße zu erreichen.
- **Cache-Optimierung**: Nutzung von Content-Hashing und Langzeit-Caching-Strategien, um die Ladeleistung zu verbessern.

## Konfigurationsbeispiel

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                // Benutzerdefinierte Build-Konfiguration
                config({ config }) {
                    // Hier können benutzerdefinierte Rspack-Konfigurationen hinzugefügt werden
                }
            })
        );
    },
} satisfies GezOptions;
```

::: tip
Weitere detaillierte API-Beschreibungen und Konfigurationsoptionen finden Sie in der [Rspack API-Dokumentation](/api/app/rspack.html).
:::