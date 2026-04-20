---
title: Java Foundations
---

Java is a statically typed, object-oriented language built around the JVM and a large, mature ecosystem. It emphasizes explicit structure, strong tooling, and portability, and while modern Java has become far more expressive than early versions, classes, interfaces, exceptions, and the standard library still define its core development style.

## 1. Variables & Types
Java variables have explicit static types, and the compiler checks assignments, method calls, and conversions at compile time. Type inference exists in limited places, but Java remains far more explicit than dynamically typed languages.

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

- Declaration:
  Variables are declared with a concrete type, such as `int`, `double`, `boolean`, or a reference type like `String`.
- Scope:
  Java uses block scope for local variables, and fields belong to object or class scope depending on whether they are instance or static members.
- Primitive types:
  Java includes primitives such as `byte`, `short`, `int`, `long`, `float`, `double`, `char`, and `boolean`.
- Reference types:
  Objects, arrays, and class instances are reference types.
- Type inference:
  `var` is available for local variable inference, but the inferred type is still fixed and static.

```java
var count = 10;
String message = "hello";
```

Two foundational distinctions matter early:

- Primitive vs. reference semantics:
  Primitive assignments copy values directly, while reference assignments copy references to objects.
- `final`:
  A `final` variable cannot be rebound after initialization, though the object it refers to may still be mutable.

## 2. Control Flow
Java has a familiar structured control-flow model, but modern versions also add pattern-aware `switch` and more expressive branching than older Java code is known for.

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

- Conditional branching:
  Use `if`, `else if`, and `else`.
- Switch:
  `switch` is useful for multi-way branching, and newer Java versions support arrow syntax and pattern-oriented cases.
- Iteration:
  Java supports `for`, enhanced `for`, `while`, and `do-while`.
- Branch control:
  `break` and `continue` work in loops and `switch`, and labeled statements exist for more explicit nesting control.
- Logical operators:
  `&&`, `||`, and `!` short-circuit as expected.

```java
for (int item : new int[]{1, 2, 3}) {
    if (item == 2) {
        continue;
    }
    System.out.println(item);
}
```

Modern switch expressions can return values directly:

```java
String label = switch (score / 10) {
    case 10, 9 -> "excellent";
    case 8, 7 -> "good";
    default -> "needs work";
};
```

## 3. Functions
In Java, functions are usually methods declared inside classes. Java does support lambdas and method references, but named behavior is still commonly organized through instance methods, static methods, and interfaces.

```java
public class Greeter {
    public static String greet(String name) {
        return "Hello, " + name;
    }
}
```

- Definition and invocation:
  Methods are declared with return type, name, parameters, and access modifiers.
- Parameters:
  Parameter types are explicit. Java does not support default parameters in the language.
- Return values:
  Methods return one value, though that value can be an object holding multiple fields.
- Overloading:
  Java supports method overloading by parameter signature.
- Lambdas:
  Functional interfaces allow concise lambda expressions for callback-style code.

```java
public static double divide(double a, double b) {
    if (b == 0.0) {
        throw new IllegalArgumentException("division by zero");
    }
    return a / b;
}
```

Lambdas are common with collections and streams:

```java
List<Integer> doubled = numbers.stream()
    .map(value -> value * 2)
    .toList();
```

Java closures capture effectively final variables, which is more restrictive than the closure behavior in many scripting languages.

## 4. Data Structures
Java's core data structures are split between arrays and the Collections Framework. The language itself is class-based, so objects are central to most data modeling.

- Arrays:
  Fixed-size sequences with indexed access.
- Lists:
  Commonly `ArrayList` for growable ordered collections.
- Maps:
  Commonly `HashMap` for key-value storage.
- Sets:
  Commonly `HashSet` for unique values.
- Classes and records:
  Primary tools for modeling domain data.

```java
import java.util.*;

List<Integer> numbers = List.of(10, 20, 30);
int first = numbers.get(0);

Map<String, String> user = new HashMap<>();
user.put("name", "Ada");
user.put("level", "advanced");

Set<String> tags = new HashSet<>(List.of("java", "backend", "java"));
```

For structured records:

```java
public record User(String name, int score) {}
```

A few practical distinctions matter:

- Arrays vs. collections:
  Arrays are lower-level and fixed in size; collections are more ergonomic for most application code.
- Mutability:
  Some factory methods such as `List.of()` produce immutable collections.
- Nullability:
  Java references can be `null`, so absence handling remains an important design concern.

## 5. Error Handling
Java uses exceptions for error signaling. Its error model distinguishes checked exceptions, unchecked exceptions, and serious JVM-level errors.

```java
public static int parsePort(String raw) {
    int port = Integer.parseInt(raw);

    if (port <= 0 || port > 65535) {
        throw new IllegalArgumentException("port out of range");
    }

    return port;
}
```

- `try` / `catch`:
  Used to intercept exceptions and handle them locally.
- `finally`:
  Runs regardless of whether an exception occurred, often for cleanup.
- Checked exceptions:
  Must be declared or handled, which makes failure visible but can add ceremony.
- Unchecked exceptions:
  Subclasses of `RuntimeException`, often used for programming errors or invalid state.
- Custom exceptions:
  Common in layered applications for domain-specific failure reporting.

```java
public class ConfigException extends RuntimeException {
    public ConfigException(String message) {
        super(message);
    }
}
```

Java also supports try-with-resources, which is a major tool for safe cleanup:

```java
try (var reader = Files.newBufferedReader(path)) {
    return reader.readLine();
}
```

## 6. Modules & Imports
Java organizes code through packages, imports, build tools, and the JVM classpath or module path. The ecosystem has a long history, so real projects may mix newer and older conventions.

```java
package com.example.app;

import java.nio.file.Path;
import java.util.List;
```

- Packages:
  Packages group related classes and help avoid naming collisions.
- Imports:
  Imports bring class names into scope, though fully qualified names can still be used directly.
- Standard library:
  Java includes extensive APIs for collections, concurrency, IO, networking, time, and more.
- External dependencies:
  Maven and Gradle are the dominant build and dependency tools.
- Java modules:
  The Java Platform Module System exists, but many projects still rely primarily on package-level structure and build-tool conventions.

```java
module com.example.app {
    requires java.sql;
}
```

In practice, package naming, dependency boundaries, and build structure matter as much as the language-level import syntax.
