---
title: 动态数组
---

## 1. What
动态数组体现了顺序表的核心思想：元素放在一段连续内存中，通过下标直接访问。教材里常把它称为顺序表，工程里常见形态则是 `vector`、`ArrayList`、基于 `slice` 的缓冲区或可扩容数组。

它的关键点在于把逻辑长度和物理容量分开。只要容量还够，尾部追加和按位覆盖都很便宜；一旦容量耗尽，就要申请更大的连续空间并把旧元素整体拷贝过去。

## 2. Why
动态数组适合下面这类场景：

- 元素顺序重要
- 需要频繁按下标随机访问
- 需要较好的缓存局部性
- 可以接受摊还意义下的尾插代价

它常用于批处理缓冲区、顺序扫描容器、按序维护的数据集合，以及“读多改少”的场景。

## 3. How
最小状态通常是 `data`、`size` 和 `capacity`。

```text
append(x):
  if size == capacity:
    newCapacity = max(1, capacity * 2)
    allocate newData[newCapacity]
    copy data[0..size-1] into newData
    data = newData
    capacity = newCapacity
  data[size] = x
  size = size + 1
```

如果在中间插入或删除，就必须移动元素来保持连续存储。

```text
insert(i, x):
  ensure capacity
  for k from size down to i + 1:
    data[k] = data[k - 1]
  data[i] = x
  size = size + 1
```

典型复杂度如下：

| Operation | Time |
| --- | --- |
| index read/write | `O(1)` |
| append | 摊还 `O(1)` |
| insert/delete at tail | 摊还 `O(1)` |
| insert/delete in middle | `O(n)` |
| search by value | `O(n)`，若有序可进一步优化 |

```mermaid
flowchart LR
  A[追加元素] --> B{size < capacity?}
  B -- Yes --> C[写入 data[size]]
  B -- No --> D[申请更大空间]
  D --> E[复制旧元素]
  E --> C
  C --> F[size = size + 1]
```

## 4. Better
和链表相比，动态数组用中间更新成本换来了更强的局部性和真正的按下标访问能力。在现代 CPU 上，连续内存往往会把这种取舍变成实际优势。

和定长数组相比，动态数组多了扩容拷贝和容量策略的复杂度，但不必事先精确知道规模。扩容倍率通常取 `1.5` 到 `2`，用于平衡空间浪费和扩容频率。

如果数组始终保持有序，可以用二分查找把查找降到 `O(log n)`，但插入仍然需要移动元素，因此仍是 `O(n)`。

## 5. Beyond
动态数组不适合下面这类负载：

- 频繁在头部插入
- 需要在扩容后仍保持引用或迭代器稳定
- 峰值容量很大且回落明显，内存浪费不可接受

工程实现里还会涉及缩容策略、迭代器失效规则、移动语义以及分配器调优。真正要判断的，不只是时间复杂度，而是扩容策略和内存局部性是否贴合实际工作负载。
