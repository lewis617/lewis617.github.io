---
title: JavaScript 版数据结构与算法（七）树
date: 2017-02-18 13:15:00
tags: [数据结构与算法]
---

今天，我们要讲的是数据结构与算法中的树。

<!--more-->

## 树简介

树是什么？树是一种分层数据的抽象模型。都有哪几种树？常见的树包括：

- 二叉树：树中每个节点最多只能有两个子节点。
- 二叉搜索树（BST）：二叉树的一种，但是它只允许你在左侧节点存储(比父节点)小的值， 在右侧节点存储(比父节点)大(或者等于)的值。
- AVL树：一种自平衡二叉搜索树，树中任何一个节点左右两侧子树的高度之差最多为1。
- 红黑树：http://goo.gl/OxED8K
- 堆积树：http://goo.gl/SFlhW6

树有啥用？树的作用有这些：

- 树对存储需要快速查找的数据非常有用。
- 二叉树的先序遍历可以用来打印一个结构化的文档。
- 二叉树的中序遍历可以用来对树进行排序操作。
- 二叉树的后序遍历可以用来计算一个目录和它的子目录中所有文件所占空间的大小。
- 在前端 DOM 操作中，我们有时候会遍历元素，该操作的本质其实也是遍历树。而且值得了解的是：“DOM2 级遍历和范围”模块定义了两个用于辅助完成顺序遍历 DOM 结构的类型：NodeIterator 和 TreeWalker。这两个类型能够基于给定的起点对 DOM 结构执行深度优先（depth-first）的遍历操作。
- 生活中，树可以模拟组织架构，比如总裁管着几个副总裁，副总裁管着几个经理等。



树的应用非常广泛，远远不止上面这些，有兴趣的同学可以自行去了解更多的树的用途，这里不再详述。

## 用 JavaScript 编写二叉搜索树类

树的种类有很多，但本文仅介绍二叉搜索树的 JavaScript 实现，包括了插入、排序等操作。

### 私有变量

因为二叉搜索树的每个节点最多有两个子节点，所以我们首先要编写一个私有的构造器函数 `Node`，来构建树的节点：

```js
var Node = function (key) {
  this.key = key;
  this.left = null;
  this.right = null;
};
```

又因为树的操作通常需要从根节点开始，所以我们还要编写一个私有变量 `root`，用于指向树的根节点：

```js
var root = null;
```

如此一来，如果一颗树是这样：

```js
      11
    7   13
  5   9 
3
```
那么在我们编写的类中就长这样：

```js
{
  key: 11,  // root 指向 key 为 11 的对象。
  left: {
    key: 7,
    left:  { 
      key: 5, 
      left: {
        key: 3,
        left: null,  
        right: null  
      },  
      right: null  
    },
    right:  {  
      key: 9,  
      left: null,  
      right: null  
    } 
  },
  right: {  
    key: 13,  
    left: null,  
    right: null  
  }  
}
```

### 用递归实现 insert 方法

实现 `insert` 方法，可以构造如上面那样的数据结构。在思考代码逻辑前，我们需要回忆一下，二叉搜索树的特点：它只允许你在左侧节点存储(比父节点)小的值， 在右侧节点存储(比父节点)大(或者等于)的值。那么插入方法就必须要进行如下几个操作：

- 判断：判断节点和被插入节点的大小，小了去判断左节点，否则判断右节点
- 移动：移动被判断的节点
- 插入：如果节点为空就插入

使用递归来实现 `insert` 方法，非常简单，只需要将每个子树（特指节点不大于三的子树）的判断、移动、插入过程写进一个递归函数，然后自己调用自己就行了。实现代码如下：

```js
// 辅助函数，用于递归
var insertNode = function (node, newNode) {
  if (newNode.key < node.key) {  
    if (node.left === null) {
      node.left = newNode; // 遇到空值就插入
    } else {
      insertNode(node.left, newNode); // 小了左边走
    }
  } else {
    if (node.right === null) {
      node.right = newNode; // 遇到空值就插入
    } else {
      insertNode(node.right, newNode);  // 大了或相等就右边走
    }
  }
};

this.insert = function (key) {

  var newNode = new Node(key);

  if (root === null) {
    root = newNode; // 遇到空值就插入
  } else {
    insertNode(root, newNode);  // 从根节点开始
  }
};
```

### 使用递归实现中序先序后序遍历

使用递归实现中序先序后序遍历，并实现 `values` 方法（输入遍历方法，遍历节点并 push 到数组中，最后返回数组），可以跑通如下测试：

```js
var binarySearchTree = new BinarySearchTree();

binarySearchTree.insert(11);
binarySearchTree.insert(7);
binarySearchTree.insert(13);
binarySearchTree.insert(5);
binarySearchTree.insert(3);
binarySearchTree.insert(9);

expect(binarySearchTree.values('inOrderTraverse')).toEqual([3, 5, 7, 9, 11, 13]);
expect(binarySearchTree.values('preOrderTraverse')).toEqual([11, 7, 5, 3, 9, 13]);
expect(binarySearchTree.values('postOrderTraverse')).toEqual([3, 5, 9, 7, 13, 11]);
```

