import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { usePresenceAndConfessions } from './hooks/usePresenceAndConfessions';
import { HeaderBar } from './components/UI/HeaderBar';
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
    <div className={`relative w-screen h-[100dvh] overflow-hidden select-none transition-colors duration-1000 ${
      isNight ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Hidden YouTube Iframe Audio Host */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-2 h-2 opacity-[0.01] pointer-events-none z-0 overflow-hidden"
      />

      {/* Ambient Blurred Widescreen Backdrop (Fills PC Monitors Seamlessly Edge-to-Edge) */}
      <img
        src={isNight ? "./images/campus-night.jpg" : "./images/campus-day.jpg"}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-125 opacity-35 pointer-events-none select-none transition-all duration-1000"
      />

      {/* Central Sharp Artwork Frame with Overlaid Controls (No Overlaps, Zero Black Gaps) */}
      <main className="relative h-full aspect-[686/1024] max-w-full mx-auto flex items-center justify-center shadow-2xl touch-manipulation select-none overflow-hidden">
        {/* Interactive Campus Scene with Hotspots & Dialogues */}
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

        {/* Floating Top Header Navigation with Integrated Mood Selector */}
        <HeaderBar
          onlineCount={onlineCount}
          isNight={isNight}
          isRain={isRain}
          currentMood={currentMood}
          onSelectMood={setCurrentMood}
          onToggleNight={() => setIsNight(prev => !prev)}
          onToggleRain={handleToggleRain}
          onOpenConfessions={() => setIsConfessionOpen(true)}
          onCheers={handleCheers}
        />

        {/* Floating Bottom Audio Player Capsule Directly Over Artwork Grass */}
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
      </main>

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
