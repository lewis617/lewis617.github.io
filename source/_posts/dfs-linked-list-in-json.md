---

title: 深度优先搜索和链表指针在 JSON 操作中的应用

date: 2019-01-23 16:25:00

tags: [数据结构与算法, LeetCode]

---

最近的工作涉及了大量 JSON 操作，用到了一些之前做过的算法题中的知识，深刻感觉到，传统数据结构与算法在前端开发中的应用也挺多的。所以，想借此文记录总结一番。

<!--more-->

## 深度优先搜索简介

深度优先搜索（Depth-First-Search，DFS）是一种用于遍历或搜索树或者图的算法。顾名思义，它的搜索的规则是深度优先：先访问根结点，如果有孩子节点（或者邻居节点）就优先访问孩子节点，并对孩子节点也进行上述递归访问。

![dfs](https://ws1.sinaimg.cn/mw690/83900b4egy1fcvp988h6bj20bu08vmxg)

DFS 可谓是 LeetCode 中考察最多的知识点了，另外由于动态规划算法可以和 DFS 算法相互转换（就像是所有的递归都可以用“栈”来改写一样），所以 DFS 的题目简直不能更多。

## 使用深度优先搜索打印 JSON

那么 DFS 在 JSON 操作中有什么用处呢？假如你想在网页上渲染一个 JSON，甚至想渲染出一个表单来编辑这个 JSON，那么就要用到 DFS 了。思路也很简单，先访问一个 JSON 的根结点，然后访问它的所有 key（也就是孩子节点），并对 key 也进行上述递归。

示例代码：

```js
const json = { a: { b: 'hello' }, c: [1, 2] };
const dfs = (n) => {
  console.log(n);
  if(String(n) === '[object Object]' || Array.isArray(n)){
    Object.keys(n).forEach(k => { dfs(n[k]); });
  }
}; 
dfs(json);
```

结果如下：

![打印 JSON](https://s2.ax1x.com/2019/01/23/kECv8A.png)

可以发现 JSON 中每个节点都被遍历到了。

## DFS 用于构建无限递归表单

只需要更改上述 `dfs` 函数的参数，就可以渲染 JSON 树中的任意一项了，也可以渲染表单项来编辑它们。比如之前做的递归表单组件：

![递归表单](http://ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/9d7c702a9e3e240b4945ed53a7c5070f.png)

## 链表指针简介

**链表**（Linked list）是一种常见的基础数据结构，是一种线性表，但是并不会按线性的顺序存储数据，而是在每一个节点里存到下一个节点的指针。

链表遍历及操作也是 LeetCode 考察非常多的题目。通常我们会定义一个变量作为指针，然后在循环里让它遍历链表的多个 `next`。比如：

```js
let p = linkedList;
// 某个循环中
p = p.next;

```


## 使用链表指针获取 JSON 中的叶子节点的值

那么链表指针在 JSON 操作中有什么用呢？我们可以把 JS 中 Object 的 key 当作链表中的 `next`。那么如果知道一个叶子节点的路径，我们就可以用指针像遍历链表那样遍历到 JSON 的叶子节点处。比如：

```js
const json = { a: { b: 'hello' }, c: [1, 2] };
const path = ['a', 'b'];
let point = json;
path.forEach(key => { point = point[key] });
// point 为 'hello'，即 json.a.b 的值。
console.log(point);
```

上述代码中，`json` 是我们要查找的 JSON 对象，`path` 是叶子节点的路径，`point` 是指针，通过遍历，`point` 最后指向了指定的叶子节点的值。

## 使用链表指针构造 immutibility-helper 所需要的数据结构

另外，由于 React Redux 的风行，不可变数据结构在前端用的非常多，有个不可变数据工具包叫 immutibility-helper ，它经常用到这样的结构来“不可变”地改变数据：

```js
update(obj, {a: {b: {c: {$set: 1}}}});
```

所以，还可以通过指针来将路径与它所需要的结构进行互转。

## 结语

本文讲述的算法都非常简单，在 LeetCode 上应该属于 Easy 中的 Easy 级别的，但是将算法应用到实际工作中也是一件有趣的事情，故记录下来，作为总结，也抛砖引玉，分享给大家。