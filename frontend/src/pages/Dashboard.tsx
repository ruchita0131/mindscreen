import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Mic, 
  Flame, 
  ChevronRight, 
  Calendar, 
  Wind, 
  Sparkles, 
  Heart, 
  ArrowUpRight 
} from 'lucide-react';
import { GuidedBreathingModal } from '../components/tools/GuidedBreathingModal';
import { useAuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showBreathingModal, setShowBreathingModal] = useState(false);

  const userName = user?.email ? user.email.split('@')[0] : 'Ruchita';

  const moodOptions = [
    { label: "I'm Good",       emoji: '😃', bg: 'bg-[#E3EBDC]', text: 'text-[#2D3B30]', border: 'border-[#D4E0CC]' },
    { label: "I'm Okay",       emoji: '😐', bg: 'bg-[#FCEAD2]', text: 'text-[#6E4F28]', border: 'border-[#F8D8B0]' },
    { label: "I'm Low",        emoji: '🙁', bg: 'bg-[#ECE7F2]', text: 'text-[#4A3D5A]', border: 'border-[#DCD0E8]' },
    { label: "I'm Struggling", emoji: '😫', bg: 'bg-[#FDF0ED]', text: 'text-[#7A3E34]', border: 'border-[#F8DFD8]' },
  ];

  const recentCheckins = [
    { date: 'May 10', score: 'PHQ-9: 4', level: 'Minimal', badgeBg: 'bg-[#E3EBDC]', badgeText: 'text-[#2D3B30]' },
    { date: 'May 7',  score: 'PHQ-9: 6', level: 'Mild',    badgeBg: 'bg-[#FCEAD2]', badgeText: 'text-[#6E4F28]' },
    { date: 'May 4',  score: 'PHQ-9: 9', level: 'Mild',    badgeBg: 'bg-[#FCEAD2]', badgeText: 'text-[#6E4F28]' },
    { date: 'May 1',  score: 'PHQ-9: 12',level: 'Moderate',badgeBg: 'bg-[#FDF0ED]', badgeText: 'text-[#7A3E34]' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-[#2D3B30]">
      
      {/* ── GREETING & MOOD CHECK-IN ── */}
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#2D3B30] flex items-center gap-3">
            <span>Good morning, {userName}</span>
            <span className="text-3xl">🌿</span>
          </h1>
          <p className="text-sm font-medium text-[#526656] mt-1">
            How are you feeling today?
          </p>
        </div>

        {/* Mood Selector Pills */}
        <div className="flex flex-wrap gap-3 pt-1">
          {moodOptions.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelectedMood(m.label)}
              className={`px-5 py-3 rounded-2xl border ${m.bg} ${m.text} ${m.border} font-bold text-xs flex items-center gap-2.5 transition-all shadow-2xs ${
                selectedMood === m.label ? 'ring-2 ring-[#3A4D3F] scale-105' : 'hover:scale-102'
              }`}
            >
              <span className="text-base">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TOP ROW CARDS (Journal, Voice, Streak) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Mindful Journal */}
        <div 
          onClick={() => navigate('/mood')}
          className="p-6 rounded-3xl bg-[#E3EBDC]/70 border border-[#D4E0CC] hover:bg-[#E3EBDC] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3A4D3F]/10 flex items-center justify-center text-[#3A4D3F]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D3B30]">Mindful Journal</h3>
              <p className="text-xs text-[#526656] font-medium mt-0.5">3 entries this week • Express & reflect</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#3A4D3F] group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Voice Reflection */}
        <div 
          onClick={() => navigate('/assessment')}
          className="p-6 rounded-3xl bg-[#ECE7F2]/70 border border-[#DCD0E8] hover:bg-[#ECE7F2] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4A3D5A]/10 flex items-center justify-center text-[#4A3D5A]">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D3B30]">Voice Reflection</h3>
              <p className="text-xs text-[#526656] font-medium mt-0.5">Your latest reflection is ready to view</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#4A3D5A] group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Self-care Streak */}
        <div 
          onClick={() => navigate('/mood')}
          className="p-6 rounded-3xl bg-[#FDF0ED]/70 border border-[#F8DFD8] hover:bg-[#FDF0ED] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7A3E34]/10 flex items-center justify-center text-[#7A3E34]">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2D3B30]">Self-care Streak</h3>
              <p className="text-xs text-[#526656] font-medium mt-0.5">5 day check-in streak • Showing up for yourself</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#7A3E34] group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* ── MIDDLE ROW: WELLBEING JOURNEY & RECENT CHECK-INS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 cols): Your Wellbeing Journey Chart */}
        <div className="lg:col-span-8 p-7 rounded-3xl bg-white border border-[#E3EBDC] shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif text-xl font-bold text-[#2D3B30]">Your wellbeing journey</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E3EBDC] text-[#526656]">
                Last 10 days ▾
              </span>
            </div>
            <p className="text-xs text-[#526656] font-medium">Here's how you've been feeling over the past 10 days.</p>
          </div>

          {/* SVG Journey Curve Chart */}
          <div className="relative py-4">
            <div className="flex justify-between items-center text-[10px] text-[#526656] font-bold pb-2 border-b border-dashed border-[#E3EBDC]">
              <span>Doing well</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#526656] font-bold py-6 border-b border-dashed border-[#E3EBDC]">
              <span>Okay</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#7A3E34] font-bold pt-2">
              <span>Finding it difficult</span>
            </div>

            {/* Smooth Sage Green Trend Line */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <path
                d="M 50 70 Q 150 40 250 55 T 450 75 T 650 60"
                fill="none"
                stroke="#6E8B74"
                strokeWidth="3"
              />
              <circle cx="50"  cy="70" r="5" fill="#6E8B74" />
              <circle cx="170" cy="48" r="5" fill="#6E8B74" />
              <circle cx="290" cy="55" r="5" fill="#6E8B74" />
              <circle cx="410" cy="72" r="5" fill="#6E8B74" />
              <circle cx="530" cy="65" r="5" fill="#6E8B74" />
              <circle cx="650" cy="60" r="5" fill="#6E8B74" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-[#526656] font-semibold pt-2 px-2">
            <span>May 1</span>
            <span>May 3</span>
            <span>May 5</span>
            <span>May 7</span>
            <span>May 9</span>
            <span>May 10</span>
          </div>

          {/* Bottom Encouragement Banner */}
          <div className="p-3.5 rounded-2xl bg-[#E3EBDC] border border-[#D4E0CC] text-xs font-bold text-[#3A4D3F] flex items-center gap-2">
            <span>🌿</span>
            <span>You've been feeling better lately. Keep taking care of yourself! 💚</span>
          </div>
        </div>

        {/* Right (4 cols): Your Recent Check-ins */}
        <div className="lg:col-span-4 p-7 rounded-3xl bg-white border border-[#E3EBDC] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-[#2D3B30]">Your recent check-ins</h3>
              <button 
                onClick={() => navigate('/history')}
                className="text-xs font-semibold text-[#526656] hover:text-[#3A4D3F]"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recentCheckins.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => navigate('/history')}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E3EBDC] hover:border-[#6E8B74] transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#2D3B30]">{item.date}</p>
                    <p className="text-[11px] text-[#526656] font-medium">{item.score}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.badgeBg} ${item.badgeText}`}>
                      {item.level}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#526656] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => navigate('/history')}
            className="w-full py-3 rounded-2xl bg-[#FDF0ED] hover:bg-[#F8DFD8] text-[#7A3E34] font-bold text-xs transition-all shadow-2xs"
          >
            View complete history
          </button>
        </div>

      </div>

      {/* ── BOTTOM ROW: 3 ACTION CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Complete a check-in */}
        <div 
          onClick={() => navigate('/assessment')}
          className="p-6 rounded-3xl bg-[#E3EBDC]/80 border border-[#D4E0CC] hover:bg-[#E3EBDC] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3A4D3F]/10 flex items-center justify-center text-[#3A4D3F]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2D3B30]">Complete a check-in</h4>
              <p className="text-xs text-[#526656] font-medium mt-0.5">Understand how you've been feeling</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#3A4D3F] group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Take a moment to breathe */}
        <div 
          onClick={() => setShowBreathingModal(true)}
          className="p-6 rounded-3xl bg-[#FDF0ED]/80 border border-[#F8DFD8] hover:bg-[#FDF0ED] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7A3E34]/10 flex items-center justify-center text-[#7A3E34]">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2D3B30]">Take a moment to breathe</h4>
              <p className="text-xs text-[#526656] font-medium mt-0.5">Calm your mind with guided breathing</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#7A3E34] group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Explore self-care */}
        <div 
          onClick={() => navigate('/mood')}
          className="p-6 rounded-3xl bg-[#FCEAD2]/80 border border-[#F8D8B0] hover:bg-[#FCEAD2] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6E4F28]/10 flex items-center justify-center text-[#6E4F28]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2D3B30]">Explore self-care</h4>
              <p className="text-xs text-[#526656] font-medium mt-0.5">Small steps to take care of yourself</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#6E4F28] group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      <GuidedBreathingModal isOpen={showBreathingModal} onClose={() => setShowBreathingModal(false)} />
    </div>
  );
}
