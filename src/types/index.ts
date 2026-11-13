export type LanguageCode = 'ur' | 'pa' | 'en';
export type VoiceGender = 'male' | 'female' | 'custom';
export type AccentTheme = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'blue' | 'custom';

export interface CustomVoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  audioBlobUrl?: string;
  audioBase64?: string;
  pitch: number;
  rate: number;
  description?: string;
  dateAdded: string;
}

export type JarvisInterfaceThemeId =
  | 'quantum_cockpit'     // Original Command Room (images_ea059939.jpg)
  | 'vector_hud_gui'      // Vector HUD GUI 4 (vector-hud-gui-interface-004_e93adaf2.jpg)
  | 'ironman_shield'      // Iron Man Arc Reactor & S.H.I.E.L.D. OS (images__1__d271a28a.jpg)
  | 'carbon_industrial'   // Carbon Fiber Industrial Jarvis Console (images__2__c5f03e7f.jpg)
  | 'stark_mark3'         // Stark Industries Mark III Tactical Defense (images__3__0fd67f24.jpg)
  | 'cosmic_nebula'       // Deep Space Cosmic Nebula Jarvis (images__4__27575c52.jpg)
  | 'mark_85_deck';       // Mark LXXXV Holographic Command Deck (images_be3c8b70.jpg)

export type AvatarRenderMode = '2d' | 'real_girl' | 'custom_2d' | 'custom_3d';
export type StandbyAnimationType = 'breathe' | 'float' | 'pulse' | 'sway';
export type AvatarBodyMovement =
  | 'idle'
  | 'wave'
  | 'dance'
  | 'walk'
  | 'spin'
  | 'heart'
  | 'hug'
  | 'salute'
  | 'sit'
  | 'jump'
  | 'nod';

export interface AvatarStudioConfig {
  mode: AvatarRenderMode;
  avatarIndex: number; // 0..99 (100 2D avatars)
  outfitIndex: number; // 0..104 (105+ outfits)
  hairstyleIndex: number; // 0..53 (54+ hairstyles)
  hairColor: string;
  accessories: string[];
  custom2DUrl: string;
  custom3DUrl: string;
  custom3DName: string;
  standbyAnimation: StandbyAnimationType;
  autoOutfitChange: boolean;
  autoOutfitIntervalSec: number;
  floatingAvatarEnabled: boolean;
  personalityId: string;
  fastTalkingMode: boolean;
  useElevenLabs: boolean;
  elevenLabsVoiceId: string;
  customWakeWords: string[];
}

export interface DashboardCustomization {
  accentTheme: AccentTheme;
  customAccentHex: string;
  customLogoUrl: string;
  customBgUrl: string;
  show3DBackground: boolean;
  activeInterfaceTheme?: JarvisInterfaceThemeId;
  screensaverType: 'sentry' | 'matrix' | 'nebula' | 'vortex';
  screensaverTimeoutMinutes: number;
  screensaverMessage: string;
  continuousWorkLimitMinutes: number;
  mandatoryRestMinutes: number;
  scanlines: boolean;
  hudGlowLevel: 'subtle' | 'vibrant' | 'ultra';
  customVoices: CustomVoiceProfile[];
  activeVoiceMode: VoiceGender;
  activeCustomVoiceId?: string;
  avatarConfig?: AvatarStudioConfig;
}

export interface UserProfile {
  username: string;
  displayName: string;
  title: string;
  preferredLanguage: LanguageCode;
  voiceGender: VoiceGender;
  dailyWaterTargetGlasses: number;
  dailyFocusTargetMinutes: number;
  monthlyBudget: number;
  emergencyFundTarget: number;
  primarySoftwares: string[];
  personalNotes: string[];
  goals: string[];
}

export interface SystemTelemetry {
  cpuUsage: number;
  cpuTemp: number;
  cpuFreq: number;
  gpuUsage: number;
  gpuTemp: number;
  gpuVramUsed: number;
  gpuVramTotal: number;
  ramUsed: number;
  ramTotal: number;
  storageUsed: number;
  storageTotal: number;
  quantumCoherence: number;
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
  uptimeSeconds: number;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'editing' | 'coding' | 'fitness' | 'finance' | 'general';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  assignedToJarvis?: boolean;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'hardware' | 'food' | 'subscriptions' | 'personal' | 'investment' | 'bills';
  isFazoolKharchi: boolean;
  date: string;
  notes?: string;
}

export interface HealthState {
  waterDrankGlasses: number;
  lastWaterReminder: number;
  eyeRestIntervalMinutes: number;
  lastEyeRest: number;
  postureAlertsCount: number;
  mealsLogged: {
    meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Healthy Snack';
    desc: string;
    calories: number;
    proteinGrams: number;
    healthy: boolean;
  }[];
  sleepHoursLastNight: number;
  dailySteps: number;
}

