import React, { useState, useEffect, useRef } from 'react';
import {
  X, Terminal, Trash2, AlertCircle, AlertTriangle, Info,
  ChevronDown, ChevronRight, Filter
} from 'lucide-react';

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: Date;
  count?: number;
  stack?: string;
}

interface ConsolePanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ConsoleMessage[];
  onClear: () => void;
}

const typeStyles: Record<ConsoleMessage['type'], { bg: string; text: string; icon: React.ReactNode }> = {
  log: {
    bg: 'bg-zinc-800',
    text: 'text-zinc-300',
    icon: <ChevronRight className="w-3 h-3 text-zinc-500" />,
  },
  info: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    icon: <Info className="w-3 h-3 text-blue-400" />,
  },
  warn: {
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-300',
    icon: <AlertTriangle className="w-3 h-3 text-yellow-400" />,
  },
  error: {
    bg: 'bg-red-900/30',
    text: 'text-red-300',
    icon: <AlertCircle className="w-3 h-3 text-red-400" />,
  },
};

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  isOpen,
  onClose,
  messages,
  onClear,
}) => {
  const [filter, setFilter] = useState<ConsoleMessage['type'] | 'all'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = messages.filter(
    msg => filter === 'all' || msg.type === filter
  );

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const counts = {
    all: messages.length,
    log: messages.filter(m => m.type === 'log').length,
    info: messages.filter(m => m.type === 'info').length,
    warn: messages.filter(m => m.type === 'warn').length,
    error: messages.filter(m => m.type === 'error').length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 bg-zinc-900 border-t border-zinc-700 z-30 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-200">Console</span>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1 ml-4">
            {(['all', 'error', 'warn', 'info', 'log'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                  filter === type
                    ? 'bg-zinc-700 text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50'
                }`}
              >
                {type === 'all' ? (
                  <Filter className="w-3 h-3" />
                ) : (
                  typeStyles[type].icon
                )}
                <span className="capitalize">{type}</span>
                {counts[type] > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    type === 'error' ? 'bg-red-500/30 text-red-300' :
                    type === 'warn' ? 'bg-yellow-500/30 text-yellow-300' :
                    'bg-zinc-600 text-zinc-300'
                  }`}>
                    {counts[type]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 rounded transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto font-mono text-xs">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            {messages.length === 0 ? 'No console output yet' : 'No messages match the filter'}
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const style = typeStyles[msg.type];
            const isExpanded = expandedIds.has(msg.id);
            const hasStack = !!msg.stack;

            return (
              <div
                key={msg.id}
                className={`${style.bg} border-b border-zinc-800 px-4 py-1.5 hover:bg-zinc-700/30 transition-colors`}
              >
                <div className="flex items-start gap-2">
                  {/* Expand toggle for errors with stack */}
                  <button
                    onClick={() => hasStack && toggleExpand(msg.id)}
                    className={`mt-0.5 ${hasStack ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {hasStack ? (
                      isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      )
                    ) : (
                      style.icon
                    )}
                  </button>

                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className={`${style.text} break-all`}>
                        {msg.message}
                      </span>
                      {msg.count && msg.count > 1 && (
                        <span className="px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded text-[10px] flex-shrink-0">
                          {msg.count}
                        </span>
                      )}
                    </div>

                    {/* Stack trace */}
                    {hasStack && isExpanded && (
                      <pre className="mt-2 p-2 bg-zinc-800/50 rounded text-[10px] text-zinc-500 overflow-x-auto whitespace-pre-wrap">
                        {msg.stack}
                      </pre>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-zinc-600 flex-shrink-0">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Status bar */}
      <div className="px-4 py-1 bg-zinc-800 border-t border-zinc-700 flex items-center justify-between text-[10px] text-zinc-500">
        <span>{filteredMessages.length} messages</span>
        <span>
          {counts.error > 0 && <span className="text-red-400 mr-2">{counts.error} errors</span>}
          {counts.warn > 0 && <span className="text-yellow-400">{counts.warn} warnings</span>}
        </span>
      </div>
    </div>
  );
};

// Helper function to inject console capture into iframe HTML
export const injectConsoleCapture = (html: string): string => {
  const consoleScript = `
    <script>
      (function() {
        const originalConsole = { ...console };
        const sendMessage = (type, args) => {
          try {
            window.parent.postMessage({
              type: 'console',
              payload: {
                type: type,
                message: args.map(arg => {
                  try {
                    if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
                    return String(arg);
                  } catch { return String(arg); }
                }).join(' '),
                timestamp: Date.now()
              }
            }, '*');
          } catch {}
        };

        console.log = (...args) => { sendMessage('log', args); originalConsole.log(...args); };
        console.info = (...args) => { sendMessage('info', args); originalConsole.info(...args); };
        console.warn = (...args) => { sendMessage('warn', args); originalConsole.warn(...args); };
        console.error = (...args) => { sendMessage('error', args); originalConsole.error(...args); };

        window.onerror = (msg, url, line, col, error) => {
          sendMessage('error', [msg + (error?.stack ? '\\n' + error.stack : '')]);
        };

        window.onunhandledrejection = (event) => {
          sendMessage('error', ['Unhandled Promise Rejection: ' + event.reason]);
        };
      })();
    </script>
  `;

  // Insert after <head> or at the start of <body>
  if (html.includes('<head>')) {
    return html.replace('<head>', '<head>' + consoleScript);
  } else if (html.includes('<body>')) {
    return html.replace('<body>', '<body>' + consoleScript);
  }
  return consoleScript + html;
};
