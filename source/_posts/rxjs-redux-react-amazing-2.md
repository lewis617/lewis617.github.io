---
title: RxJS + Redux + React = Amazing!（译二）
date: 2016-12-9 11:32:00
tags: [技术讲座, RxJS, Redux, React]
---

今天，我将Youtube上的《RxJS + Redux + React = Amazing!》的后半部分翻译（+机译）了下来，以供国内的同学学习，英文听力好的同学可以直接看原版视频：

https://www.youtube.com/watch?v=AslncyG8whg

<!--more-->

## Observable

什么是Observable？让我们快速来了解一下它吧！

- **Observable是一个由零个、一个或多个值组成的流。**注意，是零个、一个或多个值。零个意味着可以没有值，这完全没问题。一个值的情况就像是Promise一样。如果有多个值，那么这些值将位于不同的时间点上。
- **Observable跨越了时间。**时间是一种新的维度，这个维度是Observable与Promise的重要不同点。所有“流式”的事物都会跨越时间。事实上，**流就是一个以时间为维度的集合**。
- **Observable可以取消。**

很酷的是，Observable正在变为ECMAScript的标准，就像Promise那样，但现在你还不能直接在浏览器里使用它（原话很啰嗦，直接提取有用信息）。所以你需要使用RxJS。

![](https://ws1.sinaimg.cn/mw690/83900b4ejw1fakfuc1t28j20dw08pq41.jpg)

RxJS是Observable的一种引用实现，它提供了一些定制的功能，比如操作符（Operators）、创建不同类型Observable的工厂方法。我同事说，RxJS就像是

> lodash for async

因为它和lodash一样也是个工具库。lodash的用法基本上就是，你给它一个输入，它给你一个输出。RxJS的用法则是，你给它一个输入，它给你一个输出，但是**跨越了时间**。所以，你可以拥有多个值。让我们通过一个速成教程来更深入的了解它吧！

1. 创建Observable有很多种方式（直接贴截图）：

	![](https://ws4.sinaimg.cn/mw690/83900b4ejw1fakgfw4kdrj20dw080wfo.jpg)
	
	你可以：
	
	 - 创建一个单值的Observable
	 - 从数组（或其他类型）创建一个Observable
	 - 设置时间间隔
	 - 发起Ajax或WebSockets
	 - 还有很多方法可以创建定制的Observable
	 
2. Observable可以被订阅（Subscribing）：

	![](https://ws1.sinaimg.cn/mw690/83900b4ejw1fakhztxxnfj20dw07ygmj.jpg)
	
	Observable的订阅和Promise的then挺像的。你可以给它提供三个函数：
	
	- **第一个函数是next函数**，它有点像Promise的成功情况下的回调函数，但是，因为Observable是**跨时间的**，它可能有零或多个值，所以next函数可能会被调用N次，或许会被调用上千次，或许一次都没被调用，这取决于Observable有多少值。
	- **第二个是error函数**
	- **第三个是complete函数**，有时候或许我们想知道是否完成了，此时，该函数就派上用场了。

3. 我们还可以对Observable进行转换（Transform）。就像之前讨论的，我们可以像使用lodash那样，对Observable进行map、filter、reduce。如果Observable只有单值，我们不会做这些操作。我们只会对**流或流式的处理**进行这些操作，比如，一些数据来了，我们把它们映射（map）成另外一些数据。这个方式非常高效（用了声明式的写法，不用像指令式那样写过程，当然高效了）！

4. Observable还可以被合并（Combine）：concat、merge、zip。

5. Observable还可以表达时间（Represent Time，意思是可以进行与时间相关的操作）。因为Observable是以时间作为维度的，所以你**绝对绝对**可以做debounce、throttle、buffer这些操作（他说到这，有点自嗨了，注：debounce、throttle都是去除速率过快的事件、buffer则是周期性的合并一些项，然后一起触发它们）。

6. Observable还有个优点，就是懒（lazy）：你定义了一个Observable应该做什么，它不会做任何事情，直到你订阅它。因此，你可以轻易实现重试或重复（retry、repeat，有相关的操作符，可以自行查询），比如在错误时重试或重复发起一个Ajax请求五次。

（讲完上述几条后，他总结了一句话：**Observables can represent just about anything**，但接下来又非常辩证地说了也不要什么都用RxJS，因为RxJS太新了什么的，不再赘述。）

## RxJS和Redux的结合——redux-observable

我们非常喜欢RxJS，也非常喜欢Redux，所以我们想，把这两个技术结合一下吧！我们实验了几种模式，经过了一些迭代，最后有了一个稳定的解决方案。如果你之前开源过什么东西，那么你一定知道，最重要的事情是——先做个好logo。不是写测试，不是保证它正常工作，也不是写文档，而是要先做个logo，这是最重要的事情，关乎你能拿多少star（场下有人笑了，然后他讲了他们logo的来历，大概就是，本来想结合RxJS的logo和Redux的logo，但是Redux当时还没有logo，他们就用Redux的谐音“three ducks”，三只鸭子做为logo，在经历了压扁、合并以及添加旋转动画后，终于得到了他们满意的logo，也就是现在redux-observable的logo）。

![](https://ws1.sinaimg.cn/mw690/83900b4ejw1faknp217eaj20dw0an74v.jpg)

redux-observable是一个Redux中间件，用来管理副作用，包括异步。我们使用一个叫Epic的概念去完成这个工作。那么什么是Epic？

> A function that takes a stream of **all actions** dispatched and returns a stream of **new actions** to dispatch 
> Epic是一个函数，该函数将**所有被发起的流式的action**作为参数，然后返回**新的流式的action**去发起。

简单来说，Epic就是：

> "action in, action out"

（然后他用了一些伪代码去演示Epic的工作原理，注意，阅读下面的内容需要一点Redux和RxJS基础，如果感到吃力，应该先去看下Redux和RxJS。）

1. 这是一个简单的函数，输入PING，立马得到PONG：

	```js
	function pingPong(action, store){
	  if(action.type === 'PING'){
	    return { type: 'PONG'};
	  }
	}
	```
2. 如果使用RxJS的操作符来实现它，会更加声明式： 

	```js
	function pingPongEpic(action$, store){
	  return action$.ofType('PING')
	     .map(action => ({ type: 'PONG'}));
	}
	```
这就是世界上最简单的Epic，它的第一个参数是个流式的action。首先，这个Epic函数对流式的action进行了类型过滤，然后将其映射为新的流式的action。这就像个管道一样，所有action都会进来，然后进行匹配并输出。

3. 如果想等待一秒后，就像打乒乓球那样，“乒-乓-乒-乓”，只需要加一行代码：

	```js
	function pingPongEpic(action$, store){
	  return action$.ofType('PING')
	     .delay(1000) // <- that's it
	     .map(action => ({ type: 'PONG'}));
	}
	```

	此时，如果你的reducer的逻辑是，PING是true，PONG是false，那么你的应用会是这样（他指着屏幕的动图，大概功能就是点击按钮，isPING的值等待了一秒后变为false）。

4. 让我们来看另外一个debounce例子吧（代码和程序截图如下，这是个计数器的例子，大概就是添加了debounce后，连续点击加一或减一，速率过快的操作将会被取消）！

	![](https://ws2.sinaimg.cn/mw690/83900b4ejw1fakp4thjkxj20dw07yt9n.jpg)

上述示例都太简单了，让我们看几个复杂的例子，这些例子不会讲解代码的细节，只是用来证明**RxJS和redux-observable在复杂场景中有多么地牛！**

- 自动补全（他先是演示了使用普通JavaScript的写法，代码特别长，过程特别繁琐，然后演示了使用Epic的写法，只用了debounce、switchMap和map三个操作符，代码特别短，而且非常声明式和易读）
- 双向多重的WebSockets（他还是先演示使用普通JavaScript代码的写法，代码特别多，而且容易引入bug。然后他演示了Epic的写法，功能一样不少，但是代码特别少而且非常声明式）

![](https://ws1.sinaimg.cn/mw690/83900b4ejw1faku828ck7j20dw08p75i.jpg)

让我们来快速总结下redux-observable吧：

- 让跨时间的复杂异步任务的组合和控制变得简单，当然如果只是做请求-响应这种简单的Ajax，那么学习RxJS是多余的。
- 你不需要管理Rx的订阅，因为redux-observable帮你做了这些。
- 你依然可以享受Redux的功能，比如时间旅行等。

但是在你尝试使用redux-observable之前，**你应该提前学习Redux和RxJS**。当然，这应该是业余时间做的事，或是在你特别想挑战自己的情况下才要做的事。我不是打击大家的积极性，只是不想让在座的各位产生一个错误观念，就是即便我的应用很小很简单，我仍然应该使用redux-observable。 但是，如果你觉得我今天描述的问题，也正好是你的问题，那么你一定愿意学习RxJS、Redux和redux-observable。 

![](https://ws2.sinaimg.cn/mw690/83900b4ejw1faku9kr2h5j20dw08pab6.jpg)

另外，RxJS拥有非常陡峭的学习曲线。 最近有个新流行词叫响应式编程（Reactive Programing ），RxJS做的就是这个。响应式编程是个令人发狂的编程范式，不过你可以这么理解它：就像是你先安装好管道，但还没有水流过管道，等到将来某个人发起了一个action，然后潺潺流水就来了，你的管道就开始运作了。（他之所以用流水这个比喻，主要是为了突出响应式编程，自动响应和变化传播的特性，如果你还不能理解，可以参考[维基百科](https://zh.wikipedia.org/wiki/%E5%93%8D%E5%BA%94%E5%BC%8F%E7%BC%96%E7%A8%8B)）。响应式编程是一种完全不同的编程风格。

（然后他介绍了他的联合作者，展示了redux-observable的官网以及目前有哪些公司在用，最后致谢。）

![](https://ws2.sinaimg.cn/mw690/83900b4ejw1fakubrwyb6j20dw08pdgx.jpg)

## 总结

Jay Phelps的这个talk还是很不错的，而且比较客观。从这个talk中，我们可以学习到：

- Redux是什么，以及它是如何工作的。
- Observable是什么，以及它的基本用法。
- redux-observable的工作原理以及适用场景。
- 在复杂的异步场景下，回调和Promise捉襟见肘，而Observable则应对自如。
- 在简单的异步场景下，没必要使用Observable。

---

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>