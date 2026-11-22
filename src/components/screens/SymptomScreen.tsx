import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { formatDateISO } from '../../lib/cycleMath';
import { 
  ChevronLeft, 
  Zap, 
  Brain, 
  Heart, 
  Sparkles, 
  Battery, 
  Moon, 
  Smile, 
  Plus, 
  Check 
} from 'lucide-react';

interface SymptomTile {
  code: string;
  label: string;
  icon: string;
  bg: string;
}

const SYMPTOM_TILES: SymptomTile[] = [
  { code: 'cramps', label: 'Cramps', icon: '⚡', bg: 'bg-rose-100/70 text-rose-600 border-rose-200' },
  { code: 'headache', label: 'Headache', icon: '🧠', bg: 'bg-purple-100/70 text-purple-600 border-purple-200' },
  { code: 'bloating', label: 'Bloating', icon: '🎈', bg: 'bg-orange-100/70 text-orange-600 border-orange-200' },
  { code: 'acne', label: 'Acne', icon: '✨', bg: 'bg-pink-100/70 text-pink-600 border-pink-200' },
  { code: 'fatigue', label: 'Fatigue', icon: '🔋', bg: 'bg-blue-100/70 text-blue-600 border-blue-200' },
  { code: 'breast_tenderness', label: 'Breast Tenderness', icon: '🌸', bg: 'bg-purple-100/70 text-purple-600 border-purple-200' },
  { code: 'mood_swings', label: 'Mood Swings', icon: '🎭', bg: 'bg-amber-100/70 text-amber-600 border-amber-200' },
  { code: 'sleep_changes', label: 'Sleep Change', icon: '🛏️', bg: 'bg-indigo-100/70 text-indigo-600 border-indigo-200' },
  { code: 'others', label: 'Others', icon: '➕', bg: 'bg-slate-100/80 text-slate-600 border-slate-200' },
];

export const SymptomScreen: React.FC = () => {
  const { t } = useTranslation();
  const { symptomLogs, saveSymptom, setActiveTab } = useApp();

  const todayStr = formatDateISO(new Date());

  const [selectedCodes, setSelectedCodes] = useState<string[]>(['cramps']);
  const [painLevel, setPainLevel] = useState<number>(3); // 1 to 5 scale matching photo
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const toggleSymptom = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSave = () => {
    const intensityTenScale = Math.round((painLevel / 5) * 10);
    selectedCodes.forEach(code => {
      saveSymptom(code, intensityTenScale, todayStr);
    });
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      setActiveTab('home');
    }, 1000);
  };

  const getPainLevelText = (val: number) => {
    if (val <= 1) return 'Mild (1/5)';
    if (val <= 2) return 'Light (2/5)';
    if (val <= 3) return 'Moderate (3/5)';
    if (val <= 4) return 'High (4/5)';
    return 'Severe (5/5)';
  };

  return (
    <div className="pb-24 pt-1 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Top Header with Back Arrow (matching photo) */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-full bg-white border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold text-slate-800">
          Track Symptoms
        </h2>
      </div>

      <div className="text-center pt-1 pb-1">
        <h3 className="text-sm font-bold text-slate-800">
          How are you feeling today?
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Select all that apply
        </p>
      </div>

      {/* 3x3 Grid of 9 Rounded Squircle Tiles (matching photo) */}
      <div className="grid grid-cols-3 gap-2.5">
        {SYMPTOM_TILES.map(tile => {
          const isSelected = selectedCodes.includes(tile.code);
          return (
            <button
              key={tile.code}
              onClick={() => toggleSymptom(tile.code)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition active:scale-95 ${
                isSelected
                  ? 'border-[#743B66] bg-pink-100/70 shadow-2xs ring-2 ring-[#743B66]/30'
                  : 'border-pink-100 bg-white hover:border-pink-200'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-1.5 ${tile.bg}`}>
                {tile.icon}
              </div>
              <span className={`text-[10.5px] font-semibold leading-tight line-clamp-1 ${
                isSelected ? 'text-[#743B66]' : 'text-slate-700'
              }`}>
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pain Level Slider (matching photo: "Pain Level: Moderate (3/5)") */}
      <div className="bg-white p-4 rounded-3xl border border-pink-100 shadow-2xs space-y-2 mt-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-800">
          <span>Pain Level</span>
          <span className="text-[#743B66]">{getPainLevelText(painLevel)}</span>
        </div>

        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={painLevel}
          onChange={e => setPainLevel(Number(e.target.value))}
          className="w-full accent-[#743B66]"
        />

        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      {/* Deep Purple Save Entry Button (matching photo) */}
      <button
        onClick={handleSave}
        className="w-full bg-[#743B66] hover:bg-[#5c2d51] text-white font-bold py-3.5 rounded-2xl shadow-sm text-xs transition active:scale-[0.99] flex items-center justify-center space-x-2"
      >
        <span>Save Entry</span>
      </button>

      {showSavedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Symptom entry saved!</span>
        </div>
      )}
    </div>
  );
};
