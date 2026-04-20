---
title: Transport Layer
---

## 1. What
The transport layer provides end-to-end communication services between processes running on different hosts. Its job is to take the best-effort packet service of the network layer and expose process-level communication semantics such as reliability, ordering, multiplexing, and flow control.

The core textbook contrast is between TCP and UDP, along with TCP connection management and congestion control.

## 2. Why
The transport layer matters because applications do not communicate as anonymous hosts; they communicate as endpoints with specific service expectations:

- some applications need reliable ordered delivery
- some prioritize low latency and can tolerate loss
- many application sessions must share one host's network stack
- sender rate must be coordinated with both receiver capacity and network conditions

This is the layer where end-to-end policy becomes explicit.

## 3. How
TCP provides:

- connection-oriented communication
- reliable in-order byte stream delivery
- retransmission and acknowledgment
- flow control
- congestion control

TCP connection establishment uses the three-way handshake:

```text
client -> SYN
server -> SYN + ACK
client -> ACK
```

Connection teardown typically uses FIN exchange.

Congestion control evolves the sending rate using ideas such as:

- slow start
- congestion avoidance
- fast retransmit
- fast recovery

UDP provides:

- connectionless delivery
- message-oriented transport
- no built-in reliability or ordering guarantee
- low protocol overhead

Port numbers allow multiplexing:

```text
(source IP, source port, destination IP, destination port)
```

This tuple identifies a transport conversation.

## 4. Better
TCP is better when correctness depends on reliable ordered delivery, such as web transfer, file transfer, or database protocols. UDP is better when low latency, custom reliability, or simple request-response messaging is more important than built-in guarantees.

TCP's strength is convenience and correctness under loss, but that comes with handshake overhead, retransmission latency, and head-of-line blocking. UDP is lightweight, but the application must handle loss, duplication, pacing, and sometimes congestion behavior itself.

The most important distinction is between flow control and congestion control:

- flow control protects the receiver
- congestion control protects the network

## 5. Beyond
Modern transport work also includes:

- QUIC over UDP
- selective acknowledgments
- BBR and other congestion-control variants
- NAT traversal issues
- tail latency under retransmission

The deeper lesson is that transport protocols are not just packet wrappers. They encode assumptions about trust, latency, fairness, and failure on the end-to-end path.
