export type DeviceType = 'light' | 'thermostat' | 'lock' | 'drone' | 'sound' | 'robotics';

export type RoomType = 'living' | 'lab' | 'office' | 'security' | 'media';

export interface Device {
  id: string;
  name: string;
  room: RoomType;
  roomLabel: string;
  type: DeviceType;
  status: boolean; // on/off, locked/unlocked, active/standby
  value?: number; // brightness (0-100), temp (16-30), volume (0-100)
  color?: string; // hex
  meta?: {
    battery?: number;
    mode?: string;
    speed?: string;
    currentTrack?: string;
    temperatureTarget?: number;
    humidity?: number;
  };
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'work' | 'meeting' | 'lab' | 'personal' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  completed: boolean;
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolsCalled?: Array<{
    name: string;
    args: Record<string, any>;
  }>;
  searchSources?: SearchSource[];
  audioBase64?: string;
  blueprintUrl?: string;
}

export type ProtocolType = 'normal' | 'lockdown' | 'party_mode' | 'focus_lab' | 'night_owl' | 'morning_briefing';

export interface Protocol {
  id: ProtocolType;
  name: string;
  code: string;
  description: string;
  color: string;
  iconName: string;
}

export type JarvisActivityStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'alert' | 'thinking';

export type ActiveTab =
  | 'osiris'
  | 'cowork'
  | 'directives'
  | 'osint'
  | 'devices'
  | 'agenda'
  | 'blueprints';

