# AGENTS.md

## 1. Project Goal
SocCSS is a content-driven learning workspace for:
- side-by-side programming language comparison
- CS concept browsing
- language-to-CS concept bridging
- AI-assisted concept analysis based on Markdown content
- bilingual Chinese and English reading with runtime locale switching

The repository treats documentation as structured data. The UI reads Markdown from `langs/` and `cs/`, parses headings and content, then turns that into interactive reading surfaces.

## 2. Current Repository Structure
```text
.
├── langs/                  # language content rules live in langs/AGENTS.md
├── cs/                     # CS content rules live in cs/AGENTS.md
├── tools/                  # tool content rules live in tools/AGENTS.md
├── src/
│   ├── app/
│   │   ├── page.tsx              # home
│   │   ├── compare/page.tsx      # language vs language
│   │   ├── cs/page.tsx           # CS topic browser
│   │   ├── concepts/page.tsx     # language vs CS concept bridge
│   │   └── api/docs/route.ts     # content metadata + document API
│   ├── components/
│   │   ├── compare-shell.tsx
│   │   ├── cs-shell.tsx
│   │   ├── concept-bridge-shell.tsx
│   │   ├── concept-drawer.tsx
│   │   ├── locale-toggle.tsx
│   │   ├── markdown-pane.tsx
│   │   ├── mdx-tabs.tsx
│   │   ├── mermaid-diagram.tsx
│   │   ├── concept-chip-link.tsx
│   │   └── rich-markdown-preview.tsx
│   └── lib/
│       ├── mdx.ts
│       ├── cs-links.ts
│       ├── i18n.ts
│       └── text.ts
├── scripts/
│   └── generate-zh-docs.mjs
├── package.json
└── AGENTS.md
```

## 3. Content Rules

### 3.1 Directory-Specific Content Rules
- `langs/AGENTS.md` defines language-document structure and heading alignment.
- `cs/AGENTS.md` defines CS-topic categories and heading templates.
- `tools/AGENTS.md` defines tool-document structure and heading alignment.

### 3.2 Bilingual Content Requirements
- English source files remain the canonical discovery baseline.
- Chinese localized files must preserve the same heading structure as their English counterparts.
- Do not translate the `##` heading keys themselves into different wording. Keep the exact English heading line so cross-language alignment stays stable.
- Localized frontmatter `title` may be Chinese.
- When adding a new language or CS topic, add the English file first. Add the Chinese localized file in the same directory whenever possible.
- If a localized file is temporarily missing, the app may fall back to English. Do not create placeholder Chinese files filled with `?`, partial mojibake, or machine-damaged text.
- Any generated or batch-produced Chinese file must be valid UTF-8.

### 3.3 Markdown Authoring Requirements
- Always specify fenced code block language identifiers.
- Use Mermaid via fenced ` ```mermaid ` blocks.
- Use LaTeX expressions compatible with `remark-math` and `rehype-katex`.
- For multi-language CS examples, use:

```md
<Tabs>
  <Tab label="C++">

```cpp
...
```

  </Tab>
  <Tab label="Rust">

```rust
...
```

  </Tab>
