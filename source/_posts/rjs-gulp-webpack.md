---
title: r.js结合gulp等于webpack（angular为例）
date: 2016-01-19 03:46:00
tags: [RequireJs, r.js, Gulp, Webpack]
---

本人大学时玩Dojo，开始了AMD模块化的不归路，工作后一直使用Requirejs，感觉非常好。但是，近来随着React的火热，Webpack成为了天下无敌的模块化工具，能做模块化，合并压缩，监视等，当我看见Webpack甚至还能做反向代理的时候，我整个人都不好了。我已经打算从Requirejs转向Webpack了，在重构以前老代码的时候，我想记录下历史。使用r.js结合gulp同样可以实现Webpack的绝大部分功能。

<!--more-->

## 例子

源代码地址：[https://github.com/lewis617/daily-task](https://github.com/lewis617/daily-task)

例子比较弯弯绕，不适合Angular和Requirejs的新手看，但是可以只关注思路。

写的是一个任务管理系统，包括用户系统，任务的crud等功能。

## 组件（components）

Angular的组件指的是指令、过滤器、服务等，在这个例子中，我自己编写了若干个组件，包括一个延迟加载工具、一个等待指令、一个确认框、一个wilddog工具模块（里面包含了若干个我能用到的服务），都是我平时经常复用的组件，直接复制文件夹过去就能用。

还包括一些第三方的组件比如，angular-route，angular-ui等，都是直接用bower安装的。跟我自己写的组件原理是一样的哈哈，只不过最后用了一个module打包起来。

## 模块（modules）

就是按页面划分的功能模块，包括登录、主页、账户、任务四个模块。每个模块都包括config路由，controller，html页面等。

## 开始打包

npm install requirejs后可以使用r.js了，我们直接使用r.js命令行工具也可以，但是无法实现监视代码变动的功能，所以我们引入gulp来实现监视功能，其他的合并压缩均使用requirejs来实现。

gulpfile.js

```js
var gulp = require('gulp'); var rjs = require('requirejs'); var paths = {
  scripts: ['modules/**/*.js', 'modules/**/**/*.js','main.js']
};

gulp.task('build', function(cb){
  rjs.optimize({
    baseUrl: "./",
    mainConfigFile:"./main.js",
    name:'main',
    out:'./dist/build-main.js' }, function(buildResponse){ // console.log('build response', buildResponse);
 cb();
  }, cb);
}); // Rerun the task when a file changes
gulp.task('watch', function() { var watcher = gulp.watch(paths.scripts, ['build']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('default', ['build','watch']);
```

这个gulp配置文件就写了两个任务，一个是`build`一个是`watch`。`build`任务是直接把requirejs的入口文件（main.js）输入，指定输出目录，再指定配置文件（这里也是main.js），就可以合并压缩了。是不是非常简单。

`watch`任务就是监视代码变动，如果代码改变就自动合并压缩一次。

那么main.js里面究竟是什么呢？先贴出代码

main.js

```js
'use strict';
require.config({
    baseUrl:'',
    paths: { 'ngRoute':'bower_components/angular-route/angular-route.min', 'domReady':'bower_components/domReady/domReady', 'text':'bower_components/text/text', 'ui-bootstrap' : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min', 'angular-animate':'bower_components/angular-animate/angular-animate.min', 'routeConfig':'components/routeConfig' }
});

require([ 'domReady!', 'modules/home/main', 'modules/login/main', 'modules/account/main', 'modules/task/main' ],function(){
    angular.module("myApp", [ "myApp.home", "myApp.login", "myApp.account", 'myApp.task' ]).run(['$rootScope', 'Auth', function($rootScope, Auth) { // track status of authentication
            Auth.$onAuth(function(user) {
                $rootScope.loggedIn = !!user;
            }); //alert列表以及关闭方法
            $rootScope.alerts = [];
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

        }]);

    angular.bootstrap(document,['myApp']);
});
```

这段代码包含两部分，第一部分是requirejs的配置部分，定义了几个假名而已；第二部分是requirejs的入口部分，主要是先加载一些模块，然后用在主module里面声明以来，最后用run方法，启动一些你需要启动的事件，最后的最后手动启动Angular。

## 多米诺骨牌

本文并不打算写Requirejs，但是可以简单说一下，Requirejs以及其他所有的模块化工具都是一个多米诺骨牌，触发入口文件，继而引入所有的文件。示例程序中的组件和模块就是这样被引入的。将他们封装起来用文件夹打包，在以后的复用过程中，会非常好用！

## 比较Webpack

这些功能Webpack都具备，但是Requirejs是可以不全部合并的，有些文件需要延迟加载，比如Angular程序绝大多数都是SPA ，如果我们一开始就把所有的文件全部合并，势必会造成首次加载速度非常慢，那么如果我们使用Requirejs就可以在改变路由时候延迟加载一些js文件，使得首次加载的js文件体积变小。使用Webpack的话，恐怕不能直接实现这个功能，但是一定有相关的插件或者模块可以实现类似的。期待Webpack，也感谢历史上那些曾经优秀的工具带给我们的便利，让我们程序员的工作更加轻松！