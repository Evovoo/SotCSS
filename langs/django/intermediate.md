---
title: Django Intermediate
---

At the intermediate level, Django becomes less about scaffolding pages quickly and more about building maintainable web applications. The important questions shift toward request lifecycle design, ORM performance, test strategy, settings management, and how framework conveniences affect architecture.

## 1. Concurrency & Async
Django has traditionally been associated with synchronous request handling, but modern Django also supports asynchronous views and more nuanced concurrency concerns. Intermediate work means understanding where synchronous assumptions still apply and where async patterns help.

- Request concurrency:
  A Django app may process many requests concurrently depending on the deployment stack.
- Async views:
  Django supports `async def` views, but not every part of the stack is equally async-friendly.
- Blocking operations:
  Database access, external HTTP calls, and file IO still require careful thought.
- Race conditions:
  Concurrent requests can still create data races around shared state, caches, or write operations.
- Background work:
  Long-running tasks are often better handled in separate worker systems rather than inside request handlers.

```python
from django.http import JsonResponse


async def async_health(request):
    return JsonResponse({"ok": True})
```

Important intermediate concerns:

- Async boundary clarity:
  Mixing sync ORM work into async paths carelessly can create problems.
- Request ownership:
  Work tied to a request should not keep running indefinitely after the request is gone.
- Deployment model:
  WSGI and ASGI environments lead to different concurrency implications.

## 2. Web Development
Django is fundamentally a web framework, so intermediate work means understanding URL design, middleware chains, templates or APIs, authentication, permissions, and request validation beyond simple examples.

```python
from django.urls import path
from . import views

urlpatterns = [
    path("users/<uuid:user_id>/", views.get_user),
]
```

- HTTP methods:
  Views should respect resource semantics and clear method handling.
- Routing:
  URL namespaces, reusable app routes, and versioned APIs matter in larger systems.
- Middleware:
  Auth, CSRF, session handling, logging, and request shaping all depend on middleware order.
- Templates vs. APIs:
  Django can serve HTML, JSON APIs, or hybrid server-rendered experiences.
- Real-time extensions:
  WebSockets and asynchronous communication usually require adjacent tooling such as Channels or separate services.

Intermediate Django web development often means deciding where to keep using Django's built-in strengths and where to supplement them with specialized libraries.

## 3. Data Persistence
Django's ORM is one of its biggest strengths, but intermediate use requires understanding how queries, relations, transactions, and migrations behave under real load.

- SQL vs. NoSQL:
  Django is most naturally aligned with relational models, though polyglot persistence is still possible.
- ORM patterns:
  QuerySets, managers, related loading, and transactions shape most persistence behavior.
- Connection handling:
  Database connections, pooling strategies, and per-request usage patterns matter in production.
- Migrations:
  Schema evolution is tightly integrated and should be part of release discipline.
- Query performance:
  `select_related`, `prefetch_related`, and query evaluation timing are critical for avoiding performance traps.

```python
articles = Article.objects.select_related("author").filter(published=True)
```

Two common intermediate lessons:

- ORM convenience does not remove the need to understand SQL costs, indexes, and N+1 query patterns.
- Model boundaries should remain intentional so persistence structure does not silently become API structure everywhere.

## 4. Testing
Django provides a rich testing framework, and intermediate teams use it for model logic, view behavior, database interactions, and integration flows.

```python
from django.test import TestCase


class HealthViewTests(TestCase):
    def test_health_endpoint(self):
        response = self.client.get("/health/")
        self.assertEqual(response.status_code, 200)
```

- Unit tests:
  Good for pure utilities, validators, and focused business logic.
- Model tests:
  Important for custom query logic, constraints, and domain behavior.
- View tests:
  Useful for request handling, permissions, and response contracts.
- Integration tests:
  Necessary when multiple framework layers or external systems interact.
- Test database behavior:
  Django's testing tools make database-backed tests practical, but speed still matters.

Intermediate Django testing also means being careful about fixtures, factories, transaction behavior, and overreliance on end-to-end style tests for logic that could be isolated earlier.

## 5. Dependency Management
Django dependency management lives in the Python ecosystem, which means package versions, virtual environments, lock files, and security review all still matter.

- Package management:
  `pip`, `pip-tools`, `poetry`, or similar tools often manage dependencies.
- Django ecosystem packages:
  Auth, APIs, admin extensions, storage backends, and background task libraries quickly expand the dependency graph.
- Version compatibility:
  Django version, Python version, and package compatibility need deliberate alignment.
- Private registries:
  Common in enterprise environments.
- Vulnerability scanning:
  Server-side Python dependencies require regular review.

```python
Django>=5.0,<6.0
psycopg[binary]>=3.1
```

Intermediate teams also learn that dependency choices strongly affect upgrade cadence, security posture, and operational complexity.

## 6. Logging & Debugging
Django debugging spans request handling, ORM queries, middleware behavior, template rendering, and deployment configuration. Good observability matters well beyond local stack traces.

```python
import logging

logger = logging.getLogger(__name__)
logger.info("loading profile", extra={"user_id": user_id})
```

- Log levels:
  Standard Python logging levels still apply.
- ORM query visibility:
  Query logging and profiling can reveal expensive database behavior.
- Stack traces:
  Django debug pages are useful in development but must not leak into production.
- Middleware and settings debugging:
  Some issues come from framework ordering or config, not business code.
- Production observability:
  Metrics, tracing, and structured logs become important in larger systems.

Intermediate Django debugging often means deciding whether a failure comes from view logic, model logic, settings, middleware order, or database behavior.

## 7. Packaging & Deployment
Django packaging and deployment depend on runtime choices such as WSGI vs. ASGI, static asset handling, process managers, and environment-specific settings.

- Environment variables:
  Common for secrets, database URLs, debug flags, and external integrations.
- Build and collect steps:
  Static files, migrations, and dependency installation are part of deploy preparation.
- Dockerization:
  Common for modern Django services.
- CI/CD:
  Pipelines often run tests, linting, migrations checks, and deployment automation.
- Runtime serving:
  Gunicorn, Uvicorn, Daphne, Nginx, and other layers influence production behavior.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

Intermediate Django deployment is largely about making the framework's strong conventions work cleanly with real infrastructure constraints.
