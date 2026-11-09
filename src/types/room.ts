export interface CampusCharacter {
  id: string;
  name: string;
  gender: 'male' | 'female';
  role: string;
  emoji: string;
  x: number; // Percentage coordinate (0-100)
  y: number; // Percentage coordinate (0-100)
}

export const CAMPUS_CHARACTERS: CampusCharacter[] = [
  // 6 Boys
  {
    id: 'guitarist',
    name: 'তানভীর',
    gender: 'male',
    role: 'গিটারিস্ট ও ভোকাল',
    emoji: '🎸',
    x: 54,
    y: 73
  },
  {
    id: 'blue_shirt_friend',
    name: 'রাহাত',
    gender: 'male',
    role: 'বাচাল ও বন্ধু',
    emoji: '🗣️',
    x: 41,
    y: 73
  },
  {
    id: 'front_blue_guy',
    name: 'শাকিল',
    gender: 'male',
    role: 'নিরব চা-শ্রোতা',
    emoji: '☕',
    x: 67,
    y: 84
  },
  {
    id: 'white_panjabi_guy',
    name: 'আবির',
    gender: 'male',
    role: 'সাদা পাঞ্জাবি বন্ধু',
    emoji: '✨',
    x: 77,
    y: 73
  },
  {
    id: 'plaid_shirt_guy',
    name: 'সিয়াম',
    gender: 'male',
    role: 'চেক শার্ট কোডার',
    emoji: '💻',
    x: 85,
    y: 74
  },
  {
    id: 'red_shirt_guy',
    name: 'মাহিন',
    gender: 'male',
    role: 'লাল শার্ট প্রেমিক',
    emoji: '📱',
    x: 94,
    y: 74
  },

  // 4 Girls
  {
    id: 'green_saree_girl',
    name: 'নিশাত',
    gender: 'female',
    role: 'সবুজ শাড়ি বান্ধবী',
    emoji: '🥻',
    x: 8,
    y: 74
  },
  {
    id: 'pink_salwar_girl',
    name: 'সামিয়া',
    gender: 'female',
    role: 'ক্লাস সিআর বান্ধবী',
    emoji: '📑',
    x: 15.5,
    y: 74
  },
  {
    id: 'cyan_salwar_girl',
    name: 'মালিহা',
    gender: 'female',
    role: 'আকাশি সালোয়ার বান্ধবী',
    emoji: '💬',
    x: 22.5,
    y: 74
  },
  {
    id: 'cream_dress_girl',
    name: 'আফসানা',
    gender: 'female',
    role: 'ক্রিম ড্রেস বান্ধবী',
    emoji: '📝',
    x: 29.5,
    y: 74
  }
];

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderDept?: string;
  characterId: string; // The character speaking this message
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface ActiveSpeechBubble {
  id: string;
  characterId: string;
  senderName: string;
  senderDept?: string;
  text: string;
  timestamp: string;
  expiresAt: number;
}

export interface RoomParticipant {
  id: string;
  name: string;
  dept?: string;
  gender: 'male' | 'female';
  characterId: string;
  joinedAt: number;
  lastSeen: number;
}

export interface RoomSong {
  title: string;
  author: string;
  source: string; // YouTube URL or ID
  playedBy: string;
}

export interface AddaRoom {
  id: string; // e.g. "SEU-8B42"
  name: string; // e.g. "সিএসই রাতের আড্ডা"
  hostId: string;
  hostName: string;
  createdAt: number;
  expiresAt: number; // exactly createdAt + 2 * 60 * 60 * 1000 (2 hours)
  currentSong?: RoomSong;
  messages: ChatMessage[];
  participants: RoomParticipant[];
}

export type RoomEventType =
  | 'ROOM_JOIN'
  | 'ROOM_LEAVE'
  | 'ROOM_CHAT_MESSAGE'
  | 'ROOM_SONG_CHANGE'
  | 'ROOM_HEARTBEAT'
  | 'ROOM_DESTROYED'
  | 'ROOM_CHARACTER_TRANSFER'
  | 'ROOM_SYNC_REQUEST'
  | 'ROOM_SYNC_RESPONSE';

export interface RoomSyncEvent {
  type: RoomEventType;
  roomId: string;
  senderId: string;
  payload: any;
  timestamp: number;
}
