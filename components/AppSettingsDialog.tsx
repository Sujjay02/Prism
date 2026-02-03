import React, { useState, useEffect, useRef } from 'react';
import {
  X, Save, Smile, Tag, FolderOpen, Smartphone, AlertTriangle,
  LayoutDashboard, Globe, FileText, Gamepad2, BarChart3, ShoppingCart,
  Users, Wrench, MoreHorizontal, Check
} from 'lucide-react';
import { HistoryItem, AppCategory, AppSettings } from '../types';

interface AppSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: HistoryItem;
  onSave: (id: string, settings: AppSettings) => void;
}

const EMOJI_OPTIONS = [
  '🚀', '💡', '🎨', '🔥', '⚡', '🌟', '💎', '🎯',
  '🎮', '📊', '🛒', '📝', '🔧', '🌈', '🎪', '🎭',
  '🏠', '📱', '💻', '🖥️', '🎬', '🎵', '📸', '🗺️'
];

const CATEGORY_OPTIONS: { id: AppCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'landing', label: 'Landing Page', icon: <Globe className="w-4 h-4" /> },
  { id: 'form', label: 'Form', icon: <FileText className="w-4 h-4" /> },
  { id: 'game', label: 'Game', icon: <Gamepad2 className="w-4 h-4" /> },
  { id: 'visualization', label: 'Visualization', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
  { id: 'utility', label: 'Utility', icon: <Wrench className="w-4 h-4" /> },
  { id: 'other', label: 'Other', icon: <MoreHorizontal className="w-4 h-4" /> },
];

export const AppSettingsDialog: React.FC<AppSettingsDialogProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [name, setName] = useState(item.appSettings?.name || item.result.explanation);
  const [description, setDescription] = useState(item.appSettings?.description || '');
  const [icon, setIcon] = useState(item.appSettings?.icon || '🚀');
  const [category, setCategory] = useState<AppCategory>(item.appSettings?.category || 'other');
  const [tags, setTags] = useState<string[]>(item.appSettings?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isMobileFriendly, setIsMobileFriendly] = useState(item.appSettings?.isMobileFriendly ?? true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(item.appSettings?.name || item.result.explanation);
      setDescription(item.appSettings?.description || '');
      setIcon(item.appSettings?.icon || '🚀');
      setCategory(item.appSettings?.category || 'other');
      setTags(item.appSettings?.tags || []);
      setIsMobileFriendly(item.appSettings?.isMobileFriendly ?? true);
    }
  }, [isOpen, item]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    onSave(item.id, {
      name: name.trim() || item.result.explanation,
      description: description.trim(),
      icon,
      category,
      tags,
      isMobileFriendly,
      isPinned: item.appSettings?.isPinned,
      hasErrors: item.appSettings?.hasErrors,
      lastModified: Date.now(),
      versionCount: (item.appSettings?.versionCount || 0) + 1,
      thumbnail: item.appSettings?.thumbnail,
      folderId: item.appSettings?.folderId,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={dialogRef}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">App Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Icon & Name */}
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl hover:scale-105 transition-transform shadow-lg"
              >
                {icon}
              </button>
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 grid grid-cols-8 gap-1 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setIcon(emoji); setShowEmojiPicker(false); }}
                      className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">App Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome App"
                className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your app..."
              rows={2}
              className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    category === cat.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat.icon}
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Tags <span className="text-zinc-400">({tags.length}/5)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                disabled={tags.length >= 5}
                className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={handleAddTag}
                disabled={tags.length >= 5 || !tagInput.trim()}
                className="px-3 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Mobile Friendly</span>
            </div>
            <button
              onClick={() => setIsMobileFriendly(!isMobileFriendly)}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                isMobileFriendly ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isMobileFriendly ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Created</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Versions</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {item.appSettings?.versionCount || 1}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
