---
title: 排序
---

## 1. What
排序的目标是按照某种规则重排元素，通常是按关键字升序或降序排列。它之所以基础，是因为一旦数据有序，后续的查找、分组和处理都会变得更简单。

教材中的排序算法包括直接插入、选择、冒泡、归并、快速、堆排序，以及计数排序、基数排序这类非比较排序。

## 2. Why
排序重要，是因为很多后续操作都建立在“有序”之上：

- 二分查找要求输入有序
- 去重和归并会更直接
- 排名、报表和展示依赖顺序
- 很多算法把排序当作预处理步骤

它也是最适合展示时间、空间、稳定性和自适应性之间取舍的经典场景。

## 3. How
代表性的复杂度画像如下：

| Algorithm | Best/Average/Worst | Stable | Extra Space |
| --- | --- | --- | --- |
| insertion sort | `O(n)` / `O(n^2)` / `O(n^2)` | yes | `O(1)` |
| merge sort | `O(n log n)` / `O(n log n)` / `O(n log n)` | yes | `O(n)` |
| quick sort | `O(n log n)` / `O(n log n)` / `O(n^2)` | no | 递归栈 |
| heap sort | `O(n log n)` / `O(n log n)` / `O(n log n)` | no | `O(1)` |

归并排序的思路：

```text
split array into halves
sort each half recursively
merge two sorted halves
```

快速排序的思路：

```text
choose pivot
partition elements around pivot
recursively sort left and right parts
```

## 4. Better
不存在对所有场景都最优的排序算法。插入排序适合规模小或“基本有序”的输入；归并排序提供稳定且可预测的 `O(n log n)`；快速排序在枢轴选择得当时，常常是内存数组上最快的实践方案；堆排序也能保证 `O(n log n)`，并且额外空间低，但常数和局部性通常不如前两者。

当相等关键字必须保留原始相对顺序时，稳定排序尤其重要，比如多关键字排序流水线。若键值范围受限，非比较排序甚至可以突破比较排序的 `O(n log n)` 下界。

## 5. Beyond
工程中的排序还会进一步考虑：

- 超出内存规模时的外部排序
- 并行排序
- 缓存友好实现
- 部分有序或流式数据

排序并不只是课堂练习，它是一个非常典型的“取舍驱动型算法设计”案例，工作负载和系统约束往往和渐近复杂度同样重要。
