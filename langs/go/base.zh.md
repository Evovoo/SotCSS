---
title: Go 基础
---

Go 是一种静态类型、编译型语言，设计目标是简洁、明确和运行时可靠性。它的表面语法很小，但值语义、接口、错误返回和以 package 为中心的组织方式，会直接决定真实 Go 程序的写法。

## 1. Variables & Types
Go 的变量保存的是具有明确静态类型的值，即使语法上可以通过类型推断写得更短。相比隐式转换和运行时魔法，Go 更强调可预测的内存行为和类型行为。

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

- 声明方式：
  使用 `var` 做显式声明，在函数内部可用 `:=` 做短变量声明。
- 作用域：
  Go 采用块级作用域。函数、循环或条件语句内部声明的变量，只在对应代码块中可见。
- 基础类型：
  常见内建类型包括 `bool`、`string`、有符号和无符号整数、浮点数，以及 `byte` / `rune`。
- 类型推断：
  编译器可以根据右侧值推断类型，但推断出的类型依然是固定的静态类型。
- 零值：
  每个变量都有默认零值，例如 `0`、`false`、`""` 或 `nil`。

```go
var count int
var message string
var ok bool
```

有两个 Go 基础概念需要尽早建立：

- 值语义：
  赋值通常意味着复制值。对基础类型很直观，对结构体和数组的推理同样重要。
- 指针：
  Go 有指针，但没有指针算术。指针主要用于原地修改、共享状态，以及在合适场景下降低大对象拷贝成本。

```go
func increment(n *int) {
	*n++
}
```

Go 还区分数组和切片。数组长度固定、按值拷贝；切片是数组上的轻量视图，在日常开发中更常见。

## 2. Control Flow
Go 的控制流刻意保持紧凑。它有 `if`、`for`、`switch` 和 `select`，但不会为同一类任务提供太多重叠结构。

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

- 条件分支：
  使用 `if`、`else if`、`else`。条件外面不需要括号。
- 带短语句的条件：
  `if` 和 `switch` 前面都可以先写一条短语句，适合放只在该分支内部使用的临时值。
- 迭代：
  Go 统一使用 `for` 表达各种循环，包括计数循环、条件循环和基于 `range` 的遍历。
- 分支控制：
  支持 `break`、`continue`、`goto` 和带标签语句，但标签应谨慎使用。
- `switch` 行为：
  `switch` 默认不会自动贯穿到下一个 case，这能避免很多意外分支错误。

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

Go 还有 `select`，它专门用于并发场景下基于 channel 的通信选择；一旦开始写 goroutine，它就会变得很重要。

## 3. Functions
函数是 Go 的核心构造之一，但 Go 在函数设计上保持显式和克制。它没有默认参数、没有函数重载，也没有隐式关键字参数。

```go
func greet(name string) string {
	return "Hello, " + name
}
```

- 定义与调用：
  使用 `func` 定义具名函数。函数也可以作为值保存到变量中，或作为参数传递。
- 参数：
  参数类型必须显式写出。多个相邻参数如果类型相同，可以共用一个类型声明。
- 返回值：
  Go 支持多返回值，这也是“结果值 + 错误”这种常见风格的基础。
- 可变参数：
  使用 `...` 表示可变数量参数。
- 闭包：
  匿名函数可以捕获外层变量。

```go
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("division by zero")
	}

	return a / b, nil
}
```

Go 还支持命名返回值：

```go
func dimensions() (width int, height int) {
	width = 1920
	height = 1080
	return
}
```

它在少数场景下能提升可读性，但如果滥用，反而会让控制流变得不够直接。

## 4. Data Structures
Go 的基础数据建模工具简单而强大。大多数日常程序会依赖数组、切片、map 和结构体，接口则用于抽象行为。

- Arrays：
  固定长度序列，按值拷贝。
- Slices：
  带长度和容量的动态视图，是日常最常用的序列结构。
- Maps：
  基于哈希表的键值集合。
- Structs：
  具名字段的自定义记录类型。
- Interfaces：
  通过行为定义类型，而不是通过继承关系。

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

几个 Go 特有细节很重要：

- 切片共享底层数组：
  如果两个切片重叠，修改其中一个可能影响另一个。
- map 取值：
  读取不存在的键时，会返回该值类型的零值。
- 结构体嵌入：
  Go 更倾向通过嵌入字段做组合复用，而不是经典继承。

```go
value, ok := user["name"]
if ok {
	fmt.Println(value)
}
```

## 5. Error Handling
Go 不把异常作为可恢复失败的常规控制流机制。相反，错误通常是显式返回值，调用方必须在本地有意识地处理它。

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
  只要函数可能失败，通常就会返回 `(value, error)`。
- 错误包装：
  用 `fmt.Errorf` 配合 `%w` 保留原始错误，便于后续检查。
- 哨兵错误：
  一些包会暴露固定错误值，调用方可通过 `errors.Is` 判断。
- 类型化错误：
  如果错误对象带额外上下文，可通过 `errors.As` 提取具体类型。
- panic 和 recover：
  更适合处理程序员错误、不可达状态或进程级故障，而不是普通业务错误。

```go
if err != nil {
	return err
}
```

这种重复并不是偶然，而是刻意用简洁换取局部失败路径的清晰度。

## 6. Modules & Imports
Go 用 package 组织代码，现代依赖管理则围绕 Go module 展开。这个系统本身很简单，但命名和目录结构会直接影响代码清晰度。

```go
package main

import (
	"fmt"
	"net/http"
)
```

- Packages：
  一个目录通常对应一个 package；导出标识符以大写字母开头。
- Imports：
  import 是显式且受编译器检查的，未使用导入会直接报错。
- 标准库：
  Go 自带了相当强的标准库，覆盖 HTTP、JSON、并发原语、文件 IO、测试等生产常见需求。
- Modules：
  `go.mod` 声明模块路径和依赖要求。
- 工具链集成：
  `go fmt`、`go test`、`go build`、`go mod` 是标准工作流的一部分，而不是额外约定。

```go
module example.com/myapp

go 1.22
```

导入路径本身也是 Go 项目公共 API 的一部分，因此 package 命名应保持简短、稳定且符合直觉。
