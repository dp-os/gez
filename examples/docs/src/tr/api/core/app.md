---
titleSuffix: Gez Çerçevesi Uygulama Soyutlama Arayüzü
description: Gez çerçevesinin App arayüzünü detaylı olarak açıklar, uygulama yaşam döngüsü yönetimi, statik kaynak işleme ve sunucu tarafı renderlama özelliklerini içerir, geliştiricilerin uygulama çekirdek işlevlerini anlamasına ve kullanmasına yardımcı olur.
head:
  - - meta
    - property: keywords
      content: Gez, App, Uygulama Soyutlama, Yaşam Döngüsü, Statik Kaynaklar, Sunucu Tarafı Renderlama, API
---

# App

`App`, Gez çerçevesinin uygulama soyutlamasıdır ve uygulamanın yaşam döngüsünü, statik kaynakları ve sunucu tarafı renderlamayı yönetmek için birleşik bir arayüz sağlar.

```ts title="entry.node.ts"
export default {
  // Geliştirme ortamı yapılandırması
  async devApp(gez) {
    return import('@gez/rspack').then((m) =>
      m.createRspackHtmlApp(gez, {
        config(rc) {
          // Özel Rspack yapılandırması
        }
      })
    );
  }
}
```

## Tür Tanımları
### App

```ts
interface App {
  middleware: Middleware;
  render: (options?: RenderContextOptions) => Promise<RenderContext>;
  build?: () => Promise<boolean>;
  destroy?: () => Promise<boolean>;
}
```

#### middleware

- **Tür**: `Middleware`

Statik kaynak işleme middleware'i.

Geliştirme ortamı:
- Kaynak kodun statik kaynak isteklerini işler
- Gerçek zamanlı derleme ve sıcak yenileme desteği
- no-cache önbellek stratejisi kullanır

Üretim ortamı:
- Derlenmiş statik kaynakları işler
- Değişmez dosyalar için uzun süreli önbellek desteği (.final.xxx)
- Optimize edilmiş kaynak yükleme stratejisi

```ts
server.use(gez.middleware);
```

#### render

- **Tür**: `(options?: RenderContextOptions) => Promise<RenderContext>`

Sunucu tarafı renderlama fonksiyonu. Çalışma ortamına göre farklı uygulamalar sağlar:
- Üretim ortamı (start): Derlenmiş sunucu giriş dosyasını (entry.server) yükleyerek renderlama yapar
- Geliştirme ortamı (dev): Kaynak kodundaki sunucu giriş dosyasını yükleyerek renderlama yapar

```ts
const rc = await gez.render({
  params: { url: '/page' }
});
res.end(rc.html);
```

#### build

- **Tür**: `() => Promise<boolean>`

Üretim ortamı derleme fonksiyonu. Kaynak paketleme ve optimizasyon için kullanılır. Derleme başarılı olursa true, başarısız olursa false döner.

#### destroy

- **Tür**: `() => Promise<boolean>`

Kaynak temizleme fonksiyonu. Sunucuyu kapatma, bağlantıları kesme vb. için kullanılır. Temizleme başarılı olursa true, başarısız olursa false döner.