---
title: '浅析作用域和闭包'
sidebar: auto
collapsable: true
---

## 写在前面
> JavaScript中闭包无处不在，闭包就是能够读取其它函数内部变量的函数。闭包是基于词法作用域书写代码时所产生的自然结果，在本质上，闭包是将函数内部和函数外部连接起来的桥梁，拿到了本不该是你的东西。不用盲目的害怕闭包会造成内存泄露，用完置为null就完事了。

闭包的特点可总结为以下几点： 

 + 函数作为返回值；
 + 函数作为参数传递；
 + 保护变量；

## 1.1 闭包的实质问题
下面是直接了当的定义，你需要掌握它才能理解和识别闭包:
当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。
如以下代码段，函数 bar() 可以访问外部作用域中的变量a：

```js
function foo() { 
  var a = 2;
  function bar() { 
    console.log( a ); // 2
  }
  bar(); 
}
foo();
```
这是闭包吗? 从技术角度上看是的，在上面的代码片段中，函数 bar() 具有一个涵盖 foo() 作用域的闭包 (事实上，涵盖了它能访问的所有作用域，比如全局作用域)。也可以认为 bar() 被封闭在
了 foo() 的作用域中。为什么呢？原因简单明了，因为 bar() 嵌套在 foo() 内部。但是通过这种方式定义的闭包并不能直接进行观察，也无法明白在这个代码片段中闭包是 如何工作的。
下面我们来看一段代码，清晰地展示了闭包：

```js
function foo() { 
  var a = 2;
  function bar() { 
    console.log(a);
  }
  return bar; 
}
var baz = foo();
baz(); // 2
```
* 函数 bar() 的词法作用域能够访问 foo() 的内部作用域。然后我们将 bar() 函数本身当作 一个值类型进行传递。在这个例子中，我们将 bar 所引用的函数对象本身当作返回值。
* 在 foo() 执行后，其返回值(也就是内部的 bar() 函数)赋值给变量 baz 并调用 baz()，实 际上只是通过不同的标识符引用调用了内部的函数 bar()。bar() 显然可以被正常执行。但是在这个例子中，它在自己定义的词法作用域以外的地方 执行。
* 在 foo() 执行后，通常会期待 foo() 的整个内部作用域都被销毁，因为我们知道引擎有垃圾回收器用来释放不再使用的内存空间。由于看上去 foo() 的内容不会再被使用，所以很自然地会考虑对其进行回收。而闭包的“神奇”之处正是可以阻止这件事情的发生。事实上内部作用域依然存在，因此没有被回收。谁在使用这个内部作用域?原来是 bar() 本身在使用。
* 拜 bar() 所声明的位置所赐，它拥有涵盖 foo() 内部作用域的闭包，使得该作用域能够一 直存活，以供 bar() 在之后任何时间进行引用。bar() 依然持有对该作用域的引用，而这个引用就叫作闭包。
* 这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的 词法作用域。
* 无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用 域的引用，无论在何处执行这个函数都会使用闭包。如以下代码片段：

```js
function foo() { 
  var a = 2;
  function baz() { 
    console.log( a ); // 2
  }
  bar( baz ); 
}
function bar(fn) {
  fn();
}
```
你已经写过的代码中一定到处都是闭包的身影，如上一篇提到过的立即执行函数表达式（IIFE）内部也创建了闭包，现在让我们来搞懂这个事实。

```js
function wait(message) {
  setTimeout(function timer() {
    console.log( message );
  }, 1000 );
}
wait( "Hello, closure!" );
```
将一个内部函数(名为 timer)传递给`setTimeout(..)`。timer具有涵盖`wait(..)`作用域
的闭包，因此还保有对变量 message 的引用。`wait(..)`执行 1000 毫秒后，它的内部作用域并不会消失，timer 函数依然保有`wait(..)`作用域的闭包。
又如jQuery代码片段：

```js
function setupBot(name, selector) {
  $(selector).click(function activator() {
    console.log( "Activating: " + name );
  });
}
setupBot( "Closure Bot 1", "#bot_1" );
setupBot( "Closure Bot 2", "#bot_2" );
```
## 1.2 心得体会
本质上无论何时何地，如果将函数(访问它们各自的词法作用域)当作第一 级的值类型并到处传递，你就会看到闭包在这些函数中的应用。在定时器、事件监听器、Ajax请求、跨窗口通信、Web Workers 或者任何其他的异步(或者同步)任务中，只要使用了回调函数，实际上就是在使用闭包！

## 1.3 循环和闭包
要说明闭包，for 循环是最常见的例子：

