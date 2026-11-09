import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';

export interface Confession {
  id: string;
  author: string;
  dept?: string;
  batch?: string;
  text: string;
  timestamp: string;
  likes: number;
}

const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const CONFESSIONS_TOPIC = 'seu_campus_adda/global_confessions_v1';

const DEFAULT_CONFESSIONS: Confession[] = [
  {
    id: '1',
    author: 'নাম প্রকাশে অনিচ্ছুক',
    dept: 'CSE',
    batch: '52nd Batch',
    text: 'ক্যাম্পাসের সিঁড়িতে বইসা লাল চা আর গিটারের গানের আড্ডাটা মিস করব সবচেয়ে বেশি। এই আড্ডার কারণেই ভার্সিটি লাইফ এত সুন্দর ছিল!',
    timestamp: '১০ মিনিট আগে',
    likes: 42
  },
  {
    id: '2',
    author: 'ক্যান্টিনের নিয়মিত মুখ',
    dept: 'BBA',
    batch: '49th Batch',
    text: 'স্যার বলল অ্যাসাইনমেন্টে কপি করলে জিরো, অথচ পুরো ব্যাচ একজনের খাতা দেখেই জমা দিয়ে আসল! এটাই ক্যাম্পাস বন্ডিং।',
    timestamp: '১ ঘণ্টা আগে',
    likes: 67
  },
  {
    id: '3',
    author: 'লাস্ট বেঞ্চার',
    dept: 'EEE',
    batch: '50th Batch',
    text: '৪র্থ তলার লিফটের সামনে প্রতিদিন যে যুদ্ধ হয়... তার চেয়ে সিঁড়ি ভেঙে উপরে ওঠাই শান্তির!',
    timestamp: '৩ ঘণ্টা আগে',
    likes: 35
  },
  {
    id: '4',
    author: 'গিটার লাভার',
    dept: 'English',
    batch: '53rd Batch',
    text: 'বৃষ্টির দিনে ক্যাম্পাস চত্বরে বইসা গরম চা আর "আবার হাসিমুখ" গাওয়ার চেয়ে স্বর্গীয় অনুভূতি আর কিছু হইতে পারে না!',
    timestamp: 'গতকাল',
    likes: 89
  }
];

export function usePresenceAndConfessions() {
  const [onlineCount, setOnlineCount] = useState<number>(58);
  const [confessions, setConfessions] = useState<Confession[]>(() => {
    try {
      const saved = localStorage.getItem('seu_confessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_CONFESSIONS;
  });

  const confessionsRef = useRef<Confession[]>(confessions);
  confessionsRef.current = confessions;

  const mqttClientRef = useRef<MqttClient | null>(null);

  // Calculate realistic live online presence based on current hour in Bangladesh
  useEffect(() => {
    const updateCount = () => {
      const now = new Date();
      // Bangladesh is UTC+6
      const bdHour = (now.getUTCHours() + 6) % 24;
      let base = 45;
      if (bdHour >= 11 && bdHour <= 17) {
        base = 85; // Peak daytime campus hours
      } else if (bdHour >= 18 && bdHour <= 23) {
        base = 110; // Peak evening adda hours
      } else if (bdHour >= 0 && bdHour <= 4) {
        base = 35; // Late night night owls
      } else {
        base = 25; // Early morning
      }
      
      const jitter = Math.floor(Math.random() * 9) - 4;
      setOnlineCount(Math.max(12, base + jitter));
    };

    updateCount();
    const interval = setInterval(updateCount, 15000);
    return () => clearInterval(interval);
  }, []);

  // Realtime multi-device synchronization via HiveMQ WebSockets MQTT
  useEffect(() => {
    const clientId = 'seu_user_' + Math.random().toString(36).substring(2, 9);
    let client: MqttClient | null = null;

    try {
      client = mqtt.connect(MQTT_BROKER_URL, {
        clientId,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 5000
      });
      mqttClientRef.current = client;

      client.on('connect', () => {
        client?.subscribe(CONFESSIONS_TOPIC, { qos: 0 });
      });

      client.on('message', (_topic, message) => {
        try {
          const event = JSON.parse(message.toString());
          if (event?.senderId === clientId) return; // Ignore own echo

          if (event?.type === 'NEW_CONFESSION' && event.payload?.id) {
            setConfessions((prev) => {
              if (prev.some((c) => c.id === event.payload.id)) return prev;
              const updated = [event.payload, ...prev];
              try {
                localStorage.setItem('seu_confessions', JSON.stringify(updated));
              } catch (_) {}
              return updated;
            });
          } else if (event?.type === 'LIKE_CONFESSION' && event.payload?.id) {
            setConfessions((prev) => {
              const updated = prev.map((c) =>
                c.id === event.payload.id
                  ? { ...c, likes: event.payload.likes ?? c.likes + 1 }
                  : c
              );
              try {
                localStorage.setItem('seu_confessions', JSON.stringify(updated));
              } catch (_) {}
              return updated;
            });
          }
        } catch (_) {}
      });
    } catch (_) {}

    return () => {
      try {
        client?.end(true);
      } catch (_) {}
    };
  }, []);

  // Multi-tab synchronization via BroadcastChannel (local same-browser fallback)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('seu_adda_confessions_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'CONFESSIONS_UPDATE' && Array.isArray(event.data.payload)) {
            setConfessions(event.data.payload);
          }
        };
      }
    } catch (e) {}

    return () => {
      try {
        channel?.close();
      } catch (_) {}
    };
  }, []);

  const broadcastUpdate = (updatedList: Confession[]) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('seu_adda_confessions_sync');
        channel.postMessage({ type: 'CONFESSIONS_UPDATE', payload: updatedList });
        channel.close();
      }
    } catch (e) {}
  };

  const addConfession = useCallback((author: string, dept: string, text: string) => {
    const newConfession: Confession = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
      author: author.trim() || 'সাউথইস্টের একজন',
      dept: dept.trim() || 'General',
      text: text.trim(),
      timestamp: 'এইমাত্র',
      likes: 1
    };

    setConfessions((prev) => {
      const updated = [newConfession, ...prev];
      try {
        localStorage.setItem('seu_confessions', JSON.stringify(updated));
      } catch (e) {}
      broadcastUpdate(updated);
      return updated;
    });

    // Publish to real-time MQTT broker for cross-device broadcast
    try {
      if (mqttClientRef.current?.connected) {
        mqttClientRef.current.publish(
          CONFESSIONS_TOPIC,
          JSON.stringify({
            type: 'NEW_CONFESSION',
            payload: newConfession
          })
        );
      }
    } catch (_) {}
  }, []);

  const likeConfession = useCallback((id: string) => {
    let updatedLikes = 1;
    setConfessions((prev) => {
      const target = prev.find((c) => c.id === id);
      updatedLikes = target ? target.likes + 1 : 1;
      const updated = prev.map((c) => (c.id === id ? { ...c, likes: updatedLikes } : c));
      try {
        localStorage.setItem('seu_confessions', JSON.stringify(updated));
      } catch (e) {}
      broadcastUpdate(updated);
      return updated;
    });

    // Publish to real-time MQTT broker
    try {
      if (mqttClientRef.current?.connected) {
        mqttClientRef.current.publish(
          CONFESSIONS_TOPIC,
          JSON.stringify({
            type: 'LIKE_CONFESSION',
            payload: { id, likes: updatedLikes }
          })
        );
      }
    } catch (_) {}
  }, []);

  return {
    onlineCount,
    confessions,
    addConfession,
    likeConfession
  };
}

