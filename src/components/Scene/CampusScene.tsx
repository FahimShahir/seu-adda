import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CAMPUS_HOTSPOTS, Hotspot } from '../../data/dialogues';
import { CharacterBubble } from './CharacterBubble';
import { RainCanvas } from './RainCanvas';
import { Music, Coffee, Lightbulb, GraduationCap, Shield } from 'lucide-react';

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

  // Auto-dismiss active bubble after 8 seconds
  useEffect(() => {
    if (!activeHotspot) return;
    const timer = setTimeout(() => {
      setActiveHotspot(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeHotspot]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    // Pick random dialogue
    const randomIndex = Math.floor(Math.random() * hotspot.dialogues.length);
    setDialogueText(hotspot.dialogues[randomIndex]);
    setActiveHotspot(hotspot);

    if (hotspot.actionType === 'music') {
      onGuitarStrum();
      onTogglePlay();
    } else if (hotspot.actionType === 'cheers') {
      onTeaClink();
      confetti({
        particleCount: 30,
        spread: 65,
        origin: { y: 0.78, x: 0.51 },
        colors: ['#D97706', '#F59E0B', '#B45309', '#FDE68A']
      });
    } else if (hotspot.actionType === 'lamp') {
      onToggleNight();
    }
  };

  return (
    <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 aspect-[1684/2528] max-h-[75vh] sm:max-h-[80vh]">
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

      {/* Atmospheric Ambient Lighting Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isNight
            ? 'bg-gradient-to-t from-slate-950/40 via-transparent to-blue-950/20'
            : 'bg-gradient-to-t from-amber-950/10 via-transparent to-transparent'
        }`}
      />

      {/* Rain Simulation Canvas */}
      <RainCanvas enabled={isRain} />

      {/* Interactive Hotspots for all 19 members/objects */}
      {CAMPUS_HOTSPOTS.map((hotspot) => {
        const isActive = activeHotspot?.id === hotspot.id;

        return (
          <div
            key={hotspot.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px]"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`
            }}
            onClick={() => handleHotspotClick(hotspot)}
            title={hotspot.title}
          >
            {/* Hit Target Outline */}
            <div
              className={`w-full h-full rounded-full sm:rounded-2xl transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? 'ring-2 ring-amber-400 bg-amber-400/25 shadow-lg shadow-amber-500/20'
                  : 'hover:bg-amber-400/15 group-hover:ring-1 group-hover:ring-amber-300/40'
              }`}
            >
              {/* Guitarist Special Badges */}
              {hotspot.id === 'guitarist_main' && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg animate-bounce group-hover:scale-110 transition">
                  <Music size={13} className={isPlaying ? 'animate-spin' : ''} />
                </div>
              )}

              {/* Tea Cups Special Badge */}
              {hotspot.id === 'tea_cups_plate' && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white p-1 rounded-full shadow-lg group-hover:scale-110 transition">
                  <Coffee size={12} />
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs opacity-75 animate-steam">
                    ♨️
                  </span>
                </div>
              )}

              {/* Ceiling Lamp Special Badge */}
              {hotspot.id === 'hanging_lamp_day_night' && (
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 p-1.5 rounded-full shadow-lg transition ${
                    isNight
                      ? 'bg-yellow-400 text-slate-900 animate-pulseGlow'
                      : 'bg-slate-800 text-yellow-300'
                  }`}
                >
                  <Lightbulb size={13} />
                </div>
              )}

              {/* Signboard Badge */}
              {hotspot.id === 'seu_signboard' && (
                <div className="absolute -top-2 right-2 bg-blue-600/90 text-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                  <GraduationCap size={11} />
                </div>
              )}

              {/* Security Guard Badge */}
              {hotspot.id === 'turnstile_guard' && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600/90 text-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                  <Shield size={11} />
                </div>
              )}

              {/* Floating Music Notes Animation */}
              {hotspot.id === 'guitarist_main' && isPlaying && (
                <>
                  <span className="absolute -top-6 left-1 text-amber-300 text-sm animate-floatNote pointer-events-none">
                    🎵
                  </span>
                  <span
                    className="absolute -top-8 right-1 text-yellow-200 text-xs animate-floatNote pointer-events-none"
                    style={{ animationDelay: '1.2s' }}
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
