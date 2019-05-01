---
title: React 与 Redux 教程（五）异步、单一state树结构、componentWillReceiveProps
date: 2016-01-30 04:18:00
tags: [React, Redux]
---

今天，我们要讲解的是异步、单一state树结构、componentWillReceiveProps这三个知识点。

<!--more-->

## 例子

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xsvlmvplg20q50ksq8j.gif)

这个例子是官方的例子，主要是从Reddit中请求新闻列表来显示，可以切换react和frontend关键词来切换新闻列表，可以刷新当前新闻列表。

源代码：

https://github.com/lewis617/react-redux-tutorial/tree/master/redux-examples/async

## 异步

异步本身 这个概念，本文不详细叙述，但可以简单说一下，Javascript是通过自身的"事件循环（event loop）"机制来实现异步的，将耗时的IO等操作跳过，当事件完成后再发个信号过来执行回调。这使得单线程的js变的非常高效，这也是为什么
Nodejs在多并发场景下特别牛逼的原因。

Redux只能实现同步操作，但是可以通过thunk中间件实现异步。thunk的作用看[React 与 Redux 教程（一）connect、applyMiddleware、thunk、webpackHotMiddleware](https://lewis617.github.io/2016/01/19/r2-counter/)

**_主要的异步操作（ajax请求）均在action中进行。_**

本例子的异步操作在`fetchPosts`中，就是使用`fetch`这个方法，进行ajax请求，然后使用promise进行完成后的回调操作。看代码：

actions/index.js

```js
import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'
//选择新闻类型action
export function selectReddit(reddit) {
  return {
    type: SELECT_REDDIT,
    reddit
  }
}
//废弃新闻类型action
export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  }
}
//开始获取新闻action
function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  }
}
//获取新闻成功的action
function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

//获取文章，先触发requestPosts开始获取action，完成后触发receivePosts获取成功的action
function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit))
    return fetch(`https://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)))
  }
}

//是否需要获取文章
function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

//如果需要则开始获取文章
export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit))
    }
  }
}
```
异步这个概念比较简单，不再赘述了。

## 单一state树结构

单一state树结构是Redux的最大特点。我们今天主要讲解state的树结构长什么样？首先，我们可以通过React的chrome插件，来看下这个state树：

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xsvkmvlfj20ks07zq5d.jpg)

我们点击Connect(App)，可以查看整个程序的state树，但是这棵树是从storeState开始的。我们在第一课中讲到，只能通过Redux的devtools来查看全局单一state，其实是片面的，通过React的chrome插件同样可以看到这棵树。

那么这棵树为什么长这个样子，我们是如何构建这棵树的呢？答案都在reducer里面：

reducers/index.js

```js
import { combineReducers } from 'redux'
import {
  SELECT_REDDIT, INVALIDATE_REDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

//选择新闻后，将state.selectedReddit设为所选选项
function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}

function posts(state = {
  //是否正在获取最新
  isFetching: false,
  //是否废弃
  didInvalidate: false,
  //内容
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}
//废弃、接收到、开始接受新闻后，将state.postsByReddit设为相关参数
function postsByReddit(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.reddit]: posts(state[action.reddit], action)
      })
    default:
      return state
  }
}
//将两个reducer合并成一个reducer,也就将全局的state加上postsByReddit,selectedReddit两个属性，每个属性都有自己的state
const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
})

export default rootReducer
```

我们写了两个reducer，`postsByReddit`, `selectedReddit`，最后把它们合并起来。所以我们的全局单一state树的第一级节点是`postsByReddit`, `selectedReddit`。

`postsByReddit`节点下面就是`postsByReddit`返回的`state`，也就是`[action.reddit]:posts(state[action.reddit], action)`。`posts()`就是`{ isFetching:false,didInvalidate: false, items: [] }`

现在明白了全局单一state树是如何构建了的吧？----通过reducer。

## componentWillReceiveProps

这是React组件生命周期里面的一个时间节点的回调函数。通常在组件接收新的props时触发。我们在componentDidMount()和componentWillReceiveProps()这两个回调里面加上console.log，来追踪这两个事件的触发：

containers/App.js（部分代码）

```js
//初始化渲染后触发
componentDidMount() {
  console.log('执行componentDidMount');
  const { dispatch, selectedReddit } = this.props
  dispatch(fetchPostsIfNeeded(selectedReddit))
}

//每次接受新的props触发
componentWillReceiveProps(nextProps) {
  console.log('执行componentWillReceiveProps',nextProps);
  if (nextProps.selectedReddit !== this.props.selectedReddit) {
    const { dispatch, selectedReddit } = nextProps
    dispatch(fetchPostsIfNeeded(selectedReddit))
  }
}
```

然后我们打开浏览器，执行下面的用户操作，查看console里面的打印信息：

1，刷新页面：

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9xsvkl9lkj20qx06ngoi.jpg)

首先，执行了`componentDidMount`，也就是渲染了组件。然后执行`request_post`的action，这个action改变了state，state和props就是部分绑定关系，所以触发了`componentWillReceiveProps`。

然后那个`[HMR]`是热替换的意思，这里不详细叙述。

接下来又执行了`componentWillReceiveProps`，为什么呢？因为获取新闻数据成功了，state改变了，被绑定的props也变了，所以执行了`componentWillReceiveProps`。我们可以看到posts里面已经有值了，这时触发了`receive_posts`的action。



2，切换新闻类型

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9xsvkukugj20qr089wis.jpg)



切换下拉框，触发了`select_reddit`的action，改变了state，改变了被绑定的props，所以触发了`componentWillReceiveProps`

`componentWillReceiveProps`的回调又触发了`request_posts`的action，自己看代码。这个action改变了state,改变了被绑定的props，所以又触发了`componentWillReceiveProps`。

获取新闻数据成功后，又改变了state,改变了被绑定的props，又触发了`componentWillReceiveProps`，也触发了`receive_posts`这个action。

3，点击刷新按钮

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9xsvkukugj20qr089wis.jpg)



首先，触发了`invalidate_reddit`废弃新闻的action，然后触发了`request_posts`的action，state的`isFetching`被改变了，所以触发了一次`componentWillReceiveProps`

接受完成，又触发一次`componentWillReceiveProps`。



由此可见，`componentWillReceiveProps`在Redux+React的程序中，是个非常常用的概念，甚至可以说，只要能监听每次的`componentWillReceiveProps`，就可以清楚的了解React和Redux的交互过程。

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>
