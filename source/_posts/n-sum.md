---
title: JavaScript 版数组搜索算法题：求和为定值的多个数
date: 2017-03-09 18:06:00
tags: [数据结构与算法, LeetCode]
---

今天，我们要讲的是**求和为定值的多个数**。这个算法题有很多版本，它们都来自于 LeetCode：

https://leetcode.com/problems/two-sum

https://leetcode.com/problems/3sum

https://leetcode.com/problems/4sum

<!--more-->


## 和为定值的两个数

在求和为定值的多个数之前，我们先来求和为定值的两个数。对于数组搜索算法而言，如果搜索一个数，那么方法就是前面讲的：

- 顺序搜索
- 二分搜索

这非常简单，那么如果搜索和为定值两个数呢？其实也可以是顺序搜索或二分搜索，只不过需要遍历数组，先拿到一个值，然后对另一个值进行顺序搜索或二分搜索，比如 `[1, 3, 5, 4, 2]`，求和为6的两个数，那么：

- 第一轮取1，对 `[3, 5, 4, 2]` 进行顺序搜索或二分搜索
- 第二轮取3，对 `[5, 4, 2]`  进行顺序搜索或二分搜索
- ……

使用顺序搜索查找两个数的时间复杂度为O(n^2)，空间复杂度为O(1)。使用二分搜索的时间复杂度为O(nlogn)，空间复杂度为O(1)。

那么除了顺序搜索和二分搜索，还有别的方法吗？答案是肯定的。其他方法列举如下：

1，**借助散列表**：先构建一个散列表，存储数组每个值。然后遍历数组，查看 `target` 与每项的差是否在散列表中，如果在就返回两个值。这个方法的时间复杂度和空间复杂度均为O(n)。代码示例如下：

LeetCode/001-twoSum.js

```js
/**
 * You may assume that each input would have exactly one solution, 
 * and you may not use the same element twice.
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  var map = {};

  for (var i = 0; i < nums.length; i++) {
    if (nums[i] in map) {
      return [map[nums[i]], i];
    } else {
      map[target - nums[i]] = i;
    }
  }
};
```
测试代码如下：

```js
expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
```

> 注意， `twoSum` 输出的结果是数组项的索引，而后面的 `threeSum` 和 `fourSum` 输出的则是数组项的值。

2，**双指针两端扫描**：若数组无序，就先排序后扫描。扫描方法是用两个指针 `i` 和 `j`，先放在数组首尾，如果指向的两个数之和大于 `target` ，就 `j--`，否则 `i++`，直到两个数之和为 `target`，然后返回这两个数。该方法的时间复杂度最后为：有序O(n)，无序O(nlogn + n)=O(nlogn)，空间复杂度都为O(1)。代码示例如下：

LeetCode/001-twoSum.js

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum2 = function (nums, target) {
  var l = 0,
    r = nums.length - 1,
    results = [];
  while (l < r) {
    var s = nums[l] + nums[r];
    if (s === target) {
      results.push([l, r]);
      while (l < r && nums[l] === nums[l + 1]) {
        l++;
      }
      while (r > l && nums[r] === nums[r - 1]) {
        r++;
      }
      l++;
      r--;
    } else if (s < target) {
      l++;
    } else {
      r--;
    }
  }
  return results
};
```

测试代码如下：

```js
expect(twoSum2([-2, -1, -1, 1, 1], 0)).toEqual([[1, 4]]);
```

## 和为定值的三个数

了解了和为定值的两个数的搜索方法，那么和为定值的三个数的搜索方法呢？这里需要用到**遍历**+**求和为定值的两个数**。先举个例子吧！比如数组为 `[1, 3, 5, 4, 2]` ，求和为7的三个数。那么整个流程如下：

- 第一轮取1，对 `[3, 5, 4, 2]` 进行和为7-1的两个数搜索。
- 第二轮取3，对 `[5, 4, 2]` 进行和为7-3的两个数搜索。
- ……

当问题变为两个数的搜索时，那么我们就可以用前面介绍的方法了！示例代码如下：

LeetCode/015-threeSum.js

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  var res = [];
  nums.sort(function (a, b) {
    return a - b;
  });

  for (var i = 0; i < nums.length - 1; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }
    var l = i + 1;
    var r = nums.length - 1;
    while (l < r) {
      var s = nums[i] + nums[l] + nums[r];
      if (s < 0) {
        l++;
      } else if (s > 0) {
        r--;
      } else {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) {
          l++;
        }
        while (r > l && nums[r] === nums[r - 1]) {
          r++;
        }
        l++;
        r--;
      }
    }
  }
  return res;
};
```

测试代码如下：

```js
expect(threeSum([-2, -1, -1, 1, 1, 2, 2])).toEqual([[-2, 1, 1], [-1, -1, 2]]);
```


## 和为定值的四个数

如果 `N`（`N` 代表和为定值的 `N` 个数） 为更大的值，那么就使用**递归**，一直到 `N` 为2时终结掉。这里我们来求一下和为定值的四个数，示例代码如下：

LeetCode/018-fourSum.js

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  var findNSum = function (nums, target, N, result, results) {
    if (nums.length < N || target < nums[0] * N || target > nums[-1] * N) {
      return;
    }
    if (N === 2) {
      var l = 0,
        r = nums.length - 1;
      while (l < r) {
        var s = nums[l] + nums[r];
        if (s === target) {
          results.push(result.concat([nums[l], nums[r]]));
          while (l < r && nums[l] === nums[l + 1]) {
            l++;
          }
          while (r > l && nums[r] === nums[r - 1]) {
            r++;
          }
          l++;
          r--;
        } else if (s < target) {
          l++;
        } else {
          r--;
        }
      }
    } else {
      for (var i = 0; i < nums.length - N + 1; i++) {
        if (i === 0 || (i > 0 && nums[i - 1] !== nums[i])) {
          findNSum(nums.slice(i + 1), target - nums[i], N - 1, result.concat([nums[i]]), results);
        }

      }
    }
  };
  var results = [];
  nums.sort(function (a, b) {
    return a - b;
  });
  findNSum(nums, target, 4, [], results);
  return results;
};

```

测试代码如下：

```js
expect(fourSum([-2, -1, -1, 1, 1, 2, 2], 0)).toEqual([[-2, -1, 1, 2], [-1, -1, 1, 1]]);
```
当 `N` 为更大的数，只需要更改 `findSum` 的第三个参数即可。练习算法光说不练可不行，赶快打开 LeetCode 进行练习吧！

## 教程示例代码及目录

示例代码：<https://github.com/lewis617/javascript-datastructures-algorithms>

目录：<http://www.liuyiqi.cn/tags/数据结构与算法/>