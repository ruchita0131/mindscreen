import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { SereneMoonBackground } from '../components/ui/SereneMoonBackground';
import { Brain, Mic, ClipboardList, ArrowRight, ShieldCheck, Sparkles, Moon } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Scroll transforms for editorial hero text:
  // At scroll Y = 0: Intro text is compact, moon is giant
  // As user scrolls Y (0 -> 400px): Headline text smoothly expands & scales up into prominent bold focus!
  const titleScale = useTransform(scrollY, [0, 400], [0.92, 1.08]);
  const titleY = useTransform(scrollY, [0, 400], [0, -20]);
  const introBadgeOpacity = useTransform(scrollY, [0, 250], [1, 0.4]);

  return (
    <div className="min-h-screen bg-[#161722] text-slate-100 overflow-x-hidden relative font-sans">
      {/* Casa Di Solare Style Realistic Moon Background with Scroll Scale */}
      <SereneMoonBackground />

      {/* Navigation Bar */}
      <nav className="relative z-30 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center backdrop-blur-xl">
            <Brain className="text-[#A3CEF1] w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gradient">MindScreen</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold shadow-[0_0_25px_rgba(129,178,154,0.35)] transition-all rounded-full px-6 py-2.5 text-sm"
          >
            Enter Sanctuary
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* HERO SECTION — CASA DI SOLARE SCROLL ANIMATED HERO */}
        <section className="min-h-[88vh] flex flex-col justify-between pt-10 pb-20 relative">
          
          <motion.div
            style={{ scale: titleScale, y: titleY }}
            className="text-center max-w-4xl mx-auto z-20 relative origin-top transition-transform duration-100"
          >
            <motion.div
              style={{ opacity: introBadgeOpacity }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-white/10 mb-6 backdrop-blur-xl shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#E8D5B7] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-[#E8D5B7] uppercase">
                Multimodal Mental Wellness Screening
              </span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6">
              AI-Powered <br/>
              <span className="text-gradient">MindScreen</span>
            </h1>
            
            <p className="text-base sm:text-xl text-slate-300/90 mb-10 leading-relaxed max-w-2xl mx-auto font-normal">
              A serene, desaturated mental health platform integrating PHQ-9 clinical metrics, MentalBERT natural language processing, and voice acoustics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-base px-8 py-5 rounded-full shadow-[0_0_30px_rgba(129,178,154,0.4)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start Assessment <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                className="border-white/15 text-slate-200 hover:bg-white/10 text-base px-8 py-5 rounded-full w-full sm:w-auto transition-all backdrop-blur-xl"
              >
                Discover Features
              </Button>
            </div>
          </motion.div>

          {/* Scroll Prompt above Giant Moon Horizon */}
          <div className="text-center z-20 relative pt-12">
            <p className="text-xs uppercase tracking-widest text-[#E8D5B7]/90 font-semibold drop-shadow-sm">
              Scroll to zoom & discover
            </p>
            <div className="w-5 h-8 border-2 border-[#E8D5B7]/50 rounded-full mx-auto mt-3 flex justify-center p-1 shadow-md">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 bg-[#E8D5B7] rounded-full"
              />
            </div>
          </div>

        </section>

        {/* FEATURES SECTION */}
        <section className="py-28 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-slate-100">
              A Holistic Tri-Modal Approach
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
              Desaturated, clinical-grade analysis combining subjective responses, text semantics, and vocal biomarkers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ClipboardList,
                title: 'PHQ-9 Clinical Questionnaire',
                desc: 'Standardized 9-question depression severity metric used by healthcare professionals worldwide.',
                color: 'text-[#A3CEF1]',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20'
              },
              {
                icon: Brain,
                title: 'MentalBERT Text Analysis',
                desc: 'Specialized transformer model fine-tuned on mental health domain texts for subtle sentiment extraction.',
                color: 'text-[#81B29A]',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20'
              },
              {
                icon: Mic,
                title: 'Voice Acoustic Biomarkers',
                desc: 'Extracts pitch variability, MFCCs, and spectral energy to identify acoustic indicators of distress.',
                color: 'text-[#C6ACD6]',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:-translate-y-1.5 transition-transform duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-100">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 mb-20 relative z-20">
          <div className="glass p-10 sm:p-14 rounded-3xl border-white/10 relative overflow-hidden">
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-slate-100">
                How MindScreen Works
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                3 effortless steps to complete your wellness screening session.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { step: '01', title: 'Complete PHQ-9', desc: 'Select ratings for 9 clinical questions regarding your recent mood and energy levels.' },
                { step: '02', title: 'Write Your Thoughts', desc: 'Express your feelings in a short journal response. MentalBERT analyzes semantic patterns.' },
                { step: '03', title: 'Voice Check-In', desc: 'Speak naturally for 15-30 seconds. Audio feature extraction measures acoustic stability.' }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && <div className="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-slate-700/50 to-transparent" />}
                  <div className="text-5xl font-black text-slate-600/40 mb-3 font-mono">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#12131C] relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Brain className="text-[#A3CEF1] w-5 h-5" />
              <span className="text-xl font-bold tracking-tight text-slate-200">MindScreen</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#81B29A] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Preserving • Confidential Analysis</span>
            </div>
          </div>
          
          <div className="text-center md:text-left text-xs text-slate-500 border-t border-white/5 pt-8 leading-relaxed">
            <p className="mb-2">
              <strong className="text-slate-400">Clinical Disclaimer:</strong> MindScreen is an AI-assisted screening research platform intended solely for preliminary wellness assessment. It is not a diagnostic tool and does not constitute medical advice.
            </p>
            <p>If you or someone you know is in crisis, please contact local emergency services or call a mental health crisis line immediately.</p>
            <p className="mt-6 text-slate-600">© {new Date().getFullYear()} MindScreen Platform (RVITM BCS685). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
