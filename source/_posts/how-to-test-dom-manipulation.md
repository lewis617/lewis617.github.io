---
title: 如何测试 DOM 操作类的 JS 代码
date: 2017-11-09 11:05:00
tags: [DOM, 单元测试, 测试]
---

前几天写了一篇博客：[《使用 JavaScript 批量获取微博评论》](http://www.liuyiqi.cn/2017/11/03/use-js-to-get-weibo-comments/)。今天我们来学习如何测试我们之前编写的代码。从本质上来说，我们今天要学习的是如何测试 DOM 操作类的 JS 代码。你可以在这里获取测试代码：

<https://github.com/lewis617/practical-js/blob/master/src/weiboBackup.test.js>

<!--more-->

## 选择测试框架

我使用过很多测试框架，比如 Karma、Mocha、Jest 等，但因为对 Facebook 开源项目的偏爱，我选择了 Jest 来测试，事实证明，Jest 确实最为简单，无需进行繁琐的浏览器环境模拟，就可以直接使用浏览器环境的各种 API，让我们一睹为快！不过先安装 Jest：

```sh
yarn add --dev jest
```


## 处理被测试文件

被测试文件原来是这样的：

weiboBackup.js

```js
/**
 * 获取微博以及评论文字
 * 先打开微博页面，
 * 然后将下面的js拷贝到浏览器的console面板中
 */

var nodeArray = Array.from(document.querySelectorAll('.list_con .WB_text'));

var textArray = nodeArray.map(function (node) {
  return Array.from(node.childNodes).map(function (childNode) {
    var value;
    // 文字的情况
    if (childNode.nodeName === '#text') value = childNode.nodeValue;
    // 图片表情的情况
    else if (childNode.nodeName === 'IMG') value = childNode.alt;
    // 链接的情况
    else if (childNode.nodeName === 'A') value = childNode.lastChild.nodeValue;
    return value.replace(/(\s+$)|(^\s+)/g, '');
  }).join('');
});

console.log(textArray.join('\n'));
```

为了方便测试，我们在底部添加一行代码，将其导出，方便测试。另外，为了让测试报告更纯净，我们把 console 注释掉：

```js
// console.log(textArray.join('\n'));

// 本行代码用于单元测试，请不要拷贝到浏览器的console中运行
module.exports = textArray;
```

## 编写测试文件

前面说了 Jest 自带浏览器模拟环境，无需手动配置。所以我们直接添加用于测试的 html 即可：

> 这段 html 字符串相当于模拟数据，即假数据。在这里，相当于模拟一个微博评论。模拟数据你可以随意编写，但是通常需要和真实数据保持结构和规律上的一致，而且需要覆盖所有的情况，这样才能测试到所有的边界。

weiboBackup.test.js

```js
document.body.innerHTML = '\
  <div class="list_con">\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2809324184" usercard="id=2809324184">Geo橙子</a>：在过一阵子是不是要翻成英文，走出国门了\
    </div>\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2497287343" usercard="id=2497287343">dev_zk</a>\
      <a target="_blank" suda-data="key=pc_apply_entry&amp;value=feed_icon" href="http://club.weibo.com/intro">\
        <i title="微博达人" class="W_icon icon_club" node-type="daren"></i>\
      </a>\
      ：现在好了\
      <img render="ext" src="//img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_org.gif" title="[太开心]" alt="[太开心]" type="face">\
      <img render="ext" src="//img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_org.gif" title="[太开心]" alt="[太开心]" type="face">\
    </div>\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2497287343" usercard="id=2497287343">dev_zk</a>\
      <a target="_blank" suda-data="key=pc_apply_entry&amp;value=feed_icon" href="http://club.weibo.com/intro">\
      <i title="微博达人" class="W_icon icon_club" node-type="daren"></i>\
      </a>\
      ：哈哈\
    </div>\
  </div>';
```

然后直接调用被测试文件 weiboBackup.js，相当于运行了它：

```js
var textArray = require('./weiboBackup');
```

现在评论文本已经被保存到数组 `textArray` 中了，然后我们直接编写断言即可：

```js
expect(textArray).toEqual([
    "Geo橙子：在过一阵子是不是要翻成英文，走出国门了",
    "dev_zk：现在好了[太开心][太开心]",
    "dev_zk：哈哈",
  ]);
```

> 关于断言等测试的基础知识，如果你不了解，请看我之前写的 [《Jest 单元测试入门》](http://www.liuyiqi.cn/2017/02/15/start-jest/)。

最后我们将上述代码包在 `test` 函数中，这个函数用于打包一个测试用例，并附带测试用例说明：

```js
test('getweiboBackup', () => {
  document.body.innerHTML = '\
  <div class="list_con">\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2809324184" usercard="id=2809324184">Geo橙子</a>：在过一阵子是不是要翻成英文，走出国门了\
    </div>\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2497287343" usercard="id=2497287343">dev_zk</a>\
      <a target="_blank" suda-data="key=pc_apply_entry&amp;value=feed_icon" href="http://club.weibo.com/intro">\
        <i title="微博达人" class="W_icon icon_club" node-type="daren"></i>\
      </a>\
      ：现在好了\
      <img render="ext" src="//img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_org.gif" title="[太开心]" alt="[太开心]" type="face">\
      <img render="ext" src="//img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_org.gif" title="[太开心]" alt="[太开心]" type="face">\
    </div>\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2497287343" usercard="id=2497287343">dev_zk</a>\
      <a target="_blank" suda-data="key=pc_apply_entry&amp;value=feed_icon" href="http://club.weibo.com/intro">\
      <i title="微博达人" class="W_icon icon_club" node-type="daren"></i>\
      </a>\
      ：哈哈\
    </div>\
  </div>';
  var textArray = require('./weiboBackup');
  expect(textArray).toEqual([
    "Geo橙子：在过一阵子是不是要翻成英文，走出国门了",
    "dev_zk：现在好了[太开心][太开心]",
    "dev_zk：哈哈",
  ]);
});
```
## 运行测试

测试文件写好了，我们需要运行它，首先在 package.json 中添加：

```json
"scripts": {
  "test": "jest"
}
```

然后在命令行中运行：

```sh
npm test
```

最后就会看测试报告了：

```sh
 PASS  ./weiboBackup.test.js
  ✓ getweiboBackup (27ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.907s, estimated 1s
```

尝试改变 html 中的测试文本，或断言中的预期文本，看看预期与结果不一致的情况。比如，将断言改为：

```js
expect(textArray).toEqual([]);
```

结果测试报告变为这样：

```sh
 FAIL  ./weiboBackup.test.js
  ✕ getweiboBackup (310ms)

  ● getweiboBackup

    expect(received).toEqual(expected)

    Expected value to equal:
      []
    Received:
      ["Geo橙子：在过一阵子是不是要翻成英文，走出国门了", "dev_zk：现在好了[太开心][太开心]", "dev_zk：哈哈"]

    Difference:

    - Expected
    + Received

    - Array []
    + Array [
    +   "Geo橙子：在过一阵子是不是要翻成英文，走出国门了",
    +   "dev_zk：现在好了[太开心][太开心]",
    +   "dev_zk：哈哈",
    + ]

      at Object.<anonymous>.test (weiboBackup.test.js:25:21)
          at new Promise (<anonymous>)
          at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:188:7)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.897s, estimated 1s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

## 总结

编写测试还是很重要的，可以保证你的代码质量，而你的代码质量关系到你的 KPI，所以我建议大家还是养成编写测试的好习惯。