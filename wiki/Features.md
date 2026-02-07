# Features

A comprehensive guide to everything Prism can do.

---

## Multi-Modal Input

Prism accepts input in multiple formats, individually or combined:

### Text Prompts
Describe what you want in natural language. Prism understands context and can handle complex, multi-part requirements.

```
"Build an analytics dashboard with a sidebar, 3 KPI cards, a line chart, and a data table with pagination"
```

### Voice Commands
Click the microphone icon and speak your idea. Prism uses Gemini's audio transcription to convert speech to text with high accuracy, then generates code from the transcription.

### Image Upload
Drag and drop or click to upload:
- Wireframes and mockups
- Screenshots of existing UIs
- Design files
- Hand-drawn sketches

Prism uses Gemini's vision analysis to convert images into accurate, functional code.

### File Import
Import from various sources:
- GitHub URLs
- Figma files
- PDF documents
- Text files

### Iterative Refinement
Build on previous generations with follow-up prompts. Prism includes context from your previous code when generating updates.

---

## Output Modes

Prism automatically detects the best output mode based on your prompt:

### Mode 1: Python + Data Visualization
Generate Python scripts that run directly in the browser via Pyodide (WebAssembly).

**Capabilities:**
- matplotlib charts and plots
- numpy calculations
- Interactive sliders and controls
- Real-time simulations (Lorenz attractors, particle systems, etc.)
- Data analysis and statistics

**Example prompts:**
- `"Monte Carlo simulation of Pi"`
- `"Stock price prediction with moving averages"`
- `"Interactive Mandelbrot set explorer"`

### Mode 2: React Three Fiber / 3D WebGL
Generate 3D visualizations with physics, post-processing, and interactivity.

**Capabilities:**
- Full 3D scenes with Three.js
- Physics simulations (gravity, collisions, bouncing)
- Post-processing effects (bloom, glow, vignette)
- Interactive controls with Leva UI
- Particle systems and animations

**Example prompts:**
- `"3D solar system with orbiting planets and realistic lighting"`
- `"Interactive molecular structure viewer"`
- `"Bouncing balls with physics and neon trails"`

### Mode 3: React Components & Dashboards
Production-ready React components with Tailwind CSS.

**Capabilities:**
- Dashboard layouts with charts and KPIs
- Form components with validation
- Full state management
- Responsive design

**Example prompts:**
- `"Analytics dashboard with sidebar navigation"`
- `"Kanban board with drag and drop"`
- `"E-commerce product page with reviews"`

### Mode 4: Standard HTML/CSS/JS
Landing pages, forms, and static sites with modern design.

**Capabilities:**
- Responsive HTML5 layouts
- Tailwind CSS styling
- Interactive JavaScript widgets
- Form validation
- localStorage persistence

**Example prompts:**
- `"SaaS landing page with pricing table and testimonials"`
- `"Contact form with validation and dark mode"`
- `"Animated portfolio website"`

---

## AI-Powered Tools

### Code Explanation
Understand how any generated code works. Click "Explain" in the AI toolbar group to get:
- A summary of what the code does
- Key components breakdown
- Step-by-step explanation of how it works
- Customization tips and suggestions

### Code Review
Get AI-powered quality analysis:
- **Quality score** from 0-100
- **Issue categorization**: errors, warnings, suggestions, optimizations
- **Line-by-line feedback** with specific locations
- **Optimized code suggestions** with fixes applied

### Accessibility Audit
WCAG 2.1 compliance checking:
- Color contrast analysis
- ARIA attributes validation
- Keyboard navigation testing
- Semantic HTML verification
- Alt text presence checking
- Focus management assessment
- Scored by severity (critical, major, minor)

### Auto-Fix
When runtime errors occur in the preview:
- Errors are automatically detected and displayed
- Prism can suggest and apply fixes
- One-click error resolution

---

## Ribbon-Style Toolbar

A Microsoft Word-inspired toolbar organizes all tools into logical groups:

| Group | Tools |
|-------|-------|
| **View** | Preview, Code, Editor, Diff mode toggles |
| **Device** | Mobile (375px), Tablet (768px), Desktop (1024px), Full viewport |
| **AI** | Explain, Code Review, Accessibility Audit |
| **Export** | HTML download, React/Vue/Svelte, Share, QR Code |
| **Tools** | Templates, Remix, Console |
| **Actions** | Undo, Redo, Publish, App Settings |

---

## App Management

Publish and manage your generated apps:

- **Custom names** - Give your app a meaningful name
- **Emoji icons** - Choose an emoji to represent your app
- **Descriptions** - Add context about what the app does
- **Categories** - Organize by type: Dashboard, Landing, Form, Game, Visualization, Ecommerce, Social, Utility
- **Tags** - Add searchable tags for organization
- **Pin favorites** - Quick access to your best creations
- **Grid/List view** - Toggle between card and list layouts
- **Sorting** - Sort by date (newest/oldest), name, or category
- **Search** - Full-text search across prompts and names
- **Duplicate** - Clone any app with one click
- **Folders** - Color-coded folder organization

---

## Remix Feature

Combine 2-4 previous designs into something new. Select multiple history items and describe how they should be merged. Prism's AI combines layouts, styles, and functionality based on your instructions.

---

## View Modes

| Mode | Description |
|------|-------------|
| **Preview** | Live rendering in a sandboxed iframe with hot reload |
| **Code** | Syntax-highlighted, read-only code view |
| **Editor** | Full Monaco editor for live code editing |
| **Diff** | Side-by-side comparison between versions |
| **Python** | Special rendering mode for Python/Pyodide output |
| **Console** | Runtime console output and debug logs |

---

## Theme Support

- **Dark/Light mode** toggle
- Persisted in localStorage
- Custom accent color selection
- Respects system preference on first load

---

Next: [[Architecture]] - Understand how Prism is built.
