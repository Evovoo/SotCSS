---
title: Python Intermediate
---

At the intermediate level, Python stops being only a scripting language and becomes an application platform. The important shift is learning how Python behaves under IO, web workloads, tests, packaging, and operational tooling rather than only syntax.

## 1. Concurrency & Async
Python supports multiple concurrency models, but each model has different tradeoffs. Understanding the Global Interpreter Lock (GIL), cooperative scheduling, and IO-bound vs. CPU-bound workloads is essential.

- Threads:
  Useful for IO-bound work, but CPU-bound pure-Python code does not scale linearly across cores because of the GIL in standard CPython.
- Async IO:
  `asyncio` enables large amounts of concurrent IO using coroutines and an event loop.
- Multiprocessing:
  Spawns separate interpreter processes and can use multiple CPU cores effectively, at the cost of heavier communication and startup overhead.

```python
import asyncio

async def fetch_user(user_id: int) -> dict:
    await asyncio.sleep(0.1)
    return {"id": user_id}

async def main():
    users = await asyncio.gather(fetch_user(1), fetch_user(2))
    print(users)

asyncio.run(main())
```

Key intermediate concerns:

- Event loop ownership:
  Library code should usually avoid assuming it can freely create or control the event loop.
- Cancellation:
  Async tasks can be cancelled, so cleanup logic should handle `asyncio.CancelledError`.
- Race conditions:
  Shared mutable state remains dangerous whether the concurrency model is threads or coroutines.

## 2. Web Development
Python is widely used for backend web development through frameworks such as Django, Flask, FastAPI, and Starlette. Intermediate understanding includes request lifecycle, validation, middleware ordering, and deployment boundaries.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True}
```

- HTTP methods:
  `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` should map clearly to resource semantics.
- Routing:
  Frameworks bind path patterns to handlers, often with parameter parsing and validation.
- Middleware:
  Cross-cutting concerns such as auth, logging, tracing, CORS, and error shaping often live here.
- Serialization:
  JSON is standard, but careful schema handling matters for long-term API stability.
- Real-time communication:
  Python frameworks often support WebSockets for bidirectional updates.

Intermediate Python web work also means respecting process models. For example, an ASGI app under Uvicorn behaves differently from a WSGI app under Gunicorn, especially around async support.

## 3. Data Persistence
Most Python applications eventually touch relational databases, document stores, caches, or message-backed state. Intermediate skill here means knowing both the raw storage model and the abstraction you place on top of it.

- SQL vs. NoSQL:
  Choose based on consistency needs, query patterns, and operational constraints rather than trend.
- ORMs:
  SQLAlchemy and Django ORM provide modeling and query composition, but they do not remove the need to understand joins, indexes, and transaction boundaries.
- Migrations:
  Schema evolution must be explicit and versioned.
- Connection pooling:
  Database connections are expensive; production services should reuse them carefully.

```python
from sqlalchemy import select

stmt = select(User).where(User.email == "ada@example.com")
user = session.execute(stmt).scalar_one_or_none()
```

Two common intermediate mistakes:

- Treating ORM code as if it were free:
  Lazy loading and N+1 query patterns can hurt performance quickly.
- Mixing transaction boundaries casually:
  If you do not know exactly when a transaction starts, commits, or rolls back, bugs become hard to reason about.

## 4. Testing
Python testing typically centers around `pytest`, though the built-in `unittest` module remains relevant. Strong intermediate practice means writing tests that isolate behavior without overfitting to implementation details.

```python
def add(a: int, b: int) -> int:
    return a + b

def test_add():
    assert add(2, 3) == 5
```

- Unit tests:
  Validate focused behavior with minimal external dependencies.
- Mocking and stubbing:
  Useful for network calls, clock control, external processes, or expensive dependencies, but over-mocking can make tests brittle.
- Integration tests:
  Validate real interactions between components such as API + database.
- Parametrization:
  `pytest.mark.parametrize` helps cover edge cases compactly.
- Coverage:
  Coverage reports help reveal blind spots, but high percentage alone does not prove good tests.

Intermediate teams also pay attention to test speed, deterministic setup, and fixture scope.

## 5. Dependency Management
Python dependency management is more fragmented than some ecosystems, so teams need deliberate conventions.

- Package installation:
  `pip` remains the baseline installer.
- Environment isolation:
  Use virtual environments such as `venv` to avoid mixing project dependencies with system Python.
- Locking:
  Tools like `pip-tools`, `poetry`, or `uv` can produce reproducible dependency sets.
- Version ranges:
  Understand when to pin exact versions and when to allow compatible ranges.
- Vulnerability and supply-chain review:
  Python projects should still scan dependencies and review transitive packages, especially for server workloads.

```python
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Dependency hygiene includes separating runtime dependencies from development-only tools such as linters and test frameworks.

## 6. Logging & Debugging
Intermediate Python development requires disciplined observability. Print-based debugging helps locally, but production systems need structured logs, request correlation, and actionable traces.

```python
import logging

logger = logging.getLogger(__name__)

def process_order(order_id: str) -> None:
    logger.info("processing order", extra={"order_id": order_id})
```

- Log levels:
  `DEBUG`, `INFO`, `WARNING`, `ERROR`, and `CRITICAL` should map to concrete operational meaning.
- Structured logging:
  Prefer machine-parsable fields over free-form text where logs feed into search or alerting systems.
- Tracebacks:
  Python exceptions include stack traces that are often enough to locate defects quickly if logs preserve them.
- Debuggers:
  `pdb` and IDE-integrated debuggers remain useful for state inspection.
- Remote debugging:
  Valuable but should be used carefully in production-like environments because it can change timing and exposure.

## 7. Packaging & Deployment
Intermediate packaging is about taking Python code from a local script to a repeatable deployable artifact.

- Environment variables:
  Commonly used for secrets, feature flags, and environment-specific configuration.
- Dockerization:
  A Python service often ships with a `Dockerfile` that installs dependencies, copies source, and sets an entry command.
- Build artifacts:
  Libraries may produce wheels or source distributions.
- CI/CD:
  Pipelines typically run lint, tests, packaging checks, and deployment steps.
- Reload behavior:
  Development servers may hot-reload, but production startup should be explicit and deterministic.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "-m", "my_service"]
```

For applications, the real deployment boundary is often the process manager, container runtime, and environment configuration rather than the Python code alone.
