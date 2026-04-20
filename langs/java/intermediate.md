---
title: Java Intermediate
---

At the intermediate level, Java becomes less about syntax and more about platform engineering. The important shift is understanding how the language, JVM, libraries, frameworks, and operational concerns all interact in real services and applications.

## 1. Concurrency & Async
Java has a long and mature concurrency story. Threads, executors, futures, and lock-based coordination have existed for years, and newer platform features continue to improve the model.

- Threads:
  Java supports native threads through `Thread` and, in modern Java, lighter-weight models such as virtual threads.
- Executors:
  Thread pools and executor services are the common foundation for task management.
- Futures and async composition:
  `CompletableFuture` supports asynchronous workflows and composition.
- Shared-state coordination:
  `synchronized`, locks, concurrent collections, and atomics remain important.
- Race conditions:
  Java's memory model and thread-safety rules matter because shared mutable objects are common in enterprise code.

```java
CompletableFuture<String> userFuture =
    CompletableFuture.supplyAsync(() -> "user-42");
```

Important intermediate concerns:

- Thread management:
  Creating unbounded threads is expensive and dangerous under load.
- Blocking vs. async boundaries:
  Java applications often mix synchronous and asynchronous APIs, so architectural clarity matters.
- Cancellation and timeout:
  Long-running or stuck tasks need explicit limits and cooperative shutdown behavior.

## 2. Web Development
Java is one of the most established backend languages, especially in enterprise and large-service environments. Spring, Jakarta EE, Micronaut, Quarkus, and similar frameworks dominate much of the ecosystem.

```java
@RestController
public class HealthController {
    @GetMapping("/health")
    public Map<String, Boolean> health() {
        return Map.of("ok", true);
    }
}
```

- HTTP methods:
  `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` should still reflect resource semantics and idempotency.
- Routing:
  Framework annotations or routing DSLs bind paths to handlers.
- Middleware layers:
  Filters, interceptors, exception handlers, auth layers, and tracing hooks shape request processing.
- Serialization:
  JSON is dominant, often through Jackson or similar libraries.
- Real-time communication:
  Java frameworks also support WebSocket, SSE, and message-driven integration.

Intermediate Java web work also means understanding what belongs in controllers, services, repositories, and configuration rather than letting framework defaults define architecture accidentally.

## 3. Data Persistence
Java has a deep persistence ecosystem built around relational databases, connection pools, transaction managers, and ORM layers. Teams often choose between low-level control and higher-level abstraction depending on the system.

- SQL vs. NoSQL:
  The choice depends on consistency, query complexity, scaling model, and operational constraints.
- ORM:
  JPA and Hibernate are the most common ORM foundation in Java applications.
- Query tooling:
  Some teams prefer JDBC, jOOQ, MyBatis, or other approaches for more explicit SQL control.
- Connection pooling:
  Production Java services usually rely on high-quality pools such as HikariCP.
- Migrations:
  Schema evolution is commonly managed through tools such as Flyway or Liquibase.

```java
Optional<User> user = userRepository.findByEmail("ada@example.com");
```

Two common intermediate lessons:

- ORM convenience does not remove the need to understand joins, lazy loading, transaction scope, and index behavior.
- Persistence models should not silently leak everywhere into API models and business logic.

## 4. Testing
Java testing usually combines unit tests, integration tests, and framework-assisted test infrastructure. JUnit remains the standard base, while Mockito and framework-specific test support are common additions.

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

- Unit testing:
  Focuses on isolated class or method behavior.
- Mocking and stubbing:
  Useful for external systems and framework-heavy code, but excessive mocking can freeze implementation details.
- Integration tests:
  Important for database access, HTTP layers, configuration wiring, and messaging boundaries.
- Test lifecycle support:
  Java test frameworks provide annotations and fixtures for setup and teardown.
- Coverage:
  Coverage reports help reveal blind spots, but they do not guarantee meaningful assertions.

Intermediate Java testing also requires discipline around transaction boundaries, Spring context startup costs, and the difference between testing business logic and testing framework configuration.

## 5. Dependency Management
Java dependency management is centered around build tools rather than the language itself. Maven and Gradle define how artifacts are resolved, versioned, built, and published.

- Semantic Versioning:
  Used widely, though compatibility in large Java ecosystems still depends on real library discipline.
- Locking and reproducibility:
  Dependency graphs should be kept stable, especially in large organizations.
- Private registries:
  Enterprise Java teams often rely on internal artifact repositories.
- Transitive dependencies:
  Java applications can accumulate complex dependency trees and version conflicts.
- Vulnerability scanning:
  Dependency audit tooling is important in long-lived server environments.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Intermediate teams also learn that dependency alignment, BOM usage, and plugin configuration can be as important as application code.

## 6. Logging & Debugging
Java logging and debugging are mature and powerful. Production systems often rely on structured logs, metrics, thread dumps, and JVM-level diagnostics in addition to standard application logs.

```java
logger.info("processing order id={} attempt={}", orderId, attempt);
```

- Log levels:
  `TRACE`, `DEBUG`, `INFO`, `WARN`, and `ERROR` are standard conventions.
- Logging frameworks:
  SLF4J with Logback or Log4j-based setups is common.
- Stack trace analysis:
  Java exception traces are central to debugging, especially in backend systems.
- Debuggers:
  IDE-integrated debuggers are strong and widely used.
- JVM diagnostics:
  Heap dumps, thread dumps, garbage collection logs, and profilers are often essential in production debugging.

Intermediate Java debugging frequently means deciding whether a problem is in application logic, framework wiring, thread behavior, database interaction, or JVM runtime behavior.

## 7. Packaging & Deployment
Java packaging and deployment depend heavily on the application style. A backend service, Android app, batch job, and desktop app all live in the Java ecosystem but ship differently.

- Environment variables:
  Common for secrets, hostnames, ports, and environment-specific config.
- Build artifacts:
  Java applications commonly produce JARs, WARs, layered container images, or native images in some setups.
- Dockerization:
  Containerized Java services are common, especially with slim JRE or distroless images.
- CI/CD:
  Pipelines usually run tests, static analysis, packaging, and deployment automation.
- Hot reload and developer tools:
  Helpful in development, but production deployments must remain explicit and reproducible.

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Intermediate Java deployment also means understanding memory settings, JVM startup behavior, container resource limits, and how framework choices influence operational footprint.
