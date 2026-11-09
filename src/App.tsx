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
import { Info, Sparkles } from 'lucide-react';

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

  // Dismiss guide toast after 10s
  useEffect(() => {
    const t = setTimeout(() => setShowGuide(false), 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${
      isNight ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Hidden YouTube Iframe Audio Host */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed -left-[10000px] top-0 w-10 h-10 opacity-0 pointer-events-none"
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
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 pb-24 overflow-x-hidden">
        {/* Interactive Guide Banner */}
        {showGuide && (
          <div className="w-full max-w-xl mb-3 bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs px-4 py-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg backdrop-blur-md animate-pop">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400 shrink-0" />
              <span>
                💡 <strong>ক্যাম্পাস টিপস:</strong> গিটারিস্টের উপর ক্লিক করে গান শুনুন, বন্ধুদের উপর ট্যাপ করে কথা শুনুন, চায়ের কাপে চিয়ার্স পাঠান!
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
