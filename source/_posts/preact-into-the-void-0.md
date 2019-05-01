---
title: Jason Miller：Preact：Into the void 0（译）
date: 2017-09-04 19:00:00
tags: [技术讲座, Preact, JSX, 虚拟DOM, 性能]
---
本文整理自Jason Miller在JSConf上的talk。原视频地址：

https://www.youtube.com/watch?v=LY6y3HbDVmg

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj6o29y7yvj21gk0t8gp1.jpg)

<!--more-->

## 开场白

嗨，大家好，我是Jason，Github上那个developit和推特上的_developit，是一系列库的作者（serial library author），我喜欢甜甜圈、肉汁乳酪薯条和斧头，这意味着我是加拿大人（枫叶国的人喜欢斧头——[在加拿大把扔斧头做成15万用户的大生意](https://dushi.singtao.ca/toronto/%E8%B4%A2%E7%BB%8F-%E5%88%86%E7%B1%BB/%E5%88%9B%E4%B8%9A%E6%95%85%E4%BA%8B-%E5%88%86%E7%B1%BB/%E5%9C%A8%E5%8A%A0%E6%8B%BF%E5%A4%A7%E6%8A%8A%E6%89%94%E6%96%A7%E5%A4%B4%E5%81%9A%E6%88%9015%E4%B8%87%E7%94%A8%E6%88%B7%E7%9A%84%E5%A4%A7%E7%94%9F%E6%84%8F/)）。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj6n75o3dfj21fm0yyk30.jpg)

我也喜欢“限制”。我在移动web广泛应用前就开始开发它了，那时候还是windows mobile 5。我写了很多UI框架，遇到了很多问题，然后努力去解决它们。这样的理由是我发现“限制”是很有趣的“挑战”，我有些ADHD（注意（力）缺陷多动障碍），你或许熟悉这个东西，为了高效做一些事，最好可以非常专注在上面，这些有趣的“限制”挑战可以帮助我营造这个环境。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj6n7uvhe1j21ag0uetbg.jpg)

## 点题

我写了Preact，这个展示叫“Preact: Into the void 0”，我觉得这么叫很聪明（这哥们太极客了，void(0)是js中返回undefined的最小脚本），这也是这个幻灯片中唯一的一个分号哦。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj6o29y7yvj21gk0t8gp1.jpg)

或许你会好奇啥是Preact，这就是Preact。我移除了源代码映射的注释，今天我们主要讲一下这几个圆圈圈中的部分。因为这是Preact的展示，所以我们需要一些紫色，不管那是啥，那都是我们最后要讲的东西。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7b4qalvoj21v811i7wj.jpg)


## JSX简介

不过在开始讲这些东西前，我们需要聊聊JSX。如果你对JSX不熟悉，我不知道你之前是靠在哪个山头。不过别担心，JSX真的非常容易理解。JSX的核心非常简单，等我讲完时候，你完全可以用JSX重写你Webpack配置，让它变得更长、更复杂，这是个好事。如果你不相信我，去看看webpack2的文档吧，都在里面写着呢。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7cmp9hotj21aa0ms75t.jpg)

那么什么是JSX？JSX是一个XML风格的表达式，然后被编译为函数调用。我们编写左边的那个很像HTML的尖括号语法。右边是像babel这样的编译器输出的结果，现在貌似已经有十种编译器了。我最喜欢的JSX的点就是很喜欢这种写法，这种带有点DOM风格的写法，编译在前面做了一些事，好让我们可以更好地理解它。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7hwm3j0aj21e80vmq6t.jpg)


再来看一个稍微复杂一点的写法。这些尖括号语法被编译为了JavaScript，其中`one` 和变量 `world`都被保留了下来，另外一个复杂的地方是，如果你的标签名首字母大写，那么它在生成代码中将会是个变量引用。

> 译者注：JSX中的标签名大小写是有讲究的，小写代表是HTML标签，大写代表一个组件，具体可以看JSX的文档。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7i7h7npgj21e60ym7aw.jpg)

JSX的精髓就是我们看过的那个工厂函数，它非常简单，只有一个接受节点名称、属性、children的签名。节点名称就是之前说的标签名称，它可以是字符串或者函数，属性是可选的，它可以是个对象，剩余的参数就是children，这就是我们编写的形式。
![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7imbjvoaj21es0wyaf8.jpg)

