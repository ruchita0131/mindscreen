import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { SereneMoonBackground } from '../components/ui/SereneMoonBackground';
import { Brain, Mic, ClipboardList, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Casa Di Solare Scroll Animations:
  // As user scrolls Y (0 -> 450px):
  // 1. Giant Editorial Title ("MindScreen") smoothly expands into view in high-fashion serif font
  // 2. Scroll-to-discover pill prompt at bottom fades out
  const titleOpacity = useTransform(scrollY, [50, 350], [0.4, 1]);
  const titleScale   = useTransform(scrollY, [50, 450], [0.88, 1.05]);
  const titleY       = useTransform(scrollY, [50, 450], [40, -10]);
  
  const scrollPromptOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  return (
    <div className="min-h-screen bg-[#1B1622] text-[#E8B4B8] overflow-x-hidden relative font-sans">
      {/* Casa Di Solare Golden Celestial Sphere Background (Untouched) */}
      <SereneMoonBackground />

      {/* ── CASA DI SOLARE STYLE NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-full bg-[#81B29A]/20 border border-[#81B29A]/40 flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#94D2BD]" />
            </div>
            <span className="font-serif-title text-2xl font-bold tracking-widest text-[#94D2BD] uppercase">
              MindScreen
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#E8B4B8]/80 uppercase tracking-widest">
            <span className="text-[#94D2BD] font-bold cursor-pointer">● Intro</span>
            <span className="hover:text-[#94D2BD] cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>Assessment</span>
            <span className="hover:text-[#94D2BD] cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}>MentalBERT</span>
            <span className="hover:text-[#94D2BD] cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 1600, behavior: 'smooth' })}>Acoustics</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-xs tracking-wider uppercase px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(129,178,154,0.35)] transition-all flex items-center gap-2"
          >
            Enter Sanctuary <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* HERO SECTION — CASA DI SOLARE EDITORIAL SANCTUARY */}
        <section className="min-h-screen flex flex-col justify-between pt-28 pb-16 relative">
          
          {/* Top Intro Subtitle Badge */}
          <div className="text-center pt-8 z-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#241D2B]/90 border border-[#81B29A]/30 backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#94D2BD] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-widest text-[#94D2BD] uppercase">
                AI-Powered Multimodal Mental Health Screening
              </span>
            </div>
          </div>

          {/* DYNAMIC EDITORIAL HEADING ("MindScreen") — FLOATS IN 3D SANCTUARY SPACE */}
          <motion.div
            style={{
              opacity: titleOpacity,
              scale: titleScale,
              y: titleY,
            }}
            className="text-center my-auto z-20 py-8"
          >
            <h1 className="font-serif-title text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] italic font-normal tracking-tight leading-[0.88] mb-6 text-gradient-solare drop-shadow-2xl">
              MindScreen
            </h1>
            
            <p className="text-base sm:text-xl text-[#F0C0C6] max-w-xl mx-auto font-normal leading-relaxed mb-10 px-4">
              A serene clinical screening sanctuary integrating PHQ-9 metrics, MentalBERT semantics, and voice acoustics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-sm px-8 py-4 rounded-full shadow-[0_0_30px_rgba(129,178,154,0.45)] transition-all flex items-center justify-center gap-2"
              >
                Start Assessment <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                className="border-[#E8B4B8]/40 text-[#E8B4B8] hover:bg-[#81B29A]/15 hover:text-[#94D2BD] text-sm px-8 py-4 rounded-full transition-all backdrop-blur-md font-medium"
              >
                Explore Methodology
              </Button>
            </div>
          </motion.div>

          {/* CASA DI SOLARE SCREENSHOT 1 SCROLL PROMPT PILL */}
          <motion.div
            style={{ opacity: scrollPromptOpacity }}
            className="text-center z-30 pt-6 pb-2 flex flex-col items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241D2B]/95 border border-[#81B29A]/40 backdrop-blur-xl shadow-xl">
              <span className="text-[11px] font-bold tracking-widest text-[#94D2BD] uppercase">
                Scroll to discover
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-[#81B29A]"
              />
            </div>
          </motion.div>

        </section>

        {/* FEATURES SECTION — TRI-MODAL CLINICAL APPROACH */}
        <section className="py-28 relative z-20">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-widest text-[#94D2BD] font-bold mb-3 block">
              Tri-Modal Architecture
            </span>
            <h2 className="font-serif-title text-4xl sm:text-6xl italic font-normal tracking-tight mb-4 text-[#94D2BD]">
              A Holistic Tri-Modal Approach
            </h2>
            <p className="text-[#E8B4B8] max-w-2xl mx-auto text-base font-medium leading-relaxed">
              Clinical-grade desaturated analysis combining subjective self-reports, semantic text processing, and vocal biomarkers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardList,
                title: 'PHQ-9 Questionnaire',
                tag: 'Clinical Standard',
                desc: 'Standardized 9-question depression severity metric validated by healthcare practitioners globally.',
                color: 'text-[#94D2BD]',
                bg: 'bg-emerald-500/15',
                border: 'border-emerald-500/30'
              },
              {
                icon: Brain,
                title: 'MentalBERT NLP',
                tag: 'Semantic Analysis',
                desc: 'Specialized transformer model fine-tuned on clinical domain text for subtle cognitive state extraction.',
                color: 'text-[#94D2BD]',
                bg: 'bg-emerald-500/15',
                border: 'border-emerald-500/30'
              },
              {
                icon: Mic,
                title: 'Voice Acoustic Analysis',
                desc: 'Extracts pitch variability, MFCCs, and spectral energy to identify acoustic indicators of distress.',
                tag: 'Vocal Biomarkers',
                color: 'text-[#E8B4B8]',
                bg: 'bg-rose-500/15',
                border: 'border-rose-500/30'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} border ${feature.border} flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#94D2BD] font-bold px-3 py-1 rounded-full bg-[#81B29A]/15 border border-[#81B29A]/30">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="font-serif-title text-3xl font-semibold mb-3 text-[#94D2BD]">{feature.title}</h3>
                <p className="text-[#F0C0C6] text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 mb-24 relative z-20">
          <div className="glass-card p-10 sm:p-16 border-[#81B29A]/30 relative overflow-hidden">
            <div className="text-center mb-16 relative z-10">
              <h2 className="font-serif-title text-4xl sm:text-6xl italic font-normal tracking-tight mb-4 text-[#94D2BD]">
                How MindScreen Works
              </h2>
              <p className="text-[#E8B4B8] max-w-2xl mx-auto text-base font-medium">
                3 quiet, effortless steps to complete your screening session.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              {[
                { step: '01', title: 'Complete PHQ-9', desc: 'Select ratings for 9 clinical questions regarding your recent mood and energy levels.' },
                { step: '02', title: 'Write Your Thoughts', desc: 'Express your feelings in a short journal response. MentalBERT analyzes semantic patterns.' },
                { step: '03', title: 'Voice Check-In', desc: 'Speak naturally for 15-30 seconds. Audio feature extraction measures acoustic stability.' }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && <div className="hidden md:block absolute top-10 left-[65%] w-full h-[1px] bg-gradient-to-r from-[#81B29A]/40 to-transparent" />}
                  <div className="font-serif-title text-5xl font-italic text-[#94D2BD]/40 mb-3">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2 text-[#94D2BD]">{item.title}</h3>
                  <p className="text-[#F0C0C6] text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#81B29A]/20 bg-[#17121C] relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Brain className="text-[#94D2BD] w-5 h-5" />
              <span className="font-serif-title text-2xl font-bold tracking-widest text-[#94D2BD]">MindScreen</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#81B29A]/15 border border-[#81B29A]/30 text-[#94D2BD] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Preserving • Confidential Analysis</span>
            </div>
          </div>
          
          <div className="text-center md:text-left text-xs text-[#E8B4B8]/80 border-t border-white/5 pt-8 leading-relaxed font-medium">
            <p className="mb-2">
              <strong className="text-[#94D2BD]">Clinical Disclaimer:</strong> MindScreen is an AI-assisted screening research platform intended solely for preliminary wellness assessment. It is not a diagnostic tool and does not constitute medical advice.
            </p>
            <p>If you or someone you know is in crisis, please contact local emergency services or call a mental health crisis line immediately.</p>
            <p className="mt-6 text-[#E8B4B8]/60">© {new Date().getFullYear()} MindScreen Platform (RVITM BCS685). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
