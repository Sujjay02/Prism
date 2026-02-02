import React, { useState } from 'react';
import {
  X, Eye, Loader2, AlertTriangle, CheckCircle, Info,
  RefreshCw, Contrast, Type, MousePointer, Keyboard, Volume2
} from 'lucide-react';

interface A11yIssue {
  category: 'contrast' | 'aria' | 'keyboard' | 'semantic' | 'alt-text' | 'focus';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  element?: string;
  message: string;
  fix: string;
  wcag?: string;
}

interface AuditResult {
  score: number;
  issues: A11yIssue[];
  passed: string[];
  summary: string;
}

interface AccessibilityAuditProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  apiKey: string;
}

const categoryIcons: Record<A11yIssue['category'], React.ReactNode> = {
  contrast: <Contrast className="w-4 h-4" />,
  aria: <Volume2 className="w-4 h-4" />,
  keyboard: <Keyboard className="w-4 h-4" />,
  semantic: <Type className="w-4 h-4" />,
  'alt-text': <Eye className="w-4 h-4" />,
  focus: <MousePointer className="w-4 h-4" />,
};

const severityColors: Record<A11yIssue['severity'], string> = {
  critical: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  serious: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  moderate: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  minor: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

export const AccessibilityAudit: React.FC<AccessibilityAuditProps> = ({
  isOpen,
  onClose,
  code,
  apiKey,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [filter, setFilter] = useState<A11yIssue['severity'] | 'all'>('all');

  const runAudit = async () => {
    if (!code.trim() || !apiKey) return;

    setIsAuditing(true);
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
                text: `You are an accessibility expert. Audit the following HTML/JSX code for WCAG 2.1 compliance and accessibility issues.

Check for:
- Color contrast issues
- Missing ARIA attributes
- Keyboard navigation problems
- Semantic HTML issues
- Missing alt text on images
- Focus management issues

Respond in this exact JSON format:
{
  "score": <0-100 accessibility score>,
  "issues": [
    {
      "category": "contrast|aria|keyboard|semantic|alt-text|focus",
      "severity": "critical|serious|moderate|minor",
      "element": "<element selector or description>",
      "message": "<description of the issue>",
      "fix": "<how to fix it>",
      "wcag": "<WCAG guideline reference like '1.4.3'>"
    }
  ],
  "passed": ["<list of things done correctly>"],
  "summary": "<brief summary of accessibility status>"
}

Code to audit:
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

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      }
    } catch (error) {
      console.error('Accessibility audit failed:', error);
      setResult({
        score: 0,
        issues: [{
          category: 'semantic',
          severity: 'critical',
          message: 'Audit failed. Please try again.',
          fix: 'Check your connection and try again.'
        }],
        passed: [],
        summary: 'Audit failed',
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-500' };
    if (score >= 80) return { grade: 'B', color: 'text-lime-500' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-500' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  const filteredIssues = result?.issues.filter(
    issue => filter === 'all' || issue.severity === filter
  ) || [];

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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">Accessibility Audit</h2>
              <p className="text-xs text-zinc-500">WCAG 2.1 Compliance Check</p>
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
          {!result && !isAuditing && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Accessibility Check
              </h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                Audit your code for WCAG 2.1 compliance and get actionable recommendations.
              </p>
              <button
                onClick={runAudit}
                disabled={!code.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Run Audit
              </button>
            </div>
          )}

          {isAuditing && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-sm text-zinc-500">Checking accessibility...</p>
            </div>
          )}

          {result && !isAuditing && (
            <div className="space-y-4">
              {/* Score Card */}
              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreGrade(result.score).color}`}>
                    {getScoreGrade(result.score).grade}
                  </div>
                  <div className="text-xs text-zinc-500">{result.score}/100</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
                    Accessibility Score
                  </div>
                  <p className="text-xs text-zinc-500">{result.summary}</p>
                </div>
                <button
                  onClick={runAudit}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  title="Re-audit"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Passed Checks */}
              {result.passed.length > 0 && (
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {result.passed.length} Checks Passed
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.passed.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 rounded text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'critical', 'serious', 'moderate', 'minor'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilter(level)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      filter === level
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                    {level !== 'all' && (
                      <span className="ml-1">
                        ({result.issues.filter(i => i.severity === level).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Issues List */}
              <div className="space-y-2">
                {filteredIssues.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {filter === 'all' ? 'No accessibility issues found!' : `No ${filter} issues found!`}
                    </span>
                  </div>
                ) : (
                  filteredIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${severityColors[issue.severity]}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{categoryIcons[issue.category]}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium uppercase">
                              {issue.severity}
                            </span>
                            <span className="text-xs opacity-60">{issue.category}</span>
                            {issue.wcag && (
                              <span className="text-xs px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded">
                                WCAG {issue.wcag}
                              </span>
                            )}
                          </div>
                          {issue.element && (
                            <code className="text-xs font-mono opacity-70 block mt-1">
                              {issue.element}
                            </code>
                          )}
                          <p className="text-sm mt-1">{issue.message}</p>
                          <div className="flex items-start gap-1 mt-2 text-xs">
                            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{issue.fix}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 text-center">
            Based on WCAG 2.1 Guidelines • AA Compliance
          </p>
        </div>
      </div>
    </>
  );
};
