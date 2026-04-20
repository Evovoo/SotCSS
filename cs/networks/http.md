---
title: HTTP and HTTPS
---

## 1. What
HTTP is an application-layer protocol for request-response communication, most commonly used on the Web and in service APIs. HTTPS is HTTP carried over TLS, adding authentication, confidentiality, and integrity protection.

This topic is about application-layer semantics rather than packet forwarding: methods, headers, status codes, caching behavior, and secure session establishment.

## 2. Why
HTTP and HTTPS matter because they are the dominant interface for human-facing web systems and a large share of machine-to-machine APIs:

- they standardize request-response interaction
- they carry metadata through headers
- they support caches, proxies, and intermediaries
- HTTPS protects communication against eavesdropping and tampering

They are central not because they are the only application protocols, but because they define much of modern Internet interaction.

## 3. How
Basic HTTP exchange:

```text
client sends request line + headers + optional body
server returns status line + headers + optional body
```

Representative methods:

- `GET`
- `POST`
- `PUT`
- `DELETE`

Representative status classes:

- `2xx` success
- `3xx` redirection
- `4xx` client error
- `5xx` server error

HTTPS adds TLS:

```text
TCP connection established
TLS handshake authenticates server and negotiates keys
HTTP messages travel inside encrypted channel
```

Important application-layer ideas also include:

- stateless request-response semantics
- cookies and session tracking
- cache control
- content negotiation

## 4. Better
HTTP is simple, extensible, and proxy-friendly, which makes it ideal for interoperable distributed systems. HTTPS is better than plain HTTP for almost all public communication because it prevents passive observation and many forms of active manipulation.

The key distinction is between transport reliability and application semantics. TCP ensures ordered byte delivery; HTTP defines what those bytes mean as requests, responses, headers, and status codes.

HTTP/2 and HTTP/3 improve efficiency over older forms by multiplexing streams and reducing some overheads, but they keep the core request-response model.

## 5. Beyond
Modern HTTP ecosystems also involve:

- reverse proxies and CDNs
- REST versus RPC conventions
- header compression and multiplexing
- TLS termination at load balancers
- observability and tracing across services

The deeper lesson is that application protocols shape system architecture. HTTP is successful not only because it moves bytes, but because it standardizes interaction patterns across a huge ecosystem.
