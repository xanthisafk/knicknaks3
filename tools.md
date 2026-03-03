# Knicknaks Tool Roadmap (Offline-First)

All tools run **100% client-side** using browser-native APIs and lightweight JS/WASM libraries. No data leaves your device.

---

## 📝 Text & Markdown

| Status | Tool                             | Description                                                                             |
| ------ | -------------------------------- | --------------------------------------------------------------------------------------- |
| ✅     | **Markdown Previewer**           | Live-syncing editor using `marked.js`. Side-by-side rendered view.                      |
| ✅     | **Word & Character Counter**     | Real-time stats on words, characters, lines, sentences, reading time.                   |
| ✅     | **Case Converter**               | UPPER, lower, Sentence, Title, camelCase, snake_case, PascalCase, and more.             |
| ✅     | **Text to Slug**                 | Removes special characters, replaces spaces with hyphens.                               |
| ✅     | **Lorem Ipsum Generator**        | Placeholder text by paragraph, sentence, or word count.                                 |
| ✅     | **Text Sorter**                  | Sort lines alphabetically, numerically, by length, or in reverse.                       |
| ✅     | **Deduplicate Lines**            | Filters repeated lines from a block of text, preserving order.                          |
| ✅     | **Remove Line Breaks**           | Strips `\n`/`\r` to collapse text or join with a custom separator.                      |
| ✅     | **Reverse Text**                 | Mirror characters, reverse word order, or flip lines.                                   |
| ✅     | **String Escaper**               | Escapes special characters for JS, JSON, HTML, CSV, and SQL.                            |
| —      | **Text Diff (Compare)**          | Highlights additions and deletions between two text blocks. `diff` library.             |
| —      | **Word Density / SEO Analyzer**  | Keyword frequency, density %, Flesch-Kincaid score, stop word filter, bigrams/trigrams. |
| —      | **Word to Number**               | Converts "one hundred twenty" ↔ `120`.                                                  |
| —      | **Text to Speech**               | Browser `SpeechSynthesis` API with voice, pitch, and rate controls.                     |
| —      | **Speech to Text**               | Browser `SpeechRecognition` API — transcribe from mic live.                             |
| —      | **Upside Down Text**             | Maps characters to Unicode flipped equivalents (`ɐ`, `ʇ`, etc.).                        |
| —      | **Zalgo Text Generator**         | Adds combining Unicode diacritics for creepy/glitchy text effect.                       |
| —      | **Text to Morse Code**           | Encode/decode Morse with audio playback via Web Audio API.                              |
| —      | **Palindrome & Anagram Checker** | Detects palindromes; finds all anagram combinations for short words.                    |
| —      | **Find & Replace**               | Regex-powered find and replace with live match highlighting.                            |
| —      | **Text Repeater**                | Repeat a string N times with a custom separator.                                        |
| —      | **Unicode Inspector**            | Paste text, see each character's code point, name, block, and category.                 |
| —      | **Fancy Text Generator**         | Converts text to Unicode stylistic variants — bold, italic, script, fraktur, etc.       |

---

## 🔄 Encoders & Decoders

| Status | Tool                                | Description                                                            |
| ------ | ----------------------------------- | ---------------------------------------------------------------------- |
| ✅     | **Base64 Encoder / Decoder**        | UTF-8 safe with URL-safe mode and live toggle.                         |
| ✅     | **URL Encoder / Decoder**           | Percent-encoding for safe use in web addresses.                        |
| ✅     | **HTML Entity Converter**           | Escape/unescape `&lt;`, `&gt;`, `&amp;`, named or decimal entities.    |
| ✅     | **ROT-N Cipher**                    | Customizable Caesar cipher with user-defined shift N.                  |
| ✅     | **Universal Base Converter**        | Convert numbers between any base 2–36.                                 |
| —      | **Text to Hex / Hex to Text**       | Each character to its hexadecimal UTF-8 code and back.                 |
| —      | **Text to Binary / Binary to Text** | Characters to 8-bit binary representations and back.                   |
| —      | **Text to ASCII Codes**             | Maps characters to decimal ASCII values and back.                      |
| —      | **Punycode Encoder / Decoder**      | Encode internationalized domain names (IDNs) to ASCII-compatible form. |

