import React, { useState, useRef } from 'react';
import { Send, X, Camera, ChevronUp, Lock } from 'lucide-react';
import { CAMPUS_CHARACTERS, CampusCharacter, CampusZone, RoomParticipant } from '../../types/room';

interface FloatingRoomChatBarProps {
  myCharacterId: string;
  participants: RoomParticipant[];
  onSendMessage: (text: string) => void;
  onTransferCharacter: (characterId: string) => void;
  onOpenPhotoCard: () => void;
}

const QUICK_EMOJIS = ['☕', '🎸', '💔', '📚', '🔥', '🤣', '🎉'];

const ZONE_TABS: { id: CampusZone; label: string; count: number }[] = [
  { id: 'foreground', label: '🥇 সামনে', count: 13 },
  { id: 'midground', label: '🥈 সিঁড়িতে', count: 10 },
  { id: 'background', label: '🥉 গেটে', count: 12 }
];

export const FloatingRoomChatBar: React.FC<FloatingRoomChatBarProps> = ({
  myCharacterId,
  participants,
  onSendMessage,
  onTransferCharacter,
  onOpenPhotoCard
}) => {
  const [text, setText] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<CampusZone>('foreground');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [warningToast, setWarningToast] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentCharacter =
    CAMPUS_CHARACTERS.find((c) => c.id === myCharacterId) || CAMPUS_CHARACTERS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleEmojiClick = (emoji: string) => {
    onSendMessage(emoji);
  };

  const handleSelectCharacter = (char: CampusCharacter) => {
    const owner = participants.find((p) => p.characterId === char.id);
    const isTaken = owner && char.id !== myCharacterId;
    if (isTaken) {
      setWarningToast(`"${char.name}" ইতিমধ্যে ${owner.name} দখল করে রেখেছেন! অন্য ক্যারেক্টার বেছে নিন।`);
      setTimeout(() => setWarningToast(''), 3500);
      return;
    }
    setWarningToast('');
    onTransferCharacter(char.id);
    setIsPickerOpen(false);
  };

  const filteredCharacters = CAMPUS_CHARACTERS.filter((c) => {
    if (c.zone !== activeZone) return false;
    if (genderFilter !== 'all' && c.gender !== genderFilter) return false;
    return true;
  });

  const getZoneLabel = (zone: CampusZone) => {
    if (zone === 'foreground') return 'সামনে';
    if (zone === 'midground') return 'সিঁড়িতে';
    return 'গেটে';
  };

  return (
    <div className="absolute bottom-16 sm:bottom-20 left-2 sm:left-4 right-2 sm:right-4 z-40 select-none">
      
      {/* Popover Character Switcher (Categorized into 3 Zones & Gender Filters with Exclusive Locking) */}
      {isPickerOpen && (
        <div className="mb-2 bg-slate-950/95 border border-amber-500/50 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-fadeIn text-slate-100 max-h-[350px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>🎭 ক্যারেক্টার বেছে নিন (একজন একটিমাত্র ক্যারেক্টার)</span>
            </div>
            <button
              onClick={() => setIsPickerOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
            >
              <X size={14} />
            </button>
          </div>

          {/* Warning Banner if user attempts to take an already occupied character */}
          {warningToast && (
            <div className="mb-2 p-2 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-1.5 animate-shake">
              <Lock size={13} className="shrink-0 text-red-400" />
              <span className="font-medium text-[11px] leading-tight">{warningToast}</span>
            </div>
          )}

          {/* Zone Navigation Tabs */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl gap-1 mb-2 border border-slate-800">
            {ZONE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveZone(tab.id)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                  activeZone === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1 rounded-full ${
                  activeZone === tab.id ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Gender Filter Chips */}
          <div className="flex items-center gap-1.5 mb-2.5 px-0.5">
            <span className="text-[10px] text-slate-400 font-medium">ফিল্টার:</span>
            <button
              type="button"
              onClick={() => setGenderFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition ${
                genderFilter === 'all'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              সবাই
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('male')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition ${
                genderFilter === 'male'
                  ? 'bg-sky-500/25 border-sky-400 text-sky-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              👦 ছেলে
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('female')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition ${
                genderFilter === 'female'
                  ? 'bg-pink-500/25 border-pink-400 text-pink-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              👧 মেয়ে
            </button>
          </div>

          {/* Filtered Character Grid with Disabled/Lock Status */}
          <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-1.5 pr-0.5">
            {filteredCharacters.map((char) => {
              const isSelected = char.id === myCharacterId;
              const owner = participants.find((p) => p.characterId === char.id);
              const isTaken = owner && !isSelected;

              return (
                <button
                  key={char.id}
                  type="button"
                  disabled={isTaken}
                  onClick={() => handleSelectCharacter(char)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-left border transition text-xs ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                      : isTaken
                      ? 'bg-slate-950/70 border-red-950/40 text-slate-500 opacity-45 cursor-not-allowed'
                      : 'bg-slate-900/90 border-slate-700 hover:border-amber-400/50 text-slate-200'
                  }`}
                  title={isTaken ? `"${char.name}" ইতিমধ্যে ${owner.name} দখল করেছেন` : `${char.name} ক্যারেক্টারে বদলান`}
                >
                  <span className="text-base shrink-0">{char.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium flex items-center justify-between gap-1">
                      <span className="truncate">{char.name}</span>
                      {isTaken && <Lock size={10} className="text-amber-500 shrink-0" />}
                    </div>
                    {isTaken ? (
                      <div className="text-[9px] text-amber-400/90 font-medium truncate">
                        🔒 {owner.name}
                      </div>
                    ) : (
                      <div className="text-[9px] text-slate-400 truncate">{char.role}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Main Bar */}
      <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-1.5 sm:p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1.5">
        
        {/* Top: Current Character Badge & Quick Emoji Reactions */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          
          {/* Character Switcher Pill with Zone Tag */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold shrink-0 transition active:scale-95 shadow-sm"
            title="ক্যারেক্টার পরিবর্তন বা ট্রান্সফার করুন"
          >
            <span>{currentCharacter.emoji}</span>
            <span className="truncate max-w-[80px] sm:max-w-none">{currentCharacter.name}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/30 text-amber-200 font-medium">
              {getZoneLabel(currentCharacter.zone)}
            </span>
            <ChevronUp size={12} className={`transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Reaction Emojis */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs transition active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Mini Photo Card Button */}
          <button
            type="button"
            onClick={onOpenPhotoCard}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800/90 hover:bg-slate-700 text-amber-300 rounded-xl text-[11px] border border-white/10 shrink-0 transition active:scale-95"
            title="ফটো কার্ড তৈরি করুন 📸"
          >
            <Camera size={13} />
            <span className="hidden sm:inline">ফটো কার্ড</span>
          </button>
        </div>

        {/* Bottom: Text Input & Send Button */}
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={150}
            placeholder={`"${currentCharacter.name}" হিসেবে বার্তা লিখুন...`}
            className="flex-1 bg-slate-900/95 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center transition active:scale-95 shadow-md shadow-amber-500/25 shrink-0"
          >
            <Send size={14} />
          </button>
        </form>

      </div>
    </div>
  );
};

