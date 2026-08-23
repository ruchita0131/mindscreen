import React from 'react';
import { motion } from 'framer-motion';

export const SereneMoonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* ── GIANT CASA DI SOLARE STYLE FULL-SIZE LUNAR SPHERE ── */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.85, 0.95, 0.85],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[450px] sm:-bottom-[600px] md:-bottom-[700px] left-1/2 -translate-x-1/2 w-[850px] h-[850px] sm:w-[1100px] sm:h-[1100px] md:w-[1350px] md:h-[1350px] rounded-full"
        style={{
          background: `
            radial-gradient(circle at 50% 25%, 
              rgba(255, 248, 231, 0.95) 0%, 
              rgba(232, 213, 183, 0.85) 25%, 
              rgba(163, 206, 241, 0.55) 55%, 
              rgba(198, 172, 214, 0.30) 75%, 
              rgba(22, 23, 34, 0) 100%
            )
          `,
          boxShadow: '0 0 160px rgba(232, 213, 183, 0.4), inset 0 0 100px rgba(255, 255, 255, 0.6)',
          filter: 'blur(2px)',
        }}
      />

      {/* ── ATMOSPHERIC MOONLIGHT HALO RINGS ── */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[480px] sm:-bottom-[640px] md:-bottom-[740px] left-1/2 -translate-x-1/2 w-[950px] h-[950px] sm:w-[1250px] sm:h-[1250px] md:w-[1500px] md:h-[1500px] rounded-full border border-amber-200/20"
      />

      <motion.div
        animate={{
          scale: [1.05, 1.15, 1.05],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[520px] sm:-bottom-[700px] md:-bottom-[800px] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] sm:w-[1400px] sm:h-[1400px] md:w-[1700px] md:h-[1700px] rounded-full border border-purple-300/15"
      />

      {/* ── SOFT SAGE & BLUE TWILIGHT AMBIENT BACKDROP GLOWS ── */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-10 w-[600px] h-[600px] rounded-full bg-[#8EA8C3]/10 blur-[130px]"
      />
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-10 w-[600px] h-[600px] rounded-full bg-[#C6ACD6]/10 blur-[130px]"
      />

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