你或许会想，我刚才编写不是hyperscript吗？你想的也不算错，hyperscript确实跟JSX很相似，有点JSX超集的意思。看看这两个例子吧！hyperscript支持这种附加的标签写法，本质上来说是CSS选择器的写法，去预定义元素上的属性，而JSX却不支持这种写法。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7iwejmd8j21h80zctcs.jpg)

JSX真正的能力是可以支持这种拓展标签名称。理解好JSX是很重要的，JSX是我们连接各种虚拟DOM库的接口，JSX不是DOM，它跟DOM没啥关联，它只是一种语法，它并不理解你的代码或它被用来做的事，你甚至可以用它编写Webpack配置，但还是别了。你可以用它编写XML，如果你想编写一个SOAP客户端，而且你想用解析和序列化，你就可以使用JSX做这个。总之，我想说JSX是问题的有趣解决方案。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7j3w1fauj216a0uowil.jpg)

## 虚拟DOM

下个话题是虚拟DOM。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7jgwtbo2j21ku0pm40e.jpg)

虚拟DOM仅仅只是个代表树状结构的对象而已，仅仅如此，没啥别的玄乎的！我经常把它想成一个传递给DOM构建器的一个配置，好让DOM构建器不那么理论化。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7jgd8tvwj21cg0tijuo.jpg)

不过，首先我们要理解的是，我们如何从JSX到虚拟DOM。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7jqrweslj21dg0xin25.jpg)

我们所做的方式是调用刚才定义参数的那个h函数。这非常容易理解，我们编写JSX，然后调用h函数，我们要做的就是定义一个h函数，生成这样的对象。这个对象就是虚拟DOM，虚拟DOM就是一个嵌套对象。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7ju59ctmj21j40ymdkp.jpg)

令人惊讶的简单，我们要做的就是这个而已！一个只有一行代码的函数！当然，你可以在这里做更多的事情，如果你想扁平化children，去除空值，连接相邻的字符串节点等。但核心是，你可以通过这个函数编写一个虚拟DOM渲染器。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7jzhp1zkj21au0xkado.jpg)

所以，让我们做这个吧！让我们编写一个虚拟DOM渲染器！第一件事，我们要传递给我们自己一个虚拟节点，这是我们之前见过的那个对象，看右上方的滚动框。所以，第一件事是我们需要创建一个DOM对象，匹配传递进来的虚拟节点的类型。所以我们使用`document.createElement`来做这个。然后我们循环给DOM赋予属性。接着，我们又写了一个递归来循环渲染子节点。最后，我们在类型为字符串时，直接返回DOM对象。这就是我们编写的虚拟DOM渲染器！

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7k5n7wtaj21fw10gtir.jpg)

这里有个稍微复杂的地方，那就是attributes。如果有人用过React，那么你可能会怒气冲冲地说那不是attrbutes，那是properties！事实上应该叫“props”。attributes和properties是两个不同东东的抽象！大多HTML元素会接受数据作为attributes，它们也可以接受类似的，定型数据作为properties，通过一个叫DOM property reflection的东东。但事实上，这两种都是不太对的，有时候我们可以使用properties，不能使用attributes，有时候又反过来。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7kwyjmokj21d60vaagy.jpg)

我们需要的是将两种写法都写出来！我们有一个DOM节点的引用，我们问它，你支持foo这个property吗？如果它支持，就用property，否则就用attributes。这对自定义元素很好，因为自定义元素倾向于为property定义getter setter对。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7l08enxfj21bk0w6449.jpg)

这时你可能想问，这能运行吗？这是个虚拟DOM，我们把它传给编写的渲染函数。右边显示的是结果，它可以运行哈哈。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7lfhftmqj21e00vgdjz.jpg)


## DIFF算法

我们刚才编写了一个非常简单的虚拟DOM渲染器，也是个非常糟糕的虚拟DOM渲染器，这是版本0。说它糟糕是因为它不能DIFF，它不关注当前的DOM状态，只是完全替换了新dom。虚拟DOM中的DIFF算法是一个争议和神秘的主题，争议是有必要的，因为过程中充满了权衡，并不是非黑即白，而神秘是没有必要的，我试图去揭开它神秘的面纱！

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7lpsb50wj21hm0r440j.jpg)

