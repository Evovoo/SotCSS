---
title: Search Algorithms
---

## 1. What
Search algorithms determine whether a target exists in a data collection and, if it does, where it is. The appropriate method depends less on the target value itself and more on the structure of the underlying data.

In data-structure courses, the core contrast is usually among linear search, binary search, block or indexed search, and search over specialized structures such as trees or hash tables.

## 2. Why
Search is one of the most frequent operations in software:

- lookup in tables and indexes
- membership testing
- retrieval from sorted records
- route selection through structured state spaces

Choosing the wrong search strategy wastes the advantage of an otherwise well-designed data structure.

## 3. How
Linear search scans sequentially:

```text
for each element x:
  if x == target:
    return found
return not found
```

Binary search requires sorted data:

```text
left = 0
right = n - 1
while left <= right:
  mid = (left + right) / 2
  if a[mid] == target:
    return found
  if a[mid] < target:
    left = mid + 1
  else:
    right = mid - 1
return not found
```

Representative cost profile:

| Method | Requirement | Time |
| --- | --- | --- |
| linear search | none | `O(n)` |
| binary search | sorted random-access data | `O(log n)` |
| BST search | balanced search tree preferred | average `O(log n)` |
| hash-table lookup | good hash distribution | expected `O(1)` |

## 4. Better
Linear search is best when the dataset is tiny, unsorted, or scanned anyway. Binary search is superior when data is static, sorted, and stored in a random-access structure like an array.

Tree-based search is better when the collection must remain ordered while supporting frequent updates. Hash-based search is best for exact-match lookup without ordering requirements.

The key principle is that search complexity is a property of both the algorithm and the representation. Binary search on a linked list is theoretically defined but practically pointless because middle access is not efficient.

## 5. Beyond
Real systems combine multiple search layers:

- indexes over disk pages
- caches over tree or hash structures
- bloom filters before expensive storage lookup
- search planning based on workload statistics

The deeper lesson is to design for the full access path. A fast search algorithm attached to the wrong structure is still the wrong solution.
