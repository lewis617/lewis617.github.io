---
title: React 与 Redux 教程（三）reduce()、filter()、map()、some()、every()、...展开属性
date: 2016-01-21 09:23:00
tags: [React, Redux]
---

reduce()、filter()、map()、some()、every()、...展开属性这些概念属于es5、es6中的语法，跟React+Redux并没有什么联系，我们直接在<https://developer.mozilla.org/en-US/> 这里可以搜索到相关api文档。

但是Redux的官方示例中包含了这些语法的用法，我们正好可以在程序中学习这些语法。这里全部默认使用es6的写法。

<!--more-->

## 例子

这是官方的todomvc的例子（<https://github.com/lewis617/react-redux-tutorial/tree/master/redux-examples/todomvc>）：

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9xtk41cryj208h04zt8o.jpg)

## reduce()

遍历数组，在每一项元素后面触发一个回调函数，经过计算返回一个累加的值。

components/MainSection.js 62行

```js 
const completedCount = todos.reduce((count, todo) =>
      todo.completed ? count + 1 : count,
      0
    )
```

`todos`是个数组，`reduce()`的第一个参数是个箭头语法，也就是个回调函数，这个回调函数的第一个参数是上一个返回值（但是这里被初始化为`0`）,第二个参数是当前元素的值。`reduce()`的第二个参数是个初始化值（不必需），初始化了上一个元素的值（这里是`count`）

遍历数组`todos`的第一个值的时候，`count`为0，`todo`是`todos`的第一项，返回值加一或者不变。（**条件 ? 结果1 : 结果2三元运算）**

遍历数组`todos`的第二个值的时候，`count`为上一个返回值，`todo`是`todos`的第二项，返回值加一或者不变。

……

遍历结束后，即可得到数组中，`completed`属性为`true`的个数，也就是已完成的任务的个数。

## filter()

遍历数组，在每一项元素后面触发一个回调函数，通过判断，保留或移除当前项，最后返回一个新数组。

顾名思义就是过滤。

reducers/todos.js 24行

```js
return state.filter(todo =>
        todo.id !== action.id
      )
```

`state`是个任务数组，`filter()`里面只有一个参数，就是个箭头函数，该函数只有一个参数是`todo`，也就是数组的每一项元素，箭头后面那个判断语句，如果返回`true`则保留当前项，反之移除当前项。

有的同学会问，`todo.id !==action.id`前为什么没有`return`，这是箭头函数的语法，箭头两端就是输入输出，不用写`return`。如果用es5的写法就是：

```js
return state.filter(function(todo) {  
　　return todo.id !== action.id  
　　}  
)
```
该代码段的作用是，过滤掉任务数组中，`id`与指定`id`相同的任务。返回一个新的任务数组。

## map()

遍历数组，在每一项元素后面触发一个回调函数，通过计算，返回一个新的当前项，最后返回一个新数组。

reducers/todos.js 29行

```js
return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, { text: action.text }) :
          todo
      )
```

箭头后面的值是个三元运算符，也就是`return`的新元素。如果`id`匹配，则通过`Object.assign()`合并一个新的属性，也就是给`todo`添加或者重写一个`text`属性，属性值为`action.text`。

`Object.assign()`第一个参数是`target`，就是目标，第二个第三个以及后面的参数都是`source`，也就是拷贝的源，是不是很像jquery插件中的`extend`？

这个代码的作用是给数组中指定的任务更新`text`属性。

## some()、every()

遍历数组，在每一项元素后面触发一个回调函数，通过判断，返回一个布尔值。`some()`是只要有一个满足判断，就返回`true`，`every()`是只要有一项不满足判断，就返回`false`。

components/MainSection.js  19 行

```js
const atLeastOneCompleted = this.props.todos.some(todo => todo.completed)
```
遍历任务数组，有一个任务的属性`completed`为`true`，就返回`true`。

reducers/todos.js 43行

```js
const areAllMarked = state.every(todo => todo.completed)
```
遍历任务数组，每一项任务的`completed`属性均为`true`时候，返回`true`。

## ...展开属性

reducers/todos.js 20行

```js
    
    
return [
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text
        }, 
        ...state
      ]
```

展开`state`数组的每一项到当前的数组

components/MainSection.js  72 行

```jsx harmony
<TodoItem key={todo.id} todo={todo} {...actions} />
```

展开`actions`的每一个属性到组件中，最后在props上可以获取到。

* * *

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/react-redux-tutorial>

目录：<http://www.liuyiqi.cn/tags/React/>



