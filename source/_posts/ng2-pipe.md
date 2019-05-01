---
title: Angular2 系列教程（六）两种pipe：函数式编程与面向对象编程
date: 2016-02-25 03:28:00
tags: [Angular2]
---

今天，我们要讲的是ng2的pipe这个知识点。

<!--more-->

## 例子

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9xnty3er1j20em06st9b.jpg)

这个例子包含两个pipe，~~一个是stateful，一个是stateless~~，是直接复制官方的例子。（最新的官网文档已经将其改为了pure和impure，并移除了面向对象的比喻，个人认为较为准确，请以最新的官网文档为参考！）

[源代码](https://github.com/lewis617/angular2-tutorial/tree/gh-pages/pipes)

## stateless pipe

pipe就是ng1中的filter。先看看内建pipe吧：

  * `currency`
  * `date`
  * `uppercase`
  * `json`
  * `limitTo`
  * `lowercase`
  * `async`
  * `decimal`
  * `percent`

无需编写直接用！今天说了太多"直接用"哈哈！

pipe分为两种，一种是stateful，一种是stateless。我们先说stateless，stateless就是使用纯函数，不记住任何数据，也不会带来任何副作用。`DatePipe`就是stateless，我们再写个计算次方的pipe吧:

app/stateless/exponential-strength.pipe.ts

```ts
import {Pipe, PipeTransform} from 'angular2/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'exponentialStrength'})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, args: string[]) : any {
    return Math.pow(value, parseInt(args[0] || '1', 10));
  }
}
```
很简单，计算某个值的某次方，比如2的10次方：

```ts
{{ 2 | exponentialStrength:10}}
```

写个模板测试下：

app/stateless/power-booster.component.ts

```ts
import {Component} from 'angular2/core';
import {ExponentialStrengthPipe} from './exponential-strength.pipe';
@Component({
  selector: 'power-booster',
  template: `
    <h2>Power Booster</h2>
    <p>
      Super power boost: {{2 | exponentialStrength: 10}}
    </p>
  `,
  pipes: [ExponentialStrengthPipe]
})
export class PowerBooster { }
```

注入`pipes: [ExponentialStrengthPipe]`，然后直接用！

## stateful pipe

先看一个stateful pipe的例子吧：

app/stateful/fetch-json.pipe.ts

```ts
declare var fetch;
import {Pipe, PipeTransform} from 'angular2/core';
@Pipe({
  name: 'fetch',
  pure: false
})
export class FetchJsonPipe  implements PipeTransform {
  private fetchedValue: any;
  private fetchPromise: Promise<any>;
  transform(value: string, args: string[]): any {
    if (!this.fetchPromise) {
      this.fetchPromise = fetch(value)
        .then((result: any) => result.json())
        .then((json: any)   => this.fetchedValue = json);
    }
    return this.fetchedValue;
  }
}
```
我们干了这些事：

  1. 将`pure`参数设为`false`
  2. 在成员函数`transform`中，执行`fetch`请求，将结果赋给`this.fetchedValue = json`，最后返回结果
  3. 如果`this.fetchPromise`这个成员变量已经被定义过，则直接返回成员变量`fetchedValue`

写个模板测试下：

app/stateful/hero-list.component.ts

```ts
import {Component} from 'angular2/core';
import {FetchJsonPipe} from './fetch-json.pipe';
@Component({
  selector: 'hero-list',
  template: `
    <h4>Heroes from JSON File</h4>
    <div *ngFor="#hero of ('/assets/heroes.json' | fetch) ">
      {{hero.name}}
    </div>
    <p>Heroes as JSON:
    {{'/assets/heroes.json' | fetch | json}}
    </p>
  `,
  pipes: [FetchJsonPipe]
})
export class HeroListComponent {
  /* I've got nothing to do ;-) */
}
```
`'/assets/heroes.json'`是我自己编写的json文件，放在了assets里面，因为这是webpack的静态文件地址。

结果：

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9xntydj8rj20eq03y0t3.jpg)

### 特性解读

>Stateful pipes are conceptually similar to classes in object-oriented
programming. They can manage the data they transform. A pipe that creates an
HTTP request, stores the response and displays the output, is a stateful pipe.

这是官方对statefule pipe的描述。说是能够创建http请求，存储响应，显示输出的pipe就是stateful pipe。那么stateless pipe不能做这些事吗？我好奇的在stateless pipe中尝试做http请求：

```ts
declare var fetch;
import {Pipe, PipeTransform} from 'angular2/core';
@Pipe({
  name: 'fetch'
})
export class FetchJsonPipe  implements PipeTransform {
  transform(value: string, args: string[]): any {
    fetch(value)
        .then((result: any) => result.json())
        .then((json: any)   =>  json);
  }
}
```
结果什么都输出不了！说明当我们需要使用http的时候，或者处理异步的时候，需要使用stateful pipe。~~这两个pipe的区别也正是"函数式编程"和"面向对象"的区别----有无状态~~ （使用“有无状态“来区别函数式编程和面向对象编程不够准确！）。

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/angular2-tutorial>

目录：<http://www.liuyiqi.cn/tags/Angular2/>



