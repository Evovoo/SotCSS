---
title: Java 高阶
---

Java 的高阶阶段，不是继续记更多 API，而是理解语言、JVM、库和架构在规模化场景下如何相互作用。Java 完全可以支撑极其可维护的系统，但前提是抽象、并发和运行时行为都被有意识地设计。

## 1. Deep Concurrency
在高阶层面，Java 并发的重点不是“会启动线程”，而是在真实负载下控制共享状态、调度策略和可见性规则。

- 锁与监视器：
  `synchronized`、`ReentrantLock`、读写锁等原语用于协调共享可变状态。
- 原子操作：
  Atomics 与 compare-and-set 是低层协调和高吞吐结构的关键工具。
- 消息传递：
  队列、executor、reactive streams 和 actor 风格系统能减少一部分共享状态复杂度。
- 死锁预防：
  Java 不会自动防止锁顺序错误，因此设计纪律依然重要。
- 线程模型：
  平台线程、虚拟线程、事件循环和响应式流水线各有不同权衡。

```java
private final AtomicLong counter = new AtomicLong();

public long increment() {
    return counter.incrementAndGet();
}
```

高阶 Java 工程实践还会认真推理内存可见性、竞争热点、背压、取消传播，以及一个具体问题究竟该用锁、队列、actor 还是结构化任务作用域来解决。

## 2. Metaprogramming & Reflection
Java 提供了很强的运行时反射和代理机制，而大型框架大量依赖这些能力。这让生态非常强大，但如果使用不慎，也很容易把行为隐藏得过深。

- Reflection API：
  Java 可以在运行时检查类、方法、字段、注解和泛型签名。
- Annotations：
  注解驱动了大量框架行为，包括依赖注入、持久化、校验和 Web 路由。
- Dynamic proxies：
  Java 支持基于接口的动态代理，生态中也常见基于字节码生成的代理。
- 代码生成：
  注解处理器、字节码工具和构建期生成在高级工具链里非常常见。
- Instrumentation：
  某些高级平台会在 profiling、织入或运行时增强场景里修改或检查字节码。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Audited {}
```

元编程最有价值的场景，是减少重复基础设施代码而不遮蔽控制流。在大型 Java 系统中，如果团队难以追踪“真正执行的代码到底是什么”，反射魔法就会迅速变成维护负担。

## 3. Design Patterns
Java 长期以来都是经典设计模式的重要主场，但现代 Java 其实也支持比老教材里更直接、样板更少的实现方式。

- SOLID 原则：
  在 Java 设计中依然核心，尤其是在分层系统和公共 API 里。
- 创建型模式：
  Builder、factory 和依赖注入在对象密集型应用中仍然常见。
- 结构型模式：
  adapter、facade、decorator 和 proxy 在框架与集成边界很常见。
- 行为型模式：
  strategy、command、observer 和事件驱动架构依然高度相关。
- 依赖注入：
  广泛通过 Spring、CDI、Guice 等框架，或显式构造器注入来实现。

```java
public interface Serializer {
    String dump(User value);
}
```

Java 的高阶设计通常意味着：优先明确边界和可测试依赖，而不是让框架把耦合隐藏起来。模式在降低复杂度时有价值，在变成仪式化的类爆炸时就会适得其反。

## 4. Advanced Type System
Java 的类型系统很强，但它同时受到泛型擦除、通配符变型和名义类型系统的共同塑形。高阶使用意味着理解它何时真正帮你，何时会出现锋利边缘。

- Generics：
  泛型使可复用抽象在保留编译期检查的同时成为可能。
- Wildcards 与 variance：
  `? extends T` 和 `? super T` 是 API 灵活性的关键。
- 类型约束：
  有界类型参数可以限制泛型代码允许接收的类型范围。
- Records、sealed types 与 pattern matching：
  现代 Java 正逐步支持更有表达力的有限状态和结构化数据建模。
- Type erasure：
  泛型信息在运行时大多会被擦除，这会影响反射能力和某些 API 设计。

```java
public static <T> T first(List<T> items) {
    return items.get(0);
}
```

在高阶 Java 系统里，类型系统最有价值的地方，是澄清契约、减少非法状态并提升 API 易用性；如果泛型抽象只是层层堆叠却没有解决真实设计问题，收益就会迅速下降。
