---
title: React Native Intermediate
---

At the intermediate level, React Native becomes less about writing components and more about shipping real mobile applications. The important questions shift toward async state, navigation, device capabilities, performance, testing, and how JavaScript code collaborates with native platforms.

## 1. Concurrency & Async
React Native shares JavaScript's async model, but mobile applications introduce additional pressure from app lifecycle, backgrounding, device IO, and native module communication.

- Event loop and promises:
  Async code still relies on promises, timers, and host-managed callbacks.
- Concurrent rendering:
  Modern React scheduling concepts still matter in React Native apps.
- Native bridge or native interface boundaries:
  Calls into platform APIs may be asynchronous, batched, or delayed relative to UI updates.
- Race conditions:
  Out-of-order network responses, screen transitions, app resume events, and stale closures can all create mobile-specific bugs.
- App lifecycle:
  Foreground, background, suspended, and restored states affect what async work should continue.

```tsx
useEffect(() => {
  let active = true;

  async function loadUser() {
    const nextUser = await fetchUser(userId);
    if (active) {
      setUser(nextUser);
    }
  }

  loadUser();

  return () => {
    active = false;
  };
}, [userId]);
```

Important intermediate concerns:

- Cleanup:
  Async effects should be cancelled or ignored safely when screens unmount or params change.
- Performance-sensitive updates:
  Not every state update should block gestures, navigation, or animation.
- Bridge awareness:
  The cost of crossing between JavaScript and native layers matters in high-frequency interactions.

## 2. Web Development
React Native is not for the web by default, but many of the same app-architecture concerns apply. Intermediate "web development" in React Native is really about application shell design: navigation, forms, API interaction, authentication, and live updates in a mobile context.

```tsx
<Stack.Navigator>
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>
```

- Routing and navigation:
  Mobile apps usually use stack, tab, drawer, and deep-link navigation rather than browser URLs alone.
- Forms:
  Input handling must consider keyboard behavior, validation timing, and mobile ergonomics.
- Middleware-like concerns:
  Auth tokens, request shaping, retry logic, analytics, and permissions often live in app services rather than components.
- Real-time updates:
  WebSockets, push-driven refresh, and background sync patterns are common.
- Platform behavior:
  iOS and Android do not always behave the same in navigation, permissions, or lifecycle events.

Intermediate React Native app design often reveals that "screen code" is only a small part of the system. Navigation state, service boundaries, and device behavior usually dominate complexity.

## 3. Data Persistence
Mobile apps regularly combine remote APIs with local persistence so they can support offline behavior, caching, draft state, and startup performance.

- Remote APIs:
  Network data is often fetched through REST, GraphQL, or SDK-based clients.
- Local persistence:
  AsyncStorage, SQLite, MMKV, Realm, and secure storage are common depending on needs.
- Cache management:
  Server-state libraries can reduce duplicated loading logic and improve consistency.
- Migrations:
  Stored data formats may need migration when app versions evolve.
- Optimistic state:
  Mobile UX often benefits from showing progress immediately before the network round-trip finishes.

```tsx
const savedDraft = await AsyncStorage.getItem("draft-profile");
```

Two common intermediate lessons:

- UI state, cached server state, and durable offline state are different concerns and should usually not be modeled as one thing.
- Mobile persistence design must account for app restarts, offline periods, and partial writes.

## 4. Testing
React Native testing spans component rendering, gesture flows, native integrations, and end-to-end behavior on simulators or devices. Intermediate testing means choosing the right level for each mobile risk.

```tsx
import { render, screen } from "@testing-library/react-native";

test("shows loading message", () => {
  render(<StatusMessage isLoading={true} />);
  expect(screen.getByText("Loading...")).toBeTruthy();
});
```

- Unit testing:
  Useful for hooks, utility functions, reducers, and focused components.
- Integration testing:
  Important for screen flows, navigation interactions, and async data loading.
- Mocking:
  Native modules often require mocking, but too much mocking can hide platform issues.
- Device or simulator testing:
  Necessary for gestures, permissions, deep links, notifications, and native behavior.
- Coverage:
  Coverage helps locate blind spots, but behavior under real device conditions still matters more.

Intermediate React Native testing also requires attention to animation timing, layout differences, native module availability, and environmental assumptions in CI.

## 5. Dependency Management
React Native dependency management is more fragile than plain web React because JavaScript packages often interact with native platform code, Gradle, CocoaPods, Expo plugins, or custom build steps.

- SemVer:
  Version compatibility is important, but native integration often makes upgrades more brittle than package version ranges suggest.
- Lock files:
  Reproducible JavaScript dependency installs still matter.
- Native dependencies:
  Some packages require iOS pods, Android Gradle config, permissions, or manual native setup.
- Framework coupling:
  React Native version, Expo SDK version, React version, and community library versions often need careful alignment.
- Vulnerability and maintenance review:
  A library's native maintenance quality matters as much as its JavaScript API surface.

```tsx
pnpm install
npx expo install react-native-safe-area-context
```

Intermediate teams quickly learn that a "small package choice" in React Native can expand into build complexity, native permission changes, and platform-specific maintenance burden.

## 6. Logging & Debugging
React Native debugging spans JavaScript logic, render behavior, network activity, device state, and native integration. Effective debugging usually requires more than one tool at once.

```tsx
console.log("loading profile", { userId });
```

- Logs:
  Useful for quick diagnosis, though mobile logging can become noisy and incomplete across app restarts.
- React DevTools:
  Helps inspect component trees, props, and hooks.
- Native debugging:
  Xcode, Android Studio, and device logs are often necessary for platform issues.
- Profiling:
  Performance work may require FPS analysis, flamegraphs, or native performance tools.
- Crash reporting:
  Production mobile apps usually need structured crash and error reporting.

Intermediate debugging in React Native often means figuring out whether a problem belongs to JavaScript state, rendering, gesture handling, native configuration, or device-specific platform behavior.

## 7. Packaging & Deployment
React Native packaging and deployment are significantly more complex than browser app deployment because apps must be built, signed, and distributed for native platforms.

- Environment variables:
  Useful for app config, API endpoints, and feature flags, but must be managed carefully across native build variants.
- Build artifacts:
  Android APK/AAB and iOS app archives are typical outputs.
- CI/CD:
  Mobile pipelines often run tests, bundling, native builds, signing, and store-distribution steps.
- OTA updates:
  Some setups support over-the-air JavaScript bundle updates, but native changes still require store releases.
- Release discipline:
  Versioning, app-store metadata, permissions, and signing are part of deployment, not afterthoughts.

```bash
npx expo export
eas build --platform ios
eas build --platform android
```

Intermediate React Native deployment is largely about respecting native platform constraints while preserving a maintainable JavaScript workflow.
