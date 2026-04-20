---
title: React Native 高阶
---

React Native 的高阶阶段，重点在于如何跨越 JavaScript、React 渲染层和原生平台边界，设计出仍然可预测的移动系统。真正难的通常不是再写一个组件，而是协调状态、性能、平台行为和交付约束，同时不失去架构控制力。

## 1. Deep Concurrency
在高阶层面，React Native 的并发不太是应用代码中的经典共享内存并发，但它仍然深受调度、原生交互、动画时序和异步平台工作的影响。

- 渲染优先级：
  有些 UI 更新是紧急的，有些则可以延后或 transition。
- JavaScript 与原生执行层：
  工作可能分布在不同层上，跨层边界的成本很重要。
- 消息传递：
  原生模块、事件发射器、手势系统和动画系统常常通过异步消息协作。
- 帧预算：
  移动 UI 的正确性不仅包括逻辑正确，还包括足够流畅的渲染。
- 竞态条件：
  导航变化、后台生命周期事件、权限响应和异步请求会非常快地使原有假设失效。

```tsx
startTransition(() => {
  setFilter(nextFilter);
});
```

高阶 React Native 工程实践会从响应性、取消传播、背压以及桥接或原生接口成本的角度思考，而不只是看“这个 promise 最后有没有 resolve”。

## 2. Metaprogramming & Reflection
React Native 高度依赖应用代码之外的构建工具、bundle、代码变换和配置层。

- JSX transform：
  JSX 和 React Web 一样，会在运行前被编译。
- 代码生成：
  路由类型、API client、GraphQL 产物、schema 绑定以及原生接口生成，都可能是构建流程的一部分。
- 原生元数据与配置：
  app manifest、权限声明、Expo config plugin 和平台构建文件都会直接影响运行时行为。
- 类反射工具链：
  即便应用代码本身较声明式，devtools 和框架层依然会检查组件树和模块元数据。
- 静态优化：
  现代工具链越来越依赖静态分析来决定 bundling、tree shaking 和代码分片行为。

```tsx
// JSX
<ProfileScreen userId="42" />
```

一个很实际的高阶结论是：React Native 应用从来不只是组件代码本身。真正上线的产物会被 Metro、Babel、Expo 或原生构建工具、资源流水线和平台配置文件共同塑造。

## 3. Design Patterns
React Native 会奖励那些能把 UI、状态和平台集成适度分离的架构模式，使它们能够独立演进。

- 组合优于继承：
  依然是移动组件系统里的核心原则。
- Screen 与 feature 边界：
  大型应用通常需要把导航层 screen 和可复用 feature module 区分开。
- Hooks 与 headless logic：
  共享行为通常更适合抽到 hook，而不是堆叠很多视觉包装组件。
- Reducer 与状态机模式：
  当手势流程、异步请求和导航状态交织时非常有价值。
- Service 与 adapter 层：
  非常适合隔离网络请求、存储、埋点、通知和原生能力，让 UI 代码不被平台细节淹没。

```tsx
function useProfile(userId: string) {
  const [state, setState] = useState<AsyncState<User>>({ status: "loading" });
  return state;
}
```

高阶 React Native 设计通常意味着：显式控制平台耦合，让页面保持可理解，同时不让原生集成细节泄漏到所有地方。

## 4. Advanced Type System
React Native 的高级类型工作通常通过 TypeScript 完成。最有价值的使用点集中在导航契约、平台特定 props、异步 UI 状态、原生模块接口以及可复用组件 API 上。

- 泛型组件：
  对可复用列表、表单和特性抽象很有用。
- 可判别联合：
  非常适合建模异步状态和权限驱动的 UI 状态。
- 导航类型：
  route param 类型和嵌套 navigator 契约可以消除很多集成错误。
- 平台约束：
  一些 API 只在特定平台可用，类型可以帮助表达这些边界。
- 原生接口类型化：
  对原生模块做带类型的包装，可以让桥接边界更安全。

```tsx
type PermissionState =
  | { status: "unknown" }
  | { status: "granted" }
  | { status: "denied"; canAskAgain: boolean };
```

在高阶 React Native 系统里，类型系统最有价值的地方，是让跨页面、跨层和跨平台契约变得清晰可见；如果组件和导航 API 比它们想表达的移动行为还更难使用，那它就开始适得其反了。
