import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Phone, X, ShieldAlert } from 'lucide-react';

export const RedFlagBanner: React.FC = () => {
  const { t } = useTranslation();
  const { activeRedFlag, dismissRedFlag } = useApp();

  if (!activeRedFlag) return null;

  return (
    <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mx-4 my-3 rounded-r-xl shadow-sm relative animate-fadeIn">
      <button
        onClick={dismissRedFlag}
        className="absolute top-3 right-3 text-rose-400 hover:text-rose-700 transition"
        title="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600 mt-0.5 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="pr-4">
          <h4 className="text-sm font-semibold text-rose-900 leading-snug">
            {activeRedFlag.title}
          </h4>
          <p className="text-xs text-rose-800 mt-1 leading-relaxed">
            {activeRedFlag.message}
          </p>

          <div className="mt-3 bg-white/80 p-2.5 rounded-lg border border-rose-200">
            <p className="text-[11px] font-semibold text-rose-900 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-rose-600" />
              Immediate Helplines & Medical Guidance:
            </p>
            <div className="space-y-1">
              {activeRedFlag.helplines.map((hl, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-medium">{hl.name}:</span>
                  <a
                    href={`tel:${hl.number.split('/')[0].trim()}`}
                    className="font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-0.5 rounded text-[11px] ml-2"
                  >
                    {hl.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-rose-600 mt-2 italic">
            {t('app.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};
