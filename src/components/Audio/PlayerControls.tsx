import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ListMusic,
  CloudRain,
  Moon,
  Sun
} from 'lucide-react';
import { PlayerState } from '../../hooks/useYouTubePlayer';

interface PlayerControlsProps {
  playerState: PlayerState;
  isNight: boolean;
  isRain: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange: (val: number) => void;
  onToggleNight: () => void;
  onToggleRain: () => void;
  onOpenPlaylist: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  playerState,
  isNight,
  isRain,
  onTogglePlay,
  onNext,
  onPrev,
  onVolumeChange,
  onToggleNight,
  onToggleRain,
  onOpenPlaylist
}) => {
  const { isPlaying, volume, currentTitle, currentAuthor, statusText } = playerState;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl px-3 sm:px-6 py-2.5 sm:py-3 text-slate-100 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Track Metadata & Dancing Equalizer (Full width on mobile, Left col on desktop) */}
        <div className="flex items-center gap-2.5 w-full sm:w-1/3 min-w-0">
          {/* Animated Equalizer */}
          <div className="flex items-end gap-0.5 h-6 w-5 shrink-0 bg-slate-800/80 p-1 rounded-md">
            <span
              className={`w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_0.7s_infinite]' : 'h-1.5'
              }`}
              style={{ height: isPlaying ? '100%' : '30%' }}
            />
            <span
              className={`w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_1.0s_infinite]' : 'h-3'
              }`}
              style={{ height: isPlaying ? '75%' : '50%' }}
            />
            <span
              className={`w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_0.85s_infinite]' : 'h-2'
              }`}
              style={{ height: isPlaying ? '90%' : '40%' }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-bold text-amber-400 truncate">
              {currentTitle}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 truncate flex items-center gap-1.5">
              <span>{currentAuthor}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 rounded text-amber-300 shrink-0">
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Playback & Action Controls */}
        <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-2 sm:gap-3">
          {/* Previous */}
          <button
            onClick={onPrev}
            title="পূর্ববর্তী গান"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-90"
          >
            <SkipBack size={18} />
          </button>

          {/* Big Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'গান থামান' : 'গান শুনুন'}
            className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-full shadow-lg shadow-amber-500/25 transition active:scale-95"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            title="পরবর্তী গান"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-90"
          >
            <SkipForward size={18} />
          </button>

          {/* Playlist Button */}
          <button
            onClick={onOpenPlaylist}
            title="প্লেলিস্ট বাছুন"
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/30 transition active:scale-95"
          >
            <ListMusic size={15} />
            <span className="text-[11px] sm:text-xs">প্লেলিস্ট</span>
          </button>

          {/* Rain Ambient Toggle (Mobile & Desktop) */}
          <button
            onClick={onToggleRain}
            title={isRain ? 'বৃষ্টি থামান' : 'বৃষ্টি চালু করুন'}
            className={`p-2 rounded-full border transition active:scale-90 ${
              isRain
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            <CloudRain size={16} />
          </button>

          {/* Day / Night Toggle (Mobile & Desktop) */}
          <button
            onClick={onToggleNight}
            title={isNight ? 'দিনের আলো' : 'সন্ধ্যার আলো'}
            className={`p-2 rounded-full border transition active:scale-90 ${
              isNight
                ? 'bg-indigo-950 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            {isNight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Volume Button / Slider */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}
              className="p-2 text-slate-400 hover:text-white rounded-full transition"
              title={volume === 0 ? 'আনমিউট' : 'মিউট'}
            >
              {volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="hidden sm:block w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
