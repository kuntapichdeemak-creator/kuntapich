import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThermometerSnowflake, ShieldCheck } from 'lucide-react';
import { SectionTitle } from './Shared';
import { useSoundEffects } from '../hooks/useSoundEffects';

const MacroView = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const { playClick, playHover } = useSoundEffects();

  const handleStepChange = (newStep: number) => {
    if (newStep !== step) {
      playClick();
      setStep(newStep);
    }
  };

  const steps = [
    { 
      id: 1, 
      title: "Design", 
      desc: "วิเคราะห์ชั้นดิน & ออกแบบตำแหน่งท่อ",
      details: [
        "วิเคราะห์ชั้นดินและระดับน้ำใต้ดิน",
        "คำนวณอุณหภูมิและระยะเวลาที่เหมาะสม"
      ]
    },
    { 
      id: 2, 
      title: "Install", 
      desc: "เจาะและติดตั้งท่อความเย็น (Freeze Pipes)",
      details: [
        "เจาะหลุมรอบพื้นที่ก่อสร้าง",
        "ติดตั้งท่อแช่แข็ง (Freeze Pipes) แบบท่อเดี่ยวหรือท่อคู่"
      ]
    },
    { 
      id: 3, 
      title: "Freeze", 
      desc: "เดินเครื่องทำความเย็นสร้างกำแพงน้ำแข็ง",
      details: [
        "Brine (น้ำเกลือ): -20 ถึง -30°C",
        "Liquid Nitrogen: -196°C",
        "ผลลัพธ์: เกิดเป็น 'กำแพงดินแช่แข็ง' (Frozen Soil Wall)"
      ]
    },
    { 
      id: 4, 
      title: "Excavate", 
      desc: "ขุดเจาะพื้นที่ก่อสร้างอย่างปลอดภัย",
      details: [
        "ดำเนินงานขุดเจาะได้อย่างปลอดภัย",
        "ดินไม่พังและน้ำใต้ดินไม่ไหลเข้า"
      ]
    },
    { 
      id: 5, 
      title: "Thaw", 
      desc: "หยุดระบบและคืนสภาพดินสู่ธรรมชาติ",
      details: [
        "ปิดระบบทำความเย็น",
        "ดินละลายและกลับสู่สภาพเดิมตามธรรมชาติ"
      ]
    },
  ];

  return (
    <div className="h-full flex flex-col p-4 md:p-8 relative overflow-y-auto">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <SectionTitle subtitle={`Step 0${step} of 05`}>
          Construction Process
        </SectionTitle>
        
        <div className="flex gap-2">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStepChange(s.id)}
              onMouseEnter={playHover}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${step === s.id ? 'bg-cyan-600 scale-125' : 'bg-slate-200 hover:bg-slate-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-[500px]">
        {/* Simulation Window */}
        <div className="flex-1 bg-slate-900 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800 min-h-[400px]">
          {/* Ground Layers */}
          <div className="absolute inset-0 flex flex-col">
            <div className="h-1/4 bg-slate-800/50 border-b border-slate-700/50" /> {/* Surface */}
            <div className="h-3/4 bg-[#3f3f46] relative"> {/* Soil */}
              {/* Soil Texture */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
            </div>
          </div>

          {/* Step 1: Design - Blueprint Overlay */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <div className="w-3/4 h-3/4 border-2 border-dashed border-cyan-400/50 rounded-lg flex items-center justify-center">
                  <div className="text-cyan-400 font-mono text-xs tracking-widest bg-slate-900 px-2">TARGET ZONE</div>
                </div>
                {/* Pipe Markers */}
                <div className="absolute top-1/4 flex gap-8">
                  {[...Array(6)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="w-2 h-2 bg-cyan-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Install - Pipes */}
          <div className="absolute inset-0 flex justify-center items-start pt-[15%] z-10 gap-8 px-12 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`pipe-${i}`}
                className="w-2 bg-slate-300 rounded-b-full relative"
                initial={{ height: 0 }}
                animate={{ height: step >= 2 ? '70%' : 0 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                {/* Cold Flow Indicator inside pipe */}
                {step >= 3 && (
                  <motion.div 
                    className="absolute inset-0 bg-cyan-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step === 5 ? 0 : 1 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Step 3: Freeze - Ice Wall Growth */}
          <AnimatePresence>
            {step >= 3 && step < 5 && (
              <div className="absolute inset-0 flex justify-center items-start pt-[15%] z-0 gap-8 px-12 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`ice-${i}`}
                    className="w-2 bg-cyan-400/30 blur-xl rounded-full absolute top-0"
                    initial={{ height: '70%', width: '20px', opacity: 0 }}
                    animate={{ 
                      width: step >= 3 ? '120px' : '20px', 
                      opacity: 1,
                      backgroundColor: step === 3 ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.6)'
                    }}
                    transition={{ duration: 2 }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Step 4: Excavate - Removing Soil */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div 
                className="absolute left-1/2 top-[55%] -translate-x-1/2 w-48 h-32 bg-slate-900 rounded-full z-10 border-4 border-slate-700/50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "circOut" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-slate-600 font-mono text-xs">TUNNEL VOID</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 5: Thaw - Water dripping/Restoration */}
          {step === 5 && (
            <motion.div 
              className="absolute inset-0 z-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-4 bg-cyan-500/50"
                  initial={{ y: -20, x: Math.random() * 100 + '%' }}
                  animate={{ y: 500 }}
                  transition={{ duration: 2, delay: Math.random() * 2, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Controls & Info */}
        <div className="w-full lg:w-80 flex flex-col justify-center shrink-0">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-6xl font-thin text-slate-200">0{step}</div>
            </div>
            
            <h3 className="text-2xl font-medium text-slate-800 mb-2">{steps[step-1].title}</h3>
            <p className="text-slate-500 mb-6 font-normal">{steps[step-1].desc}</p>
            
            <ul className="space-y-2 mb-6">
              {steps[step-1].details?.map((detail, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0"/>
                  {detail}
                </li>
              ))}
            </ul>
            
            <div className="space-y-3">
              {step === 3 && (
                <div className="bg-cyan-50 p-3 rounded-lg text-sm text-cyan-800 flex items-center gap-2">
                  <ThermometerSnowflake size={16}/> 
                  <span>Target: <strong>-30°C</strong> (Brine)</span>
                </div>
              )}
              {step === 4 && (
                <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 flex items-center gap-2">
                  <ShieldCheck size={16}/> 
                  <span>Structural Integrity: <strong>100%</strong></span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => handleStepChange(Math.max(1, step - 1))}
              onMouseEnter={playHover}
              disabled={step === 1}
              className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button 
              onClick={() => handleStepChange(Math.min(totalSteps, step + 1))}
              onMouseEnter={playHover}
              disabled={step === totalSteps}
              className="flex-1 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroView;
