import { UserProfile, TaskItem, ExpenseItem, HealthState, EditingMacro, FileItem, DashboardCustomization, AvatarStudioConfig } from "../types";

const STORAGE_KEYS = {
  USER_PROFILE: "q_nexus_user_profile",
  TASKS: "q_nexus_tasks",
  EXPENSES: "q_nexus_expenses",
  HEALTH: "q_nexus_health",
  CHAT_LOGS: "q_nexus_chat_logs",
  SECURITY: "q_nexus_security",
  SETTINGS: "q_nexus_settings",
  CUSTOMIZATION: "q_nexus_customization",
};

export const defaultAvatarConfig: AvatarStudioConfig = {
  mode: "real_girl",
  avatarIndex: 0,
  outfitIndex: 0,
  hairstyleIndex: 0,
  hairColor: "#0f172a",
  accessories: [],
  custom2DUrl: "",
  custom3DUrl: "",
  custom3DName: "",
  standbyAnimation: "breathe",
  autoOutfitChange: false,
  autoOutfitIntervalSec: 12,
  floatingAvatarEnabled: true,
  personalityId: "sweet_girlfriend",
  fastTalkingMode: true,
  useElevenLabs: false,
  elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL",
  customWakeWords: ["haath hilao", "dance karo", "flying kiss", "ghoom jao"],
};

export const defaultCustomization: DashboardCustomization = {
  accentTheme: "cyan",
  customAccentHex: "#06b6d4",
  customLogoUrl: "",
  customBgUrl: "",
  show3DBackground: true,
  activeInterfaceTheme: "quantum_cockpit",
  screensaverType: "sentry",
  screensaverTimeoutMinutes: 5,
  screensaverMessage: "QUANTUM SENTRY PATROL ACTIVE • WORKSTATION PROTECTED",
  continuousWorkLimitMinutes: 45,
  mandatoryRestMinutes: 5,
  scanlines: false,
  hudGlowLevel: "ultra",
  customVoices: [
    {
      id: "voice-zoya-pak-urdu",
      name: "Zoya (Clear Pakistani Urdu Girlfriend)",
      gender: "female",
      pitch: 1.12,
      rate: 0.98,
      description: "Crystal-clear affectionate Pakistani Urdu female accent",
      dateAdded: "Default Preset",
    },
    {
      id: "voice-wasi-clone",
      name: "Commander Wasi (Male Backup)",
      gender: "male",
      pitch: 0.85,
      rate: 0.98,
      description: "Authoritative resonant male voice profile",
      dateAdded: "Default Preset",
    },
  ],
  activeVoiceMode: "female",
  activeCustomVoiceId: "voice-zoya-pak-urdu",
  avatarConfig: defaultAvatarConfig,
};

export const defaultUserProfile: UserProfile = {
  username: "wasu3005",
  displayName: "Wasi",
  title: "Commander & Creator",
  preferredLanguage: "ur",
  voiceGender: "female",
  dailyWaterTargetGlasses: 8,
  dailyFocusTargetMinutes: 120,
  monthlyBudget: 150000,
  emergencyFundTarget: 500000,
  primarySoftwares: [
    "Adobe Premiere Pro 2025",
    "Adobe After Effects",
    "Adobe Photoshop",
    "Visual Studio Code",
    "Blender 4.2",
    "OBS Studio",
  ],
  personalNotes: [
    "Workstation Telemetry: Synced live with Host PC Hardware Probe",
    "Diet Priority: High protein, clean meals, avoid late night snacks & oily food",
    "Workout: Evening 6:00 PM - 7:00 PM (Strength & Cardio)",
    "Financial Policy: Always save 30% of earnings; analyze before buying non-essentials",
  ],
  goals: [
    "Master advanced 3D Motion Graphics & Unreal Engine",
    "Complete YouTube high-retention video project before weekend",
    "Drink 8 glasses of pure water every single day without fail",
    "Maintain 100% Fazool Kharchi defense on online shopping",
  ],
};

