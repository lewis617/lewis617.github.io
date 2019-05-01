---
title: JavaScript 版数据结构与算法（二）队列
date: 2017-02-15 13:53:00
tags: [数据结构与算法]
---

今天，我们要讲的是数据结构与算法中的队列。

<!--more-->

## 队列简介

队列是什么？队列是一种先进先出（FIFO）的数据结构。队列有什么用呢？队列通常用来描述算法或生活中的一些先进先出的场景，比如：

- 在图的广度优先遍历中，我们需要使用队列来记录每个节点的相邻节点，以便可以在接下来最先访问它们，从而实现广度优先遍历。
- 在 JavaScript 事件循环（Event Loop）中有一个事件队列（Task Queue），也是先进先出来处理各种异步事件。
- 在生活中，队列可以映射排队打饭等先来后到的场景。

![](https://ws1.sinaimg.cn/mw690/83900b4ely1fcr48hfps7j20c40drglj)

## 用 JavaScript 编写队列类

和[《JavaScript 版数据结构与算法（一）栈》](https://lewis617.github.io/2017/02/15/stack/)中编写栈类的方法类似，编写队列类也使用了构造器函数。

编写一个队列类，可以跑通如下测试：

```js
var queue = new Queue();
expect(queue.isEmpty()).toBeTruthy();
queue.enqueue('张三');
queue.enqueue('李四');
queue.enqueue('王五');
expect(queue.front()).toBe('张三');
expect(queue.toString()).toBe('张三,李四,王五');
expect(queue.size()).toBe(3);
expect(queue.isEmpty()).toBeFalsy();
queue.dequeue();
queue.dequeue();
expect(queue.toString()).toBe('王五');
```

队列类比较简单，直接上代码：

```js
function Queue() {
  // 私有变量 items，用于记录数组
  var items = [];
  // 入队
  this.enqueue = function (element) {
    items.push(element);
  };
  // 出队
  this.dequeue = function () {
    return items.shift();
  };
  // 查看队列的第一个元素
  this.front = function () {
    return items[0];
  };
  // 查看队列是否为空
  this.isEmpty = function () {
    return items.length == 0;
  };
  // 查看队列的长度
  this.size = function () {
    return items.length;
  };
  // 将数组转为字符串并返回
  this.toString = function () {
    return items.toString();
  };
}

// 导出队列类
module.exports = Queue;
```

请注意数组增删的四个方法，别搞混淆了：

- push：在尾部添加新元素
- pop：删除并返回尾部元素
- unshift：在头部添加新元素
- shift：删除并返回头部元素

所以，出队的方法用的是 shift。另外，如果考虑时间复杂度，使用数组创建队列并不是一个好方法，因为出队时，所有的元素都会移动位置，造成较差的性能。而使用链表则会更好，因为链表不是连续存储的，增删元素只需要改变相关的指向即可。

## 优先队列：加队就是这么任性

普通的队列类就是调用原生 Array 对象的方法，比较简单，但是还有一种队列叫优先队列。在优先队列里面，有些人比较霸道，可以加队。不过，如果遇到比他更霸道的人，他也得老实在后面排着。举个例子吧！假设有三个人：张三、李四、王五。王五是个没本事的老实人。张三是个小流氓，经常欺负王五。李四呢？是个官老爷。他们三个排队，小流氓张三先来，官老爷李四第二个来，老实人王五最后来。结果，张三给李四让道，王五还是排在最后。在优先队列里，我们使用优先级（priority）来描述霸道程度。

```js
var priorityQueue = new PriorityQueue();
priorityQueue.enqueue('张三', 2);
priorityQueue.enqueue('李四', 1);
priorityQueue.enqueue('王五', 3);
expect(priorityQueue.toString()).toBe('李四-1,张三-2,王五-3');
```

上述代码中，名字后面的数字就是优先级。排队结果就如最后一个断言所示：`'李四-1,张三-2,王五-3'`。

为了实现上述测试用例，我们需要改写 `enqueue` 方法和`toString`方法：

```js
function PriorityQueue() {
  var items = [];

  // 利用构造器函数创建队列元素
  var QueueElement = function (element, priority) {
    this.element = element;
    this.priority = priority;
  };

  this.enqueue = function (element, priority) {
    var queueElement = new QueueElement(element, priority);

    // 张三的情况
    if (this.isEmpty()) {
      items.push(queueElement);
    } else {
      var added = false;
      for (var i = 0; i < items.length; i++) {
        if (queueElement.priority < items[i].priority) {
          // 李四的情况
          items.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }
      // 王五的情况
      if (!added) {
        items.push(queueElement);
      }
    }
  };

  ...
  
  this.toString = function () {
    var string = '';
    for (var i = 0; i < items.length; i++) {
      string += items[i].element + '-' + items[i].priority + (items.length - i > 1 ? ',' : '');
    }
    return string;
  };
}

module.exports = PriorityQueue;
```

因为这三个人正好代表了所有的情况，所以只要将测试用例跑通，逻辑就写完了。为何会如此？其实我当时在写测试用例时，故意将代码覆盖率刷到100%。也就是说，测试用例涵盖了所有的情况。`toString` 方法则是则是多打印了一个优先级而已，其他方法与普通队列一样，不再赘述。


## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>