DIFF舍弃从上到下渲染，创建新的DOM。我们将会传递给我们自己一个现在DOM，然后把它变为JSX中写的样子，只是应用一下差异而已。
![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7luaibjhj21bk0vwgrb.jpg)

在左边，你可以看到虚拟DOM长啥样，只是一个对象。在右边，是一个真实的DOM。你可以看到，名字都差不多。你可以比较一下，然后把差异应用到右边。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7m2a5zgtj21c00vq43d.jpg)

运行DIFF，只需要三步。第一步是type，在所有事情前，我们必须要创建一个准确类型的DOM。第二步是循环遍历children，去双向比较它们，然后找出我们是否需要添加、移除、重排它们等。最后一步是更新attributes/props。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7mnc3fnpj21980tkn17.jpg)

所以，让我们从type 开始吧！第一件事是判断节点是否是组件创建的。如果不是，事情就简单了！如果同类型就更新，否则就抛弃原来的，创建一个新的。如果是组件创建的，事情会稍微复杂一点。我们需要创建一个实例，通过比较创建或更新组件的props，然后调用render方法。

> 译者注：实际情况其实更加复杂，这里需要对组件、组件实例、组件生命周期非常熟悉才能理解。在组件生命周期中，真正操控大局的是组件实例，所以这里需要先创建一个组件实例。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7mzdwm1fj21eo0wq0yj.jpg)

children更加简单，只有三步。第一步是循环遍历所有的children，把它们放到列表中，没key的话就放到unkey列表，有key就放到keyed map中。第二步是我们把新的虚拟children转移过去，我们在列表中发现匹配的，然后和虚拟DOM做对比，最后把它插入到当前的index中。最后一步是最简单的，如果有kids剩余，就删除它们，因为它们已经用不到了。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7myx049ij21eu104n3t.jpg)

你或许对keyed map和unkey list感兴趣。我今天很想讨论这个话题，我曾在stack overflow上回答过这个问题，这是我在stack overflow上回答的唯一的问题。所以，让我们用PPT来演示它。keys是一些虚拟DOM上有意义的顺序属性，当这些虚拟DOM拥有唯一的类型。我们可以在这个例子中看到，我们拥有三个列表项——one，two，three。在第二个渲染框中，我们只有两个列表项，对于你和我这样的人类而言，我们只需要删除two，把第三项移上去。但虚拟DOM渲染器不知道这个，没有任何东西说明two就是第二项，它就是每次接受一个新的树，没有什么事可以矫正它。这整个过程就是，看看第一项，没变，然后啥事也没发生，然后看看第二项，它说，不，内容不一样啊，然后它就更改了内容。第三项直接被删除了。默认情况下，虚拟DOM中的元素列表，它只会push和pop，没法移动改变中间的项。与此相反，在有key的方法中，我们给每个元素一个唯一的key，所以在第一个框中，我们看到了1，2，3，在第二个框中，我们看到了1，3。很明显，key2被移除了，现在，我们告诉虚拟DOM应该做什么，所以它知道当它循环到key2时，它就会删除该项。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7obuoj1jj21fc0wsgtk.jpg)

DIFF的最后一步是attributes，这真的很简单，我们给我们自己老的属性和新的属性，从老的属性中找到不在新属性中的属性，然后把它们设置为undefined。对于新的属性，我们和老属性对比，然后设置新属性的值。我们解决了所有的问题，现在我们的app变得非常快！我们把所有问题都转移到了库中，这些库包括：react、preact、inferno等。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7occh61uj21gk0v8q7p.jpg)

## 性能

我想和大家讨论一些性能的话题。我编写Preact时，就想测试它的性能。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7qby6v8wj21hu0mggob.jpg)

