import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const SereneMoonBackground: React.FC = () => {
  const { scrollY } = useScroll();

  // Scroll transforms:
  // At scroll Y = 0 (top of page): Moon is giant & zoomed-in (scale 1, bottom offset -450px)
  // As user scrolls down (0 -> 600px): Moon shrinks smoothly (scale 0.38, moves up/small)
  const moonScale = useTransform(scrollY, [0, 500], [1, 0.38]);
  const moonY = useTransform(scrollY, [0, 500], [0, -180]);
  const moonOpacity = useTransform(scrollY, [0, 500], [0.95, 0.75]);
  const haloOpacity = useTransform(scrollY, [0, 500], [0.4, 0.15]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* SVG Lunar Texture Filters */}
      <svg className="hidden">
        <defs>
          {/* Realistic Lunar Surface Noise */}
          <filter id="moonTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="5" result="noise" />
            <feColorMatrix
              type="matrix"
              values="
                0.85 0 0 0 0.1
                0 0.85 0 0 0.1
                0 0 0.90 0 0.12
                0 0 0 0.45 0
              "
            />
          </filter>

          {/* Lunar Maria Plains Gradient */}
          <radialGradient id="lunarMaria" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#E8D5B7" stopOpacity="0.90" />
            <stop offset="65%" stopColor="#A3CEF1" stopOpacity="0.75" />
            <stop offset="88%" stopColor="#8EA8C3" stopOpacity="0.50" />
            <stop offset="100%" stopColor="#161722" stopOpacity="0.10" />
          </radialGradient>
        </defs>
      </svg>

      {/* ── REALISTIC GIANT RISING MOON SPHERE ── */}
      <motion.div
        style={{
          scale: moonScale,
          y: moonY,
          opacity: moonOpacity,
        }}
        className="absolute -bottom-[420px] sm:-bottom-[580px] md:-bottom-[680px] left-1/2 -translate-x-1/2 w-[850px] h-[850px] sm:w-[1100px] sm:h-[1100px] md:w-[1350px] md:h-[1350px] rounded-full origin-bottom"
      >
        {/* Core Luminous Moon Base */}
        <div
          className="w-full h-full rounded-full relative overflow-hidden shadow-[0_0_180px_rgba(232,213,183,0.45)]"
          style={{
            background: 'url(#lunarMaria), radial-gradient(circle at 45% 30%, #FFF8E7 0%, #E8D5B7 30%, #A3CEF1 60%, #161722 95%)',
          }}
        >
          {/* Realistic Surface Texture Overlay */}
          <div
            className="absolute inset-0 rounded-full mix-blend-overlay opacity-60 pointer-events-none"
            style={{ filter: 'url(#moonTexture)' }}
          />

          {/* Real Moon Craters & Maria Dark Plains (Sea of Tranquility) */}
          <div className="absolute top-[18%] left-[25%] w-[220px] h-[160px] rounded-full bg-slate-800/25 blur-xl transform -rotate-12" />
          <div className="absolute top-[32%] left-[45%] w-[310px] h-[220px] rounded-full bg-slate-800/30 blur-2xl transform rotate-6" />
          <div className="absolute top-[22%] left-[58%] w-[180px] h-[140px] rounded-full bg-slate-900/25 blur-xl" />
          
          {/* Impact Craters */}
          <div className="absolute top-[40%] left-[30%] w-[45px] h-[45px] rounded-full border-2 border-white/20 bg-slate-700/20 shadow-inner blur-[1px]" />
          <div className="absolute top-[28%] left-[38%] w-[32px] h-[32px] rounded-full border border-white/25 bg-slate-700/20 shadow-inner blur-[0.5px]" />
          <div className="absolute top-[52%] left-[62%] w-[60px] h-[60px] rounded-full border-2 border-white/20 bg-slate-700/20 shadow-inner blur-[1px]" />

          {/* Spherical Limb Shadow / Darkening */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 40% 30%, transparent 50%, rgba(15, 16, 25, 0.75) 85%, rgba(10, 11, 18, 0.95) 100%)',
            }}
          />
        </div>
      </motion.div>

      {/* ── ATMOSPHERIC MOONLIGHT HALO RINGS ── */}
      <motion.div
        style={{ opacity: haloOpacity, scale: moonScale }}
        className="absolute -bottom-[460px] sm:-bottom-[620px] md:-bottom-[720px] left-1/2 -translate-x-1/2 w-[950px] h-[950px] sm:w-[1250px] sm:h-[1250px] md:w-[1500px] md:h-[1500px] rounded-full border border-amber-200/25 origin-bottom"
      />

      <motion.div
        style={{ opacity: haloOpacity, scale: moonScale }}
        className="absolute -bottom-[500px] sm:-bottom-[680px] md:-bottom-[780px] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] sm:w-[1400px] sm:h-[1400px] md:w-[1700px] md:h-[1700px] rounded-full border border-purple-300/15 origin-bottom"
      />

      {/* ── AMBIENT TWILIGHT BACKDROP GLOWS ── */}
      <div className="absolute top-1/4 left-10 w-[550px] h-[550px] rounded-full bg-[#8EA8C3]/10 blur-[130px]" />
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] rounded-full bg-[#C6ACD6]/10 blur-[130px]" />

      {/* ── FLOATING MOONLIGHT STARDUST ── */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            y: [0, -35, 0],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-100/70 blur-[0.5px]"
          style={{
            top: `${(i * 11) % 75 + 5}%`,
            left: `${(i * 17) % 90 + 5}%`,
          }}
        />
      ))}
    </div>
  );
};

