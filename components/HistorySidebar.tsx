import React, { useState } from 'react';
import { History, ChevronLeft, ChevronRight, MessageSquare, Clock, Paperclip, Trash2, X, Check, Plus, Search, FileText, Image as ImageIcon } from 'lucide-react';
import { HistorySidebarProps } from '../types';

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  onSelect, 
  onDelete,
  onNewChat,
  currentId, 
  isOpen, 
  setIsOpen 
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.result.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="absolute left-0 top-20 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white dark:bg-zinc-900 border border-l-0 border-zinc-200 dark:border-zinc-800 p-2 rounded-r-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-lg transition-colors"
          title="Show History"
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
          <History className="w-4 h-4" />
          <span>History</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/50 space-y-2">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800/50 border border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-zinc-200 dark:focus:border-zinc-700 rounded-md outline-none text-zinc-900 dark:text-zinc-200 placeholder-zinc-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            {searchTerm ? (
               <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-800 mb-2" />
            ) : (
               <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-800 mb-2" />
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-600">
              {searchTerm ? "No results found." : "No history yet."}
            </p>
          </div>
        ) : (
          filteredHistory.slice().reverse().map((item) => (
            <div key={item.id} className="relative group">
                {deleteConfirmId === item.id ? (
                     <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between px-3 rounded-lg z-10 animate-in fade-in duration-200 border border-zinc-200 dark:border-zinc-700">
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Delete?</span>
                        <div className="flex items-center space-x-1">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(item.id); setDeleteConfirmId(null); }}
                                className="p-1 text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 dark:bg-red-900/20 rounded transition-colors"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                    <button
                        onClick={() => onSelect(item)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-all border relative z-0 ${
                            currentId === item.id
                            ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                            : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                        >
                        <div className="flex items-start space-x-2 pr-6">
                            <div className="mt-1 flex-shrink-0">
                            {item.files && item.files.length > 0 ? (
                                <div className={`flex -space-x-1`}>
                                   {/* If mostly images, show image icon. If pdf/text, show file icon */}
                                   {item.files[0].mimeType.startsWith('image/') ? (
                                     <ImageIcon className={`w-3 h-3 ${
                                        currentId === item.id ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-500'
                                     }`} />
                                   ) : (
                                     <FileText className={`w-3 h-3 ${
                                        currentId === item.id ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-500'
                                     }`} />
                                   )}
                                </div>
                            ) : (
                                <MessageSquare className={`w-3 h-3 ${
                                currentId === item.id ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-500'
                                }`} />
                            )}
                            </div>
                            <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{item.explanation}</p>
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    </>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};