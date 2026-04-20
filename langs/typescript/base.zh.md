---
title: TypeScript 基础
---

TypeScript 是 JavaScript 的一个可静态分析超集，它在 JavaScript 运行时模型之上增加了强大的类型系统。它提升了工具体验、重构安全性和 API 清晰度，但不会改变一个根本事实：最终运行的仍然是 JavaScript，运行时行为也仍然继承自 JavaScript。

## 1. Variables & Types
TypeScript 变量在运行时保存的仍然是 JavaScript 值，但编译器会追踪静态类型，以便在运行前发现错误。和 JavaScript 的关键区别是：值在运行时依然动态，而类型信息主要服务于开发和构建阶段。

```typescript
const name: string = "Ada";
let version: number = 5.4;
let isReady: boolean = true;
let score = 98.5;
```

- 声明方式：
  TypeScript 沿用 JavaScript 的 `const`、`let` 和旧式 `var`，但额外支持类型注解。
- 原始类型：
  常见 primitive 包括 `string`、`number`、`boolean`、`bigint`、`symbol`、`null` 和 `undefined`。
- 类型推断：
  TypeScript 经常可以自动推断类型，从而减少冗长注解。
- 显式类型：
  在边界、公共 API 和推断会过宽的地方，显式注解尤其有价值。
- 运行时现实：
  类型注解在编译后会被擦除；如果没有额外校验，它们在运行时并不存在。

```typescript
let count = 10;
let message: string = "hello";
```

两个非常重要的基础点：

- 结构化类型：
  TypeScript 通常更关注“形状是否匹配”，而不是名义身份。
- 字面量扩宽：
  像 `"ok"` 这种值，默认可能会扩宽成 `string`，除非你用更精确的类型或 `as const` 固定下来。

```typescript
const status = "ok" as const;
```

这种“推断 + 显式注解”的组合是 TypeScript 最大的优势之一，但前提是开发者得真正理解编译器到底推断出了什么。

## 2. Control Flow
TypeScript 使用 JavaScript 的控制流结构，但额外加入了基于控制流的类型收窄。也就是说，条件不仅影响执行路径，也会影响编译器认为“当前变量还可能是什么类型”。

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

- 条件分支：
  使用 `if`、`else if`、`else`。
- Switch：
  `switch` 对多分支判断和可判别联合类型都很有用。
- 迭代：
  TypeScript 支持与 JavaScript 相同的循环形式。
- 分支控制：
  `break` 和 `continue` 的行为与 JavaScript 一致。
- 类型收窄：
  `typeof`、相等判断、`in`、`instanceof` 以及自定义守卫都可以收窄联合类型。

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(0));
  }
}
```

可判别联合类型尤其重要：

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
TypeScript 中的函数在运行时仍然是 JavaScript 函数，但 TypeScript 可以更精确地描述它们的参数、返回值、近似重载声明以及泛型行为。

```typescript
function greet(name: string, prefix = "Hello"): string {
  return `${prefix}, ${name}`;
}
```

- 定义与调用：
  可以通过 `function`、函数表达式、箭头函数和方法定义函数。
- 参数：
  TypeScript 支持带类型参数、可选参数、rest 参数和默认值。
- 返回值：
  返回类型可以让编译器推断，也可以显式标注。
- 函数类型：
  函数本身作为值时也可以被精确类型化。
- 闭包：
  闭包行为和 JavaScript 一样，但被捕获的值仍会影响类型推断。

```typescript
function makeCounter() {
  let total = 0;

  return function increment(): number {
    total += 1;
    return total;
  };
}
```

TypeScript 也支持函数泛型：

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

泛型很强，但只有在它确实表达了输入输出之间的真实关系时才值得引入。

## 4. Data Structures
TypeScript 使用的仍然是 JavaScript 运行时数据结构，但其类型系统可以更清晰地表达这些结构的预期形状与约束。数组、对象、map、set、class、tuple、interface 都是日常开发的常用工具。

- Arrays：
  可写作 `T[]` 或 `Array<T>`。
- Objects：
  通常通过对象类型、interface 或 type alias 描述。
- Map 和 Set：
  运行时集合，但键和值都可以被类型化。
- Tuples：
  固定长度、位置带语义的数组。
- Classes 与 interfaces：
  class 提供运行时行为；interface 只存在于类型检查阶段。

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

TypeScript 还支持 readonly 建模：

```typescript
const point: readonly [number, number] = [10, 20];
```

几个实践区别需要注意：

- interface 与 type alias：
  两者重叠很多，但在扩展方式和组合表达力上各有优势。
- 可选属性：
  `name?: string` 会改变你处理缺失值的方式。
- 索引签名与记录类型：
  对字典型对象很有用，但如果使用随意，也容易把类型放宽得过头。

## 5. Error Handling
TypeScript 继承的是 JavaScript 的错误模型。异常是运行时行为，而类型系统并不会自动保证“这个函数到底会抛什么”。

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

- `try` / `catch`：
  与 JavaScript 一样使用。
- `finally`：
  无论走到 `try` 还是 `catch` 都会在最后执行。
- 自定义错误：
  团队通常会继承 `Error`。
- 异步错误：
  Promise rejection 和围绕 `await` 的失败处理依然重要。
- `catch` 中的 `unknown`：
  现代 TypeScript 往往把捕获值视为 `unknown`，迫使开发者先校验再使用。

```typescript
class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}
```

一个很重要的限制是：TypeScript 没有 checked exceptions。如果一个函数可能失败，团队通常需要通过文档、命名、`Result` 风格类型或约定来表达，而不是依赖语言强制机制。

## 6. Modules & Imports
TypeScript 使用现代 JavaScript 模块语法，但真实行为会受到编译器设置、运行时目标、bundler 和项目结构共同影响。理解模块解析，是 TypeScript 工程化的一部分。

```typescript
import path from "node:path";

export function getConfigPath(filename: string): string {
  return path.join(process.cwd(), filename);
}
```

- ECMAScript Modules：
  `import` 和 `export` 是主流语法。
- 仅类型导入：
  `import type` 可以把编译期类型使用和运行时导入分开。
- 标准库与外部包：
  TypeScript 项目在真实运行时上仍依赖 Node.js 或浏览器提供 API。
- 编译器设置：
  `tsconfig.json` 控制模块解析、严格模式、输出行为和路径别名。
- 声明文件：
  `.d.ts` 文件用于描述库和 API 的类型。

```typescript
import type { User } from "./types";
```

TypeScript 模块写起来很顺手，但也很容易配置错。很多真实问题不来自语法本身，而是来自编译器、bundler、运行时和包元数据之间的假设不一致。
