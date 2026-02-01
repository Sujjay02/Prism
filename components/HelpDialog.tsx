import React, { useState } from 'react';
import {
  X, HelpCircle, Keyboard, Eye, Code2, Terminal, Edit3, GitCompare,
  Smartphone, Tablet, Monitor, Maximize2, Download, Share2, Layers,
  Wand2, Mic, Sparkles, Image, Upload, Search, MessageSquare, Rocket,
  ChevronRight, Command, CornerDownLeft
} from 'lucide-react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type HelpSection = 'overview' | 'views' | 'shortcuts' | 'features' | 'tips';

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<HelpSection>('overview');

  if (!isOpen) return null;

  const sections: { id: HelpSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'views', label: 'View Modes', icon: <Eye className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'features', label: 'Features', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tips', label: 'Tips', icon: <Wand2 className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Help & Guide</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Learn how to use Prism</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(85vh-80px)]">
          {/* Sidebar */}
          <div className="w-48 border-r border-zinc-200 dark:border-zinc-800 p-3 space-y-1 bg-zinc-50 dark:bg-zinc-900/50">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Welcome to Prism</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Prism is an AI-powered code generator that transforms your ideas into working code instantly.
                    Powered by Google's Gemini 3, it can create React components, 3D visualizations, Python scripts,
                    and HTML/CSS layouts from simple text prompts.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Code2 className="w-6 h-6 text-blue-500 mb-2" />
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-1">React & 3D</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Generate React components with Three.js, R3F, physics, and effects.</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <Terminal className="w-6 h-6 text-green-500 mb-2" />
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-1">Python</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Run Python scripts with matplotlib, numpy, and data visualization.</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Image className="w-6 h-6 text-purple-500 mb-2" />
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-1">Vision</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Upload images or wireframes to generate matching UIs.</p>
                  </div>
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                    <Mic className="w-6 h-6 text-pink-500 mb-2" />
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-1">Voice</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Speak your ideas and let AI transcribe and generate code.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'views' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">View Modes</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-white">Preview</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Live preview of generated HTML/React code in an isolated iframe. Supports responsive viewport switching.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Code2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-white">Code</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        View the generated source code with syntax highlighting. Copy or download the code.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Edit3 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-white">Editor</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Edit the code in a Monaco editor with live preview. Changes update in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Terminal className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-white">Python</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Run Python code in-browser using Pyodide. Supports matplotlib plots and interactive output.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <GitCompare className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-white">Diff</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Compare two versions of code side-by-side with highlighted changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-zinc-900 dark:text-white mb-3">Viewport Sizes</h4>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                      <Smartphone className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Mobile (375px)</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                      <Tablet className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Tablet (768px)</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                      <Monitor className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Desktop (1024px)</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                      <Maximize2 className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Full</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'shortcuts' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Keyboard Shortcuts</h3>

                <div className="space-y-3">
                  {[
                    { keys: ['⌘/Ctrl', 'Enter'], action: 'Generate code from prompt' },
                    { keys: ['⌘/Ctrl', 'K'], action: 'Clear prompt' },
                    { keys: ['⌘/Ctrl', 'B'], action: 'Toggle sidebar' },
                    { keys: ['⌘/Ctrl', '1'], action: 'Switch to Preview' },
                    { keys: ['⌘/Ctrl', '2'], action: 'Switch to Code view' },
                    { keys: ['⌘/Ctrl', '3'], action: 'Switch to Editor' },
                    { keys: ['⌘/Ctrl', 'E'], action: 'Open Export dialog' },
                    { keys: ['⌘/Ctrl', 'S'], action: 'Save to templates' },
                    { keys: ['Esc'], action: 'Close dialogs' },
                  ].map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <span className="text-zinc-600 dark:text-zinc-400">{shortcut.action}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <React.Fragment key={i}>
                            <kbd className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs font-mono">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && <span className="text-zinc-400">+</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'features' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Features</h3>

                <div className="space-y-4">
                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Wand2 className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium text-zinc-900 dark:text-white">Autofix with AI</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      When runtime errors occur, click "Autofix with AI" to automatically fix the error using Gemini.
                    </p>
                  </div>

                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium text-zinc-900 dark:text-white">Explain Code</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Click the "Explain" button to get an AI-powered breakdown of the generated code.
                    </p>
                  </div>

                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium text-zinc-900 dark:text-white">Export</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Download as HTML file, extract as React component, or open in CodeSandbox.
                    </p>
                  </div>

                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-5 h-5 text-pink-500" />
                      <h4 className="font-medium text-zinc-900 dark:text-white">Share</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Generate a shareable URL that contains your code. Anyone can open and view it.
                    </p>
                  </div>

                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-orange-500" />
                      <h4 className="font-medium text-zinc-900 dark:text-white">Templates</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Save generated code as templates for later use. Browse and reuse your saved templates.
                    </p>
                  </div>

                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="w-5 h-5 text-indigo-500" />
                      <h4 className="font-medium text-zinc-900 dark:text-white">Asset Upload</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Upload images or files to include in your prompts. Great for recreating designs.
                    </p>
                  </div>

                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="w-5 h-5 text-red-500" />
                      <h4 className="font-medium text-zinc-900 dark:text-white">Voice Mode</h4>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Click the Voice Mode button in the sidebar to speak your prompt instead of typing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'tips' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Pro Tips</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">Be Specific</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      The more details you provide, the better the result. Instead of "make a dashboard", try
                      "create a dark-themed analytics dashboard with 4 stat cards showing Revenue, Users, Bounce Rate, and Sessions".
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">Iterate</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      After generating, you can refine by adding follow-up prompts like "add a dark mode toggle" or
                      "make the buttons larger". Each generation builds on the previous code.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">Use Keywords</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Include keywords for specific tech: "React Three Fiber" for 3D, "Python" for scripts,
                      "physics" for simulations, "bloom effects" for glow effects.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">Upload References</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Upload a screenshot or wireframe of what you want to build. Gemini's vision capabilities
                      will analyze it and generate matching code.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">Save Templates</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Save frequently used components as templates. Use them as starting points for similar projects.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
