import { useEffect, useRef, useState, useCallback } from 'react';
import { CAMPUS_PLAYLISTS, Playlist, Track } from '../data/playlists';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface PlayerState {
  isPlaying: boolean;
  isReady: boolean;
  volume: number;
  currentTitle: string;
  currentAuthor: string;
  currentIndex: number;
  totalTracks: number;
  statusText: string;
}

export function useYouTubePlayer() {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(CAMPUS_PLAYLISTS[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isReady: false,
    volume: 80,
    currentTitle: CAMPUS_PLAYLISTS[0].tracks[0].title,
    currentAuthor: CAMPUS_PLAYLISTS[0].tracks[0].artist,
    currentIndex: 0,
    totalTracks: CAMPUS_PLAYLISTS[0].tracks.length,
    statusText: 'গিটার স্পর্শ করে গান শুনুন'
  });

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPlayingRef = useRef(false);
  const currentTrackIndexRef = useRef(0);
  currentTrackIndexRef.current = currentTrackIndex;

  // Initialize YouTube Iframe API
  useEffect(() => {
    let isCancelled = false;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player || !containerRef.current) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }

      const playerDiv = document.createElement('div');
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(playerDiv);

      const videoIds = currentPlaylist.tracks.map(t => t.videoId);

      playerRef.current = new window.YT.Player(playerDiv, {
        height: '200',
        width: '200',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            if (isCancelled) return;
            event.target.setVolume(playerState.volume);
            
            // Cue the playlist with our verified video IDs
            try {
              event.target.cuePlaylist(videoIds, currentTrackIndexRef.current, 0);
            } catch (e) {
              console.warn('cuePlaylist error:', e);
            }

            setPlayerState(prev => ({
              ...prev,
              isReady: true,
              totalTracks: videoIds.length,
              statusText: 'রেডিও প্রস্তুত — গান শুনুন'
            }));

            if (isPlayingRef.current) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (isCancelled) return;
            // 1: playing, 2: paused, 3: buffering, 0: ended
            if (event.data === 1) {
              isPlayingRef.current = true;
              const ytIndex = event.target.getPlaylistIndex();
              const trackIdx = typeof ytIndex === 'number' && ytIndex >= 0 ? ytIndex : currentTrackIndexRef.current;
              setCurrentTrackIndex(trackIdx);

              const currentTrack = currentPlaylist.tracks[trackIdx] || currentPlaylist.tracks[0];
              const videoData = event.target.getVideoData();

              setPlayerState(prev => ({
                ...prev,
                isPlaying: true,
                currentTitle: currentTrack?.title || videoData?.title || 'ক্যাম্পাস গান চলছে...',
                currentAuthor: currentTrack?.artist || videoData?.author || 'SEU Adda Radio',
                currentIndex: trackIdx,
                statusText: 'গান বাজছে 🎶'
              }));
            } else if (event.data === 2) {
              isPlayingRef.current = false;
              setPlayerState(prev => ({
                ...prev,
                isPlaying: false,
                statusText: 'গান সাময়িক বন্ধ আছে'
              }));
            } else if (event.data === 3) {
              setPlayerState(prev => ({
                ...prev,
                statusText: 'গান বাফারিং হচ্ছে...'
              }));
            } else if (event.data === 0) {
              // Video finished -> next video
              event.target.nextVideo();
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player Event Error:', event.data);
            setPlayerState(prev => ({
              ...prev,
              statusText: 'গান লোড হতে সমস্যা, পরের গান চালু হচ্ছে...'
            }));
            setTimeout(() => {
              try {
                if (playerRef.current) playerRef.current.nextVideo();
              } catch (e) {}
            }, 1000);
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube-nocookie.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      isCancelled = true;
    };
  }, [currentPlaylist]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (playerState.isPlaying) {
        playerRef.current.pauseVideo();
        isPlayingRef.current = false;
      } else {
        const videoIds = currentPlaylist.tracks.map(t => t.videoId);
        // If unstarted, load and play
        playerRef.current.loadPlaylist(videoIds, currentTrackIndexRef.current, 0);
        playerRef.current.playVideo();
        isPlayingRef.current = true;
      }
    } catch (e) {
      console.error('togglePlay exception:', e);
    }
  }, [playerState.isPlaying, currentPlaylist]);

  const play = useCallback(() => {
    if (!playerRef.current) return;
    try {
      const videoIds = currentPlaylist.tracks.map(t => t.videoId);
      playerRef.current.loadPlaylist(videoIds, currentTrackIndexRef.current, 0);
      playerRef.current.playVideo();
      isPlayingRef.current = true;
    } catch (e) {
      console.error(e);
    }
  }, [currentPlaylist]);

  const pause = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.pauseVideo();
      isPlayingRef.current = false;
    } catch (e) {
      console.error(e);
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.nextVideo();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const prevTrack = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.previousVideo();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    setPlayerState(prev => ({ ...prev, volume: val }));
    if (!playerRef.current) return;
    try {
      playerRef.current.setVolume(val);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const changePlaylist = useCallback((playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    isPlayingRef.current = true;
    if (playerRef.current) {
      const videoIds = playlist.tracks.map(t => t.videoId);
      try {
        playerRef.current.loadPlaylist(videoIds, 0, 0);
        playerRef.current.playVideo();
      } catch (e) {}
    }
  }, []);

  return {
    containerRef,
    playerState,
    currentPlaylist,
    togglePlay,
    play,
    pause,
    nextTrack,
    prevTrack,
    setVolume,
    changePlaylist
  };
}
