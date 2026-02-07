import React, { useState } from 'react';
import {
  X, Shuffle, Plus, Minus, Loader2, Sparkles,
  ChevronRight, Check, Eye
} from 'lucide-react';
import { HistoryItem } from '../types';

interface RemixDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRemix: (prompt: string, selectedItems: HistoryItem[]) => void;
  isGenerating: boolean;
}

export const RemixDialog: React.FC<RemixDialogProps> = ({
  isOpen,
  onClose,
  history,
  onRemix,
  isGenerating,
}) => {
  const [selectedItems, setSelectedItems] = useState<HistoryItem[]>([]);
  const [remixPrompt, setRemixPrompt] = useState('');
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);

  const toggleSelect = (item: HistoryItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.id === item.id);
      if (isSelected) {
        return prev.filter(i => i.id !== item.id);
      }
      if (prev.length >= 4) {
        return prev; // Max 4 items
      }
      return [...prev, item];
    });
  };

  const handleRemix = () => {
    if (selectedItems.length < 2) return;

    const combinedPrompt = remixPrompt ||
      `Combine the best elements from these ${selectedItems.length} designs: ${selectedItems.map(i => i.prompt).join('; ')}`;

    onRemix(combinedPrompt, selectedItems);
  };

  const getRemixSuggestions = () => {
    if (selectedItems.length < 2) return [];

    return [
      `Merge the layout from the first design with the color scheme from the second`,
      `Create a hybrid combining all selected styles`,
      `Take the best UI elements from each and unify them`,
      `Combine the functionality while modernizing the design`,
    ];
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[80vh] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 z-50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">Remix Designs</h2>
              <p className="text-xs text-zinc-500">Combine multiple generations into one</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Selection */}
          <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-700">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Select 2-4 designs to remix
                </span>
                <span className="text-xs text-zinc-500">
                  {selectedItems.length}/4 selected
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
              {history.length === 0 ? (
                <div className="col-span-2 flex items-center justify-center h-40 text-sm text-zinc-500">
                  No generations in history yet
                </div>
              ) : (
                history.map((item) => {
                  const isSelected = selectedItems.some(i => i.id === item.id);

                  return (
                    <div
                      key={item.id}
                      className={`relative group rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                      onClick={() => toggleSelect(item)}
                    >
                      {/* Preview thumbnail */}
                      <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                        <iframe
                          srcDoc={item.result.code}
                          className="w-full h-full scale-[0.25] origin-top-left pointer-events-none"
                          style={{ width: '400%', height: '400%' }}
                          sandbox="allow-scripts"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="p-2">
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate">
                          {item.prompt}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Selection indicator */}
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-pink-500 text-white'
                          : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-400'
                      }`}>
                        {isSelected ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>

                      {/* Preview button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="absolute bottom-2 right-2 p-1.5 bg-white/80 dark:bg-zinc-800/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Remix options */}
          <div className="w-80 flex flex-col">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Remix Options
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Selected items */}
              {selectedItems.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Selected ({selectedItems.length})
                  </label>
                  <div className="space-y-1">
                    {selectedItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                      >
                        <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="flex-1 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                          {item.prompt}
                        </span>
                        <button
                          onClick={() => toggleSelect(item)}
                          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                        >
                          <Minus className="w-3 h-3 text-zinc-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remix prompt */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Remix Instructions (optional)
                </label>
                <textarea
                  value={remixPrompt}
                  onChange={(e) => setRemixPrompt(e.target.value)}
                  placeholder="Describe how to combine these designs..."
                  className="w-full h-24 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Suggestions */}
              {selectedItems.length >= 2 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Quick Suggestions
                  </label>
                  <div className="space-y-1">
                    {getRemixSuggestions().map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setRemixPrompt(suggestion)}
                        className="w-full text-left p-2 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
              <button
                onClick={handleRemix}
                disabled={selectedItems.length < 2 || isGenerating}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Remixing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Remix Selected
                  </>
                )}
              </button>
              {selectedItems.length < 2 && (
                <p className="text-xs text-zinc-500 text-center mt-2">
                  Select at least 2 designs to remix
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewItem && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setPreviewItem(null)}
          />
          <div className="fixed inset-8 bg-white dark:bg-zinc-900 rounded-2xl z-[70] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                {previewItem.prompt}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              srcDoc={previewItem.result.code}
              className="flex-1 w-full bg-white"
              sandbox="allow-scripts"
            />
          </div>
        </>
      )}
    </>
  );
};
