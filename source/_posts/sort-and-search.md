---
title: JavaScript 版数据结构与算法（九）排序和搜索
date: 2017-02-20 10:39:00
tags: [数据结构与算法]
---

今天，我们要讲的是一些基础的排序和搜索算法。

<!--more-->

## 编写 ArrayList 类

在讲解排序和搜索算法前，我们先编写一个 `ArrayList` 类，使其包含私有变量 `array`，用于盛放数组，同时还包含 `insert` 和 `toString` 方法可以插入和转化为字符串。如此一来，当后面我们讲解各种排序和搜索算法时就可以很方便地设置输入输出来测试了。

```js
function ArrayList() {

  var array = [];

  this.insert = function (item) {
    array.push(item);
  };

  this.toString = function () {
    return array.toString();
  };
}
```

## 冒泡排序

冒泡排序是排序中最简单的一种，不过它的性能并不好（时间复杂度为O(n^2)）。面试官有时候为了缓解面试的紧张气氛，会让应聘者手写冒泡排序算法。

那么冒泡排序的思路是什么？其实就是每轮从头到尾比较相邻两个数并选择性交换（但是每次的最后一项在下一次就不用参与了，因为已经在正确的位置上了），然后执行 n-1 轮。比如对这个数组进行冒泡排序：

```
1 3 5 4 2
```
那么实现过程记录如下：

第一轮
```
1 3 5 4 2  // 1<3 不交换
1 3 5 4 2  // 3<5 不交换
1 3 4 5 2  // 5>4 交换
1 3 4 2 5  // 5>2 交换
```

第二轮
```
1 3 4 2 5  // 1<3 不交换
1 3 4 2 5  // 3<4 不交换
1 3 2 4 5  // 4>2 不交换
```

第三轮

```
1 3 2 4 5  // 1<3 不交换
1 2 3 4 5  // 3>2 交换
```

第四轮

```
1 2 3 4 5  // 1<2 不交换
```

用代码实现就是：

```js
var swap = function (index1, index2) {
  var aux = array[index1];
  array[index1] = array[index2];
  array[index2] = aux;
};

this.bubbleSort = function () {
  var length = array.length;
  for (var i = 0; i < length; i++) {  // 执行 n-1 轮
    for (var j = 0; j < length - 1 - i; j++) {  // 每轮（i）比较 n - i 个数 
      if (array[j] > array[j + 1]) {
        swap(j, j + 1);
      }
    }
  }
};
```

冒泡排序非常简单，唯一需要注意的就是边界的设置，你可以先使用5或3个数来假设一下，这样可以轻松算出边界。

测试代码：

```js
function createNonSortedArray() {
  var array = new ArrayList();
  array.insert(1);
  array.insert(3);
  array.insert(5);
  array.insert(4);
  array.insert(2);
  return array;
}

var array = createNonSortedArray();
expect(array.toString()).toBe('1,3,5,4,2');
array.bubbleSort();
expect(array.toString()).toBe('1,2,3,4,5');
```

## 选择排序

选择排序也是一种简单但性能（O(n^2)）一般的排序算法。在所有的**完全依靠交换去移动元素**的排序方法中，选择排序属于非常好的一种。选择排序的实现思路是：找到数据结构中的最小值，**选**中它并将其放置在第一位，接着找到第二小的值，**选**中它并将其放置在第二位，以此类推。

比如对一个这样的数组进行排序：

```
1 3 5 4 2
```

那么第一轮：

```
1 3 5 4 2  // 找出最小值1和第一位的1交换，相同的话可以省去交换过程
```

第二轮：

```
1 2 5 4 3  // 找出第二小值2和第二位的3交换
```

第三轮：

```
1 2 3 4 5  // 找出第三小值3和第三位的5交换
```

第四轮

```
1 2 3 4 5  // 找出第四小值4和第四位的4交换，相同的话可以省去交换过程
```

那么代码的编写无法就是两个循环：

- 循环得到最小值
- 循环将最小值交换到指定位置

实现代码如下：

```js
this.selectionSort = function () {
  var length = array.length,
    indexMin;

  for (var i = 0; i < length - 1; i++) {  // 循环将最小值交换到指定位置
    indexMin = i;
    for (var j = i; j < length; j++) {  // 循环得到最小值
      if (array[indexMin] > array[j]) {
        indexMin = j;
      }
    }
    if (i !== indexMin) {
      swap(i, indexMin);
    }
  }
};
```

注意边界的设置！测试代码如下：

```js
array = createNonSortedArray();
expect(array.toString()).toBe('1,3,5,4,2');
array.selectionSort();
expect(array.toString()).toBe('1,2,3,4,5');
```

## 插入排序

虽然插入排序的复杂度也是O(n^2)，但排序**小型数组**时，此算法比选择排序和冒泡排序性能要好。插入排序的实现思路是：从第二个数开始往前比，比它大就往后排，依次进行到最后一个数。就好比是上学时排队，本来瞎胡排一队，然后老师说按个子高低排：

- 第二个同学看看第一个同学，觉得比自己高，就说：“你个子高还站前面！后面去！”，然后**插**到他前面。
- 第三个同学，先后看了第二个、第一个同学，觉得都比自己高，就**插**到第一个了。
- 以此类推到最后一个同学。

拿个数组做演示吧！比如对下面这个数组排序：

```
3 5 1 4 2
```

第一轮：

```
3 5 1 4 2  // 5>3，不插队
```

第二轮：

```
1 3 5 4 2  // 1<5，插队，1<3，再插队
```

