---
title: 'eslint规则解读'
sidebar: auto
collapsable: true
---
# eslint规则解读

## 什么是 ESLint ？
  ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具<br/>
  它的目标是保证代码的一致性和避免错误。

## 优点
  团队协作时，团队的代码风格统一，能够大大减少沟通成本。

## 细说规则
  1.'no-cond-assign' &nbsp; // &nbsp; 禁止条件表达式中出现赋值操作符<br>

  2.'no-console' &nbsp; // &nbsp; 禁用 console<br>

  3.'comma-dangle' : [1,"always-multiline"] <br>
  // &nbsp; 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, <br>
  // &nbsp; always参数：必须带末尾的逗号，<br>
  // &nbsp; always-multiline：多行模式必须带逗号，单行模式不能带逗号<br>

  4.'no-debugger' &nbsp; // &nbsp; 禁用 debugger<br>

  5.'no-dupe-args' &nbsp; // &nbsp; 禁止 function 定义中出现重名参数<br>

  6.'no-dupe-keys' &nbsp; // &nbsp; 禁止对象字面量中出现重复的 key<br>

  7.'no-duplicate-case' &nbsp; // &nbsp; 禁止重复的 case 标签<br>

  8.'no-empty' &nbsp; // &nbsp; 禁止空语句块

  9.'no-extra-boolean-cast' &nbsp; // &nbsp; 禁止不必要的布尔转换<br>

  10.'no-extra-parens' &nbsp; // &nbsp; 禁止不必要的括号 //(a * b) + c;//报错

  11.'no-extra-semi' &nbsp; // &nbsp; 禁止不必要的分号

  12.'no-func-assign' &nbsp; // &nbsp; 禁止对 function 声明重新赋值

  13.'no-irregular-whitespace' &nbsp; // &nbsp; 禁止在字符串和注释之外不规则的空白

  14.'no-regex-spaces' &nbsp; // &nbsp; 禁止正则表达式字面量中出现多个空格

  15.'no-unexpected-multiline' &nbsp; // &nbsp; 禁止出现令人困惑的多行表达式

  16.'array-callback-return' &nbsp; // &nbsp; 强制数组方法的回调函数中有 return 语句

  17.'eqeqeq' &nbsp; // &nbsp; 使用 === 替代 == allow-null允许null和undefined==

  18.'global-require'  &nbsp; // &nbsp; 要求 require() 出现在顶层模块作用域中

  19.'max-len'  &nbsp; // &nbsp; 强制一行的最大长度

  20.'no-shadow'  &nbsp; // &nbsp; 禁止 var 声明 与外层作用域的变量同名

  21.'no-return-assign'  &nbsp; // &nbsp; 禁用指定的通过 require 加载的模块

  22.'no-mixed-operators'  &nbsp; // &nbsp; 禁止混合使用不同的操作符

  23.'camelcase'  &nbsp; // &nbsp; 双峰驼命名格式

  24.'no-restricted-globals'  &nbsp; // &nbsp; 禁用特定的全局变量

  25.'no-restricted-syntax'  &nbsp; // &nbsp; 禁止使用特定的语法

  26.'guard-for-in'  &nbsp; // &nbsp; 要求 for-in 循环中有一个 if 语句

  27.'no-unused-vars'   &nbsp; // &nbsp; 禁止出现未使用过的变量

  28.'no-param-reassign'   &nbsp; // &nbsp; 不允许对 function 的参数进行重新赋值

  29.'func-names' &nbsp; // &nbsp; 强制使用命名的 function 表达式

  30.'consistent-return' &nbsp; // &nbsp; 要求 return 语句要么总是指定返回的值，要么不指定

  31.'no-plusplus' &nbsp; // &nbsp; 禁止使用一元操作符 ++ 和 --

  32.'no-undef' &nbsp; // &nbsp; 禁用未声明的变量，除非它们在 /*global */ 注释中被提到

  33.'no-continue' &nbsp; // &nbsp; 禁用 continue 语句

  34.'no-loop-func' &nbsp; // &nbsp; 禁止在循环中出现 function 声明和表达式

  35.'no-nested-ternary' &nbsp; // &nbsp; 不允许使用嵌套的三元表达式

  36.'no-sequences' &nbsp; // &nbsp; 禁用逗号操作符

  36.'no-unused-expressions'  &nbsp; // &nbsp; 禁止出现未使用过的表达式

  37.'prefer-rest-params'   &nbsp; // &nbsp; 建议使用rest parameters而不是arguments

  38.‘no-alert’   &nbsp; // &nbsp; 禁用 alert、confirm 和 prompt

  39.‘no-underscore-dangle’   &nbsp; // &nbsp; 禁止标识符中有悬空下划线_bar

  40.‘radix’   &nbsp; // &nbsp; 强制在parseInt()使用基数参数

  41.‘no-prototype-builtins’  &nbsp; // &nbsp; 禁止直接使用 Object.prototypes 的内置属性

  42.‘no-script-url’  &nbsp; // &nbsp; 禁止使用 javascript: url




