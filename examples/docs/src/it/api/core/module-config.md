---
titleSuffix: Riferimento API per la configurazione dei moduli del framework Gez
description: Descrizione dettagliata dell'interfaccia di configurazione ModuleConfig del framework Gez, incluse le regole di importazione/esportazione dei moduli, la configurazione degli alias e la gestione delle dipendenze esterne, per aiutare gli sviluppatori a comprendere a fondo il sistema modulare del framework.
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, configurazione moduli, importazione/esportazione moduli, dipendenze esterne, configurazione alias, gestione dipendenze, framework per applicazioni web
---

# ModuleConfig

ModuleConfig fornisce la funzionalità di configurazione dei moduli per il framework Gez, utilizzata per definire le regole di importazione/esportazione dei moduli, la configurazione degli alias e le dipendenze esterne.

## Definizione dei tipi

### PathType

- **Definizione del tipo**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

Enumerazione dei tipi di percorso dei moduli:
- `npm`: indica le dipendenze presenti in node_modules
- `root`: indica i file presenti nella directory radice del progetto

### ModuleConfig

- **Definizione del tipo**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

Interfaccia di configurazione dei moduli, utilizzata per definire l'esportazione, l'importazione e la configurazione delle dipendenze esterne del servizio.

#### exports

Lista di configurazione delle esportazioni, che espone unità di codice specifiche (come componenti, funzioni di utilità, ecc.) dal servizio in formato ESM.

Supporta due tipi:
- `root:*`: esporta i file sorgente, ad esempio: 'root:src/components/button.vue'
- `npm:*`: esporta dipendenze di terze parti, ad esempio: 'npm:vue'

#### imports

Mappatura di configurazione delle importazioni, che configura i moduli remoti da importare e i loro percorsi locali.

La configurazione varia in base al metodo di installazione:
- Installazione da sorgente (Workspace, Git): deve puntare alla directory dist
- Installazione da pacchetto (Link, server statico, repository privato, File): punta direttamente alla directory del pacchetto

#### externals

Mappatura delle dipendenze esterne, che configura le dipendenze esterne da utilizzare, solitamente provenienti da moduli remoti.

**Esempio**:
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Configurazione delle esportazioni
    exports: [
      'root:src/components/button.vue',  // Esporta file sorgente
      'root:src/utils/format.ts',
      'npm:vue',  // Esporta dipendenza di terze parti
      'npm:vue-router'
    ],

    // Configurazione delle importazioni
    imports: {
      // Installazione da sorgente: deve puntare alla directory dist
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // Installazione da pacchetto: punta direttamente alla directory del pacchetto
      'other-remote': 'root:./node_modules/other-remote'
    },

    // Configurazione delle dipendenze esterne
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **Definizione del tipo**:
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

Configurazione dei moduli analizzata, che converte la configurazione originale dei moduli in un formato interno standardizzato:

#### name
Nome del servizio corrente
- Utilizzato per identificare il modulo e generare i percorsi di importazione

#### root
Percorso della directory radice del servizio corrente
- Utilizzato per risolvere i percorsi relativi e la posizione degli artefatti di build

#### exports
Lista di configurazione delle esportazioni
- `name`: percorso di esportazione originale, ad esempio: 'npm:vue' o 'root:src/components'
- `type`: tipo di percorso (npm o root)
- `importName`: nome di importazione, formato: '${serviceName}/${type}/${path}'
- `exportName`: percorso di esportazione, relativo alla directory radice del servizio
- `exportPath`: percorso effettivo del file
- `externalName`: nome della dipendenza esterna, utilizzato come identificatore quando altri servizi importano questo modulo

#### imports
Lista di configurazione delle importazioni
- `name`: nome del servizio esterno
- `localPath`: percorso di archiviazione locale, utilizzato per memorizzare gli artefatti di build del modulo esterno

#### externals
Mappatura delle dipendenze esterne
- Mappa i percorsi di importazione del modulo alla posizione effettiva del modulo
- `match`: espressione regolare utilizzata per corrispondere alle istruzioni di importazione
- `import`: percorso effettivo del modulo