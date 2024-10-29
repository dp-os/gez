# 为什么选 Gez
目前社区类微服务的解决方案基本可以分为 iframe、micro-app、module federation 三种代表。其中 iframe 和 micro-app 这种模式只适合对已有的老项目进行缝合，是以降低程序运行效率所做的一种妥协，而 module federation 的接入成本较高，里面又是一个黑盒子，一旦出了问题，都十分难以排查。

Gez 完全是基于 ESM 模块系统进行设计，每个服务都可以对外导出模块，也可以使用外部模块，整个过程简单透明，能够精准的控制依赖管理。

## 场景
我们有三个服务，分别是`ssr-core`、`ssr-module-auth`、`ssr-app`，目录结构如下
```
- services/
  - ssr-core/         # 核心服务，提供公共的依赖、函数、组件
  - ssr-module-auth/  # 认证模块，负责登录注册、修改密码、找回密码、验证码
  - ssr-app/          # 聚合服务，将不同服务的功能聚合到一起
```

### ssr-core
核心服务对外提供了基本的布局组件，Vue 版本
```ts
export default {
    name: 'ssr-core',
    modules: {
        exports: ['root:src/components/layout.vue', 'npm:vue']
    }
} satisfies GezOptions;
```
### ssr-module-auth
对外提供本服务的路由配置文件，并且将 `vue` 模块指向到 `ssr-core` 导出的 `vue` 模块
```ts
export default {
    name: 'ssr-module-auth',
    modules: {
        exports: ['root:src/routes.ts'],
        imports: {
            'ssr-core': 'root:../ssr-core/dist'
        },
        externals: {
            vue: 'ssr-core/npm/vue'
        }
    }
} satisfies GezOptions;
```
### ssr-app
可以在本项目中使用 `import routes from 'ssr-module-auth/src/routes'` 来使用 `ssr-module-auth` 模块的导出
```ts
export default {
    name: 'ssr-app',
    modules: {
        imports: {
            'ssr-core': 'root:../ssr-core/dist',
            'ssr-module-auth': 'root:../ssr-module-auth/dist'
        },
        externals: {
            vue: 'ssr-core/npm/vue'
        }
    }
} satisfies GezOptions;
```