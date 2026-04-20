---
title: JavaScript 进阶
---

进入进阶阶段后，JavaScript 的重点不再只是语法，而是运行时行为。真正重要的是理解这门语言如何和事件循环、浏览器、Node.js、数据库、测试体系、包生态以及部署流水线交互。

## 1. Concurrency & Async
在最常见的运行时中，JavaScript 在语言执行层面通常是单线程的，但它依然可以通过事件循环、回调队列、Promise 和宿主管理的 IO 支持高并发。

- 事件循环：
  运行时负责协调任务队列、微任务、定时器、渲染和 IO 回调。
- Promise：
  Promise 用来建模异步完成状态，比原始回调更适合组合。
- Async / await：
  `async` 和 `await` 让基于 Promise 的代码更易读，但不会把异步操作真正变成同步。
- Workers 与线程：
  浏览器有 Web Worker，Node.js 有 Worker Threads，可用于 CPU 密集任务或隔离敏感任务。
- 竞态条件：
  共享可变状态、异步完成顺序变化，以及重叠的 UI 或网络更新都可能造成竞态 bug。

```javascript
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("request failed");
  }
  return response.json();
}
```

几个关键的进阶点：

- 微任务与宏任务：
  Promise 回调和定时器回调不在同一个队列中。
- 取消语义：
  JavaScript 没有统一的全局取消模型，因此 `AbortController` 这类模式非常重要。
- 背压：
  即使是事件驱动系统，快速生产者和慢速消费者之间依然需要显式协调。

## 2. Web Development
JavaScript 主导前端开发，也通过 Node.js 框架和边缘运行时广泛用于后端。进阶理解包括路由、请求生命周期、中间件、序列化，以及客户端与服务端边界。

```javascript
export async function GET(request) {
  return Response.json({ ok: true });
}
```

- HTTP 方法：
  `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 应与资源行为清晰对应。
- 路由：
  Express、Next.js、Fastify、Hono 等框架负责把 URL 绑定到处理函数。
- 中间件：
  鉴权、日志、校验、限流和统一错误格式通常位于中间件层。
- WebSocket 与流式响应：
  JavaScript 运行时对实时通信和增量传输支持较好。
- 浏览器代码与服务端代码：
  团队需要清晰区分 DOM 专属 API、Node 专属 API 和可复用的共享逻辑。

进阶 JavaScript Web 开发还要求你清楚状态到底放在哪里：服务端内存、浏览器内存、持久化存储、缓存还是远程 API。

## 3. Data Persistence
JavaScript 应用经常同时接触关系型数据库、文档数据库、缓存和浏览器侧存储。进阶实践的重点，是有意识地选择持久化模型，而不是把所有东西都当成普通 JSON。

- SQL 与 NoSQL：
  正确选择取决于查询需求、一致性预期和数据形状。
- ORM / ODM：
  Prisma、Sequelize、TypeORM、Mongoose 等工具提供便利，但不会替代你对查询成本和 schema 演进的理解。
- 连接管理：
  长驻服务器、serverless 函数和 edge 运行时对数据库连接的约束并不相同。
- 迁移：
  数据库 schema 变更应可版本化并自动化执行。
- 浏览器存储：
  localStorage、sessionStorage、IndexedDB 和缓存机制都有不同的限制与保证。

```javascript
const user = await prisma.user.findUnique({
  where: { email: "ada@example.com" }
});
```

两个常见进阶风险：

- 查询成本被隐藏：
  抽象层让数据库访问看起来很便宜，但 join、N+1 查询和缺失索引的代价依然真实存在。
- 运行时不匹配：
  并不是每种持久化策略都同样适合传统服务、serverless 和 edge function。

## 4. Testing
JavaScript 测试通常横跨多个层次：纯函数、UI 渲染、浏览器交互、服务端 handler 和端到端流程。进阶测试意味着要为不同风险选择正确层级。

```javascript
import { describe, expect, it } from "vitest";

function add(a, b) {
  return a + b;
}

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

- 单元测试：
  验证局部逻辑，尽量减少外部依赖。
- Mock 与 Stub：
  对网络、定时器、浏览器 API 和第三方服务很有用，但过度使用会让测试脆弱。
- 集成测试：
  对 API 路由、数据库流程和组件协作尤其重要。
- UI 测试：
  Testing Library、Playwright 等工具适合验证渲染和用户交互。
- 覆盖率：
  覆盖率能提供信号，但并不自动等于强断言。

JavaScript 的进阶测试还必须关注异步时序、fake timers、测试间清理，以及 Node 与浏览器式测试环境的差异。

## 5. Dependency Management
JavaScript 的依赖管理能力很强，但也很复杂，因为生态巨大且变化快。团队需要对版本、lockfile、包边界和安全审查有清晰约定。

- SemVer：
  版本范围很常见，但并不意味着现实中绝不会发生破坏性变化。
- Lockfiles：
  `package-lock.json`、`pnpm-lock.yaml`、`yarn.lock` 是可复现安装的核心。
- 包管理器：
  `npm`、`pnpm`、`yarn` 功能重叠，但在性能和 workspace 行为上各有差异。
- Monorepo 与 workspaces：
  JavaScript 团队经常在一个仓库中管理多个应用和包。
- 漏洞审查：
  供应链风险很重要，因为 JavaScript 项目常会快速积累大量传递依赖。

```javascript
npm install
pnpm install
```

一个非常实际的进阶经验是：在 JavaScript 项目里，依赖数量本身就可能变成架构问题，而不仅仅是包管理细节。

## 6. Logging & Debugging
JavaScript 调试横跨浏览器 devtools、Node.js inspector、结构化日志、source maps 和生产追踪系统。进阶能力是在不丢失 `console.log` 快速性的前提下，走向更系统的调试方式。

```javascript
logger.info("processing order", {
  orderId,
  attempt
});
```

- 日志级别：
  团队通常会为 debug、info、warn、error 定义明确含义。
- 结构化日志：
  键值型日志比自由文本更容易检索。
- 栈跟踪：
  JavaScript stack trace 很有用，但转译和打包会让 source maps 变得重要。
- 浏览器 devtools：
  对网络检查、性能分析、存储调试和 UI 状态观察都非常关键。
- 远程调试：
  在接近生产的环境中很有价值，但要有足够安全纪律。

JavaScript 的进阶调试经常是在推理时序：哪个回调先执行、哪个 render 先提交、哪个 promise 后完成，以及每个闭包捕获的是哪一版状态。

## 7. Packaging & Deployment
JavaScript 的部署形态高度依赖目标。浏览器应用、Node.js API、edge function 和 Electron 桌面应用都可能使用 JavaScript，但打包和部署方式差异很大。

- 环境变量：
  常用于密钥、功能开关和环境差异配置，但 server build 和 client build 的暴露规则不同。
- 打包：
  前端应用通常会经过 Vite、Webpack、Turbopack 或基于 esbuild 的工具链处理。
- 构建产物：
  输出物可能是静态资源、服务端 bundle、容器、lambda 或桌面安装包。
- CI/CD：
  流水线通常会运行 lint、测试、类型检查、构建和部署步骤。
- 热更新：
  它对开发效率非常重要，但生产部署过程依然应明确且可预测。

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

JavaScript 的进阶打包，本质上是在理解目标运行时边界，并确保构建链和它匹配，而不是假设存在一种“通用部署形态”。
