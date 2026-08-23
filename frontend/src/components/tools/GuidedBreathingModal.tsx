import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, Volume2, VolumeX, Maximize2, Minimize2, Music } from 'lucide-react';

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

  // Audio Context Ref for synthesized 432Hz relaxation drone chord
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
      // Gentle fade in
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
      gainNodeRef.current = masterGain;

      // Lowpass filter to make the sound warm, deep, and soothing
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      // 432Hz tuning harmonic chord: A2 (108Hz), E3 (162Hz), A3 (216Hz), C#4 (270Hz)
      const freqs = [108.0, 162.0, 216.0, 270.0];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle micro-detuning for a rich ambient pad effect
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
      // Gentle fade out before stopping
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        oscillatorsRef.current = [];
        try { ctx.close(); } catch {}
        audioCtxRef.current = null;
      }, 1600);
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
      glowColor: 'rgba(245, 158, 11, 0.35)',
      ringColor: '#F59E0B',
      scale: 1.55,
    },
    hold: {
      title: 'Hold & Rest Within',
      sub: 'Pause and feel calm, serene stillness settle inside',
      color: 'from-teal-300 via-emerald-400 to-cyan-400',
      glowColor: 'rgba(20, 184, 166, 0.35)',
      ringColor: '#14B8A6',
      scale: 1.55,
    },
    exhale: {
      title: 'Exhale & Let Go',
      sub: 'Softly release all worry, stress, and bodily tension',
      color: 'from-indigo-300 via-purple-400 to-pink-400',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      ringColor: '#A855F7',
      scale: 0.92,
    },
  };

  const current = phaseConfig[phase];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 w-screen h-screen flex flex-col items-center justify-between p-6 sm:p-10 bg-[#050811] text-white overflow-hidden"
      >
        {/* ── IMMERSIVE BACKGROUND PARTICLES & AURORA GLOW ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.6, 0.35],
              x: [-20, 20, -20],
              y: [-20, 20, -20],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-32 w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{
              scale: [1.25, 1, 1.25],
              opacity: [0.35, 0.6, 0.35],
              x: [20, -20, 20],
              y: [20, -20, 20],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 -right-32 w-[550px] h-[550px] bg-teal-500/15 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px]"
          />

          {/* Floating Subtle Ambient Stars */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.3, 0.8],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4 + (i % 5),
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/60 blur-[0.5px]"
              style={{
                top: `${(i * 17) % 85 + 7}%`,
                left: `${(i * 23) % 90 + 5}%`,
              }}
            />
          ))}
        </div>

        {/* ── TOP HEADER CONTROL BAR ── */}
        <div className="relative z-20 w-full max-w-6xl flex items-center justify-between">
          
          {/* Left: Mindful Sanctuary Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wide backdrop-blur-xl shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-teal-200 to-purple-200 font-semibold">
                Mindful Sanctuary • 4-7-8 Rhythm
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{formatSessionTime(sessionTime)}</span>
            </div>
          </div>

          {/* Right: Audio Music Toggle & Close Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium tracking-wide transition-all duration-300 backdrop-blur-xl shadow-lg ${
                isMuted
                  ? 'bg-red-500/10 border-red-500/20 text-gray-400 hover:text-white'
                  : 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span className="hidden sm:inline">Music Paused</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-400 animate-bounce" />
                  <Music className="w-3.5 h-3.5 text-teal-300" />
                  <span className="hidden sm:inline">432Hz Calm Audio Playing</span>
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all duration-200 shadow-lg"
              title="Close Fullscreen Sanctuary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── CENTER SANCTUARY: FULLSCREEN BREATHING MANDALA ── */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
          
          {/* Scaled-Up Fullscreen Breathing Ring */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] mx-auto mb-8 flex items-center justify-center">
            
            {/* Outer Ambient Radial Aura Wave */}
            <motion.div
              animate={{ scale: current.scale * 1.25 }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              style={{ backgroundColor: current.glowColor }}
              className="absolute inset-0 rounded-full blur-3xl opacity-80"
            />

            {/* Concentric Decorative Ripple Ring 1 */}
            <motion.div
              animate={{
                scale: current.scale * 1.12,
                rotate: phase === 'inhale' ? 60 : -60,
              }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              className="absolute w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full border border-white/10 bg-white/[0.015] backdrop-blur-xs"
            />

            {/* Concentric Decorative Ripple Ring 2 */}
            <motion.div
              animate={{
                scale: current.scale * 1.02,
                rotate: phase === 'hold' ? 120 : 0,
              }}
              transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
              className="absolute w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full border border-white/15 bg-gradient-to-br from-white/10 to-transparent shadow-inner"
            />

            {/* Core Orb Container with SVG Circular Progress Arc */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
              
              {/* Progress Circle SVG Arc */}
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

              {/* Core Pulsing Sphere with Timer Number */}
              <motion.div
                animate={{ scale: current.scale * 0.72 }}
                transition={{ duration: currentDuration, ease: [0.4, 0, 0.2, 1] }}
                className={`w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full bg-gradient-to-tr ${current.color} flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.5)] relative z-10 text-slate-950 font-sans`}
              >
                <span className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight drop-shadow-md">
                  {secondsLeft}
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-80 mt-1">
                  seconds
                </span>
              </motion.div>
            </div>
          </div>

          {/* Phase Title & Inspiring Guidance Text */}
          <div className="h-20 flex flex-col items-center justify-center max-w-xl px-4">
            <motion.h2
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-gray-300"
            >
              {current.title}
            </motion.h2>
            <motion.p
              key={phase + '-sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm sm:text-base text-gray-300/90 mt-2 font-medium"
            >
              {current.sub}
            </motion.p>
          </div>
        </div>

        {/* ── BOTTOM FOOTER CONTROL BAR ── */}
        <div className="relative z-20 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          
          {/* Completed Cycles Counter */}
          <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{cyclesCompleted} {cyclesCompleted === 1 ? 'Mindful Cycle' : 'Mindful Cycles'} Completed</span>
          </div>

          {/* End Session Button */}
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300 transform hover:scale-105"
          >
            End Meditation Session
          </button>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

