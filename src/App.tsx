import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { RedFlagBanner } from './components/common/RedFlagBanner';
import { PinLockScreen } from './components/common/PinLockScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { UnderAgeScreen } from './components/screens/UnderAgeScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { SymptomScreen } from './components/screens/SymptomScreen';
import { MoodScreen } from './components/screens/MoodScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { AIChatScreen } from './components/screens/AIChatScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { RemindersScreen } from './components/screens/RemindersScreen';
import { X, Bell } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    isOnboarded, 
    isUnderAge, 
    isLocked, 
    activeTab, 
    setUnderAgeGate,
    activeNotificationToast,
    dismissNotificationToast
  } = useApp();

  const [inOnboardingFlow, setInOnboardingFlow] = useState<boolean>(false);

  // If PIN lock is active
  if (isLocked) {
    return <PinLockScreen />;
  }

  // If under-age gate was triggered
  if (isUnderAge) {
    return <UnderAgeScreen onBack={() => setUnderAgeGate(false)} />;
  }

  // If user hasn't completed onboarding
  if (!isOnboarded) {
    if (inOnboardingFlow) {
      return (
        <OnboardingScreen
          onComplete={() => setInOnboardingFlow(false)}
          onUnderAgeTrigger={() => setUnderAgeGate(true)}
        />
      );
    }
    return <WelcomeScreen onStart={() => setInOnboardingFlow(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF0F5]/50 flex flex-col justify-between relative">
      {/* Active In-App Notification Toast */}
      {activeNotificationToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-3xl shadow-2xl border border-pink-400/40 flex items-start space-x-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4 text-pink-400" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-pink-200 text-xs">{activeNotificationToast.title}</h4>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{activeNotificationToast.body}</p>
          </div>
          <button 
            onClick={dismissNotificationToast} 
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <Header />
      <RedFlagBanner />

      <main className="flex-1 w-full max-w-md mx-auto">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'calendar' && <CalendarScreen />}
        {activeTab === 'symptoms' && <SymptomScreen />}
        {activeTab === 'mood' && <MoodScreen />}
        {activeTab === 'insights' && <InsightsScreen />}
        {activeTab === 'ai' && <AIChatScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'reminders' && <RemindersScreen />}
      </main>

      <BottomNav />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
