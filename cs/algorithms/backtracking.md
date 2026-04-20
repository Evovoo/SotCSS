---
title: Backtracking
---

## 1. What
Backtracking is a systematic search method that incrementally builds candidate solutions and abandons a branch as soon as it can be proven invalid or unpromising.

It is essentially depth-first search over a decision tree with pruning. Classic problems include permutations, subsets, Sudoku, and N-Queens.

## 2. Why
Backtracking matters because many combinatorial problems cannot be solved by simple local decisions:

- constraints interact across many positions
- feasible solutions may be sparse
- exhaustive search is possible in principle but too expensive without pruning
- it gives a structured way to explore possibilities and cut bad branches early

Its power comes from pruning, not from raw enumeration.

## 3. How
The general shape is:

```text
search(state):
  if state is complete:
    record solution
    return
  for each choice:
    if choice is valid:
      apply choice
      search(next state)
      undo choice
```

N-Queens is the standard example. Place one queen per row, and ensure no two queens share a column or diagonal.

```text
place(row):
  if row == n:
    report solution
    return
  for col from 0 to n - 1:
    if col and diagonals are free:
      mark column and diagonals
      place(row + 1)
      unmark column and diagonals
```

Useful pruning structures:

- used-column array
- main-diagonal set indexed by `row - col`
- anti-diagonal set indexed by `row + col`

## 4. Better
Backtracking is better than brute force because it uses constraints to stop exploring impossible branches early. It is better than greedy when local choices cannot guarantee correctness, and better than DP when states do not overlap enough to justify memoization.

However, worst-case complexity is still often exponential. A backtracking algorithm with weak pruning remains impractical on large instances.

Branch ordering can matter a lot. Choosing the most constrained variable first often reduces the search tree dramatically.

## 5. Beyond
More advanced search techniques extend backtracking with:

- constraint propagation
- branch and bound
- bitset acceleration
- heuristic ordering

The real lesson is that backtracking is not "try everything"; it is "try only what still has a chance." The better your pruning model, the more useful the method becomes.
