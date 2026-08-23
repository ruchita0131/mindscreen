import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, CheckCircle2, Wind, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface GuidedBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedBreathingModal: React.FC<GuidedBreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  useEffect(() => {
    if (!isOpen) {
      setPhase('inhale');
      setSecondsLeft(4);
      setCyclesCompleted(0);
      return;
    }

    const timer = setInterval(() => {
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

    return () => clearInterval(timer);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const currentDuration = phaseDurations[phase];
  const progressPercent = ((currentDuration - secondsLeft + 1) / currentDuration) * 100;

  const phaseConfig = {
    inhale: {
      title: 'Breathe In Slowly',
      sub: 'Inhale clarity & calmness into your mind',
      color: 'from-amber-300 via-amber-400 to-orange-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      ringColor: '#F59E0B',
      scale: 1.45,
    },
    hold: {
      title: 'Hold & Embrace Rest',
      sub: 'Pause and feel serene stillness within',
      color: 'from-teal-300 via-emerald-400 to-cyan-400',
      badgeBg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',
      glowColor: 'rgba(20, 184, 166, 0.25)',
      ringColor: '#14B8A6',
      scale: 1.45,
    },
    exhale: {
      title: 'Exhale & Release',
      sub: 'Softly let go of all tension & anxiety',
      color: 'from-indigo-300 via-purple-400 to-pink-400',
      badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      ringColor: '#A855F7',
      scale: 0.9,
    },
  };

  const current = phaseConfig[phase];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090D16]/85 backdrop-blur-2xl transition-all duration-700">
        
        {/* Ambient background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-[120px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900/90 border border-white/10 p-8 text-center shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium tracking-wide mb-3 backdrop-blur-md transition-all duration-500 shadow-sm border-amber-500/20 bg-amber-500/10 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>4-7-8 Mindful Breathing</span>
          </div>

          <p className="text-xs text-gray-400 mb-8 max-w-xs mx-auto">
            Sync your breath with the expanding mandala to calm your nervous system.
          </p>

          {/* ORGANIC BREATHING ORB / MANDALA */}
          <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            
            {/* Outer Ambient Glow Wave */}
            <motion.div
              animate={{ scale: current.scale * 1.15 }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              style={{ backgroundColor: current.glowColor }}
              className="absolute inset-0 rounded-full blur-2xl opacity-70"
            />

            {/* Ripple Ring 1 */}
            <motion.div
              animate={{ scale: current.scale * 1.08, rotate: phase === 'inhale' ? 45 : -45 }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              className="absolute w-52 h-52 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xs"
            />

            {/* Ripple Ring 2 */}
            <motion.div
              animate={{ scale: current.scale, rotate: phase === 'hold' ? 90 : 0 }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              className="absolute w-44 h-44 rounded-full border border-white/15 bg-gradient-to-br from-white/10 to-transparent shadow-inner"
            />

            {/* Core Orb Container with SVG Circular Progress Arc */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              
              {/* Progress Circle SVG */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-white/10"
                  strokeWidth="3"
                  fill="transparent"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke={current.ringColor}
                  strokeWidth="4"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>

              {/* Core Pulsing Sphere */}
              <motion.div
                animate={{ scale: current.scale * 0.75 }}
                transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
                className={`w-28 h-28 rounded-full bg-gradient-to-tr ${current.color} flex flex-col items-center justify-center shadow-lg relative z-10 text-slate-950 font-sans`}
              >
                <span className="text-3xl font-black tracking-tight drop-shadow-sm">
                  {secondsLeft}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-0.5">
                  sec
                </span>
              </motion.div>
            </div>
          </div>

          {/* Phase Title & Guidance */}
          <div className="h-16 flex flex-col items-center justify-center">
            <motion.h3
              key={phase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-gray-300"
            >
              {current.title}
            </motion.h3>
            <motion.p
              key={phase + '-sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-400 mt-1"
            >
              {current.sub}
            </motion.p>
          </div>

          {/* Footer Bar: Completed Cycles & Action */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{cyclesCompleted} {cyclesCompleted === 1 ? 'cycle' : 'cycles'} completed</span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold tracking-wide transition-all duration-200"
            >
              Complete Session
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

