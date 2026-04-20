---
title: React 进阶
---

进入进阶阶段后，React 的重点不再只是语法，而是渲染架构。真正重要的问题会转向状态所有权、异步数据流、框架集成、可测试性，以及 React 渲染模型如何与浏览器和服务端交互。

## 1. Concurrency & Async
React 不会替代 JavaScript 的事件循环，但现代 React 确实有自己偏并发导向的渲染模型。进阶 React 开发意味着同时理解 JavaScript 异步行为和 React 调度行为。

- 异步数据获取：
  请求仍然依赖 Promise、`async` / `await` 以及浏览器或服务端运行时 API。
- 并发渲染：
  现代 React 可以以更有弹性的方式准备渲染，从而让 UI 更新更平滑。
- Transitions：
  `startTransition` 用于标记非紧急更新，以便紧急交互保持响应。
- Deferred values：
  `useDeferredValue` 可以在高频输入触发高成本渲染时降低界面压力。
- 竞态条件：
  过时请求、重叠 render 和乱序更新依然会制造 bug，尤其当状态所有权不清晰时。

```tsx
const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);
```

几个关键的进阶点：

- Effect 清理：
  异步工作经常需要 cleanup 或取消，以免更新已经卸载或过时的树。
- Render 与 commit：
  React 可以完成 render 却不 commit，因此副作用写法必须尊重这个模型。
- 服务端与客户端边界：
  在框架环境里，异步行为可能分散在服务端渲染代码和客户端渲染代码两侧。

## 2. Web Development
React 主导了组件驱动的前端开发，并深度嵌入 Next.js、Remix、Expo 等框架。进阶 Web 开发不再是“怎么渲染一个按钮”，而是路由、表单、数据获取和 hydration 如何协同工作。

```tsx
export default function ProfilePage() {
  return <main><h1>Profile</h1></main>;
}
```

- 路由：
  通常由框架或 router 库负责，而不是 React 本身。
- 表单：
  React 表单可以是 controlled、uncontrolled，或由框架辅助管理。
- 类中间件问题：
  鉴权、缓存、校验和请求整理等逻辑，经常存在于框架包裹 React 的那一层。
- WebSocket 与实时更新：
  React 可以订阅实时数据，但更新频率和状态所有权必须小心管理。
- Hydration：
  服务端输出的 HTML 必须和客户端渲染预期保持一致。

React 的 Web 进阶开发经常会让人意识到：React 只是 Web 栈中的一层。许多被归咎于“React 复杂”的问题，其实来自路由、数据加载、缓存失效或服务端客户端边界设计。

## 3. Data Persistence
React 本身不负责持久化，但 React 应用会持续和远程 API、浏览器存储、缓存以及本地乐观状态交互。进阶实践的重点是认真建模数据生命周期。

- 远程数据：
  通常来自 HTTP API、GraphQL 或框架数据加载器。
- 客户端缓存：
  TanStack Query、SWR、Relay、Apollo 等库常用于管理 server state。
- 浏览器持久化：
  localStorage、sessionStorage、IndexedDB 和 service worker cache 在真实应用中都可能出现。
- 表单与草稿状态：
  临时编辑态通常和服务端持久状态有不同生命周期。
- 迁移与 schema 漂移：
  当后端载荷形状变化时，前端同样会受影响。

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId)
});
```

两个常见进阶体会：

- Server state 和 UI state 通常不应该被当成同一种状态。
- 前端有类型并不等于运行时载荷一定正确，除非边界做了校验。

## 4. Testing
React 测试会覆盖组件渲染、用户交互、异步加载、状态更新和框架集成。进阶测试意味着关注用户可见行为，而不是实现细节。

```tsx
import { render, screen } from "@testing-library/react";

test("shows loading message", () => {
  render(<StatusMessage isLoading={true} />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
```

- 单元测试：
  常用于 hooks、工具函数和小范围组件。
- 交互测试：
  Testing Library 风格测试更接近真实用户操作方式。
- Mock 与 Stub：
  在网络边界上有用，但过度 mock 会让 React 测试变脆弱。
- 集成测试：
  对路由页面、数据获取组件和表单流程尤其重要。
- 端到端测试：
  浏览器自动化可以抓到很多纯组件测试看不到的问题。

React 的进阶测试还必须关注异步渲染、effect 时机、fake timers，以及“渲染一个组件树”和“验证用户可观察行为”之间的区别。

## 5. Dependency Management
React 应用通常会积累很多依赖，因为 UI、路由、状态、样式、数据获取、表单和测试都各有强生态。进阶团队需要有意识地做包治理。

- SemVer：
  版本范围仍需谨慎，因为 UI 生态变化很快。
- Lock 文件：
  对前端团队来说，可复现安装非常关键。
- Peer dependencies：
  React 库常常依赖与自身匹配的 React 和 React DOM 版本。
- Workspaces 与 monorepo：
  在较大的前端组织中非常常见。
- 漏洞扫描：
  前端供应链风险同样重要，尤其是直接面向浏览器的应用。

```tsx
pnpm install
pnpm why react
```

React 的进阶团队也会很快认识到：依赖选择会直接影响 bundle 体积、hydration 成本、开发体验和长期升级阻力。

## 6. Logging & Debugging
React 调试要求同时推理应用状态和渲染行为。浏览器 devtools、React DevTools、日志和 profiler trace 各有不同作用。

```tsx
console.log("rendering profile panel", { userId });
```

- 日志级别与诊断：
  普通日志仍然有帮助，但在 render 中到处打日志会很快失真。
- React DevTools：
  对查看 props、state、hooks 和组件层级非常关键。
- Profiler：
  当 UI 变慢或出现意外 rerender 时尤其重要。
- 栈跟踪：
  仍然有帮助，但 source map 和框架转换可能影响可读性。
- 运行时 bug 与渲染 bug：
  有些问题来自错误数据，有些则来自 effect 时机、身份不稳定或 stale closure。

React 的进阶调试经常是在回答这样的问题：为什么这个组件又 rerender 了？为什么这个 effect 又执行了？哪个状态才真正拥有这段行为？

## 7. Packaging & Deployment
React 的部署方式高度依赖外围框架和目标平台。Vite SPA、Next.js 应用、React Native 应用和 Electron 应用都使用 React，但交付流程完全不同。

- 环境变量：
  客户端暴露变量和服务端私有变量必须严格分开。
- 构建产物：
  React 应用可能输出静态资源、服务端 bundle、混合框架产物或原生应用包。
- Docker 化：
  对带服务端能力的 React 框架和相关服务来说非常常见。
- CI/CD：
  流水线通常运行 lint、测试、类型检查、构建和部署。
- 热更新：
  对开发速度至关重要，但生产构建必须保证输出稳定且缓存策略清晰。

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

React 的进阶打包，本质上是在理解真正运行时到底是什么。React 对创作方式很关键，但部署行为最终由框架、bundler、托管模型和服务端边界决定。
