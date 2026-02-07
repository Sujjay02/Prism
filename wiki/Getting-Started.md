# Getting Started

Get Prism up and running in under 5 minutes.

---

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Gemini API Key** - [Get one free](https://aistudio.google.com/apikey)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Sujjay02/Prism.git
cd Prism
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
```

Replace `your_gemini_api_key_here` with your actual Gemini API key.

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start development server with hot reload |
| Build | `npm run build` | Create optimized production build |
| Preview | `npm run preview` | Preview the production build locally |
| Lint | `npm run lint` | Run ESLint to check code quality |

## First Steps

Once the app is running:

1. **Type a prompt** - Describe what you want to build in natural language
2. **Choose an input method** - Text, voice, or image upload
3. **Generate** - Press `Ctrl/Cmd + Enter` or click the Generate button
4. **Preview** - See the live result in the preview pane
5. **Iterate** - Refine with follow-up prompts
6. **Export** - Download or share your creation

### Try These Starter Prompts

- `"Create a beautiful dashboard with charts and KPIs"`
- `"Build a 3D solar system with orbiting planets"`
- `"Monte Carlo simulation of stock prices with matplotlib"`
- `"SaaS landing page with hero section and pricing table"`

## Troubleshooting

### API Key Issues

- Make sure your `.env.local` file is in the project root (not inside `src/`)
- The variable must be prefixed with `VITE_` (i.e., `VITE_GEMINI_API_KEY`)
- Restart the dev server after changing environment variables

### Build Errors

- Ensure you're using Node.js 18 or higher: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Generation Failures

- Verify your Gemini API key is valid and has quota remaining
- Check the browser console for error details
- The app includes retry logic with exponential backoff for rate limits (429) and server errors (503)

---

Next: [[Features]] - Explore everything Prism can do.
