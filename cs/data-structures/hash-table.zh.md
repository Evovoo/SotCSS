---
title: 哈希表
---

## 1. What
哈希表通过哈希函数把键映射到桶位置，用来存储键值对，目标是在典型情况下实现接近常数时间的查找。

真正难的部分不在“把键映射到数组”这个抽象，而在于如何处理冲突、控制装载因子，以及让哈希分布尽可能均匀。

## 2. Why
当工作负载核心是精确匹配查找时，哈希表通常是主力结构：

- 字典和映射
- 缓存
- 符号表
- 去重和成员测试

如果不要求顺序，哈希表通常是插入、查找、删除这三类操作里最实用的通用结构之一。

## 3. How
经典冲突处理策略主要有拉链法和开放定址法。

拉链法：

```text
insert(key, value):
  i = hash(key) mod capacity
  search bucket i
  update if key exists
  otherwise append new node to bucket list
```

线性探测形式的开放定址：

```text
find_slot(key):
  i = hash(key) mod capacity
  while table[i] occupied and table[i].key != key:
    i = (i + 1) mod capacity
  return i
```

当装载因子过高时，需要扩容并重新散列：

```text
if size / capacity > threshold:
  allocate larger table
  reinsert all entries
```

平均情况下，查找、插入、删除都期望是 `O(1)`；但如果冲突严重聚集，最坏情况仍可能退化到 `O(n)`。

## 4. Better
和平衡树相比，哈希表通常在精确查找延迟上更有优势，但在有序遍历、前驱后继查询和范围搜索上明显不足。

拉链法更容易处理删除，也能容忍更高装载因子；开放定址法则往往有更好的局部性，避免了大量桶节点指针。到底更优，要看缓存行为、分配器成本以及删除模式。

哈希函数质量和表结构同样关键。一个糟糕的哈希函数会直接破坏原本依赖平均情况成立的复杂度优势。

## 5. Beyond
现代系统中的哈希表还要处理：

- 对抗性碰撞攻击
- 并发扩容
- 开放定址中的墓碑标记
- 为避免长停顿而采用渐进式 rehash

哈希表非常典型地体现了“平均情况设计”的思想。它是很强的默认工具，但前提是问题确实是精确匹配查找，而且真的不需要顺序信息。
