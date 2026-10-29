import React, { useState } from 'react';
import { CallRecord, ActiveIncomingCall } from '../types';
import { Phone, PhoneCall, PhoneIncoming, PhoneOff, PhoneOutgoing, UserCheck, Play, Sparkles } from 'lucide-react';
import { playGeminiOrBrowserSpeech, playCyberChime } from '../services/speechService';

interface CallsControllerProps {
  calls: CallRecord[];
  activeCall: ActiveIncomingCall | null;
  onAttendCall: () => void;
  onRejectCall: () => void;
  onWasuAnswerCall: () => void;
  onTriggerSimulatedCall: (callerName?: string) => void;
  onWasuSpeak: (text: string) => void;
}

export const CallsController: React.FC<CallsControllerProps> = ({
  calls,
  activeCall,
  onAttendCall,
  onRejectCall,
  onWasuAnswerCall,
  onTriggerSimulatedCall,
  onWasuSpeak,
}) => {
  const [dialNumber, setDialNumber] = useState('');
  const [activeCallStatus, setActiveCallStatus] = useState<string | null>(null);

  const handleManualAttend = () => {
    setActiveCallStatus('Call Connected. Speaking...');
    onAttendCall();
    playCyberChime('success');
  };

  const handleManualReject = () => {
    setActiveCallStatus('Call Rejected.');
    onRejectCall();
    playCyberChime('alert');
    const speech = 'Jaan, maine aapke kehne pe call disconnect kardi hai!';
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
  };

  const handleWasuAutoAnswer = () => {
    onWasuAnswerCall();
    playCyberChime('success');
  };

  const handleDial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialNumber) return;

    const speech = `Jaan, ${dialNumber} pe call milai ja rahi hai...`;
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
    setDialNumber('');
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-rose-950/60">
        <div>
          <h2 className="text-base font-bold text-rose-100 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-rose-400" />
            Phone & Calls Control Deck
          </h2>
          <p className="text-xs text-rose-300/70">
            Aapke kehne pe call attend ya reject kare, aur khud bhi baat kare
          </p>
        </div>

        <button
          onClick={() => onTriggerSimulatedCall()}
          className="px-3 py-1.5 text-xs font-semibold bg-rose-900/60 hover:bg-rose-800/80 border border-rose-500/40 text-rose-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
        >
          <PhoneIncoming className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          Test Incoming Call
        </button>
      </div>

      {/* Active Incoming Call Modal / Hero Box */}
      {activeCall ? (
        <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/80 via-black to-slate-950 border-2 border-rose-500/60 shadow-xl shadow-rose-950/80 text-center animate-pulse space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center">
            <PhoneIncoming className="w-8 h-8 text-rose-400 animate-bounce" />
          </div>

          <div>
            <span className="text-[11px] font-semibold tracking-wider text-rose-300 uppercase">
              Incoming Phone Call
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{activeCall.name}</h3>
            <p className="text-xs text-rose-200/80 mt-0.5">{activeCall.number} ({activeCall.relation})</p>
          </div>

          {/* Action Buttons for Active Call */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 max-w-md mx-auto">
            {/* Attend Call */}
            <button
              onClick={handleManualAttend}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              Attend Karo
            </button>

            {/* Wasu Answer on user's behalf */}
            <button
              onClick={handleWasuAutoAnswer}
              className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50 active:scale-95 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              Wasu Khud Baat Kare
            </button>

            {/* Reject / Cut Call */}
            <button
              onClick={handleManualReject}
              className="py-2.5 px-3 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50 active:scale-95 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              Call Kat Do
            </button>
          </div>

          <p className="text-[11px] text-rose-300/80 italic">
            Tip: Aap bol bhi sakte hain: "Wasu, call attend karo" ya "Wasu, call reject kardo!"
          </p>
        </div>
      ) : (
        /* Standby Quick Call Trigger & Dialer */
        <div className="p-4 rounded-xl bg-black/40 border border-rose-950/70 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <h4 className="text-xs font-bold text-rose-200 mb-2">Simulate Specific Callers:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onTriggerSimulatedCall('Ammi Jaan')}
                className="px-3 py-1.5 text-xs bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <PhoneIncoming className="w-3 h-3 text-emerald-400" />
                Ammi Calling
              </button>
              <button
                onClick={() => onTriggerSimulatedCall('Professor Ali')}
                className="px-3 py-1.5 text-xs bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <PhoneIncoming className="w-3 h-3 text-indigo-400" />
                Professor Ali
              </button>
              <button
                onClick={() => onTriggerSimulatedCall('Daniyal Friend')}
                className="px-3 py-1.5 text-xs bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <PhoneIncoming className="w-3 h-3 text-cyan-400" />
                Daniyal Calling
              </button>
            </div>
          </div>

          {/* Direct Outgoing Dialer */}
          <form onSubmit={handleDial} className="flex gap-2">
            <input
              type="tel"
              value={dialNumber}
              onChange={(e) => setDialNumber(e.target.value)}
              placeholder="Number dial karein (e.g. 0300...)"
              className="flex-1 px-3 py-2 text-xs bg-black/60 border border-rose-950/80 rounded-lg text-rose-100 placeholder-rose-400/40 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!dialNumber}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <PhoneOutgoing className="w-3.5 h-3.5" />
              Call Milao
            </button>
          </form>
        </div>
      )}

      {/* Call History / Logs */}
      <div>
        <h3 className="text-xs font-bold text-rose-200 mb-2">Recent Call Logs:</h3>
        <div className="space-y-2">
          {calls.map((call) => (
            <div
              key={call.id}
              className="p-3 rounded-xl bg-black/30 border border-rose-950/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    call.type === 'incoming'
                      ? 'bg-emerald-950 text-emerald-400'
                      : call.type === 'outgoing'
                      ? 'bg-blue-950 text-blue-400'
                      : 'bg-red-950 text-red-400'
                  }`}
                >
                  {call.type === 'incoming' ? (
                    <PhoneIncoming className="w-4 h-4" />
                  ) : call.type === 'outgoing' ? (
                    <PhoneOutgoing className="w-4 h-4" />
                  ) : (
                    <PhoneOff className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-rose-100 flex items-center gap-1.5">
                    {call.name}
                    {call.handledByWasu && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-500/40 text-purple-200">
                        Wasu Attended
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-rose-300/60">{call.number} · {call.time}</p>
                  {call.wasuNotes && (
                    <p className="text-[10px] text-pink-300 mt-0.5">
                      ❤️ Note: {call.wasuNotes}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-xs text-rose-300/70 tabular-nums">
                {call.duration || '0s'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
