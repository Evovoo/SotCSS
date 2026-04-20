---
title: Gin 基础
---

Gin 是一个高性能的 Go HTTP Web 框架，核心围绕路由、中间件、请求绑定和响应处理。它并不是编程语言，但在 Go 后端开发里，它经常像一种主要应用模型，因为 handler、context 和 middleware chain 会直接定义 Web 服务的结构。

## 1. Variables & Types
Gin 应用写在 Go 之上，因此底层变量和类型系统来自 Go 语言本身。Gin 真正改变的是：值如何在 HTTP handler、中间件、请求上下文、绑定结构体和响应模型之间流动。

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

- 声明方式：
  值仍然通过普通 Go 语法声明，例如局部变量、结构体、接口和包级类型。
- Handler 作用域：
  在 Gin handler 内创建的变量只存在于当前请求执行路径中。
- Context 携带值：
  请求元数据、鉴权状态和追踪信息常通过 `*gin.Context` 存取。
- 绑定模型：
  请求载荷通常会解码到强类型 struct 中。
- 响应模型：
  HTTP 响应通常由显式 struct 或 map 构造。

```go
type CreateUserRequest struct {
	Name string `json:"name" binding:"required"`
}
```

两个基础点很关键：

- 请求作用域值与应用作用域值：
  数据库连接池、客户端和 service 属于长生命周期应用作用域；请求参数和用户身份属于请求作用域。
- 强类型载荷与动态 map：
  强类型 struct 通常比临时拼出来的 map 更容易校验、演进和测试。

Gin 代码看起来仍然像普通 Go，但其中最重要的值其实都围绕 HTTP 生命周期边界来组织。

## 2. Control Flow
Gin 在 handler 和 middleware 内使用普通 Go 控制流，但整体应用流还会受到路由匹配、中间件顺序和中止行为影响。

```go
func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
```

- 条件分支：
  handler 内部仍然依赖普通 `if`、`switch` 和循环。
- 路由：
  Router 决定某个请求会进入哪一条 handler chain。
- 中间件控制：
  中间件可以通过 `c.Next()` 继续链路，也可以通过 `c.Abort()` 中止链路。
- 提前返回：
  请求校验和鉴权逻辑通常通过提前返回更清晰。
- 请求流组合：
  日志、鉴权、校验和追踪常通过中间件链包裹主 handler。

```go
func authMiddleware(c *gin.Context) {
	if c.GetHeader("Authorization") == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
		return
	}

	c.Next()
}
```

在 Gin 中，控制流不只存在于某一个函数体里，它同样体现在 middleware 在主 handler 前后如何执行。

## 3. Functions
Gin 应用仍然由普通 Go 函数组成，但这些函数往往以 handler、middleware、binder 和 service helper 的形式出现。

```go
func getUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"id": id})
}
```

- 定义与调用：
  路由 handler 本质上就是签名为 `func(*gin.Context)` 的普通 Go 函数。
- 参数：
  handler 通过 Gin context 读取 path param、query param、header、body 和上下文值。
- 返回值：
  handler 通常不会直接返回 Go 值，而是通过 context 写出 HTTP 响应。
- Middleware 函数：
  中间件也基于同样的 context 驱动函数模型。
- 分层：
  handler 通常应把业务逻辑委托给 service，而不是全写在里面。

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

在 Gin 中，函数设计和 HTTP 边界高度绑定。好的 handler 会把输入解析、业务调用和响应构造分得足够清楚。

## 4. Data Structures
Gin 使用的仍然是 Go 的运行时数据结构，但真实项目往往更围绕请求 DTO、响应 DTO、服务模型、header 和上下文元数据，而不是底层容器技巧本身。

- Structs：
  最常见的请求、响应和领域模型表达方式。
- Slices：
  在返回记录列表时非常常见。
- Maps：
  适合动态 JSON 载荷，尤其是 `gin.H`。
- Context values：
  常用于保存请求级元数据，例如用户身份和 trace ID。
- Interfaces：
  常用于 service 抽象和测试替身。

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

几个结构层面的区别很重要：

- 请求模型与领域模型：
  外部 API 载荷并不总应该直接等于内部业务 struct。
- 动态 map 与强类型 struct：
  `gin.H` 很方便，但强类型 struct 往往更适合长期演进。
- Context 状态与全局状态：
  请求局部值应停留在请求局部上下文中，而不应泄漏到共享可变全局变量。

Gin 应用的重点，不在于新奇数据结构，而在于让 HTTP-facing 结构足够显式、稳定。

## 5. Error Handling
Gin 结合的是 Go 的显式错误风格和 HTTP 响应处理模型。核心挑战不是捕捉异常，而是把错误准确翻译成清晰、正确、可观测的 HTTP 结果。

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

- 显式错误：
  Go 函数通常直接返回 error，而不是抛异常。
- 绑定错误：
  输入绑定和校验失败非常常见，应映射成面向客户端的错误响应。
- 中间件处理：
  一些团队会在中间件中统一错误格式。
- 中止行为：
  当请求必须立即终止时，常用 `AbortWithStatusJSON`。
- 运维可见性：
  错误必须带足够请求上下文被记录下来，才能支持排障。

```go
func errorMiddleware(c *gin.Context) {
	c.Next()
	if len(c.Errors) > 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": c.Errors[0].Error()})
	}
}
```

Gin 的错误处理本质上是“显式失败映射”。好的服务会清楚区分哪些是客户端错误、哪些是业务失败、哪些是内部故障。

## 6. Modules & Imports
Gin 项目通常围绕 route 定义、handler、中间件、service、repository、配置和启动代码来组织。Go 的 package 系统让结构保持显式。

```go
import (
	"net/http"

	"github.com/gin-gonic/gin"
)
```

- 路由模块：
  很多项目会把路由注册拆到独立文件或包中。
- Handler 模块：
  HTTP 入口通常和 service 逻辑分开。
- Middleware 模块：
  鉴权、日志、恢复、追踪和限流通常放在独立包中。
- Service 与 repository 模块：
  业务逻辑和持久化逻辑通常会从传输层拆开。
- 依赖装配：
  `main.go` 或 bootstrap 包通常负责组装 router、service 和基础设施。

```go
func registerRoutes(router *gin.Engine) {
	router.GET("/health", health)
	router.POST("/users", createUser)
}
```

在 Gin 工程里，package 边界是可维护性的关键部分，因为框架本身很轻，架构纪律几乎完全由应用自己决定。
