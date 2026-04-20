## 1. What
- **Core Concept**: Kafka 是一个分布式事件流平台，也是一个可持久化的追加式日志系统，常用于高吞吐消息传输、事件分发和流式处理。
- **Problem it Solves**: 它主要解决在分布式系统中，如何可靠地在多个服务和团队之间传输大量事件，同时避免生产者与消费者紧耦合，并尽量保留顺序性、可持久化和可回放能力。

## 2. Why
- **Main Purpose**: 它通常用于发布、存储、回放和消费事件流，尤其适合微服务集成、日志流水线、分析数据采集和事件驱动架构。
- **Key Benefits**:
  - Boosts productivity by 让生产者和消费者解耦，同时保留一份可回放的持久事件历史，便于重算、补偿和离线处理。
  - Ensures consistency across environments/teams by 把事件传输变成显式、可持久化、可分区、可观测的基础设施，而不是依赖零散的点对点集成。

## 3. How
- **Workflow**: 生产事件 -> 按顺序写入 topic partition -> 由 consumer group 消费 -> 按需回放或继续做流式处理。
- **Quick Start**:
  1. Installation: `docker run -d --name kafka -p 9092:9092 apache/kafka:3.8.0`
  2. Basic Usage:

```bash
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --create --topic orders --bootstrap-server localhost:9092
docker exec -it kafka /opt/kafka/bin/kafka-console-producer.sh --topic orders --bootstrap-server localhost:9092
docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh --topic orders --from-beginning --bootstrap-server localhost:9092
```

Kafka 的核心概念包括 topic、partition、broker、producer、consumer 和 offset。也正因为如此，它不只是一个简单队列，而更像一个持久化事件日志：消费者自己维护消费进度，并且在需要时可以重新读取历史数据。

## 4. Better
- **Comparison**: 相比 RabbitMQ，Kafka 通常更适合超高吞吐事件流、可回放日志和长期流式处理；而 RabbitMQ 在传统队列与灵活路由模式上往往更直接。相比 Redis Pub/Sub，Kafka 在持久化、回放和大规模扩展能力上强得多，但运维复杂度也明显更高。
- **Key Advantages**:
  - **Performance**: 对追加写入型负载有非常强的吞吐能力，因为 Kafka 围绕顺序日志写入、分区和批量网络 IO 设计。
  - **Developer Experience**: 在连接器、流处理、可观测性和多语言客户端方面生态非常成熟，适合接入现代后端和数据平台。

## 5. Beyond
- **Ecosystem**: Kafka 很容易与流处理器、CDC 流水线、可观测性系统、数据湖、数据仓库、微服务平台和 ETL 工具集成。它常与 Spring、Flink、Spark、Debezium、Kafka Connect、Schema Registry、PostgreSQL、Elasticsearch、ClickHouse 以及容器编排平台配合使用。
- **Trade-offs**: 不要因为系统“是分布式的”就默认上 Kafka。对于非常小的工作负载、简单请求-响应系统，或者数据库表、定时任务、轻量消息队列就能解决的问题，Kafka 往往是过度设计。它还要求团队认真处理 partition key、顺序性、保留策略、幂等性、schema 演进和运维所有权。
