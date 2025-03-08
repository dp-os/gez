"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["9130"],{786:function(e,n,r){r.r(n),r.d(n,{default:()=>i});var t=r(1549),s=r(6603);function a(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code",h3:"h3",ol:"ol",li:"li"},(0,s.ah)(),e.components);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h1,{id:"vue2",children:["Vue2",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#vue2",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"이 튜토리얼은 Gez를 기반으로 Vue2 SSR 애플리케이션을 처음부터 구축하는 방법을 안내합니다. Gez 프레임워크를 사용하여 서버 사이드 렌더링 애플리케이션을 만드는 방법을 완전한 예제를 통해 보여드리겠습니다."}),"\n",(0,t.jsxs)(n.h2,{id:"프로젝트-구조",children:["프로젝트 구조",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#프로젝트-구조",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"먼저, 프로젝트의 기본 구조를 살펴보겠습니다:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:".\n├── package.json         # 프로젝트 설정 파일, 의존성 및 스크립트 명령어 정의\n├── tsconfig.json        # TypeScript 설정 파일, 컴파일 옵션 설정\n└── src                  # 소스 코드 디렉토리\n    ├── app.vue          # 메인 애플리케이션 컴포넌트, 페이지 구조 및 상호작용 로직 정의\n    ├── create-app.ts    # Vue 인스턴스 생성 팩토리, 애플리케이션 초기화 담당\n    ├── entry.client.ts  # 클라이언트 진입 파일, 브라우저 측 렌더링 처리\n    ├── entry.node.ts    # Node.js 서버 진입 파일, 개발 환경 구성 및 서버 시작 담당\n    └── entry.server.ts  # 서버 진입 파일, SSR 렌더링 로직 처리\n"})}),"\n",(0,t.jsxs)(n.h2,{id:"프로젝트-구성",children:["프로젝트 구성",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#프로젝트-구성",children:"#"})]}),"\n",(0,t.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"package.json"})," 파일을 생성하여 프로젝트 의존성 및 스크립트를 구성합니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n  "name": "ssr-demo-vue2",\n  "version": "1.0.0",\n  "type": "module",\n  "private": true,\n  "scripts": {\n    "dev": "gez dev",\n    "build": "npm run build:dts && npm run build:ssr",\n    "build:ssr": "gez build",\n    "preview": "gez preview",\n    "start": "NODE_ENV=production node dist/index.js",\n    "build:dts": "vue-tsc --declaration --emitDeclarationOnly --outDir dist/src"\n  },\n  "dependencies": {\n    "@gez/core": "*"\n  },\n  "devDependencies": {\n    "@gez/rspack-vue": "*",\n    "@types/node": "22.8.6",\n    "typescript": "^5.7.3",\n    "vue": "^2.7.16",\n    "vue-server-renderer": "^2.7.16",\n    "vue-tsc": "^2.1.6"\n  }\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"package.json"})," 파일을 생성한 후, 프로젝트 의존성을 설치해야 합니다. 다음 명령어 중 하나를 사용하여 설치할 수 있습니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"pnpm install\n# 또는\nyarn install\n# 또는\nnpm install\n"})}),"\n",(0,t.jsx)(n.p,{children:"이 명령어는 Vue2, TypeScript 및 SSR 관련 의존성을 포함한 모든 필수 패키지를 설치합니다."}),"\n",(0,t.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"tsconfig.json"})," 파일을 생성하여 TypeScript 컴파일 옵션을 구성합니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "module": "ESNext",\n        "moduleResolution": "node",\n        "isolatedModules": true,\n        "resolveJsonModule": true,\n        \n        "target": "ESNext",\n        "lib": ["ESNext", "DOM"],\n        \n        "strict": true,\n        "skipLibCheck": true,\n        "types": ["@types/node"],\n        \n        "experimentalDecorators": true,\n        "allowSyntheticDefaultImports": true,\n        \n        "baseUrl": ".",\n        "paths": {\n            "ssr-demo-vue2/src/*": ["./src/*"],\n            "ssr-demo-vue2/*": ["./*"]\n        }\n    },\n    "include": ["src"],\n    "exclude": ["dist", "node_modules"]\n}\n'})}),"\n",(0,t.jsxs)(n.h2,{id:"소스-코드-구조",children:["소스 코드 구조",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#소스-코드-구조",children:"#"})]}),"\n",(0,t.jsxs)(n.h3,{id:"appvue",children:["app.vue",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#appvue",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["메인 애플리케이션 컴포넌트 ",(0,t.jsx)(n.code,{children:"src/app.vue"}),"를 생성하고 ",(0,t.jsx)(n.code,{children:"<script setup>"})," 구문을 사용합니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-html",meta:'title="src/app.vue"',children:'<template>\n    <div id="app">\n        <h1><a href="https://www.jsesm.com/guide/frameworks/vue2.html" target="_blank">Gez 빠른 시작</a></h1>\n        <time :datetime="time">{{ time }}</time>\n    </div>\n</template>\n\n<script setup lang="ts">\n/**\n * @file 예제 컴포넌트\n * @description Gez 프레임워크의 기본 기능을 시연하기 위해 자동으로 업데이트되는 시간을 표시하는 페이지 제목\n */\n\nimport { onMounted, onUnmounted, ref } from \'vue\';\n\n// 현재 시간, 매초 업데이트\nconst time = ref(new Date().toISOString());\nlet timer: NodeJS.Timeout;\n\nonMounted(() => {\n    timer = setInterval(() => {\n        time.value = new Date().toISOString();\n    }, 1000);\n});\n\nonUnmounted(() => {\n    clearInterval(timer);\n});\n<\/script>\n'})}),"\n",(0,t.jsxs)(n.h3,{id:"create-appts",children:["create-app.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#create-appts",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"src/create-app.ts"})," 파일을 생성하여 Vue 애플리케이션 인스턴스를 생성합니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/create-app.ts"',children:"/**\n * @file Vue 인스턴스 생성\n * @description Vue 애플리케이션 인스턴스 생성 및 구성 담당\n */\n\nimport Vue from 'vue';\nimport App from './app.vue';\n\nexport function createApp() {\n    const app = new Vue({\n        render: (h) => h(App)\n    });\n    return {\n        app\n    };\n}\n"})}),"\n",(0,t.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["클라이언트 진입 파일 ",(0,t.jsx)(n.code,{children:"src/entry.client.ts"}),"를 생성합니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.client.ts"',children:"/**\n * @file 클라이언트 진입 파일\n * @description 클라이언트 상호작용 로직 및 동적 업데이트 처리\n */\n\nimport { createApp } from './create-app';\n\n// Vue 인스턴스 생성\nconst { app } = createApp();\n\n// Vue 인스턴스 마운트\napp.$mount('#app');\n"})}),"\n",(0,t.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"entry.node.ts"})," 파일을 생성하여 개발 환경 및 서버 시작을 구성합니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"/**\n * @file Node.js 서버 진입 파일\n * @description 개발 환경 구성 및 서버 시작, SSR 런타임 환경 제공\n */\n\nimport http from 'node:http';\nimport type { GezOptions } from '@gez/core';\n\nexport default {\n    /**\n     * 개발 환경 애플리케이션 생성기 구성\n     * @description Rspack 애플리케이션 인스턴스 생성 및 구성, 개발 환경 빌드 및 핫 리로드 지원\n     * @param gez Gez 프레임워크 인스턴스, 핵심 기능 및 구성 인터페이스 제공\n     * @returns HMR 및 실시간 미리보기를 지원하는 구성된 Rspack 애플리케이션 인스턴스 반환\n     */\n    async devApp(gez) {\n        return import('@gez/rspack-vue').then((m) =>\n            m.createRspackVue2App(gez, {\n                config(context) {\n                    // 여기서 Rspack 컴파일 설정을 사용자 정의\n                }\n            })\n        );\n    },\n\n    /**\n     * HTTP 서버 구성 및 시작\n     * @description HTTP 서버 인스턴스 생성, Gez 미들웨어 통합, SSR 요청 처리\n     * @param gez Gez 프레임워크 인스턴스, 미들웨어 및 렌더링 기능 제공\n     */\n    async server(gez) {\n        const server = http.createServer((req, res) => {\n            // Gez 미들웨어를 사용하여 요청 처리\n            gez.middleware(req, res, async () => {\n                // 서버 사이드 렌더링 실행\n                const rc = await gez.render({\n                    params: { url: req.url }\n                });\n                res.end(rc.html);\n            });\n        });\n\n        server.listen(3000, () => {\n            console.log('서버 시작: http://localhost:3000');\n        });\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,t.jsx)(n.p,{children:"이 파일은 개발 환경 구성 및 서버 시작을 위한 진입 파일로, 두 가지 핵심 기능을 포함합니다:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"devApp"})," 함수: 개발 환경의 Rspack 애플리케이션 인스턴스를 생성 및 구성하며, 핫 리로드 및 실시간 미리보기 기능을 지원합니다. 여기서는 Vue2 전용 Rspack 애플리케이션 인스턴스를 생성하기 위해 ",(0,t.jsx)(n.code,{children:"createRspackVue2App"}),"을 사용합니다."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"server"})," 함수: HTTP 서버를 생성 및 구성하고, Gez 미들웨어를 통합하여 SSR 요청을 처리합니다."]}),"\n"]}),"\n",(0,t.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["서버 사이드 렌더링 진입 파일 ",(0,t.jsx)(n.code,{children:"src/entry.server.ts"}),"를 생성합니다:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"/**\n * @file 서버 사이드 렌더링 진입 파일\n * @description 서버 사이드 렌더링 프로세스, HTML 생성 및 리소스 주입 담당\n */\n\nimport type { RenderContext } from '@gez/core';\nimport { createRenderer } from 'vue-server-renderer';\nimport { createApp } from './create-app';\n\n// 렌더러 생성\nconst renderer = createRenderer();\n\nexport default async (rc: RenderContext) => {\n    // Vue 애플리케이션 인스턴스 생성\n    const { app } = createApp();\n\n    // Vue의 renderToString을 사용하여 페이지 내용 생성\n    const html = await renderer.renderToString(app, {\n        importMetaSet: rc.importMetaSet\n    });\n\n    // 의존성 수집 제출, 모든 필수 리소스가 로드되도록 보장\n    await rc.commit();\n\n    // 완전한 HTML 구조 생성\n    rc.html = `<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n    ${rc.preload()}\n    <title>Gez 빠른 시작</title>\n    ${rc.css()}\n</head>\n<body>\n    ${html}\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n</body>\n</html>\n`;\n};\n"})}),"\n",(0,t.jsxs)(n.h2,{id:"프로젝트-실행",children:["프로젝트 실행",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#프로젝트-실행",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"위의 파일 구성을 완료한 후, 다음 명령어를 사용하여 프로젝트를 실행할 수 있습니다:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"개발 모드:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm run dev\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"프로젝트 빌드:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsx)(n.li,{children:"프로덕션 환경 실행:"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,t.jsxs)(n.p,{children:["이제 Gez를 기반으로 한 Vue2 SSR 애플리케이션을 성공적으로 생성했습니다! ",(0,t.jsx)(n.a,{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer",children:"http://localhost:3000"})," 에 접속하여 결과를 확인할 수 있습니다."]})]})}function c(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}let i=c;c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["ko%2Fguide%2Fframeworks%2Fvue2.md"]={toc:[{text:"프로젝트 구조",id:"프로젝트-구조",depth:2},{text:"프로젝트 구성",id:"프로젝트-구성",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3},{text:"소스 코드 구조",id:"소스-코드-구조",depth:2},{text:"app.vue",id:"appvue",depth:3},{text:"create-app.ts",id:"create-appts",depth:3},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"프로젝트 실행",id:"프로젝트-실행",depth:2}],title:"Vue2",headingTitle:"Vue2",frontmatter:{titleSuffix:"Gez 프레임워크 Vue2 SSR 애플리케이션 예제",description:"Gez를 기반으로 Vue2 SSR 애플리케이션을 처음부터 구축하는 방법을 보여주는 예제입니다. 프로젝트 초기화, Vue2 구성 및 진입 파일 설정을 포함한 프레임워크의 기본 사용법을 다룹니다.",head:[["meta",{property:"keywords",content:"Gez, Vue2, SSR 애플리케이션, TypeScript 구성, 프로젝트 초기화, 서버 사이드 렌더링, 클라이언트 상호작용"}]]}}}}]);