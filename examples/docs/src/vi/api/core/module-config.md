---
titleSuffix: Tham chiếu API cấu hình module của framework Gez
description: Tài liệu chi tiết về giao diện cấu hình ModuleConfig của framework Gez, bao gồm các quy tắc nhập/xuất module, cấu hình bí danh và quản lý phụ thuộc bên ngoài, giúp nhà phát triển hiểu sâu hơn về hệ thống module hóa của framework.
head:
  - - meta
    - property: keywords
      content: Gez, ModuleConfig, cấu hình module, nhập/xuất module, phụ thuộc bên ngoài, cấu hình bí danh, quản lý phụ thuộc, framework ứng dụng web
---

# ModuleConfig

ModuleConfig cung cấp chức năng cấu hình module cho framework Gez, dùng để định nghĩa các quy tắc nhập/xuất module, cấu hình bí danh và phụ thuộc bên ngoài.

## Định nghĩa kiểu

### PathType

- **Định nghĩa kiểu**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

Enum loại đường dẫn module:
- `npm`: Đại diện cho các phụ thuộc trong node_modules
- `root`: Đại diện cho các file trong thư mục gốc của dự án

### ModuleConfig

- **Định nghĩa kiểu**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

Giao diện cấu hình module, dùng để định nghĩa cấu hình xuất, nhập và phụ thuộc bên ngoài của dịch vụ.

#### exports

Danh sách cấu hình xuất, xuất các đơn vị mã cụ thể trong dịch vụ (như component, hàm tiện ích, v.v.) dưới dạng ESM.

Hỗ trợ hai loại:
- `root:*`: Xuất file mã nguồn, ví dụ: 'root:src/components/button.vue'
- `npm:*`: Xuất phụ thuộc bên thứ ba, ví dụ: 'npm:vue'

#### imports

Bản đồ cấu hình nhập, cấu hình các module từ xa cần nhập và đường dẫn cục bộ của chúng.

Cách cài đặt khác nhau, cấu hình cũng khác nhau:
- Cài đặt mã nguồn (Workspace, Git): Cần trỏ đến thư mục dist
- Cài đặt gói phần mềm (Link, máy chủ tĩnh, nguồn gương riêng, File): Trực tiếp trỏ đến thư mục gói

#### externals

Bản đồ phụ thuộc bên ngoài, cấu hình các phụ thuộc bên ngoài cần sử dụng, thường là sử dụng phụ thuộc từ các module từ xa.

**Ví dụ**:
```ts title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // Cấu hình xuất
    exports: [
      'root:src/components/button.vue',  // Xuất file mã nguồn
      'root:src/utils/format.ts',
      'npm:vue',  // Xuất phụ thuộc bên thứ ba
      'npm:vue-router'
    ],

    // Cấu hình nhập
    imports: {
      // Cách cài đặt mã nguồn: cần trỏ đến thư mục dist
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // Cách cài đặt gói phần mềm: trực tiếp trỏ đến thư mục gói
      'other-remote': 'root:./node_modules/other-remote'
    },

    // Cấu hình phụ thuộc bên ngoài
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **Định nghĩa kiểu**:
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

Cấu hình module đã được phân tích, chuyển đổi cấu hình module gốc sang định dạng nội bộ chuẩn hóa:

#### name
Tên của dịch vụ hiện tại
- Dùng để định danh module và tạo đường dẫn nhập

#### root
Đường dẫn thư mục gốc của dịch vụ hiện tại
- Dùng để phân giải đường dẫn tương đối và lưu trữ sản phẩm build

#### exports
Danh sách cấu hình xuất
- `name`: Đường dẫn xuất gốc, ví dụ: 'npm:vue' hoặc 'root:src/components'
- `type`: Loại đường dẫn (npm hoặc root)
- `importName`: Tên nhập, định dạng: '${serviceName}/${type}/${path}'
- `exportName`: Đường dẫn xuất, tương đối với thư mục gốc của dịch vụ
- `exportPath`: Đường dẫn file thực tế
- `externalName`: Tên phụ thuộc bên ngoài, dùng để định danh khi các dịch vụ khác nhập module này

#### imports
Danh sách cấu hình nhập
- `name`: Tên của dịch vụ bên ngoài
- `localPath`: Đường dẫn lưu trữ cục bộ, dùng để lưu trữ sản phẩm build của module bên ngoài

#### externals
Bản đồ phụ thuộc bên ngoài
- Ánh xạ đường dẫn nhập module đến vị trí thực tế của module
- `match`: Biểu thức chính quy dùng để khớp câu lệnh nhập
- `import`: Đường dẫn thực tế của module