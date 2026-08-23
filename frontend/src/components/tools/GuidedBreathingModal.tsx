import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, Volume2, VolumeX, Music } from 'lucide-react';

interface GuidedBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedBreathingModal: React.FC<GuidedBreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  // ── AMBIENT 432Hz RELAXATION SYNTHESIZER ──────────────────────────────────
  const startAmbientMusic = () => {
    try {
      if (audioCtxRef.current) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
      gainNodeRef.current = masterGain;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      const freqs = [108.0, 162.0, 216.0, 270.0];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1.5) * 3, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.25 / freqs.length, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
    } catch (e) {
      console.warn("Web Audio API Ambient Synth Error:", e);
    }
  };

  const stopAmbientMusic = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        oscillatorsRef.current = [];
        try { ctx.close(); } catch {}
        audioCtxRef.current = null;
      }, 1300);
    }
  };

  const toggleMute = () => {
    if (!audioCtxRef.current) {
      startAmbientMusic();
      setIsMuted(false);
      return;
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      if (isMuted) {
        gainNodeRef.current.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1);
        setIsMuted(false);
      } else {
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        setIsMuted(true);
      }
    }
  };

  // ── BREATHING CYCLE TIMER ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setPhase('inhale');
      setSecondsLeft(4);
      setCyclesCompleted(0);
      setSessionTime(0);
      stopAmbientMusic();
      return;
    }

    if (!isMuted) {
      startAmbientMusic();
    }

    const timer = setInterval(() => {
      setSessionTime((t) => t + 1);
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (phase === 'inhale') {
          setPhase('hold');
          return phaseDurations.hold;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return phaseDurations.exhale;
        } else {
          setPhase('inhale');
          setCyclesCompleted((c) => c + 1);
          return phaseDurations.inhale;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, phase]);

  const handleClose = () => {
    stopAmbientMusic();
    onClose();
  };

  if (!isOpen) return null;

  const currentDuration = phaseDurations[phase];
  const progressPercent = ((currentDuration - secondsLeft + 1) / currentDuration) * 100;

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const phaseConfig = {
    inhale: {
      title: 'Breathe In Deeply',
      sub: 'Draw warm, restoring energy into your mind and body',
      color: 'from-amber-300 via-amber-400 to-orange-400',
      glowColor: 'rgba(245, 158, 11, 0.30)',
      ringColor: '#F59E0B',
      scale: 1.4,
    },
    hold: {
      title: 'Hold & Rest Within',
      sub: 'Pause and feel calm, serene stillness settle inside',
      color: 'from-teal-300 via-emerald-400 to-cyan-400',
      glowColor: 'rgba(20, 184, 166, 0.30)',
      ringColor: '#14B8A6',
      scale: 1.4,
    },
    exhale: {
      title: 'Exhale & Let Go',
      sub: 'Softly release all worry, stress, and bodily tension',
      color: 'from-indigo-300 via-purple-400 to-pink-400',
      glowColor: 'rgba(168, 85, 247, 0.30)',
      ringColor: '#A855F7',
      scale: 0.95,
    },
  };

  const current = phaseConfig[phase];

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col justify-between p-6 sm:p-10 bg-[#060913] text-white overflow-hidden select-none"
      >
        {/* ── BACKGROUND GLOW AURORA ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[130px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[130px]"
          />
        </div>

        {/* ── TOP HEADER BAR ── */}
        <header className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium backdrop-blur-xl shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-teal-200 to-purple-200 font-semibold">
                Mindful Sanctuary • 4-7-8 Rhythm
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{formatSessionTime(sessionTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-300 backdrop-blur-xl shadow-md ${
                isMuted
                  ? 'bg-red-500/10 border-red-500/20 text-gray-400 hover:text-white'
                  : 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span>Music Paused</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-400 animate-bounce" />
                  <Music className="w-3.5 h-3.5 text-teal-300" />
                  <span>432Hz Calm Audio</span>
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-200 shadow-md cursor-pointer"
              title="Close Sanctuary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ── MAIN CONTENT (PERFECTLY CENTERED RING & TEXT) ── */}
        <main className="relative z-20 my-auto flex flex-col items-center justify-center text-center px-4 space-y-8">
          
          {/* Breathing Ring Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* Ambient Aura Glow */}
            <motion.div
              animate={{ scale: current.scale * 1.2 }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              style={{ backgroundColor: current.glowColor }}
              className="absolute inset-0 rounded-full blur-3xl opacity-75 pointer-events-none"
            />

            {/* Ripple Ring 1 */}
            <motion.div
              animate={{ scale: current.scale * 1.1, rotate: phase === 'inhale' ? 45 : -45 }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-2 rounded-full border border-white/10 bg-white/[0.01]"
            />

            {/* Ripple Ring 2 */}
            <motion.div
              animate={{ scale: current.scale, rotate: phase === 'hold' ? 90 : 0 }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-8 rounded-full border border-white/15 bg-gradient-to-br from-white/10 to-transparent"
            />

            {/* Core Timer Sphere */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-white/10"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke={current.ringColor}
                  strokeWidth="3.5"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </svg>

              <motion.div
                animate={{ scale: current.scale * 0.75 }}
                transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
                className={`w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full bg-gradient-to-tr ${current.color} flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 text-slate-950 font-sans`}
              >
                <span className="text-5xl sm:text-6xl font-black tracking-tight">
                  {secondsLeft}
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest opacity-80 mt-0.5">
                  seconds
                </span>
              </motion.div>
            </div>
          </div>

          {/* Phase Guidance Text (Separated cleanly below ring) */}
          <div className="space-y-2 max-w-lg mx-auto">
            <motion.h2
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight"
            >
              {current.title}
            </motion.h2>
            <motion.p
              key={phase + '-sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed"
            >
              {current.sub}
            </motion.p>
          </div>

        </main>

        {/* ── BOTTOM FOOTER BAR ── */}
        <footer className="relative z-30 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{cyclesCompleted} {cyclesCompleted === 1 ? 'Mindful Cycle' : 'Mindful Cycles'} Completed</span>
          </div>

          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            End Meditation Session
          </button>
        </footer>

      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

