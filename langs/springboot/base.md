---
title: Spring Boot Foundations
---

Spring Boot is a Java application framework focused on rapid setup, convention-driven configuration, and production-ready services. It is not a programming language, but in backend engineering it often acts like a primary development model because dependency injection, auto-configuration, starters, and application conventions shape how systems are built.

## 1. Variables & Types
Spring Boot applications are written in Java or sometimes Kotlin, so the underlying variable and type system comes from the host language. What Spring Boot changes is how values flow through configuration properties, beans, injected dependencies, request DTOs, and service boundaries.

```java
@Service
public class GreetingService {
    private final String prefix = "Hello";

    public String greet(String name) {
        return prefix + ", " + name;
    }
}
```

- Declaration:
  Values are declared using normal Java syntax such as fields, local variables, constructor parameters, and method return types.
- Bean scope:
  Many important values are owned by Spring-managed beans rather than ad hoc object creation.
- Configuration values:
  Environment properties and configuration files often populate typed settings classes.
- Dependency types:
  Dependencies are commonly injected through constructors with explicit interface or class types.
- Type modeling:
  DTOs, entities, services, repositories, and configuration classes each express a different role in the system.

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

Two foundational Spring Boot ideas matter early:

- Application state vs. configuration state:
  Runtime business data should not be confused with injected application configuration.
- Bean-managed values vs. local variables:
  Many important dependencies are created and wired by the container rather than manually instantiated.

Spring Boot code may still look like standard Java, but the object lifecycle is strongly influenced by the framework container.

## 2. Control Flow
Spring Boot uses ordinary Java control flow inside services, controllers, and utilities, but many high-level application flows are also driven by framework dispatch, annotations, filters, and configuration.

```java
public String describeStatus(boolean loading) {
    if (loading) {
        return "Loading...";
    }
    return "Ready";
}
```

- Conditional branching:
  Business rules still rely on normal `if`, `switch`, and loop structures.
- Request routing:
  Framework annotations direct HTTP traffic to controller methods.
- Filter chains:
  Interceptors, filters, and exception handlers alter the effective control flow of a request.
- Iteration:
  Java collections and stream pipelines are common for collection-oriented application logic.
- Early returns:
  Service methods often remain clearer when validation and error checks return early.

```java
@GetMapping("/health")
public Map<String, Boolean> health() {
    return Map.of("ok", true);
}
```

In Spring Boot, some of the most important control flow is implicit in the framework: request dispatch, transaction boundaries, exception translation, and bean lifecycle callbacks all influence application behavior.

## 3. Functions
Spring Boot applications are built from Java methods inside controllers, services, repositories, configuration classes, and event listeners. The key question is usually not whether methods exist, but what layer owns which behavior.

```java
@Service
public class UserService {
    public String greet(String name) {
        return "Hello, " + name;
    }
}
```

- Definition and invocation:
  Methods are declared normally, but may be invoked through Spring-managed proxies or dependency injection.
- Parameters:
  Controller methods often receive path params, query params, request bodies, or injected framework objects.
- Return values:
  Methods may return domain values, DTOs, responses, futures, or reactive types depending on the stack.
- Lifecycle hooks:
  Some methods are invoked by Spring through annotations or interfaces rather than direct calls.
- Layering:
  Methods in controllers, services, repositories, and configuration classes should usually have different responsibilities.

```java
@PostMapping("/users")
public UserResponse createUser(@RequestBody CreateUserRequest request) {
    return userService.createUser(request);
}
```

In Spring Boot, function design is deeply tied to architectural boundaries. Clean method signatures help prevent controllers from absorbing service logic or repositories from leaking into the web layer.

## 4. Data Structures
Spring Boot relies on normal Java data structures, but real projects often revolve around DTOs, entities, configuration classes, request models, and service-layer objects more than low-level collection tricks.

- Lists:
  Common for collections of records and result sets.
- Maps:
  Useful for dynamic response data or lookup-oriented logic.
- Sets:
  Common for uniqueness constraints and relationship modeling.
- Classes and records:
  Widely used for DTOs, domain models, responses, and configuration objects.
- Framework-managed aggregates:
  Many business structures are assembled across controller, service, and repository layers.

```java
public record UserResponse(String id, String name) {}

List<UserResponse> users = List.of(
    new UserResponse("1", "Ada"),
    new UserResponse("2", "Lin")
);
```

Some structural distinctions matter:

- Entities vs. DTOs:
  Database persistence models and API response models are often better kept separate.
- Mutable vs. immutable models:
  Records and immutable DTOs are often easier to reason about across service boundaries.
- Configuration classes:
  Application settings are data structures too, and should be modeled deliberately.

Spring Boot applications are less about exotic data structures and more about keeping model boundaries clean.

## 5. Error Handling
Spring Boot inherits Java's exception model, but it also layers framework-specific error translation, HTTP response mapping, validation handling, and actuator diagnostics on top.

```java
public int parsePort(String raw) {
    int port = Integer.parseInt(raw);

    if (port <= 0 || port > 65535) {
        throw new IllegalArgumentException("port out of range");
    }

    return port;
}
```

- Java exceptions:
  Standard `try` / `catch` behavior still applies in business logic.
- Controller advice:
  `@ControllerAdvice` and exception handlers can map exceptions to HTTP responses.
- Validation failures:
  Request validation often produces structured framework-managed errors.
- Transaction rollback:
  Some exceptions affect transaction behavior depending on how they are thrown and handled.
- Recovery responses:
  Production services should expose clear, consistent failure payloads rather than raw stack traces.

```java
@RestControllerAdvice
public class ApiErrorHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
```

Error handling in Spring Boot is not only about catching exceptions. It is also about defining stable operational and API behavior when failures occur.

## 6. Modules & Imports
Spring Boot projects are commonly organized into packages containing controllers, services, repositories, configuration classes, domain types, and integration clients. Build tooling and starter dependencies strongly influence module structure.

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

- Package organization:
  Package layout often reflects layers or feature modules.
- Starter dependencies:
  Boot starters bundle common dependencies and conventions together.
- Auto-configuration:
  Spring Boot wires many modules through classpath-driven configuration.
- External libraries:
  Data, security, messaging, validation, and observability concerns often arrive through Spring ecosystem dependencies.
- Build system:
  Maven and Gradle dominate Spring Boot project setup and packaging.

```yaml
spring:
  application:
    name: soccss-service
```

In Spring Boot engineering, module structure matters because package scanning, auto-configuration boundaries, and starter selection all influence the final application shape.
