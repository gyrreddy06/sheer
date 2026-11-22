import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Clock, Heart, Sparkles, Globe } from 'lucide-react';
import { LanguageCode } from '../../types';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useTranslation();
  const { profile, changeLanguage } = useApp();

  const [page, setPage] = useState<number>(1); // 1 = Splash, 2 = Carousel Welcome

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] via-[#FDF2F8] to-[#FFF5F7] flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Soft background floral circles */}
      <div className="absolute top-10 -right-14 w-48 h-48 bg-pink-200/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 -left-14 w-48 h-48 bg-purple-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Language Switcher */}
      <div className="flex justify-between items-center z-10 pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          SHEORA
        </span>
        <button
          onClick={() => changeLanguage(profile.app_language === 'en' ? 'te' : 'en')}
          className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 border border-pink-200 text-[#743B66] shadow-2xs"
        >
          <Globe className="w-3 h-3" />
          <span>{profile.app_language === 'en' ? 'తెలుగు' : 'English'}</span>
        </button>
      </div>

      {/* SCREEN 1: Splash / Brand Cover (matching Photo Screen 1) */}
      {page === 1 && (
        <div className="my-auto flex flex-col items-center text-center animate-fadeIn py-6">
          {/* Lotus Icon */}
          <div className="w-14 h-14 rounded-full bg-white/80 border border-pink-200 shadow-2xs flex items-center justify-center text-2xl mb-4">
            🪷
          </div>

          <h1 className="text-3xl font-extrabold text-[#743B66] tracking-tight font-serif">
            SHEORA
          </h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide mt-1 mb-8">
            Her health. Her journey.
          </p>

          {/* Serene Woman Illustration Card */}
          <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-pink-200/50 via-purple-100/50 to-rose-200/40 p-4 flex items-center justify-center shadow-inner relative mb-8">
            <span className="text-7xl">🧘‍♀️</span>
          </div>

          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Track • Understand • Thrive
          </p>

          {/* Deep Purple Next Arrow Button */}
          <button
            onClick={() => setPage(2)}
            className="w-14 h-14 rounded-full bg-[#743B66] hover:bg-[#5c2d51] text-white flex items-center justify-center shadow-md active:scale-95 transition"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* SCREEN 2: Welcome to SHEORA with 3 Feature Pills (matching Photo Screen 2) */}
      {page === 2 && (
        <div className="my-auto flex flex-col items-center text-center animate-fadeIn py-4">
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">
            Welcome to <span className="text-[#743B66]">SHEORA 💜</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6 max-w-[260px]">
            Your personal companion for every phase of womanhood.
          </p>

          {/* Woman Hugging Herself Illustration */}
          <div className="w-48 h-48 rounded-full bg-pink-100/60 p-4 flex items-center justify-center shadow-inner mb-6 relative">
            <span className="text-6xl">🌸</span>
          </div>

          {/* 3 Feature Pills (matching photo: Track your cycle, Know your body, Feel your best) */}
          <div className="w-full space-y-2.5 max-w-xs mb-8">
            <div className="bg-white/90 border border-pink-100 rounded-2xl p-3 flex items-center space-x-3 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs">
                ⏱
              </div>
              <span className="text-xs font-bold text-slate-700">Track your cycle</span>
            </div>

            <div className="bg-white/90 border border-pink-100 rounded-2xl p-3 flex items-center space-x-3 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">
                🤍
              </div>
              <span className="text-xs font-bold text-slate-700">Know your body</span>
            </div>

            <div className="bg-white/90 border border-pink-100 rounded-2xl p-3 flex items-center space-x-3 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                💗
              </div>
              <span className="text-xs font-bold text-slate-700">Feel your best</span>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex space-x-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#743B66]" />
            <div className="w-2 h-2 rounded-full bg-pink-200" />
            <div className="w-2 h-2 rounded-full bg-pink-200" />
          </div>

          {/* Get Started Button */}
          <button
            onClick={onStart}
            className="w-full max-w-xs bg-[#743B66] hover:bg-[#5c2d51] text-white font-bold py-3.5 rounded-2xl shadow-md text-xs transition active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-400 mt-3">
            Already have an account? <span className="text-[#743B66] font-semibold cursor-pointer" onClick={onStart}>Log in</span>
          </p>
        </div>
      )}

      {/* Footer Age Note */}
      <div className="text-center text-[10px] text-slate-400 z-10">
        Designed for adult women 18–35 • 100% Private & Encrypted
      </div>
    </div>
  );
};
