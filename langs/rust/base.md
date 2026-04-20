---
title: Rust Foundations
---

Rust is a statically typed, compiled systems language focused on memory safety, explicitness, and performance. Its syntax is approachable, but its real learning curve comes from ownership, borrowing, lifetimes, and the way those rules shape APIs and program structure.

## 1. Variables & Types
Rust variables have explicit static types, even when the compiler infers them. The language strongly favors compile-time guarantees, so type information, mutability, and ownership are all visible parts of the code's meaning.

```rust
fn main() {
    let name = "Ada";
    let version: u32 = 1;
    let is_ready = true;
    let pi = 3.14159_f64;

    println!("{name} {version} {is_ready} {pi}");
}
```

- Declaration:
  Use `let` for bindings and `let mut` when a binding must be mutable.
- Scope:
  Rust uses block scope, and values are typically dropped when they leave scope.
- Primitive types:
  Common primitives include signed and unsigned integers, floating-point types, `bool`, `char`, and the unit type `()`.
- Type inference:
  Rust infers many local types, but the inferred type is still fixed and checked statically.
- Immutability by default:
  Bindings are immutable unless explicitly marked `mut`.

```rust
let count = 10;
let mut total = 0;
total += count;
```

Two foundational ideas matter immediately:

- Ownership:
  Every value has an owner, and many moves transfer ownership instead of copying data.
- Copy vs. move:
  Small primitive types often implement `Copy`, while heap-owning types such as `String` move by default.

```rust
let a = String::from("rust");
let b = a;
// a can no longer be used here
```

References let you borrow values without taking ownership, but the borrow checker enforces strict rules so references never outlive the data they point to.

## 2. Control Flow
Rust control flow is expression-oriented. Many branches and blocks produce values, which helps reduce temporary state and makes intent explicit.

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

- Conditional branching:
  Use `if`, `else if`, and `else`, and note that `if` is an expression.
- Pattern matching:
  `match` is central in Rust and is used for enums, options, results, and destructuring.
- Iteration:
  Rust supports `loop`, `while`, and `for`.
- Branch control:
  `break`, `continue`, and loop labels exist for precise control.
- Exhaustiveness:
  `match` arms must be exhaustive, which pushes error cases and edge cases into explicit code.

```rust
for item in [1, 2, 3] {
    if item == 2 {
        continue;
    }
    println!("{item}");
}
```

Pattern matching is one of Rust's core strengths:

```rust
let status = Some(200);

match status {
    Some(code) if code >= 400 => println!("error"),
    Some(code) => println!("ok: {code}"),
    None => println!("missing"),
}
```

## 3. Functions
Functions in Rust are explicit and predictable. There are no default arguments, no overloading in the language itself, and no hidden exceptions in ordinary control flow.

```rust
fn greet(name: &str) -> String {
    format!("Hello, {name}")
}
```

- Definition and invocation:
  Use `fn` to define functions.
- Parameters:
  Parameters always require explicit types.
- Return values:
  The last expression in a block can be returned implicitly if it has no trailing semicolon.
- Closures:
  Closures can capture their environment by borrow, mutable borrow, or move.
- Ownership in APIs:
  A function's signature tells you whether it takes ownership, borrows immutably, or borrows mutably.

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err(String::from("division by zero"));
    }

    Ok(a / b)
}
```

Closures are common in iterator-heavy code:

```rust
let numbers = vec![1, 2, 3];
let doubled: Vec<_> = numbers.iter().map(|value| value * 2).collect();
```

Understanding how a closure captures state is important because it affects trait bounds such as `Fn`, `FnMut`, and `FnOnce`.

## 4. Data Structures
Rust provides solid standard data structures and makes the cost model more visible than many higher-level languages. Choosing between stack allocation, heap allocation, borrowing, and owned collections is part of everyday design.

- Arrays:
  Fixed-size collections stored inline.
- Vectors:
  Heap-allocated, growable sequences via `Vec<T>`.
- Slices:
  Borrowed views into contiguous data such as arrays, vectors, and strings.
- Hash maps and hash sets:
  Common key-value and unique-value collections from the standard library.
- Structs and enums:
  Core tools for modeling data and state transitions.

```rust
use std::collections::{HashMap, HashSet};

let numbers = vec![10, 20, 30];
let first = numbers[0];
let tail = &numbers[1..];

let mut user = HashMap::new();
user.insert("name", "Ada");

let tags: HashSet<_> = ["rust", "systems", "rust"].into_iter().collect();
```

Structs model records:

```rust
struct User {
    name: String,
    score: u32,
}
```

Enums are especially powerful because they can carry data:

```rust
enum Status {
    Idle,
    Loading,
    Failed(String),
}
```

Rust often prefers enums over null-like absence or loosely typed status flags because the compiler can then force exhaustive handling.

## 5. Error Handling
Rust distinguishes recoverable errors from unrecoverable failures. Recoverable errors use `Result<T, E>`, while unrecoverable conditions may use `panic!`.

```rust
fn parse_port(raw: &str) -> Result<u16, String> {
    let port: u16 = raw.parse().map_err(|_| String::from("invalid integer"))?;

    if port == 0 {
        return Err(String::from("port out of range"));
    }

    Ok(port)
}
```

- `Result`:
  The standard type for recoverable failure.
- `Option`:
  Used when absence is normal and not necessarily an error.
- `?` operator:
  Propagates errors concisely when the surrounding function also returns a compatible `Result` or `Option`.
- Custom error types:
  Common in larger codebases for better context and matching.
- Panic:
  Reserved for bugs, invariant violations, or impossible states rather than routine failure.

```rust
let contents = std::fs::read_to_string("config.toml")
    .map_err(|error| format!("failed to read config: {error}"))?;
```

Rust's error handling is explicit, but it remains ergonomic because pattern matching and the `?` operator compose well.

## 6. Modules & Imports
Rust organizes code with modules, crates, and packages, while Cargo provides the standard workflow for builds and dependencies. Namespaces are explicit and compiler-checked.

```rust
use std::path::PathBuf;

fn config_path(filename: &str) -> PathBuf {
    PathBuf::from(filename)
}
```

- Modules:
  Use `mod` to define modules and `use` to bring names into scope.
- Crates:
  A crate is a compilation unit, either binary or library.
- Packages:
  Cargo packages are described in `Cargo.toml` and may contain one or more crates.
- Standard library vs. external crates:
  The standard library covers core collections, threading, IO, formatting, and more, while third-party crates are managed through Cargo.
- Visibility:
  Items are private by default and exposed with `pub`.

```toml
[package]
name = "my_app"
version = "0.1.0"
edition = "2021"
```

Rust's module system is strict, but that strictness helps make boundaries, ownership, and public API surfaces explicit.
