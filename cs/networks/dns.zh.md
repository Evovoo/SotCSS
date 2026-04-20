---
title: DNS
---

## 1. What
DNS 是 Domain Name System，即域名系统。它是一套分布式命名系统，用来把人类更容易理解的域名映射到 IP 地址等网络可用信息。它既是应用层协议，也是一套全球层级式数据库。

它最核心的价值在于间接性：人和服务可以使用稳定名称，而底层地址可以变化。

## 2. Why
DNS 之所以重要，是因为直接使用裸 IP 地址对人和基础设施演进都不友好：

- 名字比地址更容易记忆
- 服务迁移时不必改用户入口
- 层级委派使管理可以分散
- 缓存能减少重复查询成本

绝大多数互联网访问，在真正发起上层应用请求前，都要先经过 DNS 解析。

## 3. How
DNS 采用层级结构：

- 根
- 顶级域
- 权威域与子域

一次典型解析流程大致是：

```text
client asks recursive resolver
resolver checks cache
if miss:
  query root
  query TLD server
  query authoritative server
return answer to client
```

常见记录类型包括：

| Record | Meaning |
| --- | --- |
| `A` | IPv4 地址 |
| `AAAA` | IPv6 地址 |
| `CNAME` | 指向另一个名字的别名 |
| `MX` | 邮件交换服务器 |
| `NS` | 权威域名服务器 |

DNS 响应里还会带 TTL，告诉缓存这个结果可以保留多久。

## 4. Better
相比集中式主机表，DNS 通过层级、委派和缓存实现了可扩展性。互联网规模下，分布式命名系统远比单一集中式文件更可行。

但缓存也带来“过期与一致性”的取舍。TTL 短，更新传播更快，但查询流量更大；TTL 长，系统负载更低，但变更生效更慢。

这里最重要的区分之一是递归解析和权威服务：

- recursive resolver 代替客户端去找答案
- authoritative server 是某个 zone 的真相来源

## 5. Beyond
现代 DNS 实践还会进一步涉及：

- DNSSEC
- DoT 和 DoH 这类加密传输
- 利用多条记录做负载均衡
- 内外网分离解析
- 防御缓存投毒和放大攻击

更深层的结论是：命名本身就是基础设施。DNS 不只是一个查询表，而是一个让服务通过稳定名称可被找到的全球分布式控制平面。
