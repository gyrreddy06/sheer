import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  FileText, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  BookOpen, 
  Check, 
  ChevronRight,
  WifiOff
} from 'lucide-react';
import { ReportScreen } from './ReportScreen';
import { SettingsScreen } from './SettingsScreen';
import { LibraryScreen } from './LibraryScreen';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile, purgeAllData, exportDataJson } = useApp();

  const [activeSubView, setActiveSubView] = useState<'menu' | 'report' | 'settings' | 'library'>('menu');

  if (activeSubView === 'report') {
    return (
      <div>
        <div className="px-4 pt-2">
          <button
            onClick={() => setActiveSubView('menu')}
            className="text-xs font-semibold text-[#743B66] hover:underline mb-2 block"
          >
            ← Back to Profile
          </button>
        </div>
        <ReportScreen />
      </div>
    );
  }

  if (activeSubView === 'settings') {
    return (
      <div>
        <div className="px-4 pt-2">
          <button
            onClick={() => setActiveSubView('menu')}
            className="text-xs font-semibold text-[#743B66] hover:underline mb-2 block"
          >
            ← Back to Profile
          </button>
        </div>
        <SettingsScreen />
      </div>
    );
  }

  if (activeSubView === 'library') {
    return (
      <div>
        <div className="px-4 pt-2">
          <button
            onClick={() => setActiveSubView('menu')}
            className="text-xs font-semibold text-[#743B66] hover:underline mb-2 block"
          >
            ← Back to Profile
          </button>
        </div>
        <LibraryScreen />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* User Card */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-2xs flex items-center space-x-3.5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-rose-300 p-0.5">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
            🌸
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-slate-800">
            {profile.display_name || 'Companion'}
          </h2>
          <p className="text-[11px] text-slate-500 capitalize">
            {profile.goal?.replace('_', ' ') || 'Track periods'} • Age {profile.age_group}
          </p>
          <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            100% Private • Local Storage
          </span>
        </div>
      </div>

      {/* Main Options List */}
      <div className="bg-white rounded-3xl p-3 border border-pink-100 shadow-2xs space-y-1">
        {/* Doctor-Ready Report */}
        <button
          onClick={() => setActiveSubView('report')}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/70 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#743B66] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Doctor-Ready Report</span>
              <span className="text-[10px] text-slate-400">Generate 1-2 page clinical summary PDF</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Education Library */}
        <button
          onClick={() => setActiveSubView('library')}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/70 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Ask Her Health Library</span>
              <span className="text-[10px] text-slate-400">6 guides on PCOS, hygiene & hormones</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Privacy & Settings */}
        <button
          onClick={() => setActiveSubView('settings')}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/70 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Privacy & App Lock</span>
              <span className="text-[10px] text-slate-400">PIN lock, discreet mode, JSON export</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Discreet Mode Quick Switch Card */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
            {profile.discreet_mode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Discreet Mode</span>
            <span className="text-[10px] text-slate-400">Neutral app name 'S-Notes'</span>
          </div>
        </div>
        <button
          onClick={() => updateProfile({ discreet_mode: !profile.discreet_mode })}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
            profile.discreet_mode ? 'bg-[#743B66]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
              profile.discreet_mode ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};
