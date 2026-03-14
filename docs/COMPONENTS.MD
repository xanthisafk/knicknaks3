# Knicknaks Component Library Documentation

Welcome to the Knicknaks Component Library documentation! This document provides detailed information about each component available in the `src/components` directory, including the problem it solves, its props, and how to use it.

## Table of Contents

- [UI Components](#ui-components)
  - [Accordion](#accordion)
  - [AlertDialog](#alertdialog)
  - [Badge](#badge)
  - [Button](#button)
  - [Checkbox](#checkbox)
  - [CommandPalette](#commandpalette)
  - [CopyButton](#copybutton)
  - [DateInput](#dateinput)
  - [Input](#input)
  - [Label](#label)
  - [Modal](#modal)
  - [ProgressBar](#progressbar)
  - [RadioGroup & Radio](#radiogroup--radio)
  - [Select (Compound)](#select-compound)
  - [Slider & SliderRow](#slider--sliderrow)
  - [Spinner](#spinner)
  - [StatBox](#statbox)
  - [Tabs (Compound)](#tabs-compound)
  - [Toast](#toast)
  - [Toggle & ToggleGroup](#toggle--togglegroup)
  - [Tooltip](#tooltip)
- [Advanced Components](#advanced-components)
  - [ColorCard](#colorcard)
  - [CurrencySelector](#currencyselector)
  - [ErrorBoundary](#errorboundary)
  - [FileDropZone & PdfDropZone](#filedropzone--pdfdropzone)
  - [FunStatCard](#funstatcard)
  - [GpsMap](#gpsmap)
  - [PdfPreviewPanel (Compound)](#pdfpreviewpanel-compound)
  - [ResultRow](#resultrow)
  - [ToolWrapper](#toolwrapper)
- [Layout Components](#layout-components)
  - [AppShell](#appshell)
  - [Layout (Container, Box, Panel)](#layout-container-box-panel)
- [Blog Components](#blog-components)
  - [BlogSearch](#blogsearch)
  - [MDXComponents](#mdxcomponents)

---

## UI Components

### Accordion

**What it solves:** Provides a collapsible content area to hide/show details and save vertical screen space.
**Import:** `@/components/ui/Accordion`

```tsx
import { Accordion } from '@/components/ui/Accordion';

// Example Usage
<Accordion
  label="Advanced Settings"
  content="Here are the advanced settings..."
  labelEmoji="⚙️"
  defaultOpen={false}
/>
```

**Props:**
- `label` (string): The title of the accordion.
- `content` (string | ReactNode): The body content.
- `labelIcon` (LucideIcon): Optional icon for the label.
- `labelEmoji` (string): Optional emoji for the label.
- `contentType` ("text" | "markdown" | "html"): How to render the content.
- `defaultOpen` (boolean): Initial state.

### AlertDialog

**What it solves:** A dialog specifically for alerting the user about an action that needs to be acknowledged (like destructive actions).
**Import:** `@/components/ui/AlertDialog`

```tsx
import { AlertDialog } from '@/components/ui/AlertDialog';

// Example Usage
<AlertDialog
  isOpen={true}
  onClose={() => setOpen(false)}
  titleText="Delete Project?"
  bodyText="This action cannot be undone."
  emoji="⚠️"
  primaryAction={{
    label: "Delete",
    variant: "danger",
    onClick: () => deleteProject()
  }}
  secondaryAction={{
    label: "Cancel",
    onClick: () => setOpen(false)
  }}
/>
```

### Badge

**What it solves:** Displays a small status indicator or tag (e.g., "New", " Beta", "Warning").
**Import:** `@/components/ui/Badge`

```tsx
import { Badge } from '@/components/ui/Badge';

// Example Usage
<Badge variant="primary" text="Pro Feature" emoji="✨" />
```

**Props:**
- `variant` ("primary" | "secondary" | "warning" | "danger" | "ghost"): Color variant.
- `icon` (LucideIcon), `emoji` (string): Visual indicator.
- `text` (string): Badge label.
- `iconPos` ("left" | "right"): Where the icon appears.

### Button

**What it solves:** A highly versatile, accessible standard button with various sizes, variants, and icon support.
**Import:** `@/components/ui/Button`

```tsx
import { Button } from '@/components/ui/Button';

// Example Usage
<Button variant="primary" size="md" emoji="🚀" onClick={launch}>
  Launch Rocket
</Button>
```

**Props:**
- `variant` ("primary" | "secondary" | "warning" | "danger" | "ghost"): Color scheme.
- `size` ("xs" to "xl"): Size tier.
- `icon` (LucideIcon), `emoji` (string), `iconPos` ("left"| "right"): Iconography.
- `url` (string): If provided, renders as an anchor link instead of a button.

### Checkbox

**What it solves:** A styled, accessible alternative to the native `<input type="checkbox">`.
**Import:** `@/components/ui/Checkbox`

```tsx
import { Checkbox } from '@/components/ui/Checkbox';

// Example Usage
<Checkbox
  label="Accept Terms"
  description="You must accept the Terms of Service."
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

**Props:**
- Extends standard `InputHTMLAttributes`.
- `label` (string), `description` (string), `error` (string): Helper texts.
- `size` ("sm" | "md" | "lg").

### CommandPalette

**What it solves:** A global "Cmd+K" fuzzy-search modal to navigate to tools, options, or settings quickly.
**Import:** `@/components/ui/CommandPalette`

**Props:**
- `items` (CommandItem[]): List of searchable items (`{ id, label, onSelect }`).
- `isOpen` (boolean): Controlled visibility.

### CopyButton

**What it solves:** A dedicated button that copies text to the user's clipboard and momentarily shows a "Copied!" state.
**Import:** `@/components/ui/CopyButton`

```tsx
import { CopyButton } from '@/components/ui/CopyButton';

// Example
<CopyButton text="https://example.com" label="Copy Link" copiedLabel="Link Copied!" />
```

### DateInput & Input

**What it solves:** Standardized inputs (text, number, date) that include built-in labels, suffixes, prefixes, and error messages.
**Import:** `@/components/ui/Input` (or `DateInput`)

```tsx
import { Input } from '@/components/ui/Input';

// Example
<Input
  label="Email Address"
  type="email"
  placeholder="john@example.com"
  suffix=".com"
/>
```

### Label

**What it solves:** A standalone styled label with optional tooltips/icons, used primarily by other form elements.
**Import:** `@/components/ui/Label`

### Modal

**What it solves:** A general-purpose overlay center-screen dialog for interactions.
**Import:** `@/components/ui/Modal`

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal isOpen={open} onClose={() => setOpen(false)} title="Settings">
  <p>Modal content here</p>
</Modal>
```

### ProgressBar

**What it solves:** Indicates progress of a long-running background task or completion percentage.
**Import:** `@/components/ui/ProgressBar`

```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar value={45} max={100} variant="success" showLabel={true} />
```

### RadioGroup & Radio

**What it solves:** Accessible grouping of radio buttons. Can be rendered as standard separated buttons or joined pill segments.
**Import:**
- `@/components/ui/radio/RadioGroup`
- `@/components/ui/radio/Radio`

```tsx
import { RadioGroup } from '@/components/ui/radio/RadioGroup';
import { Radio } from '@/components/ui/radio/Radio';

<RadioGroup value={theme} onValueChange={setTheme} label="Theme">
  <Radio value="light" label="Light" />
  <Radio value="dark" label="Dark" />
</RadioGroup>
```

### Select (Compound)

**What it solves:** A fully styled, accessible custom dropdown/select menu component offering `Select`, `SelectTrigger`, `SelectContent`, `SelectGroup`, and `SelectItem`.
**Import:** `@/components/ui/select/*`

```tsx
import { Select } from '@/components/ui/select/Select';
import { SelectTrigger } from '@/components/ui/select/SelectTrigger';
import { SelectContent } from '@/components/ui/select/SelectContent';
import { SelectItem } from '@/components/ui/select/SelectItem';
import { SelectValue } from '@/components/ui/select/SelectValue';

<Select value={color} onValueChange={setColor}>
  <SelectTrigger><SelectValue placeholder="Pick a color" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="red">Red</SelectItem>
    <SelectItem value="blue">Blue</SelectItem>
  </SelectContent>
</Select>
```

### Slider & SliderRow

**What it solves:** A range slider for numeric inputs. `SliderRow` provides a compact layout with a label and numeric value display inline.
**Import:** `@/components/ui/Slider`

```tsx
import { Slider } from '@/components/ui/Slider';

<Slider label="Volume" min={0} max={100} value={volume} onChange={setVolume} />
```

### Spinner

**What it solves:** Simple loading indicator animation.
**Import:** `@/components/ui/Spinner`

### StatBox

**What it solves:** Displays a big number/stat with an optional tooltip or link.
**Import:** `@/components/ui/StatBox`

```tsx
import StatBox from '@/components/ui/StatBox';

<StatBox label="Total Users" value="1,200" tooltip="Registered users active in 30 days" />
```

### Tabs (Compound)

**What it solves:** Switches between different views or content panes seamlessly.
**Import:** `@/components/ui/tab/*`

```tsx
import { Tabs } from '@/components/ui/tab/Tabs';
import { TabList } from '@/components/ui/tab/TabList';
import { Tab } from '@/components/ui/tab/Tab';
import { TabPanels } from '@/components/ui/tab/TabPanels';
import { TabPanel } from '@/components/ui/tab/TabPanel';

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabList>
    <Tab value="code">Code</Tab>
    <Tab value="preview">Preview</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="code">Code goes here</TabPanel>
    <TabPanel value="preview">Preview here</TabPanel>
  </TabPanels>
</Tabs>
```

### Toast

**What it solves:** Pops up brief, non-blocking notification messages ("Item created", "Error saving").
**Import:** `@/components/ui/Toast`

*Note: Used via context: `const { toast } = useToast(); toast("Success!", "success")`*

### Toggle & ToggleGroup

**What it solves:** A switch (Toggle) or a group of selectable text options (`ToggleGroup` allows multiple values via array).
**Import:** `@/components/ui/Toggle`

```tsx
import { Toggle } from '@/components/ui/Toggle';

<Toggle checked={true} onChange={setVal} label="Enable Auto-Save" />
```

### Tooltip

**What it solves:** Provides a floating text tip on hover for icon-only buttons or context-heavy text.
**Import:** `@/components/ui/Tooltip`

```tsx
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="Shows advanced settings">
  <button>⚙️</button>
</Tooltip>
```

---

## Advanced Components

### ColorCard
**What it solves:** Displays a large color swatch and cycle formats (HEX, RGB, HSL) with click-to-copy.
**Import:** `@/components/advanced/ColorCard`
**Props:** `color`, `label`, `defaultFormat`, `className`

### CurrencySelector
**What it solves:** Exposes standard global currency objects and symbols.
**Import:** `@/components/advanced/CurrencySelector`

### ErrorBoundary
**What it solves:** Catches generic React rendering errors to prevent crash loops and display a fallback UI.
**Import:** `@/components/advanced/ErrorBoundary`

### FileDropZone & PdfDropZone
**What it solves:** A drag-and-drop region for files, specifically tailored for general files (`FileDropZone`) or PDFs (`PdfDropZone`).
**Import:** `@/components/advanced/PdfDropZone`
**Example:** `<PdfDropZone onFiles={(f) => setFiles(f)} multiple />`

### FunStatCard
**What it solves:** Highly styled, animated analytics card used for highlighting key metric values.
**Import:** `@/components/advanced/FunStatCard`

### GpsMap
**What it solves:** Uses Leaflet/OpenStreetMap to plot a coordinate map instance.
**Import:** `@/components/advanced/GpsMap`
**Example:** `<GpsMap lat={37.77} lon={-122.41} />`

### PdfPreviewPanel (Compound)
**What it solves:** Offers an entire UI wrapper and thumbnail generator for rendering paginated visual previews for PDF tools.
**Import:** `@/components/advanced/Pdf/PdfPreviewPanel`

### ResultRow
**What it solves:** Displays an output/setting pair (e.g. key-value) with an inline copy button.
**Import:** `@/components/advanced/ResultRow`

### ToolWrapper
**What it solves:** Wraps dynamically imported Tools to show a loading skeleton during async hydration.
**Import:** `@/components/advanced/ToolWrapper`

---

## Layout Components

### AppShell
**What it solves:** Provides the top-level application wrapper, including the sticky navigation header, logo, and theme-toggle.
**Import:** `@/components/layout/AppShell`

### Layout (Container, Box, Panel)
**What it solves:** A collection of highly reusable structural components.
- `Container`: Centered maximum width standardizer.
- `Panel`: An elevated white/dark card with padding and borders.
- `Box`: A polymorphic generic wrapper `div/section/main`.
**Import:** `@/components/layout/Layout`

---

## Blog Components

### BlogSearch
**What it solves:** Fuzzy-search powered by `fuse.js` with `Cmd+K` keyboard shortcut bindings to search across blog posts.
**Import:** `@/components/blog/BlogSearch`

### MDXComponents
**What it solves:** Custom styled React components injected into MDX renders (e.g. `ToolLink`, `Emoji`, `Screenshot`).
**Import:** `@/components/blog/MDXComponents`

---
*Documentation Generated Successfully.*
