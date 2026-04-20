---
title: Stacks and Queues
---

## 1. What
Stacks and queues are restricted linear structures. A stack follows LIFO, while a queue follows FIFO. Their importance comes from constraining access patterns so that algorithms become easier to model and reason about.

Stacks support expression processing, recursion simulation, and backtracking. Queues support buffering, scheduling, level-order traversal, and producer-consumer coordination.

## 2. Why
These structures are valuable because the constraint is the feature:

- stacks make nested structure explicit
- queues preserve arrival order
- both can often be implemented in `O(1)` per basic operation
- both appear everywhere from parsers to operating systems

Circular queues are especially important because a fixed-size buffer can reuse freed slots without shifting elements.

## 3. How
Basic stack operations:

```text
push(x):
  top = top + 1
  data[top] = x

pop():
  x = data[top]
  top = top - 1
  return x
```

Circular queue operations use modular arithmetic:

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

Expression evaluation often uses two stacks, one for operands and one for operators.

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
Stacks and queues can be implemented either with arrays or linked lists. Arrays offer locality and low overhead; linked implementations allow natural growth without whole-buffer reallocation.

Circular queues are better than naive array queues because naive dequeue would otherwise force shifting or waste leading space. Deques generalize both ends and become the basis of monotonic queues and sliding-window algorithms.

For expression evaluation, operator-precedence parsing with stacks is more direct than building a full syntax tree first when the grammar is simple.

## 5. Beyond
Edge cases matter:

- stack overflow in deep recursion or bounded stacks
- queue full/empty distinction in circular implementations
- concurrent producers and consumers requiring synchronization

In systems work, ring buffers are queue variants tuned for throughput and cache behavior. In compilers and interpreters, stack discipline influences calling conventions, exception unwinding, and virtual machine design.
