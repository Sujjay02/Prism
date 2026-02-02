import React, { useState } from 'react';
import {
  History, ChevronLeft, ChevronRight, MessageSquare, Clock, Paperclip,
  Trash2, X, Check, Plus, Search, FileText, Image as ImageIcon, Rocket,
  Smartphone, Mic, Download, Share2, QrCode, FileCode, ExternalLink, Copy
} from 'lucide-react';
import { HistorySidebarProps, HistoryItem } from '../types';

interface ExtendedHistorySidebarProps extends HistorySidebarProps {
  onExport?: (item: HistoryItem) => void;
  onShare?: (item: HistoryItem) => void;
  onQRCode?: (item: HistoryItem) => void;
  onExportFormat?: (item: HistoryItem) => void;
}

export const HistorySidebar: React.FC<ExtendedHistorySidebarProps> = ({
  history,
  onSelect,
  onDelete,
  onNewChat,
  onVoiceMode,
  onExport,
  onShare,
  onQRCode,
  onExportFormat,
  currentId,
  isOpen,
  setIsOpen
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'history' | 'apps'>('history');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.result.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = viewMode === 'history' ? true : item.isPublished;
    return matchesSearch && matchesMode;
  });

  if (!isOpen) {
    return (
      <div className="absolute left-0 top-20 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white dark:bg-zinc-900 border border-l-0 border-zinc-200 dark:border-zinc-800 p-2 rounded-r-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-lg transition-colors"
          title="Show Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-background border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full absolute md:relative z-20 shadow-2xl md:shadow-none transition-all duration-300">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-200 font-medium">
          {viewMode === 'apps' ? <Rocket className="w-4 h-4 text-blue-500" /> : <History className="w-4 h-4" />}
          <span>{viewMode === 'apps' ? 'My Apps' : 'History'}</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/50 space-y-3">
        {/* Toggle between Chats and Apps */}
        <div className="flex p-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
          <button
            onClick={() => setViewMode('history')}
            className={`flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'history' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chats</span>
          </button>
          <button
            onClick={() => setViewMode('apps')}
            className={`flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'apps' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Apps</span>
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        {/* Voice Mode Button */}
        {onVoiceMode && (
          <button
            onClick={onVoiceMode}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Mic className="w-4 h-4" />
            <span>Voice Mode</span>
          </button>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            placeholder={viewMode === 'apps' ? "Search apps..." : "Search history..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800/50 border border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-zinc-200 dark:focus:border-zinc-700 rounded-md outline-none text-zinc-900 dark:text-zinc-200 placeholder-zinc-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            {viewMode === 'apps' ? (
                <>
                  <Rocket className="w-8 h-8 text-zinc-300 dark:text-zinc-800 mb-2" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-600">
                    {searchTerm ? "No apps found." : "No apps published yet."}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Publish results to see them here.</p>
                </>
            ) : (
                <>
                  <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-800 mb-2" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-600">
                    {searchTerm ? "No results found." : "No history yet."}
                  </p>
                </>
            )}
          </div>
        ) : (
          filteredHistory.slice().reverse().map((item) => (
            <div key={item.id} className="group">
              {/* Delete Confirmation */}
              {deleteConfirmId === item.id ? (
                <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-200">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Delete this item?</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                      className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); setDeleteConfirmId(null); }}
                      className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                      title="Confirm Delete"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : viewMode === 'apps' && item.isPublished ? (
                /* Apps View - Card with Export Actions */
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <button
                    onClick={() => onSelect(item)}
                    className={`w-full text-left p-3 transition-all ${
                      currentId === item.id
                        ? 'bg-purple-50 dark:bg-purple-900/20'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Rocket className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                          {item.result.explanation}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Export Actions for Apps */}
                  <div className="flex items-center gap-1 px-2 py-2 border-t border-zinc-100 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-900/30">
                    {onExport && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onExport(item); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Download HTML"
                      >
                        <Download className="w-3 h-3" />
                        <span>HTML</span>
                      </button>
                    )}
                    {onExportFormat && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onExportFormat(item); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Export to React/Vue/Svelte"
                      >
                        <FileCode className="w-3 h-3" />
                        <span>React</span>
                      </button>
                    )}
                    {onShare && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onShare(item); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    )}
                    {onQRCode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onQRCode(item); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="QR Code"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>QR</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular History View */
                <div className="relative">
                  <button
                    onClick={() => onSelect(item)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                      currentId === item.id
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                        : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2 pr-6">
                      <div className="mt-1 flex-shrink-0">
                        {item.isPublished ? (
                          <Smartphone className={`w-3 h-3 ${
                            currentId === item.id ? 'text-blue-500' : 'text-purple-400 dark:text-purple-500'
                          }`} />
                        ) : item.files && item.files.length > 0 ? (
                          <div className="flex -space-x-1">
                            {item.files[0].mimeType.startsWith('image/') ? (
                              <ImageIcon className={`w-3 h-3 ${
                                currentId === item.id ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-600'
                              }`} />
                            ) : (
                              <FileText className={`w-3 h-3 ${
                                currentId === item.id ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-600'
                              }`} />
                            )}
                          </div>
                        ) : (
                          <MessageSquare className={`w-3 h-3 ${
                            currentId === item.id ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`truncate font-medium ${item.isPublished ? 'text-purple-600 dark:text-purple-400' : ''}`}>
                            {item.result.explanation}
                          </p>
                          {item.isPublished && (
                            <span className="shrink-0 text-[9px] uppercase tracking-wider font-bold text-purple-500 border border-purple-200 dark:border-purple-800 px-1 rounded">App</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-600 opacity-80 max-w-[80%]">
                            {item.prompt}
                          </p>
                          {item.files && item.files.length > 0 && (
                            <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500 px-1 rounded flex items-center gap-0.5">
                              <Paperclip className="w-2 h-2" />
                              {item.files.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};