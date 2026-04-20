---
title: CPU Scheduling
---

## 1. What
CPU scheduling decides which ready task should run next on the processor. It is one of the operating system's central control problems because CPU time is a scarce shared resource.

Classic scheduling policies include FCFS, SJF, SRTF, Priority Scheduling, Round Robin, and multilevel feedback queue strategies.

## 2. Why
Scheduling matters because different policies optimize different goals:

- low average waiting time
- fast response for interactive tasks
- fairness among processes
- high CPU utilization
- predictable service under mixed workloads

A scheduler is not just choosing "who runs next"; it is enforcing a system-wide trade-off among throughput, latency, and fairness.

## 3. How
Common metrics:

- turnaround time
- waiting time
- response time
- throughput
- CPU utilization

Representative algorithms:

| Algorithm | Idea | Strength | Risk |
| --- | --- | --- | --- |
| FCFS | run in arrival order | simple | convoy effect |
| SJF | pick shortest job | low average waiting | needs burst estimate |
| SRTF | preemptive SJF | better response than SJF | more switching |
| Priority | highest priority first | policy flexibility | starvation |
| Round Robin | fixed time slice rotation | good interactivity | quantum tuning |

Round Robin sketch:

```text
put all ready tasks in queue
run head task for one quantum
if task finishes:
  remove it
else:
  move it to queue tail
```

Multilevel feedback queues adjust priority based on observed behavior, often favoring short interactive jobs while still allowing long CPU-bound work to make progress.

## 4. Better
No single scheduling algorithm is best for all workloads. FCFS is simple but performs poorly when long CPU-bound jobs delay short ones. SJF minimizes average waiting time in theory, but real systems rarely know exact CPU bursts in advance.

Round Robin is better for time-sharing systems because it gives each process regular access to the CPU. Priority scheduling supports differentiated service, but without aging it can starve low-priority tasks.

Modern schedulers are usually hybrids because real workloads mix interactive tasks, background computation, and kernel activity.

## 5. Beyond
Production scheduling also deals with:

- multi-core load balancing
- cache affinity
- real-time deadlines
- NUMA locality
- virtualization layers

The broader lesson is that scheduling is policy encoded in mechanism. The right algorithm depends on what the system promises to users: fairness, responsiveness, predictability, or throughput.
