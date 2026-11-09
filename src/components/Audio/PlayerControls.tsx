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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-xl px-4 py-3 text-slate-100 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Track Information & Status */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
          {/* Animated Equalizer Icon */}
          <div className="flex items-end gap-0.5 h-6 w-5 shrink-0 bg-slate-800 p-1 rounded">
            <span
              className={`w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_0.8s_infinite]' : 'h-1.5'
              }`}
              style={{ height: isPlaying ? '100%' : '30%' }}
            />
            <span
              className={`w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_1.1s_infinite]' : 'h-3'
              }`}
              style={{ height: isPlaying ? '70%' : '50%' }}
            />
            <span
              className={`w-1 bg-amber-400 rounded-t transition-all ${
                isPlaying ? 'animate-[bounce_0.9s_infinite]' : 'h-2'
              }`}
              style={{ height: isPlaying ? '90%' : '40%' }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-amber-400 truncate">
              {currentTitle}
            </div>
            <div className="text-[11px] text-slate-400 truncate flex items-center gap-2">
              <span>{currentAuthor}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 rounded text-amber-300">
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Playback Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            title="পূর্ববর্তী গান"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-95"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'গান থামান' : 'গান শুনুন'}
            className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-full shadow-lg shadow-amber-500/20 transition active:scale-90"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            onClick={onNext}
            title="পরবর্তী গান"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-95"
          >
            <SkipForward size={18} />
          </button>

          <button
            onClick={onOpenPlaylist}
            title="প্লেলিস্ট বাছুন"
            className="ml-2 flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/30 transition active:scale-95"
          >
            <ListMusic size={15} />
            <span className="hidden sm:inline">প্লেলিস্ট</span>
          </button>
        </div>

        {/* Right: Ambient & Volume Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Day / Night Toggle */}
          <button
            onClick={onToggleNight}
            title={isNight ? 'দিনের আলোতে যান' : 'সন্ধ্যার আলোতে যান'}
            className={`p-2 rounded-full transition active:scale-95 ${
              isNight
                ? 'bg-indigo-950 text-amber-300 border border-amber-400/40'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isNight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Rain Ambient Toggle */}
          <button
            onClick={onToggleRain}
            title={isRain ? 'বৃষ্টি থামান' : 'বৃষ্টি চালু করুন'}
            className={`p-2 rounded-full transition active:scale-95 ${
              isRain
                ? 'bg-blue-900 text-blue-200 border border-blue-400/50 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <CloudRain size={16} />
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume === 0 ? 75 : 0)}
              className="text-slate-400 hover:text-white"
            >
              {volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-18 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

