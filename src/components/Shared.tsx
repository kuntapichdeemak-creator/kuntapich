import React from 'react';
import { motion } from 'motion/react';

export const BlueprintGrid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-10" 
    style={{ 
      backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', 
      backgroundSize: '40px 40px' 
    }} 
  />
);

export const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-8 text-center md:text-left">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl md:text-5xl font-light text-slate-800 mb-2"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-cyan-600 font-mono text-sm tracking-widest uppercase"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);
