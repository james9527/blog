---
title: 'linear-gradient()原理'
sidebar: auto
collapsable: true
---

> CSS函数linear-gradient()创建一个图像，该图像代表颜色的线性渐变。结果是一个CSS对象，类型`gradient`是的一种特殊形式image。

像任何其他梯度一样，线性梯度也没有 内在维数。也就是说，它没有预设或自然大小，也没有纵横比。其特定大小将调整为适用于它的元素的大小。
线性渐变由轴（渐变线）定义，其中每个点表示不同颜色的起点。垂直于所述线的梯度线 有一个单一的颜色，对每个点的梯度线。

渐变线由包含渐变图像的框的中心和角度定义。渐变的颜色由不同的点定义。起点，终点和中间的可选颜色变化点。
起点是渐变线上颜色开始的点。它是由渐变线与其垂直线之间的交点定义的，该线穿过同一象限中的容器角。
同样，终点是渐变线上到达颜色终点的点。它也由容器的最近角所产生的梯度线和垂直线之间的交点定义，但是当反射点与容器盒的中心重合时，更容易找到起点的对称性。

起点和终点的这些有点复杂的定义将我们引向一个有趣的属性，称为“魔角”  ：最接近起点和终点的角与各自的起点和终点具有相同的颜色。
您不仅可以指定起点和终点的颜色，还可以指定更多。通过在渐变线上的更改点定义其他颜色，Web开发人员可以在开始和结束颜色之间创建更个性化的过渡，或生成多色渐变。

线性渐变函数的语法不允许重复渐变，但是通过使用颜色变化点，可以产生类似的效果。对于真正的渐变重复，可以使用CSS属性repeating-linear-gradient。
如果隐式定义了色标点的位置，则将其放置在色标点之前和之后的中间。也可以使用`length`或`percentage`CSS数据类型明确定义位置。

渐变定义为CSSimage数据类型。因此，它们可以在CSS中任何需要图像数据类型的地方使用。但是，Gecko当前仅支持CSS渐变作为background-image属性的值以及简写形式background。
因此，它将linear-gradient无法使用background-color，其他属性也无法使用`color`。

## 句法

```css
linear-gradient( 45deg, blue, red );           /* A gradient on 45deg axis starting blue and finishing red */
linear-gradient( to left top, blue, red);      /* A gradient going from the bottom right to the top left starting blue and
                                                  finishing red */

linear-gradient( 0deg, blue, green 40%, red ); /* A gradient going from the bottom to top, starting blue, being green after 40%
                                                  and finishing red */
```

`side-or-corner`表示渐变线起点的位置。它由两个关键字组成：第一个关键字指示水平边left或right，第二个关键字指示垂直边top或bottom。顺序无关紧要，每个关键字都是可选的。值`to top，to bottom，to left和to right`分别被转换成角度`0deg，180deg，270deg，90deg`。其他的则转换为一个角度，该角度使起点与所描述的拐角处在同一象限中，从而使起点和拐角所定义的线垂直于渐变线。这样，所描述的颜色`color-stop`将完全适用于拐角点。有时称为“魔角”属性。渐变线的终点是中心框另一方向上起点的对称点。

```css
//例如：
background-image: linear-gradient(90deg, #FF5FD2 0%, #B20FD3 100%); 
等同 
background-image: linear-gradient(to right, #FF5FD2 0%, #B20FD3 100%);
```

`angle`渐变的方向角。请参阅[angle](https://developer.mozilla.org/es/docs/Web/CSS/angle)。
`color-stop`该值由一个`color`值组成，后跟一个可选的停止位置（`length`沿梯度轴的百分比或a ）。CSS渐变中色标的渲染遵循与SVG渐变中色标相同的规则。


### 带有多个色标的渐变
如果第一个色标没有`length`或`percentage`，则默认为0％。如果最后一个色标没有`length`或`percentage`，则默认为100％。如果色标没有指定的位置，并且不是第一个或最后一个色标，则将其分配为上一个色标和下一个色标之间一半的位置。
必须按顺序指定色标。在根据需要为第一个和最后一个停靠点分配默认值之后，如果一个色标的指定位置小于列表中任何一个色标的指定位置，则其位置将更改为等于最大位置色标之前的指定位置。
渐变制成的彩虹。

```css
background: linear-gradient(to right, red, orange, yellow, green, blue, indigo,violet;
```

### 重复线性渐变
所述linear-gradient不允许重复梯度。默认情况下，渐变将拉伸以填充其上定义的元素。有关此功能，请参见repeating-linear-gradient。
使用透明度
线性与透明度
```css
background-image: linear-gradient(to bottom right, red, rgba(255,0,0,0));
```

background-size如果使用固定单位指定所有点和长度（而不是相对于或相对于的值的百分比或关键字），则渐变背景不会受到影响background-size。

## 笔记
如果background-image将`body`标记的属性设置为linear-gradient，则除非min-height将文档根目录（例如`html`标记）的属性设置为100％，否则渐变将不会填充浏览器屏幕。

## 参考
[MDN文档 -- linear-gradient()](https://developer.mozilla.org/es/docs/Web/CSS/linear-gradient())