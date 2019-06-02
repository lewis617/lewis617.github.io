---
title: CSS 基础：块级元素、行内元素、替换元素、非替换元素
date: 2019-06-02 11:23:00
tags: [CSS 基础, 块级元素, 行内元素, 替换元素, 非替换元素]
---

今天，我们要讲的是块级元素、行内元素、替换元素、非替换元素的区分和特点。

<!--more-->

## 元素的分类

**1 替换和不可替换元素** 

从元素本身的特点来讲，可以分为替换和不可替换元素。

**1.1 替换元素**

替换元素就是浏览器根据元素的标签和属性，来决定元素的具体显示内容。

例如：浏览器会根据 `<img>` 标签的src属性的值来读取图片信息并显示出来，而如果查看(X)HTML代码，则看不到图片的实际内容；

又例如：根据`<input>`标签的type属性来决定是显示输入框，还是单选按钮等。

(X)HTML中的`<img>`、`<input>`、`<textarea>`、`<select>`、`<object>`都是替换元素。这些元素往往没有实际的内容，即是一个空元素，浏览器会根据元素的标签类型和属性来显示这些元素。可替换元素也在其显示中生成了框。

**1.2 不可替换元素**

(X)HTML 的大多数元素是不可替换元素，即其内容直接表现给用户端（例如浏览器）。段落`<p>`是一个不可替换元素，文字“段落的内容”全被显示。

**2 显示元素**

除了可替换元素和不可替换元素的分类方式外，CSS 2.1中元素还有另外的分类方式：块级元素（block-level）和行内元素（inline-level，也译作“内联”元素）。

**2.1 块级元素**
在视觉上被格式化为块的元素，最明显的特征就是它默认在横向充满其父元素的内容区域，而且在其左右两边没有其他元素，即块级元素默认是独占一行的。

典型的块级元素有：`<div>`、`<p>`、`<h1>`到`<h6>`，等等。

通过CSS设定了浮动（float属性，可向左浮动或向右浮动）以及设定显示（display）属性为“block”或“list-item”的元素都是块级元素。

但是浮动元素比较特殊，由于浮动，其旁边可能会有其他元素的存在。而“list-item”（列表项`<li>`），会在其前面生成圆点符号，或者数字序号。

**2.2 行内元素**

行内元素不形成新内容块，即在其左右可以有其他元素，例如`<a>`、`<span>`、`<strong>`等，都是典型的行内级元素。

display属性等于“inline”的元素都是行内元素。几乎所有的可替换元素都是行内元素，例如`<img>`、`<input>`等等。

不过元素的类型也不是固定的，通过设定CSS 的display属性，可以使行内元素变为块级元素，也可以让块级元素变为行内元素。

MDN 对行内元素这么定义：

> 一个行内元素只占据它对应标签的边框所包含的空间。

<iframe height="265" style="width: 100%;" scrolling="no" title="行内元素只占据边框" src="//codepen.io/liuyiqi/embed/OYrrjZ/?height=265&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/liuyiqi/pen/OYrrjZ/'>行内元素只占据边框</a> by liuyiqi
  (<a href='https://codepen.io/liuyiqi'>@liuyiqi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 各种元素的width height margin padding 特性

**1 块级元素**

width、 height、 margin的四个方向、 padding的四个方向都正常显示，遵循标准的css盒模型。例如：div

**2 行内替换元素**

width、 height、 margin的四个方向、 padding的四个方向都正常显示，遵循标准的css盒模型。 例如：img

**3 行内非替换元素（重点）**
width、 height不起作用，用line-height来控制高度。

padding左右起作用，上下不会影响行高，但是对于有背景色和内边距的行内非替换元素，背景可以向元素上下延伸，但是行高没有改变。因此视觉效果就是与前面的行重叠。(《css权威指南》 P249)

margin左右作用起作用，上下不起作用，原因在于：行内非替换元素的外边距不会改变一个元素的行高（《css权威指南》 P227）。

<iframe height="265" style="width: 100%;" scrolling="no" title="行内元素特点" src="//codepen.io/liuyiqi/embed/gJZZwX/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/liuyiqi/pen/gJZZwX/'>行内元素特点</a> by liuyiqi
  (<a href='https://codepen.io/liuyiqi'>@liuyiqi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>