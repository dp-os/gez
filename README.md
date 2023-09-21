# genesis3
一个轻量级的 SSR 微服务框架

## 快速开始

npm
```bash
npm install genesis3
npm install genesis-vite vite -D
```
yarn
```bash
yarn add genesis3
yarn add genesis-vite vite -D
```
pnpm
```bash
pnpm install genesis3
pnpm install genesis-vite vite -D
```
### 设置脚本
在`package.json`文件中配置启动脚本
```json
    "scripts": {
        "dev": "genesis-vite dev",
        "build": "genesis-vite build",
        "start": "genesis"
    }
```