---

## 🔐 Cryptography

| Status | Tool                      | Description                                                                  |
| ------ | ------------------------- | ---------------------------------------------------------------------------- |
| ✅     | **Hash Generator**        | SHA-1, SHA-256, SHA-384, SHA-512, MD5 from text or files via `SubtleCrypto`. |
| ✅     | **JWT Decoder**           | Decodes header, payload, and signature without a backend.                    |
| ✅     | **Password Generator**    | Cryptographically secure with entropy feedback and character set control.    |
| —      | **HMAC Generator**        | Generate HMAC signatures with a secret key using `SubtleCrypto`.             |
| —      | **AES Encrypt / Decrypt** | Client-side symmetric encryption using `SubtleCrypto` AES-GCM.               |
| —      | **Bcrypt Hash Tool**      | Hash and verify passwords using `bcryptjs` (WASM port).                      |
| —      | **Mnemonic Generator**    | BIP39 seed phrase generation (12/24 words) for crypto/security use.          |

---

## ✨ Formatters & Validators

| Status | Tool                           | Description                                                              |
| ------ | ------------------------------ | ------------------------------------------------------------------------ |
| ✅     | **JSON Formatter**             | Beautify, minify, validate JSON with syntax highlighting.                |
| —      | **JSON Validator**             | Strict syntax check with detailed error pointers and line numbers.       |
| —      | **JSON to CSV**                | Flattens nested objects into tabular CSV format.                         |
| —      | **CSV to JSON**                | Parses CSV rows into an array of JSON objects.                           |
| —      | **JSON to TypeScript**         | Generates TypeScript interfaces from sample JSON.                        |
| —      | **YAML Formatter / Validator** | Validates and pretty-prints YAML using `js-yaml`.                        |
| —      | **YAML ↔ JSON Converter**      | Converts between YAML and JSON representations.                          |
| —      | **XML Formatter**              | Pretty-prints XML with configurable indentation.                         |
| —      | **SQL Formatter**              | Keyword casing and indentation for readable SQL using `sql-formatter`.   |
| —      | **HTML Formatter / Minifier**  | Cleans up or minifies HTML markup.                                       |
| —      | **CSS Formatter / Minifier**   | Beautify or minify CSS; also shows property counts.                      |
| —      | **JS Beautifier**              | Readable formatting for minified JavaScript using `prettier` standalone. |
| —      | **TOML Formatter**             | Validates and pretty-prints TOML config files using `@iarna/toml`.       |
| —      | **INI / ENV Parser**           | Parses `.ini` and `.env` files into a readable key-value table.          |

---

## 💻 Developer Tools

| Status | Tool                               | Description                                                               |
| ------ | ---------------------------------- | ------------------------------------------------------------------------- |
| ✅     | **RegEx Tester**                   | Live playground with match highlighting and capture group inspection.     |
| ✅     | **Screen Info**                    | Viewport, screen resolution, DPR, touch support, browser capabilities.    |
| —      | **Cron Expression Parser**         | Human-readable explanation of cron syntax — "Every Monday at 9am".        |
| —      | **URL Parser**                     | Deconstructs URL into protocol, host, port, path, query params, fragment. |
| —      | **URL Builder**                    | Assembles a URL from parts with live output and copy button.              |
| —      | **User Agent Parser**              | Inspects `navigator.userAgent` for browser, OS, engine details.           |
| —      | **IP Subnet Calculator**           | CIDR mask breakdown, network range, broadcast address, host count.        |
| —      | **HTTP Status Code Reference**     | Searchable, filterable cheat sheet of all status codes with descriptions. |
| —      | **Chmod / Permission Calculator**  | Visual checkbox UI → octal and symbolic permission strings.               |
| —      | **Local / Session Storage Viewer** | Inspect and edit browser storage for the current origin.                  |
| —      | **Color Picker from Screen**       | Uses `EyeDropper` API to pick any color visible on screen.                |
| —      | **Aspect Ratio Calculator**        | Maintains W:H proportionality; useful for images, video, and design.      |
| —      | **SVG Optimizer**                  | Removes unnecessary metadata and simplifies paths using `svgo`.           |
| —      | **SVG Viewer / Editor**            | Live SVG source editor with rendered preview and downloadable output.     |

