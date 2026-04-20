---
title: React 基础
---

React 是一个用于构建组件化界面的 UI 库。它并不是像 JavaScript 或 Rust 那样的编程语言，但在前端工程里，它经常像一种“主要创作模型”，因为组件、props、state 和渲染规则会直接决定应用如何组织。

## 1. Variables & Types
React 应用通常写在 JavaScript 或 TypeScript 之上，所以底层变量和类型行为来自宿主语言。React 真正改变的是：值如何在组件、props、state 和 hooks 之间流动。

```tsx
type GreetingProps = {
  name: string;
};

export function Greeting({ name }: GreetingProps) {
  const prefix = "Hello";
  return <h1>{prefix}, {name}</h1>;
}
```

- 声明方式：
  值仍然通过普通 JavaScript 或 TypeScript 语法声明，例如 `const` 和 `let`。
- 组件局部作用域：
  在组件函数内部声明的变量，每次渲染都会重新创建。
- Props：
  props 是父组件传给子组件的输入。
- State：
  state 是通过 `useState` 等 hook 保存在多次渲染之间的数据。
- 类型建模：
  在 TypeScript React 代码中，props 和 state 的形状通常用 interface 或 type alias 描述。

```tsx
const [count, setCount] = useState(0);
```

两个非常关键的基础点：

- 渲染期值与持久状态：
  组件内部普通变量不会跨渲染持久存在，但 state 会。
- 派生值：
  很多值应该直接由 props 和 state 计算出来，而不是单独再存一份。

React 代码看起来像普通函数代码，但值的生命周期是由渲染模型决定的，而不只是由语法决定。

## 2. Control Flow
React 使用普通 JavaScript 控制流，但其目的往往是决定“UI 应该渲染成什么”，而不只是决定“哪段业务逻辑执行”。

```tsx
export function StatusMessage({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <p>Ready</p>;
}
```

- 条件分支：
  常用 `if`、三元表达式、逻辑 `&&` 或辅助函数来选择 UI 输出。
- Switch 与映射：
  `switch` 和对象映射常用于根据模式或状态渲染不同界面。
- 迭代：
  数组通常通过 `.map()` 渲染成列表。
- 分支控制：
  在 UI 逻辑中，提前返回通常比深层嵌套更清晰。
- 带 key 的列表：
  重复元素需要稳定的 `key`，这样 React 才能正确做协调更新。

```tsx
export function TodoList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

在 React 中，控制流和渲染意图紧密绑定。核心问题通常不是“哪个分支会执行”，而是“在当前状态下 UI 树应该长什么样”。

## 3. Functions
现代 React 非常强调函数式写法。函数组件和 hooks 是主流创作方式，而闭包会深刻影响 state 和事件处理函数的行为。

```tsx
export function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((current) => current + 1);
  }

  return <button onClick={increment}>{count}</button>;
}
```

- 定义与调用：
  组件通常就是 React 在渲染过程中调用的函数。
- 参数：
  组件输入通过 props 传入。
- 返回值：
  组件返回 React element、`null` 或可渲染片段。
- 事件处理器：
  函数通常作为 `onClick`、`onChange` 或自定义回调传入 JSX。
- 闭包：
  handler 和 effect 会捕获它们创建时那个 render 中的值。

```tsx
export function GreetingButton({ name }: { name: string }) {
  const handleClick = () => {
    alert(`Hello, ${name}`);
  };

  return <button onClick={handleClick}>Greet</button>;
}
```

React 从入门到进阶的一个关键跨越，就是理解 stale closure：如果不理解 render 和 effect 模型，函数就可能捕获过时值。

## 4. Data Structures
React 最终渲染的是元素树，但真实应用中的数据通常通过数组、对象、map、规范化状态和组件层级来组织。关键问题往往不只是“数据长什么样”，而是“它应该存在哪一层”。

- Arrays：
  很常用于渲染列表型 UI。
- Objects：
  常用于 props、局部 state 和配置对象。
- Maps 和 Sets：
  在应用逻辑中有用，但渲染路径里最常见的仍然是普通对象和数组。
- Classes：
  仍然支持 class component，但新的 React 代码以函数组件为主。
- Component trees：
  UI 本身就是由嵌套组件组成的一棵树。

```tsx
type User = {
  id: string;
  name: string;
};

const users: User[] = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Lin" }
];
```

state 的形状很关键：

- 本地状态：
  最适合只属于某个组件或子树的 UI 关注点。
- 状态提升：
  共享状态往往需要上移到公共祖先组件。
- 派生状态：
  如果一个值能由现有 props 和 state 计算出来，额外存一份通常会制造 bug。

React 更少是在“发明独特数据结构”，更多是在“把数据放到正确的所有权层里”。

## 5. Error Handling
React 使用的是 JavaScript 的运行时错误模型，但 UI 树还需要渲染层面的恢复能力。因此真实应用里会同时出现普通异常、Promise 失败和 React 特有的错误隔离模式。

```tsx
function parsePort(raw: string): number {
  const port = Number(raw);

  if (!Number.isInteger(port)) {
    throw new Error("port must be an integer");
  }

  return port;
}
```

- JavaScript 异常：
  在事件处理器和命令式逻辑中，普通 `try` / `catch` 规则依然适用。
- 异步失败：
  请求、提交和数据加载仍会通过 rejected promise 或抛错表达失败。
- Error boundaries：
  React 支持边界组件，用于捕获子树中的渲染错误。
- 校验与崩溃处理：
  用户输入通常应优先做校验，而不是等它变成抛错。
- 恢复性 UI：
  好的 React 应用通常会渲染 fallback，而不只是把错误打进日志。

```tsx
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <ProfilePanel />
</ErrorBoundary>
```

React 的错误处理不只是为了防止崩溃，更是为了让用户以可控、可恢复的方式看到失败。

## 6. Modules & Imports
React 代码通常会拆成组件、hooks、工具函数、样式和特性级状态等多个模块。现代 React 项目高度依赖 ES modules、构建工具和框架约定。

```tsx
import { useState } from "react";
import { ProfileCard } from "./profile-card";

export function App() {
  const [count, setCount] = useState(0);
  return <ProfileCard count={count} onIncrement={() => setCount(count + 1)} />;
}
```

- 组件模块：
  一个文件通常导出一个主组件以及相关 helper 或类型。
- Hook 模块：
  自定义 hook 经常单独放在文件中以便复用。
- 框架约定：
  Next.js、Remix 等框架会在 React 之上增加路由和文件级模块语义。
- 外部包：
  React 应用通常依赖状态管理、路由、数据获取、测试和样式库。
- 构建流水线：
  bundler 和 compiler 决定 JSX、模块和静态资源如何被转换。

```tsx
export function ProfileCard() {
  return <section>Profile</section>;
}
```

在 React 工程里，模块结构本身就是可维护性的核心部分。好的边界会清楚地区分哪些组件可复用、哪些 hook 拥有行为、哪些文件只是框架入口。
