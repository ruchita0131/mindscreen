export interface PHQSubmitRequest {
  answers: number[];
}
export interface PredictTextRequest {
  text: string;
}
export interface RiskResponse {
  risk_level: 'minimal' | 'mild' | 'moderate' | 'severe';
  confidence: number;
  probabilities: {
    minimal: number;
    mild: number;
    moderate: number;
    severe: number;
  };
  shap_explanation: {
    words?: { word: string; value: number }[];
    phq_factors?: { question: string; value: number }[];
  } | null;
  crisis_flag: boolean;
  helplines?: string[] | null;
}
