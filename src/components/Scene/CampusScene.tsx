import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CAMPUS_HOTSPOTS, Hotspot, AddaMood, DialogueLine } from '../../data/dialogues';
import { CharacterBubble } from './CharacterBubble';
import { LiveRoomSpeechBubble } from './LiveRoomSpeechBubble';
import { RainCanvas } from './RainCanvas';
import { Music, Coffee, Lightbulb } from 'lucide-react';
import { ActiveSpeechBubble, RoomParticipant, CAMPUS_CHARACTERS } from '../../types/room';

interface CampusSceneProps {
  isNight: boolean;
  isRain: boolean;
  isPlaying: boolean;
  currentMood: AddaMood;
  onToggleNight: () => void;
  onTogglePlay: () => void;
  onGuitarStrum: () => void;
  onTeaClink: () => void;
  onActiveQuoteChange?: (quote: { speaker: string; text: string }) => void;
  activeSpeechBubbles?: Record<string, ActiveSpeechBubble>;
  roomParticipants?: RoomParticipant[];
  currentUserId?: string;
  onTransferCharacter?: (charId: string) => void;
  onCapturePhotoCard?: (speaker: string, text: string) => void;
}

export const CampusScene: React.FC<CampusSceneProps> = ({
  isNight,
  isRain,
  isPlaying,
  currentMood,
  onToggleNight,
  onTogglePlay,
  onGuitarStrum,
  onTeaClink,
  onActiveQuoteChange,
  activeSpeechBubbles,
  roomParticipants,
  currentUserId,
  onTransferCharacter,
  onCapturePhotoCard
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [conversation, setConversation] = useState<DialogueLine[]>([]);

  // Auto-dismiss active bubble after 10 seconds
  useEffect(() => {
    if (!activeHotspot) return;
    const timer = setTimeout(() => {
      setActiveHotspot(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeHotspot]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    // Pick dialogue based on currentMood
    const moodDialogues = hotspot.dialogues[currentMood]?.length
      ? hotspot.dialogues[currentMood]
      : hotspot.dialogues.general;

    const randomIndex = Math.floor(Math.random() * moodDialogues.length);
    const chosenConvo = moodDialogues[randomIndex];
    setConversation(chosenConvo);
    setActiveHotspot(hotspot);

    if (chosenConvo && chosenConvo.length > 0 && onActiveQuoteChange) {
      onActiveQuoteChange({
        speaker: chosenConvo[0].speaker,
        text: chosenConvo[0].text
      });
    }

    // If in an active room, allow 1-click character transfer to any clicked character
    if (onTransferCharacter && CAMPUS_CHARACTERS.some((c) => c.id === hotspot.id)) {
      onTransferCharacter(hotspot.id);
    }

    if (hotspot.actionType === 'music') {
      onGuitarStrum();
      onTogglePlay();
    } else if (hotspot.actionType === 'cheers') {
      onTeaClink();
      // Burst confetti of tea cups and warmth
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.78, x: 0.5 },
        colors: ['#D97706', '#F59E0B', '#B45309', '#FDE68A']
      });
    } else if (hotspot.actionType === 'lamp') {
      onToggleNight();
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden touch-manipulation">
      {/* Base Artwork - Day Mode */}
      <img
        src="./images/campus-day.jpg"
        alt="Southeast University Campus Adda - Day"
        className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000 ${
          isNight ? 'opacity-0' : 'opacity-100'
        }`}
      />

        {/* Base Artwork - Night Mode */}
        <img
          src="./images/campus-night.jpg"
          alt="Southeast University Campus Adda - Night"
          className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000 ${
            isNight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Ambient Lighting Gradient Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            isNight
              ? 'bg-gradient-to-t from-slate-950/40 via-transparent to-blue-950/20'
              : 'bg-gradient-to-t from-amber-950/10 via-transparent to-transparent'
          }`}
        />

        {/* Rain Particle Effect */}
        <RainCanvas enabled={isRain} />

        {/* Interactive Hotspot Buttons for Every Member */}
        {CAMPUS_HOTSPOTS.map((hotspot) => {
          const isActive = activeHotspot?.id === hotspot.id;
          const owner = roomParticipants?.find((p) => p.characterId === hotspot.id);
          const isMyChar = owner && owner.id === currentUserId;
          const zIndexClass =
            hotspot.zone === 'foreground'
              ? 'z-30'
              : hotspot.zone === 'midground'
              ? 'z-25'
              : 'z-20';
          const badgeScale =
            hotspot.zone === 'background'
              ? 'scale-75 -top-6'
              : hotspot.zone === 'midground'
              ? 'scale-90 -top-6'
              : 'scale-100 -top-7';

          return (
            <div
              key={hotspot.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group touch-manipulation ${zIndexClass}`}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`
              }}
              onClick={() => handleHotspotClick(hotspot)}
              title={`${hotspot.groupName} (${hotspot.subName}) — আড্ডা শুনুন`}
            >
              {/* Floating Room Character Owner Badge */}
              {owner && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-lg flex items-center gap-1 border transition-all z-30 pointer-events-none select-none origin-bottom ${badgeScale} ${
                    isMyChar
                      ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                      : 'bg-slate-900/90 text-emerald-300 border-emerald-400/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{owner.name}</span>
                  {owner.dept && <span className="opacity-80">[{owner.dept}]</span>}
                </div>
              )}

              {/* Clickable Area Indicator & Soft Ring */}
              <div
                className={`w-full h-full rounded-2xl transition-all duration-300 flex items-center justify-center relative ${
                  isActive
                    ? 'ring-2 ring-amber-400 bg-amber-400/30 shadow-lg'
                    : isMyChar
                    ? 'ring-2 ring-amber-400/80 bg-amber-400/20'
                    : owner
                    ? 'ring-1 ring-emerald-400/70 bg-emerald-400/10'
                    : 'hover:bg-amber-400/20 group-hover:ring-1 group-hover:ring-amber-300/50'
                }`}
              >
                {/* Subtle Pulsing Hint Dot for Easy Detection */}
                <span
                  className={`absolute w-2 h-2 rounded-full transition-opacity ${
                    isActive
                      ? 'bg-amber-400 scale-125'
                      : 'bg-amber-300/60 group-hover:bg-amber-300 group-hover:scale-110'
                  }`}
                />

                {/* Central Guitarist Badges & Music Notes */}
                {hotspot.id === 'guitarist' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg animate-bounce group-hover:scale-110 transition z-30">
                    <Music size={14} className={isPlaying ? 'animate-spin' : ''} />
                  </div>
                )}

                {hotspot.id === 'tea_cups' && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600/90 text-white p-1 rounded-full shadow-lg group-hover:scale-110 transition z-30">
                    <Coffee size={12} />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs opacity-75 animate-steam">
                      ♨️
                    </span>
                  </div>
                )}

                {hotspot.id === 'hanging_lamp' && (
                  <div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 p-1.5 rounded-full shadow-lg transition z-30 ${
                      isNight
                        ? 'bg-yellow-400 text-slate-900 animate-pulseGlow'
                        : 'bg-slate-700/80 text-yellow-300'
                    }`}
                  >
                    <Lightbulb size={13} />
                  </div>
                )}

                {/* Music notes floating when music plays */}
                {hotspot.id === 'guitarist' && isPlaying && (
                  <>
                    <span className="absolute -top-6 left-2 text-amber-300 text-xs sm:text-sm animate-floatNote pointer-events-none">
                      🎵
                    </span>
                    <span
                      className="absolute -top-8 right-2 text-yellow-200 text-xs animate-floatNote pointer-events-none"
                      style={{ animationDelay: '1s' }}
                    >
                      🎶
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Render Active Room Speech Bubbles Floating Over Respective Artwork Characters */}
        {activeSpeechBubbles &&
          Object.values(activeSpeechBubbles).map((bubble) => {
            const charHotspot = CAMPUS_HOTSPOTS.find((h) => h.id === bubble.characterId);
            if (!charHotspot) return null;
            return (
              <LiveRoomSpeechBubble
                key={bubble.id}
                bubble={bubble}
                x={charHotspot.x}
                y={charHotspot.y}
                zone={charHotspot.zone}
                isMine={bubble.senderName === roomParticipants?.find((p) => p.id === currentUserId)?.name}
                onCapturePhotoCard={onCapturePhotoCard}
              />
            );
          })}

        {/* Render Regular Non-Room Hotspot Dialogues */}
        {activeHotspot && !activeSpeechBubbles?.[activeHotspot.id] && (
          <CharacterBubble
            hotspot={activeHotspot}
            conversation={conversation}
            onClose={() => setActiveHotspot(null)}
          />
        )}
    </div>
  );
};