---

## 🎨 Color & Design

| Status | Tool                         | Description                                                                       |
| ------ | ---------------------------- | --------------------------------------------------------------------------------- |
| ✅     | **Color Converter**          | HEX ↔ RGB ↔ HSL ↔ CMYK with live preview swatch.                                  |
| ✅     | **Contrast Checker**         | WCAG 2.1 AA and AAA pass/fail for foreground/background pairs.                    |
| —      | **Color Palette Generator**  | Harmonious schemes from a seed: triadic, analogous, complementary, monochromatic. |
| —      | **Gradient Maker**           | Visual multi-stop CSS gradient builder with copy-ready output.                    |
| —      | **Box Shadow Generator**     | Slider UI for offset, blur, spread, color → `box-shadow` CSS snippet.             |
| —      | **Tailwind Color Reference** | Searchable Tailwind v3/v4 palette with HEX, copy-to-clipboard.                    |
| —      | **CSS Filter Generator**     | Sliders for brightness, contrast, saturation → `filter: ...` CSS output.          |

---

## 🆔 Generators

| Status | Tool                            | Description                                                             |
| ------ | ------------------------------- | ----------------------------------------------------------------------- |
| ✅     | **UUID Generator**              | v4 (random) and v7 (timestamp-ordered) UUIDs, bulk generation.          |
| ✅     | **Lorem Ipsum Generator**       | Already listed under Text Tools.                                        |
| —      | **ULID Generator**              | Lexicographically sortable unique identifiers.                          |
| —      | **Fake Data Generator**         | Seed-based names, emails, addresses, phone numbers — no API needed.     |
| —      | **QR Code Maker**               | Custom QR with dot styles and colors using `qr-code-styling`.           |
| —      | **Specialized QR Codes**        | Presets for Wi-Fi, vCard, UPI/payment, SMS, and calendar events.        |
| —      | **QR Reader (Camera)**          | Real-time camera decode with bounding box overlay.                      |
| —      | **QR Reader (File Upload)**     | Scan QR from an uploaded image file.                                    |
| —      | **Barcode Generator**           | EAN-13, Code 128, ITF using `JsBarcode`.                                |
| —      | **Barcode Reader**              | Decode barcodes from uploaded images using `ZXing`.                     |
| —      | **Placeholder Image Generator** | SVG placeholders with custom size, text, and colors — no server needed. |

---

## 🧮 Calculators

| Status | Tool                               | Description                                                               |
| ------ | ---------------------------------- | ------------------------------------------------------------------------- |
| ✅     | **Age Calculator**                 | Precise age between two dates in years, months, days, with fun stats.     |
| ✅     | **Percentage Calculator**          | Growth, margins, discounts, reverse percentage.                           |
| ✅     | **Unix Timestamp Converter**       | Epoch ↔ human-readable with live clock.                                   |
| —      | **Loan / EMI Calculator**          | Principal, rate, tenure → monthly payment and full amortization schedule. |
| —      | **GST / Tax Calculator**           | Add/remove tax percentage, configurable for IN/global.                    |
| —      | **Tip Calculator / Bill Splitter** | Bill amount, tip %, number of people → amount per person.                 |
| —      | **Time Duration Calculator**       | Elapsed time between two datetime points, with breakdown.                 |
| —      | **Unit Converter**                 | Length, weight, temperature, volume, speed, area, data size.              |
| —      | **Number to Words**                | `1542` → "one thousand five hundred forty-two". Legal/finance use.        |
| —      | **Roman Numeral Converter**        | Integer ↔ Roman numeral, with validation.                                 |
| —      | **Scientific Calculator**          | Full expression evaluator with history using `mathjs`.                    |
| —      | **Timezone Converter**             | Pick two timezones, see the time difference live using `Intl` API.        |
| —      | **Date Difference Calculator**     | Days, weeks, months, years between any two dates.                         |
| —      | **Binary / Hex Arithmetic**        | Perform math operations and see results in multiple bases simultaneously. |

---

## 📄 PDF Tools

_Uses `pdf-lib` and `pdfjs-dist`. All processing in-browser._

