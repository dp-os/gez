"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["3419"],{352:function(e,n,r){r.r(n),r.d(n,{default:()=>d});var i=r(1549),a=r(6603);function l(e){let n=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",strong:"strong",h2:"h2",h3:"h3",pre:"pre",code:"code",h4:"h4"},(0,a.ah)(),e.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.h1,{id:"rendercontext",children:["RenderContext",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rendercontext",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"RenderContext, Gez \xe7er\xe7evesinin temel sınıfıdır ve sunucu tarafı render (SSR) işleminin t\xfcm yaşam d\xf6ng\xfcs\xfcn\xfc y\xf6netir. Render context, kaynak y\xf6netimi, durum senkronizasyonu gibi kritik g\xf6revleri ger\xe7ekleştirmek i\xe7in kapsamlı bir API sağlar:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Render Kontrol\xfc"}),": Sunucu tarafı render s\xfcrecini y\xf6netir, \xe7oklu giriş renderı, koşullu render gibi senaryoları destekler"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Kaynak Y\xf6netimi"}),": JS, CSS gibi statik kaynakları akıllıca toplar ve enjekte eder, y\xfckleme performansını optimize eder"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Durum Senkronizasyonu"}),": Sunucu tarafı durum serileştirmesini işler, istemci tarafında doğru aktivasyonu (hydration) sağlar"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Rota Kontrol\xfc"}),": Sunucu tarafı y\xf6nlendirme, durum kodu ayarlama gibi gelişmiş işlevleri destekler"]}),"\n"]}),"\n",(0,i.jsxs)(n.h2,{id:"t\\xfcr-tanımları",children:["T\xfcr Tanımları",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#t\\xfcr-tanımları",children:"#"})]}),"\n",(0,i.jsxs)(n.h3,{id:"serverrenderhandle",children:["ServerRenderHandle",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#serverrenderhandle",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Sunucu tarafı render işlemi fonksiyonunun t\xfcr tanımı."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"type ServerRenderHandle = (rc: RenderContext) => Promise<void> | void;\n"})}),"\n",(0,i.jsx)(n.p,{children:"Sunucu tarafı render işlemi fonksiyonu, RenderContext \xf6rneğini parametre olarak alan asenkron veya senkron bir fonksiyondur ve sunucu tarafı render mantığını işler."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// 1. Asenkron işlem fonksiyonu\nexport default async (rc: RenderContext) => {\n  const app = createApp();\n  const html = await renderToString(app);\n  rc.html = html;\n};\n\n// 2. Senkron işlem fonksiyonu\nexport const simple = (rc: RenderContext) => {\n  rc.html = '<h1>Merhaba D\xfcnya</h1>';\n};\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"renderfiles",children:["RenderFiles",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#renderfiles",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Render s\xfcrecinde toplanan kaynak dosyalarının listesi i\xe7in t\xfcr tanımı."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"interface RenderFiles {\n  js: string[];\n  css: string[];\n  modulepreload: string[];\n  resources: string[];\n}\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"js"}),": JavaScript dosyaları listesi"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"css"}),": Stil dosyaları listesi"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"modulepreload"}),": \xd6nceden y\xfcklenmesi gereken ESM mod\xfclleri listesi"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"resources"}),": Diğer kaynak dosyaları listesi (resimler, yazı tipleri vb.)"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// Kaynak dosya listesi \xf6rneği\nrc.files = {\n  js: [\n    '/assets/entry-client.js',\n    '/assets/vendor.js'\n  ],\n  css: [\n    '/assets/main.css',\n    '/assets/vendor.css'\n  ],\n  modulepreload: [\n    '/assets/Home.js',\n    '/assets/About.js'\n  ],\n  resources: [\n    '/assets/logo.png',\n    '/assets/font.woff2'\n  ]\n};\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"importmapmode",children:["ImportmapMode",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmapmode",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Importmap oluşturma modunu tanımlar."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"type ImportmapMode = 'inline' | 'js';\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"inline"}),": Importmap i\xe7eriğini doğrudan HTML'e g\xf6m\xfcl\xfc olarak ekler, aşağıdaki senaryolar i\xe7in uygundur:","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"HTTP istek sayısını azaltmak gerektiğinde"}),"\n",(0,i.jsx)(n.li,{children:"Importmap i\xe7eriği k\xfc\xe7\xfck olduğunda"}),"\n",(0,i.jsx)(n.li,{children:"İlk ekran y\xfckleme performansı y\xfcksek \xf6ncelikli olduğunda"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"js"}),": Importmap i\xe7eriğini bağımsız bir JS dosyası olarak oluşturur, aşağıdaki senaryolar i\xe7in uygundur:","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Importmap i\xe7eriği b\xfcy\xfck olduğunda"}),"\n",(0,i.jsx)(n.li,{children:"Tarayıcı \xf6nbellek mekanizmasından yararlanmak gerektiğinde"}),"\n",(0,i.jsx)(n.li,{children:"Birden fazla sayfa aynı importmap'i paylaştığında"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Render context sınıfı, sunucu tarafı render (SSR) s\xfcrecinde kaynak y\xf6netimi ve HTML oluşturma işlemlerinden sorumludur."}),"\n",(0,i.jsxs)(n.h2,{id:"\\xf6rnek-se\\xe7enekleri",children:["\xd6rnek Se\xe7enekleri",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\\xf6rnek-se\\xe7enekleri",children:"#"})]}),"\n",(0,i.jsx)(n.p,{children:"Render context'in yapılandırma se\xe7eneklerini tanımlar."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"interface RenderContextOptions {\n  base?: string\n  entryName?: string\n  params?: Record<string, any>\n  importmapMode?: ImportmapMode\n}\n"})}),"\n",(0,i.jsxs)(n.h4,{id:"base",children:["base",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#base",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"''"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Statik kaynakların temel yolu."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"T\xfcm statik kaynaklar (JS, CSS, resimler vb.) bu yol \xfczerinden y\xfcklenecektir"}),"\n",(0,i.jsx)(n.li,{children:"\xc7alışma zamanında dinamik olarak yapılandırılabilir, yeniden derlemeye gerek yoktur"}),"\n",(0,i.jsx)(n.li,{children:"\xc7ok dilli siteler, mikro \xf6n u\xe7 uygulamaları gibi senaryolarda sıklıkla kullanılır"}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"entryname",children:["entryName",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryname",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"'default'"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Sunucu tarafı render giriş fonksiyonu adı. Bir mod\xfcl birden fazla render fonksiyonu dışa aktardığında kullanılacak giriş fonksiyonunu belirtmek i\xe7in kullanılır."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"export const mobile = async (rc: RenderContext) => {\n  // Mobil cihazlar i\xe7in render mantığı\n};\n\nexport const desktop = async (rc: RenderContext) => {\n  // Masa\xfcst\xfc cihazlar i\xe7in render mantığı\n};\n"})}),"\n",(0,i.jsxs)(n.h4,{id:"params",children:["params",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#params",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"Record<string, any>"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"{}"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Render parametreleri. Render fonksiyonuna herhangi bir t\xfcrde parametre ge\xe7irmek i\xe7in kullanılır, genellikle istek bilgilerini (URL, sorgu parametreleri vb.) iletmek i\xe7in kullanılır."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"const rc = await gez.render({\n  params: {\n    url: req.url,\n    lang: 'tr-TR',\n    theme: 'koyu'\n  }\n});\n"})}),"\n",(0,i.jsxs)(n.h4,{id:"importmapmode-1",children:["importmapMode",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmapmode-1",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"'inline' | 'js'"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"'inline'"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Import map oluşturma modu:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"inline"}),": Importmap i\xe7eriğini doğrudan HTML'e g\xf6m\xfcl\xfc olarak ekler"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"js"}),": Importmap i\xe7eriğini bağımsız bir JS dosyası olarak oluşturur"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.h2,{id:"\\xf6rnek-\\xf6zellikleri",children:["\xd6rnek \xd6zellikleri",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\\xf6rnek-\\xf6zellikleri",children:"#"})]}),"\n",(0,i.jsxs)(n.h3,{id:"gez",children:["gez",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#gez",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"Gez"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Salt Okunur"}),": ",(0,i.jsx)(n.code,{children:"true"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Gez \xf6rneği referansı. \xc7er\xe7evenin temel işlevlerine ve yapılandırma bilgilerine erişmek i\xe7in kullanılır."}),"\n",(0,i.jsxs)(n.h3,{id:"redirect",children:["redirect",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#redirect",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"string | null"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"null"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Y\xf6nlendirme adresi. Ayarlandığında, sunucu bu değere g\xf6re HTTP y\xf6nlendirmesi yapabilir, genellikle giriş doğrulama, izin kontrol\xfc gibi senaryolarda kullanılır."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// Giriş doğrulama \xf6rneği\nexport default async (rc: RenderContext) => {\n  if (!isLoggedIn()) {\n    rc.redirect = '/giris';\n    rc.status = 302;\n    return;\n  }\n  // Sayfayı render etmeye devam et...\n};\n\n// İzin kontrol\xfc \xf6rneği\nexport default async (rc: RenderContext) => {\n  if (!hasPermission()) {\n    rc.redirect = '/403';\n    rc.status = 403;\n    return;\n  }\n  // Sayfayı render etmeye devam et...\n};\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"status",children:["status",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#status",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"number | null"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"null"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"HTTP yanıt durum kodu. Herhangi bir ge\xe7erli HTTP durum kodu ayarlanabilir, genellikle hata işleme, y\xf6nlendirme gibi senaryolarda kullanılır."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// 404 hata işleme \xf6rneği\nexport default async (rc: RenderContext) => {\n  const page = await findPage(rc.params.url);\n  if (!page) {\n    rc.status = 404;\n    // 404 sayfasını render et...\n    return;\n  }\n  // Sayfayı render etmeye devam et...\n};\n\n// Ge\xe7ici y\xf6nlendirme \xf6rneği\nexport default async (rc: RenderContext) => {\n  if (needMaintenance()) {\n    rc.redirect = '/bakim';\n    rc.status = 307; // Ge\xe7ici y\xf6nlendirme, istek y\xf6ntemini korur\n    return;\n  }\n  // Sayfayı render etmeye devam et...\n};\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"html",children:["html",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#html",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"''"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"HTML i\xe7eriği. Oluşturulan nihai HTML i\xe7eriğini ayarlamak ve almak i\xe7in kullanılır, ayarlama sırasında temel yol yer tutucuları otomatik olarak işlenir."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// Temel kullanım\nexport default async (rc: RenderContext) => {\n  // HTML i\xe7eriğini ayarla\n  rc.html = `\n    <!DOCTYPE html>\n    <html>\n      <head>\n        ${rc.preload()}\n        ${rc.css()}\n      </head>\n      <body>\n        <div id=\"app\">Merhaba D\xfcnya</div>\n        ${rc.importmap()}\n        ${rc.moduleEntry()}\n        ${rc.modulePreload()}\n      </body>\n    </html>\n  `;\n};\n\n// Dinamik temel yol\nconst rc = await gez.render({\n  base: '/uygulama',  // Temel yolu ayarla\n  params: { url: req.url }\n});\n\n// HTML'deki yer tutucular otomatik olarak değiştirilir:\n// [[[___GEZ_DYNAMIC_BASE___]]]/uygulama-adi/css/stil.css\n// şu şekilde değiştirilir:\n// /uygulama/uygulama-adi/css/stil.css\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"base-1",children:["base",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#base-1",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Salt Okunur"}),": ",(0,i.jsx)(n.code,{children:"true"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"''"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Statik kaynakların temel yolu. T\xfcm statik kaynaklar (JS, CSS, resimler vb.) bu yol \xfczerinden y\xfcklenecektir, \xe7alışma zamanında dinamik olarak yapılandırılabilir."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// Temel kullanım\nconst rc = await gez.render({\n  base: '/gez',  // Temel yolu ayarla\n  params: { url: req.url }\n});\n\n// \xc7ok dilli site \xf6rneği\nconst rc = await gez.render({\n  base: '/tr',  // T\xfcrk\xe7e site\n  params: { lang: 'tr-TR' }\n});\n\n// Mikro \xf6n u\xe7 uygulama \xf6rneği\nconst rc = await gez.render({\n  base: '/uygulama1',  // Alt uygulama 1\n  params: { appId: 1 }\n});\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"entryname-1",children:["entryName",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryname-1",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Salt Okunur"}),": ",(0,i.jsx)(n.code,{children:"true"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"'default'"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Sunucu tarafı render giriş fonksiyonu adı. entry.server.ts dosyasından kullanılacak render fonksiyonunu se\xe7mek i\xe7in kullanılır."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// Varsayılan giriş fonksiyonu\nexport default async (rc: RenderContext) => {\n  // Varsayılan render mantığı\n};\n\n// Birden fazla giriş fonksiyonu\nexport const mobile = async (rc: RenderContext) => {\n  // Mobil cihazlar i\xe7in render mantığı\n};\n\nexport const desktop = async (rc: RenderContext) => {\n  // Masa\xfcst\xfc cihazlar i\xe7in render mantığı\n};\n\n// Cihaz t\xfcr\xfcne g\xf6re giriş fonksiyonu se\xe7imi\nconst rc = await gez.render({\n  entryName: isMobile ? 'mobile' : 'desktop',\n  params: { url: req.url }\n});\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"params-1",children:["params",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#params-1",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"Record<string, any>"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Salt Okunur"}),": ",(0,i.jsx)(n.code,{children:"true"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"{}"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Render parametreleri. Sunucu tarafı render s\xfcrecinde parametreleri iletmek ve erişmek i\xe7in kullanılır, genellikle istek bilgileri, sayfa yapılandırması gibi bilgileri iletmek i\xe7in kullanılır."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// Temel kullanım - URL ve dil ayarlarını iletme\nconst rc = await gez.render({\n  params: {\n    url: req.url,\n    lang: 'tr-TR'\n  }\n});\n\n// Sayfa yapılandırması - Tema ve d\xfczen ayarlama\nconst rc = await gez.render({\n  params: {\n    theme: 'koyu',\n    layout: 'yan-menu'\n  }\n});\n\n// Ortam yapılandırması - API adresini enjekte etme\nconst rc = await gez.render({\n  params: {\n    apiBaseUrl: process.env.API_BASE_URL,\n    version: '1.0.0'\n  }\n});\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"importmetaset",children:["importMetaSet",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmetaset",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"Set<ImportMeta>"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Mod\xfcl bağımlılık toplama k\xfcmesi. Bileşen render s\xfcrecinde otomatik olarak mod\xfcl bağımlılıklarını izler ve kaydeder, yalnızca mevcut sayfa render edilirken ger\xe7ekten kullanılan kaynakları toplar."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// Temel kullanım\nconst renderToString = (app: any, context: { importMetaSet: Set<ImportMeta> }) => {\n  // Render s\xfcrecinde mod\xfcl bağımlılıklarını otomatik olarak toplar\n  // \xc7er\xe7eve, bileşen render edilirken otomatik olarak context.importMetaSet.add(import.meta) \xe7ağırır\n  // Geliştiricilerin bağımlılık toplama işlemini manuel olarak yapması gerekmez\n  return '<div id=\"app\">Merhaba D\xfcnya</div>';\n};\n\n// Kullanım \xf6rneği\nconst app = createApp();\nconst html = await renderToString(app, {\n  importMetaSet: rc.importMetaSet\n});\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"files",children:["files",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#files",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"RenderFiles"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Kaynak dosya listesi:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"js: JavaScript dosyaları listesi"}),"\n",(0,i.jsx)(n.li,{children:"css: Stil dosyaları listesi"}),"\n",(0,i.jsx)(n.li,{children:"modulepreload: \xd6nceden y\xfcklenmesi gereken ESM mod\xfclleri listesi"}),"\n",(0,i.jsx)(n.li,{children:"resources: Diğer kaynak dosyaları listesi (resimler, yazı tipleri vb.)"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// Kaynak toplama\nawait rc.commit();\n\n// Kaynak enjeksiyonu\nrc.html = `\n  <!DOCTYPE html>\n  <html>\n  <head>\n    \x3c!-- Kaynakları \xf6nceden y\xfckle --\x3e\n    ${rc.preload()}\n    \x3c!-- Stil dosyalarını enjekte et --\x3e\n    ${rc.css()}\n  </head>\n  <body>\n    ${html}\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n  </body>\n  </html>\n`;\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"importmapmode-2",children:["importmapMode",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmapmode-2",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"T\xfcr"}),": ",(0,i.jsx)(n.code,{children:"'inline' | 'js'"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Varsayılan"}),": ",(0,i.jsx)(n.code,{children:"'inline'"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Import map oluşturma modu:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"inline"}),": Importmap i\xe7eriğini doğrudan HTML'e g\xf6m\xfcl\xfc olarak ekler"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"js"}),": Importmap i\xe7eriğini bağımsız bir JS dosyası olarak oluşturur"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.h2,{id:"\\xf6rnek-metodları",children:["\xd6rnek Metodları",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\\xf6rnek-metodları",children:"#"})]}),"\n",(0,i.jsxs)(n.h3,{id:"serialize",children:["serialize()",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#serialize",children:"#"})]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Parametreler"}),":","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"input: any"})," - Serileştirilecek veri"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"options?: serialize.SerializeJSOptions"})," - Serileştirme se\xe7enekleri"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"D\xf6n\xfcş Değeri"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"JavaScript nesnesini string'e serileştirir. Sunucu tarafı render s\xfcrec"})]})}function s(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,a.ah)(),e.components);return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}let d=s;s.__RSPRESS_PAGE_META={},s.__RSPRESS_PAGE_META["tr%2Fapi%2Fcore%2Frender-context.md"]={toc:[{text:"T\xfcr Tanımları",id:"t\xfcr-tanımları",depth:2},{text:"ServerRenderHandle",id:"serverrenderhandle",depth:3},{text:"RenderFiles",id:"renderfiles",depth:3},{text:"ImportmapMode",id:"importmapmode",depth:3},{text:"\xd6rnek Se\xe7enekleri",id:"\xf6rnek-se\xe7enekleri",depth:2},{text:"base",id:"base",depth:4},{text:"entryName",id:"entryname",depth:4},{text:"params",id:"params",depth:4},{text:"importmapMode",id:"importmapmode-1",depth:4},{text:"\xd6rnek \xd6zellikleri",id:"\xf6rnek-\xf6zellikleri",depth:2},{text:"gez",id:"gez",depth:3},{text:"redirect",id:"redirect",depth:3},{text:"status",id:"status",depth:3},{text:"html",id:"html",depth:3},{text:"base",id:"base-1",depth:3},{text:"entryName",id:"entryname-1",depth:3},{text:"params",id:"params-1",depth:3},{text:"importMetaSet",id:"importmetaset",depth:3},{text:"files",id:"files",depth:3},{text:"importmapMode",id:"importmapmode-2",depth:3},{text:"\xd6rnek Metodları",id:"\xf6rnek-metodları",depth:2},{text:"serialize()",id:"serialize",depth:3}],title:"RenderContext",headingTitle:"RenderContext",frontmatter:{titleSuffix:"Gez \xc7er\xe7evesi RenderContext API Referansı",description:"Gez \xe7er\xe7evesinin RenderContext temel sınıfını detaylı olarak a\xe7ıklar, sunucu tarafı render (SSR) i\xe7in render kontrol\xfc, kaynak y\xf6netimi, durum senkronizasyonu ve rota kontrol\xfc gibi işlevleri kapsar, geliştiricilere verimli sunucu tarafı render uygulamaları oluşturmalarında yardımcı olur.",head:[["meta",{property:"keywords",content:"Gez, RenderContext, SSR, sunucu tarafı render, render context, durum senkronizasyonu, kaynak y\xf6netimi, Web uygulama \xe7er\xe7evesi"}]]}}}}]);