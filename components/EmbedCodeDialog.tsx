import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types';

interface EmbedCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: HistoryItem;
}

export const EmbedCodeDialog: React.FC<EmbedCodeDialogProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [copied, setCopied] = useState<'iframe' | 'script' | 'link' | null>(null);
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('500px');

  // Create a data URL from the code
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(item.result.code)}`;

  // Generate blob URL for preview
  const blob = new Blob([item.result.code], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);

  const iframeCode = `<iframe
  src="${dataUrl}"
  width="${width}"
  height="${height}"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"
  title="${item.appSettings?.name || item.result.explanation}"
  sandbox="allow-scripts allow-same-origin allow-forms"
></iframe>`;

  const scriptCode = `<!-- Prism Embed -->
<div id="prism-embed-${item.id}" style="width: ${width}; height: ${height}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>
<script>
(function() {
  const container = document.getElementById('prism-embed-${item.id}');
  const iframe = document.createElement('iframe');
  iframe.srcdoc = ${JSON.stringify(item.result.code)};
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
  iframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
  container.appendChild(iframe);
})();
</script>`;

  const handleCopy = async (code: string, type: 'iframe' | 'script' | 'link') => {
    await navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(item.result.code);
      newWindow.document.close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Embed Code</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Size Controls */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Width</label>
              <select
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="100%">100% (Responsive)</option>
                <option value="800px">800px</option>
                <option value="600px">600px</option>
                <option value="400px">400px</option>
                <option value="375px">375px (Mobile)</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Height</label>
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="300px">300px</option>
                <option value="400px">400px</option>
                <option value="500px">500px</option>
                <option value="600px">600px</option>
                <option value="800px">800px</option>
                <option value="100vh">Full Height (100vh)</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Preview</label>
            <div className="relative bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="aspect-video bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-inner">
                <iframe
                  srcDoc={item.result.code}
                  className="w-full h-full border-none"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
              <button
                onClick={handleOpenInNewTab}
                className="absolute top-6 right-6 flex items-center gap-1 px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded shadow-lg text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Open
              </button>
            </div>
          </div>

          {/* Iframe Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">HTML Iframe</label>
              <button
                onClick={() => handleCopy(iframeCode, 'iframe')}
                className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
              >
                {copied === 'iframe' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === 'iframe' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 bg-zinc-950 rounded-lg overflow-x-auto">
              <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">{iframeCode}</code>
            </pre>
          </div>

          {/* Script Embed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">JavaScript Embed</label>
              <button
                onClick={() => handleCopy(scriptCode, 'script')}
                className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
              >
                {copied === 'script' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === 'script' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 bg-zinc-950 rounded-lg overflow-x-auto max-h-40">
              <code className="text-xs text-blue-400 font-mono whitespace-pre-wrap break-all">{scriptCode}</code>
            </pre>
          </div>

          {/* Data URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Direct Link (Data URL)</label>
              <button
                onClick={() => handleCopy(dataUrl, 'link')}
                className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
              >
                {copied === 'link' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === 'link' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg">
              <code className="text-xs text-orange-400 font-mono break-all line-clamp-2">{dataUrl.slice(0, 200)}...</code>
            </div>
          </div>

          {/* Tips */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> The iframe embed is best for simple integrations. The JavaScript embed offers more flexibility and can be styled with CSS. Note that data URLs have length limits in some browsers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
