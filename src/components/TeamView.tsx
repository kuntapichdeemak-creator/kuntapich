import React from 'react';
import { motion } from 'motion/react';
import { Users, RefreshCcw } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

const TeamView = () => {
  const { playClick, playHover } = useSoundEffects();
  const team = [
    { name: "น.ส. กันตพิชญ์ ดีมาก", id: "66543303041-8" },
    { name: "นาย ศุจินธารา จันขัน", id: "66543303066-5" },
    { name: "นาย นาวี กิตติวงศ์ศากุล", id: "66543303058-2" },
    { name: "นาย ณัฐพัชร์ ทายะ", id: "66543303051-7" },
    { name: "นาย สุประวีณ์ พงษ์เดชากุล", id: "66543303012-9" }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center overflow-y-auto relative">
      <div className="max-w-4xl w-full">
        
        <div className="mb-16 bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-medium text-slate-800 mb-4">Conclusion (สรุป)</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            AGF คือวิธีปรับปรุงดินขั้นสูง เหมาะสำหรับงานที่มีความซับซ้อนสูง แก้ปัญหาความปลอดภัยที่วิธีทั่วไปทำไม่ได้
          </p>
        </div>

        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} 
          className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-8 text-slate-400 mx-auto"
        >
          <Users size={32} />
        </motion.div>
        
        <h2 className="text-3xl font-light text-slate-800 mb-12">Project Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {team.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center hover:border-cyan-200 transition-colors shadow-sm"
            >
              <span className="text-slate-700 font-medium">{member.name}</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{member.id}</span>
            </motion.div>
          ))}
        </div>

        <motion.button 
          onClick={() => { playClick(); window.location.reload(); }}
          onMouseEnter={playHover}
          className="mt-16 text-slate-400 hover:text-cyan-600 flex items-center gap-2 text-sm uppercase tracking-widest transition-colors mx-auto cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <RefreshCcw size={14} /> Replay Experience
        </motion.button>
      </div>
    </div>
  );
};

export default TeamView;
