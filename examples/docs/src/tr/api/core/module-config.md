---
titleSuffix: Gez Çerçeve Modül Yapılandırma API Referansı
description: Gez çerçevesinin ModuleConfig yapılandırma arayüzünü detaylı olarak açıklar, modül içe/dışa aktarma kurallarını, takma ad yapılandırmasını ve harici bağımlılık yönetimini içerir, geliştiricilerin çerçevenin modüler sistemini derinlemesine anlamasına yardımcı olur.
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, modül yapılandırma, modül içe/dışa aktarma, harici bağımlılık, takma ad yapılandırma, bağımlılık yönetimi, Web uygulama çerçevesi
---

# ModuleConfig

ModuleConfig, Gez çerçevesinin modül yapılandırma işlevlerini sağlar, modüllerin içe/dışa aktarma kurallarını, takma ad yapılandırmasını ve harici bağımlılıkları tanımlamak için kullanılır.

## Tür Tanımları

### PathType

- **Tür Tanımı**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

Modül yol türü numaralandırması:
- `npm`: node_modules içindeki bağımlılıkları temsil eder
- `root`: proje kök dizinindeki dosyaları temsil eder

### ModuleConfig

- **Tür Tanımı**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

Modül yapılandırma arayüzü, servislerin dışa aktarma, içe aktarma ve harici bağımlılık yapılandırmalarını tanımlamak için kullanılır.

#### exports

Dışa aktarma yapılandırma listesi, servisteki belirli kod birimlerini (bileşenler, yardımcı fonksiyonlar vb.) ESM formatında dışarıya açığa çıkarır.

İki türü destekler:
- `root:*`: kaynak kod dosyalarını dışa aktarır, örneğin: 'root:src/components/button.vue'
- `npm:*`: üçüncü parti bağımlılıkları dışa aktarır, örneğin: 'npm:vue'

#### imports

İçe aktarma yapılandırma eşlemesi, uzak modülleri ve yerel yollarını yapılandırır.

Kurulum yöntemine göre yapılandırma farklılık gösterir:
- Kaynak kod kurulumu (Workspace, Git): dist dizinine işaret etmelidir
- Paket kurulumu (Link, statik sunucu, özel ayna kaynağı, File): doğrudan paket dizinine işaret eder

#### externals

Harici bağımlılık eşlemesi, kullanılacak harici bağımlılıkları yapılandırır, genellikle uzak modüllerdeki bağımlılıkları kullanır.

**Örnek**:
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Dışa aktarma yapılandırması
    exports: [
      'root:src/components/button.vue',  // kaynak kod dosyasını dışa aktar
      'root:src/utils/format.ts',
      'npm:vue',  // üçüncü parti bağımlılığı dışa aktar
      'npm:vue-router'
    ],

    // İçe aktarma yapılandırması
    imports: {
      // Kaynak kod kurulumu: dist dizinine işaret etmelidir
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // Paket kurulumu: doğrudan paket dizinine işaret eder
      'other-remote': 'root:./node_modules/other-remote'
    },

    // Harici bağımlılık yapılandırması
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **Tür Tanımı**:
```ts
interface ParsedModuleConfig {
  name: string
  root: string
  exports: {
    name: string
    type: PathType
    importName: string
    exportName: string
    exportPath: string
    externalName: string
  }[]
  imports: {
    name: string
    localPath: string
  }[]
  externals: Record<string, { match: RegExp; import?: string }>
}
```

Ayrıştırılmış modül yapılandırması, orijinal modül yapılandırmasını standartlaştırılmış bir iç formata dönüştürür:

#### name
Mevcut servisin adı
- Modülü tanımlamak ve içe aktarma yollarını oluşturmak için kullanılır

#### root
Mevcut servisin kök dizin yolu
- Göreli yolları çözümlemek ve yapı ürünlerini depolamak için kullanılır

#### exports
Dışa aktarma yapılandırma listesi
- `name`: orijinal dışa aktarma yolu, örneğin: 'npm:vue' veya 'root:src/components'
- `type`: yol türü (npm veya root)
- `importName`: içe aktarma adı, format: '${serviceName}/${type}/${path}'
- `exportName`: servis kök dizinine göre dışa aktarma yolu
- `exportPath`: gerçek dosya yolu
- `externalName`: harici bağımlılık adı, diğer servislerin bu modülü içe aktarması için kullanılan tanımlayıcı

#### imports
İçe aktarma yapılandırma listesi
- `name`: harici servisin adı
- `localPath`: harici modüllerin yapı ürünlerini depolamak için kullanılan yerel depolama yolu

#### externals
Harici bağımlılık eşlemesi
- Modülün içe aktarma yolunu gerçek modül konumuna eşler
- `match`: içe aktarma ifadelerini eşleştirmek için kullanılan düzenli ifade
- `import`: gerçek modül yolu
```