---
title: React Native 进阶
---

进入进阶阶段后，React Native 的重点不再只是“写组件”，而是“交付真正的移动应用”。关键问题会转向异步状态、导航、设备能力、性能、测试，以及 JavaScript 代码如何和原生平台协作。

## 1. Concurrency & Async
React Native 共享的是 JavaScript 异步模型，但移动应用还会额外承受应用生命周期、后台切换、设备 IO 和原生模块通信带来的复杂度。

- 事件循环与 Promise：
  异步代码仍然依赖 Promise、定时器和宿主管理的回调。
- 并发渲染：
  现代 React 的调度概念在 React Native 中同样重要。
- 原生桥或原生接口边界：
  调用平台 API 可能是异步的、批量的，或相对 UI 更新存在延迟。
- 竞态条件：
  网络响应乱序、页面切换、应用恢复事件和 stale closure 都会制造典型移动端 bug。
- 应用生命周期：
  前台、后台、挂起和恢复状态会影响哪些异步工作应该继续执行。

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

几个关键进阶点：

- 清理逻辑：
  当页面卸载或参数变化时，异步 effect 应安全取消或忽略结果。
- 性能敏感更新：
  不是每一次 state 更新都应该阻塞手势、导航或动画。
- Bridge 成本意识：
  在高频交互中，JavaScript 层与原生层之间的跨越成本很重要。

## 2. Web Development
React Native 默认并不是做 Web 的，但很多相同的应用架构问题依然存在。这里的“Web Development”更适合理解为应用壳层设计：导航、表单、API 交互、鉴权和移动端环境下的实时更新。

```tsx
<Stack.Navigator>
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>
```

- 路由与导航：
  移动应用通常使用 stack、tab、drawer 和 deep link 导航，而不是只依赖浏览器 URL。
- 表单：
  输入处理必须考虑键盘行为、校验时机和移动端交互舒适度。
- 类中间件问题：
  token、请求整理、重试逻辑、埋点和权限处理，通常放在组件之外的服务层。
- 实时更新：
  WebSocket、推送驱动刷新和后台同步都很常见。
- 平台行为差异：
  iOS 和 Android 在导航、权限和生命周期上并不总是一样。

React Native 的进阶应用设计经常会让人发现：所谓“页面代码”其实只占系统复杂度的一小部分，真正难的是导航状态、服务边界和设备行为。

## 3. Data Persistence
移动应用经常要把远程 API 和本地持久化结合起来，以支持离线能力、缓存、草稿状态和启动性能。

- 远程 API：
  网络数据通常来自 REST、GraphQL 或 SDK 客户端。
- 本地持久化：
  AsyncStorage、SQLite、MMKV、Realm、secure storage 等都很常见，取决于场景需求。
- 缓存管理：
  server-state 库可以减少重复加载逻辑并提升一致性。
- 迁移：
  当应用版本演进时，本地存储格式也可能需要迁移。
- 乐观状态：
  移动端体验通常受益于在网络往返完成前先反馈进度或结果。

```tsx
const savedDraft = await AsyncStorage.getItem("draft-profile");
```

两个常见进阶体会：

- UI state、缓存的 server state 和持久化离线状态是三类不同问题，通常不应建模成同一个东西。
- 移动端持久化设计必须考虑应用重启、离线时段和部分写入失败。

## 4. Testing
React Native 测试会覆盖组件渲染、手势流程、原生集成和模拟器/真机上的端到端行为。进阶测试意味着为不同移动端风险选择正确层级。

```tsx
import { render, screen } from "@testing-library/react-native";

test("shows loading message", () => {
  render(<StatusMessage isLoading={true} />);
  expect(screen.getByText("Loading...")).toBeTruthy();
});
```

- 单元测试：
  适合 hooks、工具函数、reducer 和小范围组件。
- 集成测试：
  对页面流程、导航交互和异步数据加载尤其重要。
- Mock：
  原生模块通常需要 mock，但过度 mock 会掩盖平台问题。
- 真机或模拟器测试：
  对手势、权限、deep link、通知和原生行为非常必要。
- 覆盖率：
  覆盖率能提示盲区，但真实设备条件下的行为更重要。

React Native 的进阶测试还要关注动画时序、布局差异、原生模块可用性，以及 CI 环境中的设备假设。

## 5. Dependency Management
React Native 的依赖管理比纯 Web React 更脆弱，因为 JavaScript 包经常会和原生平台代码、Gradle、CocoaPods、Expo 插件或自定义构建步骤联动。

- SemVer：
  版本兼容性很重要，但原生集成会让升级比表面上的版本范围更脆弱。
- Lock 文件：
  JavaScript 依赖安装的可复现性仍然重要。
- 原生依赖：
  一些包需要 iOS pod、Android Gradle 配置、权限声明或手动原生设置。
- 框架耦合：
  React Native 版本、Expo SDK 版本、React 版本和社区库版本经常需要精细对齐。
- 漏洞与维护审查：
  一个库的原生维护质量，往往和它的 JavaScript API 一样重要。

```tsx
pnpm install
npx expo install react-native-safe-area-context
```

进阶团队会很快意识到：React Native 里的一个“小包选择”，很可能扩展成构建复杂度、原生权限变更和平台特定维护负担。

## 6. Logging & Debugging
React Native 调试横跨 JavaScript 逻辑、渲染行为、网络活动、设备状态和原生集成。有效排障通常需要多种工具同时配合。

```tsx
console.log("loading profile", { userId });
```

- 日志：
  适合快速定位，但移动端日志在应用重启和跨平台场景下往往会变得噪声大且不完整。
- React DevTools：
  有助于查看组件树、props 和 hooks。
- 原生调试：
  Xcode、Android Studio 和设备日志对平台问题常常是必需的。
- 性能分析：
  性能问题可能需要 FPS 分析、flamegraph 或原生性能工具。
- 崩溃上报：
  生产移动应用通常需要结构化 crash 和 error reporting。

React Native 的进阶调试经常是在判断：问题到底属于 JavaScript 状态、渲染行为、手势处理、原生配置，还是设备特定平台行为。

## 7. Packaging & Deployment
React Native 的打包与部署比浏览器应用复杂得多，因为应用必须为原生平台构建、签名并分发。

- 环境变量：
  可用于应用配置、API 地址和功能开关，但必须在不同原生构建变体之间谨慎管理。
- 构建产物：
  常见输出是 Android APK/AAB 和 iOS archive。
- CI/CD：
  移动流水线通常会运行测试、bundle、原生构建、签名和应用商店分发步骤。
- OTA 更新：
  某些方案支持通过网络下发 JavaScript bundle，但只要涉及原生改动，仍需要商店发版。
- 发布纪律：
  版本号、商店元数据、权限声明和签名都是部署的一部分，不是发布后才考虑的事。

```bash
npx expo export
eas build --platform ios
eas build --platform android
```

React Native 的进阶部署，本质上是在尊重原生平台约束的前提下，尽量保持 JavaScript 工作流可维护。
