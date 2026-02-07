# Components Reference

Documentation for all major React components in Prism.

---

## Core Components

### `App.tsx`
The main application container. Manages all top-level state, orchestrates component rendering, and handles core logic like code generation, undo/redo, and theme toggling.

**Key responsibilities:**
- State management for prompt, result, history, view mode, viewport
- Code generation via `handleGenerate()`
- Undo/redo stacks (up to 20 items each)
- Theme toggle (dark/light)
- Dialog state management for 15+ modals
- Keyboard shortcut registration
- History loading/saving with IndexedDB
- Share URL decoding on load

---

### `InputArea.tsx`
Multi-modal input component for text, voice, image, and file input.

**Props:**
- `prompt` - Current text prompt
- `onPromptChange` - Text change handler
- `onGenerate` - Generation trigger
- `onImageUpload` - Image upload handler
- `onVoiceInput` - Voice recording handler
- `isGenerating` - Loading state flag

**Features:**
- Text area with auto-resize
- Microphone button for voice recording
- Drag-and-drop image upload
- File import support (GitHub, Figma, PDF, text)
- Keyboard shortcut hint display

---

### `CodePreview.tsx`
Renders generated code in a sandboxed iframe with live preview.

**Props:**
- `code` - HTML/JS code to render
- `viewport` - Device size (mobile/tablet/desktop/full)
- `onError` - Error callback for runtime issues

**Features:**
- Sandboxed iframe execution
- Error overlay with auto-fix integration
- Viewport size management
- Console log capture from iframe
- Internal link/anchor navigation handling
- Hot reload on code changes

---

### `LiveEditor.tsx`
Monaco Editor integration for live code editing.

**Props:**
- `code` - Initial code content
- `onChange` - Code change callback
- `language` - Syntax highlighting language

**Features:**
- Full Monaco Editor with syntax highlighting
- Multiple language support
- Real-time editing with live preview updates
- Undo/redo within the editor

---

### `RibbonToolbar.tsx`
Microsoft Word-inspired toolbar with categorized tool groups.

**Props:**
- `viewMode` / `onViewModeChange` - View mode control
- `viewport` / `onViewportChange` - Viewport control
- `onExplain` / `onReview` / `onAudit` - AI tool triggers
- `onExport` / `onShare` / `onQRCode` - Export triggers
- `onUndo` / `onRedo` - History navigation
- `canUndo` / `canRedo` - Button state flags

**Groups:**
| Group | Contents |
|-------|----------|
| View | Preview, Code, Editor, Diff toggles |
| Device | Mobile, Tablet, Desktop, Full buttons |
| AI | Explain, Review, A11y Audit buttons |
| Export | HTML, Frameworks, Share, QR buttons |
| Tools | Templates, Remix, Console buttons |

---

## AI Tool Components

### `CodeExplanation.tsx`
Displays AI-generated code explanations in a structured panel.

**Shows:**
- Summary section
- Key components breakdown
- How it works explanation
- Customization tips

### `CodeReviewPanel.tsx`
Displays AI code review results with quality scoring.

**Shows:**
- Overall quality score (0-100) with visual gauge
- Issues categorized: errors (red), warnings (yellow), suggestions (blue), optimizations (green)
- Line-specific feedback
- Optimized code preview

### `AccessibilityAudit.tsx`
Displays WCAG 2.1 compliance audit results.

**Shows:**
- Overall accessibility score
- Issues by severity: critical, major, minor
- WCAG criterion references
- Specific fix recommendations

---

## Dialog Components

### `TemplateGallery.tsx`
Browse and select from 15+ built-in templates.

**Features:**
- Category-based filtering
- Template preview cards
- One-click apply to editor

### `ExportDialog.tsx`
Main export options interface.

### `ExportFormatDialog.tsx`
Framework-specific export (React TSX, Vue 3 SFC, Svelte).

### `EmbedCodeDialog.tsx`
Generate embed codes for sharing creations:
- Iframe embed with customizable dimensions
- JavaScript embed for flexibility
- Live preview of embedded content
- Copy-to-clipboard functionality

### `ShareDialog.tsx`
URL-based sharing with LZ-String compression.

### `QRCodePreview.tsx`
Generate QR codes for mobile preview of generated apps.

### `RemixDialog.tsx`
Combine 2-4 previous designs into a new creation.

### `AppSettingsDialog.tsx`
Configure app metadata: name, emoji icon, description, category, and tags.

### `HelpDialog.tsx`
In-app help and documentation viewer.

### `GitHubExportDialog.tsx`
Export directly to GitHub gists or repositories.

---

## Utility Components

### `CodeViewer.tsx`
Read-only syntax-highlighted code display.

### `DiffViewer.tsx`
Side-by-side version comparison using the `diff` library.

### `ConsolePanel.tsx`
Runtime console output captured from the preview iframe.

### `ErrorOverlay.tsx`
Displays runtime errors with auto-fix suggestions.

### `GeneratingAnimation.tsx`
Loading animation shown during AI generation.

### `VoiceMode.tsx`
Voice input recording interface with visual feedback.

### `TutorialOverlay.tsx`
First-time user guide walkthrough.

### `ViewportToolbar.tsx`
Device viewport size selector (mobile/tablet/desktop/full).

### `PythonRunner.tsx`
Pyodide-based Python code execution engine for browser-side Python.

### `HistorySidebar.tsx`
Dual-view sidebar for history and published apps.

**Features:**
- History view (chronological) and Apps view (published)
- Grid and list layout toggles
- Multi-criteria sorting (newest, oldest, name, category)
- Full-text search
- Category filtering
- Pin management
- Quick actions: Export, Share, QR, Settings, Duplicate, Delete

---

## Services

### `geminiService.ts`
Centralized Gemini API integration. See [[AI Integration]] for details.

### `storageService.ts`
IndexedDB persistence layer using `idb-keyval`.

**Functions:**
- `saveHistory(history)` - Save generation history
- `loadHistory()` - Load history on app start
- `saveTemplate(template)` - Save custom template
- `getTemplates()` - Retrieve all templates
- `updateTemplate(template)` - Modify template
- `deleteTemplate(id)` - Remove template

### `githubService.ts`
GitHub API integration for export functionality.

---

## Hooks

### `useKeyboardShortcuts.ts`
Global keyboard shortcut handler.

**Registers shortcuts for:**
- Generation, clearing, sidebar toggle
- View mode switching
- Export and share dialogs
- Undo/redo
- Dialog dismissal

Automatically excludes shortcuts when typing in input fields (except `Ctrl+Enter`).

---

## Utils

### `exportUtils.ts`
Export logic for multiple formats.

**Functions:**
- `downloadAsHTML(code)` - Download as HTML file
- `extractComponent(code)` - Extract component from HTML
- `wrapAsReact(code)` - Convert to React TSX
- `wrapAsVue(code)` - Convert to Vue 3 SFC
- `wrapAsSvelte(code)` - Convert to Svelte component
- `openInCodeSandbox(code)` - Launch in CodeSandbox

### `diffUtils.ts`
Code comparison utilities.

**Functions:**
- `calculateDiff(oldCode, newCode)` - Line-by-line diff
- `getDiffStats(diff)` - Count added/removed/unchanged lines

### `urlUtils.ts`
URL compression and sharing.

**Functions:**
- `compressToURL(code)` - Compress code with LZ-String for URL sharing
- `decompressFromURL(url)` - Decompress shared URL back to code

---

Next: [[Keyboard Shortcuts]] - Full shortcut reference.
