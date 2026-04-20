---
title: Spring Cloud Intermediate
---

At the intermediate level, Spring Cloud becomes less about enabling a few dependencies and more about operating a distributed application responsibly. The important questions shift toward service boundaries, configuration lifecycle, retries, tracing, messaging, and deployment coordination.

## 1. Concurrency & Async
Concurrency in Spring Cloud is not only about Java threads. It is also about overlapping requests across services, asynchronous messaging, retry storms, and how work propagates through distributed boundaries.

- Request concurrency:
  Multiple service instances may process related requests simultaneously.
- Async integration:
  Messaging, scheduled tasks, and event-driven workflows are common in microservice systems.
- Retry behavior:
  Retries can increase reliability, but poorly configured retries can also amplify failure.
- Backpressure:
  Gateways, queues, downstream dependencies, and databases all impose throughput limits.
- Reactive pipelines:
  Some Spring Cloud systems use reactive stacks where concurrency behaves differently from servlet-based stacks.

```java
@Scheduled(fixedDelay = 5000)
public void syncInventory() {
    // background synchronization logic
}
```

Important intermediate concerns:

- Timeout ownership:
  Every hop in a distributed request chain needs clear timing limits.
- Idempotency:
  Retries and repeated deliveries require safe operation design.
- Queue vs. request-response tradeoffs:
  Some workloads are better decoupled through events or messages than synchronous service calls.

## 2. Web Development
Spring Cloud web development is really about service-to-service communication, edge routing, security propagation, and API boundary management rather than only controller code.

```java
spring:
  cloud:
    gateway:
      routes:
        - id: inventory
          uri: lb://inventory-service
          predicates:
            - Path=/inventory/**
```

- Gateways:
  Edge services often centralize routing, auth concerns, and traffic shaping.
- Service-to-service calls:
  HTTP clients, declarative clients, and load-balanced calls are core to the model.
- Middleware layers:
  Filters, token propagation, tracing, and rate limiting affect every request path.
- Real-time communication:
  Event streams, messaging, or socket-based integrations may coexist with REST APIs.
- Contract boundaries:
  API versioning and compatibility matter more because multiple services evolve independently.

Intermediate Spring Cloud web work often means recognizing that the "web layer" exists in several places at once: edge gateway, internal services, auth infrastructure, and downstream integrations.

## 3. Data Persistence
In Spring Cloud, persistence is no longer just a per-service concern. It also involves service ownership, consistency models, event propagation, and how data changes cross boundaries.

- Database per service:
  A common microservice principle to reduce tight coupling.
- SQL vs. NoSQL:
  Each service may choose storage based on its workload rather than organization-wide uniformity.
- Event-driven consistency:
  Distributed workflows often rely on eventual consistency rather than cross-service transactions.
- Migrations:
  Schema changes must be coordinated with service rollouts and backward compatibility.
- Read models and caching:
  Some systems build dedicated read views or cache layers to support query-heavy access patterns.

```java
@Transactional
public void createOrder(CreateOrderCommand command) {
    // persist locally and publish domain event
}
```

Two common intermediate lessons:

- Shared databases often undermine service boundaries even when they look convenient.
- Data consistency decisions should be explicit at architecture level, not left to accident or default framework behavior.

## 4. Testing
Spring Cloud testing spans unit logic, contract verification, service integration, messaging flows, and environment-level validation. Intermediate testing means acknowledging that a service can pass locally while the distributed workflow still fails.

```java
@SpringBootTest
class OrderServiceIntegrationTest {
}
```

- Unit tests:
  Still useful for local business logic and transformation rules.
- Integration tests:
  Important for service wiring, persistence, and client behavior.
- Contract tests:
  Useful when independent services must agree on API shape and semantics.
- Messaging tests:
  Event-driven systems need tests around payloads, retries, and listener behavior.
- Environment-level tests:
  Container-backed and staging tests help catch network and config assumptions.

Intermediate Spring Cloud testing also requires deliberate thinking about what must be verified in isolation and what only makes sense in a multi-service setup.

## 5. Dependency Management
Spring Cloud dependency management is particularly sensitive because it depends on compatibility across Spring Boot, Spring Cloud release trains, infrastructure libraries, and organizational platform standards.

- Release train alignment:
  Spring Cloud versions are typically matched to supported Spring Boot versions.
- Starter dependencies:
  Convenience comes with transitive dependency cost and compatibility constraints.
- Shared platform BOMs:
  Larger organizations often centralize dependency decisions across services.
- Private artifact repositories:
  Common in enterprise environments.
- Vulnerability review:
  Distributed systems often stay deployed for long periods, so dependency drift matters operationally.

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

Intermediate teams also learn that casual version overrides in one service can create subtle fleet-wide inconsistencies.

## 6. Logging & Debugging
Debugging Spring Cloud systems requires moving beyond per-process logs into request correlation, distributed tracing, metrics, and cross-service failure analysis.

```java
logger.info("calling inventory-service orderId={} correlationId={}", orderId, correlationId);
```

- Structured logging:
  Essential for searching across many service instances.
- Correlation IDs:
  Necessary for following one logical request across services.
- Tracing:
  Distributed tracing helps visualize request paths and latency contributions.
- Metrics and health:
  Latency, error rates, queue depth, and service health all matter.
- Remote debugging:
  Usually replaced in production by observability tooling rather than live debugger sessions.

Intermediate debugging in Spring Cloud often means identifying whether a problem is local logic, bad configuration, network instability, downstream latency, contract mismatch, or fleet-level deployment inconsistency.

## 7. Packaging & Deployment
Spring Cloud deployment is fundamentally multi-service deployment. Operational complexity comes not only from building one service, but from versioning, coordinating, and observing a fleet.

- Environment configuration:
  Per-environment and centralized config are central to deployment.
- Build artifacts:
  Services commonly ship as executable JARs or container images.
- Container orchestration:
  Kubernetes and similar platforms often host Spring Cloud deployments.
- CI/CD:
  Pipelines need to support per-service delivery plus cross-service compatibility awareness.
- Release strategy:
  Canary, blue-green, rollback, and phased rollout patterns matter in distributed systems.

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/order-service.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Intermediate Spring Cloud deployment is really about governance: keeping many independently deployable services coherent without turning the fleet into operational chaos.
