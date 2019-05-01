---
title: Angular2 系列教程（九）Jsonp、URLSearchParams、中断选择数据流
date: 2016-03-21 08:54:00
tags: [Angular2]
---

大家好，今天我们要讲的是http模块的第二部分，主要学习ng2中Jsonp、URLSearchParams、observable中断选择数据流的用法。

<!--more-->

# 例子

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xkroozusj20hl0mwgo5.jpg)

例子的第一个程序，上节课已经讲过了。这节课我们学习第二个程序，从wiki的api中跨域获取数据，可实现300毫秒内中断和选择最近请求等炫酷功能，这些功能都来自于observable！

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

# Jsonp

在讲解observable的api前呢？我们还是把例子的代码给讲解完

app/wiki/wikipedia.service.ts

```ts
import {Injectable} from 'angular2/core';
import {Jsonp, URLSearchParams} from 'angular2/http';

@Injectable()
export class WikipediaService {
  constructor(private jsonp: Jsonp) {}

  search (term: string) {

    let wikiUrl = 'http://en.wikipedia.org/w/api.php';

    var params = new URLSearchParams();
    params.set('search', term); // the user's search value
    params.set('action', 'opensearch');
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    // TODO: Add error handling
    return this.jsonp
               .get(wikiUrl, { search: params })
               .map(request => <string[]> request.json()[1]);
  }
}
```

以上代码我们干了几件事：

  1. 导入需要的api
  2. 写一个使用`Injectable`装饰的类（服务）
  3. 在构造函数中注入`Jsonp`服务
  4. 编写`search`成员函数实现获取数据的功能

这个`jsonp`服务从何而来？来自

```ts
import {JSONP_PROVIDERS} from 'angular2/http';
```
我们将其注入在组件中：

app/wiki/wiki.component.ts和app/wiki/wiki-smart.component.ts

```ts
providers:[JSONP_PROVIDERS, WikipediaService]
```

这样组件中的服务就可以用了！

# URLSearchParams

然后我们发现我们从

```ts
import {Jsonp, URLSearchParams} from 'angular2/http';
```

http中引入了另一个api，`URLSearchParams`。

这是什么？用来干嘛？qs大家一定非常熟悉，就是url后面那个 `？`和 `&` 。我们的程序也可以这样写：

```ts
    
let queryString =
  `?search=${term}&action=opensearch&format=json&callback=JSONP_CALLBACK`

return this.jsonp
           .get(wikiUrl + queryString)
           .map(request => <string[]> request.json()[1]);
```

`URLSearchParams`，可以将qs写成对象，通过调用对象的方法来获取设置其参数，然后给ng2用！像这样需要对象嵌套对象的时候，`URLSearchParams`就显得非常方便！

# 简单监听数据流

服务写好了，然后我们在组件中调用服务来请求数据吧！首先来个简单的，即每次输入都会发请求：

app/wiki/wiki.component.ts

```ts
items: Observable<string[]>;

search (term: string) {
  this.items = this._wikipediaService.search(term);
}

```

我们在组件的类中定义了一个`items`，类型是Observable。然后又写了一个成员函数`search`用于调用服务获取数据。非常简单，输入的数据在`term`变量中，被源源不断的输入到服务里面，服务通过调用api，源源不断的返回数据流给observable，我们拿到observable后将其传给`items`这个observable，然后在模板中渲染出来！

app/wiki/wiki.component.ts

```ts
<input #term (keyup)="search(term.value)"/>

<ul>
  <li *ngFor="#item of items | async">{{item}}</li>
</ul>
```

`async`这个过滤器之前已经讲过不再赘述！

# 中断数据流，选择数据流

让我们来实现更炫酷的功能吧！我们希望不要每个字符输入都请求服务器，我们希望300毫秒以内的字符输入都被中断掉！使用observable就对了，promise可没有这么炫酷的功能！

app/wiki/wiki-smart.component.ts

```ts    
private _searchTermStream = new Subject<string>();

 search(term:string) { this._searchTermStream.next(term); }

 items:Observable<string[]> = this._searchTermStream
   .debounceTime(300)
   .distinctUntilChanged()
   .switchMap((term:string) => this._wikipediaService.search(term));
```

我们在上一个简单的程序基础上增加了一个成员变量`searchTermStream`，是个`Subject`类型，这是什么鬼？这是[官方文档。](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/subjects.md)

简单来说，`Subject`就是用来创建流的，每次我们输入字符，都可以使用`searchTermStream`的next方法将字符源源不断的添加到`searchTermStream`中。

然而这个`searchTermStream`同时也是observable，我们可以使用`debounceTime`这个api将数据流的流动频率控制在300毫秒以上，这意味着300毫秒以内输入多次也只能发出一次。

<https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/debounce.md>

接着我们使用了`distinctUntilChanged`这个api用于中断没有改变的情况，比如一个用户先输入"angular"，然后不小心输入了"angularrrrr"，接着他立马按回格键，变成了"angular"，两次都是"angular"，没有发生改变，就会被`distinctUntilChanged`这个api给中断掉！promise可没有中断功能！非常炫酷！

https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/distinctuntilchanged.md

好吧，还有更加炫酷的api。我们甚至可以选择最近的一次数据流。使用`switchMap`就可以做到，新版本被更换成了[flatmaplatest](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmaplatest.md)，顾名思义就是选择最后的项，这里指的是最近的请求！

https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmaplatest.md

observable的api太多了，大家需要可以查询，不再一一讲述：

https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators

* * *

# 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>

