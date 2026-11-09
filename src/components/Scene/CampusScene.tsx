import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CAMPUS_HOTSPOTS, Hotspot } from '../../data/dialogues';
import { CharacterBubble } from './CharacterBubble';
import { RainCanvas } from './RainCanvas';
import { Music, Coffee, Lightbulb } from 'lucide-react';

interface CampusSceneProps {
  isNight: boolean;
  isRain: boolean;
  isPlaying: boolean;
  onToggleNight: () => void;
  onTogglePlay: () => void;
  onGuitarStrum: () => void;
  onTeaClink: () => void;
}

export const CampusScene: React.FC<CampusSceneProps> = ({
  isNight,
  isRain,
  isPlaying,
  onToggleNight,
  onTogglePlay,
  onGuitarStrum,
  onTeaClink
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [dialogueText, setDialogueText] = useState<string>('');

  // Auto-dismiss active bubble after 7 seconds
  useEffect(() => {
    if (!activeHotspot) return;
    const timer = setTimeout(() => {
      setActiveHotspot(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeHotspot]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    // Pick a random dialogue from the hotspot list
    const randomIndex = Math.floor(Math.random() * hotspot.dialogues.length);
    setDialogueText(hotspot.dialogues[randomIndex]);
    setActiveHotspot(hotspot);

    if (hotspot.actionType === 'music') {
      onGuitarStrum();
      onTogglePlay();
    } else if (hotspot.actionType === 'cheers') {
      onTeaClink();
      // Burst confetti of tea cups and warmth
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.75, x: 0.53 },
        colors: ['#D97706', '#F59E0B', '#B45309', '#FDE68A']
      });
    } else if (hotspot.actionType === 'lamp') {
      onToggleNight();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 aspect-[1684/2528] max-h-[85vh]">
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

      {/* Interactive Hotspot Buttons */}
      {CAMPUS_HOTSPOTS.map((hotspot) => {
        const isActive = activeHotspot?.id === hotspot.id;

        return (
          <div
            key={hotspot.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`
            }}
            onClick={() => handleHotspotClick(hotspot)}
          >
            {/* Clickable Area Highlight */}
            <div
              className={`w-full h-full rounded-full transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? 'ring-2 ring-amber-400 bg-amber-400/20'
                  : 'hover:bg-amber-400/15 group-hover:ring-1 group-hover:ring-amber-300/40'
              }`}
            >
              {/* Special Floating Indicator Badges */}
              {hotspot.id === 'guitarist' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-950 p-1.5 rounded-full shadow-lg animate-bounce group-hover:scale-110 transition">
                  <Music size={14} className={isPlaying ? 'animate-spin' : ''} />
                </div>
              )}

              {hotspot.id === 'tea_cups' && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600/90 text-white p-1 rounded-full shadow-lg group-hover:scale-110 transition">
                  <Coffee size={12} />
                  {/* Rising Steam Effect */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs opacity-75 animate-steam">
                    ♨️
                  </span>
                </div>
              )}

              {hotspot.id === 'hanging_lamp' && (
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 p-1.5 rounded-full shadow-lg transition ${
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
                  <span className="absolute -top-6 left-2 text-amber-300 text-sm animate-floatNote pointer-events-none">
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

            {/* Speech Bubble Popup */}
            {isActive && (
              <CharacterBubble
                hotspot={hotspot}
                dialogueText={dialogueText}
                onClose={() => setActiveHotspot(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

