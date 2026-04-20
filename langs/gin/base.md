---
title: Gin Foundations
---

Gin is a high-performance HTTP web framework for Go built around routing, middleware, request binding, and response handling. It is not a programming language, but in Go backend development it often acts like a primary application model because handlers, context objects, and middleware chains define how web services are structured.

## 1. Variables & Types
Gin applications are written in Go, so the underlying variable and type system comes from the Go language. What Gin changes is how values move through HTTP handlers, middleware, request contexts, binding structs, and response models.

```go
type UserResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func getUser(c *gin.Context) {
	response := UserResponse{
		ID:   "1",
		Name: "Ada",
	}

	c.JSON(http.StatusOK, response)
}
```

- Declaration:
  Values are declared using normal Go syntax such as local variables, structs, interfaces, and package-level types.
- Handler scope:
  Variables created inside a Gin handler exist only for that request execution path.
- Context-carried values:
  Request metadata, auth state, and trace data are often stored in or derived from `*gin.Context`.
- Binding models:
  Request payloads are commonly decoded into typed structs.
- Response models:
  HTTP responses are usually built from explicit structs or maps.

```go
type CreateUserRequest struct {
	Name string `json:"name" binding:"required"`
}
```

Two foundational Gin ideas matter early:

- Request-scoped values vs. application-scoped values:
  Database pools, clients, and services belong to long-lived application scope, while request parameters and auth claims are request-scoped.
- Typed payloads vs. dynamic maps:
  Typed structs are usually easier to validate, evolve, and test than ad hoc response maps.

Gin code may still look like plain Go, but its main values are shaped around HTTP lifecycle boundaries.

## 2. Control Flow
Gin uses normal Go control flow inside handlers and middleware, but the overall application flow is also influenced by router matching, middleware order, and abort behavior.

```go
func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
```

- Conditional branching:
  Handlers still rely on ordinary `if`, `switch`, and loop constructs.
- Routing:
  The router determines which handler chain runs for a given request.
- Middleware control:
  Middleware can continue the chain with `c.Next()` or stop it with `c.Abort()`.
- Early returns:
  Request validation and authorization logic often becomes clearer with early returns.
- Request flow composition:
  Logging, auth, validation, and tracing often wrap handler behavior through chained middleware.

```go
func authMiddleware(c *gin.Context) {
	if c.GetHeader("Authorization") == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
		return
	}

	c.Next()
}
```

In Gin, control flow is not only the code inside one function. It is also the order of middleware execution before and after the main handler.

## 3. Functions
Gin applications are built from normal Go functions, but many of those functions take the specialized form of handlers, middleware, binders, and service helpers.

```go
func getUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"id": id})
}
```

- Definition and invocation:
  Route handlers are ordinary Go functions with the signature `func(*gin.Context)`.
- Parameters:
  Handlers read route params, query params, headers, bodies, and context values through the Gin context.
- Return values:
  Handlers usually do not return Go values directly; instead they write responses through the context.
- Middleware functions:
  Middleware also uses the same context-driven function model.
- Layering:
  Handlers should usually delegate business logic to services instead of embedding everything inline.

```go
func createUser(c *gin.Context) {
	var input CreateUserRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"name": input.Name})
}
```

In Gin, function design is tightly connected to HTTP boundaries. Good handlers are thin and explicit about input parsing, service calls, and response shaping.

## 4. Data Structures
Gin uses the same runtime data structures as Go, but real applications often revolve around request DTOs, response DTOs, service models, headers, and context-bound metadata more than low-level container tricks.

- Structs:
  The most common way to represent requests, responses, and domain models.
- Slices:
  Frequently used for lists of records in responses.
- Maps:
  Useful for dynamic JSON payloads, especially `gin.H`.
- Context values:
  Often used for request-scoped metadata such as user identity or trace IDs.
- Interfaces:
  Common for service abstractions and test seams.

```go
type UserResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

users := []UserResponse{
	{ID: "1", Name: "Ada"},
	{ID: "2", Name: "Lin"},
}
```

Some structural distinctions matter:

- Request models vs. domain models:
  External API payloads should not always be identical to internal business structs.
- Dynamic maps vs. typed structs:
  `gin.H` is convenient, but typed structs usually scale better.
- Context state vs. global state:
  Request-local values should stay in request-local context rather than leaking into shared mutable globals.

Gin applications are less about novel data structures and more about keeping HTTP-facing structures explicit and stable.

## 5. Error Handling
Gin uses Go's explicit error style together with HTTP response handling. The core challenge is not catching exceptions, but translating errors into clear, correct, and observable HTTP outcomes.

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
  Go functions usually return errors directly rather than throwing exceptions.
- Binding errors:
  Input binding and validation failures are common and should map to client-facing error responses.
- Middleware handling:
  Some teams centralize error formatting in middleware.
- Abort behavior:
  `AbortWithStatusJSON` is often used when a request must stop immediately.
- Operational visibility:
  Errors should be logged with enough request context to support debugging.

```go
func errorMiddleware(c *gin.Context) {
	c.Next()
	if len(c.Errors) > 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": c.Errors[0].Error()})
	}
}
```

Gin error handling is fundamentally about explicit failure mapping. A good service makes it obvious which errors are client mistakes, which are business failures, and which are internal faults.

## 6. Modules & Imports
Gin projects are usually organized around route definitions, handlers, middleware, services, repositories, configuration, and bootstrap code. Go's package system keeps structure explicit.

```go
import (
	"net/http"

	"github.com/gin-gonic/gin"
)
```

- Route modules:
  Many projects define route registration in dedicated packages or files.
- Handler modules:
  HTTP entrypoints are commonly separated from service logic.
- Middleware modules:
  Auth, logging, recovery, tracing, and rate limiting often live in dedicated packages.
- Service and repository modules:
  Business logic and persistence logic are usually separated from transport code.
- Dependency setup:
  `main.go` or bootstrap packages often wire routers, services, and infrastructure together.

```go
func registerRoutes(router *gin.Engine) {
	router.GET("/health", health)
	router.POST("/users", createUser)
}
```

In Gin engineering, package boundaries are a major part of maintainability because the framework itself stays lightweight and leaves architectural discipline to the application.
