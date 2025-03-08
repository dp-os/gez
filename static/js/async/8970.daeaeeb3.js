"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["8970"],{3324:function(e,n,s){s.r(n),s.d(n,{default:()=>c});var r=s(1549),i=s(6603);function t(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",pre:"pre",code:"code",div:"div",ul:"ul",li:"li",strong:"strong"},(0,i.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"मानक-मानदंड",children:["मानक मानदंड",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#मानक-मानदंड",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"Gez एक आधुनिक SSR फ्रेमवर्क है, जो विकास और उत्पादन वातावरण में परियोजना की स्थिरता और रखरखाव क्षमता सुनिश्चित करने के लिए मानकीकृत परियोजना संरचना और पथ विश्लेषण तंत्र का उपयोग करता है।"}),"\n",(0,r.jsxs)(n.h2,{id:"परियोजना-संरचना-मानक",children:["परियोजना संरचना मानक",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#परियोजना-संरचना-मानक",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"मानक-निर्देशिका-संरचना",children:["मानक निर्देशिका संरचना",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#मानक-निर्देशिका-संरचना",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-txt",children:"root\n│─ dist                  # संकलन आउटपुट निर्देशिका\n│  ├─ package.json       # संकलन आउटपुट के बाद का पैकेज कॉन्फ़िगरेशन\n│  ├─ server             # सर्वर-साइड संकलन आउटपुट\n│  │  └─ manifest.json   # संकलन सूची आउटपुट, importmap उत्पन्न करने के लिए\n│  ├─ node               # Node सर्वर प्रोग्राम संकलन आउटपुट\n│  ├─ client             # क्लाइंट-साइड संकलन आउटपुट\n│  │  ├─ versions        # संस्करण भंडारण निर्देशिका\n│  │  │  └─ latest.tgz   # dist निर्देशिका को संग्रहित करें, सॉफ्टवेयर पैकेज वितरण प्रदान करने के लिए\n│  │  └─ manifest.json   # संकलन सूची आउटपुट, importmap उत्पन्न करने के लिए\n│  └─ src                # tsc द्वारा उत्पन्न फ़ाइल प्रकार\n├─ src\n│  ├─ entry.server.ts    # सर्वर-साइड एप्लिकेशन प्रवेश बिंदु\n│  ├─ entry.client.ts    # क्लाइंट-साइड एप्लिकेशन प्रवेश बिंदु\n│  └─ entry.node.ts      # Node सर्वर एप्लिकेशन प्रवेश बिंदु\n├─ tsconfig.json         # TypeScript कॉन्फ़िगरेशन\n└─ package.json          # पैकेज कॉन्फ़िगरेशन\n"})}),"\n",(0,r.jsxs)(n.div,{className:"rspress-directive tip",children:[(0,r.jsx)(n.div,{className:"rspress-directive-title",children:"विस्तारित ज्ञान"}),(0,r.jsxs)(n.div,{className:"rspress-directive-content",children:["\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"gez.name"})," ",(0,r.jsx)(n.code,{children:"package.json"})," के ",(0,r.jsx)(n.code,{children:"name"})," फ़ील्ड से प्राप्त होता है"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"dist/package.json"})," रूट निर्देशिका के ",(0,r.jsx)(n.code,{children:"package.json"})," से प्राप्त होता है"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"packs.enable"})," को ",(0,r.jsx)(n.code,{children:"true"})," पर सेट करने पर ही ",(0,r.jsx)(n.code,{children:"dist"})," निर्देशिका को संग्रहित किया जाएगा"]}),"\n"]}),"\n"]})]}),"\n",(0,r.jsxs)(n.h2,{id:"प्रवेश-फ़ाइल-मानक",children:["प्रवेश फ़ाइल मानक",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#प्रवेश-फ़ाइल-मानक",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"entryclientts",children:["entry.client.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryclientts",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"क्लाइंट-साइड प्रवेश फ़ाइल के जिम्मेदारियां:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"एप्लिकेशन आरंभीकरण"}),": क्लाइंट-साइड एप्लिकेशन की मूल सेटिंग्स कॉन्फ़िगर करना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"रूटिंग प्रबंधन"}),": क्लाइंट-साइड रूटिंग और नेविगेशन को संभालना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"स्थिति प्रबंधन"}),": क्लाइंट-साइड स्थिति का भंडारण और अद्यतन करना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"इंटरैक्शन प्रबंधन"}),": उपयोगकर्ता इवेंट्स और इंटरफ़ेस इंटरैक्शन को संभालना"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entryserverts",children:["entry.server.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryserverts",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"सर्वर-साइड प्रवेश फ़ाइल के जिम्मेदारियां:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"सर्वर-साइड रेंडरिंग"}),": SSR रेंडरिंग प्रक्रिया को निष्पादित करना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"HTML जनरेशन"}),": प्रारंभिक पृष्ठ संरचना का निर्माण करना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"डेटा प्रीफ़ेच"}),": सर्वर-साइड डेटा प्राप्ति को संभालना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"स्थिति इंजेक्शन"}),": सर्वर-साइड स्थिति को क्लाइंट को पास करना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"SEO अनुकूलन"}),": पृष्ठ की सर्च इंजन अनुकूलन सुनिश्चित करना"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"entrynodets",children:["entry.node.ts",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entrynodets",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"Node.js सर्वर प्रवेश फ़ाइल के जिम्मेदारियां:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"सर्वर कॉन्फ़िगरेशन"}),": HTTP सर्वर पैरामीटर्स सेट करना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"रूटिंग प्रबंधन"}),": सर्वर-साइड रूटिंग नियमों को संभालना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"मिडलवेयर एकीकरण"}),": सर्वर मिडलवेयर कॉन्फ़िगर करना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"पर्यावरण प्रबंधन"}),": पर्यावरण चर और कॉन्फ़िगरेशन को संभालना"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"अनुरोध प्रतिक्रिया"}),": HTTP अनुरोध और प्रतिक्रिया को संभालना"]}),"\n"]}),"\n",(0,r.jsxs)(n.h2,{id:"कॉन्फ़िगरेशन-फ़ाइल-मानक",children:["कॉन्फ़िगरेशन फ़ाइल मानक",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#कॉन्फ़िगरेशन-फ़ाइल-मानक",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"packagejson",children:["package.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#packagejson",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="package.json"',children:'{\n    "name": "your-app-name",\n    "type": "module",\n    "scripts": {\n        "dev": "gez dev",\n        "build": "npm run build:dts && npm run build:ssr",\n        "build:ssr": "gez build",\n        "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src",\n        "preview": "gez preview",\n        "start": "NODE_ENV=production node dist/index.js"\n    }\n}\n'})}),"\n",(0,r.jsxs)(n.h3,{id:"tsconfigjson",children:["tsconfig.json",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tsconfigjson",children:"#"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",meta:'title="tsconfig.json"',children:'{\n    "compilerOptions": {\n        "isolatedModules": true,\n        "allowJs": false,\n        "experimentalDecorators": true,\n        "resolveJsonModule": true,\n        "types": [\n            "@types/node"\n        ],\n        "target": "ESNext",\n        "module": "ESNext",\n        "importHelpers": false,\n        "declaration": true,\n        "sourceMap": true,\n        "strict": true,\n        "noImplicitAny": false,\n        "noImplicitReturns": false,\n        "noFallthroughCasesInSwitch": true,\n        "noUnusedLocals": false,\n        "noUnusedParameters": false,\n        "moduleResolution": "node",\n        "esModuleInterop": true,\n        "skipLibCheck": true,\n        "allowSyntheticDefaultImports": true,\n        "forceConsistentCasingInFileNames": true,\n        "noEmit": true\n    },\n    "include": [\n        "src",\n        "**.ts"\n    ],\n    "exclude": [\n        "dist"\n    ]\n}\n'})})]})}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,i.ah)(),e.components);return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(t,{...e})}):t(e)}let c=d;d.__RSPRESS_PAGE_META={},d.__RSPRESS_PAGE_META["hi%2Fguide%2Fessentials%2Fstd.md"]={toc:[{text:"परियोजना संरचना मानक",id:"परियोजना-संरचना-मानक",depth:2},{text:"मानक निर्देशिका संरचना",id:"मानक-निर्देशिका-संरचना",depth:3},{text:"प्रवेश फ़ाइल मानक",id:"प्रवेश-फ़ाइल-मानक",depth:2},{text:"entry.client.ts",id:"entryclientts",depth:3},{text:"entry.server.ts",id:"entryserverts",depth:3},{text:"entry.node.ts",id:"entrynodets",depth:3},{text:"कॉन्फ़िगरेशन फ़ाइल मानक",id:"कॉन्फ़िगरेशन-फ़ाइल-मानक",depth:2},{text:"package.json",id:"packagejson",depth:3},{text:"tsconfig.json",id:"tsconfigjson",depth:3}],title:"मानक मानदंड",headingTitle:"मानक मानदंड",frontmatter:{titleSuffix:"Gez फ्रेमवर्क परियोजना संरचना और मानक गाइड",description:"Gez फ्रेमवर्क की मानक परियोजना संरचना, प्रवेश फ़ाइल मानक और कॉन्फ़िगरेशन फ़ाइल मानक का विस्तृत विवरण, जो डेवलपर्स को मानकीकृत और रखरखाव योग्य SSR एप्लिकेशन बनाने में मदद करता है।",head:[["meta",{property:"keywords",content:"Gez, परियोजना संरचना, प्रवेश फ़ाइल, कॉन्फ़िगरेशन मानक, SSR फ्रेमवर्क, TypeScript, परियोजना मानक, विकास मानक"}]]}}}}]);