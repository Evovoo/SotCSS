---
title: I/O 系统
---

## 1. What
I/O 系统负责管理 CPU、内存和外部设备之间的通信。它的任务是在计算和外设之间高效、可靠地搬运数据，例如磁盘、网卡、键盘和显示设备。

教材中的核心内容包括程序控制 I/O、中断、DMA、缓冲以及设备控制器协作。

## 2. Why
I/O 之所以关键，是因为 CPU 通常远快于外部设备：

- 如果一直忙等，会浪费处理器时间
- 设备异步完成操作后必须能通知系统
- 吞吐依赖于“计算”和“数据传输”的重叠
- 各种不同设备需要统一抽象层来管理

如果 I/O 设计不好，整台机器就会被慢速外设和混乱的数据传输拖住。

## 3. How
经典数据传输方式主要有三类：

| Mode | Idea | CPU Involvement |
| --- | --- | --- |
| programmed I/O | CPU 反复轮询设备状态 | 高 |
| interrupt-driven I/O | 设备就绪后通过中断通知 CPU | 中 |
| DMA | 控制器直接在设备与内存间传输数据 | 传输期间较低 |

中断驱动 I/O 的流程大致是：

```text
device completes operation
device raises interrupt
CPU saves context
interrupt handler runs
OS acknowledges device and wakes waiting task
CPU resumes previous work
```

DMA 的流程大致是：

```text
CPU programs DMA controller
DMA transfers block between device and memory
DMA signals completion by interrupt
CPU handles completion
```

为了缓解速度不匹配并提升吞吐，系统还会加入 buffering、caching 和 spooling。

## 4. Better
当设备较慢或完成时间不可预测时，中断驱动 I/O 通常优于忙轮询，因为 CPU 可以在等待期间做别的工作。当然，在某些极高频、超低延迟场景里，如果中断开销太大，轮询仍可能更合适。

对于大块数据传输，DMA 明显优于 CPU 亲自搬运，因为它减少了处理器参与度，并允许传输与计算重叠。但 DMA 也有初始化成本，因此对很小的数据传输并不一定占优。

这里最核心的比较，是“重叠能力”和“控制开销”之间的关系：数据越大、等待越长，硬件辅助传输的价值通常越明显。

## 5. Beyond
现代 I/O 栈还会进一步涉及：

- interrupt coalescing
- zero-copy
- 内存映射设备访问
- 高性能网络中的 kernel bypass
- NVMe 或多队列设备模型

更深层的结论是：I/O 性能取决于整条路径，而不是单个接口。设备控制器、总线、中断模型、内核缓冲和应用访问模式会共同决定最终效果。
