import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Volume2, CheckCircle2, Send, X, Shield, Bookmark, Sparkles, Mic } from 'lucide-react';
import { MessageItem, ActiveIncomingCall, SavedVoiceNote } from '../types';

interface DynamicActiveNotificationProps {
  activeMessage: MessageItem | null;
  activeCall: ActiveIncomingCall | null;
  latestVoiceNote: SavedVoiceNote | null;
  onReadoutMessage: (msg: MessageItem) => void;
  onReplyMessage: (msgId: string, replyText: string) => void;
  onDismissMessage: () => void;
  onAttendCall: () => void;
  onRejectCall: () => void;
  onWasuAnswerCall: () => void;
  onDismissVoiceNote: () => void;
}

export const DynamicActiveNotification: React.FC<DynamicActiveNotificationProps> = ({
  activeMessage,
  activeCall,
  latestVoiceNote,
  onReadoutMessage,
  onReplyMessage,
  onDismissMessage,
  onAttendCall,
  onRejectCall,
  onWasuAnswerCall,
  onDismissVoiceNote,
}) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage || !replyText.trim()) return;
    onReplyMessage(activeMessage.id, replyText.trim());
    setReplyText('');
    setShowReplyInput(false);
  };

  // 1. Dynamic Incoming Call Alert (Top Priority)
  if (activeCall) {
    return (
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-950/90 via-black to-slate-950 border-2 border-rose-500 p-5 shadow-[0_0_35px_rgba(244,63,94,0.4)] backdrop-blur-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-rose-900/60">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-rose-300 uppercase flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              INCOMING CALL NOTIFICATION // REAL-TIME
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300">
            {activeCall.relation}
          </span>
        </div>

        <div className="py-4 text-center space-y-1">
          <div className="text-xl font-bold text-white font-mono">{activeCall.name}</div>
          <div className="text-xs font-mono text-rose-300/80">{activeCall.number}</div>
          <p className="text-xs text-rose-200 mt-2 font-sans italic">
            "Jaan, call attend karni hai ya main baat karoon?"
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={onAttendCall}
            className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            Attend
          </button>
          <button
            onClick={onWasuAnswerCall}
            className="py-2.5 px-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            Wasu Boly
          </button>
          <button
            onClick={onRejectCall}
            className="py-2.5 px-3 rounded-2xl bg-rose-900 hover:bg-rose-800 text-rose-200 font-mono font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            Kat Do
          </button>
        </div>
      </div>
    );
  }

  // 2. Dynamic Ephemeral Message (Shown until Readout or Replied to)
  if (activeMessage) {
    return (
      <div className="relative rounded-3xl bg-gradient-to-br from-cyan-950/80 via-black to-slate-950 border-2 border-cyan-400/80 p-5 shadow-[0_0_30px_rgba(0,240,255,0.3)] backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200 space-y-3">
        {/* Header with dismiss button */}
        <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              NEW NOTIFICATION // {activeMessage.app}
            </span>
          </div>

          <button
            onClick={onDismissMessage}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Khatam karein / Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sender & Text */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white font-mono">{activeMessage.sender}</span>
            <span className="text-[10px] font-mono text-cyan-400/70">{activeMessage.timestamp}</span>
          </div>
          <p className="text-sm text-cyan-100 font-sans leading-relaxed bg-black/60 p-3 rounded-2xl border border-cyan-950">
            "{activeMessage.text}"
          </p>
        </div>

        {/* Action Controls: Readout, Reply, Done */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => onReadoutMessage(activeMessage)}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Perh Ke Sunao
          </button>

          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex-1 min-w-[100px] py-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            Jawab Do
          </button>

          <button
            onClick={onDismissMessage}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Readout Done
          </button>
        </div>

        {/* Expandable Reply Input Box */}
        {showReplyInput && (
          <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-cyan-950/80 animate-in fade-in duration-150">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Jawab likhein ya bol ke batayein..."
              className="flex-1 px-3 py-2 text-xs font-mono bg-black/90 border border-cyan-500/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs disabled:opacity-40 transition-all"
            >
              Send
            </button>
          </form>
        )}
      </div>
    );
  }

  // 3. Dynamic Saved Voice Note Toast
  if (latestVoiceNote) {
    return (
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/80 via-black to-slate-950 border border-emerald-500/60 p-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-xl animate-in slide-in-from-top-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                VOICE NOTE SAVED IN MEMORY VAULT
              </span>
              <span className="text-[9px] font-mono text-slate-500">{latestVoiceNote.timestamp}</span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5 font-sans leading-relaxed">
              "{latestVoiceNote.text}"
            </p>
          </div>
        </div>

        <button
          onClick={onDismissVoiceNote}
          className="text-slate-500 hover:text-white p-1 rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Nothing active -> Interface remains ultra-clean!
  return null;
};
