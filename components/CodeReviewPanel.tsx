import React, { useState } from 'react';
import {
  X, Sparkles, AlertTriangle, CheckCircle, Info, Loader2,
  Zap, Shield, Gauge, Code, RefreshCw, Copy, Check
} from 'lucide-react';

interface CodeIssue {
  type: 'error' | 'warning' | 'suggestion' | 'optimization';
  line?: number;
  message: string;
  fix?: string;
}

interface ReviewResult {
  score: number;
  issues: CodeIssue[];
  summary: string;
  optimizedCode?: string;
}

interface CodeReviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onApplyOptimization?: (code: string) => void;
  apiKey: string;
}

export const CodeReviewPanel: React.FC<CodeReviewPanelProps> = ({
  isOpen,
  onClose,
  code,
  onApplyOptimization,
  apiKey,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [activeTab, setActiveTab] = useState<'issues' | 'optimized'>('issues');
  const [copied, setCopied] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim() || !apiKey) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a senior code reviewer. Analyze the following code and provide:
1. A quality score from 0-100
2. A list of issues (errors, warnings, suggestions, optimizations)
3. A brief summary
4. An optimized version of the code

Respond in this exact JSON format:
{
  "score": <number>,
  "issues": [
    {"type": "error|warning|suggestion|optimization", "line": <number or null>, "message": "<issue description>", "fix": "<suggested fix or null>"}
  ],
  "summary": "<brief summary>",
  "optimizedCode": "<full optimized code>"
}

Code to review:
\`\`\`
${code}
\`\`\``
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
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      }
    } catch (error) {
      console.error('Code review failed:', error);
      setResult({
        score: 0,
        issues: [{ type: 'error', message: 'Failed to analyze code. Please try again.' }],
        summary: 'Analysis failed',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyOptimizedCode = () => {
    if (result?.optimizedCode) {
      navigator.clipboard.writeText(result.optimizedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getIssueIcon = (type: CodeIssue['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'suggestion': return <Info className="w-4 h-4 text-blue-500" />;
      case 'optimization': return <Zap className="w-4 h-4 text-purple-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">AI Code Review</h2>
              <p className="text-xs text-zinc-500">Analyze & optimize your code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!result && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Ready to Review
              </h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                Get AI-powered insights on code quality, potential issues, and optimization suggestions.
              </p>
              <button
                onClick={analyzeCode}
                disabled={!code.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Code
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-sm text-zinc-500">Analyzing your code...</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-4">
              {/* Score Card */}
              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center gap-4">
                <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">Quality Score</span>
                  </div>
                  <p className="text-xs text-zinc-500">{result.summary}</p>
                </div>
                <button
                  onClick={analyzeCode}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  title="Re-analyze"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'issues'
                      ? 'border-purple-500 text-purple-500'
                      : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  Issues ({result.issues.length})
                </button>
                <button
                  onClick={() => setActiveTab('optimized')}
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'optimized'
                      ? 'border-purple-500 text-purple-500'
                      : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  Optimized Code
                </button>
              </div>

              {/* Issues List */}
              {activeTab === 'issues' && (
                <div className="space-y-2">
                  {result.issues.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-700 dark:text-green-300">No issues found! Great code.</span>
                    </div>
                  ) : (
                    result.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="flex items-start gap-2">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium uppercase text-zinc-500">
                                {issue.type}
                              </span>
                              {issue.line && (
                                <span className="text-xs text-zinc-400">Line {issue.line}</span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">
                              {issue.message}
                            </p>
                            {issue.fix && (
                              <p className="text-xs text-blue-500 mt-2">
                                Fix: {issue.fix}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Optimized Code */}
              {activeTab === 'optimized' && (
                <div className="space-y-3">
                  {result.optimizedCode ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">Optimized version</span>
                        <div className="flex gap-2">
                          <button
                            onClick={copyOptimizedCode}
                            className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1"
                          >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                          {onApplyOptimization && (
                            <button
                              onClick={() => onApplyOptimization(result.optimizedCode!)}
                              className="px-3 py-1.5 text-xs font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3" />
                              Apply
                            </button>
                          )}
                        </div>
                      </div>
                      <pre className="p-4 rounded-xl bg-zinc-900 text-zinc-100 text-xs overflow-x-auto max-h-[400px] overflow-y-auto">
                        <code>{result.optimizedCode}</code>
                      </pre>
                    </>
                  ) : (
                    <p className="text-sm text-zinc-500 text-center py-8">
                      No optimization available
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Security
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              Performance
            </div>
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              Best Practices
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
