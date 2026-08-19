import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Brain, Mic, ClipboardList, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white overflow-x-hidden relative font-sans">
      {/* Animated Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-teal/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-purple/20 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center">
            <Brain className="text-brand-tealL w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-gradient">MindScreen</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-brand-teal hover:bg-brand-tealL text-white shadow-[0_0_20px_rgba(10,147,150,0.3)] hover:shadow-[0_0_30px_rgba(148,210,189,0.5)] transition-all rounded-full px-6"
          >
            Enter Demo
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Next-Gen Mental Health Screening</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              AI-Powered <br/>
              <span className="text-gradient">Multimodal Screening</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              MindScreen combines clinical questionnaires, advanced text analysis, and voice acoustics to provide a comprehensive mental wellness assessment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-brand-teal hover:bg-brand-tealL text-white text-lg px-8 py-6 rounded-full glow-teal transition-all flex items-center gap-2 w-full sm:w-auto"
              >
                Start Your Assessment <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full w-full sm:w-auto transition-all"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Holistic Approach</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We analyze multiple facets of your well-being for a more accurate understanding.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ClipboardList,
                title: 'PHQ-9 Clinical Assessment',
                desc: 'The gold standard 9-question depression screening tool used by medical professionals worldwide.',
                color: 'text-brand-amber',
                bg: 'bg-brand-amber/10',
                border: 'border-brand-amber/20'
              },
              {
                icon: Brain,
                title: 'MentalBERT AI Analysis',
                desc: 'Advanced natural language processing analyzes your journal entries to detect subtle emotional cues.',
                color: 'text-brand-tealL',
                bg: 'bg-brand-teal/10',
                border: 'border-brand-teal/20'
              },
              {
                icon: Mic,
                title: 'Voice Acoustic Analysis',
                desc: 'Cutting-edge models extract MFCCs and pitch data to identify acoustic biomarkers of depression.',
                color: 'text-purple-400',
                bg: 'bg-purple-400/10',
                border: 'border-purple-400/20'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-32">
          <div className="glass p-12 rounded-3xl border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 blur-[80px]" />
            
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to gain insights into your mental health.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { step: '01', title: 'Complete PHQ-9', desc: 'Answer 9 multiple-choice questions about how you\'ve been feeling recently.' },
                { step: '02', title: 'Write Your Thoughts', desc: 'Briefly journal about your current emotional state in your own words.' },
                { step: '03', title: 'Record Your Voice', desc: 'Speak freely for 15-30 seconds. Our AI will analyze your voice acoustics safely and privately.' }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && <div className="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-brand-teal/50 to-transparent" />}
                  <div className="text-6xl font-black text-white/5 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a1520] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Brain className="text-brand-tealL w-5 h-5" />
              <span className="text-xl font-bold">MindScreen</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy First • Data Encrypted</span>
            </div>
          </div>
          
          <div className="text-center md:text-left text-sm text-gray-500 border-t border-white/5 pt-8">
            <p className="mb-2">
              <strong>Disclaimer:</strong> MindScreen is an AI-powered research platform designed for preliminary screening purposes only. 
              It is not a diagnostic tool and does not replace professional medical advice, diagnosis, or treatment.
            </p>
            <p>If you are in crisis, please seek immediate help from a healthcare professional or contact a local emergency service.</p>
            <p className="mt-6">© {new Date().getFullYear()} MindScreen Platform (RVITM BCS685). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
