"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["3293"],{5586:function(e,n,r){r.r(n),r.d(n,{default:()=>o});var i=r(1549),d=r(6603);function a(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong",pre:"pre",code:"code",h4:"h4"},(0,d.ah)(),e.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.h1,{id:"moduleconfig",children:["ModuleConfig",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#moduleconfig",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"ModuleConfig proporciona la funcionalidad de configuraci\xf3n de m\xf3dulos en el framework Gez, utilizada para definir reglas de importaci\xf3n/exportaci\xf3n de m\xf3dulos, configuraci\xf3n de alias y dependencias externas."}),"\n",(0,i.jsxs)(n.h2,{id:"definici\\xf3n-de-tipos",children:["Definici\xf3n de tipos",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#definici\\xf3n-de-tipos",children:"#"})]}),"\n",(0,i.jsxs)(n.h3,{id:"pathtype",children:["PathType",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#pathtype",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Definici\xf3n de tipo"}),":"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"enum PathType {\n  npm = 'npm:', \n  root = 'root:'\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"Enumeraci\xf3n de tipos de rutas de m\xf3dulos:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"npm"}),": Representa dependencias en node_modules"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"root"}),": Representa archivos en el directorio ra\xedz del proyecto"]}),"\n"]}),"\n",(0,i.jsxs)(n.h3,{id:"moduleconfig-1",children:["ModuleConfig",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#moduleconfig-1",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Definici\xf3n de tipo"}),":"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"interface ModuleConfig {\n  exports?: string[]\n  imports?: Record<string, string>\n  externals?: Record<string, string>\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"Interfaz de configuraci\xf3n de m\xf3dulos, utilizada para definir la exportaci\xf3n, importaci\xf3n y configuraci\xf3n de dependencias externas del servicio."}),"\n",(0,i.jsxs)(n.h4,{id:"exports",children:["exports",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exports",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Lista de configuraci\xf3n de exportaciones, expone unidades de c\xf3digo espec\xedficas (como componentes, funciones utilitarias, etc.) del servicio en formato ESM."}),"\n",(0,i.jsx)(n.p,{children:"Soporta dos tipos:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"root:*"}),": Exporta archivos de c\xf3digo fuente, ej.: 'root:src/components/button.vue'"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"npm:*"}),": Exporta dependencias de terceros, ej.: 'npm:vue'"]}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"imports",children:["imports",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#imports",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Mapeo de configuraci\xf3n de importaciones, configura m\xf3dulos remotos a importar y sus rutas locales."}),"\n",(0,i.jsx)(n.p,{children:"La configuraci\xf3n var\xeda seg\xfan el m\xe9todo de instalaci\xf3n:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Instalaci\xf3n desde c\xf3digo fuente (Workspace, Git): debe apuntar al directorio dist"}),"\n",(0,i.jsx)(n.li,{children:"Instalaci\xf3n desde paquete (Link, servidor est\xe1tico, repositorio privado, File): apunta directamente al directorio del paquete"}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"externals",children:["externals",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#externals",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Mapeo de dependencias externas, configura dependencias externas a utilizar, generalmente dependencias de m\xf3dulos remotos."}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Ejemplo"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"import type { GezOptions } from '@gez/core';\n\nexport default {\n  modules: {\n    // Configuraci\xf3n de exportaciones\n    exports: [\n      'root:src/components/button.vue',  // Exportar archivo de c\xf3digo fuente\n      'root:src/utils/format.ts',\n      'npm:vue',  // Exportar dependencia de terceros\n      'npm:vue-router'\n    ],\n\n    // Configuraci\xf3n de importaciones\n    imports: {\n      // M\xe9todo de instalaci\xf3n desde c\xf3digo fuente: debe apuntar al directorio dist\n      'ssr-remote': 'root:./node_modules/ssr-remote/dist',\n      // M\xe9todo de instalaci\xf3n desde paquete: apunta directamente al directorio del paquete\n      'other-remote': 'root:./node_modules/other-remote'\n    },\n\n    // Configuraci\xf3n de dependencias externas\n    externals: {\n      'vue': 'ssr-remote/npm/vue',\n      'vue-router': 'ssr-remote/npm/vue-router'\n    }\n  }\n} satisfies GezOptions;\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"parsedmoduleconfig",children:["ParsedModuleConfig",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#parsedmoduleconfig",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Definici\xf3n de tipo"}),":"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"interface ParsedModuleConfig {\n  name: string\n  root: string\n  exports: {\n    name: string\n    type: PathType\n    importName: string\n    exportName: string\n    exportPath: string\n    externalName: string\n  }[]\n  imports: {\n    name: string\n    localPath: string\n  }[]\n  externals: Record<string, { match: RegExp; import?: string }>\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"Configuraci\xf3n de m\xf3dulos analizada, convierte la configuraci\xf3n original de m\xf3dulos a un formato interno estandarizado:"}),"\n",(0,i.jsxs)(n.h4,{id:"name",children:["name",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#name",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Nombre del servicio actual"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Se utiliza para identificar m\xf3dulos y generar rutas de importaci\xf3n"}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"root",children:["root",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#root",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Ruta del directorio ra\xedz del servicio actual"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Se utiliza para resolver rutas relativas y almacenar artefactos de construcci\xf3n"}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"exports-1",children:["exports",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exports-1",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Lista de configuraci\xf3n de exportaciones"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"name"}),": Ruta de exportaci\xf3n original, ej.: 'npm:vue' o 'root:src/components'"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"type"}),": Tipo de ruta (npm o root)"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"importName"}),": Nombre de importaci\xf3n, formato: '${serviceName}/${type}/${path}'"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"exportName"}),": Ruta de exportaci\xf3n, relativa al directorio ra\xedz del servicio"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"exportPath"}),": Ruta real del archivo"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"externalName"}),": Nombre de dependencia externa, utilizado como identificador cuando otros servicios importan este m\xf3dulo"]}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"imports-1",children:["imports",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#imports-1",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Lista de configuraci\xf3n de importaciones"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"name"}),": Nombre del servicio externo"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"localPath"}),": Ruta de almacenamiento local, utilizada para almacenar artefactos de construcci\xf3n de m\xf3dulos externos"]}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"externals-1",children:["externals",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#externals-1",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Mapeo de dependencias externas"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Mapea rutas de importaci\xf3n de m\xf3dulos a su ubicaci\xf3n real"}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"match"}),": Expresi\xf3n regular para coincidir con declaraciones de importaci\xf3n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"import"}),": Ruta real del m\xf3dulo"]}),"\n"]})]})}function s(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,d.ah)(),e.components);return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}let o=s;s.__RSPRESS_PAGE_META={},s.__RSPRESS_PAGE_META["es%2Fapi%2Fcore%2Fmodule-config.md"]={toc:[{text:"Definici\xf3n de tipos",id:"definici\xf3n-de-tipos",depth:2},{text:"PathType",id:"pathtype",depth:3},{text:"ModuleConfig",id:"moduleconfig-1",depth:3},{text:"exports",id:"exports",depth:4},{text:"imports",id:"imports",depth:4},{text:"externals",id:"externals",depth:4},{text:"ParsedModuleConfig",id:"parsedmoduleconfig",depth:3},{text:"name",id:"name",depth:4},{text:"root",id:"root",depth:4},{text:"exports",id:"exports-1",depth:4},{text:"imports",id:"imports-1",depth:4},{text:"externals",id:"externals-1",depth:4}],title:"ModuleConfig",headingTitle:"ModuleConfig",frontmatter:{titleSuffix:"Referencia de la API de configuraci\xf3n de m\xf3dulos del framework Gez",description:"Documentaci\xf3n detallada de la interfaz de configuraci\xf3n ModuleConfig del framework Gez, incluyendo reglas de importaci\xf3n/exportaci\xf3n de m\xf3dulos, configuraci\xf3n de alias y gesti\xf3n de dependencias externas, para ayudar a los desarrolladores a comprender en profundidad el sistema modular del framework.",head:[["meta",{property:"keywords",content:"Gez, ModuleConfig, configuraci\xf3n de m\xf3dulos, importaci\xf3n/exportaci\xf3n de m\xf3dulos, dependencias externas, configuraci\xf3n de alias, gesti\xf3n de dependencias, framework de aplicaciones web"}]]}}}}]);