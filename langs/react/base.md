---
title: React Foundations
---

React is a UI library for building component-based interfaces. It is not a programming language in the same sense as JavaScript or Rust, but in frontend engineering it often acts like a primary authoring model because components, props, state, and rendering rules define how applications are structured.

## 1. Variables & Types
React applications are usually written in JavaScript or TypeScript, so the underlying variable and type behavior comes from that host language. What changes in React is how values flow through components, props, state, and hooks.

```tsx
type GreetingProps = {
  name: string;
};

export function Greeting({ name }: GreetingProps) {
  const prefix = "Hello";
  return <h1>{prefix}, {name}</h1>;
}
```

- Declaration:
  Values are declared using normal JavaScript or TypeScript syntax such as `const` and `let`.
- Component-local scope:
  Variables declared inside a component are recreated on every render.
- Props:
  Props are inputs passed from parent components into child components.
- State:
  State is persistent data stored across renders through hooks such as `useState`.
- Type modeling:
  In TypeScript React code, prop and state shapes are often described with interfaces or type aliases.

```tsx
const [count, setCount] = useState(0);
```

Two foundational React ideas matter early:

- Render values vs. persistent state:
  A regular variable inside a component does not persist between renders, but state does.
- Derived values:
  Many values should be computed from props and state directly instead of stored separately.

React code often looks like normal function code, but the lifecycle of values is shaped by the render model, not just the syntax.

## 2. Control Flow
React uses ordinary JavaScript control flow, but the purpose is often to decide what UI should render rather than only what business logic should execute.

```tsx
export function StatusMessage({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <p>Ready</p>;
}
```

- Conditional branching:
  Use `if`, ternaries, logical `&&`, or helper functions to choose UI output.
- Switch and mapping:
  `switch` and object maps are common for rendering based on mode or status.
- Iteration:
  Arrays are commonly rendered with `.map()`.
- Branch control:
  Early returns often produce clearer UI logic than deep nesting.
- Keyed lists:
  Repeated elements need stable `key` values so React can reconcile them correctly.

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

In React, control flow is tightly tied to rendering intent. The main question is usually not "what branch runs?" but "what should the UI tree look like under this state?"

## 3. Functions
Modern React is heavily function-oriented. Function components and hooks are the dominant authoring model, and closures strongly influence how state and event handlers behave.

```tsx
export function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((current) => current + 1);
  }

  return <button onClick={increment}>{count}</button>;
}
```

- Definition and invocation:
  Components are usually functions that React calls during rendering.
- Parameters:
  Component inputs arrive as props.
- Return values:
  Components return React elements, `null`, or renderable fragments.
- Event handlers:
  Functions are passed into JSX props such as `onClick`, `onChange`, or custom callbacks.
- Closures:
  Handlers and effects capture values from the render in which they were created.

```tsx
export function GreetingButton({ name }: { name: string }) {
  const handleClick = () => {
    alert(`Hello, ${name}`);
  };

  return <button onClick={handleClick}>Greet</button>;
}
```

One of the most important beginner-to-intermediate transitions in React is understanding stale closures: a function can capture outdated values if the render and effect model are misunderstood.

## 4. Data Structures
React renders trees of elements, but real applications organize data through arrays, objects, maps, normalized state, and component hierarchies. The key design question is often not only what the data is, but where it should live.

- Arrays:
  Common for rendering lists of UI items.
- Objects:
  Common for props, local state, and configuration.
- Maps and Sets:
  Useful in application logic, though plain objects and arrays remain more common in rendering paths.
- Classes:
  Still supported through class components, but function components dominate new React code.
- Component trees:
  The UI itself is a tree structure composed from nested components.

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

State shape matters:

- Local state:
  Best for UI concerns that belong to one component or subtree.
- Lifted state:
  Shared state may need to move to a common ancestor.
- Derived state:
  If a value can be computed from existing props and state, storing it separately often creates bugs.

React is less about inventing unique data structures and more about placing data in the right ownership layer.

## 5. Error Handling
React uses JavaScript's runtime error model, but UI trees also need rendering-level recovery. This leads to a mix of standard exceptions, promise failures, and React-specific containment patterns.

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
  Normal `try` / `catch` rules still apply in event handlers and imperative logic.
- Async failures:
  Requests, mutations, and data loading still fail through rejected promises or thrown errors.
- Error boundaries:
  React supports boundary components that catch rendering errors in part of the tree.
- Validation vs. crash handling:
  User input should usually be validated before it becomes a thrown error.
- Recovery UI:
  Good React applications often render fallback states rather than only logging failures.

```tsx
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <ProfilePanel />
</ErrorBoundary>
```

React error handling is not only about preventing crashes. It is also about making failure visible to users in a controlled and recoverable way.

## 6. Modules & Imports
React code is usually split into modules containing components, hooks, utilities, styles, and feature-level state. Modern React projects rely heavily on ES modules, build tools, and framework conventions.

```tsx
import { useState } from "react";
import { ProfileCard } from "./profile-card";

export function App() {
  const [count, setCount] = useState(0);
  return <ProfileCard count={count} onIncrement={() => setCount(count + 1)} />;
}
```

- Component modules:
  A file often exports one main component plus related helpers or types.
- Hook modules:
  Custom hooks are commonly placed in separate files for reuse.
- Framework conventions:
  Frameworks such as Next.js or Remix add routing and file-based module behavior on top of React.
- External packages:
  React apps typically depend on state, routing, data-fetching, testing, and styling libraries.
- Build pipelines:
  Bundlers and compilers determine how JSX, modules, and assets are transformed.

```tsx
export function ProfileCard() {
  return <section>Profile</section>;
}
```

In React engineering, module structure is a major part of maintainability. Good boundaries make it clear which components are reusable, which hooks own behavior, and which files are framework-specific entry points.
