import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, HeartHandshake, PhoneCall, ArrowLeft } from 'lucide-react';

interface UnderAgeScreenProps {
  onBack: () => void;
}

export const UnderAgeScreen: React.FC<UnderAgeScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white flex flex-col justify-between p-6 max-w-md mx-auto text-center">
      <div className="pt-4 flex justify-start">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 bg-white/80 border border-pink-200 px-3 py-1.5 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('onboarding.under18Back')}</span>
        </button>
      </div>

      <div className="my-auto py-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4 shadow-inner">
          <HeartHandshake className="w-10 h-10" />
        </div>

        <h2 className="text-xl font-bold text-slate-800 leading-snug">
          {t('onboarding.under18Title')}
        </h2>

        <p className="text-xs text-slate-600 mt-3 px-4 leading-relaxed">
          {t('onboarding.under18Message')}
        </p>

        {/* Zero Data Guarantee */}
        <div className="mt-6 bg-white border border-purple-200 rounded-xl p-3.5 text-left w-full shadow-2xs">
          <div className="flex items-center space-x-2 text-purple-700 font-semibold text-xs mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Data Stored</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            In compliance with child privacy protection principles and healthcare regulations, no profile or entry is recorded.
          </p>
        </div>

        {/* Trusted Youth & Adolescent Helplines */}
        <div className="mt-4 bg-white border border-pink-100 rounded-xl p-3.5 text-left w-full shadow-2xs">
          <div className="flex items-center space-x-2 text-pink-700 font-semibold text-xs mb-1.5">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Adolescent & Child Support Helplines</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span>National Childline (India):</span>
              <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">1098</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tele-MANAS Youth Wellness:</span>
              <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">14416</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-4">
        <button
          onClick={onBack}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-2xl shadow-sm transition text-xs"
        >
          {t('onboarding.under18Back')}
        </button>
      </div>
    </div>
  );
};