中序遍历指先访问左子树，然后访问根，最后访问右子树的遍历方式。那么使用递归实现的话，非常简单，只需要**把每个子树的遍历写进递归函数**中，自己调用自己就行了。

```js
var inOrderTraverseNode = function (node, callback) {
  if (node !== null) {  // 注意一定要写上终止条件
    inOrderTraverseNode(node.left, callback);
    callback(node.key);
    inOrderTraverseNode(node.right, callback);
  }
};

this.inOrderTraverse = function (callback) {
  inOrderTraverseNode(root, callback);
};
```

先序遍历指先访问根，然后访问子树的遍历方式。那么使用递归实现的话也非常简单，还是把每个子树的遍历写进递归函数中，自己调用自己就行了。

```js
var preOrderTraverseNode = function (node, callback) {
  if (node !== null) {  // 注意一定要写上终止条件
    callback(node.key);
    preOrderTraverseNode(node.left, callback);
    preOrderTraverseNode(node.right, callback);
  }
};

this.preOrderTraverse = function (callback) {
  preOrderTraverseNode(root, callback);
};
```

后序遍历指指先访问子树，然后访问根的遍历方式。那么使用递归实现的话也非常简单，还是把每个子树的遍历写进递归函数中，自己调用自己就行了。

```js
var postOrderTraverseNode = function (node, callback) {
  if (node !== null) {  // 注意一定要写上终止条件
    postOrderTraverseNode(node.left, callback);
    postOrderTraverseNode(node.right, callback);
    callback(node.key);
  }
};

this.postOrderTraverse = function (callback) {
  postOrderTraverseNode(root, callback);
};
```

最后，实现 `values` 方法：

```js
this.values = function (traverseFuc) {
  var keyList = [];
  this[traverseFuc](function (key) {
    keyList.push(key);
  });
  return keyList;
};
```

`values` 方法比较简单，不再详述。

###  使用非递归实现中序先序后序遍历

使用递归实现中序先序后序遍历太过简单，面试官通常不屑于考这样的题目，但非递归遍历二叉树借助栈来实现，还是有点小复杂的，面试官考试最爱考了，所以我们接下来学习使用非递归实现中序先序后序遍历。

中序遍历的非递归实现思路是：

- 从根节点开始，左移到树的尽头，向栈中 push 移动过程中的每个节点。
- 从栈中 pop 出一个节点，并访问它。
- 如果该节点有右节点就从右节点开始，重复第一步。
- 如果该节点没有右节点就重复第二步。

上述思路可以简记为：

- 左尽入栈
- 出栈访问
- 有右复一
- 无右复二

我自己编的，很有才吧！实现代码如下：

```js
this.inOrderTraverseUnRec = function (callback) {
  if (root !== null) {
    var stack = new Stack(),
      node = root;
    while (!stack.isEmpty() || node) {
      if (node) {   // 有右复一
        stack.push(node); // 左尽入栈
        node = node.left;
      } else {   // 无右复二
        node = stack.pop(); // 出栈访问
        callback(node.key);
        node = node.right;
      }
    }
  }
};
```

先序遍历的非递归实现思路是：

- 从根节点开始，先访问当前节点，然后将当前节点的右、左节点依次 push 到栈中。
- 从栈中 pop 出一个节点，重复第一步。

上述思路可以简记为：

- 访问当前
- 入栈右左
- 出栈复一

实现代码为：

```js
this.preOrderTraverseUnRec = function (callback) {
  if (root !== null) {
    var stack = new Stack();
    stack.push(root);
    while (!stack.isEmpty()) {
      var node = stack.pop(); // 出栈复一
      if (callback) {  // 访问当前
        callback(node.key);
      }
      if (node.right) {  // 入栈右左
        stack.push(node.right);
      }
      if (node.left) {
        stack.push(node.left);
      }
    }
  }
};
```

后序遍历需要两个栈，它的非递归实现思路是通过先序遍历改编的，即将先序遍历中的**访问操作**改为**入栈操作**，等全部入栈后出栈访问：

实现代码为：

```js
 this.postOrderTraverseUnRec = function (callback) {
   if (root !== null) {
     var stack = new Stack(),
       outputStack = new Stack(),
       node;
     stack.push(root);
     while (!stack.isEmpty()) {
       node = stack.pop();
       outputStack.push(node);  // 将先序遍历中的访问操作改为入栈操作
       if (node.left) {
         stack.push(node.left);
       }
       if (node.right) {
         stack.push(node.right);
       }
     }
     while (!outputStack.isEmpty()) {
       node = outputStack.pop();  // 全部入栈后出栈访问
       if (callback) {
         callback(node.key);
       }
     }
   }
 };
```

还有搜索和移除的方法，本文不再讲解，有兴趣的同学可以自己研究示例代码。今天到此为止！

 
## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>