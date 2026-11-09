import React, { useState } from 'react';
import { X, Music2, Check, ExternalLink } from 'lucide-react';
import { CAMPUS_PLAYLISTS, Playlist } from '../../data/playlists';

interface PlaylistModalProps {
  isOpen: boolean;
  activePlaylistId: string;
  onSelectPlaylist: (id: string) => void;
  onClose: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  activePlaylistId,
  onSelectPlaylist,
  onClose
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    // Check if input is full URL or ID
    const match = customInput.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    const playlistId = match ? match[1] : customInput.trim();
    
    if (playlistId) {
      onSelectPlaylist(playlistId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto no-scrollbar touch-pan-y">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
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
        <div className="space-y-2.5 mb-6">
          {CAMPUS_PLAYLISTS.map((item: Playlist) => {
            const isSelected = activePlaylistId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectPlaylist(item.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{item.name}</div>
                    <div className="text-xs text-slate-400 truncate">{item.description}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-amber-500 text-slate-950 p-1 rounded-full shrink-0">
                    <Check size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Playlist Input */}
        <form onSubmit={handleCustomSubmit} className="border-t border-slate-800 pt-4">
          <label className="block text-xs font-medium text-slate-300 mb-2">
            অথবা নিজস্ব YouTube প্লেলিস্ট লিংক / আইডি দিন:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://www.youtube.com/playlist?list=..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs transition"
            >
              প্লে করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

