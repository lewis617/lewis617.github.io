---
title: 使用 Jest 与 Puppeteer 来进行端对端测试
date: 2017-12-05 10:07:00
tags: [Jest, Puppeteer, 测试, 端对端测试, 黑盒测试, e2e]
---

今天我们要讲的是如何使用 Jest 与 Puppeteer 来进行端对端测试（e2e testing）。

<!--more-->

## 端对端测试 vs. 单元测试

在前面[很多文章](http://www.liuyiqi.cn/tags/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/)中，我们都介绍了单元测试。如果你了解单元测试，或者读过我之前写的单元测试的文章，那么你一定知道，单元测试的测试对象是单独的、隔离的小代码片段或者代码单元。与单元测试不同，端对端测试的测试对象则是页面上的用户交互，我们对底层实现一无所知，也就是说我们的测试是黑盒的。另外，一些跨页测试，比如链接检查，登陆跳转等功能必须使用端对端测试才能检查出来，单元测试是无法测这些功能的。以前我只写单元测试，不写端对端测试，结果有一次所负责的页面上有个链接不能点了，还好及时修复，但还是让我感受到了端对端测试，或者说是自动化端对端测试的重要性。这是我在物流服务中做的端对端测试演示：

![](https://wx2.sinaimg.cn/large/83900b4egy1fm5wgcwvylg20af0jn7wh.gif)

话不多说，让我们开始学习端对端测试吧！

> Puppeteer 默认情况下，所有操作是不可见的，如果你想像我这样监视发生的一切，需要将 Puppeteer 的 `headless` 选项设为 `false`，具体操作将会在[下篇博文](http://www.liuyiqi.cn/2017/12/05/common-puppeteer-api-collection/)中介绍。

## 使用 Puppeteer 进行浏览器自动化

我使用过很多端对端测试的轮子，比如 Selenium、Appium、Protractor、Zombie.js、Cypress、Nightmare、Puppeteer 等。但最终还是选择了 Puppeteer，因为 Selenium 和 Appium 太难用了，Protractor 则像是专门给 Angular 设计的，Zombie.js 太简单了，而且使用的浏览器内核不是市面上流行的任何一个，而是自定义的。Cypress 有平台依赖，我只是想要个本地运行的工具而已。只剩 Nightmare 和 Puppeteer 了，其实这两个都是好选择，但是我是个 star 控，Puppeteer 的 star 比 Nightmare 多，所以我选择了 Puppeteer。但事实上 Nightmare 更流行，因为我发现蚂蚁最新的那个 Antd Pro 就是用的 Nightmare，阿里一些其他端对端测试的工具也有基于 Nightmare 来做的。所以如果你想使用 Nightmare 来进行自动化端对端测试也是完全没有问题的。


使用 Puppeteer 非常简单，首先安装它：

```sh
yarn add puppeteer
# or "npm i puppeteer"
```

然后就可以在 Node 脚本中使用它了！来个简单的导航并截屏例子吧！这个例子先启动浏览器，导航到 `https://baidu.com` 页面，然后截屏并保存为 `baidu.png`，最后关闭浏览器。

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://baidu.com');
  await page.screenshot({path: 'baidu.png'});

  await browser.close();
})();
```

将上述代码写进 Node 脚本中，并运行就可以了！看下生成的截图：

![image](https://ws4.sinaimg.cn/large/83900b4egy1fm5t4ehv5pj20m80gomxw.jpg)

是不是很简单？短短几行代码就做了这么多事。如果你对 `async`、`await` 这种语法不熟悉，那么我强烈建议你去学习一下，这种语法在 Puppeteer 中使用率简直不要太高。不过也不要担心学习成本， `async`、`await` 语法非常简单，就是 Promise 的一种新写法而已，让你的异步代码看起来就像是同步的一样。

## 使用 Jest 来进行测试

要知道，Puppeteer 是一个浏览器自动化工具，它只能进行浏览器的自动化，本身并不具有测试功能。我说的测试功能指的是，断言啊，生成测试报告啊这些功能。如果你不熟悉这些概念，那么请移步：[《Jest 单元测试入门》](http://www.liuyiqi.cn/2017/02/15/start-jest/)。所以，除了 Puppeteer 外，我们还需要使用一个测试工具，我选择了 Jest，理由在[之前的博文中](http://www.liuyiqi.cn/tags/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/)已经说过很多遍了，这里不再赘述。使用 Jest 非常简单，只需要

- 安装 Jest
- 编写测试脚本 *.test.js
- 最后在终端中输入 jest 命令运行测试

具体用法看之前的博文：[《Jest 单元测试入门》](http://www.liuyiqi.cn/2017/02/15/start-jest/)。

## 将 Jest 与 Puppeteer 结合使用

讲完了 Puppeteer 和 Jest 的基本用法，我们来看一下，如何将两者结合起来使用。其实将 Jest 与 Puppeteer 结合使用非常简单，因为 Puppeteer 的本质就是个 NPM 模块而已，所以我们只需要在 Jest 测试脚本中引入它即可使用了。为何如此呢？因为测试脚本的本质其实也是 Node 脚本，既然是 Node 脚本那么当然可以直接引入 NPM 模块来用了！

> 需要注意的是，因为 Puppeteer 通常需要使用 `async`、`await` 这种语法，如果你的 Node 版本在7.6及以上，那么恭喜你，直接大胆使用，否则需要在 Jest 中配置 Babel，来使其支持这种新语法。在 Jest 中配置 Babel 非常简单，你可以在[这里](http://facebook.github.io/jest/docs/en/getting-started#using-babel)找到具体方法。

让我们来个小例子吧！首先，我们打开百度页面，并断言百度页面的 `title` 是 `百度一下，你就知道`。那么测试脚本应该这么写：

```js
const puppeteer = require('puppeteer');

test('baidu title is correct', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://baidu.com');
  const title = await page.title();
  expect(title).toBe('百度一下，你就知道');
  await browser.close();
});
```

看到 `test` 和 `expect` 两个全局函数了吗？这就是 Jest 所赋予的能力，让你可以编写测试用例和断言。最后在命令行输入 `npm test`，即 `jest`（这是在 package.json 中配置好的命令），即可看到生成的测试报告：

```sh
$ npm test

> fe-test@1.0.0 test /Users/liuyiqi/code/fe-test
> jest

 PASS  puppeteer-demo/baidu-title.test.js
 PASS  puppeteer-demo/screenshot.test.js

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        3.241s
Ran all test suites.
```

其中 `screenshot.test.js` 是截屏的那个例子，`baidu-title.test.js` 是断言百度首页 title 的例子。你可以在这里找到源码：

<https://github.com/lewis617/fe-test/tree/master/puppeteer-demo>

至此，使用 Jest 与 Puppeteer 来进行端对端测试的基本用法就讲完了。下篇博文我们将会集中讲解常用 Puppeteer 功能，比如模拟用户输入、执行 JavaScript 脚本、获取某个 DOM 节点中的文本等。

## 更多测试文章：

<http://www.liuyiqi.cn/tags/%E6%B5%8B%E8%AF%95/>