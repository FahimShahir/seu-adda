import React from 'react';
import { MessageSquareHeart, CloudRain, Sun, Moon, Coffee } from 'lucide-react';

interface HeaderBarProps {
  onlineCount: number;
  isNight: boolean;
  isRain: boolean;
  onToggleNight: () => void;
  onToggleRain: () => void;
  onOpenConfessions: () => void;
  onCheers: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onlineCount,
  isNight,
  isRain,
  onToggleNight,
  onToggleRain,
  onOpenConfessions,
  onCheers
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-2.5 sm:px-4 py-2 sticky top-0 z-30 shadow-md touch-manipulation">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-sm shrink-0">
            ☕
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center gap-1.5 truncate">
              <span>SEU Adda</span>
              <span className="hidden xs:inline-block text-[9px] font-normal px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                সাউথইস্ট বিশ্ববিদ্যালয়
              </span>
            </h1>
            {/* Live Presence Badge */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">
                <strong className="text-emerald-400">{onlineCount}</strong> জন আড্ডায়
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Confessions Board */}
          <button
            onClick={onOpenConfessions}
            className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-full border border-slate-700 transition active:scale-95"
            title="ক্যাম্পাস স্মৃতি ও কনফেশন বোর্ড"
          >
            <MessageSquareHeart size={13} className="text-pink-400" />
            <span className="hidden sm:inline">স্মৃতি ও কনফেশন</span>
          </button>

          {/* Quick Cheers Button */}
          <button
            onClick={onCheers}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-2.5 py-1.5 rounded-full border border-amber-500/40 transition active:scale-95"
            title="চায়ের কাপে চিয়ার্স পাঠান"
          >
            <Coffee size={13} />
            <span className="hidden sm:inline">চিয়ার্স!</span>
          </button>

          {/* Rain Toggle */}
          <button
            onClick={onToggleRain}
            title={isRain ? 'বৃষ্টি থামান' : 'বৃষ্টি নামান'}
            className={`p-1.5 rounded-full border transition active:scale-95 ${
              isRain
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            <CloudRain size={14} />
          </button>

          {/* Day / Night Toggle */}
          <button
            onClick={onToggleNight}
            title={isNight ? 'দিনের আলো' : 'সন্ধ্যার আলো'}
            className={`p-1.5 rounded-full border transition active:scale-95 ${
              isNight
                ? 'bg-indigo-950 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            {isNight ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
};
