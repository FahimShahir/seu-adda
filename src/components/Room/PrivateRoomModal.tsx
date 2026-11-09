import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Share2,
  Copy,
  Check,
  Clock,
  Sparkles,
  LogOut,
  Radio,
  Plus,
  Play
} from 'lucide-react';
import { AddaRoom, CAMPUS_CHARACTERS, CampusZone } from '../../types/room';

interface PrivateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoom: AddaRoom | null;
  timeRemaining: string;
  roomError: string;
  currentUser: { id: string; name: string; dept: string; gender?: 'male' | 'female'; characterId?: string };
  onCreateRoom: (
    title: string,
    name: string,
    dept: string,
    gender: 'male' | 'female',
    characterId: string
  ) => string;
  onJoinRoom: (
    roomId: string,
    name: string,
    dept: string,
    gender: 'male' | 'female',
    characterId: string
  ) => boolean;
  onLeaveRoom: () => void;
  onSetRoomSong: (title: string, author: string, source: string) => void;
  initialRoomId?: string;
}

const DEPARTMENTS = ['CSE', 'BBA', 'EEE', 'English', 'Pharmacy', 'Law'];

export const PrivateRoomModal: React.FC<PrivateRoomModalProps> = ({
  isOpen,
  onClose,
  activeRoom,
  timeRemaining,
  roomError,
  currentUser,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  onSetRoomSong,
  initialRoomId = ''
}) => {
  const [tab, setTab] = useState<'create' | 'join'>(initialRoomId ? 'join' : 'create');

  // Form states
  const [userName, setUserName] = useState(currentUser.name || '');
  const [userDept, setUserDept] = useState(currentUser.dept || 'CSE');
  const [gender, setGender] = useState<'male' | 'female'>(currentUser.gender || 'male');
  const [pickerZone, setPickerZone] = useState<CampusZone>('foreground');
  const [characterId, setCharacterId] = useState<string>(
    currentUser.characterId || (currentUser.gender === 'female' ? 'green_saree_girl' : 'guitarist')
  );
  const [roomTitle, setRoomTitle] = useState('সাউথইস্ট আড্ডা রুম');
  const [roomIdInput, setRoomIdInput] = useState(initialRoomId);

  // Song & Share states
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [songUrlInput, setSongUrlInput] = useState('');

  // Auto-fill from props
  useEffect(() => {
    if (currentUser.name && !userName) setUserName(currentUser.name);
    if (currentUser.dept) setUserDept(currentUser.dept);
    if (currentUser.gender) setGender(currentUser.gender);
    if (currentUser.characterId) setCharacterId(currentUser.characterId);
  }, [currentUser]);

  useEffect(() => {
    if (initialRoomId) {
      setRoomIdInput(initialRoomId);
      setTab('join');
    }
  }, [initialRoomId]);

  // When gender changes, auto-pick default character for that gender if mismatched
  const handleGenderChange = (newGender: 'male' | 'female') => {
    setGender(newGender);
    const currentChar = CAMPUS_CHARACTERS.find((c) => c.id === characterId);
    if (!currentChar || currentChar.gender !== newGender) {
      const matchInZone = CAMPUS_CHARACTERS.find((c) => c.gender === newGender && c.zone === pickerZone);
      setCharacterId(matchInZone ? matchInZone.id : newGender === 'female' ? 'green_saree_girl' : 'guitarist');
    }
  };

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom(roomTitle, userName, userDept, gender, characterId);
    onClose(); // Automatically close modal so chat happens on main screen!
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onJoinRoom(roomIdInput, userName, userDept, gender, characterId);
    if (success) {
      onClose(); // Automatically close modal so chat happens on main screen!
    }
  };

  const handleAddSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songUrlInput.trim()) return;
    onSetRoomSong('ক্যাম্পাস পছন্দের গান', userName, songUrlInput.trim());
    setSongUrlInput('');
    setIsAddingSong(false);
  };

  const handleCopyLink = async () => {
    if (!activeRoom) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${activeRoom.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopiedLink(true);
      setTimeout(() => setIsCopiedLink(false), 2000);
    } catch (_) {}
  };

  const handleShareRoom = async () => {
    if (!activeRoom) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${activeRoom.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SEU Adda — ${activeRoom.name}`,
          text: `সাউথইস্ট বিশ্ববিদ্যালয় আড্ডা রুমে তোমারে ডাকছে! রুম আইডি: ${activeRoom.id} (মেয়াদ ২ ঘণ্টা) ☕🎸`,
          url: url
        });
      } catch (_) {}
    } else {
      handleCopyLink();
    }
  };

  const handleCopyId = async () => {
    if (!activeRoom) return;
    try {
      await navigator.clipboard.writeText(activeRoom.id);
      setIsCopiedId(true);
      setTimeout(() => setIsCopiedId(false), 2000);
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col no-scrollbar overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg min-w-0">
            <Users size={18} className="text-amber-400 shrink-0" />
            <span className="truncate">
              {activeRoom ? activeRoom.name : 'সাউথইস্ট পার্সোনাল আড্ডা রুম 🏠'}
            </span>
            {activeRoom && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono shrink-0">
                {activeRoom.id}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {activeRoom && (
              <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-full font-mono">
                <Clock size={12} className="animate-spin text-amber-400" />
                <span>{timeRemaining}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
              aria-label="বন্ধ করুন"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Global Room Error Banner */}
        {roomError && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{roomError}</span>
          </div>
        )}

        {/* VIEW 1: NOT IN A ROOM (Create & Join Tabs) */}
        {!activeRoom ? (
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
            
            {/* Tabs */}
            <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setTab('create')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  tab === 'create'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚀 নতুন রুম খুলুন
              </button>
              <button
                type="button"
                onClick={() => setTab('join')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  tab === 'join'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚪 রুম আইডি দিয়ে জয়েন
              </button>
            </div>

            {/* TAB 1: CREATE ROOM FORM */}
            {tab === 'create' && (
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3.5">
                {/* Room Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-400">রুমের নাম / বিষয়</label>
                  <input
                    type="text"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    maxLength={32}
                    placeholder="যেমন: সিএসই রাতের আড্ডা..."
                    required
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>

                {/* Nickname & Gender Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-400">আপনার নাম / ডাকনাম</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      maxLength={24}
                      placeholder="যেমন: মাহিন..."
                      required
                      className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-400">জেন্ডার / ক্যারেক্টার টাইপ</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleGenderChange('male')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                          gender === 'male'
                            ? 'bg-sky-500/30 border-sky-400 text-sky-300 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400'
                        }`}
                      >
                        👦 ছেলে
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenderChange('female')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                          gender === 'female'
                            ? 'bg-pink-500/30 border-pink-400 text-pink-300 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400'
                        }`}
                      >
                        👧 মেয়ে
                      </button>
                    </div>
                  </div>
                </div>

                {/* Character Picker with Zone Tabs */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-amber-400">
                      ইমেজে আপনার ক্যারেক্টার (৩৫ সদস্য):
                    </label>
                  </div>
                  {/* Zone Tabs */}
                  <div className="flex bg-slate-950/70 p-1 rounded-xl gap-1 border border-white/5">
                    {[
                      { id: 'foreground' as CampusZone, label: '🥇 সামনে' },
                      { id: 'midground' as CampusZone, label: '🥈 সিঁড়িতে' },
                      { id: 'background' as CampusZone, label: '🥉 গেটে' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setPickerZone(tab.id);
                          const firstMatch = CAMPUS_CHARACTERS.find((c) => c.gender === gender && c.zone === tab.id);
                          if (firstMatch) setCharacterId(firstMatch.id);
                        }}
                        className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition ${
                          pickerZone === tab.id
                            ? 'bg-amber-500/30 border border-amber-400/60 text-amber-300 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
                    {CAMPUS_CHARACTERS.filter((c) => c.gender === gender && c.zone === pickerZone).map((c) => {
                      const isSelected = c.id === characterId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCharacterId(c.id)}
                          className={`flex items-center gap-1.5 p-1.5 rounded-xl text-left border transition text-xs ${
                            isSelected
                              ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-sm shrink-0">{c.emoji}</span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Department Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-400">আপনার ডিপার্টমেন্ট</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        type="button"
                        key={dept}
                        onClick={() => setUserDept(dept)}
                        className={`py-1 rounded-xl text-xs font-semibold border transition ${
                          userDept === dept
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-amber-500/20 text-slate-300 text-xs">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 রুম খোলার পর চ্যাট হবে <strong>সরাসরি মূল স্ক্রিনে</strong> এবং আপনার ক্যারেক্টারের মাথার উপর মেসেজ স্পিচ বাবল হিসেবে ভেসে উঠবে!
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-1 w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition active:scale-98"
                >
                  🚀 আড্ডা রুম চালু করুন (২ ঘণ্টার মেয়াদ)
                </button>
              </form>
            )}

            {/* TAB 2: JOIN ROOM FORM */}
            {tab === 'join' && (
              <form onSubmit={handleJoinSubmit} className="flex flex-col gap-3.5">
                {/* Room ID */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-400">রুম আইডি (Room ID)</label>
                  <input
                    type="text"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                    placeholder="যেমন: SEU-8B42"
                    required
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none uppercase font-mono tracking-wider transition"
                  />
                </div>

                {/* Name & Gender */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-400">আপনার নাম</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      maxLength={24}
                      placeholder="যেমন: মাহিন..."
                      required
                      className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-400">জেন্ডার</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleGenderChange('male')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                          gender === 'male'
                            ? 'bg-sky-500/30 border-sky-400 text-sky-300 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400'
                        }`}
                      >
                        👦 ছেলে
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenderChange('female')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                          gender === 'female'
                            ? 'bg-pink-500/30 border-pink-400 text-pink-300 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400'
                        }`}
                      >
                        👧 মেয়ে
                      </button>
                    </div>
                  </div>
                </div>

                {/* Character Picker with Zone Tabs */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-amber-400">
                      ইমেজে আপনার ক্যারেক্টার (৩৫ সদস্য):
                    </label>
                  </div>
                  {/* Zone Tabs */}
                  <div className="flex bg-slate-950/70 p-1 rounded-xl gap-1 border border-white/5">
                    {[
                      { id: 'foreground' as CampusZone, label: '🥇 সামনে' },
                      { id: 'midground' as CampusZone, label: '🥈 সিঁড়িতে' },
                      { id: 'background' as CampusZone, label: '🥉 গেটে' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setPickerZone(tab.id);
                          const firstMatch = CAMPUS_CHARACTERS.find((c) => c.gender === gender && c.zone === tab.id);
                          if (firstMatch) setCharacterId(firstMatch.id);
                        }}
                        className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition ${
                          pickerZone === tab.id
                            ? 'bg-amber-500/30 border border-amber-400/60 text-amber-300 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
                    {CAMPUS_CHARACTERS.filter((c) => c.gender === gender && c.zone === pickerZone).map((c) => {
                      const isSelected = c.id === characterId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCharacterId(c.id)}
                          className={`flex items-center gap-1.5 p-1.5 rounded-xl text-left border transition text-xs ${
                            isSelected
                              ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-sm shrink-0">{c.emoji}</span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Department Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-400">আপনার ডিপার্টমেন্ট</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        type="button"
                        key={dept}
                        onClick={() => setUserDept(dept)}
                        className={`py-1 rounded-xl text-xs font-semibold border transition ${
                          userDept === dept
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-1 w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition active:scale-98"
                >
                  🚪 রুমে প্রবেশ করুন
                </button>
              </form>
            )}

          </div>
        ) : (
          /* VIEW 2: ACTIVE ROOM INFO & CONTROLS */
          <div className="flex-1 flex flex-col gap-3">
            
            {/* Quick Action Button: Return to Main Screen Hangout */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Play size={16} />
              <span>মূল স্ক্রিনে আড্ডা ও চ্যাট করুন ☕</span>
            </button>

            {/* Room ID & Invite Link */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs px-3 py-1.5 rounded-xl border border-amber-500/30 font-mono transition"
                  title="রুম আইডি কপি করুন"
                >
                  {isCopiedId ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{activeRoom.id}</span>
                </button>

                <button
                  onClick={handleShareRoom}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-white/10 transition"
                  title="বন্ধুদের সাথে লিংক শেয়ার করুন"
                >
                  {isCopiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} className="text-blue-400" />}
                  <span>{isCopiedLink ? 'কপি হয়েছে!' : 'ইনভাইট লিংক'}</span>
                </button>
              </div>

              <button
                onClick={onLeaveRoom}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-xs px-3 py-1.5 rounded-xl border border-rose-500/30 transition"
              >
                <LogOut size={13} />
                <span>রুম ত্যাগ</span>
              </button>
            </div>

            {/* Synchronized Radio Track & Change Song */}
            <div className="bg-slate-950/85 p-3 rounded-2xl border border-amber-500/25 flex items-center justify-between gap-2 shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Radio size={16} className="animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-amber-400/80 font-medium">রুম রেডিও গান 🎶</div>
                  <div className="text-xs font-semibold text-slate-100 truncate">
                    {activeRoom.currentSong ? activeRoom.currentSong.title : 'ক্যাম্পাস আড্ডা রেডিও বাজছে'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingSong(!isAddingSong)}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-2.5 py-1.5 rounded-xl font-bold shrink-0 transition"
              >
                <Plus size={13} />
                <span>গান বদলান</span>
              </button>
            </div>

            {/* Song URL Form */}
            {isAddingSong && (
              <form onSubmit={handleAddSongSubmit} className="flex gap-2 p-2 bg-slate-950/90 rounded-2xl border border-amber-500/40 animate-fadeIn">
                <input
                  type="text"
                  value={songUrlInput}
                  onChange={(e) => setSongUrlInput(e.target.value)}
                  placeholder="YouTube গানের লিংক পেস্ট করুন..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs"
                >
                  প্লে করুন
                </button>
              </form>
            )}

            {/* Members in Room */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-400">
                আড্ডায় আছেন ({activeRoom.participants.length} জন):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeRoom.participants.map((p) => {
                  const char = CAMPUS_CHARACTERS.find((c) => c.id === p.characterId);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-xs text-slate-200 border border-white/5"
                    >
                      <span>{char?.emoji || '👤'}</span>
                      <span className="font-semibold text-slate-100">{p.name}</span>
                      {p.dept && <span className="text-[10px] text-amber-400">({p.dept})</span>}
                      <span className="text-[9px] text-slate-400">[{char?.name || 'চরিত্র'}]</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400">
              💡 আপনি যে ক্যারেক্টার নিয়েছেন, স্ক্রিনে মেসেজ পাঠালে তার মাথার উপর স্পিচ বাবল ভেসে উঠবে। যেকোনো সময় ক্যারেক্টার বদলাতে পারবেন।
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
