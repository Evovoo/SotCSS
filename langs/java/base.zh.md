---
title: Java 基础
---

Java 是一种静态类型、面向对象语言，围绕 JVM 和成熟庞大的生态构建。它强调显式结构、强工具链和可移植性。虽然现代 Java 已经比早期版本更有表达力，但类、接口、异常和标准库仍然定义着它的核心开发风格。

## 1. Variables & Types
Java 变量具有明确的静态类型，编译器会在编译期检查赋值、方法调用和类型转换。Java 虽然在少数位置支持类型推断，但整体仍然比动态类型语言更显式。

```java
public class Main {
    public static void main(String[] args) {
        String name = "Ada";
        int version = 21;
        boolean ready = true;
        double score = 98.5;

        System.out.println(name + " " + version + " " + ready + " " + score);
    }
}
```

- 声明方式：
  变量通过具体类型声明，例如 `int`、`double`、`boolean`，或像 `String` 这样的引用类型。
- 作用域：
  Java 的局部变量采用块级作用域；字段则属于对象作用域或类作用域，取决于它是实例成员还是静态成员。
- 原始类型：
  Java 提供 `byte`、`short`、`int`、`long`、`float`、`double`、`char`、`boolean` 等 primitive。
- 引用类型：
  对象、数组和类实例都属于引用类型。
- 类型推断：
  `var` 可以用于局部变量推断，但推断出的类型依然是固定的静态类型。

```java
var count = 10;
String message = "hello";
```

有两个基础区别需要尽早建立：

- 原始类型与引用语义：
  primitive 赋值会直接复制值；引用类型赋值复制的是对象引用。
- `final`：
  `final` 变量初始化后不能重新绑定，但它所指向的对象仍然可能是可变的。

## 2. Control Flow
Java 的控制流模型很经典，但现代版本也加入了带模式倾向的 `switch` 和更具表达力的分支写法。

```java
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
  `switch` 适合多分支判断，较新的 Java 版本支持箭头语法和更现代的 case 写法。
- 迭代：
  Java 支持 `for`、增强 `for`、`while` 和 `do-while`。
- 分支控制：
  `break` 和 `continue` 可用于循环与 `switch`，也支持标签语句控制更复杂的嵌套流程。
- 逻辑运算：
  `&&`、`||`、`!` 都采用短路语义。

```java
for (int item : new int[]{1, 2, 3}) {
    if (item == 2) {
        continue;
    }
    System.out.println(item);
}
```

现代 `switch` 表达式还能直接返回值：

```java
String label = switch (score / 10) {
    case 10, 9 -> "excellent";
    case 8, 7 -> "good";
    default -> "needs work";
};
```

## 3. Functions
在 Java 中，函数通常就是定义在类内部的方法。Java 也支持 lambda 和方法引用，但具名行为仍主要通过实例方法、静态方法和接口来组织。

```java
public class Greeter {
    public static String greet(String name) {
        return "Hello, " + name;
    }
}
```

- 定义与调用：
  方法声明包含返回类型、名称、参数和访问修饰符。
- 参数：
  参数类型必须显式声明。Java 语言本身不支持默认参数。
- 返回值：
  方法返回一个值，但这个值当然可以是包含多个字段的对象。
- 重载：
  Java 支持基于参数签名的方法重载。
- Lambda：
  函数式接口让 Java 可以更简洁地写回调风格代码。

```java
public static double divide(double a, double b) {
    if (b == 0.0) {
        throw new IllegalArgumentException("division by zero");
    }
    return a / b;
}
```

lambda 在集合和 Stream 中很常见：

```java
List<Integer> doubled = numbers.stream()
    .map(value -> value * 2)
    .toList();
```

Java 的闭包只能捕获“有效 final”的局部变量，这比很多脚本语言的闭包行为更受限制。

## 4. Data Structures
Java 的核心数据结构主要分为数组和 Collections Framework。语言本身是 class-based 的，因此对象是大部分数据建模的中心。

- Arrays：
  固定长度、支持索引访问的序列。
- Lists：
  最常见的是 `ArrayList`，用于可增长的有序集合。
- Maps：
  最常见的是 `HashMap`，用于键值存储。
- Sets：
  最常见的是 `HashSet`，用于唯一值集合。
- Classes 与 records：
  用于建模领域数据的主要工具。

```java
import java.util.*;

List<Integer> numbers = List.of(10, 20, 30);
int first = numbers.get(0);

Map<String, String> user = new HashMap<>();
user.put("name", "Ada");
user.put("level", "advanced");

Set<String> tags = new HashSet<>(List.of("java", "backend", "java"));
```

对于结构化记录，可以使用：

```java
public record User(String name, int score) {}
```

几个实践区别需要注意：

- 数组与集合：
  数组更底层且长度固定；集合在多数应用代码里更易用。
- 可变性：
  像 `List.of()` 这样的工厂方法会返回不可变集合。
- 可空性：
  Java 引用可以为 `null`，因此缺失值处理始终是设计重点。

## 5. Error Handling
Java 通过异常机制表达错误，并区分 checked exception、unchecked exception，以及更严重的 JVM 级错误。

```java
public static int parsePort(String raw) {
    int port = Integer.parseInt(raw);

    if (port <= 0 || port > 65535) {
        throw new IllegalArgumentException("port out of range");
    }

    return port;
}
```

- `try` / `catch`：
  用于拦截异常并在本地处理。
- `finally`：
  无论是否发生异常都会执行，常用于清理资源。
- Checked exceptions：
  必须声明或处理，使失败路径更显式，但也会增加样板代码。
- Unchecked exceptions：
  即 `RuntimeException` 的子类，常用于编程错误或非法状态。
- 自定义异常：
  在分层应用中很常见，用于表达领域失败。

```java
public class ConfigException extends RuntimeException {
    public ConfigException(String message) {
        super(message);
    }
}
```

Java 还支持 try-with-resources，这对安全资源清理非常重要：

```java
try (var reader = Files.newBufferedReader(path)) {
    return reader.readLine();
}
```

## 6. Modules & Imports
Java 通过 package、import、构建工具以及 JVM 的 classpath 或 module path 来组织代码。由于生态历史很长，真实项目里常常会同时见到新旧两套惯例。

```java
package com.example.app;

import java.nio.file.Path;
import java.util.List;
```

- Packages：
  package 用于组织相关类并避免命名冲突。
- Imports：
  import 把类名引入当前作用域，当然也可以直接写全限定名。
- 标准库：
  Java 自带了覆盖集合、并发、IO、网络、时间等领域的大量 API。
- 外部依赖：
  Maven 和 Gradle 是最主流的构建与依赖管理工具。
- Java modules：
  Java Platform Module System 已存在，但很多项目仍主要依靠 package 结构和构建工具约定。

```java
module com.example.app {
    requires java.sql;
}
```

在真实项目里，package 命名、依赖边界和构建结构的重要性，并不亚于语言层面的 import 语法。
