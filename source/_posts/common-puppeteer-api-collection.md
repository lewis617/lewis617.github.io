---
title: 端对端测试中常用的 Puppeteer 操作总结
date: 2017-12-05 14:51:00
tags: [Puppeteer, 测试, 端对端测试, e2e]
---

上篇博客我们讲解了[《使用 Jest 与 Puppeteer 来进行端对端测试》](http://www.liuyiqi.cn/2017/12/05/e2e-testing-with-jest-and-puppeteer/)，但内容偏向于“快速开始”这种风格，并不涉及一些具体的、实用的操作，所以本篇博客将会补充这一点，即，总结一下端对端测试中常用的 Puppeteer 操作，比如模拟用户输入、执行 JavaScript 脚本、获取某个 DOM 节点中的文本等。

<!--more-->

## 让所有操作可见

还记得上篇博客中的端对端测试的动图演示吗？

![](https://wx2.sinaimg.cn/large/83900b4egy1fm5wgcwvylg20af0jn7wh.gif)

想实现这个效果，就需要将 Puppeteer 的 `headless` 选项设为 `false`，并将 `slowMo` 设为 20-100 中的某个值，前者使得所有浏览器自动化操作可见，后者控制了动作之间的间隔，使其变慢，从而通过人眼可以看清每步操作。示例代码：

```js
browser = await puppeteer.launch({
    headless: false,
    slowMo: 20
  });
```

## 导航到某个页面

这个操作太常用了！第一步是启动浏览器，那么第二步就是导航到某个页面，代码示例：

```js
page = await browser.newPage();
await page.goto('https://baidu.com');
```

上述代码会开启一个新页面，并将其导航到 `https://baidu.com`。

## 等待某个 DOM 节点出现

在进行某些页面操作前，我们必须要等待指定的 DOM 加载完成后才能操作，比如，一个 Input 没有加载出来时，你是无法在里面输入字符的等等。在 Puppeteer 中，你可以使用 `page.waitForSelector` 和选择器来等待某个 DOM 节点出现：

```js
await page.waitForSelector('#loginForm');
```

上述代码会等待 ID 为 `loginForm` 的节点出现。

## 等待几毫秒

有时候，你找不到某个特定的时刻，只能通过时间间隔来确定，那么此时你可以使用 `page.waitFor(number)` 来实现：

```js
await page.waitFor(500);
```

上述代码会等待 500 毫秒。

## 等待某个 JavaScript 函数返回 true

有时候，你需要等待某个复杂的时刻，这个时刻只能通过一些复杂的 JavaScript 函数来判断，那么此时你可以使用 `page.waitFor(Function)` 来实现：

```js
await page.waitFor(() => !document.querySelector('.ant-spin.ant-spin-spinning'));
```

上述代码会等待 Antd 中的旋转图标消失。

## 向某个 Input 中输入字符

为了模拟用户登陆或仅仅就是输入某个表单，我们经常会向某个 Input 中输入字符，那么我们可以使用这个方法：

```js
await page.type('#username', 'lewis');
```

上述代码向 ID 为 `username` 的 Input 中输入了 `lewis`。值得一提的是，该方法还会触发 Input 的 `keydown`、`keypress`, 和 `keyup` 事件，所以如果你有该事件的相关功能，也会被测试到哦，是不是很强大？

## 点击某个节点

在 Puppeteer 中模拟点击某个节点，非常简单，只需要：

```js
await page.click('#btn-submit');
```

上述代码点击了 ID 为 `btn-submit` 的节点。

## 在浏览器中执行一段 JavaScript 代码

有时候我们需要在浏览器中执行一段 JavaScript 代码，此时你可以这样写：

```js
page.evaluate(() => alert('1'));
```

上述代码会在浏览器执行 `alert('1')`。

## 获取某一个节点的某个属性

有时候我们需要获取某个 Input 的 `value`，某个链接的 `href`，某个节点的文本 `textContent`，或者 `outerHTML`，那么你可以使用这个方法：

```js
const searchValue = await page.$eval('#search', el => el.value);
const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
const text = await page.$eval('.text', el => el.textContent);
const html = await page.$eval('.main-container', e => e.outerHTML);
```

## 获取某一类节点的某个属性集合

有时候我们需要获取某一类节点的某个属性集合，那么你可以这么写：

```js
const textArray = await page.$$eval('.text', els => Array.from(els).map(el => el.textContent));
```

上述代码将页面中所有类为 `text` 的节点中的文本拼装为数组放到了 `textArray` 中。


以上就是 Puppeteer 的一些常用操作，当然仅仅掌握这些是不够的，更多的操作请参考 Puppeteer 的 API 文档：

<https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md>

## 综合应用小例子

单个操作讲了这么多，我们来进行一次综合应用吧！我们依次让浏览器进行以下自动化操作：

- 打开百度首页
- 输入`刘一奇的个人博客`
- 点击搜索按钮
- 点击第一个搜索项
- 进入`刘一奇的个人博客`
- 断言新页面的 `logo` 为`刘一奇的个人博客`
- 断言新页面的导航栏包括：`主页,归档,关于我` 三项

示例代码： 

<https://github.com/lewis617/fe-test/blob/master/puppeteer-demo/liuyiqi-blog.test.js>

```js
const puppeteer = require('puppeteer');

let browser, page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80
  });
  page = await browser.newPage();
});

afterAll(() => {
  browser.close();
});

test('open baidu page', async () => {
  await page.goto('https://baidu.com');
});

test('search liuiqi\'s blog', async () => {
  await page.waitForSelector('#kw');
  await page.type('#kw', '刘一奇的个人博客');
  await page.click('#su');
});

test('goto liuyiqi\'s blog', async () => {
  await page.waitForSelector('h3.t > a');
  await page.click('h3.t:nth-of-type(1) > a');

  const pages = await browser.pages();
  page = pages.pop();
  await page.bringToFront();
});

test('expect logo is 刘一奇的个人博客', async () => {
  await page.waitForSelector('#logo');
  const text = await page.$eval('#logo', el => el.textContent)
  expect(text).toBe('刘一奇的个人博客');
});

test('expect main-nav-link is 主页,归档,关于我', async () => {
  const textArray = await page.$$eval('.main-nav-link', els => Array.from(els).map(el => el.textContent));
  expect(textArray).toEqual(['主页', '归档', '关于我']);
});
```

效果图：

![](https://wx1.sinaimg.cn/large/83900b4egy1fm5zpm2qleg20o10jnqn5.gif)

至此，端对端测试中常用的 Puppeteer 操作总结就讲完了。有更多操作请查阅官网文档，或给我发邮件，或在本文下方评论。

## 更多测试文章：

<http://www.liuyiqi.cn/tags/%E6%B5%8B%E8%AF%95/>