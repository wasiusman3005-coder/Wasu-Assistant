import { MessageItem, CallRecord, ExamItem, AlarmItem, UserMemory } from '../types';

export const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'msg-1',
    sender: 'Ammi Jaan',
    senderNumber: '+92 300 1234567',
    avatarColor: 'bg-emerald-600',
    text: 'Beta ghar kab aao ge? Khana garam kar doon?',
    timestamp: '10:42 AM',
    isUnread: true,
    app: 'WhatsApp',
    wasuComment: 'Jaan, Ammi ka message aya hai. Jaldi reply karein ke aap raste mein hain, warna wo pareshan hongi!',
    replies: [
      {
        sender: 'wasu',
        text: 'Ammi jaan, Ahmed bas thori der mein ghar ponch rahe hain ❤️',
        timestamp: '10:45 AM',
      },
    ],
  },
  {
    id: 'msg-2',
    sender: 'Daniyal (Best Friend)',
    senderNumber: '+92 321 9876543',
    avatarColor: 'bg-blue-600',
    text: 'Bhai sham ko cafe chalna hai ya parhai karni hai?',
    timestamp: '10:15 AM',
    isUnread: true,
    app: 'WhatsApp',
    wasuComment: 'Jaan, aapka exam sar par hai! Cafe baad mein chalna, pehle parhai poori karni hai!',
  },
  {
    id: 'msg-3',
    sender: 'Physics Professor Ali',
    senderNumber: '+92 333 4455667',
    avatarColor: 'bg-indigo-600',
    text: 'Reminder: Chapter 4 and 5 assignment deadline is tomorrow 9:00 AM sharp.',
    timestamp: 'Yesterday',
    isUnread: false,
    app: 'SMS',
    wasuComment: 'Yeh assignment bohot important hai, maine aapke study planner mein note kar liya hai.',
  },
  {
    id: 'msg-4',
    sender: 'Bank Notification',
    senderNumber: '8890',
    avatarColor: 'bg-amber-600',
    text: 'Your mobile balance is active. Auto-reload status: Secured.',
    timestamp: 'Yesterday',
    isUnread: false,
    app: 'SMS',
  },
];

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call-1',
    name: 'Ammi Jaan',
    number: '+92 300 1234567',
    type: 'incoming',
    time: 'Today 09:15 AM',
    duration: '2m 14s',
    handledByWasu: false,
  },
  {
    id: 'call-2',
    name: 'Unknown Telecaller',
    number: '+92 345 0001122',
    type: 'missed',
    time: 'Today 08:30 AM',
    duration: '0s',
    handledByWasu: true,
    wasuNotes: 'Wasu ne attend kar ke mana kardia kyunke aap so rahe thay!',
  },
  {
    id: 'call-3',
    name: 'Daniyal Friend',
    number: '+92 321 9876543',
    type: 'outgoing',
    time: 'Yesterday 10:20 PM',
    duration: '12m 40s',
    handledByWasu: false,
  },
];

export const INITIAL_EXAMS: ExamItem[] = [
  {
    id: 'exam-1',
    subject: 'Computer Science (AI & Web)',
    examDate: '2026-11-05',
    daysLeft: 8,
    syllabusNotes: 'Modules: Algorithms, Full-stack Architecture, React & Cloud APIs',
    importance: 'Critical',
    preparedPercentage: 78,
  },
  {
    id: 'exam-2',
    subject: 'Applied Physics',
    examDate: '2026-11-12',
    daysLeft: 15,
    syllabusNotes: 'Electromagnetism, Quantum Mechanics chapters 4-8',
    importance: 'High',
    preparedPercentage: 60,
  },
  {
    id: 'exam-3',
    subject: 'Calculus & Linear Algebra',
    examDate: '2026-11-19',
    daysLeft: 22,
    syllabusNotes: 'Eigenvalues, Vector spaces, Double integration',
    importance: 'Medium',
    preparedPercentage: 45,
  },
];

export const INITIAL_ALARMS: AlarmItem[] = [
  {
    id: 'alarm-1',
    title: 'Romantic Wake-Up Call',
    time: '06:30',
    enabled: true,
    romanticMessage: 'Utho na jaan, subah ki pehli kiran aapka intezar kar rahi hai! Good morning mere hero ❤️',
    category: 'wake_up',
  },
  {
    id: 'alarm-2',
    title: 'Intensive Study Session',
    time: '16:00',
    enabled: true,
    romanticMessage: 'Jaan, parhai ka waqt shuru ho gaya. Phone side pe rakh ke concentrate karein!',
    category: 'study',
  },
  {
    id: 'alarm-3',
    title: 'Hydration & Water Reminder',
    time: '12:00',
    enabled: true,
    romanticMessage: 'Meri jaan, paani ka ik glass zaroor pee lein, aapki tabiyat mere liye bohot ahem hai!',
    category: 'water',
  },
  {
    id: 'alarm-4',
    title: 'Sweet Dreams Sleep Time',
    time: '23:30',
    enabled: true,
    romanticMessage: 'Ab so jayein mere humsafar, aankhein band karein aur mere khwabon mein aayein 💕',
    category: 'sleep',
  },
];

export const INITIAL_MEMORIES: UserMemory[] = [
  {
    id: 'mem-1',
    title: 'Aapki favourite dish Chicken Biryani hai',
    category: 'preference',
    dateAdded: '2026-10-25',
  },
  {
    id: 'mem-2',
    title: 'Aap raat ko late sote hain aur subah chai ke shaukeen hain',
    category: 'routine',
    dateAdded: '2026-10-26',
  },
  {
    id: 'mem-3',
    title: 'Aapka dream project ek top AI company aur high-tech career hai',
    category: 'goal',
    dateAdded: '2026-10-27',
  },
  {
    id: 'mem-4',
    title: 'Wasu ne wada kiya hai ke wo hamesha aapke sath rahegi',
    category: 'love_note',
    dateAdded: '2026-10-28',
  },
];