第三轮：

```
1 3 4 5 2  // 4<5，插队，4>3，不插队
```

第四轮：

```
1 2 3 4 5  // 2<5，插队，2>4，插队，2<3，不插队
```

注意，只要第一次遇到较小的数，就不用再比较了，也就是说，如果第一次不插队，就不用再往前比了，因为前面都是更小的。所以代码实现是：

```js
this.insertionSort = function () {
  var length = array.length,
    j, temp;
  for (var i = 1; i < length; i++) {  // 从第二个开始比
    temp = array[i];
    j = i;
    while (j > 0 && array[j - 1] > temp) { // 比完或遇到较小数就不用比了
      array[j] = array[j - 1];
      j--;
    } 
    array[j] = temp;  // 插队！！！
  }
};
```
测试代码如下：

```js
array = createNonSortedArray(5);
expect(array.toString()).toBe('5,4,3,2,1');
array.insertionSort();
expect(array.toString()).toBe('1,2,3,4,5');
```

## 归并排序

归并排序的性能比前三个排序算法都要好，时间复杂度为O( nlogn )，而且 Mozilla Firefox 使用了归并排序作为 `Array.prototype.sort` 的实现（但 Chrome 使用的是快速排序）。那么归并排序的思路是什么呢？简单来说，就是先分再合。

比如对这样的数组进行排序：

```
13542
```

分：

```
13 542
```

再分：

```
13 5 42
```

再分：

```
1 3 5 4 2
```

合：

```
13 5 24
```

再合：

```
13 245
```

再合：

```
12345
```

**分** 这个过程需要用到递归，对原数组分割，再对子数组做同样的事，终止条件是数组只有一项了，然后对这些数组进行合并，**合**这个过程主要是将两个数组合并的同时进行排序。所以，实现代码如下：

```js
var mergeSortRec = function (array) {
  var merge = function (left, right) {  // 合
    var final = [];
    while (left.length && right.length)
      final.push(left[0] <= right[0] ? left.shift() : right.shift());
    return final.concat(left.concat(right));
  };
  
  var length = array.length;
  if (length === 1) {
    return array;
  }
  var mid = Math.floor(length / 2),  // 分
    left = array.slice(0, mid),
    right = array.slice(mid, length);
  return merge(mergeSortRec(left), mergeSortRec(right));  // 递归
};

this.mergeSort = function () {
  array = mergeSortRec(array);
};
```
测试代码如下：

```js
array = createNonSortedArray();
expect(array.toString()).toBe('1,3,5,4,2');
array.insertionSort();
expect(array.toString()).toBe('1,2,3,4,5');
```

## 快速排序

快速排序又称划分交换排序，是一种排序算法，最早由东尼·霍尔提出。在平均状况下，排序 n 个项目要 Ο(n log n) 次比较。在最坏状况下则需要 Ο(n2) 次比较，但这种状况并不常见。事实上，快速排序通常明显比其他 Ο(n log n) 算法更快，因为它的内部循环（inner loop）可以在大部分的架构上很有效率地被实现出来。

快速排序的实现思路是：

- 从数列中挑出一个元素，称为"基准"（pivot）。
- 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。
- 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

选择基准可以用第一项，也可以随机选择或选择中间一项。我们选择第一项！不过注意，研究表明选择第一项作为基准对几乎已经排序的数组并不适合，会导致性能最差。

比如对这样的数组进行排序：

```
35142
```

那么第一轮：

```
// 对 35142 进行快排，left 为 21，基准是 3，right 为 45
21 3 45
```

第二轮：

```
// 对 21 进行快排，left 为 1，基准是 2，right 为空
1 2 3 45
```

第三轮：

```
// 对 45 进行快排，left 为空，基准是 4，right 为 5
1 2 3 4 5
```

所以代码实现的核心就是：

- 找基准
- 找左右数组
- 将左右数组和基准合并
- 对左右子数组重复上述操作

实现代码如下：

```js  
var quick = function (array) {
  var length = array.length;
  if (length <= 1)
    return array.slice(0);
  var left = [];
  var right = [];
  var mid = [array[0]];
  for (var i = 1; i < length; i++) {
    if (array[i] < mid[0])
      left.push(array[i]);
    else
      right.push(array[i]);
  }
  return quick(left).concat(mid.concat(quick(right)));
};

this.quickSort = function () {
  array = quick(array);
};
```

## 顺序搜索

排序算法讲完了，我们来看搜索算法，最基本的搜索算法是顺序搜索：将每一个数据结构中的元素和我们要找的元素做比较。这种算法非常低效（时间复杂度为O(n)），不过比较简单，可以用来缓解面试紧张气氛。实现代码如下：

```js
this.sequentialSearch = function (item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === item) {
      return i;
    }
  }
  return -1;
};
```

## 二分搜索

在计算机科学中，二分搜索（英语：binary search），也称折半搜索（英语：half-interval search）、对数搜索（英语：logarithmic search），是一种在**有序数组**中查找某一特定元素的搜索算法。搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束；如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。如果在某一步骤数组为空，则代表找不到。这种搜索算法每一次比较都使搜索范围缩小一半。它的时间复杂度是 O(log(n))。

代码编写的要诀是：不断改变最小值、最大值和中间值，直到中间值为被查找的值。

```js
this.binarySearch = function (item) {
  this.quickSort();

  var low = 0,
    high = array.length - 1,
    mid, element;

  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    element = array[mid];
    if (element < item) {
      low = mid + 1;
    } else if (element > item) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
};
```

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>