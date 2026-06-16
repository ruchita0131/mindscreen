import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { usePredictFused } from '../hooks/useAssessment';

const phqQuestions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
  "Thoughts that you would be better off dead, or of hurting yourself in some way?"
];

const phqOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
];

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(9).fill(-1));
  const [journal, setJournal] = useState('');
  const { mutateAsync: submitAssessment, isPending } = usePredictFused();

  const handleSelect = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[step] = val;
    setAnswers(newAnswers);
    setTimeout(() => {
      if (step < 9) setStep(step + 1);
    }, 400); // Smooth auto-advance
  };

  const handleNext = () => {
    if (step < 9) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const res = await submitAssessment({ 
        phq: { answers }, 
        text: { text: journal } 
      });
      
      // Store results in state and navigate
      navigate('/results', { state: { result: res } });
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  const progress = ((step) / 10) * 100;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mental Health Assessment</h1>
        <p className="text-gray-400">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
      </div>

      <Progress value={progress} className="h-2 mb-8 bg-white/10" indicatorClassName="bg-brand-teal" />

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl min-h-[400px] flex flex-col relative overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            {step < 9 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <span className="text-brand-amber font-medium mb-4">Question {step + 1} of 9</span>
                <h2 className="text-2xl font-semibold mb-8">{phqQuestions[step]}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                  {phqOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        answers[step] === opt.value
                          ? 'bg-brand-teal/20 border-brand-teal shadow-[0_0_15px_rgba(10,147,150,0.2)] text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="journal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <span className="text-brand-tealL font-medium mb-4">Final Step</span>
                <h2 className="text-2xl font-semibold mb-4">How are you feeling right now?</h2>
                <p className="text-gray-400 mb-6">
                  Please write a few sentences about your current emotional state. Be as open and honest as you'd like. Our AI will analyze this context alongside your questionnaire.
                </p>
                <textarea
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 resize-none"
                  placeholder="I've been feeling..."
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0 || isPending}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {step < 9 ? (
              <Button
                onClick={handleNext}
                disabled={answers[step] === -1}
                className="bg-brand-teal hover:bg-brand-tealL text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={journal.length < 10 || isPending}
                className="bg-brand-amber hover:bg-yellow-500 text-[#0D1B2A] font-bold"
              >
                {isPending ? 'Analyzing...' : 'Submit Assessment'}
                {!isPending && <CheckCircle className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
