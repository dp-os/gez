"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["7391"],{4610:function(e,n,s){s.r(n),s.d(n,{default:()=>c});var r=s(1549),i=s(6603);function t(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",pre:"pre",code:"code",div:"div",ul:"ul",li:"li",strong:"strong"},(0,i.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"标准规范",children:["标准规范",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#标准规范",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"Gez 是一个现代化的 SSR 框架，采用标准化的项目结构和路径解析机制，以确保项目在开发和生产环境中的一致性和可维护性。"}),"\n",(0,r.jsxs)(n.h2,{id:"项目结构规范",children:["项目结构规范",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#项目结构规范",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"标准目录结构",children:["标准目录结构",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#标准目录结构",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-txt",children:"root\n│─ dist                  # 编译输出目录\n│  ├─ package.json       # 编译输出后的软件包配置\n│  ├─ server             # 服务端编译输出\n│  │  └─ manifest.json   # 编译清单输出，用于生成 importmap\n│  ├─ node               # Node 服务器程序编译输出\n│  ├─ client             # 客户端编译输出\n│  │  ├─ versions        # 版本存储目录\n│  │  │  └─ latest.tgz   # 将 dist 目录归档，对外提供软件包分发\n│  │  └─ manifest.json   # 编译清单输出，用于生成 importmap\n│  └─ src                # 使用 tsc 生成的文件类型\n├─ src\n│  ├─ entry.server.ts    # 服务端应用程序入口\n│  ├─ entry.client.ts    # 客户端应用程序入口\n│  └─ entry.node.ts      # Node 服务器应用程序入口\n├─ tsconfig.json         # TypeScript 配置\n└─ package.json          # 软件包配置\n"})}),"\n",(0,r.jsxs)(n.div,{className:"rspress-directive tip",children:[(0,r.jsx)(n.div,{className:"rspress-directive-title",children:"拓展知识"}),(0,r.jsxs)(n.div,{className:"rspress-directive-content",children:["\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"gez.name"})," 来源于 ",(0,r.jsx)(n.code,{children:"package.json"})," 的 ",(0,r.jsx)(n.code,{children:"name"})," 字段"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"dist/package.json"})," 来源于根目录的 ",(0,r.jsx)(n.code,{children:"package.json"})]}),"\n",(0,r.jsxs)(n.li,{children:["设置 ",(0,r.jsx)(n.code,{children:"packs.enable"})," 为 ",(0,r.jsx)(n.code,{children:"true"})," 时，才会对 ",(0,r.jsx)(n.code,{children:"dist"})," 目录进行归档"]}),"\n"]}),"\n"]})]}),"\n",(0,r.jsxs)(n.h2,{id:"入口文件规范",children:["入口文件规范",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#入口文件规范",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"客户端入口文件负责："}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"初始化应用"}),"：配置客户端应用的基础设置"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"路由管理"}),"：处理客户端路由和导航"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"状态管理"}),"：实现客户端状态的存储和更新"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"交互处理"}),"：管理用户事件和界面交互"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"服务端入口文件负责："}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"服务端渲染"}),"：执行 SSR 渲染流程"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"HTML 生成"}),"：构建初始页面结构"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"数据预取"}),"：处理服务端数据获取"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"状态注入"}),"：将服务端状态传递给客户端"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"SEO 优化"}),"：确保页面的搜索引擎优化"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"Node.js 服务器入口文件负责："}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"服务器配置"}),"：设置 HTTP 服务器参数"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"路由处理"}),"：管理服务端路由规则"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"中间件集成"}),"：配置服务器中间件"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"环境管理"}),"：处理环境变量和配置"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"请求响应"}),"：处理 HTTP 请求和响应"]}),"\n"]}),"\n",(0,r.jsxs)(n.h2,{id:"配置文件规范",children:["配置文件规范",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#配置文件规范",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n    "name": "your-app-name",\n    "type": "module",\n    "scripts": {\n        "dev": "gez dev",\n        "build": "npm run build:dts && npm run build:ssr",\n        "build:ssr": "gez build",\n        "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src",\n        "preview": "gez preview",\n        "start": "NODE_ENV=production node dist/index.js"\n    }\n}\n'})}),"\n",(0,r.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "isolatedModules": true,\n        "allowJs": false,\n        "experimentalDecorators": true,\n        "resolveJsonModule": true,\n        "types": [\n            "@types/node"\n        ],\n        "target": "ESNext",\n        "module": "ESNext",\n        "importHelpers": false,\n        "declaration": true,\n        "sourceMap": true,\n        "strict": true,\n        "noImplicitAny": false,\n        "noImplicitReturns": false,\n        "noFallthroughCasesInSwitch": true,\n        "noUnusedLocals": false,\n        "noUnusedParameters": false,\n        "moduleResolution": "node",\n        "esModuleInterop": true,\n        "skipLibCheck": true,\n        "allowSyntheticDefaultImports": true,\n        "forceConsistentCasingInFileNames": true,\n        "noEmit": true\n    },\n    "include": [\n        "src",\n        "**.ts"\n    ],\n    "exclude": [\n        "dist"\n    ]\n}\n'})})]})}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,i.ah)(),e.components);return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(t,{...e})}):t(e)}let c=d;d.__RSPRESS_PAGE_META={},d.__RSPRESS_PAGE_META["zh%2Fguide%2Fessentials%2Fstd.md"]={toc:[{text:"项目结构规范",id:"项目结构规范",depth:2},{text:"标准目录结构",id:"标准目录结构",depth:3},{text:"入口文件规范",id:"入口文件规范",depth:2},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"配置文件规范",id:"配置文件规范",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3}],title:"标准规范",headingTitle:"标准规范",frontmatter:{titleSuffix:"Gez 框架项目结构与规范指南",description:"详细介绍 Gez 框架的标准项目结构、入口文件规范和配置文件规范，帮助开发者构建规范化、可维护的 SSR 应用。",head:[["meta",{property:"keywords",content:"Gez, 项目结构, 入口文件, 配置规范, SSR框架, TypeScript, 项目规范, 开发标准"}]]}}}}]);