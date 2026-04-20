---
title: React Intermediate
---

At the intermediate level, React becomes less about syntax and more about rendering architecture. The important questions shift toward state ownership, async data flow, framework integration, testability, and how React's rendering model interacts with the browser and server.

## 1. Concurrency & Async
React does not replace JavaScript's event loop, but modern React has its own concurrency-oriented rendering model. Intermediate React work means understanding both JavaScript async behavior and React scheduling behavior.

- Async data fetching:
  Requests still rely on promises, `async` / `await`, and browser or server runtime APIs.
- Concurrent rendering:
  Modern React can prepare renders in ways that make UI updates feel more responsive.
- Transitions:
  `startTransition` marks non-urgent updates so urgent interactions stay responsive.
- Deferred values:
  `useDeferredValue` can reduce UI pressure when expensive rendering follows fast-changing input.
- Race conditions:
  Stale requests, overlapping renders, and out-of-order updates still create bugs if state ownership is unclear.

```tsx
const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);
```

Important intermediate concerns:

- Effect cleanup:
  Async work often needs cleanup or cancellation to avoid updating unmounted or outdated trees.
- Render vs. commit:
  React can render work without committing it, which affects how side effects should be written.
- Server and client boundaries:
  In framework environments, async behavior may split between server-rendered and client-rendered code.

## 2. Web Development
React dominates component-driven frontend development and is deeply integrated into frameworks such as Next.js, Remix, and Expo. Intermediate web work is less about "how to render a button" and more about how routing, forms, fetching, and hydration fit together.

```tsx
export default function ProfilePage() {
  return <main><h1>Profile</h1></main>;
}
```

- Routing:
  Usually handled by a framework or router library rather than by React itself.
- Forms:
  React forms can be controlled, uncontrolled, or framework-assisted depending on the use case.
- Middleware-adjacent concerns:
  Auth, caching, validation, and request shaping often live in framework layers around React.
- WebSockets and live updates:
  React can subscribe to real-time data, but update frequency and ownership must be managed carefully.
- Hydration:
  Server-rendered markup must line up with client rendering expectations.

Intermediate React web development often means learning that React is only one layer in the web stack. Many problems attributed to "React complexity" actually come from routing, data loading, cache invalidation, or server-client boundary design.

## 3. Data Persistence
React itself does not manage persistence, but React applications constantly interact with remote APIs, browser storage, caches, and local optimistic state. Intermediate practice means modeling data lifecycle carefully.

- Remote data:
  Usually fetched from HTTP APIs, GraphQL endpoints, or framework data loaders.
- Client cache:
  Libraries such as TanStack Query, SWR, Relay, or Apollo help manage server state.
- Browser persistence:
  Local storage, session storage, IndexedDB, and service worker caches may all appear in real apps.
- Forms and draft state:
  Temporary client-side edits often need a different lifecycle from persisted server state.
- Migrations and schema drift:
  Frontend code still suffers when backend payload shapes evolve unexpectedly.

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId)
});
```

Two common intermediate lessons:

- Server state and UI state should usually not be treated as the same thing.
- A typed frontend model does not guarantee runtime payload correctness unless the boundary is validated.

## 4. Testing
React testing spans component rendering, user interaction, async loading, state updates, and framework integration. Intermediate testing means focusing on behavior visible to users rather than implementation details.

```tsx
import { render, screen } from "@testing-library/react";

test("shows loading message", () => {
  render(<StatusMessage isLoading={true} />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
```

- Unit testing:
  Often used for hooks, helper functions, and focused components.
- Interaction testing:
  Testing Library-style tests simulate how users actually interact with the UI.
- Mocking and stubbing:
  Useful at network boundaries, but excessive mocking can make React tests fragile.
- Integration tests:
  Important for routed pages, data-fetching components, and form flows.
- End-to-end testing:
  Browser automation catches issues that isolated component tests miss.

Intermediate React testing also requires attention to async rendering, effect timing, fake timers, and the difference between rendering a component tree and validating user-observable behavior.

## 5. Dependency Management
React applications often accumulate many dependencies because UI, routing, state, styling, data fetching, forms, and testing each have strong ecosystems. Intermediate teams need deliberate package discipline.

- SemVer:
  Dependency ranges still require caution because UI ecosystems evolve quickly.
- Lock files:
  Reproducible installs are critical in frontend teams.
- Peer dependencies:
  React libraries often depend on matching React and React DOM versions.
- Workspaces and monorepos:
  Common in larger frontend organizations.
- Vulnerability scanning:
  Frontend supply-chain risk matters, especially in browser-facing applications.

```tsx
pnpm install
pnpm why react
```

Intermediate React teams also learn that dependency choice affects bundle size, hydration cost, developer experience, and long-term upgrade friction.

## 6. Logging & Debugging
React debugging requires reasoning about both application state and render behavior. Browser devtools, React DevTools, logs, and profiler traces all play different roles.

```tsx
console.log("rendering profile panel", { userId });
```

- Log levels and diagnostics:
  Plain logs still help, but noisy render-time logging can become misleading.
- React DevTools:
  Essential for inspecting props, state, hooks, and component hierarchy.
- Profiler:
  Important when UI feels slow or rerenders unexpectedly.
- Stack traces:
  Helpful, though source maps and framework transforms may affect readability.
- Runtime vs. render bugs:
  Some problems come from bad data, others from effect timing, identity instability, or stale closures.

Intermediate React debugging often means answering questions such as: why did this component rerender, why is this effect firing again, and which state actually owns this behavior?

## 7. Packaging & Deployment
React deployment depends heavily on the surrounding framework and target. A Vite SPA, a Next.js app, a React Native app, and an Electron app all use React but ship through different pipelines.

- Environment variables:
  Client-exposed variables and server-only variables must be separated carefully.
- Build artifacts:
  React apps may produce static assets, server bundles, hybrid framework outputs, or native app packages.
- Dockerization:
  Common for server-backed React frameworks and supporting services.
- CI/CD:
  Pipelines often run linting, tests, type checks, builds, and deployment workflows.
- Hot reloading:
  Core to development speed, but production builds need deterministic output and cache strategy.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

Intermediate React packaging is mostly about understanding what the actual runtime is. React may be central to authoring, but deployment behavior is defined by the framework, bundler, hosting model, and server boundaries around it.
