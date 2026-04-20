---
title: Vue Intermediate
---

At the intermediate level, Vue becomes less about template syntax and more about reactive architecture. The important questions shift toward state ownership, async data flow, routing, performance, testing, and how Vue framework layers interact with the browser or server.

## 1. Concurrency & Async
Vue shares JavaScript's event-driven async model, but its reactive scheduler adds another layer to how updates are observed and rendered. Intermediate Vue work means understanding both JavaScript async boundaries and Vue's update timing.

- Event loop and promises:
  Async code still depends on promises, timers, and host callbacks.
- Reactive update scheduling:
  Vue batches DOM updates and reactive effects to reduce unnecessary work.
- Watchers:
  `watch()` and `watchEffect()` can react to state changes, but must be used carefully around async logic.
- Race conditions:
  Out-of-order requests, stale watcher logic, and overlapping navigation changes can all create correctness issues.
- Lifecycle-aware async work:
  Async logic often needs cleanup or cancellation when components unmount or route params change.

```ts
watch(
  () => userId.value,
  async (nextId) => {
    profile.value = await fetchUser(nextId);
  }
);
```

Important intermediate concerns:

- Cleanup:
  Async side effects should not keep updating state for abandoned component instances.
- Flush timing:
  Watchers and DOM updates can run at different points relative to rendering.
- Derived vs. imperative reaction:
  Some logic belongs in `computed()`, while other logic truly requires a watcher or effect.

## 2. Web Development
Vue is widely used for component-driven web applications, and frameworks such as Nuxt add routing, server rendering, and backend-adjacent capabilities. Intermediate Vue work is less about isolated components and more about how screens, data, and framework layers fit together.

```vue
<script setup lang="ts">
definePageMeta({
  layout: "default"
});
</script>

<template>
  <main><h1>Profile</h1></main>
</template>
```

- Routing:
  Vue Router or framework routing conventions define screen transitions and route state.
- Forms:
  `v-model`, validation libraries, and controlled state all play a role in form design.
- Middleware-like concerns:
  Auth, caching, request shaping, and route guards often live outside plain components.
- Real-time updates:
  WebSockets, polling, and live-query patterns are common in data-rich Vue applications.
- Hydration:
  Server-rendered Vue apps must keep client-side expectations aligned with rendered markup.

Intermediate Vue web development often means recognizing that component syntax is only one piece of the system; routing, cache policy, data loading, and server integration usually dominate the harder decisions.

## 3. Data Persistence
Vue itself does not provide persistence, but Vue applications constantly coordinate remote data, local cache, browser storage, and optimistic UI state. Intermediate practice means separating those concerns clearly.

- Remote APIs:
  Data often comes from REST, GraphQL, or framework-provided loaders.
- Browser persistence:
  Local storage, session storage, IndexedDB, and cache layers may all be involved.
- Shared state stores:
  Pinia or similar tools often coordinate persisted and in-memory application state.
- Migrations and drift:
  Frontend assumptions can break when backend payloads evolve.
- Optimistic updates:
  Useful for responsive UX, but require rollback or reconciliation discipline.

```ts
const userStore = useUserStore();
await userStore.loadProfile(userId.value);
```

Two common intermediate lessons:

- Server state and local UI state should usually not be modeled as the same thing.
- Type-safe frontend models still need runtime validation at trust boundaries.

## 4. Testing
Vue testing spans component rendering, composables, user interaction, stores, async data flow, and routed page behavior. Intermediate testing means focusing on visible behavior and reactive correctness rather than implementation trivia.

```ts
import { render, screen } from "@testing-library/vue";

test("shows loading message", () => {
  render(StatusMessage, {
    props: { isLoading: true }
  });

  screen.getByText("Loading...");
});
```

- Unit testing:
  Useful for composables, helpers, and focused components.
- Interaction testing:
  Important for forms, buttons, input flow, and emitted events.
- Store testing:
  Shared-state logic often deserves its own tests.
- Integration testing:
  Routed views, async loaders, and framework-level interactions need broader coverage.
- End-to-end testing:
  Browser automation catches issues that isolated component tests miss.

Intermediate Vue testing also requires care around async updates, `nextTick`, store resets, and mocking network boundaries without hiding real integration behavior.

## 5. Dependency Management
Vue dependency management sits inside the JavaScript ecosystem, but Vue applications also depend on framework, compiler, router, state, and bundler compatibility.

- SemVer:
  Version ranges help, but major ecosystem pieces must still be aligned carefully.
- Lock files:
  Reproducible installs matter for stable builds and team consistency.
- Compiler and runtime alignment:
  Vue runtime, compiler packages, and supporting plugins need compatible versions.
- Workspaces and monorepos:
  Common in larger frontend teams.
- Vulnerability review:
  Frontend supply-chain risk still matters.

```bash
pnpm install
pnpm why vue
```

Intermediate teams also learn that dependency choice affects bundle size, hydration cost, compile-time behavior, and long-term upgrade friction.

## 6. Logging & Debugging
Vue debugging requires reasoning about both application state and reactive timing. Browser devtools, Vue Devtools, logs, and profiler-like observations all matter.

```ts
console.log("loading profile", { userId: userId.value });
```

- Logs:
  Helpful for quick diagnosis, but can become noisy when placed inside reactive or render-heavy paths.
- Vue Devtools:
  Essential for inspecting component trees, props, state, events, and store data.
- Reactive timing:
  Debugging often involves understanding when a watcher ran, when DOM updated, and what triggered a recomputation.
- Stack traces:
  Useful, especially when source maps are configured well.
- Runtime vs. reactive bugs:
  Some defects come from bad data, others from effect timing, duplicated state, or incorrect watcher usage.

Intermediate Vue debugging often means answering questions such as: why did this computed value update, why did this watcher fire twice, and which component actually owns this state?

## 7. Packaging & Deployment
Vue deployment depends heavily on the surrounding framework and target. A Vite SPA, a Nuxt SSR app, and an embedded webview app may all use Vue but package very differently.

- Environment variables:
  Client-exposed and server-only values must be separated carefully.
- Build artifacts:
  Vue apps may produce static assets, SSR bundles, hybrid framework outputs, or deployable containers.
- Dockerization:
  Common for server-backed Vue frameworks and supporting infrastructure.
- CI/CD:
  Pipelines often run linting, tests, type checks, builds, and deployment workflows.
- Hot reload:
  Great for development, but production artifacts must remain deterministic and cache-aware.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

Intermediate Vue packaging is mostly about understanding what runtime model the app actually targets, because deployment behavior is defined more by framework and hosting shape than by Vue syntax itself.
