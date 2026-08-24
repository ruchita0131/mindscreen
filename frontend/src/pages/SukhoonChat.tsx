import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Heart, Brain, Wind, ShieldAlert, RefreshCw, MessageSquare, Play } from 'lucide-react';
import { apiClient } from '../api/client';
import { GuidedBreathingModal } from '../components/tools/GuidedBreathingModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'sukhoon';
  content: string;
  timestamp: string;
  recommended_activity?: {
    title: string;
    category: string;
    duration: string;
    action_type: string;
  };
  crisis_flag?: boolean;
  helpline_info?: string;
}

export default function SukhoonChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'sukhoon',
      content: "Namaste 🌿 I'm Saathi.\nI'm here to listen, help you reflect, or simply sit with you for a while.\n\nWhat's on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: "🗣️ Stress talking to family", text: "I get so stressed talking to my parents. It always ends in an argument." },
    { label: "📚 Exam & career pressure", text: "I'm feeling really overwhelmed by exam marks and future expectations." },
    { label: "🌙 Mind racing at night", text: "My mind is racing with thoughts and I can't fall asleep." },
    { label: "🧘 Need quick breathing", text: "I'm feeling anxious right now and need a grounding breathing exercise." },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/api/chat/companion', {
        message: query,
        history: messages.map((m) => ({ sender: m.sender, content: m.content })),
      });

      const sukhoonReply: ChatMessage = {
        id: `sukhoon-${Date.now()}`,
        sender: 'sukhoon',
        content: res.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommended_activity: res.data.recommended_activity,
        crisis_flag: res.data.crisis_flag,
        helpline_info: res.data.helpline_info,
      };

      setMessages((prev) => [...prev, sukhoonReply]);
    } catch (err) {
      console.error("Saathi companion error:", err);
      const fallbackMsg: ChatMessage = {
        id: `sukhoon-fb-${Date.now()}`,
        sender: 'sukhoon',
        content: "I'm right here with you. Take a slow, deep breath with me. Things may feel heavy right now, but you don't have to carry them alone.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommended_activity: {
          title: "Pranayama 4-7-8 Relaxation",
          category: "Calming Breathwork",
          duration: "4 min",
          action_type: "breathing"
        }
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* ── HEADER — SAATHI WELLBEING COMPANION ── */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-[#81B29A]/30">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#81B29A]/20 border border-[#81B29A]/40 text-[#94D2BD] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saathi 🌿 • Your Wellbeing Companion</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl italic text-[#FFE8C2]">
            Namaste 🌿 Talk to Saathi
          </h1>
          <p className="text-sm text-[#F0C0C6] font-medium max-w-xl">
            I'm here to listen, help you reflect, or simply sit with you for a while. Share whatever is on your mind today.
          </p>
        </div>


        {/* Floating Glowing Companion Orb */}
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFB703]/30 via-[#F4A261]/30 to-[#81B29A]/30 blur-xl"
          />
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FFB703] via-[#F4A261] to-[#81B29A] flex items-center justify-center shadow-lg border-2 border-white/30 relative z-10">
            <Heart className="w-7 h-7 text-slate-950 fill-slate-950/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── QUICK EMOTIONAL UNPACKING PROMPTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((p, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSendMessage(p.text)}
            className="p-3.5 rounded-2xl bg-[#241D2B]/90 border border-[#81B29A]/30 hover:border-[#81B29A] text-left transition-all text-xs font-semibold text-[#94D2BD] flex items-center justify-between group shadow-md"
          >
            <span>{p.label}</span>
            <MessageSquare className="w-3.5 h-3.5 text-[#F0C0C6] group-hover:text-[#94D2BD] transition-colors" />
          </motion.button>
        ))}
      </div>

      {/* ── CHAT THREAD WINDOW ── */}
      <div className="glass-card p-6 min-h-[480px] max-h-[560px] flex flex-col justify-between border-[#81B29A]/30 relative overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Sukhoon Companion Avatar */}
                {m.sender === 'sukhoon' && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#81B29A] flex items-center justify-center flex-shrink-0 text-slate-950 font-bold text-xs shadow-md mt-1">
                    <Brain className="w-4 h-4 text-slate-950" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[82%] sm:max-w-[70%] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 ${
                  m.sender === 'user'
                    ? 'bg-[#81B29A] text-slate-950 font-semibold rounded-tr-none'
                    : 'bg-[#241D2B] border border-[#81B29A]/30 text-[#F0C0C6] rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line font-medium">
                    {m.content}
                  </p>

                  {/* Crisis Notice If Triggered */}
                  {m.crisis_flag && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-300">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Immediate Crisis Support Available (India 24/7)</span>
                      </div>
                      <p className="font-normal text-[11px] leading-tight">{m.helpline_info}</p>
                    </div>
                  )}

                  {/* Embedded Recommended Activity Card (Image 2 style) */}
                  {m.recommended_activity && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="p-3.5 rounded-xl bg-[#1B1622] border border-[#81B29A]/40 flex items-center justify-between gap-3 shadow-md mt-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#81B29A]/20 flex items-center justify-center">
                          <Wind className="w-4 h-4 text-[#94D2BD]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#FFE8C2]">{m.recommended_activity.title}</p>
                          <p className="text-[10px] text-[#94D2BD]">{m.recommended_activity.category} • {m.recommended_activity.duration}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowBreathingModal(true)}
                        className="px-3 py-1.5 rounded-full bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <Play className="w-3 h-3 fill-slate-950" /> Start
                      </button>
                    </motion.div>
                  )}

                  <div className={`text-[10px] text-right ${m.sender === 'user' ? 'text-slate-900/70' : 'text-[#94D2BD]/60'}`}>
                    {m.timestamp}
                  </div>
                </div>

                {/* User Avatar */}
                {m.sender === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-[#FFE8C2] text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                    You
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#81B29A] flex items-center justify-center text-slate-950 font-bold text-xs">
                <Brain className="w-4 h-4 text-slate-950" />
              </div>
              <div className="p-4 rounded-2xl bg-[#241D2B] border border-[#81B29A]/30 text-[#94D2BD] text-xs font-semibold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sukhoon is reflecting on your words...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-3 pt-3 border-t border-[#81B29A]/20"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Unpack what's on your mind with Sukhoon..."
            className="flex-1 bg-[#1B1622] border border-[#81B29A]/30 focus:border-[#94D2BD] rounded-full px-5 py-3.5 text-sm text-[#FFE8C2] placeholder-[#E8B4B8]/60 focus:outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-[#81B29A] hover:bg-[#94D2BD] disabled:opacity-40 text-slate-950 font-bold flex items-center justify-center transition-all shadow-lg flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Full-Screen 432Hz Sanctuary Breathing Portal */}
      <GuidedBreathingModal isOpen={showBreathingModal} onClose={() => setShowBreathingModal(false)} />
    </div>
  );
}
