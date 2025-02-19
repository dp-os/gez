# PackConfig

`PackConfig` 是软件包打包配置接口，用于将服务的构建产物打包成标准的 npm .tgz 格式软件包。

## 特点

- **标准化**：使用 npm 标准的 .tgz 打包格式
- **完整性**：包含模块的源代码、类型声明和配置文件等所有必要文件
- **兼容性**：与 npm 生态系统完全兼容，支持标准的包管理工作流

## 类型定义

```typescript
interface PackConfig {
    enable?: boolean;
    outputs?: string | string[];
    packageJson?: (gez: Gez, pkg: any) => Promise<any>;
    onBefore?: (gez: Gez, pkg: any) => Promise<void>;
    onAfter?: (gez: Gez, pkg: any, file: string) => Promise<void>;
}
```

## PackConfig

### enable

是否启用打包功能。启用后会将构建产物打包成标准的 npm .tgz 格式软件包。

- 类型：`boolean`
- 默认值：`false`

### outputs

指定输出的软件包文件路径。支持以下配置方式：
- `string`: 单个输出路径，如 'dist/versions/my-app.tgz'
- `string[]`: 多个输出路径，用于同时生成多个版本
- `boolean`: true 时使用默认路径 'dist/client/versions/latest.tgz'

### packageJson

自定义 package.json 内容的回调函数。

- 参数：
  - `gez: Gez` - Gez 实例
  - `pkg: any` - 原始的 package.json 内容
- 返回值：`Promise<any>` - 修改后的 package.json 内容

### onBefore

打包前的准备工作回调函数。

- 参数：
  - `gez: Gez` - Gez 实例
  - `pkg: any` - package.json 内容
- 返回值：`Promise<void>`

### onAfter

打包完成后的处理回调函数。

- 参数：
  - `gez: Gez` - Gez 实例
  - `pkg: any` - package.json 内容
  - `file: string` - 打包后的文件路径
- 返回值：`Promise<void>`

## 使用示例

```typescript title="entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // 配置需要导出的模块
    exports: [
      'root:src/components/button.vue',
      'root:src/utils/format.ts',
      'npm:vue',
      'npm:vue-router'
    ]
  },
  // 打包配置
  pack: {
    // 启用打包功能
    enable: true,

    // 同时输出多个版本
    outputs: [
      'dist/versions/latest.tgz',
      'dist/versions/1.0.0.tgz'
    ],

    // 自定义 package.json
    packageJson: async (gez, pkg) => {
      pkg.version = '1.0.0';
      return pkg;
    },

    // 打包前准备
    onBefore: async (gez, pkg) => {
      // 添加必要文件
      await fs.writeFile('dist/README.md', '# Your App\n\n模块导出说明...');
      // 执行类型检查
      await runTypeCheck();
    },

    // 打包后处理
    onAfter: async (gez, pkg, file) => {
      // 发布到私有 npm 镜像源
      await publishToRegistry(file, {
        registry: 'https://npm.your-registry.com/'
      });
      // 或部署到静态服务器
      await uploadToServer(file, 'https://static.example.com/packages');
    }
  }
} satisfies GezOptions;
```