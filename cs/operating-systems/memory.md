---
title: Memory Management
---

## 1. What
Memory management is the operating system's mechanism for allocating, protecting, translating, and reclaiming memory. It connects the program's logical view of memory with the hardware's physical memory and storage hierarchy.

Core textbook topics include paging, segmentation, virtual memory, page replacement, and locality-driven policies such as LRU.

## 2. Why
This topic matters because memory is both limited and shared:

- multiple processes must coexist safely
- programs expect more memory than physical RAM alone may provide
- relocation and protection must be enforced
- performance depends heavily on locality and page behavior

Memory management is where correctness, isolation, and performance meet.

## 3. How
Paging divides logical memory into fixed-size pages and physical memory into frames. Address translation typically works as:

```text
logical address = page number + offset
page number -> page table -> frame number
physical address = frame number + offset
```

Segmentation divides memory by logical meaning, such as code, stack, and data. Segments are variable-sized and align better with programmer-visible structure.

Virtual memory allows only part of a process to reside in RAM, moving inactive pages to secondary storage. On a page fault:

```text
access page
if page not in memory:
  trap to OS
  load page from disk
  possibly evict another page
  resume execution
```

LRU replaces the page that has not been used for the longest time, approximating locality-aware optimal behavior.

## 4. Better
Paging eliminates external fragmentation and simplifies allocation with fixed-size units, but it can cause internal fragmentation. Segmentation matches program structure more naturally, but variable-sized allocation suffers from fragmentation and more complex management.

Virtual memory is better than requiring all pages to be resident because it improves utilization and process isolation, but excessive page faults lead to thrashing. LRU is more locality-aware than FIFO, but exact LRU can be expensive, so many systems implement approximations like Clock.

The crucial distinction is between the abstraction of a large address space and the physical reality of limited RAM.

## 5. Beyond
Modern memory management also includes:

- TLB behavior
- huge pages
- copy-on-write
- NUMA-aware placement
- memory-mapped files

The deeper lesson is that memory is not just storage; it is a latency hierarchy. Good memory management works because it aligns protection and translation mechanisms with locality in real workloads.
