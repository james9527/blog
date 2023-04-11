---
title: 'Array.prototype上的常用方法'
sidebar: auto
collapsable: true
---

## Array常用方法及其定义

### 先看一道常考面试题
> 数组的forEach和map方法有哪些区别？常用哪些方法去对数组进行增、删、改

+ forEach：是对数组的每一个元素执行一次给定的函数。
+ map：是创建一个新数组，该新数组由原数组的每个元素都调用一次提供的函数返回的值。
+ pop：删除数组后面的最后一个元素,返回值为被删除的那个元素。
+ push：将一个元素或多个元素添加到数组末尾，并返回新的长度。
+ shift：删除数组中的第一个元素，并返回被删除元素的值。
+ unshift：将一个或多个元素添加到数组的开头，并返回该数组的新长度。
+ splice：通过删除/替换现有元素或添加元素来修改数组，并以数组形式返回被修改的内容。
+ reverse：反转数组。

### Array.prototype.push()
> push() 方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度。

push 方法具有通用性。该方法和 call() 或 apply() 一起使用时，可应用在类似数组的对象上。push 方法根据 length 属性来决定从哪里开始插入给定的值。如果 length 不能被转成一个数值，则插入的元素索引为 0，包括 length 不存在时。当 length 不存在时，将会创建它。

+ 合并两个数组

```js
var vegetables = ['parsnip', 'potato'];
var moreVegs = ['celery', 'beetroot'];

// 将第二个数组融合进第一个数组
// 相当于 vegetables.push('celery', 'beetroot');
Array.prototype.push.apply(vegetables, moreVegs);

console.log(vegetables);
// ['parsnip', 'potato', 'celery', 'beetroot']
```

+ 像数组一样使用对象

Array.prototype.push 可以在一个对象上工作。注意，我们没有创建一个数组来存储对象的集合。相反，我们将该集合存储在对象本身上，并使用在 Array.prototype.push 上使用的 call 来调用该方法，使其认为我们正在处理数组，而它只是像平常一样运作，这要感谢 JavaScript 允许我们建立任意的执行上下文。

```js
var obj = {
    length: 0,

    addElem: function addElem (elem) {
        // obj.length is automatically incremented
        // every time an element is added.
        [].push.call(this, elem);
    }
};

// Let's add some empty objects just to illustrate.
obj.addElem({});
obj.addElem({});
console.log(obj.length);
// → 2
```
注意，尽管 obj 不是数组，但是 push 方法成功地使 obj 的 length 属性增长了，就像我们处理一个实际的数组一样。

### Array.prototype.pop()
> pop() 方法从数组中删除最后一个元素，并返回该元素的值（当数组为空时返回undefined）。此方法会更改数组的长度。

该方法和 call() 或 apply() 一起使用时，可应用在类似数组的对象上。pop 方法根据 length 属性来确定最后一个元素的位置。如果不包含 length 属性或 length 属性不能被转成一个数值，会将 length 置为 0，并返回 undefined。

### Array.prototype.shift()
> shift() 方法从数组中删除第一个元素，并返回该元素的值（如果数组为空则返回undefined）。此方法更改数组的长度。

这个方法能够通过 call 或 apply 方法作用于类似数组的对象上。但是对于没有 length 属性（从 0 开始的一系列连续的数字属性的最后一个）的对象，调用该方法可能没有任何意义。

### Array.prototype.unshift()
> unshift() 方法将一个或多个元素添加到数组的开头，并返回该数组的新长度。

这个方法能够通过 call 或 apply 方法作用于类数组对象上。不过对于没有 length 属性（代表从 0 开始的一系列连续的数字属性的最后一个）的对象，调用该方法可能没有任何意义。
### Array.prototype.concat()
> concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

concat() 方法是一种复制方法。它不会更改 this 或作为参数提供的任何数组，而是返回包含与原始数组中的元素相同的元素的浅拷贝。

