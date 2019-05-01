---
title: React 与 Redux 教程（二）Redux的单一状态树完全替代了React的状态机？
date: 2016-01-21 02:30:00
tags: [React, Redux]
---

上篇React 与 Redux 教程，我们讲解了官方计数器的代码实现，[React 与 Redux 教程（一）](https://lewis617.github.io/2016/01/19/r2-counter/)。我们发现我们没有用到React组件本身的state，而是通过props来导入数据和操作的。

我们知道React本身是个状态机，也就是说组件是state的表现形式。那么Redux提供了一个全局的唯一的状态树，是不是就不需要组件本身的state了呢？

<!--more-->

#### 当然不是！

有图为证，这是官方的todomvc的例子：

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xtyc19m6j208h04zt8o.jpg)

我们直接看React开发工具截图：

App组件没有state

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xtz97rnuj20l8095q57.jpg)

Header组件没有state

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xtz950e9j20l8095tb0.jpg)

MainSection组件有state

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xtz8nocuj20l9095die.jpg)

TodoItem组件有state

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xtz9dusrj20l7091n0n.jpg)

Footer组件没有state

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xtz9fo4fj20l7091q5s.jpg)

## 何时用React组件的state、props？

从上面的截图我们可以发现，state只应用了两个功能：

  1. 列表的过滤功能，即完成、未完成、全部的选择
  2. 每一项的编辑与查看功能，即双击每一项，即可进入编辑状态

有此我们可以得出结论，state只表示一些"临时的""内部的"状态数据。

临时的，代表你可以临时改变这个数据，比如显示完成、未完成、全部的任务，这都是临时的状态，还有任务处于编辑状态或者查看状态都是临时的。

内部的，代表如果你的数据只需要在这一个组件中使用，那么你应该使用组件的内部状态。



props则正好相反，它通常存储一些方法，一些可能需要存库的长期数据和一些需要传递和共享的数据。

比如`App`组件中的`todos`代表任务数组，`actions`代表一些操作的方法，这些我们都存进了props中。还有`Footer`组件中的`activeCount`以及`completedCount`都是长期存在的数据，而且可能不止一个组件在使用。

## 对比Redux的全局唯一的state

我们在开发工具上查看全局唯一状态树，发现是个todos数组。对应的是长期数据（并不一定要求是长期数据）和用于在多个组件中共享的数据。

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xtz92w0nj20kt06x0uh.jpg)

## 再看Redux与React流程

Redux和React两个搭档之间，基本只有两种联系：

  1. React从Redux的state读取数据
  2. React能dispatch分发actions到Redux，Redux的reducer来返回一个新的state

React组件就像是个婴儿，Redux就像是奶妈：

  1. 婴儿饿了，哭着要要奶喝，就是dispatch actions的过程
  2. 奶妈准备好给婴儿喂奶就是，React从Redux的state读取数据的过程

## 结论：Redux的state和React组件的state没有半毛钱关系

现在我们知道Redux的state装得是全局的，长期数据（并不一定要求是长期数据）也就是对应props的数据。而React组件的state，官方建议不要放这类数据，而应该是临时的内部状态数据。所以两个state没有半毛钱关系！

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>