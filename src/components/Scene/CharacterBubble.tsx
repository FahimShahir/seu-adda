import React from 'react';
import { X } from 'lucide-react';
import { Hotspot } from '../../data/dialogues';

interface CharacterBubbleProps {
  hotspot: Hotspot;
  dialogueText: string;
  onClose: () => void;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  hotspot,
  dialogueText,
  onClose
}) => {
  // Determine vertical placement (above vs below)
  const isTopHalf = hotspot.y < 45;
  // Determine horizontal alignment to prevent clipping on mobile screens
  const isNearLeft = hotspot.x < 35;
  const isNearRight = hotspot.x > 65;

  let horizontalPos = 'left-1/2 -translate-x-1/2';
  if (isNearLeft) {
    horizontalPos = 'left-0 translate-x-1';
  } else if (isNearRight) {
    horizontalPos = 'right-0 -translate-x-1';
  }

  return (
    <div
      className={`absolute z-30 pointer-events-auto transition-all animate-pop w-[240px] xs:w-[270px] sm:w-[300px] ${
        isTopHalf ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'
      } ${horizontalPos}`}
      style={{
        filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.6))'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-slate-900/95 border border-amber-500/50 rounded-2xl p-3 sm:p-3.5 text-slate-100 backdrop-blur-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-1.5 border-b border-slate-700/60 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-xs sm:text-sm truncate">
            <span className="text-base shrink-0">{hotspot.emoji}</span>
            <span className="truncate">{hotspot.name}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition shrink-0"
            title="বন্ধ করুন"
          >
            <X size={14} />
          </button>
        </div>

        {/* Dialogue Body */}
        <p className="text-xs sm:text-[13px] leading-relaxed text-slate-200">
          "{dialogueText}"
        </p>

        {/* Speech Bubble Pointer Arrow */}
        <div
          className={`absolute w-3 h-3 bg-slate-900 border-amber-500/50 rotate-45 ${
            isNearLeft
              ? 'left-6'
              : isNearRight
              ? 'right-6'
              : 'left-1/2 -translate-x-1/2'
          } ${
            isTopHalf
              ? '-top-1.5 border-t border-l'
              : '-bottom-1.5 border-b border-r'
          }`}
        />
      </div>
    </div>
  );
};
