---
titleSuffix: Gez Çerçevesi Hizmetler Arası Kod Paylaşım Mekanizması
description: Gez çerçevesinin modül bağlantı mekanizmasını detaylı olarak açıklar, hizmetler arası kod paylaşımı, bağımlılık yönetimi ve ESM spesifikasyonu uygulamasını içerir, geliştiricilere verimli mikro ön uç uygulamaları oluşturmalarına yardımcı olur.
head:
  - - meta
    - property: keywords
      content: Gez, Modül Bağlantısı, Module Link, ESM, Kod Paylaşımı, Bağımlılık Yönetimi, Mikro Ön Uç
---

# Modül Bağlantısı

Gez çerçevesi, hizmetler arası kod paylaşımını ve bağımlılık ilişkilerini yönetmek için kapsamlı bir modül bağlantı mekanizması sunar. Bu mekanizma ESM (ECMAScript Module) spesifikasyonu temelinde uygulanmıştır ve kaynak kodu seviyesinde modül dışa aktarma ve içe aktarma ile tam bağımlılık yönetimi işlevlerini destekler.

### Temel Kavramlar

#### Modül Dışa Aktarma
Modül dışa aktarma, bir hizmetteki belirli kod birimlerini (bileşenler, yardımcı fonksiyonlar vb.) ESM formatında dışarıya açma sürecidir. İki tür dışa aktarma desteklenir:
- **Kaynak Kodu Dışa Aktarma**: Projedeki kaynak kod dosyalarını doğrudan dışa aktarır
- **Bağımlılık Dışa Aktarma**: Projede kullanılan üçüncü taraf bağımlılık paketlerini dışa aktarır

#### Modül İçe Aktarma
Modül içe aktarma, bir hizmette diğer hizmetler tarafından dışa aktarılan kod birimlerini referans alma sürecidir. Birden fazla kurulum yöntemi desteklenir:
- **Kaynak Kodu Kurulumu**: Geliştirme ortamı için uygundur, gerçek zamanlı değişiklik ve sıcak güncelleme desteği sağlar
- **Paket Kurulumu**: Üretim ortamı için uygundur, doğrudan derleme çıktılarını kullanır

### Ön Yükleme Mekanizması

Hizmet performansını optimize etmek için Gez akıllı bir modül ön yükleme mekanizması uygular:

1. **Bağımlılık Analizi**
   - Derleme sırasında bileşenler arasındaki bağımlılık ilişkilerini analiz eder
   - Kritik yoldaki temel modülleri tanımlar
   - Modüllerin yükleme önceliğini belirler

2. **Yükleme Stratejisi**
   - **Anında Yükleme**: Kritik yoldaki temel modüller
   - **Gecikmeli Yükleme**: Kritik olmayan işlev modülleri
   - **İhtiyaç Halinde Yükleme**: Koşullu olarak render edilen modüller

3. **Kaynak Optimizasyonu**
   - Akıllı kod bölme stratejisi
   - Modül seviyesinde önbellek yönetimi
   - İhtiyaç halinde derleme ve paketleme

## Modül Dışa Aktarma

### Yapılandırma Açıklaması

`entry.node.ts` dosyasında dışa aktarılacak modülleri yapılandırın:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // Kaynak kod dosyalarını dışa aktar
            'root:src/components/button.vue',  // Vue bileşeni
            'root:src/utils/format.ts',        // Yardımcı fonksiyon
            // Üçüncü taraf bağımlılıkları dışa aktar
            'npm:vue',                         // Vue çerçevesi
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

Dışa aktarma yapılandırması iki türü destekler:
- `root:*`: Kaynak kod dosyalarını dışa aktarır, yol proje kök dizinine göredir
- `npm:*`: Üçüncü taraf bağımlılıkları dışa aktarır, doğrudan paket adı belirtilir

## Modül İçe Aktarma

### Yapılandırma Açıklaması

