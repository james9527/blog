---
title: 'autoprefixer插件引发样式丢失'
sidebar: auto
collapsable: true
---

## 关于autoprefixer插件 编译后丢失部分样式问题

> 昨天1024遇到一问题，代码打包后丢失了样式`-webkit-box-orient: vertical;`在浏览器中没生效，审查元素工具也没有此样式，后经查看原来是autoprefixer的问题。

### 方案一：样式加注释

```css
/* autoprefixer: off */
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  /* autoprefixer: on */
```
找到对应样式文件，添加上面注释即可：

```css
// 文本超出两行隐藏
.twoLineEllipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  /* autoprefixer: on */
  line-clamp: 2;
  -webkit-line-clamp: 2;
  word-break: break-all;
  -ms-word-break: break-all;
  word-wrap: break-word;
}
```

### 方案二：修改webpack配置

在webpack编译生产环境配置`webpack.prod.conf.js`文件上作修改，增加`autoprefixer: { remove: false}`

```js
config.plugins.push(new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
        discardComments: {
            removeAll: true,
        },
        discardOverridden: false,
        safe: true,
        autoprefixer: { remove: false}
    },
    canPrint: true,
}))
config.plugins.push(new OptimizeCssAssetsPlugin({
    cssProcessor: require('autoprefixer'),
}))
```