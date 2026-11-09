import { useEffect, useRef, useState, useCallback } from 'react';

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

export function useYouTubePlayer(initialPlaylistId: string) {
  const [playlistId, setPlaylistId] = useState(initialPlaylistId);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isReady: false,
    volume: 75,
    currentTitle: 'ক্যাম্পাস অ্যাকোস্টিক আড্ডা',
    currentAuthor: 'Southeast University',
    currentIndex: 0,
    totalTracks: 0,
    statusText: 'গিটার স্পর্শ করে গান চালু করুন'
  });

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPlayingRef = useRef(false);

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

      playerRef.current = new window.YT.Player(playerDiv, {
        height: '200',
        width: '200',
        playerVars: {
          listType: 'playlist',
          list: playlistId,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            if (isCancelled) return;
            event.target.setVolume(playerState.volume);
            const playlist = event.target.getPlaylist();
            const total = Array.isArray(playlist) ? playlist.length : 0;
            
            setPlayerState(prev => ({
              ...prev,
              isReady: true,
              totalTracks: total,
              statusText: 'রেডিও প্রস্তুত — গান শুনুন'
            }));

            // If user previously started, begin playback
            if (isPlayingRef.current) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (isCancelled) return;
            // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
            if (event.data === 1) {
              isPlayingRef.current = true;
              const videoData = event.target.getVideoData();
              const currentIndex = event.target.getPlaylistIndex();
              const playlist = event.target.getPlaylist();
              
              setPlayerState(prev => ({
                ...prev,
                isPlaying: true,
                currentTitle: videoData?.title || 'ক্যাম্পাস গান চলছে...',
                currentAuthor: videoData?.author || 'SEU Adda Radio',
                currentIndex: typeof currentIndex === 'number' ? currentIndex : prev.currentIndex,
                totalTracks: Array.isArray(playlist) ? playlist.length : prev.totalTracks,
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
                statusText: 'গান লোড হচ্ছে...'
              }));
            } else if (event.data === 0) {
              // Video ended -> play next
              event.target.nextVideo();
            }
          },
          onError: (event: any) => {
            // Auto skip restricted/blocked video (error 100, 101, 150)
            console.warn('YouTube Player Event Error:', event.data);
            setPlayerState(prev => ({
              ...prev,
              statusText: 'এই গানটি এভেলেবল না, পরবর্তী গানে যাচ্ছি...'
            }));
            setTimeout(() => {
              try {
                if (playerRef.current) playerRef.current.nextVideo();
              } catch (e) {
                // ignore
              }
            }, 1200);
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
  }, [playlistId]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (playerState.isPlaying) {
        playerRef.current.pauseVideo();
        isPlayingRef.current = false;
      } else {
        playerRef.current.playVideo();
        isPlayingRef.current = true;
      }
    } catch (e) {
      console.error(e);
    }
  }, [playerState.isPlaying]);

  const play = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.playVideo();
      isPlayingRef.current = true;
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  const changePlaylist = useCallback((newPlaylistId: string) => {
    setPlaylistId(newPlaylistId);
    isPlayingRef.current = true;
  }, []);

  return {
    containerRef,
    playerState,
    togglePlay,
    play,
    pause,
    nextTrack,
    prevTrack,
    setVolume,
    changePlaylist,
    playlistId
  };
}
