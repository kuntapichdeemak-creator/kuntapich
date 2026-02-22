import { useCallback, useRef, useEffect } from 'react';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction if needed, 
    // but here we just set it up. Browsers might block it until interaction.
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
    }
    
    // Do not close context on unmount as it might be shared or re-created unnecessarily
    // Just suspend if needed or let garbage collection handle it if we were creating new ones
    // But here we keep one ref.
    
    return () => {
        // Optional: close if you want to clean up completely
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };
  }, []);

  const getContext = useCallback(() => {
      if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
              audioContextRef.current = new AudioContextClass();
          }
      }
      return audioContextRef.current;
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
    const ctx = getContext();
    if (!ctx) return;
    
    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(e => console.error(e));
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [getContext]);

  const playClick = useCallback(() => {
    // High pitched short blip
    playTone(800, 'sine', 0.1, 0.05);
  }, [playTone]);

  const playHover = useCallback(() => {
    // Very subtle tick
    playTone(400, 'sine', 0.05, 0.01);
  }, [playTone]);

  const playActivate = useCallback(() => {
    // Rising tone for activation
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(e => console.error(e));

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
    
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }, [getContext]);

  return { playClick, playHover, playActivate };
};
