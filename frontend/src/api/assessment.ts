import { apiClient } from './client';
import { PHQSubmitRequest, PredictTextRequest, RiskResponse } from '../types/assessment';

export const predictFused = async (phq: PHQSubmitRequest, text: PredictTextRequest): Promise<RiskResponse> => {
  const res = await apiClient.post('/api/predict/fused', { answers: phq.answers, text: text.text });
  return res.data;
};
