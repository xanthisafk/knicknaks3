# 🧠 MASTER PROMPT — Build “Knicknaks” Skeleton

You are a senior frontend architect and product designer.

Your task is to design and generate the complete production-ready skeleton for a project called:

# 🧩 Knicknaks

Knicknaks is a **free, offline-capable, static, client-only web app** that contains multiple useful day-to-day tools.

This is not a prototype.
This is the foundation of a long-term extensible platform.

You must think deeply about:

- Architecture
- Performance
- SEO
- Offline-first strategy
- Plugin/tool system
- Developer experience
- Branding system
- Accessibility
- Scalability

---

# 1️⃣ Core Requirements

## Tech Stack

You must choose and justify one of:

- Astro + React (preferred if better for SEO & static generation)
- Vite + React (if you strongly justify it)

Decision criteria:

- SEO heavy
- Static build
- Lazy loading tools
- Initial JS < 50kb
- Offline-first
- Tool-level routes

You must explain your reasoning.

---

# 2️⃣ Performance Requirements

- Initial load must be **under 50kb JS**
- Tools must be lazy loaded
- Heavy libraries (e.g. Monaco editor) must load only when needed
- Use tree-shakeable libraries
- TailwindCSS required
- Component library allowed (e.g. shadcn)
- Bundle splitting required
- Use modern build targets
- Provide bundle strategy explanation

---

# 3️⃣ Offline Strategy

- Must use Service Worker
- App shell pre-cached
- Tools cached progressively
- Offline fallback page
- Explain caching layers
- Use Workbox or equivalent
- Must not break static SEO

---

# 4️⃣ The Tool System (Very Important)

At the end of this project, I should be able to:

1. Create a new folder inside `/tools`
2. Add a component file
3. Export a `ToolDefinition`
4. Build the project
5. The tool automatically appears in:
   - Tool listing
   - Search
   - Its own route
   - Sitemap
   - SEO metadata
   - Navigation
   - Related tools section

No manual registration allowed.

You must implement auto-discovery via file conventions (e.g., import.meta.glob or Astro equivalent).

---

## Tool Definition Interface

You may improve this interface.

```ts
export interface ToolDefinition {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: ReactNode;
  component: ReactNode;
  keywords: string[];

  // SEO
  faq?: {
    question: string;
    answer: string;
  }[];

  howItWorks?: string;
  relatedTools?: string[];
  ogImage?: string;
  lastUpdated?: string;
}
```

Enhance this if needed.

Add:

- Schema.org support
- Capability flags
- Optional worker support
- Optional install hooks

---

# 5️⃣ Brand Identity

Knicknaks is:

- Playful but not childish
- Pencil-written notes aesthetic
- Doodles
- Sketch elements
- Casual voice

BUT:

Tools themselves use:

- Clean typography
- Accessible colors
- Professional UI
- Proper contrast

We support:

- Dark mode
- Light mode
- Reduced motion
- Accessibility (WCAG AA minimum)

You must define:

- Design tokens
- Typography system
- Color variables
- Motion system
- Border radius system
- Shadow system
- Doodle layer system
- Icon system

Create a brand guideline section inside the project.

---

# 6️⃣ SEO Requirements

Each tool must:

- Have its own static route
- Have pre-rendered HTML
- Include:
  - Title
  - Meta description
  - OpenGraph tags
  - Twitter cards
  - Canonical URL
  - JSON-LD structured data
  - FAQ schema (if provided)

Project must:

- Auto generate sitemap
- Be crawl-friendly
- Avoid hydration blocking SEO

Explain SEO architecture.

---

# 7️⃣ Core Platform Features

Include:

- Tool categories
- Tool search (fuzzy search, client-side)
- Tag filtering
- Related tools section
- Recently used tools (localStorage)
- Favorite tools (localStorage)
- Error boundary per tool
- Suspense fallback
- Command palette (optional but encouraged)

---

# 8️⃣ Components To Include

You must build reusable components:

Layout:

- Box
- Panel
- Card
- Section
- Container
- Grid
- AppShell

UI:

- Button
- Input
- Slider (beautiful)
- Toggle
- Tabs
- Modal
- Toast
- Tooltip

Advanced:

- Monaco-powered editor component (lazy loaded)
- ErrorBoundary component
- ToolWrapper component
- SEO component
- StructuredData component

All must be production-ready.

---

# 9️⃣ Folder Structure

Define full folder structure.

Example (you may improve it):

```
/src
  /app
  /components
  /layout
  /tools
  /lib
  /styles
  /hooks
  /workers
```

Explain reasoning.

---

# 🔟 Developer Experience

Include:

- Tool scaffolding script
- Type-safe metadata validation (Zod encouraged)
- Dev warnings for duplicate slugs
- Strict typing everywhere
- Easy extension model
- Clear documentation inside project

---

# 11️⃣ Accessibility

Must include:

- Semantic HTML
- ARIA best practices
- Focus management
- Keyboard navigation
- Reduced motion handling
- Color contrast compliance
- Screen reader considerations

---

# 12️⃣ Deliverables

You must output:

1. Architecture explanation
2. Framework choice reasoning
3. Folder structure
4. Tool auto-registration system code
5. Design token system
6. Example tool implementation
7. Service worker structure
8. SEO strategy implementation
9. Performance strategy explanation
10. Brand guidelines section
11. Component system skeleton
12. Developer guide section

This should feel like the beginning of a real open-source project.

Not a tutorial.
Not pseudocode.
Production-minded structure.

---

# Constraints

- No unnecessary libraries
- No bloated runtime
- No manual tool registration
- No ignoring SEO
- No SPA-only approach unless justified
- Must be future-proof
- Must scale to 100+ tools

---

Think carefully before generating.

Make intelligent architectural decisions.

This is the foundation of Knicknaks.

Build it like a senior engineer would.
