---
title: React 与 Redux 教程（八）连接数据库的Redux程序
date: 2016-02-03 09:00:00
tags: [React, Redux]
---

前面所有的教程都是解读官方的示例代码，是时候我们自己写个连接数据库的Redux程序了！

<!--more-->

## 例子

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9xqsagq6bg20q50ksjwp.gif)

这个例子代码，是我自己写的程序，一个非常简单的todo，但是包含了Redux插件的用法，中间件的用法，连接数据库的方法等多个知识点。

源代码：

https://github.com/lewis617/react-redux-tutorial/tree/master/redux-wilddog-todos

运行方法：

```sh
npm install

npm run build
```
手动打开index.html

## Wilddog数据库

作为一名曾经的Angular开发者，我非常喜欢用Firebase来做自己的数据库，并结合Angular实现酷炫的"三向数据绑定"。Wilddog是中国的"Firebase"，不仅语法兼容，而且国内速度更快。

下面的程序都是基于Wilddog和Angular的程序，也用了我曾经的最爱Requirejs，有兴趣的同学可以看看，顺便给我点star哈哈！

https://github.com/lewis617/wild-angular-seed

https://github.com/lewis617/daily-task

如今写React程序，仍然可以使用Wilddog或者Firebase，不仅不用配置数据库服务，也不用写数据库增删改查的API程序了，可以让我们前端工程师专注于写前端程序！

https://www.wilddog.com/

## Redux的Chrome插件

本程序也用到了Redux的chrome插件，可以帮助我们自动生成Redux的devtool界面，非常好用啊！只需要在你的程序store注册中，加入一行代码：

```js 
export default (initialState) => {
  const store = compose(
      applyMiddleware(
          thunk,
          createLogger()
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore)(reducers, initialState);

  return store;
};
```

就是这行代码：

```js
window.devToolsExtension ? window.devToolsExtension() : f => f
```

安装方法，就是去chrome的市场搜索Redux关键字就可以了！

## 没有服务端渲染和热替换

为什么要把这个单独提起来说呢？这是一个历史遗留问题。我们研究所用的Web框架是Flask，一个Python框架，包括前端也是用Flask的Jinja模板。没有Node.js也就意味着无法使用服务端渲染和热替换这两个炫酷的功能。

那么不是基于Node.js的前端程序，还能否使用Redux和React呢？当然可以，我只通过Webpack生成一个js文件，将js文件放进html里面。其他所有的功能都不要。这也是可以的。这也算是结合非Node平台的一个实践经验吧！当然你的包管理还得用NPM。

从另一个方面来说，基于Node.js的前端时代已经来临，如果你拒绝它，将会失去很多，或者寸步难行！

## 获取所有的todos

我们在action中进行http请求和服务端交互，即便是在中间件中执行http请求，其实质也是dispatch的封装。那么这个程序的关键就是action的编写。

实例化Wilddog，定义action类型:

actions.js

```js
import Wilddog from 'wilddog/lib/wilddog-node'
/*
 * action 类型
 */
export const GET_TODO_ERROR = 'GET_TODO_ERROR';
export const GET_TODO_OK = 'GET_TODO_OK';
export const ADD_TODO_ERROR = 'ADD_TODO_ERROR';
export const ADD_TODO_OK = 'ADD_TODO_OK';
export const REMOVE_TODO_OK = 'REMOVE_TODO_OK';
export const REMOVE_TODO_ERROR = 'REMOVE_TODO_ERROR';

let wilddog=new Wilddog('https://redux-wilddog-todos.wilddogio.com')
```
从Wilddog数据库中获取所有的todos，因为Wilddog数据库是树状结构，生成的列表，其实质也是个对象，所以我们需要将其转化为数组：

```js
    
    
export function getTodo() {
  return (dispatch,getState)=>{

    wilddog.child('todos').once('value',(snapshot)=>{
      let obj=snapshot.val();
      let array=[];
      for(let key in obj){
        array.push({key:key,text:obj[key].text})
      }
      dispatch({
        type: GET_TODO_OK,
        payload: array
      })
    },(err)=>{
      dispatch({
        type: GET_TODO_ERROR,
        payload: err
      })
    });


  }
}
```

