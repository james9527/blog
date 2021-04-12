## 理解document.compatMode

> document.compatMode是一个枚举值（enumerated value），可能的值有：

+ "BackCompat"：文档为怪异模式。
+ "CSS1Compat"：文档不是怪异模式，意味着文档处于标准模式或者准标准模式。

IE对盒模型的渲染在 Standards Mode和Quirks Mode是有很大差别的，在Standards Mode下对于盒模型的解释和其他的标准浏览器是一样，但在Quirks Mode模式下则有很大差别，而在不声明Doctype的情况下，IE默认又是Quirks Mode。所以为兼容性考虑，我们可能需要获取当前的文档渲染方式。`document.compatMode`正好派上用场，它有两种可能的返回值：`BackCompat`和`CSS1Compat`。

+ BackCompat：标准兼容模式关闭。浏览器客户区宽度是`document.body.clientWidth`；
+ CSS1Compat：标准兼容模式开启。 浏览器客户区宽度是`document.documentElement.clientWidth`；

```css
let cWidth,cHeight,sWidth,sHeight,sLeft,sTop;
if (document.compatMode === "BackCompat") { // 怪异模式
   cWidth = document.body.clientWidth;
   cHeight = document.body.clientHeight;
   sWidth = document.body.scrollWidth;
   sHeight = document.body.scrollHeight;
   sLeft = document.body.scrollLeft;
   sTop = document.body.scrollTop;
}else { // 标准模式
   //document.compatMode === "CSS1Compat"
   cWidth = document.documentElement.clientWidth;
   cHeight = document.documentElement.clientHeight;
   sWidth = document.documentElement.scrollWidth;
   sHeight = document.documentElement.scrollHeight;
   sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
   sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
}
```