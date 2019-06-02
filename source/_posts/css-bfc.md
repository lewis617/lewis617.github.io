---
title: CSS 基础：BFC
date: 2019-06-02 11:23:00
tags: [CSS 基础, BFC]
---

今天，我们要讲的是 BFC 的相关知识。

<!--more-->

## 什么是 BFC？

> 块格式化上下文（Block Formatting Context，BFC）是Web页面的可视化CSS渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。

## 创建 BFC

1. 根元素或包含根元素的元素
2. 浮动元素 float ＝ left | right 或 inherit（≠ none）
3. 绝对定位元素 position ＝ absolute 或 fixed
4. display ＝ inline-block | flex | inline-flex | table-cell 或 table-caption
5. overflow ＝ hidden | auto 或 scroll (≠ visible)

## BFC 特性

1. BFC 是一个独立的容器，容器内子元素不会影响容器外的元素。反之亦如此。
2. 盒子从顶端开始垂直地一个接一个地排列，盒子之间垂直的间距是由 margin 决定的。
3. 在同一个 BFC 中，两个相邻的块级盒子的垂直外边距会发生重叠。
4. BFC 区域不会和 float box 发生重叠。
5. BFC 能够识别并包含浮动元素，当计算其区域的高度时，浮动元素也可以参与计算了。

## Demo 展示

BFC 区域不会和 float box 发生重叠：

<iframe height="265" style="width: 100%;" scrolling="no" title="BFC 不会和 float 重叠" src="//codepen.io/liuyiqi/embed/QRzzmo/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/liuyiqi/pen/QRzzmo/'>BFC 不会和 float 重叠</a> by liuyiqi
  (<a href='https://codepen.io/liuyiqi'>@liuyiqi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

BFC 能够识别并包含浮动元素，当计算其区域的高度时，浮动元素也可以参与计算了（**清除浮动**）：

<iframe height="265" style="width: 100%;" scrolling="no" title="BFC 把 float 元素高度计算在内" src="//codepen.io/liuyiqi/embed/eabbLN/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/liuyiqi/pen/eabbLN/'>BFC 把 float 元素高度计算在内</a> by liuyiqi
  (<a href='https://codepen.io/liuyiqi'>@liuyiqi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

在同一个 BFC 中，两个相邻的块级盒子的垂直外边距会发生重叠：

<iframe height="429" style="width: 100%;" scrolling="no" title="BFC内部会外边距塌陷，外部不会" src="//codepen.io/liuyiqi/embed/OYrrBB/?height=429&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/liuyiqi/pen/OYrrBB/'>BFC内部会外边距塌陷，外部不会</a> by liuyiqi
  (<a href='https://codepen.io/liuyiqi'>@liuyiqi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>