#### 使用 Symbol.isConcatSpreadable 合并类数组对象

concat 默认情况下不会将类数组对象视作数组——仅在 Symbol.isConcatSpreadable 被设置为真值（例如，true）时才会将类数组对象视作数组。

```js
const obj1 = { 0: 1, 1: 2, 2: 3, length: 3 };
const obj2 = { 0: 1, 1: 2, 2: 3, length: 3, [Symbol.isConcatSpreadable]: true };
console.log([0].concat(obj1, obj2));
// [ 0, { '0': 1, '1': 2, '2': 3, length: 3 }, 1, 2, 3 ]
```


### Array.prototype.join()
> join() 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串，用逗号或指定的分隔符字符串分隔。如果数组只有一个元素，那么将返回该元素而不使用分隔符。

#### 参数
指定一个字符串来分隔数组的每个元素。如果需要，将分隔符转换为字符串。如果省略，数组元素用逗号（,）分隔。如果 separator 是空字符串（""），则所有元素之间都没有任何字符。

#### 返回值
一个所有数组元素连接的字符串。如果 arr.length 为 0，则返回空字符串。

如果一个元素是 undefined 或 null，它将被转换为空字符串，而不是字符串 "undefined" 或 "null"。

#### 在非数组对象上调用 join()
> join() 方法读取 this 的 length 属性，然后访问每个整数索引。

```js
const arrayLike = {
  length: 3,
  0: 2,
  1: 3,
  2: 4,
};
console.log(Array.prototype.join.call(arrayLike));
// 2,3,4
console.log(Array.prototype.join.call(arrayLike, "."));
// 2.3.4
```

### Array.prototype.splice()
> splice() 方法通过删除或替换现有元素或者原地添加新的元素来修改数组，并以数组形式返回被修改的内容。此方法会改变原数组。

#### 语法

```js
splice(start)
splice(start, deleteCount)
splice(start, deleteCount, item1)
splice(start, deleteCount, item1, item2, itemN)
```
#### 返回值
由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。

#### 示例
+ 从索引 0 的位置开始删除 2 个元素，插入"parrot"、"anemone"和"blue"

```js
var myFish = ['angel', 'clown', 'trumpet', 'sturgeon'];
var removed = myFish.splice(0, 2, 'parrot', 'anemone', 'blue');

// 运算后的 myFish: ["parrot", "anemone", "blue", "trumpet", "sturgeon"]
// 被删除的元素：["angel", "clown"]
```

+ 从索引 -2 的位置开始删除 1 个元素

```js
var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
var removed = myFish.splice(-2, 1);

// 运算后的 myFish: ["angel", "clown", "sturgeon"]
// 被删除的元素：["mandarin"]
```

### Array.prototype.slice()
> slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。

#### 语法
```js
slice()
slice(start)
slice(start, end)
```
#### 参数begin
提取起始处的索引（从 0 开始），从该索引开始提取原数组元素。如果该参数为负数，则表示从原数组中的倒数第几个元素开始提取，slice(-2) 表示提取原数组中的倒数第二个元素到最后一个元素（包含最后一个元素）。如果省略 begin，则 slice 从索引 0 开始。如果 begin 超出原数组的索引范围，则会返回空数组。

#### 参数end
提取终止处的索引（从 0 开始），在该索引处结束提取原数组元素。slice 会提取原数组中索引从 begin 到 end 的所有元素（包含 begin，但不包含 end）。slice(1,4) 会提取原数组中从第二个元素开始一直到第四个元素的所有元素（索引为 1, 2, 3 的元素）。如果该参数为负数，则它表示在原数组中的倒数第几个元素结束抽取。 slice(-2,-1) 表示抽取了原数组中的倒数第二个元素到最后一个元素（不包含最后一个元素，也就是只有倒数第二个元素）。如果 end 被省略，则 slice 会一直提取到原数组末尾。如果 end 大于数组的长度，slice 也会一直提取到原数组末尾。

