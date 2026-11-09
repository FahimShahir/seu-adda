import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import {
  AddaRoom,
  ChatMessage,
  RoomParticipant,
  RoomSong,
  RoomSyncEvent,
  ActiveSpeechBubble,
  CAMPUS_CHARACTERS
} from '../types/room';

// High-speed, highly reliable EMQX public broker for browser WebSockets
const PRIMARY_MQTT_BROKER = 'wss://broker.emqx.io:8084/mqtt';
const ROOM_STORAGE_PREFIX = 'seu_adda_room_';

interface QueuedOutboxMessage {
  topic: string;
  payload: string;
  options: { retain?: boolean; qos: 0 | 1 };
}

export function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((digit) => (digit >= '0' && digit <= '9' ? bengaliDigits[parseInt(digit, 10)] : digit))
    .join('');
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '০০:০০:০০';
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return (
    toBengaliNumber(parseInt(formatted.slice(0, 2), 10)) +
    ':' +
    toBengaliNumber(parseInt(formatted.slice(3, 5), 10)) +
    ':' +
    toBengaliNumber(parseInt(formatted.slice(6, 8), 10))
  );
}

export function generateRoomId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SEU-${result}`;
}

export function useAddaRoom(onRoomSongChange?: (source: string) => void) {
  // Flag indicating if PHP MySQL backend is available on server (e.g. InfinityFree)
  const [isPhpBackend, setIsPhpBackend] = useState<boolean>(false);
  const lastMsgDbIdRef = useRef<number>(0);

  // Current user info (name, dept, gender, claimed characterId)
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    dept: string;
    gender: 'male' | 'female';
    characterId: string;
  }>(() => {
    let tabId = '';
    try {
      tabId = sessionStorage.getItem('seu_room_tab_uid') || '';
      if (!tabId) {
        tabId = 'user_' + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem('seu_room_tab_uid', tabId);
      }
    } catch (e) {
      tabId = 'user_' + Math.random().toString(36).substring(2, 9);
    }

    try {
      const saved = localStorage.getItem('seu_room_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          id: tabId,
          name: parsed.name || '',
          dept: parsed.dept || 'CSE',
          gender: parsed.gender || 'male',
          characterId: parsed.characterId || 'guitarist'
        };
      }
    } catch (e) {}
    return { id: tabId, name: '', dept: 'CSE', gender: 'male', characterId: 'guitarist' };
  });

  const [activeRoom, setActiveRoom] = useState<AddaRoom | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const r = params.get('room');
        if (r) {
          const saved = localStorage.getItem(`${ROOM_STORAGE_PREFIX}${r.trim().toUpperCase()}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            const myTabId = sessionStorage.getItem('seu_tab_user_id');
            if (parsed && parsed.expiresAt > Date.now() && myTabId && parsed.participants?.some((p: any) => p.id === myTabId)) {
              return parsed;
            }
          }
        }
      }
    } catch (_) {}
    return null;
  });

  const [timeRemaining, setTimeRemaining] = useState<string>('০২:০০:০০');
  const [roomError, setRoomError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Active floating speech bubbles list (supports wind drifting transitions)
  const [activeSpeechBubbles, setActiveSpeechBubbles] = useState<ActiveSpeechBubble[]>([]);
  
  // Latest speech for Photo Card auto-prefill
  const [latestSpeech, setLatestSpeech] = useState<{ speaker: string; text: string } | null>(null);

  // Synchronized state refs for stable event handlers
  const activeRoomRef = useRef<AddaRoom | null>(null);
  activeRoomRef.current = activeRoom;

  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const onRoomSongChangeRef = useRef(onRoomSongChange);
  onRoomSongChangeRef.current = onRoomSongChange;

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const mqttClientRef = useRef<MqttClient | null>(null);
  const outboxRef = useRef<QueuedOutboxMessage[]>([]);

  // Detect PHP MySQL backend availability on startup
  useEffect(() => {
    fetch('./api/rooms.php?action=test')
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          setIsPhpBackend(true);
        }
      })
      .catch(() => {});
  }, []);

  // Save current user to local storage whenever updated
  const saveCurrentUser = useCallback(
    (name: string, dept: string, gender: 'male' | 'female', characterId: string) => {
      setCurrentUser((prev) => {
        const updated = {
          ...prev,
          name: name.trim(),
          dept: dept.trim() || 'CSE',
          gender,
          characterId
        };
        try {
          localStorage.setItem('seu_room_user', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    },
    []
  );

  // Publish message over MQTT (with outbox buffering if connecting)
  const publishMqtt = useCallback(
    (topic: string, payload: string, options: { retain?: boolean; qos: 0 | 1 } = { qos: 1 }) => {
      const client = mqttClientRef.current;
      if (client && client.connected) {
        try {
          client.publish(topic, payload, options);
        } catch (e) {
          outboxRef.current.push({ topic, payload, options });
        }
      } else {
        outboxRef.current.push({ topic, payload, options });
      }
    },
    []
  );

  // Publish authoritative room state with retain: true to broker
  const publishRetainedState = useCallback(
    (room: AddaRoom) => {
      if (!room || !room.id) return;
      const topic = `seu-adda/rooms/${room.id}/state`;
      publishMqtt(topic, JSON.stringify(room), { retain: true, qos: 1 });
    },
    [publishMqtt]
  );

  // Dispatch event over both BroadcastChannel (local tabs) and MQTT events topic (cross-device)
  const dispatchRoomEvent = useCallback(
    (event: RoomSyncEvent) => {
      try {
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage(event);
        }
      } catch (e) {}

      const topic = `seu-adda/rooms/${event.roomId}/events`;
      publishMqtt(topic, JSON.stringify(event), { qos: 1 });
    },
    [publishMqtt]
  );

  // Update room in local state and localStorage
  const updateRoomState = useCallback((updater: (prev: AddaRoom | null) => AddaRoom | null) => {
    setActiveRoom((prev) => {
      const next = updater(prev);
      if (next) {
        try {
          localStorage.setItem(`${ROOM_STORAGE_PREFIX}${next.id}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
  }, []);

  // Show a speech bubble over a specific character (30 seconds duration with gentle wind-drift)
  const triggerSpeechBubble = useCallback((msg: ChatMessage) => {
    if (!msg.characterId || msg.isSystem) return;

    const expiresAt = Date.now() + 30000; // 30 seconds lifetime
    const newBubble: ActiveSpeechBubble = {
      id: msg.id,
      characterId: msg.characterId,
      senderName: msg.senderName,
      senderDept: msg.senderDept,
      text: msg.text,
      timestamp: msg.timestamp,
      expiresAt,
      isDrifting: false
    };

    setActiveSpeechBubbles((prev) => {
      // Mark any prior bubble for this character as drifting away in breeze
      const updated = prev.map((b) => {
        if (b.characterId === msg.characterId && !b.isDrifting) {
          return {
            ...b,
            isDrifting: true,
            expiresAt: Math.min(b.expiresAt, Date.now() + 2800)
          };
        }
        return b;
      });

      return [...updated, newBubble];
    });

    setLatestSpeech({
      speaker: `${msg.senderName}${msg.senderDept ? ` (${msg.senderDept})` : ''}`,
      text: msg.text
    });
  }, []);

  // Handle incoming authoritative room state from broker or PHP MySQL API
  const handleIncomingState = useCallback(
    (incoming: AddaRoom) => {
      if (!incoming || !incoming.id) return;
      const now = Date.now();

      // Check room expiry
      if (incoming.expiresAt <= now) {
        setActiveRoom(null);
        setActiveSpeechBubbles([]);
        setRoomError('⌛ আড্ডা রুমের ২ ঘণ্টার মেয়াদ শেষ হয়ে গেছে।');
        try {
          localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${incoming.id}`);
          window.history.replaceState({}, '', window.location.pathname);
        } catch (e) {}
        return;
      }

      // Immediately sync remaining time matching the host's actual expiry
      const remainingMs = incoming.expiresAt - now;
      setTimeRemaining(formatTimeRemaining(remainingMs));

      const me = currentUserRef.current;

      updateRoomState((prev) => {
        if (!prev) {
          // Newly arrived on this device: hydrate from server!
          const exists = incoming.participants.some((p) => p.id === me.id);
          let participants = [...incoming.participants];
          let assignedCharId = me.characterId;

          if (!exists && me.name) {
            const takenCharIds = incoming.participants.map((p) => p.characterId);
            if (takenCharIds.includes(assignedCharId)) {
              const candidates = CAMPUS_CHARACTERS.filter((c) => c.gender === me.gender);
              const free =
                candidates.find((c) => !takenCharIds.includes(c.id)) ||
                CAMPUS_CHARACTERS.find((c) => !takenCharIds.includes(c.id));
              if (free) {
                assignedCharId = free.id;
                saveCurrentUser(me.name, me.dept, me.gender, assignedCharId);
              }
            }

            const myParticipant: RoomParticipant = {
              id: me.id,
              name: me.name,
              dept: me.dept,
              gender: me.gender,
              characterId: assignedCharId,
              joinedAt: now,
              lastSeen: now
            };
            participants.push(myParticipant);
          }

          const hydrated: AddaRoom = {
            ...incoming,
            participants
          };

          if (incoming.currentSong?.source && onRoomSongChangeRef.current) {
            onRoomSongChangeRef.current(incoming.currentSong.source);
          }

          return hydrated;
        }

        // Room already active: merge messages & participants while preserving host's timing
        const allMsgs = [...prev.messages];
        for (const sm of incoming.messages) {
          if (!allMsgs.some((m) => m.id === sm.id)) {
            allMsgs.push(sm);
          }
        }

        const pMap = new Map<string, RoomParticipant>();
        incoming.participants.forEach((p) => pMap.set(p.id, p));
        prev.participants.forEach((p) => {
          const inc = pMap.get(p.id);
          if (!inc || (p.lastSeen && p.lastSeen > inc.lastSeen)) {
            pMap.set(p.id, p);
          }
        });

        // Strict 1-to-1 character uniqueness enforcement across all room participants
        const finalParticipants: RoomParticipant[] = [];
        const usedCharacters = new Set<string>();
        // First-joined or host participants retain priority
        const sortedList = Array.from(pMap.values()).sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0));

        for (const p of sortedList) {
          let charId = p.characterId;
          if (usedCharacters.has(charId)) {
            const pool = CAMPUS_CHARACTERS.filter((c) => c.gender === p.gender);
            const free = pool.find((c) => !usedCharacters.has(c.id)) || CAMPUS_CHARACTERS.find((c) => !usedCharacters.has(c.id));
            if (free) {
              charId = free.id;
              if (p.id === me.id) {
                saveCurrentUser(me.name, me.dept, me.gender, charId);
              }
            }
          }
          usedCharacters.add(charId);
          finalParticipants.push({ ...p, characterId: charId });
        }

        if (
          incoming.currentSong &&
          incoming.currentSong.source !== prev.currentSong?.source &&
          onRoomSongChangeRef.current
        ) {
          onRoomSongChangeRef.current(incoming.currentSong.source);
        }

        return {
          ...incoming,
          createdAt: incoming.createdAt,
          expiresAt: incoming.expiresAt,
          currentSong: incoming.currentSong || prev.currentSong,
          participants: finalParticipants,
          messages: allMsgs
        };
      });
    },
    [saveCurrentUser, updateRoomState]
  );

  // Handle incoming ephemeral events from peer (/events topic)
  const handleIncomingEvent = useCallback(
    (event: RoomSyncEvent) => {
      if (!event || !event.roomId) return;
      const current = activeRoomRef.current;
      const me = currentUserRef.current;

      if (event.senderId === me.id) return;

      if (event.type === 'ROOM_DESTROYED') {
        if (current && current.id === event.roomId) {
          const isHostClosing = current.hostId === event.senderId && event.payload?.reason === 'host_closed';
          const isGenuinelyExpired = Date.now() >= current.expiresAt;
          
          // Only destroy room if host explicitly closed it or 2-hour TTL has expired
          if (isHostClosing || isGenuinelyExpired) {
            setActiveRoom(null);
            setActiveSpeechBubbles([]);
            setRoomError('⌛ আড্ডা রুমের ২ ঘণ্টার মেয়াদ শেষ হয়েছে বা হোস্ট রুমটি বন্ধ করেছেন।');
            try {
              localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${event.roomId}`);
              window.history.replaceState({}, '', window.location.pathname);
            } catch (e) {}
          }
        }
        return;
      }

      if (event.type === 'ROOM_CHAT_MESSAGE') {
        if (current && current.id === event.roomId) {
          const msg = event.payload as ChatMessage;
          updateRoomState((prev) => {
            if (!prev) return null;
            if (prev.messages.some((m) => m.id === msg.id)) return prev;
            return {
              ...prev,
              messages: [...prev.messages, msg]
            };
          });

          triggerSpeechBubble(msg);
        }
      } else if (event.type === 'ROOM_CHARACTER_TRANSFER') {
        if (current && current.id === event.roomId) {
          const { participantId, newCharacterId } = event.payload;
          let updatedState: AddaRoom | null = null;
          updateRoomState((prev) => {
            if (!prev) return null;
            const next = {
              ...prev,
              participants: prev.participants.map((p) =>
                p.id === participantId
                  ? { ...p, characterId: newCharacterId, lastSeen: Date.now() }
                  : p
              )
            };
            updatedState = next;
            return next;
          });
          if (updatedState) {
            publishRetainedState(updatedState);
          }
        }
      } else if (event.type === 'ROOM_SONG_CHANGE') {
        if (current && current.id === event.roomId) {
          const newSong = event.payload as RoomSong;
          updateRoomState((prev) => (prev ? { ...prev, currentSong: newSong } : null));
          if (newSong && newSong.source && onRoomSongChangeRef.current) {
            onRoomSongChangeRef.current(newSong.source);
          }
        }
      } else if (event.type === 'ROOM_JOIN') {
        if (current && current.id === event.roomId) {
          const newParticipant = event.payload.participant as RoomParticipant;
          const joinMsg = event.payload.systemMessage as ChatMessage;
          let updatedRoomState: AddaRoom | null = null;
          updateRoomState((prev) => {
            if (!prev) return null;
            const exists = prev.participants.some((p) => p.id === newParticipant.id);

            // Strict character uniqueness: verify no other participant in the room holds this character
            const takenCharIds = new Set(
              prev.participants
                .filter((p) => p.id !== newParticipant.id)
                .map((p) => p.characterId)
            );
            let finalCharId = newParticipant.characterId;
            if (takenCharIds.has(finalCharId)) {
              const pool = CAMPUS_CHARACTERS.filter((c) => c.gender === newParticipant.gender);
              const free = pool.find((c) => !takenCharIds.has(c.id)) || CAMPUS_CHARACTERS.find((c) => !takenCharIds.has(c.id));
              if (free) finalCharId = free.id;
            }
            const normalizedParticipant: RoomParticipant = {
              ...newParticipant,
              characterId: finalCharId
            };

            const updatedParticipants = exists
              ? prev.participants.map((p) =>
                  p.id === newParticipant.id ? { ...p, characterId: finalCharId, lastSeen: Date.now() } : p
                )
              : [...prev.participants, normalizedParticipant];

            const updatedMessages =
              joinMsg && !prev.messages.some((m) => m.id === joinMsg.id)
                ? [...prev.messages, joinMsg]
                : prev.messages;

            const next = {
              ...prev,
              participants: updatedParticipants,
              messages: updatedMessages
            };
            updatedRoomState = next;
            return next;
          });

          if (updatedRoomState) {
            publishRetainedState(updatedRoomState);
          }
        }
      } else if (event.type === 'ROOM_LEAVE') {
        if (current && current.id === event.roomId) {
          const { participantId, systemMessage } = event.payload;
          let updatedRoomState: AddaRoom | null = null;
          updateRoomState((prev) => {
            if (!prev) return null;
            const updatedParticipants = prev.participants.filter((p) => p.id !== participantId);
            const next = {
              ...prev,
              participants: updatedParticipants,
              messages: systemMessage ? [...prev.messages, systemMessage] : prev.messages
            };
            updatedRoomState = next;
            return next;
          });

          if (updatedRoomState) {
            publishRetainedState(updatedRoomState);
          }
        }
      } else if (event.type === 'ROOM_HEARTBEAT') {
        if (current && current.id === event.roomId) {
          const participantId = event.payload.participantId;
          updateRoomState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              participants: prev.participants.map((p) =>
                p.id === participantId ? { ...p, lastSeen: Date.now() } : p
              )
            };
          });
        }
      } else if (event.type === 'ROOM_SYNC_REQUEST') {
        if (current && current.id === event.roomId) {
          publishRetainedState(current);
        }
      }
    },
    [publishRetainedState, triggerSpeechBubble, updateRoomState]
  );

  // Setup BroadcastChannel (Local Tabs)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('seu_adda_room_bus');
        broadcastChannelRef.current = bc;
        bc.onmessage = (e) => {
          handleIncomingEvent(e.data);
        };
      }
    } catch (e) {}

    return () => {
      try {
        broadcastChannelRef.current?.close();
      } catch (_) {}
    };
  }, [handleIncomingEvent]);

  // Setup MQTT client whenever activeRoom?.id changes
  useEffect(() => {
    if (!activeRoom?.id) {
      if (mqttClientRef.current) {
        try {
          mqttClientRef.current.end(true);
        } catch (_) {}
        mqttClientRef.current = null;
      }
      return;
    }

    const roomId = activeRoom.id;
    const stateTopic = `seu-adda/rooms/${roomId}/state`;
    const eventsTopic = `seu-adda/rooms/${roomId}/events`;

    try {
      const client = mqtt.connect(PRIMARY_MQTT_BROKER, {
        clientId: `seu_${currentUserRef.current.id}_${Math.random().toString(16).substring(2, 8)}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 2500,
        keepalive: 30
      });

      mqttClientRef.current = client;

      client.on('connect', () => {
        client.subscribe([stateTopic, eventsTopic], { qos: 1 }, (err) => {
          if (!err) {
            while (outboxRef.current.length > 0) {
              const item = outboxRef.current.shift();
              if (item) {
                try {
                  client.publish(item.topic, item.payload, item.options);
                } catch (_) {}
              }
            }
          }
        });
      });

      client.on('message', (topic, payload) => {
        const payloadStr = payload.toString();
        if (!payloadStr) return;

        if (topic === stateTopic) {
          try {
            const incomingState = JSON.parse(payloadStr) as AddaRoom;
            if (incomingState && incomingState.id === roomId) {
              handleIncomingState(incomingState);
            }
          } catch (_) {}
        } else if (topic === eventsTopic) {
          try {
            const incomingEvent = JSON.parse(payloadStr) as RoomSyncEvent;
            if (incomingEvent && incomingEvent.roomId === roomId) {
              handleIncomingEvent(incomingEvent);
            }
          } catch (_) {}
        }
      });

      client.on('error', (err) => {
        console.warn('EMQX MQTT warning:', err);
      });
    } catch (e) {
      console.error('MQTT setup error:', e);
    }

    return () => {
      try {
        mqttClientRef.current?.end(true);
      } catch (_) {}
    };
  }, [activeRoom?.id, handleIncomingEvent, handleIncomingState]);

  // PHP MySQL API Real-Time Polling (every 1.5s for messages, every 5s for room state & heartbeat)
  useEffect(() => {
    if (!isPhpBackend || !activeRoom?.id) return;
    const roomId = activeRoom.id;

    // 1. Message Polling (ultra-fast 1.6s interval for incoming chat & speech bubbles)
    const msgPollInterval = setInterval(() => {
      fetch(`./api/messages.php?action=poll&room_id=${roomId}&after_id=${lastMsgDbIdRef.current}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.messages) && data.messages.length > 0) {
            let maxDbId = lastMsgDbIdRef.current;
            const newToRender: ChatMessage[] = [];

            for (const m of data.messages) {
              if (m.dbId && m.dbId > maxDbId) maxDbId = m.dbId;
              if (m.senderId !== currentUserRef.current.id) {
                newToRender.push(m);
                triggerSpeechBubble(m);
              }
            }
            lastMsgDbIdRef.current = maxDbId;

            if (newToRender.length > 0) {
              updateRoomState((prev) => {
                if (!prev) return null;
                const existing = new Set(prev.messages.map((x) => x.id));
                const distinct = newToRender.filter((x) => !existing.has(x.id));
                if (distinct.length === 0) return prev;
                return {
                  ...prev,
                  messages: [...prev.messages, ...distinct]
                };
              });
            }
          }
        })
        .catch(() => {});
    }, 1600);

    // 2. Room State & Heartbeat Polling (every 2s for real-time music sync & persistent MySQL presence)
    const roomPollInterval = setInterval(() => {
      // Send Heartbeat to MySQL
      fetch('./api/rooms.php?action=heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          participantId: currentUserRef.current.id
        })
      }).catch(() => {});

      // Fetch Latest Authoritative Room State from MySQL
      fetch(`./api/rooms.php?action=get&room_id=${roomId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((serverRoom) => {
          // If network blip or temporary InfinityFree drop, keep local state active
          if (!serverRoom) return;

          if (serverRoom.error) {
            // Only kick out if the room's 2-hour TTL has genuinely expired locally
            const localExpiry = activeRoomRef.current?.expiresAt || 0;
            if (localExpiry > 0 && Date.now() >= localExpiry) {
              setActiveRoom(null);
              setActiveSpeechBubbles([]);
              setRoomError('⌛ আড্ডা রুমের ২ ঘণ্টার মেয়াদ শেষ হয়েছে! রুমটি বন্ধ করা হয়েছে।');
            }
            return;
          }

          if (typeof serverRoom.remainingMs === 'number') {
            setTimeRemaining(formatTimeRemaining(serverRoom.remainingMs));
          }

          updateRoomState((prev) => {
            if (!prev) return serverRoom;
            if (
              serverRoom.currentSong &&
              serverRoom.currentSong.source !== prev.currentSong?.source &&
              onRoomSongChangeRef.current
            ) {
              onRoomSongChangeRef.current(serverRoom.currentSong.source);
            }
            return {
              ...prev,
              createdAt: serverRoom.createdAt || prev.createdAt,
              expiresAt: serverRoom.expiresAt || prev.expiresAt,
              currentSong: serverRoom.currentSong || prev.currentSong,
              participants: serverRoom.participants || prev.participants
            };
          });
        })
        .catch(() => {});
    }, 2000);

    return () => {
      clearInterval(msgPollInterval);
      clearInterval(roomPollInterval);
    };
  }, [activeRoom?.id, isPhpBackend, triggerSpeechBubble, updateRoomState]);

  // Speech Bubble Cleanup & Wind Drift Transition Timer (every 500ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveSpeechBubbles((prev) => {
        if (!prev.length) return prev;
        let changed = false;
        const next: ActiveSpeechBubble[] = [];

        for (const bubble of prev) {
          if (now >= bubble.expiresAt) {
            changed = true;
          } else if (!bubble.isDrifting && bubble.expiresAt - now <= 2800) {
            changed = true;
            next.push({ ...bubble, isDrifting: true });
          } else {
            next.push(bubble);
          }
        }

        return changed ? next : prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 2-Hour TTL Countdown Timer & Expiration Handler (every 1000ms)
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(() => {
      const current = activeRoomRef.current;
      if (!current) return;

      const now = Date.now();
      const remainingMs = current.expiresAt - now;

      if (remainingMs <= 0) {
        clearInterval(interval);
        dispatchRoomEvent({
          type: 'ROOM_DESTROYED',
          roomId: current.id,
          senderId: currentUserRef.current.id,
          payload: { reason: 'expired' },
          timestamp: now
        });

        publishMqtt(`seu-adda/rooms/${current.id}/state`, '', { retain: true, qos: 1 });

        setActiveRoom(null);
        setActiveSpeechBubbles([]);
        setRoomError('⌛ আড্ডা রুমের ২ ঘণ্টার মেয়াদ শেষ হয়েছে! রুমটি স্বয়ংক্রিয়ভাবে বন্ধ করা হয়েছে।');
        try {
          localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${current.id}`);
          window.history.replaceState({}, '', window.location.pathname);
        } catch (e) {}
      } else {
        setTimeRemaining(formatTimeRemaining(remainingMs));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRoom?.id, activeRoom?.expiresAt, dispatchRoomEvent, publishMqtt]);

  // Heartbeat & Empty Room Cleanup (runs every 8 seconds)
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(() => {
      const current = activeRoomRef.current;
      if (!current) return;

      const now = Date.now();
      const me = currentUserRef.current;

      dispatchRoomEvent({
        type: 'ROOM_HEARTBEAT',
        roomId: current.id,
        senderId: me.id,
        payload: { participantId: me.id },
        timestamp: now
      });

      updateRoomState((prev) => {
        if (!prev) return null;
        // Keep active participants (3-minute threshold for mobile background resilience)
        let activeParticipants = prev.participants.filter(
          (p) => p.id === me.id || now - p.lastSeen < 180000
        );

        // Always ensure current user remains in participant list
        if (!activeParticipants.some((p) => p.id === me.id)) {
          activeParticipants = [
            ...activeParticipants,
            {
              id: me.id,
              name: me.name || 'বন্ধু',
              dept: me.dept || 'CSE',
              gender: me.gender,
              characterId: me.characterId,
              joinedAt: now,
              lastSeen: now
            }
          ];
        }

        if (activeParticipants.length !== prev.participants.length) {
          const next = { ...prev, participants: activeParticipants };
          publishRetainedState(next);
          return next;
        }

        return prev;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [activeRoom?.id, dispatchRoomEvent, publishMqtt, publishRetainedState, updateRoomState]);

  // 1. Create a New Room
  const createRoom = useCallback(
    (
      roomTitle: string,
      hostName: string,
      hostDept: string,
      gender: 'male' | 'female' = 'male',
      characterId?: string
    ): string => {
      setIsConnecting(true);
      setRoomError('');

      const cleanHostName = hostName.trim() || 'ক্যাম্পাস বন্ধু';
      const cleanDept = hostDept.trim() || 'CSE';
      const cleanTitle = roomTitle.trim() || 'সাউথইস্ট আড্ডা রুম';

      const finalCharId =
        characterId || (gender === 'female' ? 'green_saree_girl' : 'guitarist');

      saveCurrentUser(cleanHostName, cleanDept, gender, finalCharId);

      const roomId = generateRoomId();
      const now = Date.now();
      const expiresAt = now + 2 * 60 * 60 * 1000; // 2 hours

      const hostParticipant: RoomParticipant = {
        id: currentUser.id,
        name: cleanHostName,
        dept: cleanDept,
        gender,
        characterId: finalCharId,
        joinedAt: now,
        lastSeen: now
      };

      const charObj = CAMPUS_CHARACTERS.find((c) => c.id === finalCharId);
      const welcomeMsg: ChatMessage = {
        id: `sys_${now}`,
        senderId: 'system',
        senderName: 'SEU Adda সিস্টেম',
        characterId: finalCharId,
        text: `সাউথইস্ট আড্ডা রুমে স্বাগতম! 🎉 ${cleanHostName} (${charObj?.name || 'হোস্ট'}) হিসেবে আড্ডা শুরু করেছেন। ২ ঘণ্টা আড্ডা দিন! ☕🎶`,
        timestamp: 'এইমাত্র',
        isSystem: true
      };

      const newRoom: AddaRoom = {
        id: roomId,
        name: cleanTitle,
        hostId: currentUser.id,
        hostName: cleanHostName,
        createdAt: now,
        expiresAt: expiresAt,
        messages: [welcomeMsg],
        participants: [hostParticipant]
      };

      try {
        localStorage.setItem(`${ROOM_STORAGE_PREFIX}${roomId}`, JSON.stringify(newRoom));
        window.history.replaceState({}, '', `?room=${roomId}`);
      } catch (e) {}

      setActiveRoom(newRoom);
      setTimeRemaining('০২:০০:০০');
      setIsConnecting(false);

      // Save to PHP MySQL Backend if available
      if (isPhpBackend) {
        fetch('./api/rooms.php?action=create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: roomId,
            name: cleanTitle,
            hostId: currentUser.id,
            hostName: cleanHostName,
            hostDept: cleanDept,
            gender,
            characterId: finalCharId
          })
        }).catch(() => {});
      }

      // Publish retained state to MQTT broker
      publishRetainedState(newRoom);

      // Dispatch ROOM_JOIN event
      dispatchRoomEvent({
        type: 'ROOM_JOIN',
        roomId,
        senderId: currentUser.id,
        payload: { participant: hostParticipant, systemMessage: welcomeMsg },
        timestamp: now
      });

      return roomId;
    },
    [currentUser.id, dispatchRoomEvent, isPhpBackend, publishRetainedState, saveCurrentUser]
  );

  // 2. Join an Existing Room
  const joinRoom = useCallback(
    (
      roomIdInput: string,
      userName: string,
      userDept: string,
      gender: 'male' | 'female' = 'male',
      characterId?: string
    ): boolean => {
      const cleanedId = roomIdInput.trim().toUpperCase();
      if (!cleanedId) {
        setRoomError('অনুগ্রহ করে রুম আইডি লিখুন');
        return false;
      }

      const cleanName = userName.trim() || 'আড্ডাবাজ বন্ধু';
      const cleanDept = userDept.trim() || 'CSE';

      setRoomError('');
      setIsConnecting(true);

      const now = Date.now();
      let targetRoom: AddaRoom | null = null;

      try {
        const saved = localStorage.getItem(`${ROOM_STORAGE_PREFIX}${cleanedId}`);
        if (saved) {
          targetRoom = JSON.parse(saved);
        }
      } catch (e) {}

      if (targetRoom && now >= targetRoom.expiresAt) {
        setRoomError('⚠️ এই রুমটির ২ ঘণ্টার মেয়াদ শেষ হয়ে গেছে। নতুন রুম তৈরি করুন।');
        setIsConnecting(false);
        try {
          localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${cleanedId}`);
        } catch (_) {}
        return false;
      }

      if (!targetRoom) {
        targetRoom = {
          id: cleanedId,
          name: `আড্ডা রুম ${cleanedId}`,
          hostId: 'peer',
          hostName: 'রুম হোস্ট',
          createdAt: now,
          expiresAt: now + 2 * 60 * 60 * 1000,
          messages: [],
          participants: []
        };
      }

      const takenCharIds = targetRoom.participants.map((p) => p.characterId);
      let assignedCharId = characterId;
      if (!assignedCharId || takenCharIds.includes(assignedCharId)) {
        const candidates = CAMPUS_CHARACTERS.filter((c) => c.gender === gender);
        const free = candidates.find((c) => !takenCharIds.includes(c.id));
        assignedCharId = free
          ? free.id
          : CAMPUS_CHARACTERS.find((c) => !takenCharIds.includes(c.id))?.id || candidates[0].id;
      }

      saveCurrentUser(cleanName, cleanDept, gender, assignedCharId);

      const newParticipant: RoomParticipant = {
        id: currentUser.id,
        name: cleanName,
        dept: cleanDept,
        gender,
        characterId: assignedCharId,
        joinedAt: now,
        lastSeen: now
      };

      const charObj = CAMPUS_CHARACTERS.find((c) => c.id === assignedCharId);
      const joinMsg: ChatMessage = {
        id: `sys_join_${now}_${currentUser.id}`,
        senderId: 'system',
        senderName: 'SEU Adda সিস্টেম',
        characterId: assignedCharId,
        text: `☕ ${cleanName} (${cleanDept}) "${charObj?.name || 'বন্ধু'}" হিসেবে আড্ডায় যোগ দিয়েছেন!`,
        timestamp: 'এইমাত্র',
        isSystem: true
      };

      const updatedParticipants = targetRoom.participants.some((p) => p.id === currentUser.id)
        ? targetRoom.participants.map((p) =>
            p.id === currentUser.id ? { ...p, characterId: assignedCharId, lastSeen: now } : p
          )
        : [...targetRoom.participants, newParticipant];

      const joinedRoom: AddaRoom = {
        ...targetRoom,
        participants: updatedParticipants,
        messages: [...targetRoom.messages, joinMsg]
      };

      try {
        localStorage.setItem(`${ROOM_STORAGE_PREFIX}${cleanedId}`, JSON.stringify(joinedRoom));
        window.history.replaceState({}, '', `?room=${cleanedId}`);
      } catch (e) {}

      setActiveRoom(joinedRoom);
      setIsConnecting(false);

      // Join room in PHP MySQL API if available
      if (isPhpBackend) {
        fetch('./api/rooms.php?action=join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: cleanedId,
            participant: newParticipant
          })
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((joinRes) => {
            if (joinRes && joinRes.characterId && joinRes.characterId !== assignedCharId) {
              // Server reassigned to an available free character to maintain 1-to-1 uniqueness
              const authoritativeCharId = joinRes.characterId;
              saveCurrentUser(cleanName, cleanDept, gender, authoritativeCharId);
              updateRoomState((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  participants: prev.participants.map((p) =>
                    p.id === currentUser.id ? { ...p, characterId: authoritativeCharId } : p
                  )
                };
              });
            }
          })
          .catch(() => {});

        // Fetch full server room state from MySQL
        fetch(`./api/rooms.php?action=get&room_id=${cleanedId}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((serverRoom) => {
            if (serverRoom && serverRoom.id) {
              if (Array.isArray(serverRoom.messages)) {
                const maxId = serverRoom.messages.reduce((max: number, m: any) => Math.max(max, m.dbId || 0), 0);
                lastMsgDbIdRef.current = maxId;
              }
              handleIncomingState(serverRoom);
            }
          })
          .catch(() => {});
      }

      dispatchRoomEvent({
        type: 'ROOM_JOIN',
        roomId: cleanedId,
        senderId: currentUser.id,
        payload: { participant: newParticipant, systemMessage: joinMsg },
        timestamp: now
      });

      dispatchRoomEvent({
        type: 'ROOM_SYNC_REQUEST',
        roomId: cleanedId,
        senderId: currentUser.id,
        payload: {},
        timestamp: now
      });

      return true;
    },
    [currentUser.id, dispatchRoomEvent, handleIncomingState, isPhpBackend, saveCurrentUser]
  );

  // 3. Transfer / Switch to Another Character
  const transferCharacter = useCallback(
    (newCharacterId: string) => {
      const current = activeRoomRef.current;
      if (!current) return false;

      const charObj = CAMPUS_CHARACTERS.find((c) => c.id === newCharacterId);
      if (!charObj) return false;

      const isClaimedByOther = current.participants.some(
        (p) => p.characterId === newCharacterId && p.id !== currentUser.id
      );
      if (isClaimedByOther) {
        const owner = current.participants.find((p) => p.characterId === newCharacterId);
        setRoomError(
          `"${charObj.name}" ইতিমধ্যে ${owner?.name || 'অন্য বন্ধু'} দখল করে রেখেছেন! অন্য ক্যারেক্টার বেছে নিন।`
        );
        return false;
      }

      setRoomError('');
      saveCurrentUser(currentUser.name, currentUser.dept, charObj.gender, newCharacterId);

      let updatedState: AddaRoom | null = null;
      updateRoomState((prev) => {
        if (!prev) return null;
        const next = {
          ...prev,
          participants: prev.participants.map((p) =>
            p.id === currentUser.id
              ? { ...p, characterId: newCharacterId, gender: charObj.gender }
              : p
          )
        };
        updatedState = next;
        return next;
      });

      // Update in PHP MySQL backend
      if (isPhpBackend) {
        fetch('./api/rooms.php?action=transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: current.id,
            participantId: currentUser.id,
            newCharacterId
          })
        }).catch(() => {});
      }

      dispatchRoomEvent({
        type: 'ROOM_CHARACTER_TRANSFER',
        roomId: current.id,
        senderId: currentUser.id,
        payload: { participantId: currentUser.id, newCharacterId },
        timestamp: Date.now()
      });

      if (updatedState) {
        publishRetainedState(updatedState);
      }

      return true;
    },
    [currentUser.dept, currentUser.id, currentUser.name, dispatchRoomEvent, isPhpBackend, publishRetainedState, saveCurrentUser, updateRoomState]
  );

  // 4. Leave Room
  const leaveRoom = useCallback(() => {
    const current = activeRoomRef.current;
    if (!current) return;

    const now = Date.now();
    const remaining = current.participants.filter((p) => p.id !== currentUser.id);

    const leaveMsg: ChatMessage = {
      id: `sys_leave_${now}_${currentUser.id}`,
      senderId: 'system',
      senderName: 'SEU Adda সিস্টেম',
      characterId: currentUser.characterId,
      text: `👋 ${currentUser.name || 'একজন বন্ধু'} রুম ত্যাগ করেছেন।`,
      timestamp: 'এইমাত্র',
      isSystem: true
    };

    if (isPhpBackend) {
      fetch('./api/rooms.php?action=leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: current.id,
          participantId: currentUser.id,
          name: currentUser.name
        })
      }).catch(() => {});
    }

    const updatedRoom: AddaRoom = {
      ...current,
      participants: remaining,
      messages: [...current.messages, leaveMsg]
    };
    try {
      localStorage.setItem(`${ROOM_STORAGE_PREFIX}${current.id}`, JSON.stringify(updatedRoom));
    } catch (e) {}

    publishRetainedState(updatedRoom);

    dispatchRoomEvent({
      type: 'ROOM_LEAVE',
      roomId: current.id,
      senderId: currentUser.id,
      payload: { participantId: currentUser.id, systemMessage: leaveMsg },
      timestamp: now
    });

    setActiveRoom(null);
    setActiveSpeechBubbles([]);
    try {
      window.history.replaceState({}, '', window.location.pathname);
    } catch (e) {}
  }, [currentUser.characterId, currentUser.id, currentUser.name, dispatchRoomEvent, isPhpBackend, publishMqtt, publishRetainedState]);

  // 5. Send Chat Message
  const sendChatMessage = useCallback(
    (text: string) => {
      const current = activeRoomRef.current;
      const trimmed = text.trim();
      if (!current || !trimmed) return;

      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedTime = `${toBengaliNumber(hours)}:${toBengaliNumber(
        minutes < 10 ? 0 : Math.floor(minutes / 10)
      )}${toBengaliNumber(minutes % 10)} ${ampm}`;

      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: currentUser.id,
        senderName: currentUser.name || 'ক্যাম্পাস আড্ডাবাজ',
        senderDept: currentUser.dept || 'CSE',
        characterId: currentUser.characterId,
        text: trimmed,
        timestamp: formattedTime
      };

      let updatedRoomState: AddaRoom | null = null;
      updateRoomState((prev) => {
        if (!prev) return null;
        const next = { ...prev, messages: [...prev.messages, newMsg] };
        updatedRoomState = next;
        return next;
      });

      triggerSpeechBubble(newMsg);

      // Save to PHP MySQL backend
      if (isPhpBackend) {
        fetch('./api/messages.php?action=send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: current.id,
            message: newMsg
          })
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (res && res.dbId) {
              lastMsgDbIdRef.current = Math.max(lastMsgDbIdRef.current, res.dbId);
            }
          })
          .catch(() => {});
      }

      dispatchRoomEvent({
        type: 'ROOM_CHAT_MESSAGE',
        roomId: current.id,
        senderId: currentUser.id,
        payload: newMsg,
        timestamp: Date.now()
      });

      if (updatedRoomState) {
        publishRetainedState(updatedRoomState);
      }
    },
    [currentUser.characterId, currentUser.dept, currentUser.id, currentUser.name, dispatchRoomEvent, isPhpBackend, publishRetainedState, triggerSpeechBubble, updateRoomState]
  );

  // 6. Broadcast Room Song Change
  const setRoomSong = useCallback(
    (title: string, author: string, source: string) => {
      const current = activeRoomRef.current;
      if (!current) return;

      const newSong: RoomSong = {
        title,
        author,
        source,
        playedBy: currentUser.name || 'বন্ধু'
      };

      const systemMsg: ChatMessage = {
        id: `song_${Date.now()}`,
        senderId: 'system',
        senderName: 'SEU Adda রেডিও',
        characterId: currentUser.characterId,
        text: `🎶 ${currentUser.name || 'বন্ধু'} নতুন গান চালু করেছেন: "${title}"`,
        timestamp: 'এইমাত্র',
        isSystem: true
      };

      let updatedRoomState: AddaRoom | null = null;
      updateRoomState((prev) => {
        if (!prev) return null;
        const next = {
          ...prev,
          currentSong: newSong,
          messages: [...prev.messages, systemMsg]
        };
        updatedRoomState = next;
        return next;
      });

      if (isPhpBackend) {
        fetch('./api/rooms.php?action=song', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: current.id,
            song: newSong
          })
        }).catch(() => {});
      }

      dispatchRoomEvent({
        type: 'ROOM_SONG_CHANGE',
        roomId: current.id,
        senderId: currentUser.id,
        payload: newSong,
        timestamp: Date.now()
      });

      if (updatedRoomState) {
        publishRetainedState(updatedRoomState);
      }
    },
    [currentUser.characterId, currentUser.id, currentUser.name, dispatchRoomEvent, isPhpBackend, publishRetainedState, updateRoomState]
  );

  return {
    currentUser,
    saveCurrentUser,
    activeRoom,
    timeRemaining,
    roomError,
    setRoomError,
    isConnecting,
    activeSpeechBubbles,
    latestSpeech,
    createRoom,
    joinRoom,
    transferCharacter,
    leaveRoom,
    sendChatMessage,
    setRoomSong
  };
}
