import React from 'react';
import { motion } from 'framer-motion';

export const AmbientSunBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Floating Ambient Sun Orb */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.35, 0.5, 0.4, 0.35],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 right-1/4 w-[550px] h-[550px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(233, 196, 106, 0.28) 0%, rgba(10, 147, 150, 0.15) 50%, rgba(13, 27, 42, 0) 75%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Secondary Soothing Horizon Glow */}
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 35, -25, 0],
          opacity: [0.2, 0.35, 0.25, 0.2],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 left-10 w-[650px] h-[650px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(148, 210, 189, 0.2) 0%, rgba(123, 47, 190, 0.12) 55%, rgba(13, 27, 42, 0) 80%)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
};
