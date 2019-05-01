---
title: JavaScript 版数据结构与算法（八）图
date: 2017-02-19 13:27:00
tags: [数据结构与算法]
---

今天，我们要讲的是数据结构与算法中的图。

<!--more-->

## 图简介

图是什么？图是网络结构的抽象模型。图是一组由**边**连接的**节点**(或顶点)。图有啥用？图的作用有这些：

- 图可以表示任何二元关系，比如道路、航班、通信状态。
- 非加权图可以用广度优先遍历来计算最短路径。

图的应用非常广泛，远远不止上面这些，有兴趣的同学可以自行去了解更多的图的用途，这里不再详述。

## 用 JavaScript 编写图类

图的展现方式有很多，常见的包括：

- **邻接矩阵**：矩阵的行列都是图的顶点，数字代表是否连接
- **邻接表**： 由图中每个顶点的相邻顶点列表所组成。存在好几种方式来表示这种数据结构。我们可以用列表(数组)、链表，甚至是散列表或是字典来表示相邻顶点列表。
- **关联矩阵**： 矩阵的行表示顶点，列表示边，数字代表是否连接。

本文将会使用**邻接表**来展现图。下面就让我们用 JavaScript 来编写图类吧！

### 私有变量

既然使用 **邻接表** 来展现图，那么私有变量就是一个数组 `vertices` 来表示图的所有顶点，还有一个字典 `adjList` 来表示每个顶点以及它相邻顶点列表。

```js
var vertices = [];
var adjList = new Dictionary();
```

### 实现 addVertex 、addEdge 和 getAdjList 方法

实现 `addVertex` 方法（添加顶点）、`addEdge` 方法（添加边）和 `getAdjList` 方法（获取顶点和相邻顶点组成的字典，即 `adjList`），可以跑通如下测试：

```js
var graph = new Graph();

var myVertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
for (var i = 0; i < myVertices.length; i++) {
  graph.addVertex(myVertices[i]);
}
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');
graph.addEdge('C', 'D');
graph.addEdge('C', 'G');
graph.addEdge('D', 'G');
graph.addEdge('D', 'H');
graph.addEdge('B', 'E');
graph.addEdge('B', 'F');
graph.addEdge('E', 'I');

expect(graph.getAdjList()).toEqual({
  'A': ['B', 'C', 'D'],
  'B': ['A', 'E', 'F'],
  'C': ['A', 'D', 'G'],
  'D': ['A', 'C', 'G', 'H'],
  'E': ['B', 'I'],
  'F': ['B'],
  'G': ['C', 'D'],
  'H': ['D'],
  'I': ['E']
});
```

我们来分析下需求，`addVertex` 方法其实就是向私有变量 `vertices` 中 push 新的值，不过也需要在 `adjList` 中添加新的键，所以实现代码如下：

```js
this.addVertex = function (v) {
  vertices.push(v);
  adjList.set(v, []);
};
```

`addEdge` 方法其实就是向私有变量 `adjList` 中相关的顶点赋值：

```js
this.addEdge = function (v, w) {
  adjList.get(v).push(w);
  adjList.get(w).push(v);
};
```

`getAdjList` 方法更简单，直接返回私有变量 `adjList.getItems()` 即可：

```js
this.getAdjList = function () {
  return adjList.getItems();
};
```

### 实现广度优先遍历

什么是广度优先遍历？简单来说就是先广后深来遍历图中的顶点。比如一个这样的图：

![](https://ws1.sinaimg.cn/mw690/83900b4egy1fcvopomghbj20dz09ajru)

那么如何实现广度优先遍历呢？这需要用到队列。实现思路如下：

- 把一个顶点的相邻顶点入队，然后访问该顶点（也可以先访问再入队）
- 出队重复第一步

比如，访问 A 时，把 BCD 入队，然后接下来就可以最先访问到 BCD 了，不过注意：因为 B 的相邻顶点也包括 A 所以在入队前，需要判断相邻顶点是否入队（或访问过）。为此，我们需要设置两种状态来记录：

- 白色：没入队
- 黑色：入队了

所以，我们只需要在不同阶段设置不同颜色，并根据颜色选择性入队即可。实现代码如下：

```js
// 将所有顶点初始化为白色
var initializeColor = function () {
  var color = {};
  for (var i = 0; i < vertices.length; i++) {
    color[vertices[i]] = 'white';
  }
  return color;
};

this.bfs = function (v, callback) {
  var color = initializeColor(),
    queue = new Queue();
 
  queue.enqueue(v);  // 入队了就设置为黑色
  color[v] = 'black';

  while (!queue.isEmpty()) {
    var u = queue.dequeue(),  // 出队重复第一步
      neighbors = adjList.get(u);

    for (var i = 0; i < neighbors.length; i++) {  // 将所有相邻顶点入队
      var w = neighbors[i];
      if (color[w] === 'white') {
        queue.enqueue(w);
        color[w] = 'black';  // 入队了就设置为黑色
      }
    }
    if (callback) {
      callback(u);  // 入队完了相邻顶点，就访问该顶点
    }
  }
};
```

### 实现深度优先遍历

什么是深度优先遍历？简单来说，深度优先遍历就是先深后广来遍历。如图：

![](https://ws1.sinaimg.cn/mw690/83900b4egy1fcvp988h6bj20bu08vmxg)
 
 那么如何实现深度优先遍历？这需要用到递归。实现思路如下：

- 先访问一个顶点，然后对相邻顶点挨个进行深度优先遍历。

为了记录访问过的节点，我们用黑色来代表访问过。实现代码如下：

```js
this.dfs = function (v, callback) {
  var color = initializeColor();
  dfsVisit(v, color, callback);
};

var dfsVisit = function (u, color, callback) {
  if (callback) {
    callback(u);
  }
  var neighbors = adjList.get(u);
  color[u] = 'black';
  for (var i = 0; i < neighbors.length; i++) {
    var w = neighbors[i];
    if (color[w] === 'white') {
      dfsVisit(w, color, callback);
    }
  }
};
```

以上就是广度优先遍历和深度优先遍历的 JavaScript 实现。

 
## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>

