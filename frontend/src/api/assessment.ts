import { apiClient } from './client';
import { PHQSubmitRequest, PredictTextRequest, RiskResponse } from '../types/assessment';

export const predictFused = async (
  phq: PHQSubmitRequest,
  text: PredictTextRequest,
  audioBase64?: string
): Promise<RiskResponse> => {
  const response = await apiClient.post('/api/predict/fused', {
    answers: phq.answers,
    text: text.text,
    audio_base64: audioBase64 || null,
  });
  return response.data;
};
