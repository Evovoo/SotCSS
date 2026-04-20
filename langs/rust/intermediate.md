---
title: Rust Intermediate
---

At the intermediate level, Rust shifts from being a language you are learning to a language you are designing with. The important questions become how ownership affects architecture, how concurrency remains safe in real systems, and how tooling such as Cargo, testing, and observability fit into day-to-day work.

## 1. Concurrency & Async
Rust supports both thread-based concurrency and async programming, and its type system actively participates in correctness through traits such as `Send` and `Sync`.

- Threads:
  Rust's standard library provides native threads, and ownership rules prevent many accidental data races at compile time.
- Shared state:
  Types such as `Arc<T>` and `Mutex<T>` allow shared ownership and synchronized mutation when needed.
- Channels:
  Message passing through channels is common for coordination between threads and tasks.
- Async / await:
  Rust supports `async` / `await`, but futures are lazy and require an executor such as Tokio or async-std.
- Race conditions:
  Rust prevents many memory-safety races, but logical races, ordering bugs, and resource contention still exist.

```rust
use tokio::time::{sleep, Duration};

async fn fetch_user(id: u32) -> String {
    sleep(Duration::from_millis(100)).await;
    format!("user-{id}")
}
```

Important intermediate concerns:

- Executor boundaries:
  Async Rust depends on a runtime, and runtime assumptions matter at integration boundaries.
- Blocking vs. non-blocking:
  Blocking code inside async tasks can damage throughput badly.
- Ownership across tasks:
  Moving data into tasks, borrowing across `.await`, and cancellation behavior all affect API design.

## 2. Web Development
Rust is increasingly used for backend services because it offers strong performance, clear type-driven APIs, and excellent concurrency safety. Intermediate web work usually involves frameworks such as Axum, Actix Web, Rocket, or Warp.

```rust
use axum::{routing::get, Json, Router};
use serde_json::json;

async fn health() -> Json<serde_json::Value> {
    Json(json!({ "ok": true }))
}

let app = Router::new().route("/health", get(health));
```

- HTTP methods:
  `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` should still map cleanly to resource semantics.
- Routing:
  Rust frameworks typically expose strongly typed extractors for params, headers, query strings, and bodies.
- Middleware:
  Authentication, tracing, compression, rate limiting, and error shaping often live in layers or middleware stacks.
- Serialization:
  `serde` is the dominant ecosystem standard for JSON and many other formats.
- WebSockets and streaming:
  Rust handles high-concurrency network workloads well, but backpressure and task lifetimes still matter.

Intermediate Rust web work also means understanding which types cross network boundaries and which remain internal implementation details.

## 3. Data Persistence
Rust persistence code tends to be explicit, and teams often choose between SQL-focused approaches, lightweight query libraries, and fuller ORM-like abstractions depending on the project.

- SQL vs. NoSQL:
  The tradeoff depends on consistency needs, query complexity, operational constraints, and team familiarity.
- Query tooling:
  Common options include raw SQL, `sqlx`, Diesel, SeaORM, and database-specific clients.
- Connection pooling:
  Real services usually rely on pools for efficient database access.
- Migrations:
  Schema evolution should be versioned and part of deployment workflows.
- Type mapping:
  Rust's type system makes database-to-domain conversions explicit, which improves safety but increases design discipline.

```rust
let user = sqlx::query_as::<_, User>("SELECT id, email FROM users WHERE email = $1")
    .bind(email)
    .fetch_one(&pool)
    .await?;
```

Two common intermediate lessons:

- Compile-time checks help, but they do not replace understanding indexes, transactions, and query plans.
- Persistence boundaries become cleaner when domain types, transport types, and database row shapes are not all collapsed into one struct.

## 4. Testing
Rust ships with strong built-in testing support, and its ecosystem encourages fast unit tests plus focused integration tests.

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[test]
fn adds_two_numbers() {
    assert_eq!(add(2, 3), 5);
}
```

- Unit tests:
  Often live in the same file under `#[cfg(test)]` modules.
- Integration tests:
  Commonly live in the `tests/` directory and validate public behavior.
- Assertions and error testing:
  Rust's macros make expectations direct and readable.
- Property-style and parameterized testing:
  Third-party crates can extend the built-in model.
- Test isolation:
  Ownership and explicit setup tend to make shared mutable test state easier to avoid.

Intermediate Rust testing also means checking error paths, borrow-sensitive edge cases, and async behavior instead of only happy paths.

## 5. Dependency Management
Cargo is one of Rust's major strengths because dependency management, builds, testing, formatting, and documentation all live inside one coherent toolchain.

- Semantic Versioning:
  Rust crates generally use SemVer, but public API discipline still matters.
- Lock files:
  `Cargo.lock` helps keep builds reproducible.
- Crates.io and private registries:
  Most public dependencies come from crates.io, though private registries are also supported.
- Feature flags:
  Crates often expose optional functionality through Cargo features.
- Supply-chain review:
  Even with a clean toolchain, dependency auditing still matters.

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

Intermediate Rust teams also learn to manage feature combinations carefully, because compile times, binary size, and transitive surface area can all grow quickly.

## 6. Logging & Debugging
Rust observability usually combines structured logging, tracing spans, panic output, and profiling or debugger support depending on the workload.

```rust
tracing::info!(order_id = %order_id, attempt = attempt, "processing order");
```

- Log levels:
  `trace`, `debug`, `info`, `warn`, and `error` are common conventions.
- Structured instrumentation:
  The `tracing` ecosystem is widely used for async-aware spans and fields.
- Panic and backtrace analysis:
  Rust can emit useful backtraces, especially with environment configuration.
- Debuggers:
  Tools such as `lldb` or `gdb` are often used for low-level debugging.
- Profiling:
  Profilers and flamegraphs are important because performance work in Rust is usually about real runtime behavior, not guesses.

Intermediate debugging in Rust often means reading compiler diagnostics carefully first, then runtime traces and profiles second.

## 7. Packaging & Deployment
Rust deployment commonly revolves around compiling native binaries, which simplifies many operational concerns but still leaves configuration, observability, and rollout discipline as real work.

- Environment variables:
  Common for secrets, feature flags, addresses, and deployment-specific settings.
- Dockerization:
  Multi-stage builds are common to keep final images small.
- CI/CD:
  Pipelines often run `cargo fmt`, `cargo clippy`, tests, builds, and release packaging.
- Build artifacts:
  Rust typically produces static or mostly self-contained binaries.
- Reloading and release strategy:
  Development hot reload is less central than in scripting ecosystems, but deployment confidence depends on test and rollout quality.

```dockerfile
FROM rust:1.77 AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=build /app/target/release/my_app /usr/local/bin/my_app
CMD ["/usr/local/bin/my_app"]
```

Rust packaging is often simpler at runtime than many managed ecosystems, but compile times and native dependency concerns still influence team workflows.
