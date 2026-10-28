export interface FormValues {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface Alternative {
  name: string;
  confidence: number;
  emoji: string;
}

export interface SoilHealth {
  label: string;
  color: string;
  score: number;
}

export interface PredictResponse {
  crop: string;
  confidence: number;
  emoji: string;
  color: string;
  description: string;
  alternatives: Alternative[];
  soil_health: SoilHealth;
}

export interface SliderConfig {
  key: keyof FormValues;
  label: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}
