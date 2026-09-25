import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformVisualizerProps {
  isRecording: boolean;
  stream?: MediaStream | null;
}

const BAR_COUNT = 12;

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  isRecording,
  stream,
}) => {
  const [bars, setBars] = useState<number[]>(new Array(BAR_COUNT).fill(15));
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording || !stream) {
      // Clean up audio graph
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      try {
        sourceRef.current?.disconnect();
        audioCtxRef.current?.close();
      } catch (_) {
        // ignore close on already closed context
      }
      sourceRef.current = null;
      analyserRef.current = null;
      audioCtxRef.current = null;
      setBars(new Array(BAR_COUNT).fill(15));
      return;
    }

    try {
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64; // yields 32 frequency bins
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateBars = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Group the 32 frequency bins into BAR_COUNT buckets focusing on vocal range
        const step = Math.floor(bufferLength / BAR_COUNT);
        const newHeights: number[] = [];

        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          const count = Math.max(1, step);
          for (let j = 0; j < count; j++) {
            const idx = i * step + j;
            if (idx < bufferLength) {
              sum += dataArray[idx];
            }
          }
          const avg = sum / count; // 0 to 255
          // Map 0-255 to percentage 15% to 95%
          const pct = Math.min(95, Math.max(15, Math.round((avg / 255) * 85 + 15)));
          newHeights.push(pct);
        }

        setBars(newHeights);
        rafIdRef.current = requestAnimationFrame(updateBars);
      };

      rafIdRef.current = requestAnimationFrame(updateBars);
    } catch (err) {
      console.warn('Real-time audio visualizer fallback:', err);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      try {
        sourceRef.current?.disconnect();
        audioCtxRef.current?.close();
      } catch (_) {}
    };
  }, [isRecording, stream]);

  if (!isRecording) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.08, ease: 'easeOut' }}
          className="w-1.5 rounded-full bg-gradient-to-t from-red-500 via-brand-amber to-brand-tealL"
        />
      ))}
    </div>
  );
};
