import React from 'react';
import { Layers, Moon, Sun, HelpCircle, Palette } from 'lucide-react';
import { HeaderProps } from '../types';

interface ExtendedHeaderProps extends HeaderProps {
  onHelp?: () => void;
  onTools?: () => void;
  accentColor?: string;
}

const accentGradients: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  cyan: 'from-cyan-500 to-cyan-600',
  indigo: 'from-indigo-500 to-indigo-600',
};

export const Header: React.FC<ExtendedHeaderProps> = ({ isDark, toggleTheme, onReset, onHelp, onTools, accentColor = 'blue' }) => {
  const gradient = accentGradients[accentColor] || accentGradients.blue;
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-background/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
      <div 
        className="flex items-center space-x-3 cursor-pointer group" 
        onClick={onReset}
        title="Start Fresh"
      >
        <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
          <Layers className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">
          Pr<span className="text-blue-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">ism</span>
        </h1>
      </div>
      <div className="flex items-center space-x-1">
        {onHelp && (
          <button
            onClick={onHelp}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            title="Help & Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
        {onTools && (
          <button
            onClick={onTools}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            title="Themes & Tools"
          >
            <Palette className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-600 uppercase tracking-wider ml-2">
          v1.0.0
        </span>
      </div>
    </header>
  );
};