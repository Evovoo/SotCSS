---
title: Sorting
---

## 1. What
Sorting rearranges elements into a specified order, usually ascending or descending by key. It is one of the most fundamental algorithmic tasks because ordered data supports faster searching, grouping, and downstream processing.

Textbook sorting spans insertion sort, selection sort, bubble sort, merge sort, quick sort, heap sort, and non-comparison methods such as counting sort or radix sort.

## 2. Why
Sorting matters because many later operations become easier once order exists:

- binary search requires sorted input
- duplicate detection and merging become simpler
- ranking and report generation depend on order
- many algorithms hide sorting as a preprocessing step

It is also one of the clearest settings for comparing algorithmic trade-offs among time, space, stability, and adaptiveness.

## 3. How
Representative complexity profile:

| Algorithm | Best/Average/Worst | Stable | Extra Space |
| --- | --- | --- | --- |
| insertion sort | `O(n)` / `O(n^2)` / `O(n^2)` | yes | `O(1)` |
| merge sort | `O(n log n)` / `O(n log n)` / `O(n log n)` | yes | `O(n)` |
| quick sort | `O(n log n)` / `O(n log n)` / `O(n^2)` | no | recursion stack |
| heap sort | `O(n log n)` / `O(n log n)` / `O(n log n)` | no | `O(1)` |

Merge sort sketch:

```text
split array into halves
sort each half recursively
merge two sorted halves
```

Quick sort sketch:

```text
choose pivot
partition elements around pivot
recursively sort left and right parts
```

## 4. Better
There is no universally best sorting algorithm. Insertion sort is good on tiny or nearly sorted input. Merge sort gives predictable `O(n log n)` behavior and stability. Quick sort is often fastest in practice on in-memory arrays when pivot selection is good. Heap sort guarantees `O(n log n)` with low extra memory, but often has worse constants and locality.

Stable sorting is better when equal keys must preserve original order, such as multi-key sorting pipelines. Non-comparison sorts can beat `O(n log n)` when the key domain is constrained.

## 5. Beyond
Real production sorting also considers:

- external sorting for data larger than memory
- parallel sorting
- cache-aware implementation
- partially ordered or streaming data

Sorting is not just a classroom exercise. It is a case study in trade-off-driven algorithm design, where workload shape and system constraints matter as much as asymptotic bounds.
