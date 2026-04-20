---
title: Processes and Threads
---

## 1. What
Processes and threads are the operating system's basic execution abstractions. A process is an independent resource-owning unit with its own virtual address space and protection boundary. A thread is a schedulable execution path inside a process, sharing that process's memory and many resources.

This topic also includes process and thread state transitions, plus synchronization and mutual exclusion mechanisms used to coordinate concurrent execution safely.

## 2. Why
These abstractions matter because modern systems must run many tasks concurrently:

- processes isolate faults and resources
- threads enable parallel or overlapping execution within one application
- state models explain suspension, blocking, and wake-up behavior
- synchronization prevents races, lost updates, and inconsistent shared state

Without these ideas, it is impossible to reason clearly about responsiveness, throughput, or correctness in multi-tasking systems.

## 3. How
Typical process states:

- new
- ready
- running
- blocked or waiting
- terminated

Common state transitions:

```text
new -> ready
ready -> running
running -> blocked
blocked -> ready
running -> terminated
running -> ready
```

The last transition appears when preemption occurs.

Threads inside a process usually share:

- code section
- heap
- open files
- address space

But each thread keeps its own:

- program counter
- register set
- stack

Mutual exclusion is commonly implemented with locks, semaphores, monitors, or atomic instructions.

```text
lock(m)
critical section
unlock(m)
```

The core rule is that any shared mutable state accessed by multiple threads must be protected either by synchronization or by a design that eliminates sharing.

## 4. Better
Processes provide stronger isolation than threads, but creation and context switching are usually heavier. Threads are lighter and enable shared-memory cooperation, but that same sharing introduces races and visibility problems.

Synchronization mechanisms also have trade-offs:

- mutexes are simple for exclusive access
- semaphores are flexible for signaling and resource counting
- condition variables support waiting for state changes
- lock-free techniques reduce blocking but are harder to reason about

The main distinction is between concurrency for structure and parallelism for hardware speedup. Threads may serve either purpose, but correctness depends on explicit coordination.

## 5. Beyond
Real systems must also address:

- deadlock and starvation
- priority inversion
- memory visibility under hardware reordering
- user-level versus kernel-level threading

The deeper lesson is that concurrency is not just "run many things at once." It is a contract between the scheduler, the memory model, and the synchronization discipline used by the program.
