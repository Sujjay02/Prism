import React, { useState } from 'react';
import {
  X, Palette, Settings, Sparkles, Zap, Moon, Sun, Monitor,
  Check, ChevronRight, Paintbrush, Layout, Type, Sliders
} from 'lucide-react';

interface ToolsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const accentColors = [
  { name: 'Blue', value: 'blue', primary: '#3B82F6', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Purple', value: 'purple', primary: '#8B5CF6', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Pink', value: 'pink', primary: '#EC4899', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Green', value: 'green', primary: '#10B981', gradient: 'from-green-500 to-green-600' },
  { name: 'Orange', value: 'orange', primary: '#F97316', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Red', value: 'red', primary: '#EF4444', gradient: 'from-red-500 to-red-600' },
  { name: 'Cyan', value: 'cyan', primary: '#06B6D4', gradient: 'from-cyan-500 to-cyan-600' },
  { name: 'Indigo', value: 'indigo', primary: '#6366F1', gradient: 'from-indigo-500 to-indigo-600' },
];

const presetThemes = [
  { name: 'Default', accent: 'blue', dark: true, description: 'Classic dark theme with blue accents' },
  { name: 'Light Mode', accent: 'blue', dark: false, description: 'Clean light theme' },
  { name: 'Midnight Purple', accent: 'purple', dark: true, description: 'Deep purple vibes' },
  { name: 'Sunset', accent: 'orange', dark: true, description: 'Warm orange tones' },
  { name: 'Forest', accent: 'green', dark: true, description: 'Natural green theme' },
  { name: 'Rose', accent: 'pink', dark: false, description: 'Soft pink light theme' },
];

type ToolSection = 'appearance' | 'presets' | 'shortcuts';

export const ToolsSidebar: React.FC<ToolsSidebarProps> = ({
  isOpen,
  onClose,
  isDark,
  toggleTheme,
  accentColor,
  setAccentColor,
}) => {
  const [activeSection, setActiveSection] = useState<ToolSection>('appearance');

  if (!isOpen) return null;

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setAccentColor(preset.accent);
    if (preset.dark !== isDark) {
      toggleTheme();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentColors.find(c => c.value === accentColor)?.gradient || 'from-blue-500 to-blue-600'} flex items-center justify-center`}>
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-white">Tools & Themes</h2>
              <p className="text-xs text-zinc-500">Customize your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-2 pt-2">
          {[
            { id: 'appearance' as ToolSection, label: 'Appearance', icon: Paintbrush },
            { id: 'presets' as ToolSection, label: 'Presets', icon: Layout },
            { id: 'shortcuts' as ToolSection, label: 'Quick Actions', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg transition-colors ${
                activeSection === tab.id
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Mode */}
              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Theme Mode
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => isDark && toggleTheme()}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      !isDark
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Sun className={`w-5 h-5 mx-auto mb-1 ${!isDark ? 'text-blue-500' : 'text-zinc-400'}`} />
                    <span className={`text-xs ${!isDark ? 'text-blue-600 font-medium' : 'text-zinc-500'}`}>Light</span>
                  </button>
                  <button
                    onClick={() => !isDark && toggleTheme()}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isDark
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Moon className={`w-5 h-5 mx-auto mb-1 ${isDark ? 'text-blue-500' : 'text-zinc-400'}`} />
                    <span className={`text-xs ${isDark ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>Dark</span>
                  </button>
                  <button
                    className="p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 opacity-50 cursor-not-allowed"
                    disabled
                    title="Coming soon"
                  >
                    <Monitor className="w-5 h-5 mx-auto mb-1 text-zinc-400" />
                    <span className="text-xs text-zinc-500">Auto</span>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Accent Color
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={`relative p-3 rounded-xl border-2 transition-all ${
                        accentColor === color.value
                          ? 'border-zinc-900 dark:border-white'
                          : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                      title={color.name}
                    >
                      <div
                        className={`w-8 h-8 rounded-full mx-auto bg-gradient-to-br ${color.gradient} shadow-lg`}
                      />
                      {accentColor === color.value && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white dark:text-zinc-900" />
                        </div>
                      )}
                      <span className="text-[10px] text-zinc-500 mt-1 block">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Preview</h3>
                <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accentColors.find(c => c.value === accentColor)?.gradient} flex items-center justify-center`}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">Sample Button</div>
                      <div className="text-xs text-zinc-500">With accent color</div>
                    </div>
                  </div>
                  <button className={`w-full py-2 px-4 rounded-lg text-white text-sm font-medium bg-gradient-to-r ${accentColors.find(c => c.value === accentColor)?.gradient}`}>
                    Generate Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 mb-4">Quick theme presets to get started</p>
              {presetThemes.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className={`w-full p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                    accentColor === preset.accent && isDark === preset.dark
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex -space-x-1">
                    <div
                      className={`w-6 h-6 rounded-full ${preset.dark ? 'bg-zinc-900' : 'bg-white'} border-2 border-white dark:border-zinc-800`}
                    />
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${accentColors.find(c => c.value === preset.accent)?.gradient} border-2 border-white dark:border-zinc-800`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">{preset.name}</div>
                    <div className="text-xs text-zinc-500">{preset.description}</div>
                  </div>
                  {accentColor === preset.accent && isDark === preset.dark && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          {activeSection === 'shortcuts' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 mb-4">Quick actions and utilities</p>

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">Clear All Data</div>
                  <div className="text-xs text-zinc-500">Reset history, templates, and settings</div>
                </div>
              </button>

              <button
                onClick={() => {
                  const data = {
                    history: localStorage.getItem('prism-history'),
                    templates: localStorage.getItem('prism-templates'),
                    theme: localStorage.getItem('prism-theme'),
                    accent: localStorage.getItem('prism-accent'),
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'prism-backup.json';
                  a.click();
                }}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">Export Settings</div>
                  <div className="text-xs text-zinc-500">Download your preferences as JSON</div>
                </div>
              </button>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 mt-4">
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  {[
                    { keys: '⌘ + Enter', action: 'Generate' },
                    { keys: '⌘ + B', action: 'Toggle Sidebar' },
                    { keys: '⌘ + K', action: 'Clear Prompt' },
                    { keys: '⌘ + 1/2/3', action: 'Switch View' },
                  ].map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1">
                      <span className="text-zinc-600 dark:text-zinc-400">{shortcut.action}</span>
                      <kbd className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-xs font-mono text-zinc-600 dark:text-zinc-300">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 text-center">
            Prism v1.0.0 • Powered by Gemini 3
          </p>
        </div>
      </div>
    </>
  );
};
