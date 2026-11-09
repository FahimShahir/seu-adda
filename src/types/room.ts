export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderDept?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface RoomParticipant {
  id: string;
  name: string;
  dept?: string;
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
  | 'ROOM_SYNC_REQUEST'
  | 'ROOM_SYNC_RESPONSE';

export interface RoomSyncEvent {
  type: RoomEventType;
  roomId: string;
  senderId: string;
  payload: any;
  timestamp: number;
}
