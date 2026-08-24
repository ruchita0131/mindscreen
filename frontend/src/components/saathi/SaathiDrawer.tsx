import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Heart, Wind, RefreshCw, MessageSquare, Play } from 'lucide-react';
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

export const SaathiDrawer: React.FC<SaathiDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'saathi',
      content: "Namaste 🌿 I'm Saathi.\nI'm here to listen, help you reflect, or simply sit with you for a while.\n\nWhat's on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isLoading]);

  const quickPrompts = [
    "I get so stressed talking to my family.",
    "Feeling overwhelmed by exam pressure & future expectation.",
    "My mind is racing and I can't fall asleep.",
    "I need a quiet moment to breathe and reset.",
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

      const saathiReply: ChatMessage = {
        id: `saathi-${Date.now()}`,
        sender: 'saathi',
        content: res.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommended_activity: res.data.recommended_activity,
        crisis_flag: res.data.crisis_flag,
        helpline_info: res.data.helpline_info,
      };

      setMessages((prev) => [...prev, saathiReply]);
    } catch (err) {
      console.error("Saathi error:", err);
      const fallbackMsg: ChatMessage = {
        id: `saathi-fb-${Date.now()}`,
        sender: 'saathi',
        content: "I'm right here with you. Take a gentle breath. You don't have to carry everything all at once.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommended_activity: {
          title: "Guided Calm Breathwork",
          category: "Relaxation",
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
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] pointer-events-auto flex justify-end">
            
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            />

            {/* Sliding Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md bg-[#FAF7F2] text-[#2D3B30] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#D4E0CC]"
            >
              
              {/* Drawer Header */}
              <div className="p-5 bg-[#E3EBDC] border-b border-[#D4E0CC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3A4D3F] flex items-center justify-center text-[#E3EBDC] shadow-sm">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#2D3B30] leading-tight">
                      Saathi
                    </h2>
                    <p className="text-xs text-[#526656] font-medium">Your wellbeing companion</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/60 hover:bg-white text-[#2D3B30] flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'saathi' && (
                      <div className="w-7 h-7 rounded-full bg-[#6E8B74] text-white flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-xs">
                        🌿
                      </div>
                    )}

                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-[#3A4D3F] text-[#FAF7F2] font-medium rounded-tr-xs'
                        : 'bg-white text-[#2D3B30] border border-[#E3EBDC] rounded-tl-xs'
                    }`}>
                      <p className="whitespace-pre-line font-medium">{m.content}</p>

                      {/* Recommended Activity Card */}
                      {m.recommended_activity && (
                        <div className="mt-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#D4E0CC] flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#E3EBDC] flex items-center justify-center text-[#3A4D3F]">
                              <Wind className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#2D3B30]">{m.recommended_activity.title}</p>
                              <p className="text-[10px] text-[#526656]">{m.recommended_activity.category} • {m.recommended_activity.duration}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowBreathingModal(true)}
                            className="px-2.5 py-1 rounded-full bg-[#3A4D3F] hover:bg-[#2D3B30] text-[#FAF7F2] font-bold text-[11px] flex items-center gap-1 transition-all"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" /> Start
                          </button>
                        </div>
                      )}

                      <div className={`text-[10px] text-right ${m.sender === 'user' ? 'text-[#FAF7F2]/70' : 'text-[#526656]/70'}`}>
                        {m.timestamp}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#526656] italic">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saathi is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-5 py-2 border-t border-[#E3EBDC] bg-[#F7F4EE] flex gap-2 overflow-x-auto no-scrollbar">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(qp)}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#D4E0CC] hover:bg-[#E3EBDC] text-[11px] font-semibold text-[#3A4D3F] whitespace-nowrap transition-all shadow-2xs"
                  >
                    🌿 {qp.length > 28 ? qp.substring(0, 28) + '...' : qp}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-4 bg-white border-t border-[#E3EBDC] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Talk to Saathi..."
                  className="flex-1 bg-[#FAF7F2] border border-[#D4E0CC] focus:border-[#3A4D3F] rounded-full px-4 py-2.5 text-xs text-[#2D3B30] placeholder-[#526656]/60 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-[#3A4D3F] hover:bg-[#2D3B30] disabled:opacity-40 text-[#FAF7F2] font-bold flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GuidedBreathingModal isOpen={showBreathingModal} onClose={() => setShowBreathingModal(false)} />
    </>
  );
};
