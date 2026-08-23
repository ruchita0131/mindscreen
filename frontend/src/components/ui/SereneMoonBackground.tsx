import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const SereneMoonBackground: React.FC = () => {
  const { scrollY } = useScroll();

  // Scroll transforms matching Casa Di Solare:
  // At scroll Y = 0: Moon is a giant perfect hemisphere dome rising from the bottom edge
  // As user scrolls down (0 -> 500px): Moon scales down and recedes downward, revealing main headline text cleanly above!
  const moonScale = useTransform(scrollY, [0, 500], [1, 0.32]);
  const moonY = useTransform(scrollY, [0, 500], [0, 260]);
  const moonOpacity = useTransform(scrollY, [0, 500], [0.95, 0.65]);
  const haloOpacity = useTransform(scrollY, [0, 500], [0.35, 0.1]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* SVG Lunar Texture Filters */}
      <svg className="hidden">
        <defs>
          <filter id="moonTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="5" result="noise" />
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

          <radialGradient id="lunarMaria" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF9EB" stopOpacity="0.98" />
            <stop offset="30%" stopColor="#EAD8BE" stopOpacity="0.92" />
            <stop offset="60%" stopColor="#A3CEF1" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#8EA8C3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#161722" stopOpacity="0.05" />
          </radialGradient>
        </defs>
      </svg>

      {/* ── CASA DI SOLARE PERFECT HEMISPHERE MOON SPHERE AT BOTTOM ── */}
      <motion.div
        style={{
          scale: moonScale,
          y: moonY,
          opacity: moonOpacity,
        }}
        className="absolute -bottom-[500px] sm:-bottom-[650px] md:-bottom-[820px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] sm:w-[1300px] sm:h-[1300px] md:w-[1640px] md:h-[1640px] rounded-full origin-bottom"
      >
        {/* Core Luminous Moon Base */}
        <div
          className="w-full h-full rounded-full relative overflow-hidden shadow-[0_-20px_160px_rgba(234,216,190,0.45)]"
          style={{
            background: 'url(#lunarMaria), radial-gradient(circle at 50% 25%, #FFF9EB 0%, #EAD8BE 32%, #A3CEF1 62%, #161722 96%)',
          }}
        >
          {/* Realistic Surface Texture Overlay */}
          <div
            className="absolute inset-0 rounded-full mix-blend-overlay opacity-55 pointer-events-none"
            style={{ filter: 'url(#moonTexture)' }}
          />

          {/* Real Moon Craters & Maria Dark Plains (Sea of Tranquility) */}
          <div className="absolute top-[15%] left-[26%] w-[240px] h-[170px] rounded-full bg-slate-800/20 blur-xl transform -rotate-12" />
          <div className="absolute top-[28%] left-[44%] w-[340px] h-[230px] rounded-full bg-slate-800/25 blur-2xl transform rotate-6" />
          <div className="absolute top-[18%] left-[60%] w-[200px] h-[150px] rounded-full bg-slate-900/20 blur-xl" />
          
          {/* Impact Craters */}
          <div className="absolute top-[35%] left-[32%] w-[50px] h-[50px] rounded-full border-2 border-white/25 bg-slate-700/20 shadow-inner blur-[1px]" />
          <div className="absolute top-[24%] left-[40%] w-[36px] h-[36px] rounded-full border border-white/30 bg-slate-700/20 shadow-inner blur-[0.5px]" />
          <div className="absolute top-[48%] left-[65%] w-[70px] h-[70px] rounded-full border-2 border-white/25 bg-slate-700/20 shadow-inner blur-[1px]" />

          {/* Spherical Limb Shadow / Darkening */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 40% 25%, transparent 45%, rgba(15, 16, 25, 0.70) 82%, rgba(10, 11, 18, 0.95) 100%)',
            }}
          />
        </div>
      </motion.div>

      {/* ── ATMOSPHERIC MOONLIGHT HALO RINGS ── */}
      <motion.div
        style={{ opacity: haloOpacity, scale: moonScale, y: moonY }}
        className="absolute -bottom-[540px] sm:-bottom-[700px] md:-bottom-[880px] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] sm:w-[1420px] sm:h-[1420px] md:w-[1780px] md:h-[1780px] rounded-full border border-amber-200/25 origin-bottom"
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
