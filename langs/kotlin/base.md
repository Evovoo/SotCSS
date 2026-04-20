---
title: Kotlin Foundations
---

Kotlin is a statically typed language designed for concise, expressive, and safe programming across the JVM, Android, server, and multiplatform environments. It builds on familiar object-oriented and functional ideas while reducing boilerplate and making null safety a core part of the language.

## 1. Variables & Types
Kotlin variables have static types, but the compiler performs strong type inference in many common situations. One of Kotlin's defining language features is null safety, which makes nullable and non-nullable values distinct at the type level.

```kotlin
fun main() {
    val name: String = "Ada"
    val version = 2
    val isReady = true
    val score = 98.5

    println("$name $version $isReady $score")
}
```

- Declaration:
  Use `val` for read-only references and `var` for mutable references.
- Scope:
  Kotlin uses block scope for local variables and property scope for class members.
- Primitive-like types:
  Common built-in types include `Int`, `Long`, `Double`, `Boolean`, `Char`, and `String`.
- Type inference:
  Kotlin often infers the type of a local variable automatically.
- Null safety:
  `String` and `String?` are different types, and the compiler enforces that distinction.

```kotlin
val count = 10
var total = 0
val nickname: String? = null
```

Two foundational Kotlin ideas matter early:

- `val` vs. `var`:
  `val` prevents reassignment of the reference, while `var` allows rebinding.
- Nullable vs. non-nullable:
  Null handling is explicit through `?`, safe calls, Elvis operators, and checked access patterns.

```kotlin
val length = nickname?.length ?: 0
```

This combination of type inference and strict null modeling is one of Kotlin's biggest practical advantages.

## 2. Control Flow
Kotlin control flow is expression-friendly. Many familiar constructs such as `if` and `when` can return values directly, which often reduces temporary variables and nested branching.

```kotlin
val score = 87

val grade = if (score >= 90) {
    "A"
} else if (score >= 80) {
    "B"
} else {
    "C"
}
```

- Conditional branching:
  `if` works as both a statement and an expression.
- `when`:
  Kotlin's `when` is more powerful than a traditional switch and is central to many idiomatic designs.
- Iteration:
  Kotlin supports `for`, `while`, and `do-while`.
- Branch control:
  `break`, `continue`, and labels exist when needed.
- Boolean logic:
  `&&`, `||`, and `!` behave as expected with short-circuit semantics.

```kotlin
for (item in listOf(1, 2, 3)) {
    if (item == 2) continue
    println(item)
}
```

`when` is especially important:

```kotlin
fun describe(value: Any): String = when (value) {
    is Int -> "int: $value"
    is String -> "string: $value"
    else -> "unknown"
}
```

This helps Kotlin express branching and type checks more clearly than many older JVM languages.

## 3. Functions
Functions are central in Kotlin, and the language makes them concise without removing clarity. Named arguments, default values, higher-order functions, and extension functions all contribute to an expressive function model.

```kotlin
fun greet(name: String, prefix: String = "Hello"): String {
    return "$prefix, $name"
}
```

- Definition and invocation:
  Functions are declared with `fun`.
- Parameters:
  Kotlin supports default arguments and named arguments.
- Return values:
  Return types can be inferred in simple cases, though explicit types are common in public APIs.
- Higher-order functions:
  Functions can accept or return other functions.
- Closures:
  Lambdas and local functions can capture surrounding state.

```kotlin
fun divide(a: Double, b: Double): Double {
    require(b != 0.0) { "division by zero" }
    return a / b
}
```

Lambdas are common:

```kotlin
val doubled = listOf(1, 2, 3).map { it * 2 }
```

Extension functions are also a major Kotlin feature:

```kotlin
fun String.initials(): String = split(" ").map { it.first() }.joinToString("")
```

They make APIs feel more fluent while still compiling down to normal static behavior.

## 4. Data Structures
Kotlin provides standard collections and also improves data modeling through data classes, immutable-looking usage patterns, and concise collection APIs.

- Lists:
  Ordered collections via `List<T>` and `MutableList<T>`.
- Maps:
  Key-value collections via `Map<K, V>`.
- Sets:
  Unique-value collections via `Set<T>`.
- Data classes:
  Compact model classes with generated `equals`, `hashCode`, and `toString`.
- Pairs and triples:
  Lightweight grouping helpers, though domain types are often clearer.

```kotlin
val numbers = listOf(10, 20, 30)
val first = numbers.first()

val user = mapOf(
    "name" to "Ada",
    "level" to "advanced"
)
```

Data classes are especially important:

```kotlin
data class User(
    val name: String,
    val score: Int
)
```

Some structural distinctions matter:

- Read-only vs. mutable collection interfaces:
  Kotlin encourages read-only views even when underlying implementations may still be mutable.
- Data classes vs. regular classes:
  Data classes are great for value-like models, but not every type should be one.
- Collections API:
  Operations such as `map`, `filter`, `associate`, and `groupBy` are central to idiomatic Kotlin.

Kotlin data modeling is often praised because it removes boilerplate without hiding the underlying structure.

## 5. Error Handling
Kotlin inherits the JVM exception model, but its standard library and language idioms often encourage explicit validation and safe handling patterns instead of unchecked chaos.

```kotlin
fun parsePort(raw: String): Int {
    val port = raw.toInt()
    require(port in 1..65535) { "port out of range" }
    return port
}
```

- Exceptions:
  Kotlin uses exceptions just like Java at runtime.
- `try` / `catch`:
  Used for local recovery and can itself be an expression.
- `finally`:
  Runs after the `try` / `catch` flow completes.
- Custom exceptions:
  Applications can define domain-specific exception types.
- Validation helpers:
  `require`, `check`, and `error` are common for expressing invariant failures.

```kotlin
class ConfigException(message: String) : RuntimeException(message)
```

Kotlin does not have checked exceptions, so failure expectations usually need to be communicated through API design, documentation, sealed result types, or conventions.

## 6. Modules & Imports
Kotlin code is typically organized into packages and modules, and real projects are strongly shaped by Gradle or Maven build structure. Imports are simple, but module layout matters a lot for maintainability.

```kotlin
package com.example.app

import kotlin.math.max
```

- Packages:
  Organize related classes, functions, and files.
- Imports:
  Kotlin supports regular imports and alias imports.
- Top-level declarations:
  Functions and properties can exist outside classes.
- Standard library:
  Kotlin's standard library adds many useful APIs on top of the JVM ecosystem.
- Build modules:
  Real projects often separate domain, app, infrastructure, and shared modules through build configuration.

```kotlin
import com.example.shared.User as SharedUser
```

Kotlin module design matters because the language makes it easy to write concise code, but architectural sprawl still happens if package and module boundaries are weak.
