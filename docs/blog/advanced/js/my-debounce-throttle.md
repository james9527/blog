---
title: '防抖节流应用场景及实现'
sidebar: auto
collapsable: true
author: James9527
---

## 防抖节流应用场景及实现

防抖和节流是常用的性能优化技巧，应用场景和代码实现如下：

### 防抖（Debounce）
当一个事件被触发时，如果在规定时间内再次触发该事件，则不会执行该事件，直到规定时间内没有再次触发该事件才会执行。适用于输入框输入时实时搜索、按钮点击事件，避免频繁发送请求。代码实现如下：

```js
function debounce(fn, delay) {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
}

// 使用debounce函数包装需要防抖的函数
const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('input', debounce(() => {
  // 实时搜索逻辑
}, 500));

```

总结：函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求。

```js
// 函数防抖的实现
function myDebounce(fn, wait) {
  let timer = null;

  return function() {
    let context = this,
        args = arguments;

    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
```

### 节流（Throttle）
当一个事件被触发时，在规定时间内只会执行一次该事件，直到规定时间结束才能再次触发执行。适用于滚动加载、窗口大小调整等频繁触发的事件，避免过多的计算和渲染。代码实现如下：

```js
function throttle(fn, delay) {
  let timer = null;
  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    }
  }
}

// 使用throttle函数包装需要节流的函数
window.addEventListener('scroll', throttle(() => {
  // 滚动加载逻辑
}, 500));
```

总结：函数节流是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。节流可以使用在 scroll 函数的事件监听上，通过事件节流来降低事件调用的频率。

```js
// 函数节流的实现;
function myThrottle(fn, delay) {
  let curTime = Date.now();

  return function() {
    let context = this,
        args = arguments,
        nowTime = Date.now();

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - curTime >= delay) {
      curTime = Date.now();
      return fn.apply(context, args);
    }
  };
}
```