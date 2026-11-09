import React from 'react';
import { X, MessageCircle } from 'lucide-react';
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
  // Clamping calculation:
  // hotspot.x is in percentage (0 - 100%)
  // If hotspot is near left (< 30%), clamp left to 4%
  // If hotspot is near right (> 70%), clamp left to 55% or right to 4%
  // If hotspot is near bottom (> 60%), position above (top: ~25% to 50%)
  // If hotspot is near top (< 40%), position below (top: ~30% to 55%)

  const isBottomHalf = hotspot.y > 55;
  const isNearLeft = hotspot.x < 35;
  const isNearRight = hotspot.x > 65;

  let posStyle: React.CSSProperties = {};

  if (isBottomHalf) {
    posStyle.bottom = `${Math.min(92, 100 - hotspot.y + 10)}%`;
  } else {
    posStyle.top = `${Math.max(8, hotspot.y + 10)}%`;
  }

  if (isNearLeft) {
    posStyle.left = '4%';
  } else if (isNearRight) {
    posStyle.right = '4%';
  } else {
    posStyle.left = `${Math.max(6, Math.min(60, hotspot.x - 25))}%`;
  }

  return (
    <div
      className="absolute z-30 pointer-events-auto transition-all animate-pop w-[270px] xs:w-[300px] sm:w-[330px] max-w-[92%]"
      style={{
        ...posStyle,
        filter: 'drop-shadow(0 16px 28px rgba(0, 0, 0, 0.8))'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-slate-900/98 border-2 border-amber-500/70 rounded-2xl p-3 sm:p-4 text-slate-100 backdrop-blur-2xl shadow-2xl ring-1 ring-amber-400/30">
        {/* Header: Group Identity & Name */}
        <div className="border-b border-slate-700/70 pb-2 mb-2.5">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs sm:text-sm truncate">
              <span className="text-base shrink-0">{hotspot.emoji}</span>
              <span className="truncate">{hotspot.groupName}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition shrink-0 bg-slate-800/60"
              title="বন্ধ করুন"
            >
              <X size={15} />
            </button>
          </div>
          <div className="text-[11px] text-amber-300/90 font-medium truncate pl-5">
            {hotspot.subName}
          </div>
          <div className="text-[10px] text-slate-400 italic truncate pl-5">
            "{hotspot.tagline}"
          </div>
        </div>

        {/* Conversation Banter / Dialogue Turns */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 no-scrollbar touch-pan-y">
          {conversation.map((line, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={idx}
                className={`text-xs sm:text-[13px] leading-relaxed p-2 rounded-xl transition ${
                  isFirst
                    ? 'bg-slate-800/90 border-l-2 border-amber-400 text-slate-100'
                    : 'bg-slate-800/50 border-l-2 border-rose-400 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 mb-0.5">
                  <MessageCircle size={10} className="shrink-0" />
                  <span>{line.speaker}:</span>
                </div>
                <div className="text-slate-200 pl-3">
                  "{line.text}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
