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

export interface ParsedYouTubeSource {
  type: 'playlist' | 'video';
  id: string;
}

export function parseYouTubeSource(input: string): ParsedYouTubeSource | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Check for playlist URL or parameter: list=([a-zA-Z0-9_-]+)
  const playlistMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch) {
    return { type: 'playlist', id: playlistMatch[1] };
  }

  // 2. Check for short URL: youtu.be/([a-zA-Z0-9_-]{11})
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    return { type: 'video', id: shortMatch[1] };
  }

  // 3. Check for standard video watch URL: v=([a-zA-Z0-9_-]{11})
  const videoMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (videoMatch) {
    return { type: 'video', id: videoMatch[1] };
  }

  // 4. Check for embed URL: youtube.com/embed/([a-zA-Z0-9_-]{11})
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    return { type: 'video', id: embedMatch[1] };
  }

  // 5. If exactly 11 chars alphanumeric, treat as direct video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: 'video', id: trimmed };
  }

  // 6. If longer (like PL...), treat as playlist ID
  if (/^[a-zA-Z0-9_-]{12,}$/.test(trimmed)) {
    return { type: 'playlist', id: trimmed };
  }

  return null;
}

export function useYouTubePlayer(initialPlaylistId: string) {
  const [playlistId, setPlaylistId] = useState(initialPlaylistId);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isReady: false,
    volume: 85,
    currentTitle: 'ক্যাম্পাস অ্যাকোস্টিক আড্ডা',
    currentAuthor: 'SEU Adda Radio',
    currentIndex: 0,
    totalTracks: 0,
    statusText: 'গিটার স্পর্শ করে গান চালু করুন'
  });

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPlayingRef = useRef(false);
  const pendingPlayRef = useRef(false);

  // Initialize YouTube Iframe API using the official endpoint
  useEffect(() => {
    let isCancelled = false;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player || !containerRef.current) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }

      const playerDiv = document.createElement('div');
      playerDiv.id = 'yt-active-player';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(playerDiv);

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
          enablejsapi: 1
        },
        events: {
          onReady: (event: any) => {
            if (isCancelled) return;
            try {
              event.target.setVolume(playerState.volume);
              
              // Cue the playlist properly
              event.target.cuePlaylist({
                listType: 'playlist',
                list: playlistId
              });

              setTimeout(() => {
                if (isCancelled) return;
                try {
                  const playlist = event.target.getPlaylist();
                  const total = Array.isArray(playlist) ? playlist.length : 0;
                  setPlayerState(prev => ({
                    ...prev,
                    isReady: true,
                    totalTracks: total,
                    statusText: 'রেডিও প্রস্তুত — গান শুনুন 🎶'
                  }));

                  if (pendingPlayRef.current || isPlayingRef.current) {
                    pendingPlayRef.current = false;
                    event.target.unMute();
                    event.target.playVideo();
                  }
                } catch (e) {}
              }, 1200);
            } catch (err) {
              console.warn('Error onReady:', err);
            }
          },
          onStateChange: (event: any) => {
            if (isCancelled) return;
            // 1: playing, 2: paused, 3: buffering, 0: ended, 5: cued
            if (event.data === 1) {
              isPlayingRef.current = true;
              try {
                const videoData = event.target.getVideoData();
                const currentIndex = event.target.getPlaylistIndex();
                const playlist = event.target.getPlaylist();
                
                setPlayerState(prev => ({
                  ...prev,
                  isPlaying: true,
                  currentTitle: videoData?.title || 'বাংলা ক্যাম্পাস ক্লাসিক গান',
                  currentAuthor: videoData?.author || 'SEU Adda Radio',
                  currentIndex: typeof currentIndex === 'number' ? currentIndex : prev.currentIndex,
                  totalTracks: Array.isArray(playlist) ? playlist.length : prev.totalTracks,
                  statusText: 'গান বাজছে 🎶'
                }));
              } catch (e) {
                // fallback
              }
            } else if (event.data === 2) {
              isPlayingRef.current = false;
              setPlayerState(prev => ({
                ...prev,
                isPlaying: false,
                statusText: 'গান পজ করা আছে'
              }));
            } else if (event.data === 3) {
              setPlayerState(prev => ({
                ...prev,
                statusText: 'গান লোড হচ্ছে...'
              }));
            } else if (event.data === 5) {
              // Cued
              try {
                const videoData = event.target.getVideoData();
                if (videoData?.title) {
                  setPlayerState(prev => ({
                    ...prev,
                    currentTitle: videoData.title,
                    currentAuthor: videoData.author || prev.currentAuthor
                  }));
                }
              } catch (e) {}
            } else if (event.data === 0) {
              // Video ended -> play next video in playlist
              try {
                event.target.nextVideo();
              } catch (e) {}
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player Event Error Code:', event.data);
            setPlayerState(prev => ({
              ...prev,
              statusText: 'পরবর্তী গানে যাচ্ছি...'
            }));
            setTimeout(() => {
              try {
                if (playerRef.current) playerRef.current.nextVideo();
              } catch (e) {}
            }, 800);
          }
        }
      });
    };

    if (!window.YT || !window.YT.Player) {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
      
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        createPlayer();
      };
    } else {
      createPlayer();
    }

    return () => {
      isCancelled = true;
    };
  }, [playlistId]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) {
      pendingPlayRef.current = true;
      return;
    }
    try {
      if (playerState.isPlaying) {
        playerRef.current.pauseVideo();
        isPlayingRef.current = false;
      } else {
        playerRef.current.unMute();
        playerRef.current.playVideo();
        isPlayingRef.current = true;
      }
    } catch (e) {
      console.warn('Playback error:', e);
    }
  }, [playerState.isPlaying]);

  const play = useCallback(() => {
    isPlayingRef.current = true;
    if (!playerRef.current) {
      pendingPlayRef.current = true;
      return;
    }
    try {
      playerRef.current.unMute();
      playerRef.current.playVideo();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    pendingPlayRef.current = false;
    if (!playerRef.current) return;
    try {
      playerRef.current.pauseVideo();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.nextVideo();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const prevTrack = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.previousVideo();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    setPlayerState(prev => ({ ...prev, volume: val }));
    if (!playerRef.current) return;
    try {
      playerRef.current.setVolume(val);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const changePlaylist = useCallback((newPlaylistId: string) => {
    setPlaylistId(newPlaylistId);
    isPlayingRef.current = true;
    pendingPlayRef.current = true;
    if (playerRef.current && typeof playerRef.current.loadPlaylist === 'function') {
      try {
        playerRef.current.loadPlaylist({
          listType: 'playlist',
          list: newPlaylistId
        });
        playerRef.current.unMute();
        playerRef.current.playVideo();
      } catch (e) {}
    }
  }, []);

  const playCustomSource = useCallback((input: string): boolean => {
    const parsed = parseYouTubeSource(input);
    if (!parsed) return false;

    isPlayingRef.current = true;
    pendingPlayRef.current = true;

    if (parsed.type === 'playlist') {
      setPlaylistId(parsed.id);
      if (playerRef.current && typeof playerRef.current.loadPlaylist === 'function') {
        try {
          playerRef.current.loadPlaylist({
            listType: 'playlist',
            list: parsed.id
          });
          playerRef.current.unMute();
          playerRef.current.playVideo();
        } catch (e) {}
      }
    } else {
      // Single Video ID
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById(parsed.id);
          playerRef.current.unMute();
          playerRef.current.playVideo();
        } catch (e) {}
      }
    }
    return true;
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
    playCustomSource,
    playlistId
  };
}
