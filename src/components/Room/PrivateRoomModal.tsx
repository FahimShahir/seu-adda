import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Users,
  Send,
  Music,
  Share2,
  Copy,
  Check,
  Clock,
  Sparkles,
  LogOut,
  Radio,
  Flame,
  Plus
} from 'lucide-react';
import { AddaRoom, ChatMessage } from '../../types/room';

interface PrivateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoom: AddaRoom | null;
  timeRemaining: string;
  roomError: string;
  currentUser: { id: string; name: string; dept: string };
  onCreateRoom: (title: string, name: string, dept: string) => string;
  onJoinRoom: (roomId: string, name: string, dept: string) => boolean;
  onLeaveRoom: () => void;
  onSendMessage: (text: string) => void;
  onSetRoomSong: (title: string, author: string, source: string) => void;
  initialRoomId?: string;
}

const DEPARTMENTS = ['CSE', 'BBA', 'EEE', 'English', 'Pharmacy', 'Law'];
const QUICK_EMOJIS = ['☕', '🎸', '💔', '📚', '🔥', '🤣', '🎉', '✌️'];

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
  onSendMessage,
  onSetRoomSong,
  initialRoomId = ''
}) => {
  // Tab state for non-room view
  const [tab, setTab] = useState<'create' | 'join'>(initialRoomId ? 'join' : 'create');

  // Form states
  const [userName, setUserName] = useState(currentUser.name || '');
  const [userDept, setUserDept] = useState(currentUser.dept || 'CSE');
  const [roomTitle, setRoomTitle] = useState('সাউথইস্ট আড্ডা রুম');
  const [roomIdInput, setRoomIdInput] = useState(initialRoomId);

  // Chat message state
  const [chatInput, setChatInput] = useState('');
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCopiedId, setIsCopiedId] = useState(false);

  // Song input state
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [songUrlInput, setSongUrlInput] = useState('');

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-fill from props
  useEffect(() => {
    if (currentUser.name && !userName) setUserName(currentUser.name);
    if (currentUser.dept) setUserDept(currentUser.dept);
  }, [currentUser]);

  useEffect(() => {
    if (initialRoomId) {
      setRoomIdInput(initialRoomId);
      setTab('join');
    }
  }, [initialRoomId]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (activeRoom && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeRoom?.messages]);

  if (!isOpen) return null;

  // Handle Form Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom(roomTitle, userName, userDept);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoinRoom(roomIdInput, userName, userDept);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  const handleQuickEmoji = (emoji: string) => {
    onSendMessage(emoji);
  };

  const handleAddSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songUrlInput.trim()) return;
    onSetRoomSong('ক্যাম্পাস পছন্দের গান', userName, songUrlInput.trim());
    setSongUrlInput('');
    setIsAddingSong(false);
  };

  // Copy Room Link
  const handleCopyLink = async () => {
    if (!activeRoom) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${activeRoom.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopiedLink(true);
      setTimeout(() => setIsCopiedLink(false), 2000);
    } catch (_) {
      // Fallback
    }
  };

  // Native Share Room
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

  // Copy Room ID
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
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col no-scrollbar overflow-hidden">
        
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
                onClick={() => setTab('create')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  tab === 'create'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚀 নতুন রুম খুলুন (২ ঘণ্টার মেয়াদ)
              </button>
              <button
                onClick={() => setTab('join')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  tab === 'join'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚪 রুম আইডি দিয়ে জয়েন করুন
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
                    placeholder="যেমন: সিএসই রাতের আড্ডা, মাহিনের ফ্রেন্ডস জোন..."
                    required
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>

                {/* Host Nickname */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-400">আপনার নাম / ডাকনাম</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={24}
                    placeholder="যেমন: মাহিন, সাকিব..."
                    required
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>

                {/* Department Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-400">আপনার ডিপার্টমেন্ট</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        type="button"
                        key={dept}
                        onClick={() => setUserDept(dept)}
                        className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                          userDept === dept
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2-Hour TTL & Rules Card */}
                <div className="p-3 rounded-2xl bg-slate-950/50 border border-amber-500/20 text-slate-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Sparkles size={13} />
                    <span>পার্সোনাল রুমের নিয়মাবলী:</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    • প্রতিটি রুম তৈরির মুহূর্ত থেকে ঠিক <strong>২ ঘণ্টা</strong> পর্যন্ত কার্যকর থাকবে।
                    <br />
                    • বন্ধুরা একসাথে একই ব্যাকগ্রাউন্ড গান শুনে লাইভ চ্যাট করতে পারবেন।
                    <br />
                    • রুমে <strong>কেউ না থাকলে বা সবাই বের হয়ে গেলে রুমটি স্বয়ংক্রিয়ভাবে মুছে যাবে</strong>।
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition active:scale-98"
                >
                  🚀 আড্ডা রুম চালু করুন
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
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none uppercase font-mono tracking-wider transition"
                  />
                </div>

                {/* User Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-400">আপনার নাম</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={24}
                    placeholder="যেমন: মাহিন, নিবিড়..."
                    required
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>

                {/* Department Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-400">আপনার ডিপার্টমেন্ট</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        type="button"
                        key={dept}
                        onClick={() => setUserDept(dept)}
                        className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                          userDept === dept
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition active:scale-98"
                >
                  🚪 রুমে প্রবেশ করুন
                </button>
              </form>
            )}

          </div>
        ) : (
          /* VIEW 2: INSIDE ACTIVE ROOM (Music Bar, Participants, Live Chat Feed) */
          <div className="flex-1 min-h-0 flex flex-col gap-2.5">
            
            {/* Top Room Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-950/70 p-2 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs px-2.5 py-1 rounded-xl border border-amber-500/30 font-mono transition"
                  title="রুম আইডি কপি করুন"
                >
                  {isCopiedId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{activeRoom.id}</span>
                </button>

                <button
                  onClick={handleShareRoom}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-xl border border-white/10 transition"
                  title="বন্ধুদের সাথে লিংক শেয়ার করুন"
                >
                  {isCopiedLink ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} className="text-blue-400" />}
                  <span>{isCopiedLink ? 'লিংক কপি হয়েছে!' : 'ইনভাইট লিংক'}</span>
                </button>
              </div>

              <button
                onClick={onLeaveRoom}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-xs px-2.5 py-1 rounded-xl border border-rose-500/30 transition"
              >
                <LogOut size={12} />
                <span>রুম ত্যাগ</span>
              </button>
            </div>

            {/* Synchronized Room Radio / Music Bar */}
            <div className="bg-slate-950/85 p-2 sm:p-2.5 rounded-2xl border border-amber-500/25 flex items-center justify-between gap-2 shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Radio size={14} className="animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-amber-400/80 font-medium">রুম রেডিও গান 🎶</div>
                  <div className="text-xs font-semibold text-slate-100 truncate">
                    {activeRoom.currentSong ? activeRoom.currentSong.title : 'ক্যাম্পাস আড্ডা রেডিও বাজছে'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAddingSong(!isAddingSong)}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-2.5 py-1.5 rounded-xl font-bold shrink-0 transition"
              >
                <Plus size={13} />
                <span>গান বদলান</span>
              </button>
            </div>

            {/* Inline Custom Song Input */}
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

            {/* Active Members Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-slate-400 shrink-0">আড্ডায় আছেন ({activeRoom.participants.length}):</span>
              {activeRoom.participants.map((p) => (
                <span
                  key={p.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-200 border border-white/5 shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{p.name}</span>
                  {p.dept && <span className="text-[9px] text-amber-400">({p.dept})</span>}
                </span>
              ))}
            </div>

            {/* Chat Messages Feed Container */}
            <div
              ref={chatScrollRef}
              className="flex-1 min-h-[220px] max-h-[38vh] sm:max-h-[44vh] overflow-y-auto no-scrollbar bg-slate-950/70 p-3 rounded-2xl border border-white/10 flex flex-col gap-2.5"
            >
              {activeRoom.messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                  এখনো কোনো বার্তা নেই। বন্ধুদের হাই লিখুন! 👋
                </div>
              ) : (
                activeRoom.messages.map((msg: ChatMessage) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-0.5">
                        <span className="inline-block px-3 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-amber-300/90 border border-amber-500/20">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                        isMe ? 'self-end' : 'self-start'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <span className="font-semibold text-slate-300">{msg.senderName}</span>
                        {msg.senderDept && (
                          <span className="text-amber-400 text-[9px]">[{msg.senderDept}]</span>
                        )}
                        <span className="text-slate-500">• {msg.timestamp}</span>
                      </div>
                      <div
                        className={`px-3 py-2 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                            : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Emoji Reaction Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleQuickEmoji(emoji)}
                  className="px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs transition active:scale-95 shrink-0"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                maxLength={200}
                placeholder="আড্ডার বার্তা লিখুন..."
                className="flex-1 bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center transition active:scale-95 shadow-md shadow-amber-500/25"
              >
                <Send size={15} />
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
