---
title: Vue Foundations
---

Vue is a progressive UI framework centered on declarative templates, reactive state, and component-based composition. It is not a programming language in the same sense as JavaScript or Rust, but in practice it defines a primary frontend authoring model because components, reactivity, templates, and framework conventions shape how applications are built.

## 1. Variables & Types
Vue applications are usually written in JavaScript or TypeScript, so the underlying variable and type behavior comes from that host language. What Vue adds is a reactive layer that changes how values are tracked, updated, and consumed across templates, computed values, watchers, and component state.

```vue
<script setup lang="ts">
const name = "Ada";
const count = ref(0);
</script>

<template>
  <h1>Hello, {{ name }}</h1>
  <p>{{ count }}</p>
</template>
```

- Declaration:
  Values are declared using normal JavaScript or TypeScript syntax inside Vue component scripts.
- Reactive state:
  Vue uses helpers such as `ref()` and `reactive()` to create tracked state.
- Component-local scope:
  Values declared inside a component belong to that component instance and its render cycle.
- Props:
  Parent components pass inputs into child components through props.
- Type modeling:
  In TypeScript Vue code, prop and state shapes can be explicitly typed for stronger editor and compiler support.

```ts
const count = ref(0);
const user = reactive({
  name: "Ada",
  level: "advanced"
});
```

Two foundational Vue ideas matter early:

- Reactive wrappers:
  A `ref` stores a tracked value, while a `reactive` object tracks nested property access and updates.
- Template access:
  Templates can consume reactive values directly, even when some of those values require `.value` in script code.

Vue code may look like normal JavaScript at first, but the reactive system changes how values participate in rendering.

## 2. Control Flow
Vue uses JavaScript control flow in script code and directive-based control flow in templates. The most important question is usually how state should determine the rendered UI tree.

```vue
<template>
  <p v-if="isLoading">Loading...</p>
  <p v-else>Ready</p>
</template>
```

- Conditional branching:
  Vue templates commonly use `v-if`, `v-else-if`, and `v-else`.
- List rendering:
  `v-for` is used to render repeated UI from arrays or iterable data.
- Event-driven control:
  User interaction often drives state changes through `@click`, `@input`, and similar directives.
- Early branching in script:
  Computed values and helper functions can keep template logic smaller and clearer.
- Stable keys:
  Lists rendered with `v-for` need stable `:key` values for correct patching behavior.

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

Vue's control flow often reads more declaratively in templates than in raw JavaScript, but the underlying requirement is the same: make rendered state transitions explicit and predictable.

## 3. Functions
Modern Vue development, especially with the Composition API, relies heavily on functions. Components, composables, event handlers, computed getters, and watchers all build on normal JavaScript function behavior.

```vue
<script setup lang="ts">
const count = ref(0);

function increment() {
  count.value += 1;
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

- Definition and invocation:
  Functions can be declared in component scripts and used in templates or lifecycle logic.
- Event handlers:
  Functions are commonly attached through directives such as `@click`.
- Composables:
  Reusable stateful behavior is often extracted into plain functions that use Vue reactivity APIs.
- Closures:
  Functions still capture values from their lexical scope, which matters for async logic and watchers.
- Return values:
  Composition functions often return objects containing state, actions, and derived values.

```ts
function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value += 1;
  }

  return { count, increment };
}
```

One important shift from beginner Vue to intermediate Vue is learning to separate render-facing functions from composables that encapsulate reusable state logic.

## 4. Data Structures
Vue uses standard JavaScript runtime data structures, but in practice the most important question is how those structures interact with reactivity and component ownership.

- Arrays:
  Common for list rendering and repeated UI sections.
- Objects:
  Common for state, props, configuration, and API data.
- Maps and Sets:
  Usable in application logic, though plain objects and arrays are often more natural in templates.
- Classes:
  Supported in JavaScript or TypeScript, though Vue's most common patterns are object- and function-oriented.
- Component trees:
  The UI itself is composed from nested Vue components.

```ts
const users = ref([
  { id: "1", name: "Ada" },
  { id: "2", name: "Lin" }
]);
```

Some data-shape concerns are especially important in Vue:

- Local component state:
  Best for UI concerns owned by one component or subtree.
- Shared state:
  Global or feature-level state may belong in stores such as Pinia.
- Derived state:
  Values that can be computed from existing reactive state often belong in `computed()`, not duplicated storage.

Vue data modeling is less about inventing new structures and more about choosing the right reactive ownership boundary.

## 5. Error Handling
Vue inherits JavaScript's error model, but UI frameworks also need component-level recovery and developer-facing diagnostics. This creates a mix of thrown errors, async failures, and framework-specific containment behavior.

```ts
function parsePort(raw: string): number {
  const port = Number(raw);

  if (!Number.isInteger(port)) {
    throw new Error("port must be an integer");
  }

  return port;
}
```

- JavaScript exceptions:
  Standard `try` / `catch` rules still apply in imperative logic.
- Async failures:
  API requests, form submissions, and initialization tasks can fail through rejected promises.
- Component boundaries:
  Vue supports mechanisms such as error handling hooks and application-level error handlers.
- Validation:
  Input validation is often better than letting invalid user actions become raw thrown exceptions.
- Fallback UI:
  Good Vue applications provide empty, loading, and failure states intentionally.

```ts
app.config.errorHandler = (error, instance, info) => {
  console.error("Vue error", error, info);
};
```

Vue error handling is not only about catching technical faults. It is also about preserving a stable and understandable interface when something goes wrong.

## 6. Modules & Imports
Vue projects are commonly organized around single-file components, composables, stores, utilities, routes, and feature modules. Modern Vue engineering depends heavily on ES modules and a build pipeline.

```vue
<script setup lang="ts">
import { ref } from "vue";
import ProfileCard from "./ProfileCard.vue";

const count = ref(0);
</script>

<template>
  <ProfileCard :count="count" />
</template>
```

- Single-file components:
  Vue often organizes markup, script, and style together in `.vue` files.
- Composable modules:
  Shared behavior is extracted into reusable functions such as `useProfile()` or `useCounter()`.
- Store modules:
  Shared application state may live in store definitions.
- Framework conventions:
  Frameworks such as Nuxt add routing, server integration, and file-based conventions on top of Vue.
- Build tooling:
  Tools such as Vite and Vue compiler plugins transform templates, scripts, and styles.

```vue
<script setup lang="ts">
export interface User {
  id: string;
  name: string;
}
</script>
```

In Vue engineering, module structure is a major part of maintainability because templates, state, side effects, and routing can otherwise blur together too easily.
