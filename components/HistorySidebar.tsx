import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  History, ChevronLeft, ChevronRight, MessageSquare, Clock, Paperclip,
  Trash2, X, Check, Plus, Search, FileText, Image as ImageIcon, Rocket,
  Smartphone, Mic, Download, Share2, QrCode, FileCode, ExternalLink, Copy,
  Settings, Pin, PinOff, Grid3X3, List, SortAsc, ChevronDown, Code,
  LayoutDashboard, Globe, Gamepad2, BarChart3, ShoppingCart, Users, Wrench,
  MoreHorizontal, AlertTriangle
} from 'lucide-react';
import { HistorySidebarProps, HistoryItem, AppCategory } from '../types';

interface ExtendedHistorySidebarProps extends HistorySidebarProps {
  onExport?: (item: HistoryItem) => void;
  onShare?: (item: HistoryItem) => void;
  onQRCode?: (item: HistoryItem) => void;
  onExportFormat?: (item: HistoryItem) => void;
  onDuplicate?: (item: HistoryItem) => void;
  onTogglePin?: (item: HistoryItem) => void;
  onOpenSettings?: (item: HistoryItem) => void;
  onOpenEmbed?: (item: HistoryItem) => void;
  onLaunch?: (item: HistoryItem) => void;
}

type SortOption = 'newest' | 'oldest' | 'name' | 'category';
type ViewStyle = 'grid' | 'list';

const CATEGORY_ICONS: Record<AppCategory, React.ReactNode> = {
  dashboard: <LayoutDashboard className="w-3 h-3" />,
  landing: <Globe className="w-3 h-3" />,
  form: <FileText className="w-3 h-3" />,
  game: <Gamepad2 className="w-3 h-3" />,
  visualization: <BarChart3 className="w-3 h-3" />,
  ecommerce: <ShoppingCart className="w-3 h-3" />,
  social: <Users className="w-3 h-3" />,
  utility: <Wrench className="w-3 h-3" />,
  other: <MoreHorizontal className="w-3 h-3" />,
};

