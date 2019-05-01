---
title: React 与 Redux 教程（四）undo、devtools、router
date: 2016-01-27 03:39:00
tags: [React, Redux]
---

上节课，我们介绍了一些es6的新语法：[React 与 Redux 教程（三）reduce()、filter()、map()、some()、every()、...展开属性](https://lewis617.github.io/2016/01/21/r2-array/)

今天我们通过解读redux-undo的官方示例代码来学习，在Redux中使用撤销功能、devtools功能、以及router。

<!--more-->

## 例子

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xt46iemmg20q50ks41w.gif)

这个例子是个计数器程序，包含计数器、右边的Redux开发工具、还有一个路由（不过只有"/"这一个地址）。

源代码：

https://github.com/lewis617/react-redux-tutorial/tree/master/redux-undo-boilerplate

##  撤销

实现撤销功能非常简单，你只需要使你的reducers可以撤销就可以了。这是什么意思呢？看代码

reducers/index.js

```js
import { combineReducers } from 'redux'
import counter from './counter'
import {
  INCREMENT_COUNTER, DECREMENT_COUNTER,
  UNDO_COUNTER, REDO_COUNTER
} from '../actions/counter'
import undoable, { includeAction } from 'redux-undo'

const rootReducer = combineReducers({
  counter: undoable(counter, {
    filter: includeAction([INCREMENT_COUNTER, DECREMENT_COUNTER]),
    limit: 10,
    debug: true,
    undoType: UNDO_COUNTER,
    redoType: REDO_COUNTER
  })
})

export default rootReducer
```

我们使用`redux-undo`这个包给我们提供的`undoable`和`includeAction`，就可以可以给指定reducer（counter）添加撤销功能。`filter`是选择过滤的action有哪些，这里我们只撤销重做加减action，也就是`INCREMENT_COUNTER`, `DECREMENT_COUNTER`，  `limit`是次数限制，`debug`是是否调试码，`undotype`和`redotype`是撤销重做的action。

如此以来，我只需要触发撤销重做的action便可以实现撤销重做功能，就是这么简单！

## devtools

接下来，我们开始学习使用devtools这个功能，devtools是什么？devtools的实质其实也是组件。devtools能干什么？devtools可以帮助我们看到整个程序的状态和整个程序的触发的action的日志记录。我们如何安装devtools呢？首先，我们知道devtools是个组件，那么我们直接把devtools放在容器中渲染出来不就可以了吗？

containers/DevTools.js

```js
/*eslint-disable*/
import React from 'react'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
/*eslint-enable*/

export default createDevTools(
  <DockMonitor toggleVisibilityKey="H"
               changePositionKey="Q">
    <LogMonitor />
  </DockMonitor>
)
```

这是一个可以复用的容器代码，也就意味着，你可以直接把这个js文件，复制粘贴到你的项目中。这段代码我们输出了一个devtools组件。

containers/Root.js

```js
/* global __DEVTOOLS__ */
/*eslint-disable*/
import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import configureStore from '../store/configureStore'
import routes from '../routes'
/*eslint-enable*/

const store = configureStore()

function createElements (history) {
  const elements = [
    <Router key="router" history={history} children={routes} />
  ]

  if (typeof __DEVTOOLS__ !== 'undefined' && __DEVTOOLS__) {
    /*eslint-disable*/
    const DevTools = require('./DevTools')
    /*eslint-enable*/
    elements.push(<DevTools key="devtools" />)
  }

  return elements
}

export default class Root extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render () {
    return (
      <Provider store={store} key="provider">
        <div>
          {createElements(this.props.history)}
        </div>
      </Provider>
    )
  }
}
```

这段代码，我们将我们导出的devtools组件放在了`router`这个组件的下面，不过我们加了一个`typeof DEVTOOLS !=='undefined' && DEVTOOLS`的判断，如果条件成立，我们将渲染devtools，否则不渲染。这样做，意味着我们可以通过参数控制devtools在开发环境中显示，在生产环境中不显示。

是不是渲染出来，就可以了？当然不是！我们还需要在`store`里面注册！

store/configureStore.js

