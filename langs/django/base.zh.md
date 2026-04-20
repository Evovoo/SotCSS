---
title: Django 基础
---

Django 是一个高层 Python Web 框架，强调快速开发、开箱即用和清晰的 model-view-template 风格架构。它并不是编程语言，但在 Python Web 开发里，它经常像一种主要应用模型，因为 settings、app、URL 路由、ORM、view、form 和 admin 集成会直接塑造系统结构。

## 1. Variables & Types
Django 应用写在 Python 之上，因此底层变量和类型行为来自 Python 本身。Django 真正改变的是：值如何在 model、view、form、serializer、settings 以及 request/response 对象之间流动。

```python
from django.http import JsonResponse


def health(request):
    status = {"ok": True}
    return JsonResponse(status)
```

- 声明方式：
  值仍然通过普通 Python 语法在模块、类和函数中声明。
- 模型字段：
  持久化数据通常通过 Django model field 定义，而不是随意的字典结构。
- 请求作用域值：
  请求数据、用户信息、session 状态和路径参数都活在请求生命周期内。
- 配置值：
  应用级配置来自 Django settings 和环境相关配置。
- 类型提示：
  Python type hint 可以提升清晰度，但运行时依然遵循 Python 动态模型，除非你额外加校验。

```python
from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
```

两个基础点很关键：

- 请求局部数据与应用配置：
  一个 query 参数和一个 settings 开关、一个数据库字段，不是同一类值。
- ORM 字段定义与普通 Python 属性：
  Model 类不仅描述数据形状，也描述持久化行为。

Django 代码仍然像 Python，但很多最重要的值都被框架约定和生命周期边界所塑造。

## 2. Control Flow
Django 在 view、model method、form 和 service 中使用普通 Python 控制流，但整体请求流程同时也强烈受到 URL 解析、中间件、认证和模板渲染影响。

```python
from django.http import HttpResponse


def status_message(request):
    is_loading = request.GET.get("loading") == "1"
    if is_loading:
        return HttpResponse("Loading...")
    return HttpResponse("Ready")
```

- 条件分支：
  View 逻辑依然使用标准 `if`、`elif`、`else`。
- URL 路由：
  URL pattern 决定某个请求最终进入哪个 view。
- 中间件流程：
  中间件可以在 view 执行前预处理请求，甚至直接短路返回。
- Redirect 与 response：
  Django view 的控制流常常以 redirect、模板响应、JSON 响应或错误响应结束。
- 模板层分支：
  一些展示层分支逻辑也可能出现在 Django template 中。

```python
from django.urls import path

urlpatterns = [
    path("health/", health),
]
```

在 Django 中，控制流不只存在于 view 代码本身，它同样存在于 view 外围那条请求管线中。

## 3. Functions
Django 应用由普通 Python 函数和方法构成，但它们经常以 function-based view、model method、form validator、signal handler、management command 和 class-based view method 的形式出现。

```python
from django.http import JsonResponse


def get_user(request, user_id):
    return JsonResponse({"id": user_id})
```

- 定义与调用：
  Function-based view 本质上就是接收 request 并返回 response 的普通 Python 函数。
- 参数：
  URL 参数、表单数据、query 参数和请求体数据都会塑造函数输入。
- 返回值：
  View 返回的是 `HttpResponse` 或兼容响应对象。
- 方法与类：
  Django 也支持 class-based view，把行为拆到多个方法中。
- 分层：
  好的 Django 代码通常会把业务逻辑从 view 中拆到 service、model method 或独立模块里。

```python
def create_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "method not allowed"}, status=405)

    name = request.POST.get("name")
    return JsonResponse({"name": name}, status=201)
```

Django 中的函数设计和请求-响应边界高度绑定。相比把所有事情都写进 view，薄一点的 view 通常更容易维护。

## 4. Data Structures
Django 使用标准 Python 数据结构，但大多数应用设计更围绕 ORM model、queryset、form 和类似 DTO 的响应结构，而不是原始容器本身。

- Model classes：
  定义持久化数据和数据库映射。
- QuerySets：
  惰性数据库查询抽象，行为不同于普通列表。
- Dictionaries：
  常用于 JSON 响应或模板 context。
- Lists：
  在 queryset 求值后或临时业务逻辑中很常见。
- Forms 与 serializers：
  用于校验和结构化传入或传出数据。

```python
from django.db import models


class Article(models.Model):
    title = models.CharField(max_length=200)
    published = models.BooleanField(default=False)
```

几个结构层面的区别很重要：

- Model 与普通 Python 对象：
  Django model 不只是数据字段，还带有持久化行为。
- QuerySet 与 list：
  QuerySet 是惰性、数据库驱动的，这会直接影响性能和求值时机。
- 表单数据与模型数据：
  用户输入通常应先经过独立验证，再决定是否转成 model 状态。

Django 的数据建模重点，不在于特别复杂的数据结构，而在于尊重框架里的数据生命周期边界。

## 5. Error Handling
Django 结合了 Python 异常机制、框架错误页、中间件处理、表单校验和 HTTP 响应生成。好的错误处理，核心在于把失败翻译成正确应用行为。

```python
from django.http import JsonResponse


def parse_port(raw: str) -> int:
    port = int(raw)
    if port <= 0 or port > 65535:
        raise ValueError("port out of range")
    return port
```

- Python 异常：
  普通 `try` / `except` 规则依然成立。
- HTTP 错误：
  View 可以抛出 `Http404`、`PermissionDenied`，也可以直接返回错误响应。
- 表单和模型校验：
  无效数据通常应在进入持久化前就被拦下。
- 中间件与调试页：
  Django 在开发环境能提供详细 debug 输出，在生产环境则可接入更合适的错误处理配置。
- 日志：
  生产系统必须记录足够上下文以支持排障。

```python
from django.http import Http404


def get_article(request, article_id):
    raise Http404("Article not found")
```

Django 的错误处理不只是“抓异常”，更是“在每一种失败路径上给出正确的 HTTP 和用户可见结果”。

## 6. Modules & Imports
Django 项目通常由 project 和多个 app 组成，模块包括 model、view、URL、admin、test、settings 以及辅助 service。模块结构会直接影响可维护性。

```python
from django.urls import path
from .views import health

urlpatterns = [
    path("health/", health),
]
```

- Project 与 app 结构：
  Django project 保存 settings 和全局配置，app 则承载领域功能。
- Imports：
  Django 代码使用普通 Python import，但大型项目里循环依赖很容易出现。
- App 模块：
  常见文件包括 `models.py`、`views.py`、`urls.py`、`admin.py` 和 `tests.py`。
- 共享 service：
  较大的项目常引入 service、repository 或 selector 模块，以减少 view 复杂度。
- Settings：
  环境相关配置通常放在 settings 模块和环境变量里。

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "blog",
]
```

在 Django 工程里，模块边界非常关键，因为 app 既是组织单元，也常常是部署与所有权上的功能边界。
