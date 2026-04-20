---
title: Go Foundations
---

Go is a statically typed, compiled language designed for simplicity, explicitness, and operational reliability. Its surface syntax is small, but its core ideas such as value semantics, interfaces, error returns, and package-oriented organization shape how real Go programs are written.

## 1. Variables & Types
Go variables hold values with explicit static types, even when type inference makes the syntax shorter. The language favors predictable memory and type behavior over heavy implicit conversions or runtime magic.

```go
package main

import "fmt"

func main() {
	name := "Ada"
	var version int = 1
	ready := true
	pi := 3.14159

	fmt.Println(name, version, ready, pi)
}
```

- Declaration:
  Use `var` for explicit declarations and `:=` for short variable declarations inside functions.
- Scope:
  Go has block scope. Variables declared inside a function, loop, or conditional are visible only within that block.
- Basic types:
  Common built-in types include `bool`, `string`, signed and unsigned integers, floating-point numbers, and `byte` / `rune`.
- Type inference:
  The compiler infers types from the assigned value when possible, but the resulting type is still fixed.
- Zero values:
  Every variable has a default zero value, such as `0`, `false`, `""`, or `nil`.

```go
var count int
var message string
var ok bool
```

Two foundational Go ideas matter early:

- Value semantics:
  Assignment usually copies the value. This is straightforward for basic types and still important when reasoning about structs and arrays.
- Pointers:
  Go has pointers, but not pointer arithmetic. Pointers are mainly used for mutation, shared state, and avoiding large copies where appropriate.

```go
func increment(n *int) {
	*n++
}
```

Go also distinguishes between arrays and slices. Arrays have fixed length and are copied by value; slices are lightweight views over arrays and are far more common in everyday code.

## 2. Control Flow
Go control flow is intentionally compact. It has `if`, `for`, `switch`, and `select`, but avoids multiple overlapping constructs for the same job.

```go
score := 87

if score >= 90 {
	grade = "A"
} else if score >= 80 {
	grade = "B"
} else {
	grade = "C"
}
```

- Conditional branching:
  Use `if`, `else if`, and `else`. Parentheses around conditions are not required.
- Scoped conditions:
  `if` and `switch` can include a short statement before the condition, which is useful for temporary values.
- Iteration:
  Go uses `for` for all loop forms, including traditional counter loops, condition-only loops, and range-based iteration.
- Branch control:
  `break`, `continue`, `goto`, and labeled statements exist, though labels should be used carefully.
- Switch behavior:
  `switch` does not fall through by default, which prevents many accidental branch bugs.

```go
for i := 0; i < 3; i++ {
	if i == 1 {
		continue
	}
	fmt.Println(i)
}

for index, value := range []string{"go", "rust", "java"} {
	fmt.Println(index, value)
}
```

Go also has `select`, which is specific to concurrent communication over channels and becomes more important once goroutines enter the picture.

## 3. Functions
Functions are central in Go, but Go keeps them explicit and conservative. There are no default parameters, no function overloading, and no implicit keyword arguments.

```go
func greet(name string) string {
	return "Hello, " + name
}
```

- Definition and invocation:
  Use `func` to define named functions. Functions can also be stored in variables and passed as values.
- Parameters:
  Parameters are explicitly typed. Multiple parameters with the same type can share the type declaration.
- Return values:
  Go supports multiple return values, which is commonly used for returning a result plus an error.
- Variadic parameters:
  Use `...` for functions that accept a variable number of arguments.
- Closures:
  Anonymous functions can capture outer variables.

```go
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("division by zero")
	}

	return a / b, nil
}
```

Named return values also exist:

```go
func dimensions() (width int, height int) {
	width = 1920
	height = 1080
	return
}
```

They can improve clarity in some narrow cases, but overuse can make control flow harder to read.

## 4. Data Structures
Go's basic data modeling tools are simple and strong. Most everyday programs rely on arrays, slices, maps, and structs, with interfaces used to abstract behavior.

- Arrays:
  Fixed-length sequences that are copied by value.
- Slices:
  Dynamic, commonly used views over arrays, with a length and capacity.
- Maps:
  Hash-table key-value collections.
- Structs:
  Custom record types with named fields.
- Interfaces:
  Types defined by behavior, not inheritance.

```go
numbers := []int{10, 20, 30}
first := numbers[0]
tail := numbers[1:]

user := map[string]string{
	"name":  "Ada",
	"level": "advanced",
}

type User struct {
	Name  string
	Score int
}
```

A few Go-specific details matter:

- Slices share backing arrays:
  Mutating one slice can affect another if they overlap.
- Map access:
  Reading a missing key returns the zero value for that value type.
- Struct embedding:
  Go supports composition-oriented reuse through embedded fields instead of classical inheritance.

```go
value, ok := user["name"]
if ok {
	fmt.Println(value)
}
```

## 5. Error Handling
Go does not use exceptions as the normal control-flow mechanism for recoverable failures. Instead, errors are explicit return values and must be handled intentionally at the call site.

```go
func parsePort(raw string) (int, error) {
	port, err := strconv.Atoi(raw)
	if err != nil {
		return 0, fmt.Errorf("invalid port: %w", err)
	}

	if port <= 0 || port > 65535 {
		return 0, fmt.Errorf("port out of range")
	}

	return port, nil
}
```

- Explicit errors:
  Functions typically return `(value, error)` when failure is possible.
- Wrapping:
  Use `%w` with `fmt.Errorf` to preserve the original error for later inspection.
- Sentinel errors:
  Some packages expose well-known error variables that callers compare using `errors.Is`.
- Typed errors:
  Error types with extra context can be inspected using `errors.As`.
- Panic and recover:
  Reserved for programmer mistakes, impossible states, or process-level failures rather than normal business logic.

```go
if err != nil {
	return err
}
```

That repetition is deliberate. Go trades conciseness here for local clarity about failure paths.

## 6. Modules & Imports
Go organizes code into packages, and modern dependency management centers on Go modules. The package system is simple, but naming and directory structure have real impact on code clarity.

```go
package main

import (
	"fmt"
	"net/http"
)
```

- Packages:
  Each directory typically defines one package, and exported identifiers begin with an uppercase letter.
- Imports:
  Imports are explicit and compiler-checked. Unused imports are rejected.
- Standard library:
  Go ships with a large, production-friendly standard library for HTTP, JSON, concurrency primitives, file IO, testing, and more.
- Modules:
  `go.mod` declares the module path and dependency requirements.
- Tooling integration:
  `go fmt`, `go test`, `go build`, and `go mod` are part of the standard workflow rather than optional external conventions.

```go
module example.com/myapp

go 1.22
```

The import path is also part of the public API surface of a Go project, so package naming should stay short, stable, and unsurprising.
