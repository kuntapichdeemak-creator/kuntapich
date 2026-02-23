import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, X, Music, RotateCcw, Rewind, FastForward, Link as LinkIcon, AlertCircle, Mic, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NarrationPlayer = () => {
  const [mode, setMode] = useState<'audio' | 'tts'>('audio'); // 'audio' or 'tts'
  
  // Audio Player State
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [inputType, setInputType] = useState<'file' | 'url' | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // TTS State
  const [ttsText, setTtsText] = useState("");
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [ttsPaused, setTtsPaused] = useState(false);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to transform cloud storage links
  const transformLink = (url: string) => {
    // Google Drive
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    
    // Dropbox
    if (url.includes('dropbox.com')) {
      return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    }

    return url;
  };

  // Initialize
  useEffect(() => {
    synth.current = window.speechSynthesis;
    
    const params = new URLSearchParams(window.location.search);
    const audioParam = params.get('audio');
    const ttsParam = params.get('tts');
    
    if (ttsParam) {
      setMode('tts');
      setTtsText(decodeURIComponent(ttsParam));
      // Don't auto-play TTS to respect browser policies, user must click play
    } else if (audioParam) {
      setMode('audio');
      const directUrl = transformLink(audioParam);
      setAudioSrc(directUrl);
      setFileName("Shared Audio");
      setInputType('url');
      setError(null);
    } else {
      // Check local storage
      const savedUrl = localStorage.getItem('narration_url');
      const savedName = localStorage.getItem('narration_name');
      if (savedUrl && savedName) {
        setMode('audio');
        setAudioSrc(savedUrl);
        setFileName(savedName);
        setInputType('url');
      }
    }

    // Cleanup TTS on unmount
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  const updateUrlParam = (key: 'audio' | 'tts', value: string | null) => {
    const newUrl = new URL(window.location.href);
    // Clear both first to ensure exclusivity in URL
    newUrl.searchParams.delete('audio');
    newUrl.searchParams.delete('tts');
    
    if (value) {
      newUrl.searchParams.set(key, value);
    }
    window.history.replaceState({}, '', newUrl.toString());
  };

  // --- Audio Handlers ---

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setFileName(file.name);
      setIsPlaying(true);
      setInputType('file');
      setError(null);
      setMode('audio');
      
      localStorage.removeItem('narration_url');
      localStorage.removeItem('narration_name');
      updateUrlParam('audio', null); // Clear URL since it's local
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      const directUrl = transformLink(urlInput.trim());
      setAudioSrc(directUrl);
      setFileName("External Audio");
      setIsPlaying(true);
      setInputType('url');
      setError(null);
      setMode('audio');
      
      localStorage.setItem('narration_url', directUrl);
      localStorage.setItem('narration_name', "External Audio");
      updateUrlParam('audio', directUrl);
      setUrlInput("");
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    setIsPlaying(false);
    const code = e.currentTarget.error?.code;
    let message = "Failed to load audio.";
    
    if (code === 1) message = "Audio loading aborted.";
    else if (code === 2) message = "Network error. Please check your connection.";
    else if (code === 3) message = "Audio decoding failed. The format may be unsupported.";
    else if (code === 4) message = "Audio source not supported or file not found (404).";
    
    setError(`${message} Try using Text-to-Speech instead.`);
  };

  const toggleAudioPlay = () => {
    if (audioRef.current && !error) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
            console.error("Play failed", e);
            setIsPlaying(false);
            if (e.name === 'NotAllowedError') {
                setError("Auto-play blocked. Please click play.");
            }
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime += seconds;
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // --- TTS Handlers ---

  const handleTtsPlay = () => {
    if (!synth.current) return;

    if (isTtsPlaying && !ttsPaused) {
      synth.current.pause();
      setTtsPaused(true);
      setIsTtsPlaying(false);
    } else if (ttsPaused) {
      synth.current.resume();
      setTtsPaused(false);
      setIsTtsPlaying(true);
    } else {
      // Start new
      if (utterance.current) {
        synth.current.cancel();
      }
      const newUtterance = new SpeechSynthesisUtterance(ttsText);
      newUtterance.onend = () => {
        setIsTtsPlaying(false);
        setTtsPaused(false);
      };
      newUtterance.onerror = (e) => {
        console.error("TTS Error", e);
        setIsTtsPlaying(false);
        setTtsPaused(false);
      };
      
      // Try to select a good voice (English or Thai based on content?)
      // For now default is usually fine, or we could add a selector later.
      
      utterance.current = newUtterance;
      synth.current.speak(newUtterance);
      setIsTtsPlaying(true);
      setTtsPaused(false);
    }
  };

  const handleTtsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTtsText(e.target.value);
  };

  const saveTts = () => {
    if (ttsText.trim()) {
       updateUrlParam('tts', encodeURIComponent(ttsText));
       setMode('tts');
       // Clear audio params
       localStorage.removeItem('narration_url');
       localStorage.removeItem('narration_name');
    }
  };

  // --- Render ---

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
      />
      <audio
        ref={audioRef}
        src={audioSrc || undefined}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
      />

      <AnimatePresence mode="wait">
        {(!audioSrc && mode === 'audio') || (mode === 'tts' && !ttsText && !inputType) ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-end gap-2"
          >
             {/* Mode Selector */}
             <div className="flex gap-2 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-sm border border-slate-200 mb-1">
                <button 
                  onClick={() => setMode('audio')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${mode === 'audio' ? 'bg-cyan-100 text-cyan-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Audio Link
                </button>
                <button 
                  onClick={() => setMode('tts')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${mode === 'tts' ? 'bg-cyan-100 text-cyan-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Text to Speech
                </button>
             </div>

            {mode === 'audio' ? (
                inputType === 'url_input' ? (
                <form onSubmit={handleUrlSubmit} className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg border border-slate-200">
                    <input 
                        type="url" 
                        placeholder="Paste audio URL..." 
                        className="pl-4 pr-2 py-1 bg-transparent border-none outline-none text-sm w-48 text-slate-700 placeholder:text-slate-400"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors">
                    <Play size={14} fill="currentColor" />
                    </button>
                    <button type="button" onClick={() => setInputType(null)} className="p-2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                    </button>
                </form>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setInputType('url_input')}
                            className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-all cursor-pointer"
                            title="Add from URL (Persistent)"
                        >
                            <LinkIcon size={16} />
                            <span className="font-medium text-sm">URL</span>
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-all group cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-cyan-50 transition-colors">
                            <Upload size={16} />
                            </div>
                            <span className="font-medium text-sm pr-2">Add File</span>
                        </button>
                    </div>
                )
            ) : (
                // TTS Input Mode
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 w-[280px]">
                    <textarea 
                        className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-700 resize-none focus:outline-none focus:border-cyan-300 mb-2"
                        placeholder="Type text to narrate..."
                        value={ttsText}
                        onChange={handleTtsChange}
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400">Saved in URL when set</span>
                        <button 
                            onClick={saveTts}
                            disabled={!ttsText.trim()}
                            className="px-3 py-1.5 bg-cyan-500 text-white text-xs font-medium rounded-full hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Set Narration
                        </button>
                    </div>
                </div>
            )}
            
            {mode === 'audio' && (
                <div className="bg-slate-800/80 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
                    Tip: Use Dropbox/Drive links or TTS for sharing
                </div>
            )}
          </motion.div>
        ) : (
          // Player View (Audio or TTS)
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="flex flex-col p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 min-w-[300px]"
          >
            {error && (
                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100 mb-2">
                    {error}
                </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'tts' ? 'bg-purple-100 text-purple-600' : (inputType === 'file' ? 'bg-amber-100 text-amber-600' : 'bg-cyan-100 text-cyan-600')}`}>
                  {mode === 'tts' ? <Type size={16} /> : (inputType === 'file' ? <Upload size={16} /> : <LinkIcon size={16} />)}
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                     {mode === 'tts' ? 'Text to Speech' : 'Narration'} 
                     {inputType === 'file' && mode === 'audio' && <span className="text-amber-500 flex items-center gap-0.5 ml-1" title="Local file only"><AlertCircle size={8} /> Local</span>}
                   </span>
                   <span className="text-xs font-medium text-slate-700 truncate max-w-[180px]">
                     {mode === 'tts' ? (ttsText.slice(0, 25) + (ttsText.length > 25 ? '...' : '')) : fileName}
                   </span>
                </div>
              </div>
              <button 
                onClick={() => {
                    if (mode === 'audio') {
                        setAudioSrc(null);
                        setIsPlaying(false);
                        setFileName("");
                        setInputType(null);
                        localStorage.removeItem('narration_url');
                        localStorage.removeItem('narration_name');
                        updateUrlParam('audio', null);
                    } else {
                        if (synth.current) synth.current.cancel();
                        setTtsText("");
                        setIsTtsPlaying(false);
                        updateUrlParam('tts', null);
                    }
                    setError(null);
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {mode === 'audio' ? (
                <>
                    <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        disabled={!!error}
                        className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer ${inputType === 'file' ? 'bg-slate-200 accent-amber-500' : 'bg-slate-200 accent-cyan-500'} ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <span className="text-[10px] font-mono text-slate-400 w-8">{formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                    <button onClick={restart} disabled={!!error} className={`p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ${error ? 'opacity-50 cursor-not-allowed' : ''}`} title="Restart">
                        <RotateCcw size={16} />
                    </button>
                    
                    <button onClick={() => skip(-10)} disabled={!!error} className={`p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ${error ? 'opacity-50 cursor-not-allowed' : ''}`} title="-10s">
                        <Rewind size={20} />
                    </button>

                    <button
                        onClick={toggleAudioPlay}
                        disabled={!!error}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm cursor-pointer ${
                        isPlaying 
                            ? (inputType === 'file' ? 'bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600' : 'bg-cyan-500 text-white shadow-cyan-200 hover:bg-cyan-600')
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } ${error ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 shadow-none' : ''}`}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>

                    <button onClick={() => skip(10)} disabled={!!error} className={`p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ${error ? 'opacity-50 cursor-not-allowed' : ''}`} title="+10s">
                        <FastForward size={20} />
                    </button>
                    
                    <div className="w-8" /> {/* Spacer */}
                    </div>
                </>
            ) : (
                // TTS Controls
                <div className="flex flex-col gap-3">
                    <div className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 max-h-[60px] overflow-y-auto">
                        "{ttsText}"
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button 
                            onClick={() => {
                                if (synth.current) synth.current.cancel();
                                setIsTtsPlaying(false);
                                setTtsPaused(false);
                            }} 
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" 
                            title="Stop"
                        >
                            <RotateCcw size={16} />
                        </button>

                        <button
                            onClick={handleTtsPlay}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm cursor-pointer ${
                            isTtsPlaying 
                                ? 'bg-purple-500 text-white shadow-purple-200 hover:bg-purple-600' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {isTtsPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                        </button>
                        
                        <div className="w-8" /> {/* Spacer */}
                    </div>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
