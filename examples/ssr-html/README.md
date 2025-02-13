# SSR HTML 示例

这是一个使用 Gez 框架实现的服务端渲染（SSR）HTML 示例项目。展示了如何使用 Gez 构建一个支持服务端渲染的现代化网站。

🔗 [在线预览](https://dp-os.github.io/gez/ssr-html/)

## 功能特点

- ✨ 服务端渲染 (SSR)
- 🔄 热更新支持
- 🖼️ 多格式图片处理
  - SVG（矢量图）
  - JPG/JPEG（照片）
  - PNG（透明背景）
  - GIF（动画）
- 🎨 现代化的 UI 设计
- 📱 响应式布局

## 项目结构

```
src/
├── components/     # 组件目录
│   ├── layout.ts   # 布局组件
│   └── layout.css  # 布局样式
├── images/         # 图片资源
├── styles/         # 全局样式
├── views/          # 页面视图
│   ├── home.ts     # 首页
│   └── about.ts    # 关于页面
└── page.ts         # 页面基类
```

## 开发

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
pnpm dev
```

3. 构建生产版本：
```bash
pnpm build
```

## 技术栈

- TypeScript
- Rspack
- CSS3
- Hot Module Replacement (HMR)

## 示例展示

- 计数器：展示客户端交互
- 图片展示：展示多种图片格式的支持
- 路由：展示多页面路由功能
- 热更新：支持开发时的实时预览

## 许可证

MIT