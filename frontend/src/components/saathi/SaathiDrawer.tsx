import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Wind, RefreshCw, Play, AlertTriangle, Phone } from 'lucide-react';
import { apiClient } from '../../api/client';
import { GuidedBreathingModal } from '../tools/GuidedBreathingModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'saathi';
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

interface SaathiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "I feel so stressed talking to my family.",
  "Exam pressure is getting too much.",
  "My mind won't stop at night.",
  "I just need someone to talk to.",
];

export const SaathiDrawer: React.FC<SaathiDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'saathi',
      content: "Namaste 🌿 I'm Saathi.\nI'm here to listen, help you reflect, or simply sit with you for a while.\n\nWhat's on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMsg, setInputMsg]           = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const sendMessage = async (text: string, currentMessages: ChatMessage[]) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...currentMessages, userMsg];
    setMessages(updatedMessages);
    setInputMsg('');
    setIsLoading(true);

    try {
      // Send history WITHOUT the current message (backend appends it)
      const historyPayload = currentMessages.map((m) => ({
        sender: m.sender,
        content: m.content,
      }));

      const res = await apiClient.post('/api/chat/companion', {
        message: text.trim(),
        history: historyPayload,
      });

      const saathiMsg: ChatMessage = {
        id: `saathi-${Date.now()}`,
        sender: 'saathi',
        content: res.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommended_activity: res.data.recommended_activity,
        crisis_flag: res.data.crisis_flag,
        helpline_info: res.data.helpline_info,
      };

      setMessages((prev) => [...prev, saathiMsg]);
    } catch (err: any) {
      console.error('Saathi API error:', err);
      const errMsg: ChatMessage = {
        id: `saathi-err-${Date.now()}`,
        sender: 'saathi',
        content:
          "I'm right here with you. Take a gentle breath — you don't have to carry everything at once. Could you try sharing that again?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommended_activity: {
          title: 'Guided Calm Breathwork',
          category: 'Relaxation',
          duration: '4 min',
          action_type: 'breathing',
        },
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMsg, messages);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt, messages);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex justify-end pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#1B1622] flex flex-col h-full shadow-2xl z-10 border-l border-[#81B29A]/25"
            >
              {/* ── Header ── */}
              <div className="px-5 py-4 bg-[#241D2B] border-b border-[#81B29A]/20 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#81B29A]/20 border border-[#81B29A]/40 flex items-center justify-center">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#FFE8C2] leading-none">Saathi</h2>
                    <p className="text-xs text-[#94D2BD] mt-0.5">Your wellbeing companion</p>
                  </div>
                </div>
                {/* Online indicator + close */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#94D2BD]">
                    <span className="w-1.5 h-1.5 bg-[#94D2BD] rounded-full animate-pulse" />
                    Online
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FFE8C2] flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Message Thread ── */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Saathi avatar */}
                    {m.sender === 'saathi' && (
                      <div className="w-7 h-7 rounded-full bg-[#81B29A] flex items-center justify-center text-xs flex-shrink-0 mt-1">
                        🌿
                      </div>
                    )}

                    <div className="max-w-[88%] space-y-2">
                      {/* Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-[#81B29A] text-slate-950 font-semibold rounded-tr-sm'
                            : 'bg-[#241D2B] text-[#F0C0C6] border border-[#81B29A]/25 rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{m.content}</p>
                      </div>

                      {/* Crisis Banner */}
                      {m.crisis_flag && m.helpline_info && (
                        <div className="rounded-xl bg-red-950/50 border border-red-500/40 p-3 space-y-2">
                          <div className="flex items-center gap-1.5 text-red-300 text-xs font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Immediate Support Available
                          </div>
                          {m.helpline_info.split(' | ').map((line, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-red-200">
                              <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Activity Card */}
                      {m.recommended_activity && !m.crisis_flag && (
                        <div className="rounded-xl bg-[#1B1622] border border-[#81B29A]/30 p-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#81B29A]/15 flex items-center justify-center text-[#94D2BD] flex-shrink-0">
                              <Wind className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#FFE8C2] leading-tight">
                                {m.recommended_activity.title}
                              </p>
                              <p className="text-[10px] text-[#94D2BD]">
                                {m.recommended_activity.category} · {m.recommended_activity.duration}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowBreathing(true)}
                            className="px-2.5 py-1 rounded-full bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all flex-shrink-0"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            Start
                          </button>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className={`text-[10px] ${m.sender === 'user' ? 'text-right text-slate-500' : 'text-[#94D2BD]/60'}`}>
                        {m.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#81B29A] flex items-center justify-center text-xs flex-shrink-0">
                      🌿
                    </div>
                    <div className="bg-[#241D2B] border border-[#81B29A]/25 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-[#94D2BD] animate-spin" />
                      <span className="text-xs text-[#94D2BD] italic">Saathi is thinking...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick Prompts ── */}
              <div className="px-4 py-2.5 border-t border-[#81B29A]/15 bg-[#241D2B]/60 flex gap-2 overflow-x-auto">
                {QUICK_PROMPTS.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(qp)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-full bg-[#1B1622] border border-[#81B29A]/30 hover:border-[#81B29A]/60 disabled:opacity-40 text-[11px] font-semibold text-[#94D2BD] whitespace-nowrap transition-all flex-shrink-0"
                  >
                    🌿 {qp.length > 26 ? qp.slice(0, 26) + '…' : qp}
                  </button>
                ))}
              </div>

              {/* ── Input Bar ── */}
              <form
                onSubmit={handleSubmit}
                className="p-4 bg-[#1B1622] border-t border-[#81B29A]/20 flex items-center gap-2 flex-shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Talk to Saathi..."
                  disabled={isLoading}
                  className="flex-1 bg-[#241D2B] border border-[#81B29A]/30 focus:border-[#94D2BD] rounded-full px-4 py-2.5 text-sm text-[#FFE8C2] placeholder-[#F0C0C6]/50 focus:outline-none transition-all disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-[#81B29A] hover:bg-[#94D2BD] disabled:opacity-40 text-slate-950 flex items-center justify-center transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Breathing Modal — rendered via portal to document.body */}
      <GuidedBreathingModal isOpen={showBreathing} onClose={() => setShowBreathing(false)} />
    </>
  );
};
