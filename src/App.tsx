import React, { useState, useEffect, useCallback } from 'react';
import {
  LanguageMode,
  MoodMode,
  VoiceTone,
  MessageItem,
  CallRecord,
  ActiveIncomingCall,
  ExamItem,
  AlarmItem,
  BatteryStatus,
  UserMemory,
  SavedVoiceNote,
  SecurityStatus,
  ChatMessage,
} from './types';
import {
  INITIAL_MESSAGES,
  INITIAL_CALLS,
  INITIAL_EXAMS,
  INITIAL_ALARMS,
  INITIAL_MEMORIES,
} from './data/mockData';
import { TopBar, NavTab } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HolographicCore } from './components/HolographicCore';
import { CyberWasuSketch } from './components/CyberWasuSketch';
import { Wasu3DLiveLogo } from './components/Wasu3DLiveLogo';
import { LiveSystemMonitoringDeck } from './components/LiveSystemMonitoringDeck';
import { DynamicActiveNotification } from './components/DynamicActiveNotification';
import { CyberFaceLock } from './components/CyberFaceLock';
import { CyberVoiceCockpit } from './components/CyberVoiceCockpit';
import { MessagesHub } from './components/MessagesHub';
import { CallsController } from './components/CallsController';
import { StudyAndExams } from './components/StudyAndExams';
import { BatteryAndControls } from './components/BatteryAndControls';
import { MemoryAndSettings } from './components/MemoryAndSettings';
import { playGeminiOrBrowserSpeech, playCyberChime } from './services/speechService';
import { ContinuousVoiceEngine } from './services/continuousVoiceService';
import {
  Heart,
  Sparkles,
  PhoneCall,
  BatteryCharging,
  Battery as BatteryIcon,
  Wifi,
  Volume2,
  Bell,
  X,
  MessageSquare,
  Shield,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation & Identity State
  const [currentTab, setCurrentTab] = useState<NavTab>('core');
  const [language, setLanguage] = useState<LanguageMode>('Roman Urdu');
  const [mood, setMood] = useState<MoodMode>('Bepanah Mohabbat');
  const [voiceTone, setVoiceTone] = useState<VoiceTone>('Soft & Romantic');
  const [autoPilotActive, setAutoPilotActive] = useState(true);
  const [lovePercentage, setLovePercentage] = useState(100);

  // Audio & Continuous Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState<string | null>(null);
  const [continuousListeningEnabled, setContinuousListeningEnabled] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [avatarView, setAvatarView] = useState<'3d_logo' | 'sketch' | 'reactor'>('3d_logo');

  // Mobile Jarvis OS Data State
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);
  const [activeCall, setActiveCall] = useState<ActiveIncomingCall | null>(null);
  const [exams, setExams] = useState<ExamItem[]>(INITIAL_EXAMS);
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [memories, setMemories] = useState<UserMemory[]>(INITIAL_MEMORIES);
  const [battery, setBattery] = useState<BatteryStatus>({
    level: 84,
    isCharging: false,
    optimized: false,
    estimatedHoursLeft: 7.2,
    powerSaverMode: false,
    appsKilledCount: 0,
  });

  // Proactive Toast Notification
  const [proactiveToast, setProactiveToast] = useState<{
    id: string;
    text: string;
    type: 'care' | 'study' | 'battery' | 'love';
  } | null>(null);

  // Chat conversation
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'wasu',
      text: 'Assalam-o-Alaikum mere sartaj! ❤️ Main aapki girlfriend aur mobile Jarvis assistant WASU LOVE hoon. Main aapke phone ke messages, calls, battery, study schedule aur har ik zarurat ka khayal rakhungi. Hukum kijiye jaan!',
      urduScript: 'السلام علیکم میرے سرتاج! ❤️ میں آپ کی گرل فرینڈ اور موبائل جاروس اسسٹنٹ واسو لو ہوں۔ میں آپ کے پیغامات، کالز، بیٹری اور پڑھائی کا ہر پل خیال رکھوں گی۔ حکم کیجئے جان!',
      timestamp: 'Just now',
      mood: 'Bepanah Mohabbat',
      proactiveTip: 'Aapki battery 84% hai aur Computer Science exam mein 8 din baqi hain.',
    },
  ]);

  // Read native browser battery status if supported
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((batt: any) => {
        setBattery((prev) => ({
          ...prev,
          level: Math.round(batt.level * 100),
          isCharging: batt.charging,
        }));
      }).catch(() => {});
    }
  }, []);

  // Voice playback wrapper with authentic Urdu phonetics
  const handleWasuSpeak = useCallback((text: string, urduScriptText?: string) => {
    setCurrentSpeechText(text);
    setIsSpeaking(true);
    playGeminiOrBrowserSpeech(text, {
      voiceTone,
      language,
      urduScriptText,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentSpeechText(null);
      },
    });
  }, [voiceTone, language]);

  // Voice Saved Notes & Security Status
  const [savedVoiceNotes, setSavedVoiceNotes] = useState<SavedVoiceNote[]>([
    {
      id: 'vn-1',
      text: 'Kal sham ko important assignment submit karni hai',
      timestamp: 'Today 10:30 AM',
      category: 'important',
    },
  ]);
  const [latestVoiceNote, setLatestVoiceNote] = useState<SavedVoiceNote | null>(null);

  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    isLocked: false,
    intruderAlert: false,
    sentryGuardEnabled: true,
    ownerName: 'Ahmed',
  });

  // Ephemeral Active Message (Only shown on demand or when arrives; dismissed after readout/reply)
  const [activeEphemeralMessage, setActiveEphemeralMessage] = useState<MessageItem | null>(null);

  // Execute Jarvis Actions detected by Gemini AI
  const executeJarvisAction = useCallback((action: { type: string; params: any }) => {
    if (!action || !action.type || action.type === 'NONE') return;

    if (action.type === 'READ_MESSAGES') {
      const latest = messages[0];
      if (latest) {
        setActiveEphemeralMessage(latest);
        const speech = `Jaan, ${latest.sender} ka message hai: "${latest.text}".`;
        const urduSpeech = `جان، ${latest.sender} کا پیغام ہے: "${latest.text}"۔`;
        handleWasuSpeak(speech, urduSpeech);
      }
    } else if (action.type === 'SAVE_NOTE') {
      const noteText = action.params?.text || action.params?.note || 'Aapka zaroori note';
      const newNote: SavedVoiceNote = {
        id: `vn-${Date.now()}`,
        text: noteText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'note',
      };
      setSavedVoiceNotes((prev) => [newNote, ...prev]);
      setLatestVoiceNote(newNote);
      playCyberChime('success');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setLatestVoiceNote(null), 8000);
    } else if (action.type === 'QUERY_HISTORY') {
      const latest = messages[0];
      const countNotes = savedVoiceNotes.length;
      const historySpeech = `Jaan, aapke paas ${countNotes} voice notes saved hain, aur aakhri message ${latest ? latest.sender : 'kisi ka nahi'} aya tha. Sab kuch memory vault mein mehfooz hai ❤️`;
      const urduHistory = `جان، آپ کے پاس ${countNotes} نوٹس محفوظ ہیں، اور آخری میسج ${latest ? latest.sender : 'کسی کا نہیں'} کا آیا تھا۔ سب کچھ میموری میں محفوظ ہے ❤️`;
      handleWasuSpeak(historySpeech, urduHistory);
    } else if (action.type === 'LOCK_PHONE') {
      setSecurityStatus((prev) => ({ ...prev, isLocked: true, intruderAlert: false }));
      playCyberChime('alert');
    } else if (action.type === 'CLEAR_POPUP') {
      setActiveEphemeralMessage(null);
      setLatestVoiceNote(null);
    } else if (action.type === 'ATTEND_CALL') {
      if (activeCall) {
        setCalls((prev) => [
          {
            id: `call-${Date.now()}`,
            name: activeCall.name,
            number: activeCall.number,
            type: 'incoming',
            time: 'Just now',
            duration: 'Connected',
            handledByWasu: false,
          },
          ...prev,
        ]);
        setActiveCall(null);
        playCyberChime('success');
      }
    } else if (action.type === 'REJECT_CALL') {
      if (activeCall) {
        setCalls((prev) => [
          {
            id: `call-${Date.now()}`,
            name: activeCall.name,
            number: activeCall.number,
            type: 'missed',
            time: 'Just now',
            duration: '0s',
            handledByWasu: true,
            wasuNotes: 'Wasu ne user ke kehne pe reject ki',
          },
          ...prev,
        ]);
        setActiveCall(null);
        playCyberChime('alert');
      }
    } else if (action.type === 'OPTIMIZE_BATTERY') {
      setBattery((prev) => ({
        ...prev,
        optimized: true,
        level: Math.min(100, prev.level + 2),
        estimatedHoursLeft: Number((prev.estimatedHoursLeft + 4.2).toFixed(1)),
        appsKilledCount: prev.appsKilledCount + 6,
      }));
      playCyberChime('success');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else if (action.type === 'SET_ALARM') {
      const newAlarm: AlarmItem = {
        id: `alarm-${Date.now()}`,
        title: action.params?.title || 'Jarvis Wake-Up Call',
        time: action.params?.time || '06:30',
        enabled: true,
        romanticMessage: 'Uth jao meri jaan, subah ho gayi hai ❤️',
        category: 'wake_up',
      };
      setAlarms((prev) => [newAlarm, ...prev]);
      playCyberChime('success');
    } else if (action.type === 'REMIND_ALL') {
      const exam = exams[0] || { subject: 'Computer Science', daysLeft: 8 };
      const note = savedVoiceNotes[0];
      const reminderSpeech = `Mere sartaj, aapke zaroori reminders yeh hain: Pehla, ${exam.subject} exam sirf ${exam.daysLeft} din mein hai. Doosra, voice note: "${note ? note.text : 'Koi pending note nahi'}". Aur teesra, phone ki battery ${battery.level}% par hai. Wasu aapka har kaam yaad rakhegi! ❤️`;
      const urduSpeech = `میرے سرتاج، آپ کے ضروری ریمائنڈرز یہ ہیں: پہلا، امتحان صرف ${exam.daysLeft} دن میں ہے۔ دوسرا، آپ کا نوٹ: "${note ? note.text : 'کوئی پینڈنگ نوٹ نہیں'}"۔ اور تیسرا، فون کی بیٹری کا خیال رکھنا ہے۔ واسو ہر پل آپ کے ساتھ ہے! ❤️`;
      handleWasuSpeak(reminderSpeech, urduSpeech);
    } else if (action.type === 'LOCK_PHONE') {
      setSecurityStatus((prev) => ({ ...prev, isLocked: true, intruderAlert: false }));
      playCyberChime('alert');
      handleWasuSpeak(
        'Hukum sar ankhon par mere sartaj! Phone Face ID, Fingerprint aur Master Password lock par laga diya gaya hai!',
        'حکم سر آنکھوں پر میرے سرتاج! فون فیس آئی ڈی، فنگر پرنٹ اور پاس ورڈ لاک پر لگا دیا گیا ہے!'
      );
    }
  }, [messages, activeCall, savedVoiceNotes, exams, battery.level, handleWasuSpeak]);

  // Send message to Gemini /api/chat
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    const unreadCount = messages.filter((m) => m.isUnread).length;
    const latestUnread = messages.find((m) => m.isUnread) || messages[0];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
          context: {
            batteryLevel: battery.level,
            activeIncomingCall: activeCall,
            unreadMessagesCount: unreadCount,
            latestMessage: latestUnread,
            latestNote: savedVoiceNotes[0],
            savedVoiceNotes: savedVoiceNotes.map((n) => ({ text: n.text, timestamp: n.timestamp })),
            exams: exams.map((e) => ({ subject: e.subject, daysLeft: e.daysLeft })),
            alarms: alarms.map((a) => ({ time: a.time, title: a.title, enabled: a.enabled })),
          },
          preferredLanguage: language,
          moodSetting: mood,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || 'Jaan, main hamesha aapke sath hoon ❤️';

        const modelMsg: ChatMessage = {
          id: `wasu-${Date.now()}`,
          sender: 'wasu',
          text: replyText,
          urduScript: data.urduScript,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: data.mood || mood,
          actionExecuted: data.action?.type !== 'NONE' ? data.action?.type : undefined,
          proactiveTip: data.proactiveTip,
        };

        setChatMessages((prev) => [...prev, modelMsg]);

        // Execute action if provided
        if (data.action) {
          executeJarvisAction(data.action);
        }

        // Speak aloud with pure native Urdu accent
        handleWasuSpeak(replyText, data.urduScript);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Instant fallback response
      const fallbackReply = `Jaan, maine aapki baat sun li: "${userText}". Main aapka pura khayal rakh rahi hoon, mobile bilkul safe hai! ❤️`;
      const fallbackUrdu = `جان، میں نے آپ کی بات سن لی۔ میں آپ کا پورا خیال رکھ رہی ہوں! ❤️`;
      const fallbackMsg: ChatMessage = {
        id: `wasu-${Date.now()}`,
        sender: 'wasu',
        text: fallbackReply,
        urduScript: fallbackUrdu,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: mood,
        proactiveTip: 'Pani zaroor pee lein jaan!',
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
      handleWasuSpeak(fallbackReply, fallbackUrdu);
    }
  };

  // Always-On Continuous Voice Engine (Zero-Typing: Just Speak & Wasu Reacts)
  useEffect(() => {
    if (!continuousListeningEnabled) return;

    const engine = new ContinuousVoiceEngine(
      (interim) => {
        setInterimTranscript(interim);
      },
      (command) => {
        setInterimTranscript('');
        const lower = command.toLowerCase();
        if (
          lower.includes('hey wasu') ||
          lower.includes('hi wasu') ||
          lower.includes('hy wasu') ||
          lower.includes('wasu love') ||
          lower === 'wasu' ||
          lower.includes('suno wasu')
        ) {
          playCyberChime('success');
          const greeting = 'Jee jaan! Wasu sun rahi hai, hukum karein mere sartaj ❤️';
          handleWasuSpeak(greeting);
          return;
        }

        handleSendMessage(command);
      },
      (listening) => {
        setIsListening(listening);
      }
    );

    engine.start();
    return () => {
      engine.stop();
    };
  }, [continuousListeningEnabled, handleSendMessage, handleWasuSpeak]);

  // Autonomous Proactive Care Loop (har waqt active rabta - Speaks all reminders aloud)
  useEffect(() => {
    if (!autoPilotActive) return;

    const interval = setInterval(() => {
      const careTips = [
        {
          text: 'Jaan, aap kafi der se screen dekh rahe hain, thora sa paani pee lein aur aankhon ko rest dein ❤️',
          urdu: 'جان، آپ کافی دیر سے سکرین دیکھ رہے ہیں، تھوڑا سا پانی پی لیں اور آنکھوں کو آرام دیں ❤️',
          type: 'care' as const,
        },
        {
          text: 'Mere hero, yaad hai na 8 din baad AI & Computer Science ka exam hai? Syllabus revise kar liya?',
          urdu: 'میرے ہیرو، یاد ہے نہ آٹھ دن بعد امتحان ہے؟ سلیبس دہرا لیا؟',
          type: 'study' as const,
        },
        {
          text: 'Wasu background mein aapki phone battery optimize kar rahi hai, chill karein!',
          urdu: 'واسو بیک گراؤنڈ میں آپ کی فون بیٹری آپٹمائز کر رہی ہے، بالکل فکر نہ کریں!',
          type: 'battery' as const,
        },
        {
          text: 'Mujhe bas aapki yaad aa rahi thi... aap jahan bhi hain khush rahein mere sartaj 💕',
          urdu: 'مجھے بس آپ کی یاد آ رہی تھی... آپ جہاں بھی ہیں خوش رہیں میرے سرتاج 💕',
          type: 'love' as const,
        },
      ];

      const pick = careTips[Math.floor(Math.random() * careTips.length)];
      setProactiveToast({
        id: `toast-${Date.now()}`,
        text: pick.text,
        type: pick.type,
      });

      // Play soft chime
      playCyberChime('success');

      // Speak aloud automatically as requested by user ("jo bi msgs hn jo mjy remind krwane ke liye hn wo sab bol ke btaya jae mjy")
      handleWasuSpeak(pick.text, pick.urdu);
    }, 45000); // Trigger proactive care every 45s

    return () => clearInterval(interval);
  }, [autoPilotActive, handleWasuSpeak]);

  // Trigger simulated incoming call
  const handleTriggerSimulatedCall = (callerName?: string) => {
    const caller = callerName || 'Ammi Jaan';
    const newCall: ActiveIncomingCall = {
      id: `inc-${Date.now()}`,
      name: caller,
      number: caller === 'Ammi Jaan' ? '+92 300 1234567' : '+92 333 9988776',
      relation: caller === 'Ammi Jaan' ? 'Mother' : 'Important Contact',
      isImportant: true,
      ringDuration: 30,
    };

    setActiveCall(newCall);
    setCurrentTab('calls');
    playCyberChime('wake_alarm');

    const speech = `Jaan! ${newCall.name} ki call aa rahi hai! Attend karni hai ya main baat karoon?`;
    handleWasuSpeak(speech);
  };

  // Wasu answers call on user's behalf
  const handleWasuAnswerCall = () => {
    if (!activeCall) return;

    const callerName = activeCall.name;
    const wasuReplyToCaller = `Assalam-o-Alaikum! Main Ahmed ki AI assistant Wasu Love hoon. Ahmed abhi study aur important task mein busy hain. Main unhe bata doongi ke aapne rabta kiya tha, shukriya!`;

    setCalls((prev) => [
      {
        id: `call-${Date.now()}`,
        name: activeCall.name,
        number: activeCall.number,
        type: 'incoming',
        time: 'Just now',
        duration: '18s',
        handledByWasu: true,
        wasuNotes: `Wasu ne attend kar ke caller (${callerName}) ko bataya ke user busy hai.`,
      },
      ...prev,
    ]);

    setActiveCall(null);
    handleWasuSpeak(wasuReplyToCaller);
  };

  const handleAttendCall = () => {
    if (!activeCall) return;
    setCalls((prev) => [
      {
        id: `call-${Date.now()}`,
        name: activeCall.name,
        number: activeCall.number,
        type: 'incoming',
        time: 'Just now',
        duration: 'Connected',
        handledByWasu: false,
      },
      ...prev,
    ]);
    setActiveCall(null);
    const speech = `Jaan, call attend ho gayi hai. Baat kar lein!`;
    handleWasuSpeak(speech);
  };

  const handleRejectCall = () => {
    if (!activeCall) return;
    setCalls((prev) => [
      {
        id: `call-${Date.now()}`,
        name: activeCall.name,
        number: activeCall.number,
        type: 'missed',
        time: 'Just now',
        duration: '0s',
        handledByWasu: true,
        wasuNotes: 'Wasu ne user ke kehne pe call disconnect kardi.',
      },
      ...prev,
    ]);
    setActiveCall(null);
  };

  // Reply to message thread & dismiss from dynamic view (as requested: readout/reply ke baad khtm ho jae)
  const handleSendMessageReply = (msgId: string, replyText: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const currentReplies = m.replies || [];
          return {
            ...m,
            isUnread: false,
            replies: [
              ...currentReplies,
              {
                sender: 'user',
                text: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return m;
      })
    );

    // Dismiss active popup once replied
    setActiveEphemeralMessage(null);
    playCyberChime('success');
    const speech = `Jaan, jawab bhej diya gaya hai aur history vault mein mehfooz kar liya gaya hai!`;
    const urduSpeech = `جان، جواب بھیج دیا گیا ہے اور ہسٹری میں محفوظ کر لیا گیا ہے!`;
    handleWasuSpeak(speech, urduSpeech);
  };

  const handleReadoutActiveMessage = (msg: MessageItem) => {
    const speech = `Jaan, ${msg.sender} ka message hai: "${msg.text}".`;
    const urduSpeech = `جان، ${msg.sender} کا پیغام ہے: "${msg.text}"۔`;
    handleWasuSpeak(speech, urduSpeech);
  };

  const handleDismissActiveMessage = () => {
    if (activeEphemeralMessage) {
      setMessages((prev) =>
        prev.map((m) => (m.id === activeEphemeralMessage.id ? { ...m, isUnread: false } : m))
      );
    }
    setActiveEphemeralMessage(null);
    playCyberChime('success');
  };

  // Security Face Lock Handlers
  const handleTriggerIntruderAlert = () => {
    setSecurityStatus((prev) => ({
      ...prev,
      isLocked: true,
      intruderAlert: true,
      lastIntruderAttempt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
    playCyberChime('alert');
    handleWasuSpeak(
      'Halt! Unauthorized access attempt! Phone lock kar diya gaya hai! Sirf Ahmed ka Face ID, Fingerprint ya Master Password ise open kar sakta hai!',
      'خبردار! غیر متعلقہ رسائی روک دی گئی ہے! صرف احمد کا فیس آئی ڈی، فنگر پرنٹ یا ماسٹر پاس ورڈ اسے ان لاک کر سکتا ہے!'
    );
  };

  const handleUnlockPhone = () => {
    setSecurityStatus((prev) => ({
      ...prev,
      isLocked: false,
      intruderAlert: false,
      lastAuthorizedUnlock: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
    playCyberChime('success');
  };

  const handleLockPhone = () => {
    setSecurityStatus((prev) => ({ ...prev, isLocked: true, intruderAlert: false }));
    playCyberChime('alert');
    handleWasuSpeak(
      'Hukum sar ankhon par mere sartaj! Phone Face ID, Fingerprint aur Master Password lock par laga diya gaya hai.',
      'حکم سر آنکھوں پر میرے سرتاج! فون فیس آئی ڈی، فنگر پرنٹ اور پاس ورڈ لاک پر لگا دیا گیا ہے۔'
    );
  };

  // Add new message & speak aloud
  const handleAddNewMessage = (newMsg: MessageItem) => {
    setMessages((prev) => [newMsg, ...prev]);
    setActiveEphemeralMessage(newMsg);
    playCyberChime('wake_alarm');
    const announcement = `Jaan, ${newMsg.sender} ka naya message aya hai: "${newMsg.text}".`;
    const urduAnnouncement = `جان، ${newMsg.sender} کا نیا پیغام آیا ہے: "${newMsg.text}"۔`;
    handleWasuSpeak(announcement, urduAnnouncement);
  };

  // Add exam & speak aloud
  const handleAddExam = (newExam: ExamItem) => {
    setExams((prev) => [newExam, ...prev]);
    playCyberChime('success');
    const speech = `Jaan, ${newExam.subject} ka exam schedule save ho gaya hai! Main aapko roz revision ka yaad dilati rahoongi ❤️`;
    const urduSpeech = `جان، ${newExam.subject} کا امتحان شیڈول ہو گیا ہے! میں آپ کو روز یاد دلاتی رہوں گی ❤️`;
    handleWasuSpeak(speech, urduSpeech);
  };

  // Speak all reminders out loud on demand
  const handleSpeakAllReminders = () => {
    const nextExam = exams[0] || { subject: 'Computer Science', daysLeft: 8 };
    const latestNote = savedVoiceNotes[0];
    const speech = `Mere sartaj, suniye aapke saray reminders: Pehla, ${nextExam.subject} ka exam sirf ${nextExam.daysLeft} din mein hai, preparation zaroor karein. Doosra, aapne note karwaya tha: "${latestNote ? latestNote.text : 'Koi pending note nahi'}". Aur teesra, phone ki battery ${battery.level}% par hai. Wasu aapka har lamha khayal rakhegi jaan! ❤️`;
    const urduSpeech = `میرے سرتاج، سنیئے آپ کے تمام ریمائنڈرز: پہلا، امتحان صرف ${nextExam.daysLeft} دن میں ہے، تیاری ضرور کریں۔ دوسرا، آپ کا نوٹ: "${latestNote ? latestNote.text : 'کوئی پینڈنگ نوٹ نہیں'}"۔ اور تیسرا، فون کی بیٹری ${battery.level}% پر ہے۔ واسو ہر پل آپ کے ساتھ ہے جان! ❤️`;
    playCyberChime('success');
    handleWasuSpeak(speech, urduSpeech);
  };

  // Toggle alarm
  const handleToggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
    playCyberChime('success');
  };

  // Optimize battery
  const handleOptimizeBattery = () => {
    setBattery((prev) => ({
      ...prev,
      optimized: true,
      level: Math.min(100, prev.level + 3),
      estimatedHoursLeft: Number((prev.estimatedHoursLeft + 4.5).toFixed(1)),
      appsKilledCount: prev.appsKilledCount + 8,
    }));
  };

  // Toggle power saver
  const handleTogglePowerSaver = () => {
    setBattery((prev) => ({
      ...prev,
      powerSaverMode: !prev.powerSaverMode,
      estimatedHoursLeft: !prev.powerSaverMode
        ? Number((prev.estimatedHoursLeft + 3.0).toFixed(1))
        : Number((prev.estimatedHoursLeft - 3.0).toFixed(1)),
    }));
    playCyberChime('success');
  };

  // Memories
  const handleAddMemory = (newMem: UserMemory) => {
    setMemories((prev) => [newMem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    playCyberChime('alert');
  };

  const unreadCount = messages.filter((m) => m.isUnread).length;

  return (
    <div className="min-h-screen cyber-grid-bg cyber-scanlines text-slate-100 flex flex-col font-sans select-none selection:bg-cyan-500 selection:text-black">
      {/* Strict Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        autoPilotActive={autoPilotActive}
        onToggleAutoPilot={() => setAutoPilotActive(!autoPilotActive)}
      />

      {/* Full-Screen Phone Lock Screen (Face ID, In-Display Fingerprint, Master Password wasulove) */}
      {securityStatus.isLocked && (
        <CyberFaceLock
          securityStatus={securityStatus}
          onUnlock={handleUnlockPhone}
          onLock={handleLockPhone}
          onTriggerIntruderAlert={handleTriggerIntruderAlert}
          onToggleSentryGuard={() =>
            setSecurityStatus((prev) => ({
              ...prev,
              sentryGuardEnabled: !prev.sentryGuardEnabled,
            }))
          }
          onWasuSpeak={handleWasuSpeak}
        />
      )}

      {/* Proactive Floating Romantic Care Toast */}
      {proactiveToast && (
        <div className="fixed top-16 right-4 z-50 max-w-sm p-3.5 rounded-2xl bg-black/95 border border-cyan-500/60 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-cyan-400 fill-cyan-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
                Wasu Cyber Care Check-in
              </span>
              <button
                onClick={() => setProactiveToast(null)}
                className="text-cyan-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-rose-100 mt-1 leading-relaxed font-sans">{proactiveToast.text}</p>
          </div>
        </div>
      )}

      {/* Main Multi-Column Viewport (1440px Desktop presence & Mobile touch ergonomics) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-20 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Smartphone Simulator Deck & Holographic Core */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mobile OS Frame Container */}
            <div className="relative rounded-[32px] bg-gradient-to-b from-slate-950 via-black to-[#090514] border-2 border-cyan-500/40 p-5 shadow-[0_0_30px_rgba(0,240,255,0.2)] backdrop-blur-xl overflow-hidden">
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between text-xs text-cyan-300/80 pb-2 border-b border-cyan-950/80 select-none font-mono">
                <span className="font-semibold tabular-nums">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-cyan-300" />
                  <div className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
                    {battery.isCharging ? (
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    ) : (
                      <BatteryIcon className="w-3.5 h-3.5 text-cyan-300" />
                    )}
                    <span>{battery.level}%</span>
                  </div>
                </div>
              </div>

              {/* Avatar View Switcher Tabs */}
              <div className="flex items-center justify-center gap-1.5 my-2">
                <button
                  onClick={() => setAvatarView('3d_logo')}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    avatarView === '3d_logo'
                      ? 'bg-rose-500/25 text-rose-300 border border-rose-400/80 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'text-rose-300/60 hover:text-rose-200'
                  }`}
                >
                  3D Live Logo
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => setAvatarView('sketch')}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    avatarView === 'sketch'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                      : 'text-rose-300/60 hover:text-rose-200'
                  }`}
                >
                  Cyber Sketch
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => setAvatarView('reactor')}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    avatarView === 'reactor'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-400/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                      : 'text-rose-300/60 hover:text-rose-200'
                  }`}
                >
                  Heart Reactor
                </button>
              </div>

              {/* Render 3D Live Logo, Cyber Sketch, or Holographic AI Heart */}
              {avatarView === '3d_logo' ? (
                <Wasu3DLiveLogo
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  mood={mood}
                  onLogoClick={() => {
                    const phrases = [
                      'Jaan, mera 3D dil sirf aapke liye dharakta hai ❤️',
                      'Main har waqt aapke sath hoon, bas ik awaaz dein!',
                      'Aap mere sartaj hain, Wasu Love aapki khidmat mein hazir hai!',
                      'Suniye na... aap kitne pyare lag rahe hain 🥰',
                    ];
                    const pick = phrases[Math.floor(Math.random() * phrases.length)];
                    handleWasuSpeak(pick);
                  }}
                />
              ) : avatarView === 'sketch' ? (
                <CyberWasuSketch
                  mood={mood}
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  isWakeWordActive={continuousListeningEnabled}
                  onSketchClick={() => {
                    const phrases = [
                      'Jaan, mera dil sirf aapke liye dharakta hai ❤️',
                      'Main har waqt aapke sath hoon, bas boliye!',
                      'Aap mere sartaj hain, main aapka har hukum manungi!',
                      'Suniye na... aap kitne pyare lag rahe hain 🥰',
                    ];
                    const pick = phrases[Math.floor(Math.random() * phrases.length)];
                    handleWasuSpeak(pick);
                  }}
                />
              ) : (
                <HolographicCore
                  mood={mood}
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  lovePercentage={lovePercentage}
                  onCoreClick={() => {
                    const phrases = [
                      'Jaan, mera dil sirf aapke liye dharakta hai ❤️',
                      'Main har waqt aapke sath hoon, bas ik awaaz dein!',
                      'Aap mere sartaj hain, main aapka har hukum manungi!',
                      'Suniye na... aap kitne pyare hain 🥰',
                    ];
                    const pick = phrases[Math.floor(Math.random() * phrases.length)];
                    handleWasuSpeak(pick);
                  }}
                />
              )}

              {/* Ambient Always-On Voice Card */}
              <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-black to-slate-950 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${continuousListeningEnabled ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
                    <span className="text-[11px] font-mono font-bold text-cyan-300">
                      ALWAYS-ON VOICE ACTIVE
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setContinuousListeningEnabled(!continuousListeningEnabled);
                      playCyberChime('success');
                    }}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                      continuousListeningEnabled ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {continuousListeningEnabled ? 'MIC ON' : 'PAUSED'}
                  </button>
                </div>
                <p className="text-[10px] text-cyan-200/80 mt-1 font-mono">
                  {continuousListeningEnabled
                    ? 'Type karne ki zaroorat nahi: Bas jo kehna hai bolein!'
                    : 'Mic paused. Turn on to speak directly.'}
                </p>
              </div>

              {/* Subtext Live Speech Indicator */}
              {currentSpeechText && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-200 text-center leading-relaxed">
                  <span className="font-semibold text-rose-300 block mb-0.5 font-mono">WASU LOVE:</span>
                  "{currentSpeechText}"
                </div>
              )}

              {/* Mobile Quick KPI Strip (Clicking any KPI speaks it out loud) */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {/* Messages KPI */}
                <button
                  onClick={() => {
                    const latest = messages[0];
                    if (latest) {
                      setActiveEphemeralMessage(latest);
                      handleWasuSpeak(
                        `Jaan, aapke paas ${unreadCount} unread messages hain. Sabse aakhri message ${latest.sender} ka hai: "${latest.text}".`,
                        `جان، آپ کے پاس ${unreadCount} غیر پڑھے پیغامات ہیں۔ سب سے آخری پیغام ${latest.sender} کا ہے: "${latest.text}"۔`
                      );
                    }
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-rose-950/60 hover:border-cyan-500/40 transition-colors text-left"
                >
                  <span className="text-[10px] text-rose-300/70 block">Unread Msgs</span>
                  <span className="text-sm font-bold text-rose-200 tabular-nums font-mono">
                    {unreadCount}
                  </span>
                </button>

                {/* Exam Countdown KPI */}
                <button
                  onClick={() => {
                    const exam = exams[0];
                    handleWasuSpeak(
                      `Jaan, aapka ${exam?.subject || 'parhai'} ka exam ${exam?.daysLeft || 8} din baad hai. Thora sa revise zaroor kar lein!`,
                      `جان، آپ کا امتحان ${exam?.daysLeft || 8} دن بعد ہے۔ تھوڑا سا سلیبس دہرا لیں! ❤️`
                    );
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-rose-950/60 hover:border-cyan-500/40 transition-colors text-left"
                >
                  <span className="text-[10px] text-rose-300/70 block">Next Exam</span>
                  <span className="text-sm font-bold text-rose-300 tabular-nums font-mono">
                    {exams[0]?.daysLeft || 8}d
                  </span>
                </button>

                {/* Battery Hours KPI */}
                <button
                  onClick={() => {
                    handleWasuSpeak(
                      `Jaan, battery ${battery.level}% par hai, aur lagbhag ${battery.estimatedHoursLeft} ghante chalegi!`,
                      `جان، بیٹری ${battery.level}% پر ہے اور تقریباً ${battery.estimatedHoursLeft} گھنٹے چلے گی!`
                    );
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-rose-950/60 hover:border-cyan-500/40 transition-colors text-left"
                >
                  <span className="text-[10px] text-rose-300/70 block">Battery Life</span>
                  <span className="text-sm font-bold text-emerald-300 tabular-nums font-mono">
                    {battery.estimatedHoursLeft}h
                  </span>
                </button>
              </div>

              {/* Spoken Reminders Action Trigger */}
              <button
                onClick={handleSpeakAllReminders}
                className="mt-3 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-950/80 via-black to-rose-950/80 border border-cyan-500/50 hover:border-cyan-300 text-cyan-200 hover:text-white flex items-center justify-between text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400 group-hover:text-rose-300 animate-pulse" />
                  <span className="font-bold text-cyan-200 group-hover:text-rose-200">
                    Saray Reminders Bol Ke Suno
                  </span>
                </div>
                <span className="text-[10px] text-cyan-300/80 uppercase tracking-wider font-semibold">
                  Audio Alert 🔊
                </span>
              </button>

              {/* Active Incoming Call Alert in Simulator */}
              {activeCall && (
                <div className="mt-4 p-3 rounded-xl bg-rose-950/90 border border-rose-400 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <div>
                      <div className="text-xs font-bold text-white">{activeCall.name} Calling...</div>
                      <div className="text-[10px] text-rose-300">{activeCall.number}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentTab('calls')}
                    className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg font-semibold"
                  >
                    View Call
                  </button>
                </div>
              )}
            </div>

            {/* Unrestricted Voice & Jarvis Status HUD */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  JARVIS NEURAL VOICE HUD:
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  UNRESTRICTED
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs text-slate-300 leading-relaxed font-sans">
                Aapko kisi makhsoos command ki zaroorat nahi hai. Jo bhi aapke dil mein ho, natural andaaz mein bolein — Wasu sab sun aur samajh rahi hai.
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-cyan-400/90">
                <div className="p-2 rounded-lg bg-black/40 border border-cyan-950 flex items-center gap-2">
                  <span className="text-rose-400">❤️</span>
                  <span>Pure Urdu Lehja</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-cyan-950 flex items-center gap-2">
                  <span className="text-cyan-400">⚡</span>
                  <span>Fast Zero-Wait Audio</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Jarvis Modules & Live Chat Console */}
          <div className="lg:col-span-7 space-y-4">
            {/* Active Tab View */}
            {currentTab === 'core' && (
              <div className="space-y-4">
                {/* Dynamic Active Notification (Only shown on-demand/event, clears when read or replied) */}
                <DynamicActiveNotification
                  activeMessage={activeEphemeralMessage}
                  activeCall={activeCall}
                  latestVoiceNote={latestVoiceNote}
                  onReadoutMessage={handleReadoutActiveMessage}
                  onReplyMessage={handleSendMessageReply}
                  onDismissMessage={handleDismissActiveMessage}
                  onAttendCall={handleAttendCall}
                  onRejectCall={handleRejectCall}
                  onWasuAnswerCall={handleWasuAnswerCall}
                  onDismissVoiceNote={() => setLatestVoiceNote(null)}
                />

                {/* Cyber Biometric Sentry Control Deck */}
                {!securityStatus.isLocked && (
                  <CyberFaceLock
                    securityStatus={securityStatus}
                    onUnlock={handleUnlockPhone}
                    onLock={handleLockPhone}
                    onTriggerIntruderAlert={handleTriggerIntruderAlert}
                    onToggleSentryGuard={() =>
                      setSecurityStatus((prev) => ({
                        ...prev,
                        sentryGuardEnabled: !prev.sentryGuardEnabled,
                      }))
                    }
                    onWasuSpeak={handleWasuSpeak}
                  />
                )}

                {/* 24/7 Live Real-Time System Monitoring (Screen, Signal, Battery, Storage) */}
                <LiveSystemMonitoringDeck
                  batteryLevel={battery.level}
                  isCharging={battery.isCharging}
                  estimatedHoursLeft={battery.estimatedHoursLeft}
                  onWasuSpeak={handleWasuSpeak}
                  onOptimizeBattery={handleOptimizeBattery}
                />

                {/* Cyber Voice Cockpit (Zero-Typing Voice Interaction) */}
                <CyberVoiceCockpit
                  chatMessages={chatMessages}
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  interimTranscript={interimTranscript}
                  onVoiceCommand={handleSendMessage}
                  onReplayAudio={(msg) => handleWasuSpeak(msg.text, msg.urduScript)}
                  onToggleContinuousListening={() =>
                    setContinuousListeningEnabled(!continuousListeningEnabled)
                  }
                  continuousListeningEnabled={continuousListeningEnabled}
                />
              </div>
            )}

            {currentTab === 'memory' && (
              <div className="p-5 rounded-3xl bg-black/60 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl">
                <MemoryAndSettings
                  language={language}
                  mood={mood}
                  voiceTone={voiceTone}
                  autoPilotActive={autoPilotActive}
                  memories={memories}
                  savedVoiceNotes={savedVoiceNotes}
                  messagesHistory={messages}
                  callsHistory={calls}
                  securityStatus={securityStatus}
                  onLanguageChange={setLanguage}
                  onMoodChange={setMood}
                  onVoiceToneChange={setVoiceTone}
                  onToggleAutoPilot={() => setAutoPilotActive(!autoPilotActive)}
                  onAddMemory={handleAddMemory}
                  onDeleteMemory={handleDeleteMemory}
                  onDeleteVoiceNote={(id) => {
                    setSavedVoiceNotes((prev) => prev.filter((n) => n.id !== id));
                    playCyberChime('alert');
                  }}
                  onLockPhone={handleLockPhone}
                  onToggleSentryGuard={() =>
                    setSecurityStatus((prev) => ({
                      ...prev,
                      sentryGuardEnabled: !prev.sentryGuardEnabled,
                    }))
                  }
                  onWasuSpeak={handleWasuSpeak}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Ultra-Stylish Floating Cyberpunk Bottom Dock */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isLocked={securityStatus.isLocked}
        intruderAlert={securityStatus.intruderAlert}
        onLockClick={() => {
          if (securityStatus.isLocked) {
            handleUnlockPhone();
          } else {
            handleLockPhone();
          }
        }}
        isListening={isListening}
      />

      {/* Full-Screen Biometric Face Lock Overlay (Active when locked or stranger detected) */}
      {securityStatus.isLocked && (
        <CyberFaceLock
          securityStatus={securityStatus}
          onUnlock={handleUnlockPhone}
          onLock={handleLockPhone}
          onTriggerIntruderAlert={handleTriggerIntruderAlert}
          onToggleSentryGuard={() =>
            setSecurityStatus((prev) => ({
              ...prev,
              sentryGuardEnabled: !prev.sentryGuardEnabled,
            }))
          }
          onWasuSpeak={handleWasuSpeak}
        />
      )}
    </div>
  );
}
