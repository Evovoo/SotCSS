---
title: TypeScript Foundations
---

TypeScript is a statically analyzable superset of JavaScript that adds a powerful type system on top of JavaScript's runtime model. It improves tooling, refactoring safety, and API clarity, but it does not replace the fact that the emitted code still runs as JavaScript and inherits JavaScript's runtime behavior.

## 1. Variables & Types
TypeScript variables hold JavaScript values, but the compiler tracks static types to catch mistakes before runtime. The main shift from JavaScript is that values are still dynamic at runtime, while type information is used during development and build steps.

```typescript
const name: string = "Ada";
let version: number = 5.4;
let isReady: boolean = true;
let score = 98.5;
```

- Declaration:
  TypeScript uses JavaScript's `const`, `let`, and legacy `var`, but adds optional type annotations.
- Primitive types:
  Common primitives include `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, and `undefined`.
- Type inference:
  TypeScript often infers types automatically, reducing the need for verbose annotations.
- Explicit typing:
  Annotations are useful at boundaries, public APIs, and places where inference would be too broad.
- Runtime reality:
  Type annotations are erased during compilation and do not exist at runtime unless separate validation is added.

```typescript
let count = 10;
let message: string = "hello";
```

Two important foundational ideas:

- Structural typing:
  TypeScript usually cares about shape rather than nominal identity.
- Literal widening:
  Values such as `"ok"` may widen to `string` unless captured with more specific typing or `as const`.

```typescript
const status = "ok" as const;
```

This mix of inference and explicit annotation is one of TypeScript's biggest strengths, but it only works well when developers understand what the compiler is actually inferring.

## 2. Control Flow
TypeScript uses JavaScript's control-flow constructs, but it adds control-flow-based type narrowing. This means conditions do not just affect execution; they also affect what types the compiler believes are possible.

```typescript
const score = 87;
let grade: string;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "C";
}
```

- Conditional branching:
  Use `if`, `else if`, and `else`.
- Switch:
  `switch` remains useful for many-way branching and discriminated unions.
- Iteration:
  TypeScript supports the same loop forms as JavaScript.
- Branch control:
  `break` and `continue` behave the same as in JavaScript.
- Type narrowing:
  `typeof`, equality checks, `in`, `instanceof`, and custom guards can narrow union types.

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(0));
  }
}
```

Discriminated unions are especially important:

```typescript
type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "failed"; message: string };

function describe(state: State) {
  switch (state.kind) {
    case "idle":
      return "idle";
    case "loading":
      return "loading";
    case "failed":
      return state.message;
  }
}
```

## 3. Functions
Functions in TypeScript are still JavaScript functions at runtime, but TypeScript can precisely model their parameters, return types, overload-like declarations, and generic behavior.

```typescript
function greet(name: string, prefix = "Hello"): string {
  return `${prefix}, ${name}`;
}
```

- Definition and invocation:
  Functions can be declared with `function`, function expressions, arrow functions, and methods.
- Parameters:
  TypeScript supports typed parameters, optional parameters, rest parameters, and default values.
- Return values:
  Return types can be inferred or explicitly annotated.
- Function types:
  Functions themselves can be typed as values.
- Closures:
  Closures behave like JavaScript closures, but captured values may still influence inferred types.

```typescript
function makeCounter() {
  let total = 0;

  return function increment(): number {
    total += 1;
    return total;
  };
}
```

TypeScript also supports generics in functions:

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

Generics are powerful, but should only be introduced when they express a real relationship between inputs and outputs.

## 4. Data Structures
TypeScript uses JavaScript's runtime data structures, but its type system makes their intended shapes and constraints much clearer. Arrays, objects, maps, sets, classes, tuples, and interfaces all matter in everyday code.

- Arrays:
  Typed as `T[]` or `Array<T>`.
- Objects:
  Usually described with object types, interfaces, or type aliases.
- Map and Set:
  Runtime collections with typed keys and values.
- Tuples:
  Fixed-length arrays with positional type meaning.
- Classes and interfaces:
  Classes provide runtime behavior; interfaces exist only at type-check time.

```typescript
const numbers: number[] = [10, 20, 30];
const first = numbers[0];

type User = {
  name: string;
  level: string;
};

const user: User = {
  name: "Ada",
  level: "advanced"
};
```

TypeScript also supports readonly modeling:

```typescript
const point: readonly [number, number] = [10, 20];
```

Some practical distinctions matter:

- Interface vs. type alias:
  They overlap heavily, but have different strengths in extension and composition.
- Optional properties:
  `name?: string` changes how absence must be handled.
- Index signatures and records:
  Useful for dictionary-like objects, but can widen types if used carelessly.

## 5. Error Handling
TypeScript inherits JavaScript's error model. Exceptions are runtime behavior, and the type system does not automatically guarantee what may be thrown.

```typescript
function parsePort(raw: string): number {
  const port = Number(raw);

  if (!Number.isInteger(port)) {
    throw new Error("port must be an integer");
  }

  if (port <= 0 || port > 65535) {
    throw new Error("port out of range");
  }

  return port;
}
```

- `try` / `catch`:
  Works the same as JavaScript.
- `finally`:
  Always runs after the `try` / `catch` path finishes.
- Custom errors:
  Teams often subclass `Error`.
- Async errors:
  Promise rejection and `await`-based failure handling still matter.
- `unknown` in catches:
  Modern TypeScript often treats caught values as `unknown`, which pushes developers to validate before use.

```typescript
class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}
```

One important limitation is that TypeScript's type system does not provide checked exceptions. If a function can fail, teams often communicate that through documentation, naming, `Result`-like types, or conventions rather than the language itself.

## 6. Modules & Imports
TypeScript uses modern JavaScript module syntax, but its real behavior depends on compiler settings, runtime targets, bundlers, and project structure. Understanding module resolution is part of real TypeScript engineering.

```typescript
import path from "node:path";

export function getConfigPath(filename: string): string {
  return path.join(process.cwd(), filename);
}
```

- ECMAScript Modules:
  `import` and `export` are the dominant syntax.
- Type-only imports:
  `import type` helps separate compile-time type usage from runtime imports.
- Standard library vs. external packages:
  TypeScript projects still rely on JavaScript runtimes such as Node.js and browsers for actual APIs.
- Compiler settings:
  `tsconfig.json` controls module resolution, strictness, emit behavior, and path aliases.
- Declaration files:
  `.d.ts` files describe types for libraries and APIs.

```typescript
import type { User } from "./types";
```

TypeScript modules are easy to write and surprisingly easy to misconfigure. Many real-world issues come not from the syntax itself, but from mismatched assumptions between the compiler, bundler, runtime, and package metadata.