export const defaultTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Export Final 4K Master in Adobe Premiere Pro",
    category: "editing",
    priority: "high",
    completed: false,
    dueDate: "Today, 6:00 PM",
    assignedToJarvis: true,
  },
  {
    id: "task-2",
    title: "Review monthly investment yield & budget allocation",
    category: "finance",
    priority: "medium",
    completed: false,
    dueDate: "Tomorrow",
    assignedToJarvis: false,
  },
  {
    id: "task-3",
    title: "Complete 45 min strength workout & 30 min brisk walk",
    category: "fitness",
    priority: "high",
    completed: true,
    dueDate: "Today",
    assignedToJarvis: false,
  },
  {
    id: "task-4",
    title: "Clean temp cache & backup Premiere project to SSD D:",
    category: "editing",
    priority: "medium",
    completed: false,
    dueDate: "Tonight",
    assignedToJarvis: true,
  },
];

export const defaultExpenses: ExpenseItem[] = [
  {
    id: "exp-1",
    title: "Cloud Backup & Adobe Creative Cloud Subscription",
    amount: 9800,
    category: "subscriptions",
    isFazoolKharchi: false,
    date: "Yesterday",
    notes: "Essential for client video deliveries",
  },
  {
    id: "exp-2",
    title: "Healthy High-Protein Groceries (Eggs, Chicken, Nuts)",
    amount: 14500,
    category: "food",
    isFazoolKharchi: false,
    date: "3 days ago",
    notes: "Meal prep nutrition",
  },
  {
    id: "exp-3",
    title: "High-Speed NVMe 2TB Samsung Pro Drive",
    amount: 32000,
    category: "hardware",
    isFazoolKharchi: false,
    date: "1 week ago",
    notes: "Crucial for 4K ProRes 422 HQ footage playback",
  },
  {
    id: "exp-4",
    title: "Unnecessary Late-Night Delivery Junk Food",
    amount: 3200,
    category: "food",
    isFazoolKharchi: true,
    date: "5 days ago",
    notes: "Jarvis flagged: High calories & wasteful expense",
  },
];

export const defaultHealthState: HealthState = {
  waterDrankGlasses: 5,
  lastWaterReminder: Date.now() - 35 * 60 * 1000,
  eyeRestIntervalMinutes: 20,
  lastEyeRest: Date.now() - 15 * 60 * 1000,
  postureAlertsCount: 3,
  mealsLogged: [
    {
      meal: "Breakfast",
      desc: "3 Boiled Eggs, Whole wheat toast, Green Tea",
      calories: 420,
      proteinGrams: 28,
      healthy: true,
    },
    {
      meal: "Lunch",
      desc: "Grilled Chicken Breast, Lentils (Daal), Mixed Green Salad",
      calories: 580,
      proteinGrams: 46,
      healthy: true,
    },
  ],
  sleepHoursLastNight: 7.5,
  dailySteps: 7420,
};

export const defaultMacros: EditingMacro[] = [
  {
    id: "macro-1",
    software: "Premiere Pro",
    title: "Auto-Cut Audio Silences & Breaths",
    commandSnippet: "premiere.exec('ripple_delete_gaps_threshold(-38dB)')",
    voicePromptUrdu: "Premiere main khamoshi aur pauses cut kar do",
    voicePromptEnglish: "Auto cut silences in Premiere Pro",
    voicePromptPunjabi: "Premiere ch pause te silence cut kar de",
    category: "cut",
  },
  {
    id: "macro-2",
    software: "Premiere Pro",
    title: "Apply Cinema Teal & Orange LUT",
    commandSnippet: "lumetri.applyPreset('Arri_Alexa_Golden_Warmth.cube')",
    voicePromptUrdu: "Cinematic color grade apply karo",
    voicePromptEnglish: "Apply cinematic LUT",
    voicePromptPunjabi: "Cinematic color grade laa de",
    category: "color",
  },
  {
    id: "macro-3",
    software: "After Effects",
    title: "Purge All Memory & Disk Cache",
    commandSnippet: "ae.app.purge(PurgeTarget.ALL_CACHES)",
    voicePromptUrdu: "After Effects ka cache purge kar do",
    voicePromptEnglish: "Purge After Effects memory cache",
    voicePromptPunjabi: "After Effects da cache saaf kar de",
    category: "cleanup",
  },
  {
    id: "macro-4",
    software: "Premiere Pro",
    title: "Toggle 1/4 Proxy Playback Mode",
    commandSnippet: "premiere.sequence.toggleProxies(true, '1/4')",
    voicePromptUrdu: "Timeline proxy playback on karo",
    voicePromptEnglish: "Enable proxy playback",
    voicePromptPunjabi: "Proxy playback chalao",
    category: "proxy",
  },
  {
    id: "macro-5",
    software: "Blender",
    title: "Cycles GPU OptiX Render Scene",
    commandSnippet: "bpy.ops.render.render(animation=True, write_still=False)",
    voicePromptUrdu: "Blender GPU render shuru karo",
    voicePromptEnglish: "Start Blender GPU render",
    voicePromptPunjabi: "Blender GPU render shuru kar de",
    category: "render",
  },
];