</Tabs>
```

## 4. Frontend / Rendering Rules
- `src/lib/mdx.ts` is the source of truth for file discovery, locale-aware loading, and fallback behavior.
- `src/lib/i18n.ts` is the source of truth for locale parsing, route locale propagation, and shared UI copy.
- Do not hardcode language names in the UI unless there is a strong reason.
- `langs/` and `cs/` should stay filesystem-driven.
- `MarkdownPane` is the main MDX renderer for in-page reading surfaces.
- `rich-markdown-preview.tsx` is for drawer preview rendering.
- `cs-links.ts` owns language-to-CS concept mapping and inline concept link generation.
- `locale-toggle.tsx` is the shared client-side locale switch entry.
- Locale should continue to flow through page URLs via `?locale=zh|en`.
- Drawer preview, compare view, CS view, concept bridge, and docs API responses must stay locale-consistent.

## 5. Existing UX Surfaces
- `/`:
  home page with language learning path cards and CS workspace entry
- `/compare`:
  language vs language side-by-side comparison
- `/cs`:
  CS topic browser
- `/concepts`:
  language concept vs CS concept side-by-side bridge
- concept chips:
  inline concept links inside language docs
- concept drawer:
  right-side CS preview opened from concept chips
- locale toggle:
  Chinese / English runtime switching that persists through query params

## 6. Agent Editing Guidelines

### 6.1 When Editing Content
- Preserve heading alignment rules.
- Prefer extending existing terminology rather than inventing new section titles.
- Keep content explanatory and comparative, not just glossary-style.
- Follow the directory-local rules in `langs/AGENTS.md`, `cs/AGENTS.md`, or `tools/AGENTS.md` when editing those trees.
- If the repo is maintaining bilingual coverage for that area, add the corresponding `.zh.md` files in the same change.
- Never introduce mojibake, replacement characters, or `?` placeholders into localized files.

### 6.2 When Editing Frontend
- Reuse existing shells before creating new page scaffolding patterns.
- Keep Markdown rendering features working across:
  - compare view
  - CS workspace
  - concept bridge
  - concept drawer preview
- Keep locale propagation working across:
  - page navigation
  - docs API fetches
  - concept drawer links
  - compare / concepts / cs deep links
- Avoid importing Node-only modules into client-only components.
- If a client component needs utilities, split browser-safe helpers into separate files.

### 6.3 When Editing Concept Linking
- `src/lib/cs-links.ts` is the single place to add or refine:
  - related concept inference
  - inline concept keyword mapping
  - concept bridge defaults
- Do not duplicate concept-mapping logic inside page components.
- Locale-aware concept titles and reasons should stay centralized rather than being rebuilt in page code.

## 7. Preferred Workflows

### Add a New Language
1. Open `langs/AGENTS.md`
2. Create the required English files for `langs/<language>/`
3. Ensure headings match existing languages exactly
4. When possible, also create `*.zh.md` localized counterparts in the same directory

### Add a New CS Topic
1. Open `cs/AGENTS.md`
2. Pick the correct category directory
3. Name the file with a stable slug
4. Follow the heading template for that category
5. If useful for bridge mode, add concept-link rules in `src/lib/cs-links.ts`
6. When possible, add a matching `.zh.md` localized file beside the English source

### Add a New Tool Doc
1. Open `tools/AGENTS.md`
2. Create or edit `tools/<tool>/` content using the shared heading structure
3. Keep `##` headings aligned with other tool docs
4. When possible, add a matching `.zh.md` localized file beside the English source

### Add a New Language-to-CS Link
1. Add or update the target CS doc
2. Extend `TOPIC_META` or inline rules in `src/lib/cs-links.ts`
3. Verify compare page and concept chips resolve correctly
4. Verify localized titles and links still render correctly under `locale=zh`

### Regenerate Batch Chinese Docs
1. Review whether the target files should be overwritten
2. Run `node scripts/generate-zh-docs.mjs`
3. Manually spot-check representative files
4. Verify no localized files contain `?` corruption or mojibake

## 8. Technical Stack
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- `next-mdx-remote`
- `gray-matter`
- `remark-gfm`
- `remark-math`
- `rehype-highlight`
- `rehype-katex`
- `mermaid`
- `react-markdown`

## 9. Validation Expectations
After meaningful frontend or rendering changes:
- run `pnpm build`

After content model or locale-loading changes:
- verify new docs are discoverable through `src/lib/mdx.ts`
- verify headings and slugs are consistent with existing conventions
- verify locale fallback still works when a `.zh.md` file is missing

After batch content generation or localization updates:
- run `rg "\?\?" langs cs -g "*.zh.md"` and confirm no corrupted placeholder text remains
- spot-check representative `langs/*.zh.md` and `cs/*.zh.md` files
- run `pnpm build`

## 10. Near-Term Roadmap
- richer AI comparison flows
- deeper concept graph linking
- more CS topic coverage
- more language coverage
- stronger bridge mode between language runtime details and CS foundations
- higher-quality human-reviewed Chinese localization across all content
