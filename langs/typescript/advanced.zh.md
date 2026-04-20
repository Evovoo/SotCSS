---
title: TypeScript 高阶
---

TypeScript 的高阶阶段，重点在于用类型系统表达真实程序不变量，而不是把代码库变成类型层炫技现场。它确实能建模很复杂的关系，但最终目标仍然是支撑可维护的 JavaScript 系统，而不是赢得抽象比赛。

## 1. Deep Concurrency
在高阶层面，TypeScript 的并发问题本质上仍然是 JavaScript 的并发问题。类型系统可以帮助描述协议、消息形状和异步状态，但不会改变运行时调度模型。

- 消息传递：
  被类型化的 worker 消息、事件载荷和队列协议，通常比松散对象更安全。
- 原子与共享内存工具：
  `SharedArrayBuffer` 和 `Atomics` 确实存在，但它们是高度专业化工具，仍需非常谨慎。
- 死锁与饥饿：
  事件循环饥饿、永远不 resolve 的 promise 和被阻塞的 worker 仍然是现实风险。
- 取消协议：
  带类型的取消信号和显式任务生命周期，有助于复杂异步系统保持一致性。
- Actor 风格设计：
  许多稳健的 TypeScript 系统会通过队列、reducer、worker 或服务边界隔离状态。

```typescript
type WorkerMessage =
  | { type: "ping" }
  | { type: "result"; value: number };
```

高阶 TypeScript 工程实践会把类型系统视为并发协议描述层，而不是运行时正确性的替代品。

## 2. Metaprogramming & Reflection
TypeScript 同时拥有 JavaScript 的运行时元编程能力和自身的类型层元编程能力。力量很强，但如果滥用，也会非常难读。

- 运行时反射：
  `Reflect`、`Proxy`、decorator 和各种 metadata 库依然适用。
- 类型层编程：
  条件类型、映射类型、索引访问类型和模板字面量类型可以表达丰富的编译期变换。
- 代码生成：
  基于 schema 的生成器、API client 和声明文件输出，在高级 TypeScript 工作流里很常见。
- 装饰器驱动系统：
  一些框架会用装饰器做路由、校验、注入或元数据收集。
- 推断控制：
  工具类型和设计得当的泛型约束，可以控制推断到底应走多远。

```typescript
type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K];
};
```

元编程最有价值的时候，是它消除了重复并澄清意图；一旦类型比运行时代码本身更难理解，这种抽象多半已经超额了。

## 3. Design Patterns
TypeScript 当然支持经典设计模式，但它把结构化类型、函数、对象、类和可判别联合组合在一起之后，这些模式的最佳表达方式往往会发生变化。

- SOLID 原则：
  依然有价值，尤其在模块边界和可变性控制上。
- 创建型模式：
  工厂函数和带类型的 builder 往往比复杂类层级更顺手。
- 结构型模式：
  adapter 和 facade 在 API 边界与框架边界很常见。
- 行为型模式：
  strategy、observer、reducer、command 和事件驱动模式，都很自然地适配函数与联合类型。
- 依赖注入：
  可通过普通参数、容器框架或模块组合实现，取决于系统复杂度。

```typescript
interface Serializer<T> {
  dump(value: T): string;
}
```

高阶 TypeScript 设计通常意味着：保持运行时架构尽量简单，同时用类型让契约更锋利，而不是更有仪式感。

## 4. Advanced Type System
这正是 TypeScript 最独特、最强大的部分。高阶使用会涉及泛型、条件类型、分发行为、变型问题、品牌类型，以及在类型层对协议和状态进行建模。

- Generics：
  用于表达输入、输出和容器之间的关系。
- 条件类型与映射类型：
  可以基于结构和约束对类型做变换。
- 可判别联合：
  非常适合建模有限状态机和协议变体。
- 变型与可赋值性：
  在回调密集 API 和可复用库里尤其重要。
- 类型约束与品牌类型：
  约束让泛型保持诚实；品牌类型或 opaque type 则可区分那些结构上相似但语义不同的值。

```typescript
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? { ok: true, value: fn(result.value) } : result;
}
```

在高阶 TypeScript 系统里，类型系统最有价值的地方，是阻止非法状态、改善编辑器引导、让 API 自解释；如果团队开始花比理解程序更多的时间去调类型，那它就已经变得适得其反了。
