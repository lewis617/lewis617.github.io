---
title: Angular2 系列教程（一）hello world
date: 2016-02-15 09:38:00
tags: [Angular2]
---

今天我们要讲的是Angular2 系列教程的第一篇，主要是学习Angular2的运行，以及感受Angular2的Components以及模板语法。

<!--more-->

## 例子

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xppvhc43j208g052t92.jpg)

这个例子非常简单，是个双向数据绑定。我使用了官网上最简单的方法来启动这个程序，并且去除 CDN 使用本地加载，保证长期可以运行（因为文件都在本地，我们不用担心版本更新的问题。）

[源代码](https://github.com/lewis617/angular2-tutorial/tree/gh-pages/hellowold)

运行方法：

全局安装http-server

```sh 
npm install -g http-server
```

在根目录（hellowold）运行服务

```sh    
http-server
```
根据提示打开相应的端口（一般是8080）。

也可以直接看我的[github pages](http://lewis617.github.io/angular2-tutorial/hellowold/) 。

## 公共部分

公共部分就是你可以直接复制粘贴拿去用的部分，包括

  1. index.html
  2. lib（文件夹以及里面所有的js文件）
  3. app/main.ts

这些文件都是完全不用修改的，还有一个文件需要部分修改：

  1. app/app.ts

这个文件必须导出App组件。其他文件都是需要自己编写的。

## lib简介

  1. 前三个文件是ie的polyfill，其他浏览器是不需要的
	  * `<script src="lib/es6-shim.min.js"></script>` 
	  * `<script src="lib/system-polyfills.js"></script>` 
	  * `<script src="lib/shims_for_IE.js"></script>`  

  2.  第四个文件包含了zone和reflect-metadata。zone告诉angular2何时更新视图？还记的ng1的脏检查以及$apply吧，zone就是用来取代这些恶心的东西的！reflect-metadata也是为了使用 ES7风格的装饰器准备的，就像`@Component` 和 `@View` 。这在ng2里面重度使用！
	  * `<script src="lib/angular2-polyfills.js"></script>`
  4.  这三个文件分别用于模块系统、ts编译、响应式编程（增强处理异步的能力）
	  * `<script src="lib/system.js"></script>`  
	  * `<script src="lib/typescript.js"></script>`  
	  * `<script src="lib/Rx.js"></script>`   

  5.  最后是ng2的库文件
	  * `<script src="lib/angular2.dev.js"></script>`

## 组件

其实这个程序就一个ts文件，还特别短！

app/app.ts

```ts
import {Component} from 'angular2/core';  
  
@Component({  
    selector: 'app',  
    template: `  
        <h1>Hello, {{name}}!</h1>  
        Say hello to: <input [value]="name" (input)="name = $event.target.value">  
    `  
})  
export class App {  
    name: string = 'World';  
}
```

定义一个类，给它装饰一个组件，组件是什么？就是ng1里面的指令，react中的组件，就是样子，看得见摸得着的东西。

这里我不得不夸一下ng2，实在改进太多了，所有的东西包括组件、服务、过滤器等都是一个类，然后用各自相关的@装饰器，装饰一下就可以了，非常简单明了！

## 模板语法

我们先来感受下ng2的模板语法，后面我会单独拿出来讲这个知识点。

值得高兴的是双花括号依然存在

```html
<h1>Hello, {{name}}!</h1>
```

`ng-model`变成了`[value]`，属性绑定用了`[value]`。

```html
<input [value]="name" (input)="name = $event.target.value">
```

事件绑定变成了`()`，里面是所有html5的事件比如，`click`,`hover`,`input`等等。ng2终于拥抱html5原生方法了！

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>