---
title: Linked List
---

## 1. What
Linked lists are linear lists whose elements are connected by pointers rather than stored contiguously. Each node contains data and one or more links to neighboring nodes.

Common variants include singly linked lists, doubly linked lists, and circular linked lists. Their core property is that structural modification is performed by reconnecting links instead of shifting large contiguous blocks.

## 2. Why
Linked lists are useful when:

- insertion and deletion at known positions are frequent
- contiguous memory is hard to obtain
- queue-like or free-list style node chaining is needed
- node ownership and structural splicing matter more than indexing

They appear in adjacency-list graphs, LRU cache internals, memory allocators, and intrusive container designs.

## 3. How
A singly linked node can be modeled as:

```text
node = {
  value,
  next
}
```

Head insertion is simple because no element shifting is required.

```text
push_front(x):
  p = new node(x)
  p.next = head
  head = p
```

Deleting a node after a known predecessor is also local:

```text
delete_after(prev):
  target = prev.next
  prev.next = target.next
  free(target)
```

Operation profile:

| Operation | Time |
| --- | --- |
| access by index | `O(n)` |
| insert/delete at head | `O(1)` |
| insert/delete after known node | `O(1)` |
| search by value | `O(n)` |
| backward traversal in singly list | not supported directly |

## 4. Better
Compared with dynamic arrays, linked lists avoid bulk movement on insertion and deletion, but pay for it with poor cache locality and no efficient random indexing.

Doubly linked lists improve deletion and backward traversal at the cost of extra memory per node and more pointer maintenance. Circular lists simplify repeated traversal and some queue structures because the tail can point back to the head.

The important distinction is that an `O(1)` insertion claim usually assumes the target position is already located. If locating that position takes linear time, the total operation is still `O(n)`.

## 5. Beyond
Linked lists are often overused in introductory material and underused in performance-critical array-dominated workloads. They fit best when node-level splicing is the real requirement.

Typical pitfalls include pointer bugs, fragmented memory, allocator overhead, and poor branch prediction. In managed runtimes, many tiny node objects also create GC pressure, so the theoretical insert/delete advantage may disappear in practice.
