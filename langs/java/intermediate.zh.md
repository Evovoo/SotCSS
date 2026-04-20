---
title: Java 进阶
---

进入进阶阶段后，Java 的重点不再只是语法，而是平台工程。真正重要的是理解语言、JVM、库、框架和运维约束如何在真实服务和应用中相互作用。

## 1. Concurrency & Async
Java 拥有长期且成熟的并发体系。线程、executor、future 和基于锁的协调模型已经存在很多年，而较新的平台能力还在持续改进这套体系。

- Threads：
  Java 通过 `Thread` 支持原生线程，在现代 Java 中还出现了 virtual threads 这类更轻量的模型。
- Executors：
  线程池和 executor service 是任务管理的常见基础设施。
- Futures 与异步组合：
  `CompletableFuture` 支持异步流程和组合式编排。
- 共享状态协调：
  `synchronized`、锁、并发集合和原子类依然重要。
- 竞态条件：
  Java 的内存模型和线程安全规则很关键，因为共享可变对象在企业代码里非常常见。

```java
CompletableFuture<String> userFuture =
    CompletableFuture.supplyAsync(() -> "user-42");
```

几个重要的进阶点：

- 线程管理：
  无界创建线程在负载下既昂贵又危险。
- 阻塞与异步边界：
  Java 应用经常同时混合同步 API 和异步 API，因此架构边界必须清楚。
- 取消与超时：
  长时间运行或卡死的任务需要显式限制和协作式关闭机制。

## 2. Web Development
Java 是最成熟的后端语言之一，尤其在企业和大规模服务环境中。Spring、Jakarta EE、Micronaut、Quarkus 等框架构成了生态主流。

```java
@RestController
public class HealthController {
    @GetMapping("/health")
    public Map<String, Boolean> health() {
        return Map.of("ok", true);
    }
}
```

- HTTP 方法：
  `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 仍应体现资源语义和幂等性。
- 路由：
  路径到 handler 的绑定通常通过注解或路由 DSL 完成。
- 中间层：
  Filter、interceptor、异常处理、鉴权层和 tracing hook 会共同塑造请求处理流程。
- 序列化：
  JSON 最常见，通常通过 Jackson 等库处理。
- 实时通信：
  Java 框架也支持 WebSocket、SSE 和消息驱动集成。

Java Web 进阶开发还要求你清楚哪些职责应该放在 controller、service、repository 和 configuration 中，而不是让框架默认行为无意中定义了架构。

## 3. Data Persistence
Java 有非常深厚的持久化生态，围绕关系型数据库、连接池、事务管理器和 ORM 展开。团队通常会在低层控制与高层抽象之间按系统需求做取舍。

- SQL 与 NoSQL：
  选择取决于一致性、查询复杂度、扩展方式和运维约束。
- ORM：
  JPA 和 Hibernate 是 Java 应用中最常见的 ORM 基础。
- 查询工具：
  有些团队更偏好 JDBC、jOOQ、MyBatis 等更显式 SQL 的方案。
- 连接池：
  生产 Java 服务通常依赖像 HikariCP 这样的高质量连接池。
- 迁移：
  schema 演进通常通过 Flyway 或 Liquibase 之类工具管理。

```java
Optional<User> user = userRepository.findByEmail("ada@example.com");
```

两个常见进阶体会：

- ORM 的便利并不能替代你对 join、懒加载、事务边界和索引行为的理解。
- 持久化模型不应该无声无息地泄漏到所有 API 模型和业务逻辑里。

## 4. Testing
Java 测试通常结合单元测试、集成测试和框架辅助测试基础设施。JUnit 仍是标准底座，Mockito 和框架提供的测试支持则是常见补充。

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class MathTest {
    @Test
    void addsTwoNumbers() {
        assertEquals(5, 2 + 3);
    }
}
```

- 单元测试：
  聚焦独立类或方法的行为。
- Mock 与 Stub：
  对外部系统和框架重代码很有用，但过度 mock 会把实现细节写死。
- 集成测试：
  对数据库访问、HTTP 层、配置装配和消息边界都很重要。
- 测试生命周期支持：
  Java 测试框架提供注解和 fixture 机制做初始化与清理。
- 覆盖率：
  覆盖率报告能提示盲区，但不等于断言质量高。

Java 的进阶测试还要求你管理事务边界、Spring context 启动成本，以及区分“测试业务逻辑”和“测试框架配置”。

## 5. Dependency Management
Java 的依赖管理主要由构建工具主导，而不是由语言本身提供。Maven 和 Gradle 决定了构件解析、版本管理、构建和发布的流程。

- 语义化版本：
  被广泛使用，但在大型 Java 生态中，兼容性依然高度依赖库维护者的实际纪律。
- 锁定与可复现：
  依赖图应尽量稳定，尤其是在大型组织中。
- 私有仓库：
  企业 Java 团队经常依赖内部制品仓库。
- 传递依赖：
  Java 应用很容易积累复杂依赖树和版本冲突。
- 漏洞扫描：
  对长期运行的服务端环境来说，依赖审计工具非常重要。

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

进阶团队也会很快认识到，依赖对齐、BOM 使用和插件配置，有时和业务代码本身同样关键。

## 6. Logging & Debugging
Java 的日志和调试生态成熟且强大。生产系统除了常规应用日志外，往往还依赖结构化日志、指标、线程转储和 JVM 级诊断。

```java
logger.info("processing order id={} attempt={}", orderId, attempt);
```

- 日志级别：
  `TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR` 是标准约定。
- 日志框架：
  常见组合是 SLF4J 配合 Logback 或 Log4j 体系。
- 栈跟踪分析：
  Java 异常堆栈是后端排障的核心信息之一。
- 调试器：
  IDE 内建调试器非常强，也被广泛使用。
- JVM 诊断：
  heap dump、thread dump、GC 日志和 profiler 往往是生产排障必需工具。

Java 的进阶调试经常是在判断：问题到底出在应用逻辑、框架装配、线程行为、数据库交互，还是 JVM 运行时本身。

## 7. Packaging & Deployment
Java 的打包和部署高度依赖应用形态。后端服务、Android 应用、批处理任务和桌面程序都属于 Java 生态，但交付方式差异很大。

- 环境变量：
  常用于密钥、主机名、端口和环境特定配置。
- 构建产物：
  Java 应用常输出 JAR、WAR、分层容器镜像，某些场景也会输出 native image。
- Docker 化：
  Java 服务做容器化非常普遍，通常会使用精简 JRE 或 distroless 基础镜像。
- CI/CD：
  流水线通常会运行测试、静态分析、打包和部署自动化。
- 热更新与开发工具：
  它们对开发体验有帮助，但生产部署仍必须明确且可复现。

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Java 的进阶部署还意味着理解内存参数、JVM 启动行为、容器资源限制，以及框架选择如何影响运行时体积。
