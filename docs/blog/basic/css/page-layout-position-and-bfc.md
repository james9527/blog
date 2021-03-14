---
title: 'html元素定位以及BFC的应用'
sidebar: auto
collapsable: true
author: James9527
---

> 总所周知，css布局中的定位方式有以下几种：static、float、relative、absolute、fixed 和 sticky。那么它们都有哪些区别呢？

## html元素定位方式

### static - 普通流定位（默认方式）

+ 普通流定位，又称为文档流定位，是页面元素的默认定位方式。
+ 页面中的块级元素，按照从上到下的方式逐个排列。
+ 页面中的行内元素，按照从左到右的方式逐个排列。

### float - 浮动定位

浮动float属性取值为left或right。浮动元素会脱离文档流，导致不占据页面空间，所以会对父元素高度带来一定影响，如果一个元素中包含的元素全部是浮动元素，那么该元素高度将变成0（高度塌陷）。浮动元素的几个特点：

+ 浮动定位元素会被排除在文档流之外-脱离文档流(不占据页面空间)，其余的元素要上前补位；
+ 浮动元素会停靠在父元素的左边或右边，或停靠在其他已浮动元素的边缘上(元素只能在当前所在行浮动) ；
+ 浮动元素依然位于父元素之内；
+ 浮动元素处理的问题：可解决多个块级元素在一行内显示的问题；

另外有几个要注意的地方：

1. 一行内，显示不下所有的已浮动元素时，最后一个将换行；
2. 元素一旦浮动起来之后，那么宽度将变成自适应(宽度由内容决定)；
3. 元素一旦浮动起来之后，那么就将变成块级元素,尤其对行内元素，影响最大；
4. 文本用行内块级元素采用环绕的方式来排列时，是不会被浮动元素压在底下的，会巧妙的避开浮动元素。

### relative - 相对（自身）定位

元素会相对于它原来的位置偏移一段距离，改变元素位置后，元素原本的空间依然会被保留。同时，配合着偏移属性(top/right/bottom/left)实现位置的改变。

### absolute - 绝对定位

如果元素被设置为absolute定位的话，将具备以下特征：

+ 脱离文档流，不占据页面空间；
+ 相对于最近的非static定位的祖先元素进行位置固定；
+ 如果没有非static定位的祖先元素，则以body进行定位；
+ 配合着偏移属性(top/right/bottom/left)实现位置的改变；

### fixed - 固定定位

将元素固定在页面的某个位置处，不会随着滚动条而发生位置移动。 同时，配合着偏移属性(top/right/bottom/left)实现位置的改变。

## html标签元素的种类

+ 块级元素：允许修改尺寸，常见的块级标签有div、p、section、ul、li、dl、dt、dd、h1、h3…等等；
+ 行内元素：不允许修改尺寸，要修改可变成行内块级`inline-block`元素，常见的行内标签有a、span、input、select、img、b、strong等。

## 扩展一：什么是BFC

> BFC(Block Formatting Contexts)全称为块级格式化上下文，BFC的最显著的效果就是建立一个隔离的空间，断绝空间内外元素间相互的作用，用俗话讲BFC就是一个独立的不干扰外界也不受外界干扰的盒子。能生成BFC的情况有以下几种：

+ 根元素html或其它包含它的元素；
+ 浮动 (元素的float不为none)；
+ 绝对定位元素 (元素的position为absolute或fixed)；
+ 行内块inline-blocks(元素的`display: inline-block`)；
+ 表格单元格(元素的`display: table-cell`，HTML表格单元格默认属性)，以及 `display: table-caption`，`display：table`也认为可以生成BFC，主要原因在于Table会默认生成一个匿名的table-cell；
+ overflow的值不为visible的元素；
+ 弹性盒 flex boxes (元素的display: flex或inline-flex)；

注意：是这些元素创建了块格式化上下文，它们本身不是块格式化上下文。

## 扩展二：清除浮动方法
已知如下html结构和样式：

```html
<div class="container">
	<div class="child1">child1</div>
	<div class="child2">child2</div>
	<div class="clearfix"></div>
</div>
```

```css
<style>
*, *::before, *::after {
  box-sizing: border-box;
}
.container{
  background: yellowgreen;
}
.container .child1 {
  float: left;
  width: 100px;
  height: 80px;
  background-color: #f00;
}
.container .child2 {
  float: left;
  width: 100px;
  height: 60px;
  background-color: #0f0;
}
</style>
```

清除浮动主要有以下两种方法：

```css
<style>
/**问题：浮动导致父级元素高度塌陷（即height为0），如果清除了浮动，父容器的高度则以高度最高的子元素为准
*  方法一：在浮动元素下方，添加一个空div且用以下样式定义
*/
.container .clearfix {
  clear: both;
  height: 0;
  overflow: hidden;
}

/**
* 方法二：万能清除法：利用父容器的伪类:after清除（推荐使用）
*/
.container::after {
  content: '.';
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
  /* 可选 */
  overflow: hidden;
}

/**
* 方法三：在子元素有固定的高度情况下，可以给父元素设置高度
*/

/**
* 方法四：采用overflow: hidden，原理是生成一个BFC，会把浮动元素的高度也计算在内。
*/
</style>
```