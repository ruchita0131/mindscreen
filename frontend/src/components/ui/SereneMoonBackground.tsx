import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const SereneMoonBackground: React.FC = () => {
  const { scrollY } = useScroll();

  // Casa Di Solare animation behavior:
  // Top of page (scroll=0): Giant glowing celestial sphere rising from the bottom edge as a perfect dome.
  // Scroll down (0 -> 500px): Sphere smoothly shrinks & recedes downward into the sanctuary reflecting basin!
  const sphereScale = useTransform(scrollY, [0, 500], [1, 0.28]);
  const sphereY     = useTransform(scrollY, [0, 500], [0, 220]);
  const haloOpacity = useTransform(scrollY, [0, 450], [0.85, 0.25]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* ── ATMOSPHERIC TWILIGHT SKY BACKGROUND ── */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 50% 15%, rgba(198, 172, 214, 0.12) 0%, transparent 65%),
            radial-gradient(ellipse 70% 60% at 50% 105%, rgba(255, 232, 194, 0.25) 0%, transparent 55%),
            linear-gradient(to bottom, #1D1722 0%, #17121C 100%)
          `,
        }}
      />

      {/* ── CASA DI SOLARE RADIANT CELESTIAL SPHERE ── */}
      <motion.div
        style={{
          scale: sphereScale,
          y: sphereY,
        }}
        className="absolute -bottom-[580px] sm:-bottom-[760px] md:-bottom-[940px] left-1/2 -translate-x-1/2 w-[980px] h-[980px] sm:w-[1300px] sm:h-[1300px] md:w-[1620px] md:h-[1620px] rounded-full origin-bottom"
      >
        {/* Atmospheric Aura Halo */}
        <motion.div
          className="absolute -inset-16 rounded-full"
          style={{
            opacity: haloOpacity,
            background: 'radial-gradient(circle at 50% 50%, rgba(243, 200, 130, 0.25) 0%, rgba(226, 157, 82, 0.12) 50%, rgba(29, 23, 34, 0) 80%)',
            filter: 'blur(35px)',
          }}
        />

        {/* Core Sphere (Serene Sunset Amber / Warm Gold - Non Blinding) */}
        <div
          className="w-full h-full rounded-full relative overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 48% 25%, 
                #FFE0A3 0%, 
                #F4C47F 22%, 
                #E29D52 45%, 
                #C27334 68%, 
                #7A3D1E 85%, 
                #2D1814 100%
              )
            `,
            boxShadow: `
              0 -15px 120px rgba(244, 196, 127, 0.40),
              inset 0 0 80px rgba(255, 224, 163, 0.35)
            `,
          }}
        >
          {/* Surface Haze & Craters */}
          <div className="absolute top-[20%] left-[30%] w-[35%] h-[25%] rounded-full bg-[#7A3D1E]/20 blur-2xl transform -rotate-12" />
          <div className="absolute top-[35%] left-[48%] w-[38%] h-[28%] rounded-full bg-[#2D1814]/25 blur-3xl transform rotate-6" />

          {/* Twilight Atmosphere Vignette */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 45% 25%, transparent 35%, rgba(27, 22, 34, 0.55) 75%, rgba(20, 15, 24, 0.90) 100%)',
            }}
          />
        </div>
      </motion.div>


      {/* ── FLOATING MOONLIGHT STARDUST ── */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            y: [0, -30, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-100/60 blur-[0.5px]"
          style={{
            top: `${(i * 11) % 75 + 5}%`,
            left: `${(i * 17) % 90 + 5}%`,
          }}
        />
      ))}
    </div>
  );
};
