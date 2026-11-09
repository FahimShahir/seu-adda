import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Share2, Sparkles, Check, Music } from 'lucide-react';
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
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const moodLabels: Record<AddaMood, string> = {
    general: 'ক্যাম্পাস আড্ডা ✨',
    heartbreak: 'ছ্যাঁকা ও ক্রাশ 💔',
    exams: 'পরীক্ষা ও রিটেক 📚',
    canteen: 'ক্যান্টিন ও ট্যুর ☕'
  };

  useEffect(() => {
    if (!isOpen) return;
    setIsGenerating(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution card dimensions (800 x 1000)
    canvas.width = 800;
    canvas.height = 1000;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = isNight ? './images/campus-night.jpg' : './images/campus-day.jpg';

    img.onload = () => {
      // 1. Draw Campus Background Artwork
      ctx.drawImage(img, 0, 0, 800, 1000);

      // 2. Cinematic Gradient Overlay
      const grad = ctx.createLinearGradient(0, 0, 0, 1000);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
      grad.addColorStop(0.25, 'rgba(15, 23, 42, 0.35)');
      grad.addColorStop(0.65, 'rgba(15, 23, 42, 0.75)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1000);

      // Rain particles if raining
      if (isRain) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
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
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 760, 960);

      // 3. Header: Brand Logo & Title
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 34px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('☕ SEU Adda', 50, 75);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '20px "Hind Siliguri", sans-serif';
      ctx.fillText('সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা', 50, 105);

      // Live Dhaka Time & Mood Pill
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FEF3C7';
      ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
      ctx.fillText(`🕒 ${dhakaTime || 'ক্যাম্পাস সময়'} • ঢাকা`, 750, 75);

      ctx.fillStyle = '#F59E0B';
      ctx.font = '18px "Hind Siliguri", sans-serif';
      ctx.fillText(moodLabels[currentMood] || 'ক্যাম্পাস আড্ডা', 750, 105);

      // 4. Centerpiece: Quote / Dialogue Card
      const quoteSpeaker = activeQuote?.speaker || 'ক্যাম্পাস স্মৃতি';
      const quoteText = activeQuote?.text || 'ক্যাম্পাসের এই আড্ডার প্রতিটি মুহূর্ত, প্রতিটি গান আর প্রতি কাপ চা চিরকাল স্মৃতি হয়ে রবে।';

      // Translucent Quote Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 3;
      
      const qBoxY = 480;
      const qBoxH = 260;
      
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

      // Speaker Name
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText(`💬 ${quoteSpeaker}:`, 80, qBoxY + 50);

      // Quote Text (Wrapped)
      ctx.fillStyle = '#F1F5F9';
      ctx.font = '22px "Hind Siliguri", sans-serif';
      
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let curY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, curY);
            line = words[n] + ' ';
            curY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, curY);
      };

      wrapText(`"${quoteText}"`, 80, qBoxY + 95, 640, 36);

      // 5. Bottom: Music Player Track Badge
      const mBoxY = 770;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
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
      ctx.fillText(currentSongTitle.slice(0, 48), 135, mBoxY + 48);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '17px "Hind Siliguri", sans-serif';
      ctx.fillText(`🎙️ ${currentAuthor.slice(0, 40)} • SEU Campus Radio`, 135, mBoxY + 80);

      // 6. Watermark Footer
      ctx.fillStyle = '#64748B';
      ctx.font = '16px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📍 Southeast University Campus Ground • seu-adda.github.io', 400, 940);

      // Export as PNG
      try {
        const url = canvas.toDataURL('image/png');
        setDownloadUrl(url);
      } catch (err) {}
      setIsGenerating(false);
    };
  }, [isOpen, isNight, isRain, currentMood, currentSongTitle, currentAuthor, dhakaTime, activeQuote]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'seu-campus-memory.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'SEU Adda — ক্যাম্পাস স্মৃতি',
            text: 'সাউথইস্ট বিশ্ববিদ্যালয় ক্যাম্পাস চত্বরে আড্ডাখানা ☕🎸',
            files: [file]
          });
        } else {
          // Copy image link or trigger download
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'seu-campus-memory.png';
          a.click();
        }
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

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
      // fallback download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'seu-campus-memory.png';
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg">
            <Sparkles size={18} />
            <span>ক্যাম্পাস ফটো কার্ড জেনারেটর 📸</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Canvas Preview Container */}
        <div className="flex-1 min-h-0 flex items-center justify-center bg-slate-950/80 rounded-2xl p-2 border border-white/10 overflow-hidden relative">
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 z-10 text-amber-400 text-xs gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              কার্ড তৈরি হচ্ছে...
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="w-auto h-auto max-h-[52vh] sm:max-h-[58vh] max-w-full rounded-xl shadow-2xl border border-amber-500/20"
          />
        </div>

        {/* Actions Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 transition active:scale-95"
            title="ছবি কপি করুন"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Sparkles size={14} className="text-amber-400" />}
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
