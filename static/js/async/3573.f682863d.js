"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["3573"],{2270:function(n,h,i){i.r(h),i.d(h,{default:()=>a});var t=i(1549),c=i(6603);function r(n){let h=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",h3:"h3",ul:"ul",li:"li",strong:"strong",ol:"ol"},(0,c.ah)(),n.components);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(h.h1,{id:"từ-chia-sẻ-component-đến-module-h\\xf3a-nguy\\xean-bản-h\\xe0nh-tr\\xecnh-ph\\xe1t-triển-của-framework-micro-frontend-gez",children:["Từ chia sẻ component đến module h\xf3a nguy\xean bản: H\xe0nh tr\xecnh ph\xe1t triển của framework micro frontend Gez",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#từ-chia-sẻ-component-đến-module-h\\xf3a-nguy\\xean-bản-h\\xe0nh-tr\\xecnh-ph\\xe1t-triển-của-framework-micro-frontend-gez",children:"#"})]}),"\n",(0,t.jsxs)(h.h2,{id:"bối-cảnh-dự-\\xe1n",children:["Bối cảnh dự \xe1n",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#bối-cảnh-dự-\\xe1n",children:"#"})]}),"\n",(0,t.jsx)(h.p,{children:"Trong những năm qua, kiến tr\xfac micro frontend lu\xf4n t\xecm kiếm một con đường đ\xfang đắn. Tuy nhi\xean, ch\xfang ta thấy rằng c\xe1c giải ph\xe1p kỹ thuật phức tạp đ\xe3 sử dụng nhiều lớp bao bọc v\xe0 c\xe1ch ly thủ c\xf4ng để m\xf4 phỏng một thế giới micro frontend l\xfd tưởng. Những giải ph\xe1p n\xe0y mang lại g\xe1nh nặng hiệu suất lớn, khiến việc ph\xe1t triển đơn giản trở n\xean phức tạp v\xe0 l\xe0m cho quy tr\xecnh ti\xeau chuẩn trở n\xean kh\xf3 hiểu."}),"\n",(0,t.jsxs)(h.h3,{id:"hạn-chế-của-c\\xe1c-giải-ph\\xe1p-truyền-thống",children:["Hạn chế của c\xe1c giải ph\xe1p truyền thống",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#hạn-chế-của-c\\xe1c-giải-ph\\xe1p-truyền-thống",children:"#"})]}),"\n",(0,t.jsx)(h.p,{children:"Trong qu\xe1 tr\xecnh thực hiện kiến tr\xfac micro frontend, ch\xfang t\xf4i nhận thấy nhiều hạn chế của c\xe1c giải ph\xe1p truyền thống:"}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Tổn thất hiệu suất"}),": Ti\xeam phụ thuộc tại thời điểm chạy, proxy sandbox JS, mỗi thao t\xe1c đều ti\xeau tốn hiệu suất qu\xfd gi\xe1"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"C\xe1ch ly mong manh"}),": M\xf4i trường sandbox được tạo thủ c\xf4ng kh\xf4ng bao giờ đạt được khả năng c\xe1ch ly nguy\xean bản của tr\xecnh duyệt"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Độ phức tạp của qu\xe1 tr\xecnh x\xe2y dựng"}),": Để xử l\xfd c\xe1c mối quan hệ phụ thuộc, buộc phải sửa đổi c\xf4ng cụ x\xe2y dựng, khiến c\xe1c dự \xe1n đơn giản trở n\xean kh\xf3 bảo tr\xec"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Quy tắc t\xf9y chỉnh"}),": Chiến lược triển khai đặc biệt, xử l\xfd tại thời điểm chạy, khiến mỗi bước đều lệch khỏi quy tr\xecnh ph\xe1t triển hiện đại ti\xeau chuẩn"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Hạn chế hệ sinh th\xe1i"}),": Li\xean kết framework, API t\xf9y chỉnh, khiến việc lựa chọn c\xf4ng nghệ bị r\xe0ng buộc v\xe0o một hệ sinh th\xe1i cụ thể"]}),"\n"]}),"\n",(0,t.jsx)(h.p,{children:"Những vấn đề n\xe0y đặc biệt nổi bật trong một dự \xe1n cấp doanh nghiệp của ch\xfang t\xf4i v\xe0o năm 2019. Khi đ\xf3, một sản phẩm lớn được chia th\xe0nh hơn mười hệ thống con nghiệp vụ độc lập, c\xe1c hệ thống con n\xe0y cần chia sẻ một bộ component cơ sở v\xe0 component nghiệp vụ. Giải ph\xe1p chia sẻ component dựa tr\xean npm ban đầu đ\xe3 bộc lộ vấn đề nghi\xeam trọng về hiệu quả bảo tr\xec: khi component chia sẻ được cập nhật, tất cả c\xe1c hệ thống con phụ thuộc v\xe0o component đ\xf3 đều phải trải qua quy tr\xecnh x\xe2y dựng v\xe0 triển khai đầy đủ."}),"\n",(0,t.jsxs)(h.h2,{id:"tiến-h\\xf3a-c\\xf4ng-nghệ",children:["Tiến h\xf3a c\xf4ng nghệ",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#tiến-h\\xf3a-c\\xf4ng-nghệ",children:"#"})]}),"\n",(0,t.jsxs)(h.h3,{id:"v10-kh\\xe1m-ph\\xe1-component-từ-xa",children:["v1.0: Kh\xe1m ph\xe1 component từ xa",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#v10-kh\\xe1m-ph\\xe1-component-từ-xa",children:"#"})]}),"\n",(0,t.jsx)(h.p,{children:"Để giải quyết vấn đề hiệu quả chia sẻ component, Gez v1.0 đ\xe3 giới thiệu cơ chế RemoteView component dựa tr\xean giao thức HTTP. Giải ph\xe1p n\xe0y thực hiện lắp r\xe1p m\xe3 theo y\xeau cầu giữa c\xe1c dịch vụ th\xf4ng qua y\xeau cầu động tại thời điểm chạy, giải quyết th\xe0nh c\xf4ng vấn đề chuỗi phụ thuộc x\xe2y dựng qu\xe1 d\xe0i. Tuy nhi\xean, do thiếu cơ chế giao tiếp ti\xeau chuẩn tại thời điểm chạy, việc đồng bộ trạng th\xe1i v\xe0 truyền sự kiện giữa c\xe1c dịch vụ vẫn gặp phải vấn đề về hiệu suất."}),"\n",(0,t.jsxs)(h.h3,{id:"v20-thử-nghiệm-module-federation",children:["v2.0: Thử nghiệm Module Federation",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#v20-thử-nghiệm-module-federation",children:"#"})]}),"\n",(0,t.jsxs)(h.p,{children:["Trong phi\xean bản v2.0, ch\xfang t\xf4i đ\xe3 sử dụng c\xf4ng nghệ ",(0,t.jsx)(h.a,{href:"https://webpack.js.org/concepts/module-federation/",target:"_blank",rel:"noopener noreferrer",children:"Module Federation"})," của ",(0,t.jsx)(h.a,{href:"https://webpack.js.org/",target:"_blank",rel:"noopener noreferrer",children:"Webpack 5.0"}),". C\xf4ng nghệ n\xe0y th\xf4ng qua cơ chế tải module thống nhất v\xe0 container tại thời điểm chạy, đ\xe3 cải thiện đ\xe1ng kể hiệu quả phối hợp giữa c\xe1c dịch vụ. Tuy nhi\xean, trong thực tiễn quy m\xf4 lớn, cơ chế triển khai đ\xf3ng của Module Federation đ\xe3 mang lại th\xe1ch thức mới: kh\xf3 thực hiện quản l\xfd phi\xean bản phụ thuộc ch\xednh x\xe1c, đặc biệt khi thống nhất c\xe1c phụ thuộc chia sẻ của nhiều dịch vụ, thường gặp phải xung đột phi\xean bản v\xe0 ngoại lệ tại thời điểm chạy."]}),"\n",(0,t.jsxs)(h.h2,{id:"đ\\xf3n-nhận-kỷ-nguy\\xean-mới-của-esm",children:["Đ\xf3n nhận kỷ nguy\xean mới của ESM",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#đ\\xf3n-nhận-kỷ-nguy\\xean-mới-của-esm",children:"#"})]}),"\n",(0,t.jsx)(h.p,{children:"Khi l\xean kế hoạch cho phi\xean bản v3.0, ch\xfang t\xf4i đ\xe3 quan s\xe1t s\xe2u sắc xu hướng ph\xe1t triển của hệ sinh th\xe1i frontend v\xe0 nhận thấy rằng sự tiến bộ của khả năng nguy\xean bản tr\xecnh duyệt đ\xe3 mang lại khả năng mới cho kiến tr\xfac micro frontend:"}),"\n",(0,t.jsxs)(h.h3,{id:"hệ-thống-module-ti\\xeau-chuẩn",children:["Hệ thống module ti\xeau chuẩn",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#hệ-thống-module-ti\\xeau-chuẩn",children:"#"})]}),"\n",(0,t.jsxs)(h.p,{children:["Với sự hỗ trợ to\xe0n diện của c\xe1c tr\xecnh duyệt ch\xednh cho ",(0,t.jsx)(h.a,{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",target:"_blank",rel:"noopener noreferrer",children:"ES Modules"})," v\xe0 sự trưởng th\xe0nh của ti\xeau chuẩn ",(0,t.jsx)(h.a,{href:"https://github.com/WICG/import-maps",target:"_blank",rel:"noopener noreferrer",children:"Import Maps"}),", ph\xe1t triển frontend đ\xe3 bước v\xe0o kỷ nguy\xean module h\xf3a thực sự. Theo thống k\xea của ",(0,t.jsx)(h.a,{href:"https://caniuse.com/?search=importmap",target:"_blank",rel:"noopener noreferrer",children:"Can I Use"}),", hiện tại tỷ lệ hỗ trợ nguy\xean bản ESM của c\xe1c tr\xecnh duyệt ch\xednh (Chrome >= 89, Edge >= 89, Firefox >= 108, Safari >= 16.4) đ\xe3 đạt 93.5%, mang lại cho ch\xfang t\xf4i những lợi thế sau:"]}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Quản l\xfd phụ thuộc ti\xeau chuẩn"}),": Import Maps cung cấp khả năng ph\xe2n giải phụ thuộc module ở cấp tr\xecnh duyệt, kh\xf4ng cần ti\xeam phức tạp tại thời điểm chạy"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Tối ưu h\xf3a tải t\xe0i nguy\xean"}),": Cơ chế cache module nguy\xean bản của tr\xecnh duyệt cải thiện đ\xe1ng kể hiệu quả tải t\xe0i nguy\xean"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Đơn giản h\xf3a quy tr\xecnh x\xe2y dựng"}),": M\xf4 h\xecnh ph\xe1t triển dựa tr\xean ESM gi\xfap quy tr\xecnh x\xe2y dựng m\xf4i trường ph\xe1t triển v\xe0 sản xuất trở n\xean nhất qu\xe1n hơn"]}),"\n"]}),"\n",(0,t.jsx)(h.p,{children:"Đồng thời, th\xf4ng qua hỗ trợ chế độ tương th\xedch (Chrome >= 87, Edge >= 88, Firefox >= 78, Safari >= 14), ch\xfang t\xf4i c\xf3 thể n\xe2ng cao tỷ lệ phủ s\xf3ng tr\xecnh duyệt l\xean 96.81%, cho ph\xe9p ch\xfang t\xf4i duy tr\xec hiệu suất cao m\xe0 kh\xf4ng hy sinh hỗ trợ cho c\xe1c tr\xecnh duyệt cũ."}),"\n",(0,t.jsxs)(h.h3,{id:"đột-ph\\xe1-về-hiệu-suất-v\\xe0-c\\xe1ch-ly",children:["Đột ph\xe1 về hiệu suất v\xe0 c\xe1ch ly",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#đột-ph\\xe1-về-hiệu-suất-v\\xe0-c\\xe1ch-ly",children:"#"})]}),"\n",(0,t.jsx)(h.p,{children:"Hệ thống module nguy\xean bản mang lại kh\xf4ng chỉ sự ti\xeau chuẩn h\xf3a m\xe0 c\xf2n l\xe0 sự cải thiện đ\xe1ng kể về hiệu suất v\xe0 khả năng c\xe1ch ly:"}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Kh\xf4ng chi ph\xed tại thời điểm chạy"}),": Loại bỏ proxy sandbox JavaScript v\xe0 ti\xeam tại thời điểm chạy trong c\xe1c giải ph\xe1p micro frontend truyền thống"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Cơ chế c\xe1ch ly đ\xe1ng tin cậy"}),": Phạm vi module nghi\xeam ngặt của ESM cung cấp khả năng c\xe1ch ly đ\xe1ng tin cậy nhất"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Quản l\xfd phụ thuộc ch\xednh x\xe1c"}),": Ph\xe2n t\xedch nhập tĩnh gi\xfap mối quan hệ phụ thuộc r\xf5 r\xe0ng hơn, kiểm so\xe1t phi\xean bản ch\xednh x\xe1c hơn"]}),"\n"]}),"\n",(0,t.jsxs)(h.h3,{id:"lựa-chọn-c\\xf4ng-cụ-x\\xe2y-dựng",children:["Lựa chọn c\xf4ng cụ x\xe2y dựng",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#lựa-chọn-c\\xf4ng-cụ-x\\xe2y-dựng",children:"#"})]}),"\n",(0,t.jsx)(h.p,{children:"Trong qu\xe1 tr\xecnh triển khai giải ph\xe1p kỹ thuật, việc lựa chọn c\xf4ng cụ x\xe2y dựng l\xe0 một quyết định quan trọng. Sau gần một năm nghi\xean cứu v\xe0 thực tiễn kỹ thuật, lựa chọn của ch\xfang t\xf4i đ\xe3 trải qua c\xe1c giai đoạn ph\xe1t triển sau:"}),"\n",(0,t.jsxs)(h.ol,{children:["\n",(0,t.jsxs)(h.li,{children:["\n",(0,t.jsx)(h.p,{children:(0,t.jsx)(h.strong,{children:"Kh\xe1m ph\xe1 Vite"})}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsx)(h.li,{children:"Ưu điểm: M\xe1y chủ ph\xe1t triển dựa tr\xean ESM, mang lại trải nghiệm ph\xe1t triển tối ưu"}),"\n",(0,t.jsx)(h.li,{children:"Th\xe1ch thức: Sự kh\xe1c biệt giữa m\xf4i trường ph\xe1t triển v\xe0 x\xe2y dựng sản xuất mang lại một số bất ổn"}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(h.li,{children:["\n",(0,t.jsx)(h.p,{children:(0,t.jsxs)(h.strong,{children:["X\xe1c lập ",(0,t.jsx)(h.a,{href:"https://www.rspack.dev/",target:"_blank",rel:"noopener noreferrer",children:"Rspack"})]})}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsxs)(h.li,{children:["Ưu điểm hiệu suất: Bi\xean dịch hiệu suất cao dựa tr\xean ",(0,t.jsx)(h.a,{href:"https://www.rust-lang.org/",target:"_blank",rel:"noopener noreferrer",children:"Rust"}),", cải thiện đ\xe1ng kể tốc độ x\xe2y dựng"]}),"\n",(0,t.jsx)(h.li,{children:"Hỗ trợ hệ sinh th\xe1i: Tương th\xedch cao với hệ sinh th\xe1i Webpack, giảm chi ph\xed di chuyển"}),"\n",(0,t.jsx)(h.li,{children:"Hỗ trợ ESM: Th\xf4ng qua thực tiễn dự \xe1n Rslib, x\xe1c nhận độ tin cậy trong x\xe2y dựng ESM"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(h.p,{children:"Quyết định n\xe0y gi\xfap ch\xfang t\xf4i duy tr\xec trải nghiệm ph\xe1t triển đồng thời đạt được hỗ trợ m\xf4i trường sản xuất ổn định hơn. Dựa tr\xean sự kết hợp ESM v\xe0 Rspack, ch\xfang t\xf4i cuối c\xf9ng đ\xe3 x\xe2y dựng một giải ph\xe1p micro frontend hiệu suất cao, \xedt x\xe2m nhập."}),"\n",(0,t.jsxs)(h.h2,{id:"triển-vọng-tương-lai",children:["Triển vọng tương lai",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#triển-vọng-tương-lai",children:"#"})]}),"\n",(0,t.jsx)(h.p,{children:"Trong kế hoạch ph\xe1t triển tương lai, framework Gez sẽ tập trung v\xe0o ba hướng ch\xednh:"}),"\n",(0,t.jsxs)(h.h3,{id:"tối-ưu-h\\xf3a-s\\xe2u-import-maps",children:["Tối ưu h\xf3a s\xe2u Import Maps",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#tối-ưu-h\\xf3a-s\\xe2u-import-maps",children:"#"})]}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Quản l\xfd phụ thuộc động"}),": Thực hiện điều phối phi\xean bản phụ thuộc th\xf4ng minh tại thời điểm chạy, giải quyết xung đột phụ thuộc giữa nhiều ứng dụng"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Chiến lược tải trước"}),": Tải trước th\xf4ng minh dựa tr\xean ph\xe2n t\xedch tuyến đường, cải thiện hiệu quả tải t\xe0i nguy\xean"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Tối ưu h\xf3a x\xe2y dựng"}),": Tự động tạo cấu h\xecnh Import Maps tối ưu, giảm chi ph\xed cấu h\xecnh thủ c\xf4ng của nh\xe0 ph\xe1t triển"]}),"\n"]}),"\n",(0,t.jsxs)(h.h3,{id:"giải-ph\\xe1p-định-tuyến-độc-lập-framework",children:["Giải ph\xe1p định tuyến độc lập framework",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#giải-ph\\xe1p-định-tuyến-độc-lập-framework",children:"#"})]}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Trừu tượng h\xf3a định tuyến thống nhất"}),": Thiết kế giao diện định tuyến độc lập framework, hỗ trợ c\xe1c framework ch\xednh như Vue, React"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Định tuyến micro app"}),": Thực hiện li\xean kết định tuyến giữa c\xe1c ứng dụng, duy tr\xec sự nhất qu\xe1n giữa URL v\xe0 trạng th\xe1i ứng dụng"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Middleware định tuyến"}),": Cung cấp cơ chế middleware mở rộng, hỗ trợ kiểm so\xe1t quyền, chuyển trang, v.v."]}),"\n"]}),"\n",(0,t.jsxs)(h.h3,{id:"thực-tiễn-tốt-nhất-về-giao-tiếp-đa-framework",children:["Thực tiễn tốt nhất về giao tiếp đa framework",(0,t.jsx)(h.a,{className:"header-anchor","aria-hidden":"true",href:"#thực-tiễn-tốt-nhất-về-giao-tiếp-đa-framework",children:"#"})]}),"\n",(0,t.jsxs)(h.ul,{children:["\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Ứng dụng mẫu"}),": Cung cấp v\xed dụ đầy đủ về giao tiếp đa framework, bao gồm c\xe1c framework ch\xednh như Vue, React, Preact"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Đồng bộ trạng th\xe1i"}),": Giải ph\xe1p chia sẻ trạng th\xe1i nhẹ dựa tr\xean ESM"]}),"\n",(0,t.jsxs)(h.li,{children:[(0,t.jsx)(h.strong,{children:"Bus sự kiện"}),": Cơ chế giao tiếp sự kiện ti\xeau chuẩn, hỗ trợ giao tiếp t\xe1ch rời giữa c\xe1c ứng dụng"]}),"\n"]}),"\n",(0,t.jsx)(h.p,{children:"Th\xf4ng qua c\xe1c tối ưu h\xf3a v\xe0 mở rộng n\xe0y, ch\xfang t\xf4i mong muốn biến Gez th\xe0nh một giải ph\xe1p micro frontend ho\xe0n thiện hơn, dễ sử dụng hơn, mang lại trải nghiệm ph\xe1t triển tốt hơn v\xe0 hiệu quả ph\xe1t triển cao hơn cho c\xe1c nh\xe0 ph\xe1t triển."})]})}function e(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:h}=Object.assign({},(0,c.ah)(),n.components);return h?(0,t.jsx)(h,{...n,children:(0,t.jsx)(r,{...n})}):r(n)}let a=e;e.__RSPRESS_PAGE_META={},e.__RSPRESS_PAGE_META["vi%2Fblog%2Fbirth-of-gez.md"]={toc:[{text:"Bối cảnh dự \xe1n",id:"bối-cảnh-dự-\xe1n",depth:2},{text:"Hạn chế của c\xe1c giải ph\xe1p truyền thống",id:"hạn-chế-của-c\xe1c-giải-ph\xe1p-truyền-thống",depth:3},{text:"Tiến h\xf3a c\xf4ng nghệ",id:"tiến-h\xf3a-c\xf4ng-nghệ",depth:2},{text:"v1.0: Kh\xe1m ph\xe1 component từ xa",id:"v10-kh\xe1m-ph\xe1-component-từ-xa",depth:3},{text:"v2.0: Thử nghiệm Module Federation",id:"v20-thử-nghiệm-module-federation",depth:3},{text:"Đ\xf3n nhận kỷ nguy\xean mới của ESM",id:"đ\xf3n-nhận-kỷ-nguy\xean-mới-của-esm",depth:2},{text:"Hệ thống module ti\xeau chuẩn",id:"hệ-thống-module-ti\xeau-chuẩn",depth:3},{text:"Đột ph\xe1 về hiệu suất v\xe0 c\xe1ch ly",id:"đột-ph\xe1-về-hiệu-suất-v\xe0-c\xe1ch-ly",depth:3},{text:"Lựa chọn c\xf4ng cụ x\xe2y dựng",id:"lựa-chọn-c\xf4ng-cụ-x\xe2y-dựng",depth:3},{text:"Triển vọng tương lai",id:"triển-vọng-tương-lai",depth:2},{text:"Tối ưu h\xf3a s\xe2u Import Maps",id:"tối-ưu-h\xf3a-s\xe2u-import-maps",depth:3},{text:"Giải ph\xe1p định tuyến độc lập framework",id:"giải-ph\xe1p-định-tuyến-độc-lập-framework",depth:3},{text:"Thực tiễn tốt nhất về giao tiếp đa framework",id:"thực-tiễn-tốt-nhất-về-giao-tiếp-đa-framework",depth:3}],title:"Từ chia sẻ component đến module h\xf3a nguy\xean bản: H\xe0nh tr\xecnh ph\xe1t triển của framework micro frontend Gez",headingTitle:"Từ chia sẻ component đến module h\xf3a nguy\xean bản: H\xe0nh tr\xecnh ph\xe1t triển của framework micro frontend Gez",frontmatter:{titleSuffix:"Từ kh\xf3 khăn của micro frontend đến đổi mới ESM: H\xe0nh tr\xecnh ph\xe1t triển của framework Gez",description:"Kh\xe1m ph\xe1 s\xe2u về h\xe0nh tr\xecnh ph\xe1t triển của framework Gez từ những kh\xf3 khăn của kiến tr\xfac micro frontend truyền thống đến đột ph\xe1 đổi mới dựa tr\xean ESM, chia sẻ kinh nghiệm thực tiễn về tối ưu hiệu suất, quản l\xfd phụ thuộc v\xe0 lựa chọn c\xf4ng cụ x\xe2y dựng.",head:[["meta",{property:"keywords",content:"Gez, framework micro frontend, ESM, Import Maps, Rspack, Module Federation, quản l\xfd phụ thuộc, tối ưu hiệu suất, tiến h\xf3a c\xf4ng nghệ, server-side rendering"}]],sidebar:!1}}}}]);