const CATEGORY_COLORS: Record<AppCategory, string> = {
  dashboard: 'from-blue-500 to-cyan-500',
  landing: 'from-purple-500 to-pink-500',
  form: 'from-green-500 to-emerald-500',
  game: 'from-red-500 to-orange-500',
  visualization: 'from-indigo-500 to-purple-500',
  ecommerce: 'from-yellow-500 to-orange-500',
  social: 'from-pink-500 to-rose-500',
  utility: 'from-gray-500 to-zinc-500',
  other: 'from-violet-500 to-purple-500',
};

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
  onDuplicate,
  onTogglePin,
  onOpenSettings,
  onOpenEmbed,
  onLaunch,
  currentId,
  isOpen,
  setIsOpen
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'history' | 'apps'>('history');
  const [viewStyle, setViewStyle] = useState<ViewStyle>(() => {
    return (localStorage.getItem('prism-apps-view') as ViewStyle) || 'list';
  });
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    return (localStorage.getItem('prism-apps-sort') as SortOption) || 'newest';
  });
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Save view preferences
  useEffect(() => {
    localStorage.setItem('prism-apps-view', viewStyle);
  }, [viewStyle]);

  useEffect(() => {
    localStorage.setItem('prism-apps-sort', sortBy);
  }, [sortBy]);

  // Close sort menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let items = history.filter(item => {
      const matchesSearch =
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.result.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.appSettings?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.appSettings?.tags?.some(tag => tag.includes(searchTerm.toLowerCase()));

      const matchesMode = viewMode === 'history' ? true : item.isPublished;

      const matchesCategory = viewMode === 'apps' && selectedCategory !== 'all'
        ? item.appSettings?.category === selectedCategory
        : true;

      return matchesSearch && matchesMode && matchesCategory;
    });

    // Sort apps
    if (viewMode === 'apps') {
      items = [...items].sort((a, b) => {
        // Pinned items first
        if (a.appSettings?.isPinned && !b.appSettings?.isPinned) return -1;
        if (!a.appSettings?.isPinned && b.appSettings?.isPinned) return 1;

        switch (sortBy) {
          case 'oldest':
            return a.timestamp - b.timestamp;
          case 'name':
            const nameA = a.appSettings?.name || a.result.explanation;
            const nameB = b.appSettings?.name || b.result.explanation;
            return nameA.localeCompare(nameB);
          case 'category':
            const catA = a.appSettings?.category || 'other';
            const catB = b.appSettings?.category || 'other';
            return catA.localeCompare(catB);
          case 'newest':
          default:
            return b.timestamp - a.timestamp;
        }
      });
    } else {
      items = [...items].reverse();
    }

    return items;
  }, [history, searchTerm, viewMode, sortBy, selectedCategory]);

  const publishedCount = history.filter(h => h.isPublished).length;

  const handleLaunch = (item: HistoryItem) => {
    if (onLaunch) {
      onLaunch(item);
    } else {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(item.result.code);
        newWindow.document.close();
      }
    }
  };

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
    <div className="w-72 bg-background border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full absolute md:relative z-20 shadow-2xl md:shadow-none transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-200 font-medium">
          {viewMode === 'apps' ? <Rocket className="w-4 h-4 text-purple-500" /> : <History className="w-4 h-4" />}
          <span>{viewMode === 'apps' ? 'My Apps' : 'History'}</span>
          {viewMode === 'apps' && (
            <span className="px-1.5 py-0.5 text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
              {publishedCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Controls */}
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

        {/* New Chat / Voice Mode */}
        <div className="flex gap-2">
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-2 px-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
          {onVoiceMode && (
            <button
              onClick={onVoiceMode}
              className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-2 rounded-lg transition-all shadow-sm"
              title="Voice Mode"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>

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

        {/* Apps Controls */}
        {viewMode === 'apps' && (
          <>
            {/* View Style & Sort */}
            <div className="flex items-center gap-2">
              <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                <button
                  onClick={() => setViewStyle('list')}
                  className={`p-1.5 rounded ${viewStyle === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewStyle('grid')}
                  className={`p-1.5 rounded ${viewStyle === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative flex-1" ref={sortMenuRef}>
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="w-full flex items-center justify-between px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <SortAsc className="w-3 h-3" />
                    {sortBy === 'newest' && 'Newest'}
                    {sortBy === 'oldest' && 'Oldest'}
                    {sortBy === 'name' && 'Name'}
                    {sortBy === 'category' && 'Category'}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showSortMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-10">
                    {(['newest', 'oldest', 'name', 'category'] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => { setSortBy(option); setShowSortMenu(false); }}
                        className={`w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                          sortBy === option ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-1 text-[10px] rounded-full transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                All
              </button>
              {(Object.keys(CATEGORY_ICONS) as AppCategory[]).slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-full transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {CATEGORY_ICONS[cat]}
                  <span className="capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            {viewMode === 'apps' ? (
              <>
                <Rocket className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-xs text-zinc-500 dark:text-zinc-600">
                  {searchTerm ? "No apps found." : "No apps published yet."}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">Publish results to see them here.</p>
              </>
            ) : (
              <>
                <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-xs text-zinc-500 dark:text-zinc-600">
                  {searchTerm ? "No results found." : "No history yet."}
                </p>
              </>
            )}
          </div>
        ) : viewMode === 'apps' && viewStyle === 'grid' ? (
          /* Grid View for Apps */
          <div className="grid grid-cols-2 gap-2">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                  currentId === item.id
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
                onClick={() => onSelect(item)}
              >
                {/* Thumbnail */}
                <div className={`aspect-[4/3] bg-gradient-to-br ${CATEGORY_COLORS[item.appSettings?.category || 'other']} relative`}>
                  {item.appSettings?.thumbnail ? (
                    <img src={item.appSettings.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-4xl">
                      {item.appSettings?.icon || '🚀'}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-1 right-1 flex gap-1">
                    {item.appSettings?.isPinned && (
                      <span className="p-1 bg-yellow-500 rounded-full">
                        <Pin className="w-2 h-2 text-white" />
                      </span>
                    )}
                    {item.appSettings?.isMobileFriendly && (
                      <span className="p-1 bg-green-500 rounded-full">
                        <Smartphone className="w-2 h-2 text-white" />
                      </span>
                    )}
                    {item.appSettings?.hasErrors && (
                      <span className="p-1 bg-red-500 rounded-full">
                        <AlertTriangle className="w-2 h-2 text-white" />
                      </span>
                    )}
                  </div>

                  {/* Quick Actions on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLaunch(item); }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Launch"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </button>
                    {onOpenSettings && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenSettings(item); }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-2 bg-white dark:bg-zinc-800">
                  <div className="flex items-start gap-1">
                    <span className="text-sm">{item.appSettings?.icon || '🚀'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                        {item.appSettings?.name || item.result.explanation}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        {CATEGORY_ICONS[item.appSettings?.category || 'other']}
                        <span className="capitalize">{item.appSettings?.category || 'other'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          filteredHistory.map((item) => (
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
                /* Apps View - Enhanced Card */
                <div className={`rounded-xl border overflow-hidden transition-all ${
                  currentId === item.id
                    ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50 dark:bg-purple-900/10'
                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-purple-300 dark:hover:border-purple-700'
                }`}>
                  <button
                    onClick={() => onSelect(item)}
                    className="w-full text-left p-3 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[item.appSettings?.category || 'other']} flex items-center justify-center flex-shrink-0 text-lg shadow-lg`}>
                        {item.appSettings?.icon || '🚀'}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name & Badges */}
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                            {item.appSettings?.name || item.result.explanation}
                          </p>
                          {item.appSettings?.isPinned && (
                            <Pin className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          )}
                        </div>

                        {/* Description */}
                        {item.appSettings?.description && (
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {item.appSettings.description}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-400">
                          <span className="flex items-center gap-0.5">
                            {CATEGORY_ICONS[item.appSettings?.category || 'other']}
                            <span className="capitalize">{item.appSettings?.category || 'other'}</span>
                          </span>
                          {item.appSettings?.isMobileFriendly && (
                            <span className="flex items-center gap-0.5 text-green-500">
                              <Smartphone className="w-3 h-3" />
                            </span>
                          )}
                          {item.appSettings?.hasErrors && (
                            <span className="flex items-center gap-0.5 text-red-500">
                              <AlertTriangle className="w-3 h-3" />
                            </span>
                          )}
                          <span>v{item.appSettings?.versionCount || 1}</span>
                        </div>

                        {/* Tags */}
                        {item.appSettings?.tags && item.appSettings.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.appSettings.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded text-[9px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 px-2 py-2 border-t border-zinc-100 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLaunch(item); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                      title="Launch in new tab"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Launch</span>
                    </button>
                    {onOpenSettings && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenSettings(item); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Settings"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                    )}
                    {onTogglePin && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onTogglePin(item); }}
                        className={`p-1.5 rounded transition-colors ${
                          item.appSettings?.isPinned
                            ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                        }`}
                        title={item.appSettings?.isPinned ? "Unpin" : "Pin"}
                      >
                        {item.appSettings?.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicate(item); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                    {onOpenEmbed && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenEmbed(item); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Embed Code"
                      >
                        <Code className="w-3 h-3" />
                      </button>
                    )}
                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700"></div>
                    {onExport && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onExport(item); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Download HTML"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    )}
                    {onExportFormat && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onExportFormat(item); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Export to React/Vue/Svelte"
                      >
                        <FileCode className="w-3 h-3" />
                      </button>
                    )}
                    {onShare && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onShare(item); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    )}
                    {onQRCode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onQRCode(item); }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                        title="QR Code"
                      >
                        <QrCode className="w-3 h-3" />
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
