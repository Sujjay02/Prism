import React, { useState } from 'react';
import {
  X, Download, Copy, Check, Loader2, FileCode,
  ExternalLink, Code2
} from 'lucide-react';

type Framework = 'react' | 'vue' | 'svelte' | 'html';

interface ExportFormatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  apiKey: string;
}

const frameworks: { id: Framework; name: string; icon: string; ext: string; color: string }[] = [
  { id: 'html', name: 'HTML', icon: '🌐', ext: 'html', color: 'from-orange-500 to-red-500' },
  { id: 'react', name: 'React', icon: '⚛️', ext: 'tsx', color: 'from-cyan-500 to-blue-500' },
  { id: 'vue', name: 'Vue', icon: '💚', ext: 'vue', color: 'from-green-500 to-emerald-500' },
  { id: 'svelte', name: 'Svelte', icon: '🔥', ext: 'svelte', color: 'from-orange-500 to-red-500' },
];

export const ExportFormatDialog: React.FC<ExportFormatDialogProps> = ({
  isOpen,
  onClose,
  code,
  apiKey,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('html');
  const [convertedCode, setConvertedCode] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  const convertCode = async (framework: Framework) => {
    setSelectedFramework(framework);

    if (framework === 'html') {
      setConvertedCode(code);
      return;
    }

    if (!apiKey || !code.trim()) return;

    setIsConverting(true);
    setConvertedCode('');

    const frameworkInstructions: Record<Framework, string> = {
      html: '',
      react: `Convert the following HTML/CSS code into a React functional component using TypeScript (TSX).
- Use modern React patterns (hooks, functional components)
- Extract inline styles to a separate CSS module or styled-components if complex
- Make the component self-contained and reusable
- Add proper TypeScript types
- Use semantic component naming`,
      vue: `Convert the following HTML/CSS code into a Vue 3 Single File Component (SFC).
- Use Composition API with <script setup>
- Use TypeScript
- Keep styles scoped
- Make the component self-contained and reusable`,
      svelte: `Convert the following HTML/CSS code into a Svelte component.
- Use modern Svelte syntax
- Add TypeScript support with <script lang="ts">
- Keep styles scoped
- Make the component self-contained and reusable`,
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${frameworkInstructions[framework]}

IMPORTANT: Only output the converted code, no explanations or markdown code blocks.

Code to convert:
${code}`
              }]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 8192,
            }
          })
        }
      );

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Clean up any markdown code blocks
      text = text.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();

      setConvertedCode(text);
    } catch (error) {
      console.error('Conversion failed:', error);
      setConvertedCode('// Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(convertedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const framework = frameworks.find(f => f.id === selectedFramework);
    const blob = new Blob([convertedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Component.${framework?.ext || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInCodeSandbox = () => {
    const files: Record<string, { content: string }> = {};
    const framework = frameworks.find(f => f.id === selectedFramework);

    if (selectedFramework === 'react') {
      files['App.tsx'] = { content: convertedCode };
      files['index.tsx'] = {
        content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`
      };
      files['package.json'] = {
        content: JSON.stringify({
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0'
          }
        }, null, 2)
      };
    } else if (selectedFramework === 'vue') {
      files['App.vue'] = { content: convertedCode };
      files['main.js'] = {
        content: `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');`
      };
    } else if (selectedFramework === 'svelte') {
      files['App.svelte'] = { content: convertedCode };
      files['main.js'] = {
        content: `import App from './App.svelte';

const app = new App({
  target: document.body,
});

export default app;`
      };
    } else {
      files['index.html'] = { content: convertedCode };
    }

    const parameters = btoa(JSON.stringify({ files }));
    window.open(`https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`, '_blank');
  };

  React.useEffect(() => {
    if (isOpen && code) {
      setConvertedCode(code);
      setSelectedFramework('html');
    }
  }, [isOpen, code]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:max-h-[80vh] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 z-50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">Export Code</h2>
              <p className="text-xs text-zinc-500">Convert to different frameworks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framework Selector */}
        <div className="flex gap-2 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          {frameworks.map((framework) => (
            <button
              key={framework.id}
              onClick={() => convertCode(framework.id)}
              disabled={isConverting}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                selectedFramework === framework.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              } disabled:opacity-50`}
            >
              <div className="text-2xl mb-1">{framework.icon}</div>
              <div className={`text-sm font-medium ${
                selectedFramework === framework.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-700 dark:text-zinc-300'
              }`}>
                {framework.name}
              </div>
              <div className="text-xs text-zinc-500">.{framework.ext}</div>
            </button>
          ))}
        </div>

        {/* Code Preview */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800">
            <span className="text-xs font-mono text-zinc-500">
              Component.{frameworks.find(f => f.id === selectedFramework)?.ext}
            </span>
            <div className="flex gap-1">
              <button
                onClick={copyCode}
                disabled={!convertedCode || isConverting}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadCode}
                disabled={!convertedCode || isConverting}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
              <button
                onClick={openInCodeSandbox}
                disabled={!convertedCode || isConverting}
                className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <ExternalLink className="w-3 h-3" />
                CodeSandbox
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-zinc-900 p-4">
            {isConverting ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <pre className="text-sm text-zinc-100 font-mono whitespace-pre-wrap">
                <code>{convertedCode || '// No code to display'}</code>
              </pre>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Code2 className="w-3 h-3" />
            <span>AI-powered code conversion</span>
          </div>
        </div>
      </div>
    </>
  );
};
