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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-xl px-3 sm:px-4 py-2 sm:py-2.5 text-slate-100 shadow-2xl touch-manipulation">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Track Information & Status */}
        <div className="flex items-center gap-2 sm:gap-3 w-1/3 min-w-0">
          {/* Animated Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-5 w-4 shrink-0 bg-slate-800 p-0.5 rounded">
            <span
              className={`w-0.5 sm:w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_0.8s_infinite]' : 'h-1.5'
              }`}
              style={{ height: isPlaying ? '100%' : '30%' }}
            />
            <span
              className={`w-0.5 sm:w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_1.1s_infinite]' : 'h-3'
              }`}
              style={{ height: isPlaying ? '70%' : '50%' }}
            />
            <span
              className={`w-0.5 sm:w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_0.9s_infinite]' : 'h-2'
              }`}
              style={{ height: isPlaying ? '90%' : '40%' }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-semibold text-amber-300 truncate">
              {currentTitle}
            </div>
            <div className="text-[10px] text-slate-400 truncate flex items-center gap-1.5">
              <span className="truncate">{currentAuthor}</span>
              <span className="hidden xs:inline-block text-[9px] px-1 bg-slate-800 rounded text-amber-400/80 shrink-0">
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={onPrev}
            title="পূর্ববর্তী গান"
            className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-95"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'গান থামান' : 'গান শুনুন'}
            className="p-2 sm:p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-full shadow-lg shadow-amber-500/20 transition active:scale-90"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          <button
            onClick={onNext}
            title="পরবর্তী গান"
            className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-95"
          >
            <SkipForward size={16} />
          </button>

          <button
            onClick={onOpenPlaylist}
            title="প্লেলিস্ট বাছুন"
            className="flex items-center gap-1 text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-500/30 transition active:scale-95 ml-1"
          >
            <ListMusic size={14} />
            <span className="hidden sm:inline">প্লেলিস্ট</span>
          </button>
        </div>

        {/* Right: Mood & Volume Controls */}
        <div className="flex items-center gap-1 sm:gap-2 w-auto justify-end">
          {/* Day / Night Toggle */}
          <button
            onClick={onToggleNight}
            title={isNight ? 'দিনের আলো' : 'সন্ধ্যার আলো'}
            className={`p-1.5 sm:p-2 rounded-full transition active:scale-95 ${
              isNight
                ? 'bg-indigo-950 text-amber-300 border border-amber-400/40'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isNight ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Rain Ambient Toggle */}
          <button
            onClick={onToggleRain}
            title={isRain ? 'বৃষ্টি থামান' : 'বৃষ্টি চালু করুন'}
            className={`p-1.5 sm:p-2 rounded-full transition active:scale-95 ${
              isRain
                ? 'bg-blue-900 text-blue-200 border border-blue-400/50 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <CloudRain size={15} />
          </button>

          {/* Volume Control (hidden on very small screens, visible from sm) */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}
              className="text-slate-400 hover:text-white p-1"
              title={volume === 0 ? 'আনমিউট' : 'মিউট'}
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
