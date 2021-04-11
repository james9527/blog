---
title: 'position之fixed属性兼容性'
sidebar: auto
collapsable: true
---

## IOS底部fixed定位失效问题

> 解决办法：要把带fixed定位的元素，和滚动的元素分开来，不要混了层级，头部，底部都拿到外面来，如下：

```html
<body>
    <div class="header">头部</div>
    <div class="main">
        <div class="content">
            <!-- 内容区域（可以滚动的区域） -->
        </div>
    </div>
    <footer class="footer"> 
        <!-- fixed定位的底部 -->
        <input type="text" placeholder="请输入姓名">
    </footer>
</body>
```

```css
.header,.footer,.main {
    display: block;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
}

.main {
    /*main绝对定位，进行内部滚动*/
    position: absolute;
    /*top是头部的高度*/
    top: 100px;
    /*bottom是底部的高度*/
    bottom: 30px;
    /*使之可以滚动*/
    overflow-y: scroll;
    /*增加弹性滚动,解决滚动不流畅的问题*/
    -webkit-overflow-scrolling: touch;
}

.main .content {
    height: 2000px;
}
```