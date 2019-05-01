---
title: 使用 JavaScript 批量获取微博评论
date: 2017-11-03 10:36:00
tags: [practical-js, 正则表达式]
---

今天，我们要讲的是如何用 JavaScript 批量获取微博评论。如果你想备份或者转移某个微博页面的评论内容，那么本博客对你而言，将会非常实用。

你可以在这里获取源代码：

<https://github.com/lewis617/practical-node/blob/master/src/weiboBackup.js>

<!--more-->

## 示例代码

本文的示例代码非常简单，只有寥寥几行：

```js
/**
 * 获取微博以及评论文字
 * 先打开微博页面，
 * 然后将下面的js拷贝到浏览器的console面板中
 */

var nodeArray = Array.from(document.querySelectorAll('.list_con .WB_text'));

var textArray = nodeArray.map(function (node) {
  return Array.from(node.childNodes).map(function (childNode) {
    var value;
    // 文字的情况
    if (childNode.nodeName === '#text') value = childNode.nodeValue;
    // 图片表情的情况
    else if (childNode.nodeName === 'IMG') value = childNode.alt;
    // 链接的情况
    else if (childNode.nodeName === 'A') value = childNode.lastChild.nodeValue;
    return value.replace(/(\s+$)|(^\s+)/g, '');
  }).join('');
});

console.log(textArray.join('\n'));
```

是不是很短很开心？接下来我们来看下这几行 JavaScript 代码的使用方法。

## 使用方法

使用上述代码的方法非常简单，只需要：

1，打开微博页面，比如：<http://www.weibo.com/2207255374/Eqkmf0pL4>

![](https://ws1.sinaimg.cn/mw690/83900b4egy1fl4pa7prsyj20xo0qkq8m.jpg)

我们可以看到一共有三条评论。

2，然后将上述 JavaScript 代码拷贝到浏览器的 console 面板中，并按回车键。结果打印了：

```
Geo橙子：在过一阵子是不是要翻成英文，走出国门了
dev_zk：现在好了[太开心][太开心]
dev_zk：哈哈
```

每条评论单独占一行，完美。

## 知识点解析


首先，我们获取评论的节点并将其转换为数组。这里使用了 [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) 和 [document.querySelectorAll](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll) 两个方法。后者返回符合选择器的所有节点，但格式为 [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)。前者是 ES6 的方法，将 `NodeList` 转换为普通数组。

```js
var nodeArray = Array.from(document.querySelectorAll('.list_con .WB_text'));
```

然后，我们遍历每个评论，并将评论中的文字、图片、链接都提取出来。其中用到了 [nodeName](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeName)、[nodeValue](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeValue)、[lastChild](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/lastChild) 这三个 `Node` 的属性。还用了 `replace(/(\s+$)|(^\s+)/g, '')` 来去除首尾的空格。还使用了数组的 `join` 方法来将数组项连接成字符串。

```js
var textArray = nodeArray.map(function (node) {
  return Array.from(node.childNodes).map(function (childNode) {
    var value;
    // 文字的情况
    if (childNode.nodeName === '#text') value = childNode.nodeValue;
    // 图片表情的情况
    else if (childNode.nodeName === 'IMG') value = childNode.alt;
    // 链接的情况
    else if (childNode.nodeName === 'A') value = childNode.lastChild.nodeValue;
    return value.replace(/(\s+$)|(^\s+)/g, '');
  }).join('');
});
```

最后，打印评论。

```js
console.log(textArray.join('\n'));
```

## 教程示例代码及目录

<https://github.com/lewis617/practical-js>