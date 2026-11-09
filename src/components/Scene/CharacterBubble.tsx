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
  // Determine if popup should appear above or below the hotspot
  const isTopHalf = hotspot.y < 50;
  const isRightHalf = hotspot.x > 60;

  return (
    <div
      className={`absolute z-30 pointer-events-auto transition-all animate-pop max-w-[280px] sm:max-w-xs ${
        isTopHalf ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'
      } ${
        isRightHalf ? 'right-0' : 'left-1/2 -translate-x-1/2'
      }`}
      style={{
        filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4))'
      }}
    >
      <div className="relative bg-slate-900/95 border border-amber-500/40 rounded-2xl p-3.5 text-slate-100 backdrop-blur-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-xs sm:text-sm">
            <span className="text-base">{hotspot.emoji}</span>
            <span>{hotspot.name}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Dialogue Body */}
        <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
          "{dialogueText}"
        </p>

        {/* Speech Bubble Arrow */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-amber-500/40 rotate-45 ${
            isTopHalf
              ? '-top-1.5 border-t border-l'
              : '-bottom-1.5 border-b border-r'
          }`}
        />
      </div>
    </div>
  );
};
