import React, { useState } from 'react';
import { MessageItem } from '../types';
import { Volume2, Send, CheckCheck, MessageSquare, Plus, BellRing } from 'lucide-react';
import { playGeminiOrBrowserSpeech, playCyberChime } from '../services/speechService';

interface MessagesHubProps {
  messages: MessageItem[];
  onSendMessage: (msgId: string, replyText: string) => void;
  onAddNewMessage: (msg: MessageItem) => void;
  onWasuSpeak: (text: string) => void;
}

export const MessagesHub: React.FC<MessagesHubProps> = ({
  messages,
  onSendMessage,
  onAddNewMessage,
  onWasuSpeak,
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);
  const [replyInput, setReplyInput] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'WhatsApp' | 'SMS'>('all');
  const [isReading, setIsReading] = useState(false);

  const filteredMessages = messages.filter((m) => {
    if (activeTab === 'all') return true;
    return m.app === activeTab;
  });

  const selectedMsg = messages.find((m) => m.id === selectedMessageId);

  // Wasu reads the message aloud with her loving reaction
  const handleReadAloud = (msg: MessageItem) => {
    setIsReading(true);
    const speechText = `Jaan, ${msg.sender} ka ${msg.app} pe yeh message aya hai: "${msg.text}". ${
      msg.wasuComment ? `Mera kehna hai ke ${msg.wasuComment}` : 'Aap hukum karein to main reply bhej doon?'
    }`;

    onWasuSpeak(speechText);
    playGeminiOrBrowserSpeech(speechText, {
      onEnd: () => setIsReading(false),
    });
  };

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyInput.trim() || !selectedMessageId) return;

    onSendMessage(selectedMessageId, replyInput.trim());
    playCyberChime('success');
    setReplyInput('');

    // Wasu confirms reply sent
    const confirmSpeech = `Jaan, aapka reply bhej diya gaya hai! Main hamesha aapke sath hoon ❤️`;
    onWasuSpeak(confirmSpeech);
    playGeminiOrBrowserSpeech(confirmSpeech);
  };

  const handleQuickWasuReply = (presetText: string) => {
    if (!selectedMessageId) return;
    onSendMessage(selectedMessageId, presetText);
    playCyberChime('success');

    const speech = `Maine yeh reply bhej diya: "${presetText}". Aap fikar na karein!`;
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
  };

  // Simulate an incoming new message
  const handleSimulateIncoming = () => {
    const sampleIncoming = [
      {
        sender: 'Ammi Jaan',
        senderNumber: '+92 300 1234567',
        avatarColor: 'bg-emerald-600',
        text: 'Beta apna khayal rakhna aur time pe parh lena.',
        app: 'WhatsApp' as const,
        wasuComment: 'Ammi kitna pyar karti hain aap se! Jaldi "Jee Ammi" reply kardo!',
      },
      {
        sender: 'Class CR Hamza',
        senderNumber: '+92 312 5566778',
        avatarColor: 'bg-purple-600',
        text: 'Bhai kal exam hall ki seating arrangement upload ho gayi hai portal pe.',
        app: 'WhatsApp' as const,
        wasuComment: 'Jaan, exam portal check kar lein, main aapko roll number yaad dila doon?',
      },
      {
        sender: 'College Notice Board',
        senderNumber: '3321',
        avatarColor: 'bg-rose-700',
        text: 'Final term date sheet updated. Please collect roll slips from admin.',
        app: 'SMS' as const,
        wasuComment: 'Jaan, roll slip collect karna na bhoolna, maine calendar mein add kar diya hai.',
      },
    ];

    const pick = sampleIncoming[Math.floor(Math.random() * sampleIncoming.length)];
    const newMsg: MessageItem = {
      id: `sim-${Date.now()}`,
      sender: pick.sender,
      senderNumber: pick.senderNumber,
      avatarColor: pick.avatarColor,
      text: pick.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUnread: true,
      app: pick.app,
      wasuComment: pick.wasuComment,
    };

    onAddNewMessage(newMsg);
    setSelectedMessageId(newMsg.id);
    playCyberChime('alert');

    // Wasu proactively alerts the user!
    const alertSpeech = `Jaan! ${newMsg.sender} ki taraf se naya message aya hai. Main parh ke sunaoon?`;
    onWasuSpeak(alertSpeech);
    playGeminiOrBrowserSpeech(alertSpeech);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Simulation Trigger */}
      <div className="flex items-center justify-between pb-2 border-b border-rose-950/60">
        <div>
          <h2 className="text-base font-bold text-rose-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-400" />
            Messages & WhatsApp Hub
          </h2>
          <p className="text-xs text-rose-300/70">
            Wasu har message screen pe show karti hai aur perh ke sunati hai
          </p>
        </div>

        <button
          onClick={handleSimulateIncoming}
          className="px-3 py-1.5 text-xs font-semibold bg-rose-900/50 hover:bg-rose-800/70 border border-rose-500/40 text-rose-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
        >
          <BellRing className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          Test Incoming SMS
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-rose-950/80">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'all'
              ? 'bg-rose-900/80 text-rose-100 shadow-sm'
              : 'text-rose-300/70 hover:text-rose-100'
          }`}
        >
          All Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('WhatsApp')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'WhatsApp'
              ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/30'
              : 'text-rose-300/70 hover:text-rose-100'
          }`}
        >
          WhatsApp
        </button>
        <button
          onClick={() => setActiveTab('SMS')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'SMS'
              ? 'bg-blue-950/80 text-blue-200 border border-blue-500/30'
              : 'text-rose-300/70 hover:text-rose-100'
          }`}
        >
          SMS
        </button>
      </div>

      {/* Message List & Detailed Thread Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Messages List */}
        <div className="md:col-span-5 space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {filteredMessages.map((msg) => {
            const isSelected = msg.id === selectedMessageId;
            return (
              <div
                key={msg.id}
                onClick={() => setSelectedMessageId(msg.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-950/50 border-rose-500/60 shadow-md shadow-rose-950/50'
                    : 'bg-black/30 border-rose-950/50 hover:bg-rose-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full ${msg.avatarColor} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                    >
                      {msg.sender.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-rose-100 flex items-center gap-1.5">
                        {msg.sender}
                        {msg.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </h4>
                      <span className="text-[10px] text-rose-300/60">{msg.app}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-rose-300/60 tabular-nums shrink-0">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-xs text-rose-200/80 mt-2 line-clamp-2 leading-relaxed">
                  {msg.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Message Thread & Wasu Voice Controls */}
        <div className="md:col-span-7 bg-black/40 border border-rose-950/70 rounded-xl p-4 flex flex-col justify-between">
          {selectedMsg ? (
            <div className="space-y-4">
              {/* Message Header */}
              <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
                <div>
                  <h3 className="text-sm font-bold text-rose-100">{selectedMsg.sender}</h3>
                  <p className="text-xs text-rose-300/60">{selectedMsg.senderNumber}</p>
                </div>

                {/* Wasu Read Aloud Trigger */}
                <button
                  onClick={() => handleReadAloud(selectedMsg)}
                  disabled={isReading}
                  className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isReading ? 'Wasu Sunari Hai...' : 'Wasu, Perh Ke Sunao'}
                </button>
              </div>

              {/* Message Bubble */}
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/20 text-xs text-rose-100 leading-relaxed">
                  <p>{selectedMsg.text}</p>
                  <span className="text-[10px] text-rose-400 block mt-1 text-right">
                    {selectedMsg.timestamp}
                  </span>
                </div>

                {/* Wasu's Girlfriend Insight / Advice */}
                {selectedMsg.wasuComment && (
                  <div className="p-3 rounded-lg bg-pink-950/30 border border-pink-500/30 text-xs text-pink-200">
                    <span className="font-semibold text-rose-300 block mb-0.5">
                      ❤️ Wasu's Advice:
                    </span>
                    {selectedMsg.wasuComment}
                  </div>
                )}

                {/* Previous replies */}
                {selectedMsg.replies?.map((rep, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-rose-900/40 border border-rose-400/30 text-xs text-rose-100 ml-6 flex items-start justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-rose-300 block">
                        {rep.sender === 'wasu' ? 'WASU LOVE Reply:' : 'Aapka Reply:'}
                      </span>
                      <p>{rep.text}</p>
                    </div>
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>

              {/* Quick AI Response Suggestions */}
              <div>
                <span className="text-[11px] font-medium text-rose-300/80 block mb-1.5">
                  Wasu Quick Replies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleQuickWasuReply('Jee main bas ponch raha hoon.')}
                    className="text-xs px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-200 hover:bg-rose-900/60 transition-colors"
                  >
                    "Main ponch raha hoon"
                  </button>
                  <button
                    onClick={() => handleQuickWasuReply('Abhi study kar raha hoon, baad mein call karta hoon.')}
                    className="text-xs px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-200 hover:bg-rose-900/60 transition-colors"
                  >
                    "Study kar raha hoon"
                  </button>
                  <button
                    onClick={() => handleQuickWasuReply('Jee theek hai, bohot shukriya!')}
                    className="text-xs px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-200 hover:bg-rose-900/60 transition-colors"
                  >
                    "Jee theek hai"
                  </button>
                </div>
              </div>

              {/* Custom Reply Form */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Wasu ke zariye reply likhein..."
                  className="flex-1 px-3 py-2 text-xs bg-black/60 border border-rose-950/80 rounded-lg text-rose-100 placeholder-rose-400/40 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </form>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-rose-300/50">
              Koi message select karein
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
