---
titleSuffix: Interfaccia astratta dell'applicazione del framework Gez
description: Descrizione dettagliata dell'interfaccia App del framework Gez, inclusa la gestione del ciclo di vita dell'applicazione, la gestione delle risorse statiche e il rendering lato server, per aiutare gli sviluppatori a comprendere e utilizzare le funzionalità principali dell'applicazione.
head:
  - - meta
    - property: keywords
      content: Gez, App, astrazione applicazione, ciclo di vita, risorse statiche, rendering lato server, API
---

# App

`App` è l'astrazione dell'applicazione del framework Gez, che fornisce un'interfaccia unificata per gestire il ciclo di vita dell'applicazione, le risorse statiche e il rendering lato server.

```ts title="entry.node.ts"
export default {
  // Configurazione dell'ambiente di sviluppo
  async devApp(gez) {
    return import('@gez/rspack').then((m) =>
      m.createRspackHtmlApp(gez, {
        config(rc) {
          // Configurazione personalizzata di Rspack
        }
      })
    );
  }
}
```

## Definizione dei tipi
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

Middleware per la gestione delle risorse statiche.

Ambiente di sviluppo:
- Gestisce le richieste di risorse statiche dal codice sorgente
- Supporta la compilazione in tempo reale e l'aggiornamento a caldo (hot reload)
- Utilizza una strategia di cache no-cache

Ambiente di produzione:
- Gestisce le risorse statiche dopo la build
- Supporta la cache a lungo termine per file immutabili (.final.xxx)
- Strategia di caricamento delle risorse ottimizzata

```ts
server.use(gez.middleware);
```

#### render

- **Tipo**: `(options?: RenderContextOptions) => Promise<RenderContext>`

Funzione di rendering lato server. Fornisce implementazioni diverse in base all'ambiente di esecuzione:
- Ambiente di produzione (start): Carica il file di ingresso del server dopo la build (entry.server) ed esegue il rendering
- Ambiente di sviluppo (dev): Carica il file di ingresso del server dal codice sorgente ed esegue il rendering

```ts
const rc = await gez.render({
  params: { url: '/page' }
});
res.end(rc.html);
```

#### build

- **Tipo**: `() => Promise<boolean>`

Funzione di build per l'ambiente di produzione. Utilizzata per il bundling e l'ottimizzazione delle risorse. Restituisce true in caso di successo, false in caso di fallimento.

#### destroy

- **Tipo**: `() => Promise<boolean>`

Funzione di pulizia delle risorse. Utilizzata per chiudere il server, disconnettere le connessioni, ecc. Restituisce true in caso di successo, false in caso di fallimento.