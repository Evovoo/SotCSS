---
title: DNS
---

## 1. What
DNS is the Domain Name System, a distributed naming system that maps human-readable domain names to network-usable information such as IP addresses. It is an application-layer protocol and a global hierarchical database.

Its core purpose is indirection: people and services can use stable names even when underlying addresses change.

## 2. Why
DNS matters because direct use of raw IP addresses does not scale well for humans or evolving infrastructure:

- names are easier to remember than addresses
- services can move without changing user-facing identifiers
- hierarchical delegation distributes administration
- caches reduce repeated lookup cost

Most Internet activity depends on DNS before any higher-level application request can even begin.

## 3. How
DNS is hierarchical:

- root
- top-level domains
- authoritative domains and subdomains

A typical lookup path:

```text
client asks recursive resolver
resolver checks cache
if miss:
  query root
  query TLD server
  query authoritative server
return answer to client
```

Common record types:

| Record | Meaning |
| --- | --- |
| `A` | IPv4 address |
| `AAAA` | IPv6 address |
| `CNAME` | alias to another name |
| `MX` | mail exchange server |
| `NS` | authoritative name server |

DNS responses also include TTL values, allowing caches to retain answers for limited time.

## 4. Better
DNS is better than centralized host tables because it scales through hierarchy, delegation, and caching. A distributed naming system can grow with the Internet in ways that a single authoritative file cannot.

However, caching introduces staleness trade-offs. Short TTLs improve update responsiveness but increase query traffic; long TTLs reduce load but delay propagation of changes.

The crucial distinction is between recursive resolution and authoritative service:

- recursive resolvers fetch answers on behalf of clients
- authoritative servers are the source of truth for a zone

## 5. Beyond
Modern DNS practice also involves:

- DNSSEC
- encrypted transports such as DoT and DoH
- load balancing through multiple records
- split-horizon or internal DNS
- resilience against cache poisoning or amplification abuse

The deeper lesson is that naming is infrastructure. DNS is not just a lookup table; it is a globally distributed control plane for reaching services by stable names.
