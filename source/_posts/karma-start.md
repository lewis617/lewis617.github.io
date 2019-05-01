---
title: karma单元测试入门
date: 2015-10-12 14:07:00
tags: [Karma, 单元测试, 测试]
---

学习Angularjs，都会遇到Karma单元测试，可是初学者面对复杂的测试配置往往不知从何入手，下面我们将抛开Angularjs，单独使用两个js文件，完成一次测试入门。

<!--more-->

## 0，Karma原理

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3oak07j20is08sjs6.jpg)

## 1，文件目录

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9yh3ojd3vj204002qdfs.jpg)

两个js文件，一个package.json

## 2，生成步骤

（1）生成package.json，在文件夹下运行

```sh
npm init
```

（2）安装karma依赖，在文件夹下运行

```sh
npm install karma karma-jasmine karma-chrome-launcher --save-dev
```

局部安装 karma karma-jasmine karma-chrome-launcher ，并保存到package.json中。这三个包缺一不可，

有些同学，是全局安装karma，那么请把karma-jasmine karma-chrome-launcher 也全局安装，否则会出现no provider jasmine的bug。至少在ubuntu 中是如此。

全局安装命令

```sh
npm install -g karma karma-jasmine karma-chrome-launcher 
```

（3）配置karma，在文件夹下运行

```sh
 karma init karma.conf.js
```

![](https://ws4.sinaimg.cn/mw690/83900b4egw1f9yh3slsiaj20nd0fpn2o.jpg)

（4），编写demo.js

```js
describe('A spec suite', function() {
    it('contains a passing spec', function() {
        expect(true).toBe(true);
    });
});
```

describe负责打包it()，测试时候会在console中打印'A spec suite'，没别的作用;

it()负责单个测试，测试时候会在console中打印'contains a passing spec'，没别的作用;

expect(a).tobe(b)负责测试a是否等于b，测试时候会在console中打印对错;

还有很多其他的函数，将来再学，个人不建议初学者一口吃个大胖子。

## 3，运行测试

在根目录下运行

```sh
karma start karma.conf.js
```

效果：

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3rxlt3j20mf0dltan.jpg)

## 更多测试文章：

<http://www.liuyiqi.cn/tags/%E6%B5%8B%E8%AF%95/>
