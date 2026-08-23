import React from 'react';
import { motion } from 'framer-motion';

export const SereneMoonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* ── CENTRAL GLOWING SERENE MOON ORB ── */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.55, 0.35],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 right-1/6 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(163, 206, 241, 0.22) 0%, rgba(198, 172, 214, 0.14) 45%, rgba(15, 20, 28, 0) 75%)',
          filter: 'blur(75px)',
        }}
      />

      {/* ── CONCENTRIC MOONLIGHT RIPPLE RINGS ── */}
      <motion.div
        animate={{
          scale: [1.1, 1.25, 1.1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-5%] right-[10%] w-[700px] h-[700px] rounded-full border border-slate-300/10"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[2%] right-[14%] w-[500px] h-[500px] rounded-full border border-purple-300/10"
      />

      {/* ── SOOTHING SAGE HORIZON AURA ── */}
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -20, 0],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-48 left-10 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(129, 178, 154, 0.18) 0%, rgba(126, 178, 221, 0.10) 55%, rgba(15, 20, 28, 0) 80%)',
          filter: 'blur(95px)',
        }}
      />

      {/* ── FLOATING MOONLIGHT STARDUST PARTICLES ── */}
      {[...Array(14)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.15, 0.7, 0.15],
            y: [0, -40, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 5 + (i % 6),
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-slate-200/50 blur-[0.5px]"
          style={{
            top: `${(i * 13) % 80 + 10}%`,
            left: `${(i * 19) % 85 + 5}%`,
          }}
        />
      ))}
    </div>
  );
};

