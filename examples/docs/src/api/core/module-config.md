# ModuleConfig

ModuleConfig 提供了 Gez 框架的模块配置功能，用于定义模块的导入导出规则、别名配置和外部依赖等。

## 类型定义

### PathType

- **类型定义**:
```ts
enum PathType {
  npm = 'npm:', 
  root = 'root:'
}
```

模块路径类型枚举：
- `npm`: 表示 node_modules 中的依赖
- `root`: 表示项目根目录下的文件

### ModuleConfig

- **类型定义**:
```ts
interface ModuleConfig {
  exports?: string[]
  imports?: Record<string, string>
  externals?: Record<string, string>
}
```

模块配置接口，用于定义服务的导出、导入和外部依赖配置。

#### exports

导出配置列表，将服务中的特定代码单元（如组件、工具函数等）以 ESM 格式对外暴露。

支持两种类型：
- `root:*`: 导出源码文件，如：'root:src/components/button.vue'
- `npm:*`: 导出第三方依赖，如：'npm:vue'

#### imports

导入配置映射，配置需要导入的远程模块及其本地路径。

安装方式不同，配置也不同：
- 源码安装（Workspace、Git）：需要指向 dist 目录
- 软件包安装（Link、静态服务器、私有镜像源、File）：直接指向包目录

#### externals

外部依赖映射，配置要使用的外部依赖，通常是使用远程模块中的依赖。

**示例**：
```ts
// entry.node.ts
import type { GezOptions } from '@gez/core';

export default {
  modules: {
    // 导出配置
    exports: [
      'root:src/components/button.vue',  // 导出源码文件
      'root:src/utils/format.ts',
      'npm:vue',  // 导出第三方依赖
      'npm:vue-router'
    ],

    // 导入配置
    imports: {
      // 源码安装方式：需要指向 dist 目录
      'ssr-remote': 'root:./node_modules/ssr-remote/dist',
      // 软件包安装方式：直接指向包目录
      'other-remote': 'root:./node_modules/other-remote'
    },

    // 外部依赖配置
    externals: {
      'vue': 'ssr-remote/npm/vue',
      'vue-router': 'ssr-remote/npm/vue-router'
    }
  }
} satisfies GezOptions;
```

### ParsedModuleConfig

- **类型定义**:
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

解析后的模块配置，将原始的模块配置转换为标准化的内部格式：

#### name
当前服务的名称
- 用于标识模块和生成导入路径

#### root
当前服务的根目录路径
- 用于解析相对路径和构建产物的存放

#### exports
导出配置列表
- `name`: 原始导出路径，如：'npm:vue' 或 'root:src/components'
- `type`: 路径类型（npm 或 root）
- `importName`: 导入名称，格式：'${serviceName}/${type}/${path}'
- `exportName`: 导出路径，相对于服务根目录
- `exportPath`: 实际的文件路径
- `externalName`: 外部依赖名称，用于其他服务导入此模块时的标识

#### imports
导入配置列表
- `name`: 外部服务的名称
- `localPath`: 本地存储路径，用于存放外部模块的构建产物

#### externals
外部依赖映射
- 将模块的导入路径映射到实际的模块位置
- `match`: 用于匹配导入语句的正则表达式
- `import`: 实际的模块路径
