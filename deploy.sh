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

# 如果发布到 https://james9527.github.io
git push -f git@github.com:james9527/james9527.github.io.git master
# 如果发布到 https://james9527.github.io/blog
# git push -f git@github.com:james9527/blog.git master:gh-pages

# Tips: 可以在持续集成的设置中，设置在每次 push 代码时自动运行上述脚本。 

cd -