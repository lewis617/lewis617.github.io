---
title: JavaScript 版链表算法题：两个数相加
date: 2017-03-12 11:41:00
tags: [数据结构与算法, LeetCode]
---

今天，我们要讲的是一道链表算法题：两个数相加。这道题有两个版本，它们都来自 LeetCode：

https://leetcode.com/problems/add-two-numbers/

https://leetcode.com/problems/add-two-numbers-ii/

本文将先回顾链表的基础知识，然后解决这两个问题，所用的语言依然是 JavaScript。

<!--more-->

## 链表基础

在前面的博文[《JavaScript 版数据结构与算法（三）链表》](https://lewis617.github.io/2017/02/15/linked-list/)中，我们讲解了：

- 什么是链表？
- 链表的作用？
- 链表的数据结构长啥样？
- 如何用 JavaScript 编写一个链表类，并实现 `append`、`toString`、`removeAt`、`insert`、`indexOf` 等多个链表方法。

这些基础知识对做链表题非常有帮助，如果你之前没有阅读过这篇博文，那么我强烈建议你读一遍，然后自己写一个链表类。如果你对链表的基础知识比较熟悉，那么就继续往下读吧！

## 两个数相加

让我们开始做题吧！首先，先来看下题目：

> 给你两个非空的链表来表示两个非负整数。整数的每个数字倒序存储在链表的每个节点中。现在你需要写一个函数，将两个整数相加，并以链表的形式返回它们的和。
> 
> 你可以假设两个整数没有任何前导零，除非是零本身。

我们再通过测试用例来表达一下题意：

```
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8

Input: (1 -> 8) + (0)
Output: 1 -> 8

Input: (9) + (1)
Output: 0 -> 1
```

要实现的函数以及链表的结构是：

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
}
```

题目表述完了，那么如何做呢？其实两个数相加的逻辑非常简单，无非是：

- 从个位开始相加，生成的数字的个位数就是新数字的个位数，十位数放到下个数中相加。
- 对其他位数执行上述操作。

这个小学生都会，那么如何在链表中实现呢？这需要你了解链表几个常用操作：

- 如何遍历链表？
- 如何生成新链表？

如何遍历链表呢？非常简单，你需要一个 `current` 指针（其实就是个变量），然后在 while 循环中执行 `current = current.next` 即可。

如何生成新链表？这也非常简单，你只需要一个 `current` 指针指向链表最后一位，然后执行 `current.next = new Node(val)` 即可。

了解了链表的这两个操作，然后我们对前两个链表进行遍历相加，生成新链表即可。为此，我们需要设置几个变量：

- 三个链表的 `current` 指针：`c1`、`c2`、`c3`。
- 新链表：`l3`。
- 放到下一位相加的数字：`carry`。

完整代码就是：

LeetCode/002-addTwoNumbers.js

```js
var addTwoNumbers = function (l1, l2) {
  var c1 = l1,
    c2 = l2,
    l3, c3,
    carry = 0;

  while (c1 || c2 || carry) {
    var v1 = 0,
      v2 = 0;
    
    // 这么做是为了防止整数中当前位上没有数字
    if (c1) {
      v1 = c1.val;
      c1 = c1.next;
    }

    if (c2) {
      v2 = c2.val;
      c2 = c2.next;
    }

    var sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);

    if (!c3) {
      l3 = new ListNode(sum % 10);
      c3 = l3;
    } else {
      c3.next = new ListNode(sum % 10);
      c3 = c3.next;
    }

  }
  return l3;
};
```

## 两个数相加第二版

上面的题目相对来说还是比较简单的，因为两个数相加是从低位到高位，而链表遍历是从前面到后面，正好是一致的。那么如果我们将整数的每个数字正序存贮在链表中，如何实现这道题呢？

```
Input: (7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 8 -> 0 -> 7

Input: (7) + (5)
Output: 1 -> 2
```

虽然正序存储更符合我们的书写阅读整数的习惯，但在链表中执行相加操作时却很麻烦，我们需要从低位开始计算才行。那么如何解决这个问题呢？答案是使用栈！

- 先遍历两个链表，将数字 push 到各自的栈中。
- 然后依次 pop 出数字进行相加操作，生成的新数字存储在第三个栈中。
- 最后将第三个栈的每个数字 pop 出来添加到新链表中。

完整代码是：


LeetCode/445-addTwoNumbers2.js

```js
var addTwoNumbers = function (l1, l2) {
  var c1 = l1,
    c2 = l2,
    l3, c3,
    s1 = [],
    s2 = [],
    s3 = [],
    carry = 0;

  while (c1 || c2) {
    if (c1) {
      s1.push(c1.val);
      c1 = c1.next;
    }

    if (c2) {
      s2.push(c2.val);
      c2 = c2.next;
    }
  }

  while (s1.length || s2.length || carry) {
    var v1 = 0,
      v2 = 0;

    if (s1.length) {
      v1 = s1.pop();
    }

    if (s2.length) {
      v2 = s2.pop();
    }

    var sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);

    s3.push(sum % 10);
  }

  while (s3.length) {
    var val = s3.pop();
    if (!c3) {
      l3 = new ListNode(val);
      c3 = l3;
    } else {
      c3.next = new ListNode(val);
      c3 = c3.next;
    }
  }
  return l3;
};
```

## 总结

两个数相加这道题的本质是考察链表和栈的操作，所以如果你对链表和栈的数据结构和常用操作非常熟悉，那么做这道题就是小菜一碟！

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>