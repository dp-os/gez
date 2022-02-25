# 编译其它项目类型
lerna run --scope=ssr-mf-remote build
# 复制类型文件夹
cp -r ./examples/ssr-mf-remote/types examples/ssr-mf-host/node_modules/ssr-mf-remote
# 复制 package.json
cp ./examples/ssr-mf-remote/package.json examples/ssr-mf-host/node_modules/ssr-mf-remote/package.json