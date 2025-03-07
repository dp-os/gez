---
titleSuffix: Cơ chế chia sẻ mã giữa các dịch vụ trong Gez Framework
description: Giới thiệu chi tiết cơ chế liên kết module trong Gez Framework, bao gồm chia sẻ mã giữa các dịch vụ, quản lý phụ thuộc và triển khai tiêu chuẩn ESM, giúp nhà phát triển xây dựng ứng dụng micro frontend hiệu quả.
head:
  - - meta
    - property: keywords
      content: Gez, Liên kết module, Module Link, ESM, Chia sẻ mã, Quản lý phụ thuộc, Micro frontend
---

# Liên kết module

Gez Framework cung cấp một cơ chế liên kết module hoàn chỉnh để quản lý việc chia sẻ mã và các mối quan hệ phụ thuộc giữa các dịch vụ. Cơ chế này được triển khai dựa trên tiêu chuẩn ESM (ECMAScript Module), hỗ trợ xuất và nhập module ở cấp độ mã nguồn, cùng với các chức năng quản lý phụ thuộc đầy đủ.

### Khái niệm cốt lõi

#### Xuất module
Xuất module là quá trình đưa các đơn vị mã cụ thể trong dịch vụ (như component, hàm tiện ích, v.v.) ra ngoài dưới định dạng ESM. Hỗ trợ hai loại xuất:
- **Xuất mã nguồn**: Xuất trực tiếp các tệp mã nguồn trong dự án
- **Xuất phụ thuộc**: Xuất các gói phụ thuộc bên thứ ba mà dự án sử dụng

#### Nhập module
Nhập module là quá trình tham chiếu các đơn vị mã được xuất từ các dịch vụ khác trong một dịch vụ. Hỗ trợ nhiều cách cài đặt:
- **Cài đặt mã nguồn**: Phù hợp cho môi trường phát triển, hỗ trợ sửa đổi thời gian thực và cập nhật nóng
- **Cài đặt gói phần mềm**: Phù hợp cho môi trường sản xuất, sử dụng trực tiếp sản phẩm đã được build

### Cơ chế tải trước

Để tối ưu hóa hiệu suất dịch vụ, Gez đã triển khai cơ chế tải trước module thông minh:

1. **Phân tích phụ thuộc**
   - Phân tích các mối quan hệ phụ thuộc giữa các component trong quá trình build
   - Xác định các module cốt lõi trên đường dẫn quan trọng
   - Xác định mức độ ưu tiên tải của các module

2. **Chiến lược tải**
   - **Tải ngay lập tức**: Các module cốt lõi trên đường dẫn quan trọng
   - **Tải trễ**: Các module chức năng không quan trọng
   - **Tải theo yêu cầu**: Các module được render có điều kiện

3. **Tối ưu hóa tài nguyên**
   - Chiến lược phân chia mã thông minh
   - Quản lý bộ nhớ đệm ở cấp độ module
   - Biên dịch và đóng gói theo yêu cầu

## Xuất module

### Cấu hình

