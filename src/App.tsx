import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { usePresenceAndConfessions } from './hooks/usePresenceAndConfessions';
import { useDhakaClockAndWeather } from './hooks/useDhakaClockAndWeather';
import { HeaderBar } from './components/UI/HeaderBar';
import { CampusScene } from './components/Scene/CampusScene';
import { PlayerControls } from './components/Audio/PlayerControls';
import { PlaylistModal } from './components/Audio/PlaylistModal';
import { ConfessionModal } from './components/Community/ConfessionModal';
import { PhotoCardModal } from './components/Community/PhotoCardModal';
import { PrivateRoomModal } from './components/Room/PrivateRoomModal';
import { FloatingRoomChatBar } from './components/Room/FloatingRoomChatBar';
import { useAddaRoom } from './hooks/useAddaRoom';
import { AddaMood } from './data/dialogues';

export function App() {
  const [isNight, setIsNight] = useState(false);
  const [isRain, setIsRain] = useState(false);
  const [currentMood, setCurrentMood] = useState<AddaMood>('general');
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isConfessionOpen, setIsConfessionOpen] = useState(false);
  const [isPhotoCardOpen, setIsPhotoCardOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [pendingJoinRoomId, setPendingJoinRoomId] = useState('');
  const [activeQuote, setActiveQuote] = useState<{ speaker: string; text: string } | undefined>(undefined);
  const [hasAutoSynced, setHasAutoSynced] = useState(false);

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
    playCustomSource,
    playlistId
  } = useYouTubePlayer('PLOPZkRWRrUEk');

  // Private Adda Room Hook (2-hour ephemeral rooms with sync music & chat)
  const {
    currentUser,
    activeRoom,
    timeRemaining,
    roomError,
    activeSpeechBubbles,
    latestSpeech,
    createRoom,
    joinRoom,
    transferCharacter,
    leaveRoom,
    sendChatMessage,
    setRoomSong
  } = useAddaRoom((source) => {
    playCustomSource(source);
  });

  // Check URL query params for ?room=SEU-XXXX
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('room');
      if (r) {
        setPendingJoinRoomId(r.trim().toUpperCase());
        setIsRoomOpen(true);
      }
    } catch (_) {}
  }, []);

  const {
    setRainAudio,
    setNightAudio,
    playGuitarStrum,
    playTeaClink
  } = useAmbientAudio();

  const {
    onlineCount,
    confessions,
    addConfession,
    likeConfession
  } = usePresenceAndConfessions();

  // Dhaka Live Clock & Weather Auto-Sync
  const { dhakaTime, weather } = useDhakaClockAndWeather();

  useEffect(() => {
    if (weather && !hasAutoSynced) {
      setHasAutoSynced(true);
      if (!weather.isDay) {
        setIsNight(true);
        setNightAudio(true);
      }
      if (weather.isRaining) {
        setIsRain(true);
        setRainAudio(true);
      }
    }
  }, [weather, hasAutoSynced, setNightAudio, setRainAudio]);

  // Synchronize rain state with ambient rain sound
  const handleToggleRain = () => {
    const nextRain = !isRain;
    setIsRain(nextRain);
    setRainAudio(nextRain);
  };

  // Synchronize night state with night ambient crickets & breeze sound
  const handleToggleNight = () => {
    const nextNight = !isNight;
    setIsNight(nextNight);
    setNightAudio(nextNight);
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
          onToggleNight={handleToggleNight}
          onTogglePlay={togglePlay}
          onGuitarStrum={playGuitarStrum}
          onTeaClink={playTeaClink}
          onActiveQuoteChange={setActiveQuote}
          activeSpeechBubbles={activeSpeechBubbles}
          roomParticipants={activeRoom?.participants}
          currentUserId={currentUser.id}
          onTransferCharacter={transferCharacter}
          onCapturePhotoCard={(speaker, text) => {
            setActiveQuote({ speaker, text });
            setIsPhotoCardOpen(true);
          }}
        />

        {/* Floating Top Header Navigation with Integrated Mood Selector & Live Dhaka Weather */}
        <HeaderBar
          onlineCount={onlineCount}
          isNight={isNight}
          isRain={isRain}
          currentMood={currentMood}
          dhakaTime={dhakaTime}
          weather={weather}
          activeRoom={activeRoom}
          onSelectMood={setCurrentMood}
          onToggleNight={handleToggleNight}
          onToggleRain={handleToggleRain}
          onOpenConfessions={() => setIsConfessionOpen(true)}
          onOpenPhotoCard={() => {
            if (latestSpeech) setActiveQuote(latestSpeech);
            setIsPhotoCardOpen(true);
          }}
          onOpenRoom={() => setIsRoomOpen(true)}
          onCheers={handleCheers}
        />

        {/* On-Screen Floating Room Chat Bar (Directly on Main Screen!) */}
        {activeRoom && (
          <FloatingRoomChatBar
            myCharacterId={currentUser.characterId}
            participants={activeRoom.participants}
            onSendMessage={sendChatMessage}
            onTransferCharacter={transferCharacter}
            onOpenPhotoCard={() => {
              if (latestSpeech) setActiveQuote(latestSpeech);
              setIsPhotoCardOpen(true);
            }}
          />
        )}

        {/* Floating Bottom Audio Player Capsule Directly Over Artwork Grass */}
        <PlayerControls
          playerState={playerState}
          isNight={isNight}
          isRain={isRain}
          onTogglePlay={togglePlay}
          onNext={nextTrack}
          onPrev={prevTrack}
          onVolumeChange={setVolume}
          onToggleNight={handleToggleNight}
          onToggleRain={handleToggleRain}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
        />
      </main>

      {/* Playlist Selector & Custom Song Modal */}
      <PlaylistModal
        isOpen={isPlaylistOpen}
        activePlaylistId={playlistId}
        onSelectPlaylist={(id) => {
          changePlaylist(id);
          play();
        }}
        onPlayCustomSource={playCustomSource}
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

      {/* Polaroid / Instagram Story Photo Card Modal */}
      <PhotoCardModal
        isOpen={isPhotoCardOpen}
        onClose={() => setIsPhotoCardOpen(false)}
        isNight={isNight}
        isRain={isRain}
        currentMood={currentMood}
        currentSongTitle={playerState.currentTitle}
        currentAuthor={playerState.currentAuthor}
        dhakaTime={dhakaTime}
        activeQuote={latestSpeech || activeQuote}
      />

      {/* Ephemeral 2-Hour Private Adda Room Modal */}
      <PrivateRoomModal
        isOpen={isRoomOpen}
        onClose={() => setIsRoomOpen(false)}
        activeRoom={activeRoom}
        timeRemaining={timeRemaining}
        roomError={roomError}
        currentUser={currentUser}
        onCreateRoom={(title, name, dept, gender, charId) =>
          createRoom(title, name, dept, gender, charId)
        }
        onJoinRoom={(id, name, dept, gender, charId) =>
          joinRoom(id, name, dept, gender, charId)
        }
        onLeaveRoom={leaveRoom}
        onSetRoomSong={setRoomSong}
        initialRoomId={pendingJoinRoomId}
      />
    </div>
  );
}

export default App;
