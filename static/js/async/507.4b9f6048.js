"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["507"],{9572:function(e,n,a){a.r(n),a.d(n,{default:()=>o});var s=a(1549),r=a(6603),c=a(1519);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",code:"code",h3:"h3",pre:"pre",ul:"ul",li:"li",strong:"strong"},(0,r.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.h1,{id:"gezrspack",children:["@gez/rspack",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#gezrspack",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"El paquete Rspack proporciona un conjunto de API para crear y configurar aplicaciones Rspack, soportando la construcci\xf3n y desarrollo de aplicaciones est\xe1ndar y aplicaciones HTML."}),"\n",(0,s.jsxs)(n.h2,{id:"instalaci\\xf3n",children:["Instalaci\xf3n",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#instalaci\\xf3n",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["Instala ",(0,s.jsx)(n.code,{children:"@gez/rspack"})," como dependencia de desarrollo utilizando un gestor de paquetes:"]}),"\n",(0,s.jsx)(c.PackageManagerTabs,{command:"install @gez/rspack -D"}),"\n",(0,s.jsxs)(n.h2,{id:"exportaci\\xf3n-de-tipos",children:["Exportaci\xf3n de Tipos",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exportaci\\xf3n-de-tipos",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"buildtarget",children:["BuildTarget",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#buildtarget",children:"#"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"type BuildTarget = 'node' | 'client' | 'server'\n"})}),"\n",(0,s.jsx)(n.p,{children:"Tipo de entorno de construcci\xf3n, define el entorno objetivo de la aplicaci\xf3n, utilizado para configurar optimizaciones y funcionalidades espec\xedficas durante el proceso de construcci\xf3n:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"node"}),": Construye c\xf3digo para ejecutarse en un entorno Node.js"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"client"}),": Construye c\xf3digo para ejecutarse en un entorno de navegador"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"server"}),": Construye c\xf3digo para ejecutarse en un entorno de servidor"]}),"\n"]}),"\n",(0,s.jsxs)(n.h3,{id:"rspackappconfigcontext",children:["RspackAppConfigContext",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackappconfigcontext",children:"#"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"interface RspackAppConfigContext {\n  gez: Gez\n  buildTarget: BuildTarget\n  config: RspackOptions\n  options: RspackAppOptions\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"Interfaz de contexto de configuraci\xf3n de aplicaci\xf3n Rspack, proporciona informaci\xf3n de contexto accesible en las funciones de enlace de configuraci\xf3n:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"gez"}),": Instancia del framework Gez"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"buildTarget"}),": Objetivo de construcci\xf3n actual (client/server/node)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"config"}),": Objeto de configuraci\xf3n Rspack"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"options"}),": Opciones de configuraci\xf3n de la aplicaci\xf3n"]}),"\n"]}),"\n",(0,s.jsxs)(n.h3,{id:"rspackappoptions",children:["RspackAppOptions",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackappoptions",children:"#"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"interface RspackAppOptions {\n  css?: 'css' | 'style'\n  loaders?: {\n    styleLoader?: string\n  }\n  styleLoader?: Record<string, any>\n  cssLoader?: Record<string, any>\n  target?: {\n    web?: string[]\n    node?: string[]\n  }\n  definePlugin?: Record<string, any>\n  config?: (context: RspackAppConfigContext) => void | Promise<void>\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"Interfaz de opciones de configuraci\xf3n de aplicaci\xf3n Rspack:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"css"}),": M\xe9todo de salida CSS, opciones 'css' (archivo independiente) o 'style' (estilos en l\xednea)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"loaders"}),": Configuraci\xf3n personalizada de loaders"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"styleLoader"}),": Opciones de configuraci\xf3n de style-loader"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"cssLoader"}),": Opciones de configuraci\xf3n de css-loader"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"target"}),": Configuraci\xf3n de compatibilidad del objetivo de construcci\xf3n"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"definePlugin"}),": Definici\xf3n de constantes globales"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"config"}),": Funci\xf3n de enlace de configuraci\xf3n"]}),"\n"]}),"\n",(0,s.jsxs)(n.h3,{id:"rspackhtmlappoptions",children:["RspackHtmlAppOptions",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rspackhtmlappoptions",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["Hereda de ",(0,s.jsx)(n.code,{children:"RspackAppOptions"}),", utilizado para configurar opciones espec\xedficas de aplicaciones HTML."]}),"\n",(0,s.jsxs)(n.h2,{id:"exportaci\\xf3n-de-funciones",children:["Exportaci\xf3n de Funciones",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exportaci\\xf3n-de-funciones",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"createrspackapp",children:["createRspackApp",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#createrspackapp",children:"#"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"function createRspackApp(gez: Gez, options?: RspackAppOptions): Promise<App>\n"})}),"\n",(0,s.jsx)(n.p,{children:"Crea una instancia de aplicaci\xf3n Rspack est\xe1ndar."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Par\xe1metros:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"gez"}),": Instancia del framework Gez"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"options"}),": Opciones de configuraci\xf3n de aplicaci\xf3n Rspack"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Valor de retorno:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Devuelve una Promise que se resuelve en la instancia de aplicaci\xf3n creada"}),"\n"]}),"\n",(0,s.jsxs)(n.h3,{id:"createrspackhtmlapp",children:["createRspackHtmlApp",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#createrspackhtmlapp",children:"#"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"function createRspackHtmlApp(gez: Gez, options?: RspackHtmlAppOptions): Promise<App>\n"})}),"\n",(0,s.jsx)(n.p,{children:"Crea una instancia de aplicaci\xf3n Rspack de tipo HTML."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Par\xe1metros:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"gez"}),": Instancia del framework Gez"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"options"}),": Opciones de configuraci\xf3n de aplicaci\xf3n HTML"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Valor de retorno:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Devuelve una Promise que se resuelve en la instancia de aplicaci\xf3n HTML creada"}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"exportaci\\xf3n-de-constantes",children:["Exportaci\xf3n de Constantes",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exportaci\\xf3n-de-constantes",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"rspack_loader",children:["RSPACK_LOADER",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rspack_loader",children:"#"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const RSPACK_LOADER: Record<string, string> = {\n  builtinSwcLoader: 'builtin:swc-loader',\n  lightningcssLoader: 'builtin:lightningcss-loader',\n  styleLoader: 'style-loader',\n  cssLoader: 'css-loader',\n  lessLoader: 'less-loader',\n  styleResourcesLoader: 'style-resources-loader',\n  workerRspackLoader: 'worker-rspack-loader'\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"Objeto de mapeo de identificadores de loaders integrados en Rspack, proporciona constantes de nombres de loaders comunes:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"builtinSwcLoader"}),": SWC loader integrado en Rspack, utilizado para procesar archivos TypeScript/JavaScript"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"lightningcssLoader"}),": lightningcss loader integrado en Rspack, utilizado para compilar archivos CSS de alto rendimiento"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"styleLoader"}),": Loader utilizado para inyectar CSS en el DOM"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"cssLoader"}),": Loader utilizado para analizar archivos CSS y manejar la modularizaci\xf3n de CSS"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"lessLoader"}),": Loader utilizado para compilar archivos Less a CSS"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"styleResourcesLoader"}),": Loader utilizado para importar autom\xe1ticamente recursos de estilo globales (como variables, mixins)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"workerRspackLoader"}),": Loader utilizado para procesar archivos de Web Worker"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Utilizar estas constantes permite referenciar loaders integrados en la configuraci\xf3n, evitando la entrada manual de cadenas:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"import { RSPACK_LOADER } from '@gez/rspack';\n\nexport default {\n  async devApp(gez) {\n    return import('@gez/rspack').then((m) =>\n      m.createRspackHtmlApp(gez, {\n        loaders: {\n          // Usar constantes para referenciar loaders\n          styleLoader: RSPACK_LOADER.styleLoader,\n          cssLoader: RSPACK_LOADER.cssLoader,\n          lightningcssLoader: RSPACK_LOADER.lightningcssLoader\n        }\n      })\n    );\n  }\n};\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Notas:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Estos loaders ya est\xe1n integrados en Rspack, no es necesario instalarlos adicionalmente"}),"\n",(0,s.jsx)(n.li,{children:"Al configurar loaders personalizados, se pueden usar estas constantes para reemplazar la implementaci\xf3n predeterminada del loader"}),"\n",(0,s.jsxs)(n.li,{children:["Algunos loaders (como ",(0,s.jsx)(n.code,{children:"builtinSwcLoader"}),") tienen opciones de configuraci\xf3n espec\xedficas, consulta la documentaci\xf3n correspondiente"]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"exportaci\\xf3n-de-m\\xf3dulos",children:["Exportaci\xf3n de M\xf3dulos",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exportaci\\xf3n-de-m\\xf3dulos",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"rspack",children:["rspack",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rspack",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["Reexporta todo el contenido del paquete ",(0,s.jsx)(n.code,{children:"@rspack/core"}),", proporcionando la funcionalidad completa del n\xfacleo de Rspack."]})]})}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,r.ah)(),e.components);return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(i,{...e})}):i(e)}let o=d;d.__RSPRESS_PAGE_META={},d.__RSPRESS_PAGE_META["es%2Fapi%2Fapp%2Frspack.mdx"]={toc:[{text:"Instalaci\xf3n",id:"instalaci\xf3n",depth:2},{text:"Exportaci\xf3n de Tipos",id:"exportaci\xf3n-de-tipos",depth:2},{text:"BuildTarget",id:"buildtarget",depth:3},{text:"RspackAppConfigContext",id:"rspackappconfigcontext",depth:3},{text:"RspackAppOptions",id:"rspackappoptions",depth:3},{text:"RspackHtmlAppOptions",id:"rspackhtmlappoptions",depth:3},{text:"Exportaci\xf3n de Funciones",id:"exportaci\xf3n-de-funciones",depth:2},{text:"createRspackApp",id:"createrspackapp",depth:3},{text:"createRspackHtmlApp",id:"createrspackhtmlapp",depth:3},{text:"Exportaci\xf3n de Constantes",id:"exportaci\xf3n-de-constantes",depth:2},{text:"RSPACK_LOADER",id:"rspack_loader",depth:3},{text:"Exportaci\xf3n de M\xf3dulos",id:"exportaci\xf3n-de-m\xf3dulos",depth:2},{text:"rspack",id:"rspack",depth:3}],title:"@gez/rspack",headingTitle:"@gez/rspack",frontmatter:{titleSuffix:"Gez Framework Rspack Build Tool",description:"La herramienta de construcci\xf3n Rspack del framework Gez ofrece capacidades de construcci\xf3n de aplicaciones de alto rendimiento, soportando el desarrollo y construcci\xf3n de aplicaciones est\xe1ndar y aplicaciones HTML, con m\xfaltiples procesadores de recursos y configuraciones de optimizaci\xf3n integradas.",head:[["meta",{property:"keywords",content:"Gez, Rspack, herramienta de construcci\xf3n, construcci\xf3n de aplicaciones, aplicaci\xf3n HTML, TypeScript, CSS, procesamiento de recursos, optimizaci\xf3n de rendimiento"}]]}}}}]);