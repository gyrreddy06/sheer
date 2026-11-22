import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { MoodType } from '../../types';
import { formatDateISO } from '../../lib/cycleMath';
import { ChevronLeft, Pencil, Check } from 'lucide-react';

export const MoodScreen: React.FC = () => {
  const { t } = useTranslation();
  const { saveCheckin, dailyCheckins, setActiveTab } = useApp();

  const todayStr = formatDateISO(new Date());
  const existingToday = dailyCheckins.find(c => c.log_date === todayStr);

  const [selectedMood, setSelectedMood] = useState<MoodType>(existingToday?.mood || 'calm');
  const [note, setNote] = useState<string>(existingToday?.notes || '');
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const moods: { id: MoodType; label: string; emoji: string; bg: string }[] = [
    { id: 'happy', label: 'Happy', emoji: '😊', bg: 'bg-amber-100/60 border-amber-200' },
    { id: 'calm', label: 'Calm', emoji: '😌', bg: 'bg-orange-100/60 border-orange-200' },
    { id: 'sensitive', label: 'Excited', emoji: '🤩', bg: 'bg-yellow-100/60 border-yellow-200' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', bg: 'bg-amber-100/60 border-amber-200' },
    { id: 'low_energy', label: 'Sad', emoji: '🥺', bg: 'bg-blue-100/60 border-blue-200' },
    { id: 'irritable', label: 'Stressed', emoji: '😤', bg: 'bg-rose-100/60 border-rose-200' },
  ];

  const handleSave = () => {
    saveCheckin({
      log_date: todayStr,
      mood: selectedMood,
      energy_level: 4,
      sleep_hours: 7.5,
      notes: note.trim() || undefined,
    });
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      setActiveTab('home');
    }, 1000);
  };

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
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            How's your mood today?
          </h2>
          <p className="text-[11px] text-purple-700/80 font-medium">
            It's okay to feel what you feel 💜
          </p>
        </div>
      </div>

      {/* 2x3 Grid of 6 Big Expressive Emoji Cards (matching photo) */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {moods.map(m => {
          const isSelected = selectedMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`p-4 rounded-3xl border flex flex-col items-center justify-center transition active:scale-95 ${
                isSelected
                  ? 'border-[#743B66] bg-pink-100/70 shadow-sm ring-2 ring-[#743B66]/30'
                  : 'border-pink-100 bg-white hover:border-pink-200'
              }`}
            >
              <span className="text-4xl mb-2 filter drop-shadow-xs">{m.emoji}</span>
              <span className={`text-xs font-semibold ${isSelected ? 'text-[#743B66]' : 'text-slate-700'}`}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add a note (optional)... with pencil icon (matching photo) */}
      <div className="bg-white p-3.5 rounded-3xl border border-pink-100 shadow-2xs space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Pencil className="w-3.5 h-3.5 text-slate-400" />
          <span>Add a note (optional)...</span>
        </div>
        <textarea
          rows={2}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="How are you feeling mentally or physically right now?"
          className="w-full text-xs p-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none"
        />
      </div>

      {/* Supportive Quote Card with Woman Illustration (matching photo) */}
      <div className="bg-gradient-to-r from-pink-100/80 via-purple-100/60 to-rose-100/70 p-4 rounded-3xl border border-pink-200/60 flex items-center space-x-3 shadow-2xs">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-pink-200 flex items-center justify-center text-2xl shrink-0">
          🧘‍♀️
        </div>
        <div>
          <p className="text-xs font-bold text-[#743B66]">
            You're stronger than you think 💜
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
            Take a deep breath. Honor your feelings without judgment.
          </p>
        </div>
      </div>

      {/* Deep Purple Save Mood Button (matching photo) */}
      <button
        onClick={handleSave}
        className="w-full bg-[#743B66] hover:bg-[#5c2d51] text-white font-bold py-3.5 rounded-2xl shadow-sm text-xs transition active:scale-[0.99] flex items-center justify-center space-x-2"
      >
        <span>Save Mood</span>
      </button>

      {showSavedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mood recorded gently.</span>
        </div>
      )}
    </div>
  );
};
