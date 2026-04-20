---
title: Recursion and Divide and Conquer
---

## 1. What
Recursion solves a problem by expressing it in terms of smaller instances of itself. Divide and conquer is a structured recursive strategy: divide the original problem into subproblems, solve them recursively, then combine their results.

Not every recursive algorithm is divide and conquer, but divide and conquer is one of the most important uses of recursion. Merge sort, quick sort, and many tree algorithms are canonical examples.

## 2. Why
This approach matters because it can turn a large, difficult problem into repeated instances of a simpler one:

- problem structure becomes easier to express
- correctness proofs often become cleaner
- parallel subproblem execution is often possible
- many asymptotically efficient algorithms are naturally recursive

It is especially effective when subproblems are independent and the combine step is manageable.

## 3. How
The standard shape is:

```text
solve(problem):
  if small enough:
    return base answer
  split into subproblems
  solve each subproblem recursively
  combine partial answers
```

Merge sort is the textbook example:

```text
mergeSort(a):
  if length(a) <= 1:
    return a
  split a into left and right
  left = mergeSort(left)
  right = mergeSort(right)
  return merge(left, right)
```

This leads to the recurrence:

```text
T(n) = 2T(n / 2) + O(n)
```

Quick sort uses the same high-level idea, but the combine step is trivial and the partition step determines balance:

```text
quickSort(a, l, r):
  if l >= r:
    return
  p = partition(a, l, r)
  quickSort(a, l, p - 1)
  quickSort(a, p + 1, r)
```

## 4. Better
Recursion can be clearer than iteration when the problem is inherently hierarchical, such as trees, grammars, or repeated subdivision. Divide and conquer is better than brute force when problem decomposition reduces total work or organizes it into logarithmic depth.

However, recursion adds call-stack overhead, and poorly balanced divide-and-conquer strategies can collapse into bad complexity. Quick sort illustrates this well: average `O(n log n)`, worst-case `O(n^2)` if pivots are poor.

Dynamic programming differs from divide and conquer because DP reuses overlapping subproblems, while classic divide and conquer assumes subproblems are mostly independent.

## 5. Beyond
In real systems, recursion must account for:

- stack depth limits
- tail-call optimization availability
- iterative reformulation when recursion is too deep
- parallel scheduling cost in multi-core divide-and-conquer implementations

The big lesson is structural fit: recursion is powerful when the problem already has recursive shape. If the recursive form only obscures state and increases overhead, an iterative design is often better.