| Status | Tool                    | Description                                            |
| ------ | ----------------------- | ------------------------------------------------------ |
| ✅     | **Merge PDF**           | Combine multiple PDFs into one.                        |
| ✅     | **Split PDF**           | Extract specific pages or split into individual files. |
| ✅     | **Rotate PDF Pages**    | 90/180/270° rotation for specific or all pages.        |
| ✅     | **Delete PDF Pages**    | Remove selected pages from a document.                 |
| ✅     | **Rearrange PDF Pages** | Drag-and-drop page reordering.                         |
| ✅     | **Add Page Numbers**    | Overlay page numbers at chosen positions.              |
| ✅     | **Watermark PDF**       | Text or image overlay with transparency settings.      |
| ✅     | **Protect PDF**         | Add password and owner restrictions.                   |
| ✅     | **Unlock PDF**          | Remove password if you know the current one.           |
| ✅     | **Image to PDF**        | Batch images → single PDF, one image per page.         |
| ✅     | **PDF to Images**       | Render pages to canvas and export as PNG/JPG.          |
| ✅     | **PDF Metadata Editor** | Modify Title, Author, Keywords, Subject fields.        |
| ✅     | **Markdown to PDF**     | Render Markdown → HTML → PDF via `jspdf`.              |
| ✅     | **Compress PDF**        | Lower image resolution and simplify paths client-side. |

---

## 🖼️ Image Tools

_Canvas API, browser encoding, and optional `Transformers.js` for AI features._

| Status | Tool                        | Description                                                            |
| ------ | --------------------------- | ---------------------------------------------------------------------- |
| —      | **Image Converter**         | PNG ↔ JPG ↔ WebP ↔ AVIF ↔ BMP transcoding.                             |
| —      | **Image Resizer**           | Scale by dimensions or percentage with quality interpolation.          |
| —      | **Image Compressor**        | Reduce file size by adjusting quality/lossy settings.                  |
| —      | **Image Cropper**           | Interactive pixel-perfect crop with aspect ratio lock.                 |
| —      | **Background Remover**      | Client-side AI masking via `Transformers.js` (runs locally).           |
| —      | **SVG to PNG / JPG**        | Render SVG vectors to high-res raster canvas.                          |
| —      | **EXIF Stripper**           | Remove GPS, camera metadata from images for privacy.                   |
| —      | **Base64 to Image**         | Decode a data URI to a viewable, downloadable image.                   |
| —      | **Image to Base64**         | Encode image to data URI for CSS/HTML embedding.                       |
| —      | **Color Palette Extractor** | Sample pixel data using median-cut algorithm → HEX/RGB set.            |
| —      | **Image Filters**           | Grayscale, sepia, blur, invert, sharpen via canvas pixel manipulation. |
| —      | **Flip / Mirror Image**     | Reverse pixel grid horizontally or vertically.                         |
| —      | **Favicon Generator**       | Multi-size `.ico` and PNG set from a single image.                     |
| —      | **ASCII Art Generator**     | Map brightness levels to a character set for text-based art.           |
| —      | **Image Diff**              | Overlay or side-by-side comparison of two images with a slider.        |
| —      | **Steganography Tool**      | Hide or reveal a secret message inside an image's pixel data.          |

---

## 📦 Miscellaneous

| Status | Tool                           | Description                                                                 |
| ------ | ------------------------------ | --------------------------------------------------------------------------- |
| —      | **Pomodoro / Focus Timer**     | Configurable work/break intervals using the Web Audio API for alerts.       |
| —      | **Typing Speed Test**          | WPM and accuracy test against a fixed or random passage.                    |
| —      | **Readability Scorer**         | Paste an article, get Flesch, Gunning Fog, SMOG scores with explanations.   |
| —      | **Emoji Picker / Search**      | Searchable full emoji set with copy-to-clipboard, no CDN needed.            |
| —      | **Changelog / Diff Formatter** | Paste two versions of a file, get a clean formatted diff for release notes. |
| —      | **Dice Roller**                | Configurable dice (d4–d100), roll history, probability display.             |
| —      | **Coin Flip / Random Picker**  | Flip a coin or pick from a custom list of options.                          |
| —      | **Pixel Ruler**                | Overlay a resizable ruler on screen for measuring UI elements.              |
