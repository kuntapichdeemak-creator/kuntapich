import React from 'react';
import { motion } from 'motion/react';
import { Snowflake, ArrowRight } from 'lucide-react';
import { BlueprintGrid } from './Shared';
import { useSoundEffects } from '../hooks/useSoundEffects';

const IntroView = ({ onNext }: { onNext: () => void }) => {
  const { playClick, playHover } = useSoundEffects();

  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden p-8">
      <BlueprintGrid />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <div className="w-24 h-24 mx-auto mb-8 bg-cyan-50 rounded-full flex items-center justify-center border border-cyan-200 shadow-lg shadow-cyan-100/50">
          <Snowflake className="w-12 h-12 text-cyan-500" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-thin text-slate-900 mb-6 tracking-tight">
          Artificial Ground Freezing (AGF)<br />
          <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 text-3xl md:text-5xl block mt-4">
            การปรับปรุงและเสริมกำลังดินด้วยการแช่แข็งเทียม
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed mb-12">
          "นวัตกรรมเปลี่ยนดินอ่อน ให้แกร่งดั่งคอนกรีต"
        </p>

        <motion.button
          onClick={() => { playClick(); onNext(); }}
          onMouseEnter={playHover}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium tracking-wide flex items-center gap-3 mx-auto shadow-xl hover:bg-cyan-600 transition-colors cursor-pointer"
        >
          Start Exploration <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default IntroView;