export interface EditingMacro {
  id: string;
  software: 'Premiere Pro' | 'After Effects' | 'Photoshop' | 'VS Code' | 'Blender';
  title: string;
  commandSnippet: string;
  voicePromptUrdu: string;
  voicePromptEnglish: string;
  voicePromptPunjabi: string;
  category: 'render' | 'cut' | 'color' | 'cleanup' | 'proxy';
}

export interface FileItem {
  name: string;
  type: 'video' | 'image' | 'audio' | 'document' | 'archive' | 'code';
  size: string;
  path: string;
  suggestedFolder: string;
  selected?: boolean;
}

export interface JarvisChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  language?: LanguageCode;
  timestamp: string;
  actionExecuted?: string;
  quantumTelemetry?: string;
  imageUrl?: string;
  videoUrl?: string;
  youtubeMeta?: {
    title: string;
    author?: string;
    thumbnailUrl?: string;
    url: string;
  };
  screenSnapshotUrl?: string;
}

export interface AppConnectorItem {
  id: string;
  name: 'Gmail' | 'Slack' | 'Notion' | 'GitHub' | 'Google Calendar' | 'Trello' | 'Asana' | 'Jira';
  category: 'communication' | 'productivity' | 'development' | 'project';
  connected: boolean;
  statusText: string;
  lastSync: string;
  activeItemsCount: number;
  quickActionLabel: string;
}

export interface DockerContainerItem {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'restarting';
  uptime: string;
  cpuPercent: number;
  memUsageMb: number;
  ports: string;
}

export interface ScheduledRoutineItem {
  id: string;
  title: string;
  schedule: string;
  category: 'workflow' | 'maintenance' | 'health' | 'sync';
  steps: string[];
  enabled: boolean;
  lastExecuted: string;
}

export interface CommMessageItem {
  id: string;
  platform: 'whatsapp' | 'telegram' | 'slack' | 'email';
  sender: string;
  snippet: string;
  receivedTime: string;
  priority: 'urgent' | 'high' | 'normal';
  autoDraftReply: string;
  status: 'unread' | 'replied' | 'pending';
}

export interface MeetingItem {
  id: string;
  title: string;
  platform: 'Google Meet' | 'Zoom';
  time: string;
  durationMinutes: number;
  attendees: string[];
  link: string;
  conflictDetected: boolean;
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Integration' | 'Feature';
  priority: 'P1 - Critical' | 'P2 - High' | 'P3 - Medium';
  status: 'Open' | 'In Review' | 'Resolved';
  autoDraftReply: string;
}

export interface DecomposedTaskItem {
  id: string;
  title: string;
  category: 'backend' | 'frontend' | 'devops' | 'testing';
  hours: number;
  dependencies: string[];
  priority: 'critical' | 'high' | 'medium';
  completed: boolean;
}

export interface JiraGitHubIssueItem {
  id: string;
  provider: 'Jira' | 'GitHub';
  issueKey: string;
  title: string;
  type: 'Bug' | 'Feature' | 'Task' | 'Refactor';
  priority: 'Highest' | 'High' | 'Medium';
  assignee: string;
  status: 'Backlog' | 'In Progress' | 'Done';
}

export type DeviceType = 'mobile' | 'tablet' | 'wearable' | 'smart_light' | 'audio_dac' | 'smart_plug' | 'peripherals';
export type DeviceConnectionProtocol = 'BLE' | 'WiFi_LAN' | 'USB_C' | 'Cloud_Relay';

export interface ConnectedDeviceItem {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  osVersion?: string;
  protocol: DeviceConnectionProtocol;
  ipAddress?: string;
  batteryPercent?: number;
  isCharging?: boolean;
  signalStrengthDbm?: number;
  status: 'online' | 'standby' | 'syncing' | 'offline';
  lastPing: string;
  paired: boolean;
  controllableStates: {
    power?: boolean;
    brightness?: number; // 0-100 for smart lights
    colorHex?: string; // for RGB lights
    volume?: number; // 0-100 for audio
    hotspotActive?: boolean; // for mobile
    screenLocked?: boolean; // for mobile/tablet
    doNotDisturb?: boolean;
    ringing?: boolean;
  };
  metrics?: {
    storageUsedGb?: number;
    storageTotalGb?: number;
    ramUsedPercent?: number;
    heartRateBpm?: number; // for wearable
    stepsToday?: number; // for wearable
  };
  location?: {
    lat: number;
    lng: number;
    locationName: string;
  };
}

export interface MapLocationItem {
  id: string;
  title: string;
  category: 'base' | 'studio' | 'device' | 'poi' | 'waypoint';
  lat: number;
  lng: number;
  description: string;
  accuracyMeters?: number;
  associatedDeviceId?: string;
}

export interface DeviceCommandLog {
  id: string;
  deviceId: string;
  deviceName: string;
  action: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}
