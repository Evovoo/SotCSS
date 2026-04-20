---
title: Dart Intermediate
---

At the intermediate level, Dart becomes less about language syntax and more about application architecture. The important questions shift toward async flow, isolates, package structure, persistence boundaries, testing, and how Dart fits into real production toolchains.

## 1. Concurrency & Async
Dart has a rich async model built around `Future`, `Stream`, and event-driven execution. In addition, Dart supports isolates for true memory-isolated concurrency rather than shared-memory threading in normal application code.

- Event loop:
  Dart schedules asynchronous work through event and microtask queues.
- Futures:
  `Future<T>` represents a value that will complete later or fail with an error.
- Streams:
  `Stream<T>` represents a sequence of asynchronous values over time.
- Async / await:
  `async` and `await` make future-based code easier to read and compose.
- Isolates:
  Isolates provide concurrency with separate memory heaps and message passing.

```dart
Future<String> fetchUser(int id) async {
  await Future.delayed(const Duration(milliseconds: 100));
  return "user-$id";
}
```

Important intermediate concerns:

- Cancellation and lifecycle:
  Async work may outlive the UI, request, or process state that started it.
- Stream subscriptions:
  Long-lived streams require cleanup and ownership discipline.
- Message passing:
  Isolates do not share memory directly, so communication design matters.

## 2. Web Development
Dart can be used on the web directly, though in practice much of its visibility comes through Flutter. Intermediate web work means understanding how Dart fits in browser environments, APIs, and app frameworks or server-backed systems.

```dart
Future<Response> healthHandler(Request request) async {
  return Response.ok('{"ok":true}', headers: {"content-type": "application/json"});
}
```

- HTTP methods:
  Server-side Dart services still need clear resource semantics around `GET`, `POST`, and other methods.
- Routing:
  Web apps and services usually rely on package-level routing conventions or framework abstractions.
- Middleware:
  Authentication, logging, compression, error handling, and request shaping often belong in middleware layers.
- WebSocket and live updates:
  Dart can handle streaming and real-time communication well.
- Client vs. server behavior:
  Browser Dart and server Dart have very different runtime capabilities and library surfaces.

Intermediate Dart web development also means keeping transport types, domain logic, and framework-specific concerns separate rather than letting them collapse together.

## 3. Data Persistence
Dart applications often interact with APIs, local storage, databases, caches, and file systems depending on the runtime environment. Intermediate practice means modeling persistence boundaries clearly instead of letting them leak through the whole codebase.

- SQL vs. NoSQL:
  The choice depends on workload and system requirements, not on the language itself.
- ORM / ODM-like tooling:
  Dart ecosystems may use query builders, serialization libraries, or package-specific persistence helpers.
- Local persistence:
  Especially important in client apps using preferences, secure storage, SQLite, or file-backed caches.
- Migrations:
  Persistent data formats often need versioning and upgrade logic.
- Serialization:
  JSON and generated serializers are common, but runtime validation still matters.

```dart
final savedDraft = await preferences.getString("draft_profile");
```

Two common intermediate lessons:

- Durable state, cache state, and in-memory UI state usually have different lifecycles and should be modeled separately.
- Typed models do not remove the need to validate untrusted external data.

## 4. Testing
Dart has strong built-in testing support through its package ecosystem, and its language design makes small, isolated units fairly easy to test.

```dart
import "package:test/test.dart";

int add(int a, int b) => a + b;

void main() {
  test("adds two numbers", () {
    expect(add(2, 3), 5);
  });
}
```

- Unit testing:
  Useful for pure functions, services, serializers, and business logic.
- Mocking and stubbing:
  Helpful at API, storage, and platform boundaries, but overuse can freeze implementation details.
- Integration tests:
  Important for package boundaries, async flows, and system wiring.
- Widget or UI tests:
  In Flutter-heavy Dart projects, widget testing becomes a major layer.
- Coverage:
  Coverage can show blind spots, but it does not prove behavioral depth.

Intermediate Dart testing also requires attention to async timing, stream completion, isolate boundaries, and environment-specific behavior.

## 5. Dependency Management
Dart dependency management revolves around `pub`, `pubspec.yaml`, semantic versioning, and the broader package ecosystem.

- Semantic Versioning:
  Commonly used, though compatibility still depends on actual package discipline.
- Lock files:
  `pubspec.lock` helps keep installs reproducible where appropriate.
- Package registry:
  Public packages are usually sourced from pub.dev or internal mirrors.
- SDK constraints:
  Dart and Flutter versions often determine which package versions are valid.
- Vulnerability and maintenance review:
  Package health matters because ecosystem quality varies.

```yaml
dependencies:
  collection: ^1.18.0
  http: ^1.2.0
```

Intermediate teams also learn that package constraints can influence not just compilation but CI stability, deployment compatibility, and runtime behavior.

## 6. Logging & Debugging
Dart debugging spans runtime values, async timing, streams, and environment-specific tooling. Clear logs and strong observability remain important even with good static analysis.

```dart
print("processing order: $orderId");
```

- Log levels:
  Real applications usually move beyond `print` toward structured logging conventions.
- Stack traces:
  Dart exceptions include stack traces that help pinpoint failure paths.
- Debuggers:
  IDE and runtime debugger support is strong in modern Dart tooling.
- Async debugging:
  Futures and streams often make timing-sensitive bugs harder to reason about.
- Remote diagnostics:
  In larger systems, logs, crash reporting, and monitoring become essential.

Intermediate Dart debugging often means asking whether a bug comes from bad data, bad lifecycle timing, stream misuse, isolate messaging, or environment-specific assumptions.

## 7. Packaging & Deployment
Dart packaging and deployment depend heavily on the runtime target. A CLI tool, backend service, browser app, and Flutter-based client all package differently even if they share language-level code.

- Environment variables:
  Common for config, secrets, and deployment-specific behavior in server and tooling contexts.
- Build artifacts:
  Dart code may run in JIT/dev workflows or produce native or JavaScript-oriented outputs depending on the target.
- Dockerization:
  Common for server-side Dart services.
- CI/CD:
  Pipelines often run formatting, static analysis, tests, builds, and deployment automation.
- Hot reload:
  Particularly visible in Flutter-driven workflows, though deployment artifacts still need deterministic build processes.

```dockerfile
FROM dart:stable
WORKDIR /app
COPY pubspec.* ./
RUN dart pub get
COPY . .
RUN dart compile exe bin/server.dart -o server
CMD ["./server"]
```

Intermediate Dart packaging is mostly about understanding the target runtime clearly, because deployment behavior is defined as much by the platform as by the language.
