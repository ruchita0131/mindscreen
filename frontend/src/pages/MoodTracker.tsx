import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { apiClient } from '../api/client';
import { Heart, Activity, Calendar, AlertCircle, Phone, BookOpen, Sun, Coffee, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const MOODS = [
  { score: 5, emoji: '😊', label: 'Great', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { score: 4, emoji: '🙂', label: 'Good', color: 'text-brand-tealL', bg: 'bg-brand-teal/20' },
  { score: 3, emoji: '😐', label: 'Okay', color: 'text-amber-400', bg: 'bg-amber-400/20' },
  { score: 2, emoji: '😔', label: 'Low', color: 'text-orange-400', bg: 'bg-orange-400/20' },
  { score: 1, emoji: '😢', label: 'Terrible', color: 'text-red-400', bg: 'bg-red-400/20' },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // In a real app, we'd fetch the trend and today's status here
    // For now, mock the trend data
    const mockData = [
      { date: 'Mon', score: 3 },
      { date: 'Tue', score: 4 },
      { date: 'Wed', score: 2 },
      { date: 'Thu', score: 3 },
      { date: 'Fri', score: 5 },
      { date: 'Sat', score: 4 },
      { date: 'Sun', score: null }, // Today not logged yet
    ];
    setTrendData(mockData);
  }, []);

  const handleLogMood = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 800));
      // await apiClient.post('/mood/log', { score: selectedMood, notes });
      
      setAlreadyLogged(true);
      
      // Update chart locally
      const newData = [...trendData];
      newData[newData.length - 1] = { date: 'Sun', score: selectedMood };
      setTrendData(newData);
      
    } catch (err) {
      setError('Failed to log mood. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecommendations = (score: number | null) => {
    if (!score) return [];
    
    if (score >= 4) {
      return [
        { title: 'Keep it up!', desc: 'Your mood is great. Notice what went well today and write it down.', icon: Sun, color: 'text-emerald-400' },
        { title: 'Gratitude Journal', desc: 'Take 5 minutes to list three things you are grateful for today.', icon: BookOpen, color: 'text-brand-tealL' }
      ];
    }
    if (score === 3) {
      return [
        { title: 'Take a Break', desc: 'Step away from your screen for 10 minutes and stretch.', icon: Coffee, color: 'text-amber-400' },
        { title: '4-7-8 Breathing', desc: 'Breathe in for 4s, hold for 7s, exhale for 8s to center yourself.', icon: Activity, color: 'text-brand-teal' }
      ];
    }
    return [
      { title: 'Reach Out', desc: 'Talk to a trusted friend or family member about how you feel.', icon: MessageCircle, color: 'text-orange-400' },
      { title: 'Helplines', desc: 'iCall: 9152987821 | NIMHANS: 080-46110007', icon: Phone, color: 'text-red-400', isUrgent: true }
    ];
  };

  const currentRecs = getRecommendations(selectedMood || (alreadyLogged ? trendData[trendData.length-1]?.score : null));

  return (
    <div className="max-w-5xl mx-auto animate-in space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-brand-coral" />
          <h1 className="text-3xl font-bold">Daily Mood Tracker</h1>
        </div>
        <p className="text-gray-400">Check in with yourself daily to identify patterns and triggers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Logging */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            {alreadyLogged ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">{MOODS.find(m => m.score === trendData[trendData.length-1]?.score)?.emoji}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">You're checked in!</h2>
                <p className="text-gray-400">You've successfully logged your mood for today. Come back tomorrow.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6 text-center">How are you feeling today?</h2>
                
                {error && (
                  <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-8 px-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.score}
                      onClick={() => setSelectedMood(mood.score)}
                      className="group flex flex-col items-center gap-3 transition-transform"
                    >
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 ${
                        selectedMood === mood.score 
                          ? `${mood.bg} scale-110 shadow-lg border-2 border-white/20` 
                          : 'bg-white/5 hover:bg-white/10 grayscale-[50%] hover:grayscale-0'
                      }`}>
                        {mood.emoji}
                      </div>
                      <span className={`text-xs md:text-sm font-medium transition-colors ${
                        selectedMood === mood.score ? mood.color : 'text-gray-500 group-hover:text-gray-300'
                      }`}>
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Journal Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's making you feel this way?"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none h-24"
                  />
                </div>

                <Button 
                  onClick={handleLogMood} 
                  disabled={!selectedMood || isSubmitting}
                  className="w-full py-4 text-base font-semibold bg-brand-teal hover:bg-brand-tealL text-white shadow-lg shadow-brand-teal/20"
                >
                  {isSubmitting ? 'Saving...' : 'Log Today\'s Mood'}
                </Button>
              </>
            )}
          </div>

          {/* Recommendations / CBT Cards */}
          <AnimatePresence>
            {currentRecs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-amber" /> Suggested for you
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentRecs.map((rec, i) => (
                    <div key={i} className={`glass-card p-5 border ${rec.isUrgent ? 'border-red-500/30 bg-red-500/5' : 'border-white/10'}`}>
                      <rec.icon className={`w-6 h-6 mb-3 ${rec.color}`} />
                      <h4 className="font-bold text-white mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{rec.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Chart */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-tealL" />
              <h2 className="text-lg font-semibold">Weekly Trend</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" /> Last 7 Days
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(v) => {
                  return MOODS.find(m => m.score === v)?.emoji || '';
                }} axisLine={false} tickLine={false} tick={{ fontSize: 16 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f2336', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(val: number) => {
                    const mood = MOODS.find(m => m.score === val);
                    return [`${mood?.emoji} ${mood?.label}`, 'Mood'];
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0A9396" 
                  strokeWidth={3}
                  connectNulls
                  dot={{ fill: '#0A9396', r: 6, strokeWidth: 2, stroke: '#0D1B2A' }}
                  activeDot={{ r: 8, fill: '#94D2BD', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
