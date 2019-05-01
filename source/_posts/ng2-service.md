---
title: Angular2 系列教程（七）Injectable、Promise、Interface、使用服务
date: 2016-02-29 05:29:00
tags: [Angular2]
---

今天我们要讲的ng2的service这个概念，和ng1一样，service通常用于发送http请求，但其实你可以在里面封装任何你想封装的方法，有时候控制器之间的通讯也是依靠service来完成的，让我们一睹为快！

<!--more-->

# 例子

例子是官方的例子，加载一个英雄列表，点击显示详细信息。我直接放在我们的升级后的装备里面。

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xnap2tp0j20700k8abd.jpg)

[源代码](https://github.com/lewis617/angular2-tutorial/tree/gh-pages/service)

# Injectable

在ng2里面如何编写服务呢？非常简单，你只需要写个类即可。那么这个`@Injectable()`是做什么的？其实单就这个例子来说，我们是不需要写个这个装饰的，因为我们的`HeroSerivce`没有依赖，如果你要写一个有依赖的服务，那么你需要加上这个`@Injectable()`，此处加上`@Injectable()`是可有可无的，但是写上是个好习惯。

app/hero.service.ts（部分代码）

```ts
@Injectable()
export class HeroService {
  getHeroes() {
    return Promise.resolve(HEROES);
  }
  // See the "Take it slow" appendix
  getHeroesSlowly() {
    return new Promise<Hero[]>(resolve =>
      setTimeout(() => resolve(HEROES), 2000) // 2 seconds
    );
  }
}
```

以上代码我们干了哪些事儿呢？

  1. 写了一个使用`injectable`装饰的类
  2. 写了两个成员函数
  3. 一个返回一个Promise，直接`resolve`数据
  4. 另一个也返回一个Promise，不过在两秒后`resolve`数据

有的同学会问：`resolve`的数据哪去了？Promise是什么？我们继续讲解。

# Promise

如果你玩过ng1，你一定对promise不陌生，因为我们经常在路由里面写`resolve`，这里就可以接受一个Promise对象。还有ng1中的`$q.defer()`等等。

但是promise并不是ng1的专利，你可以在你的任何javascript程序中使用promise，因为在ES6中已经原生提供[Promise对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。你可以查看它的用法，这里我简单描述下：

  1. 构造Promise，只需要在里面加入一个参数，这个参数是个function，这个function可以接受两个参数：`resolve`, `reject`。或者使用`Promise.resolve()`，不过这样没有延迟了。
  2. 使用Promise对象，最常用的方法是`then()`，里面接受一个function，这个function的参数为`resolve`的值。除了`then()`还有`catch()`等

为了让大家能够清晰的了解Promise的用法，我们打开chrome的console：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xnb0decnj20e103r3z7.jpg)

  1. 输入Promise，是个function。
  2. 输入`Promise.resolve('123')`，我们得到一个状态为"已经解决"的promise。
  3. 输入`new Promise(resolve=>;resolve('123'))`，我们还是得到一个状态为"已经解决"的promise。

2和3的区别在于，后者可以在参数的函数中做一些处理，比如延迟或者http请求。

然后让我们来看Promise的then方法：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xnb0lqagj20ec035gm5.jpg)

  1. 首先我们写了一个已经`resolved`的promise，并将其赋值给`p`
  2. 然后使用`p.then()`，在回调函数里面打印参数，得到`'123'`
  3. 最后`p.then()`整体返回的是个初始化（pending）的promise。

现在我们明白一下这个代码中promise的用法了吧？

app/hero.service.ts（部分代码）

```ts
@Injectable()
export class HeroService {
  getHeroes() {
    return Promise.resolve(HEROES);
  }
  // See the "Take it slow" appendix
  getHeroesSlowly() {
    return new Promise<Hero[]>(resolve =>
      setTimeout(() => resolve(HEROES), 2000) // 2 seconds
    );
  }
}
```
那么我们为何要使用promise呢？主要是为了解决回调地狱的问题。因为有了promise，你不必再写深层的回调，而是像极了同步的写法。

这是我的一个ng1的项目的[部分代码](https://github.com/lewis617/daily-task/blob/gh-pages/modules/login/ctrl.js)，用promise的`then()`来解决回调地狱。

```js    
    
Auth.$createUser({email: email, password: pass})
    .then(function() {
        // authenticate so we have permission to write to Firebase
        return Auth.$authWithPassword({ email: email, password: pass });
    })
    .then(function(user) {
        // create a user profile in our data store
        var ref = wdutil.ref('users', user.uid);
        return wdutil.handler(function(cb) {
            ref.set({email: email, name: $scope.name||firstPartOfEmail(email)}, cb);
        });
    })
    .then(function(/* user */) {
        $scope.wait.show=false;
        // redirect to the account page
        $location.path('/account');
    }, function(err) {
        $scope.wait.show=false;
        $scope.alerts.push({type:'danger',msg:wdutil.errMessage(err)});
    });
```

# Interface

在编写这个服务的过程中我们使用了interface这个概念，这个知识点属于ts的范畴，我们通常在接口中声明类型，有点像react中的propTypes：

app/hero.ts

```ts
export interface Hero {
  id: number;
  name: string;
}
```

然后我们在我们的服务中使用了这个接口：

app/hero.service.ts（部分代码）

```ts
import {Hero} from './hero';
```
app/hero.service.ts（部分代码）

```ts   
return new Promise<Hero[]>(resolve =>
      setTimeout(() => resolve(HEROES), 2000) // 2 seconds
    );
```
除此之外，我们在我们的组件里面也多次使用了这个接口：

app/app.component.ts

```ts
heroes: Hero[];
selectedHero: Hero;
```
app/hero-detail.component.ts

```ts
export class HeroDetailComponent {
  hero: Hero;
}
```

到此为止，我们的服务就算是写好了！

# 使用服务

让我们在组件中测试一下我们写好的服务吧：

app/app.component.ts（部分代码）

```ts
    
import {HeroService} from './hero.service';

...

providers: [HeroService]

...

constructor(private _heroService: HeroService) { }

  getHeroes() {
    this._heroService.getHeroes().then(heroes => this.heroes = heroes);
  }
```

以上代码我们干了这些事儿：

  1. 利用模块系统导入这个服务类
  2. 在组件中注入这个服务
  3. 在构造函数中将这个服务赋给一个私有变量`_heroService`
  4. 然后就可以尽情地在类中使用这个服务对象了`this._heroService`

这里的`getHeroes()`返回了一个Promise，所以我们可以使用`then`来处理接下来要发生的事。

* * *

# 教程示例代码及目录

http://www.liuyiqi.cn/2016/12/25/angular2-tutorial-catalog/