export const defaultFiles: FileItem[] = [
  { name: "Cinematic_Broll_4K_60fps.mp4", type: "video", size: "3.4 GB", path: "C:/Users/Wasi/Downloads", suggestedFolder: "D:/Projects/Footage" },
  { name: "Client_Thumbnail_Draft_v3.psd", type: "image", size: "185 MB", path: "C:/Users/Wasi/Desktop", suggestedFolder: "D:/Thumbnails" },
  { name: "Monthly_Financial_Savings_Tracker.xlsx", type: "document", size: "2.1 MB", path: "C:/Users/Wasi/Downloads", suggestedFolder: "E:/Documents/Finance" },
  { name: "Quantum_Jarvis_Core_Engine.zip", type: "archive", size: "84 MB", path: "C:/Users/Wasi/Downloads", suggestedFolder: "D:/Development/Backups" },
  { name: "Voice_Over_Urdu_Master_Take2.wav", type: "audio", size: "240 MB", path: "C:/Users/Wasi/Desktop", suggestedFolder: "D:/Audio/Voiceovers" },
  { name: "Server_Automation_Script.py", type: "code", size: "45 KB", path: "C:/Users/Wasi/Desktop", suggestedFolder: "D:/Development/Scripts" },
];

export class StorageService {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? { ...defaultUserProfile, ...JSON.parse(data) } : defaultUserProfile;
    } catch {
      return defaultUserProfile;
    }
  }

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch {
      // Ignored
    }
  }

  getTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  }

  saveTasks(tasks: TaskItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // Ignored
    }
  }

  getExpenses(): ExpenseItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : defaultExpenses;
    } catch {
      return defaultExpenses;
    }
  }

  saveExpenses(expenses: ExpenseItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch {
      // Ignored
    }
  }

  getHealth(): HealthState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HEALTH);
      return data ? JSON.parse(data) : defaultHealthState;
    } catch {
      return defaultHealthState;
    }
  }

  saveHealth(health: HealthState): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(health));
    } catch {
      // Ignored
    }
  }

  getCustomization(): DashboardCustomization {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATION);
      if (!data) return defaultCustomization;
      const parsed = JSON.parse(data);
      return {
        ...defaultCustomization,
        ...parsed,
        avatarConfig: {
          ...defaultAvatarConfig,
          ...(parsed.avatarConfig || {}),
        },
      };
    } catch {
      return defaultCustomization;
    }
  }

  saveCustomization(cust: DashboardCustomization): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMIZATION, JSON.stringify(cust));
    } catch {}
  }

  exportFullBackup(): string {
    const backup = {
      version: "2.5.0-quantum",
      timestamp: new Date().toISOString(),
      userProfile: this.getUserProfile(),
      customization: this.getCustomization(),
      tasks: this.getTasks(),
      expenses: this.getExpenses(),
      health: this.getHealth(),
    };
    return JSON.stringify(backup, null, 2);
  }

  importFullBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.userProfile) this.saveUserProfile(data.userProfile);
      if (data.customization) this.saveCustomization(data.customization);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.expenses) this.saveExpenses(data.expenses);
      if (data.health) this.saveHealth(data.health);
      return true;
    } catch (e) {
      console.error("Backup import error:", e);
      return false;
    }
  }
}

export const storageService = new StorageService();
