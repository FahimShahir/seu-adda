import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Download, Share2, Sparkles, Check, MessageSquare, User, RefreshCw, Copy, Flame } from 'lucide-react';
import { AddaMood } from '../../data/dialogues';

interface PhotoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNight: boolean;
  isRain: boolean;
  currentMood: AddaMood;
  currentSongTitle: string;
  currentAuthor: string;
  dhakaTime: string;
  activeQuote?: { speaker: string; text: string };
}

interface PresetTemplate {
  label: string;
  icon: string;
  speaker: string;
  text: string;
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    label: 'চায়ের আড্ডা',
    icon: '☕',
    speaker: 'ক্যান্টিনের মামা',
    text: 'এক কাপ গরম লাল চা আর গরম সিঙ্গাড়ায় জমে উঠুক সাউথইস্টের সোনালী ক্যাম্পাস আড্ডা!'
  },
  {
    label: 'ক্রাশ ও ছ্যাঁকা',
    icon: '💔',
    speaker: 'চিরকুমার প্রেমিক',
    text: 'যারে ভালোবেসে গিটার বাজানো শিখলাম, সে অন্য ডিপার্টমেন্টের বাইকার ভাইয়ের সাথে চলে গেল!'
  },
  {
    label: 'ফাইনাল পরীক্ষা',
    icon: '📚',
    speaker: 'ব্যাকবেঞ্চার গ্যাং',
    text: 'কালকে সকাল ৯টায় সেমিস্টার ফাইনাল পরীক্ষা, আর আমি এখন ইউটিউবে গান শুনে মুড বানাচ্ছি!'
  },
  {
    label: 'সাজেক ট্যুর',
    icon: '🏖️',
    speaker: 'ট্যুর প্ল্যানার বন্ধু',
    text: 'সেমিস্টার শেষ হইলেই কিন্তু সাজেক ট্যুর! কেউ যেন লাস্টে টাকা নাই বইলা ব্যাকআউট না করিস!'
  },
  {
    label: 'সিএসই লাইফ',
    icon: '💻',
    speaker: 'কোডিং পাগল',
    text: 'কোডে বাগ আর জীবনে রিটেক— এটাই তো আমাদের সিএসই জীবনের নিত্যদিনের সমীকরণ!'
  },
  {
    label: 'অ্যাসাইনমেন্ট',
    icon: '📑',
    speaker: 'দায়িত্বশীল সিআর',
    text: 'অ্যাসাইনমেন্ট সাবমিশনের ডেডলাইন আজ রাত ১১:৫৯! পরে কিন্তু স্যাররে দোষ দিয়ো না!'
  }
];

