import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info,
  Microscope,
  Layers,
  ShieldCheck,
  Users
} from 'lucide-react';

import IntroView from './components/IntroView';
import MicroView from './components/MicroView';
import MacroView from './components/MacroView';
import DataView from './components/DataView';
import TeamView from './components/TeamView';
import { useSoundEffects } from './hooks/useSoundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { playClick, playHover } = useSoundEffects();
  
  const tabs = [
    { id: 0, label: "Intro", icon: <Info size={18} />, component: IntroView },
    { id: 1, label: "Micro", icon: <Microscope size={18} />, component: MicroView },
    { id: 2, label: "Process", icon: <Layers size={18} />, component: MacroView },
    { id: 3, label: "Data", icon: <ShieldCheck size={18} />, component: DataView },
    { id: 4, label: "Team", icon: <Users size={18} />, component: TeamView },
  ];

  const ActiveComponent = tabs[activeTab].component;

  const handleTabChange = (id: number) => {
    if (activeTab !== id) {
      playClick();
      setActiveTab(id);
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-hidden relative">
      <audio ref={audioRef} loop>
        <source src="/audio/voiceover.m4a" type="audio/mp4" />
      </audio>

      {/* Start Overlay */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div 
            className="absolute inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="px-8 py-4 bg-cyan-500 text-white text-xl font-bold rounded-2xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
            >
              Start Experience
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-20 bg-white border-r border-slate-200 flex md:flex-col justify-between items-center py-4 md:py-8 px-4 z-50 shadow-sm shrink-0">
        <div className="hidden md:block w-10 h-10 bg-slate-900 rounded-lg mb-8" />
        
        <div className="flex md:flex-col gap-4 md:gap-8 w-full justify-center md:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              onMouseEnter={playHover}
              className={`p-3 rounded-xl transition-all relative group cursor-pointer ${activeTab === tab.id ? 'bg-cyan-50 text-cyan-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            >
              {tab.icon}
              {/* Tooltip */}
              <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block z-50">
                {tab.label}
              </span>
              {/* Mobile Indicator */}
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="absolute inset-0 border-2 border-cyan-200 rounded-xl" />
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:block text-xs font-mono text-slate-300 -rotate-90 whitespace-nowrap mt-auto">
          AGF EDUCATIONAL
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ActiveComponent onNext={() => handleTabChange(Math.min(tabs.length - 1, activeTab + 1))} />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
