## 写在前面
最近618来了着实有点忙呢，本来计划最多一周内再写第二篇的，然而拖延了近一个月才来写[打脸.jpg]，前面写了一篇[《用Nuxt重构电商M站实战笔记之基础篇》](https://juejin.im/post/6844904163600515086)，如有感兴趣的朋友可以给个阅读量+1😊，本篇是在项目部署期间做的一些笔记，以代码为主(文中域名均为虚构)，现总结如下：

## Nuxt支持的发布部署方式
Nuxt.js 提供了一系列常用的命令, 用于开发或发布部署。支持的两种发布部署应用的方式：服务端渲染应用部署 和 静态应用部署。本文，我们要介绍的是第一种。
命令 | 描述
---|---
nuxt | 启动一个热加载的Web服务器（开发模式） localhost:3000
nuxt build | 利用webpack编译应用，压缩JS和CSS资源（发布用）
nuxt start | 以生产模式启动一个Web服务器 (需要先执行nuxt build)
nuxt generate | 编译应用，并依据路由配置生成对应的HTML文件 (用于静态站点的部署)

如果使用了 Koa/Express 等 Node.js Web 开发框架，并使用了 Nuxt 作为中间件，可以自定义 Web 服务器的启动入口：
命令 | 描述
---|---
NODE_ENV=development nodemon server/index.js | 启动一个热加载的自定义 Web 服务器（开发模式）
NODE_ENV=production node server/index.js | 以生产模式启动一个自定义 Web 服务器 (需要先执行 nuxt build)


## 部署前先捋清环境有哪些？
> 每个公司都有自己的一套代码环境，就我现在这家为例，分为测试、主测试(内部叫主UAT)、准生产和生产环境，其中主测试与测试环境的唯一区别就是不需要绑定host。为什么要这么区分呢？就是避免测试环境受影响而已。

先说一个场景：开发人员开发完一个新功能就打算部署到测试环境提测，QA在这测试过程，一般都会提一些bug给对应的开发人员，而开发人员在修复bug这个过程，一般都需要重启服务器去验证下。此时，如果QA正在验证一个功能，突然发现页面打不开或接口调不通了，心里肯定MMP了。当然，你也可以直接告知QA说服务器需要重启几分钟，但是如果次数多了谁都受不了。回归正题，准生产就是只能在内网访问的生产环境，一切配置和数据跟线上一致；而生产环境，就是对外的线上环境了。

## 根据执行环境去配置各种资源
一套代码要配置这么多个环境，还算是比较麻烦的事儿。本项目部署相关的总结，有哪些可圈可点的呢？总结了以下几点：

### 静态资源路径配置
对于js&css等静态资源的路径配置，我是这么做的：

```js
## config.js ##
const domain = {
    test: "test.abc.com",
    pre: "pre.abc.com",
    prod: "prod.abc.com"
}
domain.dev = domain.test;

const dnsPrefetch = {
    test: {
        js: "//test.abc.com",
        css: "//test.abc.com",
    },
    pre: {
        js: "//pre.abc.com",
        css: "//pre.abc.com",
    },
    prod: {
        js: "//js.m.abc.com",
        css: "//css.m.abc.com"
    }
}

dnsPrefetch.dev = dnsPrefetch.test;

const staticsBaseUrl = {
    test: {
        js: "//test.abc.com/test",
        css: "//test.abc.com/test",
        app: "//test.abc.com/test"
    },
    pre: {
        js: "//pre.abc.com/pre",
        css: "//pre.abc.com/pre",
        app: "//pre.abc.com/pre"
    },
    prod: {
        js: "//js.m.abc.com/prod",
        css: "//css.m.abc.com/prod",
        app: "//app.m.abc.com/prod"
    }
}

staticsBaseUrl.dev = staticsBaseUrl.test;

// 配置一些公共的页面跳转链接
const locationHref = {
    test: {
        login: "//test.abc.com/login.html"
    },
    pre: {
        login: "//pre.abc.com/login.html"
    },
    prod: {
        login: "//prod.abc.com/login.html"
    }
}

locationHref.dev = locationHref.test;

module.exports = {
    domain,
    dnsPrefetch,
    staticsBaseUrl,
    locationHref
}
```
然后，再看如何在nuxt.config.js中配置静态资源路径的

```js
const env = process.env.EXE_ENV;
const cssStaticsPath = env == "prod" ? "https://css.m.abc.com/prod/ssr/statics/" : "/_nuxt/";
const jsStaticsPath = env == "prod" ? "https://js.m.abc.com/prod/ssr/statics/" : "/_nuxt/";
const publicStaticsPath = env == "prod" ? "https://js.m.abc.com/prod/ssr/public/" : "";
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || "9527";
const { dnsPrefetch, staticsBaseUrl } = require("./config");
module.exports = {
  mode: 'universal',
  /*
  ** 页面头部信息
  */
  head: {
    title: '页面默认title',
    meta: [
      { charset: 'utf-8' },
      { hid: 'defaultKeywords', name: 'keywords', content: '电脑,手机,数码,空调...' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no,viewport-fit=cover' },
      { name: 'applicable-device', content: 'mobile' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'wap-font-scale', content: 'no' },
      { 'http-equiv': 'Expires', content: '-1' },
      { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { 'http-equiv': 'Cache-Control', content: 'no-siteapp' },
      { 'http-equiv': 'Cache-Control', content: 'no-transform' },
      { 'http-equiv': 'Pragma', content: 'no-cache' }
    ],
    link: [
      { rel: 'dns-prefetch', href: dnsPrefetch[env].js },
      { rel: 'dns-prefetch', href: dnsPrefetch[env].css }
    ],
    script: [
      { src: `${publicStaticsPath}/js/flexible.min.js`, type: 'text/javascript', charset: 'utf-8' },
      {
        src: "https://res2.wx.qq.com/open/js/jweixin-1.4.0.js",// 微信SDK
        type: 'text/javascript',
        defer: "defer",
        charset: 'utf-8'
      }
    ]
  }
}
```

### 接口API路径配置
据我所知，node端调用接口一般走内网域名，服务端之间在内网调用更高效。一开始走过弯路，接口没区分内外网域名，导致node端调用接口偶尔会出现接口调用失败的情况，至少有2%的失败率。
```js
import fetch from "./fetch";

const env = envConfig.exeEnv;
const host = envConfig.host;
const port = envConfig.port;

const devBaseURL = `http://127.0.0.1:${port}`;

let baseURL = {
	dev: {
		mobile: "http://test.mobile.abc.com",
		cmsProm: "http://test.prom.mobile.abc.com"
	},
	test: {
		mobile: "http://test.mobile.abc.com",
		cmsProm: "http://test.prom.mobile.abc.com"
	},
	pre: {
		mobile: "http://pre.mobile.abc.com",
		cmsProm: "http://pre.prom.mobile.abc.com"
	},
	prod: {
		mobile: "https://mobile.abc.com",
		promMobile: "https://prom.mobile.abc.com",
		// 应服务端要求，生产环境下，node层需走内网域名
		innerMobile: "inner.wireless.api",
		innerPromMobile: "inner.prom.wireless.api"
	}
}

// 加载猜你喜欢商品列表（利用process.server和执行环境env判断是否用内网域名）
export function fetchGuessLikeGoodsList(params) {
	return fetch.post(`/wap/product/search/guessLikeGoodsList.jsp`, params.data, Object.assign({
	  baseURL: process.server && env === 'prod' ? baseURL[env]. innerMobile : baseURL[env].mobile
	}, {
	  headers: params.headers
	}))
}
```
补充下执行环境的定义：

```sh
## 在nuxt.config.js中定义 ##
plugins: [
  new webpack.DefinePlugin({
    'envConfig': JSON.stringify({
      exeEnv: process.env.EXE_ENV,
      host: host,
      port: port
    })
  })
]
```

### pm2的一些配置
总所周知，pm2是一款node进程管理工具，内置负载均衡。可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，使用也比较简单。本项目，也是用pm2来管理的，现列举出pm2.json文件的配置：

```sh
{
    "apps": {
        "name": "my-first-ssr", // 应用名称    
        "script": "./server/index.js", // 实际启动脚本
        "cwd": "./", // 当前工作路径
        "args": "", // 传递给脚本的参数
        "interpreter": "", // 指定的脚本解释器
        "interpreter_args": "", // 传递给解释器的参数
        "watch": [ // 监控变化的目录，一旦变化，自动重启
		    "bin",
		    "routers"
		  ],
        "ignore_watch": [ // 从监控目录中排除
            "node_modules",
            "logs"
        ],
        "exec_mode": "cluster_mode", // 应用启动模式，支持fork和cluster模式
        "instances": 8, // 应用启动实例个数，仅在cluster模式有效 默认为fork；或者 max
        "max_memory_restart": "26214M", // 最大内存限制数，超出自动重启
        "error_file": "my-first-ssr/logs/app-err.log", // 错误日志文件
        "out_file": "my-first-ssr/logs/app-out.log", // 正常日志文件
        "merge_logs": true, // 设置追加日志而不是新建日志
        "log_date_format": "YYYY-MM-DD HH:mm:ss", // 指定日志文件的时间格式
        "min_uptime": "60s", // 应用运行少于时间被认为是异常启动
        "max_restarts": 30, // 最大异常重启次数，即小于min_uptime运行时间重启次数；
        "autorestart": true, // 默认为true, 发生异常的情况下自动重启
        "cron_restart": "", // crontab时间格式重启应用，目前只支持cluster模式;
        "restart_delay": 60, // 异常重启情况下，延时重启时间
        "env": {
            "NODE_ENV": "production", // 环境参数，当前指定为生产环境 process.env.NODE_ENV
            "EXE_ENV": "prod", // 生产环境，NODE_ENV会被webpack的mode覆写
            "REMOTE_ADDR": "", // process.env.REMOTE_ADDR
            "HOST": "0.0.0.0",
            "PORT": 9527
        },
        "env_dev": {
            "NODE_ENV": "production", // 环境参数，当前指定为开发环境 pm2 start app.js --env dev
            "EXE_ENV": "dev", // 开发环境，NODE_ENV会被webpack的mode覆写
            "REMOTE_ADDR": "",
            "HOST": "0.0.0.0",
            "PORT": 9527
        },
        "env_uat": {
            "NODE_ENV": "production", // 环境参数，当前指定为测试环境 pm2 start app.js --env uat
            "EXE_ENV": "uat", // uat环境，NODE_ENV会被webpack的mode覆写
            "REMOTE_ADDR": "",
            "HOST": "0.0.0.0",
            "PORT": 9527
        },
        "env_pre": {
            "NODE_ENV": "production", // 环境参数，当前指定为测试环境 pm2 start app.js --env pre
            "EXE_ENV": "pre", // 准生产环境，NODE_ENV会被webpack的mode覆写
            "REMOTE_ADDR": "",
            "HOST": "0.0.0.0",
            "PORT": 9527
        }
    }
}
```

### package.json文件的配置
为了方便本地能调试test/pre/prod环境的接口数据，这里有个小技巧，如下：

```sh
"scripts": {
    "dev": "cross-env EXE_ENV=test NODE_ENV=development nodemon server/index.js --watch server",
    // 方便本地起test环境进行测试环境的调试
    "test": "cross-env EXE_ENV=test PORT=80 NODE_ENV=development nodemon server/index.js --watch server",
    // 方便本地起pre环境进行准生产环境的调试
    "pre": "cross-env EXE_ENV=pre PORT=80 NODE_ENV=development nodemon server/index.js --watch server",
    // 方便本地起prod环境进行生产环境的调试
    "prod": "cross-env EXE_ENV=prod PORT=80 NODE_ENV=development nodemon server/index.js --watch server",
    "build:test": "cross-env EXE_ENV=uat nuxt build",
    "build:pre": "cross-env EXE_ENV=tslive nuxt build",
    "build": "cross-env EXE_ENV=prod nuxt build",
    "start": "cross-env EXE_ENV=dev NODE_ENV=production node server/index.js",
    "generate": "nuxt generate"
},
```

### server/index.js文件的配置
```sh
const Koa = require('koa')
const consola = require('consola')
const path = require('path')
const fs = require('fs')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { Nuxt, Builder } = require('nuxt')
const proxy = require('./proxy');
const mock = require('./mock');

const app = new Koa()
const router = new Router()

router.all('/mock', mock);
router.all('/proxy', proxy);

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

// 导入nuxt.config.js文件
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 9527
  } = nuxt.options.server

  // 开发环境下编译
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

