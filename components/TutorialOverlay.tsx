import React, { useState, useEffect } from 'react';
import {
  X, ChevronRight, ChevronLeft, Sparkles, MessageSquare,
  Code, Eye, History, Keyboard, Palette, Wand2
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Prism!',
    description: 'Let\'s take a quick tour of the AI-powered code generator. This will only take a minute.',
    icon: <Sparkles className="w-6 h-6" />,
    position: 'center',
  },
  {
    id: 'prompt',
    title: 'Enter Your Prompt',
    description: 'Describe what you want to create. Be specific - mention colors, layout, and functionality. Try "Create a dark-themed login form with email and password fields".',
    icon: <MessageSquare className="w-6 h-6" />,
    targetSelector: '[data-tutorial="prompt"]',
    position: 'top',
  },
  {
    id: 'generate',
    title: 'Generate Code',
    description: 'Click the Generate button or press Cmd/Ctrl + Enter to create your UI. The AI will generate HTML, CSS, and JavaScript.',
    icon: <Wand2 className="w-6 h-6" />,
    targetSelector: '[data-tutorial="generate"]',
    position: 'top',
  },
  {
    id: 'preview',
    title: 'Live Preview',
    description: 'See your generated UI in real-time. You can switch between Preview, Code, and Editor views.',
    icon: <Eye className="w-6 h-6" />,
    targetSelector: '[data-tutorial="preview"]',
    position: 'left',
  },
  {
    id: 'code',
    title: 'View & Edit Code',
    description: 'Switch to Code view to see the generated HTML/CSS. Use Editor view for live editing with instant preview updates.',
    icon: <Code className="w-6 h-6" />,
    targetSelector: '[data-tutorial="code-tabs"]',
    position: 'bottom',
  },
  {
    id: 'history',
    title: 'Generation History',
    description: 'All your generations are saved in the sidebar. Click any item to reload it. Use the search to find past creations.',
    icon: <History className="w-6 h-6" />,
    targetSelector: '[data-tutorial="history"]',
    position: 'right',
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Use Cmd/Ctrl + Enter to generate, Cmd/Ctrl + B to toggle sidebar, and Cmd/Ctrl + K to clear the prompt.',
    icon: <Keyboard className="w-6 h-6" />,
    position: 'center',
  },
  {
    id: 'themes',
    title: 'Customize Your Experience',
    description: 'Click the palette icon to change themes and accent colors. There are preset themes and custom options available.',
    icon: <Palette className="w-6 h-6" />,
    targetSelector: '[data-tutorial="themes"]',
    position: 'left',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start creating amazing UIs with AI. Check out the Help section for more tips and advanced features.',
    icon: <Sparkles className="w-6 h-6" />,
    position: 'center',
  },
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState<DOMRect | null>(null);

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  useEffect(() => {
    if (!isOpen || !step.targetSelector) {
      setHighlightPosition(null);
      return;
    }

    const element = document.querySelector(step.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightPosition(rect);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setHighlightPosition(null);
    }
  }, [isOpen, currentStep, step.targetSelector]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const getTooltipPosition = () => {
    if (step.position === 'center' || !highlightPosition) {
      return {
        position: 'fixed' as const,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;
    const tooltipWidth = 360;
    const tooltipHeight = 200;

    switch (step.position) {
      case 'top':
        return {
          position: 'fixed' as const,
          left: Math.max(padding, Math.min(highlightPosition.left + highlightPosition.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
          top: highlightPosition.bottom + padding,
        };
      case 'bottom':
        return {
          position: 'fixed' as const,
          left: Math.max(padding, Math.min(highlightPosition.left + highlightPosition.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
          top: highlightPosition.top - tooltipHeight - padding,
        };
      case 'left':
        return {
          position: 'fixed' as const,
          left: highlightPosition.right + padding,
          top: Math.max(padding, highlightPosition.top),
        };
      case 'right':
        return {
          position: 'fixed' as const,
          left: highlightPosition.left - tooltipWidth - padding,
          top: Math.max(padding, highlightPosition.top),
        };
      default:
        return {
          position: 'fixed' as const,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50">
        {/* Dark overlay with highlight cutout */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="tutorial-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightPosition && (
                <rect
                  x={highlightPosition.left - 8}
                  y={highlightPosition.top - 8}
                  width={highlightPosition.width + 16}
                  height={highlightPosition.height + 16}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#tutorial-mask)"
          />
        </svg>

        {/* Highlight border */}
        {highlightPosition && (
          <div
            className="absolute border-2 border-blue-500 rounded-lg pointer-events-none animate-pulse"
            style={{
              left: highlightPosition.left - 8,
              top: highlightPosition.top - 8,
              width: highlightPosition.width + 16,
              height: highlightPosition.height + 16,
            }}
          />
        )}

        {/* Tooltip */}
        <div
          className="w-[360px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
          style={getTooltipPosition()}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-xs text-white/70">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 px-5 pb-4">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentStep
                    ? 'bg-blue-500'
                    : idx < currentStep
                    ? 'bg-blue-300'
                    : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Skip tutorial
            </button>
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
