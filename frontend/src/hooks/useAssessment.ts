import { useMutation } from '@tanstack/react-query';
import { predictFused } from '../api/assessment';
import { PHQSubmitRequest, PredictTextRequest } from '../types/assessment';

export const usePredictFused = () => {
  return useMutation({
    mutationFn: ({ phq, text, audioBase64 }: { phq: PHQSubmitRequest; text: PredictTextRequest; audioBase64?: string }) => 
      predictFused(phq, text, audioBase64),
  });
};
