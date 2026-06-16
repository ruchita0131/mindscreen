import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';
import { Activity, Plus, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);

  // Mock data for demonstration until we connect to history API
  useEffect(() => {
    setHistory([
      { id: 1, date: '2024-05-10', score: 4, risk_level: 'Minimal', completed: true },
      { id: 2, date: '2024-05-15', score: 11, risk_level: 'Moderate', completed: true },
      { id: 3, date: '2024-05-20', score: 8, risk_level: 'Mild', completed: true },
      { id: 4, date: '2024-05-25', score: 5, risk_level: 'Minimal', completed: true },
    ]);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'minimal': return 'text-brand-green bg-brand-green/10 border-brand-green/20';
      case 'mild': return 'text-brand-amber bg-brand-amber/10 border-brand-amber/20';
      case 'moderate': return 'text-brand-coral bg-brand-coral/10 border-brand-coral/20';
      case 'severe': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRiskIcon = (risk: string) => {
    if (risk.toLowerCase() === 'minimal') return <CheckCircle2 className="w-5 h-5 text-brand-green" />;
    return <AlertCircle className={`w-5 h-5 ${risk.toLowerCase() === 'severe' ? 'text-red-500' : 'text-brand-coral'}`} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back!</h1>
          <p className="text-gray-400 mt-1">Track your mental health journey and start new assessments.</p>
        </div>
        <Button 
          onClick={() => navigate('/assessment')} 
          className="bg-brand-teal hover:bg-brand-tealL text-white border-0 shadow-[0_0_20px_rgba(10,147,150,0.3)] hover:shadow-[0_0_25px_rgba(148,210,189,0.5)] transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-tealL" />
              PHQ-9 Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 27]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D1B2A', borderColor: '#ffffff2a', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#0A9396' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#0A9396" 
                    strokeWidth={3}
                    dot={{ fill: '#0A9396', strokeWidth: 2, r: 6, stroke: '#0D1B2A' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#94D2BD' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats / History */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-amber" />
              Recent Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.slice().reverse().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-200">{item.date}</p>
                      <p className="text-sm text-gray-400">Score: {item.score}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRiskColor(item.risk_level)}`}>
                      {getRiskIcon(item.risk_level)}
                      <span className="text-sm font-medium">{item.risk_level}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No assessments yet.</p>
                <p className="text-sm mt-2">Take your first assessment to start tracking.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
