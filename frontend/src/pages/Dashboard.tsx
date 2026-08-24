import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';
import { Activity, Plus, TrendingUp, Brain, Mic, ClipboardList, TrendingDown, Minus, Sun, Flame, Award, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GuidedBreathingModal } from '../components/tools/GuidedBreathingModal';

const mockHistory = [
  { id: 1, date: 'Aug 1', score: 12, risk_level: 'Moderate', confidence: 0.78 },
  { id: 2, date: 'Aug 4', score: 9, risk_level: 'Mild', confidence: 0.82 },
  { id: 3, date: 'Aug 7', score: 6, risk_level: 'Mild', confidence: 0.75 },
  { id: 4, date: 'Aug 10', score: 4, risk_level: 'Minimal', confidence: 0.91 },
];

const RISK_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  minimal:  { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  mild:     { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30' },
  moderate: { text: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30' },
  severe:   { text: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-500/30' },
};

export default function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [history] = useState(mockHistory);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);

  const latest = history[history.length - 1];

  const badges = [
    { name: 'Mindful Writer', desc: 'Completed 3 text journals', icon: Brain, unlocked: true, color: 'text-brand-tealL' },
    { name: 'Voice Explorer', desc: 'Analyzed vocal tone', icon: Mic, unlocked: true, color: 'text-purple-400' },
    { name: 'Self-Care Champ', desc: 'Logged 5-day mood streak', icon: Flame, unlocked: true, color: 'text-brand-amber' },
  ];

  return (
    <div className="space-y-8 animate-in relative z-10">

      {/* Guided Breathing Modal */}
      <GuidedBreathingModal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />

      {/* Header with Streak & Breathing Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400/10 text-amber-400 border border-amber-400/30">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" /> 5-Day Wellness Streak!
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-gradient">{user?.email?.split('@')[0] || 'Student'}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">Here is your calming mental wellness overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsBreathingOpen(true)}
            className="bg-gradient-to-r from-brand-amber to-amber-500 hover:from-yellow-400 hover:to-amber-600 text-[#0D1B2A] font-extrabold px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(233,196,106,0.3)] transition-all flex items-center gap-2"
          >
            <Sun className="w-4 h-4 text-[#0D1B2A]" />
            4-7-8 Breathing Tool
          </Button>

          <Button
            onClick={() => navigate('/assessment')}
            className="bg-brand-teal hover:bg-brand-tealL text-white font-semibold px-6 py-2.5 rounded-full glow-teal transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Badges & Streaks Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.name} className="glass-card p-4 flex items-center gap-3.5 border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
              <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              <div>
                <p className="font-semibold text-sm text-white flex items-center gap-1.5">
                  {badge.name}
                  <Award className="w-3.5 h-3.5 text-brand-amber" />
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-tealL" />
              <h2 className="text-lg font-semibold">PHQ-9 Wellness Score Trend</h2>
            </div>
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">Last 30 days</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A9396" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0A9396" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 27]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f2336', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '13px' }}
                  itemStyle={{ color: '#94D2BD' }}
                  formatter={(val: number) => [val, 'PHQ-9 Score']}
                />
                <Area type="monotone" dataKey="score" stroke="#0A9396" strokeWidth={2.5} fill="url(#scoreGrad)"
                  dot={{ fill: '#0A9396', strokeWidth: 2, r: 5, stroke: '#0D1B2A' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#94D2BD' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Screenings */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-amber" />
                <h2 className="text-lg font-semibold">Recent Screenings</h2>
              </div>
            </div>
            <div className="space-y-3">
              {history.slice().reverse().map((item) => {
                const style = RISK_STYLES[item.risk_level.toLowerCase()] ?? RISK_STYLES.minimal;
                return (
                  <div key={item.id} onClick={() => navigate('/history')} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{item.date}</p>
                      <p className="text-xs text-gray-400 mt-0.5">PHQ-9: <span className="text-white">{item.score}</span></p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.text} ${style.bg} ${style.border}`}>
                      {item.risk_level}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4 text-xs border-white/10 text-gray-300 hover:bg-white/5" onClick={() => navigate('/history')}>
            View Complete History
          </Button>
        </div>
      </div>

      {/* Quick Launch Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: ClipboardList, title: 'Full Assessment', desc: 'PHQ-9 + Text + Voice multimodal screening', action: () => navigate('/assessment'), color: 'text-brand-tealL' },
          { icon: Heart, title: 'Daily Mood Tracker', desc: 'Check in with emojis and log daily triggers', action: () => navigate('/mood'), color: 'text-brand-coral' },
          { icon: Sun, title: '4-7-8 Breathing Tool', desc: 'Calming guided breathing technique', action: () => setIsBreathingOpen(true), color: 'text-brand-amber' },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button key={tool.title} onClick={tool.action} className="glass-card p-5 text-left hover:scale-[1.02] transition-transform duration-200 group">
              <Icon className={`w-6 h-6 ${tool.color} mb-3`} />
              <p className="font-semibold text-white text-sm">{tool.title}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{tool.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
