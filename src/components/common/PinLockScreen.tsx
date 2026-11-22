import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Lock, KeyRound, ShieldCheck } from 'lucide-react';

export const PinLockScreen: React.FC = () => {
  const { t } = useTranslation();
  const { unlockAppWithPin, profile } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        const success = unlockAppWithPin(newPin);
        if (!success) {
          setError(true);
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-pink-50 via-purple-50 to-white flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-xs flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-white shadow-md border border-pink-100 flex items-center justify-center text-pink-500 mb-4">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-semibold text-slate-800">
          {profile.discreet_mode ? 'Unlock S-Notes' : 'Unlock SheOra'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Enter your 4-digit security PIN to access your private data
        </p>

        {/* PIN Dots */}
        <div className="flex space-x-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                error
                  ? 'border-rose-400 bg-rose-200 animate-bounce'
                  : pin.length > i
                  ? 'bg-pink-500 border-pink-500 scale-110'
                  : 'border-slate-300 bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium mb-4">
            Incorrect PIN. Please try again.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-14 rounded-2xl bg-white border border-pink-100 shadow-sm text-lg font-semibold text-slate-700 active:scale-95 active:bg-pink-50 transition"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-white border border-pink-100 shadow-sm text-lg font-semibold text-slate-700 active:scale-95 active:bg-pink-50 transition"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs font-medium text-slate-500 active:scale-95 transition flex items-center justify-center"
          >
            Delete
          </button>
        </div>

        <div className="mt-8 flex items-center space-x-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero third-party trackers • 100% On-device privacy</span>
        </div>
      </div>
    </div>
  );
};
