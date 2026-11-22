-- ==============================================================================
-- SheOra - Privacy-First Women's Health Companion Database Schema
-- Supabase Postgres Schema with Strict Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES
-- Stores minimum user profile settings. No real names or PII required.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT DEFAULT 'Companion',
    age_group TEXT CHECK (age_group IN ('18-24', '25-34', '35+')),
    goal TEXT CHECK (goal IN ('track_periods', 'understand_pcos', 'trying_to_conceive', 'general_wellness')),
    cycle_length_estimate INT DEFAULT 28,
    period_duration_estimate INT DEFAULT 5,
    is_cycle_regular BOOLEAN DEFAULT true,
    low_data_mode BOOLEAN DEFAULT false,
    discreet_mode BOOLEAN DEFAULT false,
    discreet_app_name TEXT DEFAULT 'S-Notes',
    app_language TEXT DEFAULT 'en' CHECK (app_language IN ('en', 'te', 'hi', 'ta', 'kn', 'ml')),
    pin_hash TEXT DEFAULT NULL,
    biometrics_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
    ON public.profiles FOR DELETE 
    USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. CONSENTS
-- Granular, separate, unticked consents with explicit timestamps and withdrawal tracking.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('terms_of_service', 'privacy_policy', 'sensitive_health_data_processing', 'local_storage_caching')),
    agreed BOOLEAN NOT NULL DEFAULT false,
    agreed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    withdrawn_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_consents_user_id ON public.consents(user_id);
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own consents" 
    ON public.consents FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. CYCLES
-- Tracks historical menstrual cycles, calculated lengths, and irregularity markers.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    cycle_length INT,
    period_length INT,
    is_irregular BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_cycles_user_start ON public.cycles(user_id, start_date DESC);
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cycles" 
    ON public.cycles FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 4. PERIOD LOGS
-- Day-by-day bleeding and flow logs (spotting, light, medium, heavy, very_heavy).
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.period_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    flow_intensity TEXT NOT NULL CHECK (flow_intensity IN ('spotting', 'light', 'medium', 'heavy', 'very_heavy')),
    is_spotting BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_period_logs_user_date ON public.period_logs(user_id, log_date DESC);
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own period logs" 
    ON public.period_logs FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. DAILY CHECKINS