```

### nginx的一些配置
使用nginx作为反向代理，将页面伪静态化，这样有利于SEO：

```sh
proxy_cache_path  /data/nginx/cache levels=1:2 keys_zone=nuxt-cache:25m max_size=1g inactive=60m use_temp_path=off;

map $sent_http_content_type $expires {
    "text/html"                 epoch;
    "text/html; charset=utf-8"  epoch;
    default                     off;
}

server {
    listen          80;             # the port nginx is listening on
    server_name     your-domain;    # setup your domain here

    gzip            on;
    gzip_types      text/plain application/xml text/css application/javascript;
    gzip_min_length 1000;

    charset utf-8;

    root /var/www/NUXT_PROJECT_PATH/dist

    location ~* \.(?:ico|gif|jpe?g|png|woff2?|eot|otf|ttf|svg|js|css)$ {
        expires $expires;
        add_header Pragma public;
        add_header Cache-Control "public";

        try_files $uri $uri/ @proxy;
    }

    location / {
        expires $expires;
        proxy_redirect                      off;
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  $scheme;
        proxy_ignore_headers        Cache-Control;
        proxy_http_version          1.1;
        proxy_read_timeout          1m;
        proxy_connect_timeout       1m;
        # rewrite ^/index.html(.*) /$1 break;
        rewrite ^/store.html(.*) /store$1 break;
        rewrite ^/store\/(\w+).html(\?(.+))? /store?storeid=$1$3 break;
        proxy_pass http://127.0.0.1:9527; // see the address of the Node.js instance here.
    }
}
```

### 项目部署Shell脚本
以部署测试环境为例，我选择了在develop分支上拉取代码，编译完成后，输出zip包的版本号，复制此版本号切到jenkins上进行部署。Talk is cheap，如果还是没怎么理解，那就 Show me the code 吧，简单到只是堆砌了一堆的命令:）

```sh
#!/bin/bash
rm -r src dist
git clone -b develop git@code.ds.abc.com:h5/my-first-ssr.git src
cd src
git pull
# 切公司内部npm私有库
npm set registry http://npm.xxx.com
sudo npm i m-cms-components@latest
npm config set registry https://registry.npmjs.org
sudo npm i
npm run build:test
mkdir -p ../dist/server
cp .nuxt/ ../dist/server -rf
cp config/ ../dist/server -rf
cp static/ ../dist/server -rf
cp server/ ../dist/server -rf
cp nuxt.config.js ../dist/server -f
cp pm2.json ../dist/server -f
cp package.json ../dist/server -f
cp .nuxt/dist/client/ ../dist -rf
cd ../dist/server
npm set registry http://npm.xxx.com
sudo npm i m-cms-components@latest
npm config set registry https://registry.npmjs.org
sudo npm i --production
current=`date "+%Y-%m-%d %H:%M:%S"`
timeStamp=`date -d "$current" +%s`
currentTimeStamp=$((timeStamp*1000+`date "+%N"`/1000000))
# cd dist
cd ../
# 测试环境打包
zip -r ../my-first-ssr-release-$currentTimeStamp.zip .[!.]* *
# cd release
cd ../../
git clone git@code.ds.abc.com:h5/my-first-ssr-release.git release
cd release
git pull
mv ../uat/my-first-ssr-release-$currentTimeStamp.zip ./
git add .
git commit -m"uat-$currentTimeStamp"
git push
#rm ../test/dist -rf
#rm ../test/src -rf
# 编译成功 输出zip包的版本号，复制此版本号切到jenkins上进行部署，万事大吉了！
echo "build completed, version:$currentTimeStamp"
```


## 小结
至此，上面就是本人在项目部署过程中的所有笔记了。从项目需要支持哪些环境出发，到一系列的资源配置，至于部署过程的相关技术就不具体展开讨论了，虽然不是什么最佳实践，我想是可以拿出来分享下的。

