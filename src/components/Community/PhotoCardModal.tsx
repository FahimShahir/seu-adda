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
  Trash2,
  ChevronDown,
  Sun,
  Moon,
  CloudRain
} from 'lucide-react';
import { AddaMood } from '../../data/dialogues';
import { ChatMessage, RoomParticipant, CAMPUS_CHARACTERS, CampusCharacter, CampusZone } from '../../types/room';

export interface GroupCardDialogue {
  id: string;
  speaker: string;          // User-customizable speaker name (e.g. "মাহিন", "তানভীর")
  dept?: string;            // User-customizable department (e.g. "CSE", "BBA")
  characterId: string;      // ID of character from CAMPUS_CHARACTERS
  text: string;             // Dialogue quote text
  placement?: 'auto' | 'top' | 'left' | 'right' | 'bottom'; // Custom bubble placement
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

// Default group dialogues placed across different distinct characters
const DEFAULT_GROUP_DIALOGUES: GroupCardDialogue[] = [
  {
    id: 'g1',
    speaker: 'তানভীর',
    dept: 'Textile',
    characterId: 'guitarist',
    text: 'সবাই একসাথে ধরবি— "যদি তোর ডাক শুনে কেউ না আসে তবে একলা চল রে!"',
    placement: 'auto'
  },
  {
    id: 'g2',
    speaker: 'মেহজাবিন',
    dept: 'BBA',
    characterId: 'mid_stairs_girl_1',
    text: 'জেরিন দেখ, আমরা দুজন এখন সিঁড়িতে বসে আড্ডা দিচ্ছি! 💜✨',
    placement: 'auto'
  },
  {
    id: 'g3',
    speaker: 'সাজিদ',
    dept: 'CSE',
    characterId: 'standing_boy_1',
    text: 'দোস্ত, পরীক্ষার কি অবস্থা? গিটার বাজানো থামাইয়া একটু পড়ি চল!',
    placement: 'auto'
  }
];

// Color themes for speech bubbles
const BUBBLE_THEMES = [
  { border: 'rgba(245, 158, 11, 0.95)', header: '#FBBF24', pulse: '#F59E0B' }, // Amber
  { border: 'rgba(52, 211, 153, 0.95)', header: '#34D399', pulse: '#10B981' }, // Emerald
  { border: 'rgba(56, 189, 248, 0.95)', header: '#38BDF8', pulse: '#0EA5E9' }, // Sky
  { border: 'rgba(244, 114, 182, 0.95)', header: '#F472B6', pulse: '#EC4899' }, // Pink
  { border: 'rgba(167, 139, 250, 0.95)', header: '#A78BFA', pulse: '#8B5CF6' }  // Purple
];

interface CalculatedBubble {
  id: string;
  dlg: GroupCardDialogue;
  char: CampusCharacter;
  theme: typeof BUBBLE_THEMES[0];
  w: number;
  h: number;
  x: number;
  y: number;
  headX: number;
  headY: number;
  lines: string[];
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
  activeQuote,
  roomTitle,
  roomMessages = [],
  roomParticipants = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dayImgRef = useRef<HTMLImageElement | null>(null);
  const nightImgRef = useRef<HTMLImageElement | null>(null);

  // Card Mode: 'single' (একক ডায়লগ কার্ড) | 'group' (ক্যাম্পাস সিন গ্রুপ আড্ডা কার্ড)
  const [cardMode, setCardMode] = useState<'single' | 'group'>('group');

  // Scene customization for the card
  const [cardNight, setCardNight] = useState<boolean>(isNight);
  const [cardRain, setCardRain] = useState<boolean>(isRain);

  // Single Mode State
  const [customSpeaker, setCustomSpeaker] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  // Group Mode State (Scene speech bubbles over characters)
  const [groupName, setGroupName] = useState<string>('সাউথইস্ট ক্যাম্পাস আড্ডা');
  const [groupDialogues, setGroupDialogues] = useState<GroupCardDialogue[]>(DEFAULT_GROUP_DIALOGUES);
  const [activePickerDlgId, setActivePickerDlgId] = useState<string | null>(null);
  const [characterFilterZone, setCharacterFilterZone] = useState<CampusZone | 'all'>('all');

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

