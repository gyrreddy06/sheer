import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { ReminderItem } from '../../types';
import { 
  ChevronLeft, 
  Bell, 
  Plus, 
  Clock, 
  Trash2, 
  Check, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  X,
  Volume2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const RemindersScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { 
    reminders, 
    addReminder, 
    toggleReminder, 
    deleteReminder, 
    triggerTestNotification, 
    profile, 
    setActiveTab 
  } = useApp();

  const isTelugu = i18n.language === 'te';

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('09:00');
  const [newType, setNewType] = useState<ReminderItem['type']>('hydration');
  const [newFrequency, setNewFrequency] = useState<ReminderItem['frequency']>('daily');
  const [newInterval, setNewInterval] = useState<number>(2);

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let icon = '✨';
    if (newType === 'hydration') icon = '💧';
    if (newType === 'pre_period') icon = '🌸';
    if (newType === 'medication') icon = '💊';
    if (newType === 'wellness') icon = '🧘‍♀️';

    addReminder({
      title: newTitle.trim(),
      description: newFrequency === 'interval' 
        ? `Remind every ${newInterval} hours to keep your routine smooth.` 
        : `Scheduled at ${newTime} every day.`,
      time: newTime,
      type: newType,
      enabled: true,
      frequency: newFrequency,
      intervalHours: newFrequency === 'interval' ? newInterval : undefined,
      discreetText: 'Personal reminder item.',
      icon
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="pb-24 pt-1 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-full bg-white border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>Reminders & Scheduling</span>
            <span>🔔</span>
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1 text-xs font-bold text-white bg-[#743B66] hover:bg-[#5c2d51] px-3 py-1.5 rounded-full shadow-2xs transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Discreet Mode Notification Shield */}
      <div className="bg-gradient-to-r from-purple-100/70 via-pink-100/60 to-purple-50 p-4 rounded-3xl border border-purple-200/50 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#743B66] font-bold text-xs">
            <Bell className="w-4 h-4" />
            <span>App & Notification Care</span>
          </div>
          <button
            onClick={() => triggerTestNotification()}
            className="text-[11px] font-bold text-[#743B66] bg-white border border-purple-200 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-purple-50 active:scale-95 transition"
          >
            🔔 Test Alert Now
          </button>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          {profile.discreet_mode ? (
            <span className="text-purple-900 font-semibold">
              🔒 Discreet Mode is ON: Notifications appear as "S-Notes: Personal reminder item" so nothing sensitive is exposed on your lockscreen.
            </span>
          ) : (
            <span>
              Receive gentle prompts to keep pads nearby before your cycle starts, stay hydrated throughout the day, and take timely care of yourself.
            </span>
          )}
        </p>
      </div>

      {/* Section 1: Pre-Period & Cycle Readiness Reminders */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700">
            Active Cycle & Wellness Reminders
          </h3>
          <span className="text-[10px] text-slate-400">
            {reminders.filter(r => r.enabled).length} active
          </span>
        </div>

        <div className="space-y-2.5">
          {reminders.map(rem => {
            const displayTitle = isTelugu && rem.title_te ? rem.title_te : rem.title;
            const displayDesc = isTelugu && rem.description_te ? rem.description_te : rem.description;

            return (
              <div
                key={rem.id}
                className={`bg-white rounded-3xl p-4 border transition ${
                  rem.enabled 
                    ? 'border-pink-100 shadow-2xs' 
                    : 'border-slate-100 opacity-60 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-pink-100/70 text-[#743B66] flex items-center justify-center text-lg shrink-0 mt-0.5">
                      {rem.icon || '🌸'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">
                        {displayTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {displayDesc}
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                          <Clock className="w-3 h-3" />
                          <span>{rem.time}</span>
                        </span>

                        {rem.frequency === 'interval' && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 font-medium">
                            Every {rem.intervalHours || 2} hrs
                          </span>
                        )}

                        {rem.frequency === 'pre_period' && (
                          <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 font-medium">
                            {rem.daysBeforePeriod || 2} days before period
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle and Delete */}
                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition ${
                        rem.enabled ? 'bg-[#743B66]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                          rem.enabled ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="text-slate-300 hover:text-rose-500 transition p-1"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Quick Schedule Cards */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-2xs space-y-2.5">
        <h4 className="text-xs font-bold text-slate-800">
          Quick Schedule Templates
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => {
              addReminder({
                title: 'Drink 500ml warm water 💧',
                title_te: 'గోరువెచ్చని నీరు త్రాగండి 💧',
                description: 'Refill your water bottle and drink regularly.',
                time: '11:30',
                type: 'hydration',
                enabled: true,
                frequency: 'interval',
                intervalHours: 3,
                icon: '💧'
              });
            }}
            className="p-2.5 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-300 text-left transition text-blue-900"
          >
            <span className="font-bold text-[11px] block">💧 Hydration Every 3h</span>
            <span className="text-[10px] text-blue-600 block mt-0.5">Keep bottle on desk</span>
          </button>

          <button
            onClick={() => {
              addReminder({
                title: 'Check pad supply in handbag 🌸',
                title_te: 'హ్యాండ్‌బ్యాగ్‌లో ప్యాడ్లు సరి చూసుకోండి 🌸',
                description: 'Make sure your purse has fresh pads or panty liners.',
                time: '08:00',
                type: 'pre_period',
                enabled: true,
                frequency: 'pre_period',
                daysBeforePeriod: 3,
                icon: '🌸'
              });
            }}
            className="p-2.5 rounded-2xl bg-pink-50/60 border border-pink-100 hover:border-pink-300 text-left transition text-pink-900"
          >
            <span className="font-bold text-[11px] block">🌸 Pre-Period Bag Check</span>
            <span className="text-[10px] text-pink-600 block mt-0.5">3 days before period</span>
          </button>
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-pink-50 pb-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Schedule New Reminder</span>
                <span>⏰</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  What to do? (Reminder Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keep pads in bag, drink water, take iron..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white"
                  >
                    <option value="pre_period">🌸 Period / Pads</option>
                    <option value="hydration">💧 Hydration / Water</option>
                    <option value="medication">💊 Medicine / Vitamin</option>
                    <option value="wellness">🧘‍♀️ Rest / Wellness</option>
                    <option value="custom">✨ Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Frequency
                </label>
                <select
                  value={newFrequency}
                  onChange={e => setNewFrequency(e.target.value as any)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white"
                >
                  <option value="daily">Daily at selected time</option>
                  <option value="pre_period">2–3 days before expected period</option>
                  <option value="interval">Repeat every X hours (Hydration)</option>
                </select>
              </div>

              {newFrequency === 'interval' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Repeat every: {newInterval} hours
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={newInterval}
                    onChange={e => setNewInterval(Number(e.target.value))}
                    className="w-full accent-[#743B66]"
                  />
                </div>
              )}

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#743B66] hover:bg-[#5c2d51] text-white text-xs font-bold shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
