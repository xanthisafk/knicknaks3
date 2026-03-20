|name|import path|[{propName, propAcceptedvalue}]|
|---|---|---|
|CodeBlock|@/components/advanced/CodeBlock|[{ code, string }, { langHint, string }, { lightTheme, BundledTheme }, { darkTheme, BundledTheme }, { wrapLines, boolean }, { label, string }, { maxHeight, string }, { className, string }, { style, CSSProperties }]|
|ColorCard|@/components/advanced/ColorCard|[{ color, string }, { label, string }, { defaultFormat, ColorFormat }, { className, string }]|
|ColorPickerButton|@/components/advanced/ColorPickerButton|[{ title, unknown }, { value, unknown }, { onChange, unknown }, { icon, unknown }, { underlineColor, unknown }]|
|ColorPickerSwatch|@/components/advanced/ColorPickerSwatch|[{ value, string }, { onChange, (value: string) => void }, { label, string }, { placeholder, string }, { hint, string }, { swatchSize, "sm" | "md" | "lg" }, { disabled, boolean }, { className, string }]|
|CurrencySelector|@/components/advanced/CurrencySelector|[{ value, Currency }, { onChange, (currency: Currency) => void }, { compact, boolean }]|
|ErrorBoundary|@/components/advanced/ErrorBoundary|[{ children, ReactNode }, { fallback, ReactNode }, { toolName, string }]|
|FileDropZone|@/components/advanced/FileDropZone|[{ multiple, false }, { onUpload, (payload: { file: File }]|
|FunStatCard|@/components/advanced/FunStatCard|[]|
|GpsMap|@/components/advanced/GpsMap|[{ lat, unknown }, { lon, unknown }]|
|InfoTooltip|@/components/advanced/InfoTooltip|[]|
|PdfDropZone|@/components/advanced/PdfDropZone|[{ onFiles, (files: File[]) => void }, { multiple, boolean }, { accept, string }, { maxFiles, number }, { children, ReactNode }, { className, string }]|
|EditorToolbar|@/components/advanced/Pdf/EditorToolbar|[{ editor, unknown }, { activeFont, unknown }, { onFontChange, unknown }]|
|PageCard|@/components/advanced/Pdf/PageCard|[{ result, ThumbnailResult }, { selected, boolean }, { onClick, (pageNumber: number) => void }, { renderBadge, PdfPreviewProps["renderBadge"] }, { renderOverlay, PdfPreviewProps["renderOverlay"] }]|
|PageEditor|@/components/advanced/Pdf/PageEditor|[{ pageData, { dataUrl: string }]|
|PageEditorWithFocus|@/components/advanced/Pdf/PageEditorWithFocus|[{ pageData, { dataUrl: string }]|
|PagePreview|@/components/advanced/Pdf/PagePreview|[{ file, unknown }, { selectedPages, unknown }, { onPageClick, unknown }, { onThumbnailReady, unknown }, { scale, unknown }, { thumbnailFormat, unknown }, { columns, unknown }, { renderBadge, unknown }, { renderOverlay, unknown }, { className, unknown }]|
|PageSkeleton|@/components/advanced/Pdf/PageSkeleton|[{ index, unknown }]|
|PdfPreviewPanel|@/components/advanced/Pdf/PdfPreviewPanel|[{ file, unknown }, { onClear, unknown }, { selectedPages, unknown }, { onPageClick, unknown }, { scale, unknown }, { thumbnailFormat, unknown }, { columns, unknown }, { renderBadge, unknown }, { renderOverlay, unknown }, { pageCountLabel, unknown }, { gridClassName, unknown }]|
|ToolbarButton|@/components/advanced/Pdf/ToolbarButton|[{ active, unknown }, { onClick, unknown }, { title, unknown }, { children, unknown }, { disabled, unknown }]|
|ResultRow|@/components/advanced/ResultRow|[{ label, unknown }, { value, unknown }, { externalLink, unknown }]|
|SplitCompare|@/components/advanced/SplitCompare|[{ leftImage, string }, { rightImage, string }, { leftLabel, string }, { rightLabel, string }, { className, string }]|
|ToolCard|@/components/advanced/ToolCard.astro|[{ tool, ToolDefinition }, { previewOnly, boolean }, { homeCard, boolean }]|
|ToolWrapper|@/components/advanced/ToolWrapper|[{ tool, ToolDefinition }]|
|BlogSearch|@/components/blog/BlogSearch|[{ posts, SearchPost[] }]|
|BlogSearchContainer|@/components/blog/BlogSearchContainer.astro|[]|
|FeaturedPostCard|@/components/blog/FeaturedPostCard.astro|[{ post, any }]|
|MDXComponents|@/components/blog/MDXComponents|[]|
|StickyPostCard|@/components/blog/StickyPostCard.astro|[{ post, any }]|
|AppShell|@/components/layout/AppShell|[{ children, ReactNode }]|
|Divider|@/components/layout/Divider|[]|
|Footer|@/components/layout/Footer.astro|[]|
|GlobalPalette|@/components/layout/GlobalPalette|[{ blogPosts, SearchPost[] }, { isBlog, boolean }]|
|Header|@/components/layout/Header.astro|[{ activeTab, "tools" | "blog" }]|
|Layout|@/components/layout/Layout|[{ children, ReactNode }, { className, string }, { as, keyof HTMLElementTagNameMap }]|
|Accordion|@/components/ui/Accordion.astro|[{ label, string }, { content, string }, { labelIcon, string }, { labelEmoji, string }, { contentType, "text" | "markdown" | "html" }, { defaultOpen, boolean }, { class, string }]|
|Accordion|@/components/ui/Accordion|[{ label, string }, { content, string | ReactNode }, { labelIcon, LucideIcon }, { labelEmoji, string }, { contentType, ContentType }, { defaultOpen, boolean }, { className, string }]|
|AlertDialog|@/components/ui/AlertDialog|[{ isOpen, boolean }, { onClose, () => void }, { titleText, string }, { bodyText, string | ReactNode }, { primaryAction, AlertAction }, { secondaryAction, AlertAction }, { icon, LucideIcon }, { emoji, string }, { footerText, string }, { className, string }]|
|Badge|@/components/ui/Badge|[{ variant, BadgeVariant }, { icon, LucideIcon }, { emoji, string }, { text, string }, { iconPos, IconPosition }, { className, string }]|
|Button|@/components/ui/Button|[{ variant, ButtonVariant }, { size, ButtonSize }, { icon, LucideIcon }, { emoji, string }, { iconPos, IconPosition }, { url, string }, { text, string }, { children, ReactNode }, { className, string }]|
|Checkbox|@/components/ui/Checkbox|[{ label, string }, { description, string }, { error, string }, { indeterminate, boolean }, { size, "sm" | "md" | "lg" }]|
|CommandPalette|@/components/ui/CommandPalette|[{ items, CommandItem[] }, { isOpen, boolean }, { onClose, () => void }, { placeholder, string }, { emptyMessage, string }, { className, string }, { header, ReactNode }]|
|CopyButton|@/components/ui/CopyButton|[{ text, string }, { label, string }, { resetMs, number }, { size, CopyButtonSize }, { variant, CopyButtonVariant }, { className, string }]|
|DateInput|@/components/ui/DateInput|[{ label, string }, { description, string }, { error, string }, { size, "sm" | "md" | "lg" }, { inputType, "date" | "datetime-local" | "month" | "week" | "time" }]|
|InlineFileDrop|@/components/ui/InlineFileDrop|[{ accepts, string }, { maxSize, number }, { emoji, string }, { onUpload, (payload: { file: File }]|
|Input|@/components/ui/Input|[{ label, string }, { labelIcon, LucideIcon }, { labelEmoji, string }, { labelTooltip, string }, { leadingIcon, LucideIcon }, { leadingEmoji, string }, { leadingText, string | ReactNode }, { trailingIcon, LucideIcon }, { trailingEmoji, string }, { trailingText, string | ReactNode }, { error, string }, { helperText, string }]|
|Label|@/components/ui/Label|[{ text, string }, { children, ReactNode }, { size, LabelSize }, { font, LabelFont }, { icon, LucideIcon }, { variant, LabelVariant }, { emoji, string }, { tooltip, string }, { className, string }]|
|Modal|@/components/ui/Modal|[{ isOpen, boolean }, { onClose, () => void }, { title, string }, { children, ReactNode }, { className, string }]|
|ProgressBar|@/components/ui/ProgressBar|[{ value, number }, { max, number }, { variant, ProgressVariant }, { size, ProgressSize }, { showLabel, boolean }, { indeterminate, boolean }, { label, string }, { className, string }]|
|SectionHeader|@/components/ui/SectionHeader|[{ icon, unknown }, { title, unknown }, { count, unknown }, { open, unknown }, { onToggle, unknown }]|
|Slider|@/components/ui/Slider|[{ label, string }, { min, number }, { max, number }, { step, number }, { value, number }, { onChange, (value: number) => void }, { showValue, boolean }, { formatValue, (value: number) => string }]|
|SliderRow|@/components/ui/SliderRow|[{ label, string }, { value, number }, { min, number }, { max, number }, { unit, string }, { isDefault, boolean }, { onChange, (v: number) => void }, { onReset, () => void }]|
|Spinner|@/components/ui/Spinner|[]|
|StatBox|@/components/ui/StatBox|[]|
|Tabs|@/components/ui/Tabs|[{ tabs, Tab[] }, { defaultTab, string }, { className, string }, { onChange, (id: string) => void }]|
|Toast|@/components/ui/Toast|[{ children, unknown }]|
|Toggle|@/components/ui/Toggle|[{ label, string }, { checked, boolean }, { onChange, (checked: boolean) => void }, { disabled, boolean }, { id, string }]|
|ToggleGroup|@/components/ui/ToggleGroup|[{ options, { value: string }]|
|Tooltip|@/components/ui/Tooltip|[{ content, string }, { children, ReactNode }, { position, TooltipPosition }, { delay, number }, { className, string }]|
|Radio|@/components/ui/radio/Radio|[{ value, string }, { label, string }, { description, string }]|
|RadioGroup|@/components/ui/radio/RadioGroup|[{ value, string }, { onValueChange, (value: string) => void }, { label, string }, { description, string }, { error, string }, { disabled, boolean }, { orientation, "vertical" | "horizontal" }, { size, "sm" | "md" | "lg" }, { name, string }, { children, ReactNode }, { className, string }, { variant, "separated" | "joined" }]|
|useRadioGroup|@/components/ui/radio/useRadioGroup|[]|
|LabelContext|@/components/ui/select/LabelContext|[]|
|Select|@/components/ui/select/Select|[{ value, string }, { defaultValue, string }, { label, string }, { onValueChange, (value: string) => void }, { children, ReactNode }]|
|SelectContent|@/components/ui/select/SelectContent|[{ className, string }, { children, ReactNode }, { align, "start" | "end" | "center" }]|
|SelectGroup|@/components/ui/select/SelectGroup|[{ children, ReactNode }, { className, string }]|
|SelectItem|@/components/ui/select/SelectItem|[{ value, string }, { children, ReactNode }, { disabled, boolean }, { icon, ReactNode | string }, { className, string }]|
|SelectLabel|@/components/ui/select/SelectLabel|[{ children, ReactNode }, { className, string }]|
|SelectSeparator|@/components/ui/select/SelectSeparator|[{ className, string }]|
|SelectTrigger|@/components/ui/select/SelectTrigger|[{ className, string }, { children, ReactNode }]|
|SelectValue|@/components/ui/select/SelectValue|[{ placeholder, string }, { className, string }]|
|UseSelect|@/components/ui/select/UseSelect|[]|
|Tab|@/components/ui/tab/Tab|[{ value, string }, { children, ReactNode }, { disabled, boolean }, { className, string }, { icon, LucideIcon }, { emoji, string }, { iconPosition, IconPosition }]|
|TabContext|@/components/ui/tab/TabContext|[]|
|TabList|@/components/ui/tab/TabList|[{ children, ReactNode }, { className, string }]|
|TabPanel|@/components/ui/tab/TabPanel|[{ value, string }, { children, ReactNode }, { className, string }]|
|TabPanels|@/components/ui/tab/TabPanels|[{ children, ReactNode }, { className, string }]|
|Tabs|@/components/ui/tab/Tabs|[{ value, string }, { onValueChange, (v: string) => void }, { children, ReactNode }, { className, string }, { label, string }, { labelIcon, LucideIcon }, { labelEmoji, string }, { labelTooltip, string }, { size, TabsSize }]|
|Body|@/components/ui/table/Body|[{ children, React.ReactNode }]|
|Caption|@/components/ui/table/Caption|[{ children, React.ReactNode }]|
|Cell|@/components/ui/table/Cell|[{ children, React.ReactNode }]|
|Footer|@/components/ui/table/Footer|[{ children, React.ReactNode }]|
|Head|@/components/ui/table/Head|[{ children, React.ReactNode }]|
|Header|@/components/ui/table/Header|[{ children, React.ReactNode }]|
|Row|@/components/ui/table/Row|[{ children, React.ReactNode }]|
|Table|@/components/ui/table/Table|[{ children, React.ReactNode }]|