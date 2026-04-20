---
title: Python 高阶
---

Python 的高阶阶段，不是继续背零散语法点，而是理解它的动态能力何时真正带来生产力，何时又会损害可维护性，以及如何在这种灵活性中仍然构建稳定系统。

## 1. Deep Concurrency
高阶并发的重点，是为具体工作负载选择合适的隔离和协作模型，而不是机械地套某一种并发原语。

- 锁与互斥：
  `threading.Lock`、`RLock`、`Condition` 等原语用于在线程环境下协调共享状态。
- 原子性：
  某些操作在 CPython 中“看起来像原子”，但依赖解释器偶然实现细节是脆弱的。
- 队列与消息传递：
  `queue.Queue`、`asyncio.Queue` 和进程间消息模型，通常比共享可变对象更容易推理。
- 死锁预防：
  固定加锁顺序、缩小临界区、设置超时，往往比单纯换一种锁更重要。
- Actor 风格：
  Python 可以通过进程 worker、邮箱队列或基于异步消息的库去实现接近 Actor 的模型。

```python
from threading import Lock

class Counter:
    def __init__(self) -> None:
        self._value = 0
        self._lock = Lock()

    def increment(self) -> int:
        with self._lock:
            self._value += 1
            return self._value
```

高阶工程实践还包括知道何时根本不该依赖进程内并发，而应把任务交给外部队列、后台 worker 或更清晰的分布式边界。

## 2. Metaprogramming & Reflection
Python 的动态特性让元编程非常强大，也非常容易被滥用。真正的高阶能力，是精确使用它，而不是让代码库变得隐晦难懂。

- 反射：
  `getattr`、`setattr`、`hasattr`、`isinstance`、`issubclass` 以及 `inspect` 模块提供运行时自省能力。
- 装饰器：
  常用于包装函数、附加元数据、注册处理器或改变行为。
- 描述符：
  `property`、方法绑定和很多框架内部机制都建立在描述符之上。
- 元类：
  可拦截类创建过程，但应该少用、慎用。
- 代码生成：
  既可以是运行时动态建类，也可以是模板生成、AST 变换或构建期生成。

```python
def traced(fn):
    def wrapper(*args, **kwargs):
        print(f"calling {fn.__name__}")
        return fn(*args, **kwargs)
    return wrapper

@traced
def multiply(a, b):
    return a * b
```

Django、Pydantic、SQLAlchemy 这类框架大量依赖 Python 的反射与元编程能力。它们很强大，但如果团队约定不清晰，隐式行为也会迅速扩散。

## 3. Design Patterns
Python 当然可以表达经典设计模式，但它的语言特性往往会改变这些模式最自然的写法。

- Python 中的 SOLID：
  作为设计视角仍然有价值，只是动态类型会改变接口约束和替换原则的落地方式。
- 创建型模式：
  在 Python 中，工厂函数往往比庞大的抽象工厂类层次更自然。
- 结构型模式：
  在第三方 API 或遗留系统边界上，适配器和外观模式依然很有用。
- 行为型模式：
  策略、观察者、命令、管道等模式都很容易映射到可调用对象、注册表和事件分发。
- 依赖注入：
  Python 中通常通过构造参数、provider 对象或框架装配来完成，不一定需要复杂容器。

```python
class JsonSerializer:
    def dump(self, data):
        ...

class XmlSerializer:
    def dump(self, data):
        ...

def export(data, serializer):
    return serializer.dump(data)
```

高阶 Python 设计通常意味着：把动态性限制在明确边界内，用清晰命名表达约束，不为了“魔法感”牺牲可读性。

## 4. Advanced Type System
Python 的类型系统在运行时是可选的，但在大型项目和多人协作里已经越来越重要。

- 泛型：
  `TypeVar`、`Generic` 以及参数化容器让可复用类型抽象成为可能。
- Protocol：
  `typing.Protocol` 支持结构化子类型，更适合表达“只要具备这种形状就行”的接口。
- Literal 与受限类型：
  当 API 只接受有限值集时，这类约束很有价值。
- 变型：
  设计库级泛型抽象时，协变、逆变等概念会开始变得重要。
- 类型收窄：
  静态分析器会根据控制流、断言和守卫逻辑推断更精确的类型。

```python
from typing import Generic, TypeVar

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, value: T) -> None:
        self.value = value
```

在高阶 Python 系统里，类型注解最有价值的场景，是减少模块边界歧义、明确契约并辅助自动化重构；如果只是把显而易见的局部实现细节再写一遍，收益就会迅速下降。
