import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Profile, 
  Consents, 
  PeriodLog, 
  DailyCheckin, 
  SymptomLog, 
  CycleRecord, 
  FlowIntensity, 
  MoodType, 
  LanguageCode, 
  RedFlagAlert,
  ReminderItem
} from '../types';
import { formatDateISO, evaluateRedFlags } from '../lib/cycleMath';
import i18n from '../lib/i18n';

interface AppContextType {
  profile: Profile;
  consents: Consents;
  isOnboarded: boolean;
  isUnderAge: boolean;
  isLocked: boolean;
  activeTab: string;
  selectedDate: string;
  periodLogs: PeriodLog[];
  dailyCheckins: DailyCheckin[];
  symptomLogs: SymptomLog[];
  cycles: CycleRecord[];
  savedArticleIds: string[];
  activeRedFlag: RedFlagAlert | null;
  reminders: ReminderItem[];
  activeNotificationToast: { title: string; body: string } | null;
  dismissNotificationToast: () => void;
  dismissRedFlag: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedDate: (date: string) => void;
  completeOnboarding: (data: {
    name?: string;
    dob?: string;
    ageGroup: '18-24' | '25-34' | '35+';
    goal: Profile['goal'];
    consents: Consents;
    lastPeriodDate?: string;
    cycleLength?: number;
    periodLength?: number;
    isIrregular?: boolean;
  }) => void;
  setUnderAgeGate: (val: boolean) => void;
  logPeriod: (logDate: string, flow: FlowIntensity, isSpotting?: boolean, notes?: string) => void;
  removePeriodLog: (logDate: string) => void;
  saveCheckin: (checkin: Omit<DailyCheckin, 'id' | 'user_id' | 'created_at'>) => void;
  saveSymptom: (symptomCode: string, intensity: number, logDate?: string, notes?: string) => void;
  toggleSaveArticle: (articleId: string) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  changeLanguage: (lang: LanguageCode) => void;
  setAppPin: (pin: string | null) => void;
  unlockAppWithPin: (pin: string) => boolean;
  lockApp: () => void;
  exportDataJson: () => string;
  purgeAllData: () => void;
  addReminder: (reminder: Omit<ReminderItem, 'id'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  triggerTestNotification: (title?: string, body?: string) => void;
}

const defaultProfile: Profile = {
  id: 'local-user-id',
  display_name: 'Priya',
  date_of_birth: undefined,
  age_group: '18-24',
  goal: 'track_periods',
  cycle_length_estimate: 28,
  period_duration_estimate: 5,
  is_cycle_regular: true,
  low_data_mode: false,
  discreet_mode: false,
  discreet_app_name: 'S-Notes',
  app_language: (localStorage.getItem('sheora_app_language') as LanguageCode) || 'en',
  pin_hash: null,
  biometrics_enabled: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const defaultConsents: Consents = {
  terms_of_service: false,
  privacy_policy: false,
  sensitive_health_data_processing: false,
  local_storage_caching: false,
};

const defaultReminders: ReminderItem[] = [
  {
    id: 'rem-1-pads',
    title: 'Keep pads & essentials ready in your bag 🌸',
    title_te: 'ప్యాడ్లు మరియు అవసరమైన వస్తువులను బ్యాగ్‌లో సిద్ధంగా ఉంచుకోండి 🌸',
    description: 'Period expected in 2 days. Stock clean pads, tampons or your cup so you feel prepared and relaxed.',
    description_te: 'పీరియడ్ 2 రోజుల్లో ప్రారంభం కావచ్చు. శుభ్రమైన ప్యాడ్లను మీ బ్యాగ్‌లో ఉంచుకోండి.',
    time: '08:30',
    type: 'pre_period',
    enabled: true,
    frequency: 'pre_period',
    daysBeforePeriod: 2,
    discreetText: 'Personal checklist: Check your daily bag.',
    icon: '🌸'
  },
  {
    id: 'rem-2-water',
    title: 'Keep water bottle nearby & drink timely 💧',
    title_te: 'నీటి బాటిల్ దగ్గర ఉంచుకోండి & సమయానికి నీరు త్రాగండి 💧',
    description: 'Make sure your water bottle is on your desk. Regular sips ease pelvic cramps and reduce bloating.',
    description_te: 'రోజూ తగినంత నీరు త్రాగడం వల్ల కడుపు ఉబ్బరం మరియు క్రాంప్స్ తగ్గుతాయి.',
    time: '10:00',
    type: 'hydration',
    enabled: true,
    frequency: 'interval',
    intervalHours: 2,
    discreetText: 'Hydration reminder: Drink a glass of water.',
    icon: '💧'
  },
  {
    id: 'rem-3-warmth',
    title: 'Rest & warmth break: Warm herbal tea 🍵',
    title_te: 'విశ్రాంతి సమయం: గోరువెచ్చని జీలకర్ర కషాయం లేదా టీ 🍵',
    description: 'Take a gentle 5-minute break. Sip warm water, jeera tea or ginger tea to soothe pelvic blood vessels.',
    description_te: '5 నిమిషాల విశ్రాంతి తీసుకుని గోరువెచ్చని నీరు లేదా అల్లం టీ త్రాగండి.',
    time: '16:00',
    type: 'wellness',
    enabled: true,
    frequency: 'daily',
    discreetText: 'Relaxation break.',
    icon: '🍵'
  },
  {
    id: 'rem-4-checkin',
    title: 'Daily gentle 30-sec body check-in ✨',
    title_te: 'నేటి 30 సెకన్ల శరీర స్థితి నమోదు ✨',
    description: 'Log today’s mood and flow in under 30 seconds to keep your doctor-ready report accurate.',
    description_te: 'మీ మూడ్ మరియు లక్షణాలను త్వరగా నమోదు చేసుకోండి.',
    time: '20:30',
    type: 'wellness',
    enabled: true,
    frequency: 'daily',
    discreetText: 'Evening note update.',
    icon: '✨'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('sheora_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [consents, setConsents] = useState<Consents>(() => {
    const saved = localStorage.getItem('sheora_consents');
    return saved ? JSON.parse(saved) : defaultConsents;
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('sheora_onboarded') === 'true';
  });

  const [isUnderAge, setIsUnderAge] = useState<boolean>(false);

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('sheora_profile');
    if (saved) {
      const p = JSON.parse(saved);
      return Boolean(p.pin_hash);
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));

  // Period logs
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>(() => {
    const saved = localStorage.getItem('sheora_period_logs');
    if (saved) return JSON.parse(saved);
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() - 18);
    const d2 = new Date(today);
    d2.setDate(today.getDate() - 17);
    const d3 = new Date(today);
    d3.setDate(today.getDate() - 16);

    return [
      { id: 'p-1', user_id: 'local-user', log_date: formatDateISO(d1), flow_intensity: 'heavy', is_spotting: false, created_at: d1.toISOString() },
      { id: 'p-2', user_id: 'local-user', log_date: formatDateISO(d2), flow_intensity: 'medium', is_spotting: false, created_at: d2.toISOString() },
      { id: 'p-3', user_id: 'local-user', log_date: formatDateISO(d3), flow_intensity: 'light', is_spotting: false, created_at: d3.toISOString() },
    ];
  });

