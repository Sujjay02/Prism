import React, { useState, useEffect } from 'react';
import { X, BookOpen, Lightbulb, Cog, ChevronDown, ChevronUp, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { explainCode, suggestImprovements } from '../services/geminiService';

interface CodeExplanationProps {
  code: string;
  onClose: () => void;
  onApplySuggestion?: (suggestion: string) => void;
}

interface Explanation {
  summary: string;
  keyComponents: { name: string; description: string }[];
  howItWorks: string;
  customizationTips: string[];
}

export const CodeExplanation: React.FC<CodeExplanationProps> = ({ code, onClose, onApplySuggestion }) => {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingExplanation, setLoadingExplanation] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  useEffect(() => {
    const fetchExplanation = async () => {
      setLoadingExplanation(true);
      const result = await explainCode(code);
      setExplanation(result);
      setLoadingExplanation(false);
    };

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      const result = await suggestImprovements(code);
      setSuggestions(result);
      setLoadingSuggestions(false);
    };

    fetchExplanation();
    fetchSuggestions();
  }, [code]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">AI Code Explanation</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Powered by Gemini 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-140px)] space-y-4">
          {loadingExplanation ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">Analyzing your code with Gemini 3...</p>
            </div>
          ) : explanation ? (
            <>
              {/* Summary Section */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('summary')}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="font-medium text-zinc-900 dark:text-white">Summary</span>
                  </div>
                  {expandedSection === 'summary' ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                {expandedSection === 'summary' && (
                  <div className="px-4 pb-4">
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{explanation.summary}</p>
                  </div>
                )}
              </div>

              {/* Key Components */}
              {explanation.keyComponents.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('components')}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Cog className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-zinc-900 dark:text-white">Key Components</span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {explanation.keyComponents.length}
                      </span>
                    </div>
                    {expandedSection === 'components' ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                  {expandedSection === 'components' && (
                    <div className="px-4 pb-4 space-y-2">
                      {explanation.keyComponents.map((comp, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-white dark:bg-zinc-900 rounded-lg">
                          <span className="text-xs font-mono bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded text-zinc-700 dark:text-zinc-300">
                            {comp.name}
                          </span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">{comp.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* How It Works */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('howItWorks')}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-zinc-900 dark:text-white">How It Works</span>
                  </div>
                  {expandedSection === 'howItWorks' ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                {expandedSection === 'howItWorks' && (
                  <div className="px-4 pb-4">
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{explanation.howItWorks}</p>
                  </div>
                )}
              </div>

              {/* Customization Tips */}
              {explanation.customizationTips.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('tips')}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-zinc-900 dark:text-white">Customization Tips</span>
                    </div>
                    {expandedSection === 'tips' ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                  {expandedSection === 'tips' && (
                    <div className="px-4 pb-4">
                      <ul className="space-y-2">
                        {explanation.customizationTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-zinc-600 dark:text-zinc-300">
                            <span className="text-yellow-500 mt-1">-</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}

          {/* AI Suggestions */}
          <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Wand2 className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium text-zinc-900 dark:text-white">AI Improvement Suggestions</h3>
            </div>
            {loadingSuggestions ? (
              <div className="flex items-center space-x-2 text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating suggestions...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg group"
                  >
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">{suggestion}</span>
                    {onApplySuggestion && (
                      <button
                        onClick={() => onApplySuggestion(suggestion)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-all"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
