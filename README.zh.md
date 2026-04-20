# SocCSS

[English](./README.md)

- 10 分钟快速掌握计算机科学体系：助力 Vibecode 开发
- Study of the Computer Science System in 10min to vibecode


SocCSS 是一个以内容为中心的学习工作区，用于：
- 编程语言并排对比
- 计算机科学主题浏览
- 语言概念到 CS 概念的桥接阅读
- 基于 Markdown 内容的 AI 辅助概念分析
- 中英文双语阅读与运行时语言切换

项目将文档视为结构化数据。前端会从 `langs/`、`cs/` 和 `tools/` 读取 Markdown，解析标题和正文，再将其渲染为交互式阅读界面。



## 演示地址
- https://sotcss.vercel.app/
- https://evovoo.github.io/SotCSS/


## 仓库结构

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

## 内容模型

### `langs/`

每个语言目录必须包含：
- `base.md`
- `intermediate.md`
- `advanced.md`

可选本地化文件：
- `base.zh.md`
- `intermediate.zh.md`
- `advanced.zh.md`

说明：
- 同一类文档的 `##` 标题必须在不同语言之间严格对齐
- 只有必需英文文档齐全的语言目录才会被前端自动发现

### `cs/`

`cs/` 当前按以下分类组织：
- `data-structures`
- `algorithms`
- `operating-systems`
- `networks`

所有 CS 文档采用统一的五段结构：
- `## 1. What`
- `## 2. Why`
- `## 3. How`
- `## 4. Better`
- `## 5. Beyond`

### `tools/`

`tools/` 下的文档也遵循同样的五段结构：
- `## 1. What`
- `## 2. Why`
- `## 3. How`
- `## 4. Better`
- `## 5. Beyond`

工具文档要求：
- 共享标题必须保持英文完全一致
- `## 3. How` 必须包含可运行命令或代码片段

## Markdown 功能

支持：
- 带语言标识的 fenced code block
- Mermaid：` ```mermaid `
- LaTeX：`remark-math` + `rehype-katex`
- Tabs 多语言代码示例

示例：

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

## 前端结构

关键模块：
- `src/lib/mdx.ts`
  负责文件发现、locale 回退和内容读取。
- `src/lib/i18n.ts`
  负责语言解析、查询参数传递和共享文案。
- `src/lib/cs-links.ts`
  负责概念映射与内联概念链接逻辑。
- `src/components/markdown-pane.tsx`
  主阅读面板渲染器。
- `src/components/rich-markdown-preview.tsx`
  抽屉预览渲染器。

## 本地开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 打开应用
```text
http://localhost:3000
```

### 构建静态站点
```bash
npm run build
```

## GitHub Pages 部署

项目已配置为 GitHub Pages 静态导出。

- Workflow：`.github/workflows/deploy-pages.yml`
- 构建输出目录：`out/`
- 线上地址：`https://evouo.github.io/SotCSS/`

推送到 `main` 后会自动触发部署。

## 内容编写与贡献

### 添加新语言
1. 阅读 `langs/AGENTS.md`
2. 创建 `langs/<language>/base.md`
3. 创建 `langs/<language>/intermediate.md`
4. 创建 `langs/<language>/advanced.md`
5. 条件允许时补充 `.zh.md`
6. 确保 `##` 标题与现有语言严格对齐

### 添加新的 CS 主题
1. 阅读 `cs/AGENTS.md`
2. 选择正确的分类目录
3. 使用稳定的 kebab-case 文件名
4. 遵循统一的五段结构
5. 如有需要，更新 `src/lib/cs-links.ts`

### 添加新的工具文档
1. 阅读 `tools/AGENTS.md`
2. 在 `tools/<tool>/` 下创建或更新文档
3. 保持统一五段标题结构
4. 在 `## 3. How` 中放入可运行示例
5. 条件允许时补充 `.zh.md`

## 验证

前端或内容模型有明显改动后，至少运行：

```bash
npm run build
```

本地化更新后，建议额外检查：

```bash
rg "\?\?" langs cs tools -g "*.zh.md"
```

## 技术栈

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

## Agent 指南

仓库专用规则位于：

- [AGENTS.md](./AGENTS.md)

如果要修改 `langs/`、`cs/` 或 `tools/` 下的内容，请先阅读各目录中的 `AGENTS.md`。