```js
/* global __DEVTOOLS__ */
import { createStore, applyMiddleware, compose } from 'redux'
// reducer
import rootReducer from '../reducers'
// middleware
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import createLogger from 'redux-logger'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
})

const enforceImmutableMiddleware = require('redux-immutable-state-invariant')()

let createStoreWithMiddleware

if (typeof __DEVTOOLS__ !== 'undefined' && __DEVTOOLS__) {
  const { persistState } = require('redux-devtools')
  const DevTools = require('../containers/DevTools')
  createStoreWithMiddleware = compose(
    applyMiddleware(
      enforceImmutableMiddleware,
      thunkMiddleware,
      promiseMiddleware,
      loggerMiddleware
    ),
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore)
} else {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware, promiseMiddleware)
  )(createStore)
}

/**
 * Creates a preconfigured store.
 */
export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

```

到此为止，devtools我们就安装好了，就是这么简单！把它渲染出来就可以了，可以放在整个程序的下面就可以了！

## store enhancer

`DevTools.instrument()` 这行代码使得devtools可以使用了！有的同学会问，这个`instrument()`是什么鬼？官方称之为store enhancer，翻译过来就是store加强器，跟`applymiddleware`是一类，都是store加强器。那么store加强器，能干什么？store加强器可以重新构建一个更牛逼的store，来替换之前的基础版的store，让你的程序可以增加很多别的功能，比如`appllymiddleware`可以给你的Redux增加中间件，使之可以拥有异步功能，日志功能等！


## enforceImmutableMiddleware,thunkMiddleware, promiseMiddleware, loggerMiddleware



有的同学会问，`enforceImmutableMiddleware`是什么？干嘛用的？这个使用禁止你改变state的。什么？不改变state，我们如何更新状态，Redux不允许你改变state，在reducer中我们必须要返回一个新的state，而不是修改原来的state！

那个`thunk`是什么？`thunk`我们已经在[React 与 Redux 教程（一）connect、applyMiddleware、thunk、webpackHotMiddleware](https://lewis617.github.io/2016/01/19/r2-counter/)里面讲过了。

那么什么是`promiseMiddleware`？这也是个中间件，和`thunk`一样，使得你的action可以具备异步的功能。不过，我们可以发现，本例中我们并没有用到`thunk`和`promiseMiddleware`这两个中间件，本例子是个种子文件，可以在这个基础上拓展，所以作者提前写好了两个常用中间件，便于我们日后使用！

那么`loggerMiddleware`是用来干嘛的？顾名思义，就是用来记录日志的，当你添加这个中间件，你可以在命令行中看到相关的打印日志！当然你可以在运行程序的时候，去掉这个中间件，来对比观察它的作用！



## instrument()与compose()写法

`instrument()`不同于`applymiddleware`，它只能用于开发环境，只能enable你的devtools组件！那么我们把`applymiddleware`和`instrument`用逗号隔开，为什么？这是compose写法，用来代替以前的函数嵌套！

## Router

简单来说，Router也是个组件，一个多重视图的组件，这个组件可以通过切换URL来切换视图，总之它还是个组件。既然是组件，我们只要把它渲染出来就可以了！

最顶层我们要渲染一个`Router`, 代码在containers/Root.js中，我们就不重复列出代码清单了。

然后我们开始渲染各个视图，这里我们只有一个视图，也就是目录是"/"的视图，我们把它渲染出来！

routes.js

```js
/*eslint-disable*/
import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'
import * as containers from './containers'
/*eslint-enable*/

const {
  CounterPage
} = containers

export default (
  <Route component={App}>
    <Route path="/" component={CounterPage} />
  </Route>
)
```

我们导出了一个视图，这个视图的组件是`CounterPage`。就是这么简单！

然后，我们在containers/Root.js，将它渲染到`Router`组件里面就可以了！

```js
<Router key="router" history={history} children={routes} />
```

我们可以发现，我们并没有把devtools这个组件放在路由组件里面。这意味着，无论你如何切换视图，devtools都一直会渲染出来！

当然react-router的api还有很多，我们只是用了很少一部分，我不建议专门阅读api文档，应该在项目中，遇到不会的查询api文档，这样对api的用法的理解会更加的深刻！

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>

