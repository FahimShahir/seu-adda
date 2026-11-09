export type CampusZone = 'foreground' | 'midground' | 'background';

export interface CampusCharacter {
  id: string;
  name: string;
  gender: 'male' | 'female';
  role: string;
  emoji: string;
  zone: CampusZone;
  x: number; // Percentage coordinate (0-100)
  y: number; // Percentage coordinate (0-100)
}

export const CAMPUS_CHARACTERS: CampusCharacter[] = [
  // ==========================================
  // ১. FOREGROUND (সামনের সারির মূল আড্ডা: ১৩ জন)
  // ==========================================
  // বামে দাঁড়িয়ে থাকা দল (৩ জন)
  {
    id: 'standing_girl_1',
    name: 'সাদিয়া',
    gender: 'female',
    role: 'দাঁড়িয়ে থাকা ছাত্রী ১',
    emoji: '🙋‍♀️',
    zone: 'foreground',
    x: 11,
    y: 57
  },
  {
    id: 'standing_girl_2',
    name: 'নুসরাত',
    gender: 'female',
    role: 'দাঁড়িয়ে থাকা ছাত্রী ২',
    emoji: '🧕',
    zone: 'foreground',
    x: 14,
    y: 58
  },
  {
    id: 'standing_boy_1',
    name: 'সাজিদ',
    gender: 'male',
    role: 'দাঁড়িয়ে থাকা ছাত্র',
    emoji: '🧍‍♂️',
    zone: 'foreground',
    x: 17,
    y: 59
  },

  // বামে সিঁড়ির ধাপে বসা মেয়েরা (৪ জন)
  {
    id: 'green_saree_girl',
    name: 'নিশাত',
    gender: 'female',
    role: 'সবুজ শাড়ি বান্ধবী',
    emoji: '🥻',
    zone: 'foreground',
    x: 8,
    y: 74
  },
  {
    id: 'pink_salwar_girl',
    name: 'সামিয়া',
    gender: 'female',
    role: 'ক্লাস সিআর বান্ধবী',
    emoji: '📑',
    zone: 'foreground',
    x: 15.5,
    y: 74
  },
  {
    id: 'cyan_salwar_girl',
    name: 'মালিহা',
    gender: 'female',
    role: 'আকাশি সালোয়ার বান্ধবী',
    emoji: '💬',
    zone: 'foreground',
    x: 22.5,
    y: 74
  },
  {
    id: 'cream_dress_girl',
    name: 'আফসানা',
    gender: 'female',
    role: 'ক্রিম ড্রেস বান্ধবী',
    emoji: '📝',
    zone: 'foreground',
    x: 29.5,
    y: 74
  },

  // মাঝখানে গোল হয়ে বসাছে ছেলেরা (৬ জন)
  {
    id: 'blue_shirt_friend',
    name: 'রাহাত',
    gender: 'male',
    role: 'বাচাল ও বন্ধু',
    emoji: '🗣️',
    zone: 'foreground',
    x: 41,
    y: 73
  },
  {
    id: 'guitarist',
    name: 'তানভীর',
    gender: 'male',
    role: 'গিটারিস্ট ও ভোকাল',
    emoji: '🎸',
    zone: 'foreground',
    x: 54,
    y: 73
  },
  {
    id: 'front_blue_guy',
    name: 'শাকিল',
    gender: 'male',
    role: 'নিরব চা-শ্রোতা',
    emoji: '☕',
    zone: 'foreground',
    x: 67,
    y: 84
  },
  {
    id: 'white_panjabi_guy',
    name: 'আবির',
    gender: 'male',
    role: 'সাদা পাঞ্জাবি বন্ধু',
    emoji: '✨',
    zone: 'foreground',
    x: 77,
    y: 73
  },
  {
    id: 'plaid_shirt_guy',
    name: 'সিয়াম',
    gender: 'male',
    role: 'চেক শার্ট কোডার',
    emoji: '💻',
    zone: 'foreground',
    x: 85,
    y: 74
  },
  {
    id: 'red_shirt_guy',
    name: 'মাহিন',
    gender: 'male',
    role: 'লাল শার্ট প্রেমিক',
    emoji: '📱',
    zone: 'foreground',
    x: 94,
    y: 74
  },

  // ==========================================
  // ২. MIDGROUND (মাঝখানের সিঁড়ি ও প্ল্যাটফর্মে বসা: ৮ জন)
  // ==========================================
  // বাম পাশের সিঁড়িতে বসা দল (৩ জন)
  {
    id: 'mid_stairs_girl_1',
    name: 'তানিয়া',
    gender: 'female',
    role: 'সিঁড়িতে বসা আপু ১',
    emoji: '🎒',
    zone: 'midground',
    x: 34,
    y: 58
  },
  {
    id: 'mid_stairs_girl_2',
    name: 'রিয়া',
    gender: 'female',
    role: 'সিঁড়িতে বসা আপু ২',
    emoji: '🌸',
    zone: 'midground',
    x: 37,
    y: 58
  },
  {
    id: 'mid_stairs_girl_3',
    name: 'ফারহানা',
    gender: 'female',
    role: 'সিঁড়িতে বসা আপু ৩',
    emoji: '📚',
    zone: 'midground',
    x: 40,
    y: 58
  },

  // ডান পাশের সিঁড়িতে বসা দল (৫ জন)
  {
    id: 'mid_stairs_right_1',
    name: 'কাওসার',
    gender: 'male',
    role: 'সিঁড়ির উপরের ছাত্র',
    emoji: '🎧',
    zone: 'midground',
    x: 80,
    y: 60
  },
  {
    id: 'mid_stairs_right_2',
    name: 'মেহজাবিন',
    gender: 'female',
    role: 'সিঁড়ির আড্ডাবাজ আপু',
    emoji: '🌺',
    zone: 'midground',
    x: 83,
    y: 61
  },
  {
    id: 'mid_stairs_right_3',
    name: 'ফাহিম',
    gender: 'male',
    role: 'সিঁড়ির হাসিখুশি বন্ধু',
    emoji: '😎',
    zone: 'midground',
    x: 86,
    y: 61
  },
  {
    id: 'mid_stairs_right_4',
    name: 'জেরিন',
    gender: 'female',
    role: 'নোটস হাতে ছাত্রী',
    emoji: '📖',
    zone: 'midground',
    x: 89,
    y: 62
  },
  {
    id: 'mid_stairs_right_5',
    name: 'তারেক',
    gender: 'male',
    role: 'সিঁড়ির গল্পবাজ',
    emoji: '🧢',
    zone: 'midground',
    x: 92,
    y: 62
  },

  // ==========================================
  // ৩. BACKGROUND (পেছনের গেট, প্রবেশপথ ও বারান্দায়: ১৪ জন)
  // ==========================================
  // মাঝখানের সিকিউরিটি গেট ও প্রবেশপথে (৮ জন)
  {
    id: 'security_guard_1',
    name: 'কাদের মামা',
    gender: 'male',
    role: 'প্রধান গেট গার্ড',
    emoji: '👮‍♂️',
    zone: 'background',
    x: 52,
    y: 55
  },
  {
    id: 'security_guard_2',
    name: 'রফিক মামা',
    gender: 'male',
    role: 'সহকারী গার্ড',
    emoji: '🛡️',
    zone: 'background',
    x: 54.5,
    y: 55
  },
  {
    id: 'gate_walker_1',
    name: 'আসিফ',
    gender: 'male',
    role: 'ক্লাসে যাওয়া ছাত্র',
    emoji: '🚶‍♂️',
    zone: 'background',
    x: 57,
    y: 54
  },
  {
    id: 'gate_walker_2',
    name: 'সুমি',
    gender: 'female',
    role: 'ব্যাগ কাঁধে ছাত্রী',
    emoji: '🚶‍♀️',
    zone: 'background',
    x: 59.5,
    y: 54
  },
  {
    id: 'gate_walker_3',
    name: 'সোহেল',
    gender: 'male',
    role: 'দৌড়াতে থাকা ছাত্র',
    emoji: '🏃‍♂️',
    zone: 'background',
    x: 62,
    y: 55
  },
  {
    id: 'gate_walker_4',
    name: 'পপি',
    gender: 'female',
    role: 'গেটের মুখে ছাত্রী',
    emoji: '👒',
    zone: 'background',
    x: 64,
    y: 54
  },
  {
    id: 'gate_walker_5',
    name: 'জাহিদ',
    gender: 'male',
    role: 'মোবাইল ব্রাউজিং ছাত্র',
    emoji: '📲',
    zone: 'background',
    x: 66,
    y: 55
  },
  {
    id: 'gate_walker_6',
    name: 'নাঈম',
    gender: 'male',
    role: 'টার্নস্টাইল পাঞ্চ করা ছাত্র',
    emoji: '💳',
    zone: 'background',
    x: 68,
    y: 55
  },

  // বামে ও ডানের কোণায় (গেটের কাছে: ৪ জন)
  {
    id: 'left_pillar_guard',
    name: 'আনোয়ার ভাই',
    gender: 'male',
    role: 'পিলারের নিরাপত্তা কর্মী',
    emoji: '🔦',
    zone: 'background',
    x: 24,
    y: 56
  },
  {
    id: 'left_corner_student',
    name: 'শামীম',
    gender: 'male',
    role: 'কোণায় দাঁড়ানো ছাত্র',
    emoji: '🕶️',
    zone: 'background',
    x: 27,
    y: 56
  },
  {
    id: 'right_pillar_staff',
    name: 'বেলাল ভাই',
    gender: 'male',
    role: 'ডানের ক্যাম্পাস স্টাফ',
    emoji: '🧹',
    zone: 'background',
    x: 73,
    y: 56
  },
  {
    id: 'right_corner_student',
    name: 'মুন',
    gender: 'female',
    role: 'ডানের কোণায় ছাত্রী',
    emoji: '🎀',
    zone: 'background',
    x: 76,
    y: 56
  },

  // একেবারে ডানে দাঁড়িয়ে হেঁটে যাওয়া (২ জন)
  {
    id: 'far_right_walker_1',
    name: 'নাহিদ',
    gender: 'male',
    role: 'ক্লাসে লেট হওয়া ছাত্র',
    emoji: '⏰',
    zone: 'background',
    x: 95.5,
    y: 61
  },
  {
    id: 'far_right_walker_2',
    name: 'রোমেল',
    gender: 'male',
    role: 'সহপাঠী বন্ধু',
    emoji: '🏃',
    zone: 'background',
    x: 98,
    y: 61
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
