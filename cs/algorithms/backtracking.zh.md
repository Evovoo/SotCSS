---
title: 回溯算法
---

## 1. What
回溯是一种系统化搜索方法：逐步构造候选解，一旦发现当前分支已经不合法或不再有希望，就立刻撤销并返回上一步。

本质上，它就是在决策树上做带剪枝的深度优先搜索。经典问题包括排列、子集、数独和 N 皇后。

## 2. Why
回溯之所以重要，是因为很多组合问题无法靠简单的局部最优选择解决：

- 约束会跨多个位置相互影响
- 可行解可能非常稀疏
- 理论上可以穷举，但不剪枝就成本过高
- 它提供了一种有结构的“尝试并尽早放弃错误分支”的方式

它真正的力量来自剪枝，而不是无脑遍历。

## 3. How
它的一般形态是：

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

N 皇后是最经典的例子。思路是每一行放一个皇后，并保证任意两个皇后不在同列、同主对角线、同副对角线上。

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

常见剪枝辅助结构包括：

- 列是否占用数组
- 主对角线集合，通常用 `row - col` 编码
- 副对角线集合，通常用 `row + col` 编码

## 4. Better
回溯优于朴素暴力，是因为它会利用约束提前终止不可能成功的分支。当地部决策无法保证正确性时，它比贪心更可靠；当状态重叠又不足以支撑 DP 时，它也比硬套动态规划更自然。

但回溯的最坏复杂度通常仍然是指数级。如果剪枝能力很弱，即使代码结构正确，也会在大规模输入上失去实用性。

分支顺序往往非常关键。先处理“约束最强”的变量，通常能显著缩小搜索树。

## 5. Beyond
更高级的搜索方法通常会在回溯基础上继续增强：

- 约束传播
- branch and bound
- 位运算或 bitset 加速
- 启发式变量选择

真正应当理解的是：回溯不是“什么都试一遍”，而是“只继续尝试那些还有可能成功的分支”。剪枝模型越强，它就越实用。
