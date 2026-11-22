import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { 
  calculateCyclePrediction, 
  formatFriendlyDate, 
  formatDateISO 
} from '../../lib/cycleMath';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Droplet, 
  Sparkles, 
  Smile, 
  Flame, 
  Stethoscope, 
  BellRing,
  GlassWater 
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    profile, 
    periodLogs, 
    setActiveTab, 
    logPeriod,
    removePeriodLog 
  } = useApp();

  const isTelugu = i18n.language === 'te';
  const todayStr = formatDateISO(new Date());
  const isPeriodLoggedToday = periodLogs.some(p => p.log_date === todayStr);

  const sortedLogs = [...periodLogs].sort((a, b) => b.log_date.localeCompare(a.log_date));
  const latestLog = sortedLogs[0];
  const baselineDate = latestLog ? latestLog.log_date : todayStr;

  const prediction = calculateCyclePrediction(
    baselineDate,
    profile.cycle_length_estimate || 28,
    profile.period_duration_estimate || 5,
    !profile.is_cycle_regular
  );

  const formattedStart = formatFriendlyDate(prediction.expectedPeriodStartRange.start, i18n.language);
  const formattedEnd = formatFriendlyDate(prediction.expectedPeriodStartRange.end, i18n.language);

  // Days remaining calculation
  const nextStart = new Date(prediction.expectedPeriodStartRange.start + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.max(1, Math.ceil((nextStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="pb-24 pt-1 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* 1. Next Period in Card (matching photo) */}
      <div 
        onClick={() => setActiveTab('calendar')}
        className="bg-gradient-to-r from-purple-100/70 via-pink-100/60 to-purple-50 p-4 rounded-3xl border border-purple-200/50 shadow-2xs flex items-center justify-between cursor-pointer hover:shadow-xs transition"
      >
        <div>
          <span className="text-[11px] font-medium text-purple-900/80 block">
            Next Period in
          </span>
          <div className="text-xl font-extrabold text-[#743B66] mt-0.5 tracking-tight">
            {diffDays} days
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {formattedStart} – {formattedEnd} (est.)
          </span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/90 border border-purple-200 flex items-center justify-center text-[#743B66] shadow-2xs">
          <CalendarIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Pre-Period Checkup Notice Card */}
      <div 
        onClick={() => setActiveTab('reminders')}
        className="bg-gradient-to-r from-rose-50 to-pink-50 border border-pink-200/80 p-3.5 rounded-3xl flex items-center justify-between shadow-2xs cursor-pointer hover:shadow-xs transition"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-tight">
              {isTelugu ? 'ప్యాడ్లు & నీటి బాటిల్ సిద్ధంగా ఉంచుకోండి' : 'Pre-Period Checkup: Keep pads nearby'}
            </h4>
            <p className="text-[10.5px] text-slate-500 mt-0.5">
              {isTelugu ? 'రిమైండర్లు & షెడ్యూలింగ్ చూడండి' : 'Check bag essentials & drink water timely'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* 2. Large Central Circular Gauge: Day 18 Fertile Window (matching photo) */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-2xs flex flex-col items-center text-center relative overflow-hidden">
        {/* Soft floral background aura */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100/40 rounded-full blur-xl pointer-events-none" />

        {/* Circular Progress Ring */}
        <div className="relative w-44 h-44 flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-pink-100"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Gradient Active Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-[#8C5383]"
              strokeWidth="6"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * (prediction.cycleDay / (profile.cycle_length_estimate || 28)))}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#8C5383] flex items-center justify-center mb-1">
              <Droplet className="w-4 h-4 fill-[#8C5383]" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              Day {prediction.cycleDay}
            </span>
            <span className="text-xs font-semibold text-[#8C5383] mt-0.5">
              {prediction.phase === 'ovulatory' ? 'Fertile Window' : prediction.phaseName}
            </span>
          </div>
        </div>

        {/* View Calendar Button */}
        <button
          onClick={() => setActiveTab('calendar')}
          className="mt-2 text-xs font-bold text-[#743B66] hover:text-[#5c2d51] flex items-center space-x-1 py-1.5 px-3 rounded-full hover:bg-pink-50 transition"
        >
          <span>View Calendar</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Quick Actions: 4 Colorful Rounded Squircle Cards (matching photo) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {/* Action 1: Log Symptoms (Pink) */}
          <button
            onClick={() => setActiveTab('symptoms')}
            className="flex flex-col items-center p-2.5 bg-white border border-pink-100 rounded-2xl shadow-2xs hover:shadow-xs active:scale-95 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700 leading-tight text-center">
              Log Symptoms
            </span>
          </button>

          {/* Action 2: Track Mood (Peach/Orange) */}
          <button
            onClick={() => setActiveTab('mood')}
            className="flex flex-col items-center p-2.5 bg-white border border-pink-100 rounded-2xl shadow-2xs hover:shadow-xs active:scale-95 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Smile className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700 leading-tight text-center">
              Track Mood
            </span>
          </button>

          {/* Action 3: Wellness Tips / Do's & Don'ts (Yellow/Gold) */}
          <button
            onClick={() => setActiveTab('ai')}
            className="flex flex-col items-center p-2.5 bg-white border border-pink-100 rounded-2xl shadow-2xs hover:shadow-xs active:scale-95 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700 leading-tight text-center">
              Wellness Tips
            </span>
          </button>

          {/* Action 4: Reminders / Scheduling (Purple/Blue) */}
          <button
            onClick={() => setActiveTab('reminders')}
            className="flex flex-col items-center p-2.5 bg-white border border-pink-100 rounded-2xl shadow-2xs hover:shadow-xs active:scale-95 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
              <BellRing className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700 leading-tight text-center">
              Reminders
            </span>
          </button>
        </div>
      </div>

      {/* 4. Today's Wellness Tip Card (matching photo with water glass) */}
      <div 
        onClick={() => setActiveTab('reminders')}
        className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/70 p-4 rounded-3xl border border-blue-100 shadow-2xs flex items-center justify-between cursor-pointer hover:shadow-xs transition"
      >
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-indigo-900 block flex items-center gap-1">
            <span>Today's Wellness Tip</span>
            <span className="text-[10px] text-indigo-600 font-normal">• Set water alert</span>
          </span>
          <p className="text-xs text-slate-700 leading-relaxed max-w-[240px]">
            "Drink water, your body will thank you!" 💧
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-white/90 border border-blue-200 flex items-center justify-center text-blue-500 shadow-2xs">
          <span className="text-2xl">🥛</span>
        </div>
      </div>
    </div>
  );
};
