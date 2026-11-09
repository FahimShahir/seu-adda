import React, { useRef } from 'react';
import { MessageSquareHeart, CloudRain, Sun, Moon, Coffee, Sparkles, HeartCrack, BookOpen, Camera } from 'lucide-react';
import { AddaMood } from '../../data/dialogues';
import { DhakaWeather } from '../../hooks/useDhakaClockAndWeather';

interface HeaderBarProps {
  onlineCount: number;
  isNight: boolean;
  isRain: boolean;
  currentMood: AddaMood;
  dhakaTime: string;
  weather: DhakaWeather | null;
  onSelectMood: (mood: AddaMood) => void;
  onToggleNight: () => void;
  onToggleRain: () => void;
  onOpenConfessions: () => void;
  onOpenPhotoCard: () => void;
  onCheers: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onlineCount,
  isNight,
  isRain,
  currentMood,
  dhakaTime,
  weather,
  onSelectMood,
  onToggleNight,
  onToggleRain,
  onOpenConfessions,
  onOpenPhotoCard,
  onCheers
}) => {
  const moodScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    if (moodScrollRef.current) {
      startXRef.current = e.pageX - moodScrollRef.current.offsetLeft;
      scrollLeftRef.current = moodScrollRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !moodScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - moodScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    moodScrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const moods: { id: AddaMood; label: string; icon: React.ReactNode }[] = [
    {
      id: 'general',
      label: 'আড্ডা',
      icon: <Sparkles size={11} className="text-amber-400" />
    },
    {
      id: 'heartbreak',
      label: 'ছ্যাঁকা 💔',
      icon: <HeartCrack size={11} className="text-rose-400" />
    },
    {
      id: 'exams',
      label: 'পরীক্ষা 📚',
      icon: <BookOpen size={11} className="text-blue-400" />
    },
    {
      id: 'canteen',
      label: 'ক্যান্টিন ☕',
      icon: <Coffee size={11} className="text-emerald-400" />
    }
  ];

  return (
    <header className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-40 bg-slate-950/85 backdrop-blur-2xl border border-white/15 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-2xl text-white touch-manipulation">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full">
        {/* Left: Brand & Live Presence */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-xs sm:text-sm shrink-0">
            ☕
          </div>
          <div>
            <h1 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center gap-1">
              <span>SEU Adda</span>
              <span className="hidden lg:inline-block text-[9px] font-normal px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                সাউথইস্ট বিশ্ববিদ্যালয়
              </span>
            </h1>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-400">
              <span className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span><strong className="text-emerald-400">{onlineCount}</strong> জন</span>
              </span>
              {dhakaTime && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-900/90 text-amber-300/90 border border-white/10 font-medium shrink-0">
                  <span>🕒 {dhakaTime}</span>
                  {weather && <span>• {weather.icon} {weather.temperature}°C</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Integrated Touch-Scrollable Adda Mood Selector (No Bottom Scrollbars) */}
        <div
          ref={moodScrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-900/90 border border-white/10 rounded-xl sm:rounded-full overflow-x-auto no-scrollbar touch-pan-x cursor-grab active:cursor-grabbing max-w-[55%] sm:max-w-none select-none"
        >
          {moods.map((m) => {
            const isActive = currentMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMood(m.id)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-full text-[10px] sm:text-xs font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {m.icon}
                <span className="inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Polaroid Campus Photo Card Generator */}
          <button
            onClick={onOpenPhotoCard}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-2 sm:px-2.5 py-1.5 rounded-full border border-amber-500/40 transition active:scale-95 shadow-md shadow-amber-500/10"
            title="ক্যাম্পাস ফটো কার্ড তৈরি ও ডাউনলোড করুন"
          >
            <Camera size={12} />
            <span className="hidden sm:inline text-[11px] font-semibold">ফটো কার্ড</span>
          </button>

          {/* Confessions Board */}
          <button
            onClick={onOpenConfessions}
            className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs px-2 sm:px-2.5 py-1.5 rounded-full border border-white/10 transition active:scale-95"
            title="ক্যাম্পাস স্মৃতি ও কনফেশন বোর্ড"
          >
            <MessageSquareHeart size={12} className="text-pink-400" />
            <span className="hidden sm:inline text-[11px]">স্মৃতি</span>
          </button>

          {/* Quick Cheers Button */}
          <button
            onClick={onCheers}
            className="flex items-center gap-1 bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 text-xs px-2 sm:px-2.5 py-1.5 rounded-full border border-amber-500/40 transition active:scale-95"
            title="চায়ের কাপে চিয়ার্স পাঠান"
          >
            <Coffee size={12} />
            <span className="hidden sm:inline text-[11px]">চিয়ার্স!</span>
          </button>

          {/* Rain Toggle */}
          <button
            onClick={onToggleRain}
            title={isRain ? 'বৃষ্টি থামান' : 'বৃষ্টি নামান'}
            className={`p-1.5 rounded-full border transition active:scale-95 ${
              isRain
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <CloudRain size={13} />
          </button>

          {/* Day / Night Toggle */}
          <button
            onClick={onToggleNight}
            title={isNight ? 'দিনের আলো' : 'সন্ধ্যার আলো'}
            className={`p-1.5 rounded-full border transition active:scale-95 ${
              isNight
                ? 'bg-indigo-950 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            {isNight ? <Moon size={13} /> : <Sun size={13} />}
          </button>
        </div>
      </div>
    </header>
  );
};
