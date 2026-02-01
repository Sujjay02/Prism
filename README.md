<div align="center">
<img width="1200" height="475" alt="Prism Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Prism

### AI-Powered Universal Code Generator

**One prompt. Infinite possibilities. Powered by Gemini 3.**

[![Gemini 3](https://img.shields.io/badge/Powered%20by-Gemini%203-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Live Demo](https://aistudio.google.com/app/prompts/1DByJVjJOVgokvZ_JKh1sa1GO54LXBtJb) | [Watch Video](#demo-video) | [Report Bug](https://github.com/yourusername/prism/issues)

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
| AI Code Explanation | No | No | **Gemini 3** |
| Live Code Editor | No | Yes | **Monaco** |
| Export to GitHub | No | No | Yes |
| Offline Templates | No | No | **15+ built-in** |

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

// AI-powered code explanation
const explanation = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: { parts: [{ text: `Explain this code: ${code}` }] },
  config: { responseMimeType: 'application/json' }
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
│                              PRISM ARCHITECTURE                            │
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
│  │  │  Template   │ │   AI Code   │ │   Asset     │ │   Share     │    │  │
│  │  │  Gallery    │ │   Explain   │ │   Manager   │ │   Dialog    │    │  │
│  │  │ (15+ built- │ │  (Gemini 3  │ │  (Images/   │ │  (URL-based │    │  │
│  │  │  in + user) │ │   powered)  │ │   3D files) │ │   sharing)  │    │  │
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
echo "API_KEY=your_gemini_api_key_here" > .env.local

# Start development server
npm run dev
```

### Usage

1. **Text Prompt**: Type a description of what you want to build
2. **Voice Input**: Click the microphone icon and speak your idea
3. **Image Upload**: Drag and drop a wireframe or screenshot
4. **Iterate**: Refine your generation with follow-up prompts
5. **Explain**: Click the purple "Explain" button to understand the code
6. **Export**: Download as HTML, React component, or push to GitHub

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
prism/
├── components/           # React components
│   ├── InputArea.tsx     # Text, voice, image input
│   ├── CodePreview.tsx   # Sandboxed iframe preview
│   ├── LiveEditor.tsx    # Monaco code editor
│   ├── CodeExplanation.tsx # AI-powered explanation
│   ├── GeneratingAnimation.tsx # Loading animation
│   ├── VoiceCommandShowcase.tsx # Voice examples
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
│   └── defaultTemplates.ts # 15+ built-in templates
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

*Like light through a prism, one prompt becomes infinite possibilities.*

</div>
