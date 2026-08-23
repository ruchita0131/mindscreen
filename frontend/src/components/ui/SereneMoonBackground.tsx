import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const SereneMoonBackground: React.FC = () => {
  const { scrollY } = useScroll();

  // Moon starts as a perfect hemisphere dome at screen bottom.
  // As user scrolls: moon sinks DOWN (positive y) and shrinks.
  const moonY     = useTransform(scrollY, [0, 600], [0, 340]);
  const moonScale = useTransform(scrollY, [0, 600], [1, 0.28]);
  const glowOp    = useTransform(scrollY, [0, 400], [1, 0.25]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* ── AMBIENT WARM BACKGROUND GRADIENTS ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 20% 10%, rgba(200, 175, 130, 0.25) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 80% 15%, rgba(139, 168, 196, 0.18) 0%, transparent 65%),
            radial-gradient(ellipse 70% 60% at 50% 110%, rgba(240, 225, 200, 0.55) 0%, transparent 55%)
          `,
        }}
      />

      {/* ── PERFECT HEMISPHERE MOON ──
          Sphere diameter = 110vw, bottom = -55vw
          → exactly the upper hemisphere is visible at scroll=0 */}
      <motion.div
        style={{
          y: moonY,
          scale: moonScale,
          position: 'absolute',
          bottom: 'calc(-55vw)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '110vw',
          height: '110vw',
          minWidth: '700px',
          minHeight: '700px',
          transformOrigin: 'bottom center',
        }}
      >
        {/* Outer atmospheric glow halo */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            opacity: glowOp,
            background: 'radial-gradient(circle at 50% 50%, rgba(245, 236, 216, 0) 58%, rgba(230, 210, 175, 0.40) 80%, rgba(210, 185, 145, 0.18) 100%)',
          }}
        />

        {/* The Moon sphere itself */}
        <div
          className="absolute inset-[5%] rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 42% 28%,
                #FFFBF2 0%,
                #F5ECD8 18%,
                #EAD8BC 36%,
                #D4BF9C 55%,
                #B8A07C 72%,
                #8B7A5E 85%,
                #5A4A38 95%,
                #2A1F14 100%
              )
            `,
            boxShadow: `
              0 -30px 140px rgba(245, 236, 216, 0.80),
              0 -15px 70px rgba(230, 210, 175, 0.55),
              inset 0 0 80px rgba(255, 255, 255, 0.12)
            `,
          }}
        >
          {/* Lunar maria — dark volcanic plains */}
          <div className="absolute top-[14%] left-[22%] w-[28%] h-[20%] rounded-full bg-[#2A2018]/30 blur-2xl" style={{ transform: 'rotate(-15deg)' }} />
          <div className="absolute top-[28%] left-[42%] w-[32%] h-[22%] rounded-full bg-[#2A2018]/35 blur-3xl" style={{ transform: 'rotate(8deg)' }} />
          <div className="absolute top-[18%] left-[60%] w-[22%] h-[16%] rounded-full bg-[#1E1810]/25 blur-xl" />
          <div className="absolute top-[38%] left-[15%] w-[20%] h-[14%] rounded-full bg-[#2A2018]/20 blur-xl" style={{ transform: 'rotate(20deg)' }} />

          {/* Impact craters */}
          <div className="absolute top-[32%] left-[28%] w-[5%] h-[5%] rounded-full bg-[#1E1810]/30" style={{ border: '1px solid rgba(255,255,255,0.20)', filter: 'blur(2px)' }} />
          <div className="absolute top-[22%] left-[48%] w-[3.5%] h-[3.5%] rounded-full bg-[#1E1810]/25" style={{ border: '1px solid rgba(255,255,255,0.25)', filter: 'blur(1.5px)' }} />
          <div className="absolute top-[45%] left-[58%] w-[7%] h-[7%] rounded-full bg-[#1E1810]/30" style={{ border: '1px solid rgba(255,255,255,0.15)', filter: 'blur(2px)' }} />
          <div className="absolute top-[20%] left-[35%] w-[2.5%] h-[2.5%] rounded-full bg-[#16120A]/20" style={{ border: '1px solid rgba(255,255,255,0.30)', filter: 'blur(1px)' }} />

          {/* Day/night terminator shadow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at 35% 30%, transparent 38%, rgba(20, 14, 8, 0.65) 80%, rgba(10, 7, 4, 0.92) 100%)',
            }}
          />

          {/* Specular highlight on lit side */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 38% 25%, rgba(255, 255, 255, 0.14) 0%, transparent 44%)',
            }}
          />
        </div>
      </motion.div>

      {/* ── FLOATING WARM DUST PARTICLES ── */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.12, 0.50, 0.12], y: [0, -22, 0] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' }}
          className="absolute rounded-full"
          style={{
            width:  `${2 + (i % 2)}px`,
            height: `${2 + (i % 2)}px`,
            background: 'rgba(175, 148, 108, 0.65)',
            top:  `${(i * 13) % 70 + 5}%`,
            left: `${(i * 19) % 85 + 5}%`,
          }}
        />
      ))}
    </div>
  );
};
