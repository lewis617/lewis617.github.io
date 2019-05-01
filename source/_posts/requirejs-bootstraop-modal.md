---
title: 使用RequireJs和Bootstrap模态框实现表单提交
date: 2015-09-26 09:59:00
tags: [RequireJs, Bootstrap]
---

下面我将使用Requirejs结合模态框实现**三五行代码**部署表单提交操作。

<!--more-->

### 传统开发思路如下：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9yh3tas1qj20i208bt9d.jpg)

缺点：所有代码写在一个html中，难以阅读，难以维护，难以复用！

### 使用Requirejs开发思路如下（且看笔者如何解耦模块化代码）：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9yh3q1t3zj20df0csmxk.jpg)

 缺点：编写过程较为复杂

优点：代码解耦，便于复用。什么时候你想复用，只需require你编写好的js模块，即可！里面的bootstrap,jquery,模态框等等所有东西都会加载好（因为你在定义的时候，已经写好依赖关系了）

举个例子：我们项目中关于项目授权的使用至少存在三个页面，编写好这样一个js模块，可以很轻易的在那三个页面上复用。如果使用传统办法，估计要复制粘贴大量的html和js。

看一下代码运行效果吧：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9yh3vaig6j20os0pjafa.jpg)