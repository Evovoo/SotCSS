---
title: Kotlin 基础
---

Kotlin 是一种静态类型语言，目标是以更简洁、更安全、更有表达力的方式支持 JVM、Android、服务端和多平台开发。它建立在熟悉的面向对象与函数式思想之上，同时大幅减少样板代码，并把空安全纳入语言核心。

## 1. Variables & Types
Kotlin 变量具有静态类型，但编译器在很多常见场景下都能做出很强的类型推断。Kotlin 最有标志性的特性之一是空安全，它让可空值和不可空值在类型层面成为明确区分。

```kotlin
fun main() {
    val name: String = "Ada"
    val version = 2
    val isReady = true
    val score = 98.5

    println("$name $version $isReady $score")
}
```

- 声明方式：
  使用 `val` 表示只读引用，使用 `var` 表示可变引用。
- 作用域：
  Kotlin 的局部变量采用块级作用域，类成员则属于属性作用域。
- 类原始内建类型：
  常见内建类型包括 `Int`、`Long`、`Double`、`Boolean`、`Char` 和 `String`。
- 类型推断：
  Kotlin 经常能自动推断局部变量类型。
- 空安全：
  `String` 和 `String?` 是不同类型，编译器会强制你区分它们。

```kotlin
val count = 10
var total = 0
val nickname: String? = null
```

两个基础点很关键：

- `val` 与 `var`：
  `val` 禁止重新赋值，`var` 允许重新绑定。
- 可空与不可空：
  对 null 的处理必须显式通过 `?`、安全调用、Elvis 操作符等方式表达。

```kotlin
val length = nickname?.length ?: 0
```

类型推断加上严格 null 建模，是 Kotlin 实用性很强的一部分来源。

## 2. Control Flow
Kotlin 的控制流非常偏表达式风格。很多常见结构如 `if` 和 `when` 都可以直接返回值，这通常能减少临时变量和层层嵌套。

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

- 条件分支：
  `if` 同时可以作为语句和表达式使用。
- `when`：
  Kotlin 的 `when` 比传统 switch 更强，是很多惯用写法的核心。
- 迭代：
  Kotlin 支持 `for`、`while` 和 `do-while`。
- 分支控制：
  在需要时也支持 `break`、`continue` 和标签。
- 布尔逻辑：
  `&&`、`||` 和 `!` 采用标准短路语义。

```kotlin
for (item in listOf(1, 2, 3)) {
    if (item == 2) continue
    println(item)
}
```

`when` 尤其重要：

```kotlin
fun describe(value: Any): String = when (value) {
    is Int -> "int: $value"
    is String -> "string: $value"
    else -> "unknown"
}
```

这让 Kotlin 在表达分支和类型检查时，比很多老 JVM 语言更自然。

## 3. Functions
函数在 Kotlin 中是核心结构，语言让它们足够简洁，同时不牺牲清晰度。命名参数、默认值、高阶函数和扩展函数共同构成了 Kotlin 很有表现力的函数模型。

```kotlin
fun greet(name: String, prefix: String = "Hello"): String {
    return "$prefix, $name"
}
```

- 定义与调用：
  函数使用 `fun` 定义。
- 参数：
  Kotlin 支持默认参数和命名参数。
- 返回值：
  简单场景下返回类型可推断，但公共 API 中显式标注仍很常见。
- 高阶函数：
  函数可以接收或返回其他函数。
- 闭包：
  lambda 和局部函数都可以捕获外部状态。

```kotlin
fun divide(a: Double, b: Double): Double {
    require(b != 0.0) { "division by zero" }
    return a / b
}
```

Lambda 很常见：

```kotlin
val doubled = listOf(1, 2, 3).map { it * 2 }
```

扩展函数也是 Kotlin 的代表性特性：

```kotlin
fun String.initials(): String = split(" ").map { it.first() }.joinToString("")
```

它们能让 API 用起来更流畅，但编译后本质上仍然是普通静态行为。

## 4. Data Structures
Kotlin 提供了标准集合，同时通过 data class、偏不可变风格和精炼集合 API 让数据建模更顺手。

- Lists：
  有序集合，通过 `List<T>` 和 `MutableList<T>` 使用。
- Maps：
  键值集合，通过 `Map<K, V>` 使用。
- Sets：
  唯一值集合，通过 `Set<T>` 使用。
- Data classes：
  紧凑值对象模型，自动生成 `equals`、`hashCode` 和 `toString`。
- Pairs 与 triples：
  轻量值组合工具，但领域建模通常更适合显式类型。

```kotlin
val numbers = listOf(10, 20, 30)
val first = numbers.first()

val user = mapOf(
    "name" to "Ada",
    "level" to "advanced"
)
```

Data class 尤其重要：

```kotlin
data class User(
    val name: String,
    val score: Int
)
```

几个结构层面的区别很关键：

- 只读集合与可变集合接口：
  Kotlin 鼓励使用只读视图，即便底层实现有时仍可能是可变的。
- Data class 与普通 class：
  Data class 适合值语义模型，但不是所有类型都应该写成 data class。
- 集合 API：
  `map`、`filter`、`associate`、`groupBy` 等操作在 Kotlin 中非常核心。

Kotlin 的数据建模之所以受欢迎，很大程度上是因为它把样板代码压得很低，又没有把底层结构藏起来。

## 5. Error Handling
Kotlin 继承的是 JVM 异常模型，但其标准库和惯用写法通常鼓励你更显式地做校验和安全处理，而不是任由 unchecked exception 四处蔓延。

```kotlin
fun parsePort(raw: String): Int {
    val port = raw.toInt()
    require(port in 1..65535) { "port out of range" }
    return port
}
```

- 异常：
  Kotlin 在运行时使用和 Java 一样的异常机制。
- `try` / `catch`：
  用于本地恢复，而且本身也可以作为表达式。
- `finally`：
  会在 `try` / `catch` 完成后执行。
- 自定义异常：
  应用可以定义领域相关异常类型。
- 校验辅助函数：
  `require`、`check` 和 `error` 是表达不变量失败的常用工具。

```kotlin
class ConfigException(message: String) : RuntimeException(message)
```

Kotlin 没有 checked exception，因此失败预期通常需要通过 API 设计、文档、sealed result 类型或团队约定来表达。

## 6. Modules & Imports
Kotlin 代码通常通过 package 和 module 组织，而真实项目则高度受 Gradle 或 Maven 构建结构影响。导入语法很简单，但模块边界对可维护性影响很大。

```kotlin
package com.example.app

import kotlin.math.max
```

- Packages：
  用于组织相关类、函数和文件。
- Imports：
  Kotlin 支持普通 import，也支持别名 import。
- 顶层声明：
  Kotlin 允许函数和属性存在于类之外。
- 标准库：
  Kotlin 标准库在 JVM 生态之上提供了大量实用 API。
- 构建模块：
  真实项目常通过构建配置拆分 domain、app、infrastructure 和 shared 模块。

```kotlin
import com.example.shared.User as SharedUser
```

Kotlin 的模块设计非常重要，因为语言确实让你写代码更轻松，但如果 package 和 module 边界薄弱，架构扩张依然会发生。
