---
title: TypeScript 进阶
---

进入进阶阶段后，TypeScript 的重点不再只是“补类型注解”，而是围绕类型边界去设计可信系统。真正的问题会转向异步流程、框架集成、数据校验、测试策略，以及类型系统到底能提供多少真实信心。

## 1. Concurrency & Async
TypeScript 共享的是 JavaScript 的并发模型，因此事件循环、Promise、异步函数、worker 和宿主运行时行为依然定义着执行方式。TypeScript 额外带来的价值，是能更清晰地建模异步 API 和状态变化。

- 事件循环：
  和 JavaScript 一样，任务、微任务、定时器和 IO 回调共同决定执行顺序。
- Promises：
  TypeScript 可以更精确地描述 Promise 结果类型，这对异步组合很有帮助。
- Async / await：
  `async` 函数返回 `Promise<T>`，这种类型关系本身就会进入 API 设计。
- Workers 与线程：
  浏览器 worker 和 Node worker thread 仍然存在，只是接口可以被类型化。
- 竞态条件：
  TypeScript 并不会阻止运行时竞态；它主要是帮助你把状态和协议形状写得更明确。

```typescript
async function fetchUser(id: string): Promise<{ id: string; name: string }> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("request failed");
  }
  return response.json();
}
```

几个重要的进阶点：

- 异步状态建模：
  加载中、成功、失败这类状态，通常用可判别联合比松散布尔值更稳。
- 取消语义：
  `AbortController` 这类模式依然重要，因为类型安全并不会自动创造取消机制。
- 边界可信度：
  就算异步函数有类型，IO 边界上的运行时数据也仍然要做校验。

## 2. Web Development
TypeScript 已深度嵌入现代 Web 开发，包括浏览器端和服务端。进阶开发通常会在 React、Next.js、Express、NestJS、Fastify、Hono 等框架里使用它。

```typescript
type HealthResponse = {
  ok: true;
};

export async function GET(): Promise<Response> {
  const body: HealthResponse = { ok: true };
  return Response.json(body);
}
```

- HTTP 方法：
  就算 handler 有类型，HTTP 语义依然要自己保证正确。
- 路由：
  框架对 params、request body、query 和 response 的类型支持程度各不相同。
- 中间件：
  中间件链条通常很受益于对 context 扩展和鉴权状态的显式类型描述。
- 序列化：
  TypeScript 可以建模 JSON 形状，但不能保证远端系统真的返回这个形状。
- 共享类型：
  前后端共享类型很常见，但共享类型并不能替代运行时校验。

TypeScript 的 Web 进阶开发还要求你分清：哪些是真正的领域类型，哪些是传输 DTO，哪些只是框架辅助类型。

## 3. Data Persistence
TypeScript 的持久化工作经常同时涉及数据库、API、浏览器存储和缓存。关键的进阶能力，是把“编译期数据模型”和“运行时事实”区分开。

- SQL 与 NoSQL：
  存储选择依然取决于系统需求，而不是语言本身。
- ORM / ODM：
  Prisma、TypeORM、Drizzle、Sequelize、Mongoose 等工具都提供类型化访问层，但权衡各不相同。
- 基于 schema 的校验：
  Zod、Valibot、io-ts 等库常用于打通运行时校验和 TypeScript 推断。
- 迁移：
  schema 演进仍然是运维工作，不会因为有类型系统就自动消失。
- 浏览器侧持久化：
  IndexedDB、cache、local storage 仍然要求序列化纪律和版本管理。

```typescript
const user = await prisma.user.findUnique({
  where: { email: "ada@example.com" }
});
```

两个常见进阶体会：

- 生成出来的类型能提升信心，但不能被误当成“运行时数据永远合法”的证明。
- 领域模型、API 载荷和持久化行结构不应该自动塌缩成一个巨大的共享类型。

## 4. Testing
TypeScript 测试同时受益于运行时测试和静态反馈。编译器可以捕获很多形状不匹配问题，但行为正确性仍然必须通过真实执行来验证。

```typescript
import { describe, expect, it } from "vitest";

function add(a: number, b: number): number {
  return a + b;
}

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

- 单元测试：
  验证局部逻辑和边界情况。
- Mock 与 Stub：
  对 IO 边界很有用，但过度 mock 会掩盖真实集成问题。
- 集成测试：
  对 HTTP handler、数据库层和框架组合尤为关键。
- 类型层反馈：
  一些团队还会维护类型测试或编译期断言，用来验证库 API。
- 覆盖率：
  覆盖率仍然有用，但它衡量的是执行到的代码，而不是正确性证明。

TypeScript 的进阶测试通常要同时处理三层：编译器保证、运行时单元/集成测试，以及对不可信外部数据的校验。

## 5. Dependency Management
TypeScript 的依赖管理建立在 JavaScript 生态之上，因此包解析、lockfile、monorepo 和传递依赖风险依然全部存在。

- SemVer：
  版本范围很常见，但并不完美可靠。
- Lock 文件：
  `pnpm-lock.yaml`、`package-lock.json` 等 lockfile 是可复现安装的基础。
- 类型包：
  有些库自带类型，有些则依赖单独的声明包。
- Monorepos：
  workspace 和 project references 在大型 TypeScript 代码库中很常见。
- 工具链耦合：
  编译器版本、bundler、linter、测试器和框架版本经常需要细致对齐。

```typescript
pnpm install
pnpm exec tsc --noEmit
```

进阶团队还会非常关注类型漂移问题，例如库版本、生成客户端、框架插件和本地声明补丁之间的不一致。

## 6. Logging & Debugging
TypeScript 调试既涉及 JavaScript 运行时行为，也涉及源码层类型理解。source map、devtools、日志和精确的类型检查都很重要。

```typescript
logger.info("processing order", {
  orderId,
  attempt
});
```

- 日志级别：
  debug、info、warn、error 的语义仍然需要团队约定。
- 结构化日志：
  带类型的事件载荷可以让日志更一致。
- Source maps：
  当转译后代码和源码不再直接对应时，source map 非常关键。
- IDE 支持：
  TypeScript 丰富的编辑器反馈是它在调试和维护上的巨大优势。
- 运行时不匹配：
  一个值可能完全满足编译器，却仍然在运行时是错的，只因为外部输入被过早信任了。

TypeScript 的进阶调试经常要回答两个不同问题：“实际运行的代码是什么？”以及“编译器以为这个值长什么样？”

## 7. Packaging & Deployment
TypeScript 的部署方式取决于项目如何产出和运行 JavaScript。浏览器 bundle、Node 服务、serverless 函数和 edge 应用都需要不同假设。

- 环境变量：
  仍然是配置核心，但服务端专用变量和客户端暴露变量必须严格分离。
- 构建产物：
  TypeScript 可能输出普通 JavaScript、声明文件、框架 bundle 或服务端产物，取决于项目类型。
- Docker 化：
  很多后端 TypeScript 应用会在镜像构建阶段编译，然后在 Node 中运行产出的 JavaScript。
- CI/CD：
  流水线通常会运行类型检查、lint、测试、构建和部署。
- 热更新：
  在开发中极其常见，但生产部署始终是运行时问题，不是类型系统问题。

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "dist/index.js"]
```

TypeScript 的进阶打包，本质上是在确保输出的 JavaScript、目标运行时、声明文件和 bundler 假设彼此一致。
