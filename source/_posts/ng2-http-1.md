---
title: Angular2 系列教程（八）In-memory web api、HTTP服务、依赖注入、Observable
date: 2016-03-21 07:30:00
tags: [Angular2]
---

 大家好，今天我们要讲是ng2的http功能模块，这个功能模块的代码不在ng2里面，需要我们另外引入：

index.html

```html
<script src="lib/http.dev.js"></script>
```

<!--more-->

## 例子

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xmuxndz8j20hl0mwgo5.jpg)

这是官网的例子，包含两个程序：

  1. 英雄列表
  2. wiki关键词

第一个程序可以实现http的get请求，获取英雄列表，也可以实现http的post请求，新增英雄。

第二个程序可以实现输入关键字即时获取wiki的包含该关键字的名词列表，第一个是每输一个字符都会请求，第二个时只有停顿够300毫秒才会发出请求。两个都使用了jsonp的跨域方法。

运行方法：

在http目录或者上级目录起个服务即可：

```sh
http-server
```

没有则需要安装http-server：

```sh
sudo  npm install http-server -g
```

源代码：

https://github.com/lewis617/angular2-tutorial/tree/gh-pages/http

demo演示：

http://lewis617.github.io/angular2-tutorial/http

## In-memory web api

首先我们先来看第一个程序，英雄列表。在运行这个程序前，我们需要学习一个库，[a2-in-memory-web-api](https://github.com/wardbell/a2-in-memory-web-api)  。

这个库的功能是可以帮助你在ng2里面虚拟api，不用你写api后台了，方便测试。顾名思义，这个库所虚拟的api在内存中，也就意味着你刷新浏览器后，所有的数据都会消失！好，让我们来学习如何使用！  

第一步，你需要引入这个库：

index.html

```html    
<script src="lib/web-api.js"></script>
```

然后，我们要使用这个库给我们封装好的服务：

app/toh/toh.component.ts

```ts
// in-memory web api providers
provide(XHRBackend, { useClass: InMemoryBackendService }), // in-mem server
provide(SEED_DATA,  { useClass: HeroData }) // in-mem server data
```

`XHRBackend`和`SEED_DATA`是服务里面提供的变量，我们需要设置。`XHRBackend`使用`InMemoryBackendService`来创建provider，`SEED_DATA`使用我们自己写的`HeroData`来创建provider，作用是初始化数据。我们来看`HeroData`的代码：

app/hero-data.ts

```ts
export class HeroData {
  createDb() {
    let heroes = [
      { "id": "1", "name": "Windstorm" },
      { "id": "2", "name": "Bombasto" },
      { "id": "3", "name": "Magneta" },
      { "id": "4", "name": "Tornado" }
    ];
    return {heroes};
  }
}
```
那个`createDB`是webapi里提供的方法用于创建虚拟的数据库。

那么什么是provider？~~provider就是服务，provide是ng2给我们提供的创建服务的api~~，这个可以参考官网，比较简单不再赘述：

~~https://angular.io/docs/ts/latest/api/core/provide-function.html~~

provider 是依赖注入中的一个概念，它决定了服务的实例化方式。
到此为止，我们的虚拟api就配置好了，我们可以在`app/heroes`这个url上进行get和post请求，用于获取和新增数据了。为什么是这个url？因为我们在创建数据库时候定义了这个节点：

app/hero-data.ts

```ts   
return {heroes};
```
你可以将其改变为`heroes1`或者`heroes2`来测试下。

## 使用HTTP服务

api虚拟好了，我们开始调用api，如何调用呢？我需要使用ng2给我们提供的http服务。这个服务需要额外http库文件，它不在ng2的库文件中。因为官方考虑到大家伙可能想使用别的http库吧！

我们先引入js文件：

index.html

```html
<script src="lib/http.dev.js"></script>
```

 然后注入服务：

app/toh/toh.component.ts

```ts    
HTTP_PROVIDERS,
```

然后就可以在这个组建下层的服务中使用HTTP了：

app/toh/hero.service.ts

```ts
export class HeroService {
  constructor (private http: Http) {}
}
```
app/toh/hero.service.ts

```ts
this.http.get(this._heroesUrl)
```

app/toh/hero.service.ts

```ts
this.http.post(this._heroesUrl, body, options)
```
## ng2的依赖注入

刚才提到了http服务的注入。我们就来聊聊"依赖注入"。

ng1里面的依赖注入被保留到ng2里面了，什么是依赖注入，为什么要用依赖注入，依赖注入和规则是什么样的？

~~依赖注入类似于import、require，可以将我们封装好的模块注入另一个模块，成为其依赖。~~

~~这样做有什么好处？代码复用度高，模块相互独立，管理清晰。~~

~~依赖注入的规则是什么？~~

  ~~1. 注入组件指令：只能在当前组件用，当前组件的父子组件都不能用！~~
  ~~2. 注入服务：可以给当前组件和其所有的子组件用！~~

依赖注入是一种编程模式，该模式可以让一个类从外部源中获得它的依赖，而不必亲自创建它们。

依赖注入的规则是什么？

 1. NgModule 中的服务是被注册到根注入器的。这意味着任何注册到 NgModule 上的服务都可以被整个应用访问到。
 2. 另一方面，注册到应用组件上的只在该组件及其各级子组件中可用。

有一个很有趣的问题：我们是否应该将所有服务都放在顶层？什么时候我们需要将其注入子组件中呢？

当每个组件需要独立的服务实例时候！

服务是单例模式，也就意味着我们所编写的服务只能被实例化为一个对象，如果我们将服务注入在顶层，那么我们无法享受独立的服务。比如如果你要给"英雄列表"的每一项添加编辑功能，那么"编辑"这个服务就不能放在顶层，需要放在每个英雄列表的组件上。这样才能保证每个英雄列表拥有独立的服务（比如独立的当前名称属性等）。

放在顶层的服务也很多比如，提供方法的工具库如HTTP等都可以放在顶层，我们不需要多例。还有一些用于共享数据的服务更应该放在顶层，我们需要"单例模式"来帮助我们统一共享数据！

## **Observable**

刚才我们进行了http请求，不过我们发现，我们接着使用了`map()`这个方法：

app/toh/hero.service.ts

```ts
this.http.get(this._heroesUrl)  
         .map(res => <Hero[]> res.json().data)  
         .do(data => console.log(data)) // eyeball results in the console
```

一般情况，我们这里都会返回一个Promise，然后我们使用`then`来处理数据。不过这里使用了`map()`，很显然，这里不是Promise而是Observable！

它来自于Rx.js，可以帮助我们实现响应式编程，处理异步的另一套解决方案（promise也是一套解决方案）。

这是十分复杂的概念，不过我会多罗嗦几句，所以不用担心。首先我们先来看Observable 和Promise的区别：

  1. Observable 可以处理多个事件，Promise则通常处理一个事件
  2. Observable 可以终止，Promise则不能

我们继续解读代码，讲完你就会明白这两个区别。

`this.http.get(this._heroesUrl)`就返回了一个Obeservable，我们可以使用`map()`方法处理事件，和数组一样，你也可以使用`filter`。所以我们说observable可以处理多个事件。

这里的多个事件指的是什么呢？其实就是你输入的"英雄名称"，先后输入很多次，输入的名字如同流水一般进入我们程序中，我们使用observable来处理这个"流"。假如你前后就输入一次英雄名称并点击添加，那么这个流其实就一个事件。

observable定义完是不会执行的！直到你使用`subscribe`：

app/toh/hero-list.component.ts

```ts
this._heroService.getHeroes()
         .subscribe(
           heroes => this.heroes = heroes,
           error =>  this.errorMessage = <any>error
         );
```
现在我们提到了很多observable的api，让我们总结下，后面还要补充：

  1. `map()`：遍历流
  2. `filter()`：过滤流
  3. `do()`：监视流（通常打个console而已）
  4. `catch()`：捕获异常
  5. `subscribe()`：订阅流（即执行）

到此为止，http的第一个程序"英雄列表"就可以运行了。这节课我们先讲到这里，下节课我们继续讲解observable中更加炫酷的api用法！

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>



