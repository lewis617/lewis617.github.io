---
title: JavaScript 基础：偏移宽高距离、滚动宽高距离、可视宽高
date: 2019-06-02 19:26:00
tags: [JavaScript 基础, 偏移宽高距离, 滚动宽高距离, 可视宽高]
---

今天，我们要讲的是偏移宽高距离、滚动宽高距离、可视宽高的含义。大概有这些属性：

```
scrollTop
offsetTop
scrollLeft
offsetLeft
clientWidth
clientHeight
offsetWidth
offsetHeight
scrollWidth
scrollHeight
```



<!--more-->

## 各个属性的含义

```
页可见区域宽： document.body.clientWidth;
网页可见区域高： document.body.clientHeight;
网页可见区域宽： document.body.offsetWidth (包括边线的宽);
网页可见区域高： document.body.offsetHeight (包括边线的宽);
网页正文全文宽： document.body.scrollWidth;
网页正文全文高： document.body.scrollHeight;
网页被卷去的高： document.body.scrollTop;
网页被卷去的左： document.body.scrollLeft;
浏览器距离屏幕上： window.screenTop;
浏览器距离屏幕左： window.screenLeft;
屏幕分辨率的高： window.screen.height;
屏幕分辨率的宽： window.screen.width;
屏幕可用工作区高度： window.screen.availHeight;
```

![image](https://user-images.githubusercontent.com/11524612/58760464-bc148600-856a-11e9-8fa5-2ac325219691.png)


## 信息提取与总结

- **对于 height，width 而言**，client（可见区域） < offset（多个边框） < scroll（多个滚动区域）
- **对于 top，left 而言**，offset 指的是相对于第一个 position 不为 static 的父元素（没有就是 document）的偏移距离，scroll 则是被卷去的长度。
- **对于 screen 而言**，说的是屏幕的距离和宽高。

## 面试题：实现图片懒加载

思路：

```
初始化状态：图片使用默认图片地址；

当图片进入可见区域（图片的 offsetTop < 整个文档的 clientHeight + scrollTop）：图片加载真实地址；
```

代码：

```js
var num = document.getElementsByTagName('img').length;
var img = document.getElementsByTagName("img");
var n = 0; //存储图片加载到的位置，避免每次都从第一张图片开始遍历

lazyload(); //页面载入完毕加载可是区域内的图片

window.onscroll = lazyload;

function lazyload() { //监听页面滚动事件
    var seeHeight = document.documentElement.clientHeight; //可见区域高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
    for (var i = n; i < num; i++) {
        if (img[i].offsetTop < seeHeight + scrollTop) {
            if (img[i].getAttribute("src") == "default.jpg") {
                img[i].src = img[i].getAttribute("data-src");
            }
            n = i + 1;
        }
    }
}
```