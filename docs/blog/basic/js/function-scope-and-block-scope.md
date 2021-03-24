---
title: '函数作用域和块作用域'
sidebar: auto
collapsable: true
author: James9527
---

# 函数作用域和块级作用域

## 1.1  函数作用域
我们已经知道，在任意代码片段外部添加包装函数，可以将内部的变量和函数定义“隐藏”起来，外部作用域无法访问包装函数内部的任何内容。
> 区分函数声明和表达式最简单的方法是看 function 关键字出现在声明中的位 置(不仅仅是一行代码，而是整个声明中的位置)。如果 function 是声明中 的第一个词，那么就是一个函数声明，否则就是一个函数表达式。（诀窍：左声明右表达式）

### 1.1.1  匿名和具名
对于函数表达式你最熟悉的场景可能就是回调参数了，比如:

```js
setTimeout( function() {
  console.log("I waited 1 second!");
}, 1000 );
```

匿名函数表达式书写起来简单快捷，但是也有缺点：

 * 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难；
 * 如果没有函数名，当函数需要引用自身时只能使用已经过期的`arguments.callee`引用， 比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。

 ### 1.1.2 立即执行函数表达式（IIFE）
 由于函数被包含在一对 ( ) 括号内部，因此成为了一个表达式，通过在末尾加上另外一个 ( ) 可以立即执行这个函数，比如 (function foo(){ .. })()。第一个 ( ) 将函数变成表 达式，第二个 ( ) 执行了这个函数。
 
 ```js
 var a = 2;
(function foo() { 
  var a = 3;
  console.log( a ); // 3
})();
console.log( a ); // 2
 ```
 
 IIFE 的另一个非常普遍的进阶用法是把它们当作函数调用并传递参数进去。把window当作参数传递进去，可以实现两个IIFE表达式互相访问了。
 
 ```js
var a = 2;
(function IIFE( global ) {
  var a = 3;
  console.log( a ); // 3 
  console.log( global.a ); // 2
})( window );
console.log( a ); // 2
 ```
 
## 2.1  块作用域
> 至少从 ES3 发布以来，JavaScript 中就有了块作用域，而 with 和 catch 分句就是块作用域的两个小例子。但随着 ES6 中引入了 let，我们的代码终于有了创建完整、不受约束的块作用域的能力，块作用域在功能上和代码风格上都拥有很多激动人心的新特性。除JavaScript外的很多编程语言都支持块作用域，我们在for循环的头部直接定义了变量i，通常是因为只想在for循环内部的上下文中使用i，而忽略了i会被绑定在外部作用域(函数或全局)中的事实。

```js
for (var i=0; i<10; i++) {
  console.log( i );
}
```

为什么要把一个只在 for 循环内部使用(至少是应该只在内部使用)的变量 i 污染到整个
函数作用域中呢？变量 i 的块作用域(如果存在的话)将使得其只能在 for 循环内部使用，如果在函数中其他地方使用会导致错误。这对保证变量不会被混乱地复用及提升代码的可维护性都有很大帮助。这就是块作用域的用处，变量的声明应该距离使用的地方越近越好，并最大限度地本地化。另外一个例子：

```js
var foo = true;
if (foo) {
  var bar = foo * 2;
  bar = something( bar ); 
  console.log( bar );
}
```

块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息扩展为在块中隐藏信息。
### 2.1.1  with
它是块作用域的一 个例子(块作用域的一种形式)，用 with 从对象中创建出的作用域仅在 with 声明中而非外 部作用域中有效。
### 2.1.2  try/catch
非常少有人会注意到 JavaScript 的 ES3 规范中规定 try/catch 的 catch 分句会创建一个块作
用域，其中声明的变量仅在 catch 内部有效。
例如:

```js
try {
  undefined(); // 执行一个非法操作来强制制造一个异常
}
catch (err) {
  console.log( err ); // 能够正常执行! 
}
console.log( err ); // ReferenceError: err not found
```

### 2.1.3  let
let 关键字可以将变量绑定到所在的任意作用域中(通常是 { .. } 内部)。换句话说，let为其声明的变量隐式地了所在的块作用域。

