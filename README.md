# SotCSS
[中文](./README.zh.md)

- 10 分钟快速掌握计算机科学体系：助力 Vibecode 开发
- Study of the Computer Science System in 10min to vibecode


SocCSS is a content-driven learning workspace for:
- side-by-side programming language comparison
- computer science topic browsing
- language-to-CS concept bridging
- AI-assisted concept analysis on top of Markdown content
- bilingual Chinese and English reading with runtime locale switching

The project treats documentation as structured data. The frontend reads Markdown from `langs/`, `cs/`, and `tools/`, parses headings and content, and turns them into interactive reading surfaces.

## Demo Links
- https://sotcss.vercel.app/
- https://evovoo.github.io/SotCSS/

## Repository Structure

```text
.
├── langs/
├── cs/
├── tools/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── compare/page.tsx
│   │   ├── cs/page.tsx
│   │   └── concepts/page.tsx
│   ├── components/
│   └── lib/
├── scripts/
├── AGENTS.md
├── README.md
└── README.zh.md
```

## Content Model

### `langs/`

Each language directory must contain:
- `base.md`
- `intermediate.md`
- `advanced.md`

Optional localized files:
- `base.zh.md`
- `intermediate.zh.md`
- `advanced.zh.md`

Notes:
- `##` headings must stay aligned across languages for the same document type
- A language is only considered discoverable when all required English files exist

### `cs/`

`cs/` is currently organized into:
- `data-structures`
- `algorithms`
- `operating-systems`
- `networks`

All CS docs use the shared five-part structure:
- `## 1. What`
- `## 2. Why`
- `## 3. How`
- `## 4. Better`
- `## 5. Beyond`

### `tools/`

Docs under `tools/` follow the same five-part structure:
- `## 1. What`
- `## 2. Why`
- `## 3. How`
- `## 4. Better`
- `## 5. Beyond`

Tool doc requirements:
- Shared headings must remain identical in English
- `## 3. How` must include runnable commands or code snippets

## Markdown Features

Supported:
- Fenced code blocks with language identifiers
- Mermaid via ` ```mermaid `
- LaTeX via `remark-math` + `rehype-katex`
- Tabs-based multi-language examples

Example:

````md
<Tabs>
  <Tab label="Python">

```python
print("hello")
```

  </Tab>
  <Tab label="Rust">

```rust
println!("hello");
```

  </Tab>
</Tabs>
````

## Frontend Architecture

Key modules:
- `src/lib/mdx.ts`
  Source of truth for file discovery, locale fallback, and content loading.
- `src/lib/i18n.ts`
  Locale parsing, query propagation, and shared UI copy.
- `src/lib/cs-links.ts`
  Concept mapping and inline concept-link logic.
- `src/components/markdown-pane.tsx`
  Main reading-surface renderer.
- `src/components/rich-markdown-preview.tsx`
  Drawer preview renderer.

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the dev server
```bash
npm run dev
```

### Open the app
```text
http://localhost:3000
```

### Build the static site
```bash
npm run build
```

## GitHub Pages Deployment

The project is configured for GitHub Pages static export.

- Workflow: `.github/workflows/deploy-pages.yml`
- Build output: `out/`
- Production URL: `https://evouo.github.io/SotCSS/`

Pushing to `main` triggers the deployment workflow automatically.

## Authoring and Contribution

### Add a new language
1. Read `langs/AGENTS.md`
2. Create `langs/<language>/base.md`
3. Create `langs/<language>/intermediate.md`
4. Create `langs/<language>/advanced.md`
5. Add `.zh.md` files when possible
6. Keep `##` headings strictly aligned with existing languages

### Add a new CS topic
1. Read `cs/AGENTS.md`
2. Choose the correct category directory
3. Use a stable kebab-case filename
4. Follow the shared five-part structure
5. Update `src/lib/cs-links.ts` if concept links should change

### Add a new tool doc
1. Read `tools/AGENTS.md`
2. Create or update docs under `tools/<tool>/`
3. Keep the shared five-part headings aligned
4. Include runnable examples in `## 3. How`
5. Add `.zh.md` when possible

## Validation

After meaningful frontend or content-model changes, run:

```bash
npm run build
```

After localization updates, also check:

```bash
rg "\?\?" langs cs tools -g "*.zh.md"
```

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- `next-mdx-remote`
- `react-markdown`
- `gray-matter`
- `remark-gfm`
- `remark-math`
- `rehype-highlight`
- `rehype-katex`
- `mermaid`

## For Agents

Repository-specific agent guidance lives in:

- [AGENTS.md](./AGENTS.md)

If you are editing content under `langs/`, `cs/`, or `tools/`, read the corresponding directory-level `AGENTS.md` first.
