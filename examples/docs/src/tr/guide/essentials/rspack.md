---
titleSuffix: Gez Çerçevesi Yüksek Performanslı Derleme Motoru
description: Gez çerçevesinin Rspack derleme sistemini derinlemesine inceleyin, yüksek performanslı derleme, çoklu ortam derleme, kaynak optimizasyonu gibi temel özelliklerle modern Web uygulamaları oluşturmanıza yardımcı olur.
head:
  - - meta
    - property: keywords
      content: Gez, Rspack, derleme sistemi, yüksek performanslı derleme, sıcak güncelleme, çoklu ortam derleme, Tree Shaking, kod bölme, SSR, kaynak optimizasyonu, geliştirme verimliliği, derleme araçları
---

# Rspack

Gez, [Rspack](https://rspack.dev/) derleme sistemi üzerine inşa edilmiştir ve Rspack'in yüksek performanslı derleme yeteneklerinden tam olarak yararlanır. Bu belge, Rspack'in Gez çerçevesindeki konumunu ve temel işlevlerini açıklamaktadır.

## Özellikler

Rspack, Gez çerçevesinin temel derleme sistemidir ve aşağıdaki temel özellikleri sunar:

- **Yüksek Performanslı Derleme**: Rust ile uygulanan derleme motoru, büyük projelerde derleme hızını önemli ölçüde artıran son derece hızlı derleme performansı sağlar.
- **Geliştirme Deneyimi Optimizasyonu**: Sıcak güncelleme (HMR), artımlı derleme gibi modern geliştirme özelliklerini destekler ve akıcı bir geliştirme deneyimi sunar.
- **Çoklu Ortam Derleme**: İstemci (client), sunucu (server) ve Node.js (node) ortamlarını destekleyen birleşik derleme yapılandırması, çoklu platform geliştirme sürecini basitleştirir.
- **Kaynak Optimizasyonu**: Kod bölme, Tree Shaking, kaynak sıkıştırma gibi özellikleri destekleyen yerleşik kaynak işleme ve optimizasyon yetenekleri.

## Uygulama Derleme

Gez'in Rspack derleme sistemi modüler bir tasarıma sahiptir ve aşağıdaki temel modülleri içerir:

### @gez/rspack

Temel derleme modülü, aşağıdaki temel yetenekleri sağlar:

- **Birleşik Derleme Yapılandırması**: Standartlaştırılmış derleme yapılandırma yönetimi sunar ve çoklu ortam yapılandırmasını destekler.
- **Kaynak İşleme**: TypeScript, CSS, resimler gibi kaynaklar için yerleşik işleme yetenekleri.
- **Derleme Optimizasyonu**: Kod bölme, Tree Shaking gibi performans optimizasyon özellikleri.
- **Geliştirme Sunucusu**: Yüksek performanslı bir geliştirme sunucusu entegre eder ve HMR'yi destekler.

### @gez/rspack-vue

Vue çerçevesi için özel derleme modülü, aşağıdakileri sağlar:

- **Vue Bileşen Derleme**: Vue 2/3 bileşenlerinin verimli derlenmesini destekler.
- **SSR Optimizasyonu**: Sunucu tarafı render etme senaryoları için özel optimizasyonlar.
- **Geliştirme Geliştirmeleri**: Vue geliştirme ortamı için özel işlevsel geliştirmeler.

## Derleme Süreci

Gez'in derleme süreci temel olarak aşağıdaki aşamalara ayrılır:

1. **Yapılandırma Başlatma**
   - Proje yapılandırmasını yükleme
   - Varsayılan yapılandırma ve kullanıcı yapılandırmasını birleştirme
   - Ortam değişkenlerine göre yapılandırmayı ayarlama

2. **Kaynak Derleme**
   - Kaynak kod bağımlılıklarını çözme
   - Çeşitli kaynakları (TypeScript, CSS vb.) dönüştürme
   - Modül içe/dışa aktarma işlemlerini gerçekleştirme

3. **Optimizasyon İşlemi**
   - Kod bölme uygulama
   - Tree Shaking uygulama
   - Kod ve kaynakları sıkıştırma

4. **Çıktı Oluşturma**
   - Hedef dosyaları oluşturma
   - Kaynak haritalarını çıktı olarak verme
   - Derleme raporu oluşturma

## En İyi Uygulamalar

### Geliştirme Ortamı Optimizasyonu

- **Artımlı Derleme Yapılandırması**: `cache` seçeneğini uygun şekilde yapılandırarak önbelleği kullanın ve derleme hızını artırın.
- **HMR Optimizasyonu**: Sıcak güncelleme kapsamını hedefleyerek yapılandırın ve gereksiz modül güncellemelerinden kaçının.
- **Kaynak İşleme Optimizasyonu**: Uygun loader yapılandırması kullanarak tekrarlayan işlemlerden kaçının.

### Üretim Ortamı Optimizasyonu

- **Kod Bölme Stratejisi**: `splitChunks`'u uygun şekilde yapılandırarak kaynak yüklemesini optimize edin.
- **Kaynak Sıkıştırma**: Uygun sıkıştırma yapılandırmasını etkinleştirerek derleme süresi ve çıktı boyutu arasında denge kurun.
- **Önbellek Optimizasyonu**: İçerik hash'i ve uzun süreli önbellek stratejilerini kullanarak yükleme performansını artırın.

## Yapılandırma Örneği

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                // Özel derleme yapılandırması
                config({ config }) {
                    // Buraya özel Rspack yapılandırması ekleyin
                }
            })
        );
    },
} satisfies GezOptions;
```

::: ipucu
Daha ayrıntılı API açıklamaları ve yapılandırma seçenekleri için [Rspack API Belgesi](/api/app/rspack.html) sayfasına bakın.
:::