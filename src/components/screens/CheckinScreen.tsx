import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { MoodType } from '../../types';
import { formatDateISO } from '../../lib/cycleMath';
import { 
  Sparkles, 
  Smile, 
  Moon, 
  Zap, 
  FileText, 
  Check, 
  HeartHandshake 
} from 'lucide-react';

export const CheckinScreen: React.FC = () => {
  const { t } = useTranslation();
  const { saveCheckin, dailyCheckins, setActiveTab } = useApp();

  const todayStr = formatDateISO(new Date());
  const existingToday = dailyCheckins.find(c => c.log_date === todayStr);

  const [mood, setMood] = useState<MoodType>(existingToday?.mood || 'calm');
  const [energy, setEnergy] = useState<number>(existingToday?.energy_level || 3);
  const [sleep, setSleep] = useState<number>(existingToday?.sleep_hours || 7.5);
  const [notes, setNotes] = useState<string>(existingToday?.notes || '');
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const moods: { id: MoodType; label: string; emoji: string }[] = [
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'happy', label: 'Energetic', emoji: '😊' },
    { id: 'sensitive', label: 'Sensitive', emoji: '🥺' },
    { id: 'anxious', label: 'Anxious', emoji: '😰' },
    { id: 'irritable', label: 'Irritable', emoji: '😤' },
    { id: 'low_energy', label: 'Low Energy', emoji: '🥱' },
    { id: 'exhausted', label: 'Exhausted', emoji: '🛌' },
  ];

  const handleSave = () => {
    saveCheckin({
      log_date: todayStr,
      mood,
      energy_level: energy,
      sleep_hours: sleep,
      notes: notes.trim() || undefined,
    });
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      setActiveTab('home');
    }, 1200);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Title */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-100">
        <div className="flex items-center space-x-2 text-pink-600 mb-1">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-sm font-bold text-slate-800">
            {t('checkin.title')}
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          {t('checkin.subtitle')}
        </p>
      </div>

      {/* Mood Selector */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2.5">
        <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
          <Smile className="w-4 h-4 text-pink-500" />
          <span>{t('checkin.moodLabel')}</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {moods.map(m => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition ${
                mood === m.id
                  ? 'border-pink-500 bg-pink-50 text-pink-900 font-bold shadow-2xs'
                  : 'border-slate-200 hover:border-pink-200 text-slate-700'
              }`}
            >
              <span className="text-2xl mb-1">{m.emoji}</span>
              <span className="text-[10px] leading-tight">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level (1-5) */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t('checkin.energyLabel')}</span>
          </label>
          <span className="text-xs font-bold text-amber-600">{energy} / 5</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={energy}
          onChange={e => setEnergy(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Depleted</span>
          <span>Moderate</span>
          <span>Vibrant</span>
        </div>
      </div>

      {/* Sleep Duration */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
            <Moon className="w-4 h-4 text-purple-500" />
            <span>{t('checkin.sleepLabel')}</span>
          </label>
          <span className="text-xs font-bold text-purple-600">{sleep} hrs</span>
        </div>
        <input
          type="range"
          min="3"
          max="12"
          step="0.5"
          value={sleep}
          onChange={e => setSleep(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      {/* Private Notes */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2">
        <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-slate-500" />
          <span>{t('checkin.notesLabel')}</span>
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t('checkin.notesPlaceholder')}
          className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 resize-none"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-2xl shadow-sm text-xs transition flex items-center justify-center space-x-2"
      >
        <Check className="w-4 h-4" />
        <span>{t('checkin.save')}</span>
      </button>

      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('checkin.savedSuccess')}</span>
        </div>
      )}
    </div>
  );
};
