import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LanguageMode, MoodMode } from '../types';
import { Mic, MicOff, Send, Volume2, Sparkles, Heart, Bot, RefreshCw, Zap } from 'lucide-react';
import { playGeminiOrBrowserSpeech, playCyberChime } from '../services/speechService';
import confetti from 'canvas-confetti';

interface VoiceChatConsoleProps {
  chatMessages: ChatMessage[];
  isSpeaking: boolean;
  isListening: boolean;
  language: LanguageMode;
  mood: MoodMode;
  onSendMessage: (text: string) => Promise<void>;
  setIsListening: (listening: boolean) => void;
  onWasuSpeak: (text: string, urduScriptText?: string) => void;
}

export const VoiceChatConsole: React.FC<VoiceChatConsoleProps> = ({
  chatMessages,
  isSpeaking,
  isListening,
  language,
  mood,
  onSendMessage,
  setIsListening,
  onWasuSpeak,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Setup Web Speech API for voice listening
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = false;

        // Set recognition language based on mode
        if (language === 'Urdu') {
          recognition.lang = 'ur-PK';
        } else if (language === 'Punjabi') {
          recognition.lang = 'pa-PK';
        } else if (language === 'English') {
          recognition.lang = 'en-US';
        } else {
          // Roman Urdu / Hindi speech engine understands Urdu phonetics well
          recognition.lang = 'ur-PK';
        }

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            handleSubmitText(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setMicError('Microphone permission block hai. Please browser settings mein allow karein.');
          } else if (event.error !== 'no-speech') {
            setMicError(`Mic notice: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language, setIsListening]);

  const toggleMic = () => {
    setMicError(null);
    if (!recognitionRef.current) {
      setMicError('Speech recognition is supported via Chrome, Edge, and Android webview.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      setIsListening(false);
    } else {
      playCyberChime('success');
      try {
        recognitionRef.current.start();
      } catch {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    }
  };

  const handleSubmitText = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setInputText('');
    try {
      await onSendMessage(textToSend.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    handleSubmitText(prompt);
  };

  const handleReplayVoice = (msg: ChatMessage) => {
    onWasuSpeak(msg.text, msg.urduScript);
    playGeminiOrBrowserSpeech(msg.text, { urduScriptText: msg.urduScript, voiceTone: 'Soft & Romantic' });
  };

  return (
    <div className="flex flex-col h-[520px] bg-black/50 border border-rose-950/70 rounded-2xl overflow-hidden shadow-2xl shadow-rose-950/50">
      {/* Console Top Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-rose-950/80 via-black to-slate-950 border-b border-rose-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-rose-100">WASU LOVE Live Chat & Voice Console</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-300">
            {language}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-900/60 border border-pink-500/30 text-pink-200">
            {mood}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-rose-950">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed relative ${
                msg.sender === 'user'
                  ? 'bg-rose-600 text-white rounded-tr-none shadow-md shadow-rose-950/60'
                  : 'bg-rose-950/40 border border-rose-500/30 text-rose-100 rounded-tl-none shadow-md shadow-rose-950/40'
              }`}
            >
              {/* Header inside model bubble */}
              {msg.sender === 'wasu' && (
                <div className="flex items-center justify-between gap-3 pb-1 mb-1 border-b border-rose-800/30 text-[10px] font-semibold text-rose-300">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                    WASU LOVE
                  </span>

                  <button
                    onClick={() => handleReplayVoice(msg)}
                    className="p-1 rounded hover:bg-rose-900/50 text-rose-300 hover:text-white transition-colors"
                    title="Awaz Sunayein"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Authentic Urdu Script Rendering */}
              {msg.urduScript && msg.sender === 'wasu' && (
                <div className="mt-2 pt-2 border-t border-rose-800/40 text-right" dir="rtl">
                  <p className="font-['Noto_Nastaliq_Urdu',serif] text-sm text-rose-200/95 leading-relaxed tracking-wide">
                    {msg.urduScript}
                  </p>
                </div>
              )}

              {/* Action Badge */}
              {msg.actionExecuted && (
                <div className="mt-2 pt-1 border-t border-rose-800/30 flex items-center gap-1.5 text-[10px] text-cyan-300 font-medium">
                  <Zap className="w-3 h-3" />
                  Action Executed: {msg.actionExecuted}
                </div>
              )}

              {/* Proactive Tip */}
              {msg.proactiveTip && (
                <div className="mt-2 p-1.5 rounded-lg bg-pink-950/40 border border-pink-500/30 text-[10px] text-pink-200">
                  💌 {msg.proactiveTip}
                </div>
              )}

              <span
                className={`text-[9px] block mt-1 text-right tabular-nums ${
                  msg.sender === 'user' ? 'text-rose-200/80' : 'text-rose-400/60'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isSubmitting && (
          <div className="flex items-center gap-2 text-xs text-rose-300 italic animate-pulse">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            Wasu aapke liye soch rahi hai... ❤️
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Voice / Tap Prompts Carousel */}
      <div className="px-3 py-2 bg-black/40 border-t border-rose-950/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          'Good morning meri jaan ❤️',
          'Mera message parh ke sunao',
          'Battery optimize kardo',
          'Mera exam kab hai?',
          'Call attend karo',
          'Call reject kardo',
          'Mujhe bohot sara pyar karo',
          'Subah 6:30 baje jagana',
          'Shayari sunao',
          'Punjabi vich gal karo',
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 text-rose-200 transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Mic Status / Error Banner */}
      {micError && (
        <div className="px-3 py-1.5 bg-red-950/80 border-t border-red-500/40 text-[11px] text-red-200 flex items-center justify-between">
          <span>⚠️ {micError}</span>
          <button
            onClick={() => setMicError(null)}
            className="text-red-400 hover:text-white font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Bottom Input & Voice Trigger Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitText();
        }}
        className="p-3 bg-black/80 border-t border-rose-950/80 flex items-center gap-2"
      >
        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-600/50'
              : 'bg-black/60 border-rose-950/80 text-rose-300 hover:bg-rose-950/50'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Click to speak to Wasu'}
        >
          {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isListening
              ? 'Wasu sun rahi hai, bolein...'
              : 'Wasu se baat karein ya hukum dein (Urdu, English, Punjabi)...'
          }
          className="flex-1 px-3 py-2 text-xs bg-black/60 border border-rose-950/80 rounded-xl text-rose-100 placeholder-rose-400/40 focus:outline-none focus:border-rose-500"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isSubmitting}
          className="p-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md active:scale-95"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