#### 描述
slice 不会修改原数组，只会返回一个浅复制了原数组中的元素的一个新数组。原数组的元素会按照下述规则拷贝：
+ 如果该元素是个对象引用（不是实际的对象），slice 会拷贝这个对象引用到新的数组里。两个对象引用都引用了同一个对象。如果被引用的对象发生改变，则新的和原来的数组中的这个元素也会发生改变。
+ 对于字符串、数字及布尔值来说（不是 String、Number 或者 Boolean 对象），slice 会拷贝这些值到新的数组里。在别的数组里修改这些字符串或数字或是布尔值，将不会影响另一个数组。

如果向两个数组任一中添加了新元素，则另一个不会受到影响。

#### 示例

```js
var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
var citrus = fruits.slice(1, 3);

// fruits contains ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango']
// citrus contains ['Orange','Lemon']
```

### Array.prototype.includes()
> includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。

### Array.prototype.indexOf()
> indexOf() 方法返回在数组中可以找到给定元素的第一个索引，如果不存在，则返回 -1。

### Array.prototype.lastIndexOf()
> lastIndexOf() 方法返回指定元素（也即有效的 JavaScript 值或变量）在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始。

### Array.prototype.sort()
> sort() 方法用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的 UTF-16 代码单元值序列时构建的。

由于它取决于具体实现，因此无法保证排序的时间和空间复杂性。
#### 语法
```js
sort()
sort(compareFn)
```
#### 排序规则
如果没有指明 compareFn ，那么元素会按照转换为的字符串的诸个字符的 Unicode 位点进行排序。例如 "Banana" 会被排列到 "cherry" 之前。当数字按由小到大排序时，9 出现在 80 之前，但因为（没有指明 compareFn），比较的数字会先被转换为字符串，所以在 Unicode 顺序上 "80" 要比 "9" 要靠前。

如果指明了 compareFn ，那么数组会按照调用该函数的返回值排序。即 a 和 b 是两个将要被比较的元素：

+ 如果 compareFn(a, b) 大于 0，b 会被排列到 a 之前。
+ 如果 compareFn(a, b) 小于 0，那么 a 会被排列到 b 之前；
+ 如果 compareFn(a, b) 等于 0，a 和 b 的相对位置不变。备注：ECMAScript 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 Mozilla 在 2003 年之前的版本）；
+ compareFn(a, b) 必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。

#### sort排序示例1
```js
  var arrayObj=[0,1,5,21,10,15,9];
  console.log(arrayObj.sort());// [0, 1, 10, 15, 21, 5, 9]

  function CompareValue(val1,val2){
       if (val1>val2) {
           return 1;
       }
       else if (val1<val2) {
           return -1;
       }else{
           return 0;
       }
   }
    //注意，这里传递的是函数指针，没有括号(若加上括号，返回的是0，跟直接调用sort方法一样的)
    arrayObj.sort(CompareValue);
    console.log(arrayObj); // [0, 1, 5, 9, 10, 15, 21]
```

#### sort排序示例2
```js
     const dataObj=[{name:'james9527',age: 18},{name:'ljf',age: 120},{name:'zsf',age:100}];
     function CompareFunc(propName){
        return function(obj1, obj2){
         if (obj1[propName] > obj2[propName]) {
          return 1;
         }
         else if (obj1[propName] < obj2[propName]) {
          return -1;
         }
         else{
          return 0;
         }
        }
     }
     dataObj.sort(CompareFunc('name'));//按姓名排序(首字母顺序)
     console.log(dataObj[0].name+' '+ dataObj[1].name+' '+ dataObj[2].name); //james9527 ljf zsf
     dataObj.sort(CompareFunc('age')); //按年龄排序
     console.log(dataObj[0].name+' '+ dataObj[1].name+' '+ dataObj[2].name);//james9527 zsf ljf
```

