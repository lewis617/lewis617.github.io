---
title: Angular开发者吐槽React+Redux的复杂：“一个demo证明你的开发效率低下”
date: 2016-01-13 04:02:00
tags: [Angular, React, Redux]
---

曾经看到一篇文章，写的是jQuery开发者吐槽Angular的复杂。作为一个Angular开发者，我来吐槽一下React+Redux的复杂。

<!--more-->

## 例子

为了让大家看得舒服，我用最简单的一个demo来展示React+Redux的“弯弯绕”，下面这个程序就是我用React和Redux写的。然而这个程序在Angular中一行js都不用写！！！

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9yh3scyucg20ao01k0u8.gif)

## 展示组件

App.js

```js
import React, { findDOMNode, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as action from './actions' class App extends Component {
  render() { return ( <div>
        <input type='text' value={this.props.propsValue} onChange={this.changeHandle.bind(this)} ref="input"/>
        {this.props.propsValue} </div>
 );
  }
  changeHandle(){
    const node = ReactDOM.findDOMNode(this.refs.input);
    const value = node.value.trim(); this.props.change(value);
  }
} function mapStateToProps(state) { return {
    propsValue: state.value
  }
} //将state的指定值映射在props上，将action的所有方法映射在props上
export default connect(mapStateToProps,action)(App);
```

没有玩过Redux的同学们可能已经看得有点晕了，Redux的设计是这样的：

 ![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9yh3mvr3gj207n05mjrm.jpg)

state就是数据，组件就是数据的呈现形式，action是动作，action是通过reducer来更新state的。

上述代码，我们干了三件事：

1.  编写一个可视化组件（其实就是个input）;
2.  将state的value属性绑定在组件的props上;
3.  将action的所有方法绑定在组件的props上。

## action和reducer两个好基友负责更新state

 actions.js

```
//定义一个change方法，将来把它绑定到props上
export function change(value){ return{
        type:"change",
        value:value
    }
}
```

reducers.js

```
//reducer就是个function,名字随便你起，功能就是在action触发后，返回一个新的state(就是个对象)
export default function change(state,action){ if(action.type=="change")return{value:action.value}; return {value:'default'};
}
```

 上述代码我们就干了一件事：用户触发action后，更新状态。

因为状态和组件的props是绑定的，所以，组件也跟着变化了！

## store出场，将reducer注入组件

index.js

```
import React from 'react' import { render } from 'react-dom' import { createStore } from 'redux' import { Provider } from 'react-redux' import App from './App' import inputApp from './reducers' let store = createStore(inputApp);

render( <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#app")
);
```

`Provider`是组件顶层，用来乘放`store`。

上述代码，我们干了三件事：

1.  将`reducer`放进`store`
2.  将`store`放进`Provider`
3.  将`Provider`放在组件顶层，并渲染

## 最后用Webpack编译运行

webpack.config.js

```js
var path = require('path'); var webpack = require('webpack');

module.exports = {
    entry: {
        app:path.join(__dirname, 'src'),
        vendors: ['react','redux']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js' },
    module: {
        loaders: [
            {
                test:/\.js?$/,
                exclude:/node_modules/,
                loader:'babel',
                query:{
                    presets:['react','es2015']
                }
            }
        ]
    },
    plugins: [ new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ]
};
```

## 好了，开始吐槽

槽点如下：

1.  概念太多，props,state,action,reducer,store,provider,就这还没引入router呢,对新手而言，无法在脑海中立马形成一个清晰的流程
2.  很多概念冗余，比如reducer和store
3.  很简单一个功能，写了这么多代码，如果用Angular一行代码都不用写
4.  看看我们为了虚拟dom的高性能以及服务器渲染，牺牲了多少，虚拟dom的设计如果被Angular引入，那么React的优点何在？
5.  看看React所谓的简单，平滑的学习曲线，在引入某种框架后，还不是照样复杂。React本身非常简单，可是又有什么用呢？我们绝大多数人，还不是得结合Backbone或者Angular或者Flux，Reflux,Redux来用。这样看来还简单吗？
6.  更新太快，如果我不列出package.json清单，几个月后你能运行这个程序吗？
7.  一个页面的HTML模板被完全碎片化了，Angular的指令虽说也有此嫌疑，但是Angular旨在”拓展html的能力“，并没有完全碎片化模板。
8.  ……

这些想法，我想对于Angular开发者来说，都是有共鸣的。

没有用过Angular的React开发者觉得react好，可能是因为他们没有用过Angular，拿React和jQuery对比得出的结论。

用过Angular的React开发者觉得React好，无非就是因为

1.  React牛逼的服务器渲染
2.  Diff算法带来的高性能。

但是，不考虑性能和SEO，单从开发效率上来讲，Angular以及mvvm的其他框架相对优秀一点！

当然这里还有适用场景的问题，因为我们研究所目前在做的是大数据平台，全是CRUD和表单，使用Angular开发会非常合适。

## 一定要看

最后，我想说这篇文章中的demo有一定的局限性。因为Redux是用来管理状态的框架，通常在大型复杂的项目中会发挥优势，而我用这样一个简单的demo来说明问题，有点以管窥豹的意思。

在大型项目中，单一数据源以及只读的state，会让你的程序的状态管理非常清晰。为什么？因为我们要更改state，只能通过action，action是我们自己定义的，我们可以预测这个action将带来怎样的改变，而且会留下痕迹，便于管理和掌控程序数据流程。

当然初学者也可以通过这篇文章来学习React+Redux。

示例代码：

[https://github.com/lewis617/react-redux-tutorial/tree/master/input-redux](https://github.com/lewis617/react-redux-tutorial/tree/master/input-redux)

运行方法：

```sh
npm install

npm run build
```
手动打开index.html