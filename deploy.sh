#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

#git init
git pull
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
#git push -f git@github.com:james9527/james9527.github.io.git master
#git remote add origin https://github.com/james9527/james9527.github.io.git
git push origin https://github.com/james9527/james9527.github.io.git master
# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:james9527/blog.git master:gh-pages

cd -