---
title: 'webpack编译vue-lazyload依赖报错'
sidebar: auto
collapsable: true
---

> 本文主要记录webpack编译node_modules依赖时，一些编译失败案例：

## vue-lazyload开源组件

### babel-loader编译时报错
```sh
ERROR  Failed to compile with 1 errors    18:10:37
 error  in ./node_modules/vue-lazyload/vue-lazyload.esm.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
ReferenceError: Unknown plugin "external-helpers" specified in "/Users/liujingfa/Documents/projects/plus-m-club/node_modules/vue-lazyload/.babelrc" at 0, attempted to resolve relative to "/Users/liujingfa/Documents/projects/plus-m-club/node_modules/vue-lazyload"
    at /Users/liujingfa/Documents/projects/plus-m-club/node_modules/babel-core/lib/transformation/file/options/option-manager.js:180:17
```
解决方案：babel-loader在转换js文件时，忽略掉对`vue-lazyload`的编译即可。问题来了，babel-loader编译js文件时，为何不直接忽略整个node_modules编译？因为公司内部的组件库有部分是需要进行编译才能用的。于是用以下方案解决此问题：

### 解决方案

```js
// bin/loadersConfig.js
{
    test: /\.js$/,
    use: 'babel-loader',
    // 排除babel-loader对vue-lazyload的编译
    exclude: /node_modules\/vue-lazyload/
}
```

以上错误在mac和windows系统下必现。有趣的是，mac系统用了以上解决方案即可正常编译，windows系统则不行，这让用windows系统的同事愁了半天，后来想着先忽略整个`node_modules`的编译，然后再还原回`exclude: /node_modules\/vue-lazyload/`即正常了。

然鹅，过了几天，另一个用windows系统的同事又遇到另一个错误，如下所示：

```sh
Uncaught ReferenceError: babelHelpers is not defined
    at Function.ansiHTML.setColors (index.js:94)
    at eval (webpack:///(/webpack)-hot-middleware/client-overlay.js?:42:10)
    at Object.QTqD (my_coupon.js:2581)
    at __webpack_require__ (my_coupon.js:790)
    at fn (my_coupon.js:101)
    at createReporter (webpack:///(/webpack)-hot-middleware/client.js?:136:15)
    at Object.eval (webpack:///(/webpack)-hot-middleware/client.js?:126:28)
    at eval (webpack:///(/webpack)-hot-middleware/client.js?:245:30)
    at Object.+2aP (my_coupon.js:881)
    at __webpack_require__ (my_coupon.js:790)
```

本质原因是vue-lazyload.js 的babelrc配置里面添加了 babelHelpers 这个插件，然后运行的时候报错了。

```js
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ],
  "plugins": [
    "external-helpers"
  ]
}
```

解决方案依然是在webpack配置中排除babel-loader对vue-lazyload的编译即可，操作也是先忽略整个`node_modules`的编译，然后再还原回`exclude: /node_modules\/vue-lazyload/`即正常了。此时，让我唯一的感慨：前端开发配mac电脑才是标配啊！不然只能拖慢开发效率，导致协作开发也不愉快…


## 参考资料

+ [Module build failed: ReferenceError: Unknown plugin "external-helpers"](https://github.com/hilongjw/vue-lazyload/issues/233)