"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["8357"],{8736:function(n,h,e){e.r(h),e.d(h,{default:()=>s});var i=e(1549),t=e(6603);function c(n){let h=Object.assign({h1:"h1",a:"a",p:"p",h3:"h3",h4:"h4",ul:"ul",li:"li",strong:"strong",ol:"ol",h2:"h2",code:"code",pre:"pre"},(0,t.ah)(),n.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(h.h1,{id:"li\\xean-kết-module",children:["Li\xean kết module",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#li\\xean-kết-module",children:"#"})]}),"\n",(0,i.jsx)(h.p,{children:"Gez Framework cung cấp một cơ chế li\xean kết module ho\xe0n chỉnh để quản l\xfd việc chia sẻ m\xe3 v\xe0 c\xe1c mối quan hệ phụ thuộc giữa c\xe1c dịch vụ. Cơ chế n\xe0y được triển khai dựa tr\xean ti\xeau chuẩn ESM (ECMAScript Module), hỗ trợ xuất v\xe0 nhập module ở cấp độ m\xe3 nguồn, c\xf9ng với c\xe1c chức năng quản l\xfd phụ thuộc đầy đủ."}),"\n",(0,i.jsxs)(h.h3,{id:"kh\\xe1i-niệm-cốt-l\\xf5i",children:["Kh\xe1i niệm cốt l\xf5i",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#kh\\xe1i-niệm-cốt-l\\xf5i",children:"#"})]}),"\n",(0,i.jsxs)(h.h4,{id:"xuất-module",children:["Xuất module",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#xuất-module",children:"#"})]}),"\n",(0,i.jsx)(h.p,{children:"Xuất module l\xe0 qu\xe1 tr\xecnh đưa c\xe1c đơn vị m\xe3 cụ thể trong dịch vụ (như component, h\xe0m tiện \xedch, v.v.) ra ngo\xe0i dưới định dạng ESM. Hỗ trợ hai loại xuất:"}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"Xuất m\xe3 nguồn"}),": Xuất trực tiếp c\xe1c tệp m\xe3 nguồn trong dự \xe1n"]}),"\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"Xuất phụ thuộc"}),": Xuất c\xe1c g\xf3i phụ thuộc b\xean thứ ba m\xe0 dự \xe1n sử dụng"]}),"\n"]}),"\n",(0,i.jsxs)(h.h4,{id:"nhập-module",children:["Nhập module",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#nhập-module",children:"#"})]}),"\n",(0,i.jsx)(h.p,{children:"Nhập module l\xe0 qu\xe1 tr\xecnh tham chiếu c\xe1c đơn vị m\xe3 được xuất từ c\xe1c dịch vụ kh\xe1c trong một dịch vụ. Hỗ trợ nhiều c\xe1ch c\xe0i đặt:"}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"C\xe0i đặt m\xe3 nguồn"}),": Ph\xf9 hợp cho m\xf4i trường ph\xe1t triển, hỗ trợ sửa đổi thời gian thực v\xe0 cập nhật n\xf3ng"]}),"\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"C\xe0i đặt g\xf3i phần mềm"}),": Ph\xf9 hợp cho m\xf4i trường sản xuất, sử dụng trực tiếp sản phẩm đ\xe3 được build"]}),"\n"]}),"\n",(0,i.jsxs)(h.h3,{id:"cơ-chế-tải-trước",children:["Cơ chế tải trước",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#cơ-chế-tải-trước",children:"#"})]}),"\n",(0,i.jsx)(h.p,{children:"Để tối ưu h\xf3a hiệu suất dịch vụ, Gez đ\xe3 triển khai cơ chế tải trước module th\xf4ng minh:"}),"\n",(0,i.jsxs)(h.ol,{children:["\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Ph\xe2n t\xedch phụ thuộc"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"Ph\xe2n t\xedch c\xe1c mối quan hệ phụ thuộc giữa c\xe1c component trong qu\xe1 tr\xecnh build"}),"\n",(0,i.jsx)(h.li,{children:"X\xe1c định c\xe1c module cốt l\xf5i tr\xean đường dẫn quan trọng"}),"\n",(0,i.jsx)(h.li,{children:"X\xe1c định mức độ ưu ti\xean tải của c\xe1c module"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Chiến lược tải"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"Tải ngay lập tức"}),": C\xe1c module cốt l\xf5i tr\xean đường dẫn quan trọng"]}),"\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"Tải trễ"}),": C\xe1c module chức năng kh\xf4ng quan trọng"]}),"\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"Tải theo y\xeau cầu"}),": C\xe1c module được render c\xf3 điều kiện"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Tối ưu h\xf3a t\xe0i nguy\xean"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"Chiến lược ph\xe2n chia m\xe3 th\xf4ng minh"}),"\n",(0,i.jsx)(h.li,{children:"Quản l\xfd bộ nhớ đệm ở cấp độ module"}),"\n",(0,i.jsx)(h.li,{children:"Bi\xean dịch v\xe0 đ\xf3ng g\xf3i theo y\xeau cầu"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.h2,{id:"xuất-module-1",children:["Xuất module",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#xuất-module-1",children:"#"})]}),"\n",(0,i.jsxs)(h.h3,{id:"cấu-h\\xecnh",children:["Cấu h\xecnh",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#cấu-h\\xecnh",children:"#"})]}),"\n",(0,i.jsxs)(h.p,{children:["Cấu h\xecnh c\xe1c module cần xuất trong ",(0,i.jsx)(h.code,{children:"entry.node.ts"}),":"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"import type { GezOptions } from '@gez/core';\n\nexport default {\n    modules: {\n        exports: [\n            // Xuất tệp m\xe3 nguồn\n            'root:src/components/button.vue',  // Vue component\n            'root:src/utils/format.ts',        // H\xe0m tiện \xedch\n            // Xuất phụ thuộc b\xean thứ ba\n            'npm:vue',                         // Vue framework\n            'npm:vue-router'                   // Vue Router\n        ]\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,i.jsx)(h.p,{children:"Cấu h\xecnh xuất hỗ trợ hai loại:"}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.code,{children:"root:*"}),": Xuất tệp m\xe3 nguồn, đường dẫn tương đối so với thư mục gốc của dự \xe1n"]}),"\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.code,{children:"npm:*"}),": Xuất phụ thuộc b\xean thứ ba, chỉ định trực tiếp t\xean g\xf3i"]}),"\n"]}),"\n",(0,i.jsxs)(h.h2,{id:"nhập-module-1",children:["Nhập module",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#nhập-module-1",children:"#"})]}),"\n",(0,i.jsxs)(h.h3,{id:"cấu-h\\xecnh-1",children:["Cấu h\xecnh",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#cấu-h\\xecnh-1",children:"#"})]}),"\n",(0,i.jsxs)(h.p,{children:["Cấu h\xecnh c\xe1c module cần nhập trong ",(0,i.jsx)(h.code,{children:"entry.node.ts"}),":"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"import type { GezOptions } from '@gez/core';\n\nexport default {\n    modules: {\n        // Cấu h\xecnh nhập\n        imports: {\n            // C\xe0i đặt m\xe3 nguồn: Trỏ đến thư mục sản phẩm build\n            'ssr-remote': 'root:./node_modules/ssr-remote/dist',\n            // C\xe0i đặt g\xf3i phần mềm: Trỏ đến thư mục g\xf3i\n            'other-remote': 'root:./node_modules/other-remote'\n        },\n        // Cấu h\xecnh phụ thuộc b\xean ngo\xe0i\n        externals: {\n            // Sử dụng phụ thuộc từ module từ xa\n            'vue': 'ssr-remote/npm/vue',\n            'vue-router': 'ssr-remote/npm/vue-router'\n        }\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,i.jsx)(h.p,{children:"Giải th\xedch cấu h\xecnh:"}),"\n",(0,i.jsxs)(h.ol,{children:["\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsxs)(h.p,{children:[(0,i.jsx)(h.strong,{children:"imports"}),": Cấu h\xecnh đường dẫn cục bộ của module từ xa"]}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"C\xe0i đặt m\xe3 nguồn: Trỏ đến thư mục sản phẩm build (dist)"}),"\n",(0,i.jsx)(h.li,{children:"C\xe0i đặt g\xf3i phần mềm: Trỏ trực tiếp đến thư mục g\xf3i"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsxs)(h.p,{children:[(0,i.jsx)(h.strong,{children:"externals"}),": Cấu h\xecnh phụ thuộc b\xean ngo\xe0i"]}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"D\xf9ng để chia sẻ phụ thuộc từ module từ xa"}),"\n",(0,i.jsx)(h.li,{children:"Tr\xe1nh đ\xf3ng g\xf3i tr\xf9ng lặp c\xe1c phụ thuộc giống nhau"}),"\n",(0,i.jsx)(h.li,{children:"Hỗ trợ chia sẻ phụ thuộc giữa nhiều module"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.h3,{id:"c\\xe1ch-c\\xe0i-đặt",children:["C\xe1ch c\xe0i đặt",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#c\\xe1ch-c\\xe0i-đặt",children:"#"})]}),"\n",(0,i.jsxs)(h.h4,{id:"c\\xe0i-đặt-m\\xe3-nguồn",children:["C\xe0i đặt m\xe3 nguồn",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#c\\xe0i-đặt-m\\xe3-nguồn",children:"#"})]}),"\n",(0,i.jsx)(h.p,{children:"Ph\xf9 hợp cho m\xf4i trường ph\xe1t triển, hỗ trợ sửa đổi thời gian thực v\xe0 cập nhật n\xf3ng."}),"\n",(0,i.jsxs)(h.ol,{children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"C\xe1ch Workspace"}),"\nKhuyến nghị sử dụng trong dự \xe1n Monorepo:"]}),"\n"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-ts",meta:'title="package.json"',children:'{\n    "devDependencies": {\n        "ssr-remote": "workspace:*"\n    }\n}\n'})}),"\n",(0,i.jsxs)(h.ol,{start:"2",children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"C\xe1ch Link"}),"\nD\xf9ng để debug ph\xe1t triển cục bộ:"]}),"\n"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-ts",meta:'title="package.json"',children:'{\n    "devDependencies": {\n        "ssr-remote": "link:../ssr-remote"\n    }\n}\n'})}),"\n",(0,i.jsxs)(h.h4,{id:"c\\xe0i-đặt-g\\xf3i-phần-mềm",children:["C\xe0i đặt g\xf3i phần mềm",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#c\\xe0i-đặt-g\\xf3i-phần-mềm",children:"#"})]}),"\n",(0,i.jsx)(h.p,{children:"Ph\xf9 hợp cho m\xf4i trường sản xuất, sử dụng trực tiếp sản phẩm đ\xe3 được build."}),"\n",(0,i.jsxs)(h.ol,{children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"NPM Registry"}),"\nC\xe0i đặt qua npm registry:"]}),"\n"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-ts",meta:'title="package.json"',children:'{\n    "dependencies": {\n        "ssr-remote": "^1.0.0"\n    }\n}\n'})}),"\n",(0,i.jsxs)(h.ol,{start:"2",children:["\n",(0,i.jsxs)(h.li,{children:[(0,i.jsx)(h.strong,{children:"M\xe1y chủ tĩnh"}),"\nC\xe0i đặt qua giao thức HTTP/HTTPS:"]}),"\n"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-ts",meta:'title="package.json"',children:'{\n    "dependencies": {\n        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"\n    }\n}\n'})}),"\n",(0,i.jsxs)(h.h2,{id:"đ\\xf3ng-g\\xf3i-phần-mềm",children:["Đ\xf3ng g\xf3i phần mềm",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#đ\\xf3ng-g\\xf3i-phần-mềm",children:"#"})]}),"\n",(0,i.jsxs)(h.h3,{id:"cấu-h\\xecnh-2",children:["Cấu h\xecnh",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#cấu-h\\xecnh-2",children:"#"})]}),"\n",(0,i.jsxs)(h.p,{children:["Cấu h\xecnh c\xe1c t\xf9y chọn build trong ",(0,i.jsx)(h.code,{children:"entry.node.ts"}),":"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"import type { GezOptions } from '@gez/core';\n\nexport default {\n    // Cấu h\xecnh xuất module\n    modules: {\n        exports: [\n            'root:src/components/button.vue',\n            'root:src/utils/format.ts',\n            'npm:vue'\n        ]\n    },\n    // Cấu h\xecnh build\n    pack: {\n        // K\xedch hoạt build\n        enable: true,\n\n        // Cấu h\xecnh đầu ra\n        outputs: [\n            'dist/client/versions/latest.tgz',\n            'dist/client/versions/1.0.0.tgz'\n        ],\n\n        // T\xf9y chỉnh package.json\n        packageJson: async (gez, pkg) => {\n            pkg.version = '1.0.0';\n            return pkg;\n        },\n\n        // Xử l\xfd trước khi build\n        onBefore: async (gez, pkg) => {\n            // Tạo khai b\xe1o kiểu\n            // Chạy test case\n            // Cập nhật t\xe0i liệu, v.v.\n        },\n\n        // Xử l\xfd sau khi build\n        onAfter: async (gez, pkg, file) => {\n            // Tải l\xean CDN\n            // Ph\xe1t h\xe0nh l\xean npm repository\n            // Triển khai l\xean m\xf4i trường test, v.v.\n        }\n    }\n} satisfies GezOptions;\n"})}),"\n",(0,i.jsxs)(h.h3,{id:"sản-phẩm-build",children:["Sản phẩm build",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#sản-phẩm-build",children:"#"})]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{children:"your-app-name.tgz\n├── package.json        # Th\xf4ng tin g\xf3i\n├── index.js            # Đầu v\xe0o m\xf4i trường sản xuất\n├── server/             # T\xe0i nguy\xean ph\xeda server\n│   └── manifest.json   # \xc1nh xạ t\xe0i nguy\xean ph\xeda server\n├── node/               # Thời gian chạy Node.js\n└── client/             # T\xe0i nguy\xean ph\xeda client\n    └── manifest.json   # \xc1nh xạ t\xe0i nguy\xean ph\xeda client\n"})}),"\n",(0,i.jsxs)(h.h3,{id:"quy-tr\\xecnh-ph\\xe1t-h\\xe0nh",children:["Quy tr\xecnh ph\xe1t h\xe0nh",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#quy-tr\\xecnh-ph\\xe1t-h\\xe0nh",children:"#"})]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{className:"language-bash",children:"# 1. Build phi\xean bản sản xuất\ngez build\n\n# 2. Ph\xe1t h\xe0nh l\xean npm\nnpm publish dist/versions/your-app-name.tgz\n"})}),"\n",(0,i.jsxs)(h.h2,{id:"thực-tiễn-tốt-nhất",children:["Thực tiễn tốt nhất",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#thực-tiễn-tốt-nhất",children:"#"})]}),"\n",(0,i.jsxs)(h.h3,{id:"cấu-h\\xecnh-m\\xf4i-trường-ph\\xe1t-triển",children:["Cấu h\xecnh m\xf4i trường ph\xe1t triển",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#cấu-h\\xecnh-m\\xf4i-trường-ph\\xe1t-triển",children:"#"})]}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Quản l\xfd phụ thuộc"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"Sử dụng c\xe1ch Workspace hoặc Link để c\xe0i đặt phụ thuộc"}),"\n",(0,i.jsx)(h.li,{children:"Quản l\xfd phi\xean bản phụ thuộc thống nhất"}),"\n",(0,i.jsx)(h.li,{children:"Tr\xe1nh c\xe0i đặt tr\xf9ng lặp c\xe1c phụ thuộc giống nhau"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Trải nghiệm ph\xe1t triển"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"K\xedch hoạt t\xednh năng cập nhật n\xf3ng"}),"\n",(0,i.jsx)(h.li,{children:"Cấu h\xecnh chiến lược tải trước ph\xf9 hợp"}),"\n",(0,i.jsx)(h.li,{children:"Tối ưu h\xf3a tốc độ build"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.h3,{id:"cấu-h\\xecnh-m\\xf4i-trường-sản-xuất",children:["Cấu h\xecnh m\xf4i trường sản xuất",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#cấu-h\\xecnh-m\\xf4i-trường-sản-xuất",children:"#"})]}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Chiến lược triển khai"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"Sử dụng NPM Registry hoặc m\xe1y chủ tĩnh"}),"\n",(0,i.jsx)(h.li,{children:"Đảm bảo t\xednh to\xe0n vẹn của sản phẩm build"}),"\n",(0,i.jsx)(h.li,{children:"\xc1p dụng cơ chế ph\xe1t h\xe0nh thử nghiệm"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Tối ưu h\xf3a hiệu suất"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"Cấu h\xecnh tải trước t\xe0i nguy\xean hợp l\xfd"}),"\n",(0,i.jsx)(h.li,{children:"Tối ưu h\xf3a thứ tự tải module"}),"\n",(0,i.jsx)(h.li,{children:"\xc1p dụng chiến lược bộ nhớ đệm hiệu quả"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.h3,{id:"quản-l\\xfd-phi\\xean-bản",children:["Quản l\xfd phi\xean bản",(0,i.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#quản-l\\xfd-phi\\xean-bản",children:"#"})]}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Quy tắc phi\xean bản"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"Tu\xe2n thủ quy tắc phi\xean bản ngữ nghĩa"}),"\n",(0,i.jsx)(h.li,{children:"Duy tr\xec nhật k\xfd cập nhật chi tiết"}),"\n",(0,i.jsx)(h.li,{children:"Kiểm tra t\xednh tương th\xedch phi\xean bản kỹ lưỡng"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(h.li,{children:["\n",(0,i.jsx)(h.p,{children:(0,i.jsx)(h.strong,{children:"Cập nhật phụ thuộc"})}),"\n",(0,i.jsxs)(h.ul,{children:["\n",(0,i.jsx)(h.li,{children:"Cập nhật c\xe1c g\xf3i phụ thuộc kịp thời"}),"\n",(0,i.jsx)(h.li,{children:"Kiểm tra bảo mật định kỳ"}),"\n",(0,i.jsx)(h.li,{children:"Duy tr\xec t\xednh nhất qu\xe1n phi\xean bản phụ thuộc"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(h.pre,{children:(0,i.jsx)(h.code,{children:"\n"})})]})}function r(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:h}=Object.assign({},(0,t.ah)(),n.components);return h?(0,i.jsx)(h,{...n,children:(0,i.jsx)(c,{...n})}):c(n)}let s=r;r.__RSPRESS_PAGE_META={},r.__RSPRESS_PAGE_META["vi%2Fguide%2Fessentials%2Fmodule-link.md"]={toc:[{text:"Kh\xe1i niệm cốt l\xf5i",id:"kh\xe1i-niệm-cốt-l\xf5i",depth:3},{text:"Xuất module",id:"xuất-module",depth:4},{text:"Nhập module",id:"nhập-module",depth:4},{text:"Cơ chế tải trước",id:"cơ-chế-tải-trước",depth:3},{text:"Xuất module",id:"xuất-module-1",depth:2},{text:"Cấu h\xecnh",id:"cấu-h\xecnh",depth:3},{text:"Nhập module",id:"nhập-module-1",depth:2},{text:"Cấu h\xecnh",id:"cấu-h\xecnh-1",depth:3},{text:"C\xe1ch c\xe0i đặt",id:"c\xe1ch-c\xe0i-đặt",depth:3},{text:"C\xe0i đặt m\xe3 nguồn",id:"c\xe0i-đặt-m\xe3-nguồn",depth:4},{text:"C\xe0i đặt g\xf3i phần mềm",id:"c\xe0i-đặt-g\xf3i-phần-mềm",depth:4},{text:"Đ\xf3ng g\xf3i phần mềm",id:"đ\xf3ng-g\xf3i-phần-mềm",depth:2},{text:"Cấu h\xecnh",id:"cấu-h\xecnh-2",depth:3},{text:"Sản phẩm build",id:"sản-phẩm-build",depth:3},{text:"Quy tr\xecnh ph\xe1t h\xe0nh",id:"quy-tr\xecnh-ph\xe1t-h\xe0nh",depth:3},{text:"Thực tiễn tốt nhất",id:"thực-tiễn-tốt-nhất",depth:2},{text:"Cấu h\xecnh m\xf4i trường ph\xe1t triển",id:"cấu-h\xecnh-m\xf4i-trường-ph\xe1t-triển",depth:3},{text:"Cấu h\xecnh m\xf4i trường sản xuất",id:"cấu-h\xecnh-m\xf4i-trường-sản-xuất",depth:3},{text:"Quản l\xfd phi\xean bản",id:"quản-l\xfd-phi\xean-bản",depth:3}],title:"Li\xean kết module",headingTitle:"Li\xean kết module",frontmatter:{titleSuffix:"Cơ chế chia sẻ m\xe3 giữa c\xe1c dịch vụ trong Gez Framework",description:"Giới thiệu chi tiết cơ chế li\xean kết module trong Gez Framework, bao gồm chia sẻ m\xe3 giữa c\xe1c dịch vụ, quản l\xfd phụ thuộc v\xe0 triển khai ti\xeau chuẩn ESM, gi\xfap nh\xe0 ph\xe1t triển x\xe2y dựng ứng dụng micro frontend hiệu quả.",head:[["meta",{property:"keywords",content:"Gez, Li\xean kết module, Module Link, ESM, Chia sẻ m\xe3, Quản l\xfd phụ thuộc, Micro frontend"}]]}}}}]);