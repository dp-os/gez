# 为什么选 Gez
目前社区类微服务的解决方案基本可以分为 iframe、micro-app、module federation 三种代表。其中 iframe 和 micro-app 这种模式只适合对已有的老项目进行缝合，是以降低程序运行效率所做的一种妥协，而 module federation 的接入成本较高，里面又是一个黑盒子，一旦出了问题，都十分难以排查。

Gez 完全是基于 ESM 模块系统进行设计，默认支持 SSR，每个服务都可以对外导出模块，也可以使用外部模块，整个过程简单透明，能够精准的控制依赖管理。最重要的是在客户端可以使用 `importmap` 将不同服务的导出映射成具有内容哈希缓存的文件。

## 示例
我们有三个服务，分别是`ssr-core`、`ssr-module-auth`、`ssr-app`，目录结构如下
```
- services/
  - ssr-core/         # 核心服务，提供公共的依赖、函数、组件
  - ssr-module-auth/  # 认证模块，负责登录注册、修改密码、找回密码、验证码
  - ssr-app/          # 聚合服务，将不同服务的功能聚合到一起
```

### ssr-core
核心服务对外提供了基本的布局组件、vue 库
```ts
export default {
    name: 'ssr-core',
    modules: {
        exports: [
            // 其它服务使用：import Layout from 'ssr-core/src/components/layout.vue' 
            'root:src/components/layout.vue',
            // 其它服务可以将 vue 的外部依赖设置为 ssr-core/npm/vue 来达到依赖共享
            'npm:vue',
            'npm:vue-router'
        ]
    }
} satisfies GezOptions;
```
### ssr-module-auth
对外提供本服务的路由配置文件，并且将 `vue` 和 `vue-router` 模块指向到 `ssr-core` 导出的模块
```ts
export default {
    name: 'ssr-module-auth',
    modules: {
        // 其它服务使用：import routes from 'ssr-module-auth/src/routes
        exports: ['root:src/routes.ts'],
        imports: {
            'ssr-core': 'root:../ssr-core/dist'
        },
        externals: {
            vue: 'ssr-core/npm/vue',
            'vue-router': 'ssr-core/npm/vue-router'
        }
    }
} satisfies GezOptions;
```
### ssr-app
在聚合服务，可以
- `import Layout from 'ssr-core/src/components/layout.vue'` 来调用基础服务的公共布局组件
- `import routes from 'ssr-module-auth/src/routes` 来注册来自其它服务的路由配置
- `import Vue from 'vue'` 替换为 `import Vue from 'ssr-core/npm/vue'`，来达到依赖共享，其它依赖举一反三
```ts
export default {
    name: 'ssr-app',
    modules: {
        imports: {
            'ssr-core': 'root:../ssr-core/dist',
            'ssr-module-auth': 'root:../ssr-module-auth/dist'
        },
        externals: {
            vue: 'ssr-core/npm/vue',
            'vue-router': 'ssr-core/npm/vue-router'
        }
    }
} satisfies GezOptions;
```