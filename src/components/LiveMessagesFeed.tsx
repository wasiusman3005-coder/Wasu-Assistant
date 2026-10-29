import React, { useState, useEffect } from 'react';
import { MessageItem } from '../types';
import { MessageSquare, Volume2, Send, CheckCheck, Sparkles, BellRing, PhoneIncoming } from 'lucide-react';
import { playGeminiOrBrowserSpeech, playCyberChime } from '../services/speechService';

interface LiveMessagesFeedProps {
  messages: MessageItem[];
  onSendMessageReply: (id: string, text: string) => void;
  onWasuSpeak: (text: string) => void;
}

export const LiveMessagesFeed: React.FC<LiveMessagesFeedProps> = ({
  messages,
  onSendMessageReply,
  onWasuSpeak,
}) => {
  const [selectedId, setSelectedId] = useState<string>(messages[0]?.id || '');
  const [activeReply, setActiveReply] = useState('');
  const [liveStreamIndex, setLiveStreamIndex] = useState(0);

  const selected = messages.find((m) => m.id === selectedId) || messages[0];

  // Live incoming message ticker cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStreamIndex((prev) => (prev + 1) % messages.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [messages.length]);

  const handleReadMessage = (msg: MessageItem) => {
    playCyberChime('success');
    const speech = `Jaan, ${msg.sender} ka message aya hai: "${msg.text}". ${
      msg.wasuComment ? `Mera mashwara hai ke: ${msg.wasuComment}` : 'Kya main aapki taraf se reply bhej doon?'
    }`;
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
  };

  const handleSendQuickReply = (text: string) => {
    if (!selected) return;
    onSendMessageReply(selected.id, text);
    playCyberChime('success');
    const speech = `Maine reply bhej diya hai mere sartaj: "${text}"! ❤️`;
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
  };

  return (
    <div className="rounded-2xl bg-black/60 border border-cyan-500/40 p-4 shadow-xl shadow-cyan-950/30 space-y-4">
      {/* Live Stream Status Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-950/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5d4]" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            LIVE MESSAGES STREAM INTERFACE
          </h3>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-200">
          AUTOMATIC INTERCEPT: ACTIVE
        </span>
      </div>

      {/* Live Animated Ticker for Latest Communication */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-black to-rose-950/40 border border-cyan-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-500 text-white rounded font-bold shrink-0">
            LATEST
          </span>
          <p className="text-xs text-rose-100 truncate">
            <strong>{messages[liveStreamIndex]?.sender}:</strong> "{messages[liveStreamIndex]?.text}"
          </p>
        </div>

        <button
          onClick={() => handleReadMessage(messages[liveStreamIndex])}
          className="px-2.5 py-1 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg flex items-center gap-1 shrink-0 transition-transform active:scale-95 font-mono"
        >
          <Volume2 className="w-3 h-3" />
          Perh Ke Sunao
        </button>
      </div>

      {/* Split Stream: Message List & Active Live Reader */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Messages Stream Feed */}
        <div className="md:col-span-5 space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-950">
          {messages.map((m) => {
            const isSelected = m.id === selectedId;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400/80 shadow-md shadow-cyan-950/40'
                    : 'bg-black/40 border-rose-950/50 hover:bg-cyan-950/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-100">{m.sender}</span>
                  <span className="text-[10px] text-cyan-300/70 font-mono">{m.timestamp}</span>
                </div>
                <p className="text-xs text-rose-200/80 mt-1 line-clamp-1">{m.text}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Message Inspector with Wasu Voice Controls */}
        <div className="md:col-span-7 p-3.5 rounded-xl bg-black/50 border border-cyan-950/80 flex flex-col justify-between space-y-3">
          {selected ? (
            <>
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-cyan-900/40">
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 font-mono">{selected.sender}</h4>
                    <span className="text-[10px] text-rose-300/60 font-mono">{selected.senderNumber}</span>
                  </div>

                  <button
                    onClick={() => handleReadMessage(selected)}
                    className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center gap-1 transition-transform active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Wasu Perhegi
                  </button>
                </div>

                <div className="p-2.5 mt-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-rose-100 leading-relaxed">
                  "{selected.text}"
                </div>

                {selected.wasuComment && (
                  <div className="mt-2 p-2 rounded-lg bg-pink-950/30 border border-pink-500/30 text-[11px] text-pink-200">
                    <span className="font-bold text-rose-300">❤️ Wasu Insight: </span>
                    {selected.wasuComment}
                  </div>
                )}
              </div>

              {/* Instant Quick Reply Buttons */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-cyan-300 uppercase block">
                  Quick Reply via Wasu:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendQuickReply('Jee main theek hoon, bas thori der mein rabta karta hoon.')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 transition-colors"
                  >
                    "Main theek hoon"
                  </button>
                  <button
                    onClick={() => handleSendQuickReply('Abhi parhai kar raha hoon, phone side pe hai.')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 transition-colors"
                  >
                    "Parhai kar raha hoon"
                  </button>
                  <button
                    onClick={() => handleSendQuickReply('Jee Ammi jaan, main bilkul theek hoon ❤️')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-200 hover:bg-rose-900/60 transition-colors"
                  >
                    "Jee Ammi Jaan ❤️"
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-rose-300/50 py-8 text-center">Koi message select karein</div>
          )}
        </div>
      </div>
    </div>
  );
};
