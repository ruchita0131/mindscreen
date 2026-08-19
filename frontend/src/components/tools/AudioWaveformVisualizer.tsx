import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformVisualizerProps {
  isRecording: boolean;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({ isRecording }) => {
  const [bars, setBars] = useState<number[]>([15, 25, 45, 30, 60, 40, 75, 50, 30, 65, 45, 20]);

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => Math.floor(Math.random() * 65) + 15)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.12, ease: 'linear' }}
          className="w-1.5 rounded-full bg-gradient-to-t from-red-500 via-brand-amber to-brand-tealL"
        />
      ))}
    </div>
  );
};