`entry.node.ts` dosyasında içe aktarılacak modülleri yapılandırın:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // İçe aktarma yapılandırması
        imports: {
            // Kaynak kod kurulumu: Derleme çıktısı dizinine işaret eder
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // Paket kurulumu: Paket dizinine işaret eder
            'other-remote': 'root:./node_modules/other-remote'
        },
        // Harici bağımlılık yapılandırması
        externals: {
            // Uzak modüllerdeki bağımlılıkları kullan
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

Yapılandırma seçenekleri:
1. **imports**: Uzak modüllerin yerel yolunu yapılandırır
   - Kaynak kod kurulumu: Derleme çıktısı dizinine (dist) işaret eder
   - Paket kurulumu: Doğrudan paket dizinine işaret eder

2. **externals**: Harici bağımlılıkları yapılandırır
   - Uzak modüllerdeki bağımlılıkları paylaşmak için kullanılır
   - Aynı bağımlılıkların tekrar paketlenmesini önler
   - Birden fazla modülün bağımlılıkları paylaşmasını destekler

### Kurulum Yöntemleri

#### Kaynak Kod Kurulumu
Geliştirme ortamı için uygundur, gerçek zamanlı değişiklik ve sıcak güncelleme desteği sağlar.

1. **Workspace Yöntemi**
Monorepo projelerinde kullanım için önerilir:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Link Yöntemi**
Yerel geliştirme ve hata ayıklama için kullanılır:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### Paket Kurulumu
Üretim ortamı için uygundur, doğrudan derleme çıktılarını kullanır.

1. **NPM Registry**
npm registry üzerinden kurulum:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **Statik Sunucu**
HTTP/HTTPS protokolü üzerinden kurulum:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## Paket Derleme

### Yapılandırma Açıklaması

`entry.node.ts` dosyasında derleme seçeneklerini yapılandırın:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // Modül dışa aktarma yapılandırması
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // Derleme yapılandırması
    pack: {
        // Derlemeyi etkinleştir
        enable: true,

        // Çıktı yapılandırması
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // Özelleştirilmiş package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // Derleme öncesi işlemler
        onBefore: async (gez, pkg) => {
            // Tür bildirimleri oluştur
            // Test senaryolarını çalıştır
            // Dokümantasyonu güncelle vb.
        },

        // Derleme sonrası işlemler
        onAfter: async (gez, pkg, file) => {
            // CDN'e yükle
            // npm deposuna yayınla
            // Test ortamına dağıt vb.
        }
    }
} satisfies GezOptions;
```

### Derleme Çıktıları

```
your-app-name.tgz
├── package.json        # Paket bilgisi
├── index.js            # Üretim ortamı girişi
├── server/             # Sunucu tarafı kaynaklar
│   └── manifest.json   # Sunucu tarafı kaynak eşlemesi
├── node/               # Node.js çalışma zamanı
└── client/             # İstemci tarafı kaynaklar
    └── manifest.json   # İstemci tarafı kaynak eşlemesi
```

### Yayınlama Süreci

```bash
# 1. Üretim sürümünü derle
gez build

# 2. npm'e yayınla
npm publish dist/versions/your-app-name.tgz
```

## En İyi Uygulamalar

### Geliştirme Ortamı Yapılandırması
- **Bağımlılık Yönetimi**
  - Workspace veya Link yöntemiyle bağımlılıkları kur
  - Bağımlılık sürümlerini tek merkezden yönet
  - Aynı bağımlılıkların tekrar kurulmasını önle

- **Geliştirme Deneyimi**
  - Sıcak güncelleme özelliğini etkinleştir
  - Uygun ön yükleme stratejisini yapılandır
  - Derleme hızını optimize et

### Üretim Ortamı Yapılandırması
- **Dağıtım Stratejisi**
  - NPM Registry veya statik sunucu kullan
  - Derleme çıktılarının bütünlüğünü sağla
  - Gri yayın mekanizması uygula

- **Performans Optimizasyonu**
  - Kaynak ön yüklemeyi uygun şekilde yapılandır
  - Modül yükleme sırasını optimize et
  - Etkili önbellek stratejileri uygula

### Sürüm Yönetimi
- **Sürüm Kuralları**
  - Anlamsal sürümleme kurallarına uy
  - Detaylı güncelleme günlükleri tut
  - Sürüm uyumluluk testlerini yap

- **Bağımlılık Güncellemeleri**
  - Bağımlılık paketlerini zamanında güncelle
  - Düzenli olarak güvenlik denetimi yap
  - Bağımlılık sürüm tutarlılığını koru
```