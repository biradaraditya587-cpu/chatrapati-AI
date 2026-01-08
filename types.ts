
export enum ClassificationType {
  SPAM = 'SPAM',
  HAM = 'HAM', // Ham is the industry term for non-spam
  PHISHING = 'PHISHING',
  UNSURE = 'UNSURE'
}

export interface SpamFeature {
  name: string;
  score: number; // 0 to 100
  description: string;
}

export interface ClassificationResult {
  id: string;
  timestamp: number;
  content: string;
  subject: string;
  type: ClassificationType;
  confidence: number;
  explanation: string;
  features: SpamFeature[];
  recommendation: string;
}

export interface AnalysisHistory {
  id: string;
  subject: string;
  type: ClassificationType;
  timestamp: number;
}
