---
title: Spring Boot 进阶
---

进入进阶阶段后，Spring Boot 的重点不再只是“把服务跑起来”，而是管理真实应用边界。关键问题会转向请求生命周期、持久化设计、可观测性、测试策略、依赖版本对齐，以及自动配置如何和生产需求相互作用。

## 1. Concurrency & Async
Spring Boot 应用通常从同步请求-响应模型起步，但真实系统很快就会涉及 executor、异步 handler、消息处理、调度任务、响应式流程以及数据库和网络并发约束。

- 请求线程模型：
  传统 Spring MVC 通常通过服务器管理的线程处理请求。
- 异步方法：
  `@Async`、executor 和 completable future 可把工作移出请求线程。
- 调度任务：
  后台任务通常通过定时任务或消息驱动处理。
- 响应式栈：
  Spring WebFlux 使用以 reactive stream 为中心的并发模型，而不是一请求一线程。
- 竞态条件：
  共享缓存、可变单例和重叠异步任务依然会造成正确性风险。

```java
@Async
public CompletableFuture<String> fetchUserAsync(String id) {
    return CompletableFuture.completedFuture("user-" + id);
}
```

几个关键的进阶点：

- 线程池所有权：
  无界 executor 使用会很快伤害系统稳定性。
- 阻塞与非阻塞设计：
  在响应式或异步架构里混入阻塞数据访问会造成真实性能问题。
- 事务边界：
  异步切换会改变哪个线程或上下文实际拥有事务。

## 2. Web Development
Spring Boot 被广泛用于 HTTP API、Web 应用和 BFF 服务。进阶 Web 开发意味着理解请求映射、序列化、校验、安全链和框架扩展点，而不只是写简单 controller 方法。

```java
@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable String id) {
        return userService.getUser(id);
    }
}
```

- HTTP 方法：
  即便注解让接口很容易写出来，REST 语义仍然重要。
- 校验：
  请求体、参数和请求头通常都需要声明式校验。
- 类中间件层：
  filter、interceptor、安全链和异常处理器会共同塑造请求真实行为。
- 序列化：
  Jackson 等工具决定 Java 模型如何变成 JSON 载荷。
- 实时通信：
  当请求-响应不足以满足需求时，也可使用 WebSocket、SSE 和消息集成。

Spring Boot 的进阶 Web 开发还意味着清楚：逻辑到底应该放在 controller、service、assembler、validator 还是 security 层。

## 3. Data Persistence
Spring Boot 对关系型和非关系型数据系统都有很深的集成。进阶持久化工作的重点，是理解何时便利抽象有帮助，何时它已经开始隐藏成本。

- SQL 与 NoSQL：
  选择仍然取决于负载、一致性和运维现实。
- JPA 与 Hibernate：
  在 CRUD 型应用中非常常见，但并不是没有性能和复杂度代价。
- 显式查询工具：
  JDBC、jOOQ、QueryDSL 等方式在复杂系统中往往能提供更清晰的控制。
- 连接池：
  生产系统高度依赖正确调优的连接池，例如 HikariCP。
- 迁移：
  Flyway 和 Liquibase 是常见 schema 版本管理工具。

```java
@Entity
public class UserEntity {
    @Id
    private String id;
    private String email;
}
```

两个常见进阶体会：

- 懒加载、N+1 查询和意外扩大事务范围会严重损害性能。
- 持久化模型不应该悄悄地直接变成 API 契约，除非这是有意识的耦合设计。

## 4. Testing
Spring Boot 测试会覆盖单元逻辑、slice test、完整应用集成测试、数据库测试和 HTTP 级验证。进阶测试意味着聪明地使用框架，而不是让每个测试都付出完整上下文启动成本。

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
}
```

- 单元测试：
  最适合纯 service 逻辑和与框架无关的代码。
- Slice tests：
  Spring 提供面向 web、data、JSON 等局部行为的聚焦测试切片。
- 集成测试：
  对装配、配置和持久化边界来说完整上下文测试很重要。
- Mock：
  在外部边界上有用，但过度 mock 会让 Spring 代码变得脆弱且不真实。
- Testcontainers：
  使用真实基础设施的集成测试越来越常见。

Spring Boot 的进阶测试还意味着：要有意识地区分哪些内容真的需要 application context，哪些根本不需要。

## 5. Dependency Management
Spring Boot 的依赖管理和精心维护的版本组合、starter、BOM、构建插件以及生态兼容性深度绑定。

- 受管依赖版本：
  Boot 提供经过整合的依赖版本，以降低版本错配风险。
- Starters：
  starter 简化了接入，但也会带来大量传递依赖。
- 构建插件：
  Maven 和 Gradle 插件会影响打包、测试执行和容器化工作流。
- 私有仓库：
  企业团队通常会通过内部制品仓库管理依赖。
- 漏洞扫描：
  长生命周期后端服务必须持续做依赖审查。

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.3.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

进阶团队也会很快认识到：随意覆盖 Spring 已经对齐好的版本，通常比想象中更快把应用搞不稳定。

## 6. Logging & Debugging
Spring Boot 拥有成熟的日志和诊断生态，但真实排障仍然要求你同时理解框架行为和应用代码。

```java
logger.info("processing order id={} attempt={}", orderId, attempt);
```

- 日志级别：
  `TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR` 依然是标准约定。
- 结构化日志：
  对分布式系统和生产环境检索尤其有价值。
- Actuator：
  Spring Boot Actuator 可暴露健康状态、指标、环境信息和运维端点。
- 栈跟踪与异常：
  被框架包装过的异常如果不仔细看日志，很容易遮蔽真正根因。
- 调试工具：
  IDE 调试器、请求日志、SQL 日志、线程转储和指标都很重要。

Spring Boot 的进阶调试经常是在区分：问题到底来自应用 bug、配置错误、持久化问题、安全过滤链行为，还是框架生命周期本身。

## 7. Packaging & Deployment
Spring Boot 被设计成易于部署，但真实生产交付仍然依赖精细的打包、配置、运行时调优和可观测性设计。

- 环境变量与配置文件：
  外部化配置是 Spring Boot 的核心优势之一。
- 构建产物：
  可执行 JAR 很常见，也有 native image 和分层容器等形式。
- Docker 化：
  容器化 Boot 服务在生产中非常普遍。
- CI/CD：
  流水线通常会运行测试、打包、镜像构建、安全扫描和部署。
- 运行时调优：
  JVM 内存参数、容器资源限制和启动 profile 都会影响生产稳定性。

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Spring Boot 的进阶部署，本质上是在让框架便利性和运维清晰度对齐，而不是让默认值悄悄决定生产行为。
