---
title: JavaScript 版数据结构与算法（三）链表
date: 2017-02-15 18:35:00
tags: [数据结构与算法]
---

今天，我们要讲的是数据结构与算法中的链表。

<!--more-->

## 链表简介

链表是什么？链表是一种动态的数据结构，这意味着我们可以任意增删元素，它会按需扩容。为何要使用链表？下面列举一些链表的用途：

- 因为数组的存储有缺陷：增删元素时往往需要移动元素。而链表在内存中的放置并不是连续的，元素通过 next 属性指向下个元素，所以链表增删元素，不需要移动元素，只需要更改 next 的指向即可。
- 在生活中，最形象的链表莫过于火车了，车头是 head，每一节车厢都有一个 next 用于连接后面的车厢，想增删车厢，只需要更改 next 即可。
- 在使用分离链接法解决散列表冲突时，我们也会用链表存储位置冲突的元素。
- 在 JavaScript 这门语言中有两个非常重要的**链**：作用域链和原型链。学习链表对于理解 JavaScript 的这两个特性也非常有帮助。

![](https://ws1.sinaimg.cn/mw690/83900b4egy1fcrboyt21qj20ic041q2q)

## 使用 JavaScript 编写链表类

与前面两节课相同，编写链表类，我们仍然使用构造器函数的方法。

```js
function LinkedList() {
  ...
}

module.exports = LinkedList;
```

### 私有变量

与栈和队列不同，链表类的私有变量不是一个数组，而是一个指针 `head`。这个指针其实就是指向某个对象的普通变量而已。除此之外，我们还要定义私有变量 `length` 来记录链表的长度和一个私有的构造器函数 `Node` 来构建包含 next 属性的链表元素。

```js
function LinkedList() {
  var Node = function (element) {
    this.element = element;
    this.next = null;
  };

  var length = 0;
  var head = null;
}

```

那么链表元素究竟在代码中长什么样呢？假设一个链表先后有 `15，10` 两个元素，那么这个链表其实就长这样：

```js
{
  element: 15,
  next: {
    element : 10,
    next: null
  }
}
```

私有变量 `head` 就指向 `element` 为 `15` 的那个对象，`length` 就是 `2`，构造器函数 `Node` 仅仅用来创建链表元素。

### 实现 append 和 toString 方法

了解了私有变量，我们来实现各种类方法。我们期望链表类拥有 `append` 和 `toString` 方法，即追加元素和转为字符串，可以跑通下面的测试：

```js
var linkedList = new LinkedList();
// 添加15
linkedList.append(15);
// 添加10
linkedList.append(10);
// 转化为字符串
expect(linkedList.toString()).toBe('15,10');
```

如果仅仅是为了跑通上述测试，那么非常简单，只需要用数组即可，但是注意我们是给链表类实现方法，所用的数据结构必须为链表才行，所以当 `append(15)` 时，`head` 应该为：

```js
{
  element: 15,
  next: null
}
```
当 `append(10)` 时，`head` 应该为：

```js
{
  element: 15,
  next: {
    element : 10,
    next: null
  }
}
```

所以，我们编写的代码如下：

```js
this.append = function (element) {
  var node = new Node(element),
    current;
  
  // 链表为空直接将 head 指向新元素
  if (head === null) {
    head = node;
  } else {
    // 链表不为空需要将 current 移动到最后一个元素
    current = head;
    while (current.next) {
      current = current.next;
    }
    // 然后将最后一个元素的 next 属性指向新元素
    current.next = node;
  }
  length++;
};

...

this.toString = function () {

  var current = head,
    string = '';

  while (current) {
    string += current.element + (current.next ? ',' : '');
    current = current.next;
  }
  return string;

};
```

上述两个方法都遍历了链表：

```js
while (current) {
  // 此处编写循环中的逻辑
  ...
  current = current.next;
}
```
看到这里，很多不熟悉 JavaScript 的同学可能会问：`current = cuuren.next` 是什么？让我慢慢解释一下。在 JavaScript 中，变量分为基本类型和引用类型，其中对象类型是引用类型的，也就是说创建一个对象时，在内存开辟了一块地方，后续无论你将这个变量传给多少个其他变量，这些变量都指向同一块内存：

```js
var a = { name: 'lewis' };
b = a;
b.name = 'susan';
console.log(a); // { name: 'susan' }
```
所以在链表中，我们可以使用 `head`、`current` 等变量来指向某个存在内存中的变量：

```js
{
  element: 15,   // head 指向 element 为 15 的对象
  next: {
    element : 10, // current 是个临时变量，可以更改它的指向来遍历链表
    next: null
  }
}
```
所以 `current = current.next` 就相当于 `current` 原来指向 element 为 15 的对象，后来指向了 element 为 10 的对象，因为后者挂在前者的 next 属性上，就像上述代码中的那样。现在你应该明白了吧！更详细的引用类型的知识可以自行谷歌。

### 实现 removeAt 方法

实现 `removeAt` 方法，即删除指定位置的元素，可以跑通如下测试：

```js
var linkedList = new LinkedList();
linkedList.append(15);
linkedList.append(10);
// 删除位置小于0的元素时返回 null
expect(linkedList.removeAt(-1)).toBe(null); // 断言一
// 删除位置大于链表长度的元素时返回 null
expect(linkedList.removeAt(3)).toBe(null); // 断言二
// 删除位置为1的元素并返回
expect(linkedList.removeAt(1)).toBe(10); // 断言三
// 删除位置为0的元素并返回
expect(linkedList.removeAt(0)).toBe(15); // 断言四
// 链表现在没有元素了
expect(linkedList.toString()).toBe('');
```

断言一、二都是异常情况，应该使用条件语句来判断并跳过，断言三、四是正常情况，应该删除元素并返回。

> 不了解断言和单元测试的同学，可以先看[《Jest 单元测试入门》](https://lewis617.github.io/2017/02/15/start-jest/)这篇博客。

实现代码如下：

```js
this.removeAt = function (position) {
  // 用于跳过异常情况
  if (position > -1 && position < length) {
    var current = head,
      previous,
      index = 0;
    // 删除头部元素
    if (position === 0) {
      head = current.next;
    } else {
      // 找出指定位置元素，并让它的前一个元素连接它的后一个元素
      while (index < position) {
        previous = current;
        current = current.next;
        index++;
      }
      previous.next = current.next;
    }

    length--;
    return current.element;

  }
  return null;
};
```

这个方法的技巧是找出指定位置元素，但本质还是遍历链表，只是终止条件有差别而已：

```js
while (index < position) {
  // 代码逻辑
  ...
  current = current.next;
  index++;
}
```

### 实现 insert 方法

实现 `insert` 方法，即向指定位置插入指定元素，跑通如下测试：

```js
var linkedList = new LinkedList();
expect(linkedList.insert(0, 15)); // 断言一
expect(linkedList.insert(1, 12)); // 断言二
expect(linkedList.insert(0, 10)); // 断言三
expect(linkedList.insert(-1, 8)); // 断言四
expect(linkedList.insert(4, 8)); // 断言五
expect(linkedList.toString()).toBe('10,15,12');
```

断言一、三是往头部插入，断言二是往非头部插入，断言四、五都是异常非法输入。实现代码如下：

```js
this.insert = function (position, element) {
  // 用于跳过非法输入，对应第四个和第五个断言
  if (position > -1 && position <= length) {
    var node = new Node(element),
      current = head,
      previous,
      index = 0;
    // 往头部插入，对应第一个和第三个断言
    if (position === 0) {
      node.next = current;
      head = node;
    } else {
      // 往非头部插入，对应第二个断言
      while (index < position) {
        previous = current;
        current = current.next;
        index++;
      }
      node.next = current;
      previous.next = node;
    }

    length++;

    return true;
  }
  return false;
};
```

这个方法的技巧也是在链表中查找指定元素，其他都是无聊的边界判断。

### 实现 indexOf 方法

实现 `indexOf` 方法，即返回指定位置的元素，跑通如下测试。

```js
var linkedList = new LinkedList();
linkedList.append(15);
linkedList.append(10);
expect(linkedList.indexOf(12)).toBe(2); // 断言一
expect(linkedList.indexOf(8)).toBe(-1); // 断言二
```

断言一是正常情况，返回 `position`，断言二没有该元素返回 `-1` 。技巧还是在链表中遍历查找元素。

```js
this.indexOf = function (element) {
  var current = head,
    index = 0;

  while (current) {
    if (element === current.element) {
      return index;
    }
    index++;
    current = current.next;
  }
  return -1;
};
```

其他方法比较简单不再赘述。

## 总结

玩转链表，有以下技巧：

- 确定私有变量和元素结构，主要包括一个 head 指针，一个构造器函数 Node，用于生成包含 next 属性的对象。
- 掌握遍历链表的方法，即使用 while 循环，通过 `current = curren.next`来遍历。
- 学习在遍历链表时使用 `previous` 来记录当前节点的上一个节点。
- 考虑各种边界情况：空链表、在查找范围外等情况。

除了掌握上述技巧，动手写代码也是很重要的！今天，就到此为止。

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>