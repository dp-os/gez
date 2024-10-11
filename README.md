## 目录规范
- dist 应用程序打包的目录
- dist/client 客户端构建输出
- dist/server 服务端构建输出
- dist/node   Node 端构建输出
- remotes 远程模块存储目录
- remotes/[name] 远程模块，客户端存储目录
- remotes/[name] 远程模块，服务端存储目录

### 模块关系配置
```json
{
    "remoteDir": "../.remotes",
    "exports": ["vue"],
    "imports": ["ssr-demo/react"],
    "importBase": {
        "ssr-demo": {
            "path": "../ssr-demo/dist",
            "url": "http://localhost:3002/ssr-demo/version"
        }
    }
}
```
下载的目录：download-cache
自己的目录：dist
共享的目录：remotes -> dist
依赖目录：node_modules/[name] -> remotes/[name]/server