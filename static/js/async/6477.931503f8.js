"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["6477"],{5733:function(e,n,a){a.r(n),a.d(n,{default:()=>d});var r=a(1549),l=a(6603);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",ol:"ol",li:"li",strong:"strong",ul:"ul",h2:"h2",code:"code",pre:"pre",h3:"h3",h4:"h4"},(0,l.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"render-bağlamı",children:["Render Bağlamı",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#render-bağlamı",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"RenderContext, Gez \xe7er\xe7evesindeki temel bir sınıftır ve sunucu tarafı render (SSR) s\xfcrecinde kaynak y\xf6netimi ve HTML oluşturma işlemlerinden sorumludur. Aşağıdaki temel \xf6zelliklere sahiptir:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"ESM Tabanlı Mod\xfcl Sistemi"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Modern ECMAScript Modules (ESM) standardını kullanır"}),"\n",(0,r.jsx)(n.li,{children:"Yerel mod\xfcl i\xe7e ve dışa aktarma işlemlerini destekler"}),"\n",(0,r.jsx)(n.li,{children:"Daha iyi kod b\xf6lme ve isteğe bağlı y\xfckleme sağlar"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Akıllı Bağımlılık Toplama"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Ger\xe7ek render yoluna dayalı olarak dinamik bağımlılık toplar"}),"\n",(0,r.jsx)(n.li,{children:"Gereksiz kaynak y\xfcklemelerinden ka\xe7ınır"}),"\n",(0,r.jsx)(n.li,{children:"Asenkron bileşenleri ve dinamik i\xe7e aktarmaları destekler"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Hassas Kaynak Enjeksiyonu"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Kaynak y\xfckleme sırasını sıkı bir şekilde kontrol eder"}),"\n",(0,r.jsx)(n.li,{children:"İlk ekran y\xfckleme performansını optimize eder"}),"\n",(0,r.jsx)(n.li,{children:"İstemci tarafında aktivasyonun (Hydration) g\xfcvenilirliğini sağlar"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Esnek Yapılandırma Mekanizması"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Dinamik temel yol yapılandırmasını destekler"}),"\n",(0,r.jsx)(n.li,{children:"Birden fazla i\xe7e aktarma haritalama modu sunar"}),"\n",(0,r.jsx)(n.li,{children:"Farklı dağıtım senaryolarına uyum sağlar"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.h2,{id:"kullanım-şekli",children:["Kullanım Şekli",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#kullanım-şekli",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["Gez \xe7er\xe7evesinde, geliştiriciler genellikle doğrudan RenderContext \xf6rneği oluşturmaz, bunun yerine ",(0,r.jsx)(n.code,{children:"gez.render()"})," y\xf6ntemi ile \xf6rnek alır:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"async server(gez) {\n    const server = http.createServer((req, res) => {\n        // Statik dosya işleme\n        gez.middleware(req, res, async () => {\n            // gez.render() ile RenderContext \xf6rneği alınır\n            const rc = await gez.render({\n                params: {\n                    url: req.url\n                }\n            });\n            // HTML i\xe7eriği yanıt olarak g\xf6nderilir\n            res.end(rc.html);\n        });\n    });\n}\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"temel-i̇şlevler",children:["Temel İşlevler",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#temel-i̇şlevler",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"bağımlılık-toplama",children:["Bağımlılık Toplama",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#bağımlılık-toplama",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"RenderContext, ger\xe7ek render edilen bileşenlere dayalı olarak dinamik bağımlılık toplayan akıllı bir mekanizma sunar:"}),"\n",(0,r.jsxs)(n.h4,{id:"i̇steğe-bağlı-toplama",children:["İsteğe Bağlı Toplama",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#i̇steğe-bağlı-toplama",children:"#"})]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Bileşenlerin ger\xe7ek render s\xfcrecinde mod\xfcl bağımlılıklarını otomatik olarak izler ve kaydeder"}),"\n",(0,r.jsx)(n.li,{children:"Yalnızca mevcut sayfa render edilirken kullanılan CSS, JavaScript gibi kaynakları toplar"}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"importMetaSet"})," ile her bileşenin mod\xfcl bağımlılıklarını hassas bir şekilde kaydeder"]}),"\n",(0,r.jsx)(n.li,{children:"Asenkron bileşenleri ve dinamik i\xe7e aktarmaları destekler"}),"\n"]}),"\n",(0,r.jsxs)(n.h4,{id:"otomatik-i̇şleme",children:["Otomatik İşleme",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#otomatik-i̇şleme",children:"#"})]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Geliştiriciler bağımlılık toplama s\xfcrecini manuel olarak y\xf6netmek zorunda değildir"}),"\n",(0,r.jsx)(n.li,{children:"\xc7er\xe7eve, bileşen render edilirken bağımlılık bilgilerini otomatik olarak toplar"}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"commit()"})," y\xf6ntemi ile toplanan t\xfcm kaynakları birleştirir"]}),"\n",(0,r.jsx)(n.li,{children:"D\xf6ng\xfcsel bağımlılıkları ve tekrarlanan bağımlılıkları otomatik olarak işler"}),"\n"]}),"\n",(0,r.jsxs)(n.h4,{id:"performans-optimizasyonu",children:["Performans Optimizasyonu",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#performans-optimizasyonu",children:"#"})]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Kullanılmayan mod\xfcllerin y\xfcklenmesini \xf6nleyerek ilk ekran y\xfckleme s\xfcresini \xf6nemli \xf6l\xe7\xfcde azaltır"}),"\n",(0,r.jsx)(n.li,{children:"Kaynak y\xfckleme sırasını hassas bir şekilde kontrol ederek sayfa render performansını optimize eder"}),"\n",(0,r.jsx)(n.li,{children:"En uygun i\xe7e aktarma haritasını (Import Map) otomatik olarak oluşturur"}),"\n",(0,r.jsx)(n.li,{children:"Kaynak \xf6n y\xfckleme ve isteğe bağlı y\xfckleme stratejilerini destekler"}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"kaynak-enjeksiyonu",children:["Kaynak Enjeksiyonu",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#kaynak-enjeksiyonu",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"RenderContext, farklı t\xfcrdeki kaynakları enjekte etmek i\xe7in birden fazla y\xf6ntem sunar ve her y\xf6ntem kaynak y\xfckleme performansını optimize etmek i\xe7in \xf6zenle tasarlanmıştır:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"preload()"}),": CSS ve JS kaynaklarını \xf6n y\xfckler, \xf6ncelik yapılandırmasını destekler"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"css()"}),": İlk ekran stil sayfalarını enjekte eder, kritik CSS \xe7ıkarma işlemini destekler"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"importmap()"}),": Mod\xfcl i\xe7e aktarma haritasını enjekte eder, dinamik yol \xe7\xf6z\xfcmlemesini destekler"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"moduleEntry()"}),": İstemci tarafı giriş mod\xfcl\xfcn\xfc enjekte eder, \xe7oklu giriş yapılandırmasını destekler"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"modulePreload()"}),": Mod\xfcl bağımlılıklarını \xf6n y\xfckler, isteğe bağlı y\xfckleme stratejisini destekler"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"kaynak-enjeksiyon-sırası",children:["Kaynak Enjeksiyon Sırası",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#kaynak-enjeksiyon-sırası",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"RenderContext, kaynak enjeksiyon sırasını sıkı bir şekilde kontrol eder ve bu sıralama tarayıcı \xe7alışma prensipleri ve performans optimizasyonu d\xfcş\xfcn\xfclerek tasarlanmıştır:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"head kısmı:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"preload()"}),": CSS ve JS kaynaklarını \xf6n y\xfckler, tarayıcının bu kaynakları erken keşfetmesini ve y\xfcklemeye başlamasını sağlar"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"css()"}),": İlk ekran stil sayfalarını enjekte eder, sayfa i\xe7eriği render edilirken stil sayfalarının hazır olmasını sağlar"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"body kısmı:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"importmap()"}),": Mod\xfcl i\xe7e aktarma haritasını enjekte eder, ESM mod\xfcllerinin yol \xe7\xf6z\xfcmleme kurallarını tanımlar"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"moduleEntry()"}),": İstemci tarafı giriş mod\xfcl\xfcn\xfc enjekte eder, importmap'ten sonra \xe7alıştırılmalıdır"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"modulePreload()"}),": Mod\xfcl bağımlılıklarını \xf6n y\xfckler, importmap'ten sonra \xe7alıştırılmalıdır"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.h2,{id:"tam-render-s\\xfcreci",children:["Tam Render S\xfcreci",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#tam-render-s\\xfcreci",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"Tipik bir RenderContext kullanım s\xfcreci aşağıdaki gibidir:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"export default async (rc: RenderContext) => {\n    // 1. Sayfa i\xe7eriğini render et ve bağımlılıkları topla\n    const app = createApp();\n    const html = await renderToString(app, {\n       importMetaSet: rc.importMetaSet\n    });\n\n    // 2. Bağımlılık toplamayı tamamla\n    await rc.commit();\n    \n    // 3. Tam HTML oluştur\n    rc.html = `\n        <!DOCTYPE html>\n        <html>\n        <head>\n            ${rc.preload()}\n            ${rc.css()}\n        </head>\n        <body>\n            ${html}\n            ${rc.importmap()}\n            ${rc.moduleEntry()}\n            ${rc.modulePreload()}\n        </body>\n        </html>\n    `;\n};\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"gelişmiş-\\xf6zellikler",children:["Gelişmiş \xd6zellikler",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#gelişmiş-\\xf6zellikler",children:"#"})]}),"\n",(0,r.jsxs)(n.h3,{id:"temel-yol-yapılandırması",children:["Temel Yol Yapılandırması",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#temel-yol-yapılandırması",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"RenderContext, \xe7alışma zamanında statik kaynakların temel yolunu dinamik olarak ayarlamak i\xe7in esnek bir mekanizma sunar:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"const rc = await gez.render({\n    base: '/gez',  // Temel yolu ayarla\n    params: {\n        url: req.url\n    }\n});\n"})}),"\n",(0,r.jsx)(n.p,{children:"Bu mekanizma \xf6zellikle aşağıdaki senaryolar i\xe7in uygundur:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\xc7ok Dilli Site Dağıtımı"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"ana-alanadi.com      → Varsayılan dil\nana-alanadi.com/cn/  → \xc7ince site\nana-alanadi.com/en/  → İngilizce site\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Mikro Frontend Uygulamaları"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Alt uygulamaların farklı yollarda esnek bir şekilde dağıtılmasını destekler"}),"\n",(0,r.jsx)(n.li,{children:"Farklı ana uygulamalara entegre edilmesini kolaylaştırır"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.h3,{id:"i̇\\xe7e-aktarma-haritası-modları",children:["İ\xe7e Aktarma Haritası Modları",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#i̇\\xe7e-aktarma-haritası-modları",children:"#"})]}),"\n",(0,r.jsx)(n.p,{children:"RenderContext, iki t\xfcr i\xe7e aktarma haritası (Import Map) modu sunar:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Inline Modu"})," (Varsayılan)"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"İ\xe7e aktarma haritasını doğrudan HTML i\xe7ine yerleştirir"}),"\n",(0,r.jsx)(n.li,{children:"K\xfc\xe7\xfck uygulamalar i\xe7in uygundur, ek ağ isteklerini azaltır"}),"\n",(0,r.jsx)(n.li,{children:"Sayfa y\xfcklendiğinde hemen kullanılabilir"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"JS Modu"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Haritayı harici bir JavaScript dosyası ile y\xfckler"}),"\n",(0,r.jsx)(n.li,{children:"B\xfcy\xfck uygulamalar i\xe7in uygundur, tarayıcı \xf6nbellek mekanizmasından yararlanır"}),"\n",(0,r.jsx)(n.li,{children:"Harita i\xe7eriğinin dinamik olarak g\xfcncellenmesini destekler"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"Uygun modu se\xe7mek i\xe7in yapılandırma yapılabilir:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"const rc = await gez.render({\n    importmapMode: 'js',  // 'inline' | 'js'\n    params: {\n        url: req.url\n    }\n});\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"giriş-fonksiyonu-yapılandırması",children:["Giriş Fonksiyonu Yapılandırması",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#giriş-fonksiyonu-yapılandırması",children:"#"})]}),"\n",(0,r.jsxs)(n.p,{children:["RenderContext, ",(0,r.jsx)(n.code,{children:"entryName"})," yapılandırması ile sunucu tarafı render i\xe7in kullanılacak giriş fonksiyonunu belirlemeyi destekler:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.node.ts"',children:"const rc = await gez.render({\n    entryName: 'mobile',  // Mobil giriş fonksiyonunu kullan\n    params: {\n        url: req.url\n    }\n});\n"})}),"\n",(0,r.jsx)(n.p,{children:"Bu mekanizma \xf6zellikle aşağıdaki senaryolar i\xe7in uygundur:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\xc7oklu Şablon Render"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"// Mobil giriş fonksiyonu\nexport const mobile = async (rc: RenderContext) => {\n    // Mobil i\xe7in \xf6zel render mantığı\n};\n\n// Masa\xfcst\xfc giriş fonksiyonu\nexport const desktop = async (rc: RenderContext) => {\n    // Masa\xfcst\xfc i\xe7in \xf6zel render mantığı\n};\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"A/B Testi"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Aynı sayfa i\xe7in farklı render mantıkları kullanmayı destekler"}),"\n",(0,r.jsx)(n.li,{children:"Kullanıcı deneyimi deneyleri yapmayı kolaylaştırır"}),"\n",(0,r.jsx)(n.li,{children:"Farklı render stratejileri arasında esnek ge\xe7iş sağlar"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\xd6zel Render İhtiya\xe7ları"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Bazı sayfalar i\xe7in \xf6zel render s\xfcre\xe7leri kullanmayı destekler"}),"\n",(0,r.jsx)(n.li,{children:"Farklı senaryolara uygun performans optimizasyonları sağlar"}),"\n",(0,r.jsx)(n.li,{children:"Daha hassas render kontrol\xfc sağlar"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.h2,{id:"en-i̇yi-uygulamalar",children:["En İyi Uygulamalar",(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#en-i̇yi-uygulamalar",children:"#"})]}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"RenderContext \xd6rneği Alma"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Her zaman ",(0,r.jsx)(n.code,{children:"gez.render()"})," y\xf6ntemi ile \xf6rnek alın"]}),"\n",(0,r.jsx)(n.li,{children:"Gerektiğinde uygun parametreleri ge\xe7irin"}),"\n",(0,r.jsx)(n.li,{children:"Manuel \xf6rnek oluşturmaktan ka\xe7ının"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Bağımlılık Toplama"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["T\xfcm mod\xfcllerin ",(0,r.jsx)(n.code,{children:"importMetaSet.add(import.meta)"})," \xe7ağrısını doğru şekilde yaptığından emin olun"]}),"\n",(0,r.jsxs)(n.li,{children:["Render tamamlandıktan hemen sonra ",(0,r.jsx)(n.code,{children:"commit()"})," y\xf6ntemini \xe7ağırın"]}),"\n",(0,r.jsx)(n.li,{children:"İlk ekran y\xfcklemesini optimize etmek i\xe7in asenkron bileşenleri ve dinamik i\xe7e aktarmaları akıllıca kullanın"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Kaynak Enjeksiyonu"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Kaynak enjeksiyon sırasını sıkı bir şekilde takip edin"}),"\n",(0,r.jsx)(n.li,{children:"body i\xe7inde CSS enjekte etmeyin"}),"\n",(0,r.jsx)(n.li,{children:"importmap'in moduleEntry'den \xf6nce enjekte edildiğinden emin olun"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Performans Optimizasyonu"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Kritik kaynakları \xf6n y\xfcklemek i\xe7in preload kullanın"}),"\n",(0,r.jsx)(n.li,{children:"Mod\xfcl y\xfcklemesini optimize etmek i\xe7in modulePreload'u akıllıca kullanın"}),"\n",(0,r.jsx)(n.li,{children:"Gereksiz kaynak y\xfcklemelerinden ka\xe7ının"}),"\n",(0,r.jsx)(n.li,{children:"Tarayıcı \xf6nbellek mekanizmasından yararlanarak y\xfckleme performansını optimize edin"}),"\n"]}),"\n"]}),"\n"]})]})}function s(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,l.ah)(),e.components);return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(i,{...e})}):i(e)}let d=s;s.__RSPRESS_PAGE_META={},s.__RSPRESS_PAGE_META["tr%2Fguide%2Fessentials%2Frender-context.md"]={toc:[{text:"Kullanım Şekli",id:"kullanım-şekli",depth:2},{text:"Temel İşlevler",id:"temel-i̇şlevler",depth:2},{text:"Bağımlılık Toplama",id:"bağımlılık-toplama",depth:3},{text:"İsteğe Bağlı Toplama",id:"i̇steğe-bağlı-toplama",depth:4},{text:"Otomatik İşleme",id:"otomatik-i̇şleme",depth:4},{text:"Performans Optimizasyonu",id:"performans-optimizasyonu",depth:4},{text:"Kaynak Enjeksiyonu",id:"kaynak-enjeksiyonu",depth:3},{text:"Kaynak Enjeksiyon Sırası",id:"kaynak-enjeksiyon-sırası",depth:3},{text:"Tam Render S\xfcreci",id:"tam-render-s\xfcreci",depth:2},{text:"Gelişmiş \xd6zellikler",id:"gelişmiş-\xf6zellikler",depth:2},{text:"Temel Yol Yapılandırması",id:"temel-yol-yapılandırması",depth:3},{text:"İ\xe7e Aktarma Haritası Modları",id:"i̇\xe7e-aktarma-haritası-modları",depth:3},{text:"Giriş Fonksiyonu Yapılandırması",id:"giriş-fonksiyonu-yapılandırması",depth:3},{text:"En İyi Uygulamalar",id:"en-i̇yi-uygulamalar",depth:2}],title:"Render Bağlamı",headingTitle:"Render Bağlamı",frontmatter:{titleSuffix:"Gez \xc7er\xe7evesi Sunucu Taraflı Render Mekanizması",description:"Gez \xe7er\xe7evesinin RenderContext (Render Bağlamı) mekanizmasını detaylı olarak a\xe7ıklar, kaynak y\xf6netimi, HTML oluşturma ve ESM mod\xfcl sistemi dahil olmak \xfczere geliştiricilerin sunucu tarafı render (SSR) \xf6zelliğini anlamasına ve kullanmasına yardımcı olur.",head:[["meta",{property:"keywords",content:"Gez, Render Bağlamı, RenderContext, SSR, Sunucu Taraflı Render, ESM, Kaynak Y\xf6netimi"}]]}}}}]);