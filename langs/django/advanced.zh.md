---
title: Django 高阶
---

Django 的高阶阶段，重点在于如何使用这个功能很完整的框架，同时不让便利性演变成架构模糊。真正难的通常不是再加一个 app 或 model，而是如何在系统变大后仍然控制查询行为、副作用、配置层次和运维边界。

## 1. Deep Concurrency
在高阶层面，Django 的并发重点是请求隔离、异步边界、后台任务和数据库协调，而不是共享内存技巧本身。

- 请求隔离：
  并发请求绝不能破坏共享可变状态。
- 异步边界：
  Async view、channels 和后台 worker 需要明确哪些部分是真正非阻塞的。
- 数据库锁：
  在高写入系统中，事务与行级锁会变得非常关键。
- 消息传递：
  任务队列和事件驱动组件经常作为 Django 请求处理的补充。
- 类死锁与饥饿风险：
  数据库竞争、worker 积压和阻塞操作即使没有显式线程死锁，也能让生产系统停滞。

```python
from django.db import transaction


@transaction.atomic
def transfer_funds(...):
    ...
```

高阶 Django 工程实践会认真思考：请求在哪里结束、后台工作从哪里开始，以及数据库一致性和吞吐之间如何权衡。

## 2. Metaprogramming & Reflection
Django 大量依赖声明式模型、内省和生成式行为。它的强大之处，很大一部分来自元数据和约定，而不是显式命令式装配。

- 模型内省：
  Django 会检查模型字段来生成 schema、form、admin 行为和查询能力。
- App registry 与配置：
  框架会动态发现 app、model、signal 和 settings。
- 代码生成：
  Migration 和 admin 脚手架本质上都是从模型元数据生成或推导出来的。
- 声明式配置：
  Form、serializer、model field、admin class 和 middleware 都是元数据密集型模式。
- 反射边界：
  Django 很动态，但高规模系统仍然需要足够纪律，避免隐藏行为难以理解。

```python
class User(models.Model):
    email = models.EmailField(unique=True)
```

一个很实际的高阶结论是：Django 经常比手写代码表面呈现出来的事情做得更多。理解这些生成和内省出来的行为，是性能调优和排障的关键。

## 3. Design Patterns
Django 会奖励某些设计模式，也会惩罚某些模式。高阶设计的核心，是在一个很容易“什么都往一起写”的框架里，主动画出清晰边界。

- Fat model 与 service layer：
  领域行为必须有归属，但并不是所有业务流程都适合直接塞进 model class。
- App 边界：
  App 应反映清晰所有权，而不是偶然的文件分组。
- Repository 或 selector 模式：
  在某些团队中有价值，因为它能让查询逻辑更显式。
- 事件驱动副作用：
  Signal 有时很方便，但隐藏副作用也会很快变得难以推理。
- 配置驱动组合：
  很强，但如果过多行为藏在 settings 和框架间接层中，会迅速失控。

```python
class UserService:
    def create_user(self, email: str) -> User:
        ...
```

高阶 Django 设计通常意味着：主动抵抗“view、model、form、signal、admin 和 task 全都顺手混在一起”的诱惑。

## 4. Advanced Type System
Django 生活在 Python 的动态世界里，但高级类型工作依然有价值，尤其体现在类型提示、带类型查询模式、schema 契约和显式结果模型上。

- 类型提示：
  对 service 层、工具函数和复杂应用逻辑越来越有价值。
- Model 与 queryset 类型：
  有帮助，但框架本身并不会始终完美强制这些类型。
- DTO 与 schema 建模：
  显式传输类型能提升 API 清晰度。
- 通过校验施加类型约束：
  因为 Python 依然是动态语言，很多保证仍需靠运行时校验承担。
- 契约分层：
  即使它们最后都是 Python 对象，也必须区分请求 schema、领域模型和持久化模型。

```python
from dataclasses import dataclass


@dataclass
class UserSummary:
    id: int
    email: str
```

在高阶 Django 系统里，类型最有价值的地方，是澄清边界并支持更安全的重构；如果注解只是制造了“看起来更安全”的幻觉，而运行时校验和架构边界并没有跟上，那它的收益就会下降。