```js
var foo = true;
if (foo) {
  let bar = foo * 2;
  bar = something( bar ); 
  console.log( bar );
}
console.log( bar ); // ReferenceError
```

只要声明是有效的，在声明中的任意位置都可以使用`{ .. }`括号来为 let 创建一个用于绑 定的块。但是使用 let 进行的声明不会在块作用域中进行提升。声明的代码被运行之前，声明并不
“存在”。

```js
{
  console.log( bar ); 
  // ReferenceError bar is not defined
  let bar = 2;
}
```

 - 垃圾收集，另一个块作用域非常有用的原因和闭包及回收内存垃圾的回收机制相关。
 - let循环，一个 let 可以发挥优势的典型例子就是之前讨论的 for 循环。
 
 ```js
 for (let i=0; i<10; i++) { 
   console.log( i );
 }
 console.log( i ); // ReferenceError
 ```
 
 for 循环头部的 let 不仅将 i 绑定到了 for 循环的块中，事实上它将其重新绑定到了循环 的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。
下面通过另一种方式来说明每次迭代时进行重新绑定的行为：

```js
{
  let j;
  for (j=0; j<10; j++) {
    let i = j; // 每个迭代重新绑定！
    console.log( i );
  }
}
```

### 2.1.4  const
除了 let 以外，ES6 还引入了 const，同样可以用来创建块作用域变量，但其值是固定的 (常量)。const 声明一个只读的常量。一旦声明，常量的值就不会改变。这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。

+ const命令跟let命令一样不存在变量提升、具有块级作用域、存在暂时性死区。
+ const 命令实际上保证的并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。

```js
console.log(typeof foo); // undefined
{
  console.log(typeof foo); // Cannot access 'foo' before initializatio
  const foo = {};
  foo.name = 'james9527';
  foo.age = 18;
  console.log(foo.name);  //james9527
  console.log(foo.age);  //18
  foo = {};   //TypeError: Assignment to constant variable.
}
```

### 2.1.5  块作用域的替代方案
在从 ES6 之前的环境向 ES6 过渡时，使用代码转换工具来对 ES6 代码进行处理，生成兼容 ES5 的代码。

 + Traceur
 Google 维护着一个名为 Traceur 的项目，该项目正是用来将 ES6 代码转换成兼容 ES6 之前 的环境(大部分是 ES5，但不是全部)。TC39 委员会依赖这个工具(也有其他工具)来测 试他们指定的语义化相关的功能。Traceur 会将我们的代码片段转换成什么样子？你能猜到的~
 
 ```js
 {
  try {
    throw undefined;
  } catch (a) {
    a = 2;
    console.log( a );
  }
}
console.log( a );
 ```
 
 通过使用这样的工具，我们就可以在使用块作用域时无需考虑目标平台是否是 ES6 环境， 因为 try/catch 从 ES3 开始就存在了(并且一直是这样工作的)。
 + 隐式和显式作用域（let作用域或let声明）

 ```js
 let (a = 2) {
   console.log(a) // 2
 }
 console.log(a) // ReferenceError
 ```

## 3.1  小结
 * 函数是 JavaScript 中最常见的作用域单元。本质上，声明在一个函数内部的变量或函数会
在所处的作用域中“隐藏”起来，这是有意为之的良好软件的设计原则。 但函数不是唯一的作用域单元。块作用域指的是变量和函数不仅可以属于所处的作用域，
也可以属于某个代码块(通常指`{ .. }`内部)。
* 从 ES3 开始，try/catch 结构在 catch 分句中具有块作用域。
* 在 ES6 中引入了 let 关键字(var 关键字的表亲)，用来在任意代码块中声明变量。if (..) { let a = 2; } 会声明一个劫持了 if 的`{ .. }`块的变量，并且将变量添加到这个块 中。
* IIFE 和 try/catch 并不是完全等价的，因为如果将一段代码中的任意一部分拿出来 用函数进行包裹，会改变这段代码的含义，其中的 this、return、break 和 contine 都会 发生变化。IIFE 并不是一个普适的解决方案，它只适合在某些情况下进行手动操作。最后问题就变成了：你是否想要块作用域？如果你想要，这些工具就可以帮助你。如果不想要，继续使用var来写代码就好了！