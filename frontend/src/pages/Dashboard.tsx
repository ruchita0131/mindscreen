import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';
import { Plus, TrendingUp, Heart, Wind, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GuidedBreathingModal } from '../components/tools/GuidedBreathingModal';

const mockHistory = [
  { id: 1, date: 'Aug 1', score: 12, risk_level: 'Moderate' },
  { id: 2, date: 'Aug 4', score: 9, risk_level: 'Mild' },
  { id: 3, date: 'Aug 7', score: 6, risk_level: 'Mild' },
  { id: 4, date: 'Aug 10', score: 4, risk_level: 'Minimal' },
];

const RISK_BADGES: Record<string, { label: string; text: string; bg: string; border: string }> = {
  minimal:  { label: 'Minimal Risk',  text: 'text-emerald-300', bg: 'bg-emerald-400/10', border: 'border-emerald-400/25' },
  mild:     { label: 'Mild Risk',     text: 'text-amber-300',   bg: 'bg-amber-400/10',   border: 'border-amber-400/25' },
  moderate: { label: 'Moderate Risk', text: 'text-orange-300',  bg: 'bg-orange-400/10',  border: 'border-orange-400/25' },
  severe:   { label: 'Severe Risk',   text: 'text-rose-300',    bg: 'bg-rose-500/10',    border: 'border-rose-500/25' },
};

export default function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [history] = useState(mockHistory);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);

  const latest = history[history.length - 1];
  const latestStyle = RISK_BADGES[latest.risk_level.toLowerCase()] || RISK_BADGES.minimal;

  return (
    <div className="space-y-6 animate-in relative z-10">

      {/* Guided Breathing Modal */}
      <GuidedBreathingModal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />

      {/* ── CLEAN WELCOME HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#81B29A]/15">
        <div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#FFE8C2]">
            Welcome back, {user?.email?.split('@')[0] || 'Friend'}
          </h1>
          <p className="text-xs sm:text-sm text-[#F0C0C6]/80 mt-1">
            Here is your personal emotional equilibrium overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsBreathingOpen(true)}
            className="bg-[#241D2B] hover:bg-[#2c2335] text-[#94D2BD] border border-[#81B29A]/30 text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-2"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>4-7-8 Breath</span>
          </Button>

          <Button
            onClick={() => navigate('/assessment')}
            className="bg-[#81B29A] hover:bg-[#94D2BD] text-slate-950 font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(129,178,154,0.3)] transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Screening</span>
          </Button>
        </div>
      </div>

      {/* ── 3 KEY METRIC HIGHLIGHTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Latest State */}
        <div className="glass-card p-5 border-[#81B29A]/20">
          <p className="text-[11px] uppercase tracking-wider text-[#94D2BD] font-semibold mb-2">Current Status</p>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${latestStyle.text} ${latestStyle.bg} ${latestStyle.border}`}>
              {latestStyle.label}
            </span>
            <span className="text-xs text-[#E8B4B8]/60">Score: {latest.score}/27</span>
          </div>
        </div>

        {/* Longitudinal Trajectory */}
        <div className="glass-card p-5 border-[#81B29A]/20">
          <p className="text-[11px] uppercase tracking-wider text-[#94D2BD] font-semibold mb-2">Trajectory</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-[#FFE8C2]">Improving Steady</span>
            <span className="text-xs text-emerald-400/80 ml-auto">-67% severity</span>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="glass-card p-5 border-[#81B29A]/20">
          <p className="text-[11px] uppercase tracking-wider text-[#94D2BD] font-semibold mb-2">Reflective Consistency</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#FFE8C2]">4 Screenings Completed</span>
            <span className="text-xs text-[#94D2BD]">Aug 10</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CHART + RECENT TIMELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 border-[#81B29A]/25">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#94D2BD]" />
              <h2 className="text-sm font-bold tracking-wide text-[#FFE8C2] uppercase">PHQ-9 Severity Trajectory</h2>
            </div>
            <span className="text-[11px] text-[#94D2BD] bg-[#81B29A]/10 border border-[#81B29A]/20 px-3 py-0.5 rounded-full">
              Past 30 Days
            </span>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#81B29A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#81B29A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(129, 178, 154, 0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#81B29A" tick={{ fill: '#C6ACD6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#81B29A" tick={{ fill: '#C6ACD6', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 20]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#241D2B', borderColor: 'rgba(129, 178, 154, 0.3)', borderRadius: '12px', color: '#FFE8C2', fontSize: '12px' }}
                  itemStyle={{ color: '#94D2BD' }}
                  formatter={(val: number) => [`${val} / 27`, 'PHQ-9 Score']}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#81B29A" 
                  strokeWidth={2} 
                  fill="url(#scoreGrad)"
                  dot={{ fill: '#81B29A', strokeWidth: 2, r: 4, stroke: '#1B1622' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#FFE8C2' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Screenings Mini-list */}
        <div className="glass-card p-6 border-[#81B29A]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-wide text-[#FFE8C2] uppercase">Recent Sessions</h2>
              <span className="text-[10px] text-[#E8B4B8]/60">4 total</span>
            </div>

            <div className="space-y-2.5">
              {history.slice().reverse().map((item) => {
                const badge = RISK_BADGES[item.risk_level.toLowerCase()] || RISK_BADGES.minimal;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => navigate('/history')}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-[#81B29A]/15 hover:border-[#81B29A]/40 hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#FFE8C2]">{item.date}</p>
                      <p className="text-[10px] text-[#E8B4B8]/60">Score: {item.score}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.text} ${badge.bg} ${badge.border}`}>
                      {item.risk_level}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => navigate('/history')}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold text-[#94D2BD] hover:text-[#FFE8C2] hover:bg-[#81B29A]/10 border border-[#81B29A]/20 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Complete History</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── 2 STREAMLINED ACTIONS (INSTEAD OF 3 NOISY ONES) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/assessment')}
          className="glass-card p-5 text-left border-[#81B29A]/20 hover:border-[#81B29A]/45 hover:-translate-y-0.5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#94D2BD]">Multimodal Tri-Modal</span>
            <ArrowRight className="w-4 h-4 text-[#94D2BD] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="font-serif-title text-xl text-[#FFE8C2]">Take A Full Assessment</p>
          <p className="text-xs text-[#F0C0C6]/80 mt-1 leading-relaxed">
            Record a short journal entry, answer PHQ-9 questions, and perform acoustic check-in.
          </p>
        </button>

        <button
          onClick={() => navigate('/mood')}
          className="glass-card p-5 text-left border-[#81B29A]/20 hover:border-[#81B29A]/45 hover:-translate-y-0.5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#E8B4B8]">Daily Pulse</span>
            <Heart className="w-4 h-4 text-[#E8B4B8] group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-serif-title text-xl text-[#FFE8C2]">Log Today's Mood</p>
          <p className="text-xs text-[#F0C0C6]/80 mt-1 leading-relaxed">
            Quick 10-second emoji check-in with optional context tags and longitudinal trends.
          </p>
        </button>
      </div>

    </div>
  );
}