  const [dailyCheckins, setDailyCheckins] = useState<DailyCheckin[]>(() => {
    const saved = localStorage.getItem('sheora_daily_checkins');
    return saved ? JSON.parse(saved) : [];
  });

  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>(() => {
    const saved = localStorage.getItem('sheora_symptom_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sheora_saved_articles');
    return saved ? JSON.parse(saved) : ['art-1-pcos'];
  });

  // Reminders state
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('sheora_reminders');
    return saved ? JSON.parse(saved) : defaultReminders;
  });

  const [activeRedFlag, setActiveRedFlag] = useState<RedFlagAlert | null>(null);
  const [activeNotificationToast, setActiveNotificationToast] = useState<{ title: string; body: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sheora_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sheora_consents', JSON.stringify(consents));
  }, [consents]);

  useEffect(() => {
    localStorage.setItem('sheora_period_logs', JSON.stringify(periodLogs));
  }, [periodLogs]);

  useEffect(() => {
    localStorage.setItem('sheora_daily_checkins', JSON.stringify(dailyCheckins));
  }, [dailyCheckins]);

  useEffect(() => {
    localStorage.setItem('sheora_symptom_logs', JSON.stringify(symptomLogs));
  }, [symptomLogs]);

  useEffect(() => {
    localStorage.setItem('sheora_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const flag = evaluateRedFlags(periodLogs, symptomLogs);
    setActiveRedFlag(flag);
  }, [periodLogs, symptomLogs]);

  const dismissRedFlag = () => {
    setActiveRedFlag(null);
  };

  const dismissNotificationToast = () => {
    setActiveNotificationToast(null);
  };

  const completeOnboarding = (data: {
    name?: string;
    dob?: string;
    ageGroup: '18-24' | '25-34' | '35+';
    goal: Profile['goal'];
    consents: Consents;
    lastPeriodDate?: string;
    cycleLength?: number;
    periodLength?: number;
    isIrregular?: boolean;
  }) => {
    setConsents(data.consents);
    const updated: Profile = {
      ...profile,
      display_name: data.name?.trim() || profile.display_name || 'Priya',
      date_of_birth: data.dob,
      age_group: data.ageGroup,
      goal: data.goal,
      cycle_length_estimate: data.cycleLength || 28,
      period_duration_estimate: data.periodLength || 5,
      is_cycle_regular: data.isIrregular ? false : true,
      updated_at: new Date().toISOString(),
    };
    setProfile(updated);

    if (data.lastPeriodDate) {
      const newLog: PeriodLog = {
        id: 'p-' + Date.now(),
        user_id: profile.id,
        log_date: data.lastPeriodDate,
        flow_intensity: 'medium',
        is_spotting: false,
        created_at: new Date().toISOString(),
      };
      setPeriodLogs(prev => [newLog, ...prev.filter(p => p.log_date !== data.lastPeriodDate)]);
    }

    localStorage.setItem('sheora_onboarded', 'true');
    setIsOnboarded(true);
  };

  const setUnderAgeGate = (val: boolean) => {
    setIsUnderAge(val);
  };

  const logPeriod = (logDate: string, flow: FlowIntensity, isSpotting: boolean = false, notes?: string) => {
    setPeriodLogs(prev => {
      const filtered = prev.filter(p => p.log_date !== logDate);
      if (flow === ('none' as any)) return filtered;
      const newEntry: PeriodLog = {
        id: 'p-' + Date.now(),
        user_id: profile.id,
        log_date: logDate,
        flow_intensity: flow,
        is_spotting: isSpotting,
        notes,
        created_at: new Date().toISOString(),
      };
      return [newEntry, ...filtered];
    });
  };

  const removePeriodLog = (logDate: string) => {
    setPeriodLogs(prev => prev.filter(p => p.log_date !== logDate));
  };

  const saveCheckin = (checkin: Omit<DailyCheckin, 'id' | 'user_id' | 'created_at'>) => {
    setDailyCheckins(prev => {
      const filtered = prev.filter(c => c.log_date !== checkin.log_date);
      const newEntry: DailyCheckin = {
        ...checkin,
        id: 'c-' + Date.now(),
        user_id: profile.id,
        created_at: new Date().toISOString(),
      };
      return [newEntry, ...filtered];
    });
  };

  const saveSymptom = (symptomCode: string, intensity: number, logDate: string = formatDateISO(new Date()), notes?: string) => {
    setSymptomLogs(prev => {
      const filtered = prev.filter(s => !(s.log_date === logDate && s.symptom_code === symptomCode));
      if (intensity === 0) return filtered;
      const newEntry: SymptomLog = {
        id: 's-' + Date.now(),
        user_id: profile.id,
        log_date: logDate,
        symptom_code: symptomCode,
        intensity,
        notes,
        created_at: new Date().toISOString(),
      };
      return [newEntry, ...filtered];
    });
  };

  const toggleSaveArticle = (articleId: string) => {
    setSavedArticleIds(prev => 
      prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]
    );
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
  };

  const changeLanguage = (lang: LanguageCode) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('sheora_app_language', lang);
    updateProfile({ app_language: lang });
  };

  const setAppPin = (pin: string | null) => {
    updateProfile({ pin_hash: pin });
    if (!pin) setIsLocked(false);
  };

  const unlockAppWithPin = (pin: string): boolean => {
    if (profile.pin_hash === pin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (profile.pin_hash) {
      setIsLocked(true);
    }
  };

  const addReminder = (reminder: Omit<ReminderItem, 'id'>) => {
    const newItem: ReminderItem = {
      ...reminder,
      id: 'rem-' + Date.now(),
    };
    setReminders(prev => [newItem, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const triggerTestNotification = (title?: string, body?: string) => {
    const notifTitle = profile.discreet_mode
      ? 'S-Notes Notification'
      : (title || 'SheOra Care: Keep pads nearby 🌸');

    const notifBody = profile.discreet_mode
      ? 'Personal reminder item.'
      : (body || 'Make sure your water bottle is on your desk and pads are in your bag! 💧');

    // In-app alert toast
    setActiveNotificationToast({ title: notifTitle, body: notifBody });
    setTimeout(() => {
      setActiveNotificationToast(null);
    }, 4500);

    // Browser Notification API
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(notifTitle, {
            body: notifBody,
            icon: '/logo.svg',
          });
        } catch (e) {
          console.warn('Native notification failed:', e);
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(notifTitle, {
              body: notifBody,
              icon: '/logo.svg',
            });
          }
        });
      }
    }
  };

  const exportDataJson = (): string => {
    const payload = {
      exportTimestamp: new Date().toISOString(),
      appName: 'SheOra',
      version: '1.0',
      dataDisclaimer: 'Personal patient self-tracking logs exported directly from SheOra.',
      profile,
      periodLogs,
      dailyCheckins,
      symptomLogs,
      reminders,
      savedArticles: savedArticleIds
    };
    return JSON.stringify(payload, null, 2);
  };

  const purgeAllData = () => {
    localStorage.clear();
    setProfile(defaultProfile);
    setConsents(defaultConsents);
    setPeriodLogs([]);
    setDailyCheckins([]);
    setSymptomLogs([]);
    setSavedArticleIds([]);
    setReminders(defaultReminders);
    setIsOnboarded(false);
    setIsLocked(false);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        consents,
        isOnboarded,
        isUnderAge,
        isLocked,
        activeTab,
        selectedDate,
        periodLogs,
        dailyCheckins,
        symptomLogs,
        cycles: [],
        savedArticleIds,
        activeRedFlag,
        reminders,
        activeNotificationToast,
        dismissNotificationToast,
        dismissRedFlag,
        setActiveTab,
        setSelectedDate,
        completeOnboarding,
        setUnderAgeGate,
        logPeriod,
        removePeriodLog,
        saveCheckin,
        saveSymptom,
        toggleSaveArticle,
        updateProfile,
        changeLanguage,
        setAppPin,
        unlockAppWithPin,
        lockApp,
        exportDataJson,
        purgeAllData,
        addReminder,
        toggleReminder,
        deleteReminder,
        triggerTestNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
