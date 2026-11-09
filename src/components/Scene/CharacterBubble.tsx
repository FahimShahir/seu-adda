import React from 'react';
import { X } from 'lucide-react';
import { Hotspot, DialogueLine } from '../../data/dialogues';

interface CharacterBubbleProps {
  hotspot: Hotspot;
  conversation: DialogueLine[];
  onClose: () => void;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  hotspot,
  conversation,
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
      className={`absolute z-30 pointer-events-auto transition-all animate-pop w-[260px] xs:w-[290px] sm:w-[330px] ${
        isTopHalf ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'
      } ${horizontalPos}`}
      style={{
        filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.7))'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-slate-900/98 border border-amber-500/60 rounded-2xl p-3 sm:p-3.5 text-slate-100 backdrop-blur-xl shadow-2xl">
        {/* Header: Group Identity & Name */}
        <div className="border-b border-slate-700/60 pb-2 mb-2">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs sm:text-sm truncate">
              <span className="text-base shrink-0">{hotspot.emoji}</span>
              <span className="truncate">{hotspot.groupName}</span>
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
          <div className="text-[10px] text-amber-300/80 italic truncate pl-5">
            {hotspot.subName} • {hotspot.tagline}
          </div>
        </div>

        {/* Conversation Banter / Dialogue Turns */}
        <div className="space-y-2">
          {conversation.map((line, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={idx}
                className={`text-xs sm:text-[13px] leading-relaxed p-1.5 rounded-xl ${
                  isFirst
                    ? 'bg-slate-800/80 border-l-2 border-amber-400 text-slate-100'
                    : 'bg-slate-800/40 border-l-2 border-pink-400 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-semibold text-amber-400 mb-0.5">
                  {line.speaker}:
                </div>
                <div className="text-slate-200">
                  "{line.text}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Speech Bubble Pointer Arrow */}
        <div
          className={`absolute w-3 h-3 bg-slate-900 border-amber-500/60 rotate-45 ${
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
