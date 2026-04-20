---
title: Python 进阶
---

进入进阶阶段后，Python 不再只是“写脚本的语言”，而是一个完整的应用开发平台。重点会从语法本身转向 IO 模型、Web 服务、数据库、测试、依赖管理和运维可观测性。

## 1. Concurrency & Async
Python 支持多种并发模型，但代价与适用场景差异很大。理解 GIL、协作式调度、IO 密集与 CPU 密集任务的区别，是进阶阶段的核心。

- 线程：
  适合 IO 密集任务；但在标准 CPython 中，纯 Python 的 CPU 密集计算不会因为线程而线性利用多核，这与 GIL 有关。
- 异步 IO：
  `asyncio` 通过事件循环与协程处理大量并发 IO。
- 多进程：
  通过多个解释器进程利用多核 CPU，但进程间通信和启动成本更高。

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

几个常见进阶问题：

- 事件循环归属：
  库代码通常不应该随意假设自己可以完全接管事件循环。
- 取消语义：
  异步任务可能被取消，因此清理逻辑需要考虑 `asyncio.CancelledError`。
- 竞态条件：
  只要有共享可变状态，不论你用线程还是协程，都可能出现竞态。

## 2. Web Development
Python 在后端 Web 开发中非常常见，典型框架包括 Django、Flask、FastAPI、Starlette。进阶理解不只是会写路由，而是要理解请求生命周期、参数校验、中间件顺序和部署模型。

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True}
```

- HTTP 方法：
  `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 应当与资源语义保持一致。
- 路由：
  框架负责把 URL 模式绑定到处理函数，并通常支持参数解析和校验。
- 中间件：
  鉴权、日志、链路追踪、CORS、统一错误格式等横切关注点通常放在这里。
- 序列化：
  JSON 最常见，但接口长期稳定性依赖于清晰的 schema 管理。
- 实时通信：
  很多 Python 框架支持 WebSocket 处理双向通信。

进阶开发还要理解运行模型。例如运行在 Uvicorn 上的 ASGI 应用，与运行在 Gunicorn 上的传统 WSGI 应用，在异步支持和请求处理方式上就不同。

## 3. Data Persistence
大多数 Python 应用最终都会接触关系型数据库、文档数据库、缓存或某种持久化状态。进阶能力在于你既理解底层存储模型，也理解抽象层的边界。

- SQL 与 NoSQL：
  应基于一致性需求、查询模式和运维约束来选，而不是只看流行度。
- ORM：
  SQLAlchemy、Django ORM 能帮助建模和组合查询，但不会替代你对 join、索引和事务边界的理解。
- 迁移：
  数据库 schema 演进必须明确、可版本化。
- 连接池：
  数据库连接成本高，生产服务应谨慎复用。

```python
from sqlalchemy import select

stmt = select(User).where(User.email == "ada@example.com")
user = session.execute(stmt).scalar_one_or_none()
```

两个常见问题：

- 把 ORM 当成“没有成本”：
  懒加载和 N+1 查询会很快让性能恶化。
- 随意混用事务边界：
  如果你不清楚事务何时开始、提交、回滚，排查数据一致性问题会非常困难。

## 4. Testing
Python 测试生态通常以 `pytest` 为主，标准库中的 `unittest` 也仍然有价值。进阶测试能力在于验证行为，而不是把实现细节写死。

```python
def add(a: int, b: int) -> int:
    return a + b

def test_add():
    assert add(2, 3) == 5
```

- 单元测试：
  聚焦小范围行为，尽量减少外部依赖。
- Mock 与 Stub：
  对网络、时钟、外部进程、昂贵依赖很有用，但过度 mock 会让测试脆弱。
- 集成测试：
  验证 API、数据库、消息层等真实组件间的交互。
- 参数化测试：
  `pytest.mark.parametrize` 很适合紧凑地覆盖边界条件。
- 覆盖率：
  覆盖率报告能提示盲区，但高覆盖率不等于高质量测试。

进阶团队通常还会关注测试速度、环境可重复性和 fixture 的作用域设计。

## 5. Dependency Management
Python 的依赖管理工具链相对分散，因此团队更需要约定和纪律。

- 包安装：
  `pip` 仍然是最基础的安装工具。
- 环境隔离：
  通常用 `venv` 之类的虚拟环境隔离项目依赖和系统 Python。
- 锁定依赖：
  `pip-tools`、`poetry`、`uv` 等工具可帮助生成可复现的依赖集合。
- 版本范围：
  需要明确什么时候精确锁版本，什么时候允许兼容范围。
- 安全与供应链：
  服务端 Python 项目同样需要审查依赖漏洞和传递依赖来源。

```python
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

依赖治理还包括把运行时依赖与开发依赖区分开，例如测试框架、格式化工具、静态检查工具不应与生产运行环境混在一起。

## 6. Logging & Debugging
进阶 Python 开发离不开可观测性。`print` 调试在本地还行，但生产环境通常需要结构化日志、请求关联信息和可追踪的异常上下文。

```python
import logging

logger = logging.getLogger(__name__)

def process_order(order_id: str) -> None:
    logger.info("processing order", extra={"order_id": order_id})
```

- 日志级别：
  `DEBUG`、`INFO`、`WARNING`、`ERROR`、`CRITICAL` 应对应明确的运维语义。
- 结构化日志：
  若日志会进入检索或告警系统，优先输出可机器解析的字段，而不是只写自由文本。
- Traceback：
  Python 的异常堆栈通常已经足够定位大多数问题，前提是日志别把它吞掉。
- 调试器：
  `pdb` 和 IDE 调试器仍然很有效。
- 远程调试：
  有价值，但在接近生产的环境要谨慎，因为它可能改变时序和暴露面。

## 7. Packaging & Deployment
进阶打包与部署的重点，是把本地代码变成可重复、可发布、可运行的制品和流程。

- 环境变量：
  常用于密钥、开关和环境差异化配置。
- Docker 化：
  Python 服务经常通过 `Dockerfile` 固化依赖安装、源码复制和启动命令。
- 构建产物：
  库项目可能会产出 wheel 或 source distribution。
- CI/CD：
  流水线通常负责 lint、测试、打包检查和部署。
- 热更新：
  开发环境可以热重载，但生产启动过程应尽量明确、稳定、可预测。

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "-m", "my_service"]
```

对应用来说，真正的部署边界往往不只是 Python 代码，还包括进程管理器、容器运行时和环境配置。
