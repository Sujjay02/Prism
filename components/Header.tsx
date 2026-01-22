import React from 'react';
import { Layers, Moon, Sun } from 'lucide-react';
import { HeaderProps } from '../types';

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme, onReset }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-background/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
      <div 
        className="flex items-center space-x-3 cursor-pointer group" 
        onClick={onReset}
        title="Start Fresh"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
          <Layers className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">
          Neo<span className="text-blue-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Forge</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <a 
          href="#" 
          className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors uppercase tracking-wider"
        >
          v1.0.0
        </a>
      </div>
    </header>
  );
};