```js
for(var i=0; i<10; i++) {
  setTimeout(() => {
    console.log('打印次数：'+ i)
  }, i*1000);
}
```
正常情况下，我们对这段代码行为的预期是分别输出数字 0~9，每秒一次，每次的值累加。但实际上，这段代码在运行时会以每秒一次的频率输出10次10。这是为什么？事实上， 当定时器运行时即使每个迭代中执行的是setTimeout(.., 0)，所有的回调函数依然是在循 环结束后才会被执行，因此会每次输出一个 10 出来。

我们试图假设循环中的每个迭代在运行时都会给自己“捕获”一个 i 的副本。但是 根据作用域的工作原理，实际情况是尽管循环中的10个函数是在各个迭代中分别定义的， 但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个i。

我们需要更多的闭包作用域，特别是在循环的过程中每个迭代都需要一个闭包作用域。IIFE会通过声明并立即执行一个函数来创建作用域，每个延迟函数都会将 IIFE 在每次迭代中创建的作用域封闭起来，同时提供各自的变量，用来在每个迭代中储存 i 的值，即可实现目标：

```js
for(var i=0; i<10; i++) {
  (function() {
    var j = i;
    setTimeout(() => {
      console.log('打印次数：'+ j) // 打印次数：0 -> 9
    }, j*1000);
  })()
}
```
当然，可以对以上代码进行改进：

```js
for(var i=0; i<10; i++) {
  (function(j) {
    setTimeout(() => {
      console.log('打印次数：'+ j) // 打印次数：0 -> 9
    }, j*1000);
  })(i)
}
```
在迭代内使用 IIFE 会为每个迭代都生成一个新的作用域，使得延迟函数的回调可以将新的
作用域封闭在每个迭代内部，每个迭代中都会含有一个具有正确值的变量供我们访问。
## 1.4 重返块作用域
我们使用 IIFE 在每次迭代时都创建一个新的作用域。换句话说，每次迭代我们都需要一个块作用域。let声明可以用来劫持块作用域，并且在这个块作用域中声明一个变量。

```js
for(var i=0; i<10; i++) {
  let j = i; // 闭包的块作用域
  setTimeout(() => {
    console.log('打印次数：'+ j) // 打印次数：0 -> 9
  }, j*1000);
}
```
块作用域和闭包联手便可天下无敌，for循环头部的 let 声明还会有一 个特殊的行为，这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量，因此对以上代码作出如下改进：

```js
for(let i=0; i<10; i++) {
  setTimeout(() => {
    console.log('打印次数：'+ i)
  }, i*1000);
}
```
## 1.5 模块
接下来考虑以下代码：

```js
function CoolModule() {
  var something = "cool";
  var another = [1, 2, 3];
  function doSomething() { 
    console.log( something );
  }
  function doAnother() {
    console.log( another.join( " ! " ) );
  }
  return {
    doSomething: doSomething, 
    doAnother: doAnother
  }
}
var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```
这个模式在 JavaScript 中被称为模块。最常见的实现模块模式的方法通常被称为模块暴露， 这里展示的是其变体。

 + 首先，CoolModule() 只是一个函数，必须要通过调用它来创建一个模块实例。如果不执行 外部函数，内部作用域和闭包都无法被创建。
 + 其次，CoolModule() 返回一个用对象字面量语法 { key: value, ... } 来表示的对象。这 个返回的对象中含有对内部函数而不是内部数据变量的引用。我们保持内部数据变量是隐 藏且私有的状态。可以将这个对象类型的返回值看作本质上是模块的公共 API。
 从模块中返回一个实际的对象并不是必须的，也可以直接返回一个内部函 数。jQuery 就是一个很好的例子。jQuery 和 $ 标识符就是 jQuery 模块的公 共 API，但它们本身都是函数(由于函数也是对象，它们本身也可以拥有属 性)。
 
模块模式需要具备两个必要条件：

 + 必须有外部的封闭函数，该函数必须至少被调用一次(每次调用都会创建一个新的模块 实例)
 + 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并 且可以访问或者修改私有的状态。
 
 一个具有函数属性的对象本身并不是真正的模块。从方便观察的角度看，一个从函数调用 所返回的，只有数据属性而没有闭包函数的对象并不是真正的模块。上一个示例代码中有一个叫作 CoolModule() 的独立的模块创建器，可以被调用任意多次， 每次调用都会创建一个新的模块实例。当只需要一个实例时，可以对这个模式进行简单的 改进来实现单例模式：
 
 ```js
 var foo = (function CoolModule() { 
   var something = "cool";
   var another = [1, 2, 3];
   function doSomething() {
     console.log( something );
   }
  function doAnother() {
    console.log( another.join( " ! " ) );
  }
  return {
    doSomething: doSomething, 
    doAnother: doAnother
  };
})();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
 ```
 模块也是普通的函数，因此可以接受参数。模块模式另一个简单但强大的变化用法是，命名将要作为公共 API 返回的对象：
 
