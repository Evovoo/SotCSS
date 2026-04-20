## 1. What
- **Core Concept**: Redis 是一个以内存为核心的数据结构存储系统，常被用作缓存、消息中间层、轻量数据库和分布式协调组件。
- **Problem it Solves**: 它主要解决重复数据访问太慢、短生命周期共享状态难统一管理，以及跨进程快速通信时传统磁盘数据库过慢或过重的问题。

## 2. Why
- **Main Purpose**: 它通常用于以极低延迟存取数据，尤其适合缓存、会话存储、限流、队列、发布订阅和分布式锁等场景。
- **Key Benefits**:
  - Boosts productivity by 提供非常直接的命令模型，让开发者能快速实现缓存读取、计数器、过期控制和队列式流程。
  - Ensures consistency across environments/teams by 把临时共享状态集中到统一服务中，而不是散落在各个进程内存或临时文件里。

## 3. How
- **Workflow**: 建立连接 -> 写入或更新 key -> 快速读取 -> 通过过期或淘汰策略回收数据。
- **Quick Start**:
  1. Installation: `docker run --name redis -p 6379:6379 -d redis:7`
  2. Basic Usage:

```bash
redis-cli
SET user:1:name "Ada"
GET user:1:name
EXPIRE user:1:name 60
```

Redis 的核心不是只存“值”，而是直接提供多种数据结构。常见类型包括 string、hash、list、set、sorted set、stream 和位相关结构。因此它不只是能做缓存，也非常适合计数器、排行榜、去重、队列和事件流式处理。

## 4. Better
- **Comparison**: 相比 Memcached，Redis 支持更丰富的数据结构、持久化能力和消息模式。相比 PostgreSQL 或 MySQL，Redis 在热点 key 查询和临时状态处理上通常快得多，但它并不能替代持久关系建模和复杂查询能力。
- **Key Advantages**:
  - **Performance**: 由于数据主要驻留在内存中，而且命令针对低延迟访问做了优化，因此性能非常高。
  - **Developer Experience**: 上手快、跨语言支持成熟，并且在缓存、会话、限流和分布式协调等后端常见任务上非常实用。

## 5. Beyond
- **Ecosystem**: Redis 很容易接入现代技术栈中的 Web 框架、后台任务系统、API 网关、限流器、事件流水线和可观测性体系。它常与 PostgreSQL、MySQL、Kafka、Celery、Sidekiq、BullMQ、Spring、Django、Node.js 服务和 Go 服务配合使用。
- **Trade-offs**: 当业务强依赖持久关系数据、复杂分析查询，或者无法接受内存成本、淘汰策略、持久化与复制运维复杂度时，不应把 Redis 作为唯一数据真相来源。对于只需要极简单进程内缓存的小项目，它也可能是过度设计。
