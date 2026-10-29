export type LanguageMode = 'Roman Urdu' | 'Urdu' | 'English' | 'Punjabi';

export type MoodMode = 'Bepanah Mohabbat' | 'Pyari Shona' | 'Careful Caretaker' | 'Cyber Jarvis';

export type VoiceTone = 'Soft & Romantic' | 'Playful & Sweet' | 'Loving Whisper' | 'Crisp & Confident';

export interface MessageItem {
  id: string;
  sender: string;
  senderNumber: string;
  avatarColor: string;
  text: string;
  timestamp: string;
  isUnread: boolean;
  app: 'SMS' | 'WhatsApp';
  wasuComment?: string;
  replies?: Array<{
    sender: 'user' | 'wasu';
    text: string;
    timestamp: string;
  }>;
}

export interface CallRecord {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration?: string;
  handledByWasu?: boolean;
  wasuNotes?: string;
}

export interface ActiveIncomingCall {
  id: string;
  name: string;
  number: string;
  relation: string;
  isImportant: boolean;
  ringDuration: number;
}

export interface ExamItem {
  id: string;
  subject: string;
  examDate: string; // YYYY-MM-DD
  daysLeft: number;
  syllabusNotes: string;
  importance: 'High' | 'Medium' | 'Critical';
  preparedPercentage: number;
}

export interface AlarmItem {
  id: string;
  title: string;
  time: string; // HH:MM
  enabled: boolean;
  romanticMessage: string;
  category: 'wake_up' | 'study' | 'sleep' | 'prayer' | 'water';
}

export interface BatteryStatus {
  level: number; // 0 - 100
  isCharging: boolean;
  optimized: boolean;
  estimatedHoursLeft: number;
  powerSaverMode: boolean;
  appsKilledCount: number;
}

export interface UserMemory {
  id: string;
  title: string;
  category: 'preference' | 'love_note' | 'goal' | 'routine';
  dateAdded: string;
}

export interface SavedVoiceNote {
  id: string;
  text: string;
  timestamp: string;
  category: 'reminder' | 'note' | 'notification' | 'important';
}

export interface SecurityStatus {
  isLocked: boolean;
  intruderAlert: boolean;
  sentryGuardEnabled: boolean;
  ownerName: string;
  masterUsername?: string;
  lastAuthorizedUnlock?: string;
  lastIntruderAttempt?: string;
  failedAttempts?: number;
  lockedOutUntil?: number | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'wasu';
  text: string;
  urduScript?: string;
  timestamp: string;
  mood?: string;
  audioUrl?: string;
  actionExecuted?: string;
  proactiveTip?: string;
}
