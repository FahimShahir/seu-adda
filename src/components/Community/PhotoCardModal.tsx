import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  X,
  Download,
  Share2,
  Sparkles,
  Check,
  MessageSquare,
  User,
  RefreshCw,
  Copy,
  Flame,
  Users,
  CheckSquare,
  Square,
  Plus,
  Trash2
} from 'lucide-react';
import { AddaMood } from '../../data/dialogues';
import { ChatMessage, RoomParticipant, CAMPUS_CHARACTERS } from '../../types/room';

export interface GroupCardDialogue {
  id: string;
  speaker: string;
  dept?: string;
  emoji?: string;
  text: string;
}

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
  roomTitle?: string;
  roomMessages?: ChatMessage[];
  roomParticipants?: RoomParticipant[];
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

const DEFAULT_GROUP_DIALOGUES: GroupCardDialogue[] = [
  {
    id: 'g1',
    speaker: 'তানভীর',
    dept: 'Textile',
    emoji: '🎸',
    text: 'সবাই একসাথে ধরবি— "যদি তোর ডাক শুনে কেউ না আসে তবে একলা চল রে!"'
  },
  {
    id: 'g2',
    speaker: 'নিশাত',
    dept: 'Pharmacy',
    emoji: '🥻',
    text: 'মামা গান থামাইস না! আগে ক্যান্টিন থেকে গরম লাল চা নিয়ে আয়!'
  },
  {
    id: 'g3',
    speaker: 'শাকিল',
    dept: 'CSE',
    emoji: '☕',
    text: 'এক কাপ চা পাঁচজনে শেয়ার করার নামই তো সাউথইস্ট ক্যাম্পাস আড্ডা!'
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
  activeQuote,
  roomTitle,
  roomMessages = [],
  roomParticipants = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cachedImgRef = useRef<HTMLImageElement | null>(null);

  // Card Mode: 'single' (একক ডায়লগ) | 'group' (গ্রুপ আড্ডা)
  const [cardMode, setCardMode] = useState<'single' | 'group'>('single');

  // Single Mode State
  const [customSpeaker, setCustomSpeaker] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  // Group Mode State
  const [groupName, setGroupName] = useState<string>('সাউথইস্ট ক্যাম্পাস আড্ডা');
  const [groupDialogues, setGroupDialogues] = useState<GroupCardDialogue[]>(DEFAULT_GROUP_DIALOGUES);

  // Export State
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const moodLabels: Record<AddaMood, string> = {
    general: 'ক্যাম্পাস আড্ডা ✨',
    heartbreak: 'ছ্যাঁকা ও ক্রাশ 💔',
    exams: 'পরীক্ষা ও রিটেক 📚',
    canteen: 'ক্যান্টিন ও ট্যুর ☕'
  };

  // Helper to extract character emoji
  const getCharEmoji = (characterId?: string): string => {
    if (!characterId) return '💬';
    const char = CAMPUS_CHARACTERS.find((c) => c.id === characterId);
    return char ? char.emoji : '💬';
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

      if (roomTitle) {
        setGroupName(roomTitle);
      }

      // If roomMessages exist, convert latest 2-3 user messages into group dialogues
      const nonSystemMsgs = roomMessages.filter((m) => !m.isSystem && m.text.trim());
      if (nonSystemMsgs.length > 0) {
        const initialGroup: GroupCardDialogue[] = nonSystemMsgs.slice(-3).map((m) => ({
          id: m.id,
          speaker: m.senderName,
          dept: m.senderDept,
          emoji: getCharEmoji(m.characterId),
          text: m.text
        }));
        setGroupDialogues(initialGroup);
      } else {
        setGroupDialogues(DEFAULT_GROUP_DIALOGUES);
      }
    }
  }, [isOpen, activeQuote, roomTitle, roomMessages]);

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

  // Main Canvas Render Function (Supports Both Single & Group Photo Cards)
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
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.90)');
    grad.addColorStop(0.22, 'rgba(15, 23, 42, 0.40)');
    grad.addColorStop(0.62, 'rgba(15, 23, 42, 0.80)');
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

    // 4. Centerpiece Render: SINGLE or GROUP MODE
    if (cardMode === 'single') {
      // ----------------------------------------------------
      // SINGLE QUOTE MODE
      // ----------------------------------------------------
      const speakerText = customSpeaker.trim() || 'ক্যাম্পাস আড্ডাবাজ';
      const mainMessage =
        customText.trim() ||
        'ক্যাম্পাসের এই আড্ডার প্রতিটি মুহূর্ত, প্রতিটি গান আর প্রতি কাপ চা চিরকাল স্মৃতি হয়ে রবে।';

      const qBoxY = 470;
      const qBoxH = 275;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
      ctx.lineWidth = 3;

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
      wrapText(`"${mainMessage}"`, 80, qBoxY + 105, 640, lineHeight);

    } else {
      // ----------------------------------------------------
      // GROUP PHOTO CARD MODE
      // ----------------------------------------------------
      const finalGroupName = groupName.trim() || 'সাউথইস্ট ক্যাম্পাস আড্ডা';

      // Group Name Top Banner
      const bY = 135;
      const bH = 55;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.roundRect(50, bY, 700, bH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText(`👥 ${finalGroupName.slice(0, 36)}`, 400, bY + 36);

      // Render Stacked Group Dialogues (2 to 4 dialogues)
      const dialoguesToDraw = groupDialogues.slice(0, 4);
      const count = Math.max(1, dialoguesToDraw.length);

      // Total available vertical space from Y: 205 to Y: 755 (550px)
      let cardHeight = 115;
      let gap = 16;
      let startY = 215;

      if (count === 1) {
        cardHeight = 220;
        startY = 300;
      } else if (count === 2) {
        cardHeight = 150;
        gap = 22;
        startY = 240;
      } else if (count === 3) {
        cardHeight = 115;
        gap = 16;
        startY = 215;
      } else if (count === 4) {
        cardHeight = 92;
        gap = 12;
        startY = 205;
      }

      ctx.textAlign = 'left';

      dialoguesToDraw.forEach((dlg, idx) => {
        const curY = startY + idx * (cardHeight + gap);

        // Dialogue Box
        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(245, 158, 11, 0.65)' : 'rgba(52, 211, 153, 0.65)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(50, curY, 700, cardHeight, 16);
        ctx.fill();
        ctx.stroke();

        // Speaker Header (Emoji + Name + Dept)
        ctx.fillStyle = idx % 2 === 0 ? '#FBBF24' : '#34D399';
        ctx.font = 'bold 19px "Hind Siliguri", sans-serif';
        const speakerHeader = `${dlg.emoji || '💬'} ${dlg.speaker}${dlg.dept ? ` [${dlg.dept}]` : ''}:`;
        ctx.fillText(speakerHeader, 72, curY + 28);

        // Dialogue Quote Text
        ctx.fillStyle = '#F8FAFC';
        ctx.font = count === 4 ? '15px "Hind Siliguri", sans-serif' : '17px "Hind Siliguri", sans-serif';
        const textY = curY + 54;
        wrapText(`"${dlg.text}"`, 72, textY, 650, count === 4 ? 22 : 26);
      });
    }

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

    ctx.textAlign = 'left';
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
    cardMode,
    isNight,
    isRain,
    currentMood,
    currentSongTitle,
    currentAuthor,
    dhakaTime,
    customSpeaker,
    customText,
    groupName,
    groupDialogues
  ]);

  // Re-render whenever inputs or conditions change
  useEffect(() => {
    if (!isOpen) return;
    renderCanvas();
  }, [isOpen, renderCanvas]);

  if (!isOpen) return null;

  // Single Mode Preset Selection Handler
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

  // Group Mode: Toggle a room message into selection
  const handleToggleRoomMessage = (msg: ChatMessage) => {
    setGroupDialogues((prev) => {
      const exists = prev.some((d) => d.id === msg.id);
      if (exists) {
        if (prev.length <= 1) return prev; // Keep at least 1
        return prev.filter((d) => d.id !== msg.id);
      }
      if (prev.length >= 4) {
        // Replace oldest or shift
        return [...prev.slice(1), {
          id: msg.id,
          speaker: msg.senderName,
          dept: msg.senderDept,
          emoji: getCharEmoji(msg.characterId),
          text: msg.text
        }];
      }
      return [
        ...prev,
        {
          id: msg.id,
          speaker: msg.senderName,
          dept: msg.senderDept,
          emoji: getCharEmoji(msg.characterId),
          text: msg.text
        }
      ];
    });
  };

  // Remove a dialogue from group list
  const handleRemoveGroupDialogue = (id: string) => {
    setGroupDialogues((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((d) => d.id !== id);
    });
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
            title: `SEU Adda — ${cardMode === 'group' ? groupName : 'ক্যাম্পাস স্মৃতি'}`,
            text: cardMode === 'group'
              ? `"${groupName}" — সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা ☕🎸`
              : `"${customText}" — ${customSpeaker} (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা ☕🎸)`,
            files: [file]
          });
        } else {
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

  const eligibleRoomMessages = roomMessages.filter((m) => !m.isSystem && m.text.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[94vh] flex flex-col no-scrollbar overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
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

        {/* Mode Switcher Toggle: Single Quote vs Group Photo Card */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/5 mb-3.5">
          <button
            type="button"
            onClick={() => setCardMode('single')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
              cardMode === 'single'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={14} />
            <span>👤 একক ডায়লগ কার্ড</span>
          </button>
          <button
            type="button"
            onClick={() => setCardMode('group')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
              cardMode === 'group'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={14} />
            <span>👥 গ্রুপ আড্ডা কার্ড</span>
            {eligibleRoomMessages.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/40 text-slate-950 font-black">
                {eligibleRoomMessages.length}
              </span>
            )}
          </button>
        </div>

        {/* Responsive Content Grid: Desktop 2 Columns / Mobile Stacked */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* LEFT COLUMN: Controls & Message Selection */}
          <div className="order-2 md:order-1 md:col-span-6 flex flex-col gap-4">
            
            {/* VIEW A: SINGLE QUOTE EDITOR */}
            {cardMode === 'single' && (
              <>
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
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
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
              </>
            )}

            {/* VIEW B: GROUP PHOTO CARD EDITOR */}
            {cardMode === 'group' && (
              <>
                {/* Group Name Input */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Users size={13} />
                      গ্রুপের নাম / আড্ডার নাম
                    </span>
                    <span className="text-[10px] text-slate-400">কার্ডের শীর্ষে দেখাবে</span>
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    maxLength={36}
                    placeholder="যেমন: সিএসই রাতের আড্ডা ☕🎸, ক্যাম্পাস ফ্রেন্ডস..."
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition font-semibold"
                  />
                </div>

                {/* Selected Dialogues Checklist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>কার্ডে প্রদর্শিত ডায়লগসমূহ ({groupDialogues.length}/৪টি):</span>
                    <span className="text-[10px] text-slate-400">সর্বোচ্চ ৪টি ডায়লগ</span>
                  </div>

                  <div className="space-y-1.5">
                    {groupDialogues.map((dlg, idx) => (
                      <div
                        key={dlg.id || idx}
                        className="flex items-start gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                      >
                        <span className="text-sm shrink-0">{dlg.emoji || '💬'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-amber-300 text-[11px] truncate">
                            {dlg.speaker} {dlg.dept && `[${dlg.dept}]`}
                          </div>
                          <div className="text-slate-200 text-xs truncate">"{dlg.text}"</div>
                        </div>
                        {groupDialogues.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGroupDialogue(dlg.id)}
                            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Messages Selection Picker */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>
                      {eligibleRoomMessages.length > 0
                        ? 'রুমের মেসেজ থেকে নির্বাচন করুন (ক্লিক করুন):'
                        : 'প্রি-মেড আড্ডা সংলাপ টেমপ্লেট:'}
                    </span>
                  </div>

                  {eligibleRoomMessages.length > 0 ? (
                    <div className="max-h-[160px] overflow-y-auto no-scrollbar space-y-1.5 p-1 bg-slate-950/40 rounded-2xl border border-slate-800">
                      {eligibleRoomMessages.map((msg) => {
                        const isChecked = groupDialogues.some((d) => d.id === msg.id);
                        return (
                          <button
                            key={msg.id}
                            type="button"
                            onClick={() => handleToggleRoomMessage(msg)}
                            className={`w-full flex items-start gap-2 p-2 rounded-xl text-left border transition text-xs ${
                              isChecked
                                ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="pt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare size={14} className="text-amber-400" />
                              ) : (
                                <Square size={14} className="text-slate-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 font-bold text-[11px] truncate">
                                <span>{msg.senderName}</span>
                                {msg.senderDept && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                                    {msg.senderDept}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-200 line-clamp-1">"{msg.text}"</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs">
                      💡 বর্তমানে কোনো লাইভ রুম চ্যাট পাওয়া যায়নি। ডিফল্ট হিসেবে গিটারিস্ট তানভীর, নিশাত ও শাকিলের আড্ডা সংলাপ গ্রুপ কার্ডে সাজানো হয়েছে!
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* RIGHT COLUMN: HD Canvas Live Preview & Action Buttons */}
          <div className="order-1 md:order-2 md:col-span-6 flex flex-col items-center gap-3">
            
            {/* Live Render Canvas */}
            <div className="w-full max-w-[320px] xs:max-w-[350px] sm:max-w-[370px] aspect-[4/5] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/50 relative flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-amber-400 text-xs font-semibold gap-2">
                  <Sparkles size={16} className="animate-spin" />
                  <span>কার্ড তৈরি হচ্ছে...</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Download & Share */}
            <div className="w-full max-w-[370px] grid grid-cols-2 gap-2">
              <a
                href={downloadUrl}
                download={cardMode === 'group' ? 'seu-group-photo-card.png' : 'seu-campus-memory.png'}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95"
              >
                <Download size={15} />
                <span>ডাউনলোড (HD)</span>
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs sm:text-sm transition active:scale-95"
              >
                <Share2 size={15} />
                <span>শেয়ার করুন</span>
              </button>
            </div>

            {/* Copy Image to Clipboard Shortcut */}
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition py-1"
            >
              {isCopied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">ক্লিপবোর্ডে কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>ছবি ক্লিপবোর্ডে কপি করুন</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
