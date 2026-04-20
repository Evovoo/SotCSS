---
title: React Native 基础
---

React Native 是一个用 React 思想和 JavaScript 或 TypeScript 来构建移动应用的框架。它本身不是一门编程语言，但在实际开发中，它定义了一套主要应用模型：围绕组件、props、state、平台 API，以及 JavaScript 与原生移动平台之间的桥接或原生接口层来组织应用。

## 1. Variables & Types
React Native 代码运行在 JavaScript 或 TypeScript 之上，因此底层变量和类型系统仍来自宿主语言。React Native 真正改变的是：值如何参与组件渲染、hooks、样式对象、导航参数和原生模块边界。

```tsx
type GreetingProps = {
  name: string;
};

export function Greeting({ name }: GreetingProps) {
  const prefix = "Hello";
  return <Text>{prefix}, {name}</Text>;
}
```

- 声明方式：
  值仍然通过普通 JavaScript 或 TypeScript 语法声明，例如 `const`、`let` 和带类型的 props。
- 组件局部作用域：
  函数组件内部的变量会在每次 render 时重新创建。
- Props：
  props 用于把输入数据从父组件传递给子组件。
- State：
  state 通过 `useState` 等 hook 在多次渲染之间持久存在。
- 平台相关值：
  某些值会因平台不同而变化，例如布局假设、屏幕指标和原生能力开关。

```tsx
const [count, setCount] = useState(0);
```

两个基础点很关键：

- 渲染期值与持久状态：
  组件内部普通变量不会跨 rerender 保留，但 state 会。
- 宿主环境现实：
  类型信息可以帮助开发，但真实运行时行为仍由 JavaScript 加上原生移动环境共同决定。

React Native 代码看起来和 React Web 很像，但它渲染的目标是原生 UI 组件，而不是浏览器 DOM 节点。

## 2. Control Flow
React Native 使用普通 JavaScript 控制流，但这些控制流通常服务于移动页面渲染、导航流程切换和异步状态驱动的界面变化。

```tsx
export function StatusMessage({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Text>Ready</Text>;
}
```

- 条件分支：
  常用 `if`、三元表达式、逻辑 `&&` 和辅助函数来决定页面渲染什么内容。
- Switch 与状态映射：
  多模式页面逻辑常常适合用 `switch` 或显式状态映射表达。
- 迭代：
  集合常通过 `.map()` 或虚拟化列表组件来渲染。
- 分支控制：
  提前返回通常比嵌套 JSX 更清晰。
- 列表与 key：
  重复项需要稳定 key，这对正确协调更新和列表性能都很重要。

```tsx
export function TodoList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <Text key={item}>{item}</Text>
      ))}
    </View>
  );
}
```

在移动端界面里，控制流还经常影响空状态、离线状态、权限弹窗和导航切换，而不只是简单视觉分支。

## 3. Functions
现代 React Native 和现代 React 一样，非常强调函数式写法。组件、hooks、回调和闭包是页面与交互实现的核心。

```tsx
export function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((current) => current + 1);
  }

  return <Button title={`${count}`} onPress={increment} />;
}
```

- 定义与调用：
  组件通常就是由 React Native 渲染系统调用的函数。
- 参数：
  组件接收 props，回调则常接收事件对象或导航数据。
- 返回值：
  组件返回 `View`、`Text`、`Image` 或自定义组件等 React Native 元素。
- 事件处理器：
  函数常作为 `onPress`、`onChangeText` 或手势回调传入。
- 闭包：
  回调会捕获它们创建时那次 render 中的值。

```tsx
export function GreetingButton({ name }: { name: string }) {
  const handlePress = () => {
    Alert.alert("Greeting", `Hello, ${name}`);
  };

  return <Button title="Greet" onPress={handlePress} />;
}
```

一旦 effect、定时器、手势或导航回调开始和不断变化的状态交互，理解闭包行为就会变得非常重要。

## 4. Data Structures
React Native 使用的仍然是 JavaScript 或 TypeScript 的运行时数据结构，但实践重点在于应用数据如何映射到组件树、列表、表单、缓存和移动端特有状态上。

- Arrays：
  很常用于渲染列表项和页面分区。
- Objects：
  常用于 props、state、样式对象和 API 载荷。
- Maps 和 Sets：
  在应用逻辑中有用，但渲染路径里仍然是数组和普通对象更常见。
- Classes：
  class component 仍然存在，但新的 React Native 代码以函数组件为主。
- Component trees：
  移动 UI 由 `View`、`Text`、`Pressable` 和业务组件等嵌套组成一棵树。

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

几个移动端场景下尤其重要的数据形状问题：

- 本地 UI 状态：
  适合底部弹层是否打开、输入框文本等短生命周期状态。
- 远程服务端状态：
  通常应与 UI state 分开管理，因为加载、缓存和失效有不同生命周期。
- 大列表：
  移动端性能经常依赖列表虚拟化，而不是简单地把数组全部直接渲染出来。

React Native 的数据建模重点，不在于发明新结构，而在于把所有权、持久性和渲染成本放对地方。

## 5. Error Handling
React Native 继承的是 JavaScript 错误模型，但移动应用还必须考虑用户可见 fallback、原生错误以及崩溃上报链路。

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
  在命令式逻辑和事件处理器中，普通 `try` / `catch` 规则依然有效。
- Promise 失败：
  AsyncStorage、网络请求和原生调用都可能通过 rejected promise 失败。
- Error boundaries：
  React 风格错误边界可用于隔离 UI 子树中的渲染失败。
- 原生错误：
  有些失败来自平台 API 或原生模块，而不是纯 JavaScript。
- 恢复性体验：
  好的移动应用会通过重试态、离线态和安全 fallback 向用户暴露失败，而不是只写日志。

```tsx
<ErrorBoundary fallback={<Text>Something went wrong.</Text>}>
  <ProfileScreen />
</ErrorBoundary>
```

在移动端，错误处理和产品体验紧密绑定，因为用户可能处于弱网、应用后台切换或设备平台特性差异的环境中。

## 6. Modules & Imports
React Native 项目通常通过模块来组织页面、组件、hooks、服务层、导航定义、样式和原生集成。现代项目使用 ES modules，并高度依赖工具链。

```tsx
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { ProfileCard } from "./profile-card";

export function App() {
  const [count, setCount] = useState(0);
  return (
    <View>
      <ProfileCard count={count} onIncrement={() => setCount(count + 1)} />
      <Text>{count}</Text>
    </View>
  );
}
```

- 组件模块：
  一个文件常导出一个主组件以及相关 helper 和类型。
- Hook 模块：
  共享行为通常会提取到自定义 hook 中。
- 导航模块：
  移动应用通常会专门拆出 stack、tab、linking 和 route type 文件。
- 原生集成模块：
  一些模块会包装权限、传感器、相机、存储等原生能力。
- 构建与打包流水线：
  Metro、Expo 工具或自定义原生构建系统会决定模块如何解析与转换。

```tsx
export function ProfileCard() {
  return <View><Text>Profile</Text></View>;
}
```

在 React Native 工程里，模块组织对可维护性非常关键，因为页面、hooks、状态和平台集成代码一旦边界不清，很容易迅速耦合在一起。