### Array.prototype.reverse()
> reverse() 方法将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。

reverse 方法颠倒数组中元素的位置，改变了数组，并返回该数组的引用。
### Array.prototype.flat()
> flat() 方法创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中。其中包含拼接后的子数组元素。

#### 语法
```js
flat()
// depth指定是要提取嵌套数组的结构深度，默认值为 1
flat(depth)
```
flat() 方法属于复制方法。它不会改变 this 数组，而是返回一个浅拷贝，该浅拷贝包含了原始数组中相同的元素。

#### 展平嵌套数组
```js
const arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

const arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

#### 在稀疏数组上使用 flat()
> flat() 方法删除数组中的空槽:

```js
const arr5 = [1, 2, , 4, 5];
console.log(arr5.flat()); // [1, 2, 4, 5]

const array = [1, , 3, ["a", , "c"]];
console.log(array.flat()); // [ 1, 3, "a", "c" ]

const array2 = [1, , 3, ["a", , ["d", , "e"]]];
console.log(array2.flat()); // [ 1, 3, "a", ["d", empty, "e"] ]
console.log(array2.flat(2)); // [ 1, 3, "a", "d", "e"]
```

#### 在非数组对象上调用 flat()
> flat() 方法读取 this 的 length 属性，然后访问每个整数索引。如果元素不是数组，则直接将其附加到结果中。如果元素是数组，则根据 depth 参数进行展开操作。

```js
const arrayLike = {
  length: 3,
  0: [1, 2],
  // 嵌套的类数组对象不会被展平
  1: { length: 2, 0: 3, 1: 4 },
  2: 5,
};
console.log(Array.prototype.flat.call(arrayLike));
// [ 1, 2, { '0': 3, '1': 4, length: 2 }, 5 ]
```

### Array.prototype.find()
> find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
+ 如果需要在数组中找到对应元素的索引，请使用 findIndex()。
+ 如果需要查找某个值的索引，请使用 Array.prototype.indexOf()。
+ 如果需要查找数组中是否存在某个值，请使用 Array.prototype.includes()。
+ 如果需要查找是否有元素满足所提供的测试函数，请使用 Array.prototype.some()。

### Array.prototype.findIndex()
> findIndex() 方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。

### Array.prototype.forEach()
> forEach() 方法对数组的每个元素执行一次给定的函数。

forEach() 为每个数组元素执行一次 callbackFn 函数；与 map() 或者 reduce() 不同的是，它总是返回 undefined 值，并且不可链式调用。其典型用例是在一个调用链的最后执行副作用（side effects，函数式编程上，指函数进行 返回结果值 以外的操作）。

forEach() 被调用时，不会改变原数组，也就是调用它的数组（尽管 callbackFn 函数在被调用时可能会改变原数组）。

备注：除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，forEach() 方法不是应当使用的工具。

若你需要提前终止循环，你可以使用：

+ 一个简单的 for 循环
+ for...of / for...in 循环
+ Array.prototype.every()
+ Array.prototype.some()
+ Array.prototype.find()
+ Array.prototype.findIndex()

这些数组方法则可以对数组元素判断，以便确定是否需要继续遍历：

+ every()
+ some()
+ find()
+ findIndex()

译者注：只要条件允许，也可以使用 filter() 提前过滤出需要遍历的部分，再用 forEach() 处理。

forEach() 方法要求使用同步函数——它不会等待 promise 执行完成。当你使用 promise（或者 async 函数）作为 forEach 的回调函数时，请确保你知道自己在做什么。

```js
const ratings = [5, 4, 5];
let sum = 0;

const sumFunction = async (a, b) => a + b;
ratings.forEach(async (rating) => {
  sum = await sumFunction(sum, rating);
});

