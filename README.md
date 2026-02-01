<div align="center">
<img width="1200" height="475" alt="NeoForge Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# NeoForge

### AI-Powered Universal Code Generator

**Transform ideas into functional code instantly using Gemini 3**

[![Gemini 3](https://img.shields.io/badge/Powered%20by-Gemini%203-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Live Demo](https://aistudio.google.com/app/prompts/1DByJVjJOVgokvZ_JKh1sa1GO54LXBtJb) | [Watch Video](#demo-video) | [Report Bug](https://github.com/yourusername/neoforge/issues)

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

## The Solution: NeoForge

NeoForge is an **AI-powered universal code generator** that transforms natural language, images, and voice into production-ready code in seconds.

**One prompt. Any output.** Whether you need a React dashboard, a 3D WebGL visualization, a Python data app, or a landing page - NeoForge generates it instantly.

### What Makes NeoForge Different?

| Feature | v0.dev | Bolt.new | **NeoForge** |
|---------|--------|----------|--------------|
| React/HTML Generation | ✅ | ✅ | ✅ |
| 3D/WebGL Generation | ❌ | ❌ | ✅ **React Three Fiber** |
| Python + Visualization | ❌ | ❌ | ✅ **Pyodide Runtime** |
| Voice Input | ❌ | ❌ | ✅ |
| Image-to-UI | ✅ | ✅ | ✅ |
| Live Code Editor | ❌ | ✅ | ✅ **Monaco** |
| Real-time Preview | ✅ | ✅ | ✅ |
| Export to GitHub | ❌ | ❌ | ✅ |
| Offline Templates | ❌ | ❌ | ✅ **10+ built-in** |

---

## Key Features

### Multi-Modal Input
- **Text Prompts**: Describe what you want in natural language
- **Voice Commands**: Speak your ideas, get code (Gemini 3 transcription)
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
│                    GEMINI 3 PRO PREVIEW                         │
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

## How We Use Gemini 3

NeoForge leverages **Gemini 3's advanced capabilities** for intelligent code generation:

### Gemini 3 Pro Preview (`gemini-3-pro-preview`)
- **Multi-modal Understanding**: Processes text, images, and audio in a single request
- **Vision Analysis**: Converts wireframes/screenshots into accurate UI code
- **Reasoning**: Understands complex prompts and generates structured, working code
- **Google Search Grounding**: Accesses real-time information for current APIs and documentation

### Gemini 3 Flash Preview (`gemini-3-flash-preview`)
- **Audio Transcription**: Converts voice commands to text with high accuracy
- **Low Latency**: Fast response for real-time voice input

### Key Integration Points

```typescript
// Multi-modal content generation with vision + text
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: {
    parts: [
      { inlineData: { mimeType: 'image/png', data: imageBase64 } },  // Image
      { text: 'Convert this wireframe to a React component' }        // Prompt
    ]
  },
  config: {
    systemInstruction: SYSTEM_INSTRUCTION,  // Mode detection & code structure
    tools: [{ googleSearch: {} }]           // Real-time API grounding
  }
});

// Voice-to-text transcription
const transcription = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: {
    parts: [
      { inlineData: { mimeType: 'audio/webm', data: audioBase64 } },
      { text: 'Transcribe the following audio exactly as spoken.' }
    ]
  }
});
```

### Smart Mode Detection
Gemini 3 automatically detects the appropriate output mode based on the prompt:
- **Python keywords** → Pyodide-compatible Python with matplotlib
- **3D/React keywords** → React Three Fiber with proper import maps
- **Default** → Tailwind CSS HTML with embedded JavaScript

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              NEOFORGE ARCHITECTURE                         │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         FRONTEND (React + Vite)                      │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │  │
│  │  │   Input     │ │   Live      │ │   Code      │ │   Export    │    │  │
│  │  │   Area      │ │   Preview   │ │   Editor    │ │   Dialog    │    │  │
│  │  │ (Text/Voice │ │  (Iframe +  │ │  (Monaco)   │ │ (HTML/React │    │  │
│  │  │  /Image)    │ │   Sandbox)  │ │             │ │  /GitHub)   │    │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │  │
│  │                                                                      │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │  │
│  │  │  Template   │ │   Diff      │ │   Asset     │ │   Share     │    │  │
│  │  │  Gallery    │ │   Viewer    │ │   Manager   │ │   Dialog    │    │  │
│  │  │ (10+ built- │ │  (Version   │ │  (Images/   │ │  (URL-based │    │  │
│  │  │  in + user) │ │   compare)  │ │   3D files) │ │   sharing)  │    │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│                                      ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                          SERVICES LAYER                              │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │                    geminiService.ts                             │ │  │
│  │  │  • generateUI() - Multi-modal code generation                   │ │  │
│  │  │  • transcribeAudio() - Voice-to-text                           │ │  │
│  │  │  • Retry logic with exponential backoff                        │ │  │
│  │  │  • JSON response parsing & validation                          │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────┐ ┌─────────────────────┐                    │  │
│  │  │   storageService    │ │   githubService     │                    │  │
│  │  │   (IndexedDB)       │ │   (GitHub API)      │                    │  │
│  │  └─────────────────────┘ └─────────────────────┘                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│                                      ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         GOOGLE GEMINI 3 API                          │  │
│  │  ┌──────────────────────┐    ┌──────────────────────┐               │  │
│  │  │ gemini-3-pro-preview │    │ gemini-3-flash-preview│               │  │
│  │  │ • Vision Analysis    │    │ • Audio Transcription │               │  │
│  │  │ • Code Generation    │    │ • Fast Inference      │               │  │
│  │  │ • Search Grounding   │    │                       │               │  │
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

---

## Demo Video

<!-- Add your demo video link here -->
[Watch the full demo on YouTube](#)

### Quick Examples

| Prompt | Output |
|--------|--------|
| "Create a 3D torus knot with metallic material and orbit controls" | Interactive WebGL scene |
| "Build a Kanban board with drag and drop" | React component with state |
| "Monte Carlo simulation of Pi with visualization" | Python + matplotlib chart |
| "Convert this wireframe to a dashboard" + image | Pixel-perfect UI |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Gemini API Key ([Get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neoforge.git
cd neoforge

# Install dependencies
npm install

# Set up environment variables
echo "API_KEY=your_gemini_api_key_here" > .env.local

# Start development server
npm run dev
```

### Usage

1. **Text Prompt**: Type a description of what you want to build
2. **Voice Input**: Click the microphone icon and speak your idea
3. **Image Upload**: Drag and drop a wireframe or screenshot
4. **Iterate**: Refine your generation with follow-up prompts
5. **Export**: Download as HTML, React component, or push to GitHub

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Generate code |
| `Ctrl/Cmd + K` | Focus prompt input |
| `Ctrl/Cmd + E` | Toggle code editor |
| `Ctrl/Cmd + 1/2/3` | Switch viewport size |
| `Ctrl/Cmd + Shift + S` | Open share dialog |
| `Ctrl/Cmd + B` | Toggle history sidebar |

---

## Project Structure

```
neoforge/
├── components/           # React components
│   ├── InputArea.tsx     # Text, voice, image input
│   ├── CodePreview.tsx   # Sandboxed iframe preview
│   ├── LiveEditor.tsx    # Monaco code editor
│   ├── TemplateGallery.tsx # Built-in templates
│   └── ...
├── services/
│   ├── geminiService.ts  # Gemini 3 API integration
│   ├── storageService.ts # IndexedDB persistence
│   └── githubService.ts  # GitHub export
├── hooks/
│   └── useKeyboardShortcuts.ts
├── utils/
│   ├── exportUtils.ts    # Export functionality
│   ├── diffUtils.ts      # Version comparison
│   └── urlUtils.ts       # URL sharing
├── data/
│   └── defaultTemplates.ts # 10+ built-in templates
└── App.tsx               # Main application
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with Gemini 3 for the Google AI Hackathon 2025**

Made with code and creativity

</div>
