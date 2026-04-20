---
title: Vue 高阶
---

Vue 的高阶阶段，重点在于如何利用响应式系统、组合式抽象和框架层去构建可预测的系统，同时避免让“方便”演变成隐藏耦合。真正难的通常不是再写一个模板，而是决定状态该放在哪里、副作用该如何协作，以及抽象到底带来了多少真实价值。

## 1. Deep Concurrency
在高阶层面，Vue 的并发不太是 mutex 式并发，而是围绕响应式更新、异步数据和 UI 渲染时序的调度与协调。

- 响应式调度：
  Vue 会批量处理更新和副作用，这提升了性能，但也让时序语义变得重要。
- 异步边界：
  请求、路由变化、懒加载组件和外部事件都可能重叠发生。
- 消息传递：
  Store、事件通道、socket 和服务层常常通过间接方式协调状态变化。
- 竞态条件：
  过时异步响应、重叠路由切换和 watcher 驱动的副作用都可能让原有假设失效。
- Suspense 与异步组件：
  高阶 Vue 应用可能会显式协调多个异步依赖下的加载边界。

```vue
<Suspense>
  <AsyncProfilePanel />
  <template #fallback>
    <p>Loading profile...</p>
  </template>
</Suspense>
```

高阶 Vue 工程实践会把并发视为“围绕响应式和异步所有权的状态协调问题”，而不只是后台网络请求问题。

## 2. Metaprogramming & Reflection
Vue 高度依赖编译期处理、模板转换和由元数据驱动的框架约定。你写下的应用代码，往往只是最终系统的一层表面。

- 模板编译：
  Vue 模板会在运行前被编译成 render function。
- 代码生成：
  路由定义、类型化 API client、GraphQL 产物和自动导入元数据都可能是生成出来的。
- 宏式 API：
  Vue 和生态工具会使用 `defineProps`、`defineEmits` 以及各种框架宏来提供编译期能力。
- 类反射工具链：
  Devtools 和框架内部会检查组件树、props、emits 和响应式状态。
- 静态优化：
  编译器分析可以优化 patching、静态提升和更新路径。

```vue
<script setup lang="ts">
const props = defineProps<{
  userId: string;
}>();
</script>
```

一个很实际的高阶结论是：Vue 代码会被编译器深度塑形。理解它最终生成的心智模型，有助于避免误用各种“看起来很方便”的能力。

## 3. Design Patterns
Vue 会奖励那些让响应式状态保持显式、让组件职责保持狭窄的模式。高阶设计不太是复制经典 OO 模式，而是让所有权和更新流向清晰可见。

- 组合优于继承：
  依然是最基础的原则。
- Composable 与 feature module：
  共享行为通常更适合抽到 composable，而不是做成庞大、难追踪的 mixin 式抽象。
- Reducer 或状态机建模：
  当 UI 状态复杂到不再只是几个布尔值时，这类模式很有价值。
- Store 边界：
  全局状态必须保持有意识设计，而不是变成什么都往里丢的容器。
- Adapter 与 service 层：
  很适合把网络、存储、埋点或第三方 SDK 集成从组件代码中隔离出来。

```ts
function useProfile(userId: Ref<string>) {
  const state = ref<AsyncState<User>>({ status: "loading" });
  return state;
}
```

高阶 Vue 设计通常意味着：控制响应式蔓延。如果一切都能更新一切，框架的便利很快就会变成不可预测性。

## 4. Advanced Type System
Vue 的高级类型工作通常通过 TypeScript 完成。最有价值的使用点集中在 props 契约、emits、composable API、store 和有限 UI 状态建模上。

- 泛型 composable：
  对可复用的数据加载和表单行为非常有用。
- Props 与 emit 类型：
  对组件输入输出做强类型化，可以减少很多集成错误。
- 可判别联合：
  非常适合建模异步 UI 状态和工作流阶段。
- 类型约束：
  在构建可复用 composable 或数据抽象时尤其重要。
- 模板交互：
  Vue 中的类型质量，很大程度上取决于脚本和模板工具链是否保持对齐。

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

在高阶 Vue 系统里，类型系统最有价值的地方，是让组件和 composable 契约更锋利，同时保持响应式意图仍然容易理解；如果类型机制本身比 UI 状态更难推理，那它就开始适得其反了。
