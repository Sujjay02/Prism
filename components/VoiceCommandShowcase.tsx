import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Wand2, Box, LayoutDashboard, LineChart, Gamepad2 } from 'lucide-react';

interface VoiceCommandShowcaseProps {
  onTryCommand: (command: string) => void;
}

const voiceCommands = [
  {
    icon: Box,
    category: '3D Visualization',
    command: 'Create a 3D solar system with orbiting planets',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: LayoutDashboard,
    category: 'Dashboard',
    command: 'Build an analytics dashboard with charts and KPIs',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: LineChart,
    category: 'Python',
    command: 'Generate a stock price Monte Carlo simulation',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Gamepad2,
    category: 'Game',
    command: 'Create a snake game with arrow key controls',
    color: 'from-orange-500 to-red-500',
  },
];

export const VoiceCommandShowcase: React.FC<VoiceCommandShowcaseProps> = ({ onTryCommand }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % voiceCommands.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTry = (command: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      onTryCommand(command);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse" />
          <div className="relative p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <Mic className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Voice Commands</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Speak your ideas, get code instantly</p>
        </div>
      </div>

      {/* Voice Wave Animation */}
      <div className="flex justify-center items-center space-x-1 mb-6 h-8">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-soundwave"
            style={{
              height: `${12 + Math.sin(i * 0.8) * 8}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Command Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {voiceCommands.map((cmd, idx) => {
          const Icon = cmd.icon;
          const isActive = idx === activeIndex;

          return (
            <button
              key={idx}
              onClick={() => handleTry(cmd.command)}
              className={`group relative p-4 rounded-xl border transition-all duration-300 text-left ${
                isActive
                  ? 'border-purple-500/50 bg-purple-500/5 dark:bg-purple-500/10 scale-[1.02]'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-purple-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
              )}

              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${cmd.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{cmd.category}</span>
                    {isActive && (
                      <Volume2 className="w-3 h-3 text-purple-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 line-clamp-2">
                    "{cmd.command}"
                  </p>
                </div>
              </div>

              {/* Try button on hover */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="flex items-center space-x-1 px-2 py-1 bg-purple-500 text-white text-xs rounded-lg">
                  <Wand2 className="w-3 h-3" />
                  <span>Try</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tip */}
      <div className="mt-4 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Click the <Mic className="w-3 h-3 inline mx-1" /> button in the input area or press <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px]">Space</kbd> to start speaking
        </p>
      </div>

      <style>{`
        @keyframes soundwave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }
        .animate-soundwave {
          animation: soundwave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
