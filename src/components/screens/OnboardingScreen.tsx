import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { LanguageCode, UserGoal, Consents } from '../../types';
import { 
  Globe, 
  Shield, 
  Heart, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  AlertCircle,
  User,
  CheckCircle2
} from 'lucide-react';
import { formatDateISO } from '../../lib/cycleMath';

interface OnboardingScreenProps {
  onComplete: () => void;
  onUnderAgeTrigger: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  onComplete, 
  onUnderAgeTrigger 
}) => {
  const { t, i18n } = useTranslation();
  const { completeOnboarding, changeLanguage, profile } = useApp();

  const isTelugu = i18n.language === 'te';
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(profile.app_language || 'en');
  const [userName, setUserName] = useState<string>('Priya');
  const [dob, setDob] = useState<string>('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [ageGroup, setAgeGroup] = useState<'18-24' | '25-34' | '35+'>('18-24');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState<boolean>(false);
  
  // Consents: UNTICKED by default (Non-negotiable requirement)
  const [consents, setConsents] = useState<Consents>({
    terms_of_service: false,
    privacy_policy: false,
    sensitive_health_data_processing: false,
    local_storage_caching: false,
  });

  // Goal
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>('track_periods');

  // Cycle Basics
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [isIrregular, setIsIrregular] = useState<boolean>(false);
  const [dontKnowCycle, setDontKnowCycle] = useState<boolean>(false);

  // Handle language selection
  const handleSelectLanguage = (lang: LanguageCode) => {
    setSelectedLang(lang);
    changeLanguage(lang);
  };

  // Handle Date of Birth change & age calculation
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);

    if (val) {
      const birthDate = new Date(val + 'T00:00:00');
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      setCalculatedAge(age);

      if (age < 18) {
        setIsAgeConfirmed(false);
      } else {
        setIsAgeConfirmed(true);
        if (age >= 18 && age <= 24) setAgeGroup('18-24');
        else if (age >= 25 && age <= 34) setAgeGroup('25-34');
        else setAgeGroup('35+');
      }
    } else {
      setCalculatedAge(null);
    }
  };

  // Toggle consent item
  const toggleConsent = (key: keyof Consents) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if all essential consents are given
  const canProceedConsents = consents.terms_of_service && 
    consents.privacy_policy && 
    consents.sensitive_health_data_processing;

  const handleFinish = () => {
    completeOnboarding({
      name: userName.trim() || 'Priya',
      dob: dob || undefined,
      ageGroup,
      goal: selectedGoal,
      consents,
      lastPeriodDate: dontKnowCycle ? undefined : (lastPeriodDate || undefined),
      cycleLength: dontKnowCycle ? 28 : cycleLength,
      periodLength: dontKnowCycle ? 5 : periodDuration,
      isIrregular: isIrregular || dontKnowCycle,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top progress indicator */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Step {step} of 5</span>
          <span className="font-semibold text-[#743B66]">
            {step === 1 && 'Language'}
            {step === 2 && 'Details & Age'}
            {step === 3 && 'Privacy & Consent'}
            {step === 4 && 'Your Goal'}
            {step === 5 && 'Cycle Basics'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-[#743B66] transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Contents */}
      <div className="my-auto py-6">
        {/* STEP 1: Language Choice */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#743B66] flex items-center justify-center mb-3">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('onboarding.step1Title')}
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              {t('onboarding.step1Subtitle')}
            </p>

            <div className="space-y-2.5">
              {[
                { code: 'en' as LanguageCode, label: 'English', sub: 'Primary English', available: true },
                { code: 'te' as LanguageCode, label: 'తెలుగు (Telugu)', sub: 'తెలంగాణ & ఆంధ్రప్రదేశ్', available: true },
                { code: 'hi' as LanguageCode, label: 'हिन्दी (Hindi)', sub: 'भारत', available: true },
                { code: 'ta' as LanguageCode, label: 'தமிழ் (Tamil)', sub: 'தமிழ்நாடு', available: false },
                { code: 'kn' as LanguageCode, label: 'ಕನ್ನಡ (Kannada)', sub: 'ಕರ್ನಾಟಕ', available: false },
                { code: 'ml' as LanguageCode, label: 'മലയാളം (Malayalam)', sub: 'കേരളം', available: false },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition ${
                    selectedLang === lang.code
                      ? 'border-[#743B66] bg-pink-100/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-pink-200'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-800">
                      {lang.label}
                    </div>
                    <div className="text-[11px] text-slate-500">{lang.sub}</div>
                  </div>
                  {!lang.available && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      Structure Ready
                    </span>
                  )}
                  {selectedLang === lang.code && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#743B66]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Profile Details & 18+ Age Gate (Name + DOB) */}
        {step === 2 && (
          <div className="animate-fadeIn space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#743B66] flex items-center justify-center mb-3">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {isTelugu ? 'మీ వివరాలు & వయస్సు ధృవీకరణ' : 'Your Details & Age Verification'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {isTelugu ? 'మీ ప్రైవేట్ ప్రొఫైల్ మరియు 18+ ధృవీకరణ' : 'Personalize your companion and verify 18+ adult privacy.'}
              </p>
            </div>

            {/* Name / Nickname Input */}
            <div className="bg-white border border-pink-100 rounded-3xl p-4 shadow-2xs space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                {isTelugu ? 'మిమ్మల్ని ఏమని పిలవాలి? (పేరు లేదా ముద్దుపేరు)' : 'What should we call you? (Name or Nickname)'}
              </label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="e.g. Priya"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <p className="text-[10.5px] text-slate-400">
                🔒 {isTelugu ? 'ముద్దుపేరు సరిపోతుంది. అధికారిక పూర్తి పేరు అవసరం లేదు.' : 'A nickname is fine. No legal name is ever required.'}
              </p>
            </div>

            {/* Date of Birth (DOB) Input */}
            <div className="bg-white border border-pink-100 rounded-3xl p-4 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                {isTelugu ? 'పుట్టిన తేదీ (Date of Birth)' : 'Date of Birth (DOB)'}
              </label>
              <input
                type="date"
                value={dob}
                max={formatDateISO(new Date())}
                onChange={handleDobChange}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              {calculatedAge !== null && (
                <div className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
                  calculatedAge >= 18 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {calculatedAge >= 18 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    {calculatedAge >= 18 
                      ? `Age: ${calculatedAge} years (${ageGroup} bracket) • 18+ Verified ✓` 
                      : `Age: ${calculatedAge} years. SheOra is for adults 18+. Guardian support required.`}
                  </span>
                </div>
              )}

              {calculatedAge !== null && calculatedAge < 18 && (
                <div className="pt-1">
                  <button
                    onClick={onUnderAgeTrigger}
                    className="w-full bg-rose-600 text-white text-xs font-bold py-2 rounded-xl hover:bg-rose-700 transition"
                  >
                    View Guardian Guidance & Adolescent Helplines
                  </button>
                </div>
              )}
            </div>

            {/* Manual 18+ Confirmation Checkbox */}
            <div className="bg-white border border-pink-100 rounded-3xl p-4 shadow-2xs">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgeConfirmed}
                  onChange={e => setIsAgeConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#743B66] rounded border-slate-300 focus:ring-pink-400"
                />
                <span className="text-xs text-slate-800 font-medium leading-relaxed">
                  {t('onboarding.ageConfirmation')}
                </span>
              </label>
            </div>

            {/* Under-18 friendly link */}
            <div className="text-center pt-1">
              <button
                onClick={onUnderAgeTrigger}
                className="text-xs text-slate-500 hover:text-slate-800 underline transition"
              >
                I am under 18 years old
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Separate Unticked Consent Checkboxes */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('onboarding.step3Title')}
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              {t('onboarding.step3Subtitle')}
            </p>

            <div className="space-y-3">
              {/* Terms */}
              <div
                onClick={() => toggleConsent('terms_of_service')}
                className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start space-x-3 cursor-pointer hover:border-pink-300 transition"
              >
                {consents.terms_of_service ? (
                  <CheckSquare className="w-5 h-5 text-[#743B66] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs text-slate-700 leading-snug">
                  {t('onboarding.consentTerms')}
                </span>
              </div>

              {/* Privacy */}
              <div
                onClick={() => toggleConsent('privacy_policy')}
                className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start space-x-3 cursor-pointer hover:border-pink-300 transition"
              >
                {consents.privacy_policy ? (
                  <CheckSquare className="w-5 h-5 text-[#743B66] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs text-slate-700 leading-snug">
                  {t('onboarding.consentPrivacy')}
                </span>
              </div>

              {/* Sensitive Health Data Processing */}
              <div
                onClick={() => toggleConsent('sensitive_health_data_processing')}
                className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start space-x-3 cursor-pointer hover:border-pink-300 transition"
              >
                {consents.sensitive_health_data_processing ? (
                  <CheckSquare className="w-5 h-5 text-[#743B66] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs text-slate-700 leading-snug">
                  {t('onboarding.consentHealthData')}
                </span>
              </div>

              {/* Local Storage Caching */}
              <div
                onClick={() => toggleConsent('local_storage_caching')}
                className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start space-x-3 cursor-pointer hover:border-pink-300 transition"
              >
                {consents.local_storage_caching ? (
                  <CheckSquare className="w-5 h-5 text-[#743B66] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs text-slate-700 leading-snug">
                  {t('onboarding.consentLocalStorage')}
                </span>
              </div>
            </div>

            {!canProceedConsents && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl mt-4 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Please select the required consent items to proceed securely.</span>
              </p>
            )}
          </div>
        )}

        {/* STEP 4: Goals */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#743B66] flex items-center justify-center mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('onboarding.step4Title')}
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              {t('onboarding.step4Subtitle')}
            </p>

            <div className="space-y-3">
              {[
                { id: 'track_periods' as UserGoal, title: t('onboarding.goalPeriod'), icon: '🌸' },
                { id: 'understand_pcos' as UserGoal, title: t('onboarding.goalPcos'), icon: '🌿' },
                { id: 'trying_to_conceive' as UserGoal, title: t('onboarding.goalConceive'), icon: '👶' },
                { id: 'general_wellness' as UserGoal, title: t('onboarding.goalWellness'), icon: '✨' },
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`w-full p-4 rounded-2xl border flex items-center space-x-3 text-left transition ${
                    selectedGoal === g.id
                      ? 'border-[#743B66] bg-pink-100/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-pink-200'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="text-xs font-semibold text-slate-800 leading-snug">
                    {g.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Optional Cycle Basics */}
        {step === 5 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#743B66] flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('onboarding.step5Title')}
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              {t('onboarding.step5Subtitle')}
            </p>

            {/* "I don't know" quick option */}
            <div className="mb-4">
              <label className="flex items-center space-x-2.5 p-3 rounded-2xl border border-purple-200 bg-purple-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontKnowCycle}
                  onChange={e => setDontKnowCycle(e.target.checked)}
                  className="w-4 h-4 text-[#743B66] rounded"
                />
                <span className="text-xs font-medium text-purple-900">
                  {t('onboarding.dontKnow')}
                </span>
              </label>
            </div>

            {!dontKnowCycle && (
              <div className="space-y-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('onboarding.lastPeriodLabel')}
                  </label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    max={formatDateISO(new Date())}
                    onChange={e => setLastPeriodDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      {t('onboarding.cycleLengthLabel')}
                    </label>
                    <span className="text-xs font-bold text-[#743B66]">{cycleLength} days</span>
                  </div>
                  <input
                    type="range"
                    min="21"
                    max="45"
                    value={cycleLength}
                    onChange={e => setCycleLength(Number(e.target.value))}
                    className="w-full accent-[#743B66]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      {t('onboarding.periodLengthLabel')}
                    </label>
                    <span className="text-xs font-bold text-[#743B66]">{periodDuration} days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="9"
                    value={periodDuration}
                    onChange={e => setPeriodDuration(Number(e.target.value))}
                    className="w-full accent-[#743B66]"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isIrregular}
                      onChange={e => setIsIrregular(e.target.checked)}
                      className="w-4 h-4 text-[#743B66] rounded"
                    />
                    <span className="text-xs text-slate-600">
                      My periods are usually irregular
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center space-x-3">
        {step > 1 && (
          <button
            onClick={() => setStep(prev => prev - 1)}
            className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {step < 5 ? (
          <button
            disabled={step === 2 && !isAgeConfirmed || step === 3 && !canProceedConsents}
            onClick={() => setStep(prev => prev + 1)}
            className="flex-1 bg-[#743B66] hover:bg-[#5c2d51] disabled:opacity-50 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-sm transition flex items-center justify-center space-x-2 text-xs"
          >
            <span>{t('onboarding.continue')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 bg-[#743B66] hover:bg-[#5c2d51] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md transition text-xs"
          >
            {t('onboarding.finish')}
          </button>
        )}
      </div>
    </div>
  );
};
