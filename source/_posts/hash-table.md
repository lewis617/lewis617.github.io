---
title: JavaScript 版数据结构与算法（六）散列表
date: 2017-02-17 15:19:00
tags: [数据结构与算法]
---

今天，我们要讲的是数据结构与算法中的散列表。

<!--more-->

## 散列表简介

散列表是什么？散列表也是一种以**键值对**存储数据的数据结构，但是它的键是通过**散列函数**生成的**位置或索引**，也正因为此，我们可以**更快**地访问某个值（散列表的查找复杂度为O(1)，而其他顺序数据结构如栈、队列、链表的查找复杂度都为O(n)，因为需要遍历）。比如，电话簿就是散列表的一种应用。电话簿用姓名首字母作为索引帮助使用者快速检索出电话号码。那么首字母就是**键**，电话号码就是**值**，姓名到首字母的算法就是一种**散列函数**，而这种方法显然加快了检索的速度，就像散列表设计的初衷（为了加快速度）一样。

## 散列函数简介

电话簿这个例子中我们看到了一种散列函数，那么什么是散列函数？散列函数是一种从任何一种数据中创建**小的数字“指纹”**的方法。散列函数把消息或数据压缩成摘要，使得数据量变小，将数据的格式固定下来。散列函数构造方法有很多，包括：直接定址法、数字分析法、平方取中法、折叠法、随机数法、除留余数法等。本文就将会使用**除留余数法**来构造散列函数。除留余数法的实现思路是：取关键字被某个不大于散列表表长 m 的数 p 除后所得的余数为散列地址。对 p 的选择很重要，一般取素数或 m，若 p 选择不好，容易产生冲突。

## 用 JavaScript 编写散列表类

让我们自己用 JavaScript 写个散列表类吧！

### 私有变量

为了用键（位置或索引）值对存储元素，我们使用一个数组 `table` 来作为私有变量。另外，还要再编写一个私有的散列函数 `loseloseHashCode`，这个散列函数的实现思路是：先累加所有字母的 Ascii 值得到 `hash`，然后返回 `hash` 除以某个值（本例取37，你也可以选择其他值）的余数。这就是除留余数法的一种应用。

> ASCII（American Standard Code for Information Interchange，美国信息交换标准代码）是基于拉丁字母的一套电脑编码系统。想了解更多的细节，请访问 http://www.asciitable.com/。

```js
function HashTable(){
  var table = [];

  var loseloseHashCode = function (key) {
    var hash = 0;
    for (var i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % 37;
  };
}
```

那么散列表里的数据究竟长什么样呢？举个例子，假如要存储的数据是：
```js
{
  'zhangsan': 'zhangsan@email.com'
  'lisi': 'lisi@email.com'
}
```

那么经过 `loseloseHashCode`，存储在 `table` 中的数据就是这样：

```js
[ ,
  ,
  ,
  ,
  ,
  ,
  ,
  'zhangsan@email.com', // zhangsan 的 Ascii 码值之和是858，除以37余7
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  'lisi@email.com' // lisi 的 Ascii 码值之和是433，除以37余26
]
```
散列表中的**键**就是位置或索引，查起来就是快！

### 实现 put 、get 和 remove 方法

实现 `put` 方法（设置键值对）、`get` 方法（通过键取值）、`remove` 方法（删除指定键值），可以跑通如下测试：

```js
var hashTable = new HashTable();

hashTable.put('zhangsan', 'zhangsan@email.com');
hashTable.put('lisi', 'lisi@email.com');

expect(hashTable.get('zhangsan')).toBe('zhangsan@email.com');
expect(hashTable.get('lisi')).toBe('lisi@email.com');

hashTable.remove('zhangsan');
expect(hashTable.get('zhangsan')).toBe(undefined);
```

实现方法比较简单，直接上代码：

```js
this.put = function (key, value) {
  var position = loseloseHashCode(key);
  table[position] = value;
};

this.get = function (key) {
  return table[loseloseHashCode(key)];
};

this.remove = function (key) {
  table[loseloseHashCode(key)] = undefined;
};
```

### 使用分离链接法解决冲突

看了上述方法，很多同学会有疑问：如果某两个键通过 `loseloseHashCode` 返回的余数相同怎么办？这时候就需要解决冲突。其实一个好的散列函数的冲突是很少的，可惜 `loseloseHashCode` 只能算是一般般吧！解决冲突有很多方法，我们先使用**分离链接法**来解决冲突。

分离链接法的实现思路是，`put` 时将输入的值放到链表里再放到散列表的某个位置上，假如遇到位置冲突就追加到链表最后。`get` 和 `remove` 时，先算出位置，然后遍历链表，找到需要的值再返回或删除。

让我们改写 `get` 、 `put` 和 `remove` 方法，跑通如下测试：

