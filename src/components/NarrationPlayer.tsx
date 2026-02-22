import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, X, Music, RotateCcw, Rewind, FastForward, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NarrationPlayer = () => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [inputType, setInputType] = useState<'file' | 'url' | null>(null);
  const [urlInput, setUrlInput] = useState("");
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved URL from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('narration_url');
    const savedName = localStorage.getItem('narration_name');
    if (savedUrl && savedName) {
      setAudioSrc(savedUrl);
      setFileName(savedName);
      setInputType('url');
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setFileName(file.name);
      setIsPlaying(true);
      setInputType('file');
      // Clear saved URL if switching to file
      localStorage.removeItem('narration_url');
      localStorage.removeItem('narration_name');
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setAudioSrc(urlInput);
      setFileName("External Audio");
      setIsPlaying(true);
      setInputType('url');
      // Save to localStorage
      localStorage.setItem('narration_url', urlInput);
      localStorage.setItem('narration_name', "External Audio");
      setUrlInput("");
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
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

  useEffect(() => {
    if (audioSrc && audioRef.current && isPlaying) {
        audioRef.current.play().catch(e => {
            console.log("Autoplay prevented", e);
            setIsPlaying(false);
        });
    }
  }, [audioSrc]);

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
      />

      <AnimatePresence mode="wait">
        {!audioSrc ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-end gap-2"
          >
            {inputType === 'url_input' ? (
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
            )}
            <div className="bg-slate-800/80 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
                Tip: Use URL for Vercel deployment
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="flex flex-col p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 min-w-[300px]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${inputType === 'file' ? 'bg-amber-100 text-amber-600' : 'bg-cyan-100 text-cyan-600'}`}>
                  {inputType === 'file' ? <Upload size={16} /> : <LinkIcon size={16} />}
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                     Narration {inputType === 'file' && <span className="text-amber-500 flex items-center gap-0.5 ml-1" title="Local file only (won't work on other devices)"><AlertCircle size={8} /> Local</span>}
                   </span>
                   <span className="text-xs font-medium text-slate-700 truncate max-w-[180px]">
                     {fileName}
                   </span>
                </div>
              </div>
              <button 
                onClick={() => {
                    setAudioSrc(null);
                    setIsPlaying(false);
                    setFileName("");
                    setInputType(null);
                    localStorage.removeItem('narration_url');
                    localStorage.removeItem('narration_name');
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer ${inputType === 'file' ? 'bg-slate-200 accent-amber-500' : 'bg-slate-200 accent-cyan-500'}`}
              />
              <span className="text-[10px] font-mono text-slate-400 w-8">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-4">
               <button onClick={restart} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="Restart">
                 <RotateCcw size={16} />
               </button>
               
               <button onClick={() => skip(-10)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="-10s">
                 <Rewind size={20} />
               </button>

               <button
                onClick={togglePlay}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm cursor-pointer ${
                  isPlaying 
                    ? (inputType === 'file' ? 'bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600' : 'bg-cyan-500 text-white shadow-cyan-200 hover:bg-cyan-600')
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>

              <button onClick={() => skip(10)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer" title="+10s">
                 <FastForward size={20} />
               </button>
               
               <div className="w-8" /> {/* Spacer for symmetry with restart button */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
