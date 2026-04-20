---
title: Spring Boot 基础
---

Spring Boot 是一个以快速启动、约定优于配置和生产可用服务为核心目标的 Java 应用框架。它并不是编程语言，但在后端工程中，它经常像一种主要开发模型，因为依赖注入、自动配置、starter 和应用约定会直接影响系统如何构建。

## 1. Variables & Types
Spring Boot 应用通常写在 Java 或 Kotlin 之上，因此底层变量和类型系统来自宿主语言。Spring Boot 真正改变的是：值如何在配置属性、Bean、注入依赖、请求 DTO 和服务边界之间流动。

```java
@Service
public class GreetingService {
    private final String prefix = "Hello";

    public String greet(String name) {
        return prefix + ", " + name;
    }
}
```

- 声明方式：
  值仍然通过普通 Java 语法声明，例如字段、局部变量、构造参数和方法返回类型。
- Bean 作用域：
  许多关键值是由 Spring 管理的 Bean 持有，而不是临时手动 new 出来的对象。
- 配置值：
  环境变量和配置文件中的值常被绑定到强类型配置类中。
- 依赖类型：
  依赖通常通过构造器注入，并以明确接口或类类型出现。
- 类型建模：
  DTO、entity、service、repository 和配置类都代表系统中的不同角色。

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

两个基础点很关键：

- 应用状态与配置状态：
  运行期业务数据不应和注入的应用配置混在一起。
- 容器管理值与局部变量：
  许多重要依赖都是由容器创建和装配的，而不是在业务代码里手动实例化。

Spring Boot 代码看起来仍然像普通 Java，但对象生命周期会被框架容器强烈影响。

## 2. Control Flow
Spring Boot 在 service、controller 和工具类内部使用普通 Java 控制流，但高层应用流程同时也受框架分发、注解、过滤器和配置驱动。

```java
public String describeStatus(boolean loading) {
    if (loading) {
        return "Loading...";
    }
    return "Ready";
}
```

- 条件分支：
  业务规则仍然依赖普通 `if`、`switch` 和循环结构。
- 请求路由：
  框架通过注解把 HTTP 请求分发到 controller 方法。
- Filter 链：
  interceptor、filter 和异常处理器会改变一个请求的实际控制流。
- 迭代：
  Java 集合和 stream pipeline 在集合型业务逻辑中很常见。
- 提前返回：
  校验和错误判断通常通过提前返回让 service 方法更清晰。

```java
@GetMapping("/health")
public Map<String, Boolean> health() {
    return Map.of("ok", true);
}
```

在 Spring Boot 里，很多最重要的控制流其实是隐式的：请求分发、事务边界、异常转换和 Bean 生命周期回调都会影响最终行为。

## 3. Functions
Spring Boot 应用由 controller、service、repository、配置类和事件监听器中的 Java 方法构成。关键问题通常不是“有没有方法”，而是“哪一层拥有哪种行为”。

```java
@Service
public class UserService {
    public String greet(String name) {
        return "Hello, " + name;
    }
}
```

- 定义与调用：
  方法照常定义，但实际调用路径可能经过 Spring 管理的代理或依赖注入。
- 参数：
  controller 方法常接收 path param、query param、request body 或框架注入对象。
- 返回值：
  方法可以返回领域值、DTO、响应对象、future 或 reactive 类型，取决于使用的技术栈。
- 生命周期钩子：
  有些方法会通过注解或接口由 Spring 间接触发，而不是被直接调用。
- 分层职责：
  controller、service、repository 和配置类中的方法通常应承担不同责任。

```java
@PostMapping("/users")
public UserResponse createUser(@RequestBody CreateUserRequest request) {
    return userService.createUser(request);
}
```

在 Spring Boot 中，函数设计和架构边界高度绑定。清晰的方法签名能有效避免 controller 吃掉 service 逻辑，或者 repository 直接泄漏到 Web 层。

## 4. Data Structures
Spring Boot 依赖的仍然是普通 Java 数据结构，但真实项目通常更围绕 DTO、entity、配置类、请求模型和服务层对象，而不是低层集合技巧本身。

- Lists：
  常用于记录集合和结果集。
- Maps：
  适合动态响应数据或查找型逻辑。
- Sets：
  常用于唯一性约束和关系建模。
- Classes 与 records：
  广泛用于 DTO、领域模型、响应对象和配置对象。
- 框架管理聚合：
  很多业务结构是跨 controller、service 和 repository 层组装出来的。

```java
public record UserResponse(String id, String name) {}

List<UserResponse> users = List.of(
    new UserResponse("1", "Ada"),
    new UserResponse("2", "Lin")
);
```

几个结构层面的区别很重要：

- Entity 与 DTO：
  数据库存储模型和 API 返回模型通常更适合分开。
- 可变与不可变模型：
  record 和不可变 DTO 在跨服务边界时通常更容易推理。
- 配置类：
  应用设置本身也是数据结构，应该被认真建模。

Spring Boot 应用的重点，不在于复杂数据结构本身，而在于保持模型边界干净。

## 5. Error Handling
Spring Boot 继承的是 Java 异常模型，但同时在其上叠加了框架级错误转换、HTTP 响应映射、校验错误处理和 Actuator 诊断机制。

```java
public int parsePort(String raw) {
    int port = Integer.parseInt(raw);

    if (port <= 0 || port > 65535) {
        throw new IllegalArgumentException("port out of range");
    }

    return port;
}
```

- Java 异常：
  在业务逻辑中，普通 `try` / `catch` 规则依然适用。
- Controller advice：
  `@ControllerAdvice` 和异常处理器可以把异常映射成 HTTP 响应。
- 校验失败：
  请求校验往往会生成结构化、由框架管理的错误结果。
- 事务回滚：
  异常的抛出和处理方式会影响事务是否回滚。
- 恢复性响应：
  生产服务应暴露清晰一致的失败载荷，而不是把原始栈信息直接返回给客户端。

```java
@RestControllerAdvice
public class ApiErrorHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
```

Spring Boot 的错误处理不只是“抓异常”，更是“定义系统在失败时的稳定 API 和运维行为”。

## 6. Modules & Imports
Spring Boot 项目通常按 controller、service、repository、配置类、领域类型和集成客户端等 package 来组织。构建工具和 starter 依赖会深刻影响模块结构。

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

- Package 组织：
  package 布局通常体现分层结构或 feature module 结构。
- Starter 依赖：
  Boot starter 会把常见依赖和约定打包在一起。
- 自动配置：
  Spring Boot 会根据 classpath 自动装配很多模块。
- 外部库：
  数据访问、安全、消息、校验和可观测性等能力通常通过 Spring 生态依赖引入。
- 构建系统：
  Maven 和 Gradle 是 Spring Boot 项目的主流构建方式。

```yaml
spring:
  application:
    name: soccss-service
```

在 Spring Boot 工程里，模块结构非常关键，因为包扫描、自动配置边界和 starter 选择都会影响最终应用形态。
