import React, { useState } from 'react';
import { Check, Copy, AlertCircle, Download } from 'lucide-react';
import { CodeViewerProps } from '../types';

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, explanation }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = async () => {
    try {
      if (!code) throw new Error('No code to copy');
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!code) return;

    // Infer file extension based on content
    let extension = '.txt';
    const trimmed = code.trim();
    
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
      extension = '.html';
    } else if (
      trimmed.startsWith('import ') || 
      trimmed.startsWith('from ') || 
      trimmed.includes('def ') || 
      trimmed.startsWith('#')
    ) {
      // Basic heuristic for Python code
      extension = '.py';
    } else if (trimmed.startsWith('export ') || trimmed.includes('const App') || trimmed.includes('import React')) {
      // Basic heuristic for React/JS components (though in this app context they are usually embedded in HTML)
      extension = '.tsx';
    }

    // Sanitize filename from explanation
    let filename = 'generated_code';
    if (explanation) {
      filename = explanation
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .substring(0, 60); // Limit length
    }
    
    // Fallback if sanitization results in empty string
    if (!filename) filename = 'generated_code';

    const fullFileName = `${filename}${extension}`;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fullFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!code) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 p-8 bg-zinc-50 dark:bg-[#0d0d10]">
        <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm font-medium">No code available to display.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        {/* Export/Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg border shadow-lg transition-all duration-200 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700"
          title="Download Code"
        >
          <Download className="w-4 h-4" />
          <span className="text-xs font-medium hidden group-hover:inline-block">Export</span>
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border shadow-lg transition-all duration-200 ${
            copied 
              ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400' 
              : copyError
                ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700'
          }`}
          title="Copy to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-xs font-medium">Copied!</span>
            </>
          ) : copyError ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Failed</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs font-medium hidden group-hover:inline-block">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full h-full overflow-auto bg-zinc-50 dark:bg-[#0d0d10] p-4 pt-16 transition-colors duration-300">
        <pre className="font-mono text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap break-all transition-all duration-500 ease-out hover:scale-[1.01] origin-top-left hover:text-zinc-900 dark:hover:text-zinc-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};