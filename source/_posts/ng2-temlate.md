---
title: Angular2 系列教程（二）模板语法
date: 2016-02-16 07:40:00
tags: [Angular2]
---

今天我们要讲的是ng2的模板语法，[官网](https://angular.io/docs/ts/latest/guide/template-syntax.html)写的很清楚，但我也用通俗易懂的讲法再罗列一下吧！

<!--more-->

## 例子

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xp9afp7tj20dr0gd754.jpg)

[源代码](https://github.com/lewis617/angular2-tutorial/tree/gh-pages/template-syntax)

## 属性绑定

不需要特别的指令，只需要用`[value]`就可以了，并不只有`value`，`[]`里面可以是任何常用的html元素的属性！

app/app.html

```html
<input [value]="firstName" [placeholder]="firstNamePlaceholder" />
```

也可以用双花括号：

app/app.html

```html
<input value="{{firstName}}" placeholder="{{firstNamePlaceholder}}" />
```
绑定的属性从何而来？从我们定义的类中：

app/app.ts

```ts
firstName: string = 'lewis';
```

## 事件

你可以在ng2中监听任何html5原生的元素事件，只需要使用这个语法： `(eventName)`

app/app.html

```html
<button (click)="doSomething($event)" >点击</button>
```

`doSomething`从何而来？跟属性`firstName`一样，在类中定义：

app/app.ts

```ts
doSomething($event){
    console.log('点击了这个按钮：',$event.target);
}
```

## 双向数据绑定

刚才讲的是单向数据绑定，不信你可以改变input的值看看，别的绑定会不会变动。答案是不会！这次我们来做双向数据绑定：

app/app.html

```html
<input type="text" [value]="firstName (input)="firstName=$event.target.value" />
<input type="text" [(ngModel)]="firstName" />
```

使用单向绑定加事件绑定可以，使用`[(ngModel)]`也可以！这样你再改变`input`的值，所有绑定`firstName`的值都会跟着变化！

ng2的双向数据绑定没有用"脏检查"，而是用了zone.js。这是个什么库呢？

> A zone is an execution context that persists across async tasks.

用来维持切换上下文的库。用来替代`$apply()`的一个库。告诉你何时更新视图！

## 局部变量

局部变量 `#` 是一个对象或者dom元素的指针，什么意思？看代码：

app/app.html

```html
<!-- phone refers to the input element; pass its `value` to an event handler -->
<input #phone placeholder="phone number">
<button (click)="callPhone(phone.value)">Call</button>

<!-- fax refers to the input element; pass its `value` to an event handler -->
<input var-fax placeholder="fax number">
<button (click)="callFax(fax.value)">Fax</button>
```
一切尽在不言中！

## *语法与template标签

先看一个*语法与template标签的应用：

```html
<p *ngIf="isActive">我是段落</p>
```
相当于

```html    
<template [ngIf]="isActive"><p>我是段落</p></template>
```
这段代码的意思是，如果`isActive`为`true`则渲染`p`元素。

`template`标签声明了一段 DOM ，这段DOM在runtime后会被实例化。

使用`template`我们可以将一段DOM包裹起来，声明它，然后决定要不要渲染他们。不渲染的话，里面的元素就不会加载，可以节省运算。如果你用`div`和隐藏效果的话，里面的元素还得加载，浪费了运算。

我们也使用`*`语法替代`template`标签。起到同样的作用。

用`*`装饰的自带指令还有：`NgFor`, `NgIf`和`NgSwitch`。都是控制是否渲染的指令。我们用`*`来装饰后，就可以产生类似`template`的效果！

## 更多语法

以上只是介绍了常用的语法，还有更多的语法参考可以直接去[官网](https://angular.io/docs/ts/latest/guide/template-syntax.html)

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>
