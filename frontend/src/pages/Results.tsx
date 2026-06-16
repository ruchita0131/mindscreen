import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RiskResponse } from '../types/assessment';
import { AlertTriangle, Activity, Phone, Home, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as RiskResponse;

  if (!result) {
    return <Navigate to="/dashboard" replace />;
  }

  const getRiskDetails = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'minimal': return { color: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green' };
      case 'mild': return { color: 'text-brand-amber', bg: 'bg-brand-amber/10', border: 'border-brand-amber' };
      case 'moderate': return { color: 'text-brand-coral', bg: 'bg-brand-coral/10', border: 'border-brand-coral' };
      case 'severe': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400' };
    }
  };

  const riskDetails = getRiskDetails(result.risk_level);

  // Prepare probability data
  const probData = [
    { name: 'Minimal', value: result.probabilities.minimal * 100 },
    { name: 'Mild', value: result.probabilities.mild * 100 },
    { name: 'Moderate', value: result.probabilities.moderate * 100 },
    { name: 'Severe', value: result.probabilities.severe * 100 },
  ];

  const COLORS = ['#2DC653', '#E9C46A', '#E76F51', '#ef4444'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Assessment Complete</h1>
        <p className="text-xl text-gray-400">Thank you for sharing. Here is the analysis based on your responses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Level Card */}
        <Card className={`bg-white/5 backdrop-blur-md border-2 ${riskDetails.border}`}>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center h-full">
            <Activity className={`w-16 h-16 mb-6 ${riskDetails.color}`} />
            <h2 className="text-2xl text-gray-400 mb-2">Estimated Risk Level</h2>
            <p className={`text-5xl font-bold uppercase tracking-wider ${riskDetails.color}`}>
              {result.risk_level}
            </p>
            <p className="mt-6 text-gray-300">
              Confidence: <span className="font-semibold text-white">{(result.confidence * 100).toFixed(1)}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Probabilities Chart */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl">Probability Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={probData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <RechartsTooltip 
                    cursor={{ fill: '#ffffff1a' }}
                    contentStyle={{ backgroundColor: '#0D1B2A', borderColor: '#ffffff2a', borderRadius: '8px', color: '#fff' }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {probData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SHAP Explanation */}
      {result.shap_explanation && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl">Key Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-6">These were the most influential factors identified by the AI model in your assessment.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {result.shap_explanation.words && result.shap_explanation.words.length > 0 && (
                <div>
                  <h3 className="text-brand-tealL font-medium mb-4">Text Insights</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.shap_explanation.words.map((w, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${w.value > 0 ? 'bg-brand-coral/20 text-brand-coral' : 'bg-brand-green/20 text-brand-green'}`}>
                        {w.word} ({w.value > 0 ? '+' : ''}{w.value.toFixed(2)})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {result.shap_explanation.phq_factors && result.shap_explanation.phq_factors.length > 0 && (
                <div>
                  <h3 className="text-brand-amber font-medium mb-4">Questionnaire Insights</h3>
                  <div className="space-y-3">
                    {result.shap_explanation.phq_factors.map((f, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <span className="text-sm text-gray-300 truncate pr-4">{f.question}</span>
                        <span className={`text-sm font-bold ${f.value > 0 ? 'text-brand-coral' : 'text-brand-green'}`}>
                          {f.value > 0 ? '+' : ''}{f.value.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crisis Banner */}
      {result.crisis_flag && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
          <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-red-500 mb-2">Immediate Support is Available</h3>
            <p className="text-red-200 mb-4">Your responses indicate that you might be going through a difficult time. Please consider reaching out to a professional or someone you trust.</p>
            {result.helplines && result.helplines.length > 0 && (
              <ul className="space-y-2">
                {result.helplines.map((helpline, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-white font-medium bg-red-500/20 px-4 py-2 rounded-lg w-fit">
                    <Phone className="w-4 h-4 text-red-400" />
                    {helpline}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate('/dashboard')}>
          <Home className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Button>
        <Button className="bg-brand-teal hover:bg-brand-tealL text-white" onClick={() => navigate('/assessment')}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}
