---
title: CSS 基础：单行与多行省略号
date: 2019-06-02 13:45:00
tags: [CSS 基础, 省略号]
---

今天，我们要讲的是单行与多行省略号的 CSS 实现。

<!--more-->

## 单行省略号

主要是用 `text-overflow` 属性，但为了截断也要用 `overflow` 和 `width` 属性。

<iframe height="265" style="width: 100%;" scrolling="no" title="单行多行省略号" src="//codepen.io/liuyiqi/embed/vwvbGz/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/liuyiqi/pen/vwvbGz/'>单行多行省略号</a> by liuyiqi
  (<a href='https://codepen.io/liuyiqi'>@liuyiqi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 多行省略号

首先，用 `flex: -webkit-box;`，将容器设置为弹性盒子模块，这是老版本的 flex，然后，设置 `-webkit-box-orient: vertical;` 和 `-webkit-line-clamp: 3;` 让其向下布局，并截断三行显示省略号，demo 同上。