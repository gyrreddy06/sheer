import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Bell, Eye, EyeOff, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile, changeLanguage, setActiveTab, reminders } = useApp();

  const appDisplayName = profile.discreet_mode
    ? profile.discreet_app_name || 'S-Notes'
    : profile.display_name || 'Priya';

  const toggleDiscreet = () => {
    updateProfile({ discreet_mode: !profile.discreet_mode });
  };

  const hasActiveReminders = reminders.some(r => r.enabled);

  return (
    <header className="sticky top-0 z-30 bg-[#FFF5F7]/90 backdrop-blur-md px-5 pt-3 pb-2 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* User Greeting & Avatar matching the photo */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200 bg-pink-100 flex items-center justify-center text-lg shadow-2xs group-hover:scale-105 transition">
              🌸
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-1">
              <span>Hi, {appDisplayName}!</span>
              <span>🌸</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              You're doing great!
            </p>
          </div>
        </div>

        {/* Right Action Icons: Language Pill, Discreet Eye, Bell */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher Pill */}
          <button
            onClick={() => changeLanguage(profile.app_language === 'en' ? 'te' : 'en')}
            className="flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-pink-100/70 text-[#743B66] border border-pink-200 transition active:scale-95"
            title="Switch Language"
          >
            <Globe className="w-3 h-3" />
            <span>{profile.app_language === 'en' ? 'తెలుగు' : 'EN'}</span>
          </button>

          {/* Discreet Toggle */}
          <button
            onClick={toggleDiscreet}
            className={`p-2 rounded-full border transition active:scale-95 ${
              profile.discreet_mode
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-white border-pink-200 text-slate-500 hover:text-slate-700 shadow-2xs'
            }`}
            title={profile.discreet_mode ? 'Exit Discreet Mode' : 'Enter Discreet Mode'}
          >
            {profile.discreet_mode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Notification Bell -> Opens Reminders Screen */}
          <button 
            onClick={() => setActiveTab('reminders')}
            className="relative p-2 rounded-full bg-white border border-pink-200 text-slate-600 hover:text-slate-900 shadow-2xs transition active:scale-95"
            title="Reminders & Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasActiveReminders && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#743B66] rounded-full border border-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
