---
title: Rust 基础
---

Rust 是一种静态类型、编译型系统语言，核心目标是内存安全、明确性和高性能。它的语法表面上不难，但真正的学习曲线来自所有权、借用、生命周期，以及这些规则如何反过来塑造 API 和程序结构。

## 1. Variables & Types
Rust 变量具有明确的静态类型，即使编译器能够自动推断。Rust 强调编译期保证，因此类型信息、可变性和所有权都是代码语义的一部分。

```rust
fn main() {
    let name = "Ada";
    let version: u32 = 1;
    let is_ready = true;
    let pi = 3.14159_f64;

    println!("{name} {version} {is_ready} {pi}");
}
```

- 声明方式：
  使用 `let` 进行绑定；如果需要可变绑定，使用 `let mut`。
- 作用域：
  Rust 采用块级作用域，值通常会在离开作用域时被释放。
- 基础类型：
  常见原始类型包括有符号和无符号整数、浮点数、`bool`、`char` 以及单元类型 `()`。
- 类型推断：
  Rust 能推断很多局部类型，但推断结果仍然是固定且静态检查的。
- 默认不可变：
  绑定默认不可变，除非显式写成 `mut`。

```rust
let count = 10;
let mut total = 0;
total += count;
```

有两个基础概念必须尽早建立：

- 所有权：
  每个值都有一个所有者，很多赋值和传参都会转移所有权，而不是简单复制数据。
- Copy 与 move：
  小型原始类型通常实现 `Copy`，而像 `String` 这种拥有堆内存的类型默认会 move。

```rust
let a = String::from("rust");
let b = a;
// a can no longer be used here
```

引用允许你在不取得所有权的情况下借用值，但借用检查器会强制保证：引用绝不会活得比它所指向的数据更久。

## 2. Control Flow
Rust 的控制流是表达式导向的。很多分支和代码块本身就能产生值，这使临时状态更少，也让意图更明确。

```rust
let score = 87;

let grade = if score >= 90 {
    "A"
} else if score >= 80 {
    "B"
} else {
    "C"
};
```

- 条件分支：
  使用 `if`、`else if`、`else`，并注意 `if` 本身是表达式。
- 模式匹配：
  `match` 是 Rust 的核心能力，广泛用于枚举、option、result 和解构。
- 迭代：
  Rust 支持 `loop`、`while` 和 `for`。
- 分支控制：
  支持 `break`、`continue` 和循环标签，以实现更精确的流程控制。
- 穷尽性：
  `match` 必须覆盖所有可能分支，这会强迫错误场景和边界情况进入显式代码。

```rust
for item in [1, 2, 3] {
    if item == 2 {
        continue;
    }
    println!("{item}");
}
```

模式匹配是 Rust 最大的优势之一：

```rust
let status = Some(200);

match status {
    Some(code) if code >= 400 => println!("error"),
    Some(code) => println!("ok: {code}"),
    None => println!("missing"),
}
```

## 3. Functions
Rust 的函数设计显式且可预测。语言本身没有默认参数、没有函数重载，普通控制流里也没有隐藏异常。

```rust
fn greet(name: &str) -> String {
    format!("Hello, {name}")
}
```

- 定义与调用：
  使用 `fn` 定义函数。
- 参数：
  参数类型必须显式声明。
- 返回值：
  代码块里的最后一个表达式如果没有分号，就会被隐式返回。
- 闭包：
  闭包可以通过借用、可变借用或 move 的方式捕获环境。
- 所有权在 API 中的体现：
  函数签名会明确告诉你，它是取得所有权、不可变借用，还是可变借用。

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err(String::from("division by zero"));
    }

    Ok(a / b)
}
```

闭包在迭代器风格代码中很常见：

```rust
let numbers = vec![1, 2, 3];
let doubled: Vec<_> = numbers.iter().map(|value| value * 2).collect();
```

理解闭包如何捕获状态很重要，因为它会影响 `Fn`、`FnMut`、`FnOnce` 这类 trait 约束。

## 4. Data Structures
Rust 提供了扎实的标准数据结构，而且比很多高级语言更明确地暴露成本模型。是否栈上分配、堆上分配、借用视图还是拥有型集合，都是日常设计的一部分。

- Arrays：
  固定大小、内联存储的集合。
- Vectors：
  通过 `Vec<T>` 表示的堆分配可增长序列。
- Slices：
  对连续数据的借用视图，可来自数组、向量或字符串。
- Hash maps 与 hash sets：
  标准库里的常用键值集合和去重集合。
- Structs 与 enums：
  Rust 中建模数据与状态转换的核心工具。

```rust
use std::collections::{HashMap, HashSet};

let numbers = vec![10, 20, 30];
let first = numbers[0];
let tail = &numbers[1..];

let mut user = HashMap::new();
user.insert("name", "Ada");

let tags: HashSet<_> = ["rust", "systems", "rust"].into_iter().collect();
```

结构体适合表示记录：

```rust
struct User {
    name: String,
    score: u32,
}
```

枚举尤其强大，因为它不仅能区分状态，还能携带数据：

```rust
enum Status {
    Idle,
    Loading,
    Failed(String),
}
```

Rust 常常更倾向用 enum 表达状态，而不是使用 null 式缺失值或松散的状态标志，因为编译器可以强制你做穷尽处理。

## 5. Error Handling
Rust 明确区分可恢复错误和不可恢复失败。可恢复错误通常使用 `Result<T, E>`，而真正不可恢复的情况可能使用 `panic!`。

```rust
fn parse_port(raw: &str) -> Result<u16, String> {
    let port: u16 = raw.parse().map_err(|_| String::from("invalid integer"))?;

    if port == 0 {
        return Err(String::from("port out of range"));
    }

    Ok(port)
}
```

- `Result`：
  可恢复失败的标准表达方式。
- `Option`：
  当“没有值”是正常情况、而不一定是错误时使用。
- `?` 运算符：
  如果当前函数返回兼容的 `Result` 或 `Option`，就可以简洁地向上传播错误。
- 自定义错误类型：
  在大型代码库中很常见，方便附带更多上下文并做模式匹配。
- Panic：
  更适合程序 bug、不变量破坏或不可能状态，而不是日常业务失败。

```rust
let contents = std::fs::read_to_string("config.toml")
    .map_err(|error| format!("failed to read config: {error}"))?;
```

Rust 的错误处理是显式的，但由于模式匹配和 `?` 运算符配合得很好，所以并不笨重。

## 6. Modules & Imports
Rust 使用 module、crate 和 package 组织代码，Cargo 提供标准的构建与依赖工作流。命名空间是显式且受编译器检查的。

```rust
use std::path::PathBuf;

fn config_path(filename: &str) -> PathBuf {
    PathBuf::from(filename)
}
```

- Modules：
  使用 `mod` 定义模块，使用 `use` 把名称引入当前作用域。
- Crates：
  crate 是编译单元，可以是二进制 crate，也可以是库 crate。
- Packages：
  Cargo package 由 `Cargo.toml` 描述，可以包含一个或多个 crate。
- 标准库与外部 crate：
  标准库覆盖核心集合、线程、IO、格式化等常见能力；第三方 crate 通过 Cargo 管理。
- 可见性：
  条目默认私有，通过 `pub` 暴露给外部。

```toml
[package]
name = "my_app"
version = "0.1.0"
edition = "2021"
```

Rust 的模块系统比较严格，但这种严格性本身就在帮助你把边界、所有权和公共 API 设计得更明确。
