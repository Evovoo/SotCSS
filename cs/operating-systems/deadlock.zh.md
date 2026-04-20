---
title: 死锁处理
---

## 1. What
死锁是指一组进程彼此等待对方持有的资源，导致这一组进程都无法继续推进。它本质上是一种活性失败，不是状态错误，而是系统不再前进。

死锁处理通常包括预防、避免、检测和恢复。银行家算法是最经典的死锁避免方法。

## 2. Why
死锁之所以重要，是因为共享资源在系统中无处不在：

- 锁
- 文件
- 设备
- 内存段
- 数据库记录

如果系统允许资源请求和等待关系任意交织，而没有明确纪律，就可能进入难以排查、也难以安全恢复的停滞状态。

## 3. How
死锁成立通常要同时满足四个必要条件：

- mutual exclusion
- hold and wait
- no preemption
- circular wait

只要破坏其中任意一个，死锁就无法形成。

常见处理策略：

| Strategy | Idea |
| --- | --- |
| prevention | 从结构上破坏某个必要条件 |
| avoidance | 只有在系统仍安全时才批准资源请求 |
| detection | 先允许死锁发生，再检测 |
| recovery | 回收资源、回滚或终止任务 |

银行家算法维护以下数据：

- `Available`
- `Max`
- `Allocation`
- `Need = Max - Allocation`

安全性检测的大致过程：

```text
work = available
finish[i] = false for all i
while there exists i with finish[i] = false and need[i] <= work:
  work = work + allocation[i]
  finish[i] = true
if all finish[i] are true:
  state is safe
else:
  state is unsafe
```

只有在“假设分配后系统仍处于安全状态”时，新的资源请求才会被批准。

## 4. Better
预防策略概念清晰，但往往会浪费资源、降低并发性。避免策略更灵活，但要求系统事先知道各进程的最大资源需求，而这在很多真实系统里并不现实。

检测与恢复更适合数据库事务这类可以回滚的环境。银行家算法在教学上非常好，因为它把“安全状态”这个概念讲得非常明确；但在通用操作系统里，由于假设较强且维护成本高，并不常直接采用。

还要注意区分死锁和饥饿。死锁意味着环中的进程都无法推进；饥饿则是某个进程理论上可以推进，但长期得不到资源或调度机会。

## 5. Beyond
真实系统通常会组合多种策略：

- 锁顺序约束
- 基于超时的恢复
- wait-for graph 分析
- 事务中止或重启

更深层的结论是：死锁处理本质上是资源分配策略问题。越早把纪律设计进系统，后期恢复成本就越低。
