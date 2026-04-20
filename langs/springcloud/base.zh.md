---
title: Spring Cloud 基础
---

Spring Cloud 是一组构建在 Spring Boot 之上的分布式系统框架和集成模式。它并不是编程语言，但在以微服务为主的 Java 生态中，它经常像一种主要架构模型，因为服务发现、集中配置、路由、负载均衡和韧性模式会直接塑造系统设计。

## 1. Variables & Types
Spring Cloud 应用仍然写在 Java 或 Kotlin 之上，因此底层变量和类型行为来自宿主语言。Spring Cloud 额外带来的是分布式系统层，在这里，很多关键值不再只是普通局部变量，而是服务标识、配置快照、请求元数据、链路追踪上下文和跨服务载荷契约。

```java
@ConfigurationProperties(prefix = "inventory")
public class InventoryProperties {
    private Duration timeout = Duration.ofSeconds(2);

    public Duration getTimeout() {
        return timeout;
    }

    public void setTimeout(Duration timeout) {
        this.timeout = timeout;
    }
}
```

- 声明方式：
  值仍然通过普通 Java 语法在 Spring 管理的 Bean、配置类、DTO 和集成客户端中声明。
- 配置状态：
  在分布式系统里，很多重要值来自集中配置，而不是写死在代码里。
- 服务身份：
  像 `inventory-service`、`gateway-service` 这样的名字会变成一等架构值。
- 强类型配置：
  外部配置通常会绑定到强类型 settings 类中。
- 契约类型：
  跨服务传递的请求和响应 DTO 需要被有意识地建模，因为它们跨越了部署边界。

```java
public record UserResponse(String id, String name) {
}
```

两个基础点很关键：

- 应用内局部值与分布式系统值：
  一个局部变量和一个服务 ID、请求关联 ID、外部化配置值，不是同一种层级的东西。
- 静态代码与运行时拓扑：
  运行中的系统会独立于代码变化，因为服务实例、路由和配置会随环境而变化。

在 Spring Cloud 系统里，类型清晰度更重要，因为很多值会跨进程、跨网络、跨运维边界流动。

## 2. Control Flow
Spring Cloud 在本地代码里仍然使用普通 Java 控制流，但真实应用流程通常会分散在 HTTP 调用、网关、消息中间件、重试、熔断器和服务注册查询之间。

```java
public String describeStatus(boolean available) {
    if (available) {
        return "UP";
    }
    return "DOWN";
}
```

- 本地分支：
  每个服务内部的业务规则仍然靠普通 `if`、`switch` 和循环表达。
- 请求路由：
  网关和路由层决定外部流量如何进入内部服务。
- 基于发现的流向：
  一次调用可能根据注册中心状态和负载均衡结果落到不同实例。
- 回退流：
  重试、超时和熔断会显著改变控制流。
- 事件驱动流：
  一些 Spring Cloud 系统会更多依赖消息，而不是直接请求-响应链。

```java
@GetMapping("/orders/{id}")
public OrderResponse getOrder(@PathVariable String id) {
    return orderService.getOrder(id);
}
```

在 Spring Cloud 中，最重要的控制流通常并不写在某一个方法体里，而是由多个服务、基础设施层和运行时策略共同拼出来的。

## 3. Functions
Spring Cloud 应用仍然由普通 Java 方法构成，但这些方法常常位于 service、controller、集成客户端、gateway filter、listener 和配置组件中。关键问题是：哪一层应该拥有哪种分布式责任。

```java
@Service
public class OrderService {
    public OrderResponse getOrder(String id) {
        return new OrderResponse(id, "CREATED");
    }
}
```

- 定义与调用：
  方法可能被本地调用，也可能通过代理、Feign client、消息监听器或网关执行链间接触发。
- 参数：
  分布式方法经常接收 ID、token、请求元数据、header、链路上下文和校验后的 DTO。
- 返回值：
  方法可以返回本地域模型、传输 DTO、reactive 类型或框架包装类型。
