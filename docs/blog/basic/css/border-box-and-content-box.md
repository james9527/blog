---
title: 'W3C标准盒模型与IE盒模型'
sidebar: auto
collapsable: true
---

## W3C标准盒模型与IE盒模型

> 盒子模型有两种：W3C盒模型和IE盒模型。

css3的box-sizing属性给了开发者选择盒模型解析方式的权利。
W3C的盒模型方式被称为“content-box”，IE的被称为“border-box”，使用box-sizing: border-box;就是为了在设置有padding值和border值的时候不把宽度撑开。

`content-box`默认值，标准盒子模型。 width 与 height 只包括内容的宽和高， 不包括边框（border），内边距（padding），外边距（margin）。注意: 内边距, 边框 & 外边距 都在这个盒子的外部。 比如. 如果 .box {width: 350px}; 而且 {border: 10px solid black;} 那么在浏览器中的渲染的实际宽度将是370px;

尺寸计算公式：

+ width = border + padding + 内容的宽度
+ height = border + padding + 内容的高度
padding-box  
width 和 height 属性包括内容和内边距，但是不包括边框和外边距。只有Firefox实现了这个值，它在Firefox 50中被删除。
一些专家甚至建议所有的Web开发者们将所有的元素的box-sizing都设为border-box。

```css
*, *:before, *:after {
  /* Chrome 9-, Safari 5-, iOS 4.2-, Android 3-, Blackberry 7- */
  -webkit-box-sizing: border-box; 
  /* Firefox (desktop or Android) 28- */
  -moz-box-sizing: border-box;
  /* Firefox 29+, IE 8+, Chrome 10+, Safari 5.1+, Opera 9.5+, iOS 5+, Opera Mini Anything, Blackberry 10+, Android 4+ */
  box-sizing: border-box;
}
```

> IE盒模型与案例：

![IE盒模型_原理.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00d7b00ebcaa4cab996b1a73c9eb441c~tplv-k3u1fbpfcp-watermark.image)
![IE盒模型_实例.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1cb0e84ced340148f971a0e32dbe2bd~tplv-k3u1fbpfcp-watermark.image)

> W3C标准盒模型与案例：

![W3C标准盒模型_原理.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90a776f4fa7749289111ef8a2bfab430~tplv-k3u1fbpfcp-watermark.image)
![W3C标准盒模型_实例.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26f3c21c730148ae87dfbb6bf3a53a65~tplv-k3u1fbpfcp-watermark.image)
