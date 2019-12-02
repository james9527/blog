---
title: 'Webpack随手记'
sidebar: auto
collapsable: true
---

# Webpack随手记

> 本文记录了一些webpack的核心功能，包含名词解释以及使用场景等，欢迎大家补充...

## 简述下Webpack的构建流程
1. 初始化：启动构建，读取与合并配置参数，加载相应的Plugins，实例化Compiler；
2. 编译：从entry出发，针对每个module串行调用对应的loader去翻译文件内容，再找到该module依赖的module，递归地进行编译处理；
3. 输出：对编译后的module组合成chunk，再把chunk转换成文件，输出到output指定目录下；

## Tree Shaking的理解
> 你可以将应用程序想象为一棵树。实际使用的源代码和库表示树的绿色活叶，死亡代码代表了被秋天消耗掉的棕色枯叶。为了除掉枯叶，你必须摇动这棵树，使它们落下，这就是所谓的“摇树优化”。

Webpack4里，配置参数mode为production(即生产环境)时，默认开启了Tree Shaking功能，若值为none则关闭了Tree Shaking。例如值引用了loadsh的isEqual方法，打包时只打引用过的模块。所以，我们为了利用[Tree Shaking](https://webpack.js.org/guides/tree-shaking/#root)的优势，建议如下：

+ 使用ES2015模块语法（如import 和 export）；
+ 确保没有编译器将ES2015模块语法转换为CommonJS模块（这是流行的babel preset@babel/preset env的默认行为-有关详细信息，[请参阅文档](https://www.babeljs.cn/docs/babel-preset-env)）；
+ 将”sideEffects“(副作用)属性添加到项目的package.json文件中；
+ 使用生产模式配置选项启用各种优化，包括压缩和Tree Shaking；

## Scope Hoisting的理解
  > 原理：将所有模块的代码按照引用顺序放在一个函数作用域里 ，然后适当的重命名一些变量以防止变量名冲突。通过scope hoisting可减少函数声明代码合内存开销。
  
如果不开启scope hoisting，会导致大量作用域包裹代码，导致体积增大（模块越多越明显），运行代码时创建的函数作用域变多（大量的IIFE匿名闭包），内存开销大。
  
+ Webpack4环境，配置参数mode为production(即生产环境)时，默认开启了scope hoisting功能。
+ Webpack3环境，需要在plugins里手动配置，<code>new webpack.optimize.ModuleConcatenationPlugin()</code>，会将es6里的import转换成__webpack__require__，export转换成__webpack_exports__。

## Code Splitting的理解
> 代码拆分是Webpack最引人注目的特性之一。此功能允许您将代码拆分为各种捆绑包，然后可以按需或并行加载。它可以用来实现更小的捆绑包和控制资源负载优先级，如果正确使用，这会对加载时间产生重大影响。

有三种通用的代码拆分方法：

1. 入口点：使用入口配置手动拆分代码。
2. 防止重复：使用SplitChunksPlugin来删除和拆分块。
3. 动态导入：通过模块内的内联函数调用拆分代码。

## file-loader和url-loader的区别
> url-loader内部使用了file-loader，都可以处理图片和字体，不过url-loader还可以将较小资源转化成base64字符串。

+ file-loader：文件加载器将文件的import/require()解析为URL，并将文件发送到输出目录。
+ url-loader：用于将文件转换为base64 URI的Webpack加载程序。

## 聊聊热更新的实现
> 本话题主要想讲webpack-dev-server 与 hot-module-replacement-plugin之间的关系，需要从两者的功能上来分析说明。

单独写两个包也是出于功能的解耦来考虑的。简单来说就是：hot-module-replacement-plugin 包给 webpack-dev-server 提供了热更新的能力。

+ webpack-dev-server(WDS)的功能提供 bundle server的能力，就是生成的 bundle.js 文件可以通过 localhost://xxx 的方式去访问，另外 WDS 也提供 livereload(浏览器的自动刷新)。
+ hot-module-replacement-plugin 的作用是提供 HMR 的 runtime，并且将 runtime 注入到 bundle.js 代码里面去。一旦磁盘里面的文件修改，那么 HMR server 会将有修改的 js module 信息发送给 HMR runtime，然后 HMR runtime 去局部更新页面的代码。因此这种方式可以不用刷新浏览器。

## webpack-dev-server的理解
> webpack-dev-server 是webpack-dev-middleware的封装版，细聊一下webpack-dev-middleware灵活的场景？

+ webpack-dev-server实际上相当于启用了一个express的Http服务器+调用webpack-dev-middleware。它的作用主要是用来伺服资源文件。这个Http服务器和client使用了websocket通讯协议，原始文件作出改动后，webpack-dev-server会用webpack实时的编译，再用webpack-dev-middleware将webpack编译后文件会输出到内存中。适合纯前端项目，很难编写后端服务，进行整合。
+ webpack-dev-middleware输出的文件存在于内存中。你定义了 webpack.config，webpack 就能据此梳理出entry和output模块的关系脉络，而 webpack-dev-middleware 就在此基础上形成一个文件映射系统，每当应用程序请求一个文件，它匹配到了就把内存中缓存的对应结果以文件的格式返回给你，反之则进入到下一个中间件。

## 文件名hash值
+ hash，如果都使用hash的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。
+ chunkhash，它可根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响，并且webpack4中支持了异步import功能。
+ contenthash，它是针对文件内容级别的，只有你自己模块的内容变了，那么hash值才改变。

## vue-cli中webpack相关配置
### webpack.dev.conf.js

> 该文件是开发环境中webpack的配置入口。

```js
// 工具函数集合
var utils = require('./utils')
var webpack = require('webpack')
// 配置文件
var config = require('../config')
// webpack 配置合并插件
var merge = require('webpack-merge')
// webpack基本配置
var baseWebpackConfig = require('./webpack.base.conf')
// 自动生成 html 并且注入到 .html 文件中的插件
// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack错误信息提示插件
// https://github.com/geowarin/friendly-errors-webpack-plugin
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 将 Hot-reload 热重载的客户端代码添加到 webpack.base.conf 的 对应 entry 中，一起打包
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    // styleLoaders
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // 最新的配置为 cheap-module-eval-source-map，虽然 cheap-module-eval-source-map更快，但它的定位不准确
  // 所以，换成 eval-source-map
  devtool: '#eval-source-map',
  plugins: [
    // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
    // 此处，插入适当的环境
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // HotModule 插件在页面进行变更的时候只会重绘对应的页面模块，不会重绘整个 html 文件
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 将 index.html 作为入口，注入 html 代码后生成 index.html文件
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true //默认值，script标签位于html文件的 body 底部
    }),
    // webpack错误信息提示插件
    new FriendlyErrorsPlugin()
  ]
})
```



### webpack.base.conf.js

> 这个文件是开发环境和生产环境，甚至测试环境，这些环境的公共webpack配置。

```javascript
// node自带的文件路径工具
var path = require('path')
// 工具函数集合
var utils = require('./utils')
  // 配置文件
var config = require('../config')
  // 工具函数集合
var vueLoaderConfig = require('./vue-loader.conf')

/**
 * 获得绝对路径
 * @method resolve
 * @param  {String} dir 相对于本文件的路径
 * @return {String}     绝对路径
 */
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    // 编译输出的静态资源根路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: '[name].js',
    // 正式发布环境下编译输出的上线路径的根路径
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    // 自动补全的扩展名
    extensions: ['.js', '.vue', '.json'],
    // 路径别名
    alias: {
      // 例如 import Vue from 'vue'，会自动到 'vue/dist/vue.common.js'中寻找
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [{
        // 审查 js 和 vue 文件
        // https://github.com/MoOx/eslint-loader
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        // 表示预先处理
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        // 处理 vue文件
        // https://github.com/vuejs/vue-loader
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        // 编译 js
        // https://github.com/babel/babel-loader
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        // 处理图片文件
        // https://github.com/webpack-contrib/url-loader
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        // 处理字体文件
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
```



### config/index.js

> 是主要的配置文件，包含静态文件的路径、是否开启sourceMap等。其中，分为两个部分`dev`（开发环境的配置）和`build`（生产环境的配置）。

```javascript
// 详情见文档：https://vuejs-templates.github.io/webpack/env.html
var path = require('path')

module.exports = {
  // production 生产环境
  build: {
    // 构建环境
    env: require('./prod.env'),
    // 构建输出的index.html文件
    index: path.resolve(__dirname, '../dist/index.html'),
    // 构建输出的静态资源路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 构建输出的二级目录
    assetsSubDirectory: 'static',
    // 构建发布的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: '/',
    // 是否开启 cssSourceMap
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 默认关闭 gzip，因为很多流行的静态资源主机，例如 Surge、Netlify，已经为所有静态资源开启gzip
    productionGzip: false,
    // 需要使用 gzip 压缩的文件扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 运行“build”命令行时，加上一个参数，可以在构建完成后参看包分析报告
    // true为开启，false为关闭
    bundleAnalyzerReport: process.env.npm_config_report
  },
  // dev 开发环境
  dev: {
    // 构建环境
    env: require('./dev.env'),
    // 端口号
    port: 3333,
    // 是否自动打开浏览器
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    // 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: '/',
    // proxyTable 代理的接口（可跨域）
    // 使用方法：https://vuejs-templates.github.io/webpack/proxy.html
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    // 默认情况下，关闭 CSS Sourcemaps，因为使用相对路径会报错。
    // CSS-Loader README：https://github.com/webpack/css-loader#sourcemaps
    cssSourceMap: false
  }
}
```





### utils.js

> 也是一个被使用频率的文件，这个文件包含了三个工具函数：

- 生成静态资源的路径
- 生成 ExtractTextPlugin对象或loader字符串
- 生成 style-loader的配置

```javascript
// node自带的文件路径工具
var path = require('path')
// 配置文件
var config = require('../config')
// 提取css的插件
// https://github.com/webpack-contrib/extract-text-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin')

/**
 * 生成静态资源的路径
 * @method assertsPath
 * @param  {String}    _path 相对于静态资源文件夹的文件路径
 * @return {String}          静态资源完整路径
 */
exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
    //  path.posix.join与path.join一样，不过总是以 posix 兼容的方式交互
  return path.posix.join(assetsSubDirectory, _path)
}

/**
 * 生成处理css的loaders配置
 * @method cssLoaders
 * @param  {Object}   options 生成配置
 *                            option = {
 *                              // 是否开启 sourceMap
 *                              sourceMap: true,
 *                              // 是否提取css
 *                              extract: true
 *                            }
 * @return {Object}           处理css的loaders配置对象
 */
exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  /**
   * 生成 ExtractTextPlugin对象或loader字符串
   * @method generateLoaders
   * @param  {Array}        loaders loader名称数组
   * @return {String|Object}        ExtractTextPlugin对象或loader字符串
   */
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        // 例如，sass?indentedSyntax
        // 在?号前加上“-loader”
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // extract为true时，提取css
    // 生产环境中，默认为true
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

/**
 * 生成 style-loader的配置
 * style-loader文档：https://github.com/webpack/style-loader
 * @method styleLoaders
 * @param  {Object}     options 生成配置
 *                              option = {
 *                                // 是否开启 sourceMap
 *                                sourceMap: true,
 *                                // 是否提取css
 *                                extract: true
 *                              }
 * @return {Array}              style-loader的配置
 */
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
```





### build.js

> 该文件，为构建打包文件，会将源码进行构建（编译、压缩等）后打包。

```javascript
// 设置当前环境为生产环境
process.env.NODE_ENV = 'production'

// loading 插件
// https://github.com/sindresorhus/ora
var ora = require('ora')
// 可以在 node 中执行`rm -rf`的工具
// https://github.com/isaacs/rimraf
var rm = require('rimraf')
// node自带的文件路径工具
var path = require('path')
// 在终端输出带颜色的文字
// https://github.com/chalk/chalk
var chalk = require('chalk')
var webpack = require('webpack')
// 配置文件
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

// 在终端显示loading效果，并输出提示
var spinner = ora('building for production...')
spinner.start()

// 删除这个文件夹 （递归删除）
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  // 构建
  webpack(webpackConfig, function (err, stats) {
    // 构建成功

    // 停止 loading动画
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    // 打印提示
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
```





### webpack.prod.conf

> 该文件，为生产环境中webpack的配置入口。同时，它也依赖于前面提到的`webpack.base.conf.js`、`utils.js`和`config/index.js`。

```javascript
// node自带的文件路径工具
var path = require('path')
// 工具函数集合
var utils = require('./utils')
var webpack = require('webpack')
// 配置文件
var config = require('../config')
// webpack 配置合并插件
var merge = require('webpack-merge')
// webpack 基本配置
var baseWebpackConfig = require('./webpack.base.conf')
// webpack 复制文件和文件夹的插件
// https://github.com/kevlened/copy-webpack-plugin
var CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成 html 并且注入到 .html 文件中的插件
// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 提取css的插件
// https://github.com/webpack-contrib/extract-text-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// webpack 优化压缩和优化 css 的插件
// https://github.com/NMFR/optimize-css-assets-webpack-plugin
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

// 如果当前环境为测试环境，则使用测试环境
// 否则，使用生产环境
var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    // styleLoaders
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  // 是否开启 sourceMap
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    // 编译输出的静态资源根路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 没有指定输出名的文件输出的文件名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
    // 此处，插入适当的环境
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩 js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // 提取 css
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // 压缩提取出来的 css
    // 可以删除来自不同组件的冗余代码
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // 将 index.html 作为入口，注入 html 代码后生成 index.html文件
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // 更多选项 https://github.com/kangax/html-minifier#options-quick-reference
      },
      // 必须通过 CommonsChunkPlugin一致地处理多个 chunks
      chunksSortMode: 'dependency'
    }),
    // 分割公共 js 到独立的文件
    // https://webpack.js.org/guides/code-splitting-libraries/#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // node_modules中的任何所需模块都提取到vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 将webpack runtime 和模块清单 提取到独立的文件，以防止当 app包更新时导致公共 jsd hash也更新
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // 复制静态资源
    // https://github.com/kevlened/copy-webpack-plugin
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

// 开启 gzip 的情况时，给 webpack plugins添加 compression-webpack-plugin 插件
if (config.build.productionGzip) {
    // webpack 压缩插件
    // https://github.com/webpack-contrib/compression-webpack-plugin
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  // 向webpackconfig.plugins中加入下方的插件
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

// 开启包分析的情况时， 给 webpack plugins添加 webpack-bundle-analyzer 插件
if (config.build.bundleAnalyzerReport) {
  // https://github.com/th0r/webpack-bundle-analyzer
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
```



---



## webpack工具整理

-  **wbpack-bundle-analyzer** （ 动态化显示打包js大小 ）

```javascript
1、在package.json加入这行命令 “analyz”: “NODE_ENV=production npm_config_report=true npm run build”

2、安装webpack-bundle-analyzer  cnpm install --save-dev webpack-bundle-analyzer

3、在webpack.config.js里增加如下代码

  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

 	// ...

 plugins: [new BundleAnalyzerPlugin()]

	// ...

4、另一种写法 （webpack.prod.config.js）
  if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }

5、运行analyz  npm run analyz 默认会打开 [http://127.0.0.1:8888](http://127.0.0.1:8888/) 作为展示
```



- config/index.js中 build下

  productionSourceMap:true 改为 false // 否则生产环境可以看到源码

  productionGzip: false,  // true 开启gzip压缩

  ```javascript
  		// 在设置为 `true`之前, 确保安装了compression-webpack-plugin开发依赖
      // npm install --save-dev compression-webpack-plugin
      productionGzip: true,
      productionGzipExtensions: ['js', 'css'],
  ```

  