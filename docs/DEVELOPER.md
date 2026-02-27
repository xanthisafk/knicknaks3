# 🧩 Knicknaks — Developer Guide

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type-check
npm run check
```

## Architecture

Knicknaks is built with **Astro + React** using the island architecture:

- **Astro** handles routing, static page generation, and SEO
- **React** is used only for interactive tool components (hydrated on demand)
- **Tailwind CSS v4** provides utility-first styling with design tokens
- **Zod** validates tool metadata at build time

### Key Principle

Pages ship **zero JavaScript** by default. React only loads when a tool component needs to hydrate. This keeps the initial page load fast and ensures all content is crawlable by search engines.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Box, Container, Panel, Card, Section, Grid, AppShell
│   ├── ui/              # Button, Input, Slider, Toggle, Tabs, Modal, Toast, Tooltip
│   └── advanced/        # ErrorBoundary, ToolWrapper
├── hooks/               # useTheme, useFavorites, useRecentTools
├── layouts/             # BaseLayout.astro (HTML shell)
├── lib/                 # search.ts, storage.ts, utils.ts
├── pages/
│   ├── index.astro      # Homepage
│   └── tools/[slug].astro  # Dynamic tool pages
├── styles/
│   ├── global.css       # Tailwind + design tokens + base styles
│   └── doodles.css      # Decorative sketch layer
├── tools/               # Tool definitions and components
│   ├── _types.ts        # ToolDefinition interface + Zod schema
│   ├── _registry.ts     # Auto-discovery system
│   └── {tool-slug}/     # Each tool folder
└── workers/             # Web Worker patterns
```

## Creating a New Tool

### Option A: Use the scaffolder

```bash
npm run new-tool
```

This interactive script will prompt you for details and generate the files.

### Option B: Manual creation

1. Create a new folder in `src/tools/`:

   ```
   src/tools/my-tool/
   ├── index.ts          # ToolDefinition export
   └── MyToolTool.tsx    # React component
   ```

2. Export a `definition` object from `index.ts`:

   ```typescript
   import type { ToolDefinition } from "@/tools/_types";

   export const definition: ToolDefinition = {
     name: "My Tool",
     slug: "my-tool",
     description: "A brief description of what the tool does.",
     category: "converters",
     icon: "🔧",
     keywords: ["keyword1", "keyword2"],
     component: () => import("./MyToolTool"),
   };
   ```

3. Create your React component in `MyToolTool.tsx`:

   ```tsx
   export default function MyToolTool() {
     return <div>Your tool UI here</div>;
   }
   ```

4. **That's it!** Run `npm run dev` — the tool automatically appears in:
   - ✅ Tool listing on the homepage
   - ✅ Its own route at `/tools/my-tool`
   - ✅ Search results
   - ✅ Sitemap
   - ✅ SEO metadata
   - ✅ Navigation
   - ✅ Related tools section

### Tool Definition Fields

| Field             | Required | Description                      |
| ----------------- | -------- | -------------------------------- |
| `name`            | ✅       | Display name                     |
| `slug`            | ✅       | URL-safe unique identifier       |
| `description`     | ✅       | Short description (card display) |
| `category`        | ✅       | One of the predefined categories |
| `icon`            | ✅       | Emoji icon                       |
| `keywords`        | ✅       | Search keywords array            |
| `component`       | ✅       | Lazy import function             |
| `longDescription` |          | Full description (tool page)     |
| `tags`            |          | Filterable tags                  |
| `faq`             |          | FAQ items (generates schema)     |
| `howItWorks`      |          | Explanation text                 |
| `relatedTools`    |          | Array of related tool slugs      |
| `capabilities`    |          | Feature flags                    |
| `lastUpdated`     |          | ISO date string                  |

### Categories

`encoders` · `generators` · `converters` · `formatters` · `validators` · `calculators` · `text` · `media` · `network` · `crypto` · `dev` · `other`

## Component Library

Use the built-in components for consistent UI:

```tsx
import { Button, Input, Toggle, Tabs, Slider } from "@/components/ui";
import { Panel, Card, Grid, Container } from "@/components/layout";
```

See `src/components/ui/` and `src/components/layout/` for full component APIs.

## Design Tokens

All design tokens are CSS custom properties defined in `src/styles/global.css`. Use them via `var(--token-name)` in Tailwind's arbitrary values:

```tsx
<div className="bg-[var(--surface-elevated)] text-[var(--text-primary)]">
  ...
</div>
```

## Build & Deploy

```bash
npm run build    # Outputs to dist/
```

The output is fully static HTML, CSS, and JS — deploy to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.).
