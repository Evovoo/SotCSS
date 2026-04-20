---
title: JavaScript Intermediate
---

At the intermediate level, JavaScript becomes less about syntax and more about runtime behavior. The important shift is understanding how the language interacts with the event loop, browsers, Node.js, databases, tests, package ecosystems, and deployment pipelines.

## 1. Concurrency & Async
JavaScript is single-threaded at the language execution level in most common runtimes, but it still supports high concurrency through the event loop, callback queues, promises, and host-managed IO.

- Event loop:
  The runtime coordinates task queues, microtasks, timers, rendering, and IO callbacks.
- Promises:
  Promises model asynchronous completion and compose better than raw callbacks.
- Async / await:
  `async` and `await` make promise-based code easier to read, but they do not make operations synchronous.
- Workers and threads:
  Browsers have Web Workers, and Node.js has Worker Threads for CPU-heavy or isolation-sensitive tasks.
- Race conditions:
  Shared mutable state, out-of-order async completion, and overlapping UI or network updates can still create race bugs.

```javascript
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("request failed");
  }
  return response.json();
}
```

Important intermediate concerns:

- Microtasks vs. macrotasks:
  Promise callbacks and timer callbacks do not run in the same queue.
- Cancellation:
  JavaScript has no universal cancellation model, so patterns such as `AbortController` become important.
- Backpressure:
  Fast producers and slow consumers still require explicit coordination even in an event-driven system.

## 2. Web Development
JavaScript dominates web frontends and is also common on the backend through Node.js frameworks and edge runtimes. Intermediate understanding includes routing, request lifecycles, middleware, serialization, and client-server boundaries.

```javascript
export async function GET(request) {
  return Response.json({ ok: true });
}
```

- HTTP methods:
  `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` should map cleanly to resource behavior.
- Routing:
  Frameworks such as Express, Next.js, Fastify, and Hono bind URLs to handlers.
- Middleware:
  Authentication, logging, validation, rate limiting, and error formatting often live in middleware layers.
- WebSockets and streaming:
  JavaScript runtimes support real-time and incremental delivery patterns well.
- Browser vs. server code:
  Teams must keep DOM-specific APIs, Node-specific APIs, and shared logic clearly separated.

Intermediate JavaScript web work also means understanding where state lives: server memory, browser memory, persistent storage, caches, or remote APIs.

## 3. Data Persistence
JavaScript applications often interact with relational databases, document stores, caches, and browser-side storage. Intermediate practice means choosing persistence models intentionally instead of treating everything as generic JSON blobs.

- SQL vs. NoSQL:
  The right choice depends on query needs, consistency expectations, and data shape.
- ORM / ODM:
  Tools such as Prisma, Sequelize, TypeORM, and Mongoose add convenience but do not remove the need to understand query cost and schema evolution.
- Connection management:
  Long-lived servers, serverless functions, and edge environments have different database connection constraints.
- Migrations:
  Database schema changes should be versioned and automated.
- Browser storage:
  Local storage, session storage, IndexedDB, and caches each have different limits and guarantees.

```javascript
const user = await prisma.user.findUnique({
  where: { email: "ada@example.com" }
});
```

Two intermediate risks are common:

- Hidden query cost:
  Abstractions make database access look cheap even when joins, N+1 patterns, or missing indexes are expensive.
- Runtime mismatch:
  Not every persistence strategy works equally well in traditional servers, serverless runtimes, and edge functions.

## 4. Testing
JavaScript testing spans many layers: pure functions, UI rendering, browser interaction, server handlers, and end-to-end flows. Intermediate testing means choosing the right level for each risk.

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

- Unit tests:
  Validate focused logic with minimal external dependencies.
- Mocking and stubbing:
  Useful for network calls, timers, browser APIs, and third-party services, but overuse can make tests fragile.
- Integration tests:
  Important for API routes, database workflows, and component integration.
- UI testing:
  Tools such as Testing Library and Playwright cover rendering and user interaction.
- Coverage:
  Coverage reports are useful signals, but they do not automatically indicate strong assertions.

Intermediate JavaScript testing also requires attention to async timing, fake timers, cleanup between tests, and environment differences such as Node vs. browser-like test runners.

## 5. Dependency Management
JavaScript dependency management is powerful but complex because the ecosystem is large and fast-moving. Teams need clear conventions for versions, lockfiles, package boundaries, and security review.

- SemVer:
  Version ranges are common, but they do not guarantee zero breakage in practice.
- Lockfiles:
  `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock` are central for reproducible installs.
- Package managers:
  `npm`, `pnpm`, and `yarn` have overlapping capabilities but different performance and workspace behavior.
- Monorepos and workspaces:
  JavaScript teams often manage multiple apps and packages in one repository.
- Vulnerability review:
  Supply-chain risk matters because JavaScript projects can accumulate many transitive dependencies quickly.

```javascript
npm install
pnpm install
```

One practical intermediate lesson is that dependency count can become a real architectural issue in JavaScript, not just a package-management detail.

## 6. Logging & Debugging
JavaScript debugging spans browser devtools, Node.js inspectors, structured logs, source maps, and production tracing. Intermediate skill means moving beyond `console.log` without losing the speed that makes it useful.

```javascript
logger.info("processing order", {
  orderId,
  attempt
});
```

- Log levels:
  Teams usually define meanings for debug, info, warn, and error.
- Structured logging:
  Key-value logs are easier to query than free-form messages.
- Stack traces:
  JavaScript stack traces are useful, but transpilation and bundling make source maps important.
- Browser devtools:
  Essential for network inspection, performance profiling, storage debugging, and UI state analysis.
- Remote debugging:
  Valuable in production-like environments, but requires security discipline.

Intermediate debugging in JavaScript often means reasoning about timing: which callback fired first, which render committed, which promise resolved later, and which state snapshot each closure captured.

## 7. Packaging & Deployment
JavaScript deployment varies heavily by target. A browser app, Node.js API, edge function, and Electron app may all use JavaScript but package and deploy very differently.

- Environment variables:
  Used for secrets, feature flags, and environment-specific behavior, but exposure rules differ between server and client builds.
- Bundling:
  Frontend apps often go through bundlers and optimizers such as Vite, Webpack, Turbopack, or esbuild-based tools.
- Build artifacts:
  Outputs may be static assets, server bundles, containers, lambdas, or desktop packages.
- CI/CD:
  Pipelines often run linting, tests, type checks, builds, and deployment workflows.
- Hot reloading:
  Excellent for development speed, but production deployment should remain explicit and predictable.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

Intermediate JavaScript packaging is largely about understanding the target runtime boundary and ensuring the build toolchain matches it instead of assuming one universal deployment shape.
