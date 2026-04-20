---
title: Dart 基础
---

Dart 是一种静态类型、面向对象语言，目标是高效地支持客户端、服务端和工具链开发。它最广为人知的场景是 Flutter，但 Dart 本身有独立的语言身份，核心特征包括健全空安全、清晰语法、异步原语和务实的类型系统。

## 1. Variables & Types
Dart 的变量具有静态类型，但语言也支持很强的类型推断，因此代码可以保持简洁。现代 Dart 最重要的特性之一是健全空安全，它把“是否可为 null”正式纳入类型系统，而不是只靠约定。

```dart
void main() {
  String name = "Ada";
  int version = 3;
  bool isReady = true;
  double score = 98.5;

  print("$name $version $isReady $score");
}
```

- 声明方式：
  可以显式写出 `String`、`int`、`bool` 等类型，也可以用 `var` 或 `final` 让 Dart 推断。
- 作用域：
  Dart 的局部变量采用块级作用域，类字段则属于实例或静态作用域。
- 类原始内建类型：
  常见核心类型包括 `int`、`double`、`bool`、`String` 和 `Object`。
- 类型推断：
  Dart 在很多常见场景下都能准确推断局部类型。
- 空安全：
  `String` 和 `String?` 是不同类型，编译器会强制执行这个区别。

```dart
var count = 10;
final message = "hello";
String? nickname;
```

两个基础区别很关键：

- `final` 与 `const`：
  `final` 表示运行时只赋值一次；`const` 表示编译期常量。
- 可空类型与不可空类型：
  空安全不是风格建议，而是语言核心纪律的一部分。

```dart
const appName = "SocCSS";
final startedAt = DateTime.now();
```

类型推断、显式注解和空安全的组合，构成了 Dart 很大一部分实用性来源。

## 2. Control Flow
Dart 的控制流整体很熟悉，但现代版本也加入了更强的模式匹配能力，使分支与解构表达力明显增强。

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

- 条件分支：
  使用 `if`、`else if`、`else`。
- Switch：
  Dart 支持 `switch` 语句，也支持现代 `switch` 表达式和模式匹配。
- 迭代：
  Dart 提供 `for`、`while`、`do-while` 和 `for-in`。
- 分支控制：
  `break` 和 `continue` 行为符合预期，也支持标签控制。
- 逻辑运算：
  `&&`、`||` 和 `!` 都采用短路语义。

```dart
for (final item in [1, 2, 3]) {
  if (item == 2) {
    continue;
  }
  print(item);
}
```

现代 Dart 还支持基于模式的 switch：

```dart
String describe(Object value) => switch (value) {
  int n when n > 0 => "positive int",
  String text => "string: $text",
  _ => "unknown",
};
```

这让状态建模和结果处理比早期 Dart 更有表达力。

## 3. Functions
函数在 Dart 中是一等值。它们可以被声明、传递、返回和保存，因此既是简单工具函数的核心，也是大规模应用设计中的重要构件。

```dart
String greet(String name, {String prefix = "Hello"}) {
  return "$prefix, $name";
}
```

- 定义与调用：
  可以使用普通函数声明、匿名函数或箭头语法定义。
- 参数：
  Dart 支持位置参数、可选位置参数和命名参数。
- 返回值：
  简单场景下返回类型可推断，但公共 API 中仍常显式标注。
- 闭包：
  函数可以捕获外层变量。
- 函数类型：
  Dart 可以显式描述函数类型。

```dart
double divide(double a, double b) {
  if (b == 0) {
    throw ArgumentError("division by zero");
  }
  return a / b;
}
```

闭包也很常见：

```dart
Function makeCounter() {
  var total = 0;

  return () {
    total += 1;
    return total;
  };
}
```

命名参数在 Dart 里尤其重要，因为它们能让 API 表达力更强，而无需依赖方法重载。

## 4. Data Structures
Dart 提供了一套紧凑但足够强的数据结构。List、Map、Set、class 和 record 可以覆盖绝大多数日常建模需求。

- Lists：
  有序集合，通常写作 `List<T>`。
- Maps：
  键值集合，通常写作 `Map<K, V>`。
- Sets：
  唯一值集合。
- Classes：
  表达带行为的结构化数据的主要方式。
- Records：
  无需显式类定义的轻量结构化值组合。

```dart
final numbers = <int>[10, 20, 30];
final first = numbers[0];

final user = <String, String>{
  "name": "Ada",
  "level": "advanced",
};

final tags = <String>{"dart", "flutter", "dart"};
```

对于结构化数据：

```dart
class User {
  final String name;
  final int score;

  User(this.name, this.score);
}
```

现代 Dart 的 record 也很实用：

```dart
({String name, int score}) profile = (name: "Ada", score: 95);
```

Dart 集合字面量还支持 spread、collection `if` 和 collection `for`，这使数据拼装既简洁又清晰。

## 5. Error Handling
Dart 通过异常机制表达错误。和很多托管语言一样，关键不在于“有没有异常”，而在于你是否清楚哪里应该抛出、哪里应该恢复。

```dart
int parsePort(String raw) {
  final port = int.parse(raw);

  if (port <= 0 || port > 65535) {
    throw ArgumentError("port out of range");
  }

  return port;
}
```

- `try` / `catch`：
  用于在本地处理异常。
- `finally`：
  无论前面是否抛错，最终都会执行。
- 抛出异常：
  使用 `throw` 抛出 error 或 exception 对象。
- 自定义错误类型：
  应用中可以定义领域相关的异常类。
- 冒泡：
  未处理异常会向上传播，直到被调用方处理或由运行时报告。

```dart
class ConfigException implements Exception {
  final String message;
  ConfigException(this.message);

  @override
  String toString() => "ConfigException: $message";
}
```

Dart 没有 checked exceptions，因此失败预期通常需要通过 API 设计、文档或显式结果类型来表达。

## 6. Modules & Imports
Dart 通过 library 和 package 组织代码。它的导入系统很直接，而 `pub` 包管理则是日常工作流的核心部分。

```dart
import "dart:convert";
import "package:collection/collection.dart";
```

- 核心库：
  Dart 自带 `dart:core`、`dart:async`、`dart:convert` 等标准库。
- 包导入：
  共享代码通常通过 `package:` URI 导入。
- 库级私有性：
  以 `_` 开头的标识符在该 library 内私有。
- 导出：
  library 可以 re-export 其他文件 API。
- 包管理：
  依赖通过 `pubspec.yaml` 声明。

```yaml
name: my_app
environment:
  sdk: ^3.0.0
```

在真实 Dart 项目里，模块结构非常重要，因为 library 边界、export 方式和 package 布局会直接影响代码的复用性和可理解性。
