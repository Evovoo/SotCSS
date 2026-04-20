---
title: Layered Models and TCP/IP
---

## 1. What
Computer networks are usually understood through layered models that divide communication into cooperating levels of abstraction. The two most common teaching models are OSI and TCP/IP.

The OSI model has seven layers, while the TCP/IP model is typically described with four or five layers depending on presentation. These models do not claim that every real implementation is perfectly separated; they provide a conceptual way to reason about responsibilities, interfaces, and protocol composition.

## 2. Why
Layered models matter because network communication is too complex to understand as one monolithic mechanism:

- each layer focuses on a narrower problem
- implementations can evolve behind stable interfaces
- protocols become easier to compare and debug
- teaching, standardization, and troubleshooting all depend on shared structure

The key benefit is separation of concerns. Routing, reliability, addressing, and application semantics can be discussed independently before being recombined into a full end-to-end path.

## 3. How
OSI layers:

1. Physical
2. Data Link
3. Network
4. Transport
5. Session
6. Presentation
7. Application

TCP/IP is usually grouped as:

1. Link
2. Internet
3. Transport
4. Application

Typical mapping:

| OSI | TCP/IP | Example Responsibility |
| --- | --- | --- |
| Physical + Data Link | Link | local transmission, framing, MAC |
| Network | Internet | IP addressing and forwarding |
| Transport | Transport | end-to-end delivery |
| Session + Presentation + Application | Application | protocol semantics and application data |

Encapsulation flow:

```text
application data
-> transport header added
-> network header added
-> link header/trailer added
-> bits transmitted
```

At the receiver, decapsulation removes headers in reverse order.

## 4. Better
OSI is better as a pedagogical reference because it separates roles more finely and cleanly. TCP/IP is better as an engineering model because it aligns more directly with the protocols that actually dominate the Internet.

The models are useful because they show boundaries, but real systems blur them. Firewalls inspect transport and application data, NICs offload transport work, and encrypted tunnels can hide information from intermediate layers.

The important lesson is that layering is an abstraction discipline, not a rigid physical law.

## 5. Beyond
Modern networking complicates strict layering through:

- middleboxes
- tunneling and overlays
- TLS termination
- software-defined networking
- cross-layer optimization in wireless or mobile systems

The deeper lesson is that layered models remain essential because they simplify reasoning, even when real implementations optimize across boundaries.
