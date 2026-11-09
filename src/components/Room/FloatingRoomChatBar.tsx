import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, X, Camera, ChevronUp } from 'lucide-react';
import { CAMPUS_CHARACTERS, CampusCharacter, RoomParticipant } from '../../types/room';

interface FloatingRoomChatBarProps {
  myCharacterId: string;
  participants: RoomParticipant[];
  onSendMessage: (text: string) => void;
  onTransferCharacter: (characterId: string) => void;
  onOpenPhotoCard: () => void;
}

const QUICK_EMOJIS = ['☕', '🎸', '💔', '📚', '🔥', '🤣', '🎉'];

export const FloatingRoomChatBar: React.FC<FloatingRoomChatBarProps> = ({
  myCharacterId,
  participants,
  onSendMessage,
  onTransferCharacter,
  onOpenPhotoCard
}) => {
  const [text, setText] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
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
    onTransferCharacter(char.id);
    setIsPickerOpen(false);
  };

  return (
    <div className="absolute bottom-16 sm:bottom-20 left-2 sm:left-4 right-2 sm:right-4 z-40 select-none">
      
      {/* Popover Character Switcher (Categorized into Boys & Girls) */}
      {isPickerOpen && (
        <div className="mb-2 bg-slate-950/95 border border-amber-500/50 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-fadeIn text-slate-100 max-h-[300px] overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>🎭 ক্যারেক্টার বেছে নিন বা ট্রান্সফার করুন</span>
            </div>
            <button
              onClick={() => setIsPickerOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
            >
              <X size={14} />
            </button>
          </div>

          {/* Boys Characters */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-sky-400 mb-1.5">ছেলে ক্যারেক্টারসমূহ:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {CAMPUS_CHARACTERS.filter((c) => c.gender === 'male').map((char) => {
                const isSelected = char.id === myCharacterId;
                const owner = participants.find((p) => p.characterId === char.id);
                const isTaken = owner && !isSelected;

                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => handleSelectCharacter(char)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-left border transition text-xs ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                        : isTaken
                        ? 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-75'
                        : 'bg-slate-900/90 border-slate-700 hover:border-amber-400/50 text-slate-200'
                    }`}
                  >
                    <span className="text-sm shrink-0">{char.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{char.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {isTaken ? `(${owner.name})` : char.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Girls Characters */}
          <div>
            <div className="text-[11px] font-semibold text-pink-400 mb-1.5">মেয়ে ক্যারেক্টারসমূহ:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {CAMPUS_CHARACTERS.filter((c) => c.gender === 'female').map((char) => {
                const isSelected = char.id === myCharacterId;
                const owner = participants.find((p) => p.characterId === char.id);
                const isTaken = owner && !isSelected;

                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => handleSelectCharacter(char)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-left border transition text-xs ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                        : isTaken
                        ? 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-75'
                        : 'bg-slate-900/90 border-slate-700 hover:border-amber-400/50 text-slate-200'
                    }`}
                  >
                    <span className="text-sm shrink-0">{char.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{char.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {isTaken ? `(${owner.name})` : char.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Main Bar */}
      <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-1.5 sm:p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1.5">
        
        {/* Top: Current Character Badge & Quick Emoji Reactions */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          
          {/* Character Switcher Pill */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold shrink-0 transition active:scale-95 shadow-sm"
            title="ক্যারেক্টার পরিবর্তন করুন"
          >
            <span>{currentCharacter.emoji}</span>
            <span className="truncate max-w-[80px] sm:max-w-none">{currentCharacter.name}</span>
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
