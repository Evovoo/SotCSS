---
title: Complexity Analysis
---

## 1. What
Complexity analysis studies how an algorithm's resource usage grows with input size. The two most common dimensions are time complexity and space complexity, expressed asymptotically with notations such as `O`, `Theta`, and `Omega`.

Its purpose is not to predict an exact runtime on one machine, but to describe dominant growth trends so different algorithms can be compared at scale. For recursive algorithms, recurrence relations and tools like the Master Theorem become central.

## 2. Why
Complexity analysis matters because implementation detail alone does not explain scalability:

- an `O(n log n)` algorithm will eventually beat an `O(n^2)` one on large enough input
- memory growth can be as limiting as runtime
- asymptotic analysis guides data-structure and algorithm selection before optimization
- it prevents confusing local benchmark wins with real scalability

The key value is decision support: complexity gives a principled way to reason about future workload growth.

## 3. How
The standard workflow is:

1. identify the basic operation
2. count how many times it executes as a function of input size `n`
3. keep the dominant term and ignore constant factors for asymptotic comparison

For iterative code, loop nesting often reveals the shape directly. For recursive code, write a recurrence.

```text
T(n) = aT(n / b) + f(n)
```

This form is where the Master Theorem applies:

- `a`: number of subproblems
- `b`: shrink factor of each subproblem
- `f(n)`: non-recursive work per level

Core Master Theorem cases:

| Case | Condition | Result |
| --- | --- | --- |
| 1 | `f(n) = O(n^(log_b a - epsilon))` | `T(n) = Theta(n^(log_b a))` |
| 2 | `f(n) = Theta(n^(log_b a) log^k n)` | `T(n) = Theta(n^(log_b a) log^(k+1) n)` |
| 3 | `f(n) = Omega(n^(log_b a + epsilon))` with regularity | `T(n) = Theta(f(n))` |

Example: merge sort

```text
T(n) = 2T(n / 2) + O(n)
```

Here `a = 2`, `b = 2`, and `n^(log_b a) = n`, so it is Case 2 and yields `Theta(n log n)`.

## 4. Better
Complexity analysis is stronger than raw benchmarking for comparing growth, but weaker for predicting exact wall-clock performance. Cache effects, branch prediction, constant factors, and I/O cost can dominate real behavior for moderate input sizes.

Amortized analysis is often better than worst-case analysis for structures like dynamic arrays, where rare expensive operations are spread over many cheap ones. Average-case analysis is useful when input distributions are meaningful, but it can be misleading if the assumed distribution is unrealistic.

The Master Theorem is powerful but limited. It does not apply to every recurrence, especially irregular splits, subtractive recurrences, or dependencies like `T(n-1) + T(n-2)`.

## 5. Beyond
In production systems, asymptotic complexity must be combined with:

- workload shape
- memory hierarchy behavior
- concurrency effects
- external-system costs such as network or disk access

The real engineering question is not "what is the Big-O?" in isolation, but whether the dominant growth pattern matches the operating environment. Complexity analysis is a decision framework, not a substitute for system understanding.
