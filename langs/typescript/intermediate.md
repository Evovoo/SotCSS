---
title: TypeScript Intermediate
---

At the intermediate level, TypeScript becomes less about adding annotations and more about designing trustworthy systems around type boundaries. The important questions shift toward async workflows, framework integration, data validation, testing strategy, and how much confidence the type system can really provide.

## 1. Concurrency & Async
TypeScript shares JavaScript's concurrency model, so event loops, promises, async functions, workers, and host runtime behavior still define execution. The extra value TypeScript adds is better modeling of async APIs and state transitions.

- Event loop:
  As in JavaScript, tasks, microtasks, timers, and IO callbacks determine ordering.
- Promises:
  TypeScript can describe promise result types precisely, which helps async composition.
- Async / await:
  `async` functions return `Promise<T>`, and that type relationship becomes part of API design.
- Workers and threads:
  Browser workers and Node worker threads still exist, but their interfaces can be typed.
- Race conditions:
  TypeScript does not prevent runtime races; it mainly helps make state and protocol shapes explicit.

```typescript
async function fetchUser(id: string): Promise<{ id: string; name: string }> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("request failed");
  }
  return response.json();
}
```

Important intermediate concerns:

- Async state modeling:
  Loading, success, and error states are often better represented as discriminated unions than loose booleans.
- Cancellation:
  `AbortController` and related patterns matter because type safety does not create cancellation automatically.
- Boundary trust:
  Even if an async function is typed, runtime data still needs validation at IO boundaries.

## 2. Web Development
TypeScript is deeply embedded in modern web development, both in browsers and on servers. Intermediate work usually means using it with frameworks such as React, Next.js, Express, NestJS, Fastify, or Hono.

```typescript
type HealthResponse = {
  ok: true;
};

export async function GET(): Promise<Response> {
  const body: HealthResponse = { ok: true };
  return Response.json(body);
}
```

- HTTP methods:
  Typed handlers still need correct HTTP semantics.
- Routing:
  Frameworks can type params, request bodies, query strings, and responses to different degrees.
- Middleware:
  Middleware stacks often benefit from explicit typing around context augmentation and auth state.
- Serialization:
  TypeScript can model JSON payload shapes, but it cannot guarantee remote systems actually send that shape.
- Shared types:
  Frontend and backend teams often share type definitions, but shared types do not eliminate runtime validation needs.

Intermediate TypeScript web development also means deciding which types are truly domain types, which are transport DTOs, and which are framework-specific helper shapes.

## 3. Data Persistence
TypeScript persistence work often spans databases, APIs, browser storage, and caches. The key intermediate skill is separating compile-time data models from runtime truth.

- SQL vs. NoSQL:
  The storage choice still depends on system needs, not on the language.
- ORM / ODM:
  Tools such as Prisma, TypeORM, Drizzle, Sequelize, and Mongoose provide typed access layers with different tradeoffs.
- Schema-driven validation:
  Libraries such as Zod, Valibot, or io-ts often bridge runtime validation and TypeScript inference.
- Migrations:
  Schema evolution remains operational work, not just type-level work.
- Browser-side persistence:
  IndexedDB, caches, and local storage still require serialization discipline and versioning care.

```typescript
const user = await prisma.user.findUnique({
  where: { email: "ada@example.com" }
});
```

Two common intermediate lessons:

- Generated types can improve confidence, but they should not be mistaken for proof that runtime data is always valid.
- Domain models, API payloads, and persistence row shapes should not automatically collapse into one giant shared type.

## 4. Testing
TypeScript testing benefits from both runtime tests and static feedback. The compiler can catch many shape mismatches, but behavioral correctness still requires actual execution.

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

- Unit tests:
  Verify focused logic and edge cases.
- Mocking and stubbing:
  Useful for IO boundaries, but over-mocking can hide integration problems.
- Integration tests:
  Critical for HTTP handlers, database layers, and framework composition.
- Type-level feedback:
  Some teams also maintain type tests or assertion-style compile checks for library APIs.
- Coverage:
  Coverage remains useful, but it measures executed lines, not proof of correctness.

Intermediate testing in TypeScript often involves three layers at once: compiler guarantees, runtime unit/integration tests, and validation of untrusted external data.

## 5. Dependency Management
TypeScript dependency management sits on top of the JavaScript ecosystem, which means package resolution, lockfiles, monorepos, and transitive dependency risk all still apply.

- SemVer:
  Version ranges are common but imperfect.
- Lock files:
  Reproducible installs depend on `pnpm-lock.yaml`, `package-lock.json`, or similar lockfiles.
- Type packages:
  Some libraries bundle their own types; others rely on separate declaration packages.
- Monorepos:
  Workspaces and project references are common in large TypeScript codebases.
- Toolchain coupling:
  Compiler version, bundler, linter, test runner, and framework versions often need careful alignment.

```typescript
pnpm install
pnpm exec tsc --noEmit
```

Intermediate teams also learn to watch for type drift between library versions, generated clients, framework plugins, and local declaration patches.

## 6. Logging & Debugging
TypeScript debugging spans JavaScript runtime behavior plus source-level type understanding. Source maps, devtools, logs, and precise type inspection all matter.

```typescript
logger.info("processing order", {
  orderId,
  attempt
});
```

- Log levels:
  Debug, info, warn, and error semantics still need team conventions.
- Structured logging:
  Typed event payloads can make logs more consistent.
- Source maps:
  Essential when transpiled code and original source do not line up directly in stack traces.
- IDE support:
  TypeScript's rich editor feedback is one of its biggest debugging and maintenance advantages.
- Runtime mismatch:
  A value can satisfy the compiler and still be wrong at runtime if external input was trusted too early.

Intermediate TypeScript debugging often means answering two separate questions: "What code is running?" and "What did the compiler think this value looked like?"

## 7. Packaging & Deployment
TypeScript deployment depends on how the project emits and runs JavaScript. Browser bundles, Node services, serverless functions, and edge apps all require different assumptions.

- Environment variables:
  Still central for config, but server-only and client-exposed variables must be separated carefully.
- Build artifacts:
  TypeScript may emit plain JavaScript, declaration files, framework bundles, or server artifacts depending on the project.
- Dockerization:
  Many backend TypeScript apps compile during image builds, then run emitted JavaScript in Node.
- CI/CD:
  Pipelines usually run type checks, linting, tests, builds, and deployment.
- Hot reloading:
  Extremely common in development, but production deployment remains a runtime concern, not a type-system concern.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "dist/index.js"]
```

Intermediate TypeScript packaging is really about making sure the emitted JavaScript, runtime target, declaration output, and bundler assumptions all line up cleanly.
