// Comprehensive Urdu Phonetics & Transliteration Dictionary for authentic Pakistani accent speech
// When browser speech engines receive Urdu text with lang='ur-PK' or 'hi-IN', they pronounce it with genuine South Asian melody.

const ROMAN_TO_URDU_MAP: Record<string, string> = {
  'jaan': 'جان',
  'meri jaan': 'میری جان',
  'sartaj': 'سرتاج',
  'mere sartaj': 'میرے سرتاج',
  'shona': 'شونا',
  'pyar': 'پیار',
  'bohot': 'بہت',
  'bahut': 'بہت',
  'khayal': 'خیال',
  'khana': 'کھانا',
  'pani': 'پانی',
  'humsafar': 'ہمسفر',
  'subah': 'صبح',
  'shaam': 'شام',
  'raat': 'رات',
  'uth': 'اٹھ',
  'utho': 'اٹھو',
  'so': 'سو',
  'sone': 'سونے',
  'exam': 'امتحان',
  'parhai': 'پڑھائی',
  'study': 'پڑھائی',
  'message': 'پیغام',
  'messages': 'پیغامات',
  'call': 'کال',
  'attend': 'ریسیو',
  'reject': 'کینسل',
  'battery': 'بیٹری',
  'phone': 'فون',
  'mobile': 'موبائل',
  'karein': 'کریں',
  'karo': 'کرو',
  'shukriya': 'شکریہ',
  'assalam-o-alaikum': 'السلام علیکم',
  'salam': 'سلام',
  'theek': 'ٹھیک',
  'acha': 'اچھا',
  'achi': 'اچھی',
  'batao': 'بتاؤ',
  'sunao': 'سناؤ',
  'perh': 'پڑھ',
  'parh': 'پڑھ',
  'bolo': 'بولو',
  'kaho': 'کہو',
  'haanji': 'ہاں جی',
  'soniyo': 'سوہنیو',
  'ki haal': 'کی حال',
  'chal': 'چال',
  'screen': 'سکرین',
  'signal': 'سگنل',
  'storage': 'سٹوریج',
  'memory': 'میموری',
  'live': 'لائیو',
  'speed': 'رفتار',
  'health': 'صحت',
  'level': 'لیول',
  'ghante': 'گھنٹے',
  'din': 'دن',
  'safe': 'محفوظ',
  'mehfooz': 'محفوظ',
  'hamesha': 'ہمیشہ',
  'dil': 'دل',
  'dharak': 'دھڑک',
  'dharakta': 'دھڑکتا',
  'suno': 'س سنو',
  'sun': 'سن',
  'rahi': 'رہی',
  'hoon': 'ہوں',
  'hukum': 'حکم',
  'hero': 'ہیرو',
  'kam': 'کام',
  'sare': 'سارے',
  'saray': 'سارے',
  'yaad': 'یاد',
  'rakho': 'رکھو',
  'rakhungi': 'رکھوں گی',
};

// Check if string contains Urdu / Arabic characters
export const hasUrduScript = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};

// Transliterate Roman Urdu into Urdu script words where possible for perfect native phonetic pronunciation
export const convertToUrduPhonetics = (romanText: string): string => {
  if (hasUrduScript(romanText)) return romanText;

  let words = romanText.split(/\s+/);
  let converted = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return ROMAN_TO_URDU_MAP[cleanWord] || w;
  });

  return converted.join(' ');
};