```js
var hashTable = new HashTable();

hashTable.put('zhangsan', 'zhangsan@email.com'); // 代码一
hashTable.put('zhangsan12', 'zhangsan12@email.com'); // 代码二
hashTable.put('zhangsan21', 'zhangsan21@email.com'); // 代码三
hashTable.put('zhangsan30', 'zhangsan30@email.com'); // 代码四
expect(hashTable.get('zhangsan')).toBe('zhangsan@email.com'); // 断言一
expect(hashTable.get('zhangsan12')).toBe('zhangsan12@email.com'); // 断言二
expect(hashTable.get('zhangsan21')).toBe('zhangsan21@email.com'); // 断言三
expect(hashTable.get('zhangsan30')).toBe('zhangsan30@email.com'); // 断言四
expect(hashTable.remove('zhangsan')).toBeTruthy(); // 断言五
expect(hashTable.get('zhangsan')).toBe(undefined); // 断言六
expect(hashTable.remove('zhangsan21')).toBeTruthy(); // 断言七
expect(hashTable.remove('zhangsan12')).toBeTruthy(); // 断言八
expect(hashTable.remove('zhangsan30')).toBeTruthy(); // 断言九
expect(hashTable.remove('zhangsan30')).toBeFalsy(); // 断言十
```

实现代码如下：

```js
var ValuePair = function (key, value) {
  this.key = key;
  this.value = value;
};

this.put = function (key, value) {
  var postion = loseloseHashCode(key);
  if (table[postion] == undefined) {  // 代码一的情况
    table[postion] = new LinkedList();
  }
  table[postion].append(new ValuePair(key, value)); // 代码二、三、四的情况
};

this.get = function (key) {
  var position = loseloseHashCode(key);

  if (table[position] !== undefined) {
    var current = table[position].getHead();

    while (current.next) {  // 断言二、三的情况
      if (current.element.key === key) {
        return current.element.value;
      }
      current = current.next;
    }

    if (current.element.key === key) { // 断言一、四的情况
      return current.element.value;
    }
  }
  return undefined; // 断言六
};

this.remove = function (key) {
  var position = loseloseHashCode(key);

  if (table[position] !== undefined){
    var current = table[position].getHead();

    do {
      if (current.element.key === key){
        table[position].remove(current.element); // 断言五、七、八、九
        if (table[position].isEmpty()){
          table[position] = undefined; // 断言五、九
        }
        return true;
      }
      current = current.next;
    } while(current);
  }
  return false; // 断言十
}
```

自己看着测试用例把边界写全吧！

### 使用线性探查法解决冲突

除了分离链接法，还可以通过线性探查法解决冲突，它的实现思路是，`put` 时如果冲突就设置在下个位置，还冲突就继续，直到找到空位，然后设置。`get` 和 `remove` 时，则先找到位置，然后判断是不是当前值，不是就往后找，找到就返回或删除。

改写 `put`、`get` 和 `remove`，跑通如下测试：

```js
var hashTable = new HashTable();

hashTable.put('zhangsan', 'zhangsan@email.com'); // 代码一
hashTable.put('zhangsan12', 'zhangsan12@email.com'); // 代码二
hashTable.put('zhangsan21', 'zhangsan21@email.com'); // 代码三
hashTable.put('zhangsan30', 'zhangsan30@email.com'); // 代码四
expect(hashTable.get('zhangsan')).toBe('zhangsan@email.com'); // 断言一
expect(hashTable.get('zhangsan12')).toBe('zhangsan12@email.com'); // 断言二
expect(hashTable.get('zhangsan21')).toBe('zhangsan21@email.com'); // 断言三
expect(hashTable.get('zhangsan30')).toBe('zhangsan30@email.com'); // 断言四
expect(hashTable.remove('zhangsan')).toBeTruthy(); // 断言五
expect(hashTable.get('zhangsan')).toBe(undefined); // 断言六
expect(hashTable.remove('zhangsan30')).toBeTruthy();  // 断言七
expect(hashTable.remove('zhangsan21')).toBeTruthy(); // 断言八
expect(hashTable.remove('zhangsan12')).toBeTruthy(); // 断言九
expect(hashTable.remove('zhangsan12')).toBeFalsy(); // 断言十
```

实现代码如下：

```js
var ValuePair = function (key, value) {
  this.key = key;
  this.value = value;
};

this.put = function (key, value) {
  var position = loseloseHashCode(key);

  if (table[position] === undefined) {
    table[position] = new ValuePair(key, value); // 代码一、二
  } else {
    var index = ++position;
    while (table[index] !== undefined) {
      index++;
    }
    table[index] = new ValuePair(key, value); // 代码三、四
  }
};

this.get = function (key) {
  var position = loseloseHashCode(key);

  if (table[position] !== undefined) {
    if (table[position].key === key) {
      return table[position].value; // 断言一、二
    } else {
      var index = ++position;
      while (table[index] !== undefined && (table[index] && table[index].key !== key)) {
        index++;
      }
      if (table[index] && table[index].key === key) {
        return table[index].value; // 断言三、四
      }
    }
  }
  return undefined; // 断言六
};

this.remove = function (key) {
  var position = loseloseHashCode(key);

  if (table[position] !== undefined) {
    if (table[position].key === key) {
      table[position] = undefined; // 断言五
      return true;
    } else {
      var index = ++position;
      while (table[index] === undefined || table[index].key !== key) {
        index++;
      }
      if (table[index].key === key) {
        table[index] = undefined;  // 断言七、八、九
      }
      return true;
    }
  }
  return false; // 断言十
}
```

两种冲突方法知道原理即可，代码写起来挺无聊的，都是边界问题。今天就到此为止吧！
 
## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>
