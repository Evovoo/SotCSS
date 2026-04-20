---
title: Greedy Algorithms
---

## 1. What
Greedy algorithms build a solution step by step, always taking the locally best choice according to some rule. They do not reconsider earlier decisions once made.

This strategy works only when the problem has the greedy-choice property: a locally optimal move can still lead to a globally optimal solution.

## 2. Why
Greedy methods are attractive because they are often:

- simpler than dynamic programming
- faster and more memory efficient
- easier to implement and reason about operationally
- good matches for scheduling, selection, and optimization under matroid-like structure

When correct, greedy algorithms provide strong performance with low implementation complexity.

## 3. How
The usual design pattern is:

1. define a local ranking rule
2. repeatedly choose the best feasible candidate
3. prove that the local choice can be extended to a global optimum

Canonical examples:

- interval scheduling by earliest finishing time
- Huffman coding by repeatedly combining lowest-frequency nodes
- minimum spanning tree by safe-edge selection
- coin change in special currency systems

Interval scheduling sketch:

```text
sort intervals by finish time
pick first interval
for each next interval:
  if its start >= last selected finish:
    pick it
```

The key step is always the proof, usually by exchange argument or cut argument.

## 4. Better
Greedy algorithms are better than DP when the problem truly admits irrevocable local choices. They are better than backtracking when exhaustive search is unnecessary and a strong structural theorem exists.

But greedy is easy to misuse. Many problems look greedy but are not. For example, general coin change and many path optimization tasks require DP or graph algorithms because naive local choices fail globally.

The difference between "fast and elegant" and "wrong" is usually the proof, not the code.

## 5. Beyond
Practical greedy design often appears inside larger systems:

- approximation algorithms
- online algorithms
- heuristic scheduling
- local improvement within hybrid methods

The deeper lesson is that greediness is a property to be justified, not assumed. If you cannot explain why a local choice is safe, you probably do not yet have a greedy algorithm.
