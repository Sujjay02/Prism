# Architecture

An overview of Prism's technical architecture, data flow, and project structure.

---

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              PRISM ARCHITECTURE                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         FRONTEND (React + Vite)                      │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │  │
│  │  │   Input     │ │   Live      │ │   Code      │ │   Ribbon    │    │  │
│  │  │   Area      │ │   Preview   │ │   Editor    │ │   Toolbar   │    │  │
│  │  │ (Text/Voice │ │  (Iframe +  │ │  (Monaco)   │ │ (MS Word    │    │  │
│  │  │  /Image)    │ │   Sandbox)  │ │             │ │  style)     │    │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │  │
│  │                                                                      │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │  │
│  │  │  Template   │ │   AI Code   │ │   App       │ │   Export    │    │  │
│  │  │  Gallery    │ │   Review    │ │   Settings  │ │   Dialogs   │    │  │
│  │  │ (15+ built- │ │  & A11y     │ │  & Embed    │ │  (HTML/React│    │  │
│  │  │  in + user) │ │   Audit     │ │   Code      │ │  /QR/Share) │    │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│                                      ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                          SERVICES LAYER                              │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │                    geminiService.ts                             │ │  │
│  │  │  • generateUI() - Multi-modal code generation                   │ │  │
│  │  │  • explainCode() - AI code explanation                         │ │  │
│  │  │  • suggestImprovements() - AI enhancement ideas                │ │  │
│  │  │  • transcribeAudio() - Voice-to-text                           │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────┐ ┌─────────────────────┐                    │  │
│  │  │   storageService    │ │   exportUtils       │                    │  │
│  │  │   (IndexedDB)       │ │   (HTML/React/Vue)  │                    │  │
│  │  └─────────────────────┘ └─────────────────────┘                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│                                      ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         GOOGLE GEMINI 3 API                          │  │
│  │  ┌──────────────────────┐    ┌──────────────────────┐               │  │
│  │  │ gemini-3-pro-preview │    │gemini-3-flash-preview│               │  │
│  │  │ • Vision Analysis    │    │ • Audio Transcription │               │  │
│  │  │ • Code Generation    │    │ • Code Explanation    │               │  │
│  │  │ • Search Grounding   │    │ • Fast Inference      │               │  │
│  │  └──────────────────────┘    └──────────────────────┘               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User Input (Text / Voice / Image)
         │
         ▼
   InputArea Component
         │
         ▼
   handleGenerate() in App.tsx
         │
         ▼
   generateUI() in geminiService.ts
   (Gemini API call with multi-modal content)
         │
         ▼
   Result stored in React state
         │
         ├──► CodePreview renders in sandboxed iframe
         ├──► Code stored in undo/redo stacks
         └──► HistorySidebar saves to IndexedDB
                  │
                  ▼
          User can export / share / remix
