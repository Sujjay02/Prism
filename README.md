<div align="center">
<img width="1200" height="475" alt="Prism Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Prism

### AI-Powered Universal Code Generator

**One prompt. Infinite possibilities. Powered by Gemini 3.**

[![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%203-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Live Demo](https://neo-forge-roan.vercel.app/) | [Watch Video](#demo-video) | [Report Bug](https://github.com/Sujjay02/Prism/issues)

</div>

---

## The Problem

Developers and designers face a critical bottleneck: **turning ideas into working prototypes is slow and tedious.**

- Designers sketch wireframes but can't see them as real, interactive UIs
- Developers spend hours on boilerplate code before getting to actual logic
- Learning new frameworks (Three.js, React Three Fiber) has a steep curve
- Data scientists struggle to create visual interfaces for their Python scripts
- Teams waste time iterating on static mockups instead of functional prototypes

**The cost?** Days of work for what should take minutes. Ideas die before they're validated.

---

## The Solution: Prism

Prism is an **AI-powered universal code generator** that transforms natural language, images, and voice into production-ready code in seconds.

**One prompt. Any output.** Like light through a prism, your single idea refracts into React dashboards, 3D WebGL visualizations, Python data apps, or landing pages - instantly.

### What Makes Prism Different?

| Feature | v0.dev | Bolt.new | **Prism** |
|---------|--------|----------|-----------|
| React/HTML Generation | Yes | Yes | Yes |
| 3D/WebGL Generation | No | No | **React Three Fiber** |
| Python + Visualization | No | No | **Pyodide Runtime** |
| Voice Input | No | No | Yes |
| Image-to-UI | Yes | Yes | Yes |
| AI Code Review | No | No | **Gemini-powered** |
| AI Code Explanation | No | No | **Gemini-powered** |
| Accessibility Audit | No | No | **WCAG 2.1 Compliance** |
| Live Code Editor | No | Yes | **Monaco Editor** |
| Export to React/Vue/Svelte | Yes | Yes | Yes |
| QR Code Mobile Preview | No | No | Yes |
| Offline Templates | No | No | **15+ built-in** |
| Ribbon-style Toolbar | No | No | **MS Word-style UI** |
| App Publishing & Management | No | No | Yes |
| Embed Code Generation | No | No | Yes |

---

## Key Features

### Multi-Modal Input
- **Text Prompts**: Describe what you want in natural language
- **Voice Commands**: Speak your ideas, get code (Gemini transcription)
- **Image Upload**: Screenshot a design, get the code
- **Iterative Refinement**: Build on previous generations

### Universal Output Modes

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INPUT                              │
│         (Text / Voice / Image / Combination)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GEMINI 2.0 FLASH                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │   Vision    │  │   Reasoning │  │   Search    │            │
│   │   Analysis  │  │   & Logic   │  │  Grounding  │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │   MODE 1    │  │   MODE 2    │  │   MODE 3    │
    │   Python    │  │ React/3D/   │  │  Standard   │
    │  + Pyodide  │  │   WebGL     │  │    HTML     │
    └─────────────┘  └─────────────┘  └─────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LIVE PREVIEW                                │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Sandboxed Iframe with Hot Reload                       │  │
│   │  • Error Overlay  • Responsive Viewport  • Console      │  │
│   └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1. Python + Data Visualization
Generate Python scripts that run directly in the browser via Pyodide. Create matplotlib charts, numpy calculations, and interactive data apps.

```
"Create a Monte Carlo simulation of stock prices with an interactive chart"
```

### 2. React Three Fiber / 3D WebGL
Generate stunning 3D visualizations with physics, post-processing effects, and interactivity.

```
"Create a 3D solar system with orbiting planets and realistic lighting"
```

### 3. React Components & Dashboards
Production-ready React components with Tailwind CSS styling.

```
"Build an analytics dashboard with charts, KPIs, and a sidebar navigation"
```

### 4. Standard HTML/CSS/JS
Landing pages, forms, and static sites with modern design.

```
"Create a SaaS landing page with pricing table and testimonials"
```

---

## New Features

### Ribbon-Style Toolbar
Microsoft Word-inspired toolbar with categorized tool groups:
- **View**: Preview, Code, Editor, Diff mode
- **Device**: Mobile, Tablet, Desktop, Full viewport presets
- **AI**: Explain, Code Review, Accessibility Audit
- **Export**: HTML, React/Vue/Svelte, Share, QR Code
- **Tools**: Templates, Remix, Console

### App Management
Publish and manage your generated apps:
- Custom names, icons (emoji), and descriptions
- Category organization (Dashboard, Landing, Form, Game, etc.)
- Tags for searchability
- Pin favorite apps
- Grid and List view modes
- Sort by date, name, or category
- Duplicate apps with one click

### Embed Code Generation
Share your creations anywhere:
- Iframe embed with customizable dimensions
- JavaScript embed for more flexibility
- Live preview of embedded content
- Copy-to-clipboard functionality

### AI-Powered Tools
- **Code Review**: Quality scores, issue detection, optimization suggestions
- **Accessibility Audit**: WCAG 2.1 compliance checking
- **Code Explanation**: Understand how generated code works
- **Auto-fix**: Automatically fix runtime errors

### Export Options
- Download as HTML file
- Convert to React (TSX), Vue 3 (SFC), or Svelte components
- Open directly in CodeSandbox
- Share via URL with LZ-String compression
- QR Code for mobile preview

### Remix Feature
Combine 2-4 previous designs into something new. AI merges layouts, styles, and functionality based on your instructions.

---

## How We Use Gemini

Prism leverages **Gemini 3's advanced capabilities** for intelligent code generation:

### Gemini 3 Pro Preview (`gemini-3-pro-preview`)
- **Multi-modal Understanding**: Processes text, images, and audio in a single request
- **Vision Analysis**: Converts wireframes/screenshots into accurate UI code
- **Reasoning**: Understands complex prompts and generates structured, working code
- **Google Search Grounding**: Accesses real-time information for current APIs and documentation

### Gemini 3 Flash Preview (`gemini-3-flash-preview`)
- **Audio Transcription**: Converts voice commands to text with high accuracy
- **Code Explanation**: Analyzes generated code and explains how it works
- **Improvement Suggestions**: Recommends enhancements for generated code
- **Fast Inference**: Quick responses for interactive features

### Key Integration Points

```typescript
// Multi-modal content generation with vision + text
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: {
    parts: [
      { inlineData: { mimeType: 'image/png', data: imageBase64 } },
      { text: 'Convert this wireframe to a React component' }
    ]
  },
  config: {
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ googleSearch: {} }]
  }
});

// AI-powered code explanation (using Flash for speed)
const explanation = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: { parts: [{ text: `Explain this code: ${code}` }] },
  config: { responseMimeType: 'application/json' }
});
```

### Smart Mode Detection
Gemini automatically detects the appropriate output mode based on the prompt:
- **Python keywords** → Pyodide-compatible Python with matplotlib
- **3D/React keywords** → React Three Fiber with proper import maps
- **Default** → Tailwind CSS HTML with embedded JavaScript

---

## Architecture

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
│  │  │ gemini-3-pro-preview │    │ gemini-3-flash-preview│               │  │
│  │  │ • Vision Analysis    │    │ • Audio Transcription │               │  │
│  │  │ • Code Generation    │    │ • Code Explanation    │               │  │
│  │  │ • Search Grounding   │    │ • Fast Inference      │               │  │
│  │  └──────────────────────┘    └──────────────────────┘               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **AI Model** | Gemini 3 Pro Preview, Gemini 3 Flash Preview |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Code Editor** | Monaco Editor |
| **3D Graphics** | React Three Fiber, Three.js, Drei |
| **Python Runtime** | Pyodide (WASM) |
| **Storage** | IndexedDB (idb-keyval) |
| **Sharing** | LZ-String compression |
| **Icons** | Lucide React |
| **Diff Engine** | diff (npm package) |

---

## Demo Video

<!-- Add your demo video link here -->
[Watch the full demo on YouTube](#)

### Quick Examples

| Prompt | Output |
|--------|--------|
| "Create a 3D torus knot with neon glow effect" | Interactive WebGL scene with bloom |
| "Build a Kanban board with drag and drop" | React component with state |
| "Monte Carlo simulation of Pi" | Python + matplotlib chart |
| "Convert this wireframe to a dashboard" + image | Pixel-perfect UI |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Gemini API Key ([Get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prism.git
cd prism

# Install dependencies
npm install

# Set up environment variables
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# Start development server
npm run dev
```

### Usage

1. **Text Prompt**: Type a description of what you want to build
2. **Voice Input**: Click the microphone icon and speak your idea
3. **Image Upload**: Drag and drop a wireframe or screenshot
4. **Iterate**: Refine your generation with follow-up prompts
5. **Explain**: Click "Explain" in the AI group to understand the code
6. **Review**: Get AI-powered code review and accessibility audit
7. **Export**: Download as HTML, React, Vue, or Svelte component
8. **Publish**: Save as an app with custom name, icon, and category

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Generate code |
| `Ctrl/Cmd + K` | Clear prompt |
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + 1` | Switch to Preview |
| `Ctrl/Cmd + 2` | Switch to Code view |
| `Ctrl/Cmd + 3` | Switch to Editor |
| `Ctrl/Cmd + E` | Open Export dialog |
| `Ctrl/Cmd + Shift + S` | Open Share dialog |
| `Ctrl/Cmd + Z` | Undo last generation |
| `Ctrl/Cmd + Shift + Z` | Redo generation |
| `Esc` | Close dialogs |

---

## Project Structure

```
prism/
├── components/               # React components
│   ├── InputArea.tsx         # Text, voice, image input
│   ├── CodePreview.tsx       # Sandboxed iframe preview
│   ├── LiveEditor.tsx        # Monaco code editor
│   ├── RibbonToolbar.tsx     # MS Word-style toolbar
│   ├── CodeExplanation.tsx   # AI-powered explanation
│   ├── CodeReviewPanel.tsx   # AI code review
│   ├── AccessibilityAudit.tsx # WCAG compliance checker
│   ├── TemplateGallery.tsx   # Built-in templates
│   ├── AppSettingsDialog.tsx # App name, icon, category
│   ├── EmbedCodeDialog.tsx   # Embed code generator
│   ├── ExportFormatDialog.tsx # React/Vue/Svelte export
│   ├── QRCodePreview.tsx     # QR code for mobile
│   ├── RemixDialog.tsx       # Combine multiple designs
│   ├── HistorySidebar.tsx    # History with grid/list view
│   └── ...
├── services/
│   ├── geminiService.ts      # Gemini API integration
│   └── storageService.ts     # IndexedDB persistence
├── hooks/
│   └── useKeyboardShortcuts.ts
├── utils/
│   ├── exportUtils.ts        # Export functionality
│   ├── diffUtils.ts          # Version comparison
│   └── urlUtils.ts           # URL sharing
├── data/
│   └── defaultTemplates.ts   # 15+ built-in templates
├── types.ts                  # TypeScript definitions
└── App.tsx                   # Main application
```

---

## Built-in Templates

Prism comes with 15+ ready-to-use templates across categories:

| Category | Templates |
|----------|-----------|
| **Dashboard** | Analytics Dashboard, Admin Panel, Project Management |
| **Landing** | SaaS Landing, Portfolio, Coming Soon |
| **Form** | Contact Form, Login/Register, Survey |
| **UI Components** | Pricing Table, Testimonials, FAQ Accordion |
| **Game** | Snake Game, Memory Match |
| **Data Viz** | Chart Dashboard, Data Table |
| **3D** | 3D Scene, Interactive Visualization |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with Gemini 3 for the Google AI Hackathon 2025**

*Like light through a prism, one prompt becomes infinite possibilities.*

</div>
