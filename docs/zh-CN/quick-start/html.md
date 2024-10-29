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
## 源码结构
```
.
├── dist                   构建源码输出的目录
│   ├── client             同构-客户端输出
│   ├── server             同构-服务端输出
│   ├── node               服务器-程序输出
├── src                    源码目录
|   ├── entry.client.ts    同构-客户端入口
|   ├── entry.server.ts    同构-服务端入口
|   ├── entry.node.ts      服务器-程序入口
├── package.json           包管理配置
.
```
