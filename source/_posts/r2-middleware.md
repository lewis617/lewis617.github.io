---
title: React 与 Redux 教程（七）自定义Redux中间件
date: 2016-02-02 08:20:00
tags: [React, Redux]
---

今天，我们要讲解的是自定义Redux中间件这个知识点。本节内容非常抽象，特别是中间件的定义原理，那多层的函数嵌套和串联，需要极强逻辑思维能力才能完全消化吸收。不过我会多罗嗦几句，所以不用担心。

<!--more-->

# 例子

例子是官方的例子real-world，做的是一个获取github用户、仓库的程序。

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xqzu2zo4j21eq0hjgrc.jpg)

本例子源代码：

https://github.com/lewis617/react-redux-tutorialt/tree/master/redux-examples/real-world

# Redux中间件就是个嵌套函数

Redux中间一共嵌套了三层函数，分别传递了`store`、`next`、`action`这三个参数。是不是想到了函数式编程中的柯里化？

为什么要嵌套函数？为何不在一层函数中传递三个参数，而要在一层函数中传递一个参数，一共传递三层？因为中间件是要多个首尾相连的，对`next`进行一层层的"加工"，所以`next`必须独立一层。那么`store`和`action`呢？`store`的话，我们要在中间件顶层放上`store`，因为我们要用`store`的`dispatch`和`getState`两个方法。`action`的话，是因为我们封装了这么多层，其实就是为了作出更高级的`dispatch`方法，但是在高级也是`dispatch`，是`dispatch`，就得接受`action`这个参数。

看我们例子中的代码：

middleware/api.js

```js
// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { schema, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
```

例子中，我们用`store => next => action =>`实现了三层函数嵌套。箭头语法很好的代替了丑陋的function嵌套方法。最后指向的那个{}里面，我们就可以写关于`dispatch`的装饰了，不过记得返回`next`，给下一个中间件使用。

# 中间件的执行

嵌套函数也是函数，是函数就要运行。我们知道，js里面，我们用`()`来执行一个函数。那么三层嵌套函数我们要怎么执行呢？写三个`()`呗！`aaa()()()`就可以了。`aaa()`返回了一个函数，`aaa()()`又返回一个函数，`aaa()()()`终于执行完成。

我们来看下，我们编写的中间件是怎么运行的。首先中间件的使用是在`configStore`里面的`applyMiddleware`里面写的。

```js
applyMiddleware(thunk, api)
```
我们看下Redux的源代码：

node_modules/redux/src/applyMiddleware.js

```js
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState, enhancer) => {
    var store = createStore(reducer, initialState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```
好短好开心！不过看起来还是挺复杂的，不用担心，不就是个三层嵌套函数嘛，我们先找最外层的执行代码：

```js
chain = middlewares.map(middleware => middleware(middlewareAPI))
```

`middlewares`使用展开语法，将我们写进去的中间件，生成一个中间件数组。遍历每个中间件，在中间件最外层执行第一次，也就是参数为`store`那一次。我们发现`store`是`middlewareAPI`。

```js
var middlewareAPI = {
  getState: store.getState,
  dispatch: (action) => dispatch(action)
}
```
是个对象，包含了我们需要的两个方法，这就够了。

好了，我们开始寻找第二层函数的执行代码：

```js
dispatch = compose(...chain)(store.dispatch)
```
这是什么鬼？`compose`是种函数嵌套的写法，源代码清单就不展示了，我们知道它可以帮我们将嵌套的函数，写成逗号隔开的样子就可以了。有点类似Promise解决回调地狱的做法。都是将嵌套写成平行的样子。

`chain`就是我们的第二层函数，...就是展开语法，用逗号隔开放进`compose`参数里。后面那个`(store.dispatch)`就是入口参数。是个未经任何加工的`dispatch`，这个可怜的家伙进去后，将被我们的中间件层层加工，经历风雨，变成更加牛逼的`dispatch`。

