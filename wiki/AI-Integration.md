# AI Integration

How Prism leverages Google's Gemini 3 models for intelligent code generation and analysis.

---

## Models Used

### Gemini 3 Pro Preview (`gemini-3-pro-preview`)

The primary model used for high-quality code generation.

**Used for:**
- Multi-modal code generation (text + images + audio)
- Vision analysis (wireframe/screenshot to code)
- Complex prompt understanding and reasoning
- Google Search grounding for up-to-date API references

### Gemini 3 Flash Preview (`gemini-3-flash-preview`)

A faster, lighter model used for interactive features.

**Used for:**
- Audio transcription (voice to text)
- Code explanation
- Improvement suggestions
- Code review and accessibility audits
- Quick inference for real-time features

---

## Core API Functions

All Gemini interactions are centralized in `services/geminiService.ts`.

### `generateUI(prompt, imageData?, audioData?, files?)`

The main generation function. Accepts multi-modal input and returns working code.

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
```

**Features:**
- Combines text, images, and audio in a single request
- Uses Google Search grounding for current API documentation
- Returns JSON with `code` and `explanation` fields
- Includes retry logic with exponential backoff

### `explainCode(code)`

Analyzes code and returns a structured explanation.

**Returns:**
- Summary of functionality
- Key components list
- Step-by-step "how it works" explanation
- Customization tips

### `suggestImprovements(code)`

Recommends enhancements for generated code.

### `reviewCode(code)`

Performs AI-powered code quality analysis.

**Returns:**
- Quality score (0-100)
- Issues categorized by type: error, warning, suggestion, optimization
- Line-specific feedback
- Optimized code with fixes applied

### `auditAccessibility(code)`

Checks code for WCAG 2.1 compliance.

**Returns:**
- Overall score
- Issues by severity: critical, major, minor
- WCAG criterion references
- Specific recommendations and fixes

### `transcribeAudio(audioBlob)`

Converts voice recordings to text using Gemini's audio capabilities.

---

## Smart Mode Detection

Gemini automatically selects the output mode based on prompt content:

| Detected Keywords | Output Mode | What Happens |
|-------------------|-------------|--------------|
| python, matplotlib, numpy, pandas, scipy, data analysis | **Python + Pyodide** | Generates pure Python compatible with Pyodide WASM runtime |
| 3D, three.js, WebGL, react three fiber, orbit, sphere, mesh | **React Three Fiber** | Generates 3D scenes with proper import maps from esm.sh |
| _(default)_ | **HTML + Tailwind** | Generates standard HTML/CSS/JS with Tailwind styling |

---

## System Instruction

The system instruction sent to Gemini (~445 lines) defines:

### Response Format
- JSON-only responses with `code` and `explanation` fields
- No markdown code blocks in output
- Complete, self-contained, working code

### Code Quality Rules
- Strict mode enabled
- Proper error handling
- Crossorigin attributes for external scripts
- No placeholder images (uses inline SVG or CSS gradients)

### Mode-Specific Rules

**Python Mode:**
- Only use Pyodide-compatible libraries
- matplotlib for visualization
- Interactive HTML output for sliders/controls

**3D Mode:**
- Check refs before using in useFrame
- Physics simulation without external physics libraries
- Bloom/glow effects with post-processing pipeline
- Particle systems and animations

**HTML Mode:**
- Tailwind CSS via CDN
- Internal anchor links must be functional
- Form validation included
- localStorage for data persistence where appropriate

---

## Error Handling & Retry Logic

The Gemini service includes robust error handling:

```
Request fails with 429 (Rate Limit) or 503 (Server Error)
         │
         ▼
   Wait with exponential backoff
   (1s → 2s → 4s → 8s)
         │
         ▼
   Retry up to 3 times
         │
         ▼
   If still failing → Show user-friendly error
```

---

## Google Search Grounding

Prism enables Google Search grounding in generation requests:

```typescript
config: {
  tools: [{ googleSearch: {} }]
}
```

This allows Gemini to:
- Access current API documentation
- Reference up-to-date framework syntax
- Use real-world data in generated examples
- Ensure CDN links are valid and current

Search grounding results are extracted and displayed alongside generated code.

---

Next: [[Components Reference]] - Detailed component documentation.
