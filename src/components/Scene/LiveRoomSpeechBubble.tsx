import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { ActiveSpeechBubble } from '../../types/room';

interface LiveRoomSpeechBubbleProps {
  bubble: ActiveSpeechBubble;
  x: number; // Character center X percentage (0 - 100)
  y: number; // Character center Y percentage (0 - 100)
  isMine: boolean;
  onCapturePhotoCard?: (speaker: string, text: string) => void;
}

export const LiveRoomSpeechBubble: React.FC<LiveRoomSpeechBubbleProps> = ({
  bubble,
  x,
  y,
  isMine,
  onCapturePhotoCard
}) => {
  // Clamping calculation for bubble positioning:
  // Character is at percentage (x, y)
  // We place the bubble above the character (bottom = 100 - y + offset)
  const bottomOffset = Math.min(92, 100 - y + 6);

  // Horizontal clamping: if x < 28%, align to left; if x > 72%, align to right; else center
  let horizontalStyle: React.CSSProperties = {};
  let pointerStyle: React.CSSProperties = {};

  if (x < 28) {
    horizontalStyle.left = '4%';
    pointerStyle.left = `${Math.max(12, Math.min(80, (x - 4) * 3))}%`;
  } else if (x > 72) {
    horizontalStyle.right = '4%';
    pointerStyle.right = `${Math.max(12, Math.min(80, (96 - x) * 3))}%`;
  } else {
    horizontalStyle.left = `${Math.max(4, Math.min(65, x - 18))}%`;
    pointerStyle.left = '50%';
    pointerStyle.transform = 'translateX(-50%)';
  }

  return (
    <div
      className="absolute z-30 pointer-events-auto transition-all animate-pop w-[220px] xs:w-[250px] sm:w-[280px] max-w-[88%]"
      style={{
        bottom: `${bottomOffset}%`,
        ...horizontalStyle,
        filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.85))'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`relative rounded-2xl p-2.5 sm:p-3 text-slate-100 backdrop-blur-2xl shadow-2xl border-2 transition-all ${
          isMine
            ? 'bg-slate-900/96 border-amber-400 ring-2 ring-amber-400/40'
            : 'bg-slate-900/96 border-emerald-400/80 ring-2 ring-emerald-400/30'
        }`}
      >
        {/* Header: Sender Name, Dept Tag, and Instant Photo Card Trigger */}
        <div className="flex items-center justify-between gap-1.5 border-b border-slate-700/60 pb-1.5 mb-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-xs sm:text-sm text-amber-300 truncate">
              {bubble.senderName}
            </span>
            {bubble.senderDept && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold shrink-0">
                {bubble.senderDept}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[9px] text-slate-400">{bubble.timestamp}</span>
            {onCapturePhotoCard && (
              <button
                type="button"
                onClick={() =>
                  onCapturePhotoCard(
                    `${bubble.senderName}${bubble.senderDept ? ` (${bubble.senderDept})` : ''}`,
                    bubble.text
                  )
                }
                className="p-1 hover:bg-amber-500/20 rounded-lg text-amber-400 hover:text-amber-300 transition active:scale-95"
                title="এই ডায়লগ দিয়ে ফটো কার্ড তৈরি করুন 📸"
              >
                <Camera size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Message Speech Content */}
        <div className="text-xs sm:text-[13px] leading-relaxed text-slate-100 break-words font-medium">
          "{bubble.text}"
        </div>

        {/* Downward Speech Bubble Pointer / Arrow */}
        <div
          className="absolute -bottom-2 w-3.5 h-3.5 bg-slate-900 border-r-2 border-b-2 rotate-45"
          style={{
            ...pointerStyle,
            borderColor: isMine ? '#FBBF24' : '#34D399'
          }}
        />
      </div>
    </div>
  );
};
