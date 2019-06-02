---
title: JavaScript 基础：防抖与节流
date: 2019-06-02 20:14:00
tags: [JavaScript 基础, debounce, throttle]
---

今天，我们要讲的是防抖与节流的知识。



<!--more-->

## 含义

**防抖**：当触发动作停够指定时间才触发事件

**节流**：不管触发动作多么密集，事件之间的必须要有足够的间隔时间

## 比喻

**防抖**：假如你有一个善变的老婆，如果她一会要你给她买品牌A，一会说要你给她买品牌B，你很烦，就对她说，当你做完决定，**一天**内不变，我就给你买。

**节流**：假如你有一个爱花钱的老婆，她一个月让你买 10 个包，你很烦，就对她说，**每个月**只能买 1 个包。

## 应用场景

**防抖**：一边在输入框里打字，一边发请求校验，可以用防抖技术，让用户停止输入足够时间后，再发请求。

**节流**：监听滚动事件（比如图片懒加载）时候，可以用节流技术，减少触发事件的执行次数，减少性能消耗。

## 代码

**防抖**：

```js
function debounce(func, wait) {
    var timeout;
    return function () {
        var args = arguments;   
        var context = this;
        clearTimeout(timeout);
        timeout = setTimeout(func.bind(context,args), wait);
    }
}
```

利用柯里化消化 `wait` 参数，使用 `setTimeout` 延迟执行函数，如果新的触发动作进来，就取消上次的 `setTimeout`。

**节流**：

```js
function throttle(func, wait) {
    var pending = false;
    return function () {
        if(pending) { return; }
        var args = arguments;   
        var context = this;
        pending = true;
        setTimeout(() => {
            func.apply(context, args);
            pending = false;
        }, wait);
    }
}
```

利用柯里化消化 `wait` 参数，使用 `pending` 记录上次执行事件是否在等待中，如果是就返回，否则就开始新的等待。
