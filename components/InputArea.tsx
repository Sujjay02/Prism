import React, { KeyboardEvent, useRef, useState } from 'react';
import { Send, X, FileText, Mic, Loader2, Github, Figma, Upload, Link } from 'lucide-react';
import { InputAreaProps } from '../types';
import { transcribeAudio } from '../services/geminiService';

export const InputArea: React.FC<InputAreaProps> = ({ 
  prompt, 
  setPrompt, 
  files,
  setFiles,
  onGenerate, 
  loading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState<'github' | 'figma' | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && !isRecording && !isTranscribing) {
      onGenerate();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...files];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        // Allow basic images, PDFs, and text files
        if (!file.type.match('image.*|application/pdf|text.*')) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64String = event.target.result.toString();
            // Remove data URL prefix (e.g. "data:image/png;base64,")
            const base64Data = base64String.split(',')[1];
            
            setFiles([...newFiles, {
              data: base64Data,
              mimeType: file.type,
              fileName: file.name
            }]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleGitHubImport = async () => {
    if (!urlInput.trim()) return;

    setIsLoadingUrl(true);
    try {
      // Parse GitHub URL to get raw content
      // Supports: github.com/user/repo/blob/branch/path
      let rawUrl = urlInput.trim();

      if (rawUrl.includes('github.com') && rawUrl.includes('/blob/')) {
        // Convert to raw URL
        rawUrl = rawUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      } else if (rawUrl.includes('gist.github.com')) {
        // Handle gist URLs
        rawUrl = rawUrl.replace('gist.github.com', 'gist.githubusercontent.com') + '/raw';
      }

      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('Failed to fetch file');

      const content = await response.text();
      const fileName = rawUrl.split('/').pop() || 'github-file.txt';

      // Add as text file
      const base64Data = btoa(unescape(encodeURIComponent(content)));
      setFiles(prev => [...prev, {
        data: base64Data,
        mimeType: 'text/plain',
        fileName: `github:${fileName}`
      }]);

      // Also add context to prompt
      setPrompt(prev => prev + (prev ? '\n\n' : '') + `[Imported from GitHub: ${fileName}]`);

      setShowUrlModal(null);
      setUrlInput('');
    } catch (err) {
      alert('Failed to import from GitHub. Please check the URL and try again.');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleFigmaImport = async () => {
    if (!urlInput.trim()) return;

    setIsLoadingUrl(true);
    try {
      // For Figma, we'll add the URL as context since we can't directly fetch designs
      // The user would need a Figma API token for full integration
      const figmaUrl = urlInput.trim();

      // Extract file key from Figma URL
      const fileKeyMatch = figmaUrl.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
      const fileKey = fileKeyMatch ? fileKeyMatch[1] : null;

      if (!fileKey) {
        throw new Error('Invalid Figma URL');
      }

      // Add Figma reference to prompt
      setPrompt(prev => {
        const figmaContext = `[Figma Design Reference: ${figmaUrl}]\nPlease recreate this Figma design. Focus on matching the layout, colors, typography, and spacing as closely as possible.`;
        return prev + (prev ? '\n\n' : '') + figmaContext;
      });

      setShowUrlModal(null);
      setUrlInput('');
    } catch (err) {
      alert('Failed to import from Figma. Please check the URL format.');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
           const base64Result = reader.result?.toString();
           if (base64Result) {
             const base64Data = base64Result.split(',')[1];
             setIsTranscribing(true);
             try {
               const text = await transcribeAudio(base64Data, blob.type || 'audio/webm');
               setPrompt((prev) => prev + (prev ? ' ' : '') + text);
             } catch (e) {
               console.error("Transcription failed", e);
             } finally {
               setIsTranscribing(false);
             }
           }
        };

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="relative group">
      {/* Upload Toolbar - visible above the input */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading || isRecording}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Upload from Device"
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>

        <button
          onClick={() => setShowUrlModal('github')}
          disabled={loading || isRecording}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Import from GitHub"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </button>

        <button
          onClick={() => setShowUrlModal('figma')}
          disabled={loading || isRecording}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Import from Figma"
        >
          <Figma className="w-4 h-4" />
          <span>Figma</span>
        </button>

        {/* Attached Files Preview */}
        {files.length > 0 && (
          <div className="flex items-center gap-2 ml-2">
            {files.map((file, idx) => (
              <div key={idx} className="relative group/image">
                <div className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center shadow-sm" title={file.fileName}>
                  {file.mimeType.startsWith('image/') ? (
                     <img src={`data:${file.mimeType};base64,${file.data}`} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                     <FileText className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover/image:flex items-center justify-center">
                     <X
                      className="w-4 h-4 text-white cursor-pointer"
                      onClick={() => removeFile(idx)}
                     />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white dark:border-zinc-900"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,application/pdf,text/*"
        multiple
        onChange={handleFileChange}
      />

      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur" style={{ top: 'auto', height: 'calc(100% - 52px)' }}></div>
      <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden transition-colors duration-300">

        {/* Microphone Button */}
        <button
          onClick={handleMicClick}
          disabled={loading || isTranscribing}
          className={`pl-4 pr-2 transition-colors cursor-pointer flex items-center justify-center ${
            isRecording
              ? 'text-red-500 hover:text-red-600 animate-pulse'
              : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
          }`}
          title={isRecording ? "Stop Recording" : "Record Audio"}
        >
          {isTranscribing ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : isRecording ? (
            <div className="relative">
                 <Mic className="w-5 h-5" />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isRecording ? "Listening..." :
            isTranscribing ? "Transcribing..." :
            files.length > 0 ? "Describe what to do with these files..." : "Describe the UI you want to build..."
          }
          className="flex-1 bg-transparent border-none outline-none px-2 py-4 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          disabled={loading || isRecording || isTranscribing}
          autoFocus
        />
        <button
          onClick={onGenerate}
          disabled={loading || isRecording || isTranscribing || (!prompt.trim() && files.length === 0)}
          className={`px-6 py-4 transition-colors font-medium flex items-center space-x-2 border-l border-zinc-100 dark:border-zinc-800 ${
            loading || isRecording || isTranscribing || (!prompt.trim() && files.length === 0)
              ? 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white cursor-pointer'
          }`}
        >
          {loading ? (
             <span className="text-sm">Forging...</span>
          ) : (
            <>
              <span className="text-sm">Generate</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* URL Import Modal */}
      {showUrlModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowUrlModal(null);
            setUrlInput('');
          }}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
              {showUrlModal === 'github' ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center">
                    <Github className="w-5 h-5 text-white dark:text-zinc-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Import from GitHub</h3>
                    <p className="text-sm text-zinc-500">Paste a file URL or Gist link</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center">
                    <Figma className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Import from Figma</h3>
                    <p className="text-sm text-zinc-500">Paste a Figma design URL</p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={
                    showUrlModal === 'github'
                      ? 'https://github.com/user/repo/blob/main/file.tsx'
                      : 'https://figma.com/design/abc123/...'
                  }
                  className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && urlInput.trim()) {
                      showUrlModal === 'github' ? handleGitHubImport() : handleFigmaImport();
                    }
                  }}
                />
              </div>

              {showUrlModal === 'github' && (
                <p className="mt-3 text-xs text-zinc-500">
                  Supports GitHub file URLs, raw URLs, and Gists. The file content will be added as context for code generation.
                </p>
              )}
              {showUrlModal === 'figma' && (
                <p className="mt-3 text-xs text-zinc-500">
                  Paste a Figma design URL. Prism will use it as a reference to recreate the design in code.
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <button
                onClick={() => {
                  setShowUrlModal(null);
                  setUrlInput('');
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showUrlModal === 'github' ? handleGitHubImport : handleFigmaImport}
                disabled={!urlInput.trim() || isLoadingUrl}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoadingUrl ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};