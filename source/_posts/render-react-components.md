---
title: 使用 render-react-components 来单独渲染每个 React 组件
date: 2018-04-13 17:56:00
tags: [React, render-react-components, 测试, 单元测试]
---

今天，我们要讲的是如何使用 render-react-components 来单独渲染每个 React 组件。

<!--more-->

## 为何要单独渲染每个 React 组件？

我之前参与了一位阿里前端专家架构的项目，这个项目的技术栈是 Angular1 ，经过几天的开发，我发现这是我来阿里后参与的开发体验最好的几个前端项目之一了。为何这么说呢？主要原因是这个项目使用了 Angular1 的指令（Angular1 的指令就是 Angular2 的组件，也等同于 React 的组件）将页面组件化，并且为每个单独的指令创建了一个 demo 页面，可以单独渲染展示每个指令。相当于一个复杂的项目被分为很多小项目，每个小项目都可以独立调试，这样的开发体验太好了！不仅如此，这么做还有很多好处：

- 每个组件的 demo 页面也可以成为该组件的文档，方便别的前端同学快速掌握每个组件是干嘛的，这比在混杂在项目中清晰多了。
- 每个组件按道理都应该写单元测试的，如果我们能单独渲染每个 React 组件，相当于给每个组件进行了一次“看得见摸得着”的单元测试。
- 如果你喜欢写端对端测试，那么你可以对每个组件的 demo 页面进行完全模拟用户的端对端测试。
- 假如你编写的组件的父组件还没写出来，放到过去，你完全没招，只能等待，但现在每个组件都是可以单独开发调试的，再也不用受制于人，受制于环境了。
- 假如的项目特别庞大，运行一次，需要编译很久，那么你还可以使用 demo 页面来提升你的开发效率。
- 假如你的组件有很多种环境，但在项目中，只能模拟有限的环境，那么你可以在 demo 页面里自由的模拟各种环境，进行各种逻辑的开发。
- ……

既然有这么多好处，然后我就想，在 React 项目中能不能也将项目中的每个小组件，单独渲染出来呢？答案是可以的，不过稍微麻烦一点，因为 React 组件不像 Angular1 那样可以直接在浏览器里面运行，需要编译一下，所以我就开发了一个名为 render-react-components 的命令行工具，帮我做这件事。

## render-react-components 是什么？

render-react-components（简称 rrc） 是一个命令行工具，可以递归找出当前项目中所有的 React 组件（仅限于 src 目录下的所有组件），并为它们创建相互隔离的 demo 页面。

## 快速开始

使用 rrc 非常简单，只需要：

```bash
## 本地或者全局安装
$ npm i render-react-components -g

## 为项目中所有的 React 组件，创建 demo 页面
$ rrc init

## 如果你只想给部分组件创建 demo 页面，可以使用 filter 参数，输入组件路径的关键词即可
$ rrc init --filter=Component1
## 或者简写
$ rrc init -f=Component1

## 本地开发，支持代码热加载
$ rrc dev

## 删除了 rrc init 创建的所有文件
$ rrc clean
```

以下动图，演示了如何使用这个工具，先后做了这几件事：

- 运行 `find . -name *.js` （`find` 命令和本工具无关，只是为了对比展示文件的变化）列出原始项目中的 js。
- 运行 `rrc init`，为项目中所有的 React 组件创建 demo 页面。再次运行 `find . -name *.js` 发现多了一些文件，不过放心，这只是一些 js、html 文件，不会给你添加多余的依赖，非常干净、非常隔离。
- 运行 `rrc dev` ，自动弹出一个页面，我们发现每个组件都可以展示了。并且，修改代码，页面会自动更新，非常方便。

![](https://img.alicdn.com/tfs/TB1VPzQnHGYBuNjy0FoXXciBFXa-894-444.gif)

## 修改组件的 demo 页面

每个 React 组件的 props 都不同，需要我们单独编写。如果你想修改某个组件的 props ，只需要去项目根目录的 rrc 文件夹中找到组件对应的 demo 页面的入口文件即可。那么组件的对应的入口文件如何寻找呢？非常简单明了：

- 假如一个组件的路径是 src/Component1.js，那么这个组件的入口文件的路径就是：rrc/Component1.js。
- 假如一个组件的路径是 src/Component2/index.js，那么这个组件的入口文件的路径就是：rrc/Component2.js。
- 假如一个组件的路径是 src/Component2/Component3/index.js，那么这个组件的入口文件的路径就是：rrc/Component2_Component3.js。

## 修改渲染组件的 webpack 配置

虽然在大多数情况下，你都不用操心 webpack 配置，但如果你实在想修改渲染组件的 webpack 配置，那么你可以直接在根目录下的 `.rrc.js` 中修改，具体配置可以在[这里](https://github.com/lewis617/render-react-components/blob/master/README_zh-cn.md#%E9%85%8D%E7%BD%AE)参考。

## 真实小例子

上面动图中真实小例子可以在[这里](https://github.com/lewis617/render-react-components/tree/master/examples/dead-simple)找到。

本工具的 Github 地址： <https://github.com/lewis617/render-react-components>，欢迎 star、提 issue 和 pull request。