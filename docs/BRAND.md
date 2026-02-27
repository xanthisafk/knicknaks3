# 🧩 Knicknaks — Brand Guidelines

## Voice & Personality

Knicknaks is **playful but not childish**. The brand speaks like a helpful friend who happens to be a developer — approachable, casual, and competent.

| ✅ Do                          | ❌ Don't                                    |
| ------------------------------ | ------------------------------------------- |
| "Oops! Something broke."       | "An unhandled exception occurred."          |
| "No data leaves your browser." | "Data processing is performed client-side." |
| "Free tools, no nonsense."     | "Complimentary utility applications."       |

## Visual Identity

### Chrome / Navigation / Marketing

The app chrome uses a **pencil-written, sketch aesthetic**:

- **Doodle underlines** on key headings
- **Sketch-style borders** on cards (optional, via `doodle-border` CSS class)
- **Notebook-paper lines** as subtle backgrounds (via `doodle-paper` CSS class)
- **Hand-drawn dividers** between sections (via `doodle-divider` CSS class)
- **Sparkle/star scatters** as decorative accents (via `doodle-scatter` CSS class)

### Tool UIs

Tool interfaces are **clean and professional**:

- No doodles or sketch elements inside tool UIs
- Clean typography (Inter for body text)
- Proper contrast and accessible colors
- Consistent spacing using design tokens
- Professional form controls and inputs

### Colors

| Token                 | Light        | Dark          | Usage                  |
| --------------------- | ------------ | ------------- | ---------------------- |
| `--color-primary-500` | Warm amber   | Warm amber    | Primary actions, links |
| `--surface-bg`        | Warm cream   | Dark charcoal | Page background        |
| `--surface-elevated`  | White        | Dark slate    | Cards, panels          |
| `--text-primary`      | Dark brown   | Light cream   | Main text              |
| `--text-secondary`    | Medium brown | Medium cream  | Supporting text        |

### Typography

| Font               | Usage                | Weight  |
| ------------------ | -------------------- | ------- |
| **Outfit**         | Headings, brand text | 500–800 |
| **Inter**          | Body text, UI labels | 400–700 |
| **JetBrains Mono** | Code, monospace data | 400–500 |

### Spacing

4px base grid: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

### Border Radius

| Token           | Size   | Usage                |
| --------------- | ------ | -------------------- |
| `--radius-sm`   | 4px    | Small elements, tags |
| `--radius-md`   | 8px    | Buttons, inputs      |
| `--radius-lg`   | 12px   | Cards, panels        |
| `--radius-xl`   | 16px   | Modals, large cards  |
| `--radius-full` | 9999px | Avatars, pills       |

### Shadows

Warm-tinted shadows using OKLCH with subtle amber undertone. Six levels: `xs` through `2xl`.

### Motion

| Token               | Duration | Usage                  |
| ------------------- | -------- | ---------------------- |
| `--duration-fast`   | 150ms    | Button hovers, toggles |
| `--duration-normal` | 250ms    | Panel transitions      |
| `--duration-slow`   | 400ms    | Modal entrances        |

All motion respects `prefers-reduced-motion: reduce`.

## Themes

- **Light mode**: Warm cream backgrounds, dark brown text
- **Dark mode**: Deep charcoal backgrounds, light cream text
- System preference auto-detected on first visit
- User choice persisted in localStorage

## Accessibility

- WCAG AA minimum contrast ratios
- Focus-visible outlines on all interactive elements
- Semantic HTML throughout
- ARIA attributes on all custom controls
- Keyboard navigable (Tab, Arrow keys, Enter, Escape)
- Screen reader announcements for dynamic content
