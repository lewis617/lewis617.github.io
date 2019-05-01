---
title: Angular2 系列教程（五）Structural directives、再谈组件生命周期
date: 2016-02-19 09:11:00
tags: [Angular2]
---

今天，我们要讲的是structural directives和组件生命周期这两个知识点。structural directives顾名思义就是改变dom结构的指令。著名的内建结构指令有[ngIf](https://angular.io/docs/ts/latest/guide/template-syntax.html#ngIf),[ngSwitch](https://angular.io/docs/ts/latest/guide/template-syntax.html#ngSwitch) 和[ngFor](https://angular.io/docs/ts/latest/guide/template-syntax.html#ngFor)。

<!--more-->

## 例子

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xofl445fj20e30a4t9t.jpg)

例子是我自己改写的，编写一个structural directives，然后通过这个指令实例化和注销组件，在此同时监视组件生命周期。

[源代码](https://github.com/lewis617/angular2-tutorial/tree/gh-pages/lifecycle)

## UnlessDirective

这个指令是官网示例中的指令。

app/unless.directive.ts

```ts
import {Directive, Input} from 'angular2/core';
import {TemplateRef, ViewContainerRef} from 'angular2/core';
@Directive({ selector: '[myUnless]' })
export class UnlessDirective {
  constructor(
    private _templateRef: TemplateRef,
    private _viewContainer: ViewContainerRef
    ) { }
  @Input() set myUnless(condition: boolean) {
    if (!condition) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }
}
```

通过注入`TemplateRef`, `ViewContainerRef`这两个服务，来控制`template`的实例化和注销。`TemplateRef`可以让我们获取指令所在的元素的`template`，`ViewContainerRef`提供了多种视图容器的方法。

更详细的介绍：

  * [TemplateRef](https://angular.io/docs/ts/latest/api/core/TemplateRef-class.html)
  * [ViewContainerRef](https://angular.io/docs/ts/latest/api/core/ViewContainerRef-class.html)

## 用于测试的组件

接下来我们编写一个用于测试的组件。

app/lifecycle.ts

```ts
import {Component,Input} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {OnChanges, SimpleChange,OnInit,AfterContentInit,AfterContentChecked,AfterViewInit,AfterViewChecked,OnDestroy} from 'angular2/core';

@Component({
    selector: "lifecycle",
    template: `
    <div>
    <span>{{name}}</span>
     <button (click)="doSomething()">click and watch the lifecycle</button>
     </div>
    `
})
export class Lifecycle
implements OnChanges, OnInit,AfterContentInit,AfterContentChecked,AfterViewInit, AfterViewChecked, OnDestroy{
    @Input()
    name:string
    doSomething(){
        console.log('***********doSomething**********');
        setTimeout(()=>{
             console.log('***********setTimeout**********');
            this.name='susan'
        },1000)
    }
    ngOnInit(){console.log('onInit');}
    ngOnDestroy(){console.log('OnDestroy')}
    ngOnChanges(changes: {[propertyName: string]: SimpleChange}){console.log('ngOnChanges',changes)}
    ngAfterContentInit(){console.log('AfterContentInit')}
    ngAfterContentChecked(){console.log('AfterContentChecked')}
    ngAfterViewInit(){console.log('AfterViewInit')}
    ngAfterViewChecked(){console.log('AfterViewChecked')}
}
```

这段代码我们做了这些事：

  1. 渲染一个`span`一个`button`
  2. 设置成员变量`name`,`@input`代表从`parent`输入
  3. 设置成员函数`doSomething`，打印一个信息，执行一个异步操作`setTimeout`
  4. 继承接口，设置所有的生命周期钩子，并打印信息

我们将使用这个组件，来监视组件生命周期。

## 使用指令控制组件

我们将我们的组件渲染出来，并用我们编写的结构指令"myunless"去实例化和注销这个组件

app/app.ts

```ts
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {UnlessDirective}from './unless.directive';
import {Lifecycle} from './lifecycle'

@Component({
    selector: "app",
    directives:[UnlessDirective,Lifecycle],
    template: `
      <button
      (click)="condition = !condition"
      [style.background] = "condition ? 'orangered': 'lightgreen'"
      >
      Set 'condition' to {{condition ? 'False': 'True'}}
      </button>

      <lifecycle *myUnless="condition" name="lewis"></lifecycle>
    `
})
export class App {
    constructor() {}
}

bootstrap(App, [])
    .catch(err => console.error(err));    
```

这段代码我们干了这些事：

  1. 注入组件和指令`directives:[UnlessDirective,Lifecycle]`
  2. 渲染一个`button`控制成员变量`condition`的正负
  3. 渲染我们的组件`lifecycle`，并使用指令控制它的实例化和注销`<lifecycle *myUnless=”condition” name=”lewis”></lifecycle>`
  4. 最后启动这个`app`组件`bootstrap(App, []) .catch(err => console.error(err));`

## 开始测试

### 刷新页面：

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9xofnidzrj206l0b9jsf.jpg)

  1. `onInit`是在组件第一次`ngOnChanges`时执行
  2. `OnChanges`在`input`和`output`绑定的值变化时候;我们可以看到打印了变化的值。可以替代ng1中的`$watch`;
  3. `AfterContentInit`、`AfterViewInit`分别代表在组件内容和视图初始化后执行。
  4. `AfterContentChecked`和`AfterViewChecked`是在组件内容和视图检查完后执行。

这里没有`DoCheck`，因为接口没有证实。  

### 点击Set 'condition' toTrue按钮，页面上的组件被注销

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xoflcprrj207n036wed.jpg)

console打印：

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xofkn1oij206f00jjr5.jpg)

### 点击Set 'condition' to False按钮，页面上的组件重新被实例化：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xofk3dwqj207q022t8q.jpg)

console打印：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xofkozklj206d03laa5.jpg)

打印了一次`Onchanges`、`onInit`、`AfterContentInit`、`AfterViewInit`、`AfterContentChecked`和`AfterViewChecked`，说明组件实例化，只需要触发一轮初始化和变化检查。与刷新页面的五次对比，我们可以知道多余的"变化检查"，可能来源于angualr的启动。

### 点击click and watch the lifecycle按钮，一秒后页面上的name变为susan：

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xofkuv3uj207701p3yk.jpg)

console打印

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xofmbzj1j206m04qjrm.jpg)

先打印一次`AfterContentChecked`和`AfterViewChecked`，一秒后又打印两次。`OnChanges`没有触发。

## 结论和收获

  1. `TemplateRef`, `ViewContainerRef`这两个服务可以帮助我们实现结构指令的编写
  2. 结构指令可以完全注销组件，节约性能消耗
  3. 组件实例化，只需要触发一轮初始化和"变化检查"
  4. angualr的启动会触发多次"变化检查"
  5. 我们可以继承`OnChanges`接口，来实现类似ng1中的`$watch`功能，获取变化前后的值，但是只能监视`@input`装饰的变量
  6. ng2使用`zone`，将window对象上常见的异步方法（setTimeout等），都打上了"猴子补丁"，使其可以直接更新视图，我们再也不用在异步中写ng1中的`$apply`了
  7. 我们可以使用`setTimeout(()=>{},0)`，在浏览器的一轮"event loop"后来触发ng2的"变化检查"
  8. 我们触发类的成员函数（`doSomething`）时，也会导致ng2的"变化检查"

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>

