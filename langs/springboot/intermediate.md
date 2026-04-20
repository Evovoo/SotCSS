---
title: Spring Boot Intermediate
---

At the intermediate level, Spring Boot becomes less about getting a service to start and more about managing real application boundaries. The important questions shift toward request lifecycles, persistence design, observability, testing strategy, dependency alignment, and how auto-configuration interacts with production needs.

## 1. Concurrency & Async
Spring Boot applications often begin in a synchronous request-response model, but real systems quickly involve executors, async handlers, messaging, scheduling, reactive flows, and database or network concurrency constraints.

- Request threading:
  Traditional Spring MVC handles requests with server-managed threads.
- Async methods:
  `@Async`, executors, and completable futures can move work off the request thread.
- Scheduling:
  Background jobs often use scheduled tasks or message-driven processing.
- Reactive stacks:
  Spring WebFlux offers a different concurrency model centered on reactive streams rather than one-thread-per-request.
- Race conditions:
  Shared caches, mutable singletons, and overlapping async tasks still create correctness risks.

```java
@Async
public CompletableFuture<String> fetchUserAsync(String id) {
    return CompletableFuture.completedFuture("user-" + id);
}
```

Important intermediate concerns:

- Thread pool ownership:
  Unbounded executor usage can hurt stability quickly.
- Blocking vs. non-blocking design:
  Mixing blocking data access into reactive or async designs causes real performance problems.
- Transaction boundaries:
  Async handoff can change which thread or context owns a transactional operation.

## 2. Web Development
Spring Boot is widely used for HTTP APIs, web applications, and backend-for-frontend services. Intermediate web work means understanding request mapping, serialization, validation, security, and framework extension points beyond simple controller methods.

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

- HTTP methods:
  REST semantics still matter even when annotations make endpoint creation easy.
- Validation:
  Request bodies, params, and headers often need declarative validation.
- Middleware layers:
  Filters, interceptors, security chains, and exception handlers shape effective request behavior.
- Serialization:
  Jackson and related tooling define how Java models become JSON payloads.
- Real-time communication:
  WebSocket, SSE, and message-based integration are available when request-response is not enough.

Intermediate Spring Boot web development also means choosing where logic should live: controller, service, assembler, validator, or security layer.

## 3. Data Persistence
Spring Boot has deep integration with relational and non-relational data systems. Intermediate persistence work means understanding when convenience abstractions help and when they start hiding costs.

- SQL vs. NoSQL:
  The choice still depends on workload, consistency, and operational reality.
- JPA and Hibernate:
  Common in CRUD-heavy applications, but not free of performance or complexity tradeoffs.
- Explicit query tooling:
  JDBC, jOOQ, QueryDSL, or other approaches may provide clearer control in complex systems.
- Connection pools:
  Production systems depend on correctly tuned pools such as HikariCP.
- Migrations:
  Flyway and Liquibase are common for schema versioning.

```java
@Entity
public class UserEntity {
    @Id
    private String id;
    private String email;
}
```

Two common intermediate lessons:

- Lazy loading, N+1 query patterns, and accidental transaction scope expansion can seriously damage performance.
- Persistence models should not silently become API contracts unless that coupling is intentional.

## 4. Testing
Spring Boot testing spans unit logic, slice tests, full application integration tests, database tests, and HTTP-level verification. Intermediate testing means using the framework wisely without paying unnecessary startup cost everywhere.

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
}
```

- Unit tests:
  Best for pure service logic and framework-independent code.
- Slice tests:
  Spring provides focused test slices for web, data, and JSON behavior.
- Integration tests:
  Full context tests are important for wiring, config, and persistence boundaries.
- Mocking:
  Useful at external boundaries, but excessive mocking can make Spring code brittle and unrealistic.
- Test containers:
  Real infrastructure-backed integration tests are increasingly common.

Intermediate Spring Boot testing also means being deliberate about what needs the application context and what does not.

## 5. Dependency Management
Spring Boot dependency management is deeply tied to curated versions, starters, BOMs, build plugins, and ecosystem compatibility.

- Managed dependency versions:
  Boot provides curated dependency alignment to reduce version mismatch risk.
- Starters:
  Starters simplify setup but also pull in substantial transitive dependencies.
- Build plugins:
  Maven and Gradle plugins shape packaging, test execution, and containerization workflows.
- Private registries:
  Enterprise teams often route dependencies through internal artifact management.
- Vulnerability scanning:
  Long-lived backend services need ongoing dependency review.

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

Intermediate teams also learn that overriding curated Spring versions casually can destabilize the application faster than expected.

## 6. Logging & Debugging
Spring Boot applications benefit from a mature logging and diagnostics ecosystem, but real debugging still requires understanding both framework behavior and application code.

```java
logger.info("processing order id={} attempt={}", orderId, attempt);
```

- Log levels:
  `TRACE`, `DEBUG`, `INFO`, `WARN`, and `ERROR` remain standard.
- Structured logs:
  Useful for distributed systems and production searchability.
- Actuator:
  Spring Boot Actuator exposes health, metrics, environment, and operational endpoints.
- Stack traces and exceptions:
  Framework-wrapped exceptions can obscure the root cause if logs are not read carefully.
- Debugging tools:
  IDE debuggers, request logs, SQL logs, thread dumps, and metrics are all relevant.

Intermediate debugging in Spring Boot often means distinguishing between application bugs, misconfiguration, persistence issues, security filter behavior, and framework lifecycle behavior.

## 7. Packaging & Deployment
Spring Boot is designed to be deployable, but production delivery still depends on careful packaging, config, runtime tuning, and observability.

- Environment variables and config files:
  Externalized configuration is a core Spring Boot strength.
- Build artifacts:
  Executable JARs are common, though native images and layered containers are also used.
- Dockerization:
  Containerized Boot services are very common in production.
- CI/CD:
  Pipelines often run tests, packaging, image builds, scans, and deployment.
- Runtime tuning:
  JVM memory settings, container limits, and startup profiles all affect production stability.

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Intermediate Spring Boot deployment is usually about making framework convenience align with operational clarity instead of letting defaults silently define production behavior.
