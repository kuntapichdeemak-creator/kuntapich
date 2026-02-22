import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThermometerSnowflake } from 'lucide-react';
import { SectionTitle } from './Shared';
import { useSoundEffects } from '../hooks/useSoundEffects';

const MicroView = () => {
  const [frozen, setFrozen] = useState(false);
  const { playClick, playHover, playActivate } = useSoundEffects();

  const toggleFreeze = () => {
    playActivate();
    setFrozen(!frozen);
  };

  return (
    <div className="h-full flex flex-col md:flex-row p-8 gap-12 items-center justify-center relative overflow-y-auto">
      <div className="flex-1 max-w-md z-10">
        <SectionTitle subtitle="The Principle (หลักการทำงาน)">
          What is AGF?
        </SectionTitle>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          คือวิธีการปรับปรุงและเสริมกำลังดินแบบชั่วคราว โดยลดอุณหภูมิของดินและน้ำใต้ดินให้แข็งตัว
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Key Concept 1: Structural Bond
            </h4>
            <ul className="text-sm text-slate-500 list-disc list-inside pl-2 space-y-1">
              <li>อนุภาคดินถูกยึดเข้าด้วยกันอย่างแน่นหนา</li>
              <li>กำลังรับแรงเฉือนของดินเพิ่มขึ้นหลายเท่า</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Key Concept 2: Waterproofing
            </h4>
            <ul className="text-sm text-slate-500 list-disc list-inside pl-2 space-y-1">
              <li>ค่าการซึมผ่านของน้ำลดลงจนเกือบเป็นศูนย์</li>
              <li>พื้นที่ก่อสร้างมีเสถียรภาพสูง</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={toggleFreeze}
            onMouseEnter={playHover}
            className={`flex-1 px-6 py-3 rounded-lg flex items-center gap-2 transition-all justify-center font-medium cursor-pointer ${frozen ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            <ThermometerSnowflake size={20} />
            {frozen ? "Thaw System (ละลาย)" : "Activate Freezing (แช่แข็ง)"}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md aspect-square bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-50/50" />
        <div className="absolute top-4 right-4 z-10 font-mono text-xs text-slate-400">
          TEMP: <span className={`font-bold ${frozen ? 'text-cyan-600' : 'text-orange-500'}`}>{frozen ? '-30°C' : '25°C'}</span>
        </div>

        {/* Soil Particles (Static/Large) */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={`soil-${i}`}
            className="absolute rounded-full bg-amber-800/80 border border-amber-900/20"
            style={{
              width: Math.random() * 40 + 40,
              height: Math.random() * 40 + 40,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              zIndex: 1
            }}
          />
        ))}

        {/* Water Molecules (Dynamic) */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`water-${i}`}
            className={`absolute w-3 h-3 rounded-full z-0 ${frozen ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'bg-blue-400/60'}`}
            initial={{ 
              x: Math.random() * 300, 
              y: Math.random() * 300 
            }}
            animate={frozen ? {
              x: Math.random() * 300, // Slight vibration
              y: Math.random() * 300,
              scale: 1.2, // Ice expands
              transition: { duration: 0.5 }
            } : {
              x: [null, Math.random() * 400 - 50],
              y: [null, Math.random() * 400 - 50],
              scale: 1,
              transition: { duration: Math.random() * 5 + 5, repeat: Infinity, repeatType: "reverse", ease: "linear" }
            }}
          />
        ))}
        
        {/* Ice Lattice Overlay */}
        <AnimatePresence>
          {frozen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <svg className="w-full h-full opacity-30">
                <pattern id="ice-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40 L40 0" stroke="#06b6d4" strokeWidth="1" />
                  <path d="M0 0 L40 40" stroke="#06b6d4" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#ice-grid)" />
              </svg>
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MicroView;
