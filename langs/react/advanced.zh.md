---
title: React 高阶
---

React 的高阶阶段，重点在于围绕渲染、身份稳定性和状态所有权去设计可预测的 UI 系统。真正难的部分通常不是 JSX 语法，而是理解数据该放在哪、工作该在何时发生，以及 React 抽象在规模化场景下如何与浏览器和框架现实交互。

## 1. Deep Concurrency
在高阶层面，React 的并发更像是 UI 工作的调度、打断和优先级管理，而不是经典意义上的 mutex 式并发。

- 渲染优先级：
  有些更新是紧急的，有些则可以延后。
- Transitions：
  React 允许非紧急工作为更重要的交互让路。
- Suspense：
  Suspense 用于协调异步依赖下的加载边界和 fallback 渲染。
- Streaming 与 selective hydration：
  在服务端渲染环境中，React 可以渐进式展示内容，并在不同时间点为不同区域完成 hydration。
- 状态竞态：
  即使没有共享内存线程，过时 effect、请求乱序和身份抖动仍然会带来正确性问题。

```tsx
startTransition(() => {
  setSearchQuery(nextQuery);
});
```

高阶 React 工程实践会把并发视为“用户体验调度问题 + 异步边界正确性问题”，而不是仅仅把某些 API 点缀进组件里。

## 2. Metaprogramming & Reflection
React 本身相对声明式，但围绕它的高级生态大量使用代码生成、编译期变换和元数据驱动约定。

- JSX transform：
  JSX 不会被浏览器直接解释，而是会被编译成函数调用或运行时指令。
- 构建期代码生成：
  路由清单、GraphQL 产物、类型化客户端和设计系统 token 都很常见。
- 组件反射：
  React 不提供广泛的组件内部运行时反射，但 devtools 和框架层会检查树结构和元数据。
- 类装饰器式元数据模式：
  一些生态会通过编译期或框架约定，在 React 周围附加路由、校验或类似 DI 的行为。
- 编译器辅助优化：
  现代 React 工具链越来越依赖静态分析来做性能优化和正确性提示。

```tsx
// JSX
<ProfileCard name="Ada" />
```

一个很实际的高阶结论是：React 代码往往只是表层。真正上线的产物会深受 compiler、bundler、框架 transform 和静态分析影响。

## 3. Design Patterns
React 会奖励某些架构模式，也会惩罚某些模式。高阶设计不太是复制经典 OO 模式，而是把状态、组合关系和更新边界塑造好。

- 组合优于继承：
  这是 React 的基础原则，在大型项目中依然成立。
- 容器与展示边界：
  即便表达方式与旧教程不同，把数据编排和展示组件区分开依然有价值。
- Render props、hooks 与 headless components：
  它们都是在不锁死 UI 输出的前提下复用行为的不同策略。
- Reducer 与状态机模式：
  当状态迁移变复杂时非常有价值。
- 事件驱动与 store 型设计：
  在存在跨切面状态问题的大型应用里很重要。

```tsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  return {
    count,
    increment: () => setCount((value) => value + 1)
  };
}
```

高阶 React 设计通常意味着：减少隐藏耦合、限制 rerender 范围，并选择那些能让所有权清晰可见的抽象，而不只是“可复用”的抽象。

## 4. Advanced Type System
React 的高级类型工作通常通过 TypeScript 完成。类型系统最有价值的使用点，集中在组件契约、多态 API、reducer action 和 UI 状态建模上。

- 泛型组件：
  对可复用表格、表单字段和数据驱动抽象很有用。
- 可判别联合：
  非常适合建模异步 UI 状态和 reducer action。
- 多态 props：
  一些高级组件库会提供 `as` prop 或 slot 模式，并保持较强类型安全。
- 类型约束：
  在构建可复用 hook 或组件 API 时尤其重要。
- 事件与 ref 类型：
  React 的真实类型安全，经常依赖事件、元素和 ref 之间关系是否描述准确。

```tsx
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

在高阶 React 系统里，类型系统最有价值的地方，是让 UI 契约更锋利、阻止不可能状态；如果组件 API 变得比原本的 UI 问题还难使用，那它就已经开始适得其反了。
