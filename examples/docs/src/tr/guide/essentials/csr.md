---
titleSuffix: Gez Çerçevesi İstemci Tarafı Renderlama Kılavuzu
description: Gez çerçevesinin istemci tarafı renderlama mekanizmasını detaylı olarak açıklar, statik yapılandırma, dağıtım stratejileri ve en iyi uygulamaları içerir. Bu kılavuz, geliştiricilerin sunucu olmayan ortamlarda etkili ön yüz renderlaması gerçekleştirmesine yardımcı olur.
head:
  - - meta
    - property: keywords
      content: Gez, İstemci Tarafı Renderlama, CSR, Statik Yapılandırma, Ön Yüz Renderlama, Sunucusuz Dağıtım, Performans Optimizasyonu
---

# İstemci Tarafı Renderlama

İstemci tarafı renderlama (Client-Side Rendering, CSR), tarayıcı tarafında sayfa renderlama işlemini gerçekleştiren bir teknik yaklaşımdır. Gez'de, uygulamanızı bir Node.js sunucu örneği olarak dağıtamadığınız durumlarda, yapılandırma aşamasında statik bir `index.html` dosyası oluşturarak saf istemci tarafı renderlama gerçekleştirebilirsiniz.

## Kullanım Senaryoları

Aşağıdaki senaryolarda istemci tarafı renderlama kullanılması önerilir:

- **Statik Barındırma Ortamları**: GitHub Pages, CDN gibi sunucu tarafı renderlamayı desteklemeyen barındırma hizmetleri
- **Basit Uygulamalar**: İlk ekran yükleme hızı ve SEO gereksinimlerinin yüksek olmadığı küçük ölçekli uygulamalar
- **Geliştirme Ortamı**: Geliştirme aşamasında uygulamayı hızlı bir şekilde önizleme ve hata ayıklama

## Yapılandırma Açıklamaları

### HTML Şablonu Yapılandırması

İstemci tarafı renderlama modunda, genel bir HTML şablonu yapılandırmanız gerekmektedir. Bu şablon, uygulamanın kapsayıcısı olarak görev yapacak ve gerekli kaynak referanslarını ve bağlantı noktalarını içerecektir.

```ts title="src/entry.server.ts"
import type { RenderContext } from '@gez/core';

export default async (rc: RenderContext) => {
    // Bağımlılık toplamayı tamamla
    await rc.commit();
    
    // HTML şablonunu yapılandır
    rc.html = `
<!DOCTYPE html>
<html>
<head>
    ${rc.preload()}           // Ön yükleme kaynakları
    <title>Gez</title>
    ${rc.css()}               // Stil enjeksiyonu
</head>
<body>
    <div id="app"></div>
    ${rc.importmap()}         // İçe aktarma haritası
    ${rc.moduleEntry()}       // Giriş modülü
    ${rc.modulePreload()}     // Modül ön yükleme
</body>
</html>
`;
};
```

### Statik HTML Oluşturma

Üretim ortamında istemci tarafı renderlama kullanmak için, yapılandırma aşamasında statik bir HTML dosyası oluşturmanız gerekmektedir. Gez, bu işlevi gerçekleştirmek için `postBuild` kanca fonksiyonunu sağlar:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    async postBuild(gez) {
        // Statik HTML dosyası oluştur
        const rc = await gez.render();
        // HTML dosyasını yaz
        gez.writeSync(
            gez.resolvePath('dist/client', 'index.html'),
            rc.html
        );
    }
} satisfies GezOptions;
```