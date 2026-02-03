import React from 'react';
import {
  Eye, Code2, Edit3, GitCompare, Terminal,
  Sparkles, MessageSquareCode, Shield,
  Download, FileCode, Share2, QrCode,
  Layers, Shuffle, Undo2, Redo2, Rocket,
  Smartphone, Tablet, Monitor, Maximize2
} from 'lucide-react';
import { Viewport, ViewMode } from '../types';

interface RibbonToolbarProps {
  // View state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  viewport: Viewport;
  setViewport: (vp: Viewport) => void;
  isCurrentResultPython: boolean;
  hasHistory: boolean;
  onOpenEditor: () => void;
  onOpenDiff: () => void;

  // Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  // Publish
  isPublished: boolean;
  onTogglePublish: () => void;

  // AI Actions
  onExplain: () => void;
  onCodeReview: () => void;
  onA11yAudit: () => void;

  // Export Actions
  onExport: () => void;
  onExportFormat: () => void;
  onShare: () => void;
  onQRCode: () => void;

  // Tools
  onTemplates: () => void;
  onRemix: () => void;
  onConsole: () => void;
  showConsole: boolean;
  hasConsoleErrors: boolean;

  // Result info
  explanation?: string;
  sources?: { title: string; uri: string }[];
}

// Ribbon group wrapper component
const RibbonGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-0.5 px-1 py-1 min-h-[36px]">
      {children}
    </div>
    <div className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider border-t border-zinc-200 dark:border-zinc-700 pt-0.5 mx-1">
      {label}
    </div>
  </div>
);

// Ribbon separator
const RibbonSeparator: React.FC = () => (
  <div className="w-px h-[48px] bg-zinc-200 dark:bg-zinc-700 mx-1 self-stretch" />
);

// Ribbon button styles
const ribbonButtonBase = "flex items-center justify-center p-1.5 rounded transition-all";
const ribbonButtonInactive = "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800";
const ribbonButtonActive = "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm";

