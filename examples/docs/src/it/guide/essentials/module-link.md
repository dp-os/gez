---
titleSuffix: Meccanismo di condivisione del codice tra servizi nel framework Gez
description: Descrizione dettagliata del meccanismo di collegamento dei moduli nel framework Gez, inclusa la condivisione del codice tra servizi, la gestione delle dipendenze e l'implementazione della specifica ESM, per aiutare gli sviluppatori a costruire applicazioni microfrontend efficienti.
head:
  - - meta
    - property: keywords
      content: Gez, Collegamento moduli, Module Link, ESM, Condivisione codice, Gestione dipendenze, Microfrontend
---

# Collegamento moduli

Il framework Gez fornisce un meccanismo completo di collegamento moduli per gestire la condivisione del codice e le relazioni di dipendenza tra i servizi. Questo meccanismo è implementato sulla base della specifica ESM (ECMAScript Module) e supporta l'esportazione e l'importazione di moduli a livello di codice sorgente, oltre a una completa gestione delle dipendenze.

### Concetti chiave

#### Esportazione moduli
L'esportazione di moduli è il processo di esporre unità di codice specifiche (come componenti, funzioni di utilità, ecc.) da un servizio in formato ESM. Sono supportati due tipi di esportazione:
- **Esportazione codice sorgente**: esportazione diretta dei file di codice sorgente del progetto
- **Esportazione dipendenze**: esportazione dei pacchetti di dipendenze di terze parti utilizzati dal progetto

#### Importazione moduli
L'importazione di moduli è il processo di riferimento a unità di codice esportate da altri servizi all'interno di un servizio. Sono supportati diversi metodi di installazione:
- **Installazione codice sorgente**: adatta per ambienti di sviluppo, supporta modifiche in tempo reale e aggiornamento a caldo
- **Installazione pacchetto**: adatta per ambienti di produzione, utilizza direttamente i prodotti di build

### Meccanismo di precaricamento

Per ottimizzare le prestazioni dei servizi, Gez implementa un meccanismo intelligente di precaricamento moduli:

1. **Analisi dipendenze**
   - Analisi delle relazioni di dipendenza tra i componenti durante la build
   - Identificazione dei moduli core sul percorso critico
   - Determinazione della priorità di caricamento dei moduli

2. **Strategia di caricamento**
   - **Caricamento immediato**: moduli core sul percorso critico
   - **Caricamento differito**: moduli di funzionalità non critiche
   - **Caricamento su richiesta**: moduli con rendering condizionale

3. **Ottimizzazione risorse**
   - Strategia intelligente di suddivisione del codice
   - Gestione della cache a livello di modulo
   - Compilazione e bundling su richiesta

## Esportazione moduli

### Configurazione

Configurare i moduli da esportare in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // Esportazione file sorgente
            'root:src/components/button.vue',  // Componente Vue
            'root:src/utils/format.ts',        // Funzione di utilità
            // Esportazione dipendenze di terze parti
            'npm:vue',                         // Framework Vue
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

La configurazione di esportazione supporta due tipi:
- `root:*`: esportazione file sorgente, percorso relativo alla root del progetto
- `npm:*`: esportazione dipendenze di terze parti, specificando direttamente il nome del pacchetto

## Importazione moduli

### Configurazione

Configurare i moduli da importare in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // Configurazione importazione
        imports: {
            // Installazione codice sorgente: punta alla directory dei prodotti di build
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // Installazione pacchetto: punta alla directory del pacchetto
            'other-remote': 'root:./node_modules/other-remote'
        },
        // Configurazione dipendenze esterne
        externals: {
            // Utilizzo delle dipendenze dai moduli remoti
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

Descrizione delle opzioni di configurazione:
1. **imports**: configura il percorso locale dei moduli remoti
   - Installazione codice sorgente: punta alla directory dei prodotti di build (dist)
   - Installazione pacchetto: punta direttamente alla directory del pacchetto

2. **externals**: configura le dipendenze esterne
   - Utilizzato per condividere le dipendenze dai moduli remoti
   - Evita il rebundling delle stesse dipendenze
   - Supporta la condivisione di dipendenze tra più moduli

### Metodi di installazione

#### Installazione codice sorgente
Adatta per ambienti di sviluppo, supporta modifiche in tempo reale e aggiornamento a caldo.

1. **Modalità Workspace**
Consigliata per progetti Monorepo:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Modalità Link**
Utilizzata per il debug locale:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### Installazione pacchetto
Adatta per ambienti di produzione, utilizza direttamente i prodotti di build.

1. **NPM Registry**
Installazione tramite npm registry:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **Server statico**
Installazione tramite protocollo HTTP/HTTPS:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## Costruzione pacchetti

### Configurazione

Configurare le opzioni di build in `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // Configurazione esportazione moduli
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // Configurazione build
    pack: {
        // Abilita la build
        enable: true,

        // Configurazione output
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // Personalizzazione package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // Pre-elaborazione della build
        onBefore: async (gez, pkg) => {
            // Generazione dichiarazioni di tipo
            // Esecuzione test case
            // Aggiornamento documentazione, ecc.
        },

        // Post-elaborazione della build
        onAfter: async (gez, pkg, file) => {
            // Upload su CDN
            // Pubblicazione su repository npm
            // Deploy su ambiente di test, ecc.
        }
    }
} satisfies GezOptions;
```

### Prodotti della build

```
your-app-name.tgz
├── package.json        # Informazioni pacchetto
├── index.js            # Entrypoint ambiente di produzione
├── server/             # Risorse lato server
│   └── manifest.json   # Mappatura risorse lato server
├── node/               # Runtime Node.js
└── client/             # Risorse lato client
    └── manifest.json   # Mappatura risorse lato client
```

### Processo di pubblicazione

```bash
# 1. Costruzione versione di produzione
gez build

# 2. Pubblicazione su npm
npm publish dist/versions/your-app-name.tgz
```

## Best practice

### Configurazione ambiente di sviluppo
- **Gestione dipendenze**
  - Utilizzare la modalità Workspace o Link per installare le dipendenze
  - Gestione centralizzata delle versioni delle dipendenze
  - Evitare l'installazione duplicata delle stesse dipendenze

- **Esperienza di sviluppo**
  - Abilitare la funzionalità di aggiornamento a caldo
  - Configurare una strategia di precaricamento adeguata
  - Ottimizzare la velocità di build

### Configurazione ambiente di produzione
- **Strategia di deploy**
  - Utilizzare NPM Registry o server statici
  - Garantire l'integrità dei prodotti di build
  - Implementare meccanismi di rilascio graduale

- **Ottimizzazione prestazioni**
  - Configurare correttamente il precaricamento delle risorse
  - Ottimizzare l'ordine di caricamento dei moduli
  - Implementare strategie di caching efficaci

### Gestione versioni
- **Standard versioni**
  - Seguire le specifiche di versionamento semantico
  - Mantenere un changelog dettagliato
  - Eseguire test di compatibilità delle versioni

- **Aggiornamento dipendenze**
  - Aggiornare tempestivamente i pacchetti di dipendenza
  - Eseguire audit di sicurezza periodici
  - Mantenere la coerenza delle versioni delle dipendenze
```