---
title: 栈与队列
---

## 1. What
栈和队列都是受限的线性结构。栈遵循后进先出，队列遵循先进先出。它们的重要性不只是“操作少”，而是通过限制访问方式，让很多算法模型更清晰。

栈适合表达式处理、递归模拟和回溯；队列适合缓冲、调度、层序遍历以及生产者-消费者协作。

## 2. Why
这两类结构的价值恰恰来自约束本身：

- 栈能把嵌套结构显式化
- 队列能保持到达顺序
- 两者的基本操作通常都能做到 `O(1)`
- 从编译器到操作系统都大量使用它们

循环队列尤其关键，因为固定大小的数组缓冲区可以重复利用已出队的空间，而不必整体搬移元素。

## 3. How
栈的基本操作可以写成：

```text
push(x):
  top = top + 1
  data[top] = x

pop():
  x = data[top]
  top = top - 1
  return x
```

循环队列依赖模运算完成“绕回”：

```text
enqueue(x):
  if (rear + 1) mod capacity == front:
    error "full"
  data[rear] = x
  rear = (rear + 1) mod capacity

dequeue():
  if front == rear:
    error "empty"
  x = data[front]
  front = (front + 1) mod capacity
  return x
```

表达式求值通常使用两个栈：一个存操作数，一个存操作符。

```text
for each token:
  if operand: push operand stack
  if operator:
    while operator stack top has higher or equal precedence:
      apply top operator to top two operands
    push current operator
drain operator stack
```

## 4. Better
栈和队列既可以用数组实现，也可以用链表实现。数组实现局部性更好、额外开销更低；链式实现则更容易自然扩展，不必整体搬迁缓冲区。

循环队列明显优于朴素数组队列，因为朴素实现一旦不断出队，要么浪费前面的空间，要么需要搬移元素。双端队列进一步把两端都开放出来，成为单调队列、滑动窗口等算法的基础。

在表达式求值里，基于栈的算符优先处理比先完整建语法树再求值更直接，特别适合规则相对简单的表达式系统。

## 5. Beyond
这些结构在工程上有不少边界问题：

- 深递归或定长栈导致栈溢出
- 循环队列里“队满”和“队空”的判定细节
- 并发生产者和消费者场景下需要同步机制

在系统软件里，ring buffer 是专门为吞吐和缓存行为优化的队列变体；在编译器和解释器里，栈纪律还会直接影响调用约定、异常展开和虚拟机执行模型。
