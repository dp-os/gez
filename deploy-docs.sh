#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 进入生成的文件夹
cd docs
npm run build

cd doc_build
# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://dp-os.github.io/gez/
git push -f git@github.com:dp-os/gez.git master:docs

cd -