# 编译其它项目类型
yarn build:packages
lerna run --scope=ssr-mf-about build
# 复制类型文件夹
cp -r ./examples/ssr-mf-about/types examples/ssr-mf-home/node_modules/ssr-mf-about
# 复制 package.json
cp ./examples/ssr-mf-about/package.json examples/ssr-mf-home/node_modules/ssr-mf-about/package.json