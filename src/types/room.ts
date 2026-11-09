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
    y: 58
  },
  {
    id: 'standing_girl_2',
    name: 'নুসরাত',
    gender: 'female',
    role: 'দাঁড়িয়ে থাকা ছাত্রী ২',
    emoji: '🧕',
    zone: 'foreground',
    x: 14,
    y: 59
  },
  {
    id: 'standing_boy_1',
    name: 'সাজিদ',
    gender: 'male',
    role: 'দাঁড়িয়ে থাকা ছাত্র',
    emoji: '🧍‍♂️',
    zone: 'foreground',
    x: 17.5,
    y: 60
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

  // মাঝখানে গোল হয়ে বসা ছেলেরা (৬ জন)
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
  // ২. MIDGROUND (মাঝখানের সিঁড়ি ও প্ল্যাটফর্মে বসা: ১০ জন)
  // ==========================================
  // বাম পাশের সিঁড়িতে বসা আপুরা (৩ জন)
  {
    id: 'mid_stairs_girl_1',
    name: 'তানিয়া',
    gender: 'female',
    role: 'সিঁড়ির মেরুন সালোয়ার আপু',
    emoji: '🎒',
    zone: 'midground',
    x: 33.5,
    y: 61.5
  },
  {
    id: 'mid_stairs_girl_2',
    name: 'রিয়া',
    gender: 'female',
    role: 'সিঁড়ির বেগুনি সালোয়ার আপু',
    emoji: '🌸',
    zone: 'midground',
    x: 37,
    y: 61.5
  },
  {
    id: 'mid_stairs_girl_3',
    name: 'ফারহানা',
    gender: 'female',
    role: 'সিঁড়ির হলুদ সালোয়ার আপু',
    emoji: '📚',
    zone: 'midground',
    x: 40,
    y: 61.5
  },

  // ডান পাশের সিঁড়ির ধাপে বসা ২ জন মেয়ে (ডিটেক্টেড!)
  {
    id: 'stairs_girl_magenta',
    name: 'মেহজাবিন',
    gender: 'female',
    role: 'সিঁড়ির ম্যাজেন্টা সালোয়ার ছাত্রী',
    emoji: '💜',
    zone: 'midground',
    x: 72,
    y: 61.5
  },
  {
    id: 'stairs_girl_black',
    name: 'জেরিন',
    gender: 'female',
    role: 'সিঁড়ির কালো পোশাক ও ওড়না ছাত্রী',
    emoji: '🖤',
    zone: 'midground',
    x: 75.5,
    y: 61.5
  },

  // ডান পাশের উপরের প্ল্যাটফর্মে বসা দল (৫ জন)
  {
    id: 'mid_stairs_right_1',
    name: 'কাওসার',
    gender: 'male',
    role: 'প্ল্যাটফর্মের নীল শার্ট ছাত্র',
    emoji: '🎧',
    zone: 'midground',
    x: 80.5,
    y: 60.5
  },
  {
    id: 'mid_stairs_right_2',
    name: 'ফাহিম',
    gender: 'male',
    role: 'প্ল্যাটফর্মের সাদা শার্ট বন্ধু',
    emoji: '😎',
    zone: 'midground',
    x: 83.5,
    y: 58
  },
  {
    id: 'mid_stairs_right_3',
    name: 'রুমানা',
    gender: 'female',
    role: 'প্ল্যাটফর্মের লাল পোশাক ছাত্রী',
    emoji: '🌺',
    zone: 'midground',
    x: 86.5,
    y: 61.5
  },
  {
    id: 'mid_stairs_right_4',
    name: 'তারেক',
    gender: 'male',
    role: 'প্ল্যাটফর্মের গল্পবাজ কোডার',
    emoji: '🧢',
    zone: 'midground',
    x: 88.5,
    y: 58.5
  },
  {
    id: 'mid_stairs_right_5',
    name: 'মুন',
    gender: 'female',
    role: 'প্ল্যাটফর্মের গোলাপি ড্রেস ছাত্রী',
    emoji: '🎀',
    zone: 'midground',
    x: 91,
    y: 61
  },

  // ==========================================
  // ৩. BACKGROUND (পেছনের গেট, প্রবেশপথ ও বারান্দায়: ১২ জন)
  // ==========================================
  // বামের লাল ইটের ভবনের দরজায় অপেক্ষারত ছাত্র (১ জন)
  {
    id: 'brick_door_student',
    name: 'শামীম',
    gender: 'male',
    role: 'দরজার মুখে অপেক্ষারত ছাত্র',
    emoji: '🚪',
    zone: 'background',
    x: 34,
    y: 55.5
  },

  // মাঝখানের সিকিউরিটি গেট ও টার্নস্টাইলে যাতায়াতকারী দল (৯ জন)
  {
    id: 'security_gate_1',
    name: 'আসিফ',
    gender: 'male',
    role: 'গেটের মুখে দাঁড়ানো ছাত্র',
    emoji: '🚶‍♂️',
    zone: 'background',
    x: 48.5,
    y: 55
  },
  {
    id: 'security_guard_1',
    name: 'কাদের মামা',
    gender: 'male',
    role: 'প্রধান গেট গার্ড',
    emoji: '👮‍♂️',
    zone: 'background',
    x: 51.5,
    y: 55
  },
  {
    id: 'security_gate_2',
    name: 'সুমি',
    gender: 'female',
    role: 'ব্যাগ কাঁধে ছাত্রী',
    emoji: '🚶‍♀️',
    zone: 'background',
    x: 54,
    y: 54.5
  },
  {
    id: 'security_guard_2',
    name: 'রফিক মামা',
    gender: 'male',
    role: 'সহকারী গার্ড',
    emoji: '🛡️',
    zone: 'background',
    x: 56.5,
    y: 55
  },
  {
    id: 'security_gate_3',
    name: 'সোহেল',
    gender: 'male',
    role: 'গেটে ঢোকার ছাত্র',
    emoji: '🏃‍♂️',
    zone: 'background',
    x: 58.5,
    y: 55
  },
  {
    id: 'security_gate_4',
    name: 'পপি',
    gender: 'female',
    role: 'টার্নস্টাইলের মুখে ছাত্রী',
    emoji: '👒',
    zone: 'background',
    x: 61,
    y: 54.5
  },
  {
    id: 'security_gate_5',
    name: 'জাহিদ',
    gender: 'male',
    role: 'মোবাইল হাতে ছাত্র',
    emoji: '📲',
    zone: 'background',
    x: 63,
    y: 55
  },
  {
    id: 'security_gate_6',
    name: 'নাঈম',
    gender: 'male',
    role: 'টার্নস্টাইল পাঞ্চ করা ছাত্র',
    emoji: '💳',
    zone: 'background',
    x: 65.5,
    y: 55
  },
  {
    id: 'security_gate_7',
    name: 'বেলাল ভাই',
    gender: 'male',
    role: 'গেটের ক্যাম্পাস স্টাফ',
    emoji: '🧹',
    zone: 'background',
    x: 67.5,
    y: 55
  },

  // একেবারে ডানে হেঁটে যাওয়া ২ জন ছাত্র (২ জন)
  {
    id: 'far_right_walker_1',
    name: 'নাহিদ',
    gender: 'male',
    role: 'করিডোরে হেঁটে যাওয়া ছাত্র ১',
    emoji: '⏰',
    zone: 'background',
    x: 93.5,
    y: 61.5
  },
  {
    id: 'far_right_walker_2',
    name: 'রোমেল',
    gender: 'male',
    role: 'করিডোরে হেঁটে যাওয়া ছাত্র ২',
    emoji: '🏃',
    zone: 'background',
    x: 96.5,
    y: 61.5
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
