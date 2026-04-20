---
title: Dynamic Array
---

## 1. What
Dynamic arrays model the sequential-list idea: store elements in one contiguous memory region and access them by index in constant time. In textbooks this is often called a sequential list, while in real languages it appears as `vector`, `ArrayList`, `slice`-backed buffers, or resizable arrays.

The central design point is that logical length and physical capacity are separated. As long as capacity is available, appending and overwriting stay cheap; when capacity is exhausted, the structure allocates a larger block and copies the old elements into it.

## 2. Why
Dynamic arrays are the default choice when:

- order matters
- random access by index is frequent
- cache locality matters
- amortized append performance is acceptable

They work well for symbol tables implemented on top of sorted arrays, batch processing pipelines, traversal buffers, and any workload where reading is much more frequent than inserting in the middle.

## 3. How
The minimal state is `data`, `size`, and `capacity`.

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

Middle insertion or deletion shifts elements to preserve contiguity.

```text
insert(i, x):
  ensure capacity
  for k from size down to i + 1:
    data[k] = data[k - 1]
  data[i] = x
  size = size + 1
```

Typical cost model:

| Operation | Time |
| --- | --- |
| index read/write | `O(1)` |
| append | amortized `O(1)` |
| insert/delete at tail | `O(1)` amortized |
| insert/delete in middle | `O(n)` |
| search by value | `O(n)` unless kept sorted |

```mermaid
flowchart LR
  A[Append element] --> B{size < capacity?}
  B -- Yes --> C[Write at data[size]]
  B -- No --> D[Allocate larger block]
  D --> E[Copy old elements]
  E --> C
  C --> F[size = size + 1]
```

## 4. Better
Compared with linked lists, dynamic arrays trade expensive middle updates for much better locality and indexing. In practice that trade-off is often worth it because modern CPUs reward contiguous memory heavily.

Compared with fixed arrays, dynamic arrays add resize overhead and a slightly more complex implementation, but remove the need to know capacity upfront. Growth factors near `1.5` to `2` balance memory overhead against copy frequency.

If the array is kept sorted, binary search reduces lookup to `O(log n)`, but insertion remains `O(n)` because shifting is still required.

## 5. Beyond
Dynamic arrays are a poor fit when:

- the workload is dominated by frequent head insertion
- stable references or iterators must survive reallocation
- capacity spikes would waste too much memory

Production implementations add shrink policies, iterator invalidation rules, move semantics, and allocator tuning. The key engineering question is not only asymptotic complexity, but whether the resize policy and locality profile match the workload.
