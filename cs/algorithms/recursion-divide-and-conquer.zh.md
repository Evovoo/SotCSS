---
title: 递归与分治
---

## 1. What
递归是把问题表示成更小规模同类问题的求解方式。分治则是一种更有结构的递归策略：先把原问题拆成子问题，递归求解，再把子结果合并起来。

并不是所有递归都是分治，但分治是递归最重要的用法之一。归并排序、快速排序以及许多树算法都是经典例子。

## 2. Why
这种方法重要，是因为它能把一个复杂大问题转化成重复求解更简单的小问题：

- 问题结构更容易表达
- 正确性证明往往更自然
- 子问题常常可以并行求解
- 许多高效算法本身就天然具有递归结构

当子问题相互独立、合并成本又可控时，分治尤其有效。

## 3. How
它的典型形态是：

```text
solve(problem):
  if small enough:
    return base answer
  split into subproblems
  solve each subproblem recursively
  combine partial answers
```

归并排序是最标准的分治案例：

```text
mergeSort(a):
  if length(a) <= 1:
    return a
  split a into left and right
  left = mergeSort(left)
  right = mergeSort(right)
  return merge(left, right)
```

它对应的递推式为：

```text
T(n) = 2T(n / 2) + O(n)
```

快速排序在高层结构上类似，但它的“合并”几乎免费，关键在于划分是否均衡：

```text
quickSort(a, l, r):
  if l >= r:
    return
  p = partition(a, l, r)
  quickSort(a, l, p - 1)
  quickSort(a, p + 1, r)
```

## 4. Better
当问题本身具有层次性，比如树、文法或不断二分的空间结构时，递归通常比迭代更清晰。分治之所以优于朴素暴力，在于它能通过更合理的拆分，把问题组织成对数层级，甚至减少总工作量。

但递归也会带来调用栈开销，而失衡的分治策略会迅速恶化复杂度。快速排序就是典型例子：平均是 `O(n log n)`，如果枢轴选得很差，最坏会退化到 `O(n^2)`。

动态规划和分治的关键区别在于：动态规划处理的是“重叠子问题”，而经典分治通常默认子问题彼此基本独立。

## 5. Beyond
在实际系统里，递归还必须考虑：

- 调用栈深度限制
- 是否有尾调用优化
- 递归过深时是否要改写成迭代
- 多核环境下分治并行的调度成本

最重要的结论是“结构匹配”。如果问题天然就是递归形态，递归非常有力；如果递归只是让状态更难跟踪、额外增加开销，那么迭代设计通常更合适。
