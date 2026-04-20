---
title: Dart 进阶
---

进入进阶阶段后，Dart 的重点不再只是语言语法，而是应用架构。真正重要的问题会转向异步流程、isolate、包结构、持久化边界、测试，以及 Dart 如何进入真实生产工具链。

## 1. Concurrency & Async
Dart 拥有很完整的异步模型，核心围绕 `Future`、`Stream` 和事件驱动执行。此外，Dart 还通过 isolate 提供真正的内存隔离并发，而不是普通应用代码里的共享内存线程模型。

- 事件循环：
  Dart 通过事件队列和微任务队列调度异步工作。
- Futures：
  `Future<T>` 表示稍后才会完成或失败的值。
- Streams：
  `Stream<T>` 表示一连串异步到来的值。
- Async / await：
  `async` 和 `await` 让基于 future 的代码更易读、更易组合。
- Isolates：
  isolate 通过独立内存堆和消息传递提供并发能力。

```dart
Future<String> fetchUser(int id) async {
  await Future.delayed(const Duration(milliseconds: 100));
  return "user-$id";
}
```

几个关键的进阶点：

- 取消与生命周期：
  异步工作可能活得比发起它的 UI、请求或进程状态更久。
- Stream 订阅：
  长生命周期 stream 需要明确清理和所有权管理。
- 消息传递：
  isolate 之间不能直接共享内存，因此通信协议设计很重要。

## 2. Web Development
Dart 可以直接用于 Web，虽然它在公众视野中更多是通过 Flutter 被认识。Dart 的进阶 Web 开发，重点在于理解它如何进入浏览器环境、API 层以及框架或服务端系统。

```dart
Future<Response> healthHandler(Request request) async {
  return Response.ok('{"ok":true}', headers: {"content-type": "application/json"});
}
```

- HTTP 方法：
  服务端 Dart 服务同样需要对 `GET`、`POST` 等方法维持清晰资源语义。
- 路由：
  Web 应用和服务通常依赖包级路由约定或框架抽象。
- 中间件：
  鉴权、日志、压缩、错误处理和请求整理通常属于 middleware 层。
- WebSocket 与实时更新：
  Dart 也能很好处理流式和实时通信。
- 客户端与服务端行为：
  浏览器 Dart 和服务端 Dart 在运行时能力和可用库上差异很大。

进阶 Dart Web 开发也意味着：要把传输类型、领域逻辑和框架特定关注点分开，而不是全都揉成一层。

## 3. Data Persistence
Dart 应用会根据运行环境接触 API、本地存储、数据库、缓存和文件系统。进阶实践的重点，是把持久化边界设计清楚，而不是让它们渗透整个代码库。

- SQL 与 NoSQL：
  选择仍然取决于工作负载和系统需求，而不是语言本身。
- ORM / ODM 风格工具：
  Dart 生态通常使用 query builder、序列化库或包级持久化辅助工具。
- 本地持久化：
  在客户端场景里尤其重要，常见于 preferences、secure storage、SQLite 或文件缓存。
- 迁移：
  持久化数据格式通常需要版本管理和升级逻辑。
- 序列化：
  JSON 和代码生成序列化器很常见，但运行时校验仍然重要。

```dart
final savedDraft = await preferences.getString("draft_profile");
```

两个常见进阶体会：

- 持久化状态、缓存状态和内存 UI 状态通常拥有不同生命周期，应分别建模。
- 有类型的模型并不能替代对不可信外部数据的运行时校验。

## 4. Testing
Dart 通过包生态提供了很好的测试支持，而语言本身的设计也让很多小而独立的单元容易被测试。

```dart
import "package:test/test.dart";

int add(int a, int b) => a + b;

void main() {
  test("adds two numbers", () {
    expect(add(2, 3), 5);
  });
}
```

- 单元测试：
  对纯函数、服务、序列化器和业务逻辑尤其适合。
- Mock 与 Stub：
  在 API、存储和平台边界很有帮助，但过度使用会把实现细节写死。
- 集成测试：
  对包边界、异步流程和系统装配很重要。
- Widget 或 UI 测试：
  在以 Flutter 为主的 Dart 项目中，widget 测试会成为重要层级。
- 覆盖率：
  覆盖率可以帮助发现盲区，但不能证明行为覆盖有多深。

Dart 的进阶测试还需要关注异步时序、stream 完成、isolate 边界以及环境相关行为。

## 5. Dependency Management
Dart 的依赖管理主要围绕 `pub`、`pubspec.yaml`、语义化版本和整个包生态展开。

- 语义化版本：
  被广泛采用，但兼容性最终仍取决于包维护质量。
- Lock 文件：
  `pubspec.lock` 在合适场景下可以帮助保持依赖安装可复现。
- 包仓库：
  公共包通常来自 pub.dev，也可能来自内部镜像。
- SDK 约束：
  Dart 和 Flutter 版本经常直接决定哪些包版本可用。
- 漏洞与维护审查：
  包健康度很重要，因为生态质量并不完全一致。

```yaml
dependencies:
  collection: ^1.18.0
  http: ^1.2.0
```

进阶团队也会很快发现：包约束不仅影响编译，还会影响 CI 稳定性、部署兼容性和运行时行为。

## 6. Logging & Debugging
Dart 调试横跨运行时值、异步时序、stream 和环境特定工具链。即使有不错的静态分析，可观测性仍然很重要。

```dart
print("processing order: $orderId");
```

- 日志级别：
  真正的应用通常会从 `print` 走向更结构化的日志约定。
- 栈跟踪：
  Dart 异常会带有 stack trace，便于定位失败路径。
- 调试器：
  现代 Dart 工具链在 IDE 和运行时层面都提供了很强的调试支持。
- 异步调试：
  Future 和 Stream 会让时序敏感 bug 更难推理。
- 远程诊断：
  在较大的系统里，日志、崩溃上报和监控都不可或缺。

Dart 的进阶调试经常是在判断：问题到底来自错误数据、生命周期时机、stream 使用不当、isolate 消息传递，还是环境相关假设。

## 7. Packaging & Deployment
Dart 的打包和部署方式高度依赖目标运行时。CLI 工具、后端服务、浏览器应用和基于 Flutter 的客户端，即使共享语言级代码，交付方式也完全不同。

- 环境变量：
  在服务端和工具场景里常用于配置、密钥和部署环境差异。
- 构建产物：
  Dart 可根据目标运行时走 JIT/开发流程，也可以输出原生或 JavaScript 方向的产物。
- Docker 化：
  在服务端 Dart 服务里很常见。
- CI/CD：
  流水线通常会运行格式化、静态分析、测试、构建和部署自动化。
- 热重载：
  在 Flutter 驱动的工作流中尤其突出，但生产产物仍然需要稳定、可复现的构建流程。

```dockerfile
FROM dart:stable
WORKDIR /app
COPY pubspec.* ./
RUN dart pub get
COPY . .
RUN dart compile exe bin/server.dart -o server
CMD ["./server"]
```

Dart 的进阶打包，本质上是在真正理解目标运行时，因为部署行为同样由平台定义，而不只是由语言定义。
