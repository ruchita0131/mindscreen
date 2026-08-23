import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { SereneMoonBackground } from '../components/ui/SereneMoonBackground';
import { Brain, Mic, ClipboardList, ArrowRight, ShieldCheck, Moon, Sparkles, Heart } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F141C] text-slate-100 overflow-x-hidden relative font-sans">
      {/* Serene Moon Background Animation */}
      <SereneMoonBackground />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center backdrop-blur-md">
            <Brain className="text-[#A3CEF1] w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gradient">MindScreen</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold shadow-[0_0_20px_rgba(129,178,154,0.3)] hover:shadow-[0_0_30px_rgba(148,210,189,0.5)] transition-all rounded-full px-6"
          >
            Enter Sanctuary
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        {/* Hero Section with Serene Moon Visualizer */}
        <section className="text-center max-w-4xl mx-auto mb-28 relative">
          
          {/* Animated Moon Visualizer in Hero */}
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto mb-10 flex items-center justify-center">
            
            {/* Outer Halo Wave */}
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-400/20 via-blue-300/20 to-purple-300/20 blur-2xl pointer-events-none"
            />

            {/* Moon Ripple Ring 1 */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
                scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-purple-200/20 bg-white/[0.02] backdrop-blur-xs"
            />

            {/* Glowing Moon Sphere */}
            <motion.div
              animate={{
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#7EB2DD] via-[#A3CEF1] to-[#C6ACD6] flex items-center justify-center shadow-[0_0_50px_rgba(163,206,241,0.4)] relative z-10 border border-white/30"
            >
              <Moon className="w-14 h-14 sm:w-16 sm:h-16 text-slate-900 drop-shadow-md" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-[#A3CEF1] animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-slate-300">
                Clinically Grounded • Soft Calming Tones
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              AI-Powered <br/>
              <span className="text-gradient">Multimodal Mental Health Screening</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto font-normal">
              MindScreen integrates PHQ-9 clinical guidelines, MentalBERT language models, and vocal acoustic analysis into a calm, desaturated, low-cognitive-load space designed for mental peace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-base px-8 py-5 rounded-full shadow-[0_0_25px_rgba(129,178,154,0.3)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start Assessment <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                className="border-slate-700/60 text-slate-200 hover:bg-slate-800/50 text-base px-8 py-5 rounded-full w-full sm:w-auto transition-all backdrop-blur-md"
              >
                Explore Clinical Features
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mb-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">A Holistic Tri-Modal Approach</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">Combining subjective response, text semantics, and vocal biomarkers for multi-layered insight.</p>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:-translate-y-1.5 transition-transform duration-300 border-slate-800/80"
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

        {/* How it Works */}
        <section className="mb-24">
          <div className="glass p-10 sm:p-14 rounded-3xl border-slate-800/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none" />
            
            <div className="text-center mb-14 relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">How MindScreen Works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">3 effortless steps to complete your screening session.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { step: '01', title: 'Complete PHQ-9', desc: 'Select ratings for 9 clinical questions regarding your recent mood and energy levels.' },
                { step: '02', title: 'Write Your Thoughts', desc: 'Express your feelings in a short journal response. MentalBERT analyzes semantic patterns.' },
                { step: '03', title: 'Voice Check-In', desc: 'Speak naturally for 15-30 seconds. Audio feature extraction measures acoustic stability.' }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && <div className="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-slate-700/50 to-transparent" />}
                  <div className="text-5xl font-black text-slate-700/40 mb-3 font-mono">{item.step}</div>
                  <h3 className="text-lg font-bold mb-2 text-slate-100">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F17] relative z-10">
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
          
          <div className="text-center md:text-left text-xs text-slate-500 border-t border-slate-800/60 pt-8 leading-relaxed">
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
