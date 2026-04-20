---
title: Python Foundations
---

Python is a high-level, dynamically typed language that emphasizes readability, rapid iteration, and a large standard library. Its core model is simple to start with, but many day-to-day details such as object identity, mutability, scoping rules, and exception flow matter quickly in real programs.

## 1. Variables & Types
Python variables are names bound to objects rather than boxes storing primitive values directly. Assignment creates or rebinds a name, and the runtime keeps track of the actual object behind that name.

```python
name = "Ada"
version = 3.12
is_ready = True
pi = 3.14159
```

- Declaration:
  Python has no separate variable declaration syntax. A name appears when it is first assigned.
- Scoping:
  Function scope is local by default. Module-level names are global to that module. Nested functions can read outer names, and `nonlocal` or `global` can rebind them explicitly.
- Primitive-like built-in types:
  Common basic types include `int`, `float`, `bool`, `str`, `bytes`, and `NoneType`.
- Dynamic typing:
  Types belong to objects, not variables. The same name can point to values of different types at different times.
- Type hints:
  Python supports optional static annotations for readability and tooling, but they do not change runtime behavior by default.

```python
count: int = 10
message: str = "hello"
count = count + 5
```

Two base concepts deserve early attention:

- Mutability:
  `list`, `dict`, and `set` are mutable; `int`, `float`, `str`, and `tuple` are immutable.
- Identity vs. equality:
  `is` checks whether two names point to the same object. `==` checks value equality.

## 2. Control Flow
Python control flow favors explicit indentation over braces. Blocks are defined by whitespace, so structure is visually aligned with execution.

```python
score = 87

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

- Conditional branching:
  Use `if`, `elif`, and `else`.
- Pattern-style branching:
  Python 3.10+ adds `match` for structural pattern matching.

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

- Iteration:
  Use `for` to iterate over an iterable, and `while` for condition-driven loops.
- Loop control:
  `break` exits a loop, `continue` skips to the next iteration, and `pass` is a no-op placeholder.
- Boolean operators:
  `and`, `or`, and `not` short-circuit and return operands, not only `True` or `False`.

```python
items = [1, 2, 3]
for item in items:
    if item == 2:
        continue
    print(item)
```

## 3. Functions
Functions are first-class objects in Python. They can be assigned to variables, passed into other functions, returned from functions, and closed over surrounding state.

```python
def greet(name: str, prefix: str = "Hello") -> str:
    return f"{prefix}, {name}"

print(greet("Lin"))
print(greet("Lin", prefix="Hi"))
```

- Definition and invocation:
  Use `def` for named functions and `lambda` for small anonymous expressions.
- Parameters:
  Python supports positional parameters, keyword parameters, default values, variadic `*args`, and variadic keyword `**kwargs`.
- Return values:
  Functions return a single object, but that object can be a tuple containing multiple values.
- Closures:
  Nested functions can capture names from enclosing scopes.

```python
def make_counter():
    total = 0

    def increment():
        nonlocal total
        total += 1
        return total

    return increment
```

Python also distinguishes parameter styles that matter in API design:

```python
def build_url(host, /, path, *, secure=True):
    scheme = "https" if secure else "http"
    return f"{scheme}://{host}/{path}"
```

The `/` marks positional-only parameters, and `*` marks keyword-only parameters.

## 4. Data Structures
Python ships with flexible built-in collection types that cover most everyday modeling work before a custom class is needed.

- Lists:
  Ordered, mutable sequences.
- Tuples:
  Ordered, immutable sequences.
- Dictionaries:
  Key-value mappings with insertion order preserved in modern Python.
- Sets:
  Unordered collections of unique elements.
- Classes and dataclasses:
  Used when state and behavior should travel together.

```python
numbers = [10, 20, 30]
first = numbers[0]
slice_view = numbers[1:]

user = {"name": "Ada", "level": "advanced"}
tags = {"python", "algorithms", "python"}
```

For lightweight structured records:

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    score: int
```

Python also has powerful comprehension syntax:

```python
squares = [n * n for n in range(5)]
active_users = {user["name"] for user in [{"name": "Ada"}, {"name": "Lin"}]}
```

## 5. Error Handling
Python uses exceptions for error signaling. Exceptions can be caught selectively, transformed, logged, or allowed to propagate upward.

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

- `try` / `except`:
  Catch specific exception types instead of broad `except Exception` unless you are at a clear process boundary.
- `else`:
  Runs only if no exception occurred in the `try` block.
- `finally`:
  Runs whether an exception occurred or not, commonly for cleanup.
- Custom exceptions:
  Usually subclass `Exception`.

```python
class ConfigError(Exception):
    pass
```

Error chaining with `raise ... from ...` is important when wrapping lower-level failures without losing debugging context.

## 6. Modules & Imports
Python modules are `.py` files, and packages are directories used to organize related modules. The import system is straightforward at small scale, but package layout and execution context matter as projects grow.

```python
from pathlib import Path
import json

config_path = Path("config.json")
data = json.loads(config_path.read_text(encoding="utf-8"))
```

- Standard library vs. external packages:
  Modules like `json`, `pathlib`, `datetime`, and `itertools` are built in. Third-party libraries are installed with package managers such as `pip`.
- Absolute imports:
  Preferred for clarity in larger projects.
- Relative imports:
  Useful inside packages, though they can be harder to follow in deep trees.
- Namespace control:
  `import module` keeps names qualified; `from module import name` brings symbols into the current namespace.

Project entry points often rely on package execution:

```python
python -m my_package
```

That form helps Python resolve imports from the package root more reliably than executing nested files directly.
