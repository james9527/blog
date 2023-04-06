## Mac M1 Pro安装node-sass失败解救方法

node-sass 是属于被淘汰的工具，然而很多老项目还在继续使用它，新人拿到项目第一步当然是要 npm install, 这时候node-sass 经常安装不成功，因为默认npm会到 github下载node-sass ，比如直接安装时不能下载：

```bash
Cannot download "https://github.com/sass/node-sass/releases/download/v4.14.1/darwin-x64-83_binding.node":
```
```bash
➜  community-operation-web git:(feature/task-modify) ✗ npm i node-sass@4.14.1
npm WARN deprecated tar@2.2.2: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.

> node-sass@4.14.1 install /Users/liujingfa/Documents/supaur/community/community-operation-web/node_modules/node-sass
> node scripts/install.js

Downloading binary from https://github.com/sass/node-sass/releases/download/v4.14.1/darwin-x64-83_binding.node
Cannot download "https://github.com/sass/node-sass/releases/download/v4.14.1/darwin-x64-83_binding.node":
....
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! node-sass@4.14.1 postinstall: `node scripts/build.js`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the node-sass@4.14.1 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/liujingfa/.npm/_logs/2022-11-19T08_25_34_461Z-debug.log
```
注意，这里不是 --registry, 下载node-sass 静态文件是单独的域名，跟是否配置 --registry 为淘宝镜像无关。命令如下：

```bash
npm config set sass_binary_site="https://cdn.npmmirror.com/binaries/node-sass"
```

```bash
➜  community-operation-web git:(feature/task-modify) ✗ npm config set sass_binary_site="https://cdn.npmmirror.com/binaries/node-sass"

┌──────────────────────────────────────────────────────────────┐
│                   npm update check failed                    │
│             Try running with sudo or get access              │
│             to the local update config store via             │
│ sudo chown -R $USER:$(id -gn $USER) /Users/liujingfa/.config │
└──────────────────────────────────────────────────────────────┘
➜  community-operation-web git:(feature/task-modify) ✗ npm config get registry
https://registry.npmmirror.com/
...
➜  community-operation-web git:(feature/task-modify) ✗ npm i node-sass
npm WARN deprecated tar@2.2.2: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.

> node-sass@4.14.1 install /Users/liujingfa/Documents/supaur/community/community-operation-web/node_modules/node-sass
> node scripts/install.js

Downloading binary from https://cdn.npmmirror.com/binaries/node-sass/v4.14.1/darwin-x64-72_binding.node
Download complete  ⸩ ⠋ :
Binary saved to /Users/liujingfa/Documents/supaur/community/community-operation-web/node_modules/node-sass/vendor/darwin-x64-72/binding.node
Caching binary to /Users/liujingfa/.npm/node-sass/4.14.1/darwin-x64-72_binding.node

> node-sass@4.14.1 postinstall /Users/liujingfa/Documents/supaur/community/community-operation-web/node_modules/node-sass
> node scripts/build.js

Binary found at /Users/liujingfa/Documents/supaur/community/community-operation-web/node_modules/node-sass/vendor/darwin-x64-72/binding.node
Testing binary
Binary is fine
npm WARN The package moment is included as both a dev and production dependency.

+ node-sass@4.14.1
added 69 packages from 52 contributors in 12.473s

94 packages are looking for funding
  run `npm fund` for details
# 至此，node-sass已安装成功

```