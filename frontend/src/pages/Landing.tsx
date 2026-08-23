import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { SereneMoonBackground } from '../components/ui/SereneMoonBackground';
import { Brain, Mic, ClipboardList, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // At scroll=0: moon fills the screen bottom half, text is invisible
  // 100px → 420px of scroll: moon recedes, text fades in upward
  const heroOpacity  = useTransform(scrollY, [100, 420], [0, 1]);
  const heroY        = useTransform(scrollY, [100, 420], [50, 0]);
  const scrollHintOp = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <div className="bg-[#F0E8D8] text-[#3D3128] overflow-x-hidden relative font-sans">
      <SereneMoonBackground />

      {/* ══════════════════════════════════════
          STICKY HERO  — moon recedes, text reveals
          ══════════════════════════════════════ */}
      <div className="sticky top-0 h-screen overflow-hidden z-10">

        {/* NAV */}
        <nav className="relative z-30 flex items-center justify-between px-6 sm:px-10 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(61,49,40,0.08)', border: '1px solid rgba(61,49,40,0.15)' }}
            >
              <Brain className="w-5 h-5 text-[#5A7A9A]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#3D3128]">MindScreen</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
            style={{
              background: '#3D3128',
              color: '#F0E8D8',
              boxShadow: '0 4px 20px rgba(61,49,40,0.25)',
            }}
          >
            Enter →
          </button>
        </nav>

        {/* HERO TEXT — revealed by scroll */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
          style={{ opacity: heroOpacity, y: heroY, paddingBottom: '8vh' }}
        >
          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{
              background: 'rgba(61,49,40,0.07)',
              border: '1px solid rgba(61,49,40,0.14)',
              color: '#7A6E65',
            }}
          >
            AI-Powered Mental Wellness
          </div>

          {/* Giant editorial headline */}
          <h1
            className="font-black leading-[0.92] tracking-[-0.04em] mb-6"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)', color: '#3D3128' }}
          >
            Mind
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #8B6E50 0%, #5A7A9A 55%, #8870A8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Screen
            </span>
          </h1>

          <p
            className="max-w-lg text-base sm:text-lg leading-relaxed mb-10"
            style={{ color: '#7A6E65' }}
          >
            A serene screening platform combining PHQ-9 clinical assessment,
            MentalBERT text intelligence, and vocal acoustic analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: '#3D3128',
                color: '#F0E8D8',
                boxShadow: '0 8px 32px rgba(61,49,40,0.30)',
              }}
            >
              Begin Assessment <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight + 200, behavior: 'smooth' })}
              className="px-7 py-3.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: 'rgba(61,49,40,0.07)',
                border: '1px solid rgba(61,49,40,0.18)',
                color: '#3D3128',
              }}
            >
              Discover Features
            </button>
          </div>
        </motion.div>

        {/* SCROLL HINT */}
        <motion.div
          style={{ opacity: scrollHintOp }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-center"
        >
          <p
            className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
            style={{ color: '#A89E95' }}
          >
            Scroll to reveal
          </p>
          <div
            className="w-[1px] h-10 mx-auto"
            style={{ background: 'linear-gradient(to bottom, #A89E95, transparent)' }}
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          SCROLLABLE CONTENT below sticky hero
          ══════════════════════════════════════ */}
      <main
        className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10"
        style={{ marginTop: '100vh' }}
      >

        {/* INTRO STATEMENT */}
        <section className="py-24 text-center max-w-3xl mx-auto">
          <p
            className="text-2xl sm:text-3xl font-light leading-relaxed"
            style={{ color: '#5A4A3A' }}
          >
            A calm, clinical approach to early mental wellness screening —
            designed to feel as{' '}
            <em className="not-italic font-medium" style={{ color: '#5A7A9A' }}>gentle</em>{' '}
            as it is insightful.
          </p>
        </section>

        {/* FEATURES */}
        <section className="py-16 pb-28">
          <div className="text-center mb-14">
            <h2
              className="font-black tracking-tight leading-[1.0] mb-4"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#3D3128' }}
            >
              A Tri-Modal Approach
            </h2>
            <p className="text-base" style={{ color: '#7A6E65' }}>
              Three lenses of analysis, one unified result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: ClipboardList,
                num: '01',
                title: 'PHQ-9 Questionnaire',
                desc: 'Standardised 9-question depression scale, clinically validated and trusted globally.',
                accent: '#5A7A9A',
                bg: 'rgba(90, 122, 154, 0.08)',
                border: 'rgba(90, 122, 154, 0.18)',
              },
              {
                icon: Brain,
                num: '02',
                title: 'MentalBERT Analysis',
                desc: 'Domain-fine-tuned transformer model extracts subtle linguistic markers from your writing.',
                accent: '#7A9E8E',
                bg: 'rgba(122, 158, 142, 0.08)',
                border: 'rgba(122, 158, 142, 0.18)',
              },
              {
                icon: Mic,
                num: '03',
                title: 'Voice Acoustic Biomarkers',
                desc: 'MFCC, pitch variance, and spectral analysis identify acoustic stress signatures.',
                accent: '#8870A8',
                bg: 'rgba(136, 112, 168, 0.08)',
                border: 'rgba(136, 112, 168, 0.18)',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl transition-transform duration-300 hover:-translate-y-1"
                style={{ background: f.bg, border: `1px solid ${f.border}` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.accent }} />
                </div>
                <div
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: '#A89E95' }}
                >
                  {f.num}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#3D3128' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6E65' }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 mb-24">
          <div
            className="rounded-3xl p-10 sm:p-16"
            style={{
              background: 'rgba(61,49,40,0.04)',
              border: '1px solid rgba(61,49,40,0.10)',
            }}
          >
            <div className="text-center mb-14">
              <h2
                className="font-black tracking-tight leading-[1.0] mb-3"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#3D3128' }}
              >
                How it works
              </h2>
              <p className="text-sm" style={{ color: '#7A6E65' }}>
                Three steps. Fifteen minutes. Meaningful insight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { n: '1', title: 'Reflect',  desc: 'Answer 9 PHQ-9 questions about your recent mood, energy, and sleep.' },
                { n: '2', title: 'Express',  desc: 'Write a short paragraph. MentalBERT reads between the lines with clinical depth.' },
                { n: '3', title: 'Speak',    desc: 'Record 20 seconds of natural speech. Acoustic biomarkers are extracted automatically.' },
              ].map((s, i) => (
                <div key={i}>
                  <div
                    className="text-[5rem] font-black leading-none mb-4 select-none"
                    style={{ color: 'rgba(61,49,40,0.08)' }}
                  >
                    {s.n}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#3D3128' }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7A6E65' }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: '#3D3128', color: '#C4B8A8' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#8BA8C4]" />
              <span className="font-bold text-lg text-[#F0E8D8]">MindScreen</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(240,232,216,0.10)', color: '#A8C5B5' }}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Private · Confidential · Research Only</span>
            </div>
          </div>
          <div
            className="text-xs leading-relaxed border-t pt-8"
            style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#8A7E74' }}
          >
            <p className="mb-2">
              <strong className="text-[#C4B8A8]">Disclaimer:</strong>{' '}
              MindScreen is a research screening tool and does not constitute medical advice.
              If you are in crisis, please contact emergency services or a mental health helpline immediately.
            </p>
            <p className="mt-5" style={{ color: '#5A504A' }}>
              © {new Date().getFullYear()} MindScreen · RVITM BCS685
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
