---
title: Angular 结合RequireJs实现模块化开发
date: 2015-10-01 16:56:00
tags: [Angular, RequireJs]
---

Angular的指令是模块化很好的一个体现，下面我将只使用指令（不用控制器），结合Requirejs，实现模块化开发。

<!--more-->

模块化关系图：

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9yh3om8qij20bl05e0t8.jpg)

# 传统开发方式

```html
<!--aaa模块-->
<div>
    <h3>this is aaa</h3>
    <input type="text" ng-model="asd">{{asd}} <button ng-click="submit()">submit</button>
</div>
<!--bbb模块-->
<div>
    <h3>this is bbb</h3>
    <ul>
        <li ng-repeat="el in list">{{el}}</li>
    </ul>
    <!--ccc模块-->
    <div>
        <h3>this is ccc</h3>
    </div>
</div>
```

把所有模块写在一起，可读性差，耦合度高，难以维护。

# requires+angular模块化开发方式

index.html:

```html
<aaa></aaa>
<bbb>
    <ccc></ccc>
</bbb>
```

主页面干干净净。

## aaa

aaa模块包括aaa.js和aaa.html

aaa.html

```html
<div>
    <h3>this is aaa</h3>
    <input type="text" ng-model="asd">{{asd}} <button ng-click="submit()">submit</button>
</div>
```

aaa.js（引入aaa.html，放入模板中，在link中写业务逻辑，service是用来通信的）

```js
define(['app','text!./aaa.html'],function(app,aaa){
    app.directive("aaa", function(service) { return {
            restrict: 'AE',
            template: aaa,
            replace: true,
            scope:true,
            link:function(scope,element,attrs){
                scope.submit=function() {
                    service.updateName(scope.asd);
                };
            }
        }
    });
});
```

封装在一个文件夹里面，随时调用复用：

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3p0f0kj202y01zmx0.jpg)

`require(['./aaa/aaa'])`即可调用aaa模块;

## bbb

bbb模块也是两个文件：

bbb.html

```html
<div>
    <h3>this is bbb</h3>
    <ul>
        <li ng-repeat="el in list">{{el}}</li>
    </ul>
    <div ng-transclude></div>
</div>
```

bbb.js

```js
define(['app','text!./bbb.html'],function(app,bbb){
    app.directive('bbb',function(service){ return{
            restrict:'AE',
            template:bbb,
            replace:'true',
            scope:true,
            transclude:true,
            link: function (scope,element,attrs) {
                scope.list=[1,2,3,4];
                scope.$on('nameUpdated', function() {
                    scope.list.push(service.name);
                });
            }
        }
    });
});
```

bbb可以和aaa模块通过service通信，bbb还包含ccc（通过transclude嵌入）

## ccc

ccc模块也是两个文件：

ccc.html

```html
<div>
    <h3>this is ccc</h3>
</div>
```

ccc.js

```js
define(['app','text!./ccc.html'],function(app,ccc){
    app.directive('ccc',function(){ return{
            restrict:'AE',
            template:ccc,
            replace:'true',
            scope:true,
            link: function (scope,element,attrs) {
            }
        }
    });
});
```

三个模块解耦后，很好维护，因为一个文件的代码量不会超过20行，而且还便于复用。可以称为组件式开发。不要小看这个例子，并非玩玩而已，而是真正的工程化开发思路！

最后一起调用（只调用了aaa,bbb，ccc已经在bbb里调用过了），并启动app：

```js
require(['angular','./aaa/aaa','./bbb/bbb','./ccc/ccc','service'],function(angular){
        angular.bootstrap(document,['app']);
    });
```

最后看下总体目录：

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9yh3p8mnoj203m08iaae.jpg)