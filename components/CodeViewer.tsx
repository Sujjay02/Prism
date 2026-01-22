import React, { useState } from 'react';
import { Check, Copy, AlertCircle } from 'lucide-react';
import { CodeViewerProps } from '../types';

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
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
      <button
        onClick={handleCopy}
        className={`absolute top-4 right-4 z-10 flex items-center space-x-2 px-3 py-2 rounded-lg border shadow-lg transition-all duration-200 ${
          copied 
            ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400' 
            : copyError
              ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400'
              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700'
        }`}
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
            <span className="text-xs font-medium hidden group-hover:inline-block">Copy Code</span>
          </>
        )}
      </button>

      <div className="w-full h-full overflow-auto bg-zinc-50 dark:bg-[#0d0d10] p-4 pt-16 transition-colors duration-300">
        <pre className="font-mono text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap break-all transition-all duration-500 ease-out hover:scale-[1.01] origin-top-left hover:text-zinc-900 dark:hover:text-zinc-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};