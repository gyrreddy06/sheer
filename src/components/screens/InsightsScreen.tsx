import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Heart,
  TrendingUp,
  Activity,
  Droplet,
  Moon,
  Zap,
  Smile,
  AlertCircle,
  FileText,
  Flame,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { calculateCyclePrediction, formatFriendlyDate } from '../../lib/cycleMath';

export const InsightsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { profile, periodLogs, symptomLogs, dailyCheckins, setActiveTab } = useApp();

  const isTelugu = i18n.language === 'te';
  const [activeTabSub, setActiveTabSub] = useState<'cycle' | 'health' | 'wellness'>('cycle');

  // Past 5 months cycle bar chart data (matching photo: 28 Nov, 30 Dec, 27 Jan, 28 Feb, 29 Mar)
  const cycleChartData = [
    { month: 'Nov', days: 28 },
    { month: 'Dec', days: 30 },
    { month: 'Jan', days: 27 },
    { month: 'Feb', days: 28 },
    { month: 'Mar', days: 29 },
  ];

  // Health: Symptom severity by cycle phase
  const healthSymptomData = [
    { phase: 'Menstrual', cramps: 6.5, fatigue: 5.8, bloating: 4.5 },
    { phase: 'Follicular', cramps: 1.2, fatigue: 2.0, bloating: 1.0 },
    { phase: 'Ovulatory', cramps: 2.1, fatigue: 1.5, bloating: 2.0 },
    { phase: 'Luteal', cramps: 4.0, fatigue: 4.8, bloating: 5.5 },
  ];

  // Wellness: Mood, Energy & Sleep trends
  const wellnessTrendData = [
    { day: 'Day 2', energy: 2.5, sleep: 7.0, mood: 'Calm' },
    { day: 'Day 7', energy: 4.2, sleep: 7.8, mood: 'Energetic' },
    { day: 'Day 14', energy: 4.8, sleep: 8.0, mood: 'Excited' },
    { day: 'Day 21', energy: 3.5, sleep: 7.2, mood: 'Sensitive' },
    { day: 'Day 26', energy: 2.8, sleep: 6.8, mood: 'Restful' },
  ];

  const sortedLogs = [...periodLogs].sort((a, b) => b.log_date.localeCompare(a.log_date));
  const latestLog = sortedLogs[0];
  const baselineDate = latestLog ? latestLog.log_date : new Date().toISOString().slice(0, 10);

  const prediction = calculateCyclePrediction(
    baselineDate,
    profile.cycle_length_estimate || 28,
    profile.period_duration_estimate || 5,
    !profile.is_cycle_regular
  );

  const formattedStart = formatFriendlyDate(prediction.expectedPeriodStartRange.start, i18n.language);
  const formattedEnd = formatFriendlyDate(prediction.expectedPeriodStartRange.end, i18n.language);

  return (
    <div className="pb-24 pt-1 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Top Header with Back Arrow */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-full bg-white border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold text-slate-800">
          {isTelugu ? 'మీ సైకిల్ & ఆరోగ్య వివరాలు' : 'Your Cycle Insights'}
        </h2>
      </div>

      {/* 3 Pills: Cycle | Health | Wellness (matching photo) */}
      <div className="flex bg-white/90 p-1 rounded-2xl border border-pink-100 shadow-2xs">
        {(['cycle', 'health', 'wellness'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTabSub(tab)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              activeTabSub === tab
                ? 'bg-gradient-to-r from-pink-100 via-purple-100 to-rose-100 text-[#743B66] shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'cycle' && 'Cycle'}
            {tab === 'health' && 'Health'}
            {tab === 'wellness' && 'Wellness'}
          </button>
        ))}
      </div>

      {/* ===================== TAB 1: CYCLE INSIGHTS ===================== */}
      {activeTabSub === 'cycle' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Your Cycle Overview Card with Green Checkmark (matching photo) */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-medium text-slate-500">
                  {isTelugu ? 'మీ సైకిల్ సమీక్ష' : 'Your Cycle Overview'}
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                  {profile.is_cycle_regular ? 'Regular Cycle' : 'Natural Variance'}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {profile.cycle_length_estimate || 28} days avg
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Minimalist Bar Chart (matching photo: Nov, Dec, Jan, Feb, Mar) */}
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[20, 35]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(val) => [`${val} days`, 'Cycle Length']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #FBCFE8' }}
                  />
                  <Bar 
                    dataKey="days" 
                    fill="#C084FC" 
                    radius={[8, 8, 8, 8]} 
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights Card (matching photo with checkmarks) */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800">
              Key Insights
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span>Your cycle rhythm is stable and predictable.</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span>You experienced mild PMS symptoms in the luteal phase.</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-700">
                <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>Estrogen steadily rises across days 6–12.</span>
              </div>
            </div>
          </div>

          {/* Next Period Card (matching photo: "in 12 days • Apr 27 - 30") */}
          <div className="bg-gradient-to-r from-pink-100/70 via-purple-100/50 to-rose-100/60 p-4 rounded-3xl border border-pink-200/60 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-pink-200 flex items-center justify-center text-[#743B66]">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10.5px] text-slate-500 font-medium block">
                  Next Period
                </span>
                <div className="text-sm font-extrabold text-[#743B66]">
                  in 12 days
                </div>
                <span className="text-[10px] text-slate-500">
                  {formattedStart} – {formattedEnd}
                </span>
              </div>
            </div>
            <div className="text-2xl opacity-60">
              🌸
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: HEALTH INSIGHTS ===================== */}
      {activeTabSub === 'health' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Health Symptom Patterns by Phase */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-medium text-slate-500">
                  Physical Symptoms by Phase
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                  Symptom Severity Trends
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#743B66] bg-pink-100/70 px-2.5 py-0.5 rounded-full">
                0–10 Scale
              </span>
            </div>

            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthSymptomData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="phase" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #FBCFE8' }}
                  />
                  <Bar dataKey="cramps" fill="#F43F5E" name="Cramps" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fatigue" fill="#A855F7" name="Fatigue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bloating" fill="#F59E0B" name="Bloating" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around pt-2 border-t border-slate-100 text-[10.5px]">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Cramps (Peak Day 1-2)
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Fatigue
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Bloating
              </span>
            </div>
          </div>

          {/* Health Observations & Hormonal Rhythm */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Hormonal Rhythm Signals</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100">
                <div className="font-bold text-[#743B66] text-[11px] mb-0.5">
                  🌱 Follicular Vitality (Days 6–13)
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Estrogen is increasing steadily. Physical stamina and skin barrier strength are typically highest during this window.
                </p>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                <div className="font-bold text-purple-900 text-[11px] mb-0.5">
                  🌙 Luteal Wind-Down (Days 18–28)
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Progesterone rises. Mild fluid retention and cravings for complex carbs (like ragi or jowar) are completely normal.
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Discussion Banner */}
          <div className="bg-gradient-to-r from-purple-100/70 via-pink-100/60 to-purple-50 p-4 rounded-3xl border border-purple-200/50 flex items-center justify-between shadow-2xs">
            <div className="flex items-start space-x-3 pr-2">
              <div className="p-2 bg-white rounded-2xl text-[#743B66] shadow-2xs shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">
                  Doctor-Ready Clinical Summary
                </h5>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Have recurring pelvic discomfort? Export a clean 1–2 page PDF report for your gynecologist.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-bold text-white bg-[#743B66] hover:bg-[#5c2d51] px-3 py-2 rounded-2xl shadow-xs transition shrink-0"
            >
              Export
            </button>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: WELLNESS INSIGHTS ===================== */}
      {activeTabSub === 'wellness' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Energy & Sleep Rhythm Trends */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-medium text-slate-500">
                  Energy & Rest Correlations
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                  Sleep & Vitality Rhythm
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Avg 7.5 hrs sleep
              </span>
            </div>

            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wellnessTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #E9D5FF' }}
                  />
                  <Line type="monotone" dataKey="sleep" stroke="#8B5CF6" strokeWidth={2.5} name="Sleep (Hours)" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="energy" stroke="#EC4899" strokeWidth={2.5} name="Energy (1–5)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around pt-2 border-t border-slate-100 text-[10.5px]">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Sleep (Avg: 7.5 hrs)
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> Daily Energy
              </span>
            </div>
          </div>

          {/* Hydration & Nourishing Local Foods */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-blue-500" />
              <span>Hydration & Anti-Inflammatory Foods</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
                <span className="text-lg block mb-1">💧</span>
                <span className="font-bold text-blue-900 block text-[11px]">8 Glasses / Day</span>
                <span className="text-[10px] text-slate-600 mt-0.5 block leading-snug">
                  Regular sips keep pelvic muscles relaxed and prevent uterine spasms.
                </span>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                <span className="text-lg block mb-1">🍵</span>
                <span className="font-bold text-amber-900 block text-[11px]">Jeera & Ginger Water</span>
                <span className="text-[10px] text-slate-600 mt-0.5 block leading-snug">
                  Natural carminative and prostaglandin soothing spices.
                </span>
              </div>
            </div>
          </div>

          {/* Mind & Body Stress Care */}
          <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-white rounded-3xl p-4 border border-pink-100 shadow-2xs flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xl shrink-0">
              🧘‍♀️
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800">
                Mindful Rest Streak
              </h5>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                You've consistently logged your body state this week! Honoring your pace is the foundation of hormonal balance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
