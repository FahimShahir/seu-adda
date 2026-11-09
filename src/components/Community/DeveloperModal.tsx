import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Code2,
  MessageCircle,
  Sparkles,
  GraduationCap,
  Coffee,
  Gift
} from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const email = 'shahirshahir2017@gmail.com';
  const facebookUrl = 'https://www.facebook.com/profile.php?id=61589135607170';
  const whatsappNumber = '01969091751';
  const whatsappUrl = 'https://wa.me/8801969091751';
  const bkashNumber = '01969091751';

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleBkashCopy = (amountLabel?: string) => {
    navigator.clipboard.writeText(bkashNumber);
    setCopiedField('bkash');
    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.55, x: 0.5 },
        colors: ['#E2136E', '#F59E0B', '#10B981', '#38BDF8', '#ffffff']
      });
    } catch (_) {}
    setTimeout(() => {
      setCopiedField(null);
    }, 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="developer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Glow decoration */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
          title="বন্ধ করুন"
        >
          <X size={18} />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-4">
          <Code2 size={15} />
          <span>ক্রিয়েটর ও ডেভেলপার প্রোফাইল</span>
          <Sparkles size={13} className="text-amber-400 animate-pulse" />
        </div>

        {/* Profile Avatar & Intro */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-3 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-amber-500/60 shadow-xl shadow-amber-500/20 bg-slate-800 transition-transform duration-300 group-hover:scale-105">
              <img
                src="./images/developer.jpg"
                alt="Fahim Shahir - Creator & Developer of SEU Adda"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
              <span>👨‍💻 ক্রিয়েটর & ডেভেলপার</span>
            </div>
          </div>

          <h2 id="developer-modal-title" className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-1.5 mt-1">
            <span>ফাহিম শাহীর (Fahim Shahir)</span>
          </h2>
          <p className="text-xs text-amber-300/90 font-medium mt-0.5">
            সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা ক্রিয়েটর & ডেভেলপার
          </p>
          <p className="text-[11px] text-slate-400 mt-2 max-w-xs leading-relaxed">
            সাউথইস্ট বিশ্ববিদ্যালয়ের প্রাণবন্ত ক্যাম্পাস আড্ডা, গান ও স্মৃতিকে চিরভাস্বর করে রাখার জন্য এই প্ল্যাটফর্মটি তৈরি করা হয়েছে। ☕❤️
          </p>
        </div>

        {/* Featured: Alumni Love & Coffee Fund Card (bKash Support) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E2136E]/20 via-purple-950/30 to-amber-950/25 border border-[#E2136E]/40 p-3.5 sm:p-4 mb-4 shadow-xl shadow-[#E2136E]/10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
              <GraduationCap size={16} className="text-[#E2136E]" />
              <span>অ্যালামনাই কর্নার • কফি ট্রিট ☕❤️</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E2136E] text-white shadow-sm flex items-center gap-1">
              <span>বিকাশ Personal</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            সাউথইস্টের প্রিয় প্রাক্তন ভাইয়া ও আপুরা! 🎓 ক্যাম্পাসের সিঁড়িতে বসে গিটারের গান আর এক কাপ চায়ের আড্ডার সোনালী দিনগুলো মিস করেন? প্রিয় ক্যাম্পাসের আড্ডাকে কোনো বিজ্ঞাপন ছাড়া চিরদিন সচল রাখতে এবং সার্ভার খরচে — জুনিয়র ডেভেলপার ছোটভাইকে এক কাপ কফি ট্রিট দিয়ে ভালোবাসা জানাতে পারেন!
          </p>

          {/* bKash Number & Copy Action Box */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 mb-2.5">
            <div className="min-w-0">
              <div className="text-[10px] text-pink-300/80 font-medium">
                বিকাশ সেন্ড মানি (Personal Number):
              </div>
              <div className="text-sm sm:text-base font-black text-white tracking-wider font-mono">
                {bkashNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleBkashCopy()}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md shrink-0 ${
                copiedField === 'bkash'
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-[#E2136E] to-pink-600 hover:from-[#c2105e] hover:to-pink-500 text-white shadow-[#E2136E]/30'
              }`}
              title="বিকাশ নম্বর কপি করুন"
            >
              {copiedField === 'bkash' ? (
                <>
                  <Check size={14} className="stroke-[3]" />
                  <span>কপি হয়েছে 🎉</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>নম্বর কপি</span>
                </>
              )}
            </button>
          </div>

          {/* Fun Campus Treat Suggestion Chips */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-medium">ক্যাম্পাস চায়ের ট্রিট বেছে নিন (ক্লিক করলেই নম্বর কপি হবে):</div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleBkashCopy('চা ২০৳')}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-amber-500/40 text-[10px] text-slate-300 hover:text-amber-300 flex items-center justify-between transition cursor-pointer"
                title="১ কাপ রং চা ট্রিট দিন"
              >
                <span>☕ ১ কাপ রং চা</span>
                <span className="font-bold text-amber-400">২০৳</span>
              </button>
              <button
                type="button"
                onClick={() => handleBkashCopy('দুধ চা ৫০৳')}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-amber-500/40 text-[10px] text-slate-300 hover:text-amber-300 flex items-center justify-between transition cursor-pointer"
                title="স্পেশাল দুধ চা ট্রিট দিন"
              >
                <span>🥛 স্পেশাল দুধ চা</span>
                <span className="font-bold text-amber-400">৫০৳</span>
              </button>
              <button
                type="button"
                onClick={() => handleBkashCopy('কফি ১০০৳')}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-pink-500/40 text-[10px] text-slate-300 hover:text-pink-300 flex items-center justify-between transition cursor-pointer"
                title="কোল্ড কফি ট্রিট দিন"
              >
                <span>☕☕ কোল্ড কফি</span>
                <span className="font-bold text-pink-400">১০০৳</span>
              </button>
              <button
                type="button"
                onClick={() => handleBkashCopy('স্পনসর ২০০৳+')}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-emerald-500/40 text-[10px] text-slate-300 hover:text-emerald-300 flex items-center justify-between transition cursor-pointer"
                title="ক্যাম্পাস আড্ডার বড় স্পনসর"
              >
                <span>🎸 আড্ডার স্পনসর</span>
                <span className="font-bold text-emerald-400">২০০৳+</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contact Links Grid */}
        <div className="space-y-2.5 mb-5">
          {/* Email Card */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-amber-500/40 transition flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium">ইমেইল ঠিকানা</div>
                <a
                  href={`mailto:${email}`}
                  className="text-xs font-semibold text-slate-100 hover:text-amber-300 transition truncate block"
                  title="ইমেইল পাঠাতে ক্লিক করুন"
                >
                  {email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(email, 'email')}
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0 cursor-pointer flex items-center gap-1 text-[10px]"
              title="ইমেইল কপি করুন"
            >
              {copiedField === 'email' ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400 font-bold">কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>কপি</span>
                </>
              )}
            </button>
          </div>

          {/* WhatsApp Card */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-emerald-500/40 transition flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <MessageCircle size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium">হোয়াটসঅ্যাপ (WhatsApp)</div>
                <div className="text-xs font-semibold text-slate-100 truncate">
                  {whatsappNumber}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(whatsappNumber, 'whatsapp')}
                className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[10px] flex items-center gap-1"
                title="নম্বর কপি করুন"
              >
                {copiedField === 'whatsapp' ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <span>মেসেজ</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Facebook Card */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-blue-500/40 transition flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                <ExternalLink size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium">ফেসবুক প্রোফাইল</div>
                <div className="text-xs font-semibold text-slate-100 truncate">
                  facebook.com/profile...
                </div>
              </div>
            </div>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition flex items-center gap-1 shadow-md shadow-blue-600/20 shrink-0 cursor-pointer"
            >
              <span>ভিজিট করুন</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-slate-800 pt-3 text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <span>ক্যাম্পাসের ভালোবাসায় তৈরি</span>
            <Heart size={11} className="text-rose-500 fill-rose-500" />
            <span>সাউথইস্ট বিশ্ববিদ্যালয়, ঢাকা</span>
          </p>
        </div>
      </div>
    </div>
  );
};

