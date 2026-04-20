---
title: Deadlock Handling
---

## 1. What
Deadlock occurs when a set of processes each waits for resources held by others in the same set, so none of them can proceed. It is a liveness failure rather than a direct correctness error: the system state is valid, but progress stops.

Deadlock handling typically includes prevention, avoidance, detection, and recovery. The Banker's Algorithm is the classical deadlock-avoidance method.

## 2. Why
Deadlock matters because shared resources are everywhere:

- locks
- files
- devices
- memory segments
- database records

If a system allows arbitrary wait patterns without discipline, progress can halt in ways that are hard to debug and even harder to recover from safely.

## 3. How
The four classical necessary conditions for deadlock are:

- mutual exclusion
- hold and wait
- no preemption
- circular wait

Break any one of them and deadlock cannot occur.

Handling strategies:

| Strategy | Idea |
| --- | --- |
| prevention | structurally forbid one deadlock condition |
| avoidance | grant requests only if resulting state stays safe |
| detection | allow deadlock, then discover it |
| recovery | reclaim resources, roll back, or terminate tasks |

Banker's Algorithm uses:

- `Available`
- `Max`
- `Allocation`
- `Need = Max - Allocation`

Safety test sketch:

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

A request is granted only if the system remains in a safe state after hypothetical allocation.

## 4. Better
Prevention is conceptually simple but can waste resources or reduce concurrency. Avoidance is more flexible, but it requires advance knowledge of maximum demand, which many real systems cannot provide.

Detection and recovery are practical in environments like databases, where transactions can be rolled back. Banker's Algorithm is excellent pedagogically because it makes "safe state" explicit, but it is less common in general-purpose operating systems due to its assumptions and bookkeeping cost.

The important distinction is between deadlock and starvation. Deadlock means no process in the cycle can proceed; starvation means a process can theoretically proceed but is indefinitely postponed.

## 5. Beyond
Real systems often combine:

- lock ordering discipline
- timeout-based recovery
- wait-for graph analysis
- transaction abort or restart

The deeper lesson is that deadlock handling is a resource-allocation policy problem. The earlier the discipline is designed into the system, the less expensive recovery becomes.
