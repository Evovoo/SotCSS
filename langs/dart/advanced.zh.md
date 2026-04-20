---
title: Dart 高阶
---

Dart 的高阶阶段，重点在于如何利用语言的类型系统、异步模型和包结构，构建在规模化场景下仍然可预测的系统。真正难的通常不是语法，而是决定抽象何时真正有帮助、异步工作该如何协调，以及类型系统应在多大程度上编码程序不变量。

## 1. Deep Concurrency
在高阶层面，Dart 的并发重点是协调事件循环、stream、isolate 和生命周期边界，而不是在普通代码里使用共享内存锁。

- 事件与微任务调度：
  队列中工作的先后顺序会直接影响正确性和性能。
- Stream 协调：
  broadcast stream、订阅、变换链和背压假设都很重要。
- Isolate 消息传递：
  Dart 里的真正并发通常依赖 isolate 边界和显式通信协议。
- 通过设计避免死锁：
  Dart 默认绕开了很多共享内存问题，但被阻塞的事件循环和异步协调不当仍会制造系统级故障。
- Actor 风格思维：
  isolate 和消息传递会自然地把 Dart 设计推向 actor 风格边界。

```dart
final receivePort = ReceivePort();
await Isolate.spawn(workerMain, receivePort.sendPort);
```

高阶 Dart 工程实践会认真思考订阅所有权、isolate 生命周期、取消语义，以及异步 API 如何表达完成、失败和流式进度。

## 2. Metaprogramming & Reflection
Dart 的元编程主要通过代码生成和工具链来实现，而不是在面向生产的工作流中大量依赖无约束运行时反射。

- 代码生成：
  构建期生成常用于 JSON 序列化器、客户端、路由表和不可变模型。
- 注解：
  注解经常驱动生成器行为，例如 `json_serializable` 及其他工具链。
- 反射限制：
  某些上下文中虽然存在运行时反射能力，但在 tree shaking 和生产构建约束下，代码生成通常更实际。
- 宏与编译期工具链方向：
  整个生态越来越偏向静态工具链，而不是重量级运行时元数据。
- 生成后的 API 表面：
  很多高阶 Dart 项目都会暴露干净的手写接口，而把实现细节交给生成代码。

```dart
@JsonSerializable()
class User {
  final String name;
  final int score;

  User(this.name, this.score);
}
```

一个很实际的高阶结论是：Dart 往往更偏好显式生成代码，而不是“魔法般”的运行时行为，因为这样更利于性能、tree shaking 和工具链清晰度。

## 3. Design Patterns
Dart 当然支持经典设计模式，但现代 Dart 往往会通过接口、mixin、extension method、不可变模型和包级边界来表达，而不是依赖沉重继承体系。

- SOLID 原则：
  依然有价值，尤其是在包边界和可测试抽象层上。
- 创建型模式：
  factory constructor 和 builder 在模型密集代码中很常见。
- 结构型模式：
  adapter、facade 和 repository 层在 API 与持久化边界上都很常见。
- 行为型模式：
  基于 stream、事件驱动和状态机的方式，在异步密集应用中很常见。
- 依赖注入：
  往往通过显式构造器、service locator 或生成式装配来完成，取决于项目风格。

```dart
abstract class Serializer<T> {
  String dump(T value);
}
```

高阶 Dart 设计通常意味着：选择那些能让包边界和异步行为保持可理解的抽象。过度抽象会很快让代码库比原本的具体实现更难导航。

## 4. Advanced Type System
Dart 的类型系统足够强大，能支撑高级建模，同时又不像某些系统语言那样机械密集。最有价值的高级特性通常是泛型、空安全、sealed class 风格建模、record 和精确约束 API。

- 泛型：
  泛型集合和 API 能表达可复用的类型关系。
- 空安全：
  高阶 Dart 设计经常依赖精确表达 nullable 和 non-nullable 状态。
- Sealed 与 interface class 建模：
  很适合有限状态和协议结果形状。
- Records 与 patterns：
  对轻量结构化数据和更有表达力的解构都很有帮助。
- 类型约束：
  泛型边界可以避免 API 最终退化成 `dynamic`。

```dart
sealed class Result<T> {}

class Success<T> extends Result<T> {
  final T value;
  Success(this.value);
}

class Failure<T> extends Result<T> {
  final Object error;
  Failure(this.error);
}
```

在高阶 Dart 系统里，类型系统最有价值的地方，是缩小非法状态并让 API 更清晰；如果泛型机制或过度聪明的模型层级让普通代码比问题本身更难理解，那它的收益就开始下降了。