  // Helper to extract character object
  const getCharObj = (characterId?: string): CampusCharacter => {
    return (
      CAMPUS_CHARACTERS.find((c) => c.id === characterId) ||
      CAMPUS_CHARACTERS[0]
    );
  };

  // Initialize or reset text when modal opens
  useEffect(() => {
    if (isOpen) {
      setCardNight(isNight);
      setCardRain(isRain);

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
          dept: m.senderDept || 'CSE',
          characterId: m.characterId || 'guitarist',
          text: m.text,
          placement: 'auto'
        }));
        setGroupDialogues(initialGroup);
      } else {
        setGroupDialogues(DEFAULT_GROUP_DIALOGUES);
      }
    }
  }, [isOpen, activeQuote, roomTitle, roomMessages, isNight, isRain]);

  // Preload & Cache Both Day & Night Background Images
  useEffect(() => {
    if (!isOpen) return;

    let dayLoaded = false;
    let nightLoaded = false;

    const imgDay = new Image();
    imgDay.crossOrigin = 'anonymous';
    imgDay.src = './images/campus-day.jpg';
    imgDay.onload = () => {
      dayImgRef.current = imgDay;
      dayLoaded = true;
      if (dayLoaded && nightLoaded) renderCanvas();
    };

    const imgNight = new Image();
    imgNight.crossOrigin = 'anonymous';
    imgNight.src = './images/campus-night.jpg';
    imgNight.onload = () => {
      nightImgRef.current = imgNight;
      nightLoaded = true;
      if (dayLoaded && nightLoaded) renderCanvas();
    };

    renderCanvas();
  }, [isOpen]);

  // Main Canvas Render Function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution card dimensions (1000 x 1500, exact 2:3 native portrait ratio)
    canvas.width = 1000;
    canvas.height = 1500;

    const bgImg = cardNight ? nightImgRef.current : dayImgRef.current;

    // 1. Draw Full Campus Background Artwork
    if (bgImg && bgImg.complete) {
      ctx.drawImage(bgImg, 0, 0, 1000, 1500);
    } else {
      ctx.fillStyle = cardNight ? '#090d16' : '#1e293b';
      ctx.fillRect(0, 0, 1000, 1500);
    }

    // Rain particles if raining
    if (cardRain) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 110; i++) {
        const rx = Math.random() * 1000;
        const ry = Math.random() * 1500;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 9, ry + 24);
        ctx.stroke();
      }
    }

    // 2. Subtle Top Header Gradient (Keeps characters and scene 100% visible)
    const topGrad = ctx.createLinearGradient(0, 0, 0, 190);
    topGrad.addColorStop(0, 'rgba(2, 6, 23, 0.94)');
    topGrad.addColorStop(0.65, 'rgba(2, 6, 23, 0.70)');
    topGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, 1000, 190);

    // 3. Subtle Bottom Footer Gradient (For music player & watermark)
    const botGrad = ctx.createLinearGradient(0, 1340, 0, 1500);
    botGrad.addColorStop(0, 'rgba(2, 6, 23, 0)');
    botGrad.addColorStop(0.35, 'rgba(2, 6, 23, 0.70)');
    botGrad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, 1340, 0, 160);

    // Outer Card Gold Accent Border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, 968, 1468);

    // Inner subtle thin border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, 948, 1448);

    // 4. Header: Brand Logo & Title
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('☕ SEU Adda', 50, 68);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '20px "Hind Siliguri", sans-serif';
    ctx.fillText('সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা', 50, 98);

    // Live Dhaka Time & Mood Pill
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
    ctx.fillText(`🕒 ${dhakaTime || 'ক্যাম্পাস সময়'} • ঢাকা`, 950, 68);

    ctx.fillStyle = '#F59E0B';
    ctx.font = '18px "Hind Siliguri", sans-serif';
    ctx.fillText(moodLabels[currentMood] || 'ক্যাম্পাস আড্ডা', 950, 98);

    // Helper to wrap text nicely inside a constrained width
    const getWrappedLines = (text: string, maxWidth: number, font: string): string[] => {
      ctx.font = font;
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine ? `${currentLine} ${words[n]}` : words[n];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[n];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    };

    // 5. CENTERPIECE RENDER
    if (cardMode === 'single') {
      // ----------------------------------------------------
      // SINGLE QUOTE MODE
      // ----------------------------------------------------
      const speakerText = customSpeaker.trim() || 'ক্যাম্পাস আড্ডাবাজ';
      const mainMessage =
        customText.trim() ||
        'ক্যাম্পাসের এই আড্ডার প্রতিটি মুহূর্ত, প্রতিটি গান আর প্রতি কাপ চা চিরকাল স্মৃতি হয়ে রবে।';

      const qBoxY = 660;
      const qBoxH = 360;

      ctx.fillStyle = 'rgba(10, 15, 30, 0.95)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.90)';
      ctx.lineWidth = 3.5;

      ctx.beginPath();
      ctx.roundRect(60, qBoxY, 880, qBoxH, 24);
      ctx.fill();
      ctx.stroke();

      // Speaker Name Header Badge
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
      ctx.fillText(`💬 ${speakerText}:`, 100, qBoxY + 62);

      // Decorative underline
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.40)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, qBoxY + 78);
      ctx.lineTo(440, qBoxY + 78);
      ctx.stroke();

      // Message Lines
      const lines = getWrappedLines(`"${mainMessage}"`, 780, '500 24px "Hind Siliguri", sans-serif');
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 24px "Hind Siliguri", sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.90)';
      ctx.shadowBlur = 4;
      lines.slice(0, 6).forEach((line, i) => {
        ctx.fillText(line, 100, qBoxY + 130 + i * 38);
      });
      ctx.shadowBlur = 0;

    } else {
      // ----------------------------------------------------
      // SCENE-BASED SPEECH BUBBLE GROUP PHOTO CARD!
      // (HIGH READABILITY & AUTOMATIC COLLISION RESOLUTION)
      // ----------------------------------------------------
      const finalGroupName = groupName.trim() || 'সাউথইস্ট ক্যাম্পাস আড্ডা';

      // Top Centered Group Banner Capsule
      const gCapsuleY = 115;
      const gCapsuleH = 50;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.96)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.90)';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.roundRect(140, gCapsuleY, 720, gCapsuleH, 25);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText(`👥 ${finalGroupName.slice(0, 36)}`, 500, gCapsuleY + 34);

      // Render Speech Bubbles on each character's actual position in the artwork!
      const dialoguesToDraw = groupDialogues.slice(0, 5);

      // Step 1: Calculate initial layouts with large, legible fonts
      const bodyFont = '500 22px "Hind Siliguri", sans-serif';
      const lineHeight = 32;

      const bubbleLayouts: CalculatedBubble[] = dialoguesToDraw.map((dlg, idx) => {
        const char = getCharObj(dlg.characterId);
        const theme = BUBBLE_THEMES[idx % BUBBLE_THEMES.length];

        const charPixelX = (char.x / 100) * 1000;
        const charPixelY = (char.y / 100) * 1500;

        const headOffset = char.zone === 'foreground' ? 56 : char.zone === 'midground' ? 42 : 30;
        const headX = charPixelX;
        const headY = charPixelY - headOffset;

        // Expanded bubble width for clear reading
        const bubbleW = char.zone === 'background' ? 330 : 360;
        const lines = getWrappedLines(`"${dlg.text}"`, bubbleW - 36, bodyFont);
        const activeLines = lines.slice(0, 4);
        const bubbleH = 52 + activeLines.length * lineHeight + 16;

        // Initial placement
        let bubbleX = charPixelX - bubbleW / 2;
        let bubbleY = headY - bubbleH - 22;

        const p = dlg.placement || 'auto';
        if (p === 'left') {
          bubbleX = charPixelX - bubbleW - 20;
          bubbleY = headY - bubbleH / 2;
        } else if (p === 'right') {
          bubbleX = charPixelX + 20;
          bubbleY = headY - bubbleH / 2;
        } else if (p === 'bottom') {
          bubbleY = headY + 30;
        }

        bubbleX = Math.max(25, Math.min(1000 - bubbleW - 25, bubbleX));
        bubbleY = Math.max(175, Math.min(1330 - bubbleH, bubbleY));

        return {
          id: dlg.id,
          dlg,
          char,
          theme,
          w: bubbleW,
          h: bubbleH,
          x: bubbleX,
          y: bubbleY,
          headX,
          headY,
          lines: activeLines
        };
      });

      // Step 2: Intelligent Iterative Collision Resolution (Separation Engine)
      for (let iter = 0; iter < 15; iter++) {
        let hasCollision = false;
        for (let i = 0; i < bubbleLayouts.length; i++) {
          for (let j = i + 1; j < bubbleLayouts.length; j++) {
            const b1 = bubbleLayouts[i];
            const b2 = bubbleLayouts[j];

            const overlapX = b1.x < b2.x + b2.w + 16 && b1.x + b1.w + 16 > b2.x;
            const overlapY = b1.y < b2.y + b2.h + 16 && b1.y + b1.h + 16 > b2.y;

            if (overlapX && overlapY) {
              hasCollision = true;
              if (b2.y >= b1.y) {
                b2.y = b1.y + b1.h + 18;
                if (b2.y + b2.h > 1340) {
                  b1.y = Math.max(175, b1.y - (b2.y + b2.h - 1340) - 18);
                  b2.y = b1.y + b1.h + 18;
                }
              } else {
                b2.y = b1.y - b2.h - 18;
                if (b2.y < 175) {
                  b1.y = Math.min(1340 - b1.h, b1.y + (175 - b2.y) + 18);
                  b2.y = b1.y - b2.h - 18;
                }
              }
              b2.y = Math.max(175, Math.min(1340 - b2.h, b2.y));
              b1.y = Math.max(175, Math.min(1340 - b1.h, b1.y));
            }
          }
        }
        if (!hasCollision) break;
      }

      // Step 3: Draw each non-overlapping bubble with dynamic pointer
      bubbleLayouts.forEach((b) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.90)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;

        ctx.fillStyle = 'rgba(10, 15, 30, 0.96)';
        ctx.strokeStyle = b.theme.border;
        ctx.lineWidth = 3;

        // Dynamic pointer calculation
        ctx.beginPath();
        if (b.y + b.h <= b.headY + 6) {
          // Bubble is above head -> pointer base on bottom edge
          const pBaseX = Math.max(b.x + 30, Math.min(b.x + b.w - 30, b.headX));
          const pBaseY = b.y + b.h;
          ctx.moveTo(pBaseX - 12, pBaseY);
          ctx.lineTo(b.headX, b.headY);
          ctx.lineTo(pBaseX + 12, pBaseY);
        } else if (b.y >= b.headY - 6) {
          // Bubble is below head -> pointer base on top edge
          const pBaseX = Math.max(b.x + 30, Math.min(b.x + b.w - 30, b.headX));
          const pBaseY = b.y;
          ctx.moveTo(pBaseX - 12, pBaseY);
          ctx.lineTo(b.headX, b.headY);
          ctx.lineTo(pBaseX + 12, pBaseY);
        } else if (b.x >= b.headX) {
          // Bubble is to the right -> pointer base on left edge
          const pBaseX = b.x;
          const pBaseY = Math.max(b.y + 24, Math.min(b.y + b.h - 24, b.headY));
          ctx.moveTo(pBaseX, pBaseY - 12);
          ctx.lineTo(b.headX, b.headY);
          ctx.lineTo(pBaseX, pBaseY + 12);
        } else {
          // Bubble is to the left -> pointer base on right edge
          const pBaseX = b.x + b.w;
          const pBaseY = Math.max(b.y + 24, Math.min(b.y + b.h - 24, b.headY));
          ctx.moveTo(pBaseX, pBaseY - 12);
          ctx.lineTo(b.headX, b.headY);
          ctx.lineTo(pBaseX, pBaseY + 12);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw Speech Bubble Container
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 18);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Draw Glowing Halo Dot on Character Head
        ctx.beginPath();
        ctx.arc(b.headX, b.headY, 6, 0, Math.PI * 2);
        ctx.fillStyle = b.theme.pulse;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Inside Bubble Header: Emoji + Speaker Name + Dept
        ctx.textAlign = 'left';
        ctx.fillStyle = b.theme.header;
        ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
        const speakerDisplayName = `${b.char.emoji} ${b.dlg.speaker}`;
        ctx.fillText(speakerDisplayName.slice(0, 20), b.x + 18, b.y + 34);

        if (b.dlg.dept) {
          ctx.textAlign = 'right';
          ctx.fillStyle = '#CBD5E1';
          ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
          ctx.fillText(`[${b.dlg.dept}]`, b.x + b.w - 18, b.y + 32);
        }

        // Header separator line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(b.x + 18, b.y + 45);
        ctx.lineTo(b.x + b.w - 18, b.y + 45);
        ctx.stroke();

        // Body Text lines (Pure white with subtle text shadow for maximum crispness)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = bodyFont;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 4;
        b.lines.forEach((line, lIdx) => {
          ctx.fillText(line, b.x + 18, b.y + 78 + lIdx * lineHeight);
        });
        ctx.shadowBlur = 0;
      });
    }

    // 6. Bottom: Music Player Track Badge
    const mBoxY = 1365;
    ctx.fillStyle = 'rgba(10, 15, 30, 0.96)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(60, mBoxY, 880, 75, 18);
    ctx.fill();
    ctx.stroke();

    // Equalizer bars representation
    ctx.fillStyle = '#F59E0B';
    const eqX = 85;
    const eqY = mBoxY + 50;
    ctx.fillRect(eqX, eqY - 20, 5, 20);
    ctx.fillRect(eqX + 8, eqY - 32, 5, 32);
    ctx.fillRect(eqX + 16, eqY - 24, 5, 24);
    ctx.fillRect(eqX + 24, eqY - 36, 5, 36);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
    ctx.fillText((currentSongTitle || 'ক্যাম্পাস পছন্দের গান').slice(0, 48), 130, mBoxY + 34);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '15px "Hind Siliguri", sans-serif';
    ctx.fillText(
      `🎙️ ${(currentAuthor || 'SEU Adda').slice(0, 35)} • সাউথইস্ট ক্যাম্পাস রেডিও`,
      130,
      mBoxY + 60
    );

    // 7. Watermark Footer
    ctx.fillStyle = '#94A3B8';
    ctx.font = '15px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📍 Southeast University Campus Ground • seu-adda.github.io', 500, 1475);

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
    cardNight,
    cardRain,
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

  // Group Mode: Update dialogue speaker name
  const handleUpdateSpeaker = (id: string, newSpeaker: string) => {
    setGroupDialogues((prev) =>
      prev.map((d) => (d.id === id ? { ...d, speaker: newSpeaker } : d))
    );
  };

  // Group Mode: Update dialogue dept
  const handleUpdateDept = (id: string, newDept: string) => {
    setGroupDialogues((prev) =>
      prev.map((d) => (d.id === id ? { ...d, dept: newDept } : d))
    );
  };

  // Group Mode: Update dialogue text
  const handleUpdateText = (id: string, newText: string) => {
    setGroupDialogues((prev) =>
      prev.map((d) => (d.id === id ? { ...d, text: newText } : d))
    );
  };

  // Group Mode: Update placement
  const handleUpdatePlacement = (id: string, placement: 'auto' | 'top' | 'left' | 'right' | 'bottom') => {
    setGroupDialogues((prev) =>
      prev.map((d) => (d.id === id ? { ...d, placement } : d))
    );
  };

  // Group Mode: Change which character is speaking this dialogue
  const handleAssignCharacter = (dialogueId: string, charId: string) => {
    const char = getCharObj(charId);
    setGroupDialogues((prev) =>
      prev.map((d) =>
        d.id === dialogueId
          ? {
              ...d,
              characterId: charId,
              speaker: d.speaker === 'ক্যাম্পাস বন্ধু' || !d.speaker ? char.name : d.speaker
            }
          : d
      )
    );
    setActivePickerDlgId(null);
  };

  // Group Mode: Add a new character bubble
  const handleAddDialogue = () => {
    if (groupDialogues.length >= 5) return;
    const assignedIds = groupDialogues.map((d) => d.characterId);
    const freeChar =
      CAMPUS_CHARACTERS.find((c) => !assignedIds.includes(c.id)) ||
      CAMPUS_CHARACTERS[groupDialogues.length % CAMPUS_CHARACTERS.length];

    const newDlg: GroupCardDialogue = {
      id: `dlg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      speaker: freeChar.name,
      dept: 'CSE',
      characterId: freeChar.id,
      text: 'সাউথইস্ট ক্যাম্পাসের এই মুহূর্তগুলো চিরকাল মনে রাখার মতো! ☕🎶',
      placement: 'auto'
    };
    setGroupDialogues((prev) => [...prev, newDlg]);
  };

  // Group Mode: Toggle a room message into selection
  const handleToggleRoomMessage = (msg: ChatMessage) => {
    setGroupDialogues((prev) => {
      const exists = prev.some((d) => d.id === msg.id);
      if (exists) {
        if (prev.length <= 1) return prev;
        return prev.filter((d) => d.id !== msg.id);
      }
      if (prev.length >= 5) {
        return [
          ...prev.slice(1),
          {
            id: msg.id,
            speaker: msg.senderName,
            dept: msg.senderDept || 'CSE',
            characterId: msg.characterId || 'guitarist',
            text: msg.text,
            placement: 'auto'
          }
        ];
      }
      return [
        ...prev,
        {
          id: msg.id,
          speaker: msg.senderName,
          dept: msg.senderDept || 'CSE',
          characterId: msg.characterId || 'guitarist',
          text: msg.text,
          placement: 'auto'
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

  const filteredCharacters = CAMPUS_CHARACTERS.filter((c) => {
    if (characterFilterZone !== 'all' && c.zone !== characterFilterZone) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-3xl p-3 sm:p-5 shadow-2xl text-slate-100 max-h-[96vh] flex flex-col no-scrollbar overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
            <Sparkles size={18} />
            <span>ক্যাম্পাস সিন ফটো কার্ড ও স্পিচ বাবল জেনারেটর 📸</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
            aria-label="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher Toggle: Single Quote vs Group Scene Photo Card */}
        <div className="flex items-center justify-between gap-2 bg-slate-950/80 p-1 rounded-2xl border border-white/5 mb-2.5">
          <div className="flex flex-1 gap-1">
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
              <span>👥 ক্যাম্পাস সিন গ্রুপ আড্ডা কার্ড</span>
              {eligibleRoomMessages.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/40 text-slate-950 font-black">
                  {eligibleRoomMessages.length}
                </span>
              )}
            </button>
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
          </div>

          {/* Quick Day/Night & Rain Toggles for Card */}
          <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-slate-800">
            <button
              type="button"
              onClick={() => setCardNight(!cardNight)}
              className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                cardNight ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
              title="কার্ডের দৃশ্য দিন বা রাতে বদলান"
            >
              {cardNight ? <Moon size={12} /> : <Sun size={12} />}
              <span className="hidden sm:inline">{cardNight ? 'রাত' : 'দিন'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCardRain(!cardRain)}
              className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                cardRain ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
              }`}
              title="বৃষ্টির আবহ অন বা অফ করুন"
            >
              <CloudRain size={12} />
              <span className="hidden sm:inline">বৃষ্টি</span>
            </button>
          </div>
        </div>

        {/* Responsive Content Grid: Desktop 2 Columns / Mobile Stacked */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
          
          {/* LEFT COLUMN: Controls & Dialogue Editor */}
          <div className="order-2 md:order-1 md:col-span-6 flex flex-col gap-3">
            
            {/* VIEW A: SINGLE QUOTE EDITOR */}
            {cardMode === 'single' && (
              <>
                {/* Speaker Input */}
                <div className="space-y-1">
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
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1">
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
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition leading-relaxed"
                  />
                </div>

                {/* Quick Relatable Campus Presets */}
                <div className="space-y-1.5">
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

                  <div className="grid grid-cols-2 gap-1.5">
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

            {/* VIEW B: SCENE-BASED GROUP PHOTO CARD EDITOR */}
            {cardMode === 'group' && (
              <>
                {/* Group Name Input */}
                <div className="space-y-1">
                  <label className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Users size={13} />
                      গ্রুপের নাম / আড্ডার নাম
                    </span>
                    <span className="text-[10px] text-slate-400">কার্ডের শীর্ষে ক্যাপসুল ব্যানারে দেখাবে</span>
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    maxLength={36}
                    placeholder="যেমন: সিএসই রাতের আড্ডা ☕🎸, ক্যাম্পাস ফ্রেন্ডস..."
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition font-semibold"
                  />
                </div>

                {/* Active Speech Bubbles List on Characters */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>ক্যাম্পাসে স্পিচ বাবলসমূহ ({groupDialogues.length}/৫টি):</span>
                    {groupDialogues.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddDialogue}
                        className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition active:scale-95"
                      >
                        <Plus size={12} />
                        <span>নতুন বাবল যোগ</span>
                      </button>
                    )}
                  </div>

                  {/* Dialogue Accordion/Card List */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar pr-0.5">
                    {groupDialogues.map((dlg, idx) => {
                      const char = getCharObj(dlg.characterId);
                      const isPickerOpen = activePickerDlgId === dlg.id;

                      return (
                        <div
                          key={dlg.id || idx}
                          className="p-2.5 rounded-2xl bg-slate-950/75 border border-slate-800 text-xs space-y-1.5 shadow-md relative"
                        >
                          {/* Row 1: Character Switcher & Speaker Name & Dept & Delete */}
                          <div className="flex items-center gap-1.5">
                            {/* Character Assign Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setActivePickerDlgId(isPickerOpen ? null : dlg.id)
                              }
                              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-[11px] font-semibold shrink-0 transition"
                              title="ক্যাম্পাসের ক্যারেক্টার পরিবর্তন করুন"
                            >
                              <span>{char.emoji}</span>
                              <span className="truncate max-w-[65px]">{char.name}</span>
                              <ChevronDown size={11} className={`transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Speaker Name Input */}
                            <input
                              type="text"
                              value={dlg.speaker}
                              onChange={(e) => handleUpdateSpeaker(dlg.id, e.target.value)}
                              placeholder="বক্তার নাম..."
                              className="flex-1 min-w-[70px] bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-2 py-1 text-xs text-slate-100 outline-none font-bold"
                              title="বক্তার নাম পরিবর্তন করুন"
                            />

                            {/* Dept Input */}
                            <input
                              type="text"
                              value={dlg.dept || ''}
                              onChange={(e) => handleUpdateDept(dlg.id, e.target.value)}
                              placeholder="ডিপার্টমেন্ট..."
                              className="w-16 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none text-center"
                              title="ডিপার্টমেন্ট"
                            />

                            {/* Delete Button */}
                            {groupDialogues.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveGroupDialogue(dlg.id)}
                                className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition shrink-0"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          {/* Character Picker Dropdown Popover (35 Campus Characters) */}
                          {isPickerOpen && (
                            <div className="p-2 bg-slate-900 border border-amber-500/50 rounded-xl shadow-xl z-20 space-y-1.5 animate-fadeIn">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400">
                                <span>ক্যাম্পাস সদস্য বেছে নিন (যার মাথার ওপর বাবল থাকবে):</span>
                                <div className="flex items-center gap-1">
                                  {(['all', 'foreground', 'midground', 'background'] as const).map((z) => (
                                    <button
                                      key={z}
                                      type="button"
                                      onClick={() => setCharacterFilterZone(z)}
                                      className={`px-1.5 py-0.2 rounded text-[10px] ${
                                        characterFilterZone === z
                                          ? 'bg-amber-500 text-slate-950 font-bold'
                                          : 'bg-slate-800 text-slate-400'
                                      }`}
                                    >
                                      {z === 'all' ? 'সব' : z === 'foreground' ? 'সামনে' : z === 'midground' ? 'সিঁড়িতে' : 'গেটে'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="max-h-[120px] overflow-y-auto no-scrollbar grid grid-cols-3 gap-1">
                                {filteredCharacters.map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => handleAssignCharacter(dlg.id, c.id)}
                                    className={`flex items-center gap-1 p-1 rounded-lg text-left text-[11px] border transition ${
                                      dlg.characterId === c.id
                                        ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold'
                                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200'
                                    }`}
                                  >
                                    <span>{c.emoji}</span>
                                    <span className="truncate">{c.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Row 2: Dialogue Quote Textarea */}
                          <textarea
                            value={dlg.text}
                            onChange={(e) => handleUpdateText(dlg.id, e.target.value)}
                            rows={2}
                            maxLength={120}
                            placeholder="এই ক্যারেক্টারের মাথার ওপর ডায়লগ লিখুন..."
                            className="w-full bg-slate-900 border border-slate-700/80 focus:border-amber-500 rounded-lg p-1.5 text-xs text-slate-100 outline-none resize-none leading-relaxed"
                          />

                          {/* Row 3: Placement Selector to prevent any conflict */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/60">
                            <span>বাবল অবস্থান:</span>
                            <div className="flex items-center gap-1">
                              {(['auto', 'top', 'left', 'right', 'bottom'] as const).map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => handleUpdatePlacement(dlg.id, p)}
                                  className={`px-1.5 py-0.2 rounded ${
                                    (dlg.placement || 'auto') === p
                                      ? 'bg-amber-500 text-slate-950 font-bold'
                                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {p === 'auto' ? 'স্বয়ংক্রিয়' : p === 'top' ? 'উপরে' : p === 'left' ? 'বামে' : p === 'right' ? 'ডানে' : 'নিচে'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Room Messages Selection Picker */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>
                      {eligibleRoomMessages.length > 0
                        ? 'রুমের চ্যাট থেকে বাবল যোগ করুন (ক্লিক করুন):'
                        : 'ডিফল্ট আড্ডা বার্তা:'}
                    </span>
                  </div>

                  {eligibleRoomMessages.length > 0 ? (
                    <div className="max-h-[120px] overflow-y-auto no-scrollbar space-y-1 p-1 bg-slate-950/40 rounded-2xl border border-slate-800">
                      {eligibleRoomMessages.map((msg) => {
                        const isChecked = groupDialogues.some((d) => d.id === msg.id);
                        return (
                          <button
                            key={msg.id}
                            type="button"
                            onClick={() => handleToggleRoomMessage(msg)}
                            className={`w-full flex items-start gap-2 p-1.5 rounded-xl text-left border transition text-xs ${
                              isChecked
                                ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="pt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare size={13} className="text-amber-400" />
                              ) : (
                                <Square size={13} className="text-slate-500" />
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
                    <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs">
                      💡 বর্তমানে কোনো রুমের চ্যাট বার্তা পাওয়া যায়নি। আপনি ওপরের লিস্ট থেকে যেকোনো ক্যারেক্টার নির্বাচন করে নিজের মনের মতো নাম ও ডায়লগ বসাতে পারেন!
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* RIGHT COLUMN: HD Canvas Live Preview & Action Buttons */}
          <div className="order-1 md:order-2 md:col-span-6 flex flex-col items-center gap-2">
            
            {/* Live Render Canvas (2:3 aspect ratio matching campus photo) */}
            <div className="w-full max-w-[280px] xs:max-w-[310px] sm:max-w-[340px] aspect-[2/3] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/50 relative flex items-center justify-center">
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
            <div className="w-full max-w-[340px] grid grid-cols-2 gap-2">
              <a
                href={downloadUrl}
                download={cardMode === 'group' ? 'seu-group-photo-card.png' : 'seu-campus-memory.png'}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95"
              >
                <Download size={15} />
                <span>ডাউনলোড (HD)</span>
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs sm:text-sm transition active:scale-95"
              >
                <Share2 size={15} />
                <span>শেয়ার করুন</span>
              </button>
            </div>

            {/* Copy Image to Clipboard Shortcut */}
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition py-0.5"
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
