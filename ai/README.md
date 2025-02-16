# Gez 文档

## 快速开始
- [环境要求](./gez/environment-requirements.md)
- [项目结构](./gez/project-structure.md)
- [开发指南](./development-guide.md)

## 核心概念
- [模块链接](./gez/module-link.md)
  - 基本概念
  - 源码安装
  - 软件包安装
  - 服务导入配置

## API 参考
- [Gez 核心](./gez/gez.md)
  - GezOptions
  - ModuleConfig
  - PackConfig
- [应用实例](./gez/app.md)
- [渲染上下文](./gez/render-context.md)
- [构建产物](./gez/manifest-json.md)

## 开发者指南
- [贡献指南](./contributor.md)
- [术语表](./gez/terminology.md)

## 目录结构
```
ai/
├── README.md                              # 本文档
├── contributor.md                         # 贡献指南
├── development-guide.md                   # 开发指南
└── gez/                                   # 核心文档
    ├── app.md                             # 应用实例
    ├── environment-requirements.md        # 环境要求
    ├── gez.md                             # Gez 核心
    ├── manifest-json.md                   # 构建产物
    ├── module-link.md                     # 模块链接
    ├── project-structure.md               # 项目结构
    ├── render-context.md                  # 渲染上下文
    └── terminology.md                     # 术语表