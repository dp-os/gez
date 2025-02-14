# 环境要求

## Node.js 要求

需要 Node.js 22.6 或更高版本，这是因为：
- 原生支持 TypeScript 的类型导入（通过 `--experimental-strip-types` 标志）
- 完整支持 ESM 特性
- 提供更好的开发体验和性能

## 浏览器支持


选择使用原生 ESM 模块系统具有以下显著优势：

| 浏览器 | 最低版本 |
|---------|----------|
| Chrome | 89+ |
| Edge | 89+ |
| Firefox | 108+ |
| Safari | 16.4+ |
   - 浏览器原生支持，无需转译
   - 更快的解析和执行速度
   - 更低的运行时开销
### 降级支持

通过 [es-module-shims](https://github.com/guybedford/es-module-shims) 可以支持以下较低版本的浏览器：

| 浏览器 | 最低版本 |
|---------|----------|
| Chrome | 87+ |
| Edge | 88+ |
| Firefox | 78+ |
| Safari | 14+ |

> 通过降级支持的浏览器全球覆盖率高达 96.81%

要启用降级支持，需要在页面中添加以下脚本：

```html
<!-- 开发环境 -->
<script async src="https://ga.jspm.io/npm:es-module-shims@1.8.0/dist/es-module-shims.js"></script>

<!-- 生产环境（建议部署到自己的服务器） -->
<script async src="/path/to/es-module-shims.js"></script>
```

> **⚠️ 注意：** 生产环境中，请将 es-module-shims 部署到自己的服务器上，以确保资源的可用性和安全性。