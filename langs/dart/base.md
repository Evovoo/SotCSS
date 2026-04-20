---
title: Dart Foundations
---

Dart is a statically typed, object-oriented language designed for productive application development across client, server, and tooling environments. It is especially well known through Flutter, but Dart itself has its own language identity built around sound null safety, clear syntax, async primitives, and a pragmatic type system.

## 1. Variables & Types
Dart variables have static types, but the language supports strong type inference so code can stay concise. One of the most important modern Dart features is sound null safety, which makes nullability part of the type system instead of an informal convention.

```dart
void main() {
  String name = "Ada";
  int version = 3;
  bool isReady = true;
  double score = 98.5;

  print("$name $version $isReady $score");
}
```

- Declaration:
  Use explicit type annotations such as `String`, `int`, and `bool`, or let Dart infer types with `var` or `final`.
- Scope:
  Dart uses block scope for local variables, and class fields belong to instance or static scope.
- Primitive-like built-in types:
  Common core types include `int`, `double`, `bool`, `String`, and `Object`.
- Type inference:
  Dart can infer local types accurately in many common cases.
- Null safety:
  `String` and `String?` are different types, and the compiler enforces that distinction.

```dart
var count = 10;
final message = "hello";
String? nickname;
```

Two foundational distinctions matter early:

- `final` vs. `const`:
  `final` means a value is assigned once at runtime; `const` means a value is compile-time constant.
- Nullable vs. non-nullable types:
  Null safety is not optional style. It is part of the language's core type discipline.

```dart
const appName = "SocCSS";
final startedAt = DateTime.now();
```

This combination of inference, explicit typing, and null safety gives Dart much of its practical clarity.

## 2. Control Flow
Dart has familiar structured control flow, but modern versions also add pattern-oriented capabilities that make matching and destructuring more expressive.

```dart
int score = 87;
String grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "C";
}
```

- Conditional branching:
  Use `if`, `else if`, and `else`.
- Switch:
  Dart supports `switch` statements and modern `switch` expressions with pattern matching.
- Iteration:
  Dart has `for`, `while`, `do-while`, and `for-in`.
- Branch control:
  `break` and `continue` behave as expected, including labeled control when needed.
- Logical operators:
  `&&`, `||`, and `!` short-circuit.

```dart
for (final item in [1, 2, 3]) {
  if (item == 2) {
    continue;
  }
  print(item);
}
```

Modern Dart also supports pattern-based switching:

```dart
String describe(Object value) => switch (value) {
  int n when n > 0 => "positive int",
  String text => "string: $text",
  _ => "unknown",
};
```

This makes state modeling and result handling more expressive than older Dart code might suggest.

## 3. Functions
Functions in Dart are first-class values. They can be declared, passed, returned, and stored, which makes them central in both simple utilities and larger application design.

```dart
String greet(String name, {String prefix = "Hello"}) {
  return "$prefix, $name";
}
```

- Definition and invocation:
  Use normal function declarations, anonymous functions, or arrow syntax for concise expressions.
- Parameters:
  Dart supports positional, optional positional, and named parameters.
- Return values:
  Return types can be inferred in simple cases, but explicit annotation is common in public APIs.
- Closures:
  Functions can capture surrounding variables.
- Function typing:
  Dart can describe function types explicitly.

```dart
double divide(double a, double b) {
  if (b == 0) {
    throw ArgumentError("division by zero");
  }
  return a / b;
}
```

Closures are common:

```dart
Function makeCounter() {
  var total = 0;

  return () {
    total += 1;
    return total;
  };
}
```

Named parameters are especially important in Dart because they make APIs expressive without relying on overloads.

## 4. Data Structures
Dart provides a compact but capable set of built-in collection types. Lists, maps, sets, classes, and records cover most everyday modeling work.

- Lists:
  Ordered collections, usually written as `List<T>`.
- Maps:
  Key-value collections, usually written as `Map<K, V>`.
- Sets:
  Unique-value collections.
- Classes:
  The primary way to model structured data with behavior.
- Records:
  Lightweight structured groupings of values without defining a named class.

```dart
final numbers = <int>[10, 20, 30];
final first = numbers[0];

final user = <String, String>{
  "name": "Ada",
  "level": "advanced",
};

final tags = <String>{"dart", "flutter", "dart"};
```

For structured data:

```dart
class User {
  final String name;
  final int score;

  User(this.name, this.score);
}
```

Modern Dart records are also useful:

```dart
({String name, int score}) profile = (name: "Ada", score: 95);
```

Collections in Dart also support useful control-flow-aware literals such as spread operators and collection `if` or `for`, which can make data assembly concise and readable.

## 5. Error Handling
Dart uses exceptions for error signaling. As with many managed languages, the key question is not whether exceptions exist, but how intentionally they are used and where recovery should happen.

```dart
int parsePort(String raw) {
  final port = int.parse(raw);

  if (port <= 0 || port > 65535) {
    throw ArgumentError("port out of range");
  }

  return port;
}
```

- `try` / `catch`:
  Used to handle exceptions locally.
- `finally`:
  Always runs after `try` / `catch` handling completes.
- Throwing exceptions:
  Use `throw` with an error or exception object.
- Custom error types:
  Applications may define domain-specific exception classes.
- Bubbling:
  Unhandled exceptions propagate upward until a caller handles them or the runtime reports them.

```dart
class ConfigException implements Exception {
  final String message;
  ConfigException(this.message);

  @override
  String toString() => "ConfigException: $message";
}
```

Dart does not use checked exceptions, so failure expectations usually need to be communicated through API design, documentation, or explicit result types.

## 6. Modules & Imports
Dart organizes code into libraries and packages. The language's import system is straightforward, and package management through `pub` is a core part of everyday workflow.

```dart
import "dart:convert";
import "package:collection/collection.dart";
```

- Core libraries:
  Dart ships with standard libraries such as `dart:core`, `dart:async`, `dart:convert`, and others.
- Package imports:
  Shared code is commonly imported through `package:` URIs.
- Library privacy:
  Identifiers beginning with `_` are private to the library.
- Exports:
  Libraries can re-export APIs from other files.
- Package management:
  Dependencies are declared in `pubspec.yaml`.

```yaml
name: my_app
environment:
  sdk: ^3.0.0
```

In real Dart projects, module structure matters because library boundaries, exports, and package layout shape how reusable and understandable the codebase becomes.
