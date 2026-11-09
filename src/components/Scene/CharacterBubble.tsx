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
  const isTopHalf = hotspot.y < 50;
  const isRightHalf = hotspot.x > 55;

  return (
    <>
      {/* Mobile View: Fixed Bottom Card (above player bar) */}
      <div className="sm:hidden fixed bottom-[76px] left-3 right-3 z-50 pointer-events-auto animate-pop">
        <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl text-slate-100">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <span className="text-lg">{hotspot.emoji}</span>
              <span>{hotspot.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            "{dialogueText}"
          </p>
        </div>
      </div>

      {/* Desktop / Tablet View: Floating Pinpointed Bubble */}
      <div
        className={`hidden sm:block absolute z-30 pointer-events-auto transition-all animate-pop w-72 ${
          isTopHalf ? 'top-[calc(100%+10px)]' : 'bottom-[calc(100%+10px)]'
        } ${
          isRightHalf ? 'right-0' : 'left-0'
        }`}
        style={{
          filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.5))'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-slate-900/95 border border-amber-500/40 rounded-2xl p-3.5 text-slate-100 backdrop-blur-md shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-xs sm:text-sm">
              <span className="text-base">{hotspot.emoji}</span>
              <span className="truncate">{hotspot.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Dialogue Text */}
          <p className="text-xs leading-relaxed text-slate-200">
            "{dialogueText}"
          </p>

          {/* Pinpoint Arrow */}
          <div
            className={`absolute ${isRightHalf ? 'right-6' : 'left-6'} w-3 h-3 bg-slate-900 border-amber-500/40 rotate-45 ${
              isTopHalf
                ? '-top-1.5 border-t border-l'
                : '-bottom-1.5 border-b border-r'
            }`}
          />
        </div>
      </div>
    </>
  );
};