-- Fast (<30s) daily log: mood, energy, sleep hours, general notes.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    mood TEXT CHECK (mood IN ('calm', 'happy', 'sensitive', 'anxious', 'irritable', 'low_energy', 'exhausted')),
    energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
    sleep_hours NUMERIC(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON public.daily_checkins(user_id, log_date DESC);
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily checkins" 
    ON public.daily_checkins FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. SYMPTOM TYPES (Global reference catalog)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.symptom_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_te TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pain', 'physical', 'digestive', 'skin', 'fluid', 'energy', 'emotional')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.symptom_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read symptom types" ON public.symptom_types FOR SELECT USING (true);

-- Seed standard symptoms
INSERT INTO public.symptom_types (code, name_en, name_te, category) VALUES
('cramps', 'Menstrual Cramps', 'రుతుక్రమ నొప్పులు', 'pain'),
('headache', 'Headache / Migraine', 'తలనొప్పి', 'pain'),
('bloating', 'Bloating', 'కడుపు ఉబ్బరం', 'digestive'),
('acne', 'Acne & Skin Breakouts', 'మొటిమలు / చర్మ మార్పులు', 'skin'),
('breast_tenderness', 'Breast Tenderness', 'రొమ్ముల నొప్పి / వాపు', 'physical'),
('fatigue', 'Fatigue / Tiredness', 'అలసట', 'energy'),
('discharge', 'Vaginal Discharge Changes', 'యోని ఉత్సర్గం మార్పులు', 'fluid'),
('sleep_changes', 'Sleep Pattern Changes', 'నిద్రలేమి / నిద్ర సమస్యలు', 'energy'),
('backache', 'Lower Back Ache', 'నడుము నొప్పి', 'pain'),
('mood_swings', 'Emotional Fluctuations', 'మానసిక స్థితి మార్పులు', 'emotional')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 7. SYMPTOM LOGS
-- Detailed 0-10 intensity tracking with historical timeline.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.symptom_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    symptom_code TEXT NOT NULL REFERENCES public.symptom_types(code),
    intensity INT NOT NULL CHECK (intensity BETWEEN 0 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_date ON public.symptom_logs(user_id, log_date DESC);
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own symptom logs" 
    ON public.symptom_logs FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 8. MOOD LOGS
-- Granular mood logs by date and time
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    mood_code TEXT NOT NULL,
    intensity INT CHECK (intensity BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_mood_logs_user_date ON public.mood_logs(user_id, log_date DESC);
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mood logs" 
    ON public.mood_logs FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. EDUCATION ARTICLES ("Ask Her" library)
-- Public read only. Sample articles clearly labelled "pending medical review".
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_te TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pcos_pcod', 'irregular_periods', 'menstrual_hygiene', 'first_period', 'reproductive_health', 'hormonal_health')),
    summary_en TEXT NOT NULL,
    summary_te TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_te TEXT NOT NULL,
    read_time_minutes INT DEFAULT 3,
    reviewed_by TEXT DEFAULT 'Pending Medical Review (Editorial Draft)',
    last_reviewed DATE DEFAULT CURRENT_DATE,
    is_sample BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.education_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read education articles" ON public.education_articles FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 10. SAVED ARTICLES (Offline bookmarks)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.education_articles(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_articles_user ON public.saved_articles(user_id);
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved articles" 
    ON public.saved_articles FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 11. REPORTS (Doctor-Ready reports archive)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    categories_included JSONB NOT NULL DEFAULT '["cycles", "flow", "symptoms", "moods", "notes"]'::jsonb,
    summary_json JSONB NOT NULL,
    doctor_questions JSONB DEFAULT '[]'::jsonb,
    disclaimer TEXT DEFAULT 'This summary report is generated from personal tracking logs for clinical discussion and does not constitute a clinical diagnosis or medical treatment plan.',
    generated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_reports_user ON public.reports(user_id);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reports" 
    ON public.reports FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 12. NOTIFICATION PREFERENCES
-- Discreet reminders without disclosing sensitive terms.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_prefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    discreet_wording BOOLEAN DEFAULT true,
    reminder_days_before INT DEFAULT 2,
    time_of_day TIME DEFAULT '09:00:00',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notification prefs" 
    ON public.notification_prefs FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 13. DELETION REQUESTS
-- Right to be Forgotten / complete data wipe tracking.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deletion_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    reason TEXT,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deletion_requests_user ON public.deletion_requests(user_id);
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and create deletion requests" 
    ON public.deletion_requests FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Database Functions: Cascade User Wipe Helper
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.delete_user_data(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.uid() = target_user_id THEN
        DELETE FROM public.deletion_requests WHERE user_id = target_user_id;
        DELETE FROM public.notification_prefs WHERE user_id = target_user_id;
        DELETE FROM public.reports WHERE user_id = target_user_id;
        DELETE FROM public.saved_articles WHERE user_id = target_user_id;
        DELETE FROM public.mood_logs WHERE user_id = target_user_id;
        DELETE FROM public.symptom_logs WHERE user_id = target_user_id;
        DELETE FROM public.daily_checkins WHERE user_id = target_user_id;
        DELETE FROM public.period_logs WHERE user_id = target_user_id;
        DELETE FROM public.cycles WHERE user_id = target_user_id;
        DELETE FROM public.consents WHERE user_id = target_user_id;
        DELETE FROM public.profiles WHERE id = target_user_id;
    ELSE
        RAISE EXCEPTION 'Access Denied: You may only purge your own personal data.';
    END IF;
END;
$$;
