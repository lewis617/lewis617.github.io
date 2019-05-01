---
title: JavaScript 版数据结构与算法（四）集合
date: 2017-02-16 10:11:00
tags: [数据结构与算法]
---

今天，我们要讲的是数据结构与算法中的集合。

<!--more-->

## 集合简介

什么是集合？与栈、队列、链表这些**顺序**数据结构不同，集合是一种**无序且唯一**的数据结构。集合有什么用？在 Python 中，我经常使用集合来给数组去重：

```python
>>> list(set([1,1,2]))
[1, 2] 
```

当然，ES6中也实现了集合——Set，那么 JavaScript 集合风格的数组去重应该是这样：

```js
function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}
```
貌似没有  Python 简约，不过简约谁比得过 Python 呢？哈哈！JavaScript 中有了 Set 总比没有强。想更多地了解 Set，可以看 MDN 文档—— [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)。

除此之外，我们还可以使用集合来执行并集、交集、差集、子集等操作。

## 用 JavaScript 编写集合类

尽管 ES6 已经实现了集合类——Set，不过我们还是自己写一个吧！

### 私有变量

为了存储无序且唯一的元素，我们使用一个对象 `items` 来作为私有变量：

```js
function Set(){
  var items = {};
}
```

然后，将每个元素作为该对象的键和值。比如，一个集合包含 `1,2` 两个元素，那么该集合的数据结构就应该是：

```js
{
  '1': 1,
  '2': 2
}
```

这样就保证了集合元素的**无序且唯一**。

### 实现 has 、add、remove 方法

实现 `has` 方法（即判断集合中是否存在指定元素）、`add` 方法（向集合中添加不存在的元素）、`remove` 方法（删除集合中存在的元素），可以跑通如下测试：

```js
var set = new Set();

expect(set.add(1)).toBeTruthy(); // 断言一
expect(set.add(1)).toBeFalsy(); // 断言二
expect(set.add(2)).toBeTruthy(); // 断言三

expect(set.has(1)).toBeTruthy(); // 断言四
expect(set.has(3)).toBeFalsy(); // 断言五

expect(set.remove(1)).toBeTruthy(); // 断言六
expect(set.remove(1)).toBeFalsy(); // 断言七
```

