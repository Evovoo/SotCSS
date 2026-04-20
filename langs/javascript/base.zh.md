---
title: JavaScript 基础
---

JavaScript 是一种动态类型、基于原型的语言，运行环境覆盖浏览器、服务器、边缘节点和嵌入式运行时。它表面上很轻，但真实开发很快就会依赖你对类型转换、对象身份、闭包、异步行为，以及“语言特性”和“宿主环境 API”区别的理解。

## 1. Variables & Types
JavaScript 变量保存的是对值的引用，类型系统是动态的。一个变量在不同时间可以指向不同类型的值，这让试验速度很快，但也意味着命名和运行时检查必须更有纪律。

```javascript
const name = "Ada";
let version = 1;
let isReady = true;
let score = 98.5;
```

- 声明方式：
  现代 JavaScript 主要使用 `const` 和 `let`。`const` 禁止重新绑定，`let` 允许重新赋值。
- 旧式声明：
  `var` 依然存在，但它是函数作用域并带有提升行为，常常让现代代码产生意外。
- 原始类型：
  常见 primitive 包括 `string`、`number`、`boolean`、`bigint`、`symbol`、`undefined` 和 `null`。
- 动态类型：
  类型属于值，不属于变量；同一个变量之后可以保存另一种类型的值。
- 隐式类型转换：
  JavaScript 在很多运算和比较中会做自动转换，这既灵活，也很容易引入 bug。

```javascript
let value = 42;
value = "forty-two";

console.log(typeof value); // "string"
```

两个非常关键的基础点是：

- 相等规则：
  `===` 是不做隐式转换的严格相等；`==` 会发生类型转换，因此必须谨慎使用。
- 作用域：
  `let` 和 `const` 是块级作用域，`var` 是函数作用域。

```javascript
if (true) {
  const message = "inside";
}

// message is not visible here
```

JavaScript 还区分 primitive 和 object。对象、数组、函数、map、set、date 等都属于引用值，通常具备可变行为。

## 2. Control Flow
JavaScript 的控制流提供了常见的分支和循环结构，但异步代码会改变开发者对“执行顺序”的理解方式。

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

- 条件分支：
  使用 `if`、`else if`、`else`。
- Switch：
  `switch` 适合多分支情况，但它默认会贯穿执行，因此通常需要显式 `break`。
- 迭代：
  JavaScript 支持 `for`、`while`、`do...while`、`for...of` 和 `for...in`。
- 分支控制：
  `break` 用于退出循环或 switch，`continue` 用于进入下一轮循环。
- 逻辑运算：
  `&&`、`||`、`!` 采用短路语义，并返回操作数本身，而不只是布尔值。

```javascript
for (const item of [1, 2, 3]) {
  if (item === 2) {
    continue;
  }
  console.log(item);
}
```

现代 JavaScript 在控制密集场景中还很常用可选链和空值合并：

```javascript
const city = user?.profile?.city ?? "unknown";
```

这些特性可以减少样板代码，但并不能替代你对“缺失数据”和“默认值是否合法”的认真推理。

## 3. Functions
函数在 JavaScript 中是一等值。它们可以被声明、存储、传递和返回，而闭包让函数成为从简单工具到大型应用架构的核心构造。

```javascript
function greet(name, prefix = "Hello") {
  return `${prefix}, ${name}`;
}

console.log(greet("Lin"));
console.log(greet("Lin", "Hi"));
```

- 定义与调用：
  函数可以通过 `function`、函数表达式或箭头函数定义。
- 参数：
  JavaScript 支持默认参数和 rest 参数。
- 返回值：
  函数只返回一个值，但这个值可以是对象或数组，从而携带多个结果。
- 闭包：
  内部函数可以访问外层作用域变量，即使外层函数已经返回。
- `this` 行为：
  普通函数和箭头函数在 `this` 绑定方式上差异很大。

```javascript
function makeCounter() {
  let total = 0;

  return function increment() {
    total += 1;
    return total;
  };
}
```

箭头函数写法更简洁：

```javascript
const double = (value) => value * 2;
```

但它不只是语法糖。它还会词法捕获 `this`，因此在回调和类相关代码里尤其常见。

## 4. Data Structures
JavaScript 的内建数据结构很灵活，在应用代码中使用非常频繁。对象和数组是默认工具，而当建模开始变得不那么随意时，`Map`、`Set` 和类就会变得重要。

- Arrays：
  有序、基于索引的集合，并带有丰富的内建遍历方法。
- Objects：
  常用于记录型数据和字典型数据的属性集合。
- Map：
  支持任意键类型、遍历顺序稳定的键值存储。
- Set：
  存储唯一值的集合。
- Classes：
  本质上是 JavaScript 原型系统上的语法糖。

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

关于对象还要注意几个区别：

- 普通对象与 `Map`：
  普通对象适合简单记录；如果你需要真正的动态键字典行为，`Map` 往往更合适。
- 可变性：
  数组和对象默认都是可变的。
- 展开语法：
  `...` 常用于做浅拷贝和合并结构。

```javascript
const updatedUser = { ...user, level: "expert" };
```

类也可以用于带行为的数据模型：

```javascript
class User {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}
```

## 5. Error Handling
JavaScript 对同步错误使用异常机制，对异步失败通常使用 Promise rejection。现实项目里这两种机制常常同时出现，因此都必须理解。

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

- `try` / `catch`：
  用于处理同步代码块中的异常。
- `finally`：
  无论是否发生异常都会执行，常用于清理逻辑。
- 自定义错误：
  团队通常会继承 `Error` 来表达领域错误。
- Promise rejection：
  异步失败通过 `.catch()` 或围绕 `await` 的 `try` / `catch` 传播。
- 冒泡：
  错误通常会一直向上传播，直到被调用方处理，或者由运行时最终报告。

```javascript
class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigError";
  }
}
```

一个很重要的点是：同步代码里的 `throw` 和 Promise 的 reject 虽然相关，但并不是完全相同的机制。团队如果能统一异步边界上的失败表达方式，错误处理会容易很多。

## 6. Modules & Imports
JavaScript 通过模块把代码拆分成带显式导出和导入的文件。现代 JavaScript 已经标准化了 ECMAScript Modules，但真实项目里仍然经常会碰到 CommonJS、打包器和环境特定的解析行为。

```javascript
import { readFile } from "node:fs/promises";
import path from "node:path";

export function getConfigPath(filename) {
  return path.join(process.cwd(), filename);
}
```

- ECMAScript Modules：
  使用 `export` 和 `import`，这是现代标准模块系统。
- CommonJS：
  较老的 Node.js 代码常使用 `require()` 和 `module.exports`。
- 标准库与外部包：
  浏览器 JavaScript 依赖宿主提供的 Web API；Node.js 则内置 `fs`、`path`、`http` 等模块。
- 命名空间管理：
  命名导出、默认导出和命名空间导入会直接影响 API 的消费方式。
- 包管理：
  `npm`、`pnpm`、`yarn` 等工具负责依赖和脚本管理。

```javascript
export function sum(a, b) {
  return a + b;
}
```

真实项目中的模块形态还会受 bundler、transpiler 和目标运行时影响。语言特性已经标准化，但解析行为依然和宿主环境、构建配置密切相关。
