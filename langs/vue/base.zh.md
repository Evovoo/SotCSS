---
title: Vue 基础
---

Vue 是一个以声明式模板、响应式状态和组件化组合为核心的渐进式 UI 框架。它并不是像 JavaScript 或 Rust 那样的编程语言，但在实际开发中，它经常像一种主要创作模型，因为组件、响应式系统、模板和框架约定会直接影响应用的组织方式。

## 1. Variables & Types
Vue 应用通常写在 JavaScript 或 TypeScript 之上，因此底层变量和类型行为仍来自宿主语言。Vue 额外增加的是响应式层，它会改变值如何被追踪、更新，并如何在模板、computed、watch 和组件状态中被消费。

```vue
<script setup lang="ts">
const name = "Ada";
const count = ref(0);
</script>

<template>
  <h1>Hello, {{ name }}</h1>
  <p>{{ count }}</p>
</template>
```

- 声明方式：
  值仍然通过普通 JavaScript 或 TypeScript 语法在组件脚本中声明。
- 响应式状态：
  Vue 通过 `ref()`、`reactive()` 等工具创建可追踪状态。
- 组件局部作用域：
  在组件内部声明的值属于该组件实例及其渲染周期。
- Props：
  父组件通过 props 向子组件传递输入。
- 类型建模：
  在 TypeScript Vue 项目里，props 和 state 形状都可以显式建模，以获得更强的编辑器和编译器支持。

```ts
const count = ref(0);
const user = reactive({
  name: "Ada",
  level: "advanced"
});
```

两个基础点很关键：

- 响应式包装：
  `ref` 用于保存被追踪的单值，`reactive` 用于追踪对象及其嵌套属性访问和更新。
- 模板访问：
  模板里可以直接使用响应式值，而在脚本里有些场景则需要通过 `.value` 访问。

Vue 代码看起来像普通 JavaScript，但响应式系统会改变值参与渲染的方式。

## 2. Control Flow
Vue 在脚本中使用 JavaScript 控制流，在模板中则通过指令表达控制流。最关键的问题通常是：状态应该如何决定最终渲染出来的 UI 树。

```vue
<template>
  <p v-if="isLoading">Loading...</p>
  <p v-else>Ready</p>
</template>
```

- 条件分支：
  Vue 模板常用 `v-if`、`v-else-if`、`v-else`。
- 列表渲染：
  `v-for` 用于根据数组或可迭代数据渲染重复 UI。
- 事件驱动控制：
  用户交互通常通过 `@click`、`@input` 等指令驱动状态变化。
- 脚本中的提前分支：
  computed 和辅助函数常用于缩小模板里的逻辑体积，让模板更清晰。
- 稳定 key：
  用 `v-for` 渲染列表时，需要稳定的 `:key`，这样 Vue 才能正确打补丁更新。

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

Vue 的控制流在模板中往往更偏声明式，但底层目标没有变：把渲染状态转换写得明确且可预测。

## 3. Functions
现代 Vue 开发，尤其是 Composition API 体系，非常依赖函数。组件、composable、事件处理器、computed getter 和 watcher 都建立在普通 JavaScript 函数之上。

```vue
<script setup lang="ts">
const count = ref(0);

function increment() {
  count.value += 1;
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

- 定义与调用：
  函数可以在组件脚本中声明，并在模板或生命周期逻辑中使用。
- 事件处理器：
  函数常通过 `@click` 等指令绑定到交互事件上。
- Composables：
  可复用的有状态行为通常抽到普通函数中，并在其中使用 Vue 的响应式 API。
- 闭包：
  函数仍然会捕获词法作用域中的值，这对异步逻辑和 watcher 尤其重要。
- 返回值：
  组合式函数常返回包含状态、动作和派生值的对象。

```ts
function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value += 1;
  }

  return { count, increment };
}
```

Vue 从入门走向进阶的一个关键跨越，就是学会把面向渲染的函数和封装可复用状态逻辑的 composable 区分开。

## 4. Data Structures
Vue 使用的仍然是标准 JavaScript 运行时数据结构，但实践中最关键的问题，是这些结构如何和响应式系统以及组件所有权互动。

- Arrays：
  很常用于列表渲染和重复 UI。
- Objects：
  常用于 state、props、配置和 API 数据。
- Maps 和 Sets：
  在应用逻辑中可用，但在模板路径里通常仍是数组和普通对象更自然。
- Classes：
  JavaScript 或 TypeScript 当然支持类，但 Vue 最常见的模式仍是对象和函数导向。
- Component trees：
  UI 本身由嵌套 Vue 组件构成一棵树。

```ts
const users = ref([
  { id: "1", name: "Ada" },
  { id: "2", name: "Lin" }
]);
```

几个在 Vue 中特别重要的数据形状问题：

- 本地组件状态：
  最适合由单个组件或子树拥有的 UI 关注点。
- 共享状态：
  全局或 feature 级状态通常更适合放进 Pinia 这类 store。
- 派生状态：
  如果一个值能从已有响应式状态计算出来，它通常更适合放进 `computed()`，而不是额外存储一份。

Vue 的数据建模重点，不在于创造新结构，而在于把响应式所有权边界划清楚。

## 5. Error Handling
Vue 继承的是 JavaScript 错误模型，但 UI 框架还需要处理组件级恢复和开发者诊断问题。因此真实应用中会同时出现普通抛错、异步失败和框架级错误处理行为。

```ts
function parsePort(raw: string): number {
  const port = Number(raw);

  if (!Number.isInteger(port)) {
    throw new Error("port must be an integer");
  }

  return port;
}
```

- JavaScript 异常：
  在命令式逻辑中，普通 `try` / `catch` 规则依然适用。
- 异步失败：
  API 请求、表单提交和初始化任务都可能通过 rejected promise 失败。
- 组件边界：
  Vue 支持错误处理 hook 和应用级错误处理器。
- 校验：
  对用户输入做验证通常优于让非法输入直接演变成原始异常。
- Fallback UI：
  好的 Vue 应用会有意设计空态、加载态和失败态。

```ts
app.config.errorHandler = (error, instance, info) => {
  console.error("Vue error", error, info);
};
```

Vue 的错误处理不只是为了捕捉技术异常，更是为了在失败发生时仍保持界面稳定、可理解。

## 6. Modules & Imports
Vue 项目通常围绕单文件组件、composable、store、工具函数、路由和特性模块来组织。现代 Vue 工程高度依赖 ES modules 和构建流水线。

```vue
<script setup lang="ts">
import { ref } from "vue";
import ProfileCard from "./ProfileCard.vue";

const count = ref(0);
</script>

<template>
  <ProfileCard :count="count" />
</template>
```

- 单文件组件：
  Vue 常用 `.vue` 文件把模板、脚本和样式放在一起。
- Composable 模块：
  共享行为通常抽成 `useProfile()`、`useCounter()` 这类可复用函数。
- Store 模块：
  共享应用状态可放在 store 定义中。
- 框架约定：
  Nuxt 等框架会在 Vue 之上增加路由、服务端能力和文件级约定。
- 构建工具：
  Vite 和 Vue 编译插件会负责模板、脚本和样式的转换。

```vue
<script setup lang="ts">
export interface User {
  id: string;
  name: string;
}
</script>
```

在 Vue 工程里，模块结构本身就是可维护性的关键，因为模板、状态、副作用和路由代码否则很容易混成一团。
