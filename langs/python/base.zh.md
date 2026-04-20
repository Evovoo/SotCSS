---
title: Python 基础
---

Python 是一种高级、动态类型、强调可读性的语言。它上手很快，但一旦进入真实项目，名称绑定、可变性、作用域、对象模型和异常传播这些基础机制都会很快变成必须理解的内容。

## 1. Variables & Types
Python 中的变量更准确地说是“名称绑定到对象”，而不是“变量格子里保存值”。赋值操作会创建或重新绑定名称，真正的类型信息存在于对象本身。

```python
name = "Ada"
version = 3.12
is_ready = True
pi = 3.14159
```

- 声明方式：
  Python 没有独立的变量声明语法。名称在第一次赋值时出现。
- 作用域：
  函数内部默认是局部作用域；模块顶层名称对该模块全局可见；嵌套函数可以读取外层名称，若要重绑定则需要 `nonlocal` 或 `global`。
- 常见基础类型：
  常见内建类型包括 `int`、`float`、`bool`、`str`、`bytes` 和 `NoneType`。
- 动态类型：
  类型属于对象，不属于变量；同一个名称在不同时刻可以引用不同类型的值。
- 类型标注：
  Python 支持可选的类型注解，主要服务于可读性、IDE 和静态检查工具，默认不改变运行时语义。

```python
count: int = 10
message: str = "hello"
count = count + 5
```

这里有两个非常关键的基础概念：

- 可变与不可变：
  `list`、`dict`、`set` 是可变对象；`int`、`float`、`str`、`tuple` 是不可变对象。
- 身份与相等：
  `is` 检查两个名称是否指向同一个对象；`==` 检查它们的值是否相等。

## 2. Control Flow
Python 的控制流使用缩进定义代码块，而不是花括号。这使代码结构直接体现在视觉层级上。

```python
score = 87

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

- 条件分支：
  使用 `if`、`elif`、`else`。
- 模式匹配：
  Python 3.10+ 提供 `match`，可做结构化模式匹配。

```python
command = ("move", 3, 4)

match command:
    case ("move", x, y):
        result = f"move to {x}, {y}"
    case ("stop",):
        result = "stop"
    case _:
        result = "unknown"
```

- 循环：
  `for` 用于遍历可迭代对象，`while` 用于条件驱动循环。
- 循环控制：
  `break` 提前退出循环，`continue` 跳过本轮剩余逻辑，`pass` 作为空占位语句。
- 布尔运算：
  `and`、`or`、`not` 采用短路语义，而且 `and` / `or` 返回的是操作数本身，不一定是纯布尔值。

```python
items = [1, 2, 3]
for item in items:
    if item == 2:
        continue
    print(item)
```

## 3. Functions
函数在 Python 中是一等对象，可以赋值、传参、返回，也可以捕获外层作用域形成闭包。

```python
def greet(name: str, prefix: str = "Hello") -> str:
    return f"{prefix}, {name}"

print(greet("Lin"))
print(greet("Lin", prefix="Hi"))
```

- 定义与调用：
  使用 `def` 定义具名函数，使用 `lambda` 定义简短匿名函数表达式。
- 参数系统：
  Python 支持位置参数、关键字参数、默认参数、`*args` 可变位置参数和 `**kwargs` 可变关键字参数。
- 返回值：
  函数返回单个对象；若看起来像“返回多个值”，本质上通常是返回元组。
- 闭包：
  内部函数可以捕获外层作用域名称。

```python
def make_counter():
    total = 0

    def increment():
        nonlocal total
        total += 1
        return total

    return increment
```

Python 还支持更细粒度的参数设计：

```python
def build_url(host, /, path, *, secure=True):
    scheme = "https" if secure else "http"
    return f"{scheme}://{host}/{path}"
```

其中 `/` 表示其前面的参数只能按位置传递，`*` 表示其后面的参数只能按关键字传递。

## 4. Data Structures
Python 内建的数据结构非常强，很多业务场景在自定义类之前就能先用内建集合建模完成。

- Lists：
  有序、可变序列。
- Tuples：
  有序、不可变序列。
- Dictionaries：
  键值映射；在现代 Python 中保持插入顺序。
- Sets：
  不重复元素集合。
- Classes 与 dataclasses：
  当数据与行为需要一起组织时使用。

```python
numbers = [10, 20, 30]
first = numbers[0]
slice_view = numbers[1:]

user = {"name": "Ada", "level": "advanced"}
tags = {"python", "algorithms", "python"}
```

对于轻量结构化记录，可以使用：

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    score: int
```

Python 的推导式也非常常用：

```python
squares = [n * n for n in range(5)]
active_users = {user["name"] for user in [{"name": "Ada"}, {"name": "Lin"}]}
```

## 5. Error Handling
Python 通过异常机制传播错误。异常可以被有选择地捕获、包装、记录，也可以继续向上冒泡。

```python
def parse_port(raw: str) -> int:
    try:
        port = int(raw)
    except ValueError as exc:
        raise ValueError("port must be an integer") from exc

    if not (0 < port < 65536):
        raise ValueError("port out of range")

    return port
```

- `try` / `except`：
  优先捕获具体异常类型，而不是一上来就写宽泛的 `except Exception`，除非你正处在明确的进程边界或框架边界。
- `else`：
  只有 `try` 中没有异常时才执行。
- `finally`：
  无论是否抛出异常都会执行，通常用于清理资源。
- 自定义异常：
  一般继承 `Exception`。

```python
class ConfigError(Exception):
    pass
```

`raise ... from ...` 对保留底层错误上下文很重要，尤其在你需要把底层异常包装成领域异常时。

## 6. Modules & Imports
Python 的模块通常就是单个 `.py` 文件，包则是用于组织模块的目录结构。项目变大以后，导入路径、包结构、运行入口会直接影响维护体验。

```python
from pathlib import Path
import json

config_path = Path("config.json")
data = json.loads(config_path.read_text(encoding="utf-8"))
```

- 标准库与第三方包：
  `json`、`pathlib`、`datetime`、`itertools` 等属于标准库；第三方库通常通过 `pip` 安装。
- 绝对导入：
  在中大型项目里通常更清晰。
- 相对导入：
  在包内部有时方便，但层级深时可读性会下降。
- 命名空间管理：
  `import module` 保留限定名；`from module import name` 会把符号直接带入当前命名空间。

项目入口常写成：

```python
python -m my_package
```

这种方式通常比直接执行深层文件更稳，因为它能让 Python 以包根为基准解析导入关系。
