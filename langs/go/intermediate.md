---
title: Go Intermediate
---

At the intermediate level, Go becomes less about learning syntax and more about understanding how the language supports production services. Concurrency, APIs, persistence boundaries, testing style, dependency control, and operational tooling all become part of everyday design.

## 1. Concurrency & Async
Go's concurrency model is one of its defining features. Goroutines are lightweight concurrent functions, and channels provide a structured way to communicate between them, but real correctness still depends on ownership, cancellation, and synchronization discipline.

- Goroutines:
  Launch concurrent work with the `go` keyword.
- Channels:
  Transfer typed values between goroutines and help express coordination.
- Buffered vs. unbuffered channels:
  Unbuffered channels synchronize sender and receiver directly; buffered channels add limited queueing.
- Synchronization primitives:
  `sync.Mutex`, `RWMutex`, `WaitGroup`, `Once`, and atomic operations remain essential.
- Cancellation:
  `context.Context` is the standard way to propagate deadlines, cancellation, and request-scoped metadata.

```go
func fetchUser(ctx context.Context, id int, out chan<- string) {
	select {
	case <-ctx.Done():
		return
	case out <- fmt.Sprintf("user-%d", id):
	}
}
```

Important intermediate concerns:

- Goroutine leaks:
  Launching goroutines without a clear shutdown path leads to resource leaks and stuck systems.
- Ownership:
  Shared mutable state should have explicit coordination, even in a channel-heavy codebase.
- Workload fit:
  Goroutines are cheap, but they are not free. Spawning uncontrolled fan-out can still overwhelm memory, IO, or downstream dependencies.

## 2. Web Development
Go is widely used for backend services because the standard library already provides strong HTTP foundations, and the deployment model is usually simple.

```go
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"ok":true}`))
}
```

- HTTP methods:
  Service handlers should map clearly to resource semantics and idempotency expectations.
- Routing:
  Teams may use `net/http` directly or adopt routers such as `chi`, `gorilla/mux`, or framework-like layers.
- Middleware:
  Logging, auth, tracing, panic recovery, rate limiting, and CORS are typically composed as middleware.
- Encoding:
  JSON is dominant, commonly via `encoding/json`, though performance-sensitive services may adopt alternatives selectively.
- Streaming and real-time:
  Go handles streaming responses, SSE, WebSockets, and long-lived network connections well.

Intermediate Go web work also includes request scoping and backpressure. Timeouts on HTTP clients and servers are not optional polish; they are part of correctness.

## 3. Data Persistence
Go applications often keep persistence logic close to explicit repository or service boundaries. The language does not push a dominant ORM style, so teams have room to choose between raw SQL, query builders, and ORM-style abstractions.

- SQL vs. NoSQL:
  The tradeoff depends on data model, consistency needs, query shape, and operational constraints.
- Database access:
  `database/sql` is the common baseline abstraction for relational databases.
- Query tooling:
  Teams may use plain SQL, helpers such as `sqlx`, code generation tools such as `sqlc`, or ORMs such as GORM.
- Connection pools:
  In Go, `sql.DB` is already a concurrency-safe pool abstraction and should be configured deliberately.
- Migrations:
  Schema changes should be versioned and automated in CI/CD or deployment workflows.

```go
row := db.QueryRowContext(ctx, "SELECT id, email FROM users WHERE email = $1", email)

var user User
err := row.Scan(&user.ID, &user.Email)
```

Two intermediate persistence risks:

- Hiding SQL costs:
  Even if abstractions are ergonomic, indexes, join shape, transaction scope, and lock behavior still determine runtime outcomes.
- Ignoring context propagation:
  Database calls should usually accept a context so timeouts and cancellation flow from the request boundary.

## 4. Testing
Go's testing culture is unusually standardized. The standard library already includes `testing`, benchmarking, fuzzing hooks, and examples, so many projects can stay productive without elaborate external frameworks.

```go
func Add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	if got := Add(2, 3); got != 5 {
		t.Fatalf("expected 5, got %d", got)
	}
}
```

- Unit tests:
  Usually live beside the code in `_test.go` files.
- Table-driven tests:
  A common Go style for covering multiple cases compactly.
- Integration tests:
  Important for HTTP handlers, database interactions, and external services.
- Benchmarks:
  `BenchmarkXxx` functions help quantify allocations and throughput.
- Fuzzing:
  Go supports fuzz testing through the standard test toolchain.

```go
func TestParsePort(t *testing.T) {
	cases := []struct {
		input string
		ok    bool
	}{
		{"8080", true},
		{"0", false},
		{"abc", false},
	}

	for _, tc := range cases {
		_, err := parsePort(tc.input)
		if (err == nil) != tc.ok {
			t.Fatalf("input %q produced unexpected result", tc.input)
		}
	}
}
```

Intermediate testing practice in Go also emphasizes deterministic time handling, minimal shared test state, and realistic interfaces rather than mock-heavy designs.

## 5. Dependency Management
Go dependency management is comparatively integrated. Modules, version resolution, formatting, and build tools all live close to the core toolchain.

- Modules:
  A project's dependency graph is rooted in `go.mod`.
- Checksums:
  `go.sum` records module checksums for integrity and reproducibility.
- Minimal version selection:
  Go resolves dependencies in a deterministic way that differs from ecosystems with broader solver behavior.
- Private modules:
  Supported, but require configuration such as `GOPRIVATE`.
- Dependency review:
  Even with a clean toolchain, teams should still audit supply-chain risk and stale transitive dependencies.

```go
go mod init example.com/myapp
go get github.com/go-chi/chi/v5
go mod tidy
```

One practical intermediate lesson is that dependency count stays lower in many Go services because the standard library already covers substantial ground.

## 6. Logging & Debugging
Go favors straightforward operational tooling. Logging is often explicit, and debugging usually starts with local reproduction, stack traces, and profiles before moving to deeper tracing systems.

```go
logger.Info("processing order", "order_id", orderID, "attempt", attempt)
```

- Log levels:
  Teams often define their own conventions around debug, info, warn, and error, whether using `log/slog` or another logging package.
- Structured logging:
  Key-value logs integrate better with production search and observability platforms.
- Stack traces and panic reports:
  Panics print useful runtime information, though a panic in a server should usually be recovered at the request boundary.
- Debugging:
  `dlv` is the standard debugger for Go.
- Profiling:
  `pprof` is central for CPU, memory, blocking, and goroutine analysis.

Go's operational strength comes partly from how well its tooling supports real runtime diagnosis rather than only local developer ergonomics.

## 7. Packaging & Deployment
Go deployment is often simpler than many ecosystems because Go can compile to a single static binary for many targets.

- Environment variables:
  Commonly used for secrets, addresses, feature flags, and runtime tuning.
- Containerization:
  Go services are frequently packaged as small container images, often with multi-stage builds.
- CI/CD:
  Typical pipelines run formatting, tests, static analysis, build, and deployment steps.
- Cross-compilation:
  Go can target multiple operating systems and architectures from a unified toolchain.
- Startup model:
  Services usually start from a single binary with explicit config loading and dependency wiring.

```dockerfile
FROM golang:1.22 AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o service ./cmd/service

FROM gcr.io/distroless/base-debian12
COPY --from=build /app/service /service
ENTRYPOINT ["/service"]
```

The simplicity of Go deployment is real, but production discipline still depends on health checks, graceful shutdown, observability, and safe rollout strategy.