```

---

## Project Structure

```
prism/
├── App.tsx                          # Main application container (~1000 lines)
├── index.tsx                        # React entry point
├── index.html                       # HTML template with Tailwind CDN
├── types.ts                         # TypeScript interfaces and types
│
├── components/                      # ~32 React components
│   ├── InputArea.tsx               # Multi-input: text, voice, image, file
│   ├── CodePreview.tsx             # Sandboxed iframe renderer with error overlay
│   ├── LiveEditor.tsx              # Monaco code editor integration
│   ├── RibbonToolbar.tsx           # MS Word-style toolbar with tool groups
│   ├── CodeViewer.tsx              # Syntax-highlighted code display
│   ├── CodeExplanation.tsx         # AI-powered code explanation panel
│   ├── CodeReviewPanel.tsx         # AI code quality review
│   ├── AccessibilityAudit.tsx      # WCAG 2.1 compliance checker
│   ├── PythonRunner.tsx            # Pyodide Python execution engine
│   ├── HistorySidebar.tsx          # History + app management sidebar
│   ├── TemplateGallery.tsx         # Built-in template browser
│   ├── ExportDialog.tsx            # Export options dialog
│   ├── ExportFormatDialog.tsx      # React/Vue/Svelte format selector
│   ├── EmbedCodeDialog.tsx         # Embed code generator
│   ├── ShareDialog.tsx             # URL sharing with compression
│   ├── QRCodePreview.tsx           # QR code for mobile preview
│   ├── RemixDialog.tsx             # Combine 2-4 previous designs
│   ├── AppSettingsDialog.tsx       # App name, icon, category settings
│   ├── ConsolePanel.tsx            # Runtime console output
│   ├── DiffViewer.tsx              # Version comparison view
│   ├── ErrorOverlay.tsx            # Runtime error display
│   ├── GeneratingAnimation.tsx     # Loading animation during generation
│   ├── VoiceMode.tsx               # Voice input interface
│   ├── TutorialOverlay.tsx         # First-time user guide
│   ├── ViewportToolbar.tsx         # Device viewport selector
│   ├── AssetManager.tsx            # Asset upload and management
│   ├── GitHubExportDialog.tsx      # GitHub integration dialog
│   ├── Header.tsx                  # Top header bar
│   └── HelpDialog.tsx              # Help and documentation
│
├── services/                        # Service layer
│   ├── geminiService.ts            # Gemini API integration (~830 lines)
│   ├── storageService.ts           # IndexedDB persistence
│   └── githubService.ts            # GitHub API integration
│
├── hooks/                           # Custom React hooks
│   └── useKeyboardShortcuts.ts     # Global keyboard shortcut handler
│
├── utils/                           # Utility functions
│   ├── exportUtils.ts              # HTML/React/Vue/Svelte export logic
│   ├── diffUtils.ts                # Code diff calculation
│   └── urlUtils.ts                 # URL compression and sharing
│
├── data/                            # Static data
│   └── defaultTemplates.ts         # 15+ pre-built template definitions
│
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
└── metadata.json                    # App metadata and permissions
```

---

## State Management

Prism uses **React hooks** for all state management - no external state libraries.

### App-Level State (App.tsx)
- `prompt` - Current user prompt text
- `result` - Generated code output
- `history` - Array of all generation history items
- `viewMode` - Current view (preview/code/editor/diff/python)
- `viewport` - Device preview size
- `undoStack` / `redoStack` - Up to 20 items each for undo/redo
- `isGenerating` - Loading state during API calls
- Dialog visibility states for 15+ modal dialogs

### Persistence
| Data | Storage | Mechanism |
|------|---------|-----------|
| Generation history | IndexedDB | `idb-keyval` library |
| Custom templates | IndexedDB | `idb-keyval` library |
| Theme preference | localStorage | Direct read/write |
| Accent color | localStorage | Direct read/write |
| View preferences | localStorage | Direct read/write |

### Performance Patterns
- `useCallback` for memoized event handlers
- `useRef` for iframe, editor, and media recorder references
- `useEffect` for data loading and side effects
- `ResizeObserver` for responsive width tracking
- Debounced search in the history sidebar

---

## Security Model

### Iframe Sandboxing
Generated code runs in a sandboxed iframe with restricted permissions:
- Same-origin policy enforced
- Script execution controlled
- Popup behavior managed
- Form submission allowed

### Error Handling
- Error handler injected into iframe to catch and report runtime errors
- Try-catch blocks in all async operations
- Retry logic with exponential backoff for API rate limits (429) and server errors (503)
- User-friendly error messages and overlays

### API Security
- Gemini API key stored in environment variables (`.env.local`)
- Key injected at build time via Vite's `import.meta.env`
- Never exposed in client-side source code at runtime

---

## Key Type Definitions

```typescript
type Viewport = 'mobile' | 'tablet' | 'desktop' | 'full';
type ViewMode = 'preview' | 'code' | 'python' | 'editor' | 'diff';
type AppCategory = 'dashboard' | 'landing' | 'form' | 'game' |
                   'visualization' | 'ecommerce' | 'social' | 'utility' | 'other';

interface GeneratedUI {
  code: string;
  explanation: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  result: GeneratedUI;
  timestamp: number;
  appSettings?: AppSettings;
}

interface AppSettings {
  name: string;
  icon: string;
  description: string;
  category: AppCategory;
  tags: string[];
  isPinned: boolean;
}
```

---

Next: [[AI Integration]] - Deep dive into how Prism uses Gemini 3.
