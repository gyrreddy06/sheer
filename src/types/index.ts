export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml';

export type UserGoal = 'track_periods' | 'understand_pcos' | 'trying_to_conceive' | 'general_wellness';

export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy' | 'very_heavy';

export type MoodType = 'calm' | 'happy' | 'sensitive' | 'anxious' | 'irritable' | 'low_energy' | 'exhausted';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface Profile {
  id: string;
  display_name: string;
  date_of_birth?: string; // YYYY-MM-DD
  age_group: '18-24' | '25-34' | '35+';
  goal: UserGoal;
  cycle_length_estimate: number;
  period_duration_estimate: number;
  is_cycle_regular: boolean;
  low_data_mode: boolean;
  discreet_mode: boolean;
  discreet_app_name: string;
  app_language: LanguageCode;
  pin_hash: string | null;
  biometrics_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consents {
  terms_of_service: boolean;
  privacy_policy: boolean;
  sensitive_health_data_processing: boolean;
  local_storage_caching: boolean;
  agreed_at?: string;
}

export interface CycleRecord {
  id: string;
  user_id: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
  cycle_length?: number;
  period_length?: number;
  is_irregular: boolean;
  notes?: string;
  created_at: string;
}

export interface PeriodLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  flow_intensity: FlowIntensity;
  is_spotting: boolean;
  notes?: string;
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  log_date: string;
  mood?: MoodType;
  energy_level?: number; // 1-5
  sleep_hours?: number;
  notes?: string;
  created_at: string;
}

export interface SymptomLog {
  id: string;
  user_id: string;
  log_date: string;
  symptom_code: string;
  intensity: number; // 0-10
  notes?: string;
  created_at: string;
}

export interface EducationArticle {
  id: string;
  slug: string;
  title_en: string;
  title_te: string;
  category: 'pcos_pcod' | 'irregular_periods' | 'menstrual_hygiene' | 'first_period' | 'reproductive_health' | 'hormonal_health';
  summary_en: string;
  summary_te: string;
  content_en: string;
  content_te: string;
  read_time_minutes: number;
  reviewed_by: string;
  last_reviewed: string;
  is_sample: boolean;
}

export interface RedFlagAlert {
  type: 'heavy_bleeding' | 'severe_pain' | 'fainting' | 'mental_distress';
  title: string;
  message: string;
  action: string;
  urgency: 'high' | 'immediate';
  helplines: { name: string; number: string; description: string }[];
}

export interface CyclePrediction {
  cycleDay: number;
  phase: CyclePhase;
  phaseName: string;
  phaseDescription: string;
  expectedPeriodStartRange: { start: string; end: string }; // e.g. "Nov 28" - "Dec 02"
  ovulationWindowEstimate: { start: string; end: string };
  confidenceText: string;
  disclaimer: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  title_te?: string;
  description: string;
  description_te?: string;
  time: string; // e.g. "09:00"
  type: 'pre_period' | 'hydration' | 'medication' | 'wellness' | 'custom';
  enabled: boolean;
  frequency: 'daily' | 'pre_period' | 'interval';
  intervalHours?: number; // e.g. every 2 hours for water
  daysBeforePeriod?: number; // e.g. 2 days before
  discreetText?: string;
  icon?: string;
}
