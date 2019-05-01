---
title: RxJS + Redux + React = Amazing!（译一）
date: 2016-12-8 10:37:00
tags: [技术讲座, RxJS, Redux, React]
---

今天，我将Youtube上的《RxJS + Redux + React = Amazing!》翻译（+机译）了下来，以供国内的同学学习，英文听力好的同学可以直接看原版视频：

https://www.youtube.com/watch?v=AslncyG8whg

<!--more-->

## 开场白

管理状态很困难，对吧？如果你写过复杂应用，你一定对此深恶痛绝。React社区还有Angular2社区和Ember社区现在都开始使用一个库，叫Redux。为什么？因为它让管理状态变得简单多了。但Redux有个问题，就是它对你写异步代码没什么帮助，因为Redux认为异步是个比管理状态更难的问题。特别是当你试图去解决一些复杂问题，比如：并行或多重WebSockets。这些问题本身就很复杂，你也没辙。所以，这次演说将会介绍使用另一个库，叫RxJS。这个库至少可以让异步问题变得可控可管理，至少可以让你知道发生了什么。

![](https://ws2.sinaimg.cn/mw690/83900b4egw1fajfdn4115j20dw08pabg.jpg)

## 自我介绍

我是谁？我是Jay Phelps。很明显，照片中的衬衫不是我今天穿的，尽管它们很像，（歪果仁就是啰嗦，不过场下听众听到这都乐了）。其实我穿了另外一件蓝色衬衫，但这是我的推特头像，它可以帮助那些还没有认出我的人认出我来。很明显，我是Netflix的软件工程师。你可以关注我，通过下划线jayphelps（就是_jayphelps，然后他又扯了一些没用的，说有另外一个jayphelps，是一个16岁的家伙，经常转推一些足球图片。他说他经常说这个梗，因为很多本来要关注他的人，都去关注那个16岁足球小哥了）。

![](https://ws2.sinaimg.cn/mw690/83900b4egw1fajfagmj60j20dw08pgmo.jpg)

## 什么是Redux

让我们开始讨论什么是Redux。这个演说不会详细介绍Redux和RxJS，因为它们本身就有非常多相关的演说，但我会给你们一个速成教程。这样，即便你不知道它们具体是什么，至少可以了解个大概。Redux提供了一个可预测的状态管理，它通过action和reducer来完成这个工作。那么什么是action？action被用来描述发生的事，但它不关心如何这件事如何发生。让我们来看个例子吧！

```js
{
  type: "CREATE_TODO",
  payload: "Build my first redux app"
}
```

这是个简单的action，通过这个action，你知道了你要去创建一个todo，这个todo的内容是什么，但它没说如何去创建这个todo，它没说是是否要与服务器交互，也没说是否要存到数据库或localstorage中，它没有进行异步操作，它是个完全可以被序列化的对象。那么什么是reducer？reducer是一些纯函数，这意味着每次你给了一样的输入，那么就会有一样的输出，没有副作用。reducer的具体功能是输入上个的state和action，然后输出新的state，当然新的state可以和上个state完全一样（就是case为default的情况）。举个非真实场景的例子吧，这是个计数器的例子：

```js
export default function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1
    case DECREMENT_COUNTER:
      return state - 1
    default:
      return state
  }
}
```
我们仅仅就是选择action类型，当action是加一，state就加一，action是减一，state就减一，就是这么字面性质的工作。reducer负责state更新，但它必须是同步的。这意味着，如果reducer收到加一的action，那么就必须立马加一。reducer不能去除速率过快的事件（debounce），也不能和服务器交互，也不能问“我是否可以加一“。reducer只能受到action，然后立马同步执行。

![](https://ws1.sinaimg.cn/mw690/83900b4egw1fajm1o61ufj20dw08pwfk.jpg)

## 异步

我们平时都做些什么类型的异步操作呢？（竟然没有衔接，直接从Redux转折到异步）为何说异步是个难缠的问题呢？常见的异步事件操作包括：

 - 用户交互（键盘、鼠标）
 - Ajax（这就像面包和黄油一样熟悉，我们每个人都会做Ajax请求）
 - 计时器／动画
 - Web Sockets 
 - Web Workers

这不是个详细的列表。上述其中一些可以同步处理，尽管它们本身是异步的。React 与 Redux 已经封装好了，你可以直接同步处理它们！（然后，他举了一个例子，React组件的点击事件，可以触发加一的action，然后reducer处理这个action）从技术角度上来说，这些事件是异步的，但你可以用同步的方式来处理它。为什么？因为React已经帮你处理了异步。但是，问题来了，如果你还想要点击，如果你想去除速率过快的事件，比如，用户点了很多次，而你不想每次都进行事件处理。这时，你通常会计算点击间隔，然后只处理间隔较大的点击事件。有时候，你需要像这样的更多的控制。这些控制包括：

 - Ajax取消／组合（组合的意思是，比如你发起了一个Ajax，然后你又发起了另外一个Ajax，后一个的发起用到了前一个的响应数据）
 - Debounce／throttle／buffer等这些与时间相关的操作
 - Drag and Drop 
 - Web Sockets, Web Workers, etc

在Redux世界里，人们经常使用中间件来处理这些操作。所有action在你发起后，和到达reducer前，都必须穿过中间件。现在已经有很多中间件使用回调和Promise来做这些事了（指那些复杂的异步操作）。下面就让我们看看这两种最常用的异步处理方法吧！

![](https://ws4.sinaimg.cn/mw690/83900b4egw1fajlzuj7r5j20dw08p75d.jpg)

## 回调和Promise

回调对大家来说非常熟悉，因为它是JavaScript最原始的处理异步的方式（然后他举了个回调的例子，回调太简单，不再赘述）。但是回调有很多问题，其中最常见的就是“回调地狱“。大家几乎都见过这种代码（他指着屏幕上的代码示例）。如果你想改变代码，比如做点这样的事：

 - 条件判断，然后决定是否进行下一个异步
 - 你不想顺序执行这些异步
 - 更加复杂的回调操作，比如你想并发它们等

那么事情就变得非常复杂了，对吧？我的同事称回调地狱是“V型电吉他“，因为它们的形状非常相似。不过，有了一种解决方案，叫Promise。使用Promise有个绝招，那就是如果你给Promise提供了一个回调，这个回调也返回了一个Promise，那么你可以将其写为平行的风格（这算什么绝招啊，大多数人都知道吧！）。如果你理解了这种模式，那么Promise的代码将会变得非常易读。这很棒，它是个非常好的候选方案。让我们更深入的了解一下Promise吧！Promise拥有这些特性：

- 被保证的未来（意思是，一旦你创建了一个Promise，那么它肯定会执行它要做的事情，你不能停止它，开始黑Promise了。）
- 不可变
- 单一的值（意思是，如果你监听一个Promise很多次，你只会得到相同的值，而不是执行多次请求 ）
- 缓存

在真实项目中，你会发现“被保证的未来“和“单一的值“是个问题，先说“被保证的未来“吧，Promise是不能被取消的。或许你会问，我既然创建了一个Promise，为何要取消它？以下场景，你就要取消你的Promise，也就是异步请求：

 - 改变路由／视图（他举了Netflix的一个例子，大概就是点进一个页面，然后后悔了就返回了，这时需要取消请求）
 - 自动补全（这个例子比较常见，自动补全总不能每次键盘按下都发请求吧？）
 - 用户非要你取消

可见，取消异步是一个非常常用，但是容易被忽略的需求。再说Promise的“单一的值“吧！（然后开始黑Promise的“单一的值“，不过他欲扬先抑了一下），其实绝大多数场景下，我们只需要单一的值，比如Ajax，请求-响应，就是单一的值。但人们不只想做这些事，像之前提到的：

- 用户交互（键盘、鼠标）
- Ajax（这就像面包和黄油一样熟悉，我们每个人都会做Ajax请求）
- 计时器／动画
- Web Sockets 
- Web Workers

上述场景也就Ajax是单一的值，其他几个场景都不是。那我们该怎么办呢？那就是使用Observable！

![](https://ws4.sinaimg.cn/mw690/83900b4egw1fajm3lhmmoj20dw08pjsc.jpg)

## 未完待续

这个视频太长了，今天就到此为止吧！在这篇文章中，我们主要听了Jay Phelps：

 - 讲了Redux和异步  
 - 黑了回调和Promise

下篇文章我们将听他：

 - 吹Observable的牛
 - 讲述他和他搭档造redux-obserable这个轮子背后的故事！


## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>
