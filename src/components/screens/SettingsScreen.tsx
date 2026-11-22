import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  FileText, 
  Globe, 
  KeyRound, 
  Check, 
  AlertTriangle,
  WifiOff,
  ChevronRight
} from 'lucide-react';
import { LanguageCode } from '../../types';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { 
    profile, 
    updateProfile, 
    changeLanguage, 
    setAppPin, 
    exportDataJson, 
    purgeAllData 
  } = useApp();

  const [pinInput, setPinInput] = useState<string>('');
  const [isEditingPin, setIsEditingPin] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const handleSavePin = () => {
    if (pinInput.length === 4) {
      setAppPin(pinInput);
      setIsEditingPin(false);
      setPinInput('');
    }
  };

  const handleRemovePin = () => {
    setAppPin(null);
    setIsEditingPin(false);
  };

  const handleDownloadJson = () => {
    const dataStr = exportDataJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SheOra_Encrypted_Export_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Title */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
        <div className="flex items-center space-x-2 text-purple-600 mb-1">
          <Shield className="w-5 h-5" />
          <h2 className="text-sm font-bold text-slate-800">
            {t('settings.title')}
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Language Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2">
        <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
          <Globe className="w-4 h-4 text-pink-500" />
          <span>App Language</span>
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { code: 'en' as LanguageCode, label: 'English' },
            { code: 'te' as LanguageCode, label: 'తెలుగు' },
            { code: 'hi' as LanguageCode, label: 'हिन्दी' },
          ].map(l => (
            <button
              key={l.code}
              onClick={() => changeLanguage(l.code)}
              className={`py-2 rounded-xl border text-center transition ${
                profile.app_language === l.code
                  ? 'border-pink-500 bg-pink-50 text-pink-800 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-pink-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discreet Mode */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
              {profile.discreet_mode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">{t('settings.discreetMode')}</h4>
              <p className="text-[11px] text-slate-500 max-w-[240px]">
                {t('settings.discreetDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => updateProfile({ discreet_mode: !profile.discreet_mode })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
              profile.discreet_mode ? 'bg-purple-600' : 'bg-slate-300'
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

      {/* Low-Data Mode Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">{t('settings.lowDataMode')}</h4>
              <p className="text-[11px] text-slate-500 max-w-[240px]">
                {t('settings.lowDataDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => updateProfile({ low_data_mode: !profile.low_data_mode })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
              profile.low_data_mode ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                profile.low_data_mode ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security PIN Lock */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-pink-100 text-pink-600">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">{t('settings.pinLock')}</h4>
              <p className="text-[11px] text-slate-500">
                {profile.pin_hash ? '4-digit PIN is active' : 'No PIN configured'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingPin(!isEditingPin)}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200"
          >
            {profile.pin_hash ? t('settings.changePin') : 'Set PIN'}
          </button>
        </div>

        {isEditingPin && (
          <div className="pt-2 border-t border-slate-100 space-y-2 animate-fadeIn">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 4-digit PIN"
              className="w-full text-center tracking-widest text-base p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSavePin}
                disabled={pinInput.length !== 4}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-xs transition"
              >
                Save PIN
              </button>
              {profile.pin_hash && (
                <button
                  onClick={handleRemovePin}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs transition"
                >
                  Disable PIN
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Data Export (JSON) */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{t('settings.exportData')}</h4>
            <p className="text-[11px] text-slate-500">
              {t('settings.exportDesc')}
            </p>
          </div>
        </div>
        <button
          onClick={handleDownloadJson}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition"
        >
          Export
        </button>
      </div>

      {/* Consent Withdrawal & Full Deletion */}
      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs space-y-2">
        <div className="flex items-center space-x-2 text-rose-600">
          <Trash2 className="w-4 h-4" />
          <h4 className="text-xs font-bold text-rose-900">{t('settings.withdrawConsent')}</h4>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {t('settings.withdrawDesc')}
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full mt-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold py-2 rounded-xl text-xs transition"
        >
          Permanently Erase All Data
        </button>
      </div>

      {/* Legal & Compliance Links */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-2">
        <h4 className="text-xs font-bold text-slate-800 mb-1">
          {t('settings.legalHeading')}
        </h4>
        <button
          onClick={() => setActiveLegalModal('privacy')}
          className="w-full flex items-center justify-between text-xs text-slate-700 py-1.5 border-b border-slate-100"
        >
          <span>{t('settings.privacyPolicy')}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <button
          onClick={() => setActiveLegalModal('terms')}
          className="w-full flex items-center justify-between text-xs text-slate-700 py-1.5"
        >
          <span>{t('settings.termsOfService')}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('settings.deleteConfirmTitle')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('settings.deleteConfirmMsg')}
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  purgeAllData();
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                {t('settings.deleteButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Text Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {activeLegalModal === 'privacy' 
                  ? 'Privacy Policy (Draft: requires legal review)' 
                  : 'Terms of Service (Draft: requires legal review)'}
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p className="italic text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ⚠️ NOTICE: This legal draft is a placeholder pending formal legal review by qualified counsel under Indian IT Act and Digital Personal Data Protection (DPDP) Act.
              </p>

              {activeLegalModal === 'privacy' ? (
                <>
                  <p><strong>1. Data Minimization</strong>: SheOra does not mandate your legal name or government ID. All records are tied solely to your authentication identifier.</p>
                  <p><strong>2. Zero Ad Tracking</strong>: We do not integrate third-party advertising SDKs, pixel trackers, or analytics brokers. Your health data is never monetized or sold.</p>
                  <p><strong>3. Row-Level Security</strong>: Postgres Row Level Security (RLS) ensures only your authenticated session can access your cycle entries.</p>
                  <p><strong>4. Right to Erasure</strong>: You may delete all logs and account records anytime in settings with immediate effect.</p>
                </>
              ) : (
                <>
                  <p><strong>1. Non-Diagnostic Purpose</strong>: SheOra provides statistical tracking tools and plain-language summaries for personal educational use. SheOra is NOT a medical device, diagnostic system, or method of contraception.</p>
                  <p><strong>2. Age Restriction</strong>: The application is restricted to individuals aged 18 and older.</p>
                  <p><strong>3. Emergency Circumstances</strong>: If you experience acute symptoms or physical emergency, contact local hospital emergency facilities (108 / 112) immediately.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveLegalModal(null)}
              className="w-full mt-4 bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