第三层函数的执行代码在哪？不在这里面，因为到了第三层函数，就是新的`dispatch`了，我们要在组件里面使用它，所以第三层函数的执行在组件中。参数是什么？当然是可爱的`action`啊！

# 中间件的连接

我们知道，中间件是可以首尾相连使用的，那么我们如何实现首尾相连？答案就在`next()`，写过express中间件的同学对它一定不陌生。那么Redux中间件的`next()`是个什么鬼？也是个`dispatch`。

我们写中间件时候，一定要写`next()`，当前中间件对`dispatch`加工后返回给后面的中间件继续加工。这也是为什么中间件的顺序有讲究的原因。

# 解读例子中的中间件的业务流程

中间件的原理讲完了，我们来走一遍例子中的中间件业务流程吧！

## 获取指定action

我们在定义action的时候，在`fetchUser`等函数中返回了这些我们需要的东西：

actions/index.js

```js
import { CALL_API, Schemas } from '../middleware/api'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchUser(login) {
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `users/${login}`,
      schema: Schemas.USER
    }
  }
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadUser(login, requiredFields = []) {
  return (dispatch, getState) => {
    const user = getState().entities.users[login]
    if (user && requiredFields.every(key => user.hasOwnProperty(key))) {
      return null
    }

    return dispatch(fetchUser(login))
  }
}
```
我们也就是指定这些action来进行"包装的"。除了`fetchUser`，还有其他的，不列出代码清单了。

我们添加`console.log`来查看action的真正样子：

```js
console.log('当前执行的action:',action);
const callAPI = action[CALL_API]
```
![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xqzr5c5fj20lg0f9jy7.jpg)

在执行initRoutes的action时候，我们得到了一个包含Symbol的action对象，这就是我们想要的action。

## Symbol

Symbol是什么？上述代码中的`CALL_API`就是Symbol。

middleware/api.js

```js    
// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')
```

为什么要用Symbol，为了不冲突，Symbol是个唯一的不变的标识，可以用于对象的key。为了避免冲突而生，这里也可以用字符串来代替，但是不好，
因为字符串很容易命名冲突，你每次都要想个奇葩的长名字，所以还是用Symbol吧。再罗嗦一句，我们写Object.assign的时候，
第一个参数设为{},第二个参数设为源，第三个参数设为拓展属性的写法，就是为了兼容包含Symbol的对象。

## 消毒

获取到指定的action后，我们要做一系列的异常处理：

middleware/api.js

```js
if (typeof endpoint === 'function') {
endpoint = endpoint(store.getState())
}

if (typeof endpoint !== 'string') {
  throw new Error('Specify a string endpoint URL.')
}
if (!schema) {
  throw new Error('Specify one of the exported Schemas.')
}
if (!Array.isArray(types) || types.length !== 3) {
  throw new Error('Expected an array of three action types.')
}
if (!types.every(type => typeof type === 'string')) {
  throw new Error('Expected action types to be strings.')
}
```


比较简单，不罗嗦了。

## 执行请求action

获取完action，也进行过消毒了，可以开始ajax请求了，首先发一个请求action

```js
    
function actionWith(data) {
  const finalAction = Object.assign({}, action, data)
  delete finalAction[CALL_API]
  return finalAction
}

const [ requestType, successType, failureType ] = types
next(actionWith({ type: requestType }))

```   

## 执行ajax请求，结束后发出成功或者失败action

```js
    
return callApi(endpoint, schema).then(
	response => next(actionWith({
	  response,
	  type: successType
	})),
	error => next(actionWith({
	  type: failureType,
	  error: error.message || 'Something bad happened'
	}))
  )
```
    

## 图解流程

本来一个action，经过中间件的加工后，变成了一系列的流程。

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xqzpt8v4j20ii0c9q4l.jpg)


* * *

# 教程示例代码及目录

http://www.liuyiqi.cn/2016/12/10/react-redux-tutorial-catalog/



