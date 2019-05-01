---
title: 用更少的代码发起异步 action
date: 2016-12-1 04:18:00
tags: [Redux, redux-amrc]
---

很多人说 Redux 代码多，开发效率低。其实 Redux 是可以灵活使用以及拓展的，经过充分定制的 Redux 其实写不了几行代码。今天先介绍一个很好用的 Redux 拓展—— [redux-amrc](https://github.com/lewis617/redux-amrc)。它可以帮助我们使用更少的样板代码发起异步 action。

<!--more-->

## 低效的过去

一般情况下，为了清楚地记录异步的过程，我们需要使用 三个 action 来记录状态变化。通常，我们的代码会是这样：

```js
const LOAD = 'redux-example/auth/LOAD';
const LOAD_SUCCESS = 'redux-example/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/auth/LOAD_FAIL';
```

写完这么多 action，还要在异步的前后发起它们，当然这时你可能会用中间件，所以你的代码最少也会是这样：

```js
export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}
```

发起 action 后，还要编写 reducer 来处理这些 action，以改变状态：

```js
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
	default:
      return state;
  }
}  
```

这太痛苦了，不就是发起一个异步吗？非要让我写这么多代码？

其实，上述过程是可以简化的。记得有篇文章叫《超过90秒的任务不自动化，你好意思说自己是黑客？》，前端工程师也应该具有黑客精神，接下来就让我们使用 redux-amrc 将上述过程简化。

## 轻松的现在

使用了 redux-amrc 后，再也不用写这么多 action了，甚至连处理这些 action 的 reducer 都不用写，你只需要把异步以 Promise 的形式传给 redux-amrc 就行了。没有 action，没有 reducer，只需要编写一个 action 创建函数并发起它就可以了！就是这么清爽！

```js
import fetch from 'isomorphic-fetch';
import { ASYNC } from 'redux-amrc';

export function load() {
  return {
    [ASYNC]: {
      key: 'counter',
      promise: () => fetch('http://localhost:3000/api/counter')
        .then(response => response.json())
    }
  };
}
```

另外，附一张使用 redux-amrc 的程序截图，看到 async 那颗树了吗，就是这个插件自动帮你构建的，你可以获取 `value`、`error`、`loading`、`loaded`、`loadingNumber`，应有尽有，而且全自动生成！

![](http://ww1.sinaimg.cn/mw690/83900b4egw1fabfc1z4kwj210s0nsaem.jpg)

快把这个插件用到你的 Redux 应用中吧！具体用法请参考 [redux-amrc 中文文档](https://lewis617.github.io/redux-amrc/)。
