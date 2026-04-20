---
title: Django 进阶
---

进入进阶阶段后，Django 的重点不再只是“快速搭个页面”，而是如何构建可维护的 Web 应用。真正重要的问题会转向请求生命周期设计、ORM 性能、测试策略、配置管理，以及框架便利性如何影响架构。

## 1. Concurrency & Async
Django 传统上更常和同步请求处理绑定，但现代 Django 也支持异步 view，并带来了更细致的并发问题。进阶开发意味着理解哪些地方仍然是同步假设，哪些地方适合引入 async。

- 请求并发：
  Django 应用能否并发处理大量请求，很大程度取决于部署栈。
- 异步视图：
  Django 支持 `async def` view，但并不是整条技术栈都同样适合异步。
- 阻塞操作：
  数据库访问、外部 HTTP 调用和文件 IO 仍然需要认真设计。
- 竞态条件：
  并发请求仍会在共享状态、缓存或写操作上制造数据竞争。
- 后台工作：
  长时间运行任务通常更适合放到独立 worker 系统，而不是塞进请求处理路径。

```python
from django.http import JsonResponse


async def async_health(request):
    return JsonResponse({"ok": True})
```

几个关键进阶点：

- 异步边界清晰度：
  在 async 路径里随意混入同步 ORM 操作会带来问题。
- 请求所有权：
  和请求绑定的工作不应在请求结束后无限期继续执行。
- 部署模型：
  WSGI 和 ASGI 环境会带来完全不同的并发含义。

## 2. Web Development
Django 本质上就是 Web 框架，因此进阶开发意味着真正理解 URL 设计、中间件链、模板或 API、认证、权限和请求校验，而不只是写几个简单 view。

```python
from django.urls import path
from . import views

urlpatterns = [
    path("users/<uuid:user_id>/", views.get_user),
]
```

- HTTP 方法：
  View 应清楚处理资源语义和不同方法行为。
- 路由：
  URL namespace、可复用 app 路由和 API 版本化在大系统里很重要。
- 中间件：
  认证、CSRF、session、日志和请求整形都高度依赖中间件顺序。
- 模板与 API：
  Django 既能返回 HTML，也能提供 JSON API，或做混合服务端渲染。
- 实时扩展：
  WebSocket 和异步通信通常需要借助 Channels 或独立服务配合。

Django 的进阶 Web 开发，经常是在决定：哪些地方继续用 Django 的内建优势，哪些地方需要补充专门库或外围系统。

## 3. Data Persistence
Django ORM 是其最大优势之一，但进阶使用要求你真正理解查询、关系、事务和迁移在真实负载下的行为。

- SQL 与 NoSQL：
  Django 天然更偏关系型建模，但混合持久化依然可能。
- ORM 模式：
  QuerySet、manager、关联加载和事务定义了大部分持久化行为。
- 连接处理：
  数据库连接、连接池策略和按请求使用模式在生产中都很关键。
- 迁移：
  Schema 演进与发布纪律紧密相关。
- 查询性能：
  `select_related`、`prefetch_related` 以及查询求值时机，对避免性能陷阱非常关键。

```python
articles = Article.objects.select_related("author").filter(published=True)
```

两个常见进阶体会：

- ORM 的便利并不能替代你对 SQL 成本、索引和 N+1 查询问题的理解。
- 模型边界必须保持有意识设计，否则持久化结构会悄悄变成所有 API 层的结构。

## 4. Testing
Django 自带很丰富的测试框架，进阶团队会把它用于 model 逻辑、view 行为、数据库交互和集成流程验证。

```python
from django.test import TestCase


class HealthViewTests(TestCase):
    def test_health_endpoint(self):
        response = self.client.get("/health/")
        self.assertEqual(response.status_code, 200)
```

- 单元测试：
  适合纯工具函数、校验器和聚焦明确的业务逻辑。
- Model 测试：
  对自定义查询逻辑、约束和领域行为尤其重要。
- View 测试：
  用于验证请求处理、权限和响应契约。
- 集成测试：
  当多个框架层或外部系统交互时就很必要。
- 测试数据库行为：
  Django 让数据库驱动测试很方便，但速度依然需要控制。

Django 的进阶测试还要求你认真处理 fixture、factory、事务行为，以及避免把本可前置隔离验证的逻辑全都推给端到端式测试。

## 5. Dependency Management
Django 的依赖管理位于 Python 生态内部，因此包版本、虚拟环境、lock file 和安全审查都依然重要。

- 包管理：
  通常通过 `pip`、`pip-tools`、`poetry` 等工具管理依赖。
- Django 生态包：
  认证、API、admin 扩展、存储后端和后台任务库会很快扩张依赖图。
- 版本兼容性：
  Django 版本、Python 版本和第三方包版本需要被刻意对齐。
- 私有仓库：
  企业环境中很常见。
- 漏洞扫描：
  服务端 Python 依赖必须定期审查。

```python
Django>=5.0,<6.0
psycopg[binary]>=3.1
```

进阶团队也会很快学会：依赖选择会强烈影响升级节奏、安全姿态和运维复杂度。

## 6. Logging & Debugging
Django 调试横跨请求处理、ORM 查询、中间件行为、模板渲染和部署配置。优秀的可观测性远不只是能看到本地 stack trace。

```python
import logging

logger = logging.getLogger(__name__)
logger.info("loading profile", extra={"user_id": user_id})
```

- 日志级别：
  标准 Python logging 级别依然适用。
- ORM 查询可见性：
  查询日志和性能分析能直接暴露昂贵数据库行为。
- 栈跟踪：
  Django debug page 在开发环境很有用，但绝不能泄漏到生产。
- 中间件和 settings 调试：
  有些问题并不在业务代码，而在框架顺序或配置。
- 生产可观测性：
  指标、链路追踪和结构化日志在更大系统里会变得重要。

Django 的进阶调试经常是在区分：问题到底来自 view 逻辑、model 逻辑、settings、中间件顺序，还是数据库行为。

## 7. Packaging & Deployment
Django 的打包和部署高度依赖运行时选择，例如 WSGI 还是 ASGI、静态资源处理方式、进程管理器和环境配置方式。

- 环境变量：
  常用于密钥、数据库 URL、debug 开关和外部集成配置。
- 构建与收集步骤：
  静态文件、迁移和依赖安装都属于部署准备工作。
- Docker 化：
  在现代 Django 服务里很常见。
- CI/CD：
  流水线通常会运行测试、lint、迁移检查和部署自动化。
- 运行时服务：
  Gunicorn、Uvicorn、Daphne、Nginx 等外围层会直接影响生产行为。

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

Django 的进阶部署，本质上是在让框架强约定和真实基础设施约束之间平稳配合。
