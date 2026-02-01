import React, { useEffect, useState, useRef } from 'react';
import { Play, RotateCcw, Terminal, Loader2, Download, Copy, Check, X, Upload, FileCode, Eye, Sparkles, Package, Search, Trash2, RefreshCw, BookOpen, Image as ImageIcon, Box } from 'lucide-react';
import { PythonRunnerProps } from '../types';

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
    Plotly: any;
    renderPlotly: (json: string) => void;
    THREE: any;
  }
}

const EXAMPLE_CHART_CODE = `import matplotlib.pyplot as plt
import numpy as np

# 1. Generate Data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# 2. Create Plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, label='Sine Wave', color='#3b82f6', linewidth=2)

# 3. Style
plt.title('Simple Sine Wave', fontsize=14)
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.grid(True, alpha=0.3)
plt.legend()

# 4. Render
print("Rendering plot...")
plt.show()`;

const LORENZ_3D_CODE = `import numpy as np
from js import window, document, THREE, Math
from pyodide.ffi import create_proxy

# 1. Setup Scene
root = document.getElementById("plot-root")
root.innerHTML = ""

width = root.clientWidth
height = 600

scene = THREE.Scene.new()
camera = THREE.PerspectiveCamera.new(50, width / height, 0.1, 1000)
camera.position.set(0, 0, 60)

renderer = THREE.WebGLRenderer.new({"antialias": True, "alpha": True})
renderer.setSize(width, height)
renderer.setClearColor(0x000000, 0)
root.appendChild(renderer.domElement)

# 2. Geometry
max_points = 5000
# We need to copy it or keep it synced. Simplest for pyodide: create JS typed array and update it.
js_positions = window.Float32Array.new(max_points * 3)

geometry = THREE.BufferGeometry.new()
att = THREE.BufferAttribute.new(js_positions, 3)
att.setUsage(THREE.DynamicDrawUsage)
geometry.setAttribute('position', att)

material = THREE.LineBasicMaterial.new({"color": 0x3b82f6, "linewidth": 2})
line = THREE.Line.new(geometry, material)
scene.add(line)

# 3. State & Lorenz Equation
params = {"sigma": 10.0, "rho": 28.0, "beta": 8.0/3.0}
state = {"x": 0.1, "y": 0.0, "z": 0.0, "count": 0}

def update(t):
    dt = 0.01
    x, y, z = state["x"], state["y"], state["z"]
    
    # Generate points faster than framerate
    for _ in range(5):
        if state["count"] >= max_points:
            # Shift buffer logic is complex in simple script, let's just stop or loop
            # For this demo, we'll just stop drawing new points to keep it simple
            break
            
        dx = params["sigma"] * (y - x) * dt
        dy = x * (params["rho"] - z) - y * dt
        dz = x * y - params["beta"] * z * dt
        
        x += dx
        y += dy
        z += dz
        
        idx = state["count"]
        js_positions[idx * 3] = x
        js_positions[idx * 3 + 1] = y
        js_positions[idx * 3 + 2] = z
        state["count"] += 1

    state["x"], state["y"], state["z"] = x, y, z
    
    # Update Three.js buffer
    line.geometry.attributes.position.needsUpdate = True
    if state["count"] < max_points:
        line.geometry.setDrawRange(0, state["count"])
    
    # Auto rotate
    line.rotation.y += 0.005
    line.rotation.z += 0.001
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(proxy_update)

proxy_update = create_proxy(update)
window.requestAnimationFrame(proxy_update)

# 4. Add HTML Sliders
controls_div = document.createElement("div")
controls_div.style.position = "absolute"
controls_div.style.top = "10px"
controls_div.style.left = "10px"
controls_div.style.background = "rgba(0,0,0,0.8)"
controls_div.style.padding = "10px"
controls_div.style.borderRadius = "8px"
controls_div.style.color = "white"
controls_div.style.fontFamily = "monospace"
controls_div.style.fontSize = "12px"
root.appendChild(controls_div)

def add_slider(label, key, min_val, max_val):
    container = document.createElement("div")
    container.style.marginBottom = "5px"
    
    lbl = document.createElement("div")
    lbl.innerText = f"{label}: {params[key]:.1f}"
    
    inp = document.createElement("input")
    inp.type = "range"
    inp.min = str(min_val)
    inp.max = str(max_val)
    inp.step = "0.1"
    inp.value = str(params[key])
    
    def on_change(e):
        val = float(e.target.value)
        params[key] = val
        lbl.innerText = f"{label}: {val:.1f}"
        
        # Reset trace on param change for fun
        state["x"], state["y"], state["z"] = 0.1, 0.0, 0.0
        state["count"] = 0
        line.geometry.setDrawRange(0, 0)
        
    proxy_change = create_proxy(on_change)
    inp.addEventListener("input", proxy_change)
    
    container.appendChild(lbl)
    container.appendChild(inp)
    controls_div.appendChild(container)

add_slider("Sigma", "sigma", 0, 50)
add_slider("Rho", "rho", 0, 50)
add_slider("Beta", "beta", 0, 10)

print("Running Lorenz Attractor 3D simulation...")`;

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
  const [isRefreshingPkgs, setIsRefreshingPkgs] = useState(false);

  // Download state
  const [namingTarget, setNamingTarget] = useState<'script' | 'plot' | null>(null);
  const [fileName, setFileName] = useState('');
  const [plotFormat, setPlotFormat] = useState<'png' | 'jpg' | 'svg' | 'pdf'>('png');
  
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
    setIsRefreshingPkgs(true);
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
    } finally {
        setIsRefreshingPkgs(false);
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
        
        // Load Plotly.js
        if (!window.Plotly) {
            const plotlyScript = document.createElement('script');
            plotlyScript.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
            plotlyScript.async = true;
            document.head.appendChild(plotlyScript);
        }

        // Load Three.js
        if (!window.THREE) {
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
            threeScript.async = true;
            document.head.appendChild(threeScript);
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

  const handleLoadExample = () => {
    setScriptContent(EXAMPLE_CHART_CODE);
    setShowEditor(true);
    setOutput(prev => [...prev, { type: 'out', content: 'Loaded example chart script.' }]);
  };

  const handleLoad3DExample = () => {
    setScriptContent(LORENZ_3D_CODE);
    setShowEditor(true);
    setOutput(prev => [...prev, { type: 'out', content: 'Loaded 3D Lorenz Attractor example.' }]);
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

    // Setup Render Plotly Callback
    window.renderPlotly = (jsonStr: string) => {
      if (!plotRootRef.current) return;
      if (!window.Plotly) {
          setOutput(prev => [...prev, { type: 'err', content: 'Error: Plotly.js library not loaded yet.' }]);
          return;
      }
      try {
          const figure = JSON.parse(jsonStr);
          const div = document.createElement('div');
          div.style.width = '100%';
          div.style.height = '500px';
          div.className = "plotly-container mb-4 rounded-lg shadow-sm overflow-hidden bg-white";
          plotRootRef.current.appendChild(div);

          window.Plotly.newPlot(div, figure.data, figure.layout, { responsive: true });
      } catch (e) {
          console.error("Plotly render error", e);
          setOutput(prev => [...prev, { type: 'err', content: 'Failed to render Plotly chart.' }]);
      }
    };

    try {
      const pyodide = pyodideRef.current;
      
      // Check for Plotly import and ensure installed
      if (scriptContent.includes('plotly')) {
          const isPlotlyInstalled = installedPkgs.includes('plotly');
          if (!isPlotlyInstalled) {
             setOutput(prev => [...prev, { type: 'out', content: '> Plotly detected. Installing package (this may take a moment)...' }]);
             try {
                await pyodide.runPythonAsync(`
                    import micropip
                    await micropip.install("plotly")
                `);
                await updatePackageList(); // Update installed list
                setOutput(prev => [...prev, { type: 'out', content: '> Plotly installed.' }]);
             } catch (e) {
                console.warn("Plotly auto-install failed", e);
             }
          }
      }

      // Auto-install other packages
      try {
        await pyodide.loadPackagesFromImports(scriptContent);
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

      // INJECT PATCHES (Matplotlib & Plotly & Three.js helper if needed)
      // Note: We don't monkey patch Three.js, but we ensure the environment is clean
      await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
import io, base64
from js import document, window
import sys

# Global variable to hold the last figure for export
_prism_last_fig = None

def custom_show():
    global _prism_last_fig
    _prism_last_fig = plt.gcf()
    
    target = document.getElementById("plot-root")
    if not target:
        return
    
    buf = io.BytesIO()
    # Save as transparent PNG for display
    _prism_last_fig.savefig(buf, format='png', bbox_inches='tight', transparent=True)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    
    img = document.createElement("img")
    img.src = "data:image/png;base64," + img_str
    img.style.maxWidth = "100%"
    img.style.height = "auto"
    img.style.marginBottom = "16px"
    img.style.borderRadius = "8px"
    img.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    
    target.appendChild(img)
    # Close the figure in pyplot to free memory and state, but _prism_last_fig keeps the object alive
    plt.close(_prism_last_fig)

def export_last_plot(fmt):
    global _prism_last_fig
    if _prism_last_fig is None:
        return None
    
    buf = io.BytesIO()
    mime = "image/png"
    
    if fmt == 'jpg' or fmt == 'jpeg':
        _prism_last_fig.savefig(buf, format='jpg', bbox_inches='tight', facecolor='white')
        mime = "image/jpeg"
    elif fmt == 'svg':
        _prism_last_fig.savefig(buf, format='svg', bbox_inches='tight')
        mime = "image/svg+xml"
    elif fmt == 'pdf':
        _prism_last_fig.savefig(buf, format='pdf', bbox_inches='tight')
        mime = "application/pdf"
    else:
        _prism_last_fig.savefig(buf, format='png', bbox_inches='tight', transparent=True)
        
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:{mime};base64,{b64}"

# Monkey patch plt.show
plt.show = custom_show

# PLOTLY PATCH
try:
    import plotly.graph_objects as go
    import plotly.io as pio

    def _prism_plotly_show(fig, *args, **kwargs):
        json_str = fig.to_json()
        window.renderPlotly(json_str)

    # Patch Figure.show
    go.Figure.show = _prism_plotly_show
    # Set default renderer to None to avoid browser open attempts
    pio.renderers.default = None
except ImportError:
    pass
      `);

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

  const performDownload = async () => {
    let name = fileName.trim();
    if (!namingTarget) return;

    if (namingTarget === 'script') {
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
    } else if (namingTarget === 'plot') {
        if (!name) name = 'plot';
        
        // Ensure extension matches format
        const ext = `.${plotFormat}`;
        if (!name.toLowerCase().endsWith(ext)) {
            // Replace existing extension if present, else append
            if (name.match(/\.(png|jpg|jpeg|svg|pdf)$/i)) {
                name = name.replace(/\.[^.]+$/, ext);
            } else {
                name += ext;
            }
        }

        try {
            // Attempt to export via Python logic (allows SVG/PDF etc)
            let dataUrl = null;
            if (pyodideRef.current) {
                 dataUrl = await pyodideRef.current.runPythonAsync(`export_last_plot('${plotFormat}')`);
            }

            if (dataUrl) {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                 // Fallback to DOM extraction (PNG only)
                 // This primarily handles matplotlib images. 
                 // For Plotly, we might need Plotly.toImage if we wanted to support download.
                 // Currently keeping simple for matplotlib consistency.
                 const images = plotRootRef.current?.querySelectorAll('img');
                 if (!images || images.length === 0) {
                     setOutput(prev => [...prev, { type: 'err', content: 'No saved plot found (Plotly downloads are currently manual via the plot toolbar).' }]);
                     setNamingTarget(null);
                     return;
                 }
                 const img = images[images.length - 1] as HTMLImageElement;
                 
                 if (plotFormat !== 'png') {
                     setOutput(prev => [...prev, { type: 'err', content: `Warning: Falling back to PNG. Could not generate ${plotFormat} from source.` }]);
                 }
                 
                 const a = document.createElement('a');
                 a.href = img.src;
                 a.download = name.replace(/\.[^.]+$/, '.png');
                 document.body.appendChild(a);
                 a.click();
                 document.body.removeChild(a);
            }
        } catch (e) {
            console.error("Download failed", e);
            setOutput(prev => [...prev, { type: 'err', content: 'Failed to export plot.' }]);
        }
    }

    setNamingTarget(null);
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
           {namingTarget ? (
            <div className="flex items-center bg-[#333] rounded-md px-1 mr-1 animate-in fade-in zoom-in duration-200">
               <span className="text-[10px] text-zinc-500 mr-2 ml-1 whitespace-nowrap">
                   {namingTarget === 'script' ? 'Save Script:' : 'Save Plot:'}
               </span>
               <input 
                  type="text" 
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-transparent border-none text-zinc-200 text-xs px-2 py-1.5 w-32 focus:outline-none font-mono placeholder-zinc-500"
                  autoFocus
                  placeholder={namingTarget === 'script' ? "script.py" : `plot.${plotFormat}`}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') performDownload();
                      if (e.key === 'Escape') setNamingTarget(null);
                  }}
               />
               {namingTarget === 'plot' && (
                 <select 
                   value={plotFormat}
                   onChange={(e) => setPlotFormat(e.target.value as any)}
                   className="bg-[#2d2d2d] border-none text-zinc-300 text-xs py-1 px-1 mr-2 rounded focus:ring-0 cursor-pointer"
                 >
                   <option value="png">PNG</option>
                   <option value="jpg">JPG</option>
                   <option value="svg">SVG</option>
                   <option value="pdf">PDF</option>
                 </select>
               )}
               <button 
                onClick={performDownload} 
                className="p-1 hover:bg-[#444] rounded text-zinc-400 hover:text-green-400 transition-colors"
                title="Save"
               >
                 <Check className="w-3 h-3" />
               </button>
               <button 
                onClick={() => setNamingTarget(null)} 
                className="p-1 hover:bg-[#444] rounded text-zinc-400 hover:text-red-400 transition-colors"
                title="Cancel"
               >
                 <X className="w-3 h-3" />
               </button>
            </div>
           ) : (
            <>
              {/* Load Example Button */}
              <button
                onClick={handleLoadExample}
                className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white"
                title="Load 2D Example"
              >
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                onClick={handleLoad3DExample}
                className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white"
                title="Load 3D Example"
              >
                <Box className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-[#444] mx-1"></div>

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
                onClick={() => {
                    setFileName('script.py');
                    setNamingTarget('script');
                }}
                className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white"
                title="Download .py"
              >
                <Download className="w-4 h-4" />
              </button>

              <button 
                onClick={() => {
                    setFileName('plot');
                    setPlotFormat('png');
                    setNamingTarget('plot');
                }}
                className="p-1.5 hover:bg-[#333] rounded-md transition-colors text-zinc-400 hover:text-white"
                title="Save Plot as Image"
              >
                <ImageIcon className="w-4 h-4" />
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
                        Packages <span className="text-xs text-zinc-500 font-normal">({installedPkgs.length})</span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => updatePackageList()}
                            disabled={isRefreshingPkgs}
                            className={`p-1.5 hover:bg-[#333] rounded text-zinc-400 hover:text-white transition-colors ${isRefreshingPkgs ? 'animate-spin' : ''}`}
                            title="Refresh List"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setShowPackageManager(false)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#333] rounded">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
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
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-2 py-1 rounded text-xs font-medium min-w-[60px] flex items-center justify-center"
                        >
                            {isInstallingPkg ? <Loader2 className="w-3 h-3 animate-spin" /> : "Install"}
                        </button>
                    </form>
                    <p className="text-[10px] text-zinc-500 mt-1">
                        Installs pure Python wheels via <a href="https://pypi.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-300">PyPI</a>.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    <div className="space-y-1">
                        {isInstallingPkg && pkgSearch && (
                            <div className="flex items-center justify-between p-2 bg-[#252526]/50 rounded border border-blue-500/30 animate-pulse">
                                <span className="text-zinc-400 text-xs flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                    Installing {pkgSearch}...
                                </span>
                            </div>
                        )}
                        
                        {installedPkgs.length === 0 && !isInstallingPkg ? (
                            <div className="text-center py-8 text-zinc-600 italic text-xs flex flex-col items-center">
                                <Package className="w-8 h-8 opacity-20 mb-2" />
                                <span>No packages installed yet.</span>
                            </div>
                        ) : (
                            installedPkgs.map((pkg, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-[#252526] rounded group hover:bg-[#2d2d2d] transition-colors border border-transparent hover:border-[#444]">
                                    <span className="text-zinc-300 text-xs font-mono">{pkg}</span>
                                    <span className="text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Installed
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                 <div className="p-3 border-t border-[#333] bg-[#252526]/50">
                    <button 
                        onClick={handleReloadEnvironment}
                        className="w-full flex items-center justify-center gap-2 bg-red-900/10 hover:bg-red-900/20 text-red-400 border border-red-900/30 rounded py-2 text-xs transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                        Reset Environment
                    </button>
                    <p className="text-[10px] text-zinc-600 text-center mt-2">
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