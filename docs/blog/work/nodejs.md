---
title: 'Node.js'
sidebar: auto
collapsable: true
---

# Node.js

本文档将会介绍我们在开发Node.js应用时会用到的一些工具

## nvm

管理Node.js版本，通过[nvm](https://github.com/nvm-sh/nvm)我们可以同时安装/切换不同的Node.js版本

### 安装nvm

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

### 添加环境变量

```bash
$ vim ~/.zshrc

在尾部添加以下配置
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

### 使用命令

```bash
$ nvm ls-remote # 列出所有支持的Node.js版本
$ nvm ls # 列出本地已安装的Node.js版本
$ nvm install 11.5.0 # 安装指定的Node.js版本
$ nvm alias default 11 # 设置默认使用的版本
```

## nrm

使用[nrm](https://github.com/Pana/nrm)可以让我们来切换不同的npm源而不用单独安装cnpm之类的库

### 安装nrm

```bash
$ npm install -g nrm
```

### 使用命令

```bash
$ nrm ls # 列出当前支持切换的源
$ nrm use taobao # 使用taobao的源作为默认的npm源
```

## 实用模块

下面来介绍一些实用的Node.js模块

### dclone

[dclone](https://github.com/zhangyuang/dclone)用来下载某个特定的github仓库的文件夹，而不是下载整个项目，可以缩短你的下载时间

```bash
$ npm i -g dclone
$ dclone https://github.com/ykfe/egg-react-ssr/tree/dev/example/ssr-with-loadable
```

### http-server

使用[http-server](https://www.npmjs.com/package/http-server)我们可以快速的创建一个本地http server服务，并且托管我们当前目录作为静态资源文件夹而不用特地去用Node.js框架来搭建一个静态资源服务

#### 如何使用http-server

```bash
$ npm install http-server -g # 安装http-server模块
$ http-server . -p 8080 # 监听8080端口，以当前目录作为静态资源目录
```

### npx

使用npx来让我们可以方便的调用项目的依赖模块

```bash
$ npx jest # 直接调用node_modules中的jest而不需要手动编写npm script
$ npx create-react-app app # npx 将create-react-app下载到一个临时目录，使用以后再删除。使得你不需要全局安装
```

### promisify

[util.promisify](http://nodejs.cn/api/util.html#util_util_promisify_original)是Node.js的官方API，使用该API我们可以将callback形式的Node.js API包装为Promise的形式,只要符合最后一个参数是callback，并且callback第一个参数是错误处理的API都可以通过promisify来包装

```js
const { promisify } = require('util')
const { exec } = require('child_process')
const execWithPromise = promisify(exec)
const installServer = async () => {
    const { stdout } = await execWithPromise(`npm i -g http-server`)
}
```

## 使用 npm link 调试模块

熟练的使用[npm link](https://docs.npmjs.com/cli/v6/commands/npm-link)可以帮助我们本地调试任何开源项目，当我们的一个前端组件库发布到npmjs.com或私服前想在本地测试时，我们可以使用npm link来进行测试。npm link 类似于Linux中的软链接，简单理解可以理解为一个快捷方式。完整流程如下所示：

```
$ cd your-components-name
$ npm link // 如果没有全局安装过your-components-name 此时会创建全局node_modules下的一个软链接your-components-name指向本地业务项目的your-components-name入口文件
$ npm link your-components-name // 在需要用调试your-components-name模块的应用执行该命令会将当前应用的node_modules/your-components-name指向全局node_modules/your-components-name软链接。真实项目演示：plus-m-cms首页项目用到cms组件库m-cms-components，用npm link调试刚改动的cms组件库：
首先在m-cms-components下执行npm run dist进行编译，然后执行npm-link，将编译后的组件库链到全局。然后再从plus-m-cms项目下，执行 npm link m-cms-components即可实现不用发布cms组件库版本进行调试。
➜  m-cms-components git:(master) ✗ npm link
added 4 packages from 10 contributors and audited 1719 packages in 15.352s 
27 packages are looking for funding run `npm fund` for details
/Users/liujingfa/.nvm/versions/node/v10.15.2/lib/node_modules/m-cms-components -> /Users/liujingfa/Documents/work/m-cms-components

➜  plus-m-cms git:(hotfix/store-data-code) npm link m-cms-components
/Users/liujingfa/Documents/work/plus-m-cms/node_modules/m-cms-components -> 
/Users/liujingfa/.nvm/versions/node/v10.15.2/lib/node_modules/m-cms-components -> 
/Users/liujingfa/Documents/work/m-cms-components
```
