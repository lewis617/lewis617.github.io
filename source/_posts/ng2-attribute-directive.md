---
title: Angular2 系列教程（四）Attribute directives
date: 2016-02-18 03:05:00
tags: [Angular2]
---

今天我们要讲的是ng2的Attribute directives。顾名思义，就是拓展dom属性的指令。这算是指令的第二课了，因为上节课的components实质也是指令。

<!--more-->

## 例子

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xosknpxcj206d05odg4.jpg)

这个例子共两个指令，第一个是redify指令，能使元素的color属性变红。另外一个直接复制官网的highlight指令，但是我自己做了很多变化，来讲解写法的多样化。

[源代码](https://github.com/lewis617/angular2-tutorial/tree/gh-pages/directives)

## @Directive

写指令，你需要从`'angular2/core'`中导入`Directive`，然后使用`@Directive`装饰器去装饰一个类：

app/directives.ts

```ts
import {Directive, ElementRef, Renderer} from 'angular2/core';

@Directive({
  selector: '[redify]'
})
export class Redify {

  constructor(private _element: ElementRef, private renderer: Renderer) {
      renderer.setElementStyle(_element.nativeElement, 'color', 'red');
  }
}
```

这段代码做了这些事：

  1. 在装饰器`@Directive`中定义选择器`redify`
  2. 在类`Redify`中的构造函数里面注入`ElementRef`，来获取当前的dom元素
  3. 同样注入`Renderer`服务来操作dom，使其`color`属性为红色

服务是可以注入指令的。`Renderer`服务提供了多种操作dom样式的方法。

[Official docs for ElementRef](https://angular.io/docs/ts/latest/api/core/ElementRef-class.html)

[Official docs for Renderer](https://angular.io/docs/ts/latest/api/core/Renderer-class.html)

## 事件监听

如何实现指令的事件监听呢？答案是设置`host`：

src/app/highlight.directive.ts

```ts
host: {
  '(mouseenter)': 'onMouseEnter()',
  '(mouseleave)': 'onMouseLeave()'
}
```

我们在`@Directive`中设置`host`元数据，`host`是个对象，你可以通过`host`配置指令的事件监听，当事件发生，将触发相应的成员函数。本例子中，设置了鼠标进入和离开两个鼠标事件。并在类中编写相应的成员函数：

src/app/highlight.directive.ts

```ts
onMouseEnter() { this._highlight(this.highlightColor || this._defaultColor); }
onMouseLeave() { this._highlight(null); }
```

## @Input

如果需要向指令中输入什么，那么需要`@input`这个装饰器，从`'angular2/core'`中导入`Input`即可使用：

```ts
@Input('myHighlight') highlightColor: string;

private _defaultColor = 'red';
@Input() set defaultColor(colorName:string){
  this._defaultColor = colorName || this._defaultColor;
}
```
上述代码我们做了几件事：

  1. 给成员变量`highlightColor`，装饰一个`@Input('myHighlight')`，使其等于从`myHighlight`输入的属性
  2. 设置一个私有成员变量`_defaultColor`
  3. `defaultColor`属性有个`setter`，可以重写`_defaultColor`变量，使`_defaultColor`等于从`defaultColor`属性输入的值或者其本身默认值

 这都什么鬼？没有接触过装饰器的同学可能觉得不舒服。这是es7里面的语法糖，python里面也有，是一种函数式编程。装饰器实质是个函数，可以多个嵌套装饰。

指令的`@Input`装饰器，有两种写法：

一就是给成员变量加个装饰器：

```ts
@Input('myHighlight') 
highlightColor: string;
```

代表从`myHighlight`属性输入的值会赋给成员变量`highlightColor`。

二就是使用`set`，编写一个函数，重写相关的成员变量，不明白`get` 和`set` 用法的同学可以参考这个：

* [getters](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/get)
* [setters](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/set)

 
 
```ts   
private _defaultColor = 'red';
@Input() set defaultColor(colorName:string){
  this._defaultColor = colorName || this._defaultColor;
}
```

我们来两个替换一下把：

```ts   
private highlightColor:string;
@Input() set myHighlight(colorName:string){
  this.highlightColor=colorName
}

@Input('defaultColor')
private _defaultColor = 'red';
```

仍然可以运行！

## 使用指令

导入指令的类，然后注入组件的`directives`中`[Redify,HighlightDirective]`，就可以在模板中使用指令了，这跟组件嵌套是一样的。

app/app.ts

```ts
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {Redify} from './directives';
import {HighlightDirective} from './highlight.directive';

@Component({
    selector: "app",
    directives:[Redify,HighlightDirective],
    template: `
    redify:
      <p redify >hello,lewis</p>
     myHighlight:
        <div>
          <input type="radio" name="colors" (click)="color='lightgreen'">Green
          <input type="radio" name="colors" (click)="color='yellow'">Yellow
          <input type="radio" name="colors" (click)="color='cyan'">Cyan
        </div>
      <p [myHighlight]="color">Highlight me!</p>
      <p [myHighlight]="color" [defaultColor]="'violet'">Highlight me too!</p>
    `
})
export class App {
    constructor() {

    }
}

bootstrap(App, [])
    .catch(err => console.error(err));
    
```                    

我们可以看到`<p redify >hello,lewis</p>`，`redify`指令就是元素的一个属性而已。

而`highlight`则使用了`[]`

```ts
<p [myHighlight]="color">Highlight me!</p>
<p [myHighlight]="color" [defaultColor]="'violet'">Highlight me too!</p>

```
我们在模板语法里面讲过，[]是单向属性绑定的语法，里面可以是任何hmtl5属性，当然也可以是我们拓展的html属性，即指令。毕竟angular仍然是"旨在拓展html能力"。

`[myHighlight]="color"`将成员变量`color`绑定在`myHighlight`属性中，`[defaultColor]="'violet'"`给`defaultColor`设置了`'violet'`的值。

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>



