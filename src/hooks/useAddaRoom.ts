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

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const ROOM_STORAGE_PREFIX = 'seu_adda_room_';

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

  const [activeRoom, setActiveRoom] = useState<AddaRoom | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('০২:০০:০০');
  const [roomError, setRoomError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Active floating speech bubbles list (supports wind drifting transitions)
  const [activeSpeechBubbles, setActiveSpeechBubbles] = useState<ActiveSpeechBubble[]>([]);
  
  // Latest speech for Photo Card auto-prefill
  const [latestSpeech, setLatestSpeech] = useState<{ speaker: string; text: string } | null>(null);

  const activeRoomRef = useRef<AddaRoom | null>(null);
  activeRoomRef.current = activeRoom;

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const mqttClientRef = useRef<MqttClient | null>(null);

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

  // Dispatch event over both BroadcastChannel (cross-tab) and MQTT WSS (cross-device)
  const dispatchRoomEvent = useCallback((event: RoomSyncEvent) => {
    try {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage(event);
      }
    } catch (e) {}

    try {
      if (mqttClientRef.current && mqttClientRef.current.connected) {
        const topic = `seu-adda/rooms/${event.roomId}`;
        mqttClientRef.current.publish(topic, JSON.stringify(event), { qos: 1 });
      }
    } catch (e) {}
  }, []);

  // Update room in state and local storage
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

  // Show a speech bubble over a specific character (30 seconds lifetime with gentle wind-drift on replacement)
  const triggerSpeechBubble = useCallback((msg: ChatMessage) => {
    if (!msg.characterId || msg.isSystem) return;

    const expiresAt = Date.now() + 30000; // 30 seconds duration
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
      // If there are existing bubbles for this character, mark them as isDrifting: true
      // and let them drift off in the breeze for 2.8s before removal
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

  // Handle incoming events from peer (local tab or remote device)
  const handleIncomingEvent = useCallback(
    (event: RoomSyncEvent) => {
      if (!event || !event.roomId) return;
      const current = activeRoomRef.current;

      // Ignore our own events
      if (event.senderId === currentUser.id) return;

      if (event.type === 'ROOM_DESTROYED') {
        if (current && current.id === event.roomId) {
          setActiveRoom(null);
          setActiveSpeechBubbles([]);
          setRoomError('⚠️ রুমে আর কেউ না থাকায় বা মেয়াদ শেষ হওয়ায় রুমটি মুছে গেছে।');
          try {
            localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${event.roomId}`);
            window.history.replaceState({}, '', window.location.pathname);
          } catch (e) {}
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

          // Trigger on-screen speech bubble for that character
          triggerSpeechBubble(msg);
        }
      } else if (event.type === 'ROOM_CHARACTER_TRANSFER') {
        if (current && current.id === event.roomId) {
          const { participantId, newCharacterId } = event.payload;
          updateRoomState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              participants: prev.participants.map((p) =>
                p.id === participantId ? { ...p, characterId: newCharacterId, lastSeen: Date.now() } : p
              )
            };
          });
        }
      } else if (event.type === 'ROOM_SONG_CHANGE') {
        if (current && current.id === event.roomId) {
          const newSong = event.payload as RoomSong;
          updateRoomState((prev) => (prev ? { ...prev, currentSong: newSong } : null));
          if (newSong && newSong.source && onRoomSongChange) {
            onRoomSongChange(newSong.source);
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
            const updatedParticipants = exists
              ? prev.participants.map((p) =>
                  p.id === newParticipant.id ? { ...p, lastSeen: Date.now() } : p
                )
              : [...prev.participants, newParticipant];

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

          // Respond with updated room state
          if (updatedRoomState) {
            dispatchRoomEvent({
              type: 'ROOM_SYNC_RESPONSE',
              roomId: event.roomId,
              senderId: currentUser.id,
              payload: updatedRoomState,
              timestamp: Date.now()
            });
          }
        }
      } else if (event.type === 'ROOM_LEAVE') {
        if (current && current.id === event.roomId) {
          const { participantId, systemMessage } = event.payload;
          updateRoomState((prev) => {
            if (!prev) return null;
            const updatedParticipants = prev.participants.filter((p) => p.id !== participantId);
            return {
              ...prev,
              participants: updatedParticipants,
              messages: systemMessage ? [...prev.messages, systemMessage] : prev.messages
            };
          });
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
      } else if (event.type === 'ROOM_SYNC_RESPONSE') {
        const syncedRoom = event.payload as AddaRoom;
        if (syncedRoom && syncedRoom.id === event.roomId) {
          updateRoomState((prev) => {
            if (!prev) return syncedRoom;
            const allMsgs = [...prev.messages];
            for (const sm of syncedRoom.messages) {
              if (!allMsgs.some((m) => m.id === sm.id)) {
                allMsgs.push(sm);
              }
            }

            // Union-merge participants by unique ID
            const pMap = new Map<string, RoomParticipant>();
            syncedRoom.participants.forEach((p) => pMap.set(p.id, p));
            prev.participants.forEach((p) => pMap.set(p.id, p));
            const mergedParticipants = Array.from(pMap.values());

            return {
              ...syncedRoom,
              participants: mergedParticipants,
              messages: allMsgs
            };
          });
        }
      }
    },
    [currentUser.id, dispatchRoomEvent, onRoomSongChange, triggerSpeechBubble, updateRoomState]
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

  // Setup MQTT client whenever activeRoom changes
  useEffect(() => {
    if (!activeRoom) {
      if (mqttClientRef.current) {
        mqttClientRef.current.end(true);
        mqttClientRef.current = null;
      }
      return;
    }

    const roomId = activeRoom.id;
    const topic = `seu-adda/rooms/${roomId}`;

    try {
      const client = mqtt.connect(MQTT_BROKER_URL, {
        clientId: `seu_${currentUser.id}_${Math.random().toString(16).substring(2, 6)}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000
      });

      mqttClientRef.current = client;

      client.on('connect', () => {
        client.subscribe(topic, { qos: 1 });
      });

      client.on('message', (_t, payload) => {
        try {
          const parsed = JSON.parse(payload.toString());
          handleIncomingEvent(parsed);
        } catch (err) {}
      });

      client.on('error', () => {});
    } catch (e) {}

    return () => {
      try {
        mqttClientRef.current?.end(true);
      } catch (_) {}
    };
  }, [activeRoom?.id, currentUser.id, handleIncomingEvent]);

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
            // Completely expired, remove
            changed = true;
          } else if (!bubble.isDrifting && bubble.expiresAt - now <= 2800) {
            // Reaching end of 30-second lifetime: catch the wind and float away
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

  // 2-Hour TTL Countdown Timer & Expiration Handler
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
          senderId: currentUser.id,
          payload: { reason: 'expired' },
          timestamp: now
        });
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
  }, [activeRoom, currentUser.id, dispatchRoomEvent]);

  // Heartbeat & Empty Room Cleanup (runs every 9 seconds)
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(() => {
      const current = activeRoomRef.current;
      if (!current) return;

      const now = Date.now();

      // Send our own heartbeat
      dispatchRoomEvent({
        type: 'ROOM_HEARTBEAT',
        roomId: current.id,
        senderId: currentUser.id,
        payload: { participantId: currentUser.id },
        timestamp: now
      });

      // Filter out participants inactive for > 28 seconds
      updateRoomState((prev) => {
        if (!prev) return null;
        const activeParticipants = prev.participants.filter(
          (p) => p.id === currentUser.id || now - p.lastSeen < 28000
        );

        if (activeParticipants.length === 0) {
          try {
            localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${prev.id}`);
          } catch (_) {}
          return null;
        }

        return {
          ...prev,
          participants: activeParticipants
        };
      });
    }, 9000);

    return () => clearInterval(interval);
  }, [activeRoom, currentUser.id, dispatchRoomEvent, updateRoomState]);

  // 1. Create a New Room (with gender & initial character selection)
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

      // Default character assignment
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
      setIsConnecting(false);

      dispatchRoomEvent({
        type: 'ROOM_JOIN',
        roomId,
        senderId: currentUser.id,
        payload: { participant: hostParticipant, systemMessage: welcomeMsg },
        timestamp: now
      });

      return roomId;
    },
    [currentUser.id, dispatchRoomEvent, saveCurrentUser]
  );

  // 2. Join an Existing Room (with gender & character selection)
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

      if (now >= targetRoom.expiresAt) {
        setRoomError('⚠️ এই রুমটির ২ ঘণ্টার মেয়াদ শেষ হয়ে গেছে। নতুন রুম তৈরি করুন।');
        setIsConnecting(false);
        try {
          localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${cleanedId}`);
        } catch (_) {}
        return false;
      }

      // Find best available character for this user (prevent duplicate/taken characters)
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

      dispatchRoomEvent({
        type: 'ROOM_JOIN',
        roomId: cleanedId,
        senderId: currentUser.id,
        payload: { participant: newParticipant, systemMessage: joinMsg },
        timestamp: now
      });

      return true;
    },
    [currentUser.id, dispatchRoomEvent, saveCurrentUser]
  );

  // 3. Transfer / Switch to Another Character (Exclusive Claim Enforcement)
  const transferCharacter = useCallback(
    (newCharacterId: string) => {
      const current = activeRoomRef.current;
      if (!current) return;

      const charObj = CAMPUS_CHARACTERS.find((c) => c.id === newCharacterId);
      if (!charObj) return;

      // EXCLUSIVE LOCK CHECK: If another participant has already claimed this character, block transfer!
      const isClaimedByOther = current.participants.some(
        (p) => p.characterId === newCharacterId && p.id !== currentUser.id
      );
      if (isClaimedByOther) {
        const owner = current.participants.find((p) => p.characterId === newCharacterId);
        setRoomError(`"${charObj.name}" ইতিমধ্যে ${owner?.name || 'অন্য বন্ধু'} দখল করে রেখেছেন! অন্য ক্যারেক্টার বেছে নিন।`);
        return false;
      }

      setRoomError('');
      saveCurrentUser(currentUser.name, currentUser.dept, charObj.gender, newCharacterId);

      updateRoomState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.map((p) =>
            p.id === currentUser.id ? { ...p, characterId: newCharacterId, gender: charObj.gender } : p
          )
        };
      });

      dispatchRoomEvent({
        type: 'ROOM_CHARACTER_TRANSFER',
        roomId: current.id,
        senderId: currentUser.id,
        payload: { participantId: currentUser.id, newCharacterId },
        timestamp: Date.now()
      });
      return true;
    },
    [currentUser.dept, currentUser.id, currentUser.name, dispatchRoomEvent, saveCurrentUser, updateRoomState]
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

    if (remaining.length === 0) {
      try {
        localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${current.id}`);
      } catch (e) {}
      dispatchRoomEvent({
        type: 'ROOM_DESTROYED',
        roomId: current.id,
        senderId: currentUser.id,
        payload: { reason: 'empty' },
        timestamp: now
      });
    } else {
      const updatedRoom: AddaRoom = {
        ...current,
        participants: remaining,
        messages: [...current.messages, leaveMsg]
      };
      try {
        localStorage.setItem(`${ROOM_STORAGE_PREFIX}${current.id}`, JSON.stringify(updatedRoom));
      } catch (e) {}
      dispatchRoomEvent({
        type: 'ROOM_LEAVE',
        roomId: current.id,
        senderId: currentUser.id,
        payload: { participantId: currentUser.id, systemMessage: leaveMsg },
        timestamp: now
      });
    }

    setActiveRoom(null);
    setActiveSpeechBubbles([]);
    try {
      window.history.replaceState({}, '', window.location.pathname);
    } catch (e) {}
  }, [currentUser.characterId, currentUser.id, currentUser.name, dispatchRoomEvent]);

  // 5. Send Chat Message (Trigger speech bubble over my character)
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

      updateRoomState((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));

      // Trigger local speech bubble immediately
      triggerSpeechBubble(newMsg);

      dispatchRoomEvent({
        type: 'ROOM_CHAT_MESSAGE',
        roomId: current.id,
        senderId: currentUser.id,
        payload: newMsg,
        timestamp: Date.now()
      });
    },
    [currentUser.characterId, currentUser.dept, currentUser.id, currentUser.name, dispatchRoomEvent, triggerSpeechBubble, updateRoomState]
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

      updateRoomState((prev) =>
        prev
          ? {
              ...prev,
              currentSong: newSong,
              messages: [...prev.messages, systemMsg]
            }
          : null
      );

      dispatchRoomEvent({
        type: 'ROOM_SONG_CHANGE',
        roomId: current.id,
        senderId: currentUser.id,
        payload: newSong,
        timestamp: Date.now()
      });

      if (onRoomSongChange) {
        onRoomSongChange(source);
      }
    },
    [currentUser.characterId, currentUser.id, currentUser.name, dispatchRoomEvent, onRoomSongChange, updateRoomState]
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
