---
title: 分层模型与 TCP/IP
---

## 1. What
计算机网络通常通过分层模型来理解，把通信系统拆成若干相互协作的抽象层。最常见的教学模型是 OSI 和 TCP/IP。

OSI 有七层；TCP/IP 常按四层或五层来描述，取决于教材口径。这些模型并不是说现实实现一定严格按层隔离，而是提供一种理解职责、接口和协议组合方式的框架。

## 2. Why
分层模型之所以重要，是因为网络通信过于复杂，不能把它当成一个整体黑箱来理解：

- 每一层只处理更聚焦的问题
- 实现可以在稳定接口后独立演进
- 协议更容易比较和排障
- 教学、标准化和故障分析都依赖共同结构

它最大的价值在于关注点分离。路由、可靠性、地址和应用语义可以先分别理解，再组合成完整端到端通信路径。

## 3. How
OSI 七层：

1. Physical
2. Data Link
3. Network
4. Transport
5. Session
6. Presentation
7. Application

TCP/IP 常见分层：

1. Link
2. Internet
3. Transport
4. Application

常见对应关系：

| OSI | TCP/IP | Example Responsibility |
| --- | --- | --- |
| Physical + Data Link | Link | 本地传输、成帧、MAC |
| Network | Internet | IP 编址与转发 |
| Transport | Transport | 端到端传输 |
| Session + Presentation + Application | Application | 协议语义和应用数据 |

封装过程大致是：

```text
application data
-> transport header added
-> network header added
-> link header/trailer added
-> bits transmitted
```

接收端则按相反顺序解封装。

## 4. Better
OSI 更适合作为教学模型，因为它把职责切得更细、更规范；TCP/IP 更适合作为工程模型，因为它和真实互联网协议栈更直接对应。

分层模型的价值在于帮助建立边界，但现实系统经常会打破这些边界。比如防火墙会检查传输层和应用层内容，网卡会做传输层卸载，加密隧道又会让中间设备看不到更高层信息。

真正重要的理解是：分层首先是一种抽象纪律，而不是不可违反的物理法则。

## 5. Beyond
现代网络还通过下面这些机制进一步模糊严格分层：

- middleboxes
- 隧道和 overlay 网络
- TLS termination
- 软件定义网络
- 无线与移动场景下的跨层优化

更深层的结论是：即使真实系统会跨层优化，分层模型仍然不可替代，因为它大幅降低了理解和设计网络系统的复杂度。
