"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["324"],{2737:function(n,s,e){e.r(s),e.d(s,{default:()=>h});var i=e(1549),r=e(6603);function c(n){let s=Object.assign({h1:"h1",a:"a",p:"p",code:"code",pre:"pre",h2:"h2",h3:"h3",h4:"h4",ul:"ul",li:"li",strong:"strong"},(0,r.ah)(),n.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(s.h1,{id:"manifestjson",children:["ManifestJson",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#manifestjson",children:"#"})]}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.code,{children:"manifest.json"})," — это файл манифеста, генерируемый фреймворком Gez в процессе сборки, который используется для записи информации о результатах сборки сервиса. Он предоставляет унифицированный интерфейс для управления артефактами сборки, экспортируемыми файлами и статистикой размеров ресурсов."]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-json",meta:'title="dist/client/manifest.json"',children:'{\n  "name": "your-app-name",\n  "exports": {\n    "src/entry.client": "src/entry.client.8537e1c3.final.js",\n    "src/title/index": "src/title/index.2d79c0c2.final.js"\n  },\n  "buildFiles": [\n    "src/entry.client.2e0a89bc.final.css",\n    "images/cat.ed79ef6b.final.jpeg",\n    "chunks/830.63b8fd4f.final.css",\n    "images/running-dog.76197e20.final.gif",\n    "chunks/473.42c1ae75.final.js",\n    "images/starry.d914a632.final.jpg",\n    "images/sun.429a7bc5.final.png",\n    "chunks/473.63b8fd4f.final.css",\n    "images/logo.3923d727.final.svg",\n    "chunks/534.63b8fd4f.final.css",\n    "src/title/index.2d79c0c2.final.js",\n    "src/entry.client.8537e1c3.final.js",\n    "chunks/534.e85c5440.final.js",\n    "chunks/830.cdbdf067.final.js"\n  ],\n  "chunks": {\n    "your-app-name@src/views/home.ts": {\n      "js": "chunks/534.e85c5440.final.js",\n      "css": ["chunks/534.63b8fd4f.final.css"],\n      "resources": [\n        "images/cat.ed79ef6b.final.jpeg",\n        "images/logo.3923d727.final.svg",\n        "images/running-dog.76197e20.final.gif",\n        "images/starry.d914a632.final.jpg",\n        "images/sun.429a7bc5.final.png"\n      ],\n      "sizes": {\n        "js": 7976,\n        "css": 5739,\n        "resource": 796974\n      }\n    }\n  }\n}\n'})}),"\n",(0,i.jsxs)(s.h2,{id:"определение-типов",children:["Определение типов",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#определение-типов",children:"#"})]}),"\n",(0,i.jsxs)(s.h3,{id:"manifestjson-1",children:["ManifestJson",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#manifestjson-1",children:"#"})]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-ts",children:"interface ManifestJson {\n  name: string;\n  exports: Record<string, string>;\n  buildFiles: string[];\n  chunks: Record<string, ManifestJsonChunks>;\n}\n"})}),"\n",(0,i.jsxs)(s.h4,{id:"name",children:["name",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#name",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"string"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Имя сервиса, взятое из конфигурации GezOptions.name."}),"\n",(0,i.jsxs)(s.h4,{id:"exports",children:["exports",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#exports",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"Record<string, string>"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Отображение экспортируемых файлов, где ключ — это путь к исходному файлу, а значение — путь к собранному файлу."}),"\n",(0,i.jsxs)(s.h4,{id:"buildfiles",children:["buildFiles",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#buildfiles",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"string[]"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Полный список файлов артефактов сборки, включающий пути ко всем сгенерированным файлам."}),"\n",(0,i.jsxs)(s.h4,{id:"chunks",children:["chunks",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#chunks",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"Record<string, ManifestJsonChunks>"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Соответствие между исходными файлами и скомпилированными артефактами, где ключ — это путь к исходному файлу, а значение — информация о компиляции."}),"\n",(0,i.jsxs)(s.h3,{id:"manifestjsonchunks",children:["ManifestJsonChunks",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#manifestjsonchunks",children:"#"})]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-ts",children:"interface ManifestJsonChunks {\n  js: string;\n  css: string[];\n  resources: string[];\n  sizes: ManifestJsonChunkSizes;\n}\n"})}),"\n",(0,i.jsxs)(s.h4,{id:"js",children:["js",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#js",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"string"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Путь к JS-файлу, скомпилированному из текущего исходного файла."}),"\n",(0,i.jsxs)(s.h4,{id:"css",children:["css",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#css",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"string[]"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Список путей к CSS-файлам, связанным с текущим исходным файлом."}),"\n",(0,i.jsxs)(s.h4,{id:"resources",children:["resources",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#resources",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"string[]"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Список путей к другим ресурсам, связанным с текущим исходным файлом."}),"\n",(0,i.jsxs)(s.h4,{id:"sizes",children:["sizes",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#sizes",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"ManifestJsonChunkSizes"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Статистика размеров артефактов сборки."}),"\n",(0,i.jsxs)(s.h3,{id:"manifestjsonchunksizes",children:["ManifestJsonChunkSizes",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#manifestjsonchunksizes",children:"#"})]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-ts",children:"interface ManifestJsonChunkSizes {\n  js: number;\n  css: number;\n  resource: number;\n}\n"})}),"\n",(0,i.jsxs)(s.h4,{id:"js-1",children:["js",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#js-1",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"number"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Размер JS-файла (в байтах)."}),"\n",(0,i.jsxs)(s.h4,{id:"css-1",children:["css",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#css-1",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"number"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Размер CSS-файла (в байтах)."}),"\n",(0,i.jsxs)(s.h4,{id:"resource",children:["resource",(0,i.jsx)(s.a,{className:"header-anchor","aria-hidden":"true",href:"#resource",children:"#"})]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Тип"}),": ",(0,i.jsx)(s.code,{children:"number"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Размер ресурсного файла (в байтах)."})]})}function d(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:s}=Object.assign({},(0,r.ah)(),n.components);return s?(0,i.jsx)(s,{...n,children:(0,i.jsx)(c,{...n})}):c(n)}let h=d;d.__RSPRESS_PAGE_META={},d.__RSPRESS_PAGE_META["ru%2Fapi%2Fcore%2Fmanifest-json.md"]={toc:[{text:"Определение типов",id:"определение-типов",depth:2},{text:"ManifestJson",id:"manifestjson-1",depth:3},{text:"name",id:"name",depth:4},{text:"exports",id:"exports",depth:4},{text:"buildFiles",id:"buildfiles",depth:4},{text:"chunks",id:"chunks",depth:4},{text:"ManifestJsonChunks",id:"manifestjsonchunks",depth:3},{text:"js",id:"js",depth:4},{text:"css",id:"css",depth:4},{text:"resources",id:"resources",depth:4},{text:"sizes",id:"sizes",depth:4},{text:"ManifestJsonChunkSizes",id:"manifestjsonchunksizes",depth:3},{text:"js",id:"js-1",depth:4},{text:"css",id:"css-1",depth:4},{text:"resource",id:"resource",depth:4}],title:"ManifestJson",headingTitle:"ManifestJson",frontmatter:{titleSuffix:"Справочник по файлу манифеста сборки Gez",description:"Подробное описание структуры файла манифеста сборки (manifest.json) в фреймворке Gez, включая управление артефактами сборки, отображение экспортируемых файлов и статистику ресурсов, чтобы помочь разработчикам понять и использовать систему сборки.",head:[["meta",{property:"keywords",content:"Gez, ManifestJson, манифест сборки, управление ресурсами, артефакты сборки, отображение файлов, API"}]]}}}}]);