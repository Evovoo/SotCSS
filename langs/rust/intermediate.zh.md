---
title: Rust 进阶
---

到了进阶阶段，Rust 不再只是“正在学习的语言”，而是“正在用来做设计的语言”。关键问题会变成：所有权如何影响架构、并发如何在真实系统里保持安全，以及 Cargo、测试和可观测性如何融入日常开发。

## 1. Concurrency & Async
Rust 同时支持基于线程的并发和异步编程，而且类型系统会通过 `Send`、`Sync` 等 trait 主动参与正确性约束。

- 线程：
  Rust 标准库提供原生线程，而所有权规则可以在编译期阻止很多意外数据竞争。
- 共享状态：
  `Arc<T>`、`Mutex<T>` 等类型允许在需要时进行共享所有权和同步修改。
- Channels：
  基于 channel 的消息传递是线程和任务之间常见的协调方式。
- Async / await：
  Rust 支持 `async` / `await`，但 future 是惰性的，需要 Tokio 或 async-std 这类 executor 驱动。
- 竞态条件：
  Rust 能防止很多内存安全层面的竞争，但逻辑竞争、顺序错误和资源争用依然存在。

```rust
use tokio::time::{sleep, Duration};

async fn fetch_user(id: u32) -> String {
    sleep(Duration::from_millis(100)).await;
    format!("user-{id}")
}
```

几个重要的进阶点：

- Executor 边界：
  Async Rust 依赖运行时，因此在集成边界上，运行时假设很重要。
- 阻塞与非阻塞：
  在 async task 里执行阻塞代码会严重破坏吞吐。
- 跨任务的所有权：
  数据 move 进任务、跨 `.await` 的借用，以及取消行为，都会影响 API 设计。

## 2. Web Development
Rust 正越来越多地用于后端服务，因为它提供很强的性能、清晰的类型驱动 API，以及优秀的并发安全性。进阶 Web 开发通常会接触 Axum、Actix Web、Rocket、Warp 等框架。

```rust
use axum::{routing::get, Json, Router};
use serde_json::json;

async fn health() -> Json<serde_json::Value> {
    Json(json!({ "ok": true }))
}

let app = Router::new().route("/health", get(health));
```

- HTTP 方法：
  `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 仍应清晰映射资源语义。
- 路由：
  Rust 框架通常提供强类型 extractor 来处理参数、请求头、query 和 body。
- 中间件：
  鉴权、追踪、压缩、限流和统一错误格式通常放在 layer 或 middleware stack 中。
- 序列化：
  `serde` 是 Rust 生态中 JSON 及多种格式处理的事实标准。
- WebSocket 与流式响应：
  Rust 很适合高并发网络负载，但背压和任务生命周期依然需要认真设计。

Rust Web 进阶开发还要求你明确：哪些类型跨网络边界传输，哪些类型只是内部实现细节。

## 3. Data Persistence
Rust 的持久化代码通常较为显式，团队会根据项目需要在偏 SQL 的方案、轻量查询库和更完整的 ORM 式抽象之间选择。

- SQL 与 NoSQL：
  取舍取决于一致性需求、查询复杂度、运维约束和团队熟悉度。
- 查询工具：
  常见选择包括原生 SQL、`sqlx`、Diesel、SeaORM 以及数据库专用客户端。
- 连接池：
  真实服务通常依赖连接池提高数据库访问效率。
- 迁移：
  schema 演进应可版本化，并进入部署流程。
- 类型映射：
  Rust 的类型系统会让数据库到领域模型的转换更加显式，这提高了安全性，也提高了设计纪律要求。

```rust
let user = sqlx::query_as::<_, User>("SELECT id, email FROM users WHERE email = $1")
    .bind(email)
    .fetch_one(&pool)
    .await?;
```

两个常见进阶体会：

- 编译期检查很有帮助，但并不能替代你对索引、事务和查询计划的理解。
- 当领域类型、传输类型和数据库行结构不被压扁成同一个 struct 时，持久化边界通常会更清晰。

## 4. Testing
Rust 自带很强的测试支持，生态也鼓励快速单元测试加上聚焦明确的集成测试。

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[test]
fn adds_two_numbers() {
    assert_eq!(add(2, 3), 5);
}
```

- 单元测试：
  常放在同文件的 `#[cfg(test)]` 模块中。
- 集成测试：
  通常位于 `tests/` 目录，用来验证公共行为。
- 断言和错误测试：
  Rust 的宏让预期表达非常直接。
- 性质测试和参数化测试：
  可以通过第三方 crate 扩展标准测试模型。
- 测试隔离：
  所有权和显式初始化使共享可变测试状态更容易避免。

Rust 的进阶测试还要覆盖错误路径、借用敏感边界情况以及 async 行为，而不只是 happy path。

## 5. Dependency Management
Cargo 是 Rust 最强的优势之一，因为依赖管理、构建、测试、格式化和文档都统一在一个一致的工具链里。

- 语义化版本：
  Rust crate 一般遵循 SemVer，但公共 API 纪律依然重要。
- Lock 文件：
  `Cargo.lock` 有助于构建可复现。
- Crates.io 与私有 registry：
  大多数公开依赖来自 crates.io，当然也支持私有仓库。
- Feature flags：
  crate 经常通过 Cargo feature 暴露可选能力。
- 供应链审查：
  即使工具链整洁，依赖审计仍然重要。

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

Rust 的进阶团队还会很快学会谨慎管理 feature 组合，因为编译时间、二进制体积和传递依赖表面积都可能迅速上升。

## 6. Logging & Debugging
Rust 的可观测性通常结合结构化日志、tracing span、panic 输出，以及针对具体负载选择的 profiler 或 debugger。

```rust
tracing::info!(order_id = %order_id, attempt = attempt, "processing order");
```

- 日志级别：
  `trace`、`debug`、`info`、`warn`、`error` 是常见约定。
- 结构化埋点：
  `tracing` 生态广泛用于异步友好的 span 和字段记录。
- Panic 与 backtrace 分析：
  通过环境配置，Rust 可以输出很有价值的回溯信息。
- 调试器：
  `lldb`、`gdb` 等工具常用于较底层的调试。
- 性能分析：
  profiler 和 flamegraph 很重要，因为 Rust 的性能优化应该建立在真实运行时数据上，而不是猜测。

Rust 的进阶调试经常是：先认真读编译器诊断，再看运行时 trace 和 profile。

## 7. Packaging & Deployment
Rust 的部署通常围绕原生二进制构建展开，这确实能简化很多运维问题，但配置、可观测性和发布纪律仍然是实打实的工作。

- 环境变量：
  常用于密钥、功能开关、地址和部署环境相关配置。
- Docker 化：
  多阶段构建很常见，用于减小最终镜像。
- CI/CD：
  流水线通常会运行 `cargo fmt`、`cargo clippy`、测试、构建和发布打包。
- 构建产物：
  Rust 通常产出静态或近似自包含的原生二进制。
- 热重载与发布策略：
  开发期热更新不像脚本生态那样核心，但上线信心依然取决于测试和发布质量。

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

Rust 在运行时的打包往往比很多托管语言生态更简单，但编译时间和原生依赖问题仍然会影响团队工作流。
