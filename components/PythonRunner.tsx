import React, { useEffect, useState, useRef } from 'react';
import { Play, RotateCcw, Terminal, Loader2, Download, Copy, Check, X, Upload, FileCode, Eye, Sparkles, Package, Search, Trash2, RefreshCw } from 'lucide-react';
import { PythonRunnerProps } from '../types';

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

export const PythonRunner: React.FC<PythonRunnerProps> = ({ code: initialCode, onFixError }) => {
  const [output, setOutput] = useState<Array<{ type: 'out' | 'err'; content: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingPyodide, setIsLoadingPyodide] = useState(true);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Code & Editor State
  const [scriptContent, setScriptContent] = useState(initialCode);
  const [showEditor, setShowEditor] = useState(false);

  // Package Manager State
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [pkgSearch, setPkgSearch] = useState('');
  const [installedPkgs, setInstalledPkgs] = useState<string[]>([]);
  const [isInstallingPkg, setIsInstallingPkg] = useState(false);

  // Download state
  const [isNaming, setIsNaming] = useState(false);
  const [fileName, setFileName] = useState('script.py');
  
  const pyodideRef = useRef<any>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const plotRootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation Management
  const rafIds = useRef<Set<number>>(new Set());
  const setOutputRef = useRef(setOutput); // Ref to access latest setOutput in callbacks

  // Update ref when state changes
  useEffect(() => {
    setOutputRef.current = setOutput;
  }, [setOutput]);

  // Sync prop code to local state when it changes (new generation)
  useEffect(() => {
    setScriptContent(initialCode);
  }, [initialCode]);

  // Scroll to bottom of terminal on output
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Helper to fetch installed packages
  const updatePackageList = async () => {
    if (!pyodideRef.current) return;
    try {
        // Run python to get list of packages from micropip
        const listJson = await pyodideRef.current.runPythonAsync(`
            import micropip
            import json
            # micropip.list() returns a transaction object where keys are package names
            json.dumps(list(micropip.list().keys()))
        `);
        const pkgs = JSON.parse(listJson);
        // Filter out some internals if needed, or just show all
        setInstalledPkgs(pkgs.sort());
    } catch (e) {
        console.warn("Failed to fetch package list", e);
    }
  };

  // Cleanup Animations Helper
  const cleanupAnimations = () => {
      rafIds.current.forEach(id => window.cancelAnimationFrame(id));
      rafIds.current.clear();
  };

  // Intercept requestAnimationFrame for cleanup and error handling
  useEffect(() => {
    const originalRAF = window.requestAnimationFrame;
    const originalCAF = window.cancelAnimationFrame;

    window.requestAnimationFrame = (callback) => {
        const wrappedCallback = (time: number) => {
            try {
                callback(time);
            } catch (e: any) {
                console.error("Animation Loop Error:", e);
                // Attempt to log to console output
                if (setOutputRef.current) {
                    setOutputRef.current(prev => [...prev, { type: 'err', content: `Animation Error: ${e.message || e}` }]);
                }
            }
        };

        const id = originalRAF(wrappedCallback);
        rafIds.current.add(id);
        return id;
    };

    window.cancelAnimationFrame = (id) => {
        rafIds.current.delete(id);
        originalCAF(id);
    };

    return () => {
        cleanupAnimations();
        window.requestAnimationFrame = originalRAF;
        window.cancelAnimationFrame = originalCAF;
    };
  }, []);

  // Load Pyodide and Packages
  useEffect(() => {
    const loadEngine = async () => {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          script.async = true;
          document.body.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        if (!pyodideRef.current) {
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          });
          
          // Pre-load common data science packages and micropip
          await pyodide.loadPackage(["numpy", "matplotlib", "micropip"]);
          pyodideRef.current = pyodide;
        }
        
        setPyodideReady(true);
        // Initial package fetch
        setTimeout(updatePackageList, 1000);

      } catch (err) {
        console.error("Failed to load Pyodide:", err);
        setOutput(prev => [...prev, { type: 'err', content: 'Failed to load Python engine. Check console.' }]);
      } finally {
        setIsLoadingPyodide(false);
      }
    };

    loadEngine();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setScriptContent(text);
      setShowEditor(true); // Switch to editor to show uploaded code
      setOutput(prev => [...prev, { type: 'out', content: `Loaded file: ${file.name}` }]);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runCode = async () => {
    if (!pyodideRef.current || isRunning) return;

    // Safety check: Don't try to run HTML
    const trimmedCode = scriptContent.trim();
    if (trimmedCode.startsWith('<!DOCTYPE') || trimmedCode.startsWith('<html') || trimmedCode.startsWith('<div')) {
      setOutput(prev => [
        ...prev, 
        { type: 'err', content: 'SyntaxError: The code appears to be HTML, not Python.' },
        { type: 'err', content: 'Hint: Upload a valid .py file or ask AI for "Python code".' }
      ]);
      return;
    }

    // CLEANUP PREVIOUS ANIMATIONS
    cleanupAnimations();

    setIsRunning(true);
    setOutput([]); // Clear previous output
    setShowEditor(false); // Switch to visual output on run
    setShowPackageManager(false); // Close package manager if open
    
    // Clear Plot Root
    if (plotRootRef.current) {
        plotRootRef.current.innerHTML = '';
    }

    try {
      const pyodide = pyodideRef.current;
      
      // Auto-install packages detected in the code
      try {
        await pyodide.loadPackagesFromImports(scriptContent);
        // Update list after auto-install
        updatePackageList();
      } catch (pkgErr) {
        console.warn("Auto-install warning:", pkgErr);
        setOutput(prev => [...prev, { type: 'err', content: 'Warning: Could not auto-install some packages.' }]);
      }

      // Reset stdout capture
      pyodide.setStdout({
        batched: (text: string) => {
          setOutput(prev => [...prev, { type: 'out', content: text }]);
        }
      });

      // Reset stderr capture
      pyodide.setStderr({
        batched: (text: string) => {
          setOutput(prev => [...prev, { type: 'err', content: text }]);
        }
      });

      // Execute
      await pyodide.runPythonAsync(scriptContent);
      
    } catch (err: any) {
      setOutput(prev => [...prev, { type: 'err', content: err.toString() }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleInstallPackage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pkgSearch || isInstallingPkg || !pyodideRef.current) return;
    
    setIsInstallingPkg(true);
    // Show installing message in terminal too for visibility
    setOutput(prev => [...prev, { type: 'out', content: `> pip install ${pkgSearch}` }]);
    
    try {
        const micropip = pyodideRef.current.pyimport("micropip");
        await micropip.install(pkgSearch);
        setOutput(prev => [...prev, { type: 'out', content: `Successfully installed ${pkgSearch}` }]);
        await updatePackageList();
        setPkgSearch('');
    } catch (err: any) {
        setOutput(prev => [...prev, { type: 'err', content: `Installation failed: ${err.message}` }]);
    } finally {
        setIsInstallingPkg(false);
    }
  };

  const handleReloadEnvironment = () => {
    if (confirm("This will reload the page to reset the Python environment. All current data and history in this session will be lost. Continue?")) {
        cleanupAnimations();
        window.location.reload();
    }
  };

  const performDownload = () => {
    let name = fileName.trim();
    if (!name) name = 'script.py';
    if (!name.endsWith('.py')) name += '.py';

    const blob = new Blob([scriptContent], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsNaming(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Enhanced Error Handling
  // Check if the last output was an error
  const hasError = output.length > 0 && output[output.length - 1].type === 'err';
  
  // Aggregate all error messages to provide full traceback context
  const errorContext = hasError 
    ? output.filter(line => line.type === 'err').map(line => line.content).join('\n')
    : '';

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-zinc-300 font-mono text-sm overflow-hidden relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span className="font-medium text-zinc-300">Python Console</span>
          {isLoadingPyodide && (
            <span className="flex items-center text-xs text-zinc-500 ml-2">
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
              Loading Engine...
            </span>
          )}
          {pyodideReady && !isLoadingPyodide && (
            <span className="text-xs text-green-500 ml-2 flex items-center">
              ● Ready
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
           {isNaming ? (
            <div className="flex items-center bg-[#333] rounded-md px-1 mr-1 animate-in fade-in zoom-in duration-200">
               <input 
                  type="text" 
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-transparent border-none text-zinc-200 text-xs px-2 py-1.5 w-32 focus:outline-none font-mono placeholder-zinc-500"
                  autoFocus
                  placeholder="filename.py"
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') performDownload();
                      if (e.key === 'Escape') setIsNaming(false);
                  }}
               />
               <button 
                onClick={performDownload} 
                className="p-1 hover:bg-[#444] rounded text-zinc-400 hover:text-green-400 transition-colors"
                title="Save"
               >
                 <Check className="w-3 h-3" />
               </button>
               <button 
                onClick={() => setIsNaming(false)} 
                className="p-1 hover:bg-[#444] rounded text-zinc-400 hover:text-red-400 transition-colors"
                title="Cancel"
               >
                 <X className="w-3 h-3" />
               </button>
            </div>
           ) : (
            <>
              {/* Package Manager Toggle */}
              <button
                onClick={() => setShowPackageManager(!showPackageManager)}
                className={`p-1.5 rounded-md transition-colors flex items-center gap-1 ${
                  showPackageManager 
                  ? 'bg-[#333] text-white' 
                  : 'hover:bg-[#333] text-zinc-400 hover:text-white'
                }`}
                title="Manage Packages"
              >
                <Package className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-[#444] mx-1"></div>

              {/* File Upload */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".py,text/x-python,text/plain" 
                onChange={handleFileUpload} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white"
                title="Upload Python Script"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button 
                onClick={handleCopy}
                className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white flex items-center gap-2"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsNaming(true)}
                className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white"
                title="Download .py"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
           )}
           
           <div className="w-px h-4 bg-[#444] mx-1"></div>

           {/* Editor Toggle */}
           <button
             onClick={() => setShowEditor(!showEditor)}
             className={`p-1.5 rounded-md transition-colors flex items-center space-x-1 ${
               showEditor 
               ? 'bg-[#333] text-white' 
               : 'hover:bg-[#333] text-zinc-400 hover:text-white'
             }`}
             title={showEditor ? "Show Visual Output" : "Show Script"}
           >
             {showEditor ? <Eye className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
             <span className="text-xs hidden sm:inline">{showEditor ? "Preview" : "Script"}</span>
           </button>
           
           <button 
            onClick={() => setOutput([])}
            className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white"
            title="Clear Output"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={runCode}
            disabled={!pyodideReady || isRunning}
            className={`flex items-center space-x-2 px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white transition-all ${
              (!pyodideReady || isRunning) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>Run</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* Package Manager Overlay */}
        {showPackageManager && (
            <div className="absolute top-0 right-0 z-20 w-80 h-full bg-[#1e1e1e]/95 backdrop-blur-sm border-l border-[#333] flex flex-col shadow-xl animate-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between p-3 border-b border-[#333]">
                    <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Packages
                    </h3>
                    <button onClick={() => setShowPackageManager(false)} className="text-zinc-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="p-3 border-b border-[#333]">
                    <form onSubmit={handleInstallPackage} className="flex gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                value={pkgSearch}
                                onChange={(e) => setPkgSearch(e.target.value)}
                                placeholder="Package name..." 
                                className="w-full bg-[#252526] border border-[#333] rounded px-2 py-1.5 pl-7 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2 top-2" />
                        </div>
                        <button 
                            type="submit"
                            disabled={isInstallingPkg || !pkgSearch}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-2 py-1 rounded text-xs font-medium"
                        >
                            {isInstallingPkg ? <Loader2 className="w-3 h-3 animate-spin" /> : "Install"}
                        </button>
                    </form>
                    <p className="text-[10px] text-zinc-500 mt-1">
                        Installs pure Python wheels via <a href="https://pypi.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-300">PyPI</a>.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-1">
                        {installedPkgs.length === 0 ? (
                            <div className="text-center py-4 text-zinc-600 italic text-xs">No packages detected yet.</div>
                        ) : (
                            installedPkgs.map((pkg, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-[#252526] rounded group">
                                    <span className="text-zinc-300 text-xs">{pkg}</span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                       <span className="text-[10px] text-green-500 flex items-center gap-0.5">
                                           <Check className="w-3 h-3" />
                                       </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                 <div className="p-3 border-t border-[#333] bg-[#252526]/50">
                    <button 
                        onClick={handleReloadEnvironment}
                        className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded py-1.5 text-xs transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                        Reset Environment
                    </button>
                    <p className="text-[10px] text-zinc-500 text-center mt-1">
                        Reloads page to uninstall all packages.
                    </p>
                </div>
            </div>
        )}

        {/* Output/Visualization Area or Editor */}
        <div className="flex-[3] bg-[#2d2d2d] border-b border-[#333] resize-y overflow-auto relative min-h-[200px]">
           {showEditor ? (
             <textarea 
               value={scriptContent}
               onChange={(e) => setScriptContent(e.target.value)}
               className="w-full h-full bg-[#1e1e1e] text-zinc-100 p-4 font-mono text-sm resize-none focus:outline-none"
               spellCheck={false}
               placeholder="Write or upload Python code here..."
             />
           ) : (
             <>
               <div 
                 id="plot-root" 
                 ref={plotRootRef}
                 className="w-full h-full flex flex-col items-center justify-center p-4 overflow-auto"
               ></div>
               
               {/* Placeholder text if empty */}
               {!isRunning && (!plotRootRef.current || plotRootRef.current.childElementCount === 0) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-zinc-500 mb-2">Visual Output</div>
                        <div className="text-sm text-zinc-600">Graphics, plots, and UI controls appear here</div>
                    </div>
                  </div>
               )}
             </>
           )}
        </div>

        {/* Terminal Text Output */}
        <div className="flex-1 p-4 overflow-y-auto font-mono bg-[#1e1e1e] relative">
            {output.length === 0 && !isRunning && (
                <div className="text-zinc-600 italic mt-2">
                    Console output...
                </div>
            )}
            
            {output.map((line, idx) => (
                <div key={idx} className={`whitespace-pre-wrap mb-1 ${
                    line.type === 'err' ? 'text-red-400' : 'text-zinc-100'
                }`}>
                    {line.content}
                </div>
            ))}
            <div ref={outputEndRef} />

            {/* Auto Debug / Fix Button */}
            {hasError && onFixError && (
              <div className="sticky bottom-0 right-0 p-2 flex justify-end bg-gradient-to-t from-[#1e1e1e] to-transparent">
                 <button 
                  onClick={() => onFixError(scriptContent, errorContext)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded shadow-lg transition-colors animate-in fade-in slide-in-from-bottom-2"
                 >
                   <Sparkles className="w-3 h-3" />
                   Fix Error with AI
                 </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};