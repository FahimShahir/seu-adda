import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Copy,
  Check,
  Coffee,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface AlumniTreatBannerProps {
  onOpenDeveloper: () => void;
}

export const AlumniTreatBanner: React.FC<AlumniTreatBannerProps> = ({ onOpenDeveloper }) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const bkashNumber = '01969091751';

  const triggerConfetti = (originX = 0.85, originY = 0.25) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: originX, y: originY },
        colors: ['#E2136E', '#F59E0B', '#10B981', '#38BDF8', '#ffffff']
      });
    } catch (_) {}
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (_) {}
    return false;
  };

  const handleCopy = async (chipLabel?: string) => {
    await copyToClipboard(bkashNumber);
    setCopied(true);
    if (chipLabel) setActiveChip(chipLabel);
    triggerConfetti();

    setTimeout(() => {
      setCopied(false);
      setActiveChip(null);
    }, 3000);
  };

  // Minimized Sleek Pill (Sticky and prominent on screen)
  if (isMinimized) {
    return (
      <aside
        aria-label="অ্যালামনাই কফি ফান্ড"
        className="fixed top-16 right-2 sm:right-4 z-30 animate-fadeIn pointer-events-auto"
      >
        <div className="flex items-center gap-1.5 p-1 pl-2 sm:pl-3 rounded-full bg-slate-950/90 hover:bg-slate-900 border-2 border-[#E2136E]/70 shadow-xl shadow-[#E2136E]/30 backdrop-blur-xl transition group">
          <button
            type="button"
            onClick={() => handleCopy()}
            className="flex items-center gap-1.5 text-xs font-bold text-white cursor-pointer active:scale-95"
            title="বিকাশ নম্বর কপি করতে ক্লিক করুন"
          >
            <span className="text-sm">☕</span>
            <span className="text-pink-300 font-extrabold hidden xs:inline">অ্যালামনাই ফান্ড:</span>
            <span className="font-mono text-amber-300 font-bold">{bkashNumber}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E2136E] text-white font-black animate-pulse">
              বিকাশ
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="কার্ডটি বড় করুন"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>
    );
  }

  // Expanded Eye-Catching Alumni & Coffee Treat Card (Directly Front & Center on Screen)
  return (
    <aside
      aria-label="অ্যালামনাই কফি ফান্ড কার্ড"
      className="fixed top-14 sm:top-16 right-2 sm:right-4 z-30 w-[calc(100vw-1rem)] sm:w-84 max-w-sm animate-fadeIn pointer-events-auto select-none"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950/92 backdrop-blur-2xl border-2 border-[#E2136E]/70 p-3 sm:p-4 shadow-2xl shadow-[#E2136E]/25 text-white transition-all">
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#E2136E]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header with Minimize Action */}
        <div className="flex items-center justify-between gap-1.5 mb-2 relative z-10">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-[#E2136E] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#E2136E]/30">
              <GraduationCap size={14} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-pink-300 leading-tight">
                <span>অ্যালামনাই কর্নার • কফি ট্রিট</span>
                <Sparkles size={11} className="text-amber-400 animate-pulse shrink-0" />
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">সাউথইস্ট বিশ্ববিদ্যালয় প্রাক্তন ও শুভাকাঙ্ক্ষী</div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#E2136E] to-pink-600 text-white shadow-sm">
              বিকাশ Personal
            </span>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="মিনিমাইজ করুন"
            >
              <ChevronUp size={15} />
            </button>
          </div>
        </div>

        {/* Heartfelt Emotional Copy */}
        <p className="text-[11px] text-slate-200 leading-relaxed mb-2.5 relative z-10 font-normal">
          ক্যাম্পাসের চায়ের আড্ডা মিস করছেন? প্রিয় আড্ডাখানাকে বিজ্ঞাপনমুক্ত রাখতে এবং জুনিয়র ছোটভাইকে উৎসাহিত করতে এক কাপ কফি ট্রিট দিন! ☕❤️
        </p>

        {/* bKash Number Box with One-Click Copy */}
        <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-pink-500/40 mb-2.5 relative z-10">
          <div className="min-w-0">
            <div className="text-[9px] text-pink-300 font-semibold leading-tight">
              বিকাশ নম্বর (Personal):
            </div>
            <div className="text-base sm:text-lg font-black text-amber-300 font-mono tracking-wider leading-tight">
              {bkashNumber}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopy()}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-lg shrink-0 ${
              copied
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-[#E2136E] to-pink-600 hover:from-[#c2105e] hover:to-pink-500 text-white shadow-[#E2136E]/30'
            }`}
            title="বিকাশ নম্বর কপি করুন"
          >
            {copied ? (
              <>
                <Check size={14} className="stroke-[3]" />
                <span>কপি হয়েছে 🎉</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>কপি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Campus Treat Chips */}
        <div className="space-y-1 mb-2.5 relative z-10">
          <div className="text-[9px] text-slate-300 font-medium flex items-center justify-between">
            <span>ট্রিটের পরিমাণ বেছে নিন (ক্লিক করলেই কপি হবে):</span>
            <span className="text-amber-400">✨</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: '20', label: 'চা ২০৳', icon: '☕' },
              { id: '50', label: 'কফি ৫০৳', icon: '🥤' },
              { id: '100', label: 'ট্রিট ১০০৳', icon: '💖' }
            ].map((chip) => {
              const isSelected = activeChip === chip.label;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleCopy(chip.label)}
                  className={`py-1 px-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-200 hover:text-amber-300 hover:border-amber-400/50'
                  }`}
                  title={`${chip.label} পাঠাতে নম্বর কপি করুন`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: Developer Publicity & Full Modal Trigger */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/10 relative z-10 text-[10px]">
          <button
            type="button"
            onClick={onOpenDeveloper}
            className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition cursor-pointer font-medium"
            title="ডেভেলপার ফাহিম শাহীর সম্পর্কে বিস্তারিত জানুন"
          >
            <UserCheck size={12} className="text-amber-400" />
            <span>ডেভেলপার: <strong className="text-amber-400 underline">ফাহিম শাহীর</strong></span>
          </button>

          <button
            type="button"
            onClick={onOpenDeveloper}
            className="text-[10px] text-pink-300 hover:text-pink-200 underline font-semibold cursor-pointer"
          >
            বিস্তারিত প্রোফাইল →
          </button>
        </div>
      </div>
    </aside>
  );
};

