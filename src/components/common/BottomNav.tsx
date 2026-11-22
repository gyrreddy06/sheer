import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Sparkles, 
  User 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'ai', label: 'Ask AI', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-md safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-[#743B66] font-semibold'
                  : 'text-slate-400 hover:text-slate-600 font-normal'
              }`}
            >
              <div
                className={`p-1.5 rounded-2xl transition-transform ${
                  isActive ? 'bg-pink-100/70 scale-110' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#743B66] stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-[#743B66] font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
