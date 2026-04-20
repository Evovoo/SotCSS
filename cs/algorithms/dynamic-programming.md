---
title: Dynamic Programming
---

## 1. What
Dynamic programming solves problems with overlapping subproblems and optimal substructure by storing intermediate results instead of recomputing them. The core idea is to transform exponential repeated search into polynomial systematic reuse.

Classic examples include the knapsack problem, longest common subsequence, longest increasing subsequence, edit distance, and many sequence optimization problems.

## 2. Why
DP matters because many brute-force recursive solutions waste time recomputing the same state:

- exponential search can often be reduced dramatically
- state transitions make problem structure explicit
- it supports optimization, counting, and feasibility variants
- many sequence and resource-allocation problems are naturally DP-shaped

The key is not "use a table", but correctly define state and transitions.

## 3. How
The standard workflow is:

1. define the state
2. derive the transition
3. identify the base case
4. choose computation order or memoization strategy

0/1 knapsack:

```text
dp[i][w] = max value using first i items with capacity w
```

Transition:

```text
if weight[i] > w:
  dp[i][w] = dp[i - 1][w]
else:
  dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weight[i]] + value[i])
```

Longest common subsequence:

```text
if s1[i] == s2[j]:
  dp[i][j] = dp[i - 1][j - 1] + 1
else:
  dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
```

DP styles:

| Style | Idea |
| --- | --- |
| memoization | top-down recursion + cache |
| tabulation | bottom-up iterative fill |
| rolling array | compress space using dependency locality |

## 4. Better
DP is better than naive recursion when subproblems overlap. It is different from greedy algorithms because greedy makes local decisions immediately, while DP compares multiple possibilities through stored state.

Compared with backtracking, DP is stronger when many search branches collapse into the same abstract state. Compared with divide and conquer, DP focuses on reuse rather than independence.

However, badly designed DP can become impractical because state space explodes. A correct transition is not enough if the state definition is too large.

## 5. Beyond
Advanced DP work includes:

- state compression
- monotonic queue or convex hull optimization
- interval DP
- tree DP
- bitmask DP

The deeper lesson is that DP is a modeling technique, not a fixed recipe. Most difficulty lies in recognizing the right state representation, not in writing the final loops.
