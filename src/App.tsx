import React, { useState, useEffect, useRef } from 'react';
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
import { DeveloperModal } from './components/Community/DeveloperModal';
import { PrivateRoomModal } from './components/Room/PrivateRoomModal';
import { FloatingRoomChatBar } from './components/Room/FloatingRoomChatBar';
import { useAddaRoom } from './hooks/useAddaRoom';
import { AddaMood } from './data/dialogues';
import { CAMPUS_PLAYLISTS } from './data/playlists';

export function App() {
  const [isNight, setIsNight] = useState(false);
  const [isRain, setIsRain] = useState(false);
  const [currentMood, setCurrentMood] = useState<AddaMood>('general');
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isConfessionOpen, setIsConfessionOpen] = useState(false);
  const [isPhotoCardOpen, setIsPhotoCardOpen] = useState(false);
  const [isDeveloperOpen, setIsDeveloperOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [roomModalTab, setRoomModalTab] = useState<'info' | 'history'>('history');
  const [pendingJoinRoomId, setPendingJoinRoomId] = useState('');
  const [activeQuote, setActiveQuote] = useState<{ speaker: string; text: string } | undefined>(undefined);
  const [hasAutoSynced, setHasAutoSynced] = useState(false);

  const isRemoteSyncRef = useRef(false);
  const activeRoomRef = useRef<any>(null);

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
    isRemoteSyncRef.current = true;
    playCustomSource(source);
  });

  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // Audio & Player Hooks with Real-Time Room Sync
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
  } = useYouTubePlayer('yYKHuW_FS_U', (videoData) => {
    if (isRemoteSyncRef.current) {
      isRemoteSyncRef.current = false;
      return;
    }
    // If in an active room, broadcast locally started video to all participants
    if (activeRoomRef.current) {
      setRoomSong(videoData.title, videoData.author, videoData.id);
    }
  });

  // Auto-sync room song when joining an active room with an ongoing track
  useEffect(() => {
    if (activeRoom?.currentSong?.source && playerState.videoId !== activeRoom.currentSong.source) {
      isRemoteSyncRef.current = true;
      playCustomSource(activeRoom.currentSong.source);
    }
  }, [activeRoom?.id, activeRoom?.currentSong?.source]);

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
    cheersCount,
    recordCheers,
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
    recordCheers();
    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#F59E0B', '#D97706', '#FEF3C7', '#B45309']
    });
  };

  return (
    <div className={`relative w-full h-[100dvh] overflow-hidden flex items-center justify-center select-none transition-colors duration-1000 ${
      isNight ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Hidden YouTube Iframe Audio Host (Zero Spill & Chrome Throttle-Proof) */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-[200px] h-[200px] opacity-[0.002] pointer-events-none select-none -z-50 overflow-hidden"
      />

      {/* Ambient Blurred Widescreen Backdrop (Cleanly Clipped Container) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={isNight ? "./images/campus-night.jpg" : "./images/campus-day.jpg"}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover filter blur-3xl scale-110 opacity-35 select-none transition-all duration-1000"
        />
      </div>

      {/* Central Sharp Artwork Frame (Aspect-Ratio Fitted: 100% Image Visible On All Devices, Zero Cropping) */}
      <main
        style={{
          width: 'min(100vw, calc(100dvh * 686 / 1024))',
          height: 'min(100dvh, calc(100vw * 1024 / 686))',
          aspectRatio: '686 / 1024'
        }}
        className="relative mx-auto my-auto flex items-center justify-center shadow-2xl touch-manipulation select-none overflow-hidden shrink-0"
      >
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
          isRoomActive={Boolean(activeRoom)}
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
          cheersCount={cheersCount}
          currentMood={currentMood}
          dhakaTime={dhakaTime}
          weather={weather}
          activeRoom={activeRoom}
          onSelectMood={setCurrentMood}
          onOpenConfessions={() => setIsConfessionOpen(true)}
          onOpenPhotoCard={() => {
            if (latestSpeech) setActiveQuote(latestSpeech);
            setIsPhotoCardOpen(true);
          }}
          onOpenRoom={() => {
            setRoomModalTab('history');
            setIsRoomOpen(true);
          }}
          onCheers={handleCheers}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          onOpenDeveloper={() => setIsDeveloperOpen(true)}
        />

        {/* On-Screen Floating Room Chat Bar (Directly on Main Screen!) */}
        {activeRoom && (
          <FloatingRoomChatBar
            myCharacterId={currentUser.characterId}
            participants={activeRoom.participants}
            messageCount={activeRoom.messages.length}
            onSendMessage={sendChatMessage}
            onTransferCharacter={transferCharacter}
            onOpenPhotoCard={() => {
              if (latestSpeech) setActiveQuote(latestSpeech);
              setIsPhotoCardOpen(true);
            }}
            onOpenHistory={() => {
              setRoomModalTab('history');
              setIsRoomOpen(true);
            }}
          />
        )}

        {/* Floating Bottom Audio Player Capsule Directly Over Artwork Grass */}
        <PlayerControls
          playerState={playerState}
          isNight={isNight}
          isRain={isRain}
          isRoomActive={Boolean(activeRoom)}
          onTogglePlay={togglePlay}
          onNext={nextTrack}
          onPrev={prevTrack}
          onVolumeChange={setVolume}
          onToggleNight={handleToggleNight}
          onToggleRain={handleToggleRain}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
        />

        {/* Single Clean Developer & Coffee Treat Pill at Bottom (Hidden while in room to free up mobile space) */}
        {!activeRoom && (
          <div className="absolute bottom-16 sm:bottom-16 left-3 sm:left-4 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsDeveloperOpen(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-slate-200 text-xs font-semibold backdrop-blur-xl shadow-lg shadow-black/40 transition active:scale-95 cursor-pointer"
              title="সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা ক্রিয়েটর — ফাহিম শাহীর"
            >
              <span className="text-sm">☕</span>
              <span className="text-slate-300">
                <span className="hidden sm:inline">Crafted with ❤️ by </span>
                <strong className="text-amber-400 group-hover:underline">Fahim Shahir</strong>
                <span> • </span>
                <span className="text-pink-300 font-bold">কফি ট্রিট</span>
              </span>
            </button>
          </div>
        )}
      </main>

      {/* Playlist Selector & Custom Song Modal with Room Broadcast */}
      <PlaylistModal
        isOpen={isPlaylistOpen}
        activePlaylistId={playlistId}
        onSelectPlaylist={(id) => {
          changePlaylist(id);
          play();
          if (activeRoomRef.current) {
            const pl = CAMPUS_PLAYLISTS.find((p) => p.id === id);
            setRoomSong(pl?.name || 'ক্যাম্পাস প্লেলিস্ট', 'SEU Adda রেডিও', id);
          }
        }}
        onPlayCustomSource={(source) => {
          const success = playCustomSource(source);
          if (success && activeRoomRef.current) {
            setRoomSong('ক্যাম্পাস পছন্দের গান', currentUser.name || 'বন্ধু', source);
          }
          return Boolean(success);
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

      {/* Creator & Developer Profile Modal */}
      <DeveloperModal
        isOpen={isDeveloperOpen}
        onClose={() => setIsDeveloperOpen(false)}
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
        roomTitle={activeRoom?.name}
        roomMessages={activeRoom?.messages}
        roomParticipants={activeRoom?.participants}
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
        initialViewTab={roomModalTab}
      />
    </div>
  );
}

export default App;
