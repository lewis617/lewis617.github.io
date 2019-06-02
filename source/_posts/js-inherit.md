---
title: JavaScript 基础：继承
date: 2019-06-02 20:51:00
tags: [JavaScript 基础, 原型继承, 构造函数继承, 组合继承, 寄生式组合继承]
---

今天，我们要讲的是 JS 继承的知识，包括 原型继承, 构造函数继承, 组合继承及其优化, 寄生式组合继承。



<!--more-->

## 原型继承

子类的原型对象设置为父类的实例：

```js
function C1 (){}
function C2 (){}
C2.prototype = new C1();
C2.prototype.constructor = C2;
```

这样：每个子类实例就会继承父类实例的属性，但由于继承的属性在子类的原型上，所以继承的属性在不同实例之间都是共享的，没有隔离。

## 构造函数继承

子类的构造函数内部，执行了父类的构造函数：

```js
function C1 (){}
function C2 (...args){
    C1.call(this, ...args);
}
```

这样：每个子类实例的继承属性就隔离了，但继承不到父类的原型方法；

## 组合继承

结合以上两种

```js
function C1 (){}
function C2 (...args){
    C1.call(this, ...args);
}
C2.prototype = new C1();
C2.prototype.constructor = C2;
```

这样：继承的私有属性隔离，继承的原型方法可以公用，但是执行了两次父类的构造函数，第二次是多余的。

## 组合继承优化

结合前两种方法，但把子类的原型对象指向父类的原型对象，而不是实例。

```js
function C1 (){}
function C2 (...args){
    C1.call(this, ...args);
}
C2.prototype = C1.prototype;
C2.prototype.constructor = C2;
```

这样：就避免执行了两次父类的构造函数，但破坏了父类的原型对象的 `constructor`：`C1.proptotype.constructor`，本来应该指向 C1 的，现在指向 C2 了。

## 寄生组合继承

将子类的原型对象设置为一个新的对象，该对象的 `__proto__` 指向父类的原型。

```js
function C1 (){}
function C2 (...args){
    C1.call(this, ...args);
}
C2.prototype = Object.create(C1.prototype);
C2.prototype.constructor = C2;
```

这样就完美了！