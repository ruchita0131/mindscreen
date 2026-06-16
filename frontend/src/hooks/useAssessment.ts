import { useMutation } from '@tanstack/react-query';
import { predictFused } from '../api/assessment';
import { PHQSubmitRequest, PredictTextRequest } from '../types/assessment';

export const usePredictFused = () => {
  return useMutation({
    mutationFn: ({ phq, text }: { phq: PHQSubmitRequest; text: PredictTextRequest }) => predictFused(phq, text),
  });
};
