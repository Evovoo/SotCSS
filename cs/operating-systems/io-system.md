---
title: I/O Systems
---

## 1. What
I/O systems manage communication between the CPU, memory, and external devices. Their job is to move data reliably and efficiently between computation and peripherals such as disks, network cards, keyboards, and displays.

Core textbook topics include programmed I/O, interrupts, DMA, buffering, and device-controller coordination.

## 2. Why
I/O matters because the CPU is much faster than most external devices:

- direct busy waiting wastes processor time
- asynchronous device completion must be noticed
- throughput depends on overlapping computation with data transfer
- device diversity requires a uniform abstraction layer

Without a good I/O system, the whole machine becomes bottlenecked by slow peripherals and poorly coordinated transfers.

## 3. How
Three classic data-transfer modes:

| Mode | Idea | CPU Involvement |
| --- | --- | --- |
| programmed I/O | CPU polls device status repeatedly | high |
| interrupt-driven I/O | device interrupts CPU when ready | moderate |
| DMA | controller transfers data directly between device and memory | low during transfer |

Interrupt flow:

```text
device completes operation
device raises interrupt
CPU saves context
interrupt handler runs
OS acknowledges device and wakes waiting task
CPU resumes previous work
```

DMA flow:

```text
CPU programs DMA controller
DMA transfers block between device and memory
DMA signals completion by interrupt
CPU handles completion
```

Buffering, caching, and spooling are added to smooth speed mismatches and improve throughput.

## 4. Better
Interrupt-driven I/O is better than busy polling when devices are relatively slow or unpredictable, because the CPU can do useful work while waiting. Polling may still be better in some high-frequency low-latency settings where interrupt overhead is too large.

DMA is better than CPU-driven copying for large block transfers because it reduces processor involvement and allows overlap. However, DMA setup overhead means it is not automatically best for tiny transfers.

The key comparison is about overlap and control cost: the more data and delay involved, the more valuable hardware-assisted transfer becomes.

## 5. Beyond
Modern I/O stacks also involve:

- interrupt coalescing
- zero-copy techniques
- memory-mapped device access
- kernel bypass in high-performance networking
- queue-based NVMe or multi-queue device models

The deeper lesson is that I/O performance depends on the whole path: device controller, bus, interrupt model, kernel buffering, and application access pattern all interact.
