import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { CodePreview } from './components/CodePreview';
import { CodeViewer } from './components/CodeViewer';
import { PythonRunner } from './components/PythonRunner';
import { HistorySidebar } from './components/HistorySidebar';
import { generateUI } from './services/geminiService';
import { GeneratedUI, HistoryItem, UploadedFile } from './types';
import { Code2, Eye, Loader2, Sparkles, AlertTriangle, RefreshCcw, Terminal, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedUI | null>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'python'>('preview');
  
  // Theme State
  const [isDark, setIsDark] = useState(true);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check local storage or system preference on mount if persistence is needed
    // For now, default to dark as set in useState(true) and ensure class is present
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Reset to initial state
  const handleReset = useCallback(() => {
    setPrompt('');
    setFiles([]);
    setResult(null);
    setCurrentHistoryId(undefined);
    setError(null);
  }, []);

  // Helper to determine if code is Python based on content (not starting with HTML tags)
  const isPythonCode = (code: string) => {
    const trimmed = code.trim();
    return !trimmed.startsWith('<!DOCTYPE') && !trimmed.startsWith('<html');
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() && files.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      // If we have a current result, pass its code as context for the update
      // This allows the user to say "make the button blue" and have it apply to the existing UI
      const previousCode = result ? result.code : undefined;
      
      const data = await generateUI(prompt, files, previousCode);
      
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        prompt: prompt || (files.length > 0 ? 'File Analysis' : 'Generated UI'),
        files: [...files], // Save a copy of the files
        result: data,
        timestamp: Date.now(),
      };

      setHistory(prev => [...prev, newHistoryItem]);
      setResult(data);
      setCurrentHistoryId(newHistoryItem.id);
      
      // Smart view switching
      if (isPythonCode(data.code)) {
        setViewMode('python');
      } else {
        setViewMode('preview');
      }
      
      // Clear inputs only on success
      setFiles([]);
      setPrompt(''); // Clear prompt after generation for the next iteration
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate UI. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [prompt, files, result]);

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setCurrentHistoryId(item.id);
    
    if (isPythonCode(item.result.code)) {
      setViewMode('python');
    } else {
      setViewMode('preview');
    }
    
    // We do NOT populate prompt/files here to keep the input clear for new requests or refinements
    // The user sees the old result and can type "change X" to refine it.
    setFiles([]); 
    setPrompt('');
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    // If we deleted the currently viewed item, reset the view
    if (currentHistoryId === id) {
      handleReset();
    }
  };

  const getErrorDetails = (errorMsg: string) => {
    if (errorMsg.includes("API Key")) {
      return {
        title: "Configuration Issue",
        message: errorMsg,
        suggestion: "Ensure your API_KEY is correctly set in the environment variables."
      };
    }
    if (errorMsg.includes("quota") || errorMsg.includes("429")) {
      return {
        title: "Rate Limit Exceeded",
        message: "You've made too many requests in a short time.",
        suggestion: "Please wait a moment before trying again."
      };
    }
    if (errorMsg.includes("overloaded") || errorMsg.includes("503")) {
      return {
        title: "Service Busy",
        message: "Google's AI service is experiencing high traffic.",
        suggestion: "Try again in a few minutes."
      };
    }
    if (errorMsg.includes("parse") || errorMsg.includes("JSON")) {
      return {
        title: "Generation Error",
        message: "The AI failed to format the code correctly.",
        suggestion: "Try simplifying your prompt or adding more details."
      };
    }
    return {
      title: "Unexpected Error",
      message: errorMsg,
      suggestion: "Please check your connection and try again."
    };
  };

  const isCurrentResultPython = result ? isPythonCode(result.code) : false;

  return (
    <div className="flex flex-col h-screen bg-background text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden transition-colors duration-300">
      <Header isDark={isDark} toggleTheme={toggleTheme} onReset={handleReset} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <HistorySidebar 
          history={history} 
          onSelect={handleSelectHistory} 
          onDelete={handleDeleteHistory}
          onNewChat={handleReset}
          currentId={currentHistoryId}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden w-full">
          <div className="flex-1 flex flex-col overflow-hidden w-full px-4 pt-4 pb-24 max-w-7xl mx-auto">
            
            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-50">
                <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 transition-colors">
                  <Sparkles className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-300">Ready to Forge</h2>
                  <p className="text-zinc-500 dark:text-zinc-500 max-w-md mx-auto mt-2">
                    Describe a UI component or upload a sketch, and I will generate the code.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-pulse">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
                  {result ? "Refining your interface..." : "Forging your interface..."}
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md w-full backdrop-blur-sm">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-500/10 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-200 mb-2">{getErrorDetails(error).title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">{getErrorDetails(error).message}</p>
                  
                  <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-3 text-sm text-zinc-600 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                    <span className="font-medium text-zinc-500 dark:text-zinc-400">Suggestion: </span>
                    {getErrorDetails(error).suggestion}
                  </div>

                  <button 
                    onClick={handleGenerate}
                    className="mt-6 w-full py-2.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium transition-colors border border-red-200 dark:border-red-800/30 flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {result && !loading && !error && (
              <div className="flex flex-col h-full bg-surface border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-colors duration-300">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 gap-3 sm:gap-0">
                  <div className="flex flex-col space-y-1 overflow-hidden">
                    <div className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                      <span className="font-medium truncate max-w-md">{result.explanation}</span>
                    </div>
                    {/* Source citations */}
                    {result.sources && result.sources.length > 0 && (
                      <div className="flex items-center space-x-2 text-xs overflow-x-auto no-scrollbar">
                         <span className="text-zinc-400 shrink-0">Sources:</span>
                         {result.sources.map((source, idx) => (
                           <a 
                             key={idx} 
                             href={source.uri} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="flex items-center gap-1 text-blue-500 hover:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors"
                             title={source.title}
                           >
                             <span className="max-w-[100px] truncate">{source.title}</span>
                             <ExternalLink className="w-3 h-3 shrink-0" />
                           </a>
                         ))}
                      </div>
                    )}
                  </div>

                  <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800 shrink-0 self-end sm:self-auto">
                    {!isCurrentResultPython && (
                      <button
                        onClick={() => setViewMode('preview')}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                          viewMode === 'preview'
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                    )}
                    
                    {isCurrentResultPython && (
                      <button
                        onClick={() => setViewMode('python')}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                          viewMode === 'python'
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                        }`}
                      >
                        <Terminal className="w-4 h-4" />
                        <span>Python</span>
                      </button>
                    )}

                    <button
                      onClick={() => setViewMode('code')}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                        viewMode === 'code'
                          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                      }`}
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Source</span>
                    </button>
                  </div>
                </div>

                {/* Viewport */}
                <div className="flex-1 overflow-hidden relative bg-zinc-100 dark:bg-[#0d0d10]">
                  {viewMode === 'preview' && !isCurrentResultPython && (
                     <CodePreview html={result.code} />
                  )}
                  {viewMode === 'python' && isCurrentResultPython && (
                     <PythonRunner code={result.code} />
                  )}
                  {viewMode === 'code' && (
                    <CodeViewer code={result.code} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-10 transition-colors duration-300">
              <div className="max-w-3xl mx-auto">
                  <InputArea 
                      prompt={prompt} 
                      setPrompt={setPrompt} 
                      files={files}
                      setFiles={setFiles}
                      onGenerate={handleGenerate} 
                      loading={loading}
                  />
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;