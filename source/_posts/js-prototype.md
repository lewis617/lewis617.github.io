---
title: JavaScript 基础：原型链
date: 2019-06-01 21:42:00
tags: [前端面试, 原型链]
---

今天，我们要讲的是原型链以及相关几道面试题。

<!--more-->

## 原型链是啥？

> 当谈到继承时，JavaScript 只有一种结构：对象。每个实例对象（ object ）都有一个私有属性（称之为 __proto__ ）指向它的构造函数的原型对象（prototype ）。该原型对象也有一个自己的原型对象( __proto__ ) ，层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。

以上是 MDN 的定义，简单来说就是一个链表，不过这个链表有点奇葩，就像这样：

```
如果 const a = new A(); 那么：


                    A                    Object
                    .                       .   
a.__proto__ --> prototype.__proto__ --> prototype.__proto__ --> null
```

来张完整版本的图：

![image](https://user-images.githubusercontent.com/11524612/58749311-1b18c300-84b7-11e9-969a-44578d9da420.png)

完整版本的信息提取：

1. 每个对象（包括函数）都有 `__proto__` , 但 `null` 没有。
2. 每个对象的 `__proto__` 只会指向它的构造函数的 `prototype` 对象，`Object.__proto__` 除外，它指向 `null`。
3. 构造函数的 `prototype` 对象的 `constructor` 属性指回构造函数。

看似复杂，也就三条信息。

## 面试题一：instanceof 的实现原理是啥？

如果 `left instanceof right` ，那么会沿着 `left` 的原型链一直往上找，如果找到 `right.prototype`，就 return true，否则就 return false。说白了就是一个链表的的遍历。

## 面试题二：描述 new 一个对象的过程

1. 创建空对象； `var obj = {};`
2. 设置新对象的 `constructor` 属性为构造函数的名称，设置新对象的 `__proto__`属性指向构造函数的 `prototype` 对象；`obj._proto_ = ClassA.prototype;`
3. 使用新对象调用函数，函数中的 this 被指向新实例对象，`ClassA.call(obj);`
4. 将创建的新对象（如果构造函数返回对象，这里会将构造函数返回的对象保存在等号左边的变量中），保存到等号左边的变量中。

## 面试题三：如何准确判断一个变量是数组类型？

1. `arr instanceof Array`
2. `Array.isArray(arr)`
3. `Object.prototype.toString.call(arr) === '[object Array]'`




