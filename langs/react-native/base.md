---
title: React Native Foundations
---

React Native is a framework for building mobile applications with React concepts and JavaScript or TypeScript. It is not a programming language by itself, but in practice it defines a primary application model built around components, props, state, platform APIs, and a bridge or native interface layer between JavaScript and mobile platforms.

## 1. Variables & Types
React Native code runs on JavaScript or TypeScript, so the underlying variable and type system comes from that host language. What changes in React Native is how values participate in renders, hooks, style objects, navigation params, and native module boundaries.

```tsx
type GreetingProps = {
  name: string;
};

export function Greeting({ name }: GreetingProps) {
  const prefix = "Hello";
  return <Text>{prefix}, {name}</Text>;
}
```

- Declaration:
  Values are declared using normal JavaScript or TypeScript syntax such as `const`, `let`, and typed props.
- Component-local scope:
  Variables inside a function component are recreated on each render.
- Props:
  Props pass input data from parent components into child components.
- State:
  State persists across renders through hooks such as `useState`.
- Platform-aware values:
  Some values differ by platform, such as layout assumptions, screen metrics, and native capability flags.

```tsx
const [count, setCount] = useState(0);
```

Two foundational ideas matter early:

- Render-time values vs. persistent state:
  A local variable inside a component does not survive rerenders, but state does.
- Host environment reality:
  Type information may help during development, but actual runtime behavior still depends on JavaScript plus the native mobile environment.

React Native code often looks similar to React for the web, but the rendering target is native UI primitives rather than browser DOM nodes.

## 2. Control Flow
React Native uses ordinary JavaScript control flow, but it is usually applied to rendering mobile screens, controlling navigation flow, and managing asynchronous state-driven UI changes.

```tsx
export function StatusMessage({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Text>Ready</Text>;
}
```

- Conditional branching:
  Use `if`, ternaries, logical `&&`, and helper functions to choose what screen content should render.
- Switch and state mapping:
  Multi-mode screen logic often benefits from `switch` or explicit state maps.
- Iteration:
  Collections are commonly rendered through `.map()` or virtualized list components.
- Branch control:
  Early returns usually keep component code clearer than nested JSX.
- Lists and keys:
  Repeated items need stable keys for correct reconciliation and list performance.

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

In mobile interfaces, control flow also affects empty states, offline states, permission prompts, and navigation transitions, not only simple visual branching.

## 3. Functions
Modern React Native is function-oriented, just like modern React. Components, hooks, callbacks, and closures are central to how screens and interactions are implemented.

```tsx
export function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((current) => current + 1);
  }

  return <Button title={`${count}`} onPress={increment} />;
}
```

- Definition and invocation:
  Components are usually functions called by React Native's rendering system.
- Parameters:
  Components receive props, and callbacks often receive event objects or navigation data.
- Return values:
  Components return React Native elements such as `View`, `Text`, `Image`, or custom components.
- Event handlers:
  Functions are passed to props such as `onPress`, `onChangeText`, and gesture callbacks.
- Closures:
  Callbacks capture values from the render in which they were created.

```tsx
export function GreetingButton({ name }: { name: string }) {
  const handlePress = () => {
    Alert.alert("Greeting", `Hello, ${name}`);
  };

  return <Button title="Greet" onPress={handlePress} />;
}
```

Understanding closure behavior is especially important once effects, timers, gestures, or navigation callbacks start interacting with evolving component state.

## 4. Data Structures
React Native uses the same runtime data structures as JavaScript or TypeScript, but the practical focus is on how application data maps onto component trees, lists, forms, caches, and mobile-specific state.

- Arrays:
  Common for rendering lists of items and screen sections.
- Objects:
  Common for props, state, style objects, and API payloads.
- Maps and Sets:
  Useful in application logic, though less common in render paths than arrays and plain objects.
- Classes:
  Class components still exist, but function components dominate new React Native code.
- Component trees:
  Mobile UI is composed from nested components such as `View`, `Text`, `Pressable`, and feature-specific components.

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

Some data-shape concerns are especially important in mobile apps:

- Local UI state:
  Useful for ephemeral screen concerns such as sheet visibility or text input state.
- Remote server state:
  Often managed separately from UI state because loading, caching, and invalidation have different lifecycles.
- Large lists:
  Mobile performance often depends on list virtualization rather than naive array rendering.

React Native data modeling is less about novel structures and more about assigning ownership, persistence, and rendering cost correctly.

## 5. Error Handling
React Native inherits JavaScript's error model, but mobile applications also need to consider user-facing fallback UI, native errors, and crash reporting pipelines.

```tsx
function parsePort(raw: string): number {
  const port = Number(raw);

  if (!Number.isInteger(port)) {
    throw new Error("port must be an integer");
  }

  return port;
}
```

- JavaScript exceptions:
  Standard `try` / `catch` rules still apply in imperative logic and event handlers.
- Promise failures:
  Async storage, network requests, and native calls may fail through rejected promises.
- Error boundaries:
  React-style error boundaries can contain rendering failures in parts of the UI tree.
- Native errors:
  Some failures come from platform APIs or native modules rather than plain JavaScript.
- Recovery UX:
  Good mobile apps surface failure through retry states, offline states, and safe fallbacks rather than silent logs only.

```tsx
<ErrorBoundary fallback={<Text>Something went wrong.</Text>}>
  <ProfileScreen />
</ErrorBoundary>
```

On mobile, error handling is closely tied to product experience because users may be on unreliable networks, backgrounded apps, or devices with platform-specific quirks.

## 6. Modules & Imports
React Native projects are organized through modules that contain screens, components, hooks, services, navigation definitions, styles, and native integrations. Modern projects use ES module syntax and depend heavily on tooling.

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

- Component modules:
  Files often export one primary component plus related helpers and types.
- Hook modules:
  Shared behavior is commonly extracted into custom hooks.
- Navigation modules:
  Mobile apps often dedicate files to stacks, tabs, linking, and route types.
- Native integration modules:
  Some modules wrap permissions, sensors, camera access, storage, or other native capabilities.
- Build and bundling pipeline:
  Metro, Expo tooling, or custom native build systems shape how modules are resolved and transformed.

```tsx
export function ProfileCard() {
  return <View><Text>Profile</Text></View>;
}
```

In React Native engineering, module organization is a major factor in maintainability because screens, hooks, state, and platform integration code can become tightly entangled if boundaries are unclear.
