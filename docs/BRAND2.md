# 🧩 Knicknaks — Brand Guidelines (v2)

## Voice & Personality

Knicknaks is **playful but not childish**. The brand speaks like a helpful friend who happens to be a developer — approachable, casual, and competent.

| ✅ Do                          | ❌ Don't                                    |
| ------------------------------ | ------------------------------------------- |
| "Oops! Something broke."       | "An unhandled exception occurred."          |
| "No data leaves your browser." | "Data processing is performed client-side." |
| "Free tools, no nonsense."     | "Complimentary utility applications."       |

## Visual Identity

### App Chrome / Navigation / Marketing

The app chrome embraces a **sketch & doodle aesthetic** alongside interactive playfulness:

- **Brand Typography**: "Gloria Hallelujah" is used for the logo and brand identity moments.
- **Emoji First**: We use "Noto Color Emoji" (`font-emoji`) consistently for icons, status indicators, and decorative elements (e.g., the interactive 🪀 yoyo logo, 🌞/🌚 theme toggles, and tool status icons).
- **Doodle Elements** (via CSS classes):
  - `.doodle-underline`: Sketch-style accents under headings.
  - `.doodle-border`: Hand-drawn, dashed border styles.
  - `.doodle-paper`: Subtle dotted-grid notebook paper backgrounds.
  - `.doodle-divider`: Hand-drawn zigzag section dividers.
  - `.doodle-scatter`: Sparkle/star scatters (`✦`) with a twinkling animation.
  - `.doodle-hero`: Wavy sketch borders ending hero sections.
- **Interactive Play**: Elements like the header yoyo icon feature physics-based animation (device tilt on mobile, gentle wobble on desktop) to delight users without being intrusive.

### Tool UIs

Tool interfaces are **clean, accessible, and professional**:

- No doodles or sketch elements inside tool UIs.
- Clean typography (`Inter` for body text).
- Proper contrast and accessible colors.
- Consistent layout using established spacing design tokens.
- Professional form controls and Command Palette integration for global search.

## Colors & Theming

Theme variables dynamically switch based on `data-theme="light|dark"`.

| Token Type | Light Mode | Dark Mode | Description |
| --- | --- | --- | --- |
| **Primary** (`--color-primary-*`) | Warm amber (`oklch` hue `50`) | Warm amber (`oklch` hue `50`) | Primary actions, buttons, active states, focus rings. |
| **Accent** (`--color-accent-*`) | Indigo/Blue (`oklch` hue `250`) | Indigo/Blue (`oklch` hue `250`) | Supporting highlights, secondary actions, informational badges. |
| **Surfaces** | Warm cream (`oklch` hue `65`) | Dark slate (`oklch` hue `260`) | Layered surfaces (`bg`, `primary`, `secondary`, `elevated`, `overlay`). Dark mode has a cool slate undertone. |
| **Text** | Dark brown / slate | Light cream / grey | `primary`, `secondary`, `tertiary`, and `inverse` text ensuring readable contrast. |
| **Borders** | Light beige | Deep slate | `default`, `hover`, and `focus` states. |

**System Colors:**
- **Success**: Green (`oklch` hue `145`)
- **Warning**: Yellow-Orange (`oklch` hue `75`)
- **Error**: Red (`oklch` hue `25`)
- **Info**: Blue (`oklch` hue `240`)

## Typography

| Font | Usage | Weight | CSS Variable |
| --- | --- | --- | --- |
| **Gloria Hallelujah** | Logo, key brand moments | 400 | `--font-brand` |
| **Outfit** | Headings, section titles | 500-800 | `--font-heading` |
| **Inter** | Body text, UI labels | 400-700 | `--font-body` |
| **JetBrains Mono** | Code snippets, technical data | 400-500 | `--font-mono` |
| **Noto Color Emoji** | Consistent emojis across devices | 400 | `--font-emoji` |

## Layout & Components

### Spacing
Uses a strict 4px base grid spacing mapping tightly to Tailwind (`--spacing-1` = `4px` through `--spacing-24` = `96px`).

### Border Radius
- `--radius-sm` (4px): Small elements, tags, focus rings.
- `--radius-md` (8px): Buttons, standard inputs.
- `--radius-lg` (12px): Standard panels, cards.
- `--radius-xl` (16px), `--radius-2xl` (24px): Modals, hero elements, large feature cards.
- `--radius-full` (9999px): Avatars, pill badges.

### Shadows
Warm-tinted shadows in both themes using `oklch` with a subtle amber undertone. Progressive depth levels: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.

### Motion and Transitions
All motion respects `prefers-reduced-motion: reduce`.
- `--duration-fast` (150ms): Quick interactions (button hovers, toggles, form feedback).
- `--duration-normal` (250ms): Standard UI updates, panel slides, base transitions.
- `--duration-slow` (400ms): Meaningful reveals, modal entrances, complex layout changes.
- Custom easing curves defined (`--ease-out`, `--ease-in-out`).

### Component Guidelines
- **Inline Styling for Theming**: Dynamic theme colors within components are often applied via CSS variables directly in inline `style="..."` attributes (e.g. `style="color: var(--text-primary); background: var(--surface-elevated)"`) alongside Tailwind utility classes for structure. This ensures highly reliable, native multi-theme reactivity.
- **Focus States**: Native interactive elements use an offset 2px focus ring (`--border-focus`) customized with `--ring-color` and `--ring-offset`.
- **Markdown / Prose**: Content rendering leverages Tailwind Typography (`.prose`) intricately mapped to our CSS custom properties, ensuring inline code blocks and syntax highlighting gracefully adapt across light and dark modes.

## Accessibility

- WCAG AA minimum contrast ratios for all core content.
- Support for system color scheme preference and localStorage toggles.
- Strong `focus-visible` styling on all interactive elements.
- Semantic HTML throughout the application.
- Fully keyboard navigable interfaces (Tab, Arrow keys, Enter, Escape, Command Palette `⌘K`).
- Screen reader announcements for dynamic content and ARIA attributes on custom controls.
