## 常用命令说明

### 安装全部工程的依赖
```bash
lerna clean # 清理依赖
lerna bootstrap # 安装依赖
```
### 添加一个包
```bash
lerna create 包名
```
## 添加一个开发包
```bash
lerna add 依赖名称 --scope=包名 --dev
lerna add ssr-shared --scope=express --dev
```
## 添加一个生产包
```bash
lerna add 依赖名称 --scope=包名 --dev
```
Vue SSR supports the use of Federated modules
### 将相互依赖的所有包Symlink链接在一起 
```bash
lerna link
```

## 生产dts类型
vue-tsc --declaration --emitDeclarationOnly