export const RibbonToolbar: React.FC<RibbonToolbarProps> = ({
  viewMode,
  setViewMode,
  viewport,
  setViewport,
  isCurrentResultPython,
  hasHistory,
  onOpenEditor,
  onOpenDiff,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isPublished,
  onTogglePublish,
  onExplain,
  onCodeReview,
  onA11yAudit,
  onExport,
  onExportFormat,
  onShare,
  onQRCode,
  onTemplates,
  onRemix,
  onConsole,
  showConsole,
  hasConsoleErrors,
  explanation,
  sources,
}) => {
  return (
    <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400 min-w-0">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse"></span>
          <span className="font-medium truncate">{explanation || 'Generated UI'}</span>
          {sources && sources.length > 0 && (
            <div className="hidden lg:flex items-center space-x-1.5 text-xs ml-2">
              {sources.slice(0, 2).map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors"
                  title={source.title}
                >
                  <span className="max-w-[80px] truncate">{source.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions in Title Bar */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`${ribbonButtonBase} ${ribbonButtonInactive} disabled:opacity-30 disabled:cursor-not-allowed`}
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`${ribbonButtonBase} ${ribbonButtonInactive} disabled:opacity-30 disabled:cursor-not-allowed`}
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
          <button
            onClick={onTogglePublish}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium transition-all ${
              isPublished
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
            }`}
            title={isPublished ? "Unpublish App" : "Publish as App"}
          >
            <Rocket className={`w-3.5 h-3.5 ${isPublished ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline text-xs">{isPublished ? 'Published' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Ribbon Bar */}
      <div className="flex items-end gap-0.5 px-2 py-1 overflow-x-auto no-scrollbar">

        {/* VIEW Group */}
        <RibbonGroup label="View">
          <div className="flex items-center gap-0.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-md p-0.5">
            {!isCurrentResultPython && (
              <button
                onClick={() => setViewMode('preview')}
                className={`${ribbonButtonBase} ${viewMode === 'preview' ? ribbonButtonActive : ribbonButtonInactive}`}
                title="Preview (Cmd+1)"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            {isCurrentResultPython && (
              <button
                onClick={() => setViewMode('python')}
                className={`${ribbonButtonBase} ${viewMode === 'python' ? ribbonButtonActive : ribbonButtonInactive}`}
                title="Python Runner"
              >
                <Terminal className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setViewMode('code')}
              className={`${ribbonButtonBase} ${viewMode === 'code' ? ribbonButtonActive : ribbonButtonInactive}`}
              title="Source Code (Cmd+2)"
            >
              <Code2 className="w-4 h-4" />
            </button>

            {!isCurrentResultPython && (
              <button
                onClick={onOpenEditor}
                className={`${ribbonButtonBase} ${viewMode === 'editor' ? ribbonButtonActive : ribbonButtonInactive}`}
                title="Live Editor (Cmd+3)"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {hasHistory && (
              <button
                onClick={onOpenDiff}
                className={`${ribbonButtonBase} ${viewMode === 'diff' ? ribbonButtonActive : ribbonButtonInactive}`}
                title="Compare Versions"
              >
                <GitCompare className="w-4 h-4" />
              </button>
            )}
          </div>
        </RibbonGroup>

        <RibbonSeparator />

        {/* DEVICE Group - Only show in preview mode */}
        {viewMode === 'preview' && !isCurrentResultPython && (
          <>
            <RibbonGroup label="Device">
              <div className="flex items-center gap-0.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-md p-0.5">
                <button
                  onClick={() => setViewport('mobile')}
                  className={`${ribbonButtonBase} ${viewport === 'mobile' ? ribbonButtonActive : ribbonButtonInactive}`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`${ribbonButtonBase} ${viewport === 'tablet' ? ribbonButtonActive : ribbonButtonInactive}`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('desktop')}
                  className={`${ribbonButtonBase} ${viewport === 'desktop' ? ribbonButtonActive : ribbonButtonInactive}`}
                  title="Desktop (1024px)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('full')}
                  className={`${ribbonButtonBase} ${viewport === 'full' ? ribbonButtonActive : ribbonButtonInactive}`}
                  title="Full Width"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </RibbonGroup>

            <RibbonSeparator />
          </>
        )}

        {/* AI Group */}
        <RibbonGroup label="AI">
          <button
            onClick={onExplain}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all`}
            title="AI Explain"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium">Explain</span>
          </button>
          <button
            onClick={onCodeReview}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
            title="AI Code Review"
          >
            <MessageSquareCode className="w-5 h-5" />
            <span className="text-[10px] font-medium">Review</span>
          </button>
          <button
            onClick={onA11yAudit}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
            title="Accessibility Audit"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-medium">A11y</span>
          </button>
        </RibbonGroup>

        <RibbonSeparator />

        {/* EXPORT Group */}
        <RibbonGroup label="Export">
          <button
            onClick={onExport}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
            title="Download HTML"
          >
            <Download className="w-5 h-5" />
            <span className="text-[10px] font-medium">HTML</span>
          </button>
          <button
            onClick={onExportFormat}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
            title="Export to React/Vue/Svelte"
          >
            <FileCode className="w-5 h-5" />
            <span className="text-[10px] font-medium">React</span>
          </button>
          <button
            onClick={onShare}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
            title="Share"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Share</span>
          </button>
          <button
            onClick={onQRCode}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
            title="QR Code Preview"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[10px] font-medium">QR</span>
          </button>
        </RibbonGroup>

        <RibbonSeparator />

        {/* TOOLS Group */}
        <RibbonGroup label="Tools">
          <button
            onClick={onTemplates}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
            title="Templates"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-medium">Templates</span>
          </button>
          <button
            onClick={onRemix}
            disabled={!hasHistory}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Remix Designs"
          >
            <Shuffle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Remix</span>
          </button>
          <button
            onClick={onConsole}
            className={`relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-all ${
              showConsole
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            } ${hasConsoleErrors ? 'text-red-500' : ''}`}
            title="Console"
          >
            <Terminal className="w-5 h-5" />
            <span className="text-[10px] font-medium">Console</span>
            {hasConsoleErrors && (
              <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </RibbonGroup>
      </div>
    </div>
  );
};
