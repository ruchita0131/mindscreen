import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Heart, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface GuidedBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedBreathingModal: React.FC<GuidedBreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

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

        // Transition to next phase
        if (phase === 'inhale') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 8;
        } else {
          setPhase('inhale');
          setCyclesCompleted((c) => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const phaseConfig = {
    inhale: {
      title: 'Breathe In Deeply',
      sub: 'Fill your lungs with warm, calming energy...',
      color: 'text-brand-amber',
      bg: 'bg-brand-amber/20',
      scale: 1.4,
      duration: 4,
    },
    hold: {
      title: 'Hold Your Breath',
      sub: 'Feel peaceful stability within...',
      color: 'text-brand-tealL',
      bg: 'bg-brand-teal/20',
      scale: 1.4,
      duration: 7,
    },
    exhale: {
      title: 'Exhale Slowly',
      sub: 'Release tension, worry, and stress...',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/20',
      scale: 0.9,
      duration: 8,
    },
  };

  const current = phaseConfig[phase];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg glass-card p-8 text-center border-amber-400/30 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-brand-amber animate-spin-slow" />
            <span className="text-sm font-semibold tracking-wider text-brand-amber uppercase">
              Guided 4-7-8 Calm Technique
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-8">Follow the glowing sun ring to reduce anxiety instantly</p>

          {/* Animated Sun Ring */}
          <div className="relative w-56 h-56 mx-auto mb-8 flex items-center justify-center">
            {/* Outer Pulsing Glow */}
            <motion.div
              animate={{
                scale: current.scale,
              }}
              transition={{
                duration: current.duration,
                ease: 'easeInOut',
              }}
              className={`absolute inset-0 rounded-full ${current.bg} blur-xl`}
            />

            {/* Glowing Ring */}
            <motion.div
              animate={{
                scale: current.scale,
              }}
              transition={{
                duration: current.duration,
                ease: 'easeInOut',
              }}
              className="w-40 h-40 rounded-full border-4 border-brand-amber/60 bg-gradient-to-br from-brand-amber/30 via-brand-teal/20 to-brand-purple/20 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(233,196,106,0.3)] relative z-10"
            >
              <span className="text-4xl font-extrabold text-white mb-1">{secondsLeft}s</span>
              <span className={`text-xs font-semibold uppercase tracking-widest ${current.color}`}>
                {phase}
              </span>
            </motion.div>
          </div>

          {/* Instructions */}
          <h3 className={`text-2xl font-bold mb-1 ${current.color}`}>{current.title}</h3>
          <p className="text-sm text-gray-300 mb-6">{current.sub}</p>

          {/* Cycle Counter & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{cyclesCompleted} calm cycles completed</span>
            </div>
            <Button
              onClick={onClose}
              className="bg-brand-amber hover:bg-yellow-500 text-[#0D1B2A] font-bold text-xs py-2 px-4"
            >
              Done Feeling Calmer
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
