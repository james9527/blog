---
title: '深入webpack'
sidebar: auto
collapsable: true
---
# 深入webpack
近期，我们需要做前端项目的性能优化，由于我们的项目都是基于webpack构建，所以很有必要带领团队深入了解一下webpack。

本文作为团队内部培训的前置自学资料，建议参加人员先了解一下当前最新稳定版本 webpack 4.x的日常使用，技术分享的效果会更好！

本文侧重以问答形式，便于大家掌握webpack的核心概念，系统学习建议先简单过一下中文官网，然后详细看一下英文文档！

因为当前我们的项目以webpack3为主，计划逐步升级过度到webpack4，因此我们分享时，重点深入源码，探寻webpack4与3的区别，并简要介绍一下即将发布的webpack5。

## 官方文档
- [英文网 https://webpack.js.org/guides/](https://webpack.js.org/guides/)
- [中文网 https://www.webpackjs.com/](https://www.webpackjs.com/)

## 什么是webpack？
官方定义为一个JS静态模块打包器，通过loader处理非 JS文件，通过plugins 来拓展功能。

本质上webpack是跑在nodejs环境一个工具合集，它的很多功能我们不用其他语言，直接linux使用shell脚本也可以实现，只是效率低一些。

可以说，是webpack 带火了nodejs，因为现代的前端主流框架基本都基于它构建。

## webpack的loader有什么作用？
在 import 或"加载"模块时对模块的源代码进行转换，类似于其他构建工具中“任务(task)”，如可以使用 loader 告诉 webpack 加载 CSS 文件，或者将 TypeScript 转为 JavaScript。

## webpack的plugins有什么作用？
webpack的核心是一个编译器，而插件则用于执行编译过程中某些特定的功能，通过 plugin 可以解决 loader 解决不了的问题，如打包优化和压缩等，功能极其强大，可以用来处理各种各样的任务。

webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

## webpack 插件有什么特点？
- 独立的 JS 模块，暴露相应的函数
- 函数原型上的 apply 方法会注入 compiler 对象
- compiler 对象上挂载了相应的 webpack 事件钩子
- 事件钩子的回调函数里能拿到编译后的 compilation 对象，如果是异步钩子还能拿到相应的 callback

## webpack4与3的区别？
webpack3配置灵活多变，不好控制，使得学习、使用、研究webpack的成本过高（进阶曲线太陡），构建一个小应用也需要像构建大应用那样配置 webpack.config.js。

因此，webpackk4和3最大的区别就是，可以不使用 webpack.config.js 配置文件，增加了很多默认配置项，针对不了解webpack的人员或小应用开发的场景，这样做无异省时省力。

webpackk4在没有 webpack.config.js 的情况下，我们可以在命令行中添加入口/出口配置项。

但是原来 webpack.config.js 配置文件中的 module 和 plugins 配置项中的功能实现还是需要使用 webpack.config.js。

总结如下：
- webpack增加了一个mode配置，只有两种值development | production；
- 默认生产环境开起了很多代码优化；
- 生产环境不支持watching，开发环境优化了打包的速度；
- 生产环境开启模块串联（原ModulecondatenationPlugin）；
- 自动设置process.env.NODE_EVN到不同环境，也就是不使用DefinePlugin了；
- 删除CommonsChunkPlugin，改成使用optimization.splitChunks进行模块划；
- 只需要使用optimization.minimize为true进行压缩，不再需要引入UglifyJsPlugin；

## webpack 5有哪些新特性？
### 官方描述：
- 使用持久化缓存提高构建性能；
- 使用更好的算法和默认值改进长期缓存（long-term caching）；
- 清理内部结构而不引入任何破坏性的变化；
- 引入一些breaking changes，以便尽可能长的使用v5版本。

### 通俗版描述：
- 减小打包后的文件体积
- 按需加载支持文件名模式
- 使用long-term caching解决生产环境下moduleIds & chunkIds变化的问题
- 使用cache: {type: "filesystem"}配置实现持久化缓存，提高构建速度
- 优化minSize&maxSize的配置方式
- Node.js polyfills 自动加载功能被移除


