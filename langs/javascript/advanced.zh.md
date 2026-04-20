---
title: JavaScript 高阶
---

JavaScript 的高阶阶段，不只是“会用动态特性”，而是要学会控制这种动态性。它既可以支持优雅抽象，也可以制造混乱系统，关键差别通常来自团队对并发、元编程、架构边界和类型边界的把握。

## 1. Deep Concurrency
在高阶层面，JavaScript 并发不再只是“知道 Promise 怎么写”，而是要设计在异步任务重叠、共享资源竞争和取消压力下依然正确的系统。

- 消息传递：
  Worker、broadcast channel 和进程边界，往往比共享可变状态更安全。
- 原子操作：
  `SharedArrayBuffer` 和 `Atomics` 可以支持共享内存，但只有在性能收益真实存在且不变量足够清晰时才值得使用。
- 死锁与饥饿：
  JavaScript 避开了很多经典锁死锁问题，但事件循环饥饿、worker 阻塞和永远不 resolve 的 promise 会带来另一类故障。
- 调度顺序：
  微任务、定时器、渲染步骤和宿主回调都会影响实际可观察到的执行顺序。
- Actor 风格设计：
  许多稳健的 JavaScript 系统会通过队列、worker 或服务边界隔离状态，而不是允许任意跨组件修改。

```javascript
const channel = new MessageChannel();

channel.port1.onmessage = (event) => {
  console.log("received", event.data);
};

channel.port2.postMessage({ type: "ping" });
```

高阶 JavaScript 工程实践还会非常关注取消传播、可重试操作的幂等性设计，以及未决 promise 或被闭包长期持有状态导致的内存增长。

## 2. Metaprogramming & Reflection
JavaScript 高度动态，很多高阶代码库会利用这种灵活性优化工具链、API 易用性和运行时适配能力。但危险在于，反射能力很容易把清晰性吞掉。

- 反射：
  `Object.keys`、`Object.getOwnPropertyDescriptors`、`Reflect` 和原型检查都能做运行时自省。
- Proxy：
  `Proxy` 可以拦截属性读取、赋值、函数调用等行为。
- Decorators 与注解：
  具体能力取决于语言阶段和工具链，但装饰器通常用于附加元数据或改变类相关行为。
- 代码生成：
  构建期生成、AST 变换和模板输出在现代 JavaScript 工具链中非常常见。
- 动态属性定义：
  `Object.defineProperty` 等 API 在框架内部和库设计中仍然很重要。

```javascript
const traced = new Proxy(
  {
    multiply(a, b) {
      return a * b;
    }
  },
  {
    get(target, prop, receiver) {
      console.log("accessing", prop);
      return Reflect.get(target, prop, receiver);
    }
  }
);
```

元编程最有价值的场景，是减少重复样板代码而不隐藏控制流。一旦代码库里到处都是“看不见的行为”，调试成本就会迅速上升。

## 3. Design Patterns
JavaScript 当然支持经典设计模式，但它的动态对象模型和函数式风格，会改变这些模式最自然的表达方式。

- SOLID 原则：
  依然有价值，尤其是在接口边界、状态所有权和依赖方向上。
- 创建型模式：
  工厂函数通常比深层类层级更简单。
- 结构型模式：
  适配器、外观和装饰器在 API 边界与 UI 组合边界很常见。
- 行为型模式：
  观察者、策略、命令和事件驱动模式都很容易映射到回调、事件发射器和消息总线。
- 依赖注入：
  可以通过普通参数、模块组合或框架容器实现，取决于系统复杂度。

```javascript
function createSerializer(format) {
  if (format === "json") {
    return {
      dump(value) {
        return JSON.stringify(value);
      }
    };
  }

  throw new Error("unsupported format");
}
```

JavaScript 的高阶设计通常意味着缩小可变范围、显式暴露副作用，并避免让模块退化成隐藏的全局状态容器。

## 4. Advanced Type System
JavaScript 本身是动态类型语言，但高阶团队依然会通过运行时校验、文档纪律，以及通常借助 TypeScript 或 JSDoc 工具链来系统地思考类型问题。

- 运行时类型守卫：
  在网络输入、存储边界和插件系统这类信任边界上，JavaScript 往往需要显式检查。
- 结构化类型思维：
  对象通常按“形状”消费，而不是按名义身份消费，这会影响 API 设计。
- 借助工具的泛型：
  纯 JavaScript 没有真正的泛型，但 TypeScript 和 JSDoc 工具能在开发阶段提供参数化抽象。
- 类联合建模：
  带标签的对象变体很常用于状态机和协议消息。
- 类型约束：
  在纯 JavaScript 里，约束通常通过校验库、断言和测试来保证，而不是由语言运行时直接提供。

```javascript
function isUser(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.score === "number"
  );
}
```

在高阶 JavaScript 系统中，真正目标不是假装这门语言是静态类型的，而是在边界放上足够强的校验和足够清晰的契约，让动态灵活性保持可控，而不是演变成混乱。
