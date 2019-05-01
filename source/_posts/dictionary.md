---
title: JavaScript 版数据结构与算法（五）字典
date: 2017-02-17 10:29:00
tags: [数据结构与算法]
---

今天，我们要讲的是数据结构与算法中的字典。

<!--more-->

## 字典简介

什么是字典？与集合类似，字典也是一种**存储唯一值**的数据结构，但它是以**键值对**的形式来存储。字典有什么用？在生活中，字典可以模拟汉英字典等真实字典这种场景。另外，ES6 也新增了字典这种数据结构，不过名字叫——Map。Map 和对象都是键值对，那么它俩有什么区别呢？MDN 给了一个非常清晰的总结：

- 一个对象通常都有自己的原型,所以一个对象总有一个"prototype"键。不过，从 ES5 开始可以使用map = Object.create(null)来创建一个没有原型的对象。
- 一个对象的键只能是字符串或者 Symbols，但一个 Map 的键可以是任意值。
- 你可以通过size属性很容易地得到一个Map的键值对个数，而对象的键值对个数只能手动确认。

想了解更多的 Map 的知识，可以参考 MDN 文档——[Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)。

## 用 JavaScript 编写字典类

让我们自己用 JavaScript 写个字典类吧！我们不要求和 Map 的实现一模一样，只要能够表达键值对和唯一值这两个特性，再实现一些 `set`、`get`、`values`、`getItems`等方法即可。

### 私有变量

为了用键值对存储唯一的元素，我们使用一个对象 `items` 来作为私有变量：

```js
function Set(){
  var items = {};
}
```

然后，将键值对作为该对象的键和值。比如：
```js
{
  '李四': 'lisi@email.com',
  '王五': 'wangwu@email.com'
}
```

### 实现 set 、get、remove 方法

实现 `set` 方法（给字典设置键值对）、`get` 方法（通过键在字典中取值）、`remove` 方法（删除字典中的指定键值），可以跑通如下测试：

```js
var dictionary = new Dictionary();

dictionary.set('张三', 'zhangsan@email.com'); // 代码一
dictionary.set('李四', 'lisi@email.com'); // 代码二

expect(dictionary.has('张三')).toBeTruthy(); // 断言一
expect(dictionary.get('李四')).toBe('lisi@email.com'); // 断言二
expect(dictionary.get('王五')).toBe(undefined); // 断言三

expect(dictionary.remove('张三')).toBeTruthy(); // 断言四
expect(dictionary.remove('张三')).toBeFalsy(); // 断言五

```

来分析下需求吧！

- 代码一、二都比较简单，就是给私有变量 `items` 设置键值对即可。 
- 断言一需要判断 `items` 中是否有指定属性，可以用 `hasOwnProperty` 方法也可以用 `in` 操作符。它俩的区别主要是前者不会判断从原型继承来的属性，因为 `items` 没有从原型继承到一些属性，所以两个方法都可以。 
- 断言二、三主要是判断 `items` 是否有指定属性，有就返回对应的值，没有则返回 `undefined`。 
- 断言四、五需要删除指定键值并返回 `true`，如果没有该属性则返回 `false`。 

分析完了需求直接上代码：

```js
this.has = function (key) {
  return key in items;
};

this.set = function (key, value) {
  items[key] = value;
};

this.get = function (key) {
  return this.has(key) ? items[key] : undefined;
};

this.remove = function (key) {
  if (this.has(key)) {
    delete items[key];
    return true;
  }
  return false;
};
```

### 实现 values 、getItems 方法

实现 `values` 方法（返回字典中所有的值）、`getItems` 方法（获取私有变量 `items`），可以跑通如下测试：

```js
var dictionary = new Dictionary();

dictionary.set('李四', 'lisi@email.com');
dictionary.set('王五', 'wangwu@email.com');

expect(dictionary.values()).toEqual(['lisi@email.com', 'wangwu@email.com']); //断言一
expect(dictionary.getItems()).toEqual({
  '李四': 'lisi@email.com',
  '王五': 'wangwu@email.com'
}); // 断言二
```

来分析下需求吧！

- 实现断言一只需要遍历 `items` 的属性，将其 push 到数组中返回即可。遍历属性是用的是 `for...in`，这种方法可能会遍历原型上继承来的属性（虽然本例中不存在这种情况，不过保险起见，还是写上吧！）。所以还需要判断 `items` 是否有该属性。
- 实现断言二只需要直接返回 `items` 即可。

> `for...in` 以任意序迭代一个对象的可枚举属性。每个不同的属性，语句都会被执行一次。更多细节请参考 MDN 文档 —— [for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)。

分析完了需求直接上代码：

```js
this.values = function () {
  var values = [];
  for (var key in items){
    if(this.has(key)){
      values.push(items[key]);
    }
  }
  return values;
};

this.getItems = function () {
  return items;
};
```

至此，字典类就写完了。

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>