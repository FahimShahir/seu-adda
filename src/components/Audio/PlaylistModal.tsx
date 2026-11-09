import React, { useState } from 'react';
import { X, Music2, Check, Sparkles } from 'lucide-react';
import { CAMPUS_PLAYLISTS, Playlist } from '../../data/playlists';

interface PlaylistModalProps {
  isOpen: boolean;
  activePlaylistId: string;
  onSelectPlaylist: (playlist: Playlist) => void;
  onClose: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  activePlaylistId,
  onSelectPlaylist,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg">
            <Music2 size={20} />
            <span>ক্যাম্পাস রেডিও প্লেলিস্ট বাছুন</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Curated Playlists */}
        <div className="space-y-3 mb-4">
          {CAMPUS_PLAYLISTS.map((item: Playlist) => {
            const isSelected = activePlaylistId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectPlaylist(item);
                  onClose();
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/40'
                    : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl sm:text-3xl shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{item.name}</div>
                    <div className="text-xs text-slate-400 truncate mb-1">{item.description}</div>
                    <div className="text-[11px] text-amber-400/80 flex items-center gap-1">
                      <Sparkles size={11} />
                      <span>{item.tracks.length} টি গান অন্তর্ভুক্ত</span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-amber-500 text-slate-950 p-1.5 rounded-full shrink-0 shadow-md">
                    <Check size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Playlist Songs Preview */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3.5">
          <div className="text-xs font-semibold text-slate-300 mb-2">
            🎶 শীর্ষ গানসমূহ:
          </div>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>আর্টসেল — অনিকেত প্রান্তর</li>
            <li>শিরোনামহীন — আবার হাসিমুখ</li>
            <li>আর্নব — তোমার জন্য</li>
            <li>ওয়ারফেজ — পূর্ণতা</li>
            <li>এলআরবি — সেই তুমি</li>
            <li>মাইলস — ফিরিয়ে দাও</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
