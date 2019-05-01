---
title: React+Reflux入门教程
date: 2016-01-14 03:26:00
tags: [React, Reflux]
---

为了简化React的Flux带来的冗余操作，社区的同仁们给我们带来了很多优秀的轮子，诸如Redux，Reflux等。今天我们就通过逐行讲解代码实例的方法，感受一番Reflux的设计之美。

<!--more-->

## 例子

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9yh3uabt1g2073049diu.gif)

这个例子是非常简单的todo例子，学习语言从helloworld开始，学习框架从todo开始，这是我们码农界的文化传统！

## 组件

components/todo.js

```js
import React from 'react' import Reflux from 'reflux' import ReactMixin from 'react-mixin' import store from '../stores/store' import actions from '../actions/actions' export default class Todo extends React.Component{ //组件渲染完成后，通过action获取所有的数组，刷新绑定到this.state上
 componentDidMount() {
    actions.getAll();
  }

  add(){ var item =this.refs.item.value; this.refs.item.value='';
    actions.add(item);

  }

  remove(i){
    actions.remove(i);
  }

  render() { //items用于乘放li的集合
 let items; if(this.state.list){
      items=this.state.list.map( (item,i)=> { //设置key是因为react的diff算法，是通过key来计算最小变化的
              return <li key={i}> {item.name} <button onClick={this.remove.bind(this,i)}>remove</button>
              </li>
 })
    } return ( <div>
          <input type="text" ref="item"/>
          <button onClick={this.add.bind(this)}>add</button>
          <ul> {items} </ul>
        </div>
 )
  }
} // ES6 mixin写法，通过mixin将store的与组件连接，功能是监听store带来的state变化并刷新到this.state
ReactMixin.onClass(Todo, Reflux.connect(store));
```

上述代码，我们干了3件事：

1.  渲染了一个组件，这个组件包括一个`input`，一个add按钮，一个列表，列表每项包含名称和remove按钮
2.  给这个组件添加了几个方法，其中`componentDidMount()`在组件渲染完成后触发，`componentDidMount()`、`add()`和`remove()`方法分别调用actions的方法去更新状态
3.  最后一行代码，使用es6的mixin写法，使得组件监听store带来的state变化，并刷新界面。

看到这里，很多没有接触过Reflux的同学可能已经晕了，我来图解下Reflux的功能流程吧！

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9yh3l0f47j206u05xjrl.jpg)

组件就是用户界面，actions就是组件的动作，store用于执行actions的命令，并返回一个state对象给组件。组件通过state来更新界面。

这里我想说说React和Angular的某个相同之处，就是将数据和界面绑定起来，通过操作数据来更新界面（不用苦逼的操作dom了）。我们把数据和界面的规则建好后，更新数据，界面自动就变化了。在这里，数据指的是`this.state`，界面指的是组件。

那么为何要用actions和store这么多层去更新state呢？为了以后项目业务逻辑变复杂后便于管理。为什么便于管理，因为actions有很多钩子，钩子就是“触发之前，触发之后的回调什么的”，这些钩子我们以后会用得上。

## actions和store两个好基友开始更新状态

actions/actions.js

```js
import Reflux from 'reflux' export default Reflux.createActions(['getAll','add','remove']);
```

stores/store.js

```
import Reflux from 'reflux' import actions from '../actions/actions'

//给数组添加remove方法，用于去除指定下标的元素
Array.prototype.remove=function(dx)
{ if(isNaN(dx)||dx>this.length){return false;} for(var i=0,n=0;i<this.length;i++)
    { if(this[i]!=this[dx])
        { this[n++]=this[i]
        }
    } this.length-=1 };

export default Reflux.createStore({
    items:[], //监听所有的actions
 listenables: [actions], //on开头的都是action触发后的回调函数
 onGetAll () { //更新状态（就是个对象）
        this.trigger({list:this.items});
    },
    onAdd(item){ this.items.push({name:item}); this.trigger({list:this.items});
    },
    onRemove(i){ this.items.remove(i); this.trigger({list:this.items});
    }
});
```

上述代码，我们干了3件事：

1.  给数组对象的原型添加一个remove的方法，用于删除指定下标的元素
2.  创建一个store，监听actions的方法
3.  在store里，on开头的都是actions对应的回调函数，this.trigger()，负责更新state（这里指的是{list:this.items}这个对象）

## 渲染组件

index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Todo from './components/todo';

ReactDOM.render( <Todo>
  </Todo>,
  document.querySelector('#app')
);
```

## 最后，用webpack编译

webpack.config.js

```js
var path = require('path'); var webpack = require('webpack');

module.exports = {
    entry: {
        app:path.join(__dirname, 'src'),
        vendors: ['react','reflux','react-mixin']
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

## 总结

相比较Redux而言，

1.  Reflux没有reducer的概念，取而代之，和action做基友的是store
2.  Reflux没有把状态的一部分值绑定在组件的props上，而是将状态绑定在组件的state上，我们来看react dev tool的截图![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9yh3lm0fgj203z047748.jpg)
3.  Reflux可以直接调用action的方法，而Redux必须将方法绑定在组件的props上，或者使用props的dispatch方法来执行actions的方法
4.  ……

由此看来，Reflux好理解的多，但是Redux的单一state是实际项目中是非常好用的，所以，Redux在Github上的星星比Reflux多得多！两个都是社区同仁智慧的结晶，都是优秀的值得学习的轮子！

源代码：

[https://github.com/lewis617/react-redux-tutorial/tree/master/todo-reflux](https://github.com/lewis617/react-redux-tutorial/tree/master/todo-reflux)

运行方法：

```sh
npm install

npm run build
```
手动打开index.html

* * *

# 教程示例代码及目录

[https://github.com/lewis617/react-redux-tutorial](https://github.com/lewis617/react-redux-tutorial)