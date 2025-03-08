"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["7434"],{1131:function(e,n,t){t.r(n),t.d(n,{default:()=>c});var r=t(1549),s=t(6603);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",pre:"pre",code:"code",h3:"h3",ol:"ol",li:"li"},(0,s.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"html",children:["HTML",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#html",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"이 튜토리얼은 Gez 기반의 HTML SSR 애플리케이션을 처음부터 구축하는 방법을 안내합니다. Gez 프레임워크를 사용하여 서버 사이드 렌더링 애플리케이션을 만드는 방법을 완전한 예제를 통해 보여드리겠습니다."}),"\n",(0,r.jsxs)(n.h2,{id:"프로젝트-구조",children:["프로젝트 구조",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#프로젝트-구조",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"먼저, 프로젝트의 기본 구조를 살펴보겠습니다:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:".\n├── package.json         # 프로젝트 설정 파일, 의존성 및 스크립트 명령어 정의\n├── tsconfig.json        # TypeScript 설정 파일, 컴파일 옵션 설정\n└── src                  # 소스 코드 디렉토리\n    ├── app.ts           # 메인 애플리케이션 컴포넌트, 페이지 구조 및 상호작용 로직 정의\n    ├── create-app.ts    # 애플리케이션 인스턴스 생성 팩토리, 애플리케이션 초기화 담당\n    ├── entry.client.ts  # 클라이언트 진입 파일, 브라우저 측 렌더링 처리\n    ├── entry.node.ts    # Node.js 서버 진입 파일, 개발 환경 설정 및 서버 시작 담당\n    └── entry.server.ts  # 서버 진입 파일, SSR 렌더링 로직 처리\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"프로젝트-설정",children:["프로젝트 설정",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#프로젝트-설정",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"package.json"})," 파일을 생성하여 프로젝트 의존성 및 스크립트를 설정합니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n  "name": "ssr-demo-html",\n  "version": "1.0.0",\n  "type": "module",\n  "private": true,\n  "scripts": {\n    "dev": "gez dev",\n    "build": "npm run build:dts && npm run build:ssr",\n    "build:ssr": "gez build",\n    "preview": "gez preview",\n    "start": "NODE_ENV=production node dist/index.js",\n    "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src"\n  },\n  "dependencies": {\n    "@gez/core": "*"\n  },\n  "devDependencies": {\n    "@gez/rspack": "*",\n    "@types/node": "22.8.6",\n    "typescript": "^5.7.3"\n  }\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"package.json"})," 파일을 생성한 후, 프로젝트 의존성을 설치해야 합니다. 다음 명령어 중 하나를 사용하여 설치할 수 있습니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"pnpm install\n# 또는\nyarn install\n# 또는\nnpm install\n"})}),"\n",(0,r.jsx)(n.p,{children:"이 명령어는 TypeScript 및 SSR 관련 의존성을 포함한 모든 필수 패키지를 설치합니다."}),"\n",(0,r.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"tsconfig.json"})," 파일을 생성하여 TypeScript 컴파일 옵션을 설정합니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "module": "ESNext",\n        "moduleResolution": "node",\n        "isolatedModules": true,\n        "resolveJsonModule": true,\n        \n        "target": "ESNext",\n        "lib": ["ESNext", "DOM"],\n        \n        "strict": true,\n        "skipLibCheck": true,\n        "types": ["@types/node"],\n        \n        "experimentalDecorators": true,\n        "allowSyntheticDefaultImports": true,\n        \n        "baseUrl": ".",\n        "paths": {\n            "ssr-demo-html/src/*": ["./src/*"],\n            "ssr-demo-html/*": ["./*"]\n        }\n    },\n    "include": ["src"],\n    "exclude": ["dist", "node_modules"]\n}\n'})}),"\n",(0,r.jsxs)(n.h2,{id:"소스-코드-구조",children:["소스 코드 구조",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#소스-코드-구조",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"appts",children:["app.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#appts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["메인 애플리케이션 컴포넌트 ",(0,r.jsx)(n.code,{children:"src/app.ts"}),"를 생성하여 페이지 구조 및 상호작용 로직을 구현합니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/app.ts"',children:"/**\n * @file 예제 컴포넌트\n * @description Gez 프레임워크의 기본 기능을 보여주기 위해 자동으로 업데이트되는 시간을 표시하는 페이지 제목을 보여줍니다.\n */\n\nexport default class App {\n    /**\n     * 현재 시간, ISO 형식 사용\n     * @type {string}\n     */\n    public time = '';\n\n    /**\n     * 애플리케이션 인스턴스 생성\n     * @param {SsrContext} [ssrContext] - 서버 사이드 컨텍스트, 가져오기 메타데이터 집합 포함\n     */\n    public constructor(public ssrContext?: SsrContext) {\n        // 생성자에서 추가 초기화가 필요하지 않음\n    }\n\n    /**\n     * 페이지 내용 렌더링\n     * @returns {string} 페이지 HTML 구조 반환\n     */\n    public render(): string {\n        // 서버 사이드 환경에서 가져오기 메타데이터를 올바르게 수집\n        if (this.ssrContext) {\n            this.ssrContext.importMetaSet.add(import.meta);\n        }\n\n        return `\n        <div id=\"app\">\n            <h1><a href=\"https://www.jsesm.com/guide/frameworks/html.html\" target=\"_blank\">Gez 빠른 시작</a></h1>\n            <time datetime=\"${this.time}\">${this.time}</time>\n        </div>\n        `;\n    }\n\n    /**\n     * 클라이언트 초기화\n     * @throws {Error} 시간 표시 요소를 찾을 수 없을 때 오류 발생\n     */\n    public onClient(): void {\n        // 시간 표시 요소 가져오기\n        const time = document.querySelector('#app time');\n        if (!time) {\n            throw new Error('시간 표시 요소를 찾을 수 없습니다');\n        }\n\n        // 1초마다 시간 업데이트\n        setInterval(() => {\n            this.time = new Date().toISOString();\n            time.setAttribute('datetime', this.time);\n            time.textContent = this.time;\n        }, 1000);\n    }\n\n    /**\n     * 서버 초기화\n     */\n    public onServer(): void {\n        this.time = new Date().toISOString();\n    }\n}\n\n/**\n * 서버 사이드 컨텍스트 인터페이스\n * @interface\n */\nexport interface SsrContext {\n    /**\n     * 가져오기 메타데이터 집합\n     * @type {Set<ImportMeta>}\n     */\n    importMetaSet: Set<ImportMeta>;\n}\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"create-appts",children:["create-app.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#create-appts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"src/create-app.ts"})," 파일을 생성하여 애플리케이션 인스턴스를 생성합니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/create-app.ts"',children:"/**\n * @file 애플리케이션 인스턴스 생성\n * @description 애플리케이션 인스턴스 생성 및 설정 담당\n */\n\nimport App from './app';\n\nexport function createApp() {\n    const app = new App();\n    return {\n        app\n    };\n}\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["클라이언트 진입 파일 ",(0,r.jsx)(n.code,{children:"src/entry.client.ts"}),"를 생성합니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.client.ts"',children:"/**\n * @file 클라이언트 진입 파일\n * @description 클라이언트 상호작용 로직 및 동적 업데이트 담당\n */\n\nimport { createApp } from './create-app';\n\n// 애플리케이션 인스턴스 생성 및 초기화\nconst { app } = createApp();\napp.onClient();\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"entry.node.ts"})," 파일을 생성하여 개발 환경 설정 및 서버 시작을 구성합니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"/**\n * @file Node.js 서버 진입 파일\n * @description 개발 환경 설정 및 서버 시작 담당, SSR 런타임 환경 제공\n */\n\nimport http from 'node:http';\nimport type { GezOptions } from '@gez/core';\n\nexport default {\n    /**\n     * 개발 환경 애플리케이션 생성기 구성\n     * @description Rspack 애플리케이션 인스턴스 생성 및 구성, 개발 환경 빌드 및 핫 리로드 지원\n     * @param gez Gez 프레임워크 인스턴스, 핵심 기능 및 설정 인터페이스 제공\n     * @returns HMR 및 실시간 미리보기를 지원하는 구성된 Rspack 애플리케이션 인스턴스 반환\n     */\n    async devApp(gez) {\n        return import('@gez/rspack').then((m) =>\n            m.createRspackHtmlApp(gez, {\n                config(context) {\n                    // 여기서 Rspack 컴파일 설정을 사용자 정의\n                }\n            })\n        );\n    },\n\n    /**\n     * HTTP 서버 구성 및 시작\n     * @description HTTP 서버 인스턴스 생성, Gez 미들웨어 통합, SSR 요청 처리\n     * @param gez Gez 프레임워크 인스턴스, 미들웨어 및 렌더링 기능 제공\n     */\n    async server(gez) {\n        const server = http.createServer((req, res) => {\n            // Gez 미들웨어를 사용하여 요청 처리\n            gez.middleware(req, res, async () => {\n                // 서버 사이드 렌더링 실행\n                const rc = await gez.render({\n                    params: { url: req.url }\n                });\n                res.end(rc.html);\n            });\n        });\n\n        server.listen(3000, () => {\n            console.log('서버 시작: http://localhost:3000');\n        });\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,r.jsx)(n.p,{children:"이 파일은 개발 환경 설정 및 서버 시작을 위한 진입 파일로, 두 가지 핵심 기능을 포함합니다:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"devApp"})," 함수: 개발 환경의 Rspack 애플리케이션 인스턴스를 생성 및 구성하며, 핫 리로드 및 실시간 미리보기 기능을 지원합니다."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"server"})," 함수: HTTP 서버를 생성 및 구성하고, Gez 미들웨어를 통합하여 SSR 요청을 처리합니다."]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["서버 사이드 렌더링 진입 파일 ",(0,r.jsx)(n.code,{children:"src/entry.server.ts"}),"를 생성합니다:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"/**\n * @file 서버 사이드 렌더링 진입 파일\n * @description 서버 사이드 렌더링 프로세스, HTML 생성 및 리소스 주입 담당\n */\n\nimport type { RenderContext } from '@gez/core';\nimport type App from './app';\nimport type { SsrContext } from './app';\nimport { createApp } from './create-app';\n\n// 페이지 내용 생성 로직 캡슐화\nconst renderToString = (app: App, ssrContext: SsrContext): string => {\n    // 서버 사이드 렌더링 컨텍스트를 애플리케이션 인스턴스에 주입\n    app.ssrContext = ssrContext;\n    // 서버 초기화\n    app.onServer();\n\n    // 페이지 내용 생성\n    return app.render();\n};\n\nexport default async (rc: RenderContext) => {\n    // 애플리케이션 인스턴스 생성, app 인스턴스를 포함한 객체 반환\n    const { app } = createApp();\n    // renderToString을 사용하여 페이지 내용 생성\n    const html = renderToString(app, {\n        importMetaSet: rc.importMetaSet\n    });\n\n    // 의존성 수집 제출, 모든 필수 리소스가 로드되도록 보장\n    await rc.commit();\n\n    // 완전한 HTML 구조 생성\n    rc.html = `<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n    ${rc.preload()}\n    <title>Gez 빠른 시작</title>\n    ${rc.css()}\n</head>\n<body>\n    ${html}\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n</body>\n</html>\n`;\n};\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"프로젝트-실행",children:["프로젝트 실행",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#프로젝트-실행",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"위의 파일 설정을 완료한 후, 다음 명령어를 사용하여 프로젝트를 실행할 수 있습니다:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"개발 모드:"}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run dev\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:"프로젝트 빌드:"}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"3",children:["\n",(0,r.jsx)(n.li,{children:"프로덕션 환경 실행:"}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run start\n"})}),"\n",(0,r.jsxs)(n.p,{children:["이제 Gez 기반의 HTML SSR 애플리케이션을 성공적으로 생성했습니다! ",(0,r.jsx)(n.a,{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer",children:"http://localhost:3000"})," 에 접속하여 결과를 확인할 수 있습니다."]})]})}function a(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}let c=a;a.__RSPRESS_PAGE_META={},a.__RSPRESS_PAGE_META["ko%2Fguide%2Fframeworks%2Fhtml.md"]={toc:[{text:"프로젝트 구조",id:"프로젝트-구조",depth:2},{text:"프로젝트 설정",id:"프로젝트-설정",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3},{text:"소스 코드 구조",id:"소스-코드-구조",depth:2},{text:"app.ts",id:"appts",depth:3},{text:"create-app.ts",id:"create-appts",depth:3},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"프로젝트 실행",id:"프로젝트-실행",depth:2}],title:"HTML",headingTitle:"HTML",frontmatter:{titleSuffix:"Gez 프레임워크 HTML SSR 애플리케이션 예제",description:"Gez 기반의 HTML SSR 애플리케이션을 처음부터 구축하는 방법을 보여주는 예제입니다. 프로젝트 초기화, HTML 설정 및 진입 파일 설정을 포함한 프레임워크의 기본 사용법을 다룹니다.",head:[["meta",{property:"keywords",content:"Gez, HTML, SSR 애플리케이션, TypeScript 설정, 프로젝트 초기화, 서버 사이드 렌더링, 클라이언트 상호작용"}]]}}}}]);