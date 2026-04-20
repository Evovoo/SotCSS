# AGENTS.md

## 1. Scope
This file governs content created or edited under `langs/`.

## 2. Directory Structure
```text
langs/
├── <language>/
│   ├── base.md
│   ├── intermediate.md
│   ├── advanced.md
│   ├── base.zh.md                # optional
│   ├── intermediate.zh.md        # optional
│   └── advanced.zh.md            # optional
└── AGENTS.md
```

## 3. Required Files
Each language directory must contain:
- `base.md`
- `intermediate.md`
- `advanced.md`

Optional localized variants may also exist beside them:
- `base.zh.md`
- `intermediate.zh.md`
- `advanced.zh.md`

Language folders are only considered valid for discovery if all four English source files exist.

## 4. Heading Alignment
Across different languages, `##` headings must stay aligned by exact English title for the same file type.

### 4.1 `base.md` and `base.zh.md`
```md
## 1. Variables & Types
- Declaration, Scoping, Primitive types, Type inference vs. Explicit typing.
## 2. Control Flow
- Conditional branching (If/Else, Switch/Match), Iteration (For, While, Do-While), Break/Continue, Logical operators
## 3. Functions
- Definition and invocation, Parameters (Rest/Default), Return values, Anonymous functions & Arrow functions, Scope & Closures
## 4. Data Structures
- Arrays/Lists (indexing, slicing), Maps/Dictionaries (Key-Value pairs), Sets, Structs/Classes (basic properties).
## 5. Error Handling
- Try-Catch blocks, Throwing exceptions, Custom error types, Bubbling vs. Handling, finally execution.
## 6. Modules & Imports
- Exporting logic, Importing files/libraries, Namespace management, Standard library vs. External packages.
```

### 4.2 `intermediate.md` and `intermediate.zh.md`
```md
## 1. Concurrency & Async
- Event Loop, Promises/Futures, Async/Await syntax, Threading vs. Coroutines, Race conditions.
## 2. Web Development
- HTTP Methods (GET, POST, etc.), RESTful API design, Middleware, Routing, WebSockets for real-time.
## 3. Data Persistence
- SQL vs. NoSQL, ORM/ODM patterns, Connection pooling, Migrations, Basic CRUD operations.
## 4. Testing
- Unit testing, Mocking & Stubbing, Integration tests, TDD (Test Driven Development) basics, Coverage reports.
## 5. Dependency Management
- Semantic Versioning (SemVer), Lock files, Private registries, Vulnerability scanning.
## 6. Logging & Debugging
- Log levels (Info, Warn, Error), Structured logging, Debuggers, Stack trace analysis, Remote debugging.
## 7. Packaging & Deployment
- Environment variables (.env), Dockerization (Dockerfile), CI/CD pipelines, Build artifacts, Hot reloading.
```

### 4.3 `advanced.md` and `advanced.zh.md`
```md
## 1. Deep Concurrency
- Mutex & Locks, Atomic operations, Channels/Message passing, Deadlock prevention, Actor model.
## 2. Metaprogramming & Reflection
- Code generation, Reflection API, Decorators/Annotations, Macros, Dynamic proxying.
## 3. Design Patterns
- SOLID principles, Creational/Structural/Behavioral patterns, Dependency Injection, Event-driven architecture.
## 4. Advanced Type System
- Generics/Templates, Algebraic Data Types (ADTs), Variance (Covariance/Contravariance), Type constraints.
```

## 5. Editing Guidance
- Preserve heading alignment across all languages.
- Prefer explanatory and comparative writing over glossary-style fragments.
- When adding a new language, create all four required English files together.
- If bilingual coverage is being maintained for that language, add the `.zh.md` files in the same change.