console.log(sum);
// 期望的输出：14
// 实际的输出：0
```
#### 对象复制函数
下面的代码会创建一个给定对象的副本。创建对象的副本有不同的方法，以下是只是一种方法，并解释了 Array.prototype.forEach() 是如何使用 ECMAScript 5 Object.* 元属性（meta property）函数工作的。

```js
const copy = (obj) => {
  const copy = Object.create(Object.getPrototypeOf(obj));
  const propNames = Object.getOwnPropertyNames(obj);
  propNames.forEach((name) => {
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
  });
  return copy;
};

const obj1 = { a: 1, b: 2 };
const obj2 = copy(obj1); // 现在 obj2 看起来和 obj1 一模一样了
```

#### 扁平化数组
```js
const flatten = (arr) => {
  const result = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  });
  return result;
}

// 使用
const nested = [1, 2, 3, [4, 5, [6, 7], 8, 9]];
console.log(flatten(nested)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Array.prototype.map()
> map() 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。

#### 语法
```js
map(callbackFn)
map(callbackFn, thisArg)
```
生成新数组元素的函数callbackFn，使用三个参数（currentValue,index,array）

#### 描述
map 方法会给原数组中的每个元素都按顺序调用一次 callbackFn 函数。callbackFn 每次执行后的返回值（包括 undefined）组合起来形成一个新数组。 callbackFn 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。

因为 map 生成一个新数组，当你不打算使用返回的新数组却使用 map 是违背设计初衷的，请用 forEach 或者 for-of 替代。

如果有以下情形，则不该使用 map：

+ 你不打算使用返回的新数组；或
+ 你没有从回调函数中返回值。
callbackFn 函数会被自动传入三个参数：数组元素，元素索引，原数组本身。
#### 使用技巧案例
```js
["1", "2", "3"].map(parseInt);
```
我们期望输出 [1, 2, 3], 而实际结果是 [1, NaN, NaN]。下面让我们来讨论解决方案：

```js
const returnInt = (element) => parseInt(element, 10);

['1', '2', '3'].map(returnInt); // [1, 2, 3]
// 实际结果是一个数字数组（如预期）

// 与上面相同，但使用简洁的箭头函数语法
['1', '2', '3'].map((str) => parseInt(str)); // [1, 2, 3]

// A simpler way to achieve the above, while avoiding the "gotcha":
['1', '2', '3'].map(Number); // [1, 2, 3]

// 但与 parseInt() 不同，Number() 还会返回一个浮点数或（解析）指数表示法：
['1.1', '2.2e2', '3e300'].map(Number); // [1.1, 220, 3e+300]

// 为了进行比较，如果我们对上面的数组使用 parseInt():
['1.1', '2.2e2', '3e300'].map((str) => parseInt(str)); // [1, 2, 3]
```

### Array.prototype.reduce()
> reduce() 方法对数组中的每个元素按序执行一个由您提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。

第一次执行回调函数时，不存在“上一次的计算结果”。如果需要回调函数从数组索引为 0 的元素开始执行，则需要传递初始值。否则，数组索引为 0 的元素将被作为初始值 initialValue，迭代器将从第二个元素开始执行（索引为 1 而不是 0）。

reducer 逐个遍历数组元素，每一步都将当前元素的值与上一步的计算结果相加（上一步的计算结果是当前元素之前所有元素的总和）——直到没有更多的元素被相加。

#### reduce语法
```js
reduce(callbackFn)
reduce(callbackFn, initialValue)
```
一个“reducer”函数，包含四个参数：
+ previousValue：上一次调用 callbackFn 时的返回值。在第一次调用时，若指定了初始值 initialValue，其值则为 initialValue，否则为数组索引为 0 的元素 array[0]。
+ currentValue：数组中正在处理的元素。在第一次调用时，若指定了初始值 initialValue，其值则为数组索引为 0 的元素 array[0]，否则为 array[1]。
+ currentIndex：数组中正在处理的元素的索引。若指定了初始值 initialValue，则起始索引号为 0，否则从索引 1 起始。
+ array：用于遍历的数组。

提供初始值 initialValue 通常更安全，正如下面的例子，如果没有提供 initialValue，则 reduce 方法会因数组长度的不同（大于 1、等于 1、等于 0）而有不同的表现：

```js
const getMax = (a, b) => Math.max(a, b);

// callback is invoked for each element in the array starting at index 0
[1, 100].reduce(getMax, 50); // 100
[    50].reduce(getMax, 10); // 50

// callback is invoked once for element at index 1
[1, 100].reduce(getMax);     // 100

// callback is not invoked
[    50].reduce(getMax);     // 50
[      ].reduce(getMax, 1);  // 1

[      ].reduce(getMax);     // TypeError

```
#### reduce应用场景

##### 累加对象数组里的值
> 要累加对象数组中包含的值，必须提供 initialValue，以便各个 item 正确通过你的函数。

```js
let initialValue = 0
let sum = [{x: 1}, {x: 2}, {x: 3}].reduce((previousValue, currentValue) => previousValue + currentValue.x, initialValue)

console.log(sum) // logs 6
```
##### 将二维数组转化为一维
```js
let flattened = [[0, 1], [2, 3], [4, 5]].reduce(( previousValue, currentValue ) => previousValue.concat(currentValue), [])
```

##### 计算数组中每个元素出现的次数
```js
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']

let countedNames = names.reduce(function (allNames, name) {
  if (name in allNames) {
    allNames[name]++
  }
  else {
    allNames[name] = 1
  }
  return allNames
}, {})
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```
##### 按属性对 object 分类
```js
let people = [
  { name: 'Alice', age: 21 },
  { name: 'Max', age: 20 },
  { name: 'Jane', age: 20 }
];

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    let key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

let groupedPeople = groupBy(people, 'age')
// groupedPeople is:
// {
//   20: [
//     { name: 'Max', age: 20 },
//     { name: 'Jane', age: 20 }
//   ],
//   21: [{ name: 'Alice', age: 21 }]
// }
```
##### 数组去重
```js
let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']
let myArrayWithNoDuplicates = myArray.reduce(function (previousValue, currentValue) {
  if (previousValue.indexOf(currentValue) === -1) {
    previousValue.push(currentValue)
  }
  return previousValue
}, [])

console.log(myArrayWithNoDuplicates) // ['a', 'b', 'c', 'e', 'd']
```
如果你正在使用一个可以兼容Set 和 Array.from() 的环境，你可以使用`let arrayWithNoDuplicates = Array.from(new Set(myArray))`来获得一个相同元素被移除的数组。

##### 使用 .reduce() 替换 .filter().map()
使用 Array.filter() 和 Array.map() 会遍历数组两次，而使用具有相同效果的 Array.reduce() 只需要遍历一次，这样做更加高效。（如果你喜欢 for 循环，你可用使用 Array.forEach() 以在一次遍历中实现过滤和映射数组）

```js
const numbers = [-5, 6, 2, 0];
const doubledPositiveNumbers = numbers.reduce((previousValue, currentValue) => {
  if (currentValue > 0) {
    const doubled = currentValue * 2;
    previousValue.push(doubled);
  }
  return previousValue;
}, []);

console.log(doubledPositiveNumbers); // [12, 4]
```
##### 使用 reduce 实现 map
```js
if (!Array.prototype.mapUsingReduce) {
  Array.prototype.mapUsingReduce = function(callback, initialValue) {
    return this.reduce(function(mappedArray, currentValue, currentIndex, array) {
      mappedArray[currentIndex] = callback.call(initialValue, currentValue, currentIndex, array)
      return mappedArray
    }, [])
  }
}

[1, 2, , 3].mapUsingReduce(
  (currentValue, currentIndex, array) => currentValue + currentIndex + array.length
) // [5, 7, , 10]
```

### Array.prototype.reduceRight() 
> reduceRight() 方法接受一个函数作为累加器（accumulator）和数组的每个值（从右到左）将其减少为单个值。语法和参数同reduce。

#### 应用示例
+ 扁平化（flatten）一个二维数组

```js
var flattened = [[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
    return a.concat(b);
}, []);
// flattened is [4, 5, 2, 3, 0, 1]
```
+ reduce 与 reduceRight 之间的区别

```js
var a = ['1', '2', '3', '4', '5'];
var left  = a.reduce(function(prev, cur)      { return prev + cur; });
var right = a.reduceRight(function(prev, cur) { return prev + cur; });

console.log(left);  // "12345"
console.log(right); // "54321"
```

### Array.prototype.filter()
> filter() 方法创建给定数组一部分的浅拷贝，其包含通过所提供函数实现的测试的所有元素。
#### 语法
```js
filter(callbackFn)
filter(callbackFn, thisArg)
```
用来测试数组中每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。它接受以下三个参数：
+ element 数组中当前正在处理的元素。
+ index 正在处理的元素在数组中的索引。
+ array 调用了 filter() 的数组本身。

#### 返回值
一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

#### 找出数组中所有的素数
```js
const array = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function isPrime(num) {
  for (let i = 2; num > i; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return num > 1;
}

console.log(array.filter(isPrime)); // [2, 3, 5, 7, 11, 13]
```

### Array.prototype.some()
> some() 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。

#### 返回值
数组中有至少一个元素通过回调函数的测试就会返回 true；所有元素都没有通过回调函数的测试返回值才会为 false。

### Array.prototype.every()
> every() 方法测试一个数组内的所有元素是否都能通过指定函数的测试。它返回一个布尔值。
#### 在非数组对象上调用 every()
every() 方法读取 this 的 length 属性，然后访问每个整数索引，直到到达末尾或 callbackFn 返回 false。

```js
const arrayLike = {
  length: 3,
  0: "a",
  1: "b",
  2: "c",
};
console.log(
  Array.prototype.every.call(arrayLike, (x) => typeof x === "string"),
); // true
```
### Array.prototype.keys()
> keys() 方法返回一个包含数组中每个索引键的 Array Iterator 对象。
#### 返回值
一个新的 Array 迭代器对象。
#### 索引迭代器会包含那些没有对应元素的索引
```js
var arr = ["a", , "c"];
var sparseKeys = Object.keys(arr);
var denseKeys = [...arr.keys()];
console.log(sparseKeys); // ['0', '2']
console.log(denseKeys);  // [0, 1, 2]
```
### Array.prototype.values()
> values() 方法返回一个新的 Array Iterator 对象，该对象包含数组每个索引的值。
#### 返回值
一个新的 Array 迭代器对象。
#### 使用 for...of 循环进行迭代
```js
const arr = ['a', 'b', 'c', 'd', 'e'];
const iterator = arr.values();

for (const letter of iterator) {
  console.log(letter);
}  //"a" "b" "c" "d" "e"
```
Array.prototype.values 是 Array.prototype[Symbol.iterator] 的默认实现。

```js
Array.prototype.values === Array.prototype[Symbol.iterator]  // true
```
#### 使用 .next() 迭代
```js
const arr = ['a', 'b', 'c', 'd', 'e'];
const iterator = arr.values();
iterator.next();               // Object { value: "a", done: false }
iterator.next().value;         // "b"
iterator.next()["value"];      // "c"
iterator.next();               // Object { value: "d", done: false }
iterator.next();               // Object { value: "e", done: false }
iterator.next();               // Object { value: undefined, done: true }
iterator.next().value;         // undefined
```
### Array.prototype.entries()
> entries() 方法返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对。
#### 使用 for...of 循环
```js
const array = ["a", "b", "c"];
const arrayEntries = array.entries();

for (const element of arrayEntries) {
  console.log(element);
}

// [0, 'a']
// [1, 'b']
// [2, 'c']
```