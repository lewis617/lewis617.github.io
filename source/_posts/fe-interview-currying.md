---
title: 前端面试之柯里化
date: 2017-03-12 11:41:00
tags: [前端面试, 柯里化]
---

今天，我们要讲的是几道柯里化面试题。

<!--more-->

## 什么是柯里化？

> 在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

这是 wiki 百科的解释。简单来说，柯里化就是帮你消化一部分参数的函数。来张图吧～

![image](https://user-images.githubusercontent.com/11524612/58748306-1e0cb700-84a9-11e9-881f-bee95cc41dcb.png)

本来计算 a + b + c，需要三个参数，结果柯里化函数帮你消化了一部分，每次只需要传递一个参数。

## 柯里化和高阶函数有啥区别？

有的同学看到上面的嵌套函数，会想这不就是高阶函数吗？没错，柯里化一定是高阶函数，但高阶函数不一定是柯里化。因为高阶函数的定义是：

> 在数学和计算机科学中，高阶函数是至少满足下列一个条件的函数： 接受一个或多个函数作为输入 输出一个函数。

比如，ES6 的 map、reduce 都是高阶函数（函数作为参数），但它们不是柯里化。

## 面试题一

用 apply 实现 bind：

```
Function.prototype.bind = function () {
  const fn = this;
  const args = Array.from(arguments);
  const ctx = args.shift();
  return function () => {
    fn.apply(ctx, args.concat(Array.from(arguments)))
  }
}
```

bind 先消化一部分参数，apply 再消化一部分参数。

## 面试题二

实现 sum 函数，满足：

```
sum(1)(2).valueOf() // 3
sum(1)(2)(3).valueOf() // 6
sum(1)(2)....(n).valueOf() // 所有参数的和
```
sum 就是一个柯里化函数，因为它执行一次就消化了一部分参数，并返回了一个函数继续消化剩余的参数，最终还能把所有消化的参数计算出来。

先实现两个参数的版本：

```js
const sum = (a) => (b) => ({valueOf: () => a+b})  
```

那么无限参数的版本难道是这样：


```js
const sum = (a) => (b) => (c) => ... => (n) => ({valueOf: () => a+b+...+n}) 
```

显然不行，所以用递归：

```js
const sum = (n) => { 
  let val = a;
  const tmp = (n) => {
    val += n;
    return tmp;
  }
  tmp.valueOf = () => val;
  return tmp;
}
```