`wilddog.child('todos').once('value',function)`是获取`'todos'`节点数据的方法。获取到数据后，转化为数组。然后dispatch一个`GET_TODO_OK`，告诉reducer获取数据成功，可以更新state了。数据都装在`payload`中。如果失败，则dispatch一`GET_TODO_ERROR`。

就是这么简单，不用写后台程序，在js中直接操作数据库！

那么在哪里执行这个getTodo呢？你可以在组件渲染后dispatch它，也可以在初始化store后，立即执行它。我用的是后面一种：

index.js

```js
import { getTodo,registerListeners} from './actions'

let store = createStore();

store.dispatch(getTodo())
```    

## 添加新的todo

在action中定义添加todo的方法：

actions.js

```js
export function addTodo(text) {
  return (dispatch,getState)=>{

    wilddog.child('todos').push({
      text
    },(err)=>{
      if(err){dispatch({type:ADD_TODO_ERROR,payload:err})}
    });
  }
}
```

通过`wilddog.child('todos').push()`方法，直接往数据库中插入数据，第二参数是回调，失败的话，dispatch相应的action。

那么成功后的action在哪执行？我们需要再写一个function，绑定数据变动的回调。其实正常情况下，我们在这个function中就直接写成功后的回调了，主要是因为Wilddog数据库的成功回调不在`push`这个方法中。

actions.js

```js
export function registerListeners() {
  return (dispatch, getState) => {

    wilddog.child('todos').on('child_removed', snapshot => {
      dispatch({
        type: REMOVE_TODO_OK,
        payload: snapshot.key()
      })
    });

    wilddog.child('todos').on('child_added', snapshot => dispatch({
      type: ADD_TODO_OK,
      payload: Object.assign({},snapshot.val(),{key:snapshot.key()})
    }));

  };
}
```
`wilddog.child('todos').on('child_added')`这个方法定义了添加todo成功后的回调，我们执行了一个`ADD_TODO_OK` 的action，并把新的todo对象放在`payload`中返回给reducer。

你也看到了，我们顺便把移除todo成功的回调也定义了。

我们在哪执行这个绑定函数呢？就在获取所有todos的后面吧！其实放在组件渲染完也可以！

index.js

```js
store.dispatch(registerListeners())
```

## 移除指定todo

在action中添加移除todo的方法：

actions.js

```js
export function removeTodo(key) {
  return (dispatch,getState)=>{

    wilddog.child(`todos/${key}`).remove((err)=>{
      if(err)dispatch({type:REMOVE_TODO_ERROR,payload:err})
    });
  }
}
```
通过Wilddog的`remove`方法移除数据库的指定节点。就是这么简单！然后编写失败后的回调以及action！

## 数据库在action中完事，state还需要reducer

数据库我们是操作完啦，不过组件的显示是基于state的，我们还要同步更新state，那么reducer就出场了！

reducers.js

```js    
    
import { combineReducers } from 'redux'
import { ADD_TODO_OK, REMOVE_TODO_OK ,GET_TODO_OK} from './actions'

function todos(state=[], action) {
  switch (action.type) {
    case GET_TODO_OK:
      return action.payload
    case ADD_TODO_OK:
      return [
        ...state,
        action.payload
      ]
    case REMOVE_TODO_OK:
      return state.filter((todo)=>todo.key!==action.payload
      )
    default:
      return state
  }
}

const todoApp = combineReducers({
  todos
})

export default todoApp
```

很简单，如果你还不会，可以去前面几节教程补课。

来个图吧：

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xqsbmr1uj20bb055dgc.jpg)

action操作数据库后，要在回调中返回信号，让reducer更新state，因为只有state变了，组件才会变。state变了，组件自动就变了，至少不用苦逼地操作dom了，还是挺开心的！

## 为什么不提React组件

说了这么多我们的Redux容器算是搞定了，为什么不提组件？不是不提，是要让大家知道，组件和Redux容器的耦合度很低，我们可以完全将它们隔离开来编写，通过一些固定的套路将它们连接起来。什么套路？

  1. 绑定state到props
  2. 绑定action到props（可选）
  3. 将store注入，并用provider在顶层包住组件

Redux是个状态容器，只能通过发起action改变state，这种集中管控的做法让状态管理和预测变的简单。组件只是state的展现形式而已！React只是一个界面库而已！

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>
