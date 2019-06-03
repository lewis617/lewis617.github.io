---
title: JavaScript 基础：异步
date: 2019-06-02 20:51:00
tags: [JavaScript 基础, 事件循环, 执行栈, 任务队列, 宏任务, 微任务]
---

今天，我们要讲的是 JS 异步的知识，包括事件循环、执行栈、任务队列、宏任务、微任务。

![事件循环](https://user-images.githubusercontent.com/11524612/58769995-a2ad2180-85de-11e9-9c4a-2dffefd08899.png)


<!--more-->

## 执行栈

一个记录函数调用的数据结构。当函数被调用时，会被 push 进栈顶；执行完返回时，从栈顶 pop 出。Javascript 主线程中只有一个执行栈，负责顺序执行主线程中代码。

![image](https://user-images.githubusercontent.com/11524612/58762165-b5443e00-857f-11e9-92be-76208ff985db.png)


上图先调用 a（push a 到栈），a 再调用 b（push b 到栈），所以报错信息里的 error stack 是 b->a->主函数；

如果上图不报错，那么：b 执行完了被 pop 出，然后 a 执行完了被 pop 出。

## 任务队列

一个记录异步事件回调的队列数据结构。当有外部的异步事件 (setTimeout、ajax 等请求) 时，相应的回调函数会按照先后顺序存放在任务队列中。

## 宏任务与微任务

ES6 之前任务比较简单只有 setTimeout / ajax 这类 web api 生成的异步事件，所有的这些内容都会被存放到事件队列中，我们称之为异步任务。后来 ES6 中引入了 Promise 之后，异步任务之间存在差异，执行的优先级也有区别。分为两类：微任务和宏任务。

> 宏任务：整体代码 script 、setTimeout、setInterval、DOM 操作、ajax； 微任务：Promise、async / await

## 事件循环

- 从宏任务队列的队头中拿出一个任务放到执行栈里执行；
- 中途遇到异步，就另外执行异步，并把回调函数放到宏任务或者微任务队列中；
- 执行完了，检查微任务队列，有就清空它（也就是放到执行栈里执行它）；
- 微任务清空了，回到第一步。

![image](https://user-images.githubusercontent.com/11524612/58762110-ea9c5c00-857e-11e9-91d5-2caebb25b7d5.png)

## 面试题：promise 与 setTimeout

下面代码的执行顺序是啥？

```js
setTimeout(function() {
    console.log('setTimeout');
}, 0);

new Promise(function(resolve) {
    console.log('promise');
    resolve();
}).then(function() {
    console.log('then');
});

console.log('console');
```

答：promise console then setTimeout
