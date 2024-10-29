# HTML
这是一个与框架无关的例子，采用原生的 HTML 来开发项目

## 创建项目
```bash
cd 项目目录
npm init
```
## 将项目设置为 module
在 **package.json** 文件添加如下
```json
{
    "type": "module"
}
```

## 安装依赖
```bash
# 安装生产依赖
npm install @gez/core
# 安装开发依赖
npm install @gez/rspack -D
```
## 添加脚本
在 **package.json** 文件添加如下
```json
{
  "scripts": {
    "dev": "gez dev",
    "build": "gez build",
    "start": "gez start",
    "preview": "gez preview",
    "postinstall": "gez install"
  }
}
```
