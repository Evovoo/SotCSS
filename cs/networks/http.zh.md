---
title: HTTP 与 HTTPS
---

## 1. What
HTTP 是一种应用层请求-响应协议，最常见于 Web 和各种服务 API。HTTPS 则是在 TLS 之上传输的 HTTP，为通信增加身份认证、保密性和完整性保护。

这个主题关注的是应用层语义，而不是底层分组转发：例如方法、头部、状态码、缓存行为以及安全会话建立。

## 2. Why
HTTP 和 HTTPS 之所以重要，是因为它们已经成为现代 Web 系统和大量机器间 API 的主导接口：

- 它们统一了请求-响应交互方式
- 通过头部携带元数据
- 支持缓存、代理和各种中间层
- HTTPS 能防止窃听和篡改

它们的重要性不在于“唯一”，而在于它们塑造了现代互联网的大量交互模式。

## 3. How
一个基本的 HTTP 交换过程可以概括为：

```text
client sends request line + headers + optional body
server returns status line + headers + optional body
```

常见方法包括：

- `GET`
- `POST`
- `PUT`
- `DELETE`

常见状态码类别包括：

- `2xx` success
- `3xx` redirection
- `4xx` client error
- `5xx` server error

HTTPS 的关键是增加 TLS：

```text
TCP connection established
TLS handshake authenticates server and negotiates keys
HTTP messages travel inside encrypted channel
```

此外还要理解这些应用层概念：

- 无状态请求-响应
- cookie 与会话跟踪
- 缓存控制
- 内容协商

## 4. Better
HTTP 简单、可扩展、便于代理介入，因此非常适合构建互操作性强的分布式系统。对于几乎所有公开通信场景，HTTPS 都明显优于明文 HTTP，因为它能防止被动监听和很多主动篡改。

这里要区分传输层可靠性和应用层语义。TCP 保证字节流按序可靠到达；HTTP 规定这些字节该如何被解释为请求、响应、头部和状态码。

HTTP/2 与 HTTP/3 在多路复用和开销控制上比旧版本更高效，但它们仍保留了 HTTP 的核心请求-响应模型。

## 5. Beyond
现代 HTTP 生态还会涉及：

- 反向代理与 CDN
- REST 与 RPC 风格差异
- 头部压缩与多路复用
- 在负载均衡处做 TLS termination
- 跨服务链路中的可观测性与 tracing

更深层的结论是：应用层协议会反过来塑造系统架构。HTTP 的成功，不只是因为它能传输数据，更因为它标准化了一个巨大的交互生态。
