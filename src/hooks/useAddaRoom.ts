import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { AddaRoom, ChatMessage, RoomParticipant, RoomSong, RoomSyncEvent } from '../types/room';

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const ROOM_STORAGE_PREFIX = 'seu_adda_room_';

export function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map(digit => (digit >= '0' && digit <= '9' ? bengaliDigits[parseInt(digit, 10)] : digit))
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
  return toBengaliNumber(parseInt(formatted.slice(0, 2), 10)) +
    ':' +
    toBengaliNumber(parseInt(formatted.slice(3, 5), 10)) +
    ':' +
    toBengaliNumber(parseInt(formatted.slice(6, 8), 10));
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
  // Current user info
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; dept: string }>(() => {
    try {
      const saved = localStorage.getItem('seu_room_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const newId = 'user_' + Math.random().toString(36).substring(2, 9);
    return { id: newId, name: '', dept: 'CSE' };
  });

  const [activeRoom, setActiveRoom] = useState<AddaRoom | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('০২:০০:০০');
  const [roomError, setRoomError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const activeRoomRef = useRef<AddaRoom | null>(null);
  activeRoomRef.current = activeRoom;

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const mqttClientRef = useRef<MqttClient | null>(null);

  // Save current user to local storage whenever updated
  const saveCurrentUser = useCallback((name: string, dept: string) => {
    setCurrentUser(prev => {
      const updated = { ...prev, name: name.trim(), dept: dept.trim() || 'CSE' };
      try {
        localStorage.setItem('seu_room_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Dispatch event over both BroadcastChannel (cross-tab) and MQTT WSS (cross-device)
  const dispatchRoomEvent = useCallback((event: RoomSyncEvent) => {
    // 1. BroadcastChannel (Local Tabs)
    try {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage(event);
      }
    } catch (e) {}

    // 2. MQTT (Internet Devices)
    try {
      if (mqttClientRef.current && mqttClientRef.current.connected) {
        const topic = `seu-adda/rooms/${event.roomId}`;
        mqttClientRef.current.publish(topic, JSON.stringify(event), { qos: 1 });
      }
    } catch (e) {}
  }, []);

  // Update room in state and local storage
  const updateRoomState = useCallback((updater: (prev: AddaRoom | null) => AddaRoom | null) => {
    setActiveRoom(prev => {
      const next = updater(prev);
      if (next) {
        try {
          localStorage.setItem(`${ROOM_STORAGE_PREFIX}${next.id}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
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
          updateRoomState(prev => {
            if (!prev) return null;
            if (prev.messages.some(m => m.id === msg.id)) return prev;
            return {
              ...prev,
              messages: [...prev.messages, msg]
            };
          });
        }
      } else if (event.type === 'ROOM_SONG_CHANGE') {
        if (current && current.id === event.roomId) {
          const newSong = event.payload as RoomSong;
          updateRoomState(prev => (prev ? { ...prev, currentSong: newSong } : null));
          if (newSong && newSong.source && onRoomSongChange) {
            onRoomSongChange(newSong.source);
          }
        }
      } else if (event.type === 'ROOM_JOIN') {
        if (current && current.id === event.roomId) {
          const newParticipant = event.payload.participant as RoomParticipant;
          const joinMsg = event.payload.systemMessage as ChatMessage;
          updateRoomState(prev => {
            if (!prev) return null;
            const exists = prev.participants.some(p => p.id === newParticipant.id);
            const updatedParticipants = exists
              ? prev.participants.map(p =>
                  p.id === newParticipant.id ? { ...p, lastSeen: Date.now() } : p
                )
              : [...prev.participants, newParticipant];

            const updatedMessages = joinMsg && !prev.messages.some(m => m.id === joinMsg.id)
              ? [...prev.messages, joinMsg]
              : prev.messages;

            return {
              ...prev,
              participants: updatedParticipants,
              messages: updatedMessages
            };
          });

          // Respond with current room state so new participant syncs immediately
          dispatchRoomEvent({
            type: 'ROOM_SYNC_RESPONSE',
            roomId: event.roomId,
            senderId: currentUser.id,
            payload: current,
            timestamp: Date.now()
          });
        }
      } else if (event.type === 'ROOM_LEAVE') {
        if (current && current.id === event.roomId) {
          const { participantId, systemMessage } = event.payload;
          updateRoomState(prev => {
            if (!prev) return null;
            const updatedParticipants = prev.participants.filter(p => p.id !== participantId);
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
          updateRoomState(prev => {
            if (!prev) return null;
            return {
              ...prev,
              participants: prev.participants.map(p =>
                p.id === participantId ? { ...p, lastSeen: Date.now() } : p
              )
            };
          });
        }
      } else if (event.type === 'ROOM_SYNC_RESPONSE') {
        const syncedRoom = event.payload as AddaRoom;
        if (syncedRoom && syncedRoom.id === event.roomId) {
          updateRoomState(prev => {
            if (!prev) return syncedRoom;
            // Merge messages without duplicates
            const allMsgs = [...prev.messages];
            for (const sm of syncedRoom.messages) {
              if (!allMsgs.some(m => m.id === sm.id)) {
                allMsgs.push(sm);
              }
            }
            return {
              ...syncedRoom,
              messages: allMsgs
            };
          });
        }
      }
    },
    [currentUser.id, dispatchRoomEvent, onRoomSongChange, updateRoomState]
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

  // 2-Hour TTL Countdown Timer & Expiration Handler (runs every second)
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(() => {
      const current = activeRoomRef.current;
      if (!current) return;

      const now = Date.now();
      const remainingMs = current.expiresAt - now;

      if (remainingMs <= 0) {
        // Room 2-hour duration has expired!
        clearInterval(interval);
        dispatchRoomEvent({
          type: 'ROOM_DESTROYED',
          roomId: current.id,
          senderId: currentUser.id,
          payload: { reason: 'expired' },
          timestamp: now
        });
        setActiveRoom(null);
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

  // Heartbeat & Empty Room Cleanup (runs every 10 seconds)
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
      updateRoomState(prev => {
        if (!prev) return null;
        const activeParticipants = prev.participants.filter(
          p => p.id === currentUser.id || now - p.lastSeen < 28000
        );

        // If everyone left (participants is 0 or only disconnected ghosts)
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

  // Check URL on load for ?room=ROOM_ID or #room=ROOM_ID
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      let queryRoom = searchParams.get('room');
      if (!queryRoom && window.location.hash.includes('room=')) {
        const hashMatch = window.location.hash.match(/room=([a-zA-Z0-9_-]+)/);
        if (hashMatch) queryRoom = hashMatch[1];
      }

      if (queryRoom) {
        const cleanedId = queryRoom.trim().toUpperCase();
        // Check if we have room in localStorage
        const saved = localStorage.getItem(`${ROOM_STORAGE_PREFIX}${cleanedId}`);
        if (saved) {
          const parsed = JSON.parse(saved) as AddaRoom;
          if (Date.now() < parsed.expiresAt) {
            // Room is still valid
            setActiveRoom(parsed);
          }
        }
      }
    } catch (e) {}
  }, []);

  // 1. Create a New Room (2 Hours Lifespan)
  const createRoom = useCallback(
    (roomTitle: string, hostName: string, hostDept: string): string => {
      setIsConnecting(true);
      setRoomError('');

      const cleanHostName = hostName.trim() || 'ক্যাম্পাস বন্ধু';
      const cleanDept = hostDept.trim() || 'CSE';
      const cleanTitle = roomTitle.trim() || 'সাউথইস্ট আড্ডা রুম';

      saveCurrentUser(cleanHostName, cleanDept);

      const roomId = generateRoomId();
      const now = Date.now();
      const expiresAt = now + 2 * 60 * 60 * 1000; // 2 hours

      const hostParticipant: RoomParticipant = {
        id: currentUser.id,
        name: cleanHostName,
        dept: cleanDept,
        joinedAt: now,
        lastSeen: now
      };

      const welcomeMsg: ChatMessage = {
        id: `sys_${now}`,
        senderId: 'system',
        senderName: 'SEU Adda সিস্টেম',
        text: `সাউথইস্ট আড্ডা রুমে স্বাগতম! 🎉 এই রুমটির মেয়াদ ঠিক ২ ঘণ্টা। রুম আইডি বা ইনভাইট লিংক শেয়ার করে বন্ধুদের সাথে গান শুনুন ও চ্যাট করুন ☕🎶`,
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

  // 2. Join an Existing Room
  const joinRoom = useCallback(
    (roomIdInput: string, userName: string, userDept: string): boolean => {
      const cleanedId = roomIdInput.trim().toUpperCase();
      if (!cleanedId) {
        setRoomError('অনুগ্রহ করে রুম আইডি লিখুন');
        return false;
      }

      const cleanName = userName.trim() || 'আড্ডাবাজ বন্ধু';
      const cleanDept = userDept.trim() || 'CSE';
      saveCurrentUser(cleanName, cleanDept);

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

      // If room not in localStorage, synthesize a joined state and request sync from peer
      if (!targetRoom) {
        // If room is completely unknown locally, we can create a temporary room shell and request state sync
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

      // Check if room has expired
      if (now >= targetRoom.expiresAt) {
        setRoomError('⚠️ এই রুমটির ২ ঘণ্টার মেয়াদ শেষ হয়ে গেছে। নতুন রুম তৈরি করুন।');
        setIsConnecting(false);
        try {
          localStorage.removeItem(`${ROOM_STORAGE_PREFIX}${cleanedId}`);
        } catch (_) {}
        return false;
      }

      const newParticipant: RoomParticipant = {
        id: currentUser.id,
        name: cleanName,
        dept: cleanDept,
        joinedAt: now,
        lastSeen: now
      };

      const joinMsg: ChatMessage = {
        id: `sys_join_${now}_${currentUser.id}`,
        senderId: 'system',
        senderName: 'SEU Adda সিস্টেম',
        text: `☕ ${cleanName} (${cleanDept}) আড্ডায় যোগ দিয়েছেন!`,
        timestamp: 'এইমাত্র',
        isSystem: true
      };

      const updatedParticipants = targetRoom.participants.some(p => p.id === currentUser.id)
        ? targetRoom.participants.map(p =>
            p.id === currentUser.id ? { ...p, lastSeen: now } : p
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

  // 3. Leave Room (Auto-delete if last person leaves)
  const leaveRoom = useCallback(() => {
    const current = activeRoomRef.current;
    if (!current) return;

    const now = Date.now();
    const remaining = current.participants.filter(p => p.id !== currentUser.id);

    const leaveMsg: ChatMessage = {
      id: `sys_leave_${now}_${currentUser.id}`,
      senderId: 'system',
      senderName: 'SEU Adda সিস্টেম',
      text: `👋 ${currentUser.name || 'একজন বন্ধু'} রুম ত্যাগ করেছেন।`,
      timestamp: 'এইমাত্র',
      isSystem: true
    };

    if (remaining.length === 0) {
      // Room is now empty! Auto delete immediately!
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
      // Other participants remain
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
    try {
      window.history.replaceState({}, '', window.location.pathname);
    } catch (e) {}
  }, [currentUser.id, currentUser.name, dispatchRoomEvent]);

  // 4. Send Chat Message
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
        text: trimmed,
        timestamp: formattedTime
      };

      updateRoomState(prev => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));

      dispatchRoomEvent({
        type: 'ROOM_CHAT_MESSAGE',
        roomId: current.id,
        senderId: currentUser.id,
        payload: newMsg,
        timestamp: Date.now()
      });
    },
    [currentUser.dept, currentUser.id, currentUser.name, dispatchRoomEvent, updateRoomState]
  );

  // 5. Broadcast Room Song Change (Synchronized playback for everyone in the room)
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
        text: `🎶 ${currentUser.name || 'বন্ধু'} নতুন গান চালু করেছেন: "${title}"`,
        timestamp: 'এইমাত্র',
        isSystem: true
      };

      updateRoomState(prev =>
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
    [currentUser.id, currentUser.name, dispatchRoomEvent, onRoomSongChange, updateRoomState]
  );

  return {
    currentUser,
    saveCurrentUser,
    activeRoom,
    timeRemaining,
    roomError,
    setRoomError,
    isConnecting,
    createRoom,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    setRoomSong
  };
}
