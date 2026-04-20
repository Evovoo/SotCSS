---
title: Network Layer
---

## 1. What
The network layer is responsible for logical addressing and forwarding packets across multiple links and intermediate routers. In the Internet, this role is centered on IP.

Core topics include IP packet delivery, subnetting, forwarding, fragmentation concepts, and routing algorithms that decide how packets should move through the network.

## 2. Why
The network layer matters because communication usually spans many local networks rather than a single shared medium:

- hosts need globally meaningful logical addresses
- routers must choose next hops
- path selection affects reachability and efficiency
- packet forwarding must work across heterogeneous link technologies

Without the network layer, communication would remain limited to local link segments.

## 3. How
IP provides a best-effort, connectionless packet service. It does not guarantee delivery, order, or timing; it only defines how packets are addressed and forwarded.

Key IP ideas:

- source and destination IP addresses
- TTL or hop limit to prevent infinite looping
- routing tables for next-hop decisions
- subnet masks or prefixes for address aggregation

Router forwarding sketch:

```text
receive packet
inspect destination IP
perform longest-prefix match in routing table
choose next hop and outgoing interface
decrement TTL
forward packet
```

Routing algorithms may be:

- distance-vector, where routers exchange distance estimates
- link-state, where routers learn topology and run shortest-path computation

Conceptually:

| Routing Style | Core Idea |
| --- | --- |
| distance-vector | "how far is each destination from me?" |
| link-state | "what is the topology, and what path should I compute?" |

## 4. Better
IP is deliberately simple compared with transport protocols because it prioritizes scalable interconnection over end-to-end guarantees. That design makes it flexible across many media and upper-layer protocols.

Distance-vector routing is simpler but more vulnerable to slow convergence and count-to-infinity style problems. Link-state routing is more information-rich and often converges more predictably, but it requires wider topology dissemination and more computation.

The main distinction is between forwarding and routing. Forwarding is the local act of sending a packet to the next hop; routing is the broader control process that decides what those next hops should be.

## 5. Beyond
Modern network-layer practice also involves:

- IPv4 versus IPv6
- NAT and address translation
- MPLS and traffic engineering
- policy-based routing
- SDN controller influence on forwarding rules

The deeper lesson is that the network layer provides reachability under incomplete information and changing topology. Its design is a balance among scalability, simplicity, and control.