这句话是你经常在推特上看见人说的。我们经常听到有人抱怨说DOM太慢了，DOM是性能差的根源所在。确实，DOM没有immediate mode drawing API那么快，它设计的目的不是这个，这是完全不同的事。DOM本质上提供了内建的accessibility。你可以使用title和字体注释DOM，还可以得到屏幕阅读器的支持。其他平台也可以这么做，但是DOM做这种事情更加简单。你根本不需要理解它是如何运作的，只需要编写语意化的标记即可。DOM也可以拓展，人们经常忘记这点。如果我在windows上使用推特，我想为推特添加emoji，我就安装浏览器拓展，然后就hook到了每一个在推特上的输入文本，接下来我不依赖推特的输入字段就可以使用emoji了。推特不知道这个，也不需要知道，也不在乎这个。这就是DOM的价值之一，这种基质巩固了所有的应用，它是一种超越我们知识范畴的拓展。这就跟那个“框架不可知论”不谋而合。你可以编写两个不同的插件在两个不同的框架中，只要它们可以渲染元素，你可以假设这些元素拥有相同的祖先元素，它们彼此之间不需要相互在乎。所以，Preact本质上来说就是个DOM渲染器，它是虚拟DOM渲染器，但它就是一种DOM库。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7r2tleloj218y0ic40u.jpg)

接下来，我想分享我在编写DOM库过程中的一些经验，第一个是使用文本节点来表示文本。这听起来很傻，我意识到了这个。但是很惊讶的是，我们经常曲解这句话。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7r3v1w7kj21ao0s8jtn.jpg)

DOM拥有API去和文本打交道，我们却经常忽略这些API。我们可以通过这些API去创建文本，插入文本，反转文本等。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7r8yo1wqj21gu0ty0xg.jpg)


这是个benchmark showing，展示了`textContent`和`Text.nodeValue`的速度，后者很明显更快。如果你正在编写一个有处理文本的DOM库或框架，那么选择前者会让你发疯。`textContent`做了更多工作，只说它慢貌似不太公平。但大多情况下，我们不需要处理“更多的工作”。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7rhq0ed9j217w0w2gq2.jpg)

下一个经验是，避免getters，完全的！别使用它们。Text的nodeType是undefined，但是它继承的Node的nodeType是个getter方法，性能不好。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7rrtjekbj21gy0jy7ac.jpg)

如图所示，splitText更快，因为这只是检查某个属性是否存在，而不是调用getter。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7rthnnovj21fk0vygpx.jpg)

这是一个性能测试，可以看到getters都很慢，而属性获取的速度却很快。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7rw7qmooj21jg0yatha.jpg)

最后一个经验是避免Live NodeLists，不要试图去用它们，它们特别耗性能。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7s0yww8aj21a20uk0uz.jpg)

这是一个例子，试图去移除父元素的children。第一个你写了一个倒置的循环去移除，之所以倒置是因为这是个live NodeList，它的项数不停的在变化。第二个就快多了，因为我们只是在获取一个属性，不需要回头去请求子节点。我们不需要去获取数组的位移，我们只是在用一个引用。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7s1eagrrj21ea0w20xj.jpg)

这是测试结果。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7s85x3i6j21i60wy0x7.jpg)


## 性能测试

我已经做性能优化很久了。Benchmark运行了五百万次循环，然后计算时间。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7sacjfgpj21ii0pm76d.jpg)

Chrome开发工具优化了这个，使其更加可视化。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7shbtvtuj21gk0y8k0g.jpg)

另一个工具是IRHydra。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7shuxscpj21ds0wih0c.jpg)

最后一个工具是ESBench。这个工具的目的是给你一个非常简单的用户界面去使用Babel和benchmark。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7sj2xdv0j21b00wutdi.jpg)


## 其他经验

第一个是尽量明确的。不要使用一些意外情况，如果你没有理由使用它们。这个例子中，我们检查一个对象的属性，它可能是0，空字符串，null，false等，第二种就清楚多了。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7srvrm9xj21ag0v4tbo.jpg)

下一个经验是行内帮助函数。函数可以更加通用。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7swa4vo9j21au0vujvc.jpg)

下一个是短路语法。最便宜的函数调用就是你不调用它。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7syosb7aj21cg0ue41l.jpg)

所有这一切都是在说一个道理：基于数据去做决定。

![](https://ww1.sinaimg.cn/mw690/83900b4egy1fj7sz6p7llj21cw0moqv5.jpg)

---

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>
