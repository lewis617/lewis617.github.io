---
title: 在 JavaScript 中使用构造器函数模拟类
date: 2017-02-15 09:46:00
tags: [面向对象编程]
---

今天，我们要讲的是在 JavaScript 中使用构造器函数（construcor function）模拟类。

<!--more-->

## 构造器函数简介

你可以使用 ES6 的 class 关键字来实现类，不过我建议你使用传统的构造器函数来模拟类，因为这样可以给人一种你是个 JavaScript 老手的错觉，哈哈！

什么是构造器函数？构造器函数是编写对象的方法之一。一般情况下，你可以这样编写一个对象：

```js
var obj = { a:1, b:2 };
```
 
但也可以使用构造器函数来编写对象：
```js
 function Obj(a, b){
   this.a = a;
   this.b = b;
 }
 var obj = new Obj(1, 2); //obj 等价于 { a:1, b:2 }
```
使用构造器函数的好处在于可以传递参数。构造器函数通常首字母大写，而且需要使用 new 关键词来调用。在 JavaScript 中是没有类的，利用构造器函数我们可以模拟一个类。

## 使用构造器函数编写栈类

了解了构造器函数，我们使用它编写一个迷你的栈类，下面就是实现代码：

Stack.js

```js
function Stack() {
  // 私有变量 items，用于记录数组，对象不能直接操作
  var items = [];
  // 类方法 push，在数组末尾添加项，对象可以直接调用
  this.push = function (element) {
    items.push(element);
  };
  // 删除并返回数组末尾的项
  this.pop = function () {
    return items.pop();
  };
}
```

上述栈类中，有个私有变量 `items` ，为何它就不能直接操作呢？为何挂在 this 上的方法可以直接调用？因为 **new 操作符会将构造器函数中的 this 指向生成的对象**，也就是说挂在 this 上的方法或属性将来会成为生成对象的方法或属性，所以可以直接调用。而 **`items` 则是函数内部的一个局部变量，它在函数外部是不可见的**，生成对象只能通过调用自身的方法，沿着作用域链来操作 `items`。

```js
var stack = new Stack();

// stack 对象不能直接操作items，结果是 undefined
console.log(stack.items) 
 
// stack 对象可以直接操作构造器函数中挂在 this 上的属性和方法
stack.push(1);
// 打印了1
console.log(stack.pop())
```

如果你不熟悉 JavaScript ，那么你应该先学习一下 JavaScript 作用域、this 和 new 操作符的相关知识。推荐阅读参考 Stoyan Stefanow 的《JavaScript 面向对象编程指南》，这本书里面有很多小的代码片段以及相关的图文解读，可以帮助你更好地理解 JavaScript 的相关特性。

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>