---
title: RequireJs调研
date: 2015-09-26 11:02:00
tags: [RequireJs]
---

# 背景

## Problem（问题）

*   Web sites are turning into Web apps（网站正转变为网络应用程序）
*   Code complexity grows as the site gets bigger（代码复杂度随着站点变大而变复杂）
*   Assembly gets harder（组装变得更难【ps】这里我个人认为“组装”是拼接单个js文件中的昂多的代码段 ）
*   Developer wants discrete JS files/modules（开发者想分离js文件/模块）
*   Deployment wants optimized code in just one or a few HTTP calls（网站部署者想通过使用一个或者很少http请求来优化代码）

## Solution（解决方案） 

*   Front-end developers need a solution with:（前端工程师需要一个解决方案，拥有这些功能：）
*   Some sort of #include/import/require（一些引入文件的命令语句）
*   ability to load nested dependencies（加载嵌套的依赖文件）
*   ease of use for developer but then backed by an optimization tool that helps deployment（简单好用，但也有助于优化部署） 

<!--more-->

# RequireJs简介

## 作用 

RequireJS的目标是鼓励代码的模块化，它使用了不同于传统script标签的脚本加载步骤。可以用它来加速、优化代码，但其主要目的还是为了代码的模块化。它鼓励在使用脚本时以module ID替代URL地址。

## 优点 

### 速度快

![15085801_CrX1](http://images.cnitblog.com/blog/139239/201408/131435005307505.png "15085801_CrX1")

[有位网友做了对比测试](http://www.cnblogs.com/powertoolsteam/p/RequireJS_wijmo.html)

### 依赖关系清晰

![JavaScript 文件之间的依赖项表示。](http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/html5/articles/javascript-architecture-requirejs-dependency-management/fig01.png "JavaScript 文件之间的依赖项表示。")

requirejs通过a.js调用b.js,b.js调用c.js,c.js调用d.js的原理，让我们可以只调用a.js，就可以加载所有的js,而且依赖关系非常清晰。  

js文件不仅可以调用js，还能调用css和html页面，所以毫不夸张地说，引入一个入口js，无需向 HTML 文件添加任何其他元素即可构建大型单页面应用程序

### 鼓励代码模块化（最大优点）

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3r2e1xj209907zjrt.jpg)

使用requirejs，我们就需要将原来在一个js文件里面写的代码，按照模块解耦分离成多个js文件，然后按照需求调用。这样做的好处很多：

解耦了，就不会出现牵一发动全身的情况，便于日后维护；还能便于多人分工合作；还能复用...

# 在项目中使用RequireJs

## 调用第三方插件

### 使用多选插件

```js
 require(['jquery.shiftcheckbox'], function () {
            $(function () {
                $('#demo2 :checkbox').shiftcheckbox();
            })
        })
```

### 使用'bootstrap', 'jquery.form', 'jquery.validate'三个插件

```js
require(['bootstrap', 'jquery.form', 'jquery.validate'], function () {
    $(function () {
        jQuery.validator.addMethod("isZipCode", function (value, element) { var tel = /^[0-9]{6}$/; return this.optional(element) || (tel.test(value));
        }, "请正确填写您的邮政编码");
        $("#signupForm").validate({
            rules: {
                firstname: {
                    required: true },
                email: {
                    required: true,
                    email: true },
                password: {
                    required: true,
                    minlength: 5 },
                confirm_password: {
                    required: true,
                    minlength: 5,
                    equalTo: "#password" },
                isZipCode: {
                    isZipCode: true }
            },
            messages: {
                firstname: "请输入姓名",
                email: {
                    required: "请输入Email地址",
                    email: "请输入正确的email地址" },
                password: {
                    required: "请输入密码",
                    minlength: jQuery.format("密码不能小于{0}个字 符")
                },
                confirm_password: {
                    required: "请输入确认密码",
                    minlength: "确认密码不能小于5个字符",
                    equalTo: "两次输入密码不一致不一致" }
            }
        });
        $("#signupForm").ajaxSubmit();
    });
});
```

## 调用自己写的方法或者类

### 调用日期方法类

```js
/**
 * Created by lewis on 15-9-15. */
//自定义的命名空间，用来对日期进行操作
define([],{ //输入json日期获取年
    getYear: function (jsonDate) { var dateArry = jsonDate.split('-'); var jsonyear = parseInt(dateArry[0]); return jsonyear;
    }, //输入json日期获取月
    getMonth: function (jsonDate) { var dateArry = jsonDate.split('-'); var jsonmonth = parseInt(dateArry[1]); return jsonmonth;
    }, //输入json日期获取日
    getDay: function (jsonDate) { var dateArry = jsonDate.split('-'); var jsonday = parseInt(dateArry[2]); return jsonday;
    }, //输入json日期和日历日期（后面的年）,判断json日期是否在两年内
    isInYear: function (jsonDate, calenYear) { var jsonArry = jsonDate.split('-'); var jsonyear = parseInt(jsonArry[0]); if (jsonyear == calenYear || jsonyear == (calenYear - 1)) return true; else
            return false;
    }, //输入json日期和日历日期（年和月），判断json日期是否在日历日期内
    isInMonth: function (jsonDate, calendarDate) { var jsonArry = jsonDate.split('-'); var jsonyear = parseInt(jsonArry[0]); var jsonmonth = parseInt(jsonArry[1]); var calenArry = calendarDate.split('-'); var calenyear = parseInt(calenArry[0]); var calenmonth = parseInt(calenArry[1]); if (jsonyear == calenyear && jsonmonth == calenmonth) return true; else
            return false;
    },
    getNowFormatDate: function () { var date = new Date(); var seperator = "-"; var year = date.getFullYear(); var month = date.getMonth() + 1; var strDate = date.getDate(); var currentdate = year + seperator + month + seperator + strDate;
        console.log(currentdate); return currentdate;
    },
    getDateFromYMD: function (a) { var arr = a.split("-"); var date = new Date(arr[0], arr[1], arr[2]); return date;
    }
});
```

调用：

```
 require(['common/myDateClass'], function (myDateClass) {
。。。
。。。
}）
```

## 调用代码段（任性！！！）

a.js

```js
function myFunctionA(){
    console.log('a');
};
```

b.js

```js
function myFunctionB(){
    console.log('b');
};
```

调用：

```js
require(['js/ab/a','ab/b.js'],function(){
    myFunctionA();
    myFunctionB();
});
```