---
title: JavaScript Foundations
---

JavaScript is a dynamically typed, prototype-based language that runs across browsers, servers, edge environments, and embedded runtimes. It looks lightweight at first, but real JavaScript programming quickly depends on understanding coercion, object identity, closures, asynchronous behavior, and the differences between language features and host environment APIs.

## 1. Variables & Types
JavaScript variables hold references to values, and the language's type system is dynamic. A variable can refer to values of different types over time, which makes experimentation fast but also increases the importance of disciplined naming and runtime checks.

```javascript
const name = "Ada";
let version = 1;
let isReady = true;
let score = 98.5;
```

- Declaration:
  Modern JavaScript primarily uses `const` and `let`. `const` prevents rebinding, while `let` allows reassignment.
- Legacy declaration:
  `var` still exists, but it is function-scoped and has hoisting behavior that often surprises newer codebases.
- Primitive types:
  Common primitives include `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, and `null`.
- Dynamic typing:
  Types belong to values, not variables. The same variable can later hold a value of a different type.
- Coercion:
  JavaScript performs implicit type conversion in many operators and comparisons, which is powerful but a frequent source of bugs.

```javascript
let value = 42;
value = "forty-two";

console.log(typeof value); // "string"
```

Two core fundamentals matter early:

- Equality rules:
  `===` checks strict equality without coercion; `==` performs coercion and should be used carefully.
- Scope:
  `let` and `const` are block-scoped, while `var` is function-scoped.

```javascript
if (true) {
  const message = "inside";
}

// message is not visible here
```

JavaScript also distinguishes primitives from objects. Objects, arrays, functions, maps, sets, and dates are reference values with mutable behavior.

## 2. Control Flow
JavaScript control flow supports the usual branching and looping constructs, but asynchronous code often changes how developers think about sequencing.

```javascript
const score = 87;
let grade;

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
  `switch` is useful for many-way branching, but its fallthrough behavior must be handled explicitly with `break`.
- Iteration:
  JavaScript supports `for`, `while`, `do...while`, `for...of`, and `for...in`.
- Branch control:
  `break` exits a loop or switch, and `continue` skips to the next iteration.
- Logical operators:
  `&&`, `||`, and `!` short-circuit and return operands, not only booleans.

```javascript
for (const item of [1, 2, 3]) {
  if (item === 2) {
    continue;
  }
  console.log(item);
}
```

Modern JavaScript also uses optional chaining and nullish coalescing in control-heavy code:

```javascript
const city = user?.profile?.city ?? "unknown";
```

These features reduce boilerplate, but they do not replace careful reasoning about missing data and valid defaults.

## 3. Functions
Functions are first-class values in JavaScript. They can be declared, stored, passed around, and returned, and closures make them central to both simple utilities and large application architectures.

```javascript
function greet(name, prefix = "Hello") {
  return `${prefix}, ${name}`;
}

console.log(greet("Lin"));
console.log(greet("Lin", "Hi"));
```

- Definition and invocation:
  Functions can be declared with `function`, function expressions, or arrow functions.
- Parameters:
  JavaScript supports default parameters and rest parameters.
- Return values:
  A function returns a single value, but that value can be an object or array containing multiple results.
- Closures:
  Inner functions can access variables from outer scopes even after the outer function has returned.
- `this` behavior:
  Regular functions and arrow functions differ significantly in how they bind `this`.

```javascript
function makeCounter() {
  let total = 0;

  return function increment() {
    total += 1;
    return total;
  };
}
```

Arrow functions are concise:

```javascript
const double = (value) => value * 2;
```

But they are not just shorter syntax. They also capture `this` lexically, which makes them especially useful inside callbacks and class-related code.

## 4. Data Structures
JavaScript's built-in data structures are flexible and heavily used in application code. Objects and arrays are the default tools, but `Map`, `Set`, and classes matter once data modeling becomes less ad hoc.

- Arrays:
  Ordered, index-based collections with many built-in iteration helpers.
- Objects:
  Property bags commonly used for records and dictionaries.
- Map:
  Key-value storage with arbitrary key types and predictable iteration order.
- Set:
  Collections of unique values.
- Classes:
  Syntactic sugar over JavaScript's prototype system.

```javascript
const numbers = [10, 20, 30];
const first = numbers[0];
const tail = numbers.slice(1);

const user = {
  name: "Ada",
  level: "advanced"
};

const tags = new Set(["javascript", "web", "javascript"]);
```

Objects are extremely common, but some distinctions matter:

- Plain objects vs. `Map`:
  Plain objects are convenient for simple records, while `Map` is often better for dynamic keys and dedicated dictionary behavior.
- Mutation:
  Arrays and objects are mutable by default.
- Spread syntax:
  `...` is commonly used to create shallow copies and merge structures.

```javascript
const updatedUser = { ...user, level: "expert" };
```

Classes also exist for behavior-rich models:

```javascript
class User {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}
```

## 5. Error Handling
JavaScript uses exceptions for synchronous errors and promise rejection for asynchronous failures. In practice, developers need to understand both because application code often mixes sync and async boundaries.

```javascript
function parsePort(raw) {
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
  Handle synchronous exceptions in a controlled block.
- `finally`:
  Runs whether an exception occurs or not, often for cleanup.
- Custom errors:
  Teams often subclass `Error` for domain-specific failures.
- Promise rejection:
  Async failures propagate through `.catch()` or `try` / `catch` around `await`.
- Bubbling:
  Errors usually move upward until a caller handles them or the runtime reports them.

```javascript
class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigError";
  }
}
```

One important distinction is that throwing inside synchronous code and rejecting a promise are related but not identical mechanisms. Error handling becomes much easier when teams standardize how async boundaries report failure.

## 6. Modules & Imports
JavaScript modules organize code into files with explicit exports and imports. Modern JavaScript has standardized ECMAScript Modules, but real-world projects still encounter CommonJS, bundlers, and environment-specific resolution behavior.

```javascript
import { readFile } from "node:fs/promises";
import path from "node:path";

export function getConfigPath(filename) {
  return path.join(process.cwd(), filename);
}
```

- ECMAScript Modules:
  Use `export` and `import` as the standard modern module system.
- CommonJS:
  Older Node.js code often uses `require()` and `module.exports`.
- Standard library vs. external packages:
  Browser JavaScript relies on Web APIs provided by the host, while Node.js includes built-in modules such as `fs`, `path`, and `http`.
- Namespace management:
  Named exports, default exports, and namespace imports each affect how APIs are consumed.
- Package management:
  Tools such as `npm`, `pnpm`, and `yarn` manage dependencies and scripts.

```javascript
export function sum(a, b) {
  return a + b;
}
```

In real projects, modules are also shaped by bundlers, transpilers, and runtime targets. The language feature is standardized, but resolution behavior still depends on the host environment and build setup.
