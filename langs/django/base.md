---
title: Django Foundations
---

Django is a high-level Python web framework built around rapid development, batteries-included defaults, and a strong model-view-template style architecture. It is not a programming language, but in Python web development it often acts like a primary application model because settings, apps, URL routing, ORM models, views, forms, and admin integration shape how services are built.

## 1. Variables & Types
Django applications are written in Python, so the underlying variable and type behavior comes from Python itself. What Django changes is how values move through models, views, forms, serializers, settings, and request or response objects.

```python
from django.http import JsonResponse


def health(request):
    status = {"ok": True}
    return JsonResponse(status)
```

- Declaration:
  Values are declared with normal Python syntax inside modules, classes, and functions.
- Model fields:
  Persistent data is often described through Django model field definitions instead of ad hoc dictionaries.
- Request-scoped values:
  Request data, user information, session state, and path parameters live within the request lifecycle.
- Configuration values:
  Application-wide settings come from Django settings and environment-specific configuration.
- Type hints:
  Python type hints can improve clarity, but runtime behavior still follows Python's dynamic model unless extra validation is added.

```python
from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
```

Two foundational Django ideas matter early:

- Request-local data vs. application configuration:
  A query parameter is not the same kind of value as a settings flag or a database model field.
- ORM field definitions vs. plain Python attributes:
  Model classes describe both application data shape and persistence behavior.

Django code still looks like Python, but many of its most important values are shaped by framework conventions and lifecycle boundaries.

## 2. Control Flow
Django uses normal Python control flow inside views, model methods, forms, and services, but the overall request flow is also strongly influenced by URL resolution, middleware, authentication, and template rendering.

```python
from django.http import HttpResponse


def status_message(request):
    is_loading = request.GET.get("loading") == "1"
    if is_loading:
        return HttpResponse("Loading...")
    return HttpResponse("Ready")
```

- Conditional branching:
  View logic still uses standard `if`, `elif`, and `else`.
- URL routing:
  URL patterns decide which view runs for a given request.
- Middleware flow:
  Middleware can preprocess or short-circuit requests before views run.
- Redirects and responses:
  A Django view's control flow often ends by returning a redirect, template response, JSON response, or error response.
- Template-level branching:
  Some presentation control also lives inside Django templates.

```python
from django.urls import path

urlpatterns = [
    path("health/", health),
]
```

In Django, control flow is not only the code inside a view. It is also the request pipeline around the view.

## 3. Functions
Django applications are built from Python functions and methods, but many of them appear as view functions, model methods, form validators, signal handlers, management commands, and class-based view methods.

```python
from django.http import JsonResponse


def get_user(request, user_id):
    return JsonResponse({"id": user_id})
```

- Definition and invocation:
  Function-based views are standard Python functions that accept a request and return a response.
- Parameters:
  URL parameters, form data, query params, and request body data all shape function inputs.
- Return values:
  Views return `HttpResponse` subclasses or compatible response objects.
- Methods and classes:
  Django also supports class-based views, where behavior is split across methods.
- Layering:
  Good Django code often moves business logic out of views into services, model methods, or dedicated modules.

```python
def create_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "method not allowed"}, status=405)

    name = request.POST.get("name")
    return JsonResponse({"name": name}, status=201)
```

Function design in Django is tied to request-response boundaries. Thin views are usually easier to maintain than views that absorb validation, persistence, business rules, and formatting all at once.

## 4. Data Structures
Django uses standard Python data structures, but most application design revolves around ORM models, querysets, forms, and DTO-like response shapes rather than raw containers alone.

- Model classes:
  Define persistent data and database mappings.
- QuerySets:
  Lazy database query abstractions that behave differently from plain lists.
- Dictionaries:
  Common for JSON responses or template context data.
- Lists:
  Frequently used after query evaluation or for temporary application logic.
- Forms and serializers:
  Used to validate and structure incoming or outgoing data.

```python
from django.db import models


class Article(models.Model):
    title = models.CharField(max_length=200)
    published = models.BooleanField(default=False)
```

Some structural distinctions matter:

- Models vs. plain Python objects:
  Django models carry persistence behavior, not just data fields.
- QuerySets vs. lists:
  QuerySets are lazy and database-backed, which affects performance and evaluation timing.
- Form data vs. model data:
  User input should often be validated separately before becoming model state.

Django data modeling is less about exotic structures and more about respecting the framework's data lifecycle boundaries.

## 5. Error Handling
Django uses Python exceptions together with framework-level error pages, middleware handling, form validation, and HTTP response generation. Good error handling is about translating failures into clear application behavior.

```python
from django.http import JsonResponse


def parse_port(raw: str) -> int:
    port = int(raw)
    if port <= 0 or port > 65535:
        raise ValueError("port out of range")
    return port
```

- Python exceptions:
  Standard `try` / `except` rules still apply.
- HTTP errors:
  Views may raise `Http404`, `PermissionDenied`, or return explicit error responses.
- Form and model validation:
  Validation errors should usually be handled before invalid data reaches persistence.
- Middleware and debug pages:
  Django can render useful debug output in development and configured error handling in production.
- Logging:
  Production systems should record enough context to diagnose failures.

```python
from django.http import Http404


def get_article(request, article_id):
    raise Http404("Article not found")
```

Django error handling is not only about catching exceptions. It is also about presenting the right HTTP and user-facing outcome for each failure path.

## 6. Modules & Imports
Django projects are organized into projects and apps, with modules for models, views, URLs, admin, tests, settings, and supporting services. Module structure strongly affects maintainability.

```python
from django.urls import path
from .views import health

urlpatterns = [
    path("health/", health),
]
```

- Project vs. app structure:
  A Django project contains settings and global configuration, while apps contain domain-specific functionality.
- Imports:
  Django code uses ordinary Python imports, but import cycles can become a problem in larger projects.
- App modules:
  Common files include `models.py`, `views.py`, `urls.py`, `admin.py`, and `tests.py`.
- Shared services:
  Larger projects often introduce service, repository, or selector modules to reduce view complexity.
- Settings:
  Environment-sensitive configuration usually lives in settings modules plus environment variables.

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "blog",
]
```

In Django engineering, module boundaries matter because apps are both organizational units and deployment-relevant chunks of functionality.
