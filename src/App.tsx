import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { usePresenceAndConfessions } from './hooks/usePresenceAndConfessions';
import { HeaderBar } from './components/UI/HeaderBar';
import { CampusScene } from './components/Scene/CampusScene';
import { PlayerControls } from './components/Audio/PlayerControls';
import { PlaylistModal } from './components/Audio/PlaylistModal';
import { ConfessionModal } from './components/Community/ConfessionModal';
import { Sparkles } from 'lucide-react';

export function App() {
  const [isNight, setIsNight] = useState(false);
  const [isRain, setIsRain] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isConfessionOpen, setIsConfessionOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Audio & Player Hooks
  const {
    containerRef,
    playerState,
    togglePlay,
    play,
    nextTrack,
    prevTrack,
    setVolume,
    changePlaylist,
    playlistId
  } = useYouTubePlayer('PLOPZkRWRrUEk');

  const {
    isAmbientOn,
    toggleAmbient,
    playGuitarStrum,
    playTeaClink
  } = useAmbientAudio();

  const {
    onlineCount,
    confessions,
    addConfession,
    likeConfession
  } = usePresenceAndConfessions();

  // Synchronize rain state with ambient rain sound
  const handleToggleRain = () => {
    const nextRain = !isRain;
    setIsRain(nextRain);
    if ((nextRain && !isAmbientOn) || (!nextRain && isAmbientOn)) {
      toggleAmbient();
    }
  };

  const handleCheers = () => {
    playTeaClink();
    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#F59E0B', '#D97706', '#FEF3C7', '#B45309']
    });
  };

  // Dismiss guide toast after 9s
  useEffect(() => {
    const t = setTimeout(() => setShowGuide(false), 9000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${
      isNight ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Hidden YouTube Iframe Audio Host (must have size and render to avoid browser throttle) */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-2 h-2 opacity-[0.01] pointer-events-none z-0 overflow-hidden"
      />

      {/* Top Header Navigation */}
      <HeaderBar
        onlineCount={onlineCount}
        isNight={isNight}
        isRain={isRain}
        onToggleNight={() => setIsNight(prev => !prev)}
        onToggleRain={handleToggleRain}
        onOpenConfessions={() => setIsConfessionOpen(true)}
        onCheers={handleCheers}
      />

      {/* Main Campus Scene Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 pb-20 sm:pb-24 overflow-x-hidden">
        {/* Interactive Guide Banner */}
        {showGuide && (
          <div className="w-full max-w-md mb-2 bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] sm:text-xs px-3.5 py-2 rounded-xl flex items-center justify-between gap-2 shadow-lg backdrop-blur-md animate-pop">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-amber-400 shrink-0" />
              <span>
                💡 <strong>ক্যাম্পাস টিপস:</strong> ছবিতে থাকা যে কারও উপর ক্লিক করে কথা শুনুন, গিটারিস্টে ক্লিক করে গান শুনুন!
              </span>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Central Interactive Campus Art Canvas */}
        <CampusScene
          isNight={isNight}
          isRain={isRain}
          isPlaying={playerState.isPlaying}
          onToggleNight={() => setIsNight(prev => !prev)}
          onTogglePlay={togglePlay}
          onGuitarStrum={playGuitarStrum}
          onTeaClink={playTeaClink}
        />
      </main>

      {/* Sticky Bottom Player Controls */}
      <PlayerControls
        playerState={playerState}
        isNight={isNight}
        isRain={isRain}
        onTogglePlay={togglePlay}
        onNext={nextTrack}
        onPrev={prevTrack}
        onVolumeChange={setVolume}
        onToggleNight={() => setIsNight(prev => !prev)}
        onToggleRain={handleToggleRain}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
      />

      {/* Playlist Selector Modal */}
      <PlaylistModal
        isOpen={isPlaylistOpen}
        activePlaylistId={playlistId}
        onSelectPlaylist={(id) => {
          changePlaylist(id);
          play();
        }}
        onClose={() => setIsPlaylistOpen(false)}
      />

      {/* Campus Confessions & Memories Board */}
      <ConfessionModal
        isOpen={isConfessionOpen}
        confessions={confessions}
        onAddConfession={addConfession}
        onLikeConfession={likeConfession}
        onClose={() => setIsConfessionOpen(false)}
      />
    </div>
  );
}

export default App;