```js
var foo = (function CoolModule(id) { 
  function change() {
    // 修改公共 API
    publicAPI.identify = identify2;
  }
  function identify1() {
    console.log(id);
  }
  function identify2() {
    console.log(id.toUpperCase());
  }
  var publicAPI = {
    change: change,
    identify: identify1
  };
  return publicAPI; 
})("foo module");
foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODULE
```
通过在模块实例的内部保留对公共 API 对象的内部引用，可以从内部对模块实例进行修 改，包括添加或删除方法和属性，以及修改它们的值。

### 1.5.1 现代的模块机制
大多数模块依赖加载器 / 管理器本质上都是将这种模块定义封装进一个友好的 API。

```js
var MyModules = (function Manager() {
  var modules = {};
  function define(name, deps, impl) {
    for (var i=0; i<deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply( impl, deps );
  }
  function get(name) { 
    return modules[name];
  }
  return {
    define: define,
    get: get 
  };
})();
```
这段代码的核心是`modules[name] = impl.apply(impl, deps)`。为了模块的定义引入了包装 函数(可以传入任何依赖)，并且将返回值，也就是模块的 API，储存在一个根据名字来管 理的模块列表中。

```js
MyModules.define( "bar", [], function() { 
  function hello(who) {
    return "Let me introduce: " + who; 
  }
  return {
    hello: hello
  }; 
});
MyModules.define( "foo", ["bar"], function(bar) {
  var hungry = "hippo";
  function awesome() {
    console.log( bar.hello( hungry ).toUpperCase() );
  }
  return {
    awesome: awesome
  };
});
var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );
console.log(bar.hello( "hippo" )); // Let me introduce: hippo foo.awesome();
foo.awesome(); // LET ME INTRODUCE: HIPPO
```
"foo" 和 "bar" 模块都是通过一个返回公共 API 的函数来定义的。"foo" 甚至接受 "bar" 的 示例作为依赖参数，并能相应地使用它。模块就是模块，即使在它们外层加上一个友好的包装工具也不会发生任何变化。

### 1.5.2 未来的模块机制
 > ES6 中为模块增加了一级语法支持。但通过模块系统进行加载时，ES6 会将文件当作独立的模块来处理。每个模块都可以导入其他模块或特定的 API 成员，同样也可以导出自己的 API 成员。

基于函数的模块并不是一个能被稳定识别的模式(编译器无法识别)，它们 的 API 语义只有在运行时才会被考虑进来，因此可以在运行时修改一个模块 的 API。相比之下，ES6 模块 API 更加稳定(API 不会在运行时改变)。由于编辑器知 道这一点，因此可以在(的确也这样做了)编译期检查对导入模块的 API 成 员的引用是否真实存在。如果 API 引用并不存在，编译器会在运行时抛出一 个或多个“早期”错误，而不会像往常一样在运行期采用动态的解决方案。
 ES6 的模块没有“行内”格式，必须被定义在独立的文件中(一个文件一个模块)。浏览 器或引擎有一个默认的“模块加载器”(可以被重载，但这远超出了我们的讨论范围)可 以在导入模块时异步地加载模块文件。考虑以下代码片段：

```js
// bar.js
function hello(who) {
  return "Let me introduce: " + who;
}
export hello; 
// foo.js
// 仅从 "bar" 模块导入 hello() import hello from "bar";
var hungry = "hippo";
function awesome() { 
  console.log(hello( hungry ).toUpperCase());
}
export awesome;
// baz.js
// 导入完整的 "foo" 和 "bar" 模块
module foo from "foo";
module bar from "bar";
console.log(bar.hello("rhino")); // Let me introduce: rhino
foo.awesome(); // LET ME INTRODUCE: HIPPO
```
import 可以将一个模块中的一个或多个 API 导入到当前作用域中，并分别绑定在一个变量 上(在我们的例子里是 hello)。module 会将整个模块的 API 导入并绑定到一个变量上(在 我们的例子里是 foo 和 bar)。export 会将当前模块的一个标识符(变量、函数)导出为公 共 API。这些操作可以在模块定义中根据需要使用任意多次。