上述测试代码中的七个断言都需要判断元素是否存在于集合中。那么如何判断元素是否存在于集合中呢？答案是使用 `hasOwnProperty` 方法。
> `hasOwnProperty` 这个方法可以用来检测一个对象是否含有特定的自身属性；和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。更多的用法可以参考 MDN 文档——[Object.prototype.hasOwnProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

通过 `hasOwnProperty` 方法我们可以轻易实现 `has` 方法。有了 `has` 方法，`add` 和 `remove` 方法仅仅就是一个条件判断和给对象 `items` 赋值的简单问题了。实现代码如下：

```js
this.has = function (value) {
  return items.hasOwnProperty(value); // {1}
};

this.add = function (value) {
  if (!this.has(value)) {
    items[value] = value;
    return true;
  }
  return false;
};

this.remove = function (value) {
  if (this.has(value)) {
    delete items[value];
    return true;
  }
  return false;
};
```

### 实现 size 和 values 方法

实现 `size` 方法（返回集合元素个数）和 `values` 方法（返回集合所有值），跑通如下测试：

```js
var set = new Set();
set.add(2);

expect(set.size()).toBe(1); // 断言一
expect(set.values()).toEqual(['2']); // 断言二
```
断言一返回集合元素个数，断言二以数组形式返回所有值。为了实现这个需求，我们需要使用 `Object.keys()` 方法来获取对象的属性。

> `Object.keys()` 方法会返回一个由给定对象的所有可枚举自身属性的属性名组成的数组，数组中属性名的排列顺序和使用 for-in 循环遍历该对象时返回的顺序一致 (顺序一致不包括数字属性)（两者的主要区别是 for-in 还会遍历出一个对象从其原型链上继承到的可枚举属性）。更多的用法请参考 MDN 文档——[ Object.keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)。

所以编写的代码如下：

```js
this.size = function () {
  return Object.keys(items).length;
};

this.values = function () {
  return Object.keys(items);
};
```

### 实现 union 方法

实现 `union` 方法（和另一个集合取并集），跑通如下测试：

```js
var set = new Set();
set.add(1);
set.add(2);

var otherSet = new Set();
otherSet.add(3);

var unionSet = set.union(otherSet);
expect(unionSet.values()).toEqual(['1', '2', '3']);
```

通过上述测试，我们可以知道，`1,2`  和 `3`取并集是 `1,2,3`。那么如何用代码实现呢？其实很简单，只需要新建一个集合，然后遍历两个集合的元素，并添加到新集合即可，新集合会自动过滤已经存在的元素，自然而然就得到了并集。实现代码如下：

```js
this.union = function (otherSet) {
  var unionSet = new Set();

  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    unionSet.add(values[i]);
  }

  values = otherSet.values();
  for (i = 0; i < values.length; i++) {
    unionSet.add(values[i]);
  }

  return unionSet;
};
```

### 实现 intersection 方法

实现 `intersection` 方法（和另一个集合取交集），跑通如下测试：

```js
var set = new Set();
set.add(1);
set.add(2);

var otherSet = new Set();
otherSet.add(2);
otherSet.add(3);

var intersectionSet = set.intersection(otherSet);
expect(intersectionSet.values()).toEqual(['2']);
```

上述测试代码，仅仅是将 `set` 和 `otherSet` 两个集合取交集，最终为 `2`。实现思路非常简单，只需要新建一个集合，然后遍历 `otherSet` 的元素，只要在 `set` 中存在就添加到新集合中，最后返回新集合。实现代码：

```js
this.intersection = function (otherSet) {
  var intersectionSet = new Set();

  var values = otherSet.values();
  for (var i = 0; i < values.length; i++) {
    if (this.has(values[i])) {
      intersectionSet.add(values[i]);
    }
  }
  return intersectionSet;
};
```
### 实现 difference 方法

实现 `difference` 方法（和另一个集合取差集），跑通如下测试：

```js
var set = new Set();
set.add(1);
set.add(2);

var otherSet = new Set();
otherSet.add(2);
otherSet.add(3);

var differenceSet = set.difference(otherSet);
expect(differenceSet.values()).toEqual(['1']);
```

上述测试代码仅仅是将 `set` 和 `otherSet` 两个集合取差集得到 `1`。实现思路非常简单，只需要新建一个集合，然后遍历 `set` 中的元素，如果元素不存在于 `otherSet` 中就添加到新集合中。实现代码如下：

```js
this.difference = function (otherSet) {
  var differenceSet = new Set();

  var values = this.values();
  for (var i = 0; i < values.length; i++) {
    if (!otherSet.has(values[i])) {
      differenceSet.add(values[i]);
    }
  }
  return differenceSet;
};
```

### 实现 subset 方法

实现 `subset` 方法（判断是否是另一个集合的子集），跑通如下测试：

```js
var set = new Set();
set.add(1);
set.add(2);
set.add(3);

var otherSet = new Set();
otherSet.add(2);
otherSet.add(3);

expect(set.subset(otherSet)).toBeFalsy(); // 断言一
set.remove(3);
expect(set.subset(otherSet)).toBeFalsy();  // 断言二
set.add(1);
expect(set.subset(otherSet)).toBeTruthy();  // 断言三
```

断言一判断 `1,2,3` 是否是 `2，3` 的子集，因为元素个数都比人家多，显然不是。断言二判断 `1，2` 是否是 `2,3` 的子集，因为 `1` 不在 `2,3` 中，所以也不是。断言四判断 `2` 是否是 `2,3` 的子集，显然是。实现代码如下：

```js
this.subset = function (otherSet) {
  if (this.size() > otherSet.size()) {
    return false;
  } else {
    var values = this.values();
    for (var i = 0; i < values.length; i++) {
      if (!otherSet.has(values[i])) {
        return false;
      }
    }
    return true;
  }
};
```

至此，集合类就完成了！

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>