import React, { KeyboardEvent, useRef, useState } from 'react';
import { Send, Sparkles, Paperclip, X, Image as ImageIcon, FileText, Mic, MicOff, Loader2 } from 'lucide-react';
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
      {/* Attached Files Preview */}
      {files.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 flex space-x-2 px-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative group/image">
              <div className="w-12 h-12 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center shadow-sm" title={file.fileName}>
                {file.mimeType.startsWith('image/') ? (
                   <img src={`data:${file.mimeType};base64,${file.data}`} alt="preview" className="w-full h-full object-cover" />
                ) : (
                   <FileText className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover/image:flex items-center justify-center">
                   <X 
                    className="w-4 h-4 text-white cursor-pointer" 
                    onClick={() => removeFile(idx)}
                   />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white dark:border-zinc-900"></div>
            </div>
          ))}
        </div>
      )}

      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
      <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden transition-colors duration-300">
        
        {/* Paperclip Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="pl-4 pr-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer"
          title="Attach Image or File"
          disabled={loading || isRecording}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,application/pdf,text/*" 
          multiple
          onChange={handleFileChange}
        />

        {/* Microphone Button */}
        <button 
          onClick={handleMicClick}
          disabled={loading || isTranscribing}
          className={`px-2 transition-colors cursor-pointer flex items-center justify-center ${
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
    </div>
  );
};