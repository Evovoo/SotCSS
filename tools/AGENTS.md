# AGENTS.md

## 1. Scope
This file governs content created or edited under `tools/`.

## 2. Directory Structure
```text
tools/
├── <tool>/
│   ├── *.md
│   └── *.zh.md                  # optional
└── AGENTS.md
```

## 3. Heading Alignment
Across different tools, `##` headings must stay aligned by exact English title for the same file type.

Required structure:
```md
## 1. What
- **Core Concept**: [Tool Name] is a [category of tool, e.g., containerization platform / static site generator].
- **Problem it Solves**: It addresses the challenge of [e.g., "it works on my machine" syndrome / slow build times].

## 2. Why
- **Main Purpose**: It is used to [e.g., package applications / automate deployment / analyze code].
- **Key Benefits**:
  - Boosts productivity by [action].
  - Ensures consistency across [environments/teams].

## 3. How
- **Workflow**: High-level process (e.g., Define -> Build -> Run).
- **Quick Start**:
  1. Installation: [Brief command, e.g., `npm install` or `brew install`]
  2. Basic Usage: [A single, most common command or configuration file example]

## 4. Better
- **Comparison**: How it compares to [Alternative Tool A] and [Alternative Tool B].
- **Key Advantages**:
  - **Performance**: [e.g., Faster execution due to native binaries]
  - **Developer Experience**: [e.g., Better documentation / smaller learning curve]

## 5. Beyond
- **Ecosystem**: Integration with other tools in the modern stack.
- **Trade-offs**: When *not* to use this tool (e.g., overkill for small projects, high resource consumption).
```

## 4. Editing Guidance
- Preserve the shared `##` headings exactly across tool docs.
- Prefer comparative, practical explanations over marketing language.
- Keep quick-start examples short and directly runnable where possible.
- When possible, add a matching `.zh.md` file beside the English source.
