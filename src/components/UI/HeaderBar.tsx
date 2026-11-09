import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareHeart,
  Coffee,
  Sparkles,
  HeartCrack,
  BookOpen,
  Camera,
  Users,
  ChevronDown,
  MoreHorizontal,
  Check,
  ListMusic
} from 'lucide-react';
import { AddaMood } from '../../data/dialogues';
import { DhakaWeather } from '../../hooks/useDhakaClockAndWeather';

interface HeaderBarProps {
  onlineCount: number;
  currentMood: AddaMood;
  dhakaTime: string;
  weather: DhakaWeather | null;
  activeRoom?: { id: string; name: string; participants: any[] } | null;
  onSelectMood: (mood: AddaMood) => void;
  onOpenConfessions: () => void;
  onOpenPhotoCard: () => void;
  onOpenRoom: () => void;
  onCheers: () => void;
  onOpenPlaylist?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onlineCount,
  currentMood,
  dhakaTime,
  weather,
  activeRoom,
  onSelectMood,
  onOpenConfessions,
  onOpenPhotoCard,
  onOpenRoom,
  onCheers,
  onOpenPlaylist
}) => {
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moodMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menus when clicking outside (attached only when a menu is open)
  useEffect(() => {
    if (!isMoodOpen && !isMoreOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isMoodOpen && moodMenuRef.current && !moodMenuRef.current.contains(target)) {
        setIsMoodOpen(false);
      }
      if (isMoreOpen && moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMoodOpen, isMoreOpen]);

  const moods: { id: AddaMood; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'general',
      label: 'আড্ডা',
      desc: 'ক্যাম্পাসের নিয়মিত আড্ডা ও গান',
      icon: <Sparkles size={13} className="text-amber-400" />
    },
    {
      id: 'heartbreak',
      label: 'ছ্যাঁকা 💔',
      desc: 'ক্রাশ ও বিরহের স্মৃতিচারণ',
      icon: <HeartCrack size={13} className="text-rose-400" />
    },
    {
      id: 'exams',
      label: 'পরীক্ষা 📚',
      desc: 'পড়াশোনা, অ্যাসাইনমেন্ট ও সিজিপিএ',
      icon: <BookOpen size={13} className="text-blue-400" />
    },
    {
      id: 'canteen',
      label: 'ক্যান্টিন ☕',
      desc: 'চা, সিঙ্গাড়া ও ট্যুরের গল্প',
      icon: <Coffee size={13} className="text-emerald-400" />
    }
  ];

  const activeMoodObj = moods.find((m) => m.id === currentMood) || moods[0];

  return (
    <header className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-40 bg-slate-950/90 backdrop-blur-2xl border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-2xl text-white touch-manipulation">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
        
        {/* Left: Brand & Live Presence */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-xs sm:text-sm shrink-0">
            ☕
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center gap-1 leading-tight">
              <span>SEU Adda</span>
              <span className="hidden xl:inline-block text-[9px] font-normal px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                সাউথইস্ট বিশ্ববিদ্যালয়
              </span>
            </h1>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-400 leading-tight">
              <span className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span><strong className="text-emerald-400">{onlineCount}</strong> জন</span>
              </span>
              {dhakaTime && (
                <span className="hidden sm:inline-flex items-center gap-1 px-1 py-0.2 rounded bg-slate-900/90 text-amber-300/90 border border-white/10 font-medium shrink-0">
                  <span>🕒 {dhakaTime}</span>
                  {weather && <span>• {weather.icon} {weather.temperature}°C</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Sleek Dropdown Mood Selector */}
        <div ref={moodMenuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsMoodOpen((prev) => !prev);
              setIsMoreOpen(false);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/35 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            title="আড্ডার মেজাজ বা মুড পরিবর্তন করুন"
          >
            <span className="shrink-0">{activeMoodObj.icon}</span>
            <span className="font-bold text-[11px] sm:text-xs">{activeMoodObj.label}</span>
            <ChevronDown
              size={11}
              className={`text-amber-400/80 transition-transform duration-200 ${
                isMoodOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Floating Glass Mood Menu */}
          {isMoodOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 sm:w-60 bg-slate-950/95 border border-amber-500/40 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-fadeIn flex flex-col gap-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80 border-b border-white/10 flex items-center justify-between">
                <span>আড্ডার মেজাজ বাছুন</span>
                <span>✨</span>
              </div>
              {moods.map((m) => {
                const isActive = currentMood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectMood(m.id);
                      setIsMoodOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0">{m.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold leading-tight">{m.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight truncate">{m.desc}</div>
                      </div>
                    </div>
                    {isActive && <Check size={14} className="text-amber-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Primary Action Controls & More Options Dropdown */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 1. Private Adda Room Button */}
          <button
            type="button"
            onClick={onOpenRoom}
            className={`flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border transition active:scale-95 shrink-0 cursor-pointer ${
              activeRoom
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-white/10'
            }`}
            title={activeRoom ? `আড্ডা রুম: ${activeRoom.name}` : 'পার্সোনাল আড্ডা রুম তৈরি বা জয়েন করুন'}
          >
            <Users size={13} className={activeRoom ? 'text-amber-400' : 'text-emerald-400'} />
            <span className="hidden sm:inline text-[11px] font-semibold">
              {activeRoom ? activeRoom.name.slice(0, 8) : 'রুম'}
            </span>
            {activeRoom && (
              <span className="text-[9px] px-1 rounded-full bg-amber-500 text-slate-950 font-black">
                {activeRoom.participants.length}
              </span>
            )}
          </button>

          {/* 2. Campus Photo Card Generator */}
          <button
            type="button"
            onClick={onOpenPhotoCard}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border border-amber-500/40 transition active:scale-95 shadow-md shadow-amber-500/10 shrink-0 cursor-pointer"
            title="ক্যাম্পাস ফটো কার্ড ও স্পিচ বাবল জেনারেটর 📸"
          >
            <Camera size={13} />
            <span className="hidden sm:inline text-[11px] font-semibold">ফটো কার্ড</span>
          </button>

          {/* 3. Direct Cheers on Desktop Screens (collapsed into More Menu on mobile) */}
          <button
            type="button"
            onClick={onCheers}
            className="hidden md:flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-2.5 py-1 sm:py-1.5 rounded-full border border-amber-500/40 transition active:scale-95 shrink-0 cursor-pointer"
            title="চায়ের কাপে চিয়ার্স পাঠান ☕"
          >
            <Coffee size={13} />
            <span className="text-[11px] font-medium">চিয়ার্স!</span>
          </button>

          {/* 4. More Options Dropdown ("⋯" / "আরও ▾") */}
          <div ref={moreMenuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMoreOpen((prev) => !prev);
                setIsMoodOpen(false);
              }}
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-full border transition active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer ${
                isMoreOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-white/10'
              }`}
              title="আরও আড্ডা অপশন"
            >
              <MoreHorizontal size={14} />
              <span className="hidden lg:inline text-[11px] font-medium">আরও</span>
            </button>

            {/* Floating More Options Menu */}
            {isMoreOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-slate-950/95 border border-white/15 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-fadeIn flex flex-col gap-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 flex items-center justify-between">
                  <span>ক্যাম্পাস ফিচার ও স্মৃতি</span>
                  <span>✨</span>
                </div>

                {/* Confessions Board */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenConfessions();
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs text-slate-200 hover:bg-slate-900/90 hover:text-white transition cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 shrink-0">
                    <MessageSquareHeart size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-100">ক্যাম্পাস স্মৃতি ও কনফেশন</div>
                    <div className="text-[10px] text-slate-400 truncate">বেনামী স্মৃতি পড়ুন বা চিঠি পাঠান 💌</div>
                  </div>
                </button>

                {/* Cheers (accessible directly here for mobile) */}
                <button
                  type="button"
                  onClick={() => {
                    onCheers();
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs text-slate-200 hover:bg-slate-900/90 hover:text-white transition cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                    <Coffee size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-100">চায়ের কাপে চিয়ার্স</div>
                    <div className="text-[10px] text-slate-400 truncate">বন্ধুদের সাথে এক কাপ চা টোকা দিন ☕</div>
                  </div>
                </button>

                {/* Playlist & Music Picker */}
                {onOpenPlaylist && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPlaylist();
                      setIsMoreOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs text-slate-200 hover:bg-slate-900/90 hover:text-white transition cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
                      <ListMusic size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100">গান ও প্লেলিস্ট বাছুন</div>
                      <div className="text-[10px] text-slate-400 truncate">ইউটিউব ও কাস্টম অডিও রেডিও 🎶</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
