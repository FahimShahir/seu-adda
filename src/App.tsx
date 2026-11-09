import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { usePresenceAndConfessions } from './hooks/usePresenceAndConfessions';
import { HeaderBar } from './components/UI/HeaderBar';
import { AddaMoodSelector } from './components/UI/AddaMoodSelector';
import { CampusScene } from './components/Scene/CampusScene';
import { PlayerControls } from './components/Audio/PlayerControls';
import { PlaylistModal } from './components/Audio/PlaylistModal';
import { ConfessionModal } from './components/Community/ConfessionModal';
import { AddaMood } from './data/dialogues';

export function App() {
  const [isNight, setIsNight] = useState(false);
  const [isRain, setIsRain] = useState(false);
  const [currentMood, setCurrentMood] = useState<AddaMood>('general');
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isConfessionOpen, setIsConfessionOpen] = useState(false);

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

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${
      isNight ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Hidden YouTube Iframe Audio Host */}
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
      <main className="flex-1 flex flex-col items-center justify-start p-2 pb-20 sm:pb-24 overflow-x-hidden">
        {/* Dynamic Adda Mood / Topic Selector */}
        <AddaMoodSelector
          currentMood={currentMood}
          onSelectMood={setCurrentMood}
        />

        {/* Central Interactive Campus Art Canvas */}
        <CampusScene
          isNight={isNight}
          isRain={isRain}
          isPlaying={playerState.isPlaying}
          currentMood={currentMood}
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