- 生命周期钩子：
  有些方法由消息监听、刷新事件或启动初始化触发，而不是用户直接调用。
- 边界所有权：
  一个 service 方法不应该不知不觉同时变成 controller、repository 和远程客户端。

```java
@FeignClient(name = "inventory-service")
public interface InventoryClient {
    @GetMapping("/inventory/{sku}")
    InventoryResponse getInventory(@PathVariable String sku);
}
```

在 Spring Cloud 中，函数设计本质上就是分布式系统接口设计。方法签名定义的，不只是代码形状，还有服务契约和失败边界。

## 4. Data Structures
Spring Cloud 使用的仍然是普通 Java 集合和类，但最重要的数据结构往往是服务契约、配置模型、事件载荷、注册元数据和运行状态信息。

- DTOs：
  用于服务之间交换请求和响应。
- 配置类：
  用于建模强类型应用配置和环境配置。
- 事件载荷：
  消息系统通常承载结构化领域事件或集成事件。
- Map 与元数据：
  对动态 header、属性和服务发现相关信息很常见。
- 状态与健康模型：
  在分布式环境里，运维状态本身就是重要数据结构。

```java
public record InventoryResponse(String sku, int available) {
}

Map<String, String> headers = Map.of(
    "X-Correlation-Id", correlationId
);
```

几个结构层面的区别很重要：

- 领域模型与传输模型：
  内部对象图不应该自动直接变成网络契约。
- 同步数据与事件载荷：
  请求-响应 DTO 和异步事件 schema 有不同生命周期和兼容性要求。
- 配置数据：
  分布式系统高度依赖被正确建模的外部配置。

Spring Cloud 系统的重点，不在于复杂内存结构本身，而在于移动部件之间的契约稳定性。

## 5. Error Handling
Spring Cloud 的错误处理远不止本地异常。一个分布式系统必须同时应对超时、重试、服务不可用、部分失败、配置错误和下游行为不一致。

```java
public InventoryResponse requireInventory(String sku) {
    InventoryResponse response = inventoryClient.getInventory(sku);
    if (response.available() <= 0) {
        throw new IllegalStateException("inventory unavailable");
    }
    return response;
}
```

- 本地异常：
  Java 和 Spring 的异常处理规则在每个服务内部依然成立。
- 远程失败：
  网络错误、超时和下游 4xx/5xx 响应都需要显式处理。
- 熔断器：
  有些失败不应该无限重试，而应触发保护性行为。
- 回退响应：
  某些场景下有用，但如果用错，也可能掩盖关键系统失败。
- 可观测性感知错误处理：
  错误必须带足够上下文被记录和追踪，才能知道到底是哪条依赖路径出了问题。

```java
@RestControllerAdvice
public class ApiErrorHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handle(Exception ex) {
        return ResponseEntity.internalServerError().body(Map.of("error", ex.getMessage()));
    }
}
```

在 Spring Cloud 中，错误处理的本质是失败隔离与透明化。目标不只是捕获异常，而是让分布式失败保持可理解、可边界化。

## 6. Modules & Imports
Spring Cloud 项目通常会拆成多个可部署服务、共享库、配置模块、网关应用和集成客户端。模块边界本身就是架构边界。

```java
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
```

- 服务模块：
  每个服务通常拥有一组有边界的业务能力。
- 共享契约：
  团队有时会抽出共享 DTO 或基础设施 helper，但过度共享会制造紧耦合。
- 网关与边缘模块：
  API gateway 通常是独立应用。
- 配置与启动模块：
  集中配置和基础设施接入有时也会被单独拆出。
- 构建与依赖管理：
  Maven 或 Gradle 负责在整个分布式代码库中协调版本。

```yaml
spring:
  application:
    name: order-service
```

在 Spring Cloud 工程里，模块设计会直接影响运维，因为所有权、可部署性、耦合度和发布协调成本都沿着模块边界展开。
