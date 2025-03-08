"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["2878"],{8598:function(e,n,r){r.r(n),r.d(n,{default:()=>l});var s=r(1549),i=r(6603);function d(e){let n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong",pre:"pre",code:"code",h4:"h4"},(0,i.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.h1,{id:"moduleconfig",children:["ModuleConfig",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#moduleconfig",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"ModuleConfig, Gez फ्रेमवर्क के मॉड्यूल कॉन्फ़िगरेशन कार्यक्षमता प्रदान करता है, जिसका उपयोग मॉड्यूल के आयात/निर्यात नियम, उपनाम कॉन्फ़िगरेशन और बाहरी निर्भरता आदि को परिभाषित करने के लिए किया जाता है।"}),"\n",(0,s.jsxs)(n.h2,{id:"प्रकार-परिभाषा",children:["प्रकार परिभाषा",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#प्रकार-परिभाषा",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"pathtype",children:["PathType",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#pathtype",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"प्रकार परिभाषा"}),":"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"enum PathType {\n  npm = 'npm:', \n  root = 'root:'\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"मॉड्यूल पथ प्रकार एनम:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"npm"}),": node_modules में स्थित निर्भरता को दर्शाता है"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"root"}),": प्रोजेक्ट रूट डायरेक्टरी में स्थित फ़ाइल को दर्शाता है"]}),"\n"]}),"\n",(0,s.jsxs)(n.h3,{id:"moduleconfig-1",children:["ModuleConfig",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#moduleconfig-1",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"प्रकार परिभाषा"}),":"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"interface ModuleConfig {\n  exports?: string[]\n  imports?: Record<string, string>\n  externals?: Record<string, string>\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"मॉड्यूल कॉन्फ़िगरेशन इंटरफ़ेस, जिसका उपयोग सेवा के निर्यात, आयात और बाहरी निर्भरता कॉन्फ़िगरेशन को परिभाषित करने के लिए किया जाता है।"}),"\n",(0,s.jsxs)(n.h4,{id:"exports",children:["exports",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exports",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"निर्यात कॉन्फ़िगरेशन सूची, जो सेवा में विशिष्ट कोड यूनिट (जैसे कंपोनेंट, उपयोगिता फ़ंक्शन आदि) को ESM प्रारूप में बाहरी रूप से उजागर करती है।"}),"\n",(0,s.jsx)(n.p,{children:"दो प्रकार समर्थित हैं:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"root:*"}),": स्रोत कोड फ़ाइल निर्यात करता है, जैसे: 'root:src/components/button.vue'"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"npm:*"}),": तृतीय-पक्ष निर्भरता निर्यात करता है, जैसे: 'npm:vue'"]}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"imports",children:["imports",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#imports",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"आयात कॉन्फ़िगरेशन मैपिंग, जो दूरस्थ मॉड्यूल और उनके स्थानीय पथ को कॉन्फ़िगर करता है।"}),"\n",(0,s.jsx)(n.p,{children:"स्थापना विधि के आधार पर कॉन्फ़िगरेशन भिन्न होता है:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"स्रोत कोड स्थापना (Workspace, Git): dist डायरेक्टरी की ओर इंगित करना आवश्यक है"}),"\n",(0,s.jsx)(n.li,{children:"सॉफ़्टवेयर पैकेज स्थापना (Link, स्थिर सर्वर, निजी मिरर स्रोत, File): सीधे पैकेज डायरेक्टरी की ओर इंगित करें"}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"externals",children:["externals",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#externals",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"बाहरी निर्भरता मैपिंग, जो उपयोग की जाने वाली बाहरी निर्भरता को कॉन्फ़िगर करता है, आमतौर पर दूरस्थ मॉड्यूल में स्थित निर्भरता का उपयोग करता है।"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"उदाहरण"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"import type { GezOptions } from '@gez/core';\n\nexport default {\n  modules: {\n    // निर्यात कॉन्फ़िगरेशन\n    exports: [\n      'root:src/components/button.vue',  // स्रोत कोड फ़ाइल निर्यात करें\n      'root:src/utils/format.ts',\n      'npm:vue',  // तृतीय-पक्ष निर्भरता निर्यात करें\n      'npm:vue-router'\n    ],\n\n    // आयात कॉन्फ़िगरेशन\n    imports: {\n      // स्रोत कोड स्थापना विधि: dist डायरेक्टरी की ओर इंगित करना आवश्यक है\n      'ssr-remote': 'root:./node_modules/ssr-remote/dist',\n      // सॉफ़्टवेयर पैकेज स्थापना विधि: सीधे पैकेज डायरेक्टरी की ओर इंगित करें\n      'other-remote': 'root:./node_modules/other-remote'\n    },\n\n    // बाहरी निर्भरता कॉन्फ़िगरेशन\n    externals: {\n      'vue': 'ssr-remote/npm/vue',\n      'vue-router': 'ssr-remote/npm/vue-router'\n    }\n  }\n} satisfies GezOptions;\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"parsedmoduleconfig",children:["ParsedModuleConfig",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#parsedmoduleconfig",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"प्रकार परिभाषा"}),":"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"interface ParsedModuleConfig {\n  name: string\n  root: string\n  exports: {\n    name: string\n    type: PathType\n    importName: string\n    exportName: string\n    exportPath: string\n    externalName: string\n  }[]\n  imports: {\n    name: string\n    localPath: string\n  }[]\n  externals: Record<string, { match: RegExp; import?: string }>\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"पार्स किया गया मॉड्यूल कॉन्फ़िगरेशन, जो मूल मॉड्यूल कॉन्फ़िगरेशन को मानकीकृत आंतरिक प्रारूप में परिवर्तित करता है:"}),"\n",(0,s.jsxs)(n.h4,{id:"name",children:["name",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#name",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"वर्तमान सेवा का नाम"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"मॉड्यूल की पहचान और आयात पथ उत्पन्न करने के लिए उपयोग किया जाता है"}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"root",children:["root",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#root",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"वर्तमान सेवा की रूट डायरेक्टरी पथ"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"सापेक्ष पथ और निर्माण उत्पादों के भंडारण को हल करने के लिए उपयोग किया जाता है"}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"exports-1",children:["exports",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#exports-1",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"निर्यात कॉन्फ़िगरेशन सूची"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"name"}),": मूल निर्यात पथ, जैसे: 'npm:vue' या 'root:src/components'"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"type"}),": पथ प्रकार (npm या root)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"importName"}),": आयात नाम, प्रारूप: '${serviceName}/${type}/${path}'"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"exportName"}),": निर्यात पथ, सेवा रूट डायरेक्टरी के सापेक्ष"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"exportPath"}),": वास्तविक फ़ाइल पथ"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"externalName"}),": बाहरी निर्भरता नाम, अन्य सेवाओं द्वारा इस मॉड्यूल को आयात करते समय पहचान के लिए उपयोग किया जाता है"]}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"imports-1",children:["imports",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#imports-1",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"आयात कॉन्फ़िगरेशन सूची"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"name"}),": बाहरी सेवा का नाम"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"localPath"}),": स्थानीय भंडारण पथ, बाहरी मॉड्यूल के निर्माण उत्पादों को संग्रहीत करने के लिए उपयोग किया जाता है"]}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"externals-1",children:["externals",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#externals-1",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"बाहरी निर्भरता मैपिंग"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"मॉड्यूल के आयात पथ को वास्तविक मॉड्यूल स्थान पर मैप करता है"}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"match"}),": आयात स्टेटमेंट से मिलान करने के लिए उपयोग किया जाने वाला रेगुलर एक्सप्रेशन"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"import"}),": वास्तविक मॉड्यूल पथ"]}),"\n"]})]})}function t(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,i.ah)(),e.components);return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}let l=t;t.__RSPRESS_PAGE_META={},t.__RSPRESS_PAGE_META["hi%2Fapi%2Fcore%2Fmodule-config.md"]={toc:[{text:"प्रकार परिभाषा",id:"प्रकार-परिभाषा",depth:2},{text:"PathType",id:"pathtype",depth:3},{text:"ModuleConfig",id:"moduleconfig-1",depth:3},{text:"exports",id:"exports",depth:4},{text:"imports",id:"imports",depth:4},{text:"externals",id:"externals",depth:4},{text:"ParsedModuleConfig",id:"parsedmoduleconfig",depth:3},{text:"name",id:"name",depth:4},{text:"root",id:"root",depth:4},{text:"exports",id:"exports-1",depth:4},{text:"imports",id:"imports-1",depth:4},{text:"externals",id:"externals-1",depth:4}],title:"ModuleConfig",headingTitle:"ModuleConfig",frontmatter:{titleSuffix:"Gez फ्रेमवर्क मॉड्यूल कॉन्फ़िगरेशन API संदर्भ",description:"Gez फ्रेमवर्क के ModuleConfig कॉन्फ़िगरेशन इंटरफ़ेस का विस्तृत विवरण, जिसमें मॉड्यूल आयात/निर्यात नियम, उपनाम कॉन्फ़िगरेशन और बाहरी निर्भरता प्रबंधन शामिल है, जो डेवलपर्स को फ्रेमवर्क के मॉड्यूलर सिस्टम को गहराई से समझने में मदद करता है।",head:[["meta",{property:"keywords",content:"Gez, ModuleConfig, मॉड्यूल कॉन्फ़िगरेशन, मॉड्यूल आयात/निर्यात, बाहरी निर्भरता, उपनाम कॉन्फ़िगरेशन, निर्भरता प्रबंधन, वेब एप्लिकेशन फ्रेमवर्क"}]]}}}}]);