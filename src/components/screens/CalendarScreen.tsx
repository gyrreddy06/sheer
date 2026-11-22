import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { FlowIntensity } from '../../types';
import { 
  formatDateISO, 
  formatFriendlyDate, 
  calculateCyclePrediction 
} from '../../lib/cycleMath';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Trash2, 
  Droplet 
} from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    periodLogs, 
    logPeriod, 
    removePeriodLog, 
    profile, 
    setActiveTab 
  } = useApp();

  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(formatDateISO(new Date()));
  const [selectedFlow, setSelectedFlow] = useState<FlowIntensity>('medium');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sortedLogs = [...periodLogs].sort((a, b) => b.log_date.localeCompare(a.log_date));
  const latestLog = sortedLogs[0];
  const baselineDate = latestLog ? latestLog.log_date : formatDateISO(new Date());

  const prediction = calculateCyclePrediction(
    baselineDate,
    profile.cycle_length_estimate || 28,
    profile.period_duration_estimate || 5,
    !profile.is_cycle_regular
  );

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clicked = new Date(year, month, day);
    const dateStr = formatDateISO(clicked);
    setSelectedDateStr(dateStr);

    const existingLog = periodLogs.find(p => p.log_date === dateStr);
    if (existingLog) {
      setSelectedFlow(existingLog.flow_intensity);
    } else {
      setSelectedFlow('medium');
    }
  };

  const currentSelectedLog = periodLogs.find(p => p.log_date === selectedDateStr);

  return (
    <div className="pb-24 pt-1 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Top Header with Back Arrow (matching photo) */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-full bg-white border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold text-slate-800">
          Period Calendar
        </h2>
        <div className="p-2 rounded-full bg-white border border-pink-100 text-[#743B66]">
          <CalendarIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Month Navigator Header (< April 2025 >) */}
      <div className="flex items-center justify-between px-2 pt-1">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-full hover:bg-pink-100 text-slate-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-bold text-slate-800">
          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-full hover:bg-pink-100 text-slate-600 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid Container (matching photo) */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-2xs">
        {/* Day Header (Sun Mon Tue Wed Thu Fri Sat) */}
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisDateStr = formatDateISO(new Date(year, month, dayNum));
            const isSelected = selectedDateStr === thisDateStr;
            const log = periodLogs.find(p => p.log_date === thisDateStr);

            const isExpectedPeriod = 
              thisDateStr >= prediction.expectedPeriodStartRange.start &&
              thisDateStr <= prediction.expectedPeriodStartRange.end;

            const isOvulationWindow = 
              thisDateStr >= prediction.ovulationWindowEstimate.start &&
              thisDateStr <= prediction.ovulationWindowEstimate.end;

            return (
              <button
                key={dayNum}
                onClick={() => handleDateClick(dayNum)}
                className={`h-9 w-9 mx-auto rounded-full flex flex-col items-center justify-center transition relative ${
                  isSelected
                    ? 'ring-2 ring-[#743B66] font-bold'
                    : 'hover:bg-pink-50'
                } ${
                  log
                    ? 'bg-rose-400 text-white font-bold shadow-2xs'
                    : isExpectedPeriod
                    ? 'bg-rose-100 text-rose-800 font-medium'
                    : isOvulationWindow
                    ? 'bg-purple-100 text-purple-900 font-medium'
                    : 'text-slate-700'
                }`}
              >
                <span>{dayNum}</span>
              </button>
            );
          })}
        </div>

        {/* Legend (matching photo: Period, Fertile Window, Ovulation) */}
        <div className="flex items-center justify-around pt-5 border-t border-slate-100 mt-4 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Period</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Fertile Window</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Ovulation</span>
          </div>
        </div>
      </div>

      {/* Your Cycle Stats Card (matching photo) */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold text-slate-800">
          Your Cycle Stats
        </h4>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <div>
              <span className="font-bold text-slate-800 block text-sm">
                {profile.cycle_length_estimate || 28} days
              </span>
              <span className="text-[10.5px] text-slate-400">Avg Cycle Length</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <div>
              <span className="font-bold text-slate-800 block text-sm">
                {profile.period_duration_estimate || 5} days
              </span>
              <span className="text-[10.5px] text-slate-400">Avg Period</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('insights')}
          className="w-full text-center text-xs font-bold text-[#743B66] hover:underline pt-2 border-t border-slate-100"
        >
          View Full History →
        </button>
      </div>

      {/* Quick Flow Logger for selected date */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800">
            Log Bleeding for {formatFriendlyDate(selectedDateStr, i18n.language)}
          </span>
          {currentSelectedLog && (
            <button
              onClick={() => removePeriodLog(selectedDateStr)}
              className="text-rose-500 hover:text-rose-700 text-xs flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {(['spotting', 'light', 'medium', 'heavy'] as FlowIntensity[]).map(f => (
            <button
              key={f}
              onClick={() => logPeriod(selectedDateStr, f)}
              className={`py-2 rounded-xl text-xs font-semibold capitalize border transition ${
                currentSelectedLog?.flow_intensity === f
                  ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                  : 'bg-white border-pink-100 text-slate-600 hover:border-pink-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
