---
title: 'call&apply&bind自定义实现'
sidebar: auto
collapsable: true
---

> 我们都知道，call/apply/bind都可以用来改变this的指向，先用一段示例演示它们的用法，然后再理解它们的源码实现，先看下面这段输出：

```js
function Animal() {}
Animal.prototype = {
  name: '熊大',
  say: function() {
    console.log('Hello, My name is ' + this.name);
  }
}

let animal = new Animal();
// animal.say(); // 熊大

let obj = {
  name: '光头强'
}

animal.say.call(obj); // 光头强
animal.say.apply(obj); // 光头强
animal.say.bind(obj)(); // 光头强
```

## 自定义call的实现

自定义的Function.prototype.myCall主要实现步骤如下：

+ 将函数设为对象的属性；
+ 执行&删除这个函数；
+ 指定this到函数并传入给定参数，同时执行函数；

```js
Function.prototype.myCall = function(context = window) {
  // 将函数设为对象的属性
  context.fn = this;
  // 执行并删除这个函数
  let result = context.fn(...arguments);
  delete context.fn;
  return result;
  // 指定this到函数并传入给定参数，执行此函数
  // TODO
}
```

## 自定义apply的实现

自定义apply的实现与call()类似，只是参数不同：

```js
Function.prototype.myApply = function(context = window) {
  // 将函数设为对象的属性
  context.fn = this; // this为say方法
  // 执行并删除这个函数
  let result;
  // 当前context对象值为fn: say() 和 参数obj对象{name: xxx}
  if(arguments[1]) { // 当前arguments[1]为undefined
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}
```

## 自定义bind的实现
自定义bind的实现要注意三个地方：

+ 会创建一个新函数；
+ bind的第一个参数作为运行时的this；
+ bind实现需要考虑实例化后对原型链的影响；

```js
Function.prototype.myBind = function(context) {
  if(typeof this !== 'function') {
    throw new Error('this not a function');
  }
  const fn = this;
  const args = [...arguments].slice(1);
  const newFn = function() {
    return fn.apply(this instanceof newFn ? this : context, args.concat(...arguments));
  }
  function tmpFn() {}
  tmpFn.prototype = this.prototype;
  // 修正newFn的原型对象
  newFn.prototype = new tmpFn();
  // 返回新函数
  return newFn;
}
```

将自定义的myCall/myApply/myBind应用在前文示例中如下：

```js
function Animal() {}
Animal.prototype = {
  name: '熊大',
  say: function() {
    console.log('Hello, My name is ' + this.name);
  }
}

let animal = new Animal();
// animal.say(); // 熊大

let obj = {
  name: 'James9527'
}

animal.say.myCall(obj); // James9527
animal.say.myApply(obj); // James9527
animal.say.myBind(obj)(); // James9527
```
## 典型应用场景

### 伪数组转标准数组

```js
const obj = {
    0: '熊大',
    1: '熊二',
    length: 2
}
let arr1 = Array.prototype.slice.call(obj) // ['熊大', '熊二']
let arr2 = Array.prototype.slice.apply(obj) // ['熊大', '熊二']
```

### 取数组中的最大（小）值

```js
const arr = [-1, 3, 7, 5, 9, 11, 13]

//取最大值
console.log(Math.max.apply(Math, arr)) // 13
console.log(Math.max.call(Math, ...arr)) // 13

//取最小值
console.log(Math.min.apply(Math, arr)) // -1
console.log(Math.min.call(Math, ...arr)) //-1

```

### 检验是否是数组

```js
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
}
isArray([]) // true
isArray({}) // false
```