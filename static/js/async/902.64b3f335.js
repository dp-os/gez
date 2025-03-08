"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["902"],{9037:function(e,i,n){n.r(i),n.d(i,{default:()=>d});var r=n(1549),a=n(6603),s=n(1519);function o(e){let i=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",code:"code",h3:"h3",pre:"pre",ul:"ul",li:"li",strong:"strong"},(0,a.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(i.h1,{id:"gezrspack",children:["@gez/rspack",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#gezrspack",children:"#"})]}),"\n",(0,r.jsx)(i.p,{children:"Il pacchetto Rspack fornisce un set di API per creare e configurare applicazioni Rspack, supportando la costruzione e lo sviluppo di applicazioni standard e HTML."}),"\n",(0,r.jsxs)(i.h2,{id:"installazione",children:["Installazione",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#installazione",children:"#"})]}),"\n",(0,r.jsxs)(i.p,{children:["Installa le dipendenze di sviluppo ",(0,r.jsx)(i.code,{children:"@gez/rspack"})," utilizzando un gestore di pacchetti:"]}),"\n",(0,r.jsx)(s.PackageManagerTabs,{command:"install @gez/rspack -D"}),"\n",(0,r.jsxs)(i.h2,{id:"esportazione-dei-tipi",children:["Esportazione dei Tipi",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#esportazione-dei-tipi",children:"#"})]}),"\n",(0,r.jsxs)(i.h3,{id:"buildtarget",children:["BuildTarget",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#buildtarget",children:"#"})]}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-ts",children:"type BuildTarget = 'node' | 'client' | 'server'\n"})}),"\n",(0,r.jsx)(i.p,{children:"Tipo di ambiente di costruzione, definisce l'ambiente di destinazione per la costruzione dell'applicazione, utilizzato per configurare ottimizzazioni e funzionalit\xe0 specifiche durante il processo di costruzione:"}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"node"}),": Costruisce codice per l'esecuzione in ambiente Node.js"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"client"}),": Costruisce codice per l'esecuzione in ambiente browser"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"server"}),": Costruisce codice per l'esecuzione in ambiente server"]}),"\n"]}),"\n",(0,r.jsxs)(i.h3,{id:"rspackappconfigcontext",children:["RspackAppConfigContext",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackappconfigcontext",children:"#"})]}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-ts",children:"interface RspackAppConfigContext {\n  gez: Gez\n  buildTarget: BuildTarget\n  config: RspackOptions\n  options: RspackAppOptions\n}\n"})}),"\n",(0,r.jsx)(i.p,{children:"Interfaccia del contesto di configurazione dell'applicazione Rspack, fornisce informazioni di contesto accessibili nelle funzioni di hook di configurazione:"}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"gez"}),": Istanza del framework Gez"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"buildTarget"}),": Obiettivo di costruzione corrente (client/server/node)"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"config"}),": Oggetto di configurazione Rspack"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"options"}),": Opzioni di configurazione dell'applicazione"]}),"\n"]}),"\n",(0,r.jsxs)(i.h3,{id:"rspackappoptions",children:["RspackAppOptions",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackappoptions",children:"#"})]}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-ts",children:"interface RspackAppOptions {\n  css?: 'css' | 'style'\n  loaders?: {\n    styleLoader?: string\n  }\n  styleLoader?: Record<string, any>\n  cssLoader?: Record<string, any>\n  target?: {\n    web?: string[]\n    node?: string[]\n  }\n  definePlugin?: Record<string, any>\n  config?: (context: RspackAppConfigContext) => void | Promise<void>\n}\n"})}),"\n",(0,r.jsx)(i.p,{children:"Interfaccia delle opzioni di configurazione dell'applicazione Rspack:"}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"css"}),": Modalit\xe0 di output CSS, opzioni 'css' (file separato) o 'style' (stili inline)"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"loaders"}),": Configurazione personalizzata dei loader"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"styleLoader"}),": Opzioni di configurazione per style-loader"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"cssLoader"}),": Opzioni di configurazione per css-loader"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"target"}),": Configurazione della compatibilit\xe0 degli obiettivi di costruzione"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"definePlugin"}),": Definizione di costanti globali"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"config"}),": Funzione di hook di configurazione"]}),"\n"]}),"\n",(0,r.jsxs)(i.h3,{id:"rspackhtmlappoptions",children:["RspackHtmlAppOptions",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackhtmlappoptions",children:"#"})]}),"\n",(0,r.jsxs)(i.p,{children:["Eredita da ",(0,r.jsx)(i.code,{children:"RspackAppOptions"}),", utilizzato per configurare opzioni specifiche per applicazioni HTML."]}),"\n",(0,r.jsxs)(i.h2,{id:"esportazione-delle-funzioni",children:["Esportazione delle Funzioni",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#esportazione-delle-funzioni",children:"#"})]}),"\n",(0,r.jsxs)(i.h3,{id:"createrspackapp",children:["createRspackApp",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#createrspackapp",children:"#"})]}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-ts",children:"function createRspackApp(gez: Gez, options?: RspackAppOptions): Promise<App>\n"})}),"\n",(0,r.jsx)(i.p,{children:"Crea un'istanza di applicazione Rspack standard."}),"\n",(0,r.jsx)(i.p,{children:(0,r.jsx)(i.strong,{children:"Parametri:"})}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"gez"}),": Istanza del framework Gez"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"options"}),": Opzioni di configurazione dell'applicazione Rspack"]}),"\n"]}),"\n",(0,r.jsx)(i.p,{children:(0,r.jsx)(i.strong,{children:"Valore di ritorno:"})}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsx)(i.li,{children:"Restituisce una Promise che si risolve nell'istanza dell'applicazione creata"}),"\n"]}),"\n",(0,r.jsxs)(i.h3,{id:"createrspackhtmlapp",children:["createRspackHtmlApp",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#createrspackhtmlapp",children:"#"})]}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-ts",children:"function createRspackHtmlApp(gez: Gez, options?: RspackHtmlAppOptions): Promise<App>\n"})}),"\n",(0,r.jsx)(i.p,{children:"Crea un'istanza di applicazione Rspack di tipo HTML."}),"\n",(0,r.jsx)(i.p,{children:(0,r.jsx)(i.strong,{children:"Parametri:"})}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"gez"}),": Istanza del framework Gez"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"options"}),": Opzioni di configurazione dell'applicazione HTML"]}),"\n"]}),"\n",(0,r.jsx)(i.p,{children:(0,r.jsx)(i.strong,{children:"Valore di ritorno:"})}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsx)(i.li,{children:"Restituisce una Promise che si risolve nell'istanza dell'applicazione HTML creata"}),"\n"]}),"\n",(0,r.jsxs)(i.h2,{id:"esportazione-delle-costanti",children:["Esportazione delle Costanti",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#esportazione-delle-costanti",children:"#"})]}),"\n",(0,r.jsxs)(i.h3,{id:"rspack_loader",children:["RSPACK_LOADER",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#rspack_loader",children:"#"})]}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-ts",children:"const RSPACK_LOADER: Record<string, string> = {\n  builtinSwcLoader: 'builtin:swc-loader',\n  lightningcssLoader: 'builtin:lightningcss-loader',\n  styleLoader: 'style-loader',\n  cssLoader: 'css-loader',\n  lessLoader: 'less-loader',\n  styleResourcesLoader: 'style-resources-loader',\n  workerRspackLoader: 'worker-rspack-loader'\n}\n"})}),"\n",(0,r.jsx)(i.p,{children:"Oggetto di mappatura degli identificatori dei loader integrati in Rspack, fornisce costanti di nome per i loader comuni:"}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"builtinSwcLoader"}),": Loader SWC integrato in Rspack, utilizzato per elaborare file TypeScript/JavaScript"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"lightningcssLoader"}),": Loader lightningcss integrato in Rspack, utilizzato per elaborare file CSS con un compilatore ad alte prestazioni"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"styleLoader"}),": Loader utilizzato per iniettare CSS nel DOM"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"cssLoader"}),": Loader utilizzato per analizzare file CSS e gestire la modularizzazione CSS"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"lessLoader"}),": Loader utilizzato per compilare file Less in CSS"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"styleResourcesLoader"}),": Loader utilizzato per importare automaticamente risorse di stile globali (come variabili, mixins)"]}),"\n",(0,r.jsxs)(i.li,{children:[(0,r.jsx)(i.code,{children:"workerRspackLoader"}),": Loader utilizzato per elaborare file Web Worker"]}),"\n"]}),"\n",(0,r.jsx)(i.p,{children:"Utilizzando queste costanti \xe8 possibile fare riferimento ai loader integrati nella configurazione, evitando di digitare manualmente le stringhe:"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"import { RSPACK_LOADER } from '@gez/rspack';\n\nexport default {\n  async devApp(gez) {\n    return import('@gez/rspack').then((m) =>\n      m.createRspackHtmlApp(gez, {\n        loaders: {\n          // Utilizzo delle costanti per fare riferimento ai loader\n          styleLoader: RSPACK_LOADER.styleLoader,\n          cssLoader: RSPACK_LOADER.cssLoader,\n          lightningcssLoader: RSPACK_LOADER.lightningcssLoader\n        }\n      })\n    );\n  }\n};\n"})}),"\n",(0,r.jsx)(i.p,{children:(0,r.jsx)(i.strong,{children:"Note:"})}),"\n",(0,r.jsxs)(i.ul,{children:["\n",(0,r.jsx)(i.li,{children:"Questi loader sono gi\xe0 integrati in Rspack e non richiedono installazioni aggiuntive"}),"\n",(0,r.jsx)(i.li,{children:"Nella configurazione personalizzata dei loader, \xe8 possibile utilizzare queste costanti per sostituire l'implementazione predefinita dei loader"}),"\n",(0,r.jsxs)(i.li,{children:["Alcuni loader (come ",(0,r.jsx)(i.code,{children:"builtinSwcLoader"}),") hanno opzioni di configurazione specifiche, fare riferimento alla documentazione di configurazione pertinente"]}),"\n"]}),"\n",(0,r.jsxs)(i.h2,{id:"esportazione-dei-moduli",children:["Esportazione dei Moduli",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#esportazione-dei-moduli",children:"#"})]}),"\n",(0,r.jsxs)(i.h3,{id:"rspack",children:["rspack",(0,r.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#rspack",children:"#"})]}),"\n",(0,r.jsxs)(i.p,{children:["Riesporta tutti i contenuti del pacchetto ",(0,r.jsx)(i.code,{children:"@rspack/core"}),", fornendo funzionalit\xe0 complete del core di Rspack."]})]})}function c(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:i}=Object.assign({},(0,a.ah)(),e.components);return i?(0,r.jsx)(i,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}let d=c;c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["it%2Fapi%2Fapp%2Frspack.mdx"]={toc:[{text:"Installazione",id:"installazione",depth:2},{text:"Esportazione dei Tipi",id:"esportazione-dei-tipi",depth:2},{text:"BuildTarget",id:"buildtarget",depth:3},{text:"RspackAppConfigContext",id:"rspackappconfigcontext",depth:3},{text:"RspackAppOptions",id:"rspackappoptions",depth:3},{text:"RspackHtmlAppOptions",id:"rspackhtmlappoptions",depth:3},{text:"Esportazione delle Funzioni",id:"esportazione-delle-funzioni",depth:2},{text:"createRspackApp",id:"createrspackapp",depth:3},{text:"createRspackHtmlApp",id:"createrspackhtmlapp",depth:3},{text:"Esportazione delle Costanti",id:"esportazione-delle-costanti",depth:2},{text:"RSPACK_LOADER",id:"rspack_loader",depth:3},{text:"Esportazione dei Moduli",id:"esportazione-dei-moduli",depth:2},{text:"rspack",id:"rspack",depth:3}],title:"@gez/rspack",headingTitle:"@gez/rspack",frontmatter:{titleSuffix:"Gez Framework Rspack Build Tool",description:"Lo strumento di costruzione Rspack del framework Gez offre capacit\xe0 di costruzione ad alte prestazioni, supportando lo sviluppo e la costruzione di applicazioni standard e HTML, con vari processori di risorse e configurazioni di ottimizzazione integrate.",head:[["meta",{property:"keywords",content:"Gez, Rspack, strumento di costruzione, costruzione di applicazioni, applicazione HTML, TypeScript, CSS, elaborazione risorse, ottimizzazione delle prestazioni"}]]}}}}]);