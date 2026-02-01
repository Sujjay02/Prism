import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Sparkles, Volume2, X, Wand2 } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';

interface VoiceModeProps {
  onTranscript: (text: string) => void;
  onClose: () => void;
}

export const VoiceMode: React.FC<VoiceModeProps> = ({ onTranscript, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  const exampleCommands = [
    { category: '3D Graphics', command: 'Create a 3D solar system with orbiting planets and realistic lighting' },
    { category: 'Dashboard', command: 'Build an analytics dashboard with charts, KPIs, and dark mode' },
    { category: 'Python', command: 'Write a Monte Carlo simulation to estimate Pi with visualization' },
    { category: 'Game', command: 'Create a playable Tetris game with score tracking' },
    { category: 'Landing Page', command: 'Design a SaaS landing page with hero, features, and pricing' },
    { category: 'E-commerce', command: 'Build a product page with image gallery and add to cart' },
  ];

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio analysis for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Animate audio level
      const updateLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setError('Microphone access denied. Please allow microphone permissions.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const text = await transcribeAudio(base64Audio, 'audio/webm');
        setTranscript(text);
        setIsProcessing(false);
      };
    } catch (err: any) {
      setError('Failed to transcribe audio. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleGenerate = () => {
    if (transcript.trim()) {
      onTranscript(transcript);
    }
  };

  const handleExampleClick = (command: string) => {
    setTranscript(command);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Voice Mode</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Speak your ideas, get code instantly</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        {/* Main Recording Interface */}
        <div className="flex flex-col items-center space-y-8 max-w-2xl w-full">
          {/* Recording Button */}
          <div className="relative">
            {/* Pulse rings when recording */}
            {isRecording && (
              <>
                <div
                  className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"
                  style={{ transform: `scale(${1 + audioLevel * 0.5})` }}
                />
                <div
                  className="absolute inset-0 rounded-full bg-purple-500/10"
                  style={{ transform: `scale(${1.2 + audioLevel * 0.8})`, transition: 'transform 0.1s' }}
                />
              </>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 scale-110'
                  : isProcessing
                  ? 'bg-gradient-to-br from-purple-400 to-pink-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:scale-105'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </button>
          </div>

          {/* Status Text */}
          <div className="text-center">
            {isRecording ? (
              <div className="flex items-center gap-2 text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="font-medium">Recording... Click to stop</span>
              </div>
            ) : isProcessing ? (
              <div className="flex items-center gap-2 text-purple-500">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Transcribing with Gemini 3...</span>
              </div>
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400">Click the microphone to start recording</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Transcript Box */}
          {transcript && (
            <div className="w-full space-y-4">
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-medium text-purple-500 uppercase tracking-wider">Transcript</span>
                </div>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full bg-transparent text-zinc-900 dark:text-white text-lg resize-none outline-none min-h-[100px]"
                  placeholder="Your transcribed text will appear here..."
                />
              </div>

              <button
                onClick={handleGenerate}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Generate Code
              </button>
            </div>
          )}

          {/* Example Commands */}
          {!transcript && !isRecording && !isProcessing && (
            <div className="w-full mt-8">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 text-center">
                Try saying something like...
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleCommands.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example.command)}
                    className="text-left p-4 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                  >
                    <span className="text-xs font-medium text-purple-500 uppercase tracking-wider">{example.category}</span>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1 group-hover:text-zinc-900 dark:group-hover:text-white">
                      "{example.command}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
