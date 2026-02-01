import React, { useState, useEffect } from 'react';
import { Sparkles, Code2, Box, Palette, Zap, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';

interface GeneratingAnimationProps {
  prompt?: string;
  defaultExpanded?: boolean;
}

const codeSnippets = [
  'import React from "react";',
  'const App = () => {',
  '  return <div>',
  '    <Canvas camera={...}>',
  '  <mesh ref={meshRef}>',
  '    <boxGeometry />',
  '  className="flex"',
  '  useState(false);',
  'useFrame((state) => {',
  '  meshRef.current.rotation',
  '<OrbitControls />',
  'tailwind.config.js',
  'export default App;',
];

const steps = [
  { icon: Sparkles, text: 'Analyzing prompt...', color: 'text-purple-500' },
  { icon: Code2, text: 'Generating structure...', color: 'text-blue-500' },
  { icon: Palette, text: 'Applying styles...', color: 'text-pink-500' },
  { icon: Box, text: 'Building components...', color: 'text-green-500' },
  { icon: Zap, text: 'Optimizing output...', color: 'text-yellow-500' },
];

export const GeneratingAnimation: React.FC<GeneratingAnimationProps> = ({ prompt, defaultExpanded = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedCode, setDisplayedCode] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Cycle through steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(stepInterval);
  }, []);

  // Add code snippets progressively
  useEffect(() => {
    const codeInterval = setInterval(() => {
      setDisplayedCode((prev) => {
        if (prev.length >= 8) {
          return [codeSnippets[Math.floor(Math.random() * codeSnippets.length)]];
        }
        const nextSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        return [...prev, nextSnippet];
      });
    }, 300);
    return () => clearInterval(codeInterval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  // Collapsed/minimized view
  if (!isExpanded) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
        {/* Minimized Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Small spinning indicator */}
            <div className="relative w-8 h-8">
              <svg className="w-full h-full animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradient-mini" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient-mini)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="60 180"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Generating with Gemini 3</p>
              <p className={`text-xs ${steps[currentStep].color}`}>{steps[currentStep].text}</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            title="Expand"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Minimized code preview */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-700 h-full">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-zinc-500 font-mono">generated-code.tsx</span>
              </div>
            </div>
            <div className="p-4 font-mono text-sm overflow-hidden h-full">
              {displayedCode.slice(-12).map((line, idx) => (
                <div key={idx} className="text-zinc-300 text-xs animate-fadeIn">
                  <span className="text-zinc-600 mr-3">{idx + 1}</span>
                  <span className="text-purple-400">{line.includes('import') ? 'import' : ''}</span>
                  <span className="text-blue-400">{line.includes('const') ? 'const ' : ''}</span>
                  <span>{line.replace(/import|const|function/g, '')}</span>
                </div>
              ))}
              <div className="flex items-center text-zinc-300 mt-1">
                <span className="text-zinc-600 mr-3">{displayedCode.length + 1}</span>
                <span className={`w-1.5 h-4 bg-purple-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
              </div>
            </div>
          </div>
        </div>

        {/* Prompt at bottom */}
        {prompt && (
          <div className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              <span className="font-medium">Prompt:</span> {prompt}
            </p>
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Expanded view (original)
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-8 relative">
      {/* Minimize button */}
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors z-10"
        title="Minimize"
      >
        <Minimize2 className="w-5 h-5" />
      </button>

      {/* Main Animation Container */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-20 blur-xl animate-pulse" />

        {/* Spinning ring */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="70 200"
            />
          </svg>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg ${steps[currentStep].color}`}>
              <CurrentIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          Generating with Gemini 3
        </h3>
        <p className={`text-sm font-medium ${steps[currentStep].color} transition-all duration-300`}>
          {steps[currentStep].text}
        </p>
      </div>

      {/* Code Preview Window */}
      <div className="w-full max-w-md bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-700">
        {/* Window Header */}
        <div className="flex items-center space-x-2 px-4 py-3 bg-zinc-800 border-b border-zinc-700">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-zinc-500 font-mono">generated-code.tsx</span>
        </div>

        {/* Code Content */}
        <div className="p-4 font-mono text-sm h-48 overflow-hidden">
          {displayedCode.map((line, idx) => (
            <div
              key={idx}
              className="text-zinc-300 animate-fadeIn"
              style={{
                opacity: 1 - (idx * 0.1),
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <span className="text-zinc-600 mr-4">{idx + 1}</span>
              <span className="text-purple-400">{line.includes('import') ? 'import' : ''}</span>
              <span className="text-blue-400">{line.includes('const') ? 'const ' : ''}</span>
              <span className="text-green-400">{line.includes('function') ? 'function ' : ''}</span>
              <span>{line.replace(/import|const|function/g, '')}</span>
            </div>
          ))}
          <div className="flex items-center text-zinc-300 mt-1">
            <span className="text-zinc-600 mr-4">{displayedCode.length + 1}</span>
            <span
              className={`w-2 h-5 bg-purple-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
            />
          </div>
        </div>
      </div>

      {/* Prompt Display */}
      {prompt && (
        <div className="mt-6 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg max-w-md">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            <span className="font-medium">Prompt:</span> {prompt}
          </p>
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