Cấu hình các module cần xuất trong `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // Xuất tệp mã nguồn
            'root:src/components/button.vue',  // Vue component
            'root:src/utils/format.ts',        // Hàm tiện ích
            // Xuất phụ thuộc bên thứ ba
            'npm:vue',                         // Vue framework
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

Cấu hình xuất hỗ trợ hai loại:
- `root:*`: Xuất tệp mã nguồn, đường dẫn tương đối so với thư mục gốc của dự án
- `npm:*`: Xuất phụ thuộc bên thứ ba, chỉ định trực tiếp tên gói

## Nhập module

### Cấu hình

Cấu hình các module cần nhập trong `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // Cấu hình nhập
        imports: {
            // Cài đặt mã nguồn: Trỏ đến thư mục sản phẩm build
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // Cài đặt gói phần mềm: Trỏ đến thư mục gói
            'other-remote': 'root:./node_modules/other-remote'
        },
        // Cấu hình phụ thuộc bên ngoài
        externals: {
            // Sử dụng phụ thuộc từ module từ xa
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

Giải thích cấu hình:
1. **imports**: Cấu hình đường dẫn cục bộ của module từ xa
   - Cài đặt mã nguồn: Trỏ đến thư mục sản phẩm build (dist)
   - Cài đặt gói phần mềm: Trỏ trực tiếp đến thư mục gói

2. **externals**: Cấu hình phụ thuộc bên ngoài
   - Dùng để chia sẻ phụ thuộc từ module từ xa
   - Tránh đóng gói trùng lặp các phụ thuộc giống nhau
   - Hỗ trợ chia sẻ phụ thuộc giữa nhiều module

### Cách cài đặt

#### Cài đặt mã nguồn
Phù hợp cho môi trường phát triển, hỗ trợ sửa đổi thời gian thực và cập nhật nóng.

1. **Cách Workspace**
Khuyến nghị sử dụng trong dự án Monorepo:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Cách Link**
Dùng để debug phát triển cục bộ:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### Cài đặt gói phần mềm
Phù hợp cho môi trường sản xuất, sử dụng trực tiếp sản phẩm đã được build.

1. **NPM Registry**
Cài đặt qua npm registry:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **Máy chủ tĩnh**
Cài đặt qua giao thức HTTP/HTTPS:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## Đóng gói phần mềm

### Cấu hình

Cấu hình các tùy chọn build trong `entry.node.ts`:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // Cấu hình xuất module
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // Cấu hình build
    pack: {
        // Kích hoạt build
        enable: true,

        // Cấu hình đầu ra
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // Tùy chỉnh package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // Xử lý trước khi build
        onBefore: async (gez, pkg) => {
            // Tạo khai báo kiểu
            // Chạy test case
            // Cập nhật tài liệu, v.v.
        },

        // Xử lý sau khi build
        onAfter: async (gez, pkg, file) => {
            // Tải lên CDN
            // Phát hành lên npm repository
            // Triển khai lên môi trường test, v.v.
        }
    }
} satisfies GezOptions;
```

### Sản phẩm build

```
your-app-name.tgz
├── package.json        # Thông tin gói
├── index.js            # Đầu vào môi trường sản xuất
├── server/             # Tài nguyên phía server
│   └── manifest.json   # Ánh xạ tài nguyên phía server
├── node/               # Thời gian chạy Node.js
└── client/             # Tài nguyên phía client
    └── manifest.json   # Ánh xạ tài nguyên phía client
```

### Quy trình phát hành

```bash
# 1. Build phiên bản sản xuất
gez build

# 2. Phát hành lên npm
npm publish dist/versions/your-app-name.tgz
```

## Thực tiễn tốt nhất

### Cấu hình môi trường phát triển
- **Quản lý phụ thuộc**
  - Sử dụng cách Workspace hoặc Link để cài đặt phụ thuộc
  - Quản lý phiên bản phụ thuộc thống nhất
  - Tránh cài đặt trùng lặp các phụ thuộc giống nhau

- **Trải nghiệm phát triển**
  - Kích hoạt tính năng cập nhật nóng
  - Cấu hình chiến lược tải trước phù hợp
  - Tối ưu hóa tốc độ build

### Cấu hình môi trường sản xuất
- **Chiến lược triển khai**
  - Sử dụng NPM Registry hoặc máy chủ tĩnh
  - Đảm bảo tính toàn vẹn của sản phẩm build
  - Áp dụng cơ chế phát hành thử nghiệm

- **Tối ưu hóa hiệu suất**
  - Cấu hình tải trước tài nguyên hợp lý
  - Tối ưu hóa thứ tự tải module
  - Áp dụng chiến lược bộ nhớ đệm hiệu quả

### Quản lý phiên bản
- **Quy tắc phiên bản**
  - Tuân thủ quy tắc phiên bản ngữ nghĩa
  - Duy trì nhật ký cập nhật chi tiết
  - Kiểm tra tính tương thích phiên bản kỹ lưỡng

- **Cập nhật phụ thuộc**
  - Cập nhật các gói phụ thuộc kịp thời
  - Kiểm tra bảo mật định kỳ
  - Duy trì tính nhất quán phiên bản phụ thuộc
```