export const PhotoCardModal: React.FC<PhotoCardModalProps> = ({
  isOpen,
  onClose,
  isNight,
  isRain,
  currentMood,
  currentSongTitle,
  currentAuthor,
  dhakaTime,
  activeQuote
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cachedImgRef = useRef<HTMLImageElement | null>(null);

  // Editable Message & Speaker State
  const [customSpeaker, setCustomSpeaker] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  const moodLabels: Record<AddaMood, string> = {
    general: 'ক্যাম্পাস আড্ডা ✨',
    heartbreak: 'ছ্যাঁকা ও ক্রাশ 💔',
    exams: 'পরীক্ষা ও রিটেক 📚',
    canteen: 'ক্যান্টিন ও ট্যুর ☕'
  };

  // Initialize or reset text when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialSpeaker = activeQuote?.speaker || 'ক্যাম্পাস আড্ডাবাজ';
      const initialText =
        activeQuote?.text ||
        'ক্যাম্পাসের এই আড্ডার প্রতিটি মুহূর্ত, প্রতিটি গান আর প্রতি কাপ চা চিরকাল স্মৃতি হয়ে রবে।';
      setCustomSpeaker(initialSpeaker);
      setCustomText(initialText);
      setSelectedPresetIndex(null);
    }
  }, [isOpen, activeQuote]);

  // Preload & Cache Background Image
  useEffect(() => {
    if (!isOpen) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = isNight ? './images/campus-night.jpg' : './images/campus-day.jpg';

    img.onload = () => {
      cachedImgRef.current = img;
      renderCanvas();
    };
  }, [isOpen, isNight]);

  // Main Canvas Render Function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution card dimensions (800 x 1000)
    canvas.width = 800;
    canvas.height = 1000;

    const img = cachedImgRef.current;

    // 1. Draw Campus Background Artwork
    if (img && img.complete) {
      ctx.drawImage(img, 0, 0, 800, 1000);
    } else {
      ctx.fillStyle = isNight ? '#090d16' : '#1e293b';
      ctx.fillRect(0, 0, 800, 1000);
    }

    // 2. Cinematic Gradient Overlay
    const grad = ctx.createLinearGradient(0, 0, 0, 1000);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.88)');
    grad.addColorStop(0.22, 'rgba(15, 23, 42, 0.38)');
    grad.addColorStop(0.62, 'rgba(15, 23, 42, 0.78)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1000);

    // Rain particles if raining
    if (isRain) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 90; i++) {
        const rx = Math.random() * 800;
        const ry = Math.random() * 1000;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 8, ry + 22);
        ctx.stroke();
      }
    }

    // Outer Card Gold Accent Border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 760, 960);

    // Inner subtle thin border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, 744, 944);

    // 3. Header: Brand Logo & Title
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 34px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('☕ SEU Adda', 50, 75);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '20px "Hind Siliguri", sans-serif';
    ctx.fillText('সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা', 50, 106);

    // Live Dhaka Time & Mood Pill
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
    ctx.fillText(`🕒 ${dhakaTime || 'ক্যাম্পাস সময়'} • ঢাকা`, 750, 75);

    ctx.fillStyle = '#F59E0B';
    ctx.font = '18px "Hind Siliguri", sans-serif';
    ctx.fillText(moodLabels[currentMood] || 'ক্যাম্পাস আড্ডা', 750, 106);

    // 4. Centerpiece: Editable Quote / Dialogue Card
    const speakerText = customSpeaker.trim() || 'ক্যাম্পাস আড্ডাবাজ';
    const mainMessage =
      customText.trim() ||
      'ক্যাম্পাসের এই আড্ডার প্রতিটি মুহূর্ত, প্রতিটি গান আর প্রতি কাপ চা চিরকাল স্মৃতি হয়ে রবে।';

    // Translucent Quote Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
    ctx.lineWidth = 3;

    const qBoxY = 470;
    const qBoxH = 275;

    // Rounded rectangle helper
    const r = 24;
    ctx.beginPath();
    ctx.moveTo(50 + r, qBoxY);
    ctx.lineTo(750 - r, qBoxY);
    ctx.quadraticCurveTo(750, qBoxY, 750, qBoxY + r);
    ctx.lineTo(750, qBoxY + qBoxH - r);
    ctx.quadraticCurveTo(750, qBoxY + qBoxH, 750 - r, qBoxY + qBoxH);
    ctx.lineTo(50 + r, qBoxY + qBoxH);
    ctx.quadraticCurveTo(50, qBoxY + qBoxH, 50, qBoxY + qBoxH - r);
    ctx.lineTo(50, qBoxY + r);
    ctx.quadraticCurveTo(50, qBoxY, 50 + r, qBoxY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Speaker Name Header Badge
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillText(`💬 ${speakerText}:`, 80, qBoxY + 50);

    // Speaker decorative underline
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, qBoxY + 62);
    ctx.lineTo(350, qBoxY + 62);
    ctx.stroke();

    // Adaptive Font Size Based on Text Length
    const textLength = mainMessage.length;
    let fontSize = 23;
    let lineHeight = 36;
    if (textLength > 120) {
      fontSize = 19;
      lineHeight = 30;
    } else if (textLength > 75) {
      fontSize = 21;
      lineHeight = 33;
    }

    ctx.fillStyle = '#F8FAFC';
    ctx.font = `${fontSize}px "Hind Siliguri", sans-serif`;

    const wrapText = (text: string, x: number, y: number, maxWidth: number, lHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, curY);
          line = words[n] + ' ';
          curY += lHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, curY);
    };

    wrapText(`"${mainMessage}"`, 80, qBoxY + 105, 640, lineHeight);

    // 5. Bottom: Music Player Track Badge
    const mBoxY = 770;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.92)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(50, mBoxY, 700, 110, 20);
    ctx.fill();
    ctx.stroke();

    // Equalizer bars representation
    ctx.fillStyle = '#F59E0B';
    const eqX = 80;
    const eqY = mBoxY + 70;
    ctx.fillRect(eqX, eqY - 25, 6, 25);
    ctx.fillRect(eqX + 10, eqY - 40, 6, 40);
    ctx.fillRect(eqX + 20, eqY - 30, 6, 30);
    ctx.fillRect(eqX + 30, eqY - 48, 6, 48);

    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
    ctx.fillText((currentSongTitle || 'ক্যাম্পাস গান').slice(0, 46), 135, mBoxY + 48);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '17px "Hind Siliguri", sans-serif';
    ctx.fillText(
      `🎙️ ${(currentAuthor || 'SEU Adda').slice(0, 38)} • SEU Campus Radio`,
      135,
      mBoxY + 80
    );

    // 6. Watermark Footer
    ctx.fillStyle = '#64748B';
    ctx.font = '16px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📍 Southeast University Campus Ground • seu-adda.github.io', 400, 940);

    // Generate PNG Data URL for download
    try {
      const url = canvas.toDataURL('image/png');
      setDownloadUrl(url);
    } catch (err) {
      console.warn('Canvas export failed:', err);
    }
    setIsGenerating(false);
  }, [
    isNight,
    isRain,
    currentMood,
    currentSongTitle,
    currentAuthor,
    dhakaTime,
    customSpeaker,
    customText
  ]);

  // Re-render whenever custom inputs or conditions change
  useEffect(() => {
    if (!isOpen) return;
    renderCanvas();
  }, [isOpen, renderCanvas]);

  if (!isOpen) return null;

  // Preset Selection Handler
  const handleSelectPreset = (preset: PresetTemplate, index: number) => {
    setSelectedPresetIndex(index);
    setCustomSpeaker(preset.speaker);
    setCustomText(preset.text);
  };

  // Reset to default
  const handleResetToDefault = () => {
    setSelectedPresetIndex(null);
    setCustomSpeaker(activeQuote?.speaker || 'ক্যাম্পাস আড্ডাবাজ');
    setCustomText(
      activeQuote?.text ||
        'ক্যাম্পাসের এই আড্ডার প্রতিটি মুহূর্ত, প্রতিটি গান আর প্রতি কাপ চা চিরকাল স্মৃতি হয়ে রবে।'
    );
  };

  // Native Share Handler
  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'seu-campus-memory.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'SEU Adda — ক্যাম্পাস স্মৃতি',
            text: `"${customText}" — ${customSpeaker} (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা ☕🎸)`,
            files: [file]
          });
        } else {
          // Fallback download if share API unavailable
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'seu-campus-memory.png';
          a.click();
        }
      });
    } catch (e) {
      console.warn('Share error:', e);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'seu-campus-memory.png';
      a.click();
    }
  };

  // Clipboard Copy Handler
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
    } catch (e) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'seu-campus-memory.png';
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[94vh] flex flex-col no-scrollbar overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg">
            <Sparkles size={18} />
            <span>ক্যাম্পাস ফটো কার্ড ও স্টোরি জেনারেটর 📸</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
            aria-label="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Responsive Content Grid: Desktop 2 Columns / Mobile Stacked */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* LEFT COLUMN: Interactive Editor & Preset Controls */}
          <div className="order-2 md:order-1 md:col-span-6 flex flex-col gap-4">
            
            {/* Speaker Input */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <User size={13} />
                  বক্তার নাম / পরিচয়
                </span>
                <span className="text-[10px] text-slate-400 font-normal">কার্ডে প্রদর্শন হবে</span>
              </label>
              <input
                type="text"
                value={customSpeaker}
                onChange={(e) => setCustomSpeaker(e.target.value)}
                maxLength={40}
                placeholder="যেমন: মাহিন - CSE, ক্যান্টিনের মামা, ক্রাশ..."
                className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                <label className="flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  ক্যাম্পাস ডায়লগ / মনের কথা
                </label>
                <span className="text-[10px] text-slate-400">
                  {customText.length}/180
                </span>
              </div>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={180}
                rows={3}
                placeholder="এখানে আপনার মনের কথা, ক্যাম্পাসের স্মৃতি বা বন্ধুদের নিয়ে ডায়লগ লিখুন..."
                className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition leading-relaxed"
              />
            </div>

            {/* Quick Relatable Campus Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Flame size={13} className="text-amber-500" />
                  জনপ্রিয় ক্যাম্পাস টেমপ্লেট
                </span>
                <button
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition"
                  title="ডিফল্ট বার্তায় ফেরত যান"
                >
                  <RefreshCw size={11} />
                  রিসেট
                </button>
              </div>

              {/* Grid of Preset Chips */}
              <div className="grid grid-cols-2 gap-2">
                {PRESET_TEMPLATES.map((preset, index) => {
                  const isSelected = selectedPresetIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectPreset(preset, index)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-left border transition active:scale-95 text-xs ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100'
                      }`}
                    >
                      <span className="text-sm shrink-0">{preset.icon}</span>
                      <span className="truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-white/5 flex items-center gap-1.5">
              <span>💡</span>
              <span>টাইপ করার সাথে সাথে ডানের কার্ডে সরাসরি লাইভ প্রিভিউ দেখতে পাবেন।</span>
            </p>
          </div>

          {/* RIGHT COLUMN: Live Canvas Preview Container */}
          <div className="order-1 md:order-2 md:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-center bg-slate-950/90 rounded-2xl p-2.5 border border-white/10 shadow-inner relative overflow-hidden">
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 z-10 text-amber-400 text-xs gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  কার্ড তৈরি হচ্ছে...
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="w-auto h-auto max-h-[36vh] sm:max-h-[46vh] md:max-h-[50vh] max-w-full rounded-xl shadow-2xl border border-amber-500/25"
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5 text-center">
              ৮০০x১০০০ পিক্সেল • ইনস্টাগ্রাম ও ফেসবুক স্টোরি ফ্রেন্ডলি সাইজ
            </div>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 transition active:scale-95"
            title="ছবি কপি করুন"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-amber-400" />}
            <span>{isCopied ? 'কপি হয়েছে!' : 'ক্লিপবোর্ডে কপি'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 transition active:scale-95"
            >
              <Share2 size={14} className="text-blue-400" />
              <span>শেয়ার</span>
            </button>

            <a
              href={downloadUrl}
              download="seu-campus-memory.png"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              <Download size={14} />
              <span>ডাউনলোড (PNG)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
