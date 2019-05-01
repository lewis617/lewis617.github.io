---
title: Angular2 系列教程（三）Components
date: 2016-02-17 06:28:00
tags: [Angular2]
---

今天，我们要讲的是ng2的Components。

<!--more-->

## 例子

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9xp4nip4hj20d703gt96.jpg)

这个例子是个老外写的，我将其迁移到ng2 beta版本，想了解迁移的同学可以参考我的做法。

[源代码](https://github.com/lewis617/angular2-tutorial/tree/gh-pages/componnets)

## 消失的控制器

ng2的组件就是ng1中的指令。它包含模板、样式、注入、和选择器。

组件嵌套组件可以实现类似react的模块化，我曾经也用ng1做过类似的事情

[Angular 结合RequireJs实现模块化开发](https://lewis617.github.io/2015/10/01/ng-requirejs-module/)

我当时就想，既然有了指令（ng1）还要什么控制器（ng1）啊！果不其然ng2中移除了控制器，直接用指令也就是ng2的组件来展示界面：

app/navbar.ts

```ts
import { Component} from 'angular2/core';
import {NgFor} from 'angular2/common'

@Component({
    selector: "navbar",
    directives: [NgFor],
    styles: [`
        li{
          color: gray;
        }
    `],
    template: `
        <h2>Democratic Party presidential candidates</h2>
        <ul>
        <li *ngFor="#item of items; #i = index">{{item}} {{i}}</li>
        </ul>
    `
})
export class Navbar {
    items: Array<String>

    constructor() {
      this.items = [
        "Hillary Clinton",
        "Martin O'Malley",
        "Bernie Sanders"
      ]
    }

    ngOnInit() {
        console.log('[Component] navbar onInit');
    }
}
```

当组件被实例化后，ng2为这个组件创建了一个shadow DOM（Shadow DOM在一个web组件中提供了js,css,template的封装），然后模板和样式被注入进去。

这段代码做了这些事情：

  1. 设置选择器
  2. 设置`directives`为`[ngFor]`
  3. 设置样式
  4. 设置模板
  5. 填写类的成员变量`items`
  6. 在构造函数中给`items`添加数据
  7. 在生命周期的钩子`ngOnInit`中打印信息

我们的组件就写好了。

## 组件的嵌套

写好组件后，我们如何将这个组件放在`app`组件中呢？答案是`directives`。这里设计得没有react好，react的组件是可以直接用的，ng2的组件则需要以指令的身份注入，因为组件实质也是指令：

app/app.ts

```ts
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {Navbar} from './navbar';

@Component({
    selector: "app",
    directives:[Navbar],
    template: `
      <navbar></navbar>
    `
})
export class App {
  constructor() {
   
  }
}

bootstrap(App, [])
  .catch(err => console.error(err));
```    
                    
ng2中组件和指令都是注入在`directives`中，`directives`包含三种类型：

  1. Components
  2. Structural directives
  3. Attribute directives


关于指令，我们会单独拿出来讲解。

## 生命周期钩子

本例中，我们使用了`ngOnInit`这个类方法去打印一个信息，这个方法会在组件初始化时候调用。组件存在很多声明周期钩子函数

  * `ngOnChanges`   

  * `ngOnInit`   

  * `ngOnDestroy`   

  * `ngDoCheck`
  * `ngAfterContentInit`
  * `ngAfterContentChecked`
  * `ngAfterViewInit`
  * `ngAfterViewChecked`

[Official docs](https://angular.io/docs/ts/latest/api/lifecycle_hooks/OnChanges-interface.html)

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>

