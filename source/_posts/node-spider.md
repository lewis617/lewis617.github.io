---
title: 使用 superagent+cheerio 写爬虫
date: 2017-04-24 19:57:00
tags: [practical-js, Node, 爬虫, superagent, cheerio, 字符编码, 正则表达式]
---
本文将会讲解如何使用 superagent+cheerio 写爬虫。阅读本文，你会学习到这些知识点：

- 如何使用 superagent 获取页面内容
- 如何使用 superagent 获取 JS 文件的内容
- 如何使用 superagent 下载文件
- 如何使用 cheerio 操作页面 DOM
- 如何正确设置字符编码来避免乱码
- 如何使用正则表达式去除字符串中的多余信息

<!--more-->

## 使用 superagent 获取页面内容

superagent+cheerio 是 Node 爬虫的经典组合。superagent 是一个发起 Ajax 请求的工具。我们使用它来请求各种网络资源。比如，我们想批量爬取一些文件，我们就必须先找到文件的 URl，想找到 URL 就必须先获取记录这些 URL 的页面，想获取页面内容，那么首先就应该使用 superagent 把页面给请求下来。基本的请求代码如下：

```js
 request
   .get('http://example.com/search')
   .end(function(err, res){
	   // 将会打印页面的 HTML 字符串
       console.log(res.text);
   });
```

拿到了 HTMl 字符串，就可以使用 cheerio 进行解析了。关于 cheerio 我们等会介绍～ 

## 使用 superagent 获取 JS 文件的内容

使用 superagent 获取页面内容非常简单，但是当我请求完页面后发现，音频和字幕的 URL 不在页面上，而是通过 JS 动态渲染到页面上的，我的爬虫无法和 JS 通信，这该怎么办呢？其实非常简单，既然 URL 信息在 JS 文件中，那么我们直接获取 JS 文件，并使用 eval 方法解析不就行了？所以，我们来使用 superagent 获取 JS 文件的内容。与获取页面内容的方法不同，获取 JS 文件，需要加个 `.buffer(true)` ：

```js
request.get('https://raw.githubusercontent.com/sindresorhus/negative-zero/master/index.js')
    .buffer(true)
    .end(function (err, res) {
      ...
    }
```

为何要如此？具体原因可以看这个 Issue：

 https://github.com/visionmedia/superagent/issues/523

## 使用 superagent 下载文件

前面两节介绍了使用 superagent 获取页面和 JS 文件，那么如何使用 superagent 下载保存文件到硬盘上呢？这里需要配合使用 Node 的 `fs.createWriteStream` 方法，代码如下：

```js
function download(url, localPath, cb) {
    var stream = fs.createWriteStream(localPath);
    stream.on('finish', function () {
        console.log('The download of ' + localPath + ' is complete!');
        cb();
    });
    request.get(url).pipe(stream);
}
```

非常简单，不再赘述！

## 使用 cheerio 操作页面 DOM

在第一节，我们介绍了使用 superagent 获取页面内容，但是页面内容太多，我们想高效提取有用信息，该如何做呢？在浏览器中，我们通常使用 jQuery 来高效操作 DOM，在 Node 爬虫中，我们可以使用 cheerio 来模拟 jQuery 的操作方法。cheerio 的基本用法如下：

```js
var cheerio = require('cheerio')
var $ = cheerio.load('<h2 class="title">Hello world</h2>')

$('h2.title').text('Hello there!')
$('h2').addClass('welcome')

return $.html()
//=> <h2 class="title welcome">Hello there!</h2>
```

通过 superagent 获取 html 字符串，然后使用 cheerio 解析，页面上的内容就尽在你的掌握中了！

更多 cheerio 的用法可以参考：

https://github.com/cheeriojs/cheerio


## 正确设置字符编码来避免乱码

在获取页面内容，并提取里面的中文信息时，偶尔会遇到中文乱码。这是因为页面的 chartset 设置了`gb2312` 的原因，那么想要正确解析设置 `gb2312` 编码的页面，就必须使用这个编码来解析。值得高兴的是，superagent 为我们提供了相关的插件来实现：

https://github.com/magicdawn/superagent-charset

基本用法如下：

```js
request.get(mainOrigin + mainPathname)
    .charset('gb2312')
    .end(function (err, res) {
    ...
  })
```
如何知道 `.charset()` 中填的是什么编码呢？你只需要看看页面的这行代码即可：

```html
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
```

## 使用正则表达式去除字符串中的多余信息

最后，我们来讲一下如何使用使用正则表达式去除字符串中的多余信息。在下载文件时，可能需要处理一些中文名称作为将来的文件名或目录名。页面中的中文名称往往不是我们想要的，那么如何处理名称中的多余信息呢？使用正则表达式就可以做到！比如：

如果你想将 `'听电影学英语之海上钢琴师'`变为`'海上钢琴师'`，那么你可以这么做：

```js
// str 就是'海上钢琴师'
var str = '听电影学英语之海上钢琴师'.replace(/听电影学英语之/g, '');
```

如果你想将 `'听电影MP3学英语之海上钢琴师'` 或 `'听电影学英语之海上钢琴师'`变为`'海上钢琴师'`，那么你可以这么做：

```js
// str 就是'海上钢琴师'
var str = '听电影学英语之海上钢琴师'.replace(/听电影(MP3)?学英语之/g, '');
```
> 注：小括号代表子表达式，问号代表前面的字符出现 0 或 1 次。

如果你想将以下字符串：

- `'听电影学英语之海上钢琴师'`
- `'听电影MP3学英语之海上钢琴师'`
- `'听电影MP3学英语之海上钢琴师中英双语MP3+LRC'`
- `'听电影MP3学英语之海上钢琴师 中英双语MP3+LRC'`
- `'听电影MP3学英语之海上钢琴师 中英双语MP3+LRC+文本'`
- `'听电影MP3学英语之海上钢琴师 中英双语MP3+LRC+文本 '`

都变为 `'海上钢琴师'`，那么正则表达式应该这么写：

```js
/(听电影(MP3)?学英语之)|(\s?中英双语MP3\+LRC(\+文本)?)|(\s?$)/g
```

把各种情况都考虑进去，然后用 `|` 隔开。其中，`\s` 匹配任何空白字符，包括空格、制表符、换页符等等。

## 总结

上面介绍了 superagent+cheerio 写爬虫需要用到的各种技术，本文不打算对业务进行过多叙述。只要掌握了上述方法，就可以轻松读懂爬虫代码，如果你没写过爬虫，就赶快试试吧！

## 教程示例代码及目录

<https://github.com/lewis617/practical-js>